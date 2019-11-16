/*

Notes:

required = !undefined && !null

Most (all?) properties have their value reversed if an `!` is placed in front of the property name.
This has the side-effect of requiring these properties to be encased in quotes for proper syntax. I'm actually ok with this because it makes reversed values visually distinct.

*/

// Not specific to a type
const all = {
	required: true,
	custom: {
		test: (value) => {
			if (value === 'specific value') {
				return true;
			}
			else {
				return false;
			}
		},
		error: 'Custom error message.'
	},
	dependant: {
		property: $parent.propertyName, // 'parent' || ''
		type: 'boolean',
		custom: {
			test: (value) => {
				if (value === ture) {
					return true;
				}
				else {
					return false;
				}
			}
		}
	}
}

//
const boolean = {
	type: 'boolean',
}

//
const number = {
	type: 'number',
	greaterThan: -1,
	greaterThanOrEqualTo: 0,
	lessThan: 101,
	lessThanOrEqualTo: 100,
	'!multipleOf': 2,
}

//
const string = {
	type: 'string',
	minimumLength: 5,
	maximumLength: 25
}

//
const array = {
	type: 'array',
	itemSchema: {}
}

//
const object = {
	type: 'object',
	instance: Element,
	allowUnvalidated: true,
	propertySchema: {
		property1: {},
		property2: {}
	}
}