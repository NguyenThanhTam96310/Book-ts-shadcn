"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Camera } from "lucide-react";
import axios from "axios";
import { updateUserAvatar } from "@/features/profile/services/profile.service";
import { toast } from "react-toastify";
import { USER_ID } from "@/constants/cartConstants";

const AvatarEditTrigger = ({ userId }: { userId: string }) => {
    const [open, setOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const handleOpenFilePicker = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
            if (!open) {
                setOpen(true);
            }
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        setSelectedFile(file);

        if (file) {
            setPreviewUrl(URL.createObjectURL(file));
        } else {
            setPreviewUrl(null);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            toast.error("Vui lòng chọn một file ảnh!");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            await updateUserAvatar(userId, selectedFile); // Sử dụng userId từ props
            toast.success("Cập nhật ảnh đại diện thành công!");
            setPreviewUrl(null);
            setSelectedFile(null);
            setOpen(false);
            window.location.reload();
        } catch (error) {
            console.error("Lỗi khi cập nhật ảnh:", error);
            toast.error("Có lỗi xảy ra khi cập nhật ảnh đại diện.");
        }
    };

    const handleDialogClose = (isOpen: boolean) => {
        if (!isOpen) {
            setSelectedFile(null);
            setPreviewUrl(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
        setOpen(isOpen);
    };

    return (
        <>
            <Button
                variant="outline"
                size="icon"
                onClick={handleOpenFilePicker}
                className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full border-2 border-white hover:bg-gray-400 border-gray-200 transition-all duration-300 shadow-sm cursor-pointer"
            >
                <Camera className="w-5 h-5 text-gray-600 hover:text-blue-600" />
            </Button>

            <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="hidden"
            />

            <Dialog open={open} onOpenChange={handleDialogClose}>
                <DialogContent className="sm:max-w-[500px] sm:min-h-[500px] rounded-xl shadow-lg p-4">
                    <DialogHeader>
                        <DialogTitle>Cập nhật ảnh đại diện</DialogTitle>
                    </DialogHeader>

                    <div className="p-4 flex flex-col items-center gap-4">
                        {previewUrl && (
                            <div className="w-70 h-70 relative mb-10">
                                <img
                                    src={previewUrl}
                                    alt="Preview ảnh đại diện"
                                    className="w-full h-full object-cover rounded-full border shadow"
                                />
                            </div>
                        )}
                        <div className="absolute bottom-4 left-4 right-4">
                            <Button
                                onClick={handleUpload}
                                className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Cập nhật
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default AvatarEditTrigger;