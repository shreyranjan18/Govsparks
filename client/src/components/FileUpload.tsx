import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, File, X, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import api from '@/services/api';

interface FileUploadProps {
    ideaId: string;
    fileType?: 'pitch_deck' | 'proposal' | 'feedback' | 'other';
    isPrivate?: boolean;
    onUploadComplete?: () => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({
    ideaId,
    fileType = 'other',
    isPrivate = false,
    onUploadComplete
}) => {
    const [uploading, setUploading] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('ideaId', ideaId);
        formData.append('fileType', fileType);
        formData.append('isPrivate', isPrivate.toString());

        try {
            const response = await api.post('/documents/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setUploadedFiles(prev => [...prev, response.data]);
            toast.success('File uploaded successfully');
            onUploadComplete?.();
        } catch (error) {
            toast.error('Failed to upload file');
        } finally {
            setUploading(false);
        }
    }, [ideaId, fileType, isPrivate, onUploadComplete]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'application/msword': ['.doc'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
            'application/vnd.ms-powerpoint': ['.ppt'],
            'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx']
        },
        maxFiles: 1,
        maxSize: 10 * 1024 * 1024 // 10MB
    });

    const removeFile = (index: number) => {
        setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-4">
            <Card
                {...getRootProps()}
                className={`p-8 border-2 border-dashed cursor-pointer transition-all ${isDragActive
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center text-center">
                    {uploading ? (
                        <>
                            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                            <p className="text-sm text-muted-foreground">Uploading...</p>
                        </>
                    ) : (
                        <>
                            <Upload className="w-12 h-12 text-muted-foreground mb-4" />
                            <p className="text-sm font-medium mb-1">
                                {isDragActive ? 'Drop file here' : 'Click or drag file to upload'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                PDF, DOC, DOCX, PPT, PPTX (Max 10MB)
                            </p>
                        </>
                    )}
                </div>
            </Card>

            <AnimatePresence>
                {uploadedFiles.map((file, index) => (
                    <motion.div
                        key={file._id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <Card className="p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <File className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">{file.fileName}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {(file.fileSize / 1024).toFixed(2)} KB
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeFile(index)}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};
