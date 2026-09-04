import React, { useEffect, useState } from 'react';
import { Leaf } from 'lucide-react';
import { adminApi } from '../../api/admin';
import { useToast } from '../../context/ToastContext';
import { Spinner } from '../../components/ui';
import { AdminHeading, Card, Field, inputClass, PrimaryButton } from './adminUi';
import type { ApiErrorShape } from '../../api/client';

const IMPACT_FIELDS = [
  {
    valueKey: 'impact_bottles_value',
    labelKey: 'impact_bottles_label',
    title: 'Bottles upcycled',
    defaultValue: '6,000+',
    defaultLabel: 'Bottle Upcycled',
  },
  {
    valueKey: 'impact_co2_value',
    labelKey: 'impact_co2_label',
    title: 'CO₂ reduced',
    defaultValue: '204kg',
    defaultLabel: 'CO2 Reduce',
  },
  {
    valueKey: 'impact_water_value',
    labelKey: 'impact_water_label',
    title: 'Water saved',
    defaultValue: '31,800 L',
    defaultLabel: 'Saved Water',
  },
  {
    valueKey: 'impact_landfill_value',
    labelKey: 'impact_landfill_label',
    title: 'Landfill diverted',
    defaultValue: '2.5+ Tonnes',
    defaultLabel: 'Landfilled Diverted',
  },
] as const;

type FormState = Record<string, string>;

function buildDefaults(): FormState {
  const form: FormState = {};
  for (const f of IMPACT_FIELDS) {
    form[f.valueKey] = f.defaultValue;
    form[f.labelKey] = f.defaultLabel;
  }
  return form;
}

export default function AdminImpact() {
  const toast = useToast();
  const [form, setForm] = useState<FormState>(buildDefaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminApi
      .settings()
      .then((list: Array<{ key: string; value: unknown; group: string }>) => {
        const next = buildDefaults();
        for (const row of list) {
          if (row.key in next) {
            next[row.key] = String(row.value ?? next[row.key]);
          }
        }
        setForm(next);
      })
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminApi.updateSettings({
        settings: IMPACT_FIELDS.flatMap((f) => [
          { key: f.valueKey, group: 'impact', value: form[f.valueKey]?.trim() || f.defaultValue },
          { key: f.labelKey, group: 'impact', value: form[f.labelKey]?.trim() || f.defaultLabel },
        ]),
      });
      toast.success('Impact stats saved — homepage will show the new numbers');
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
        title="Our Impact"
        subtitle="Edit the numbers shown on the homepage Impact section"
        action={
          <PrimaryButton onClick={save} disabled={saving}>
            {saving ? 'Saving…' : 'Save Impact Stats'}
          </PrimaryButton>
        }
      />

      <form onSubmit={save} className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {IMPACT_FIELDS.map((f) => (
          <Card key={f.valueKey}>
            <div className="mb-4 flex items-center gap-2 text-brand-gold">
              <Leaf size={20} />
              <h2 className="font-display text-lg font-bold text-brand-blue">{f.title}</h2>
            </div>
            <Field label="Number / value (shown large)">
              <input
                className={inputClass}
                value={form[f.valueKey] ?? ''}
                onChange={(e) => setForm({ ...form, [f.valueKey]: e.target.value })}
                placeholder={f.defaultValue}
                required
              />
            </Field>
            <Field label="Label (shown under the number)">
              <input
                className={inputClass}
                value={form[f.labelKey] ?? ''}
                onChange={(e) => setForm({ ...form, [f.labelKey]: e.target.value })}
                placeholder={f.defaultLabel}
                required
              />
            </Field>
          </Card>
        ))}
        <div className="md:col-span-2">
          <PrimaryButton type="submit" disabled={saving} className="w-full md:w-auto">
            {saving ? 'Saving…' : 'Save Impact Stats'}
          </PrimaryButton>
        </div>
      </form>
    </>
  );
}
