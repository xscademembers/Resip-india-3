import React, { useEffect, useState } from 'react';
import { adminApi } from '../../api/admin';
import { useToast } from '../../context/ToastContext';
import { Spinner } from '../../components/ui';
import { AdminHeading, Card, Field, inputClass, PrimaryButton } from './adminUi';
import type { ApiErrorShape } from '../../api/client';

interface SettingRow {
  _id: string;
  key: string;
  value: any;
  group: string;
}

/** Convert a stored value into a string for editing. */
const toEditable = (value: any) =>
  typeof value === 'object' && value !== null ? JSON.stringify(value, null, 2) : String(value ?? '');

/** Parse an edited string back into a typed value. */
const fromEditable = (raw: string): any => {
  const trimmed = raw.trim();
  if (trimmed === '') return '';
  if (trimmed === 'true') return true;
  if (trimmed === 'false') return false;
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) return Number(trimmed);
  if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
    try {
      return JSON.parse(trimmed);
    } catch {
      return raw;
    }
  }
  return raw;
};

export default function AdminSettings() {
  const toast = useToast();
  const [settings, setSettings] = useState<SettingRow[]>([]);
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminApi
      .settings()
      .then((list: SettingRow[]) => {
        setSettings(list);
        const initial: Record<string, string> = {};
        list.forEach((s) => (initial[s.key] = toEditable(s.value)));
        setEdits(initial);
      })
      .catch(() => setSettings([]))
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    const payload = {
      settings: settings.map((s) => ({ key: s.key, group: s.group, value: fromEditable(edits[s.key] ?? '') })),
    };
    try {
      const updated = await adminApi.updateSettings(payload);
      if (Array.isArray(updated)) setSettings(updated);
      toast.success('Settings saved');
    } catch (err) {
      toast.error((err as ApiErrorShape).message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;

  const groups = Array.from(new Set(settings.map((s) => s.group)));

  return (
    <>
      <AdminHeading
        title="Settings"
        subtitle="Site configuration — tax, shipping, contact details and more"
        action={
          <PrimaryButton onClick={save} disabled={saving}>
            {saving ? 'Saving…' : 'Save All'}
          </PrimaryButton>
        }
      />

      {settings.length === 0 ? (
        <p className="text-charcoal/60">No settings found. Run the seed script to create defaults.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {groups.map((group) => (
            <Card key={group}>
              <h2 className="mb-4 font-display text-lg font-bold capitalize text-brand-blue">{group}</h2>
              {settings
                .filter((s) => s.group === group)
                .map((s) => {
                  const isMultiline = (edits[s.key] || '').includes('\n') || (edits[s.key] || '').length > 60;
                  return (
                    <Field key={s.key} label={s.key.replace(/_/g, ' ')}>
                      {isMultiline ? (
                        <textarea
                          className={inputClass}
                          rows={4}
                          value={edits[s.key] ?? ''}
                          onChange={(e) => setEdits({ ...edits, [s.key]: e.target.value })}
                        />
                      ) : (
                        <input
                          className={inputClass}
                          value={edits[s.key] ?? ''}
                          onChange={(e) => setEdits({ ...edits, [s.key]: e.target.value })}
                        />
                      )}
                    </Field>
                  );
                })}
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
