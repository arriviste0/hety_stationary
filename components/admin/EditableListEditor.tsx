"use client";

import { useState } from "react";

export default function EditableListEditor({
  title,
  description,
  fieldName,
  initialItems,
  addLabel
}: {
  title: string;
  description: string;
  fieldName: string;
  initialItems: string[];
  addLabel: string;
}) {
  const [items, setItems] = useState<string[]>(initialItems);

  const updateItem = (index: number, value: string) => {
    setItems((current) =>
      current.map((item, itemIndex) => (itemIndex === index ? value : item))
    );
  };

  const addItem = () => {
    setItems((current) => [...current, "New Item"]);
  };

  const removeItem = (index: number) => {
    setItems((current) => current.filter((_, itemIndex) => itemIndex !== index));
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-700">{title}</h2>
          <p className="mt-1 text-xs text-slate-500">{description}</p>
        </div>
        <button
          type="button"
          onClick={addItem}
          className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          {addLabel}
        </button>
      </div>

      <input type="hidden" name={fieldName} value={JSON.stringify(items)} />

      <div className="mt-5 space-y-3">
        {items.map((item, index) => (
          <div
            key={`${item}-${index}`}
            className="grid gap-3 rounded-xl border border-slate-100 p-3 md:grid-cols-[1fr_auto]"
          >
            <input
              value={item}
              onChange={(event) => updateItem(index, event.target.value)}
              placeholder="Item name"
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
