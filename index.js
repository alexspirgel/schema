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
				throw new Schema.ValidationError(`Required validation failed. The model required property is set to ${modelPathManager.value}. The input must not be null or undefined.`);
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
		throw new Schema.ValidationError(`Type validation failed. The model type property is set to ${modelPathManager.value}. The input type must match.`);
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
			console.log('validationErrors', validationErrors);
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
			const inputPath = error.inputPathManager.path.map((pathSegment) => {
				return `['` + pathSegment + `']`;
			});
			message = message + `\nInput Path: ${inputPath}\nMessage: ${error.message}\n`;
		}
		return message;
	}
};