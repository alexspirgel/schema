/**
 * Schema v1.0.0
 * https://github.com/alexspirgel/schema
 */

const Schema = class {

	constructor(model) {
		this.model = model;
	}

	validate(input) {

		const type_of = (value) => {
			const type = typeof value;
			if(type === 'number' && isNaN(value)) {
					return 'NaN';
			}
			else if(type === 'object') {
				if(value === null) {
					return 'null';
				}
				else if(Array.isArray(value)) {
					return 'array';
				}
				else {
					return type;
				}
			}
			else {
				return type;
			}
		};

		const input_type = type_of(input);

		const model_required = this.model.required;
		if(model_required) {
			if(input_type === 'undefined') {
				return false;
			}
		}

		const model_type = this.model.type;
		if(model_type) {
			// If the input type matches the model type.
			if(input_type === model_type) {
				// If the model type is a boolean.
				if(model_type === 'boolean') {
					// No options.
				}
				// If the model type is a number.
				else if(model_type === 'number') {
					// If the model defines a minimum.
					if(this.model.number_min) {
						if(input <= this.model.number_min) {
							console.log('%cfalse', 'background-color:rgba(255,0,0,0.5);');
							return false;
						}
					}
					// If the model defines a maximum.
					if(this.model.number_max) {
						if(input >= this.model.number_max) {
							console.log('%cfalse', 'background-color:rgba(255,0,0,0.5);');
							return false;
						}
					}
					// If the model defines a multiple of.
					if(this.model.number_multiple_of) {
						if(Math.abs(input % this.model.number_multiple_of) !== 0) {
							console.log('%cfalse', 'background-color:rgba(255,0,0,0.5);');
							return false;
						}
					}
				}
				// If the model type is a string.
				else if(model_type === 'string') {
					// If the model defines a minimum.
					if(this.model.string_min) {
						if(input.length <= this.model.string_min) {
							console.log('%cfalse', 'background-color:rgba(255,0,0,0.5);');
							return false;
						}
					}
					// If the model defines a maximum.
					if(this.model.string_max) {
						if(input.length >= this.model.string_max) {
							console.log('%cfalse', 'background-color:rgba(255,0,0,0.5);');
							return false;
						}
					}
				}
				// If the model type is a symbol.
				else if(model_type === 'symbol') {
					// No options.
				}
				// If the model type is a function.
				else if(model_type === 'function') {
					// No options.
				}
				// If the model type is a array.
				else if(model_type === 'array') {}
				// If the model type is a object.
				else if(model_type === 'object') {}
			}
			else {
				console.log('%cfalse', 'background-color:rgba(255,0,0,0.5);');
				return false;
			}
		}
		console.log('%ctrue', 'background-color:rgba(0,255,0,0.5);');
		return true;

	} // End validate.

};