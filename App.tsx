import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { TicketConfirmationForm } from './components/TicketConfirmationForm';
import { TicketCard } from './components/TicketCard';
import { TicketLookup } from './components/TicketLookup';
import { DoorScanner } from './components/DoorScanner';
import { AdminPanel } from './components/AdminPanel';
import { EventConfig, Ticket } from './types/neon';
import { ShieldCheck, Sparkles, MapPin, Calendar, Clock, QrCode } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'confirm' | 'lookup' | 'admin' | 'scanner'>('confirm');
  const [eventConfig, setEventConfig] = useState<EventConfig>({
    eventName: 'NEON FEST 2026: THE GLOW EXPERIENCE',
    eventDate: 'Sábado, 14 de Noviembre, 2026',
    eventTime: '10:00 PM - 06:00 AM',
    venue: 'Club CyberSpace VIP, Terraza Panorámica',
    description: 'La fiesta electrónica y visual más explosiva del año con pulseras LED, DJs internacionales y barra libre en zona VIP.',
    pricePerTicket: 15,
    currency: '$',
    totalCapacity: 300,
    autoApprove: false,
    paymentInfo: {
      bankName: 'Banesco / Mercantil / Banco de Venezuela',
      accountHolder: 'Neon Entry Producciones C.A.',
      idNumber: 'V-24.891.023',
      phoneNumber: '+58 412 987 6543',
      accountNumber: '0134 0987 6543 2109 8765',
      zelleEmail: 'pagos@neonentry.com',
      supportWhatsApp: '+58 412 987 6543',
      extraInstructions: 'Envía tu comprobante con el número de referencia visible para confirmación inmediata.',
    },
  });

  const [ticketsSold, setTicketsSold] = useState<number>(3);
  const [ticketsAvailable, setTicketsAvailable] = useState<number>(297);
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch public event info & capacity
  const fetchEventData = async () => {
    try {
      const response = await fetch('/api/event');
      if (response.ok) {
        const data = await response.json();
        setEventConfig(data);
        if (typeof data.ticketsSold === 'number') setTicketsSold(data.ticketsSold);
        if (typeof data.ticketsAvailable === 'number') setTicketsAvailable(data.ticketsAvailable);
      }
    } catch (err) {
      console.error('Error fetching event data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEventData();

    // Check if the URL has ?verify=CODE
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const verifyCode = params.get('verify');
      if (verifyCode) {
        // Fetch ticket directly and open in view modal
        fetch(`/api/tickets/lookup?query=${encodeURIComponent(verifyCode)}`)
          .then((res) => res.json())
          .then((data) => {
            if (data.tickets && data.tickets.length > 0) {
              setActiveTicket(data.tickets[0]);
            } else {
              setActiveTab('scanner');
            }
          })
          .catch(() => setActiveTab('scanner'));
      }
    }
  }, []);

  const handleTicketCreated = (newTicket: Ticket) => {
    setActiveTicket(newTicket);
    fetchEventData();
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Background Ambient Neon Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-[160px]" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-purple-600/10 rounded-full blur-[140px]" />
      </div>

      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTicket(null);
          setActiveTab(tab);
        }}
        ticketsAvailable={ticketsAvailable}
        totalCapacity={eventConfig.totalCapacity}
        eventName={eventConfig.eventName}
      />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        {/* If viewing a single ticket pass modal/overlay */}
        {activeTicket ? (
          <div className="space-y-4">
            <div className="max-w-lg mx-auto flex items-center justify-between">
              <button
                onClick={() => setActiveTicket(null)}
                className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors"
              >
                ← Volver al Menú Principal
              </button>

              <span className="text-[11px] font-mono text-slate-500 uppercase">
                Pase Oficial Verificado
              </span>
            </div>

            <TicketCard
              ticket={activeTicket}
              eventConfig={eventConfig}
              onClose={() => setActiveTicket(null)}
            />
          </div>
        ) : (
          <>
            {activeTab === 'confirm' && (
              <TicketConfirmationForm
                eventConfig={eventConfig}
                onTicketCreated={handleTicketCreated}
              />
            )}

            {activeTab === 'lookup' && (
              <TicketLookup
                eventConfig={eventConfig}
                onSelectTicket={(ticket) => setActiveTicket(ticket)}
              />
            )}

            {activeTab === 'scanner' && (
              <DoorScanner
                adminToken={adminToken || undefined}
                onTicketUpdated={fetchEventData}
              />
            )}

            {activeTab === 'admin' && (
              <AdminPanel
                onViewTicket={(ticket) => setActiveTicket(ticket)}
                adminToken={adminToken}
                setAdminToken={setAdminToken}
                onRefreshPublicEvent={fetchEventData}
              />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-900 bg-black/60 backdrop-blur-xl py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-black text-cyan-400 tracking-wider">NEON ENTRY</span>
            <span>•</span>
            <span>Tecnología Antifraude de Confirmación y Validación de Entradas</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Control de Cédula y QR Único</span>
            <span>•</span>
            <button
              onClick={() => {
                setActiveTicket(null);
                setActiveTab('admin');
              }}
              className="text-amber-400 hover:underline font-semibold"
            >
              Acceso Organizador
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
