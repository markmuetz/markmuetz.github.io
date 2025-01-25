class FormalTerm {

    constructor(spec) {
        this._id = spec.id;
        if (spec.from_file){
            var s = spec.from_file;
            this._formal = s.formal;
        }
    }


}
