import { KpiCardProps } from '../types';
import { getBadgeColor } from '../utils/helpers';

export default function KpiCard({ title, value, variation, badge }: KpiCardProps) {
  // Define border colors based on metric type
  const getBorderColor = (title: string): string => {
    switch (title) {
      // Métricas de Inversión y Principales
      case 'Inversión en publicidad':
        return '#DC2626'; // rojo intenso
      case 'Reuniones agendadas':
        return '#10B981'; // verde esmeralda
      case 'Reuniones calificadas':
        return '#34A853'; // verde
      case 'Reuniones con asistencia (show)':
        return '#059669'; // verde más oscuro
      case 'Llamadas cerradas':
        return '#8B5CF6'; // morado
      
      // Métricas de Performance
      case 'Tasa de cierre (%)':
        return '#06B6D4'; // cian
      case 'Ticket promedio':
        return '#F97316'; // naranja
      case 'Costo por agenda calificada':
        return '#84CC16'; // verde lima
      case 'Costo por show':
        return '#EC4899'; // rosa
      
      // Métricas de Costos y Resultados
      case 'Costo por adquisición (CAC)':
        return '#6366F1'; // índigo
      case 'Facturación':
        return '#7C3AED'; // morado suave
      case 'Cash Collected':
        return '#3B82F6'; // azul
      case 'ROAS':
        return '#14B8A6'; // teal
      
      // Métricas Adicionales
      case 'Reuniones canceladas':
        return '#EF4444'; // rojo
      case 'Reuniones no asistidas (no-show) %':
        return '#F59E0B'; // amarillo/naranja
      
      // Métricas de VENTAS (Tracker de Closers)
      case 'Agendas':
        return '#10B981'; // verde esmeralda
      case 'Asistencias (Shows)':
        return '#059669'; // verde más oscuro
      case 'Agendas Calificadas':
        return '#34A853'; // verde
      case 'Ofertas Realizadas':
        return '#8B5CF6'; // morado
      case 'Cierres Realizados':
        return '#DC2626'; // rojo intenso
      case '% de Cierre':
        return '#06B6D4'; // cian
      case '% de Show':
        return '#F97316'; // naranja
      case 'Ticket Promedio':
        return '#84CC16'; // verde lima
      case 'Costo por Cierre':
        return '#EC4899'; // rosa
      case 'ROAS Closers':
        return '#14B8A6'; // teal
      
      // Métricas legacy (mantener compatibilidad)
      case 'Ventas realizadas':
        return '#34A853'; // verde
      default:
        return '#3B82F6'; // azul suave para el resto
    }
  };

  // No badges for any metrics - clean design
  const showBadge = false;

  const borderColor = getBorderColor(title);

  return (
    <div 
      className="glass glow rounded-xl p-6 shadow-lg transition-all duration-300 hover:scale-[1.01]"
      style={{
        border: `2px solid ${borderColor}99`, // 60% opacity
        boxShadow: `0 0 12px ${borderColor}40`, // 25% opacity
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.border = `2px solid ${borderColor}E6`; // 90% opacity
        e.currentTarget.style.boxShadow = `0 0 18px ${borderColor}80`; // 50% opacity
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.border = `2px solid ${borderColor}99`; // 60% opacity
        e.currentTarget.style.boxShadow = `0 0 12px ${borderColor}40`; // 25% opacity
      }}
    >
      <h3 className="text-sm font-medium text-tx2 mb-2">{title}</h3>
      <div className="text-2xl font-bold text-tx1 mb-2">
        {value.includes('(') && value.includes('%') ? (
          <div className="flex items-baseline gap-2">
            <span>{value.split('(')[0].trim()}</span>
            <span className="text-lg text-blue-400 font-semibold">
              ({value.split('(')[1]}
            </span>
          </div>
        ) : (
          value
        )}
      </div>
      {variation && (
        <div className="text-sm text-tx2">{variation}</div>
      )}
      {showBadge && badge && (
        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full border whitespace-nowrap ${getBadgeColor(badge)}`}>
          {badge}
        </span>
      )}
    </div>
  );
} 