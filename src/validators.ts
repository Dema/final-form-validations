import { FieldValidator, isEmpty, withEmpty, RecordValidator } from "./helpers";
import get from "lodash.get";

export const positiveNumber = (
  errorMessage = "Must be  positive number"
): FieldValidator => (value: string | number) => {
  if (value) {
    const n = Number(value);
    return Number.isFinite(n) && n >= 0 ? undefined : errorMessage;
  }
  return undefined;
};

export const validEmail = (msg = "Invalid e-mail") => (value: string) =>
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    value
  )
    ? undefined
    : msg;

export const required = (errorMessage: string = "Required"): FieldValidator => (
  value
) => (isEmpty(value) ? errorMessage : undefined);

export const isTrue = (errorMessage: string) => (value: boolean) =>
  value !== true ? errorMessage : undefined;

// export const matches = <FieldValue>(
//   otherFieldName: string,
//   errorMessage: string
// ): FieldValidator<FieldValue> => (value, values) =>
//   value === view(lensPath(otherFieldName.split(".")), values)
//     ? undefined
//     : errorMessage;

export const maxLength = (
  max: number,
  errorMessage = "Too long"
): FieldValidator => (value) =>
  typeof value === "string" || Array.isArray(value)
    ? value.length > max
      ? errorMessage
      : undefined
    : undefined;

export const minLength = (
  min: number,
  errorMessage = "Too short"
): FieldValidator => (value) =>
  typeof value === "string" || Array.isArray(value)
    ? value.length < min
      ? errorMessage
      : undefined
    : undefined;

export const filled = (placeholder: string = "_") => (
  errorMessage = "Incomplete"
) =>
  withEmpty((value) =>
    typeof value === "string"
      ? value.includes(placeholder)
        ? errorMessage
        : undefined
      : errorMessage
  );

export const fieldsMatch = (
  field1Name: string,
  field2Name: string,
  errorMessage: string
): RecordValidator => (values) => {
  const v1 = get(values, field1Name);
  const v2 = get(values, field2Name);
  if (!v1 || !v2) {
    return undefined;
  }
  if (v1 === v2) {
    return undefined;
  }
  const err =
    errorMessage || `Fields ${field1Name} and ${field2Name} must match`;
  return {
    [field1Name]: err,
    [field2Name]: err,
  };
};
export const greaterOrEqualThanField = (
  otherField: string,
  errorMessage: string
): FieldValidator =>
  withEmpty((value, values) =>
    isEmpty(get(values, otherField)) ||
    Number(value) >= Number(get(values, otherField))
      ? undefined
      : errorMessage
  );

export const lessOrEqualThanField = (
  otherField: string,
  errorMessage: string
): FieldValidator =>
  withEmpty((value, values) =>
    isEmpty(get(values, otherField)) ||
    Number(value) <= Number(get(values, otherField))
      ? undefined
      : errorMessage
  );

export const less = (than: number, errorMessage: string) =>
  withEmpty((value) =>
    Number(value) < Number(than) ? undefined : errorMessage
  );

export const lessOrEqual = (than: number, errorMessage: string) =>
  withEmpty((value) =>
    Number(value) <= Number(than) ? undefined : errorMessage
  );

export const greater = (than: number, errorMessage: string) =>
  withEmpty((value) =>
    Number(value) > Number(than) ? undefined : errorMessage
  );

export const greaterOrEqual = (than: number, errorMessage: string) =>
  withEmpty((value) =>
    Number(value) >= Number(than) ? undefined : errorMessage
  );
