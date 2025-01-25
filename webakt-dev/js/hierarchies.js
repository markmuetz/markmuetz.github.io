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
// The returned array holds the NAMES of the actual hierarchies, not
// the hierachy itself.
AKT.getHierarchies = function (kb,dimension) {
    var links = AKT.kbs[kb][dimension];
    console.debug('\n',links);
    var hierarchies = [];
    $.each(links, function(i,link) {
        if (link['topic'] === "top") {
            hierarchies.push(link['hierarchy']);
        }
    });
    console.debug('\n',hierarchies);
    return hierarchies;
};


AKT.getHierarchiesForObject = function (kb,object) {
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


AKT.makeTree = function (kbId, treeType) {
    var treeDown = {};
    var treeUp = {};
    var links = AKT.kbs[kbId][treeType];
    for (var i=0; i<links.length; i++) {
        var link = links[i];
        if (!treeDown[link.item]) {
            treeDown[link.item] = [];
        }
        treeDown[link.item].push(link.subitem);
        treeUp[link.subitem] = link.item;
    }
    return [treeDown,treeUp];
};


AKT.getChildren = function (tree, node) {
    var treeDown = tree[0]
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


AKT.getAllDescendants = function (tree, node) {
    var treeDown = tree[0]
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
};


AKT.getAllAncestors = function (tree, node) {
    var treeUp = tree[1];
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
};


