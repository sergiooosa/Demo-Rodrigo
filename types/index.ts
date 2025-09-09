export interface SubCampaign {
  name: "H1" | "H2" | "H3" | "H4";
  spend: number;
  impressions: number;
  ctr: number;
  agendasQ: number;
  showsQ: number;
  sales: number;
  cash: number;
  reservas?: number;
  valorReservas?: number;
  cpaq?: number;
  cpsq?: number;
  cac?: number;
  roas: number;
}

export interface Ad {
  adId: string;
  adName: string;
  medium: string;
  spend: number;
  impressions: number;
  ctr: number;
  agendas: number;
  agendasQ: number;
  showsQ: number;
  sales: number;
  cash: number;
  reservas?: number;
  valorReservas?: number;
  campaigns?: SubCampaign[];
}

export interface Method {
  method: string;
  spend: number;
  agendas: number;
  agendasQ: number;
  showsQ: number;
  sales: number;
  cash: number;
  billing?: number;
  messages?: number;
  videos?: number;
}

export interface Closer {
  closer: string;
  leads: number;
  agendas: number;
  shows: number;
  offers: number;
  sales: number;
  cash: number;
  notes: string;
}

export interface KpiCardProps {
  title: string;
  value: string;
  variation?: string;
  badge?: 'Bueno' | 'A revisar' | 'Malo';
}

export interface SectionProps {
  title: string;
  children: React.ReactNode;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export type DateFilterType = 'today' | 'yesterday' | '7days' | '30days' | 'custom';

export interface DateFilterOption {
  id: DateFilterType;
  label: string;
  getRange: () => DateRange;
}

export interface LeadNote {
  id: string;
  closer: string;
  lead: string;
  phone: string;
  email: string;
  fuente: string;
  campania: string;
  adId: string;
  score: number;
  estatus: string;
  interacciones: number;
  ultimoMensaje: string;
  valorEstimado: number;
  resultado: string;
  cita: string;
  siguientePaso: string;
  notas: string;
  tags: string[];
}

export interface AgendaRow {
  ts: string;
  leadName: string;
  phone?: string;
  estado: "Show" | "No Show";
  resultado: "Venta" | "Oferta enviada" | "Perdida" | "No calificada" | "Seguimiento";
  monto?: number;
  notesId?: string;
}

export interface CallAnalysisNote {
  id: string;
  leadName: string;
  phone: string;
  closer: string;
  objetivo: "Descubrimiento" | "Demo" | "Cierre" | "Seguimiento";
  resultado: "Venta" | "Oferta enviada" | "Perdida" | "No calificada" | "Seguimiento";
  objecciones: string[];
  sentimiento: "Positivo" | "Neutro" | "Negativo";
  resumen: string;
  acciones: string[];
  cita?: string;
  transcripcion: string[];
} 