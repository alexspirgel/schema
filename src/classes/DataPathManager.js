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