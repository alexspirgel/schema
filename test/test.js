const Schema = require('../src/index.js');
const DataPathManager = require('../src/classes/DataPathManager.js');

const convertToString = (value) => {
	let string = ``;
	if (value === null) {
		string += `null`;
	}
	else if (typeof value === 'function') {
		string += `function: ${value.name}`;
	}
	else if (Array.isArray(value)) {
		string += `[`;
		let count = 0;
		for (const item of value) {
			count++;
			if (count > 1) {
				string += `, `;
			}
			string += `${convertToString(item)}`;
		}
		string += `]`;
	}
	else if (typeof value === 'object') {
		string += `{`;
		let count = 0;
		for (const property in value) {
			count++;
			if (count > 1) {
				string += `, `;
			}
			string += `'${property}': ${convertToString(value.property)}`;
		}
		string += `}`;
	}
	else {
		string = String(value);
	}
	return string;
};

const generateDescription = (model, input, expected) => {
	let description = ``;

	const modelString = convertToString(model);
	description += `Model value: '` + modelString + `'.`;
	
	const inputString = convertToString(input);
	description += ` Input value: '` + inputString + `'.`;
	
	const expectedString = convertToString(expected);
	description += ` Expected value: '` + expectedString + `'.`;
	
	return description;
};

const testValidators = (validatorFunction, testCases) => {
	for (const testCase of testCases) {
		const description = generateDescription(testCase.model, testCase.input, testCase.expected);
		it(description, function () {
			let model = testCase.model;
			if (!(model instanceof DataPathManager)) {
				model = new DataPathManager(testCase.model);
			}
			let input = new DataPathManager(testCase.input);
			try {
				const validationResult = validatorFunction(model, input);
				if (validationResult === testCase.expected) {
					return true;
				}
			}
			catch (error) {
				if (testCase.expected === false) {
					if (error instanceof Schema.ValidationError) {
						return true;
					}
				}
			}
			throw new Error();
		});
	}
};

describe('Schema', function () {
  describe('validateRequired', function () {
		const testCases = [
			{
				model: true,
				input: true,
				expected: true
			},
			{
				model: true,
				input: 123,
				expected: true
			},
			{
				model: true,
				input: 123,
				expected: true
			},
			{
				model: true,
				input: 'abc',
				expected: true
			},
			{
				model: true,
				input: () => {},
				expected: true
			},
			{
				model: true,
				input: [],
				expected: true
			},
			{
				model: true,
				input: {},
				expected: true
			},
			{
				model: true,
				input: NaN,
				expected: true
			},
			{
				model: true,
				input: null,
				expected: false
			},
			{
				model: true,
				input: undefined,
				expected: false
			},
			{
				model: false,
				input: true,
				expected: true
			},
			{
				model: false,
				input: 123,
				expected: true
			},
			{
				model: false,
				input: 123,
				expected: true
			},
			{
				model: false,
				input: 'abc',
				expected: true
			},
			{
				model: false,
				input: () => {},
				expected: true
			},
			{
				model: false,
				input: [],
				expected: true
			},
			{
				model: false,
				input: {},
				expected: true
			},
			{
				model: false,
				input: NaN,
				expected: true
			},
			{
				model: false,
				input: null,
				expected: true
			},
			{
				model: false,
				input: undefined,
				expected: true
			}
		];
		testValidators(Schema.validateRequired, testCases);
	});
	describe('validateType', function () {
		const testCases = [
			{
				model: 'boolean',
				input: true,
				expected: true
			},
			{
				model: 'boolean',
				input: 123,
				expected: false
			},
			{
				model: 'boolean',
				input: 'abc',
				expected: false
			},
			{
				model: 'boolean',
				input: () => {},
				expected: false
			},
			{
				model: 'boolean',
				input: [],
				expected: false
			},
			{
				model: 'boolean',
				input: {},
				expected: false
			},
			{
				model: 'boolean',
				input: NaN,
				expected: false
			},
			{
				model: 'boolean',
				input: null,
				expected: false
			},
			{
				model: 'boolean',
				input: undefined,
				expected: false
			},
			{
				model: 'number',
				input: true,
				expected: false
			},
			{
				model: 'number',
				input: 123,
				expected: true
			},
			{
				model: 'number',
				input: 'abc',
				expected: false
			},
			{
				model: 'number',
				input: () => {},
				expected: false
			},
			{
				model: 'number',
				input: [],
				expected: false
			},
			{
				model: 'number',
				input: {},
				expected: false
			},
			{
				model: 'number',
				input: NaN,
				expected: false
			},
			{
				model: 'number',
				input: null,
				expected: false
			},
			{
				model: 'number',
				input: undefined,
				expected: false
			},
			{
				model: 'string',
				input: true,
				expected: false
			},
			{
				model: 'string',
				input: 123,
				expected: false
			},
			{
				model: 'string',
				input: 'abc',
				expected: true
			},
			{
				model: 'string',
				input: () => {},
				expected: false
			},
			{
				model: 'string',
				input: [],
				expected: false
			},
			{
				model: 'string',
				input: {},
				expected: false
			},
			{
				model: 'string',
				input: NaN,
				expected: false
			},
			{
				model: 'string',
				input: null,
				expected: false
			},
			{
				model: 'array',
				input: true,
				expected: false
			},
			{
				model: 'array',
				input: 123,
				expected: false
			},
			{
				model: 'array',
				input: 'abc',
				expected: false
			},
			{
				model: 'array',
				input: () => {},
				expected: false
			},
			{
				model: 'array',
				input: [],
				expected: true
			},
			{
				model: 'array',
				input: {},
				expected: false
			},
			{
				model: 'array',
				input: NaN,
				expected: false
			},
			{
				model: 'array',
				input: null,
				expected: false
			},
			{
				model: 'object',
				input: true,
				expected: false
			},
			{
				model: 'object',
				input: 123,
				expected: false
			},
			{
				model: 'object',
				input: 'abc',
				expected: false
			},
			{
				model: 'object',
				input: () => {},
				expected: false
			},
			{
				model: 'object',
				input: [],
				expected: false
			},
			{
				model: 'object',
				input: {},
				expected: true
			},
			{
				model: 'object',
				input: NaN,
				expected: false
			},
			{
				model: 'object',
				input: null,
				expected: false
			},
			{
				model: 'function',
				input: true,
				expected: false
			},
			{
				model: 'function',
				input: 123,
				expected: false
			},
			{
				model: 'function',
				input: 'abc',
				expected: false
			},
			{
				model: 'function',
				input: () => {},
				expected: true
			},
			{
				model: 'function',
				input: [],
				expected: false
			},
			{
				model: 'function',
				input: {},
				expected: false
			},
			{
				model: 'function',
				input: NaN,
				expected: false
			},
			{
				model: 'function',
				input: null,
				expected: false
			}
		];
		testValidators(Schema.validateType, testCases);
	});
	describe('validateExactValue', function () {
		const testCases = [
			{
				model: true,
				input: true,
				expected: true
			},
			{
				model: true,
				input: false,
				expected: false
			},
			{
				model: 123,
				input: 123,
				expected: true
			},
			{
				model: 123,
				input: 1234,
				expected: false
			},
			{
				model: 'hello',
				input: 'hello',
				expected: true
			},
			{
				model: 'hello',
				input: 'world',
				expected: false
			},
		];
		testValidators(Schema.validateExactValue, testCases);
	});
	describe('validateGreaterThan', function () {
		const testCases = [
			{
				model: 10,
				input: 11,
				expected: true
			},
			{
				model: 10,
				input: 10,
				expected: false
			},
			{
				model: 10,
				input: 9,
				expected: false
			},
			{
				model: -25,
				input: -20,
				expected: true
			},
			{
				model: -25,
				input: -25,
				expected: false
			},
			{
				model: -25,
				input: -30,
				expected: false
			},
		];
		testValidators(Schema.validateGreaterThan, testCases);
	});
	describe('validateGreaterThanOrEqualTo', function () {
		const testCases = [
			{
				model: 10,
				input: 11,
				expected: true
			},
			{
				model: 10,
				input: 10,
				expected: true
			},
			{
				model: 10,
				input: 9,
				expected: false
			},
			{
				model: -25,
				input: -20,
				expected: true
			},
			{
				model: -25,
				input: -25,
				expected: true
			},
			{
				model: -25,
				input: -30,
				expected: false
			},
		];
		testValidators(Schema.validateGreaterThanOrEqualTo, testCases);
	});
	describe('validateLessThan', function () {
		const testCases = [
			{
				model: 10,
				input: 11,
				expected: false
			},
			{
				model: 10,
				input: 10,
				expected: false
			},
			{
				model: 10,
				input: 9,
				expected: true
			},
			{
				model: -25,
				input: -20,
				expected: false
			},
			{
				model: -25,
				input: -25,
				expected: false
			},
			{
				model: -25,
				input: -30,
				expected: true
			},
		];
		testValidators(Schema.validateLessThan, testCases);
	});
	describe('validateLessThanOrEqualTo', function () {
		const testCases = [
			{
				model: 10,
				input: 11,
				expected: false
			},
			{
				model: 10,
				input: 10,
				expected: true
			},
			{
				model: 10,
				input: 9,
				expected: true
			},
			{
				model: -25,
				input: -20,
				expected: false
			},
			{
				model: -25,
				input: -25,
				expected: true
			},
			{
				model: -25,
				input: -30,
				expected: true
			},
		];
		testValidators(Schema.validateLessThanOrEqualTo, testCases);
	});
	describe('validateDivisibleBy', function () {
		const testCases = [
			{
				model: 5,
				input: 21,
				expected: false
			},
			{
				model: 5,
				input: 20,
				expected: true
			},
			{
				model: 5,
				input: 19,
				expected: false
			},
			{
				model: 5,
				input: 0,
				expected: true
			},
			{
				model: 5,
				input: -0,
				expected: true
			},
			{
				model: 5,
				input: -10,
				expected: true
			},
			{
				model: [3, 5],
				input: 21,
				expected: true
			},
			{
				model: [3, 5],
				input: 20,
				expected: true
			},
			{
				model: [3, 5],
				input: 19,
				expected: false
			},
		];
		testValidators(Schema.validateDivisibleBy, testCases);
	});
	describe('validateNotDivisibleBy', function () {
		const testCases = [
			{
				model: 5,
				input: 21,
				expected: true
			},
			{
				model: 5,
				input: 20,
				expected: false
			},
			{
				model: 5,
				input: 19,
				expected: true
			},
			{
				model: 5,
				input: 0,
				expected: false
			},
			{
				model: 5,
				input: -0,
				expected: false
			},
			{
				model: 5,
				input: -10,
				expected: false
			},
			{
				model: [3, 5],
				input: 21,
				expected: false
			},
			{
				model: [3, 5],
				input: 20,
				expected: false
			},
			{
				model: [3, 5],
				input: 19,
				expected: true
			},
		];
		testValidators(Schema.validateNotDivisibleBy, testCases);
	});
	describe('validateMinimumCharacters', function () {
		const testCases = [
			{
				model: 11,
				input: 'Hello',
				expected: false
			},
			{
				model: 11,
				input: 'Hello World',
				expected: true
			},
			{
				model: 11,
				input: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam tempor elit ornare varius gravida.',
				expected: true
			}
		];
		testValidators(Schema.validateMinimumCharacters, testCases);
	});
	describe('validateMaximumCharacters', function () {
		const testCases = [
			{
				model: 11,
				input: 'Hello',
				expected: true
			},
			{
				model: 11,
				input: 'Hello World',
				expected: true
			},
			{
				model: 11,
				input: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam tempor elit ornare varius gravida.',
				expected: false
			}
		];
		testValidators(Schema.validateMaximumCharacters, testCases);
	});
	describe('validateMinimumLength', function () {
		const testCases = [
			{
				model: 3,
				input: [],
				expected: false
			},
			{
				model: 3,
				input: [1],
				expected: false
			},
			{
				model: 3,
				input: [1, 2],
				expected: false
			},
			{
				model: 3,
				input: [1, 2, 3],
				expected: true
			},
			{
				model: 3,
				input: [1, 2, 3, 4],
				expected: true
			},
			{
				model: 3,
				input: [1, 2, 3, 4, 5],
				expected: true
			},
		];
		testValidators(Schema.validateMinimumLength, testCases);
	});
	describe('validateMaximumLength', function () {
		const testCases = [
			{
				model: 3,
				input: [],
				expected: true
			},
			{
				model: 3,
				input: [1],
				expected: true
			},
			{
				model: 3,
				input: [1, 2],
				expected: true
			},
			{
				model: 3,
				input: [1, 2, 3],
				expected: true
			},
			{
				model: 3,
				input: [1, 2, 3, 4],
				expected: false
			},
			{
				model: 3,
				input: [1, 2, 3, 4, 5],
				expected: false
			},
		];
		testValidators(Schema.validateMaximumLength, testCases);
	});
	describe('validateInstanceOf', function () {
		const testCases = [
			{
				model: Schema,
				input: {},
				expected: false
			},
			{
				model: Schema,
				input: new Schema({}),
				expected: true
			},
			{
				model: Error,
				input: {},
				expected: false
			},
			{
				model: Error,
				input: new Schema({}),
				expected: false
			},
			{
				model: Error,
				input: new Error(),
				expected: true
			},
			{
				model: [Schema, Error],
				input: {},
				expected: false
			},
			{
				model: [Schema, Error],
				input: new Schema({}),
				expected: true
			},
			{
				model: [Schema, Error],
				input: new Error(),
				expected: true
			},
		];
		testValidators(Schema.validateInstanceOf, testCases);
	});
	describe('validateAllowUnvalidatedProperties', function () {
		const testCases = [
			{
				model: new DataPathManager({}, ['allowUnvalidatedProperties']),
				input: {a:1, b:2, c:3},
				expected: true
			},
			{
				model: new DataPathManager({allowUnvalidatedProperties: true}, ['allowUnvalidatedProperties']),
				input: {a:1, b:2, c:3},
				expected: true
			},
			{
				model: new DataPathManager({allowUnvalidatedProperties: false}, ['allowUnvalidatedProperties']),
				input: {a:1, b:2, c:3},
				expected: false
			},
			{
				model: new DataPathManager({
					allowUnvalidatedProperties: false,
					propertySchema: {
						a: {},
						b: {},
						c: {}
					}
				}, ['allowUnvalidatedProperties']),
				input: {a:1, b:2, c:3},
				expected: true
			},
			{
				model: new DataPathManager({
					allowUnvalidatedProperties: false,
					propertySchema: {
						a: {},
						b: {}
					}
				}, ['allowUnvalidatedProperties']),
				input: {a:1, b:2, c:3},
				expected: false
			},
			{
				model: new DataPathManager({
					allowUnvalidatedProperties: false,
					propertySchema: {
						a: {},
						b: {},
						c: {},
						d: {}
					}
				}, ['allowUnvalidatedProperties']),
				input: {a:1, b:2, c:3},
				expected: true
			},
		];
		testValidators(Schema.validateAllowUnvalidatedProperties, testCases);
	});
});
