# Schema

## Terminoligy

**Input:** The values to be checked against the **schema**.

**Schema:** The set of rules used to **validate** the **input**.

**Validate:** The action of comparing the **input** to the **schema**.

## Options

### Generic Schema

These parameters are set at the root of a schema, regardless if the schema has more than one nested type schema.

#### required

Setting `required` to `true` forces a value to be passed. Defaults to `false`.
```js
var required_schema = {
    'required': true
};
```

---

### Type Schema

Type schema relate to a specific data type. The data types are:

* Boolean
* Number
* String
* Symbol
* Function
* Array
* Object

A single type schema can be defined directly in the schema root. Multiple type schema must be defined within the `type_schema` property as an array.

#### type

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
    'string_max_characters': 100,
    'string_regexp_match': '/dog/'
};
```

**string_min_characters**

The input string character count must be longer than or equal to the set `string_min_characters`. Defaults to `undefined`.

`'string_min_characters': number`

**string_max_characters**

The input string character count must be shorter than or equal to the set `string_max_characters`. Defaults to `undefined`.

`'string_max_characters': number`

**string_regexp_match**

The input string must return a match for the regular expression string set in `string_regexp_match`. Defaults to `undefined`.

`'string_regexp_match': string`

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
    'array_item_type_schema': {
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

**array_item_type_schema**

Each input array item must validate using the set `array_item_type_schema`. This value can also be defined as an array of type schema. Defaults to `undefined`.

`'array_item_type_schema': object|array`

</details>
<br>
<details>

<summary>object</summary>

```js
var object_schema = {
    'type': 'object',
    'object_allow_unexpected': false,
    'object_properties': {
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

**object_properties**

Each property within the `object_properties` option represents a new full schema that can include generic schema options.

`'object_properties': object`

</details>
<br>

Note: If no `type` is set, any type variable will be considered valid.

#### Multiple Type Schema

Schema can also be set as an array of objects for when the input can validate from more than one schema. An example of multiple type schema is an input that can be either a single value or an array of values.

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

## Notes:

* When implementing schema into your script, it's a good idea to include the option to turn off schema validation. This is helpful for optimizing performance in production environments when the input has already been proven valid.

## Known Issues:

* None.

## Changelog:

### Version 1.0.x

* Script creation.