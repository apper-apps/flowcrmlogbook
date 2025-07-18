import { useSelector } from "react-redux";

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
    totalValue: "Total Value",
    conversionRate: "Conversion Rate",
    addLead: "Add Lead",
    editLead: "Edit Lead",
    deleteLead: "Delete Lead",
    
    // Stages
    cold: "Cold",
    engaged: "Engaged",
    initialContact: "Initial Contact",
    qualified: "Qualified",
    proposal: "Proposal",
    negotiation: "Negotiation",
    closedWon: "Closed Won",
    closedLost: "Closed Lost",
    
    // Contacts
    allContacts: "All Contacts",
    addContact: "Add Contact",
    editContact: "Edit Contact",
    deleteContact: "Delete Contact",
    company: "Company",
    email: "Email",
    phone: "Phone",
    lastActivity: "Last Activity",
    
    // Inbox
    allMessages: "All Messages",
    unreadMessages: "Unread Messages",
    compose: "Compose",
    reply: "Reply",
    forward: "Forward",
    markAsRead: "Mark as Read",
    
// Documents
    allDocuments: "All Documents",
    createDocument: "Create Document",
    templates: "Templates",
    contract: "Contract",
    invoice: "Invoice",
    // Billing
    allInvoices: "All Invoices",
    createInvoice: "Create Invoice",
    paid: "Paid",
    pending: "Pending",
    overdue: "Overdue",
    total: "Total",
    dueDate: "Due Date",
    
    // Reports
    salesReport: "Sales Report",
    activityReport: "Activity Report",
    conversionReport: "Conversion Report",
    
    // Common
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    view: "View",
    search: "Search",
    filter: "Filter",
    export: "Export",
    import: "Import",
    loading: "Loading...",
    noData: "No data available",
    error: "An error occurred",
    success: "Success",
    name: "Name",
    value: "Value",
    status: "Status",
    date: "Date",
    actions: "Actions",
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
    leads: "Leads",
    totalValue: "Valor Total",
    conversionRate: "Tasa de Conversión",
    addLead: "Agregar Lead",
    editLead: "Editar Lead",
    deleteLead: "Eliminar Lead",
    
    // Stages
    cold: "Frío",
    engaged: "Comprometido",
    initialContact: "Contacto Inicial",
    qualified: "Calificado",
    proposal: "Propuesta",
    negotiation: "Negociación",
    closedWon: "Ganado",
    closedLost: "Perdido",
    
    // Contacts
    allContacts: "Todos los Contactos",
    addContact: "Agregar Contacto",
    editContact: "Editar Contacto",
    deleteContact: "Eliminar Contacto",
    company: "Empresa",
    email: "Correo",
    phone: "Teléfono",
    lastActivity: "Última Actividad",
    
    // Inbox
    allMessages: "Todos los Mensajes",
    unreadMessages: "Mensajes sin Leer",
    compose: "Redactar",
    reply: "Responder",
    forward: "Reenviar",
    markAsRead: "Marcar como Leído",
    
// Documents
    allDocuments: "Todos los Documentos",
    createDocument: "Crear Documento",
    templates: "Plantillas",
    contract: "Contrato",
    invoice: "Factura",
    // Billing
    allInvoices: "Todas las Facturas",
    createInvoice: "Crear Factura",
    paid: "Pagado",
    pending: "Pendiente",
    overdue: "Vencido",
    total: "Total",
    dueDate: "Fecha de Vencimiento",
    
    // Reports
    salesReport: "Reporte de Ventas",
    activityReport: "Reporte de Actividad",
    conversionReport: "Reporte de Conversión",
    
    // Common
    save: "Guardar",
    cancel: "Cancelar",
    delete: "Eliminar",
    edit: "Editar",
    view: "Ver",
    search: "Buscar",
    filter: "Filtrar",
    export: "Exportar",
    import: "Importar",
    loading: "Cargando...",
    noData: "No hay datos disponibles",
    error: "Ocurrió un error",
    success: "Éxito",
    name: "Nombre",
    value: "Valor",
    status: "Estado",
    date: "Fecha",
    actions: "Acciones",
  },
};

export const useLanguage = () => {
  const language = useSelector((state) => state.ui.language);
  
  const t = (key) => {
    return translations[language][key] || key;
  };
  
  return { t, language };
};