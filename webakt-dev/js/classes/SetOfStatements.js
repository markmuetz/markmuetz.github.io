/** Class representing a set of statements. 
* @constructor
*/
class SetOfStatements {
    /**
     * Create a set-of-statements class.
     * @param {object} specStatements - an object-literal containing initialising data.
     */
    constructor(specStatements) {
        this._statements = loadStatementsFromFile(spec.kb_from_file.sentences);

    }


    loadStatementsFromFile(statementsFromFile) {
        var statements = {};
        if (Array.isArray(statementsFromFile)) {
            for (var i=0; i<statementsFromFile.length; i++) {
                var id = 's'+statementsFromFile[i].id;
                var statement = new Statement({id:id, from_file:statementsFromFile[i]});
                statements[id] = statement;
            }
        } else {
            for (var id in statementsFromFile) {
                var statement = new Statement({id:id, from_file:statementsFromFile[id]});
                statements[id] = statement;
            }
        }
        return statements;
    }
}

