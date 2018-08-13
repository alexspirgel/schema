/**
 * A wrapper function for the typeof expression. Returns a more helpful result.
 * @param {*} value - The value to be evaluated.
 *
 * @returns {string} - The type of the passed value.
 */

const type_of = (value) => {
	// Get the result from the typeof expression.
	const type = typeof value;
	// If the value is a number.
	if(type === 'number') {
		// If the value is not a number (NaN).
		if(Number.isNaN(value)) {
			return 'NaN';
		}
	}
	// If the value is an object.
	else if(type === 'object') {
		// If the value is null.
		if(value === null) {
			return 'null';
		}
		// If the value is an array.
		else if(Array.isArray(value)) {
			return 'array';
		}
	}
	// Otherwise, return the normal result.
	return type;
}; // End type_of function.


/**
 * Schema v1.0.0
 * https://github.com/alexspirgel/schema
 */

const Schema = class {

	/**
	 *
	 */
	constructor(model) {
		this.model = model;
	}


	/**
	 * Validates an input using a schema model.
	 * @param {*} input - The input to compare to the model.
	 * @param {object|array} [model=this.model] - The schema object(s) used to validate the input.
	 *
	 * @returns {boolean} - The validation result.
	 */

	validate(input, model) {

		// If no model is passed, use the class instance model.
		if(!model) {
			model = this.model;
		}

		// If the model consists of an array of schema objects.
		// The input needs to successfully validate with one of the schema objects in the array.
		if(type_of(model) === 'array') {
			// For each schema object in the array.
			for(let schema_object = 0; schema_object < model.length; schema_object++) {
				// If the input is valid.
				if(this.validate(input, model[schema_object])) {
					return true;
				}
			}
			// If the input did not successfully validate with any of the schema objects in the array.
			return false;
		}

		// If the model consists of a single schema object.
		else {
			// Get the input type.
			const input_type = type_of(input);

			/**
			 * Required
			 *
			 * If no input is passed (undefined or null) and the required option is true:
			 * - The input is invalid (return false).
			 *
			 * If no input is passed (undefined or null) and the required option is false (or unset):
			 * - The input is valid (return true).
			 */

			// If the input type is undefined or null.
			if(input_type === 'undefined' || input_type === 'null') {
				// If the required option evaluates to true.
				if(model.required) {
					return false;
				}
				// If the required option evaluates to false.
				else {
					return true;
				}
			} // End required.

			/**
			 * Type
			 *
			 * If the type option is set and matches the input type:
			 * - The input is valid and continues onto type-specific options if they exist.
			 *
			 * If the type option is set and does not match the input type:
			 * - The input is invalid (return false).
			 */

			// If the type option is set.
			if(model.type) {
				// If the type option matches the input type.
				if(model.type === input_type) {

					/**
					 * Boolean
					 */

					// If the type option is boolean.
					if(model.type === 'boolean') {
						// No options.
					}

					/**
					 * Number
					 */

					// If the type option is number.
					else if(model.type === 'number') {
						// If the number minimum option is set.
						if(model.number_min) {
							// If the input is less than the minimum.
							if(input < model.number_min) {
								return false;
							}
						}
						// If the number maximum option is set.
						if(model.number_max) {
							// If the input is greater than the maximum.
							if(input > model.number_max) {
								return false;
							}
						}
						// If the number multiple of option is set.
						if(model.number_multiple_of) {
							// If the input is not a multiple of the number multiple of option value.
							if(input % model.number_multiple_of !== 0) {
								return false;
							}
						}
					}

					/**
					 * String
					 */

					// If the type option is string.
					else if(model.type === 'string') {
						// If the string minimum characters option is set.
						if(model.string_min_characters) {
							// If the input has less than the minimum characters.
							if(input.length < model.string_min_characters) {
								return false;
							}
						}
						// If the string maximum characters option is set.
						if(model.string_max_characters) {
							// If the input has greater than the maximum characters.
							if(input.length > model.string_max_characters) {
								return false;
							}
						}
						// If the string matches option is set.
						if(model.string_matches) {
							// If the string does not match the regular expression set.
							if(!input.match(new RegExp(model.string_matches))) {
								return false;
							}
						}
					}

					/**
					 * Symbol
					 */

					// If the type option is symbol.
					else if(model.type === 'symbol') {
						// No options.
					}

					/**
					 * Function
					 */

					// If the type option is function.
					else if(model.type === 'function') {
						// No options.
					}

					/**
					 * Array
					 */

					// If the type option is array.
					else if(model.type === 'array') {
						// If the array minimum length option is set.
						if(model.array_min_length) {
							// If the input length is less than the minimum length.
							if(input.length < model.array_min_length) {
								return false;
							}
						}
						// If the array maximum length option is set.
						if(model.array_max_length) {
							// If the input length is greater than the maximum length.
							if(input.length > model.array_max_length) {
								return false;
							}
						}
						// If the array items unique option is set to true.
						if(model.array_items_unique) {
							// For each item in the input array.
							for(let input_item = 0; input_item < input.length; input_item++) {
								let this_item = input[input_item];
								// For each remaining item in the input array.
								for(let inner_input_item = input_item + 1; inner_input_item < input.length; inner_input_item++) {
									let this_inner_item = input[inner_input_item];
									// If the current item matches another item.
									if(this_item === this_inner_item) {
										return false;
									}
								}
							}
						}
						// If the array item schema option is set.
						// The validation fails if any item in the array does not successfully validate.
						if(model.array_items_schema) {
							// For each item in the input array.
							for(let input_item = 0; input_item < input.length; input_item++) {
								// If the array item is invalid.
								if(!this.validate(input[input_item], model.array_items_schema)) {
									return false;
								}
							}
						}
					}

					/**
					 * Object
					 */

					// If the type option is object.
					else if(model.type === 'object') {
						// If the object instance option is set (Date, Element).
						if(model.object_instance) {}
						// If the object allow unexpected option is set.
						if(model.object_allow_unexpected) {}
						// If the object property schema option is set.
						if(model.object_property_schema) {
							// For each schema property.
							for(let schema_property in model.object_property_schema) {
								// Validate each input property against each object property schema.
								const object_property_is_valid = evaluate(input[schema_property], model.object_property_schema[schema_property]);
								// If the object property is not valid.
								if(!object_property_is_valid) {
									return false;
								}
							}
						}
					}
				}
				// If the type option does not match the input type.
				else {
					return false;
				}
			} // End type.

			// If all other validation passes.
			return true;
		} // End single schema object.

	} // End validate function.

};