

// Classes for individual instances

class Session {
    constructor(spec) {
		this.kbs = new KbCollection();
	}
}


class Kb {
	constructor(spec) {
		this.statements = new StatementCollection();
		this.sources = new SourceCollection();
	}
}


class Statement {
	constructor(spec) {
		this.formal = spec.formal;
		this.makeJson();
	}
	
	makeJson = function () {
		this.json = 'JSON:'+this.formal;
	}
}


class Source {
	constructor(spec) {
		this.name = spec.name;
	}
}



// Classes for collections

class KbCollection {
	constructor() {
		this.instances = {};
	}
	
	add = function(instance) {
		this.instances[makeId('kb')] = instance;
	}
}


class StatementCollection {
	constructor() {
		this.instances = {};
	}
	
	add = function(instance) {
		this.instances[makeId('statement')] = instance;
	}
	
	display = function() {
		var statements = this.instances;
		for (var statementId in statements) {
			var statement = statements[statementId];
			console.log(statementId,statement.formal,statement.json);
		}
	}
}


class SourceCollection {
	constructor() {
		this.instances = {};
	}
	
	add = function(instance) {
		this.instances[makeId('source')] = instance;
	}
}
