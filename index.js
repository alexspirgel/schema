/**
 * Schema v1.0.0
 * https://github.com/alexspirgel/schema
 */

const Schema = class {

	/**
	 * Get the Schema class model. This is the model for the user input models.
	 * @returns {object} - The Schema class model.
	 */

	static get model() {
		// Define a single Schema model.
		const model = {
			type: 'object',
			propertySchema: {
				type: this.modelType,
				exact: this.modelExact,
				instanceOf: this.modelInstanceOf,
				custom: this.modelCustom
			}
		};
		// Return the full Schema model allowing for a single model or an array of models.
		return [
			model,
			{
				type: 'object',
				instanceOf: Array,
				allPropertiesSchema: model
			}
		];
	}

	/**
	 * Define the `type` model.
	 * A `type` model can be one of these values: 'boolean', 'number', 'string', 'function', 'object', or 'unset'
	 * @returns {object} - The `type` model.
	 */

	static get modelType() {
		return [
			{
				exact: [
					'boolean',
					'number',
					'string',
					'function',
					'object',
					'unset'
				]
			},
			{
				type: 'unset'
			}
		];
	}

	/**
	 * Define the `exact` model.
	 * An `exact` model can be a single value or array of a boolean, number, or string.
	 * @returns {object} - The `exact` model.
	 */

	static get modelExact() {
		// Define the model for a single exact boolean value.
		const modelExactBoolean = {
			type: 'boolean'
		};
		// Define the model for a single exact number value.
		const modelExactNumber = {
			type: 'number'
		};
		// Define the model for a single exact string value.
		const modelExactString = {
			type: 'string'
		};
		// Return a model that allows for a single value or an array of values.
		return [
			modelExactBoolean,
			modelExactNumber,
			modelExactString,
			{
				type: 'object',
				instanceOf: Array,
				allPropertiesSchema: [
					modelExactBoolean,
					modelExactNumber,
					modelExactString,
				]
			},
			{
				type: 'unset'
			}
		]
	}

	/**
	 * Define the `instanceOf` model.
	 * An `instanceOf` model can be a function or an array of functions.
	 * @returns {object} - The `instanceOf` model.
	 */

	static get modelInstanceOf() {
		// Define the model for a single `instanceOf` value.
		const modelInstanceOfSingle = {
			type: 'function',
			custom: {
				validator: (input, path, inputEntry) => {
					path.pop();
					const resolvedPath = this.resolvePath(path, inputEntry);
					const relativeTypeValue = resolvedPath.type;
					if (relativeTypeValue === 'object') {
						return true;
					}
					return false;
				},
				message: '`instanceOf` can only be used in combination with `type: "object"`.'
			}
		};
		// Return the model allowing for a single or multiple value.
		return [
			modelInstanceOfSingle,
			{
				type: 'object',
				instanceOf: Array,
				allPropertiesSchema: modelInstanceOfSingle
			},
			{
				type: 'unset'
			}
		];
	}

	/**
	 * Define the `custom` model.
	 * A `custom` model must be an object containing a validator function, a custom message is optional.
	 * @returns {object} - The `custom` model.
	 */

	static get modelCustom() {
		return [
			{
				type: 'object',
				propertySchema: {
					validator: {
						type: 'function'
					},
					message: [
						{
							type: 'string'
						},
						{
							type: 'unset'
						}
					]
				}
			},
			{
				type: 'unset'
			}
		]
	}

	/**
	 * A multi-model supporting wrapper for the single model validation method `_validate`.
	 * @param {object} parameters - One object to house all parameters for easier workability.
	 * @param {object|array} parameters.model - The model to compare the input to.
	 * @param {*} parameters.input - The input to compare to the model.
	 * @param {array} [parameters.path] - The model to compare the input to. Must be an array.
	 * @param {*} [parameters.inputEntry] - The original entered input (for internal use only).
	 * @param {boolean} [parameters.recursive] - A flag indicating if the function call is a recursive call or not (for internal use only).
	 * @param {boolean} [parameters.debug] - A flag indicating if helpful log messages should be output.
	 * @returns {boolean} The validation result.
	 */

	static validate(parameters) {
		if (parameters.debug) {
			console.log('static validate(parameters)');
			console.log(parameters);
		}
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
					recursive: true,
					debug: parameters.debug
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
				inputEntry: parameters.inputEntry,
				debug: parameters.debug
			});
		}
	}

	/**
	 * Validate an input against a single model.
	 * @param {object} parameters - One object to house all parameters for easier workability.
	 * @param {object} parameters.model - The model to compare the input to.
	 * @param {*} parameters.input - The input to compare to the model.
	 * @param {array} [parameters.path] - The model to compare the input to. Must be an array.
	 * @param {*} [parameters.inputEntry] - The original entered input (for internal use only).
	 * @param {boolean} [parameters.debug] - A flag indicating if helpful log messages should be output.
	 * @returns {boolean} - The validation result.
	 */

	static _validate(parameters) {
		if (parameters.debug) {
			console.log('static _validate(parameters)');
			console.log(parameters);
		}
		// For each property in the model.
		// Return false if any return false.
		for (const property in parameters.model) {
			if (property === 'type') {
				if (!this.validateType(parameters.model[property], parameters.input)) {
					return false;
				}
			}
			else if (property === 'exact') {
				if (!this.validateExact(parameters.model[property], parameters.input)) {
					return false;
				}
			}
			else if (property === 'instanceOf') {
				if (!this.validateInstanceOf(parameters.model[property], parameters.input)) {
					return false;
				}
			}
			else if (property === 'custom') {
				if (!this.validateCustom({
					validator: parameters.model[property].validator,
					input: parameters.input,
					path: parameters.path,
					inputEntry: parameters.inputEntry
				})) {
					return false;
				}
			}
			else if (property === 'allPropertiesSchema') {
				if (!this.validateAllPropertiesSchema({
					allPropertiesSchema: parameters.model[property],
					input: parameters.input,
					path: parameters.path,
					inputEntry: parameters.inputEntry
				})) {
					return false;
				}
			}
			else if (property === 'propertySchema') {
				if (!this.validatePropertySchema({
					propertySchema: parameters.model[property],
					input: parameters.input,
					path: parameters.path,
					inputEntry: parameters.inputEntry
				})) {
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

	static validateExact(exact, input) {
		// If exact parameter is an array.
		if (Array.isArray(exact)) {
			// For each exact value in array.
			for (const property in exact) {
				// Recursively call exact validation.
				const validationResult = this.validateExact(exact[property], input);
				// If any of the validation results are true.
				if (validationResult === true) {
					// Return true, canceling further comparisons.
					return true;
				}
			}
		}
		// If the exact parameter is a single value.
		else {
			// If the input equals the exact value.
			if (input === exact) {
				return true;
			}
		}
		// If the input does not match the exact value(s).
		return false;
	}

	static validateInstanceOf(instance, input) {
		// If instance parameter is an array.
		if (Array.isArray(instance)) {
			// For each instance value in array.
			for (const property in instance) {
				// Recursively call instanceOf validation.
				const validationResult = this.validateInstanceOf(instance[property], input);
				// If any of the validation results are true.
				if (validationResult === true) {
					// Return true, canceling further comparisons.
					return true;
				}
			}
		}
		// If the instance parameter is a single value.
		else {
			// If the input is an instance of the instance parameter.
			if (input instanceof instance) {
				return true;
			}
		}
		// If the input does not match the exact value(s).
		return false;
	}

	static validateCustom(parameters) {
		// If path is not an array.
		if (!Array.isArray(parameters.path)) {
			// Initialize the path array.
			parameters.path = [];
		}
		// Clone the path array to prevent accidental changes to the current path.
		const pathClone = parameters.path.splice(0);
		// Get the validation result.
		const validationResult = parameters.validator(parameters.input, pathClone, parameters.inputEntry);
		// If the validation result is a truthy value.
		if (validationResult) {
			return true;
		}
		// if the validation value is not truthy.
		else {
			return false;
		}
	}

	static validateAllPropertiesSchema(parameters) {
		// If path is not an array.
		if (!Array.isArray(parameters.path)) {
			// Initialize the path array.
			parameters.path = [];
		}
		// For each property in the input.
		for (const property in parameters.input) {
			// Append this property to the path array.
			parameters.path.push(property);
			// Validate the property value against `allPropertiesSchema`.
			const validationResult = this.validate({
				model: parameters.allPropertiesSchema, 
				input: parameters.input[property], 
				path: parameters.path, 
				inputEntry: parameters.inputEntry, 
				recursive: true
			});
			// Remove this property from the path array.
			parameters.path.pop();
			// If the input value validates false.
			if (!validationResult) {
				return false;
			}
		}
		// If none of the input values validate false.
		return true;
	}

	static validatePropertySchema(parameters) {
		// For each property in the `propertySchema`.
		for (const property in parameters.propertySchema) {
			// Append this property to the path array.
			parameters.path.push(property);
			// Validate the property value against the same property in `propertySchema`.
			const validationResult = this.validate({
				model: parameters.propertySchema[property], 
				input: parameters.input[property], 
				path: parameters.path, 
				inputEntry: parameters.inputEntry, 
				recursive: true
			});
			// Remove this property from the path array.
			parameters.path.pop();
			// If the input value validates false.
			if (!validationResult) {
				return false;
			}
		}
		// If none of the input values validate false.
		return true;
	}

	/*
	 *
	 */

	static resolvePath(path, object) {
		// Initialize a variable to hold the path as we resolve it.
		let resolvedPath;
		// If the path array is not empty.
		if (path.length > 0) {
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
		// If the path array is empty.
		else {
			// Return the original object.
			return object;
		}
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