import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { exportToCsv } from '../lib/export';

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

interface LeadNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadNote: LeadNote;
}

export default function LeadNotesModal({ isOpen, onClose, leadNote }: LeadNotesModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Focus trap
      firstFocusableRef.current?.focus();
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      
      // ESC key handler
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      
      document.addEventListener('keydown', handleEsc);
      
      return () => {
        document.body.style.overflow = 'unset';
        document.removeEventListener('keydown', handleEsc);
      };
    }
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleExportLead = () => {
    const data = [{
      Lead: leadNote.lead,
      Teléfono: leadNote.phone,
      Email: leadNote.email,
      Closer: leadNote.closer,
      Fuente: leadNote.fuente,
      Campaña: leadNote.campania,
      Score: leadNote.score,
      Estatus: leadNote.estatus,
      Interacciones: leadNote.interacciones,
      'Último Mensaje': leadNote.ultimoMensaje,
      'Valor Estimado': leadNote.valorEstimado,
      Resultado: leadNote.resultado,
      Cita: leadNote.cita,
      'Siguiente Paso': leadNote.siguientePaso,
      Notas: leadNote.notas,
      Tags: leadNote.tags.join(', ')
    }];
    
    const filename = `lead_${leadNote.lead.replace(/\s+/g, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}.csv`;
    exportToCsv(filename, data);
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return 'text-[#58F178] border-[#58F178] bg-[rgba(88,241,120,0.1)]';
    if (score >= 60) return 'text-[#FFD84D] border-[#FFD84D] bg-[rgba(255,216,77,0.1)]';
    return 'text-[#FF6B6B] border-[#FF6B6B] bg-[rgba(255,107,107,0.1)]';
  };

  const getMethodColor = (fuente: string) => {
    if (fuente.includes('Meta')) return '#1877F2';
    if (fuente.includes('Prospección')) return '#34A853';
    if (fuente.includes('Orgánico')) return '#FF6F61';
    return '#3B82F6';
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (!isOpen) return null;

  const modal = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(11, 18, 36, 0.92)' }}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className="w-full max-w-2xl rounded-2xl border border-white/10 shadow-2xl"
        style={{ backgroundColor: '#0E152B' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-white/10 p-6">
          <h2 id="modal-title" className="text-xl font-semibold text-[#E6ECFF]">
            Notas del lead
          </h2>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Lead Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-[#9DA9C0] block mb-1">Lead</label>
              <p className="text-[#E6ECFF] font-semibold">{leadNote.lead}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-[#9DA9C0] block mb-1">Closer</label>
              <p className="text-[#E6ECFF]">{leadNote.closer}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-[#9DA9C0] block mb-1">Teléfono</label>
              <div className="flex items-center gap-2">
                <p className="text-[#E6ECFF] font-mono">{leadNote.phone}</p>
                <button
                  onClick={() => copyToClipboard(leadNote.phone)}
                  className="text-xs px-2 py-1 rounded bg-white/8 hover:bg-white/12 text-[#9DA9C0] hover:text-[#E6ECFF] transition-colors"
                >
                  Copiar
                </button>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-[#9DA9C0] block mb-1">Email</label>
              <div className="flex items-center gap-2">
                <p className="text-[#E6ECFF] break-all">{leadNote.email}</p>
                <button
                  onClick={() => copyToClipboard(leadNote.email)}
                  className="text-xs px-2 py-1 rounded bg-white/8 hover:bg-white/12 text-[#9DA9C0] hover:text-[#E6ECFF] transition-colors"
                >
                  Copiar
                </button>
              </div>
            </div>
          </div>

          {/* Source & Campaign */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-[#9DA9C0] block mb-1">Fuente</label>
              <p className="text-[#E6ECFF]">{leadNote.fuente}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-[#9DA9C0] block mb-1">Campaña/Ad</label>
              <p className="text-[#E6ECFF]">{leadNote.campania}</p>
            </div>
          </div>

          {/* Score & Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-[#9DA9C0] block mb-1">Score</label>
              <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full border ${getScoreBadgeColor(leadNote.score)}`}>
                {leadNote.score}/100
              </span>
            </div>
            <div>
              <label className="text-sm font-medium text-[#9DA9C0] block mb-1">Estatus</label>
              <p className="text-[#E6ECFF]">{leadNote.estatus}</p>
            </div>
          </div>

          {/* Interactions & Last Message */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-[#9DA9C0] block mb-1">Interacciones</label>
              <p className="text-[#E6ECFF]">{leadNote.interacciones}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-[#9DA9C0] block mb-1">Valor estimado</label>
              <p className="text-[#E6ECFF] font-semibold">
                {leadNote.valorEstimado > 0 ? `$${leadNote.valorEstimado.toLocaleString()}` : '—'}
              </p>
            </div>
          </div>

          {/* Result & Appointment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-[#9DA9C0] block mb-1">Resultado</label>
              <p className="text-[#E6ECFF]">{leadNote.resultado}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-[#9DA9C0] block mb-1">Cita</label>
              <p className="text-[#E6ECFF]">{leadNote.cita || '—'}</p>
            </div>
          </div>

          {/* Last Message */}
          <div>
            <label className="text-sm font-medium text-[#9DA9C0] block mb-1">Último mensaje</label>
            <p className="text-[#E6ECFF] text-sm bg-white/4 rounded-lg p-3">{leadNote.ultimoMensaje}</p>
          </div>

          {/* Next Step */}
          <div>
            <label className="text-sm font-medium text-[#9DA9C0] block mb-1">Siguiente paso</label>
            <p className="text-[#E6ECFF]">{leadNote.siguientePaso}</p>
          </div>

          {/* Notes */}
          <div>
            <label className="text-sm font-medium text-[#9DA9C0] block mb-1">Notas</label>
            <p className="text-[#E6ECFF] text-sm bg-white/4 rounded-lg p-3 whitespace-pre-wrap">{leadNote.notas}</p>
          </div>

          {/* Tags */}
          {leadNote.tags.length > 0 && (
            <div>
              <label className="text-sm font-medium text-[#9DA9C0] block mb-2">Tags</label>
              <div className="flex flex-wrap gap-2">
                {leadNote.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs rounded-full bg-white/8 text-[#E6ECFF] border border-white/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 p-6 flex justify-end gap-3">
          <button
            ref={firstFocusableRef}
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-[#9DA9C0] hover:text-[#E6ECFF] transition-colors"
          >
            Cerrar
          </button>
          <button
            onClick={handleExportLead}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-white/15 bg-white/8 hover:bg-white/12 text-white transition-colors"
            style={{ 
              borderColor: `${getMethodColor(leadNote.fuente)}40`,
              backgroundColor: `${getMethodColor(leadNote.fuente)}15`
            }}
          >
            Exportar esta ficha (CSV)
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}