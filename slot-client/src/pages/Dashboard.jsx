import React, { useEffect, useState } from "react";
import api from "../lib/api.js";
import EventForm from "../components/EventForm.jsx";
import EventList from "../components/EventList.jsx";
import toast from "react-hot-toast";
import { Calendar, Plus } from "lucide-react";

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/events");
      setEvents(data);
    } catch (e) {
      const msg = e?.response?.data?.message || e.message || "Failed to load events";
      console.error("GET /events error:", e);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const createEvent = async (payload) => {
    try {
      await api.post("/events", { ...payload, status: "BUSY" });
      await load();
      toast.success("Event added ✅");
    } catch (e) {
      const msg = e?.response?.data?.message || e.message || "Create failed";
      console.error("POST /events error:", e);
      toast.error(`Add failed: ${msg}`);
    }
  };

  const makeSwappable = async (id) => {
    try {
      await api.put(`/events/${id}`, { status: "SWAPPABLE" });
      await load();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to update");
    }
  };

  const makeBusy = async (id) => {
    try {
      await api.put(`/events/${id}`, { status: "BUSY" });
      await load();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to update");
    }
  };

  const del = async (id) => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <p className="text-sm text-slate-800">Are you sure you want to delete this event?</p>
        <div className="flex justify-end gap-2 mt-1">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                await api.delete(`/events/${id}`);
                toast.success("Event deleted 🗑️");
                await load();
              } catch (e) {
                toast.error(e?.response?.data?.message || "Delete failed ❌");
              }
            }}
            className="px-3 py-1 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 text-sm"
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100 text-sm"
          >
            No
          </button>
        </div>
      </div>
    ), { duration: 4000 });
  };

  const busyCount = events.filter(e => e.status === "BUSY").length;
  const swappableCount = events.filter(e => e.status === "SWAPPABLE").length;
  const pendingCount = events.filter(e => e.status === "SWAP_PENDING").length;

  return (
    <div className="grid gap-6">
      {/* Header / counters */}
      <div className="rounded-2xl bg-white shadow p-5 ring-1 ring-slate-100">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 text-lg font-bold">
              <Calendar />
            </span>
            <div>
              <h1 className="text-xl font-semibold text-slate-800">My Calendar</h1>
              <p className="text-sm text-slate-600">Create, manage, and mark events as swappable.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge label="Busy" value={busyCount} color="bg-slate-100 text-slate-700" />
            <Badge label="Swappable" value={swappableCount} color="bg-indigo-100 text-indigo-700" />
            <Badge label="Pending" value={pendingCount} color="bg-emerald-100 text-emerald-700" />
          </div>
        </div>
      </div>

      {/* Create form */}
      <EventForm onCreate={createEvent} />

      {/* List card (now owned by Dashboard) */}
      <div className="rounded-2xl bg-white shadow p-5 ring-1 ring-slate-100">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
            <Calendar className="w-5 h-5 text-white" strokeWidth={2} />
          </div>
          <h3 className="text-xl font-bold text-gray-800">My Events</h3>
        </div>

        {loading ? (
          <ListSkeleton />
        ) : events.length === 0 ? (
          <EmptyState />
        ) : (
          <EventList
            events={events}
            onMakeSwappable={makeSwappable}
            onMakeBusy={makeBusy}
            onDelete={del}
          />
        )}
      </div>
    </div>
  );
}

function Badge({ label, value, color }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-lg px-3 py-1 text-sm font-medium ${color}`}>
      <span>{label}</span>
      <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-md bg-white/60 px-1 text-slate-800">{value}</span>
    </span>
  );
}

function ListSkeleton() {
  return (
    <div className="space-y-2">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="h-14 rounded-lg bg-slate-100" />
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center">
      <div className="mx-auto mb-2 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
        <Plus />
      </div>
      <p className="text-slate-700 font-medium">No events yet</p>
      <p className="text-sm text-slate-500">Create your first event using the form above.</p>
    </div>
  );
}
