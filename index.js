/**
 * Schema v1.0.0
 * https://github.com/alexspirgel/schema
 */

 const Schema = class {

	/**
	 * Validation properties will be tested in order that they appear in this array.
	 * @returns {object} - An array of ordered validation properties mapped to their validator functions.
	 */
	
	static get validationMethods() {
		return [
			{
				property: 'required',
				method: this.validateRequired
			},
			{
				property: 'type',
				method: this.validateType
			},
			{
				property: 'exactValue',
				method: this.validateExactValue
			},
			{
				property: 'greaterThan',
				method: this.validateGreaterThan
			},
			{
				property: 'greaterThanOrEqualTo',
				method: this.validateGreaterThanOrEqualTo
			},
			{
				property: 'lessThan',
				method: this.validateLessThan
			},
			{
				property: 'lessThanOrEqualTo',
				method: this.validateLessThanOrEqualTo
			},
			{
				property: 'divisibleBy',
				method: this.validateDivisibleBy
			},
			{
				property: 'notDivisibleBy',
				method: this.validateNotDivisibleBy
			},
			{
				property: 'itemSchema',
				method: this.validateItemSchema
			}
		]
	}

	/**
	 * Validate a required property.
	 * @param {object} modelPathManager - The model path manager containing the validation property value.
	 * @param {object} inputPathManager - The input path manager containing the input value to validate.
	 * @returns {boolean} - The validation result.
	 */

	static validateRequired(modelPathManager, inputPathManager) {
		if (modelPathManager.value === true) {
			if (inputPathManager.value === undefined || inputPathManager.value === null) {
				throw new Schema.ValidationError(`Property 'required' validation failed. The input must not be null or undefined.`);
			}
		}
		return true;
	}

	/**
	 * Validate a type property.
	 * @param {object} modelPathManager - The model path manager containing the validation property value.
	 * @param {object} inputPathManager - The input path manager containing the input value to validate.
	 * @returns {boolean} - The validation result.
	 */

	static validateType(modelPathManager, inputPathManager) {
		if (modelPathManager.value === 'number') {
			if (typeof inputPathManager.value === 'number' && !isNaN(inputPathManager.value)) {
				return true;
			}
		}
		else if (modelPathManager.value === 'object') {
			if (typeof inputPathManager.value === 'object' && !Array.isArray(inputPathManager.value) && inputPathManager.value !== null) {
				return true;
			}
		}
		else if (modelPathManager.value === 'array') {
			if (Array.isArray(inputPathManager.value)) {
				return true;
			}
		}
		else if (modelPathManager.value === 'boolean' || modelPathManager.value === 'string' || modelPathManager.value === 'function') {
			if (typeof inputPathManager.value === modelPathManager.value) {
				return true;
			}
		}
		throw new Schema.ValidationError(`Property 'type' validation failed. The input type must match.`);
	}

	/**
	 * Validate a exactValue property.
	 * @param {object} modelPathManager - The model path manager containing the validation property value.
	 * @param {object} inputPathManager - The input path manager containing the input value to validate.
	 * @returns {boolean} - The validation result.
	 */

	static validateExactValue(modelPathManager, inputPathManager) {
		if (Array.isArray(modelPathManager.value)) {
			for (const value of modelPathManager.value) {
				if (inputPathManager.value === value) {
					return true;
				}
			}
		}
		else {
			if (inputPathManager.value === modelPathManager.value) {
				return true;
			}
		}
		throw new Schema.ValidationError(`Property 'exactValue' validation failed. The input must be an exact match of the value or one of the values in an array of values.`);
	}

	/**
	 * Validate a greaterThan property.
	 * @param {object} modelPathManager - The model path manager containing the validation property value.
	 * @param {object} inputPathManager - The input path manager containing the input value to validate.
	 * @returns {boolean} - The validation result.
	 */

	static validateGreaterThan(modelPathManager, inputPathManager) {
		if (inputPathManager.value > modelPathManager.value) {
			return true;
		}
		else {
			throw new Schema.ValidationError(`Property 'greaterThan' validation failed. The input must be greater than the value.`);
		}
	}

	/**
	 * Validate a greaterThanOrEqualTo property.
	 * @param {object} modelPathManager - The model path manager containing the validation property value.
	 * @param {object} inputPathManager - The input path manager containing the input value to validate.
	 * @returns {boolean} - The validation result.
	 */

	static validateGreaterThanOrEqualTo(modelPathManager, inputPathManager) {
		if (inputPathManager.value >= modelPathManager.value) {
			return true;
		}
		else {
			throw new Schema.ValidationError(`Property 'greaterThanOrEqualTo' validation failed. The input must be greater than or equal to the value.`);
		}
	}

	/**
	 * Validate a lessThan property.
	 * @param {object} modelPathManager - The model path manager containing the validation property value.
	 * @param {object} inputPathManager - The input path manager containing the input value to validate.
	 * @returns {boolean} - The validation result.
	 */

	static validateLessThan(modelPathManager, inputPathManager) {
		if (inputPathManager.value < modelPathManager.value) {
			return true;
		}
		else {
			throw new Schema.ValidationError(`Property 'lessThan' validation failed. The input must be less than the value.`);
		}
	}

	/**
	 * Validate a lessThanOrEqualTo property.
	 * @param {object} modelPathManager - The model path manager containing the validation property value.
	 * @param {object} inputPathManager - The input path manager containing the input value to validate.
	 * @returns {boolean} - The validation result.
	 */

	static validateLessThanOrEqualTo(modelPathManager, inputPathManager) {
		if (inputPathManager.value <= modelPathManager.value) {
			return true;
		}
		else {
			throw new Schema.ValidationError(`Property 'lessThanOrEqualTo' validation failed. The input must be less than or equal to the value.`);
		}
	}

	/**
	 * Validate a divisibleBy property.
	 * @param {object} modelPathManager - The model path manager containing the validation property value.
	 * @param {object} inputPathManager - The input path manager containing the input value to validate.
	 * @returns {boolean} - The validation result.
	 */

	static validateDivisibleBy(modelPathManager, inputPathManager) {
		if (Array.isArray(modelPathManager.value)) {
			for (const value of modelPathManager.value) {
				if (inputPathManager.value % value === 0) {
					return true;
				}
			}
		}
		else {
			if (inputPathManager.value % modelPathManager.value === 0) {
				return true;
			}
		}
		throw new Schema.ValidationError(`Property 'divisibleBy' validation failed. The input must be divisible by the value or one of the values in an array of values.`);
	}

	/**
	 * Validate a notDivisibleBy property.
	 * @param {object} modelPathManager - The model path manager containing the validation property value.
	 * @param {object} inputPathManager - The input path manager containing the input value to validate.
	 * @returns {boolean} - The validation result.
	 */

	static validateNotDivisibleBy(modelPathManager, inputPathManager) {
		let flag = false;
		if (Array.isArray(modelPathManager.value)) {
			for (const value of modelPathManager.value) {
				if (inputPathManager.value % value === 0) {
					flag = true;
				}
			}
		}
		else {
			if (inputPathManager.value % modelPathManager.value === 0) {
				flag = true;
			}
		}
		if (flag || isNaN(inputPathManager.value)) {
			throw new Schema.ValidationError(`Property 'notDivisibleBy' validation failed. The input must not be divisible by the value or one of the values in an array of values.`);
		}
		return true;
	}

	/**
	 * Validate a minimumCharacters property.
	 * @param {object} modelPathManager - The model path manager containing the validation property value.
	 * @param {object} inputPathManager - The input path manager containing the input value to validate.
	 * @returns {boolean} - The validation result.
	 */

	static validateMinimumCharacters(modelPathManager, inputPathManager) {
		if (inputPathManager.value.length >= modelPathManager.value) {
			return true;
		}
		else {
			throw new Schema.ValidationError(`Property 'minimumCharacters' validation failed. The input must have a character count greater than or equal to the value.`);
		}
	}

	/**
	 * Validate a maximumCharacters property.
	 * @param {object} modelPathManager - The model path manager containing the validation property value.
	 * @param {object} inputPathManager - The input path manager containing the input value to validate.
	 * @returns {boolean} - The validation result.
	 */

	static validateMaximumCharacters(modelPathManager, inputPathManager) {
		if (inputPathManager.value.length <= modelPathManager.value) {
			return true;
		}
		else {
			throw new Schema.ValidationError(`Property 'maximumCharacters' validation failed. The input must have a character count less than or equal to the value.`);
		}
	}
	
	/**
	 * Validate an itemSchema property.
	 * @param {object} modelPathManager - The model path manager containing the validation property value.
	 * @param {object} inputPathManager - The input path manager containing the input value to validate.
	 * @returns {boolean} - The validation result.
	 */

	static validateItemSchema(modelPathManager, inputPathManager) {
		const itemSchema = new Schema(modelPathManager);
		for (let inputIndex = 0; inputIndex < inputPathManager.value.length; inputIndex++) {
			const inputItemPathManager = inputPathManager.clone();
			inputItemPathManager.addPathSegment(inputIndex);
			const validationResult = itemSchema.validate(inputItemPathManager, 'array');
			if (validationResult !== true) {
				return validationResult;
			}
		}
		return true;
	}

	/**
	 * Create a schema.
	 * @param {object} modelPathManager - The model to compare to.
	 */
	
	constructor(modelPathManager = {}) {
		this.modelPathManager = modelPathManager;
	}

	/**
	 * Set the model path manager.
	 * @param {object} modelPathManager - The model path manager.
	 */

	set modelPathManager(modelPathManager) {
		if (!(modelPathManager instanceof Schema.DataPathManager)) {
			modelPathManager = new Schema.DataPathManager(modelPathManager);
		}
		this._modelPathManager = modelPathManager;
	}

	/**
	 * Get the model path manager.
	 * @returns {object} modelPathManager - The model path manager.
	 */

	get modelPathManager() {
		return this._modelPathManager;
	}

	/**
	 * Validate an input.
	 * @param {*} inputPathManager - The input to validate.
	 * @param {('throw'|'boolean'|'array')} errorHandling - The method of error handling.
	 * @returns {boolean} The validation result.
	 */
 
	validate(inputPathManager, errorStyle = 'throw') {

		if (!(inputPathManager instanceof Schema.DataPathManager)) {
			inputPathManager = new Schema.DataPathManager(inputPathManager);
		}

		let validationErrors = new Schema.ValidationErrors();

		if (Array.isArray(this.modelPathManager.value)) {
			for (let modelIndex = 0; modelIndex < this.modelPathManager.value.length; modelIndex++) {
				const modelItemPathManager = this.modelPathManager.clone();
				modelItemPathManager.addPathSegment(modelIndex);
				const validationResult = this._validate(modelItemPathManager, inputPathManager);
				if (validationResult === true) {
					return true;
				}
				else {
					validationErrors.addError(validationResult);
				}
			}
		}
		else {
			const validationResult = this._validate(this.modelPathManager, inputPathManager);
			if (validationResult === true) {
				return true;
			}
			else {
				validationErrors.addError(validationResult);
			}
		}

		if (errorStyle === 'throw') {
			throw new Error(validationErrors.generateFormattedMessage());
		}
		else if (errorStyle === 'boolean') {
			return false;
		}
		else if (errorStyle === 'array') {
			return validationErrors.errors;
		}

	}

	/**
	 * Validate an input using a single model.
	 * @param {*} modelPathManager - The model path manager to use when validating the input.
	 * @param {*} inputPathManager - The input path manager to validate.
	 * @returns {boolean} The validation result.
	 */

	_validate(modelPathManager, inputPathManager) {
		if (modelPathManager.value.required !== true) {
			if (inputPathManager.value === undefined || inputPathManager.value === null) {
				return true;
			}
		}
		for (const validationMethod of this.constructor.validationMethods) {
			if (modelPathManager.value.hasOwnProperty(validationMethod.property)) {
				const validationMethodModelPathManager = modelPathManager.clone();
				validationMethodModelPathManager.addPathSegment(validationMethod.property);
				try {
					const validationResult = validationMethod.method(validationMethodModelPathManager, inputPathManager);
					if (validationResult !== true) {
						return validationResult;
					}
				}
				catch (error) {
					if (error instanceof Schema.ValidationError) {
						if (!error.modelPathManager) {
							error.modelPathManager = validationMethodModelPathManager;
						}
						if (!error.inputPathManager) {
							error.inputPathManager = inputPathManager;
						}
						return error;
					}
					else {
						throw error;
					}
				}
			}
		}
		return true;
	}

}

Schema.DataPathManager = class {
	constructor(data, path = []) {
		this.data = data;
		this.path = path;
	}
	set path(path) {
		if (Array.isArray(path)) {
			this._path = path;
		}
		else {
			throw new Error('Path must be an array');
		}
	}
	get path() {
		return this._path;
	}
	addPathSegment(pathSegment) {
		this.path.push(pathSegment);
	}
	removePathSegment() {
		this.path.splice(-1, 1);
	}
	get value() {
		let value = this.data;
		for (let path of this.path) {
			value = value[path];
		}
		return value;
	}
	clone() {
		return new Schema.DataPathManager(this.data, [...this.path]);
	}
};

Schema.ValidationError = class extends Error {
	constructor(...params) {
		super(...params);
	}
	set modelPathManager(modelPathManager) {
		if (!(modelPathManager instanceof Schema.DataPathManager)) {
			modelPathManager = new Schema.DataPathManager(modelPathManager);
		}
		this._modelPathManager = modelPathManager;
	}
	get modelPathManager() {
		return this._modelPathManager;
	}
	set inputPathManager(inputPathManager) {
		if (!(inputPathManager instanceof Schema.DataPathManager)) {
			inputPathManager = new Schema.DataPathManager(inputPathManager);
		}
		this._inputPathManager = inputPathManager;
	}
	get inputPathManager() {
		return this._inputPathManager;
	}
};

Schema.ValidationErrors = class {
	constructor() {
		this.errors = [];
	}
	addError(error) {
		if (Array.isArray(error)) {
			for (const singleError of error) {
				this.addError(singleError);
			}
		}
		else {
			if (!(error instanceof Schema.ValidationError)) {
				throw new Error(`Passed 'error' must be an instance of 'Schema.ValidationError'.`);
			}
			else {
				this.errors.push(error);
			}
		}
	}
	generateFormattedMessage() {
		let message = `Schema Errors:\n`;
		for (const error of this.errors) {
			let modelPath = 'root';
			if (error.modelPathManager.path.length > 0) {
				modelPath = error.modelPathManager.path.map((pathSegment) => {
					return `['` + pathSegment + `']`;
				});
				modelPath = modelPath.join('');
			}
			let inputPath = 'root';
			if (error.inputPathManager.path.length > 0) {
				inputPath = error.inputPathManager.path.map((pathSegment) => {
					return `['` + pathSegment + `']`;
				});
				inputPath = inputPath.join('');
			}
			message = message + `\nModel Path: ${modelPath}\nInput Path: ${inputPath}\nMessage: ${error.message}\n`;
		}
		return message;
	}
};