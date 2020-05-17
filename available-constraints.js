/*
Notes:
required = !undefined && !null
even though it is an object, null should NOT satisfy {type: 'object'}
*/

// Not specific to a type
schema = {
	required: true, // boolean
	type: 'number', // string must be one of: boolean, number, string, array, object, function
	custom: { // function should return true or false or throw an error
		test: (value) => {
			if (value === 123) {
				return true;
			}
			else {
				throw new Error('Custom error message.');
			}
		}
	}
}

// boolean
schema = {
	type: 'boolean',
	exactValue: true, // single value or an array of values that match the type
}

// number
schema = {
	type: 'number',
	greaterThan: -1, // number
	greaterThanOrEqualTo: 0, // number
	lessThan: 101, // number
	lessThanOrEqualTo: 100, // number
	multipleOf: 2, // number or array of numbers
	exactValue: 123, // single value or an array of values that match the type
}

// string
schema = {
	type: 'string',
	minimumCharacters: 5, // number
	maximumCharacters: 25, // number
	exactValue: 'some text', // single value or an array of values that match the type
}

// array
schema = {
	type: 'array',
	minimumLength: 1, // number
	maximumLength: 5, // number
	uniqueItems: false, // boolean
	itemSchema: {} // schema or array of schemas
}

// object
schema = {
	type: 'object',
	instanceOf: Element, // object
	allowUnvalidatedProperties: true, // boolean
	propertySchema: {
		property1: {}, // schema or array of schemas
		property2: {} // schema or array of schemas
		// ...
	}
}

// function
schema = {
	type: 'function'
}