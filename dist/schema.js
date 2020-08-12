/*!
 * Schema v1.1.1
 * https://github.com/alexspirgel/schema
 */
var Schema =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const DataPathManager = __webpack_require__(1);

class ValidationError extends Error {
	
	constructor(...params) {
		super(...params);
	}
	
	set modelPathManager(modelPathManager) {
		if (!(modelPathManager instanceof DataPathManager)) {
			modelPathManager = new DataPathManager(modelPathManager);
		}
		this._modelPathManager = modelPathManager;
	}
	
	get modelPathManager() {
		return this._modelPathManager;
	}
	
	set inputPathManager(inputPathManager) {
		if (!(inputPathManager instanceof DataPathManager)) {
			inputPathManager = new DataPathManager(inputPathManager);
		}
		this._inputPathManager = inputPathManager;
	}
	
	get inputPathManager() {
		return this._inputPathManager;
	}

};

module.exports = ValidationError;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

class DataPathManager {
	
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
		return this.path.splice(-1, 1)[0];
	}
	
	get value() {
		let value = this.data;
		for (let path of this.path) {
			try {
				value = value[path];
			}
			catch (error) {
				return undefined;
			}
		}
		return value;
	}
	
	clone() {
		return new this.constructor(this.data, [...this.path]);
	}

};

module.exports = DataPathManager;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

const DataPathManager = __webpack_require__(1);
const ValidationError = __webpack_require__(0);
const ValidationErrors = __webpack_require__(3);
const modelModel = __webpack_require__(4);

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
		throw new ValidationError(`Property 'type' validation failed. The input type must match.`);
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
			throw new ValidationError(`Property 'greaterThan' validation failed. The input must be greater than the value.`);
		}
	}

	static validateGreaterThanOrEqualTo(modelPathManager, inputPathManager) {
		if (inputPathManager.value >= modelPathManager.value) {
			return true;
		}
		else {
			throw new ValidationError(`Property 'greaterThanOrEqualTo' validation failed. The input must be greater than or equal to the value.`);
		}
	}

	static validateLessThan(modelPathManager, inputPathManager) {
		if (inputPathManager.value < modelPathManager.value) {
			return true;
		}
		else {
			throw new ValidationError(`Property 'lessThan' validation failed. The input must be less than the value.`);
		}
	}

	static validateLessThanOrEqualTo(modelPathManager, inputPathManager) {
		if (inputPathManager.value <= modelPathManager.value) {
			return true;
		}
		else {
			throw new ValidationError(`Property 'lessThanOrEqualTo' validation failed. The input must be less than or equal to the value.`);
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
			throw new ValidationError(`Property 'minimumCharacters' validation failed. The input must have a character count greater than or equal to the value.`);
		}
	}

	static validateMaximumCharacters(modelPathManager, inputPathManager) {
		if (inputPathManager.value.length <= modelPathManager.value) {
			return true;
		}
		else {
			throw new ValidationError(`Property 'maximumCharacters' validation failed. The input must have a character count less than or equal to the value.`);
		}
	}

	static validateMinimumLength(modelPathManager, inputPathManager) {
		if (inputPathManager.value.length >= modelPathManager.value) {
			return true;
		}
		else {
			throw new ValidationError(`Property 'minimumLength' validation failed. The input must have a length greater than or equal to the value.`);
		}
	}

	static validateMaximumLength(modelPathManager, inputPathManager) {
		if (inputPathManager.value.length <= modelPathManager.value) {
			return true;
		}
		else {
			throw new ValidationError(`Property 'maximumLength' validation failed. The input must have a length less than or equal to the value.`);
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
		const customInputPathManager = inputPathManager.clone();
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

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

const ValidationError = __webpack_require__(0);

class ValidationErrors {
	
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
			if (!(error instanceof ValidationError)) {
				throw new Error(`Passed 'error' must be an instance of 'Schema.ValidationError'.`);
			}
			else {
				this.errors.push(error);
			}
		}
	}
	
	generateFormattedMessage() {
		let message = `Schema errors:\n`;
		for (const error of this.errors) {
			let inputPath = 'root';
			if (error.inputPathManager.path.length > 0) {
				inputPath = error.inputPathManager.path.map((pathSegment) => {
					return `['` + pathSegment + `']`;
				});
				inputPath = inputPath.join('');
			}
			let modelPath = 'root';
			if (error.modelPathManager.path.length > 0) {
				modelPath = error.modelPathManager.path.map((pathSegment) => {
					return `['` + pathSegment + `']`;
				});
				modelPath = modelPath.join('');
			}
			message = message + `\nInput Path: ${inputPath}\nModel Path: ${modelPath}\nMessage: ${error.message}\n`;
		}
		return message;
	}

};

module.exports = ValidationErrors;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

const extend = __webpack_require__(5);
const ValidationError = __webpack_require__(0);

const typeRestriction = (types) => {
	if (!Array.isArray(types)) {
		types = [types];
	}
	return (inputPathManager) => {
		const validationProperty = inputPathManager.removePathSegment();
		if (validationProperty === undefined || types.includes(inputPathManager.value.type)) {
			return true;
		}
		else {
			let typesString = ``;
			for (let i = 0; i < types.length; i++) {
				const type = types[i];
				if (i === 0) {
					typesString += `'${type}'`;
				}
				else if (i < (types.length - 1)) {
					typesString += `, '${type}'`;
				}
				else {
					if (types.length > 2) {
						typesString += `,`;
					}
					typesString += ` or '${type}'`;
				}
			}
			throw new ValidationError(`The validation property '${validationProperty}' can only belong to a model with a type of ${typesString}.`);
		}
	};
};

const modelPropertySchema = {
	required: {
		type: 'boolean'
	},
	type: {
		type: 'string',
		exactValue: [
			'boolean',
			'number',
			'string',
			'array',
			'object',
			'function'
		]
	},
	exactValue: {
		custom: typeRestriction(['boolean', 'number', 'string'])
	},
	greaterThan: {
		type: 'number',
		custom: typeRestriction('number')
	},
	greaterThanOrEqualTo: {
		type: 'number',
		custom: typeRestriction('number')
	},
	lessThan: {
		type: 'number',
		custom: typeRestriction('number')
	},
	lessThanOrEqualTo: {
		type: 'number',
		custom: typeRestriction('number')
	},
	divisibleBy: {
		type: 'number',
		custom: typeRestriction('number')
	},
	notDivisibleBy: {
		type: 'number',
		custom: typeRestriction('number')
	},
	minimumCharacters: {
		type: 'string',
		custom: typeRestriction('string')
	},
	maximumCharacters: {
		type: 'string',
		custom: typeRestriction('string')
	},
	minimumLength: {
		type: 'number',
		custom: typeRestriction('array')
	},
	maximumLength: {
		type: 'number',
		custom: typeRestriction('array')
	},
	instanceOf: {
		type: 'object',
		custom: typeRestriction('object')
	},
	allowUnvalidatedProperties: {
		type: 'boolean',
		custom: typeRestriction('object')
	},
	custom: {
		type: 'function'
	},
	propertySchema: {
		type: 'object',
		custom: typeRestriction(['array', 'object'])
	}
};

const modelObject = {
	type: 'object',
	propertySchema: modelPropertySchema
};

const modelArray = {
	type: 'array',
	allPropertySchema: {
		type: 'object',
		propertySchema: modelPropertySchema
	}
};

const model = [
	modelObject,
	modelArray
];

const modelTypeRestricted = [
	extend([{}, modelObject, {custom: typeRestriction(['array', 'object'])}], true),
	extend([{}, modelArray, {custom: typeRestriction(['array', 'object'])}], true)
];

modelPropertySchema.allPropertySchema = modelTypeRestricted;
modelPropertySchema.propertySchema.allPropertySchema = model;

module.exports = model;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * extend v2.0.4
 * https://github.com/alexspirgel/extend
 */

/**
 * Extends an object with another object(s).
 *
 * @param {array} objects - Array of objects containing the resulting object and the objects to merge into it.
 * @param {boolean} [deep] - Optional flag to enable or disable recursive merge.
 *
 * @returns {object} The object that has been extended.
 */

const extend = (objects, deep) => {

	/**
	 * Extends an object with another object.
	 *
	 * @param {object} target_object - The target object to be merged into.
	 * @param {object} merge_object - The object to merge into the target object.
	 * @param {boolean} [deep] - Optional flag to enable or disable recursive merge.
	 *
	 * @returns {object} The object that has been extended.
	 */

	const extendObject = (target_object, merge_object, deep) => {
		// For each property in the merge_object.
		for (let property in merge_object) {
			// If the merge_object value is an object, is not null, and the deep flag is true.
			if (typeof merge_object[property] === 'object' && merge_object[property] !== null && deep) {
				// If the merge_object value is a special case.
				if ((typeof Window !== 'undefined' && merge_object[property] instanceof Window) || (typeof HTMLDocument !== 'undefined' && merge_object[property] instanceof HTMLDocument) || (typeof Element !== 'undefined' && merge_object[property] instanceof Element)) {
					// Set the target_object property value equal to the merge_object property value.
					target_object[property] = merge_object[property];
					// Continue past the normal deep object handling.
					continue;
				}
				// If the merge_object value is an array.
				if (Array.isArray(merge_object[property]) || (typeof Nodelist !== 'undefined' && merge_object[property] instanceof NodeList)) {
					if ((typeof Nodelist !== 'undefined' && merge_object[property] instanceof NodeList)) {
						merge_object[property] = Array.from(merge_object[property]);
					}
					// Set the target_object value equal to an empty array (arrays are replaced, not merged).
					target_object[property] = [];
				}
				// If the target_object value is not an object or if it is null.
				else if (typeof target_object[property] !== 'object' || target_object[property] === null) {
					// Set the target_object value equal to an empty object.
					target_object[property] = {};
				}
				// Call the extendObject function recursively.
				extendObject(target_object[property], merge_object[property], deep);
				// Continue to the next property, skipping the normal value assignment.
				continue;
			}
			// Set the target_object property value equal to the merge_object property value (primitive values or shallow calls).
			target_object[property] = merge_object[property];
		}
		// Return the target_object.
		return target_object;
	}; // End function extendObject.

	// If objects length is greater than 1.
	if (objects.length > 1) {
		// For each object in objects (skipping the first object).
		for (let object = 1; object < objects.length; object++) {
			// If the current loop item is an object and not null.
			if (typeof objects[object] === 'object' && objects[object] !== null) {
				// Extend the first object with the current loop object.
				extendObject(objects[0], objects[object], deep);
			}
		}
	}
	// Return the first object in the array.
	return objects[0];

}; // End function extend.

// If script is being required as a node module.
if ( true && module.exports) {
	// Export the extend function.
	module.exports = extend;
}

/***/ })
/******/ ]);