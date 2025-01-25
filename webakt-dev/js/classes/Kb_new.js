/** Class representing a knowledge base. 
* @constructor
*/
class Kb_new {
    /**
     * Create a knowledge base class.
     * @param {object} spec - an object-literal containing initialising data.
     */
    constructor(spec) {
        this._id = spec.name;

        this._statements = new SetOfStatements(spec.kb_from_file.sentences);

    }

}

