const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
require('dotenv').config();

const s3 = new S3Client({
    region: process.env.REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    },
});

// Generate a unique name with a folder path based on the file type
const generateUniqueFileName = (file) => {
    if (!file || !file.type) {
        throw new Error('Invalid file object. Ensure "file" and "file.type" are provided.');
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-'); // e.g., 2025-01-07T10-52-27-123Z
    const extension = file.name?.substring(file.name.lastIndexOf('.')) || ''; // Safe handling
    let folder = '';

    // Determine folder based on file type
    if (file.type.startsWith('image/')) {
        folder = 'images';
    } else if (file.type.startsWith('video/')) {
        folder = 'courses';
    } else if (['.pdf', '.doc', '.docx'].includes(extension.toLowerCase())) {
        folder = 'resumes'; // Folder for resume files
    } else {
        folder = 'others'; // Default folder for other types
    }

    return `${folder}/upload-${timestamp}${extension}`; // e.g., resumes/upload-2025-01-07T10-52-27-123Z.pdf
};

const s3Upload = async (file) => {
    if (!file) {
        console.error('File is undefined or null.');
        throw new Error('No file provided for upload.');
    }

    try {
        // Generate a unique file name with folder path
        const uniqueFileName = generateUniqueFileName(file);

        // default extension handling for different MIME types
        const defaultExtensionMap = {
            'image/jpeg': '.jpg',
            'image/png': '.png',
            'application/pdf': '.pdf',
            'image/gif': '.gif',
            'video/mp4': '.mp4',
        };

        // If the file has no extension, try to use the MIME type to get it
        const extension = file.name
            ? file.name.substring(file.name.lastIndexOf('.'))
            : defaultExtensionMap[file.type] || '';

        // Use the unique file name and file extension to generate the full path in S3
        const path = `${uniqueFileName}${extension}`;

        // Upload the file to S3
        const params = {
            Bucket: process.env.S3_BUCKET, // Replace with your bucket name
            Key: path, // File path in S3
            Body: file, // File content
            ContentType: file.type, // MIME type
        };

        const command = new PutObjectCommand(params);

        const response = await s3.send(command);

        console.log('File uploaded successfully:', response);

        // Construct and return the file URL
        const fileUrl = `https://${process.env.S3_BUCKET}.s3.${process.env.REGION}.amazonaws.com/${path}`;
        return fileUrl;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
};

module.exports = s3Upload;
