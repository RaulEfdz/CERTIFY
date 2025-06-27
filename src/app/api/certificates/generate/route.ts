import { NextRequest, NextResponse } from 'next/server';
import { ImageResponse } from '@vercel/og';
import CertificateTemplate from '@/components/certificate/template';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { studentName, courseName, date } = body;

    if (!studentName || !courseName || !date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const imageResponse = new ImageResponse(
      (
        <CertificateTemplate 
          studentName={studentName} 
          courseName={courseName} 
          date={date} 
        />
      ),
      {
        width: 1200,
        height: 630,
      }
    );

    const imageBuffer = await imageResponse.arrayBuffer();

    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'certificates',
          resource_type: 'image',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(Buffer.from(imageBuffer));
    });

    // @ts-ignore
    if (!uploadResult || !uploadResult.secure_url) {
      return NextResponse.json({ error: 'Failed to upload image to Cloudinary' }, { status: 500 });
    }
    // @ts-ignore
    return NextResponse.json({ certificateUrl: uploadResult.secure_url });

  } catch (error) {
    console.error('Error generating certificate:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
