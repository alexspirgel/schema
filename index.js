/**
 * Schema v1.0.0
 * https://github.com/alexspirgel/schema
 */

const Schema = class {

	/**
	 * Get the static model for self-validation.
	 * @returns {object} - The model.
	 */

	static get model() {
		const model = {
			required: true,
			type: 'object',
			allowUnvalidatedProperties: false,
			propertySchema: {
				required: this.modelRequired,
				type: this.modelType,
				allowUnvalidatedProperties: this.modelAllowUnvalidatedProperties,
				propertySchema: this.modelPropertySchema,
				custom: this.modelCustom
			}
		};
		return model;
	}

	/**
	 * Get the static required property model for self-validation.
	 * @returns {object} - The model.
	 */

	static get modelRequired() {
		return	{
			type: 'boolean'
		};
	}
	
	/**
	 * Get the static type property model for self-validation.
	 * @returns {object} - The model.
	 */
	
	static get modelType() {
		return	{
			type: 'string'
		};
	}
	
	/**
	 * Get the static allowUnvalidatedProperties property model for self-validation.
	 * @returns {object} - The model.
	 */

	static get modelAllowUnvalidatedProperties() {
		return	{
			type: 'boolean'
		};
	}

	/**
	 * Get the static propertySchema property model for self-validation.
	 * @returns {object} - The model.
	 */
	
	static get modelPropertySchema() {
		return	{
			type: 'object'
		};
	}

	/**
	 * Get the static custom property model for self-validation.
	 * @returns {object} - The model.
	 */
	
	static get modelCustom() {
		return	{
			type: 'function'
		};
	}
	
	/**
	 * A wrapper for `_validate()` that supports multiple model syntax.
	 * @param {object} parameters - One object to contain all parameters.
	 * @param {object|array} parameters.model - The model for the input to be compared to.
	 * @param {*} parameters.input - The input to validate.
	 * @returns {boolean} The validation result.
	 */

	static validate(parameters) {
		if (Array.isArray(parameters.model)) {
			for (const individualModel of parameters.model) {
				const validationResult = this.validate({
					model: individualModel,
					input: parameters.input
				});
				if (validationResult === true) {
					return true;
				}
			}
			// If the input doesn't successfully validate with any of the models.
			return false;
		}
		else {
			return this._validate({
				model: parameters.model,
				input: parameters.input
			});
		}
	}

	/**
	 * Validate an input against a single model.
	 * @param {object} parameters - One object to contain all parameters.
	 * @param {object} parameters.model - The single model for the input to be compared to.
	 * @param {*} parameters.input - The input to validate.
	 * @returns {boolean} - The validation result.
	 */

	static _validate(parameters) {
		const validateProperty = {
			required: this.validateRequired,
			custom: this.validateCustom,
			type: this.validateType,
			allowUnvalidatedProperties: this.validateAllowUnvalidatedProperties
		};
		for (const property in parameters.model) {
			if (validateProperty.hasOwnProperty(property)) {
				try {
					const propertValidationresult = validateProperty[property](parameters.model, parameters.input);
				}
				catch(error) {
					console.log(error);
					return false;
				}
			}
		}
		return true;
	}

	/**
	 * Validate the required property.
	 * @param {object} model - The model.
	 * @param {*} input - The input to validate.
	 * @returns {boolean} - The validation result.
	 */

	static validateRequired(model, input) {
		if (model.required === true) {
			if (input !== undefined && input !== null) {
				return true;
			}
			throw new Error('Required validation failed. The value must not be null or undefined.');
		}
	}

	/**
	 * Validate the custom property.
	 * @param {object} model - The model.
	 * @param {*} input - The input to validate.
	 * @returns {boolean} - The validation result.
	 */

	static validateCustom(model, input) {
		console.log('validateCustom()');
		console.log(this);
		return model.custom(input);
	}

	/**
	 * Validate the type property.
	 * @param {object} model - The model.
	 * @param {*} input - The input to validate.
	 * @returns {boolean} - The validation result.
	 */

	static validateType(model, input) {

		if (model.type === 'object') {
			if (typeof input === 'object'
			&& !Array.isArray(input) &&
			input !== null) {
				return true;
			}
		}
		
		else if (model.type === 'array') {
			if (Array.isArray(input)) {
				return true;
			}
		}

		else if (model.type === 'boolean' ||
		model.type === 'number' ||
		model.type === 'string' ||
		model.type === 'function') {
			if (typeof input === model.type) {
				return true;
			}
		}
	
		throw new Error('Type validation failed. The value must match the value of ' + model.type + '.');

	}

	/**
	 * Validate the allowUnvalidatedProperties property.
	 * @param {object} model - The model.
	 * @param {*} input - The input to validate.
	 * @returns {boolean} - The validation result.
	 */

	static validateAllowUnvalidatedProperties(model, input) {

		const errorMessagePrefix = 'AllowUnvalidatedProperties validation failed. Unvalidated properties are not allowed. Validated properties include: ';
		
		if (model.allowUnvalidatedProperties === false) {
			if (Object.keys(input).length > 0) {
				if (!model.hasOwnProperty('propertySchema') || Object.keys(model.propertySchema).length < 1) {
					throw new Error(errorMessagePrefix + '(No properties found within model `propertySchema` property).');
				}
			}
			for (const inputProperty of Object.keys(input)) {
				if (!model.propertySchema.hasOwnProperty(inputProperty)) {
					throw new Error(errorMessagePrefix + Object.keys(model.propertySchema));
				}
			
			}
		}
		
		return true;
	}






























	/**
	 * Create a schema.
	 * @param {object} model - The model to compare to.
	 * @param {object} [parentModel=null] - The parent model (meant for internal use).
	 */
	
	constructor(model, parentModel = null) {
		// Set the input model on the instance.
		this.model = model;
		this.parentModel = parentModel;
	}

	/**
	 * Set the model.
	 * @param {object} model - The model.
	 */

	set model(model) {
		// this._model = model;
		let validationResult = this.constructor.validate({
			model: this.constructor.model,
			input: model
		});
		console.log('validate model: ', validationResult);
		if (validationResult === true) {
			this._model = model;
		}
		else {
			console.error('Model syntax is invalid.');
		}
	}

	/**
	 * Get the model.
	 * @returns {object} model - The model.
	 */

	get model() {
		return this._model;
	}

	/**
	 * Validate an input.
	 * @param {*} input - The value to validate.
	 * @returns {boolean} model - The validation result.
	 */

	validate(input) {
		return this.constructor.validate({
			model: this.model,
			input: input
		});
	}
	
};