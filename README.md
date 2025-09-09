# Dashboard Tracker Automático

Dashboard completo de tracking automático construido con Next.js, TypeScript, TailwindCSS y Recharts.

## 🚀 Características

- **Dashboard en tiempo real** con métricas de marketing y ventas
- **3 secciones principales**: Total (Adquisición), Métricas de Anuncios, Tracker de Closers
- **Filtros de fecha** dinámicos (Hoy, Ayer, 7 días, 30 días, Personalizado)
- **Búsqueda en tiempo real** en agendas por closer
- **Modales de análisis** con información detallada de leads
- **Exportación a Excel/CSV** de todos los datos
- **Diseño neón** con efectos de hover y glassmorphism
- **Responsive** y accesible

## 🛠️ Tecnologías

- **Next.js 14** (App Router)
- **TypeScript**
- **TailwindCSS**
- **Recharts** (gráficos)
- **XLSX** (exportación)

## 📦 Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/TU_USUARIO/dashboard-tracker-automatico.git
cd dashboard-tracker-automatico
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Ejecutar en desarrollo**
```bash
npm run dev
```

4. **Abrir en el navegador**
```
http://localhost:3000
```

## 📊 Funcionalidades

### Sección 1: TOTAL (Adquisición)
- KPIs principales: Inversión, Agendas, CPA-Q, CPS-Q, CAC, ROAS
- Nuevos KPIs: Ventas realizadas, Cash Collected, Facturación
- Variaciones simuladas y métricas en tiempo real

### Sección 2: MÉTRICAS DE ANUNCIOS
- Tabla expandible con sub-campañas (H1, H2, H3, H4)
- Filtro automático para Meta Ads
- Gráficos de Cash vs Spend y ROAS por medio
- Tarjetas de resumen por método (Meta, Prospección, Orgánico)

### Sección 3: TRACKER DE CLOSERS
- Tabla expandible con agendas por closer
- Búsqueda en tiempo real con atajo `/`
- Modal de análisis de llamadas simplificado
- Exportación filtrada por búsqueda

## 🎨 Características de Diseño

- **Tema oscuro** con efectos neón
- **Glassmorphism** en tarjetas y modales
- **Hover effects** con glow y transiciones
- **Paleta de colores** consistente por método
- **Responsive design** para todos los dispositivos

## 📁 Estructura del Proyecto

```
├── app/                    # Next.js App Router
│   ├── globals.css        # Estilos globales
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página del dashboard
├── components/            # Componentes React
│   ├── KpiCard.tsx        # Tarjetas de métricas
│   ├── TableAds.tsx       # Tabla de anuncios
│   ├── TableClosers.tsx   # Tabla de closers
│   └── ...                # Otros componentes
├── data/                  # Datos mock
│   ├── ads.json           # Datos de anuncios
│   ├── closers.json       # Datos de closers
│   └── ...                # Otros archivos de datos
├── lib/                   # Utilidades y helpers
├── types/                 # Definiciones TypeScript
└── utils/                 # Funciones auxiliares
```

## 🔧 Comandos Disponibles

```bash
npm run dev          # Ejecutar en desarrollo
npm run build        # Construir para producción
npm run start        # Ejecutar en producción
npm run lint         # Verificar código
```

## 📝 Notas

- Los datos son mock y se generan dinámicamente
- El dashboard está optimizado para client-side rendering
- Todas las funcionalidades de exportación funcionan en el navegador
- El diseño es completamente responsive

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles. 