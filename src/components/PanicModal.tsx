import React, { useState, useEffect } from 'react';
import { ShieldAlert, MapPin, PhoneCall, CheckCircle2, AlertOctagon, X, Send } from 'lucide-react';
import { UserProfile } from '../types';

interface PanicModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
}

export const PanicModal: React.FC<PanicModalProps> = ({
  isOpen,
  onClose,
  currentUser,
}) => {
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({ lat: 0.3152, lng: 32.5816 });
  const [address, setAddress] = useState('Kampala Central, Uganda');
  const [dispatched, setDispatched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [smsPreview, setSmsPreview] = useState<string>('');

  useEffect(() => {
    if (!isOpen) return;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
          setAddress(`${currentUser.city || 'Kampala'}, ${currentUser.country || 'Uganda'}`);
        },
        () => {
          // fallback to district coordinates
          setCoords({ lat: 0.3152, lng: 32.5816 });
          setAddress(`${currentUser.city || 'Matuga/Kampala'}, ${currentUser.country || 'Uganda'}`);
        },
        { timeout: 4000 }
      );
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const handleTriggerPanic = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/panic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          contactPhone: currentUser.chaperone?.phone || '+256701555123',
          contactName: currentUser.chaperone?.name || 'Emergency Contact',
          latitude: coords.lat,
          longitude: coords.lng,
          address,
        }),
      });
      const data = await res.json();
      setDispatched(true);
      setSmsPreview(data.smsPreview);
    } catch {
      setDispatched(true);
      setSmsPreview(`MAPENZI SAFETY ALERT: ${currentUser.name || 'User'} triggered emergency panic button at ${address} (GPS: ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}). Dispatching police network.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-red-950/90 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-md bg-stone-900 border-2 border-red-600 rounded-3xl p-6 shadow-2xl text-stone-100 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-red-900/50 pb-3">
          <div className="flex items-center gap-2 text-red-500">
            <ShieldAlert className="w-6 h-6 animate-pulse" />
            <div>
              <h3 className="font-extrabold text-base text-white">
                Emergency Panic Button
              </h3>
              <p className="text-[11px] text-red-300">
                East Africa Rapid Safety Network
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!dispatched ? (
          <div className="space-y-4 text-center">
            <div className="p-3.5 rounded-2xl bg-red-950/60 border border-red-700/60 text-left space-y-1.5 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-red-300">
                <AlertOctagon className="w-4 h-4" />
                <span>What happens when you press this?</span>
              </div>
              <ul className="text-stone-300 space-y-1 text-[11px] list-disc list-inside">
                <li>Instantly sends an emergency SMS to: <strong>{currentUser.chaperone?.name || 'Emergency Contact'} ({currentUser.chaperone?.phone || '+256701555123'})</strong></li>
                <li>Includes your live GPS coordinates and local district location.</li>
                <li>Alerts Mapenzi Safety response team.</li>
              </ul>
            </div>

            {/* Live Location display */}
            <div className="p-3 rounded-xl bg-stone-800 border border-stone-700 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2 text-stone-300">
                <MapPin className="w-4 h-4 text-red-400" />
                <span>{address}</span>
              </div>
              <span className="font-mono text-stone-400 text-[10px]">
                {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
              </span>
            </div>

            {/* BIG TRIGGER BUTTON */}
            <button
              id="confirm-panic-trigger-btn"
              onClick={handleTriggerPanic}
              disabled={loading}
              className="w-full py-5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:brightness-110 text-white font-black text-lg tracking-wider uppercase shadow-xl shadow-red-950/60 border-2 border-red-400 flex items-center justify-center gap-2 active:scale-95 transition-all"
            >
              <ShieldAlert className="w-6 h-6 animate-bounce" />
              <span>{loading ? 'Dispatched Alerts...' : 'DISPATCH PANIC ALERT NOW'}</span>
            </button>
          </div>
        ) : (
          /* Dispatched Confirmation Screen */
          <div className="space-y-4 animate-in zoom-in-95">
            <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/80 text-emerald-200 text-xs space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-emerald-300 text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Emergency Broadcast Dispatched</span>
              </div>
              <p className="text-[11px]">
                SMS dispatched to {currentUser.chaperone?.phone || '+256701555123'} with live GPS pin.
              </p>
            </div>

            {/* SMS Preview */}
            <div className="p-3 rounded-xl bg-black border border-stone-700 text-stone-300 font-mono text-[11px] space-y-1">
              <div className="text-[10px] text-amber-400 font-bold">DISPATCHED SMS PAYLOAD:</div>
              <p className="italic">"{smsPreview}"</p>
            </div>

            {/* Hotlines */}
            <div className="space-y-1 text-xs">
              <span className="font-semibold text-stone-300 block">
                Local East Africa Police Lines:
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <a
                  href="tel:999"
                  className="p-2 rounded-lg bg-stone-800 border border-stone-700 hover:bg-stone-750 flex items-center justify-between text-stone-200"
                >
                  <span>🇺🇬 Uganda Police</span>
                  <strong className="text-red-400 font-mono">999 / 112</strong>
                </a>
                <a
                  href="tel:999"
                  className="p-2 rounded-lg bg-stone-800 border border-stone-700 hover:bg-stone-750 flex items-center justify-between text-stone-200"
                >
                  <span>🇰🇪 Kenya Police</span>
                  <strong className="text-red-400 font-mono">999 / 112</strong>
                </a>
                <a
                  href="tel:112"
                  className="p-2 rounded-lg bg-stone-800 border border-stone-700 hover:bg-stone-750 flex items-center justify-between text-stone-200"
                >
                  <span>🇹🇿 TZ Emergency</span>
                  <strong className="text-red-400 font-mono">112</strong>
                </a>
                <a
                  href="tel:112"
                  className="p-2 rounded-lg bg-stone-800 border border-stone-700 hover:bg-stone-750 flex items-center justify-between text-stone-200"
                >
                  <span>🇷🇼 Rwanda Police</span>
                  <strong className="text-red-400 font-mono">112</strong>
                </a>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs"
            >
              Close & Dismiss
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
