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
	 * @param {object} [path] - The model to compare the input to. Must be an array.
	 * @param {*} [inputEntry] - The original entered input (for internal use only).
	 * @param {boolean} [recursive] - A flag indicating if the function call is a recursive call or not (for internal use only).
	 * @returns {boolean} The validation result.
	 */

	static validate(parameters) {
		// If path is undefined.
		if (parameters.path === undefined) {
			// Initialize path array.
			parameters.path = [];
		}
		// If the call is not recursive.
		if (!parameters.recursive) {
			// Set the input as it was originally entered.
			parameters.inputEntry = parameters.input;
		}
		// If the model is an array of models.
		if (Array.isArray(parameters.model)) {
			// For each model.
			for (const property in parameters.model) {
				// If the input validates true with this model.
				if (this.validate({
					model: parameters.model[property],
					input: parameters.input,
					path: parameters.path,
					inputEntry: parameters.inputEntry,
					recursive: true
				}) === true) {
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
			return this._validate({
				model: parameters.model,
				input: parameters.input,
				path: parameters.path,
				inputEntry: parameters.inputEntry
			});
		}
	}

	/**
	 * Validate an input against a single model.
	 * @param {object} model - The model to compare the input to.
	 * @param {*} input - The input to compare to the model.
	 * @param {object} [path] - The model to compare the input to. Must be an array.
	 * @param {*} [inputEntry] - The original entered input (for internal use only).
	 * @returns {boolean} - The validation result.
	 */

	static _validate(parameters) {
		// For each property in the model.
		// Return false if any return false.
		for (const property in parameters.model) {
			if (property === 'type') {
				if (!this.validateType(parameters.model[property], parameters.input)) {
					return false;
				}
			}
			else if (property === 'allPropertiesSchema') {
				if (!this.validateAllPropertiesSchema(parameters.model[property], parameters.input, parameters.path, parameters.inputEntry)) {
					return false;
				}
			}
			else if (property === 'propertySchema') {
				if (!this.validatePropertySchema(parameters.model[property], parameters.input, parameters.path, parameters.inputEntry)) {
					return false;
				}
			}
			else if (property === 'custom') {
				if (!this.validateCustom(parameters.model[property], parameters.input, parameters.path, parameters.inputEntry)) {
					return false;
				}
			}
		}
		// If no other model properties validate false, return true.
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
		else if (type === 'unset') {
			if (input === undefined || input === null) {
				return true;
			}
		}
		// If the input is not the correct type, or the passed model type is not one we check for.
		return false;
	}

	static validateAllPropertiesSchema(allPropertiesSchema, input, path = [], inputEntry) {
		// For each property in the input.
		for (const property in input) {
			// Append this property to the path array.
			path.push(property);
			// Validate the property value against `allPropertiesSchema`.
			const validationResult = this.validate({
				model: allPropertiesSchema, 
				input: input[property], 
				path: path, 
				inputEntry: inputEntry, 
				recursive: true
			});
			// Remove this property from the path array.
			path.pop();
			// If the input value validates false.
			if (!validationResult) {
				return false;
			}
		}
		// If none of the input values validate false.
		return true;
	}

	static validatePropertySchema(propertySchema, input, path = [], inputEntry) {
		// For each property in the `propertySchema`.
		for (const property in propertySchema) {
			// Append this property to the path array.
			path.push(property);
			// Validate the property value against the same property in `propertySchema`.
			const validationResult = this.validate({
				model: propertySchema[property], 
				input: input[property], 
				path: path, 
				inputEntry: inputEntry, 
				recursive: true
			});
			// Remove this property from the path array.
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
		//
		const pathClone = path.splice(0);
		const validationResult = custom(input, pathClone, inputEntry);
		if (validationResult === true) {
			return true;
		}
		else {
			if (validationResult !== false) {
				let customError = validationResult;
				console.warn(customError);
			}
			return false;
		}
	}

	/*
	 *
	 */

	static resolvePath(path, object) {
		// Initialize a variable to hold the path as we resolve it.
		let resolvedPath;
		// For each property in the path array.
		for (const property in path) {
			// Get the path segment.
			let pathSegemnt = path[property];
			// Traverse to the path segment, building on the previous segments.
			resolvedPath = object[pathSegemnt];
		}
		// Return the final resolved path.
		return resolvedPath;
	}






	/**
	 * Set the model.
	 * @param {object} model - The schema blueprints.
	 */

	set model(model) {
		// Validate the model against the Schema class model.
		let validationResult = this.constructor.validate({
			model: this.constructor.model,
			input: model
		});
		// If the model is valid.
		if (validationResult) {
			this._model = model;
		}
		// If the model is invalid.
		else {
			console.error('Model syntax is invalid.');
		}
	}

	/**
	 * Get the model.
	 * @returns {object} model - The schema blueprints.
	 */

	 get model() {
		 return this._model;
	 }

	/**
	 * Create a schema using the input as the model.
	 * @param {object} model - The schema blueprints.
	 */

	constructor(model) {
		// Set the input model on the instance.
		this.model = model;
	}

};