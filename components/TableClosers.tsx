import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Closer, DateRange, CallAnalysisNote } from '../types';
import { money0, pct, safeDiv } from '../utils/helpers';
import { Call, getCallsForCloser, fmtTime, fmtDateTime, fmtDate, getOutcomeColor, getResultColor } from '../lib/calls';
import { getLeadNote } from '../lib/leadNotes';
import { getCallAnalysis, maskPhone } from '../lib/callAnalysis';
import { exportToXlsx, generateFilename, sanitizeFilename } from '../lib/export';
import LeadNotesModal, { LeadNote } from './LeadNotesModal';
import CallAnalysisModal from './CallAnalysisModal';

interface TableClosersProps {
  closers: Closer[];
  dateRange: DateRange;
}

// Función para normalizar texto (remover acentos y convertir a minúsculas)
const normalize = (s: string) =>
  s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export default function TableClosers({ closers, dateRange }: TableClosersProps) {
  const [openRow, setOpenRow] = useState<string | null>(null);
  const [expandedCalls, setExpandedCalls] = useState<{ [key: string]: Call[] }>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLeadNote, setSelectedLeadNote] = useState<LeadNote | null>(null);
  const [callAnalysisModalOpen, setCallAnalysisModalOpen] = useState(false);
  const [selectedCallAnalysis, setSelectedCallAnalysis] = useState<CallAnalysisNote | null>(null);
  const [searchQueries, setSearchQueries] = useState<{ [key: string]: string }>({});
  const searchInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  // Sort by sales descending
  const sortedClosers = [...closers].sort((a, b) => b.sales - a.sales);

  // Hotkey para enfocar búsqueda (tecla /)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        // Enfocar el primer input de búsqueda visible
        const firstVisibleInput = Object.values(searchInputRefs.current).find(ref => ref);
        firstVisibleInput?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toggleRow = (closerName: string) => {
    if (openRow === closerName) {
      setOpenRow(null);
    } else {
      setOpenRow(closerName);
      // Generate fictional calls for this closer if not already loaded
      if (!expandedCalls[closerName]) {
        const closer = closers.find(c => c.closer === closerName);
        if (closer) {
          const calls = generateFictionalCalls(closer, dateRange);
          setExpandedCalls(prev => ({ ...prev, [closerName]: calls }));
        }
      }
    }
  };

  const getCallMetrics = (calls: Call[]) => {
    const totalAgendas = calls.length;
    const shows = calls.filter(c => c.outcome === 'Show').length;
    const tasaShow = totalAgendas > 0 ? (shows / totalAgendas) * 100 : 0;
    const ventasDeAgendas = calls.filter(c => c.result === 'Venta').length;
    const cashDeAgendas = calls.reduce((sum, c) => sum + (c.amount || 0), 0);
    
    return { totalAgendas, shows, tasaShow, ventasDeAgendas, cashDeAgendas };
  };

  // Generate fictional agenda data based on closer totals
  const generateFictionalCalls = (closer: Closer, dateRange: DateRange): Call[] => {
    const calls: Call[] = [];
    const { sales, offers, shows, agendas } = closer;
    
    // Calculate proportions based on closer's actual numbers
    const ventas = sales;                    // Shows that resulted in sales
    const ofertasSinVenta = offers - sales;  // Shows that got offers but no sales
    const perdidas = shows - offers;         // Shows that were losses
    const noShows = agendas - shows;         // Agendas that didn't show up
    
    let callId = 1;
    
    // Generate sales agendas (showed up and resulted in sales)
    for (let i = 0; i < ventas; i++) {
      const randomDate = new Date(dateRange.startDate.getTime() + Math.random() * (dateRange.endDate.getTime() - dateRange.startDate.getTime()));
      
      calls.push({
        id: `a${callId++}`,
        closer: closer.closer,
        ts: randomDate.toISOString(),
        lead: `Agenda ${callId - 1}`, // Generic agenda identifier
        phone: `+57•••${Math.floor(Math.random() * 9000) + 1000}`,
        durationSec: Math.floor(Math.random() * 600) + 300, // 5-15 minutes
        outcome: 'Show', // Show vs No Show
        result: 'Venta',
        notes: 'Plan anual contratado',
        amount: Math.floor(Math.random() * 1000) + 500 // $500-$1500
      });
    }
    
    // Generate offer agendas (showed up, got offers but no sales)
    for (let i = 0; i < ofertasSinVenta; i++) {
      const randomDate = new Date(dateRange.startDate.getTime() + Math.random() * (dateRange.endDate.getTime() - dateRange.startDate.getTime()));
      
      calls.push({
        id: `a${callId++}`,
        closer: closer.closer,
        ts: randomDate.toISOString(),
        lead: `Agenda ${callId - 1}`,
        phone: `+57•••${Math.floor(Math.random() * 9000) + 1000}`,
        durationSec: Math.floor(Math.random() * 400) + 200, // 3-10 minutes
        outcome: 'Show',
        result: Math.random() > 0.5 ? 'Oferta enviada' : 'Seguimiento',
        notes: Math.random() > 0.5 ? 'Interesado, seguimiento pendiente' : 'Evalúa propuesta',
        amount: 0
      });
    }
    
    // Generate loss agendas (showed up but resulted in losses)
    for (let i = 0; i < perdidas; i++) {
      const randomDate = new Date(dateRange.startDate.getTime() + Math.random() * (dateRange.endDate.getTime() - dateRange.startDate.getTime()));
      
      calls.push({
        id: `a${callId++}`,
        closer: closer.closer,
        ts: randomDate.toISOString(),
        lead: `Agenda ${callId - 1}`,
        phone: `+57•••${Math.floor(Math.random() * 9000) + 1000}`,
        durationSec: Math.floor(Math.random() * 300) + 100, // 2-7 minutes
        outcome: 'Show',
        result: 'Perdida',
        notes: 'No calificado, fuera del presupuesto',
        amount: 0
      });
    }
    
    // Generate no-show agendas (agendas that didn't show up)
    for (let i = 0; i < noShows; i++) {
      const randomDate = new Date(dateRange.startDate.getTime() + Math.random() * (dateRange.endDate.getTime() - dateRange.startDate.getTime()));
      
      calls.push({
        id: `a${callId++}`,
        closer: closer.closer,
        ts: randomDate.toISOString(),
        lead: `Agenda ${callId - 1}`,
        phone: `+57•••${Math.floor(Math.random() * 9000) + 1000}`,
        durationSec: 0, // No duration for no-shows
        outcome: 'No Show',
        result: 'No calificada',
        notes: 'Cliente no se presentó a la cita',
        amount: 0
      });
    }
    
      // Sort by date (newest first)
  return calls.sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime());
  };

  // Get color for result status
  const getResultStatusColor = (result: string): string => {
    switch (result) {
      case 'Venta':
        return 'text-[#58F178] border-[#58F178] bg-[rgba(88,241,120,0.1)]'; // Verde
      case 'Oferta enviada':
        return 'text-[#FFD84D] border-[#FFD84D] bg-[rgba(255,216,77,0.1)]'; // Amarillo
      case 'Perdida':
      case 'No calificada':
        return 'text-[#FF6B6B] border-[#FF6B6B] bg-[rgba(255,107,107,0.1)]'; // Rojo
      default:
        return 'text-tx2 border-tx2 bg-[rgba(157,169,192,0.1)]';
    }
  };

  // Handle opening lead notes modal
  const handleViewNotes = (lead: string, closer: string, result?: string) => {
    const leadNote = getLeadNote(lead, closer, result);
    setSelectedLeadNote(leadNote);
    setModalOpen(true);
  };

  // Handle closing modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedLeadNote(null);
  };

  // Handle opening call analysis modal
  const handleViewCallAnalysis = (call: Call) => {
    const analysis = getCallAnalysis(call.lead, call.closer, call.result);
    setSelectedCallAnalysis(analysis);
    setCallAnalysisModalOpen(true);
  };

  // Handle closing call analysis modal
  const handleCloseCallAnalysisModal = () => {
    setCallAnalysisModalOpen(false);
    setSelectedCallAnalysis(null);
  };

  // Handle search query change
  const handleSearchChange = (closerName: string, query: string) => {
    setSearchQueries(prev => ({
      ...prev,
      [closerName]: query
    }));
  };

  // Handle clear search
  const handleClearSearch = (closerName: string) => {
    setSearchQueries(prev => ({
      ...prev,
      [closerName]: ""
    }));
  };

  // Filter calls based on search query
  const getFilteredCalls = (closerName: string, calls: Call[]) => {
    const query = searchQueries[closerName] || "";
    if (!query.trim()) return calls;
    
    const normalizedQuery = normalize(query);
    return calls.filter(call => 
      normalize(call.lead || "").includes(normalizedQuery)
    );
  };

  // Export agendas for a specific closer
  const handleExportCloserCalls = (closer: Closer) => {
    const allCalls = expandedCalls[closer.closer] || [];
    const callsToExport = getFilteredCalls(closer.closer, allCalls);
    
    const data = callsToExport.map(call => {
      const analysis = getCallAnalysis(call.lead, call.closer, call.result);
      return {
        Closer: call.closer,
        Lead: call.lead,
        Fecha: fmtDateTime(call.ts),
        Estado: call.outcome,
        Resultado: call.result,
        Monto: call.amount || 0,
        Resumen: analysis.resumen,
        Notas: call.notes
      };
    });

    const filename = generateFilename(
      sanitizeFilename(`agendas_${closer.closer}`),
      dateRange.startDate,
      dateRange.endDate
    );
    exportToXlsx(filename, data, `Agendas ${closer.closer}`);
  };

  // Export all closers data
  const handleExportAllClosers = () => {
    const data = sortedClosers.map(closer => ({
      Closer: closer.closer,
      Leads: closer.leads,
      Agendas: closer.agendas,
      Shows: closer.shows,
      Ofertas: closer.offers,
      Ventas: closer.sales,
      Cash: closer.cash,
      'Porcentaje Cierre': `${pct(safeDiv(closer.sales, closer.agendas))}`,
      'Porcentaje Show': `${pct(safeDiv(closer.shows, closer.agendas))}`,
      Notas: closer.notes || ''
    }));

    const filename = generateFilename(
      'tracker_closers',
      dateRange.startDate,
      dateRange.endDate
    );
    exportToXlsx(filename, data, 'Tracker de Closers');
  };

  return (
    <div 
      className="glass glow rounded-xl p-6 shadow-lg overflow-x-auto transition-all duration-300"
      style={{
        border: '2px solid #3B82F699', // azul suave uniforme
        boxShadow: '0 0 12px #3B82F640',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.border = '2px solid #3B82F6E6';
        e.currentTarget.style.boxShadow = '0 0 18px #3B82F680';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.border = '2px solid #3B82F699';
        e.currentTarget.style.boxShadow = '0 0 12px #3B82F640';
      }}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-tx1">Tracker de Closers</h3>
        <button
          onClick={handleExportAllClosers}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg bg-white/8 hover:bg-white/12 border border-white/15 text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Exportar todo (XLSX)
        </button>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="w-8 py-3 px-2"></th>
            <th className="text-left py-3 px-2 text-tx2">Closer</th>
            <th className="text-right py-3 px-2 text-tx2">Agendas</th>
            <th className="text-right py-3 px-2 text-tx2">Shows</th>
            <th className="text-right py-3 px-2 text-tx2">Ofertas</th>
            <th className="text-right py-3 px-2 text-tx2">Ventas</th>
            <th className="text-right py-3 px-2 text-tx2">Cash</th>
            <th className="text-right py-3 px-2 text-tx2">%Cierre</th>
            <th className="text-right py-3 px-2 text-tx2">%Show</th>
            <th className="text-left py-3 px-2 text-tx2">Notas</th>
          </tr>
        </thead>
        <tbody>
          {sortedClosers.map((closer) => {
            const isOpen = openRow === closer.closer;
            const calls = expandedCalls[closer.closer] || [];
            const metrics = calls.length > 0 ? getCallMetrics(calls) : null;
            
            return (
              <React.Fragment key={closer.closer}>
                <tr 
                  className="border-t border-white/10 hover:bg-white/6 hover:ring-1 hover:ring-white/15 transition-colors cursor-pointer"
                  onClick={() => toggleRow(closer.closer)}
                  role="button"
                  tabIndex={0}
                  aria-expanded={isOpen}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleRow(closer.closer);
                    }
                  }}
                >
                  <td className="py-3 px-2 text-center">
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </td>
                  <td className="py-3 px-2 font-medium">{closer.closer}</td>
                  <td className="py-3 px-2 text-right">{closer.agendas}</td>
                  <td className="py-3 px-2 text-right">{closer.shows}</td>
                  <td className="py-3 px-2 text-right">{closer.offers}</td>
                  <td className="py-3 px-2 text-right font-semibold">{closer.sales}</td>
                  <td className="py-3 px-2 text-right">{money0(closer.cash)}</td>
                  <td className="py-3 px-2 text-right">{pct(safeDiv(closer.sales, closer.agendas))}</td>
                  <td className="py-3 px-2 text-right">{pct(safeDiv(closer.shows, closer.agendas))}</td>
                  <td className="py-3 px-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewNotes(closer.closer, closer.closer, 'Seguimiento');
                      }}
                      className="px-3 py-1 text-xs font-medium rounded-full bg-white/8 hover:bg-white/12 border border-white/15 text-white transition-colors"
                    >
                      Ver notas
                    </button>
                  </td>
                </tr>
                
                {isOpen && (
                  <tr>
                    <td colSpan={11} className="p-0">
                      <div className="bg-white/4 border border-white/10 rounded-lg mx-3 my-2">
                        {calls.length === 0 ? (
                          <div className="p-4 text-center text-tx2">
                            Generando datos...
                          </div>
                        ) : (
                          <>
                            {/* Header with metrics and search */}
                            <div className="sticky top-0 bg-white/8 border-b border-white/10 p-3 rounded-t-lg">
                              <div className="flex items-center gap-3 justify-between">
                                <div className="text-sm text-tx1 font-medium">
                                  Agendas del período · {metrics?.totalAgendas} — 
                                  Shows: {metrics?.shows} ({metrics?.tasaShow.toFixed(1)}%) — 
                                  Ventas: {metrics?.ventasDeAgendas} — 
                                  Cash: {money0(metrics?.cashDeAgendas || 0)}
                                  <span className="ml-2 text-white/50">
                                    · Mostrando {getFilteredCalls(closer.closer, calls).length} de {calls.length}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <div className="relative">
                                    <input
                                      ref={(el) => { searchInputRefs.current[closer.closer] = el; }}
                                      value={searchQueries[closer.closer] || ""}
                                      onChange={(e) => handleSearchChange(closer.closer, e.target.value)}
                                      placeholder="Buscar lead…"
                                      aria-label="Buscar lead"
                                      className="w-56 rounded-full bg-gray-100 border border-gray-300 px-3 py-1.5 text-sm placeholder:text-gray-500 focus:outline-none focus:border-gray-400 text-black"
                                    />
                                    {(searchQueries[closer.closer] || "").length > 0 && (
                                      <button
                                        onClick={() => handleClearSearch(closer.closer)}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        aria-label="Limpiar búsqueda"
                                      >
                                        ✕
                                      </button>
                                    )}
                                  </div>
                                  <button
                                    onClick={() => handleExportCloserCalls(closer)}
                                    className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded bg-white/8 hover:bg-white/12 border border-white/15 text-white transition-colors"
                                  >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Exportar agendas (XLSX)
                                  </button>
                                </div>
                              </div>
                            </div>
                            
                            {/* Calls table */}
                            <div className="p-3">
                              {(() => {
                                const filteredCalls = getFilteredCalls(closer.closer, calls);
                                
                                if (filteredCalls.length === 0 && (searchQueries[closer.closer] || "").trim()) {
                                  return (
                                    <div className="text-center text-white/60 py-8">
                                      Sin resultados para "{searchQueries[closer.closer]}"
                                    </div>
                                  );
                                }
                                
                                return (
                                  <table className="w-full text-xs">
                                    <thead>
                                      <tr className="border-b border-white/5">
                                        <th className="text-left py-2 px-1 text-tx2">Fecha</th>
                                        <th className="text-left py-2 px-1 text-tx2">Lead</th>
                                        <th className="text-center py-2 px-1 text-tx2">Asistió</th>
                                        <th className="text-center py-2 px-1 text-tx2">Ofertado</th>
                                        <th className="text-center py-2 px-1 text-tx2">Cerrado</th>
                                        <th className="text-right py-2 px-1 text-tx2">Cash</th>
                                        <th className="text-right py-2 px-1 text-tx2">Facturación</th>
                                        <th className="text-center py-2 px-1 text-tx2">Notas</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {filteredCalls.map((call) => {
                                        const asistio = call.outcome === 'Show';
                                        const ofertado = call.result === 'Venta' || call.result === 'Oferta';
                                        const cerrado = call.result === 'Venta';
                                        const cash = call.amount || 0;
                                        const facturacion = cerrado ? cash : 0;
                                        
                                        return (
                                          <tr 
                                            key={call.id} 
                                            className="border-t border-white/5 hover:bg-white/6 hover:ring-1 hover:ring-white/15 transition-colors"
                                          >
                                            <td className="py-2 px-1 text-tx1">{fmtDate(call.ts)}</td>
                                            <td className="py-2 px-1 whitespace-nowrap">
                                              <span 
                                                className="text-white/90 cursor-pointer" 
                                                title={maskPhone(call.phone)}
                                              >
                                                {call.lead}
                                              </span>
                                            </td>
                                            <td className="py-2 px-1 text-center">
                                              <span className={`inline-block px-2 py-1 text-xs rounded-full font-semibold ${
                                                asistio 
                                                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                                                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                              }`}>
                                                {asistio ? 'Sí' : 'No'}
                                              </span>
                                            </td>
                                            <td className="py-2 px-1 text-center">
                                              <span className={`inline-block px-2 py-1 text-xs rounded-full font-semibold ${
                                                ofertado 
                                                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                                                  : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                                              }`}>
                                                {ofertado ? 'Sí' : 'No'}
                                              </span>
                                            </td>
                                            <td className="py-2 px-1 text-center">
                                              <span className={`inline-block px-2 py-1 text-xs rounded-full font-semibold ${
                                                cerrado 
                                                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                                                  : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                                              }`}>
                                                {cerrado ? 'Sí' : 'No'}
                                              </span>
                                            </td>
                                            <td className="py-2 px-1 text-right text-tx1">{money0(cash)}</td>
                                            <td className="py-2 px-1 text-right text-tx1">{money0(facturacion)}</td>
                                            <td className="py-2 px-1 text-center">
                                              <button
                                                onClick={() => handleViewCallAnalysis(call)}
                                                className="px-2 py-1 text-xs font-medium rounded bg-white/8 hover:bg-white/12 border border-white/15 text-white transition-colors"
                                              >
                                                Ver notas
                                              </button>
                                            </td>
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                  </table>
                                );
                              })()}
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
      
      {/* Lead Notes Modal */}
      {selectedLeadNote && (
        <LeadNotesModal
          isOpen={modalOpen}
          onClose={handleCloseModal}
          leadNote={selectedLeadNote}
        />
      )}

      {/* Call Analysis Modal */}
      {selectedCallAnalysis && (
        <CallAnalysisModal
          isOpen={callAnalysisModalOpen}
          onClose={handleCloseCallAnalysisModal}
          callNote={selectedCallAnalysis}
        />
      )}
    </div>
  );
} 