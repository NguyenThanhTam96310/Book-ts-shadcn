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
import { submitReview } from "@/features/review/services/review.service";

type AddReviewFormProps = {
    orderItemId: number;
    productName: string;
    productImage?: string; // URL ảnh sản phẩm hoặc tên file ảnh
    open: boolean;
    onClose: () => void;
    onSubmit?: (data: InputReviewBodyType, files: File[]) => Promise<void>;
};

export function AddReviewForm({
    orderItemId,
    productName,
    productImage,
    open,
    onClose,
    // onSubmit,
}: AddReviewFormProps) {
    const [selectedImages, setSelectedImages] = React.useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const form = useForm<InputReviewBodyType>({
        resolver: zodResolver(InputReviewBody),
        defaultValues: {
            orderItemId,
            reviewId: undefined,
            fullName: "",
            avatar: "string",
            images: [],
            star: 5,
            comment: ""
        },
    });
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

    const removeImage = (index: number) => {
        const newImages = selectedImages.filter((_, i) => i !== index);
        setSelectedImages(newImages);

        const currentImages = form.getValues("images") ?? [];
        const updatedImages = currentImages.filter((_, i) => i !== index);
        form.setValue("images", updatedImages);
    };

    const onSubmit = async (values: InputReviewBodyType) => {
        console.log(values)
        setIsSubmitting(true);
        try {
            const result = await submitReview(values, selectedImages);
            toast.success("Đánh giá đã được gửi thành công!", { position: "top-right" });
            form.reset();
            setSelectedImages([]);
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

    return (
        <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
            <DialogContent className="sm:max-w-[80%] max-h-[100vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-between">
                        <span>Viết đánh giá sản phẩm</span>
                    </DialogTitle>
                </DialogHeader>
                <div className="flex items-center gap-4 p-2 bg-gray-50 rounded-lg m2-4">
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
                                            {selectedImages.length > 0 && (
                                                <div className="grid grid-cols-3 gap-3">
                                                    {selectedImages.map((file, index) => (
                                                        <div key={index} className="relative">
                                                            <img
                                                                src={URL.createObjectURL(file)}
                                                                alt={`Preview ${index + 1}`}
                                                                className="w-full h-24 object-cover rounded-lg border"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => removeImage(index)}
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
                                onClick={() => {
                                    form.reset();
                                    setSelectedImages([]);
                                    onClose();
                                }}
                            >
                                Hủy
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-orange-500 text-white hover:bg-orange-600"
                            >
                                {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
