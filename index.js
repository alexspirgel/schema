/**
 * Schema v1.0.0
 * https://github.com/alexspirgel/schema
 */

const DataPathManager = class {
	constructor(data, path = []) {
		this.data = data;
		this.path = path;
	}
	set path(path) {
		if (Array.isArray(path)) {
			this._path = path;
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
	isRoot() {
		if (this.path.length <= 0) {
			return true;
		}
		else {
			return false;
		}
	}
	get value() {
		let value = this.data;
		for (let path of this.path) {
			value = value[path];
		}
		return value;
	}
};

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
			}
		]
	}

	/**
	 * Validate a required property.
	 * @param {boolean} required - The required value to use when validating the input.
	 * @param {*} input - The input to validate.
	 * @returns {boolean} - The validation result.
	 */

	static validateRequired(required, input) {
		if (required === true) {
			if (input === undefined || input === null) {
				throw new Error(`Required validation failed. The model required property is set to ${required}. The input must not be null or undefined.`);
			}
		}
		return true;
	}

	/**
	 * Validate a type property.
	 * @param {boolean} type - The required value to use when validating the input.
	 * @param {*} input - The input to validate.
	 * @returns {boolean} - The validation result.
	 */

	static validateType(type, input) {
		if (type === 'number') {
			if (typeof input === 'number' && !isNaN(input)) {
				return true;
			}
		}
		else if (type === 'object') {
			if (typeof input === 'object' && !Array.isArray(input) && input !== null) {
				return true;
			}
		}
		else if (type === 'array') {
			if (Array.isArray(input)) {
				return true;
			}
		}
		else if (type === 'boolean' || type === 'string' || type === 'function') {
			if (typeof input === type) {
				return true;
			}
		}
		throw new Error(`Type validation failed. The model type property is set to ${type}. The input type must match.`);
	}

	/**
	 * Validate an itemSchema property.
	 * @param {boolean} itemSchema - The schema to use when validating the items in the input array.
	 * @param {*} input - The input to validate.
	 * @returns {boolean} - The validation result.
	 */

	static validateItemSchema(itemSchema, input) {
		for (const item of input) {}
	}

	/**
	 * Create a schema.
	 * @param {object} model - The model to compare to.
	 */
	
	constructor(model = {}, modelPath = null, inputPath = null) {
		this.model = model;
	}

	/**
	 * Set the model.
	 * @param {object} model - The model.
	 */

	set model(model) {
		this._model = this.initializeNestedSchema(model);
	}

	/**
	 * Get the model.
	 * @returns {object} model - The model.
	 */

	get model() {
		return this._model;
	}

	/**
	 * Initialize nested schema.
	 * @param {object} model - The model.
	 * @returns {object} The model with initialized nested schema.
	 */

	initializeNestedSchema(model) {
		if (Array.isArray(model)) {
			for (let modelItem of model) {
				modelItem = this.initializeNestedSchema(modelItem);
			}
		}
		else {
			if (model.hasOwnProperty('itemSchema')) {
				model.itemSchema = new this.constructor(model.itemSchema, this);
			}
			if (model.hasOwnProperty('propertySchema')) {
				for (const property in model.propertySchema) {
					model.propertySchema[property] = new this.constructor(model.propertySchema[property], this);
				}
			}
		}
		return model;
	}

	/**
	 * Validate an input.
	 * @param {*} input - The input to validate.
	 * @param {*} [suppressErrors=false] - Optional flag that when enabled will prevent errors from being thrown in favor of returning false.
	 * @returns {boolean} The validation result.
	 */
 
	validate(input, suppressErrors = false) {
		console.log('validate()');
		let validationErrors = [];
		if (Array.isArray(this.model)) {
			for (let modelItem of this.model) {
				try {
					this._validate(modelItem, input);
					return true;
				}
				catch (error) {
					validationErrors.push({
						model: modelItem,
						modelPath: '',
						input: input,
						inputPath: '',
						error: error
					});
				}
			}
		}
		else {
			try {
				this._validate(this.model, input);
				return true;
			}
			catch (error) {
				validationErrors.push({
					model: this.model,
					modelPath: '',
					input: input,
					inputPath: '',
					error: error
				});
			}
		}
		console.log('validationErrors:', validationErrors);
		if (validationErrors.length <= 0) {
			return true;
		}
		else {
			if (!suppressErrors) {
				for (const validationError of validationErrors) {
					console.error(validationError.error);
				}
			}
			return false;
		}
	}

	/**
	 * Validate an input using a single model.
	 * @param {*} model - The model to use when validating the input.
	 * @param {*} input - The input to validate.
	 * @returns {boolean} The validation result.
	 */
 
	_validate(model, input) {
		console.log('_validate()');
		console.log('model: ', model);
		console.log('input: ', input);
		if (model.required !== true) {
			if (input === undefined || input === null) {
				return true;
			}
		}
		for (const validationMethod of this.constructor.validationMethods) {
			if (model.hasOwnProperty(validationMethod.property)) {
				validationMethod.method(model[validationMethod.property], input);
			}
		}
	}

};