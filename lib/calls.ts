import calls from '@/data/calls.json';

export type Call = {
  id: string;
  closer: string;
  ts: string;
  lead: string;
  phone: string;
  durationSec: number;
  outcome: string;
  result: string;
  notes?: string;
  amount?: number;
};

export function getCallsForCloser(closer: string, start: Date, end: Date): Call[] {
  return (calls as Call[])
    .filter(c => {
      const callDate = new Date(c.ts);
      return c.closer === closer && callDate >= start && callDate <= end;
    })
    .sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime());
}

export const fmtTime = (s: number): string => 
  `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

export const fmtDateTime = (ts: string): string => {
  const date = new Date(ts);
  return date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};

export const fmtDate = (ts: string): string => {
  const date = new Date(ts);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export const getOutcomeColor = (outcome: string): string => {
  switch (outcome) {
    case 'Show':
    case 'Conectada':
      return 'border-[#58F178] text-[#58F178] bg-[rgba(88,241,120,.12)]';
    case 'No Show':
    case 'No contesta':
    case 'Buzón':
      return 'border-[#FFD84D] text-[#FFD84D] bg-[rgba(255,216,77,.12)]';
    case 'Rechazada':
      return 'border-[#FF6B6B] text-[#FF6B6B] bg-[rgba(255,107,107,.12)]';
    default:
      return 'border-white/20 text-white/70 bg-white/5';
  }
};

export const getResultColor = (result: string): string => {
  switch (result) {
    case 'Venta':
      return 'border-[#58F178] text-[#58F178] bg-[rgba(88,241,120,.12)]';
    case 'Agendada':
      return 'border-[#4285F4] text-[#4285F4] bg-[rgba(66,133,244,.12)]';
    case 'Seguimiento':
      return 'border-[#FFD84D] text-[#FFD84D] bg-[rgba(255,216,77,.12)]';
    default:
      return 'border-white/20 text-white/70 bg-white/5';
  }
};