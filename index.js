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
		// Define a single model.
		const model = {
			type: 'object'
		};
		// Return the full Schema model allowing for a single model or an array of models.
		return [
			model,
			{
				type: 'array',
				itemSchema: model
			}
		];
	}

	/**
	 * Validate an input against a model.
	 * @param {*} input - The input to compare to the model.
	 * @param {*} model - The model to compare the input to.
	 * @returns {boolean} - The validation result.
	 */

	static validate(input, model) {
		// if the model is an array of models.
		if (Array.isArray(model)) {
			// For each model.
			for (const property in model) {
				// Validate the input against the model.
				this.validate(input, model[property]);
			}
		}
		// If the model is a singular model.
		else {
			this._validate(input, model);
		}
	}

	static _validate(input, model) {
		// If required is not true.
		if (model.required !== true) {
			// if the input is undefined or null.
			if (typeof input === 'undefined' || input === null) {
				return true;
			}
		}
		// For each property in the model.
		for (const property in model) {
			if (property === 'required') {
				if (!this.validateRequired(input, model[property])) {
					return false;
				}
			}
			else if (property === 'type') {
				if (!this.validateType(input, model[property])) {
					return false;
				}
			}
		}
	}

	static validateRequired(input, required) {
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

	static validateType(input, type) {
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
		else if (type === 'array') {
			if (Array.isArray(input)) {
				return true;
			}
		}
		else if (type === 'object') {
			// If input is an object, not an array, and not null.
			if (typeof input === 'object' && !Array.isArray(input) && input !== null) {
				return true;
			}
		}
		return false;
	}

	static validateCustom(input, custom) {
		if (custom(input)) {
			return true;
		}
		return false;
	}









	/**
	 * Set the model.
	 * @param {object} model - The schema blueprints.
	 */

	set model(model) {
		// Validate the model against the Schema class model.
		let validationResult = this.constructor.validate(model, this.constructor.model);
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
		let validationResult = this.constructor.validate(input, this.model);
	}

};