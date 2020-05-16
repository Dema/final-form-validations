import get from "lodash.get";
import set from "lodash.set";

/**
 * final-form field-level validator is a function that takes current field value, all values and returns <code>undefined</code> if there's no errors
 * or string with error message
 */
export type FieldValidator = (
  value: unknown,
  values: object
) => string | undefined;

export type RecordValidator = (
  values: object
) => { [key: string]: string | undefined } | undefined;

export const isEmpty = (value: unknown): value is null | undefined =>
  value == null || (typeof value === "string" && value.trim().length === 0);

export const withEmpty = (f: FieldValidator): FieldValidator => (
  value,
  values
) => {
  if (!isEmpty(value)) {
    return f(value, values);
  } else {
    return undefined;
  }
};

export const join = (rules: FieldValidator[]): FieldValidator => (
  value,
  values
) =>
  rules
    .map((rule) => rule(value, values))
    .filter((error) => typeof error === "object" || !!error)[0];

type Rules = {
  [key: string]: FieldValidator | FieldValidator[];
};

/**
 * Main feature of the whole validation "framework". It allows to declaratively compose validation function from smaller primitives
 *
 * @param rules object with validators for corresponding fields
 * @returns validator that can be used in react-final-form or redux-form
 */
export const createValidator = (rules: Rules) => {
  return (values: object) => {
    const errors = {};
    Object.keys(rules).forEach((key) => {
      // concat enables both functions and arrays of functions
      const rule = join(([] as FieldValidator[]).concat(rules[key]));
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

export const composeFieldValidators = (
  ...validators: Array<FieldValidator>
): FieldValidator => (value: unknown, values: object) =>
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
