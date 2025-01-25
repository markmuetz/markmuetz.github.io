class Objectakt {

    constructor(spec) {
        this._id = spec.id;
        if (spec.from_file){
            var s = spec.from_file;
            this._object = s.object;
        }
    }

    findHierarchies = function () {
        var links = AKT.kbs[kb].subobjects;
        var hierarchiesList = {};
        $.each(links, function(i,link) {
            if (link[2] === object) {
                hierarchiesList[link[0]] = true;
            }
        });
        var hierarchies = [];
        for (var hierarchy in hierarchiesList) {
            hierarchies.push(hierarchy);
        }
        return hierarchies;
    };

}
