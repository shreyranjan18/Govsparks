import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'demo',
    api_key: process.env.CLOUDINARY_API_KEY || 'demo',
    api_secret: process.env.CLOUDINARY_API_SECRET || 'demo'
});

// Configure storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        return {
            folder: 'govspark-documents',
            allowed_formats: ['pdf', 'doc', 'docx', 'ppt', 'pptx'],
            resource_type: 'raw',
            public_id: `${Date.now()}-${file.originalname}`
        };
    }
});

export const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});

export default cloudinary;
