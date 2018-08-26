/**
 * Schema v1.0.0
 * https://github.com/alexspirgel/schema
 */

const Schema = class {

	/**
	 * Create a schema with the input model.
	 * @param {object} model - The schema blueprints.
	 */

	constructor(model) {
		this.model = model;
	}

	/**
	 * Validate an input using a schema model.
	 * @param {*} input - The input to compare to the model.
	 * @param {object|array} [model=this.model] - The schema object(s) used to validate the input.
	 *
	 * @returns {boolean} - The validation result.
	 */

	validate(input) {

		let errors = [];

		/**
		 *
		 */

		const add_error = (message) => {
			const error_prefix = 'Schema Validation Error: ';
			const error_message = error_prefix + message;
			errors.push(error_message);
		};

		/*var output = 'did not successfully validate with any of the schema, here are the results for each:';
		var output = {
			"[0]": "c is required",
			"[1]": "b should be string"
		};*/

		/**
		 *
		 */

		const compare = (input, model) => {

			// If the model consists of an array of schema objects.
			// The input needs to successfully validate with one of the schema objects in the array.
			if(Array.isArray(model)) {
				// For each schema object in the array.
				for(let schema_object = 0; schema_object < model.length; schema_object++) {
					// If the input is valid.
					if(compare(input, model[schema_object])) {
						return true;
					}
				}
				// If the input did not successfully validate with any of the schema objects in the array.
				return false;
			} // End array of schema objects.

			// If the model consists of a single schema object.
			else {

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
				if(typeof input === 'undefined' || input === null) {
					// If the required option evaluates to true.
					if(model.required) {
						add_error('value is required');
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

					/**
					 * Boolean
					 */

					// If the type option value is boolean.
					if(model.type === 'boolean') {
						// If the input is not a boolean.
						if(typeof input !== 'boolean') {
							add_error('must be a boolean');
							return false;
						}
					}

					/**
					 * Number
					 */

					// If the type option value is number.
					else if(model.type === 'number') {
						// If the input is not a number.
						if(typeof input !== 'number') {
							console.error('Schema Validation Error: `` must be a number.');
							return false;
						}
						// If the input is NaN (not a number).
						if(Number.isNaN(input)) {
							console.error('Schema Validation Error: `` is NaN (not a number).');
							return false;
						}
						// If the number minimum option is set.
						if(model.number_min) {
							// If the input is less than the minimum.
							if(input < model.number_min) {
								console.error('Schema Validation Error: `` must be greater than ' + model.number_min);
								return false;
							}
						}
						// If the number maximum option is set.
						if(model.number_max) {
							// If the input is greater than the maximum.
							if(input > model.number_max) {
								console.error('Schema Validation Error: `` must be less than ' + model.number_max);
								return false;
							}
						}
						// If the number multiple of option is set.
						if(model.number_multiple_of) {
							// If the input is not a multiple of the number multiple of option value.
							if(input % model.number_multiple_of !== 0) {
								console.error('Schema Validation Error: `` must be a multiple of ' + model.number_multiple_of);
								return false;
							}
						}
					}

					/**
					 * String
					 */

					// If the type option value is string.
					else if(model.type === 'string') {
						// If the input is not a string.
						if(typeof input !== 'string') {
							return false;
						}
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

					// If the type option value is symbol.
					else if(model.type === 'symbol') {
						// if the input is not a symbol.
						if(typeof input !== 'symbol') {
							return false;
						}
					}

					/**
					 * Function
					 */

					// If the type option value is function.
					else if(model.type === 'function') {
						// if the input is not a function.
						if(typeof input !== 'function') {
							return false;
						}
					}

					/**
					 * Array
					 */

					// If the type option value is array.
					else if(model.type === 'array') {
						// if the input is not an array.
						if(!Array.isArray(input)) {
							return false;
						}
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
								const this_item = input[input_item];
								// For each remaining item in the input array.
								for(let inner_input_item = input_item + 1; inner_input_item < input.length; inner_input_item++) {
									const this_inner_item = input[inner_input_item];
									// If the current item matches the inner item.
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
								if(!compare(input[input_item], model.array_items_schema)) {
									return false;
								}
							}
						}
					}

					/**
					 * Object
					 */

					// If the type option value is object.
					else if(model.type === 'object') {
						// if the input is not an object or is an array.
						if(typeof input !== 'object' || Array.isArray(input)) {
							return false;
						}
						// If the object property schema option is set.
						if(model.object_property_schema) {
							// For each schema property.
							for(let schema_property in model.object_property_schema) {
								// Validate each input property against each object property schema.
								const object_property_is_valid = compare(input[schema_property], model.object_property_schema[schema_property]);
								// If the object property is not valid.
								if(!object_property_is_valid) {
									return false;
								}
							}
						}
						// If the object allow unexpected option is set to false.
						if(model.object_allow_unexpected === false) {
							// If object property schema is set.
							if(model.object_property_schema) {
								// Get an array of all properties of the object property schema.
								const schema_properties = Object.getOwnPropertyNames(model.object_property_schema);
							}
							// Get an array of all properties on the input object.
							const input_properties = Object.getOwnPropertyNames(input);
							// For each property on the input object.
							for(let input_property = 0; input_property < input_properties.length; input_property++) {
								// If the property does not exist within the defined schema properties.
								if(schema_properties.indexOf(input_properties[input_property]) < 0) {
									return false;
								}
							}
						}
						// If the object unique values option is set.
						if(model.object_unique_values) {
							// Get an array of all properties on the input object.
							const input_properties = Object.getOwnPropertyNames(input);
							// For each property on the input object.
							for(let input_property = 0; input_property < input_properties.length; input_property++) {
								const this_input_property = input_properties[input_property];
								const this_input_value = input[this_input_property];
								// For each remaining property in the input object.
								for(let inner_input_property = input_property + 1; inner_input_property < input_properties.length; inner_input_property++) {
									const this_inner_input_property = input_properties[inner_input_property];
									const this_inner_input_value = input[this_inner_input_property];
									// If an input value equals another input value.
									if(this_input_value === this_inner_input_value) {
										return false;
									}
								}
							}
						}
					}

				} // End type.

				// If all other validation passes.
				return true;

			} // End single schema object.
			
		}; // End compare function.

		const result = compare(input, this.model);

		if (errors.length > 0) {
			console.log(errors);
		}

		return result;

	} // End validate function.

};