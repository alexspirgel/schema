const DataPathManager = require('./classes/DataPathManager.js');
const ValidationError = require('./classes/ValidationError.js');
const ValidationErrors = require('./classes/ValidationErrors.js');
const modelModel = require('./models/model.js');

class Schema {
	
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
				property: 'minimumCharacters',
				method: this.validateMinimumCharacters
			},
			{
				property: 'maximumCharacters',
				method: this.validateMaximumCharacters
			},
			{
				property: 'minimumLength',
				method: this.validateMinimumLength
			},
			{
				property: 'maximumLength',
				method: this.validateMaximumLength
			},
			{
				property: 'instanceOf',
				method: this.validateInstanceOf
			},
			{
				property: 'allowUnvalidatedProperties',
				method: this.validateAllowUnvalidatedProperties
			},
			{
				property: 'custom',
				method: this.validateCustom
			},
			{
				property: 'allPropertySchema',
				method: this.validateAllPropertySchema
			},
			{
				property: 'propertySchema',
				method: this.validatePropertySchema
			}
		]
	}

	static validateRequired(modelPathManager, inputPathManager) {
		if (modelPathManager.value === true) {
			if (inputPathManager.value === undefined || inputPathManager.value === null) {
				throw new ValidationError(`Property 'required' validation failed. The input must not be null or undefined.`);
			}
		}
		return true;
	}

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
		throw new ValidationError(`Property 'type' validation failed. The input must have a type of ${modelPathManager.value}.`);
	}

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
		throw new ValidationError(`Property 'exactValue' validation failed. The input must be an exact match of the value or one of the values in an array of values.`);
	}

	static validateGreaterThan(modelPathManager, inputPathManager) {
		if (inputPathManager.value > modelPathManager.value) {
			return true;
		}
		else {
			throw new ValidationError(`Property 'greaterThan' validation failed. The input must be greater than ${modelPathManager.value}.`);
		}
	}

	static validateGreaterThanOrEqualTo(modelPathManager, inputPathManager) {
		if (inputPathManager.value >= modelPathManager.value) {
			return true;
		}
		else {
			throw new ValidationError(`Property 'greaterThanOrEqualTo' validation failed. The input must be greater than or equal to ${modelPathManager.value}.`);
		}
	}

	static validateLessThan(modelPathManager, inputPathManager) {
		if (inputPathManager.value < modelPathManager.value) {
			return true;
		}
		else {
			throw new ValidationError(`Property 'lessThan' validation failed. The input must be less than ${modelPathManager.value}.`);
		}
	}

	static validateLessThanOrEqualTo(modelPathManager, inputPathManager) {
		if (inputPathManager.value <= modelPathManager.value) {
			return true;
		}
		else {
			throw new ValidationError(`Property 'lessThanOrEqualTo' validation failed. The input must be less than or equal to ${modelPathManager.value}.`);
		}
	}

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
		throw new ValidationError(`Property 'divisibleBy' validation failed. The input must be divisible by the value or one of the values in an array of values.`);
	}

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
			throw new ValidationError(`Property 'notDivisibleBy' validation failed. The input must not be divisible by the value or one of the values in an array of values.`);
		}
		return true;
	}

	static validateMinimumCharacters(modelPathManager, inputPathManager) {
		if (inputPathManager.value.length >= modelPathManager.value) {
			return true;
		}
		else {
			throw new ValidationError(`Property 'minimumCharacters' validation failed. The input must have a character count greater than or equal to ${modelPathManager.value}.`);
		}
	}

	static validateMaximumCharacters(modelPathManager, inputPathManager) {
		if (inputPathManager.value.length <= modelPathManager.value) {
			return true;
		}
		else {
			throw new ValidationError(`Property 'maximumCharacters' validation failed. The input must have a character count less than or equal to ${modelPathManager.value}.`);
		}
	}

	static validateMinimumLength(modelPathManager, inputPathManager) {
		if (inputPathManager.value.length >= modelPathManager.value) {
			return true;
		}
		else {
			throw new ValidationError(`Property 'minimumLength' validation failed. The input must have a length greater than or equal to ${modelPathManager.value}.`);
		}
	}

	static validateMaximumLength(modelPathManager, inputPathManager) {
		if (inputPathManager.value.length <= modelPathManager.value) {
			return true;
		}
		else {
			throw new ValidationError(`Property 'maximumLength' validation failed. The input must have a length less than or equal to ${modelPathManager.value}.`);
		}
	}

	static validateInstanceOf(modelPathManager, inputPathManager) {
		if (Array.isArray(modelPathManager.value)) {
			for (const value of modelPathManager.value) {
				if (inputPathManager.value instanceof value) {
					return true;
				}
			}
		}
		else {
			if (inputPathManager.value instanceof modelPathManager.value) {
				return true;
			}
		}
		throw new ValidationError(`Property 'instanceOf' validation failed. The input must be an instance of the value or one of the values in an array of values.`);
	}

	static validateAllowUnvalidatedProperties(modelPathManager, inputPathManager) {
		if (modelPathManager.value === false) {
			modelPathManager.removePathSegment();
			modelPathManager.addPathSegment('propertySchema');
			let validatedProperties = [];
			if (modelPathManager.value) {
				validatedProperties = Object.keys(modelPathManager.value);
			}
			for (const property in inputPathManager.value) {
				if (!validatedProperties.includes(property)) {
					throw new ValidationError(`Property 'allowUnvalidatedProperties' validation failed. '${property}' is not defined in the 'propertySchema' validation property.`);
				}
			}
		}
		return true;
	}

	static validateCustom(modelPathManager, inputPathManager) {
		const customInputPathManager = inputPathManager.clone({data: true, path: true});
		return modelPathManager.value(customInputPathManager);
	}

	static validateAllPropertySchema(modelPathManager, inputPathManager) {
		const allPropertySchema = new Schema(modelPathManager.clone(), false);
		for (const property in inputPathManager.value) {
			const inputPropertyPathManager = inputPathManager.clone();
			inputPropertyPathManager.addPathSegment(property);
			const validationResult = allPropertySchema.validate(inputPropertyPathManager, 'array');
			if (validationResult !== true) {
				return validationResult;
			}
		}
		return true;
	}

	static validatePropertySchema(modelPathManager, inputPathManager) {
		for (const property in modelPathManager.value) {
			const modelPropertyPathManager = modelPathManager.clone();
			modelPropertyPathManager.addPathSegment(property);
			const propertySchema = new Schema(modelPropertyPathManager, false);
			const inputPropertyPathManager = inputPathManager.clone();
			inputPropertyPathManager.addPathSegment(property);
			const validationResult = propertySchema.validate(inputPropertyPathManager, 'array');
			if (validationResult !== true) {
				return validationResult;
			}
		}
		return true;
	}
	
	constructor(modelPathManager = {}, selfValidate = true) {
		this.selfValidate = selfValidate;
		this.modelPathManager = modelPathManager;
	}

	set modelPathManager(modelPathManager) {
		if (!(modelPathManager instanceof DataPathManager)) {
			modelPathManager = new DataPathManager(modelPathManager);
		}
		this._modelPathManager = modelPathManager;
		if (this.selfValidate) {
			const schemaModel = new Schema(modelModel, false);
			schemaModel.validate(this.modelPathManager);
		}
	}

	get modelPathManager() {
		return this._modelPathManager;
	}
 
	validate(inputPathManager, errorStyle = 'throw') {

		if (!(inputPathManager instanceof DataPathManager)) {
			inputPathManager = new DataPathManager(inputPathManager);
		}

		let validationErrors = new ValidationErrors();

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
		else if (errorStyle === 'array') {
			return validationErrors.errors;
		}
		else if (errorStyle === 'boolean') {
			return false;
		}

	}

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
					if (error instanceof ValidationError) {
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

Schema.ValidationError = ValidationError;

module.exports = Schema;