import * as React from "react";
import { NextRequest, NextResponse } from 'next/server';
import { ImageResponse } from '@vercel/og';
import CertificateTemplate from '@/components/certificate/template';
// Subida a Cloudinary por REST API, no SDK, para Edge compatibility.

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { studentName, courseName, date } = body;

    if (!studentName || !courseName || !date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Renderiza el componente JSX directamente para ImageResponse
    const imageResponse = new ImageResponse(
      <CertificateTemplate 
        studentName={studentName} 
        courseName={courseName} 
        date={date} 
      />, {
        width: 1200,
        height: 630,
      }
    );

    const imageBuffer = await imageResponse.arrayBuffer();

    // Subida directa a Cloudinary vía REST API
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET; // Debes tener un upload_preset configurado en Cloudinary
    if (!cloudName || !uploadPreset) {
      return NextResponse.json({ error: 'Cloudinary config missing' }, { status: 500 });
    }

    const formData = new FormData();
    formData.append('file', new Blob([imageBuffer], { type: 'image/png' }), 'certificate.png');
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', 'certificates');

    const cloudinaryRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });
    const cloudinaryJson = await cloudinaryRes.json();
    if (!cloudinaryJson.secure_url) {
      return NextResponse.json({ error: 'Failed to upload image to Cloudinary', details: cloudinaryJson }, { status: 500 });
    }
    return NextResponse.json({ certificateUrl: cloudinaryJson.secure_url });

  } catch (error) {
    console.error('Error generating certificate:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
