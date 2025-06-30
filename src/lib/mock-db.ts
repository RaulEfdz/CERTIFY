// Mock database for testing without Supabase
// Simulate current user
const MOCK_USER_ID = 'mock-user-123';

interface MockTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  config: any;
  html: string;
  status: string;
  is_public: boolean;
  created_by: string;
  organization_id: string | null;
  auto_save_data: any;
  version: number;
  created_at: string;
  updated_at: string;
  last_saved_at: string;
  usage_count: number;
}

// In-memory storage for demo
let mockTemplates: MockTemplate[] = [
  {
    id: "template-demo-1",
    name: "Mi Primera Plantilla",
    description: "Una plantilla de ejemplo para certificados académicos",
    category: "Académico",
    tags: ["curso", "certificado", "demo"],
    config: {
      orientation: 'landscape',
      logoUrl: 'https://placehold.co/150x80/blue/white?text=LOGO',
      logoWidth: 150,
      logoHeight: 80,
      backgroundUrl: null,
      title: 'Certificado de Finalización',
      body1: 'Este certificado se presenta con orgullo a',
      body2: 'por haber completado exitosamente el curso',
      courseName: 'Desarrollo Web con React',
      studentName: 'María García López',
      directorName: 'Dr. Juan Pérez',
      signatures: [
        { imageUrl: 'https://placehold.co/150x50/333/white?text=Firma1', dataAiHint: 'signature autograph' },
        { imageUrl: 'https://placehold.co/150x50/333/white?text=Firma2', dataAiHint: 'signature autograph' }
      ],
      overlayColor: 'rgba(255, 255, 255, 0.95)',
      certificateSize: 'landscape',
      titleColor: '#1f2937',
      bodyColor: '#4b5563',
      customCss: '.certificate { border: 3px solid #3b82f6; }',
      customJs: '',
      date: new Date().toISOString(),
      dateLocale: 'es-ES'
    },
    html: '',
    status: 'published',
    is_public: true,
    created_by: MOCK_USER_ID,
    organization_id: null,
    auto_save_data: null,
    version: 3,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    updated_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    last_saved_at: new Date(Date.now() - 1800000).toISOString(), // 30 min ago
    usage_count: 15
  },
  {
    id: "template-demo-2", 
    name: "Certificado Profesional",
    description: "Plantilla elegante para certificaciones profesionales",
    category: "Profesional",
    tags: ["profesional", "empresa", "capacitación"],
    config: {
      orientation: 'landscape',
      logoUrl: 'https://placehold.co/120x120/green/white?text=CORP',
      logoWidth: 120,
      logoHeight: 120,
      backgroundUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=800&fit=crop',
      title: 'Certificado Profesional',
      body1: 'Se certifica que',
      body2: 'ha completado satisfactoriamente la capacitación en',
      courseName: 'Liderazgo y Gestión de Equipos',
      studentName: 'Carlos Rodriguez',
      directorName: 'Lic. Ana Martínez',
      signatures: [
        { imageUrl: 'https://placehold.co/150x50/555/white?text=Director', dataAiHint: 'signature autograph' }
      ],
      overlayColor: 'rgba(0, 0, 0, 0.3)',
      certificateSize: 'landscape',
      titleColor: '#ffffff',
      bodyColor: '#f3f4f6',
      customCss: '',
      customJs: '',
      date: new Date().toISOString(),
      dateLocale: 'es-ES'
    },
    html: '',
    status: 'draft',
    is_public: false,
    created_by: MOCK_USER_ID,
    organization_id: null,
    auto_save_data: {
      config: { /* some unsaved changes */ },
      timestamp: new Date(Date.now() - 300000).toISOString() // 5 min ago
    },
    version: 1,
    created_at: new Date(Date.now() - 3600000 * 6).toISOString(), // 6 hours ago
    updated_at: new Date(Date.now() - 300000).toISOString(), // 5 min ago
    last_saved_at: new Date(Date.now() - 1200000).toISOString(), // 20 min ago
    usage_count: 3
  },
  {
    id: "template-demo-3",
    name: "Certificado de Participación Tech Conference",
    description: "Para eventos tecnológicos y conferencias de desarrolladores",
    category: "Participación",
    tags: ["tech", "conferencia", "desarrollo", "networking"],
    config: {
      orientation: 'landscape',
      logoUrl: 'https://placehold.co/140x60/6366f1/white?text=TECH+CONF',
      logoWidth: 140,
      logoHeight: 60,
      backgroundUrl: null,
      title: 'Certificado de Participación',
      body1: 'Se reconoce que',
      body2: 'participó activamente en la',
      courseName: 'TechConf 2024 - Innovación en IA',
      studentName: 'Alex Mendoza',
      directorName: 'Dr. Sofia Ruiz',
      signatures: [
        { imageUrl: 'https://placehold.co/150x50/8b5cf6/white?text=Organizador', dataAiHint: 'signature autograph' }
      ],
      overlayColor: 'rgba(59, 130, 246, 0.9)',
      certificateSize: 'landscape',
      titleColor: '#ffffff',
      bodyColor: '#f1f5f9',
      customCss: '.certificate { background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); }',
      customJs: '',
      date: new Date().toISOString(),
      dateLocale: 'es-ES'
    },
    html: '',
    status: 'published',
    is_public: true,
    created_by: MOCK_USER_ID,
    organization_id: null,
    auto_save_data: null,
    version: 2,
    created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    updated_at: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    last_saved_at: new Date(Date.now() - 7200000).toISOString(),
    usage_count: 8
  },
  {
    id: "template-demo-4",
    name: "Diploma Curso Online",
    description: "Perfecta para cursos en línea y plataformas educativas",
    category: "Académico", 
    tags: ["online", "diploma", "educación", "e-learning"],
    config: {
      orientation: 'landscape',
      logoUrl: 'https://placehold.co/100x100/10b981/white?text=EDU',
      logoWidth: 100,
      logoHeight: 100,
      backgroundUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&h=800&fit=crop',
      title: 'Diploma de Finalización',
      body1: 'Certificamos que',
      body2: 'ha completado satisfactoriamente el curso online',
      courseName: 'Fundamentos de Data Science',
      studentName: 'Elena Castro',
      directorName: 'Prof. Miguel Torres',
      signatures: [
        { imageUrl: 'https://placehold.co/150x50/10b981/white?text=Director', dataAiHint: 'signature autograph' },
        { imageUrl: 'https://placehold.co/150x50/059669/white?text=Instructor', dataAiHint: 'signature autograph' }
      ],
      overlayColor: 'rgba(16, 185, 129, 0.85)',
      certificateSize: 'landscape',
      titleColor: '#ffffff',
      bodyColor: '#f0fdf4',
      customCss: '',
      customJs: '',
      date: new Date().toISOString(),
      dateLocale: 'es-ES'
    },
    html: '',
    status: 'draft',
    is_public: false,
    created_by: MOCK_USER_ID,
    organization_id: null,
    auto_save_data: null,
    version: 1,
    created_at: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
    updated_at: new Date(Date.now() - 900000).toISOString(), // 15 min ago
    last_saved_at: new Date(Date.now() - 900000).toISOString(),
    usage_count: 0
  }
];

let nextId = 5;

// Mock auth function
export const mockAuth = {
  async getUser() {
    return {
      data: {
        user: {
          id: MOCK_USER_ID,
          email: 'demo@example.com',
          name: 'Usuario Demo'
        }
      },
      error: null
    };
  }
};

export const mockDatabase = {
  // Simulate template creation
  async createTemplate(templateData: Partial<MockTemplate>): Promise<{ data: MockTemplate; error: null } | { data: null; error: any }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      
      const newTemplate: MockTemplate = {
        id: `template-${Date.now()}-${nextId++}`,
        name: templateData.name || 'Nueva Plantilla',
        description: templateData.description || 'Plantilla de certificado personalizable',
        category: templateData.category || 'Académico',
        tags: templateData.tags || [],
        config: templateData.config || {},
        html: templateData.html || '',
        status: templateData.status || 'draft',
        is_public: templateData.is_public || false,
        created_by: MOCK_USER_ID,
        organization_id: null,
        auto_save_data: null,
        version: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_saved_at: new Date().toISOString(),
        usage_count: 0
      };

      mockTemplates.unshift(newTemplate);
      return { data: newTemplate, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Simulate template fetching
  async getTemplate(id: string): Promise<{ data: MockTemplate | null; error: any }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const template = mockTemplates.find(t => t.id === id);
      return { data: template || null, error: template ? null : { code: 'PGRST116' } };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Simulate template listing
  async getTemplates(): Promise<{ data: MockTemplate[]; error: null }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      return { data: [...mockTemplates], error: null };
    } catch (error) {
      return { data: [], error };
    }
  },

  // Simulate template update
  async updateTemplate(id: string, updates: Partial<MockTemplate>): Promise<{ data: MockTemplate | null; error: any }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      const index = mockTemplates.findIndex(t => t.id === id);
      if (index === -1) {
        return { data: null, error: { message: 'Template not found' } };
      }

      mockTemplates[index] = {
        ...mockTemplates[index],
        ...updates,
        updated_at: new Date().toISOString(),
        version: mockTemplates[index].version + 1
      };

      return { data: mockTemplates[index], error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Simulate template deletion
  async deleteTemplate(id: string): Promise<{ error: any }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      const index = mockTemplates.findIndex(t => t.id === id);
      if (index === -1) {
        return { error: { message: 'Template not found' } };
      }
      mockTemplates.splice(index, 1);
      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  // Simulate auto-save
  async autoSave(id: string, config: any, html: string): Promise<{ success: boolean; saved_at?: string; error?: any }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 150));
      const template = mockTemplates.find(t => t.id === id);
      if (!template) {
        return { success: false, error: 'Template not found' };
      }

      template.auto_save_data = {
        config,
        html,
        timestamp: new Date().toISOString()
      };
      template.updated_at = new Date().toISOString();

      return { success: true, saved_at: new Date().toISOString() };
    } catch (error) {
      return { success: false, error };
    }
  },

  // Simulate permanent save
  async saveTemplate(id: string, config: any, html: string, name?: string, description?: string): Promise<{ success: boolean; saved_at?: string; version?: number; error?: any }> {
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      const template = mockTemplates.find(t => t.id === id);
      if (!template) {
        return { success: false, error: 'Template not found' };
      }

      template.config = config;
      template.html = html;
      if (name) template.name = name;
      if (description) template.description = description;
      template.auto_save_data = null;
      template.version += 1;
      template.last_saved_at = new Date().toISOString();
      template.updated_at = new Date().toISOString();

      return { 
        success: true, 
        saved_at: template.last_saved_at,
        version: template.version
      };
    } catch (error) {
      return { success: false, error };
    }
  }
};