
class KbCollection {
	constructor() {
		this.instances = {};
	}
	
	add = function(instance) {
		this.instances[makeId('kb')] = instance;
	}
}


class Kb {
	constructor(spec) {
		if (spec.from_file) {
			this.statements = new StatementCollection(spec.from_file.statements);
			this.sources = new SourceCollection(spec.from_file.sources);
		}
	}
}

