# Schema

**Input:** The values to be checked against the **schema**.

**Schema:** The set of rules used to **validate** the **input**.

**Validate:** The action of comparing the **input** to the **schema**.

## Options

### Generic Schema

These parameters only apply to the root of a schema, regardless if the schema has more than one nested type schema.

####default####

A `default` value is used when no input is passed for validation. `default` values will not be validated.
```js
var default_schema = {
    'default': 'abc'
};
```
Note: If no `default` is set, `null` will be used.

####required####

Setting `required` to `true` fails the validation if no value is passed.
```js
var required_schema = {
    'required': true
};
```
Note: If no `required` is set, `false` will be used.

Note: Setting `required` to true and also including a `default`, is valid syntax, but the default will not be used. This syntax can be misleading and should be avoided.

---

### Type Schema

A single type schema can be defined directly in the schema root. Multiple type schema must be defined within the `type_schema` property as an array.

####type####

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

The input number must be greater than or equal to the set `number_min` number. The default value is `undefined`.

`'number_min': number`

**number_max**

The input number must be less than or equal to the set `number_max` number. The default value is `undefined`.

`'number_max': number`

**number_multiple_of**

The input number must be a multiple of the set `number_multiple_of` number. The default value is `undefined`.

`'number_multiple_of': number`

Note: You cam limit the number to an integer by setting `number_multiple_of` to `1`.

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

The input string character count must be longer than or equal to the set `string_min_characters`. The default value is `undefined`.

`'string_min_characters': number`

**string_max_characters**

The input string character count must be shorter than or equal to the set `string_max_characters`. The default value is `undefined`.

`'string_max_characters': number`

**string_regexp_match**

The input string must return a match for the regular expression string set in `string_regexp_match`. The default value is `undefined`.

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

The input array length must be longer than or equal to the set `array_min_length`. The default value is `undefined`.

`'array_min_length': number`

**array_max_length**

The input array length must be shorter than or equal to the set `array_max_length`. The default value is `undefined`.

`'array_max_length': number`

**array_item_type_schema**

Each input array item must validate using the set `array_item_type_schema`. This value can also be defined as an array of type schema. The default value is `undefined`.

`'array_item_type_schema': object|array`

</details>
<br>
<details>

<summary>object</summary>

```js
var object_schema = {
    'type': 'object',
    'object_properties': {
        'property_abc': {
            'required': true,
            'type': 'number'
        }
        'property_xyz': {
            'default': 'qwerty',
            'type': 'string'
        }
    }
};
```

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