# Schema

Schema is a JavaScript validator, meaning it will detect if an input matches defined constraints, it will not edit input data.

## Terminology

**Model**: The data model used to **validate**.

**Input**: The value to **validate**.

**Validate**: The action of comparing the **input** to the rules set in the **model**.

## Usage

Create a schema using a model:

```js
const schema = new Schema({
    type: 'number',
    greaterThan: 5
});
```

Use the schema to validate an input:

```js
schema.validate(6); // returns true
```

You can specify an error style as the second parameter of the validate method. The error style options are:
* `'throw'` (default) will throw a formatted error on validate failure.
* `'array'` will return an array of errors on validate failure.
* `'boolean'` will return false on validate failure.

More complex example:
```js
const schema = new Schema({
    required: true,
    type: 'object',
    propertySchema: {
        width: {
            required: true,
            type: 'number',
            greaterThanOrEqualTo: 0
        },
        tags: {
            type: 'array',
            itemSchema: [
                {
                    type: 'string'
                },
                {
                    type: 'number'
                }
            ]
        }
    }
});
schema.validate(null); // fail
schema.validate({}); // fail
schema.validate({ // pass
    width: 10
});
schema.validate({ // pass
    width: 10,
    tags: []
});
schema.validate({ // fail
    width: 10,
    tags: ['test', true]
});
schema.validate({ // pass
    width: 10,
    tags: ['test', 123]
});
```

## Model Properties

These parameters are used to define the schema rule set.

<details>

<summary>required</summary>

This property has no restrictions on what models it can belong to.

Available values: any boolean.

Setting `required` to `true` requires an input not to be `null` or `undefined`.

Setting `required` to `false` or omitting it from the model (equivalent to `undefined`) will not require any input. If an input is `null` or `undefined` all other model properties will be skipped and the input is valid.

```js
model = {
  required: true
};
```

</details>

<details>

<summary>type</summary>

This property has no restrictions on what models it can belong to.

Available values: `boolean`, `number`, `string`, `array`, `object`, `function`.

An input must match the set type.

```js
model = {
  type: 'boolean'
};
```

Notes:
* `NaN` is not a valid `number`.
* `null` is not a valid `object`.
* Arrays are not objects and objects are not arrays.
  * `[]` is not a valid `object`.
  * `{}` is not a valid `array`.

</details>

<details>

<summary>exactValue</summary>

This property is restricted to models with a `type` property of `boolean`, `number`, or `string`.

Available values: any value or array of values.

An input must match the value or one of the values in an array of values.

```js
model = {
  type: 'string',
  exactValue: 'hello world'
};
```

```js
model = {
  type: 'number',
  exactValue: [5, 7, -12]
};
```

</details>

<details>

<summary>greaterThan</summary>

This property is restricted to models with a `type` property of `number`.

Available values: any number.

An input must be greater than the set number.

```js
model = {
  type: 'number',
  greaterThan: 5
};
```

</details>

<details>

<summary>greaterThanOrEqualTo</summary>

This property is restricted to models with a `type` property of `number`.

Available values: any number.

An input must be greater than or equal to the set number.

```js
model = {
  type: 'number',
  greaterThanOrEqualTo: 5
};
```

</details>

<details>

<summary>lessThan</summary>

This property is restricted to models with a `type` property of `number`.

Available values: any number.

An input must be less than the set number.

```js
model = {
  type: 'number',
  lessThan: 5
};
```

</details>

<details>

<summary>lessThanOrEqualTo</summary>

This property is restricted to models with a `type` property of `number`.

Available values: any number.

An input must be less than or equal to the set number.

```js
model = {
  type: 'number',
  lessThanOrEqualTo: 5
};
```

</details>

<details>

<summary>divisibleBy</summary>

This property is restricted to models with a `type` property of `number`.

Available values: any number or array of numbers.

An input must be divisible by the set number or one of the numbers in the array of numbers.

```js
model = {
  type: 'number',
  divisibleBy: 2 // even numbers
};
```

```js
model = {
  type: 'number',
  divisibleBy: [5, 8]
};
```

</details>

<details>

<summary>notDivisibleBy</summary>

This property is restricted to models with a `type` property of `number`.

Available values: any number or array of numbers.

An input must not be divisible by the set number or any of the numbers in the array of numbers.

```js
model = {
  type: 'number',
  notDivisibleBy: 2 // odd numbers
};
```

```js
model = {
  type: 'number',
  notDivisibleBy: [5, 8]
};
```

</details>

<details>

<summary>minimumCharacters</summary>

This property is restricted to models with a `type` property of `string`.

Available values: any number.

An input must have a character count greater than or equal to the set number.

```js
model = {
  type: 'string',
  minimumCharacters: 5
};
```

</details>

<details>

<summary>maximumCharacters</summary>

This property is restricted to models with a `type` property of `string`.

Available values: any number.

An input must have a character count less than or equal to the set number.

```js
model = {
  type: 'string',
  maximumCharacters: 5
};
```

</details>

<details>

<summary>minimumLength</summary>

This property is restricted to models with a `type` property of `array`.

Available values: any number.

An input must have length greater than or equal to the set number.

```js
model = {
  type: 'array',
  minimumLength: 5
};
```

</details>

<details>

<summary>maximumLength</summary>

This property is restricted to models with a `type` property of `array`.

Available values: any number.

An input must have length less than or equal to the set number.

```js
model = {
  type: 'array',
  maximumLength: 5
};
```

</details>

<details>

<summary>itemSchema</summary>

This property is restricted to models with a `type` property of `array`.

Available values: any model.

Each item of the input array must validate using the `itemSchema`.

```js
model = {
  type: 'array',
  itemSchema: {
    type: 'number'
  }
};
```

</details>

<details>

<summary>instanceOf</summary>

This property is restricted to models with a `type` property of `object`.

Available values: any object or array of objects.

An input must be an instance of the object or one of the objects in the array of objects.

```js
model = {
  type: 'object',
  instanceOf: Element
};
```

```js
model = {
  type: 'object',
  instanceOf: [Element, Error]
};
```

</details>

<details>

<summary>propertySchema</summary>

This property is restricted to models with a `type` property of `object`.

Available values: an object containing property and model pairs.

Each property of the input object must validate using the corresponding property model defined in the model.

```js
model = {
  type: 'object',
  propertySchema: {
    property1: {
      type: 'number'
    },
    property2: {
      type: 'string'
    }
  }
};
```

</details>

<details>

<summary>custom</summary>

This property has no restrictions on what models it can belong to.

Available values: any function that returns true on successfull validation or throws a `Schema.ValidationError` on failure.

An input must be validate successfully using the custom validation function.

```js
model = {
  custom: (inputPathManager) => {
    if (inputPathManager.value.includes('hello')) {
      return true;
    }
    else {
      throw new Schema.ValidationError(`Custom validation failed. The input must contain the string 'hello'.`);
    }
  }
};
```

Notes:
* Do not edit the `inputPathManager.data`. If the data is not primitive this will change the input value for the rest of the validation. This will be fixed in a future update.

</details>

## Multiple Models

Anywhere you could use a model, you can instead use an array of models. If an input validates successfully using any of the models in the array, the validation is successfull.

Here is an example of multiple models:

```js
model = [
  {
    type: 'number'
  },
  {
    type: 'string'
  }
];
```

This model allows for the input to be either a number or a string.