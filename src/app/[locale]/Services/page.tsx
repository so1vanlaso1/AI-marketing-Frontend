"use client";

import React, { useState } from "react";
import ContentList from "@/features/content/ContentList";

const typeOptions = [
  { value: "a", label: "Type A" },
  { value: "b", label: "Type B" },
  { value: "c", label: "Type C" },
];

const ServicesPage: React.FC = () => {
  const [type, setType] = useState<string>("a");
  const [description, setDescription] = useState<string>("");

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="mb-8 text-2xl font-semibold">Service Configuration</h1>

      <div className="space-y-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">Service Type</label>
          <select
            value={type}
            onChange={(event) => setType(event.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          >
            {typeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">Description</label>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={4}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="Describe your configuration..."
          />
        </div>

        <div className="rounded-md bg-slate-50 p-4 text-sm text-slate-600">
          <p>
            <strong>Preview:</strong> {type.toUpperCase()} {description ? `– ${description}` : ""}
          </p>
        </div>
      </div>

      <section className="mt-10 space-y-4">
        <h2 className="text-xl font-semibold">Available Content</h2>
        <ContentList />
      </section>
    </div>
  );
};

export default ServicesPage;