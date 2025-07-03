"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Copy, 
  Check, 
  Code2, 
  Book, 
  Zap, 
  Download,
  FileText,
  Settings,
  Globe,
  Key,
  AlertCircle,
  ExternalLink
} from "lucide-react";
import { toast } from "sonner";

interface CurlExample {
  title: string;
  description: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  endpoint: string;
  headers?: Record<string, string>;
  body?: object;
  filename?: string;
}

export function ApiDocumentation() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const curlExamples: CurlExample[] = [
    {
      title: "Crear Certificado",
      description: "Genera un nuevo certificado con los datos del estudiante",
      method: "POST",
      endpoint: "/api/certificates",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer YOUR_API_TOKEN"
      },
      body: {
        templateId: "template_123",
        studentName: "Juan Pérez",
        courseName: "Desarrollo Web Avanzado",
        completionDate: "2024-01-15",
        certificateData: {
          duration: "40 horas",
          instructorName: "María García",
          grade: "Excelente"
        }
      }
    },
    {
      title: "Obtener Certificado",
      description: "Recupera la información de un certificado específico",
      method: "GET",
      endpoint: "/api/certificates/cert_456",
      headers: {
        "Authorization": "Bearer YOUR_API_TOKEN"
      }
    },
    {
      title: "Listar Certificados",
      description: "Obtiene una lista paginada de certificados con filtros",
      method: "GET",
      endpoint: "/api/certificates?page=1&limit=10&status=generated",
      headers: {
        "Authorization": "Bearer YOUR_API_TOKEN"
      }
    },
    {
      title: "Descargar Certificado PDF",
      description: "Descarga el certificado en formato PDF",
      method: "GET",
      endpoint: "/api/certificates/cert_456/download?format=pdf",
      headers: {
        "Authorization": "Bearer YOUR_API_TOKEN"
      },
      filename: "certificado_juan_perez.pdf"
    },
    {
      title: "Listar Plantillas",
      description: "Obtiene las plantillas disponibles",
      method: "GET",
      endpoint: "/api/templates",
      headers: {
        "Authorization": "Bearer YOUR_API_TOKEN"
      }
    },
    {
      title: "Crear Plantilla",
      description: "Crea una nueva plantilla de certificado",
      method: "POST",
      endpoint: "/api/templates",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer YOUR_API_TOKEN"
      },
      body: {
        name: "Certificado de Participación",
        description: "Plantilla para certificados de participación",
        category: "Participación",
        config: {
          certificateSize: "landscape",
          title: "Certificado de Participación",
          backgroundColor: "#ffffff",
          titleColor: "#1e40af"
        }
      }
    }
  ];

  const generateCurlCommand = (example: CurlExample): string => {
    const baseUrl = "https://your-domain.com";
    let curl = `curl -X ${example.method} "${baseUrl}${example.endpoint}"`;
    
    // Add headers
    if (example.headers) {
      Object.entries(example.headers).forEach(([key, value]) => {
        curl += ` \\\n  -H "${key}: ${value}"`;
      });
    }
    
    // Add body for POST/PUT requests
    if (example.body) {
      curl += ` \\\n  -d '${JSON.stringify(example.body, null, 2)}'`;
    }
    
    // Add output file for downloads
    if (example.filename) {
      curl += ` \\\n  -o "${example.filename}"`;
    }
    
    return curl;
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(id);
      toast.success("Código copiado al portapapeles");
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (error) {
      toast.error("Error al copiar al portapapeles");
    }
  };

  const statusCodes = [
    { code: 200, description: "Operación exitosa", color: "bg-green-100 text-green-800" },
    { code: 201, description: "Recurso creado exitosamente", color: "bg-green-100 text-green-800" },
    { code: 400, description: "Solicitud incorrecta", color: "bg-red-100 text-red-800" },
    { code: 401, description: "No autorizado", color: "bg-red-100 text-red-800" },
    { code: 404, description: "Recurso no encontrado", color: "bg-red-100 text-red-800" },
    { code: 429, description: "Muchas peticiones", color: "bg-yellow-100 text-yellow-800" },
    { code: 500, description: "Error interno del servidor", color: "bg-red-100 text-red-800" }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
            <Code2 className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              CERTIFY API
            </h1>
            <p className="text-slate-600">Documentación y ejemplos de integración</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-4">
          <Badge variant="secondary" className="gap-2">
            <Globe className="h-3 w-3" />
            REST API v1.2.0
          </Badge>
          <Badge variant="outline" className="gap-2">
            <Key className="h-3 w-3" />
            Bearer Token Auth
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="quickstart" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="quickstart" className="gap-2">
            <Zap className="h-4 w-4" />
            Inicio Rápido
          </TabsTrigger>
          <TabsTrigger value="endpoints" className="gap-2">
            <Code2 className="h-4 w-4" />
            Endpoints
          </TabsTrigger>
          <TabsTrigger value="examples" className="gap-2">
            <FileText className="h-4 w-4" />
            Ejemplos
          </TabsTrigger>
          <TabsTrigger value="reference" className="gap-2">
            <Book className="h-4 w-4" />
            Referencia
          </TabsTrigger>
        </TabsList>

        {/* Quick Start Tab */}
        <TabsContent value="quickstart" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-600" />
                Configuración Inicial
              </CardTitle>
              <CardDescription>
                Configuración básica para comenzar a usar la API de CERTIFY
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Key className="h-4 w-4" />
                <AlertDescription>
                  <strong>Base URL:</strong> https://your-domain.com/api
                  <br />
                  <strong>Autenticación:</strong> Bearer Token en header Authorization
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <h4 className="font-semibold">1. Obtén tu API Token</h4>
                <p className="text-sm text-slate-600">
                  Ve a tu panel de control → Configuración → API Keys y genera un nuevo token.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold">2. Primer Request</h4>
                <div className="relative">
                  <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
                    <code>{`curl -X GET https://your-domain.com/api/templates \\
  -H "Authorization: Bearer YOUR_API_TOKEN"`}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute top-2 right-2 text-slate-400 hover:text-slate-100"
                    onClick={() => copyToClipboard(
                      `curl -X GET https://your-domain.com/api/templates \\\n  -H "Authorization: Bearer YOUR_API_TOKEN"`,
                      "quickstart"
                    )}
                  >
                    {copiedCode === "quickstart" ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Endpoints Tab */}
        <TabsContent value="endpoints" className="space-y-6">
          <div className="grid gap-6">
            {curlExamples.map((example, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        <Badge variant={example.method === "GET" ? "secondary" : "default"}>
                          {example.method}
                        </Badge>
                        {example.title}
                      </CardTitle>
                      <CardDescription>{example.description}</CardDescription>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(generateCurlCommand(example), `curl-${index}`)}
                      className="gap-2"
                    >
                      {copiedCode === `curl-${index}` ? (
                        <>
                          <Check className="h-4 w-4" />
                          Copiado
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          Copiar cURL
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h5 className="font-medium text-sm mb-2">Endpoint:</h5>
                      <code className="bg-slate-100 px-2 py-1 rounded text-sm">
                        {example.method} {example.endpoint}
                      </code>
                    </div>
                    
                    <div className="relative">
                      <h5 className="font-medium text-sm mb-2">Comando cURL:</h5>
                      <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
                        <code>{generateCurlCommand(example)}</code>
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Examples Tab */}
        <TabsContent value="examples" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-600" />
                Ejemplos de Integración
              </CardTitle>
              <CardDescription>
                Código de ejemplo en diferentes lenguajes de programación
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="javascript" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                  <TabsTrigger value="python">Python</TabsTrigger>
                  <TabsTrigger value="php">PHP</TabsTrigger>
                </TabsList>
                
                <TabsContent value="javascript" className="space-y-3">
                  <div className="relative">
                    <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
                      <code>{`const axios = require('axios');

const API_BASE = 'https://your-domain.com/api';
const API_TOKEN = 'YOUR_API_TOKEN';

// Crear certificado
async function createCertificate(data) {
  try {
    const response = await axios.post(\`\${API_BASE}/certificates\`, data, {
      headers: {
        'Authorization': \`Bearer \${API_TOKEN}\`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error:', error.response.data);
    throw error;
  }
}

// Uso
createCertificate({
  templateId: 'template_123',
  studentName: 'Juan Pérez',
  courseName: 'Desarrollo Web'
});`}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2 text-slate-400 hover:text-slate-100"
                      onClick={() => copyToClipboard(
                        `const axios = require('axios');\n\nconst API_BASE = 'https://your-domain.com/api';\nconst API_TOKEN = 'YOUR_API_TOKEN';\n\n// Crear certificado\nasync function createCertificate(data) {\n  try {\n    const response = await axios.post(\`\${API_BASE}/certificates\`, data, {\n      headers: {\n        'Authorization': \`Bearer \${API_TOKEN}\`,\n        'Content-Type': 'application/json'\n      }\n    });\n    return response.data;\n  } catch (error) {\n    console.error('Error:', error.response.data);\n    throw error;\n  }\n}\n\n// Uso\ncreateCertificate({\n  templateId: 'template_123',\n  studentName: 'Juan Pérez',\n  courseName: 'Desarrollo Web'\n});`,
                        "js-example"
                      )}
                    >
                      {copiedCode === "js-example" ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="python" className="space-y-3">
                  <div className="relative">
                    <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
                      <code>{`import requests
import json

API_BASE = 'https://your-domain.com/api'
API_TOKEN = 'YOUR_API_TOKEN'

headers = {
    'Authorization': f'Bearer {API_TOKEN}',
    'Content-Type': 'application/json'
}

# Crear certificado
def create_certificate(data):
    response = requests.post(f'{API_BASE}/certificates', 
                           json=data, 
                           headers=headers)
    return response.json()

# Uso
certificate_data = {
    'templateId': 'template_123',
    'studentName': 'Juan Pérez',
    'courseName': 'Desarrollo Web'
}

result = create_certificate(certificate_data)
print(result)`}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2 text-slate-400 hover:text-slate-100"
                      onClick={() => copyToClipboard(
                        `import requests\nimport json\n\nAPI_BASE = 'https://your-domain.com/api'\nAPI_TOKEN = 'YOUR_API_TOKEN'\n\nheaders = {\n    'Authorization': f'Bearer {API_TOKEN}',\n    'Content-Type': 'application/json'\n}\n\n# Crear certificado\ndef create_certificate(data):\n    response = requests.post(f'{API_BASE}/certificates', \n                           json=data, \n                           headers=headers)\n    return response.json()\n\n# Uso\ncertificate_data = {\n    'templateId': 'template_123',\n    'studentName': 'Juan Pérez',\n    'courseName': 'Desarrollo Web'\n}\n\nresult = create_certificate(certificate_data)\nprint(result)`,
                        "py-example"
                      )}
                    >
                      {copiedCode === "py-example" ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="php" className="space-y-3">
                  <div className="relative">
                    <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
                      <code>{`<?php
$apiBase = 'https://your-domain.com/api';
$apiToken = 'YOUR_API_TOKEN';

function createCertificate($data) {
    global $apiBase, $apiToken;
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $apiBase . '/certificates');
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $apiToken,
        'Content-Type: application/json'
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $response = curl_exec($ch);
    curl_close($ch);
    
    return json_decode($response, true);
}

// Uso
$certificateData = [
    'templateId' => 'template_123',
    'studentName' => 'Juan Pérez',
    'courseName' => 'Desarrollo Web'
];

$result = createCertificate($certificateData);
print_r($result);
?>`}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2 text-slate-400 hover:text-slate-100"
                      onClick={() => copyToClipboard(
                        `<?php\n$apiBase = 'https://your-domain.com/api';\n$apiToken = 'YOUR_API_TOKEN';\n\nfunction createCertificate($data) {\n    global $apiBase, $apiToken;\n    \n    $ch = curl_init();\n    curl_setopt($ch, CURLOPT_URL, $apiBase . '/certificates');\n    curl_setopt($ch, CURLOPT_POST, 1);\n    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));\n    curl_setopt($ch, CURLOPT_HTTPHEADER, [\n        'Authorization: Bearer ' . $apiToken,\n        'Content-Type: application/json'\n    ]);\n    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);\n    \n    $response = curl_exec($ch);\n    curl_close($ch);\n    \n    return json_decode($response, true);\n}\n\n// Uso\n$certificateData = [\n    'templateId' => 'template_123',\n    'studentName' => 'Juan Pérez',\n    'courseName' => 'Desarrollo Web'\n];\n\n$result = createCertificate($certificateData);\nprint_r($result);\n?>`,
                        "php-example"
                      )}
                    >
                      {copiedCode === "php-example" ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reference Tab */}
        <TabsContent value="reference" className="space-y-6">
          <div className="grid gap-6">
            {/* Status Codes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-orange-600" />
                  Códigos de Estado HTTP
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  {statusCodes.map((status) => (
                    <div key={status.code} className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                      <Badge className={status.color}>
                        {status.code}
                      </Badge>
                      <span className="text-sm">{status.description}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Rate Limiting */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  Rate Limiting
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Límite:</strong> 1000 peticiones por hora por API token
                    <br />
                    <strong>Headers de respuesta:</strong>
                    <ul className="mt-2 space-y-1">
                      <li>• <code>X-RateLimit-Limit</code>: Límite total</li>
                      <li>• <code>X-RateLimit-Remaining</code>: Peticiones restantes</li>
                      <li>• <code>X-RateLimit-Reset</code>: Tiempo de reset</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Links */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ExternalLink className="h-5 w-5 text-purple-600" />
                  Recursos Adicionales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <a 
                    href="/API_DOCUMENTATION.md" 
                    target="_blank"
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    Documentación completa (MD)
                  </a>
                  <a 
                    href="https://docs.certify.com" 
                    target="_blank"
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <Book className="h-4 w-4" />
                    Documentación oficial
                  </a>
                  <a 
                    href="https://github.com/certify/api" 
                    target="_blank"
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <Code2 className="h-4 w-4" />
                    SDKs oficiales
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}