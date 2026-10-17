import React, { useState } from 'react';
import { 
  X, 
  Wrench, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Send, 
  Droplet, 
  Settings, 
  ShieldAlert 
} from 'lucide-react';
import { WORKSHOP_SERVICES } from '../data/initialData';
import { WorkshopService } from '../types';

interface WorkshopModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WorkshopModal: React.FC<WorkshopModalProps> = ({ isOpen, onClose }) => {
  const [selectedService, setSelectedService] = useState<WorkshopService>(WORKSHOP_SERVICES[0]);
  const [bikePlate, setBikePlate] = useState('');
  const [bikeModel, setBikeModel] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('2026-10-20');
  const [appointmentTime, setAppointmentTime] = useState('09:00 AM');
  const [isBooked, setIsBooked] = useState(false);

  if (!isOpen) return null;

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBooked(true);
  };

  const sendWhatsAppBooking = () => {
    const text = `🛠️ *RESERVA DE CITA DE TALLER - MOTOS BOW*\n` +
      `*Cliente:* ${clientName}\n` +
      `*Celular:* ${clientPhone}\n` +
      `*Moto:* ${bikeModel} (Placa: ${bikePlate.toUpperCase()})\n` +
      `*Servicio:* ${selectedService.name} ($${selectedService.price.toLocaleString('es-CO')})\n` +
      `*Fecha:* ${appointmentDate} a las ${appointmentTime}\n` +
      `_Reservado desde Motos Bow APK_`;

    window.open(`https://wa.me/573105550199?text=${encodeURIComponent(text)}`, '_blank');
  };

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'droplet': return <Droplet className="w-5 h-5 text-amber-400" />;
      case 'wrench': return <Wrench className="w-5 h-5 text-amber-400" />;
      case 'settings': return <Settings className="w-5 h-5 text-amber-400" />;
      default: return <ShieldAlert className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base sm:text-lg text-slate-100">
                Taller Mecánico Especializado
              </h2>
              <p className="text-xs text-slate-400">Agenda tu mantenimiento preventivo o correctivo</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {isBooked ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <h3 className="font-black text-xl text-slate-100">¡Cita Agendada con Éxito!</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Te esperamos el día <strong>{appointmentDate}</strong> a las <strong>{appointmentTime}</strong> para tu {selectedService.name}.
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs text-left space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Vehículo:</span>
                  <span className="font-bold text-slate-200">{bikeModel} • {bikePlate.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Valor Estimado Mano de Obra:</span>
                  <span className="font-black text-amber-400">${selectedService.price.toLocaleString('es-CO')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Duración Aproximada:</span>
                  <span className="text-slate-300">{selectedService.duration}</span>
                </div>
              </div>

              <button
                onClick={sendWhatsAppBooking}
                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
              >
                <Send className="w-4 h-4" />
                <span>Confirmar Reserva por WhatsApp con el Mecánico</span>
              </button>

              <button
                onClick={() => {
                  setIsBooked(false);
                  onClose();
                }}
                className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700"
              >
                Cerrar
              </button>
            </div>
          ) : (
            <form onSubmit={handleBooking} className="space-y-4">
              {/* Service Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
                  1. Selecciona el Servicio
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {WORKSHOP_SERVICES.map((srv) => (
                    <button
                      key={srv.id}
                      type="button"
                      onClick={() => setSelectedService(srv)}
                      className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                        selectedService.id === srv.id
                          ? 'bg-amber-500/15 border-amber-500 text-slate-100 shadow-md'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="p-2 rounded-xl bg-slate-800 shrink-0">
                        {getServiceIcon(srv.icon)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xs text-slate-200 truncate">{srv.name}</h4>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                          <span>{srv.duration}</span>
                          <span>•</span>
                          <span className="font-bold text-amber-400">${srv.price.toLocaleString('es-CO')}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Bike & Owner info */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <label className="text-xs font-bold uppercase tracking-wider text-amber-400 block">
                  2. Datos de la Moto y Propietario
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Modelo de Moto</label>
                    <input
                      type="text"
                      required
                      value={bikeModel}
                      onChange={(e) => setBikeModel(e.target.value)}
                      placeholder="Ej. Pulsar NS200 / FZ25"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Placa</label>
                    <input
                      type="text"
                      required
                      value={bikePlate}
                      onChange={(e) => setBikePlate(e.target.value)}
                      placeholder="Ej. ABC12D"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 uppercase focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Tu Nombre</label>
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Ej. Juan Pérez"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Teléfono</label>
                    <input
                      type="tel"
                      required
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="Ej. 312 000 0000"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Fecha de la Cita</label>
                    <input
                      type="date"
                      required
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Horario Preferido</label>
                    <select
                      value={appointmentTime}
                      onChange={(e) => setAppointmentTime(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                    >
                      <option value="08:00 AM">08:00 AM</option>
                      <option value="09:30 AM">09:30 AM</option>
                      <option value="11:00 AM">11:00 AM</option>
                      <option value="02:00 PM">02:00 PM</option>
                      <option value="04:00 PM">04:00 PM</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20"
              >
                <Calendar className="w-4 h-4" />
                <span>Agendar Cita en Taller</span>
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
