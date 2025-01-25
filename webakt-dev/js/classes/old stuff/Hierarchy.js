class Hierarchy {
    /**
     * Create a hierarchy.
     * @param {object} spec - an object-literal containing initialising data.
     */
    constructor(spec) {
        this._id = spec.id;
        if (spec.from_file){
        }
        var tree = this.makeTree('subobjects');
        console.debug('tree_down: ',tree[0]);
        console.debug('tree_up: ',tree[1]);
        this._tree_down = tree[0];
        this._tree_up = tree[1];
    }


// In AKT5, there are two types of hierarchy:
// - Topic hierarchies, represented by the KB properyy 'subtopics', and
// - Object herarchies, represented by the KB property 'subobjects'
// Note that AKT5 talks about topic HIERARCHIES, not hierarchy; dtto objects.
// The names for the individual topic or object  herarachies are given by the user.
// To avoid (or add to) the confusio, I use the term 'tree' to refer to the
// structre which captures all the hierarchoes of one type (topic or object),
// since that's actually what it is.  (Even in the KB, there is the notion of
// 'top', i.e. node from which the hierarches of each type emenate.



// ========================================================== HIERARCHIES
// Each link is a 3-element array;  [HierarchyName,Item,SubItem]
// dimension is one of subtopics or subobjects, being the key for the
// corresonding sections of a kb.

// 'dimension' is either 'subtopics' or 'subobjects'



    makeTree = function (treeType) {
        var treeDown = {};
        var treeUp = {};
        var item = 'object';
        var subitem = 'subobject';
        var links = AKT.kbs['atwima'][treeType];
        for (var i=0; i<links.length; i++) {
            var link = links[i];
            if (!treeDown[link[item]]) {
                treeDown[link[item]] = [];
            }
            treeDown[link[item]].push(link[subitem]);
            treeUp[link[subitem]] = link[item];
        }
        return [treeDown,treeUp];
    }


    findChildren = function (node) {
        var treeDown = this._tree_down;
        var children = treeDown[node];
    /*
        var children = treeDown[node];
        if (children) {
            for (var i=0; i<children.length; i++) {
                descendants.push(children[i]);
                getAll(treeDown, children[i], descendants);
            }
        }
    */
        return children;
};


    getAllDescendants = function (node) {
        var treeDown = this._tree_down;
        var descendants = getAll(treeDown, node, []);
        return descendants;

        function getAll(treeDown, node, descendants) {
            var children = treeDown[node];
            if (children) {
                for (var i=0; i<children.length; i++) {
                    descendants.push(children[i]);
                    getAll(treeDown, children[i], descendants);
                }
            }
            return descendants;
        }
    }


    getAllAncestors = function (node) {
        var treeUp = this._tree_up;
        var ancestors = getAll(treeUp, node, []);
        return ancestors;

        function getAll(treeUp, node, ancestors) {
            var parent = treeUp[node];
            if (parent && parent !== 'top') {
                ancestors.push(parent);
                getAll(treeUp, parent, ancestors);
            }
            return ancestors;
        }
    }

}
