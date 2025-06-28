
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings2 } from "lucide-react";
import { SizeToggle } from "./SizeToggle";
import { CertificateSize } from "../../types";
import { LogoSettings } from "./sidebar/LogoSettings";
import { ContentSettings } from "./sidebar/ContentSettings";
import { BackgroundSettings } from "./sidebar/BackgroundSettings";

export const TemplateSidebar = ({ state, setters }) => (
    <div className="w-96 border-r overflow-y-auto bg-card">
        <div className="p-4 space-y-6">
            <Card>
                <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-base font-medium flex items-center">
                        <Settings2 className="h-4 w-4 mr-2" />
                        Tamaño del Certificado
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                    <SizeToggle 
                        value={state.certificateSize} 
                        onChange={setters.setCertificateSize} 
                    />
                </CardContent>
            </Card>

            <LogoSettings state={state} setters={setters} />
            <ContentSettings state={state} setters={setters} />
            <BackgroundSettings state={state} setters={setters} />
        </div>
    </div>
);
