// This is essentially a clone of ObjectHierarchy.  Inn pre-Class webAKT
// I just used a single set of functions for reasoning with both hierarchies.
// I separate them out now to allow for possible divergences creeping in 
// between the two types of hierarchy, to map more closely onto the 
// organisation of the source KB files (the subobjects and subtopics 
// categories, and to avoid having extra, generic, code for handling hierarchies.

class TopicHierarchy {
    /**
     * Create a hierarchy.
     * @param {object} spec - an object-literal containing initialising data.
     */
    constructor(spec) {
        this._id = spec.id;
        if (spec.from_file){
        }
        var tree = this.makeTree(this._id);
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


// I had generalised this code to work for object hierarchies ('subobject' 
// in the original AKT5 KB), or topic hierarchies ('subtopic').
// However, now that we have separate classes (ObjectHierarchy and TopicHierarchy),
// I have reverted to separate code for each one.   This also makes the code a 
// bit more readable.
    makeTree = function (hierarchyId) {
        var treeDown = {};
        var treeUp = {};
        var links = AKT.kbs['atwima'].subtopics;
        for (var i=0; i<links.length; i++) {
            var link = links[i];
            if (link.hierarchy === hierarchyId && link.topic !== 'top') {
                if (!treeDown[link.topic]) {
                    treeDown[link.topic] = [];
                }
                treeDown[link.topic].push(link.subtopic);
                treeUp[link.subtopic] = link.topic;
            }
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
