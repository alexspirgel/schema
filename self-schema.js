// required
const requiredSchema = {
	type: 'boolean'
};

// exactValues
const exactValuesTypeSchema = [
	'boolean',
	'number',
	'string'
];
const exactValueSchema = [
	{
		type: exactValuesTypeSchema
	},
	{
		type: 'array',
		itemSchema: {
			type: exactValuesTypeSchema
		}
	}
];

// type
const typeExactValuesSchema = [
	'boolean',
	'number',
	'string',
	'function',
	'array',
	'object'
];
const typeSchema = [
	{
		type: 'string',
		exactValue: typeExactValuesSchema
	},
	{
		type: 'array',
		itemSchema: {
			exactValue: typeExactValuesSchema
		}
	}
];

// greaterThan
const greaterThanSchema = {
	type: 'number',
	dependant: {
		'@this.parent().type': {
			exactValue: 'number'
		}
	}
};