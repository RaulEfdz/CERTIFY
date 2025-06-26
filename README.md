# Certify 🎨✨

Certify es una aplicación web moderna diseñada para simplificar la creación y gestión de certificados digitales. Con una interfaz intuitiva y potentes herramientas de diseño, puedes generar certificados de aspecto profesional en cuestión de minutos.

## ¿Qué es Certify?

¿Necesitas emitir certificados para cursos, eventos o reconocimientos? Certify te permite:

- **Crear plantillas personalizadas:** Diseña tus propias plantillas desde cero utilizando un editor visual fácil de usar.
- **Subir imágenes y logos:** Personaliza tus certificados con tu propia marca.
- **Refinamiento con IA:** Utiliza la inteligencia artificial para obtener sugerencias y mejorar automáticamente el diseño de tus plantillas.
- **Gestionar tus creaciones:** Organiza y guarda todas tus plantillas en un solo lugar.
- **Previsualizar en tiempo real:** Observa cómo quedará tu certificado antes de finalizarlo.

Este proyecto es ideal para instituciones educativas, organizadores de eventos y cualquier persona que necesite una forma eficiente y elegante de generar certificados.

## Características Principales

- **Editor de Plantillas Interactivo:** Arrastra y suelta elementos para diseñar tu certificado.
- **Asistente de IA:** Obtén sugerencias de colores y diseño para que tus certificados luzcan increíbles.
- **Galería de Plantillas:** Guarda y reutiliza tus diseños fácilmente.
- **Exportación de Certificados:** (Próximamente) Exporta tus certificados en formatos de alta calidad.

## Tecnología Utilizada

Certify está construido con un stack de tecnologías modernas, incluyendo:

- **Next.js:** Un framework de React para construir aplicaciones web rápidas y escalables.
- **TypeScript:** Para un código más seguro y mantenible.
- **Tailwind CSS:** Para un diseño de interfaz de usuario rápido y personalizable.
- **Genkit (Google AI):** Para integrar las capacidades de inteligencia artificial.
- **Shadcn/ui:** Para componentes de UI elegantes y accesibles.

## Cómo Empezar

Para ejecutar este proyecto localmente, sigue estos pasos:

1.  **Clona el repositorio:**
    ```bash
    git clone https://github.com/RaulEfdz/CERTIFY.git
    cd CERTIFY
    ```

2.  **Instala las dependencias:**
    ```bash
    npm install
    ```

3.  **Configura las variables de entorno:**
    Copia el archivo `.env.example` a un nuevo archivo llamado `.env` y añade tus claves de API (por ejemplo, para los servicios de IA).

4.  **Ejecuta la aplicación en modo de desarrollo:**
    ```bash
    npm run dev
    ```

5.  Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación.

---

Hecho con ❤️ por [RaulEfdz](https://github.com/RaulEfdz)

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
