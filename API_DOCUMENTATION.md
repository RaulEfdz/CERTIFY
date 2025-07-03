# 📋 CERTIFY API Documentation

## 🚀 Introducción

La API de CERTIFY permite generar, gestionar y exportar certificados de manera programática. Esta documentación proporciona ejemplos completos para integrar la funcionalidad de certificados en tus aplicaciones.

## 🔗 Base URL

```
https://your-domain.com/api
```

## 🔑 Autenticación

Todas las peticiones requieren autenticación mediante Bearer Token:

```bash
Authorization: Bearer YOUR_API_TOKEN
```

---

## 📜 Endpoints de Certificados

### 1. Crear Certificado

Genera un nuevo certificado con los datos proporcionados.

**Endpoint:** `POST /certificates`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_API_TOKEN
```

**Body:**
```json
{
  "templateId": "template_123",
  "studentName": "Juan Pérez",
  "courseName": "Desarrollo Web Avanzado",
  "completionDate": "2024-01-15",
  "certificateData": {
    "duration": "40 horas",
    "instructorName": "María García",
    "grade": "Excelente"
  }
}
```

**cURL Example:**
```bash
curl -X POST https://your-domain.com/api/certificates \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -d '{
    "templateId": "template_123",
    "studentName": "Juan Pérez",
    "courseName": "Desarrollo Web Avanzado",
    "completionDate": "2024-01-15",
    "certificateData": {
      "duration": "40 horas",
      "instructorName": "María García",
      "grade": "Excelente"
    }
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "certificateId": "cert_456",
    "studentName": "Juan Pérez",
    "courseName": "Desarrollo Web Avanzado",
    "status": "generated",
    "downloadUrl": "https://your-domain.com/certificates/cert_456/download",
    "previewUrl": "https://your-domain.com/certificates/cert_456/preview",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### 2. Obtener Certificado

Recupera la información de un certificado específico.

**Endpoint:** `GET /certificates/{certificateId}`

**cURL Example:**
```bash
curl -X GET https://your-domain.com/api/certificates/cert_456 \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "certificateId": "cert_456",
    "templateId": "template_123",
    "studentName": "Juan Pérez",
    "courseName": "Desarrollo Web Avanzado",
    "status": "generated",
    "downloadUrl": "https://your-domain.com/certificates/cert_456/download",
    "metadata": {
      "completionDate": "2024-01-15",
      "duration": "40 horas",
      "instructorName": "María García"
    },
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

---

### 3. Listar Certificados

Obtiene una lista paginada de certificados.

**Endpoint:** `GET /certificates`

**Query Parameters:**
- `page` (opcional): Número de página (default: 1)
- `limit` (opcional): Elementos por página (default: 10, max: 100)
- `studentName` (opcional): Filtrar por nombre del estudiante
- `courseName` (opcional): Filtrar por nombre del curso
- `status` (opcional): Filtrar por estado (generated, sent, downloaded)

**cURL Example:**
```bash
curl -X GET "https://your-domain.com/api/certificates?page=1&limit=10&status=generated" \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "certificates": [
      {
        "certificateId": "cert_456",
        "studentName": "Juan Pérez",
        "courseName": "Desarrollo Web Avanzado",
        "status": "generated",
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  }
}
```

---

### 4. Descargar Certificado

Descarga el certificado en formato PDF.

**Endpoint:** `GET /certificates/{certificateId}/download`

**Query Parameters:**
- `format` (opcional): Formato de descarga (pdf, png, jpeg) - default: pdf
- `quality` (opcional): Calidad para imágenes (0.1-1.0) - default: 0.9

**cURL Example:**
```bash
curl -X GET "https://your-domain.com/api/certificates/cert_456/download?format=pdf" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -o "certificado_juan_perez.pdf"
```

---

## 🎨 Endpoints de Plantillas

### 1. Listar Plantillas

Obtiene las plantillas disponibles para generar certificados.

**Endpoint:** `GET /templates`

**cURL Example:**
```bash
curl -X GET https://your-domain.com/api/templates \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "templateId": "template_123",
      "name": "Certificado Profesional",
      "description": "Plantilla para certificados de cursos profesionales",
      "category": "Profesional",
      "previewUrl": "https://your-domain.com/templates/template_123/preview",
      "isActive": true
    }
  ]
}
```

---

### 2. Crear Plantilla

Crea una nueva plantilla de certificado.

**Endpoint:** `POST /templates`

**Body:**
```json
{
  "name": "Certificado de Participación",
  "description": "Plantilla para certificados de participación en eventos",
  "category": "Participación",
  "config": {
    "certificateSize": "landscape",
    "title": "Certificado de Participación",
    "backgroundColor": "#ffffff",
    "titleColor": "#1e40af",
    "textColor": "#374151"
  },
  "isPublic": false
}
```

**cURL Example:**
```bash
curl -X POST https://your-domain.com/api/templates \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -d '{
    "name": "Certificado de Participación",
    "description": "Plantilla para certificados de participación",
    "category": "Participación",
    "config": {
      "certificateSize": "landscape",
      "title": "Certificado de Participación",
      "backgroundColor": "#ffffff"
    }
  }'
```

---

## 📊 Códigos de Estado

| Código | Descripción |
|--------|-------------|
| 200 | Operación exitosa |
| 201 | Recurso creado exitosamente |
| 400 | Solicitud incorrecta |
| 401 | No autorizado |
| 403 | Prohibido |
| 404 | Recurso no encontrado |
| 429 | Muchas peticiones |
| 500 | Error interno del servidor |

---

## 🚨 Manejo de Errores

Todas las respuestas de error siguen el siguiente formato:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Los datos proporcionados no son válidos",
    "details": [
      {
        "field": "studentName",
        "message": "El nombre del estudiante es requerido"
      }
    ]
  }
}
```

### Códigos de Error Comunes

| Código | Descripción |
|--------|-------------|
| `VALIDATION_ERROR` | Datos de entrada inválidos |
| `TEMPLATE_NOT_FOUND` | Plantilla no encontrada |
| `CERTIFICATE_NOT_FOUND` | Certificado no encontrado |
| `INSUFFICIENT_PERMISSIONS` | Permisos insuficientes |
| `RATE_LIMIT_EXCEEDED` | Límite de peticiones excedido |

---

## 🔧 Ejemplos de Integración

### JavaScript/Node.js

```javascript
const axios = require('axios');

const API_BASE = 'https://your-domain.com/api';
const API_TOKEN = 'YOUR_API_TOKEN';

// Crear certificado
async function createCertificate(data) {
  try {
    const response = await axios.post(`${API_BASE}/certificates`, data, {
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
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
});
```

### Python

```python
import requests
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
print(result)
```

### PHP

```php
<?php
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
?>
```

---

## 📚 Recursos Adicionales

### Webhooks

Configura webhooks para recibir notificaciones cuando se generen certificados:

```json
{
  "event": "certificate.created",
  "data": {
    "certificateId": "cert_456",
    "studentName": "Juan Pérez",
    "courseName": "Desarrollo Web",
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

### Rate Limiting

- **Límite**: 1000 peticiones por hora por API token
- **Headers de respuesta**:
  - `X-RateLimit-Limit`: Límite total
  - `X-RateLimit-Remaining`: Peticiones restantes
  - `X-RateLimit-Reset`: Tiempo de reset (Unix timestamp)

### SDKs Oficiales

- [JavaScript/Node.js SDK](https://github.com/certify/sdk-js)
- [Python SDK](https://github.com/certify/sdk-python)
- [PHP SDK](https://github.com/certify/sdk-php)

---

## 🆘 Soporte

¿Necesitas ayuda?

- 📧 **Email**: api-support@certify.com
- 📖 **Documentación**: https://docs.certify.com
- 🐛 **Issues**: https://github.com/certify/api/issues
- 💬 **Discord**: https://discord.gg/certify

---

## 📝 Changelog

### v1.2.0 (2024-01-15)
- ✅ Añadido soporte para exportación en múltiples formatos
- ✅ Nuevos filtros en endpoint de listado
- ✅ Mejorado manejo de errores

### v1.1.0 (2024-01-01)
- ✅ Añadido endpoint de plantillas
- ✅ Soporte para webhooks
- ✅ Rate limiting implementado

### v1.0.0 (2023-12-01)
- 🎉 Lanzamiento inicial de la API