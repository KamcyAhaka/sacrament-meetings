'use client';

import { useState, useRef } from 'react';
import { FormInput, FormTextarea, FieldError } from './FormControls';
import { type FormState } from '@/lib/schemas';
import { SacramentMeeting, WardBusinessItem } from '@/lib/types';

interface SectionProps {
  errors?: FormState['errors'];
  initialData?: SacramentMeeting;
}

// ---------------------------------------------------------------------------
// Internal helper: a number + title pair for one hymn
// ---------------------------------------------------------------------------

interface HymnFieldsProps {
  /** Schema key prefix, e.g. 'openingHymn' → names openingHymnNumber / openingHymnTitle */
  prefix: 'openingHymn' | 'sacramentHymn' | 'closingHymn';
  label: string;
  numberErrors?: string[];
  titleErrors?: string[];
  defaultNumber?: number;
  defaultTitle?: string;
}

function HymnFields({
  prefix,
  label,
  numberErrors,
  titleErrors,
  defaultNumber,
  defaultTitle,
}: HymnFieldsProps) {
  const numberId = `${prefix}Number`;
  const titleId = `${prefix}Title`;
  const numberErrorId = `${numberId}-error`;
  const titleErrorId = `${titleId}-error`;

  const hasErrors =
    (numberErrors && numberErrors.length > 0) ||
    (titleErrors && titleErrors.length > 0);

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={titleId}
        className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
      >
        {label}
      </label>
      <div className="grid grid-cols-[5.5rem_1fr] gap-2">
        <div>
          <label htmlFor={numberId} className="sr-only">
            {label} Number
          </label>
          <input
            id={numberId}
            name={numberId}
            type="number"
            min={1}
            required
            placeholder="No."
            defaultValue={defaultNumber?.toString() ?? ''}
            aria-describedby={numberErrorId}
            className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <div>
          <label htmlFor={titleId} className="sr-only">
            {label} Title
          </label>
          <input
            id={titleId}
            name={titleId}
            type="text"
            required
            placeholder="Hymn Title"
            defaultValue={defaultTitle ?? ''}
            aria-describedby={titleErrorId}
            className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>
      {hasErrors && (
        <div className="flex flex-col gap-0.5">
          <FieldError id={numberErrorId} errors={numberErrors} />
          <FieldError id={titleErrorId} errors={titleErrors} />
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Internal helper: dynamic speaker / musician rows
//
// Uses useState for row count so rows can be added or removed. The actual
// input values are uncontrolled (defaultValue) so the browser keeps them
// through re-renders. Repeated name= attributes let formData.getAll()
// collect them as parallel arrays in the server action.
// ---------------------------------------------------------------------------

function SpeakersField({
  initialData,
  nameErrors,
}: {
  initialData?: SacramentMeeting;
  nameErrors?: string[];
}) {
  const initialSpeakers = initialData?.speakers ?? [];

  // Track stable row keys (not indices) so React matches DOM nodes correctly
  // when a middle row is removed.
  const [keys, setKeys] = useState<number[]>(() =>
    initialSpeakers.length > 0 ? initialSpeakers.map((_, i) => i) : [0],
  );
  const nextKey = useRef(Math.max(0, ...keys) + 1);

  const addRow = () => {
    setKeys((prev) => [...prev, nextKey.current++]);
  };

  const removeRow = (key: number) => {
    setKeys((prev) => prev.filter((k) => k !== key));
  };

  return (
    <div className="flex flex-col gap-3">
      {keys.map((key, i) => {
        const initial = initialSpeakers[i];
        return (
          <div
            key={key}
            className="rounded-xl border border-slate-200 dark:border-zinc-700 p-3 flex flex-col gap-3"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormInput
                id={`speakerName-${key}`}
                name="speakerName"
                label="Name"
                type="text"
                placeholder="Sister Johnson"
                defaultValue={initial?.name ?? ''}
              />
              <FormInput
                id={`speakerTopic-${key}`}
                name="speakerTopic"
                label="Topic"
                type="text"
                placeholder="Faith in Jesus Christ"
                defaultValue={initial?.topic ?? ''}
              />
            </div>

            <div className="flex items-end gap-3">
              {/* Type select — inlined because it's not a standard FormInput */}
              <div className="flex flex-col gap-1.5 flex-1">
                <label
                  htmlFor={`speakerType-${key}`}
                  className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
                >
                  Type
                </label>
                <select
                  id={`speakerType-${key}`}
                  name="speakerType"
                  defaultValue={initial?.type ?? 'speaker'}
                  className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="speaker">Speaker</option>
                  <option value="musical-number">Musical Number</option>
                </select>
              </div>

              {/* Only allow removal when there is more than one row */}
              {keys.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeRow(key)}
                  aria-label="Remove this speaker row"
                  className="h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-xl border border-slate-200 dark:border-zinc-700 text-slate-400 hover:text-red-500 hover:border-red-300 dark:hover:border-red-800 transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        );
      })}

      <button
        type="button"
        onClick={addRow}
        className="self-start inline-flex items-center gap-1.5 rounded-lg border border-dashed border-slate-300 dark:border-zinc-600 px-3 py-2 text-sm font-medium text-slate-500 hover:text-slate-800 hover:border-slate-400 dark:text-slate-400 dark:hover:text-white dark:hover:border-zinc-400 transition-colors"
      >
        + Add speaker / musician
      </button>

      {nameErrors && nameErrors.length > 0 && (
        <div id="speakerNames-error" aria-live="polite">
          <FieldError errors={nameErrors} />
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Exported section components consumed by MeetingForm
// ---------------------------------------------------------------------------

export function MeetingOverviewFields({ errors, initialData }: SectionProps) {
  return (
    <>
      {/* Date & Meeting Type */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormInput
          id="date"
          name="date"
          label="Date"
          type="date"
          required
          defaultValue={initialData?.date}
          errors={errors?.date}
        />

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="meetingType"
            className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
          >
            Meeting Type
          </label>
          <select
            id="meetingType"
            name="meetingType"
            required
            defaultValue={initialData?.meetingType ?? ''}
            aria-describedby="meetingType-error"
            className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="" disabled>Select a type…</option>
            <option value="testimony">Fast &amp; Testimony</option>
            <option value="regular">Regular</option>
            <option value="stake">Stake</option>
            <option value="general">General Conference</option>
          </select>
          <FieldError id="meetingType-error" errors={errors?.meetingType} />
        </div>
      </div>

      {/* Presiding & Conducting */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormInput
          id="presiding"
          name="presiding"
          label="Presiding Leader"
          type="text"
          required
          placeholder="Bishop Smith"
          defaultValue={initialData?.presiding}
          errors={errors?.presiding}
        />
        <FormInput
          id="conducting"
          name="conducting"
          label="Conducting Leader"
          type="text"
          required
          placeholder="Brother Jones"
          defaultValue={initialData?.conducting}
          errors={errors?.conducting}
        />
      </div>
    </>
  );
}

export function MeetingProgramFields({ errors, initialData }: SectionProps) {
  return (
    <>
      {/* Opening */}
      <fieldset className="flex flex-col gap-3">
        <legend className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
          Opening
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <HymnFields
            prefix="openingHymn"
            label="Opening Hymn"
            numberErrors={errors?.openingHymnNumber}
            titleErrors={errors?.openingHymnTitle}
            defaultNumber={initialData?.openingHymn?.number}
            defaultTitle={initialData?.openingHymn?.title}
          />
          <FormInput
            id="openingPrayer"
            name="openingPrayer"
            label="Prayer (name)"
            type="text"
            required
            placeholder="Sister Johnson"
            defaultValue={initialData?.openingPrayer}
            errors={errors?.openingPrayer}
          />
        </div>
      </fieldset>

      {/* Sacrament Hymn */}
      <HymnFields
        prefix="sacramentHymn"
        label="Sacrament Hymn"
        numberErrors={errors?.sacramentHymnNumber}
        titleErrors={errors?.sacramentHymnTitle}
        defaultNumber={initialData?.sacramentHymn?.number}
        defaultTitle={initialData?.sacramentHymn?.title}
      />

      {/* Speakers & Musicians */}
      <fieldset className="flex flex-col gap-3">
        <legend className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
          Speakers &amp; Musicians
        </legend>
        <SpeakersField
          initialData={initialData}
          nameErrors={errors?.speakerNames as string[] | undefined}
        />
      </fieldset>

      {/* Closing */}
      <fieldset className="flex flex-col gap-3">
        <legend className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
          Closing
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <HymnFields
            prefix="closingHymn"
            label="Closing Hymn"
            numberErrors={errors?.closingHymnNumber}
            titleErrors={errors?.closingHymnTitle}
            defaultNumber={initialData?.closingHymn?.number}
            defaultTitle={initialData?.closingHymn?.title}
          />
          <FormInput
            id="closingPrayer"
            name="closingPrayer"
            label="Prayer (name)"
            type="text"
            required
            placeholder="Brother Williams"
            defaultValue={initialData?.closingPrayer}
            errors={errors?.closingPrayer}
          />
        </div>
      </fieldset>
    </>
  );
}

export function MeetingBusinessFields({ errors, initialData }: SectionProps) {
  // Defensively parse wardBusiness (could be a real array of objects, array of strings, JSON string, or undefined)
  const formattedWardBusiness = (() => {
    const raw = initialData?.wardBusiness;
    if (!raw) return '';
    if (Array.isArray(raw)) {
      return (raw as unknown as WardBusinessItem[])
        .map((b) => (typeof b === 'object' && b !== null ? b.description || '' : String(b)))
        .join('\n');
    }
    if (typeof raw === 'string') {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return (parsed as WardBusinessItem[])
            .map((b) => (typeof b === 'object' && b !== null ? b.description || '' : String(b)))
            .join('\n');
        }
        return raw;
      } catch {
        return raw;
      }
    }
    return '';
  })();

  // Defensively parse announcements
  const formattedAnnouncements = (() => {
    const raw = initialData?.announcements;
    if (!raw) return '';
    if (Array.isArray(raw)) {
      return raw.join('\n');
    }
    if (typeof raw === 'string') {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed.join('\n');
        }
        return raw;
      } catch {
        return raw;
      }
    }
    return '';
  })();

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Ward business — one description per line */}
        <FormTextarea
          id="wardBusiness"
          name="wardBusiness"
          label="Ward Business (one item per line)"
          rows={3}
          placeholder={'Sustaining of new members\nRelease of Primary president'}
          defaultValue={formattedWardBusiness}
          errors={errors?.wardBusiness}
        />
        {/* Announcements — one item per line */}
        <FormTextarea
          id="announcements"
          name="announcements"
          label="Announcements (one per line)"
          rows={3}
          placeholder={'Youth activity this Friday\nTemple trip Saturday'}
          defaultValue={formattedAnnouncements}
          errors={errors?.announcements}
        />
      </div>

      {/* Stake business checkbox */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-3">
          <input
            id="stakeBusiness"
            name="stakeBusiness"
            type="checkbox"
            value="true"
            defaultChecked={initialData?.stakeBusiness}
            aria-describedby="stakeBusiness-error"
            className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 dark:border-zinc-600"
          />
          <label
            htmlFor="stakeBusiness"
            className="text-sm text-slate-700 dark:text-slate-300"
          >
            Stake business conducted this meeting
          </label>
        </div>
        <FieldError id="stakeBusiness-error" errors={errors?.stakeBusiness} />
      </div>
    </>
  );
}
