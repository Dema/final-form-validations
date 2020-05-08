import get from "lodash.get";
import set from "lodash.set";
import {
  FieldValidator,
  isEmpty,
  withEmpty,
  join,
  RecordValidator,
} from "./helpers";

type Rules = {
  [key: string]: FieldValidator<unknown> | FieldValidator<unknown>[];
};
export const createValidator = (rules: Rules) => {
  return (values: object) => {
    const errors = {};
    Object.keys(rules).forEach((key) => {
      // concat enables both functions and arrays of functions
      const rule = join(([] as FieldValidator<unknown>[]).concat(rules[key]));
      const error = rule(get(values, key), values);
      if (typeof error === "string") {
        set(errors, key, error);
      } else if (error != null && typeof error === "object") {
        Object.keys(error).forEach((fieldName) =>
          set(errors, fieldName, error[fieldName])
        );
      }
    });
    return errors;
  };
};

export const composeFieldValidators = <T>(
  ...validators: Array<FieldValidator<T>>
): FieldValidator<T> => (value: T, values: object) =>
  validators
    .filter((v) => typeof v === "function")
    .reduce(
      (error: string | undefined, validator) =>
        error || validator(value, values),
      undefined
    );

export const composeRecordValidators = (
  ...validators: Array<RecordValidator>
): RecordValidator => (values) =>
  validators
    .filter((v) => typeof v === "function")
    .reduce((acc, validator) => ({ ...acc, ...validator(values) }), {});

// Validators

export const positiveNumber = (
  errorMessage = "Must be  positive number"
): FieldValidator<string | number> => (value: string | number) => {
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

export const required = <FieldValue>(
  errorMessage = "Обязательное поле"
): FieldValidator<FieldValue> => (value) =>
  isEmpty(value) ? errorMessage : undefined;

export const isTrue = (errorMessage: string) => (value: boolean) =>
  value !== true ? errorMessage : undefined;

// export const matches = <FieldValue>(
//   otherFieldName: string,
//   errorMessage: string
// ): FieldValidator<FieldValue> => (value, values) =>
//   value === view(lensPath(otherFieldName.split(".")), values)
//     ? undefined
//     : errorMessage;

export const maxLength = <FieldValue>(
  max: number,
  errorMessage = "Слишком длинный"
): FieldValidator<string | FieldValue[]> => (value) =>
  typeof value === "string" || Array.isArray(value)
    ? value.length > max
      ? errorMessage
      : undefined
    : undefined;

export const minLength = <FieldValue>(
  min: number,
  errorMessage = "Слишком короткий"
): FieldValidator<string | FieldValue[]> => (value) =>
  typeof value === "string" || Array.isArray(value)
    ? value.length < min
      ? errorMessage
      : undefined
    : undefined;

export const filled = (errorMessage = "Incomplete") =>
  withEmpty((value) =>
    typeof value === "string"
      ? value.includes("_")
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
export const greaterOrEqualThanField = <T>(
  otherField: string,
  errorMessage: string
): FieldValidator<T> =>
  withEmpty((value, values) =>
    isEmpty(get(values, otherField)) ||
    Number(value) >= Number(get(values, otherField))
      ? undefined
      : errorMessage
  );

export const lessOrEqualThanField = <T>(
  otherField: string,
  errorMessage: string
): FieldValidator<T> =>
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
