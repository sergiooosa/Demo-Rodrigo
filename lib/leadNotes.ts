import leadNotesData from '@/data/lead_notes.json';
import { LeadNote } from '@/components/LeadNotesModal';

// Helper to generate fake data when lead note doesn't exist
export function generateMockLeadNote(lead: string, closer: string, result?: string): LeadNote {
  const firstNames = ['Carlos', 'María', 'Luis', 'Ana', 'Pedro', 'Sofia', 'Juan', 'Laura', 'Diego', 'Carmen'];
  const lastNames = ['Pérez', 'González', 'Rodríguez', 'López', 'Castro', 'Martínez', 'Silva', 'Torres', 'Morales', 'Díaz'];
  const domains = ['gmail.com', 'hotmail.com', 'empresa.com', 'startup.co', 'tech.com', 'mail.com'];
  const sources = ['Meta Ads', 'Prospección', 'Orgánico'];
  const campaigns = {
    'Meta Ads': ['Meta Carousel A', 'Meta Video B', 'Meta Lead Gen'],
    'Prospección': ['LinkedIn Outreach', 'Cold Email', 'WhatsApp'],
    'Orgánico': ['Blog Content', 'Social Media', 'Referrals']
  };

  // Generate consistent data based on lead name
  const nameHash = lead.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  const randomSeed = nameHash % 1000;
  
  const firstName = lead.split(' ')[0] || firstNames[randomSeed % firstNames.length];
  const lastName = lead.split(' ')[1] || lastNames[randomSeed % lastNames.length];
  const source = sources[randomSeed % sources.length];
  const campaign = campaigns[source as keyof typeof campaigns]?.[randomSeed % campaigns[source as keyof typeof campaigns]?.length || 0] || 'Campaña General';
  
  // Generate email
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domains[randomSeed % domains.length]}`;
  
  // Generate phone
  const phoneNum = 300000000 + (randomSeed * 123) % 100000000;
  const phone = `+57 ${phoneNum.toString().slice(0, 3)} ${phoneNum.toString().slice(3, 6)} ${phoneNum.toString().slice(6, 10)}`;

  // Determine values based on result
  let valorEstimado = 0;
  let score = 50;
  let estatus = 'Seguimiento';
  let ultimoMensaje = 'Contacto inicial realizado.';
  let siguientePaso = 'Programar seguimiento';
  let notas = 'Lead generado automáticamente.';
  let tags = [source.toLowerCase().replace(' ads', ''), 'nuevo'];
  let cita = '';

  if (result === 'Venta' || result === 'Venta cerrada') {
    valorEstimado = 500 + (randomSeed % 1000);
    score = 80 + (randomSeed % 20);
    estatus = 'Cliente';
    ultimoMensaje = 'Contrato firmado. Cliente satisfecho.';
    siguientePaso = 'Onboarding programado';
    notas = 'Venta exitosa. Cliente premium con alto potencial.';
    tags = ['cliente', source.toLowerCase().replace(' ads', ''), 'cerrado'];
  } else if (result === 'Oferta enviada') {
    valorEstimado = 300 + (randomSeed % 900);
    score = 60 + (randomSeed % 30);
    estatus = 'Calificado';
    ultimoMensaje = 'Propuesta enviada, pendiente respuesta.';
    siguientePaso = 'Seguimiento en 3 días';
    notas = 'Interesado en la propuesta. Evaluando opciones.';
    tags = ['propuesta', source.toLowerCase().replace(' ads', ''), 'seguimiento'];
    // Generate future appointment
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1 + (randomSeed % 7));
    cita = futureDate.toISOString().slice(0, 16).replace('T', ' ');
  } else if (result === 'Perdida') {
    valorEstimado = 0;
    score = 20 + (randomSeed % 40);
    estatus = 'No calificado';
    ultimoMensaje = 'No hay interés en el momento.';
    siguientePaso = 'Archivo por 6 meses';
    notas = 'Fuera del presupuesto. No es target actual.';
    tags = ['descartado', source.toLowerCase().replace(' ads', ''), 'presupuesto'];
  } else if (result === 'No calificada') {
    valorEstimado = 0;
    score = 10 + (randomSeed % 30);
    estatus = 'No calificado';
    ultimoMensaje = 'No cumple criterios de calificación.';
    siguientePaso = 'Descartado';
    notas = 'Lead no calificado según criterios establecidos.';
    tags = ['no-calificado', source.toLowerCase().replace(' ads', ''), 'descartado'];
  }

  return {
    id: `mock_${lead.replace(/\s+/g, '_').toLowerCase()}_${closer.replace(/\s+/g, '_').toLowerCase()}`,
    closer,
    lead,
    phone,
    email,
    fuente: source,
    campania: campaign,
    adId: source.includes('Meta') ? 'FB-01' : '',
    score,
    estatus,
    interacciones: 1 + (randomSeed % 5),
    ultimoMensaje,
    valorEstimado,
    resultado: result || 'Seguimiento',
    cita,
    siguientePaso,
    notas,
    tags
  };
}

// Get lead note by lead name and closer, generate mock if not found
export function getLeadNote(lead: string, closer: string, result?: string): LeadNote {
  const existingNote = (leadNotesData as LeadNote[]).find(
    note => note.lead === lead && note.closer === closer
  );

  if (existingNote) {
    return existingNote;
  }

  // Generate mock data
  return generateMockLeadNote(lead, closer, result);
}

// Get all lead notes for a specific closer
export function getLeadNotesByCloser(closer: string): LeadNote[] {
  return (leadNotesData as LeadNote[]).filter(note => note.closer === closer);
}