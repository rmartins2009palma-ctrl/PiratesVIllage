// Types, constants and helpers for the New Child Registration flow (frontend-only mock).

export interface GuardianDraft {
  id: string
  fullName: string
  countryCode: string
  phone: string
  relationship: string
  email: string
}

export interface RegistrationDraft {
  firstName: string
  lastName: string
  age: string
  room: string
  allergies: string
  medical: string
  notes: string
  guardians: GuardianDraft[]
  consent: boolean
}

export const RELATIONSHIPS = [
  "Mother",
  "Father",
  "Grandmother",
  "Grandfather",
  "Aunt",
  "Uncle",
  "Other",
] as const

export const AGES = Array.from({ length: 10 }, (_, i) => i + 3) // 3–12

export interface CountryCode {
  code: string
  country: string
}

export const COUNTRY_CODES: CountryCode[] = [
  { code: "+44", country: "UK" },
  { code: "+34", country: "Spain" },
  { code: "+33", country: "France" },
  { code: "+49", country: "Germany" },
  { code: "+39", country: "Italy" },
  { code: "+46", country: "Sweden" },
  { code: "+353", country: "Ireland" },
  { code: "+31", country: "Netherlands" },
  { code: "+1", country: "US / Canada" },
]

export function createGuardian(id: string): GuardianDraft {
  return {
    id,
    fullName: "",
    countryCode: "+44",
    phone: "",
    relationship: "",
    email: "",
  }
}

export function createInitialDraft(): RegistrationDraft {
  return {
    firstName: "",
    lastName: "",
    age: "",
    room: "",
    allergies: "",
    medical: "",
    notes: "",
    guardians: [createGuardian("primary")],
    consent: false,
  }
}

// Group the national number into readable blocks of up to 4 digits.
export function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 12)
  const groups = digits.match(/.{1,4}/g)
  return groups ? groups.join(" ") : ""
}

export const CONSENT_VERSION = "Terms v.1.2 — 09/2026"

export const CONSENT_TEXT = [
  "By signing this form you (the parent or legal guardian) consent to Pirates Village Kids Club collecting and processing personal data relating to your child for the sole purpose of providing safe, supervised childcare during your stay. The information gathered includes the child's name, age, room number and the contact details of authorized guardians.",
  "You acknowledge that details concerning allergies, medical conditions or disabilities constitute health data under applicable data-protection regulations (RGPD / GDPR). This information is collected exclusively to safeguard the wellbeing of your child, to respond appropriately in the event of a medical incident, and to inform the animation team of any necessary precautions. Such data is treated with heightened confidentiality and is accessible only to authorized club staff.",
  "You confirm that only the guardians registered on this form are permitted to collect the child from the club. The club reserves the right to request photographic identification before releasing a child to any adult. Additional authorized adults may be added at any point during your stay by speaking with a member of the animation team.",
  "The handwritten signature captured on this form, together with the associated registration data, will be retained for the duration of the current season and for a reasonable period thereafter in order to comply with the club's safeguarding and insurance obligations. The signature serves as your explicit, informed and freely given consent to the terms described herein.",
  "You retain the right to access, rectify, restrict or request the deletion of the personal data held about you and your child at any time. Requests may be submitted to the reception desk or to the club's data-protection contact. Withdrawing consent will not affect the lawfulness of processing carried out prior to such withdrawal, but may prevent your child from continuing to attend the club where the data is essential to their safe supervision.",
  "This consent is provided voluntarily. You confirm that the information supplied is accurate to the best of your knowledge and that you will notify the club promptly of any changes, in particular any changes relating to allergies, medical conditions or authorized guardians.",
]
