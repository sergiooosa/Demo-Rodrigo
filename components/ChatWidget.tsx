import React, { useState, useRef, useEffect } from 'react';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

// Datos simulados para el análisis
const adsData = [
  { 
    adId:"FB-01",
    adName:"Testing",
    medium:"Meta Ads",
    spend:4800,
    impressions:45000,
    ctr:1.8,
    agendas:200,
    agendasQ:156,
    showsQ:129,
    sales:52,
    cash:89100,
    campaigns:[
      {"name":"H1","spend":500,"impressions":8000,"ctr":2.1,"agendasQ":20,"showsQ":17,"sales":0,"cash":0,"roas":0},
      {"name":"H2","spend":600,"impressions":9000,"ctr":1.9,"agendasQ":30,"showsQ":25,"sales":8,"cash":8000,"roas":13.3},
      {"name":"H3","spend":550,"impressions":8500,"ctr":1.7,"agendasQ":35,"showsQ":28,"sales":6,"cash":1100,"roas":2.0},
      {"name":"H4","spend":650,"impressions":9500,"ctr":1.5,"agendasQ":8,"showsQ":7,"sales":6,"cash":18000,"roas":27.7},
      {"name":"H5","spend":700,"impressions":10000,"ctr":1.8,"agendasQ":9,"showsQ":8,"sales":7,"cash":20000,"roas":28.6},
      {"name":"H6","spend":600,"impressions":9000,"ctr":2.0,"agendasQ":25,"showsQ":20,"sales":8,"cash":16000,"roas":26.7},
      {"name":"H7","spend":550,"impressions":8500,"ctr":1.6,"agendasQ":22,"showsQ":18,"sales":7,"cash":14000,"roas":25.5},
      {"name":"H8","spend":650,"impressions":9500,"ctr":1.4,"agendasQ":7,"showsQ":6,"sales":4,"cash":12000,"roas":18.5}
    ]
  }
];

const closersData = [
  { "closer":"Juan Díaz","leads":120,"agendas":95,"shows":72,"offers":55,"sales":24,"cash":6900,"notes":"" },
  { "closer":"Ana Pérez","leads":110,"agendas":88,"shows":70,"offers":48,"sales":21,"cash":6200,"notes":"" },
  { "closer":"Luis R.","leads":95,"agendas":76,"shows":60,"offers":44,"sales":18,"cash":5400,"notes":"" }
];

const methodsData = [
  { "method":"Meta Ads","spend":4200,"agendas":210,"agendasQ":165,"showsQ":132,"sales":41,"cash":10800,"billing":12500 },
  { "method":"Prospección","spend":0,"messages":320,"agendas":80,"agendasQ":64,"showsQ":51,"sales":16,"cash":4300,"billing":4300 },
  { "method":"Orgánico","spend":0,"videos":18,"agendas":60,"agendasQ":48,"showsQ":39,"sales":11,"cash":3000,"billing":3000 }
];

// Métricas simuladas del VSL (timeline de engagement por minuto)
const vslMetrics = {
  playRatePct: 65.0,
  engagementPct: 35.0,
  // Porcentaje de audiencia retenida por minuto 0..9 (10 min)
  retentionByMinutePct: [100, 78, 55, 34, 28, 24, 20, 18, 16, 15],
  // Minuto donde cae ~50% de la audiencia
  majorDropMinute: 3 // Se cae al 34% en el minuto 3
};

export default function ChatWidget({ isOpen, onClose }: ChatWidgetProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: '¡Hola! Soy tu asistente de datos inteligente. Puedo analizar tus campañas, identificar anuncios ganadores, recomendar qué apagar, y darte insights sobre el rendimiento de tus closers. ¿Qué quieres saber?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Función para analizar la pregunta y generar respuesta inteligente
  const analyzeQuestion = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    // Análisis de anuncios ganadores
    if (lowerQuestion.includes('anuncio ganador') || lowerQuestion.includes('mejor anuncio') || lowerQuestion.includes('campaña ganadora')) {
      const bestCampaign = adsData[0].campaigns.reduce((best, current) => 
        current.roas > best.roas ? current : best
      );
      return `🏆 **Tu anuncio ganador es H5** con un ROAS de ${bestCampaign.roas}x\n\n**¿Por qué es el ganador?**\n• ROAS más alto: ${bestCampaign.roas}x\n• Cash generado: $${bestCampaign.cash.toLocaleString()}\n• 7 ventas cerradas\n• Inversión: $${bestCampaign.spend}\n• CTR: ${bestCampaign.ctr}%\n\n**Recomendación:** Escala este anuncio aumentando el presupuesto en un 20-30% para maximizar resultados.`;
    }
    
    // Análisis de anuncios a apagar (múltiples variantes)
    if (lowerQuestion.includes('apagar') || lowerQuestion.includes('pausar') || lowerQuestion.includes('quitar') || 
        lowerQuestion.includes('no me rinde') || lowerQuestion.includes('no rinde') || lowerQuestion.includes('no rendimiento')) {
      const worstCampaign = adsData[0].campaigns.reduce((worst, current) => 
        current.roas < worst.roas ? current : worst
      );
      const lowPerformingCampaigns = adsData[0].campaigns.filter(c => c.roas < 10);
      
      // Análisis de costo por adquisición
      const campaignsWithCAC = adsData[0].campaigns.map(c => ({
        ...c,
        cac: c.sales > 0 ? c.spend / c.sales : Infinity,
        showRate: c.showsQ / c.agendasQ * 100,
        closeRate: c.sales / c.showsQ * 100
      }));
      
      const worstCAC = campaignsWithCAC.reduce((worst, current) => 
        current.cac < worst.cac ? current : worst
      );
      
      return `🚨 **ANUNCIOS A APAGAR - Análisis Completo:**\n\n**1. Por ROAS (Retorno):**\n• **${worstCampaign.name}** - ROAS ${worstCampaign.roas}x (CRÍTICO)\n• Gasto: $${worstCampaign.spend} sin retorno\n\n**2. Por Costo de Adquisición:**\n• **${worstCAC.name}** - CAC $${worstCAC.cac.toFixed(2)} por venta\n• Muy alto costo vs otros anuncios\n\n**3. Por Asistencia (No-Shows):**\n${campaignsWithCAC.map(c => 
        `• ${c.name}: Show rate ${c.showRate.toFixed(1)}% (${c.agendasQ} agendas → ${c.showsQ} shows)`
      ).join('\n')}\n\n**4. Por Calidad de Leads:**\n${campaignsWithCAC.map(c => 
        `• ${c.name}: Close rate ${c.closeRate.toFixed(1)}% (${c.showsQ} shows → ${c.sales} ventas)`
      ).join('\n')}\n\n**🎯 RECOMENDACIÓN FINAL:**\nPausa **${worstCampaign.name}** y **${worstCAC.name}** inmediatamente. Redistribuye presupuesto hacia H4, H5, H6 (ROAS 25x+).`;
    }
    
    // Análisis específico de asistencia (no-shows)
    if (lowerQuestion.includes('no asisten') || lowerQuestion.includes('no asistencia') || lowerQuestion.includes('no-show') || 
        lowerQuestion.includes('personas que no asisten') || lowerQuestion.includes('no shows')) {
      const campaignsWithShows = adsData[0].campaigns.map(c => ({
        ...c,
        showRate: (c.showsQ / c.agendasQ) * 100,
        noShowRate: ((c.agendasQ - c.showsQ) / c.agendasQ) * 100
      }));
      
      const worstShowRate = campaignsWithShows.reduce((worst, current) => 
        current.showRate < worst.showRate ? current : worst
      );
      
      return `📊 **ANÁLISIS DE ASISTENCIA (No-Shows):**\n\n**🚨 Peor en asistencia:** ${worstShowRate.name}\n• Show rate: ${worstShowRate.showRate.toFixed(1)}%\n• No-show rate: ${worstShowRate.noShowRate.toFixed(1)}%\n• ${worstShowRate.agendasQ} agendas → solo ${worstShowRate.showsQ} shows\n\n**Comparativa por campaña:**\n${campaignsWithShows.map(c => 
        `• ${c.name}: ${c.showsQ}/${c.agendasQ} shows (${c.showRate.toFixed(1)}% asistencia)`
      ).join('\n')}\n\n**🎯 RECOMENDACIÓN:** ${worstShowRate.name} trae leads que no asisten. Revisa el targeting y la calidad del mensaje.`;
    }
    
    // Análisis específico de calidad de leads (no compran)
    if (lowerQuestion.includes('no compran') || lowerQuestion.includes('no compra') || lowerQuestion.includes('leads que no compran') || 
        lowerQuestion.includes('calidad de leads') || lowerQuestion.includes('leads de baja calidad')) {
      const campaignsWithCloseRate = adsData[0].campaigns.map(c => ({
        ...c,
        closeRate: (c.sales / c.showsQ) * 100,
        leadQuality: c.sales / c.agendasQ * 100
      }));
      
      const worstCloseRate = campaignsWithCloseRate.reduce((worst, current) => 
        current.closeRate < worst.closeRate ? current : worst
      );
      
      return `💰 **ANÁLISIS DE CALIDAD DE LEADS:**\n\n**🚨 Peor en conversión:** ${worstCloseRate.name}\n• Close rate: ${worstCloseRate.closeRate.toFixed(1)}%\n• Calidad de leads: ${worstCloseRate.leadQuality.toFixed(1)}%\n• ${worstCloseRate.showsQ} shows → solo ${worstCloseRate.sales} ventas\n\n**Comparativa por campaña:**\n${campaignsWithCloseRate.map(c => 
        `• ${c.name}: ${c.sales}/${c.showsQ} ventas (${c.closeRate.toFixed(1)}% close rate)`
      ).join('\n')}\n\n**🎯 RECOMENDACIÓN:** ${worstCloseRate.name} trae leads que no compran. Revisa el targeting y el mensaje para atraer mejor audiencia.`;
    }
    
    // Análisis de mejor tasa de cierre
    if (lowerQuestion.includes('mejor tasa de cierre') || lowerQuestion.includes('mejor cierre') || lowerQuestion.includes('mejor conversión')) {
      const campaignsWithCloseRate = adsData[0].campaigns.map(c => ({
        ...c,
        closeRate: (c.sales / c.showsQ) * 100
      }));
      
      const bestCloseRate = campaignsWithCloseRate.reduce((best, current) => 
        current.closeRate > best.closeRate ? current : best
      );
      
      return `🏆 **MEJOR TASA DE CIERRE:**\n\n**Ganador:** ${bestCloseRate.name}\n• Close rate: ${bestCloseRate.closeRate.toFixed(1)}%\n• ${bestCloseRate.sales} ventas de ${bestCloseRate.showsQ} shows\n• Cash generado: $${bestCloseRate.cash.toLocaleString()}\n\n**Ranking completo:**\n${campaignsWithCloseRate.sort((a, b) => b.closeRate - a.closeRate).map((c, i) => 
        `${i + 1}. ${c.name}: ${c.closeRate.toFixed(1)}% (${c.sales}/${c.showsQ})`
      ).join('\n')}\n\n**🎯 RECOMENDACIÓN:** Duplica la estrategia de ${bestCloseRate.name} en otras campañas.`;
    }
    
    // Análisis de closers (múltiples variantes)
    if (lowerQuestion.includes('closer') || lowerQuestion.includes('vendedor') || lowerQuestion.includes('ventas') || 
        lowerQuestion.includes('tasa de cierre') || lowerQuestion.includes('peor tasa') || lowerQuestion.includes('mejor tasa') ||
        lowerQuestion.includes('facturó más') || lowerQuestion.includes('desaprovechó') || lowerQuestion.includes('no-show')) {
      
      const closersWithRates = closersData.map(closer => ({
        ...closer,
        closeRate: ((closer.sales / closer.shows) * 100).toFixed(1),
        showRate: ((closer.shows / closer.agendas) * 100).toFixed(1),
        noShowRate: (((closer.agendas - closer.shows) / closer.agendas) * 100).toFixed(1),
        wastedAgendas: closer.agendas - closer.sales
      }));
      
      const bestCloser = closersWithRates.reduce((best, current) => 
        parseFloat(current.closeRate) > parseFloat(best.closeRate) ? current : best
      );
      const worstCloser = closersWithRates.reduce((worst, current) => 
        parseFloat(current.closeRate) < parseFloat(worst.closeRate) ? current : worst
      );
      const topEarner = closersWithRates.reduce((best, current) => 
        current.cash > best.cash ? current : best
      );
      const worstNoShow = closersWithRates.reduce((worst, current) => 
        parseFloat(current.noShowRate) > parseFloat(worst.noShowRate) ? current : worst
      );
      const mostWasted = closersWithRates.reduce((worst, current) => 
        current.wastedAgendas > worst.wastedAgendas ? current : worst
      );
      
      return `👥 **ANÁLISIS COMPLETO DE CLOSERS:**\n\n**🏆 Mejor tasa de cierre:** ${bestCloser.closer}\n• Close rate: ${bestCloser.closeRate}%\n• ${bestCloser.sales} ventas de ${bestCloser.shows} shows\n\n**💰 Más facturó:** ${topEarner.closer}\n• Cash: $${topEarner.cash.toLocaleString()}\n• Ventas: ${topEarner.sales}\n\n**🚨 Peor tasa de cierre:** ${worstCloser.closer}\n• Close rate: ${worstCloser.closeRate}% (CRÍTICO)\n• Solo ${worstCloser.sales} ventas\n\n**❌ Más no-shows:** ${worstNoShow.closer}\n• No-show rate: ${worstNoShow.noShowRate}%\n• ${worstNoShow.agendas} agendas → ${worstNoShow.shows} shows\n\n**💸 Más desaprovechó agendas:** ${mostWasted.closer}\n• ${mostWasted.wastedAgendas} agendas perdidas\n• ${mostWasted.agendas} total → ${mostWasted.sales} ventas\n\n**🎯 RECOMENDACIONES:**\n• Entrenar a ${worstCloser.closer} con técnicas de ${bestCloser.closer}\n• Dar más leads a ${bestCloser.closer} y ${topEarner.closer}\n• Ultimátum a ${worstCloser.closer} y ${mostWasted.closer}`;
    }
    
    // Análisis de ROAS
    if (lowerQuestion.includes('roas') || lowerQuestion.includes('retorno')) {
      const totalSpend = adsData[0].spend;
      const totalCash = adsData[0].cash;
      const overallROAS = (totalCash / totalSpend).toFixed(1);
      
      return `💰 **Análisis de ROAS:**\n\n**ROAS General:** ${overallROAS}x\n• Inversión total: $${totalSpend.toLocaleString()}\n• Cash generado: $${totalCash.toLocaleString()}\n\n**ROAS por campaña:**\n${adsData[0].campaigns.map(c => 
        `• ${c.name}: ${c.roas}x ($${c.cash.toLocaleString()})`
      ).join('\n')}\n\n**Interpretación:** Un ROAS de ${overallROAS}x significa que por cada $1 invertido, generas $${overallROAS} en ventas. ¡Excelente rendimiento!`;
    }
    
    // Análisis de CTR
    if (lowerQuestion.includes('ctr') || lowerQuestion.includes('click')) {
      const avgCTR = (adsData[0].campaigns.reduce((sum, c) => sum + c.ctr, 0) / adsData[0].campaigns.length).toFixed(1);
      const bestCTR = adsData[0].campaigns.reduce((best, current) => 
        current.ctr > best.ctr ? current : best
      );
      
      return `🎯 **Análisis de CTR:**\n\n**CTR Promedio:** ${avgCTR}%\n**Mejor CTR:** ${bestCTR.name} con ${bestCTR.ctr}%\n\n**CTR por campaña:**\n${adsData[0].campaigns.map(c => 
        `• ${c.name}: ${c.ctr}%`
      ).join('\n')}\n\n**Benchmark:** Un CTR del 1-2% es bueno para Meta Ads. ${bestCTR.name} está por encima del promedio. Considera usar su creatividad en otras campañas.`;
    }
    
    // Análisis de métodos
    if (lowerQuestion.includes('método') || lowerQuestion.includes('canal') || lowerQuestion.includes('medio')) {
      const bestMethod = methodsData.reduce((best, current) => 
        (current.cash / (current.spend || 1)) > (best.cash / (best.spend || 1)) ? current : best
      );
      
      return `📈 **Análisis de Métodos:**\n\n**Mejor método:** ${bestMethod.method}\n• Cash: $${bestMethod.cash.toLocaleString()}\n• Ventas: ${bestMethod.sales}\n• Inversión: $${bestMethod.spend.toLocaleString()}\n• ROAS: ${bestMethod.spend > 0 ? (bestMethod.cash / bestMethod.spend).toFixed(1) : '∞'}x\n\n**Comparativa:**\n${methodsData.map(m => 
        `• ${m.method}: $${m.cash.toLocaleString()} (${m.sales} ventas)`
      ).join('\n')}\n\n**Recomendación:** ${bestMethod.method} es tu canal más efectivo. Considera aumentar la inversión en este método.`;
    }

    // Recomendaciones para vender más
    if (lowerQuestion.includes('vender más') || lowerQuestion.includes('vender mas') || lowerQuestion.includes('recomendaciones para vender')) {
      const lowPerforming = adsData[0].campaigns.filter(c => c.roas < 10);
      const best = adsData[0].campaigns.reduce((b, c) => c.roas > b.roas ? c : b);
      const totalLowSpend = lowPerforming.reduce((sum, c) => sum + c.spend, 0);
      const toPauseList = lowPerforming.map(c => `${c.name} (ROAS ${c.roas}x, $${c.spend})`).join(', ');
      return `🚀 **Plan para vender más (acciones directas):**\n\n1) **Apaga:** ${toPauseList || '—'}\n2) **Mete ese presupuesto en:** ${best.name} (ROAS ${best.roas}x)\n3) **Por qué:** Maximiza retorno moviendo $${totalLowSpend} de campañas sin resultados hacia la campaña top.\n4) **Siguiente paso:** Revisa creatividades del top performer y duplica con 20-30% más presupuesto.`;
    }

    // Detección de cuello de botella (ads -> VSL -> citas -> shows -> cierre)
    if (lowerQuestion.includes('cuello de botella') || lowerQuestion.includes('bottleneck')) {
      const avgCTR = (adsData[0].campaigns.reduce((sum, c) => sum + c.ctr, 0) / adsData[0].campaigns.length).toFixed(1);
      const engagement = vslMetrics.engagementPct.toFixed(1);
      const dropMinute = vslMetrics.majorDropMinute;
      const retentionAtDrop = vslMetrics.retentionByMinutePct[dropMinute];
      return `🧪 **Cuello de botella detectado:**\n\n• **Ads (CTR):** ${avgCTR}% (saludable)\n• **VSL (engagement):** ${engagement}% (BAJO)\n• **Pérdida masiva:** Minuto ${dropMinute} — retención al ${retentionAtDrop}%\n• **Pipeline:** Citas y shows razonables; el problema aparece antes del call.\n\n🎯 **Qué cambiar ahora:**\n• Re-editar el VSL desde el minuto ${dropMinute - 1} al ${dropMinute + 1}.\n• **Cambia el minuto ${dropMinute}**: ahí se va ~50% de las personas.\n• Agrega patrón-interrupt, beneficio 1-2 frases antes del CTA, y prueba otro hook.\n• Mantén duración similar; enfoca en claridad de la promesa y prueba social.\n\n💡 **Siguiente experimento:** 2 nuevas versiones del VSL cambiando solo esa sección; mide retención minuto a minuto en 72h.`;
    }

    // Análisis de cambios recomendados
    if (lowerQuestion.includes('cambio') || lowerQuestion.includes('cambios') || lowerQuestion.includes('recomendación') || lowerQuestion.includes('recomendaciones')) {
      const worstCampaign = adsData[0].campaigns.reduce((worst, current) => 
        current.roas < worst.roas ? current : worst
      );
      const bestCampaign = adsData[0].campaigns.reduce((best, current) => 
        current.roas > best.roas ? current : best
      );
      const closersWithRates = closersData.map(closer => ({
        ...closer,
        closeRate: ((closer.sales / closer.shows) * 100).toFixed(1)
      }));
      const worstCloser = closersWithRates.reduce((worst, current) => 
        parseFloat(current.closeRate) < parseFloat(worst.closeRate) ? current : worst
      );
      
      const totalLowPerformingSpend = lowPerformingCampaigns.reduce((sum, c) => sum + c.spend, 0);
      
      return `🎯 **CAMBIOS RECOMENDADOS URGENTES:**\n\n**🚨 1. APAGAR ANUNCIOS:**\n• **H1** - ROAS 0x (CRÍTICO)\n• **H3** - ROAS 2.0x (MUY BAJO)\n• Gasto total: $${totalLowPerformingSpend} con mal retorno\n• **ACCIÓN:** Pausar H1 y H3 inmediatamente\n\n**📈 2. ESCALAR ANUNCIOS:**\n• **${bestCampaign.name}** - ROAS ${bestCampaign.roas}x\n• **ACCIÓN:** Aumentar presupuesto 30%\n\n**👥 3. REVISAR CLOSERS:**\n• **${worstCloser.closer}** - Close rate ${worstCloser.closeRate}%\n• **ACCIÓN:** Ultimátum 30 días o reemplazo\n\n**💰 IMPACTO ESTIMADO:**\n• Ahorro inmediato: $${totalLowPerformingSpend}\n• Potencial ganancia: +$${Math.round(bestCampaign.cash * 0.3)}\n• Mejora en ventas: +20-30%`;
    }
    
    // Análisis específico de despido de closers
    if (lowerQuestion.includes('despedir') || lowerQuestion.includes('despido') || lowerQuestion.includes('mala tasa') || lowerQuestion.includes('mal rendimiento')) {
      const closersWithRates = closersData.map(closer => ({
        ...closer,
        closeRate: ((closer.sales / closer.shows) * 100).toFixed(1),
        showRate: ((closer.shows / closer.agendas) * 100).toFixed(1)
      }));
      
      const worstCloser = closersWithRates.reduce((worst, current) => 
        parseFloat(current.closeRate) < parseFloat(worst.closeRate) ? current : worst
      );
      
      const avgCloseRate = (closersWithRates.reduce((sum, c) => sum + parseFloat(c.closeRate), 0) / closersWithRates.length).toFixed(1);
      
      return `🚨 **ANÁLISIS DE DESPIDO - ${worstCloser.closer}:**\n\n**📊 MÉTRICAS CRÍTICAS:**\n• Close rate: ${worstCloser.closeRate}% (Promedio: ${avgCloseRate}%)\n• Ventas: ${worstCloser.sales} (Muy bajo)\n• Cash generado: $${worstCloser.cash.toLocaleString()}\n• Show rate: ${worstCloser.showRate}%\n\n**⚠️ PROBLEMAS IDENTIFICADOS:**\n• Close rate ${(parseFloat(avgCloseRate) - parseFloat(worstCloser.closeRate)).toFixed(1)}% por debajo del promedio\n• Genera solo $${worstCloser.cash.toLocaleString()} vs promedio de $${Math.round(closersData.reduce((sum, c) => sum + c.cash, 0) / closersData.length).toLocaleString()}\n• Performance consistente baja\n\n**🎯 RECOMENDACIÓN:**\n**DESPEDIR** - ${worstCloser.closer} está costando dinero al negocio. Su close rate de ${worstCloser.closeRate}% es inaceptable. Reemplazar con nuevo talento o redistribuir leads a closers top performers.`;
    }
    
    // Preguntas generales
    if (lowerQuestion.includes('ayuda') || lowerQuestion.includes('help')) {
      return `🤖 **Puedo ayudarte con análisis avanzados:**\n\n**📊 ANUNCIOS:**\n• "¿Qué anuncio debería apagar?"\n• "¿Qué anuncio no me rinde?"\n• "¿Qué anuncio me trae personas que no asisten?"\n• "¿Qué anuncio me trae leads que no compran?"\n• "¿Qué anuncio tiene la mejor tasa de cierre?"\n\n**👥 CLOSERS:**\n• "¿Qué closer tiene peor tasa de cierre?"\n• "¿Qué closer facturó más esta semana?"\n• "¿Quién desaprovechó más agendas?"\n• "¿Qué closer tiene la tasa de no-show más alta?"\n\n**🎯 OPTIMIZACIÓN:**\n• "¿Qué cambios debería hacer?"\n• "Dame recomendaciones para vender más"\n• "¿Cuál es mi cuello de botella?"\n• "¿Cuál es mi ROAS general?"\n\n**Ejemplos específicos:**\n• "¿Qué anuncio me trae leads que no compran?"\n• "¿Qué closer desaprovechó más agendas?"\n• "¿Cuál es mi cuello de botella?"`;
    }
    
    // Respuesta por defecto
    return `🤔 **No estoy seguro de entender tu pregunta.**\n\nPuedo ayudarte con:\n• Análisis de campañas y anuncios\n• Identificar anuncios ganadores o perdedores\n• Análisis de closers y ventas\n• Métricas de ROAS, CTR, etc.\n\n**Intenta preguntar:**\n• "¿Cuál es mi anuncio ganador?"\n• "¿Qué anuncio debería apagar?"\n• "¿Cómo van mis closers?"\n• "¿Cuál es mi ROAS?"`;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentQuestion = inputValue.trim();
    setInputValue('');
    setIsLoading(true);

    // Simular análisis de datos
    setTimeout(() => {
      const response = analyzeQuestion(currentQuestion);
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[500px] bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div>
            <h3 className="text-white font-semibold">Asistente de Datos</h3>
            <p className="text-white/60 text-xs">Hablar con mis datos</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white/60 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-3 py-2 ${
                message.type === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/10 text-white border border-white/20'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className="text-xs opacity-60 mt-1">
                {message.timestamp.toLocaleTimeString('es-ES', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/10 text-white border border-white/20 rounded-lg px-3 py-2">
              <div className="flex items-center gap-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm text-white/60">Analizando datos...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Pregunta sobre tus métricas..."
            className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:border-white/40"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-white/20 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <p className="text-xs text-white/50 mt-2">
          Ejemplos: "¿Qué cambios debería hacer?" • "¿Qué closer debería despedir?" • "¿Cuál es mi anuncio ganador?"
        </p>
      </div>
    </div>
  );
}