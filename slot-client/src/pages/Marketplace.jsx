import React, { useEffect, useMemo, useState } from 'react';
import api from '../lib/api.js';
import SwapModal from '../components/SwapModal.jsx';
import toast from 'react-hot-toast';
import { ShoppingBag } from 'lucide-react';

export default function Marketplace() {
  const [slots, setSlots] = useState([]);
  const [mySwappable, setMySwappable] = useState([]);
  const [open, setOpen] = useState(false);
  const [targetSlot, setTargetSlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const load = async () => {
    setLoading(true);
    setErr('');
    try {
      const [{ data: swappables }, { data: mine }] = await Promise.all([
        api.get('/swappable-slots'),
        api.get('/events'),
      ]);
      setSlots(swappables);
      setMySwappable(mine.filter(e => e.status === 'SWAPPABLE'));
    } catch (e) {
      setErr(e?.response?.data?.message || 'Failed to load marketplace');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openSwap = (slot) => { setTargetSlot(slot); setOpen(true); };

  const requestSwap = async (mySlotId) => {
    try {
      await api.post('/swap-request', { mySlotId, theirSlotId: targetSlot._id });
      toast.success('Swap request sent!');
      setOpen(false);
      setTargetSlot(null);
      await load();
    } catch (err) {
    toast.error(err?.response?.data?.message || 'Failed to create swap');
    }
  };

  const total = slots.length;
  const todayCount = useMemo(() => {
    const today = new Date();
    const d0 = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const d1 = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    return slots.filter(s => new Date(s.startTime) >= d0 && new Date(s.startTime) < d1).length;
  }, [slots]);

  return (
    <div className="grid gap-6">
      <div className="rounded-2xl bg-white shadow p-5 ring-1 ring-slate-100">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 text-lg">
                <ShoppingBag className="h-6 w-6" />
            </span>
            <div>
              <h1 className="text-xl font-semibold text-slate-800">Marketplace</h1>
              <p className="text-sm text-slate-600">Browse swappable slots from other users and send a swap request.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge label="Available" value={total} color="bg-indigo-100 text-indigo-700" />
            <Badge label="Today" value={todayCount} color="bg-emerald-100 text-emerald-700" />
            
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white shadow p-5 ring-1 ring-slate-100">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Available Swappable Slots</h3>

        {err && (
          <div className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {err}
          </div>
        )}

        {loading ? (
          <ListSkeleton />
        ) : total === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-3">
            {slots.map(s => (
              <div
                key={s._id}
                className="flex items-center justify-between rounded-xl border border-slate-200 p-4 hover:bg-slate-50"
              >
                <div>
                  <div className="font-medium text-slate-800">{s.title}</div>
                  <div className="mt-1 text-xs text-slate-600">
                    {new Date(s.startTime).toLocaleString()} &rarr; {new Date(s.endTime).toLocaleString()}
                  </div>
                </div>
                <button
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                  onClick={() => openSwap(s)}
                >
                  Request Swap
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <SwapModal
        open={open}
        onClose={() => setOpen(false)}
        mySwappable={mySwappable}
        onConfirm={requestSwap}
      />
    </div>
  );
}

function Badge({ label, value, color }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-lg px-3 py-1 text-sm font-medium ${color}`}>
      <span>{label}</span>
      <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-md bg-white/60 px-1 text-slate-800">
        {value}
      </span>
    </span>
  );
}

function ListSkeleton() {
  return (
    <div className="space-y-2">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="h-16 rounded-lg bg-slate-100" />
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center">
      <div className="mx-auto mb-2 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">🕑</div>
      <p className="text-slate-700 font-medium">No swappable slots available</p>
      <p className="text-sm text-slate-500">Check back later or make one of your events swappable to initiate trades.</p>
    </div>
  );
}
