const DataPathManager = require('./DataPathManager.js');

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