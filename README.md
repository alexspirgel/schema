# Schema

Schema is a JavaScript validator, meaning it will only detect if an input matches defined constraints, it will never edit any data.

## Terminology

**Input:** The values to be checked against the **schema**.

**Schema:** The data model used to **validate** the **input**.

**Validate:** The action of comparing the **input** to the **schema**.

## Options

These parameters are used to define the schema rule set.

### required

Setting `required` to `true` forces a value to be passed. Defaults to `false`.
```js
var required_schema = {
    'required': true
};
```

---

### type

<details>

<summary>boolean</summary>

```js
var boolean_schema = {
    'type': 'boolean'
};
```

Booleans have no unique options.

</details>
<br>
<details>

<summary>number</summary>

```js
var number_schema = {
    'type': 'number'
    'number_min': 0,
    'number_max': 25,
    'number_multiple_of': 5
};
```
**number_min**

The input number must be greater than or equal to the set `number_min` number. Defaults to `undefined`.

`'number_min': number`

**number_max**

The input number must be less than or equal to the set `number_max` number. Defaults to `undefined`.

`'number_max': number`

**number_multiple_of**

The input number must be a multiple of the set `number_multiple_of` number. Defaults to `undefined`.

`'number_multiple_of': number`

Note: You cam limit the number to integers by setting `number_multiple_of` to `1`.

</details>
<br>
<details>

<summary>string</summary>

```js
var string_schema = {
    'type': 'string',
    'string_min_characters': 5,
    'string_max_characters': 100
};
```

**string_min_characters**

The input string character count must be longer than or equal to the set `string_min_characters`. Defaults to `undefined`.

`'string_min_characters': number`

**string_max_characters**

The input string character count must be shorter than or equal to the set `string_max_characters`. Defaults to `undefined`.

`'string_max_characters': number`

</details>
<br>
<details>

<summary>symbol</summary>

```js
var symbol_schema = {
    'type': 'symbol'
};
```

Symbols have no unique options.

</details>
<br>
<details>

<summary>function</summary>

```js
var function_schema = {
    'type': 'function'
};
```

Functions have no unique options.

</details>
<br>
<details>

<summary>array</summary>

```js
var array_schema = {
    'type': 'array',
    'array_min_length': 2,
    'array_max_length': 6,
    'array_items_unique': true,
    'array_item_schema': {
        'type': 'string'
    }
};
```

**array_min_length**

The input array length must be longer than or equal to the set `array_min_length`. Defaults to `undefined`.

`'array_min_length': number`

**array_max_length**

The input array length must be shorter than or equal to the set `array_max_length`. Defaults to `undefined`.

`'array_max_length': number`

**array_items_unique**

If set to `true`, input arrays with 2 or more items with the same value will fail validation. Defaults to `false`.

`'array_items_unique': boolean`

**array_item_schema**

Each input array item must validate using the set `array_item_schema`. This value can also be defined as an array of schema. Defaults to `undefined`.

`'array_item_schema': object|array`

</details>
<br>
<details>

<summary>object</summary>

```js
var object_schema = {
    'type': 'object',
    'object_allow_unexpected': true,
    'object_unique_values': true,
    'object_property_schema': {
        'property_abc': {
            'required': true,
            'type': 'number'
        }
        'property_xyz': {
            'type': 'string'
        }
    }
};
```

**object_allow_unexpected**

If set to `false`, input objects with properties not listed within `object_properties` will fail validation. Defaults to `true`.

`'object_allow_unexpected': boolean`

**object_unique_values**

If set to `true`, input objects with a property value equal to another property value on the same object will fail validation. Defaults to `false`.

`'object_unique_values': boolean`

**object_property_schema**

Each property within the `object_property_schema` option represents a new full schema that can include generic schema options.

`'object_property_schema': object`

</details>
<br>

Note: If no `type` is set, any type variable will be considered valid.

#### Optional Schema

When a value has more than one valid syntax, multiple schema can be defined. Anywhere a single schema object can be defined, so can an array of schema objects.

Here is an example of optional schema:

```js
var multiple_type_schema = {
    'type_schema': [
        {
            'type': 'number',
            'number_multiple_of': 5
        },
        {
            'type': 'array',
            'number_multiple_of': {
                'type': 'number',
                'array_item_type_schema': 5
            }
        }
    ]
};
```

This schema configuration allows for the input to be either a single value or an array of values.

## Notes:

* When implementing schema into your script, it's a good idea to include the option to turn off schema validation. This is helpful for optimizing performance in production environments when the input has already been proven valid.

## Known Issues:

* None.

## Changelog:

### Version 0.0.1

* Script creation.