const ValidationError = require('./ValidationError.js');

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