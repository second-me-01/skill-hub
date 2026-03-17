"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface SkillOption {
  id: string;
  nameCn: string;
}

interface EventFormProps {
  skills: SkillOption[];
}

const EVENT_TYPES = [
  "launch",
  "promotion",
  "update",
  "media",
  "partnership",
  "other",
] as const;

const CHANNELS = [
  "twitter",
  "wechat",
  "blog",
  "newsletter",
  "community",
  "other",
] as const;

export function EventForm({ skills }: EventFormProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; error?: boolean } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const body = {
      skill_id: formData.get("skill_id") as string,
      type: formData.get("type") as string,
      channel: formData.get("channel") as string,
      description: formData.get("description") as string,
      url: (formData.get("url") as string) || undefined,
    };

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to create event");
      }

      setMessage({ text: "Event created successfully" });
      form.reset();
    } catch (err) {
      setMessage({
        text: err instanceof Error ? err.message : "Unknown error",
        error: true,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border bg-white p-5">
      <h3 className="text-base font-semibold">Add Event</h3>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="skill_id">Skill</Label>
          <select
            id="skill_id"
            name="skill_id"
            required
            className="flex h-8 w-full items-center rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="">Select skill...</option>
            {skills.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nameCn}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="type">Type</Label>
          <select
            id="type"
            name="type"
            required
            className="flex h-8 w-full items-center rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="">Select type...</option>
            {EVENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="channel">Channel</Label>
          <select
            id="channel"
            name="channel"
            className="flex h-8 w-full items-center rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="">Select channel...</option>
            {CHANNELS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          required
          placeholder="Describe the event..."
          className="min-h-20"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="url">URL (optional)</Label>
        <Input id="url" name="url" type="url" placeholder="https://..." />
      </div>

      {message && (
        <p
          className={`text-sm ${message.error ? "text-red-500" : "text-emerald-600"}`}
        >
          {message.text}
        </p>
      )}

      <Button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Add Event"}
      </Button>
    </form>
  );
}
