// Per-hotel configuration for field visibility and information density.
//
// The philosophy, straight from the Lead Animator's feedback: features are never
// deleted, only hidden. Every field below stays fully implemented — the config
// only decides whether it renders. A hidden field is genuinely not rendered
// (never `display: none`), so the DOM and the accessibility tree stay clean and
// validation skips it entirely.

export interface FieldConfig {
  /** When false the field is not rendered at all. */
  visible: boolean
  /** Only meaningful while the field is visible — see isFieldRequired(). */
  required: boolean
}

export type RegistrationFieldKey =
  | "childAllergies"
  | "childDisability"
  | "childNationality"
  | "childLanguage"
  | "specialNotes"
  | "guardianRelationship"
  | "guardianEmail"
  | "additionalGuardians"

export interface HotelConfig {
  registrationFields: Record<RegistrationFieldKey, FieldConfig>
  displayFields: {
    kidCard: {
      showVisitCount: boolean
      showEntryTimeInStatus: boolean
      showAllergyIcon: boolean
    }
    kidsRegistry: {
      /** The "Registered today" / "With allergies" filter chips. */
      showAdvancedFilters: boolean
    }
    childDetail: {
      showGuardianRelationship: boolean
      showNationality: boolean
      showLanguage: boolean
      showSeason: boolean
    }
  }
}

/**
 * Pirates Village, Santa Ponsa.
 *
 * Tuned from the Lead Animator's review: the crew already knows who each
 * guardian is, so the relationship label is noise, and nationality/language
 * were never consulted during day-to-day care.
 */
export const HOTEL_CONFIG: HotelConfig = {
  registrationFields: {
    childAllergies: { visible: true, required: false },
    childDisability: { visible: true, required: false },
    childNationality: { visible: false, required: false },
    childLanguage: { visible: false, required: false },
    specialNotes: { visible: true, required: false },
    guardianRelationship: { visible: false, required: false },
    guardianEmail: { visible: true, required: false },
    additionalGuardians: { visible: true, required: false },
  },
  displayFields: {
    kidCard: {
      showVisitCount: false,
      showEntryTimeInStatus: false,
      showAllergyIcon: true,
    },
    kidsRegistry: {
      showAdvancedFilters: false,
    },
    childDetail: {
      showGuardianRelationship: false,
      showNationality: false,
      showLanguage: false,
      showSeason: true,
    },
  },
}

/**
 * The irreducible core of a registration. These are deliberately absent from
 * the config: a hotel may add fields, never drop the ones that make a record
 * usable for safe supervision.
 */
export const CORE_REQUIRED_FIELDS = [
  "firstName",
  "lastName",
  "age",
  "room",
  "primaryGuardianName",
  "primaryGuardianPhone",
  "consentSignature",
] as const

export function isFieldVisible(key: RegistrationFieldKey): boolean {
  return HOTEL_CONFIG.registrationFields[key].visible
}

/**
 * A hidden field is never required. Enforcing it here stops the config from
 * contradicting itself and blocking the form on something nobody can see.
 */
export function isFieldRequired(key: RegistrationFieldKey): boolean {
  const field = HOTEL_CONFIG.registrationFields[key]
  return field.visible && field.required
}

/**
 * Values persisted for hidden fields, so records stay valid whatever the hotel
 * hides. "Other" is a member of the existing Relationship union, which keeps
 * saved guardians type-safe when the relationship picker is switched off.
 */
export const HIDDEN_FIELD_DEFAULTS = {
  guardianRelationship: "Other",
} as const
