# final-form-validations

> set of validators to use with final-form or redux-form

[![NPM](https://img.shields.io/npm/v/@dmitry.olyenyov/final-form-validations.svg)](https://www.npmjs.com/package/@dmitry.olyenyov/final-form-validations) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
yarn add final-form-validations
```

## Usage

```tsx
import React, { Component } from "react";
import { Form, Field } from "rect-final-form";

import {
  createValidator,
  composeFieldValidators,
  required,
  minLength,
  maxLength,
  le,
  ge,
} from "@dmitry.olyenyov/final-form-validations";

const validators = createValidator({
  lastName: [
    requried("Required!"),
    minLength(2, "Please enter at least 2 chars"),
    maxLength(500, "Name is too long"),
  ],
  description: required("Required!"),
});

class Example extends Component {
  render() {
    return (
      <Form onSubmit={() => {}} validate={validators}>
        <Field name="lastName" component="input" />
        <Field name="description" component="input" />
        <Field
          name="someField"
          component="input"
          validate={composeFieldValidators(
            requried("Required!"),
            le(1000, "Must be less than 1000")
          )}
        />
      </Form>
    );
  }
}
```

## License

MIT © [Dema](https://github.com/Dema/)
