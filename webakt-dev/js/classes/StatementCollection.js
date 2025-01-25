class statementCollection {

    constructor () {
        this._instances = {};
    }

    add = function (id, statement) {
        this._instances[id] = statement;
    }

    count = function () {
        var statements = this._instances;
        var n = 0;
        for (var id in statements) {
            n += 1;
        }
        return n;
    }

}
