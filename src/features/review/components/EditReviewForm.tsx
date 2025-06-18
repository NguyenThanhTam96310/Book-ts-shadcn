"use client";

import * as React from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { Star, Upload, X } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
    InputReviewBody,
    InputReviewBodyType,
} from "@/features/review/services/review.Schema";
import { editReview, fetchReviewById, fetchReviewByOrderItemId, submitReview } from "@/features/review/services/review.service";
import { useEffect, useState } from "react";
import { ReviewProps, ReviewRes } from "../services/type";

type AddReviewFormProps = {
    orderItemId: number;
    productName: string;
    productImage?: string; // URL ảnh sản phẩm hoặc tên file ảnh
    open: boolean;
    onClose: () => void;
    onSubmit?: (data: InputReviewBodyType, files: File[]) => Promise<void>;
};

export function EditReviewForm({
    orderItemId,
    productName,
    productImage,
    open,
    onClose,
    // onSubmit,
}: AddReviewFormProps) {
    const [selectedImages, setSelectedImages] = React.useState<File[]>([]);
    const [existingImages, setExistingImages] = React.useState<any[]>([]);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);

    const form = useForm<InputReviewBodyType>({
        resolver: zodResolver(InputReviewBody),
        defaultValues: {
            reviewId: undefined,
            orderItemId,
            fullName: "",
            avatar: "string",
            images: [],
            star: 5,
            comment: ""
        },
    });

    const [review, setReview] = useState<ReviewProps>()

    useEffect(() => {
        const loadReview = async () => {
            if (!open) return;

            setIsLoading(true);
            try {
                const data = await fetchReviewByOrderItemId(Number(orderItemId));
                setReview(data);

                // Populate form with existing data
                if (data) {
                    form.setValue("reviewId", data.reviewId || 0);
                    form.setValue("fullName", data.fullName || "");
                    form.setValue("comment", data.comment || "");
                    form.setValue("star", data.star || 5);
                    form.setValue(
                        "images",
                        (data.images || []).map((img: any) => ({
                            fileName: img.fileName || "", // hoặc img.name tùy dữ liệu thực tế
                            type: "IMAGE" as const,
                        }))
                    );

                    // Set existing images for display
                    setExistingImages(data.images || []);
                }
            } catch (error) {
                console.error("Lỗi khi load review:", error);
                toast.error("Không thể tải thông tin đánh giá", { position: "top-right" });
            } finally {
                setIsLoading(false);
            }
        }

        loadReview();
    }, [open, orderItemId, form]);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        setSelectedImages((prev) => [...prev, ...files]);

        const newImages = files.map((file, index) => ({
            fileId: Date.now() + index,
            fileName: file.name,
            type: "IMAGE" as const,
        }));

        const currentImages = form.getValues("images");
        form.setValue("images", [...(currentImages ?? []), ...newImages]);
    };

    const removeImage = (index: number, isExisting: boolean = false) => {
        if (isExisting) {
            // Remove from existing images
            const newExistingImages = existingImages.filter((_, i) => i !== index);
            setExistingImages(newExistingImages);

            // Update form images
            const currentImages = form.getValues("images") ?? [];
            const updatedImages = currentImages.filter((_, i) => i !== index);
            form.setValue("images", [...newExistingImages, ...selectedImages.map((file, idx) => ({
                fileId: Date.now() + idx,
                fileName: file.name,
                type: "IMAGE" as const,
            }))]);
        } else {
            // Remove from new selected images
            const adjustedIndex = index - existingImages.length;
            const newImages = selectedImages.filter((_, i) => i !== adjustedIndex);
            setSelectedImages(newImages);

            const updatedImages = [
                ...existingImages,
                ...newImages.map((file, idx) => ({
                    fileId: Date.now() + idx,
                    fileName: file.name,
                    type: "IMAGE" as const,
                }))
            ];
            form.setValue("images", updatedImages);
        }
    };

    const onSubmit = async (values: InputReviewBodyType) => {
        console.log(values);
        setIsSubmitting(true);
        try {
            // Here you would call your update review API
            const result = await editReview(values, selectedImages);
            toast.success("Đánh giá đã được cập nhật thành công!", { position: "top-right" });
            onClose();
        } catch (error: any) {
            toast.error(error?.message || "Đã có lỗi xảy ra", { position: "top-right" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStarRating = (currentRating: number) => (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => form.setValue("star", star)}
                    className="focus:outline-none"
                >
                    <Star
                        className={`w-6 h-6 ${star <= currentRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                    />
                </button>
            ))}
        </div>
    );

    const handleClose = () => {
        form.reset();
        setSelectedImages([]);
        setExistingImages([]);
        setReview(undefined);
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={(val) => !val && handleClose()}>
            <DialogContent className="sm:max-w-xl max-h-[100vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-between">
                        <span>Chỉnh sửa đánh giá sản phẩm</span>
                    </DialogTitle>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex justify-center py-8">
                        <div className="text-gray-500">Đang tải...</div>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center gap-4 p-2 bg-gray-50 rounded-lg mb-4">
                            <div className="w-15 h-15 rounded-lg overflow-hidden">
                                <Image
                                    src={
                                        productImage && process.env.NEXT_PUBLIC_FILE
                                            ? `${process.env.NEXT_PUBLIC_FILE}${productImage}`
                                            : "/placeholder-image.png"
                                    }
                                    alt={productName}
                                    width={80}
                                    height={80}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <h3 className="font-medium text-base">{productName}</h3>
                            </div>
                        </div>

                        <Form {...form}>
                            <FormField
                                control={form.control}
                                name="star"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="sr-only">Đánh giá sao *</FormLabel>
                                        <FormControl>
                                            <div className="flex items-center gap-2">
                                                {renderStarRating(field.value)}
                                                <span className="text-sm text-gray-600">({field.value}/5 sao)</span>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="fullName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="sr-only">Họ và tên *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Nhập họ và tên của bạn" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="comment"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="sr-only">Nội dung đánh giá *</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Chia sẻ trải nghiệm của bạn..." className="min-h-[100px]" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="images"
                                    render={() => (
                                        <FormItem>
                                            <FormLabel>Hình ảnh đánh giá</FormLabel>
                                            <FormControl>
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-2">
                                                        <Input
                                                            type="file"
                                                            accept="image/*"
                                                            multiple
                                                            onChange={handleImageUpload}
                                                            className="hidden"
                                                            id="image-upload"
                                                        />
                                                        <label
                                                            htmlFor="image-upload"
                                                            className="flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                                                        >
                                                            <Upload className="w-4 h-4" />
                                                            Chọn hình ảnh
                                                        </label>
                                                    </div>

                                                    {/* Display existing and new images */}
                                                    {(existingImages.length > 0 || selectedImages.length > 0) && (
                                                        <div className="grid grid-cols-3 gap-3">
                                                            {/* Existing images */}
                                                            {existingImages.map((image, index) => (
                                                                <div key={`existing-${index}`} className="relative">
                                                                    <img
                                                                        src={
                                                                            process.env.NEXT_PUBLIC_FILE
                                                                                ? `${process.env.NEXT_PUBLIC_FILE}${image.fileName}`
                                                                                : `/placeholder-image.png`
                                                                        }
                                                                        alt={`Existing ${index + 1}`}
                                                                        className="w-full h-24 object-cover rounded-lg border"
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removeImage(index, true)}
                                                                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
                                                                    >
                                                                        <X className="w-3 h-3" />
                                                                    </button>
                                                                </div>
                                                            ))}

                                                            {/* New selected images */}
                                                            {selectedImages.map((file, index) => (
                                                                <div key={`new-${index}`} className="relative">
                                                                    <img
                                                                        src={URL.createObjectURL(file)}
                                                                        alt={`New ${index + 1}`}
                                                                        className="w-full h-24 object-cover rounded-lg border"
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => removeImage(existingImages.length + index, false)}
                                                                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
                                                                    >
                                                                        <X className="w-3 h-3" />
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="flex justify-end gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleClose}
                                    >
                                        Hủy
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="bg-orange-500 text-white hover:bg-orange-600"
                                    >
                                        {isSubmitting ? "Đang cập nhật..." : "Cập nhật đánh giá"}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}