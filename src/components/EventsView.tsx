import React, { useState } from 'react';
import { Calendar, MapPin, Users, Ticket, Sparkles, CheckCircle2 } from 'lucide-react';
import { LocalEvent, SupportedLanguage } from '../types';
import { UI_TRANSLATIONS } from '../data/mockData';

interface EventsViewProps {
  events: LocalEvent[];
  currentLang: SupportedLanguage;
  onOpenMomo: () => void;
}

export const EventsView: React.FC<EventsViewProps> = ({
  events,
  currentLang,
  onOpenMomo,
}) => {
  const t = UI_TRANSLATIONS[currentLang] || UI_TRANSLATIONS.en;
  const [rsvpdEventIds, setRsvpdEventIds] = useState<string[]>([]);

  const handleRsvp = (event: LocalEvent) => {
    if (rsvpdEventIds.includes(event.id)) return;
    setRsvpdEventIds((prev) => [...prev, event.id]);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-3 pb-24 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-500" />
            <span>{t.events}</span>
          </h2>
          <p className="text-xs text-stone-400">
            Singles Mixers & Cultural Nights across East Africa
          </p>
        </div>

        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
          In-Person Safe Venues
        </span>
      </div>

      <div className="space-y-3.5">
        {events.map((event) => {
          const isRsvpd = rsvpdEventIds.includes(event.id);
          return (
            <div
              key={event.id}
              className="p-4 rounded-3xl bg-stone-900 border border-amber-900/40 space-y-2.5 shadow-xl hover:border-amber-600/40 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                    {event.category} • {event.country}
                  </span>
                  <h3 className="text-base font-bold text-white leading-snug">
                    {event.title}
                  </h3>
                </div>
                <span className="px-2.5 py-1 rounded-xl bg-amber-950/80 border border-amber-600/40 text-amber-300 text-xs font-mono font-bold shrink-0">
                  {event.entryFee}
                </span>
              </div>

              <div className="space-y-1 text-xs text-stone-300">
                <div className="flex items-center gap-1.5 text-stone-300">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>{event.venue} — <strong>{event.district}</strong>, {event.city}</span>
                </div>
                <div className="flex items-center gap-1.5 text-stone-400">
                  <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                  <span>{event.date} • {event.time}</span>
                </div>
              </div>

              <p className="text-xs text-stone-400 leading-relaxed">
                {event.description}
              </p>

              <div className="pt-2 border-t border-stone-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-stone-400">
                  <Users className="w-3.5 h-3.5 text-amber-400" />
                  <span>{event.attendees + (isRsvpd ? 1 : 0)} attending</span>
                </div>

                <button
                  id={`rsvp-btn-${event.id}`}
                  onClick={() => handleRsvp(event)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md ${
                    isRsvpd
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500'
                      : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:brightness-110 text-white'
                  }`}
                >
                  {isRsvpd ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>RSVP Confirmed</span>
                    </>
                  ) : (
                    <>
                      <Ticket className="w-3.5 h-3.5" />
                      <span>RSVP with MoMo</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
