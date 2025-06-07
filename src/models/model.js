const ValidationError = require('../classes/ValidationError.js');

/**
 * Returns a custom validation function which validates that a property is only allowed to be declared on certain model types.
 * For example, the 'greaterThan' property is only allowed on a model that also has a 'type' property value of 'number'.
 * This is needed because some properties don't make sense for all data types.
 * @param {string|array} allowedTypes - A string or array of strings to limit the property by.
 * @returns {function} - A custom validation function.
 */
const typeRestriction = (allowedTypes) => {
	if (!Array.isArray(allowedTypes)) {
		allowedTypes = [allowedTypes];
	}
	return (inputPathManager) => {
		let allowedTypesString = ''; // Some minifiers threw an error when this line was placed within the else statement below, so the variable is declared here even though it may not always be used.
		const validationProperty = inputPathManager.removePathSegment();
		// If the property is set on an allowed type.
		if (allowedTypes.includes(inputPathManager.value.type)) {
			return true;
		}
		// If the property is NOT set on an allowed type, format a helpful error string.
		else {
			for (let i = 0; i < allowedTypes.length; i++) {
				const type = allowedTypes[i];
				if (i === 0) {
					allowedTypesString += `'${type}'`;
				}
				else if (i < (allowedTypes.length - 1)) {
					allowedTypesString += `, '${type}'`;
				}
				else {
					if (allowedTypes.length > 2) {
						allowedTypesString += ',';
					}
					allowedTypesString += ` or '${type}'`;
				}
			}
			throw new ValidationError(`The validation property '${validationProperty}' can only belong to a model with a type of ${allowedTypesString}.`);
		}
	};
};

const modelPropertySchema = {
	required: {
		type: 'boolean'
	},
	type: {
		type: 'string',
		exactValue: [
			'boolean',
			'number',
			'string',
			'array',
			'object',
			'function'
		]
	},
	exactValue: {
		custom: typeRestriction(['boolean', 'number', 'string'])
	},
	greaterThan: {
		type: 'number',
		custom: typeRestriction('number')
	},
	greaterThanOrEqualTo: {
		type: 'number',
		custom: typeRestriction('number')
	},
	lessThan: {
		type: 'number',
		custom: typeRestriction('number')
	},
	lessThanOrEqualTo: {
		type: 'number',
		custom: typeRestriction('number')
	},
	divisibleBy: {
		type: 'number',
		custom: typeRestriction('number')
	},
	notDivisibleBy: {
		type: 'number',
		custom: typeRestriction('number')
	},
	minimumCharacters: {
		type: 'number',
		custom: typeRestriction('string')
	},
	maximumCharacters: {
		type: 'number',
		custom: typeRestriction('string')
	},
	minimumLength: {
		type: 'number',
		custom: typeRestriction('array')
	},
	maximumLength: {
		type: 'number',
		custom: typeRestriction('array')
	},
	instanceOf: {
		custom: typeRestriction('object')
	},
	allowUnvalidatedProperties: {
		type: 'boolean',
		custom: typeRestriction('object')
	},
	custom: {
		type: 'function'
	},
	propertySchema: {
		type: 'object',
		custom: typeRestriction(['array', 'object'])
	}
};

const modelObject = {
	type: 'object',
	propertySchema: modelPropertySchema
};
const modelArray = {
	type: 'array',
	allPropertySchema: modelObject
};
const model = [
	modelObject,
	modelArray
];

modelPropertySchema.propertySchema.allPropertySchema = model;

const modelObjectTypeRestricted = {
	type: 'object',
	propertySchema: modelPropertySchema,
	custom: typeRestriction(['array', 'object'])
};
const modelArrayTypeRestricted = {
	type: 'array',
	allPropertySchema: modelObject,
	custom: typeRestriction(['array', 'object'])
};
const modelTypeRestricted = [
	modelObjectTypeRestricted,
	modelArrayTypeRestricted
];

modelPropertySchema.allPropertySchema = modelTypeRestricted;

module.exports = model;