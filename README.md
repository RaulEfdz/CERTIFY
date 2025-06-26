# Certify - Aplicación de Certificados Digitales

Aplicación web para la generación y gestión de certificados digitales construida con Next.js y Firebase.

## 🚀 Despliegue en Vercel

Sigue estos pasos para desplegar la aplicación en Vercel:

1. **Clona el repositorio**
   ```bash
   git clone [URL_DEL_REPOSITORIO]
   cd Certify
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Configura las variables de entorno**
   - Copia el archivo `env.example` a `.env.local`
   - Completa las variables de entorno con tus credenciales

4. **Despliega en Vercel**
   - Conecta tu repositorio de GitHub/GitLab/Bitbucket a Vercel
   - Importa el proyecto
   - Configura las variables de entorno en la configuración del proyecto en Vercel
   - Haz clic en "Deploy"

## 🛠 Desarrollo local

1. **Instala las dependencias**
   ```bash
   npm install
   ```

2. **Configura las variables de entorno**
   Crea un archivo `.env.local` basado en `env.example`

3. **Inicia el servidor de desarrollo**
   ```bash
   npm run dev
   ```

4. **Abre [http://localhost:3000](http://localhost:3000)** en tu navegador

## 📦 Scripts disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm start` - Inicia el servidor de producción
- `npm run lint` - Ejecuta el linter
- `npm run typecheck` - Verifica los tipos de TypeScript

## 🌐 Configuración de Vercel

El proyecto incluye un archivo `vercel.json` con la configuración necesaria para el despliegue en Vercel.

## 🔒 Variables de entorno

Asegúrate de configurar las siguientes variables de entorno en tu despliegue de Vercel:

- `NEXT_PUBLIC_FIREBASE_*` - Configuración de Firebase
- `NEXT_PUBLIC_SITE_URL` - URL base de tu aplicación
- Otras variables según sea necesario

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo `LICENSE` para más detalles.
