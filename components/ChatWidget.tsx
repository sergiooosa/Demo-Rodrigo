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
    
    // Análisis de anuncios a apagar
    if (lowerQuestion.includes('apagar') || lowerQuestion.includes('pausar') || lowerQuestion.includes('quitar')) {
      const worstCampaign = adsData[0].campaigns.reduce((worst, current) => 
        current.roas < worst.roas ? current : worst
      );
      const lowPerformingCampaigns = adsData[0].campaigns.filter(c => c.roas < 10);
      
      if (worstCampaign.name === 'H1') {
        return `⚠️ **Recomiendo apagar H1** inmediatamente\n\n**¿Por qué apagarlo?**\n• ROAS: 0x (sin retorno)\n• 0 ventas cerradas\n• $${worstCampaign.spend} gastados sin resultados\n• CTR: ${worstCampaign.ctr}% (aceptable pero sin conversión)\n\n**Alternativas a revisar:**\n• H4: ROAS 27.7x - Excelente rendimiento\n• H5: ROAS 28.6x - Tu mejor campaña\n• H6: ROAS 26.7x - Muy buena performance\n\n**Acción:** Pausa H1 y redistribuye su presupuesto ($500) hacia H4, H5 o H6.`;
      } else {
        return `📊 **Análisis de campañas de bajo rendimiento:**\n\n**Campañas a revisar:**\n${lowPerformingCampaigns.map(c => 
          `• ${c.name}: ROAS ${c.roas}x - Cash $${c.cash.toLocaleString()}`
        ).join('\n')}\n\n**🚨 CRÍTICO:** H3 tiene ROAS de solo 2.0x - muy por debajo del estándar de 10x+\n\n**Recomendación:** Pausa H1 y H3 inmediatamente. Redistribuye su presupuesto ($1,050 total) hacia H4, H5 y H6 que tienen excelente rendimiento (ROAS 25x+).`;
      }
    }
    
    // Análisis de closers
    if (lowerQuestion.includes('closer') || lowerQuestion.includes('vendedor') || lowerQuestion.includes('ventas')) {
      const bestCloser = closersData.reduce((best, current) => 
        current.sales > best.sales ? current : best
      );
      const worstCloser = closersData.reduce((worst, current) => 
        current.sales < worst.sales ? current : worst
      );
      const totalSales = closersData.reduce((sum, closer) => sum + closer.sales, 0);
      const totalCash = closersData.reduce((sum, closer) => sum + closer.cash, 0);
      
      // Calcular close rates
      const closersWithRates = closersData.map(closer => ({
        ...closer,
        closeRate: ((closer.sales / closer.shows) * 100).toFixed(1),
        showRate: ((closer.shows / closer.agendas) * 100).toFixed(1)
      }));
      
      const worstPerformer = closersWithRates.reduce((worst, current) => 
        parseFloat(current.closeRate) < parseFloat(worst.closeRate) ? current : worst
      );
      
      return `👥 **Análisis de Closers:**\n\n**Mejor performer:** ${bestCloser.closer}\n• Ventas: ${bestCloser.sales}\n• Cash: $${bestCloser.cash.toLocaleString()}\n• Show rate: ${((bestCloser.shows / bestCloser.agendas) * 100).toFixed(1)}%\n• Close rate: ${((bestCloser.sales / bestCloser.shows) * 100).toFixed(1)}%\n\n**⚠️ Peor performer:** ${worstPerformer.closer}\n• Close rate: ${worstPerformer.closeRate}% (CRÍTICO)\n• Ventas: ${worstPerformer.sales}\n• Cash: $${worstPerformer.cash.toLocaleString()}\n\n**Resumen total:**\n• Total ventas: ${totalSales}\n• Total cash: $${totalCash.toLocaleString()}\n• Promedio por closer: ${(totalSales / closersData.length).toFixed(1)} ventas\n\n**🚨 RECOMENDACIÓN URGENTE:** ${worstPerformer.closer} tiene un close rate de ${worstPerformer.closeRate}%, muy por debajo del promedio. Considera darle un ultimátum de 30 días o reemplazarlo.`;
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
      return `🤖 **Puedo ayudarte con:**\n\n• **Anuncios ganadores:** "¿Cuál es mi anuncio ganador?"\n• **Optimización:** "¿Qué anuncio debería apagar?"\n• **Análisis de closers:** "¿Cómo van mis vendedores?"\n• **Cambios urgentes:** "¿Qué cambios debería hacer?"\n• **Despidos:** "¿Qué closer debería despedir?"\n• **ROAS:** "¿Cuál es mi retorno de inversión?"\n• **CTR:** "¿Cómo está mi tasa de clics?"\n• **Métodos:** "¿Qué canal funciona mejor?"\n\n**Ejemplos de preguntas:**\n• "¿Cuál es mi mejor campaña?"\n• "¿Qué anuncio me está costando dinero?"\n• "¿Qué cambios debería hacer?"\n• "¿Qué closer tiene mala tasa de cierre?"\n• "¿Cuál es mi ROAS general?"`;
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