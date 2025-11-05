import React, { useEffect, useMemo, useState } from 'react';
import api from '../lib/api.js';
import { Bell } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Requests() {
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const load = async () => {
    setLoading(true);
    setErr('');
    try {
      const { data } = await api.get('/requests');
      setIncoming(data.incoming || []);
      setOutgoing(data.outgoing || []);
    } catch (e) {
      setErr(e?.response?.data?.message || 'Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const respond = async (id, accept) => {
    try {
      await api.post(`/swap-response/${id}`, { accept });
      await load();
    } catch (e) {
    toast.error(e?.response?.data?.message || 'Failed to update request');
    }
  };

  const stats = useMemo(() => {
    const incPending = incoming.filter(r => r.status === 'PENDING').length;
    const outPending = outgoing.filter(r => r.status === 'PENDING').length;
    return {
      incTotal: incoming.length,
      outTotal: outgoing.length,
      incPending,
      outPending,
    };
  }, [incoming, outgoing]);

  return (
    <div className="grid gap-6">
      <div className="rounded-2xl bg-white shadow p-5 ring-1 ring-slate-100">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 text-lg">
                <Bell/>
            </span>
            <div>
              <h1 className="text-xl font-semibold text-slate-800">Requests</h1>
              <p className="text-sm text-slate-600">Review incoming swap offers and track your outgoing requests.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge label="Incoming" value={stats.incTotal} color="bg-indigo-100 text-indigo-700" />
            <Badge label="Incoming Pending" value={stats.incPending} color="bg-emerald-100 text-emerald-700" />
            <Badge label="Outgoing" value={stats.outTotal} color="bg-slate-100 text-slate-700" />
            <Badge label="Outgoing Pending" value={stats.outPending} color="bg-emerald-100 text-emerald-700" />
            
          </div>
        </div>
      </div>

      {err && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {err}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <section className="rounded-2xl bg-white shadow p-5 ring-1 ring-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Incoming</h3>
          {loading ? (
            <ListSkeleton />
          ) : !incoming.length ? (
            <EmptyState text="No incoming requests." icon="📥" />
          ) : (
            <div className="grid gap-3">
              {incoming.map(r => (
                <RequestRow
                  key={r._id}
                  r={r}
                  actions={
                    r.status === 'PENDING' ? (
                      <div className="flex gap-2">
                        <button
                          className="px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                          onClick={() => respond(r._id, true)}
                        >
                          Accept
                        </button>
                        <button
                          className="px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                          onClick={() => respond(r._id, false)}
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <StatusPill status={r.status} />
                    )
                  }
                />
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl bg-white shadow p-5 ring-1 ring-slate-100">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Outgoing</h3>
          {loading ? (
            <ListSkeleton />
          ) : !outgoing.length ? (
            <EmptyState text="No outgoing requests." icon="📤" />
          ) : (
            <div className="grid gap-3">
              {outgoing.map(r => (
                <RequestRow key={r._id} r={r} actions={<StatusPill status={r.status} />} />
              ))}
            </div>
          )}
        </section>
      </div>
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

function RequestRow({ r, actions }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4">
      <div>
        <div className="text-sm text-slate-800">
          Request ID: <span className="font-mono">{r._id}</span>
        </div>
        <div className="mt-1 text-xs text-slate-600">
          status: {r.status} | created: {new Date(r.createdAt).toLocaleString()}
        </div>
      </div>
      {actions}
    </div>
  );
}

function StatusPill({ status }) {
  const map = {
    PENDING: 'bg-indigo-100 text-indigo-700',
    ACCEPTED: 'bg-emerald-100 text-emerald-700',
    REJECTED: 'bg-slate-100 text-slate-700',
  };
  return (
    <span className={`px-3 py-1 rounded-lg text-sm font-medium ${map[status] || 'bg-slate-100 text-slate-700'}`}>
      {status}
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

function EmptyState({ text, icon }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center">
      <div className="mx-auto mb-2 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
        {icon || 'ℹ️'}
      </div>
      <p className="text-slate-700 font-medium">{text}</p>
      <p className="text-sm text-slate-500">Updates will appear here as they happen.</p>
    </div>
  );
}
