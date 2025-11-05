import React from 'react';
import { Calendar, Clock } from 'lucide-react';

export default function EventList({ events, onMakeSwappable, onMakeBusy, onDelete }) {
  const fmt = (ts) =>
    new Date(ts).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <div className="space-y-3">
      {events.map((ev) => (
        <div
          key={ev._id}
          className="bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition duration-200"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Event Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h4 className="font-semibold text-gray-800 text-lg">{ev.title}</h4>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    ev.status === 'SWAPPABLE'
                      ? 'bg-green-100 text-green-700'
                      : ev.status === 'BUSY'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {ev.status}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-600 space-y-1 sm:space-y-0 sm:space-x-4">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4 text-gray-400" strokeWidth={2} />
                  <span>{fmt(ev.startTime)}</span>
                </div>
                <span className="hidden sm:inline text-gray-400">→</span>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4 text-gray-400" strokeWidth={2} />
                  <span>{fmt(ev.endTime)}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              {ev.status !== 'SWAPPABLE' && (
                <button
                  className="px-3 py-1.5 text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg transition"
                  onClick={() => onMakeSwappable(ev._id)}
                >
                  Make Swappable
                </button>
              )}
              {ev.status !== 'BUSY' && (
                <button
                  className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition"
                  onClick={() => onMakeBusy(ev._id)}
                >
                  Make Busy
                </button>
              )}
              <button
                className="px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition"
                onClick={() => onDelete(ev._id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
