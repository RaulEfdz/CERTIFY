
import { useState } from 'react';
import { CertificateSize, SignatureData, INITIAL_CONFIG } from '../types';

export const useTemplateState = (initialState = INITIAL_CONFIG) => {
    const [certificateSize, setCertificateSize] = useState<CertificateSize>(initialState.certificateSize);
    const [logoUrl, setLogoUrl] = useState<string>(initialState.logoUrl);
    const [logoWidth, setLogoWidth] = useState<number>(initialState.logoWidth);
    const [logoHeight, setLogoHeight] = useState<number>(initialState.logoHeight);
    const [backgroundUrl, setBackgroundUrl] = useState<string | null>(initialState.backgroundUrl);
    const [overlayColor, setOverlayColor] = useState<string>(initialState.overlayColor);
    const [title, setTitle] = useState<string>(initialState.title);
    const [body1, setBody1] = useState<string>(initialState.body1);
    const [body2, setBody2] = useState<string>(initialState.body2);
    const [courseName, setCourseName] = useState<string>(initialState.courseName);
    const [signatures, setSignatures] = useState<SignatureData[]>(initialState.signatures);
    const [customCss, setCustomCss] = useState<string>(initialState.customCss);
    const [customJs, setCustomJs] = useState<string>(initialState.customJs);

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
        signatures, setSignatures,
        customCss, setCustomCss,
        customJs, setCustomJs,
    };
};
