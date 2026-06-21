export const PROPERTY_TYPES = ['Apartment', 'Villa', 'Plot/Land', 'Commercial'] as const;

export const BHK_OPTIONS = ['1', '2', '3', '4'] as const;

export const USER_LISTING_STATUSES = ['Ready to Move', 'Under Construction', 'Resale'] as const;

export const BUILDER_LISTING_STATUSES = ['Ready to Move', 'Under Construction', 'Sold'] as const;

export const PROJECT_STATUSES = ['Under Construction', 'Ready to Move', 'Pre-Launch'] as const;

export function trim(value: string | null | undefined): string {
  return (value ?? '').trim();
}

export function inputBorder(showErrors: boolean, error: string): string {
  return showErrors && error ? '1px solid var(--accent-red)' : '1px solid var(--border-mid)';
}

export function isPositiveInt(value: unknown): boolean {
  const n = Number(value);
  return Number.isInteger(n) && n > 0;
}

export function isNonNegativeNumber(value: unknown): boolean {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0;
}

/** Drop empty strings and undefined so optional API fields are omitted. */
export function omitEmptyFields<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const result: Partial<T> = {};
  for (const key of Object.keys(obj) as (keyof T)[]) {
    const value = obj[key];
    if (value === '' || value === undefined) continue;
    result[key] = value;
  }
  return result;
}
