class Termx {
    constructor(spec) {     
	
	    this._id = this.makeId();
	    this._type = null;
        this._description = '';
        this._images = [];
        this._terms = [spec.term_id];  // spec.term = {id:id,language:language} or {id:language}?

        return this;
    }

    addTerm = function (termId) {
        this._terms.push(termId);
    }

    makeId = function () {  
        if (!AKT.state.termxCounter) {
            AKT.state.termxCounter = 0;
        }
        AKT.state.termxCounter += 1;
        return 'termx'+AKT.state.termxCounter;
    }

}
