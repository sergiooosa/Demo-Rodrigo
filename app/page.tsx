'use client';

import { useState, useEffect } from 'react';
import adsData from '../data/ads.json';
import methodsData from '../data/methods.json';
import closersData from '../data/closers.json';
import { Ad, Method, Closer, DateFilterType, DateRange } from '../types';
import { sum, safeDiv, money0, money2, pct, x, getRandomVariation, getBadge } from '../utils/helpers';
import { getDefaultDateRange } from '../utils/dateFilters';

// Components
import Section from '../components/Section';
import KpiCard from '../components/KpiCard';
import TableAds from '../components/TableAds';
import TableMethods from '../components/TableMethods';
import TableClosers from '../components/TableClosers';
import BarCashVsSpend from '../components/BarCashVsSpend';
import ROASChart from '../components/ROASChart';
import DateFilter from '../components/DateFilter';
import MethodSummaryCards from '../components/MethodSummaryCards';
import ChatWidget from '../components/ChatWidget';

export default function Dashboard() {
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<DateFilterType>('30days');
  const [dateRange, setDateRange] = useState<DateRange>(getDefaultDateRange());
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);

  useEffect(() => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/New_York'
    };
    setLastUpdate(now.toLocaleString('es-ES', options));
  }, []);

  const handleFilterChange = (filterType: DateFilterType, range: DateRange) => {
    setActiveFilter(filterType);
    setDateRange(range);
  };

  // Lista de clientes/negocios
  const clients = [
    { id: 'cliente1', name: 'Digital Marketing Academy', industry: 'Cursos Online' },
    { id: 'cliente2', name: 'Business Coaching Pro', industry: 'Coaching Ejecutivo' },
    { id: 'cliente3', name: 'Leadership Consultancy', industry: 'Consultoría' },
    { id: 'cliente4', name: 'Sales Mastery Course', industry: 'Cursos de Ventas' },
    { id: 'cliente5', name: 'Entrepreneur Institute', industry: 'Coaching Empresarial' },
    { id: 'cliente6', name: 'Financial Advisory Pro', industry: 'Consultoría Financiera' },
    { id: 'cliente7', name: 'Personal Development Hub', industry: 'Coaching Personal' },
    { id: 'cliente8', name: 'Marketing Strategy Lab', industry: 'Consultoría Marketing' },
    { id: 'cliente9', name: 'Success Mindset Academy', industry: 'Cursos de Desarrollo' },
    { id: 'cliente10', name: 'Business Growth Coach', industry: 'Coaching de Negocios' }
  ];

  const handleClientSelect = (clientId: string) => {
    setSelectedClient(clientId);
  };

  const handleBackToClients = () => {
    setSelectedClient(null);
  };

  // Función para generar datos personalizados por cliente
  const getClientData = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    const baseMultiplier = Math.random() * 0.5 + 0.75; // Entre 0.75 y 1.25
    
    // Datos reales de los anuncios (Testing)
    const realInvestment = 4800;
    const realImpressions = 45000;
    const realCtr = 2.8;
    const realVslPlayRate = 65.2;
    const realVslEngagement = 35.2;
    const realMeetingsScheduled = 156; // AgendasQ total (20+30+35+8+9+25+22+7)
    const realMeetingsQualified = 129; // ShowsQ total (17+25+28+7+8+20+18+6)
    const realMeetingsAttended = 129; // ShowsQ total (mismo que calificadas)
    const realCallsClosed = 46; // Ventas totales (0+8+6+6+7+8+7+4)
    const realRevenue = 94000; // Cash total
    const realCash = 94000; // Cash total
    const realAvgTicket = Math.round(94000 / 46); // Cash / Ventas
    
    return {
      name: client?.name || 'Cliente',
      industry: client?.industry || 'Negocio',
      investment: Math.round(realInvestment * baseMultiplier),
      impressions: Math.round(realImpressions * baseMultiplier),
      ctr: (realCtr * baseMultiplier).toFixed(1),
      vslPlayRate: (realVslPlayRate * baseMultiplier).toFixed(1),
      vslEngagement: (realVslEngagement * baseMultiplier).toFixed(1),
      meetingsScheduled: Math.round(realMeetingsScheduled * baseMultiplier),
      meetingsQualified: Math.round(realMeetingsQualified * baseMultiplier),
      meetingsAttended: Math.round(realMeetingsAttended * baseMultiplier),
      callsClosed: Math.round(realCallsClosed * baseMultiplier),
      revenue: Math.round(realRevenue * baseMultiplier),
      cash: Math.round(realCash * baseMultiplier),
      avgTicket: Math.round(realAvgTicket * baseMultiplier)
    };
  };

  const clientData = selectedClient ? getClientData(selectedClient) : null;

  // Si no hay cliente seleccionado, mostrar la lista de clientes
  if (!selectedClient) {
    return (
      <div className="min-h-screen">
        {/* Header */}
        <header className="glass border-b border-border p-6 mb-8">
          <div className="max-w-7xl mx-auto">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-tx1">autoKpi</h1>
                  <p className="text-sm text-tx2">Dashboard Tracker</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center text-sm text-tx2">
              <span>Última actualización: {lastUpdate}</span>
            </div>
          </div>
        </header>

        {/* Sección de Saludo Separada */}
        <div className="max-w-7xl mx-auto px-6 mb-8">
          <div className="glass p-8 rounded-xl text-center">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-2 animate-pulse">
              Dashboard Tracker
            </h2>
            <p className="text-lg text-tx2">¿Qué cliente quieres revisar hoy?</p>
          </div>
        </div>

        {/* Lista de Clientes */}
        <main className="max-w-7xl mx-auto px-6 pb-12">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-tx1 mb-2">Clientes</h2>
            <p className="text-tx2">Selecciona un cliente para ver su dashboard personalizado</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {clients.map((client) => (
              <div
                key={client.id}
                onClick={() => handleClientSelect(client.id)}
                className="glass p-6 rounded-xl cursor-pointer hover:scale-105 transition-all duration-200 hover:shadow-lg border border-border hover:border-blue-400/50"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-xl">
                      {client.name.split(' ').map(word => word[0]).join('')}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-tx1 mb-2">{client.name}</h3>
                  <p className="text-sm text-tx2 mb-4">{client.industry}</p>
                  <div className="text-xs text-blue-400 font-medium">
                    Ver Dashboard →
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // Si hay cliente seleccionado, mostrar el dashboard personalizado
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="glass border-b border-border p-6 mb-8">
        <div className="max-w-7xl mx-auto">
          {/* Logo y Navegación */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-tx1">autoKpi</h1>
                <p className="text-sm text-tx2">Dashboard - {clients.find(c => c.id === selectedClient)?.name}</p>
              </div>
            </div>
            <button
              onClick={handleBackToClients}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver a Clientes
            </button>
          </div>
          
          <div className="flex justify-center text-sm text-tx2">
            <span>Última actualización: {lastUpdate}</span>
          </div>
          <div className="text-xs text-tx2 mt-1">
            Datos filtrados por rango de fechas seleccionado
          </div>
        </div>
      </header>

      {/* Sección de Saludo Separada */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <div className="glass p-8 rounded-xl text-center">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent mb-2 animate-pulse">
            Dashboard Personalizado
          </h2>
          <p className="text-lg text-tx2">Dashboard personalizado de {clients.find(c => c.id === selectedClient)?.name}</p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 pb-12">
        {/* Date Filter Section */}
        <DateFilter
          activeFilter={activeFilter}
          dateRange={dateRange}
          onFilterChange={handleFilterChange}
        />

        {/* SECCIÓN 1 — TOTAL (Adquisición) */}
        <Section title={`TOTAL (Adquisición) - ${clientData?.name}`}>
          <div className="space-y-6">
            {/* Fila 1: Métricas Principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <KpiCard
                title="Inversión en publicidad"
                value={`$${clientData?.investment?.toLocaleString() || '0'}`}
                variation="+15% vs mes anterior"
              />
              <KpiCard
                title="Impresiones"
                value={clientData?.impressions?.toLocaleString() || '0'}
                variation="+8% vs mes anterior"
              />
              <KpiCard
                title="CTR"
                value={`${clientData?.ctr}%`}
                variation="+0.3% vs mes anterior"
              />
              <KpiCard
                title="VSL PLAY RATE %"
                value={`${clientData?.vslPlayRate}%`}
                variation="+2.1% vs mes anterior"
              />
            </div>
            
            {/* Fila 2: Métricas de Engagement y Reuniones */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <KpiCard
                title="VSL ENGAGEMENT %"
                value={`${clientData?.vslEngagement}%`}
                variation="+1.8% vs mes anterior"
              />
              <KpiCard
                title="Reuniones agendadas"
                value={clientData?.meetingsScheduled?.toString() || '0'}
                variation="+12% vs mes anterior"
              />
              <KpiCard
                title="Reuniones calificadas"
                value={clientData?.meetingsQualified?.toString() || '0'}
                variation="+15% vs mes anterior"
              />
              <KpiCard
                title="Reuniones asistidas (show rate)"
                value={`${clientData?.meetingsAttended || 0} (${clientData?.meetingsQualified ? ((clientData.meetingsAttended / clientData.meetingsQualified) * 100).toFixed(1) : '0.0'}%)`}
                variation="+15% vs mes anterior"
              />
            </div>

            {/* Fila 3: Llamadas cerradas y Métricas Financieras */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <KpiCard
                title="Llamadas cerradas (close rate)"
                value={`${clientData?.callsClosed || 0} (${clientData?.meetingsAttended ? ((clientData.callsClosed / clientData.meetingsAttended) * 100).toFixed(1) : '0.0'}%)`}
                variation="+8% vs mes anterior"
              />
              <KpiCard
                title="Facturación"
                value={`$${clientData?.revenue?.toLocaleString() || '0'}`}
                variation="+18.5% vs mes anterior"
              />
              <KpiCard
                title="Cash Collected"
                value={`$${clientData?.cash?.toLocaleString() || '0'}`}
                variation="+22.1% vs mes anterior"
              />
              <KpiCard
                title="Ticket promedio"
                value={`$${clientData?.avgTicket?.toLocaleString() || '0'}`}
                variation="+5.7% vs mes anterior"
              />
            </div>

            {/* Fila 4: Métricas de Costos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <KpiCard
                title="Costo por agenda calificada"
                value={`$${clientData?.investment && clientData?.meetingsQualified ? (clientData.investment / clientData.meetingsQualified).toFixed(2) : '0.00'}`}
                variation="-8.3% vs mes anterior"
              />
              <KpiCard
                title="Costo por show"
                value={`$${clientData?.investment && clientData?.meetingsAttended ? (clientData.investment / clientData.meetingsAttended).toFixed(2) : '0.00'}`}
                variation="-12.1% vs mes anterior"
              />
              <KpiCard
                title="Costo por adquisición (CAC)"
                value={`$${clientData?.investment && clientData?.callsClosed ? (clientData.investment / clientData.callsClosed).toFixed(2) : '0.00'}`}
                variation="-6.8% vs mes anterior"
              />
              <KpiCard
                title="ROAS"
                value={`${clientData?.revenue && clientData?.investment ? (clientData.revenue / clientData.investment).toFixed(1) : '0.0'}x`}
                variation="+0.4x vs mes anterior"
              />
            </div>
          </div>
        </Section>

        {/* SECCIÓN 2 — MÉTRICAS DE ANUNCIOS */}
        <Section title="MÉTRICAS DE ANUNCIOS">
          <div className="space-y-8">
            {/* Table Ads con desglose por campaña */}
            <TableAds ads={adsData as Ad[]} />
            
            {/* Resumen por medio (sin tarjetas duplicadas) */}
            <TableMethods methods={methodsData as Method[]} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <BarCashVsSpend methods={methodsData as Method[]} />
              <ROASChart methods={methodsData as Method[]} />
            </div>
          </div>
        </Section>

        {/* SECCIÓN 3 — VENTAS (Tracker de Closers) */}
        <Section title="VENTAS (Tracker de Closers)">
          <div className="space-y-8">
            {/* Tabla de closers - se mantiene visible */}
            <TableClosers closers={closersData as Closer[]} dateRange={dateRange} />
          </div>
        </Section>
      </main>

      {/* Chat Button */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-40 group"
        >
          <svg className="w-6 h-6 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      )}

      {/* Chat Widget */}
      <ChatWidget 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />
    </div>
  );
}