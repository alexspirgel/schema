/**
 * Schema v1.0.0
 * https://github.com/alexspirgel/schema
 */

const Schema = class {

	/**
	 * Get the Schema class model.
	 * @returns {object} - The Schema class model.
	 */

	static get model() {
		// Define a single Schema model.
		const model = {
			type: 'object'
		};
		// Return the full Schema model allowing for a single model or an array of models.
		return [
			model,
			{
				type: 'object',
				instance: Array,
				itemSchema: model
			}
		];
	}

	/**
	 * Validate an input against one or more models.
	 * @param {object} model - The model to compare the input to. Can be an array.
	 * @param {*} input - The input to compare to the model.
	 * @param {object} [path] - The model to compare the input to. If passed, must be an array.
	 * @param {boolean} [recursive] - A flag indicating if the function call is a recursive call or not (for internal use only).
	 * @returns {boolean} - The validation result.
	 */

	static validate(model, input, path = [], recursive = false) {
		// If the call is not recursive.
		if (!recursive) {
			// Set the input as it was originally entered.
			const inputEntry = input;
		}
		// If the model is an array of models.
		if (Array.isArray(model)) {
			// For each model.
			for (const property in model) {
				// If the input validates true with this model.
				if (this.validate(model[property], input, path) === true) {
					// If any of the models validate true, return true for the whole validate execution.
					return true;
				}
			}
			// If the input doesn't validate true against any of the models.
			return false;
		}
		// If the model is a singular model.
		else {
			// Return the result from the validation;
			return this._validate(model, input, path);
		}
	}

	/**
	 * Validate an input against a single model.
	 * @param {object} model - The model to compare the input to.
	 * @param {*} input - The input to compare to the model.
	 * @param {object} [path] - The model to compare the input to. If passed, must be an array.
	 * @returns {boolean} - The validation result.
	 */

	static _validate(model, input, path = []) {
		// If required is not true.
		if (model.required !== true) {
			// if the input is undefined or null.
			if (typeof input === 'undefined' || input === null) {
				// Return true, skipping all other validation.
				return true;
			}
		}
		// For each property in the model.
		// Return false if any return false.
		for (const property in model) {
			if (property === 'required') {
				if (!this.validateRequired(model[property], input)) {
					return false;
				}
			}
			else if (property === 'type') {
				if (!this.validateType(model[property], input)) {
					return false;
				}
			}
			else if (property === 'allPropertiesSchema') {
				if (!this.validateAllPropertiesSchema(model[property], input, path)) {
					return false;
				}
			}
			else if (property === 'custom') {
				if (!this.validateCustom(model[property], input, path, inputEntry)) {
					return false;
				}
			}
		}
		// If no other model properties validate false, return true.
		return true;
	}

	static validateRequired(required, input) {
		// If required is true.
		if (required === true) {
			// If input is not undefined and is not null.
			if (typeof input !== 'undefined' && input !== null) {
				return true;
			}
			// If the input is undefined or null.
			else {
				return false;
			}
		}
		// If required is not true. Always return true.
		return true;
	}

	static validateType(type, input) {
		if (type === 'boolean') {
			if (typeof input === 'boolean') {
				return true;
			}
		}
		else if (type === 'number') {
			if (typeof input === 'number') {
				return true;
			}
		}
		else if (type === 'string') {
			if (typeof input === 'string') {
				return true;
			}
		}
		else if (type === 'function') {
			if (typeof input === 'function') {
				return true;
			}
		}
		else if (type === 'object') {
			// If input is an object, and not null (null has the type object for legacy language reasons).
			if (typeof input === 'object' && input !== null) {
				return true;
			}
		}
		// If the input is not the correct type, or the passed model type is not one we check for.
		return false;
	}

	static validateAllPropertiesSchema(allPropertiesSchema, input, path = []) {
		// For each value in the input.
		for (const property in input) {
			// Append property to path array.
			path.push(property);
			// Validate property value against `allPropertiesSchema`.
			const validationResult = this.validate(allPropertiesSchema, input[property], path, true);
			// Remove property from path array.
			path.pop();
			// If the input value validates false.
			if (!validationResult) {
				return false;
			}
		}
		// If none of the input values validate false.
		return true;
	}

	static validateCustom(custom, input, path = [], inputEntry) {
		const validationResult = custom(input, path, inputEntry);
		if (validationResult === true) {
			return true;
		}
		else {
			if (validationResult !== false) {
				let customError = validationResult; // We are not doing anything with this yet.
			}
			return false;
		}
	}

	/*
	 *
	 */

	static resolvePath() {}






	/**
	 * Set the model.
	 * @param {object} model - The schema blueprints.
	 */

	set model(model) {
		// Validate the model against the Schema class model.
		let validationResult = this.constructor.validate(this.constructor.model, model);
		// If the model is valid.
		if (validationResult) {
			this.model = model;
		}
		// If the model is invalid.
		else {
			return false;
		}
	}

	/**
	 * Create a schema using the input as the model.
	 * @param {object} model - The schema blueprints.
	 */

	constructor(model) {
		// Set the input model on the instance.
		this.model = model;
	}

	/**
	 * Validate an input against the model.
	 * @param {*} input - The input to compare to the model.
	 * @returns {boolean} - The validation result.
	 */

	validate(input) {
		// Validate the input against the model.
		let validationResult = this.constructor.validate(this.model, input);
	}

};