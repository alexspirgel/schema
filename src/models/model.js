const extend = require('@alexspirgel/extend');
const ValidationError = require('../classes/ValidationError.js');

const typeRestriction = (types) => {
	if (!Array.isArray(types)) {
		types = [types];
	}
	return (inputPathManager) => {
		const validationProperty = inputPathManager.removePathSegment();
		if (validationProperty === undefined || types.includes(inputPathManager.value.type)) {
			return true;
		}
		else {
			let typesString = ``;
			for (let i = 0; i < types.length; i++) {
				const type = types[i];
				if (i === 0) {
					typesString += `'${type}'`;
				}
				else if (i < (types.length - 1)) {
					typesString += `, '${type}'`;
				}
				else {
					if (types.length > 2) {
						typesString += `,`;
					}
					typesString += ` or '${type}'`;
				}
			}
			throw new ValidationError(`The validation property '${validationProperty}' can only belong to a model with a type of ${typesString}.`);
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
		type: 'string',
		custom: typeRestriction('string')
	},
	maximumCharacters: {
		type: 'string',
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
		type: 'object',
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
	allPropertySchema: {
		type: 'object',
		propertySchema: modelPropertySchema
	}
};

const model = [
	modelObject,
	modelArray
];

const modelTypeRestricted = [
	extend({}, modelObject, {custom: typeRestriction(['array', 'object'])}),
	extend({}, modelArray, {custom: typeRestriction(['array', 'object'])})
];

modelPropertySchema.allPropertySchema = modelTypeRestricted;
modelPropertySchema.propertySchema.allPropertySchema = model;

module.exports = model;