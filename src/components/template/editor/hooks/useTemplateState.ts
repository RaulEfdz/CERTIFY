
import { useState } from 'react';
import { CertificateSize, SignatureData, INITIAL_CONFIG, TemplateConfig } from '../types';

export const useTemplateState = (initialState = INITIAL_CONFIG) => {
    const [certificateSize, setCertificateSize] = useState<CertificateSize>(initialState.certificateSize);
    const [logoUrl, setLogoUrl] = useState<string | null>(initialState.logoUrl);
    const [logoWidth, setLogoWidth] = useState<number>(initialState.logoWidth);
    const [logoHeight, setLogoHeight] = useState<number>(initialState.logoHeight);
    const [backgroundUrl, setBackgroundUrl] = useState<string | null>(initialState.backgroundUrl);
    const [overlayColor, setOverlayColor] = useState<string>(initialState.overlayColor);
    const [title, setTitle] = useState<string>(initialState.title);
    const [body1, setBody1] = useState<string>(initialState.body1);
    const [body2, setBody2] = useState<string>(initialState.body2);
    const [courseName, setCourseName] = useState<string>(initialState.courseName);
    const [studentName, setStudentName] = useState<string>(initialState.studentName);
    const [signatures, setSignatures] = useState<SignatureData[]>(initialState.signatures);
    const [customCss, setCustomCss] = useState<string>(initialState.customCss);
    const [customJs, setCustomJs] = useState<string>(initialState.customJs);
    const [titleColor, setTitleColor] = useState<string>(initialState.titleColor);
    const [bodyColor, setBodyColor] = useState<string>(initialState.bodyColor);
    const [orientation, setOrientation] = useState<string>(initialState.orientation || "landscape");

    return {
        certificateSize, setCertificateSize,
        logoUrl, setLogoUrl,
        logoWidth, setLogoWidth,
        logoHeight, setLogoHeight,
        backgroundUrl, setBackgroundUrl,
        overlayColor, setOverlayColor,
        title, setTitle,
        body1, setBody1,
        body2, setBody2,
        courseName, setCourseName,
        studentName, setStudentName,
        signatures, setSignatures,
        customCss, setCustomCss,
        customJs, setCustomJs,
        titleColor, setTitleColor,
        bodyColor, setBodyColor,
        orientation, setOrientation,
    };
};
