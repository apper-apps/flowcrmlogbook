import { useSelector } from 'react-redux';

const translations = {
  en: {
    // Navigation
    pipeline: "Pipeline",
    contacts: "Contacts",
    inbox: "Inbox",
    documents: "Documents",
    billing: "Billing",
    reports: "Reports",
    settings: "Settings",
    
    // Pipeline
    pipelines: "Pipelines",
    allPipelines: "All Pipelines",
    stages: "Stages",
    leads: "Leads",
    deals: "Deals",
    newLead: "New Lead",
    newDeal: "New Deal",
    moveToStage: "Move to Stage",
    
    // Contacts
    allContacts: "All Contacts",
    newContact: "New Contact",
    editContact: "Edit Contact",
    deleteContact: "Delete Contact",
    contactInfo: "Contact Information",
    
// Inbox
    messages: "Messages",
    newMessage: "New Message",
    reply: "Reply",
    forward: "Forward",
    deleteMessage: "Delete",
    markAsRead: "Mark as Read",
    markAsUnread: "Mark as Unread",
    
    // Documents
    allDocuments: "All Documents",
    newDocument: "New Document",
    upload: "Upload",
    download: "Download",
    share: "Share",
    
    // Billing
    invoices: "Invoices",
    newInvoice: "New Invoice",
    paid: "Paid",
    pending: "Pending",
    overdue: "Overdue",
    
    // Common
    save: "Save",
    cancel: "Cancel",
    edit: "Edit",
    delete: "Delete",
    search: "Search",
    filter: "Filter",
    sort: "Sort",
    name: "Name",
    email: "Email",
    phone: "Phone",
    company: "Company",
    status: "Status",
    date: "Date",
    amount: "Amount",
    total: "Total",
    subtotal: "Subtotal",
    tax: "Tax",
    loading: "Loading...",
    error: "Error",
    success: "Success",
    warning: "Warning",
    info: "Info",
    noData: "No data available",
    confirm: "Confirm",
    yes: "Yes",
    no: "No"
  },
  es: {
    // Navigation
    pipeline: "Pipeline",
    contacts: "Contactos",
    inbox: "Bandeja",
    documents: "Documentos",
    billing: "Facturación",
    reports: "Reportes",
    settings: "Configuración",
    
    // Pipeline
    pipelines: "Pipelines",
    allPipelines: "Todos los Pipelines",
    stages: "Etapas",
    leads: "Prospectos",
    deals: "Negocios",
    newLead: "Nuevo Prospecto",
    newDeal: "Nuevo Negocio",
    moveToStage: "Mover a Etapa",
    
    // Contacts
    allContacts: "Todos los Contactos",
    newContact: "Nuevo Contacto",
    editContact: "Editar Contacto",
    deleteContact: "Eliminar Contacto",
    contactInfo: "Información de Contacto",
    
// Inbox
    messages: "Mensajes",
    newMessage: "Nuevo Mensaje",
    reply: "Responder",
    forward: "Reenviar",
    deleteMessage: "Eliminar",
    markAsRead: "Marcar como Leído",
    markAsUnread: "Marcar como No Leído",
    
    // Documents
    allDocuments: "Todos los Documentos",
    newDocument: "Nuevo Documento",
    upload: "Subir",
    download: "Descargar",
    share: "Compartir",
    
    // Billing
    invoices: "Facturas",
    newInvoice: "Nueva Factura",
    paid: "Pagado",
    pending: "Pendiente",
    overdue: "Vencido",
    
    // Common
    save: "Guardar",
    cancel: "Cancelar",
    edit: "Editar",
    delete: "Eliminar",
    search: "Buscar",
    filter: "Filtrar",
    sort: "Ordenar",
    name: "Nombre",
    email: "Correo",
    phone: "Teléfono",
    company: "Empresa",
    status: "Estado",
    date: "Fecha",
    amount: "Cantidad",
    total: "Total",
    subtotal: "Subtotal",
    tax: "Impuesto",
    loading: "Cargando...",
    error: "Error",
    success: "Éxito",
    warning: "Advertencia",
    info: "Información",
    noData: "No hay datos disponibles",
    confirm: "Confirmar",
    yes: "Sí",
    no: "No"
  }
};

export const useLanguage = () => {
  const language = useSelector((state) => state.ui?.language || 'en');
  
  const t = (key) => {
    try {
      const translation = translations[language]?.[key] || translations.en[key] || key;
      return translation;
    } catch (error) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
  };
  
  const currentLanguage = language;
  
  return {
    t,
    currentLanguage,
    isEnglish: language === 'en',
    isSpanish: language === 'es'
  };
};

export default useLanguage;