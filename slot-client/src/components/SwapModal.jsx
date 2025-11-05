import React, { useEffect, useRef, useState } from "react";

export default function SwapModal({ open, onClose, mySwappable = [], onConfirm }) {
  const [selected, setSelected] = useState(null);
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) setSelected(null);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 bg-slate-900/60"
      aria-modal="true"
      role="dialog"
      aria-labelledby="swap-modal-title"
      onClick={(e) => {
        // close when clicking backdrop, but ignore clicks inside panel
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        className="w-full max-w-lg rounded-2xl bg-white shadow-xl ring-1 ring-slate-100"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 id="swap-modal-title" className="text-lg font-semibold text-slate-800">
            Offer one of your swappable slots
          </h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-slate-50 text-slate-500"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-5 pt-3 pb-2">
          {mySwappable.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">
              You don’t have any <span className="font-medium text-slate-700">SWAPPABLE</span> events yet.
              Go to <span className="font-medium text-slate-700">My Calendar</span> and mark one as swappable.
            </div>
          ) : (
            <div className="max-h-72 overflow-y-auto space-y-3 pr-1">
              {mySwappable.map((ev) => {
                const isActive = selected === ev._id;
                return (
                  <label
                    key={ev._id}
                    className={[
                      "block cursor-pointer rounded-xl border p-4 transition",
                      isActive
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50",
                    ].join(" ")}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="mySlot"
                        className="mt-1 h-4 w-4 accent-indigo-600"
                        checked={isActive}
                        onChange={() => setSelected(ev._id)}
                      />
                      <div className="flex-1">
                        <div className="font-medium text-slate-800">{ev.title}</div>
                        <div className="mt-1 text-xs text-slate-600">
                          {new Date(ev.startTime).toLocaleString()} &rarr;{" "}
                          {new Date(ev.endTime).toLocaleString()}
                        </div>
                      </div>
                      {isActive && (
                        <span className="text-xs font-medium text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                          Selected
                        </span>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!selected || mySwappable.length === 0}
            onClick={() => onConfirm(selected)}
            className={[
              "px-4 py-2 rounded-lg font-medium text-white",
              !selected || mySwappable.length === 0
                ? "bg-indigo-300 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700",
            ].join(" ")}
          >
            Request Swap
          </button>
        </div>
      </div>
    </div>
  );
}
