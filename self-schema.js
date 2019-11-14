const requiredSchema = {
	type: 'boolean'
};

const exactValueSchema = [
	{
		type: [
			'boolean',
			'number',
			'string'
		]
	},
	{
		type: 'array',
		itemSchema: {
			type: [
				'boolean',
				'number',
				'string'
			]
		}
	}
];

const typeSchema = {
	type: 'string',
	exactValue: [
		'boolean',
		'number',
		'string',
		'function',
		'array',
		'object'
	]
};

const greaterThanSchema = {
	type: 'number',
	dependant: {
		'@this.parent().type': {
			exactValue: 'number'
		}
	}
};