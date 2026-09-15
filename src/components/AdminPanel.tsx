import React, { useState, useEffect } from 'react';
import { 
  Users, AlertTriangle, DollarSign, Calendar, Plus, ShieldCheck, 
  CheckCircle, XCircle, ArrowLeft, Globe, MapPin, Sparkles
} from 'lucide-react';
import { LocalEvent, ReportItem, MomoTransaction, SupportedLanguage } from '../types';
import { INITIAL_EVENTS } from '../data/mockData';

interface AdminPanelProps {
  onBack: () => void;
  currentLang: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  onBack,
  currentLang,
  onLanguageChange,
}) => {
  const [metrics, setMetrics] = useState<any>({
    totalUsers: 1255,
    totalRevenueUGX: 14985000,
    pendingReportsCount: 1,
    activeMatchesCount: 391,
    countryBreakdown: {
      Uganda: 540,
      Kenya: 380,
      Tanzania: 210,
      Rwanda: 160,
      Burundi: 42,
    },
    transactions: [],
  });

  const [reports, setReports] = useState<ReportItem[]>([]);
  const [events, setEvents] = useState<LocalEvent[]>(INITIAL_EVENTS);
  const [activeTab, setActiveTab] = useState<'metrics' | 'reports' | 'events' | 'revenue'>('metrics');
  
  // New event form state
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('Singles Night in Matuga');
  const [newEventCountry, setNewEventCountry] = useState('Uganda');
  const [newEventCity, setNewEventCity] = useState('Kampala / Wakiso');
  const [newEventDistrict, setNewEventDistrict] = useState('Matuga Trading Center');
  const [newEventVenue, setNewEventVenue] = useState('Matuga Green Gardens');
  const [newEventDate, setNewEventDate] = useState('Saturday, Nov 14, 2026');
  const [newEventTime, setNewEventTime] = useState('6:00 PM - 11:00 PM');
  const [newEventFee, setNewEventFee] = useState('20,000 UGX');
  const [newEventCategory, setNewEventCategory] = useState<'Singles Mixer' | 'Cultural Night' | 'Speed Dating' | 'Sundowner'>('Singles Mixer');

  useEffect(() => {
    fetch('/api/admin/metrics')
      .then((r) => r.json())
      .then((data) => setMetrics(data))
      .catch(() => {});

    fetch('/api/admin/reports')
      .then((r) => r.json())
      .then((data) => setReports(data))
      .catch(() => {});

    fetch('/api/events')
      .then((r) => r.json())
      .then((data) => setEvents(data))
      .catch(() => {});
  }, []);

  const handleReportAction = async (id: string, action: 'warn' | 'suspend' | 'dismiss') => {
    try {
      await fetch(`/api/admin/reports/${id}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      setReports((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: action === 'dismiss' ? 'dismissed' : 'resolved' } : r))
      );
    } catch {
      setReports((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: 'resolved' } : r))
      );
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: newEventTitle,
      country: newEventCountry,
      city: newEventCity,
      district: newEventDistrict,
      venue: newEventVenue,
      date: newEventDate,
      time: newEventTime,
      entryFee: newEventFee,
      category: newEventCategory,
      description: `Official Mapenzi Connect singles event in ${newEventDistrict}. Come network with verified singles.`,
    };

    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setEvents((prev) => [data.event, ...prev]);
      setShowAddEvent(false);
    } catch {
      setEvents((prev) => [
        {
          id: 'ev-' + Date.now(),
          ...payload,
          attendees: 24,
        },
        ...prev,
      ]);
      setShowAddEvent(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 pb-24 space-y-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between bg-stone-900 p-3.5 rounded-2xl border border-amber-900/40">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg bg-stone-800 text-stone-300 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="font-extrabold text-base text-white flex items-center gap-2">
              <span>Admin Console</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                East Africa Ops
              </span>
            </h2>
            <p className="text-[11px] text-stone-400">
              Users • Mobile Money • Moderation • Local Events
            </p>
          </div>
        </div>

        {/* Language selector in Admin */}
        <div className="flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-amber-400" />
          <select
            value={currentLang}
            onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
            className="bg-stone-800 text-stone-200 text-xs py-1 px-2 rounded-lg border border-stone-700"
          >
            <option value="en">English</option>
            <option value="sw">Kiswahili</option>
            <option value="lg">Luganda</option>
            <option value="rw">Kinyarwanda</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex rounded-xl bg-stone-900 p-1 border border-stone-800 text-xs font-semibold">
        {[
          { id: 'metrics', label: 'Overview & Users', icon: <Users className="w-3.5 h-3.5" /> },
          { id: 'revenue', label: 'MoMo Revenue', icon: <DollarSign className="w-3.5 h-3.5" /> },
          { id: 'reports', label: `Reports (${reports.filter(r => r.status === 'pending').length})`, icon: <AlertTriangle className="w-3.5 h-3.5" /> },
          { id: 'events', label: 'Local Events', icon: <Calendar className="w-3.5 h-3.5" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              activeTab === tab.id
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: METRICS & USERS */}
      {activeTab === 'metrics' && (
        <div className="space-y-4 animate-in fade-in">
          {/* Key Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3.5 rounded-2xl bg-stone-900 border border-stone-800">
              <span className="text-[11px] text-stone-400 font-semibold block">Total Active Singles</span>
              <span className="text-xl font-black text-white font-mono">{metrics.totalUsers.toLocaleString()}</span>
              <span className="text-[10px] text-emerald-400 block mt-0.5">↑ 18% this month</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-900 border border-stone-800">
              <span className="text-[11px] text-stone-400 font-semibold block">Active Matches</span>
              <span className="text-xl font-black text-amber-300 font-mono">{metrics.activeMatchesCount}</span>
              <span className="text-[10px] text-stone-400 block mt-0.5">High mutual respect</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-900 border border-stone-800">
              <span className="text-[11px] text-stone-400 font-semibold block">Pending Reports</span>
              <span className="text-xl font-black text-red-400 font-mono">{reports.filter(r => r.status === 'pending').length}</span>
              <span className="text-[10px] text-stone-400 block mt-0.5">AI Modesty Screen</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-900 border border-stone-800">
              <span className="text-[11px] text-stone-400 font-semibold block">MoMo Subscriptions</span>
              <span className="text-xl font-black text-emerald-300 font-mono">312</span>
              <span className="text-[10px] text-amber-400 block mt-0.5">MTN & Airtel Money</span>
            </div>
          </div>

          {/* Breakdown by East African Country */}
          <div className="p-4 rounded-3xl bg-stone-900 border border-stone-800 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center justify-between">
              <span>Singles by Country (East Africa)</span>
              <span className="text-xs text-stone-400 font-normal">Strict geo-fenced region</span>
            </h3>

            <div className="space-y-2 text-xs">
              {[
                { flag: '🇺🇬', name: 'Uganda (Kampala, Matuga, Jinja)', count: metrics.countryBreakdown?.Uganda || 540, pct: '43%' },
                { flag: '🇰🇪', name: 'Kenya (Nairobi, Mombasa, Kisumu)', count: metrics.countryBreakdown?.Kenya || 380, pct: '30%' },
                { flag: '🇹🇿', name: 'Tanzania (Dar es Salaam, Arusha)', count: metrics.countryBreakdown?.Tanzania || 210, pct: '17%' },
                { flag: '🇷🇼', name: 'Rwanda (Kigali, Rubavu)', count: metrics.countryBreakdown?.Rwanda || 160, pct: '12%' },
                { flag: '🇧🇮', name: 'Burundi (Bujumbura)', count: metrics.countryBreakdown?.Burundi || 42, pct: '3%' },
              ].map((item) => (
                <div key={item.name} className="space-y-1">
                  <div className="flex justify-between text-stone-300">
                    <span className="flex items-center gap-1.5">
                      <span>{item.flag}</span>
                      <span>{item.name}</span>
                    </span>
                    <span className="font-mono font-bold text-amber-300">{item.count}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-stone-800 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" style={{ width: item.pct }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MOBILE MONEY REVENUE */}
      {activeTab === 'revenue' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="p-4 rounded-3xl bg-stone-900 border border-amber-900/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-stone-400">Total Mobile Money Processed:</span>
              <span className="text-xs text-emerald-400 font-bold">100% Mobile Carrier (No Visa/Mastercard)</span>
            </div>
            <div className="text-3xl font-black text-amber-300 font-mono">
              {metrics.totalRevenueUGX?.toLocaleString()} UGX
            </div>
            <p className="text-xs text-stone-400">
              Approx. <strong>$4,050 USD</strong> • Recurring 50,000 UGX monthly VIP subscriptions via MTN MoMo (*165#) and Airtel Money (*185#).
            </p>
          </div>

          <div className="p-4 rounded-3xl bg-stone-900 border border-stone-800 space-y-3">
            <h3 className="font-bold text-sm text-white">Recent MoMo Transactions</h3>
            <div className="divide-y divide-stone-800 text-xs">
              {[
                { ref: 'MOMO-UG-984210', phone: '+256 772 ••• 456', prov: 'MTN Mobile Money', amt: '50,000 UGX', time: '12 mins ago' },
                { ref: 'AIRTEL-UG-331294', phone: '+256 701 ••• 882', prov: 'Airtel Money', amt: '50,000 UGX', time: '45 mins ago' },
                { ref: 'MPESA-KE-443210', phone: '+254 712 ••• 566', prov: 'M-Pesa Safaricom', amt: '1,500 KES', time: '2 hours ago' },
                { ref: 'MOMO-RW-771249', phone: '+250 788 ••• 456', prov: 'MTN Rwanda MoMo', amt: '17,000 RWF', time: 'Yesterday' },
              ].map((tx) => (
                <div key={tx.ref} className="py-2.5 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-stone-200">{tx.prov}</div>
                    <div className="text-[10px] text-stone-500 font-mono">{tx.phone} • {tx.ref}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-emerald-400 font-mono">{tx.amt}</div>
                    <div className="text-[10px] text-stone-500">{tx.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: REPORTED ACCOUNTS QUEUE */}
      {activeTab === 'reports' && (
        <div className="space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white">
              Reported Profiles & AI Modesty Flags
            </h3>
            <span className="text-xs text-stone-400">
              Zero tolerance for non-respectful conduct
            </span>
          </div>

          {reports.length === 0 ? (
            <div className="p-8 text-center text-stone-400 bg-stone-900 rounded-3xl border border-stone-800">
              <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <p className="text-xs">No pending moderation reports in the East African queue!</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {reports.map((rep) => (
                <div
                  key={rep.id}
                  className="p-3.5 rounded-2xl bg-stone-900 border border-stone-800 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-200 text-sm">
                      {rep.reportedUserName}
                    </span>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                      rep.status === 'pending'
                        ? 'bg-red-950 text-red-300 border border-red-700/50'
                        : 'bg-stone-800 text-stone-400'
                    }`}>
                      {rep.status}
                    </span>
                  </div>

                  <p className="text-stone-300">
                    <strong>Reason:</strong> {rep.reason}
                  </p>
                  {rep.details && (
                    <p className="text-[11px] text-stone-400 bg-stone-800 p-2 rounded-lg">
                      {rep.details}
                    </p>
                  )}

                  {rep.status === 'pending' && (
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => handleReportAction(rep.id, 'warn')}
                        className="px-3 py-1 rounded-lg bg-yellow-600 hover:bg-yellow-500 text-white font-bold text-xs"
                      >
                        Send Warning
                      </button>
                      <button
                        onClick={() => handleReportAction(rep.id, 'suspend')}
                        className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs"
                      >
                        Suspend Account
                      </button>
                      <button
                        onClick={() => handleReportAction(rep.id, 'dismiss')}
                        className="px-3 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs"
                      >
                        Dismiss
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: LOCAL EVENTS MANAGER */}
      {activeTab === 'events' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-white">
                Local Singles Events
              </h3>
              <p className="text-[11px] text-stone-400">
                Mixers in Matuga, Kampala, Nairobi, Kigali & Dar es Salaam
              </p>
            </div>

            <button
              onClick={() => setShowAddEvent(!showAddEvent)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-600 text-white text-xs font-bold hover:bg-amber-500 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Event</span>
            </button>
          </div>

          {/* Add Event Form */}
          {showAddEvent && (
            <form onSubmit={handleCreateEvent} className="p-4 rounded-3xl bg-stone-900 border border-amber-500/60 space-y-3 text-xs animate-in slide-in-from-top-2">
              <h4 className="font-bold text-amber-300 text-sm">
                Create New East Africa Singles Event
              </h4>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] text-stone-400 mb-1">Event Title</label>
                  <input
                    type="text"
                    value={newEventTitle}
                    onChange={(e) => setNewEventTitle(e.target.value)}
                    placeholder="e.g. Singles Night in Matuga"
                    className="w-full bg-stone-800 border border-stone-700 rounded-xl p-2 text-stone-100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-stone-400 mb-1">Country</label>
                  <select
                    value={newEventCountry}
                    onChange={(e) => setNewEventCountry(e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-xl p-2 text-stone-100"
                  >
                    <option value="Uganda">Uganda</option>
                    <option value="Kenya">Kenya</option>
                    <option value="Tanzania">Tanzania</option>
                    <option value="Rwanda">Rwanda</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] text-stone-400 mb-1">District / Trading Center</label>
                  <input
                    type="text"
                    value={newEventDistrict}
                    onChange={(e) => setNewEventDistrict(e.target.value)}
                    placeholder="e.g. Matuga / Westlands"
                    className="w-full bg-stone-800 border border-stone-700 rounded-xl p-2 text-stone-100"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-stone-400 mb-1">Venue Name</label>
                  <input
                    type="text"
                    value={newEventVenue}
                    onChange={(e) => setNewEventVenue(e.target.value)}
                    placeholder="e.g. Green Valley Gardens"
                    className="w-full bg-stone-800 border border-stone-700 rounded-xl p-2 text-stone-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] text-stone-400 mb-1">Date</label>
                  <input
                    type="text"
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    placeholder="Saturday, Oct 24"
                    className="w-full bg-stone-800 border border-stone-700 rounded-xl p-2 text-stone-100"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-stone-400 mb-1">Time</label>
                  <input
                    type="text"
                    value={newEventTime}
                    onChange={(e) => setNewEventTime(e.target.value)}
                    placeholder="6:00 PM"
                    className="w-full bg-stone-800 border border-stone-700 rounded-xl p-2 text-stone-100"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-stone-400 mb-1">Entry Fee</label>
                  <input
                    type="text"
                    value={newEventFee}
                    onChange={(e) => setNewEventFee(e.target.value)}
                    placeholder="25,000 UGX"
                    className="w-full bg-stone-800 border border-stone-700 rounded-xl p-2 text-stone-100"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddEvent(false)}
                  className="px-3 py-1.5 rounded-lg bg-stone-800 text-stone-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold"
                >
                  Save & Publish Event
                </button>
              </div>
            </form>
          )}

          {/* Event Cards */}
          <div className="space-y-3">
            {events.map((ev) => (
              <div
                key={ev.id}
                className="p-4 rounded-3xl bg-stone-900 border border-stone-800 space-y-2 shadow-md"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                      {ev.category} • {ev.country}
                    </span>
                    <h4 className="text-base font-bold text-white">
                      {ev.title}
                    </h4>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl bg-amber-950/80 border border-amber-600/40 text-amber-300 text-xs font-mono font-bold shrink-0">
                    {ev.entryFee}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-stone-300">
                  <div className="flex items-center gap-1 text-stone-400">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>{ev.venue} ({ev.district})</span>
                  </div>
                  <div className="flex items-center gap-1 text-stone-400">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>{ev.date} @ {ev.time}</span>
                  </div>
                </div>

                <p className="text-xs text-stone-400 leading-relaxed">
                  {ev.description}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-stone-800 text-xs">
                  <span className="text-stone-400">
                    👥 <strong>{ev.attendees}</strong> singles attending
                  </span>
                  <span className="text-[11px] text-emerald-400 font-bold">
                    ✓ RSVP Open via Mobile Money
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
