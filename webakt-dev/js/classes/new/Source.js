
class SourceCollection {
	constructor() {
		this.instances = {};
	}
	
	add = function(instance) {
		this.instances[makeId('source')] = instance;
	}
}


class Source {
	constructor(spec) {
		this.name = spec.name;
	}
}

