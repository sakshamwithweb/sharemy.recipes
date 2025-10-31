import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { NextResponse } from 'next/server';


const s3Client = new S3Client({
    region: process.env.S3_REGION,
    endpoint: process.env.S3_ENDPOINT,
    forcePathStyle:true,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_KEY,
    },
});

export async function POST(request) {
    try {
        const { fileName, fileType } = await request.json();
        const allowedTypes = ['video/mp4'];
        if (!allowedTypes.includes(fileType)) {
            return NextResponse.json({ message: 'File type not allowed' }, { status: 400 });
        }
        if (!fileName || fileName.length > 100) {
            return NextResponse.json({ message: 'Invalid file name' }, { status: 400 });
        }

        const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');

        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: `uploads/${Date.now()}-${sanitizedFileName}`,
            ContentType: fileType
        };

        const command = new PutObjectCommand(params);
        const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 60 });
        return NextResponse.json({ url: signedUrl });
    } catch (error) {
        // console.log(error.message)
        return NextResponse.json(
            { message: 'Server error', error: error.message },
            { status: 500 }
        );
    }
}