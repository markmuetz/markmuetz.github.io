
class StatementCollection {
	constructor(fromFileStatements) {
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



class Statement {
	constructor(spec) {
		this.formal = spec.formal;
		this.makeJson();
	}
	
	makeJson = function () {
		this.json = 'JSON:'+this.formal;
	}
}
