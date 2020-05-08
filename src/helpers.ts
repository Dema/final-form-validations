export type FieldValidator<T> = (
  value: T,
  values: object
) => string | undefined;

export type RecordValidator = (
  values: object
) => { [key: string]: string | undefined } | undefined;

export const isEmpty = (value: unknown): value is null | undefined =>
  value == null || (typeof value === "string" && value.trim().length === 0);

export const withEmpty = <T>(f: FieldValidator<T>): FieldValidator<T> => (
  value,
  values
) => {
  if (!isEmpty(value)) {
    return f(value, values);
  } else {
    return undefined;
  }
};

export const join = <T>(rules: FieldValidator<T>[]): FieldValidator<T> => (
  value,
  values
) =>
  rules
    .map((rule) => rule(value, values))
    .filter((error) => typeof error === "object" || !!error)[0];
