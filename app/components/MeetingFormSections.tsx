'use client';

import { FormInput, FormTextarea, FieldError } from './FormControls';
import { type FormState } from '@/lib/schemas';
import { SacramentMeeting } from '@/lib/types';

interface SectionProps {
  errors?: FormState['errors'];
  initialData?: SacramentMeeting;
}

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
            defaultValue={initialData?.meetingType || ""}
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
          <FormInput
            id="openingHymn"
            name="openingHymn"
            label="Hymn (JSON)"
            type="text"
            required
            mono
            placeholder='{"number":1,"title":"The Morning Breaks"}'
            defaultValue={initialData?.openingHymn ? JSON.stringify(initialData.openingHymn) : ""}
            errors={errors?.openingHymn}
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
      <FormInput
        id="sacramentHymn"
        name="sacramentHymn"
        label="Sacrament Hymn (JSON)"
        type="text"
        required
        mono
        placeholder='{"number":169,"title":"As Now We Take the Sacrament"}'
        defaultValue={initialData?.sacramentHymn ? JSON.stringify(initialData.sacramentHymn) : ""}
        errors={errors?.sacramentHymn}
      />

      {/* Speakers */}
      <FormTextarea
        id="speakers"
        name="speakers"
        label="Speakers (JSON array)"
        rows={3}
        mono
        placeholder='[{"name":"John Doe","topic":"Faith","type":"speaker"}]'
        defaultValue={initialData?.speakers ? JSON.stringify(initialData.speakers) : ""}
        errors={errors?.speakers}
      />

      {/* Closing */}
      <fieldset className="flex flex-col gap-3">
        <legend className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
          Closing
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            id="closingHymn"
            name="closingHymn"
            label="Hymn (JSON)"
            type="text"
            required
            mono
            placeholder='{"number":31,"title":"Oh Say What Is Truth?"}'
            defaultValue={initialData?.closingHymn ? JSON.stringify(initialData.closingHymn) : ""}
            errors={errors?.closingHymn}
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
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormTextarea
          id="wardBusiness"
          name="wardBusiness"
          label="Ward Business (JSON array)"
          rows={2}
          mono
          placeholder='[{"description":"Calling sustained: ..."}]'
          defaultValue={initialData?.wardBusiness ? JSON.stringify(initialData.wardBusiness) : ""}
          errors={errors?.wardBusiness}
        />
        <FormTextarea
          id="announcements"
          name="announcements"
          label="Announcements (comma-separated)"
          rows={2}
          placeholder="Youth activity Friday, Temple trip Saturday"
          defaultValue={initialData?.announcements ? initialData.announcements.join(', ') : ""}
          errors={errors?.announcements}
        />
      </div>

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
