import React, { useEffect, useState } from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown, GripVertical } from 'lucide-react';
import { adminApi } from '../../api/admin';
import { useToast } from '../../context/ToastContext';
import { Spinner } from '../../components/ui';
import { AdminHeading, Card, inputClass, PrimaryButton } from './adminUi';
import { ANNOUNCEMENT_MESSAGES } from '../../constants';
import type { ApiErrorShape } from '../../api/client';

interface SettingRow {
  _id?: string;
  key: string;
  value: any;
  group: string;
}

const SETTING_KEY = 'announcement_messages';
const SETTING_GROUP = 'header';

/** Convert any stored value into a clean array of message strings. */
const toMessages = (value: unknown): string[] => {
  const list = Array.isArray(value)
    ? value
    : typeof value === 'string'
      ? value.split('\n')
      : [];
  return list.map((m) => String(m).trim()).filter(Boolean);
};

export default function AdminAnnouncements() {
  const toast = useToast();
  const [messages, setMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminApi
      .settings()
      .then((list: SettingRow[]) => {
        const row = list.find((s) => s.key === SETTING_KEY);
        const existing = toMessages(row?.value);
        setMessages(existing.length ? existing : [...ANNOUNCEMENT_MESSAGES]);
      })
      .catch(() => setMessages([...ANNOUNCEMENT_MESSAGES]))
      .finally(() => setLoading(false));
  }, []);

  const updateMessage = (i: number, text: string) =>
    setMessages((prev) => prev.map((m, idx) => (idx === i ? text : m)));

  const removeMessage = (i: number) => setMessages((prev) => prev.filter((_, idx) => idx !== i));

  const addMessage = () => setMessages((prev) => [...prev, '']);

  const move = (i: number, dir: -1 | 1) =>
    setMessages((prev) => {
      const next = [...prev];
      const target = i + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[i], next[target]] = [next[target], next[i]];
      return next;
    });

  const save = async () => {
    const cleaned = messages.map((m) => m.trim()).filter(Boolean);
    if (cleaned.length === 0) {
      toast.error('Add at least one message before saving.');
      return;
    }
    setSaving(true);
    try {
      await adminApi.updateSettings({
        settings: [{ key: SETTING_KEY, group: SETTING_GROUP, value: cleaned }],
      });
      setMessages(cleaned);
      toast.success('Announcement bar updated');
    } catch (err) {
      toast.error((err as ApiErrorShape).message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <>
      <AdminHeading
        title="Announcement Bar"
        subtitle="Messages that rotate in the blue strip at the top of every page"
        action={
          <PrimaryButton onClick={save} disabled={saving}>
            {saving ? 'Saving…' : 'Save Changes'}
          </PrimaryButton>
        }
      />

      {/* Live preview */}
      <div className="mb-6 overflow-hidden rounded-2xl border border-brand-blue/10 shadow-sm">
        <div className="flex h-10 w-full items-center justify-center bg-brand-blue px-4 text-white">
          <p className="max-w-full truncate text-center text-[11px] font-semibold uppercase tracking-[0.28em] md:text-xs md:tracking-[0.32em]">
            <span className="text-brand-gold">◆ </span>
            {messages.find((m) => m.trim()) || 'Your message will appear here'}
            <span className="text-brand-gold"> ◆</span>
          </p>
        </div>
      </div>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-brand-blue">Messages</h2>
          <span className="text-xs font-semibold text-charcoal/50">{messages.length} total</span>
        </div>

        {messages.length === 0 ? (
          <p className="mb-4 text-sm text-charcoal/60">No messages yet. Add your first one below.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {messages.map((message, i) => (
              <div key={i} className="flex items-center gap-2">
                <GripVertical size={16} className="shrink-0 text-charcoal/25" />
                <input
                  className={inputClass}
                  value={message}
                  placeholder="e.g. Free delivery on orders above ₹999"
                  onChange={(e) => updateMessage(i, e.target.value)}
                />
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    aria-label="Move up"
                    className="rounded-lg p-2 text-charcoal/60 hover:bg-brand-blue/5 disabled:opacity-30"
                  >
                    <ArrowUp size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, 1)}
                    disabled={i === messages.length - 1}
                    aria-label="Move down"
                    className="rounded-lg p-2 text-charcoal/60 hover:bg-brand-blue/5 disabled:opacity-30"
                  >
                    <ArrowDown size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeMessage(i)}
                    aria-label="Remove message"
                    className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={addMessage}
          className="mt-4 inline-flex items-center gap-2 rounded-xl border border-dashed border-brand-blue/30 px-4 py-2 text-sm font-bold text-brand-blue transition-colors hover:bg-brand-blue/5"
        >
          <Plus size={16} /> Add message
        </button>
      </Card>
    </>
  );
}
