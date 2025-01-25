// Please note: This is an exercise on reproducing an AKT5 System Tool in JavaScript, 
// using code which is as close as possible (function names, variable names...) to
// the Tool's original Task Language.
// To make this as clear as possible, each webAKT function introduced is in the AKT5
// namespace.
// Sometimes this involves design choices which to my mind are not optimal.  For example,
// I retain AKT5's rather over-worked list/n macros.
// One reason for doing this is to make my life simpler: once I have implemented the
// core functions, I should be able to easily translate a variety of Tools.
// Another reason is to demonstrate the readability of the original Task Language is 
// retained in the JavaScript, because of the almost one-to-one correspondence between
// them, with only minor syntactic changes.
//
// The main changes are:
// * % for comment is repaced by //
// * the last argument for most predicates is the return value, so this is replaced
//   by a simple assignment to a function call, e.g.
//      list(select,All_terms,'Choose an item',Species);
//   becomes
//       var Species = AKT5.list(select,All_terms,'Choose an item');


var AKT5 = {};


AKT5.formal_termxxx = function (kbId,Term) {
    var formalTerms = AKT.KBs[kbId]._formal_terms;
    for (var i=0; i<formalTerms.length; i++) {
        if (formalTerms[i].term === Term) {
            return formalTerms[i];
        }
    }
    return null;
};


AKT5.formal_term = function (kbId, termId, mode) {
    if (mode) {
        switch(mode) {
            case 'hierarchies':
                var Hierarchies = AKT5.hierarchy(kbId,termId);
                return Hierarchies;
            case 'synonyms':
                var formal_terms = kbId.formal_terms;
                for (var i=0; i<formal_terms.length; i++) {
                    if (formal_terms[i].term === Term) {
                        var result = formal_terms[i].synonyms;
                        return result;
                    }
                }
                var result = [];
                return result;
        }   
    } else {
/*
        var formalTerms = AKT.kbs[Kb].formal_terms;
        for (var i=0; i<formalTerms.length; i++) {
            if (formalTerms[i].term === Term) {
                return formalTerms[i];
            }
        }
        return null;
*/
        if (AKT.KBs[kbId]._formalTerms[termId]) {
            return AKT.KBs[kbId]._formalTerms[termId];
        } else {
            return null;
        }
    }
};
     

// See https://exploringjs.com/impatient-js/ch_sets.html#missing-set-operations for Set operations
AKT5.formal_terms = function (Kb,x) {
    var blackListSet = new Set(['action','and','att_value','causes1way','causes2way','change',
        'comparison','decrease','different_from','greater_than','if','increase',
        'less_than','link','no_change','not','or','process','range','same_as']);
    var statements = AKT.KBs[Kb]._statements;
    var formal_terms2 = [];
    $.each(statements, function(i,statement) {
        try {
            var flattened = statement.json.flat(10);  //Flatten each nested_list.
            var set = new Set(flattened);   // Create a set from the array, to remove duplicates.
            var cleanSet = new Set([...set].filter(x => !blackListSet.has(x)));
            var formal_terms1 = [...cleanSet];   // "spread" is to make the set into an array
            statement['formal_terms'] = formal_terms1.sort();  // Remember the set of formal_terms for each sentence
            formal_terms2.push(formal_terms1);  //Build the array of formal terms for all sentences....
        }
            catch(err) {
        }
    });
    set = new Set(formal_terms2.flat(1));
    var formal_terms = [...set].sort();
    return formal_terms;
};



AKT5.knowledge_base = function (option) {
    if (option === 'select') {
        var kbs = [];
        //$.each(AKT.kbs, function(kbId,kb) {
        //    kbs.push(kbId);
        //});
        for (var kbId in AKT.kbs) {
            kbs.push(kbId);
        }
        if (kbs.length === 0) {
            return null;
        } else if (kbs.length === 1) {
            return kbs[0];
        } else {
            $('#list_select').css({display:"block"});
            return 'hello';
        }
    }
};


AKT5.list_not_empty = function (list) {

    if (Array.isArray(list)) {
        if (list.length > 0) {
            return true;
        } else {
            return false;
        }

    } else {
        if (Object.keys(list).length > 0) {
            return true;
        } else {
            return false;
        }
    }
};


AKT5.list_select = function (ItemArray, Message) {
    return 'tree';
};



AKT5.show = function(A,B) {
    if (!AKT.showText) {
        AKT.showText = '';
    }
    if (A === 'nl') {
        AKT.showText += '<br/>';
    } else if (A === 'tab') {
        // AKT.showText += '- - -';
    } else {
        if (typeof A === "object") {  // Extreme hackiness
            if (Array.isArray(A)) {
                for (var i=0; i<A.length; i++) {
                    var x = A[i];
                    AKT.showText += '- '+x+'<br/>';
                }
            } else {
                for (var x in A) {
                    AKT.showText += '- '+x+'<br/>';
                }
            }
        } else {
            AKT.showText += A;
        }
    }
    return;
};


AKT5.statements_of_type = function (KbId, Type) {
    var kb = AKT.KBs[KbId];
    var Statements = {};
    var statements = kb._statements;
    for (var id in statements) {
        var statement = statements[id];
        if (statement.passFilters1({type:Type})) {
            Statements[id] = statement;
        }
    }
    return Statements;
};


AKT5.statements_search = function (Kb,Species,XXX,Object,Statements) {
    var Found = [];
/*
    for (var i=0; i<Statements.length; i++) {
        if (Statements[i]._english.includes(Species)) {
            Found.push(Statements[i].id + ": " + Statements[i].english);
        }
    }
*/
    $.each(Statements, function(id,statement) {
        if (statement._english.includes(Species)) {
            Found.push(id + ": " + statement._english);
        }
    });
    return Found;
};


/*
//----------- hierarchy/3 -----------------

// Obtain a list of object hierarchies that contain the specified object 
hierarchy(Kb,Object,Hierarchies)  :-
	objectHierarchyList(Kb,ObjectHierarchies),                % Defined in next rule.
	findall( Hierarchy, ( member(Hierarchy,ObjectHierarchies),
			      hierarchyObjects(Kb,Hierarchy,Objects),     % Defined in next-but-one rule.
			      member(Object,Objects)
                            ),H_s ),
	sort(H_s,Hierarchies).

//----------- objectHierarchyList/2 -----------------

// find a list of all the object hierarchies in the Kb 
objectHierarchyList(Kb,Hierarchies)  :-
	findall(Hierarchy,subobject(Kb,Hierarchy,top,Hierarchy),UnsortedHierarchies),  % Fact in .kb file
	sort(UnsortedHierarchies,Hierarchies).

//----------- hierarchyObjects/3 -----------------

// find all valid objects in a hierarchy 
hierarchyObjects(Kb,Hierarchy,Objects) :-
	findall(Object, ( subobject(Kb,Hierarchy,_,Object),       % Fact in .kb file.
			  clause(formal_term(Kb,Object,object,_,_),true)  % Check what this is doing.
			), Objs),
	sort(Objs,Objects).
*/

AKT5.hierarchy = function(Kb,Object) {
    var ObjectHierarchies = AKT5.objectHierarchyList(Kb);
    var H_s = {};
    for (Hierarchy in ObjectHierarchies) {
        var Objects = AKT5.hierarchyObjects(Kb,Hierarchy);
        if (Objects[Object]) {
            H_s[Hierarchy] = true;
        }
    }
    //var Hierarchies = H_s.sort();
    var Hierarchies = H_s;
    return Hierarchies;
};


AKT5.objectHierarchyList = function (Kb) {
    var Hierarchies = {};
    var subobjects = AKT.kbs[Kb].subobjects;
    for (var i=0; i<subobjects.length; i++) {
        var subobject = subobjects[i];
        if (subobject.object = 'top') {
            //Hierarchies.push(subobject.category);
            Hierarchies[subobject.category] = true;
        }
    }
    return Hierarchies;
};


AKT5.hierarchyObjects = function (Kb, Hierarchy) {
    var Objs = {};
    var subobjects = AKT.kbs[Kb].subobjects;
    for (var i=0; i<subobjects.length; i++) {
        var subobject = subobjects[i];
        if (subobject.category === Hierarchy) {
            Objs[subobject.subobject] = true;
        }
    }
    //var Objects = Objs.sort();
    return Objs;
};



AKT5.derived_statements = function (KbId, HierarchyId, SpeciesId) {
    var kb = AKT.KBs[KbId];
    var hierarchy = kb._objectHierarchies[HierarchyId];
    var ancestor = hierarchy._tree_up[SpeciesId];
    var StatementsObject = AKT5.statements_of_type(KbId,'causal');
    var FoundEnglishArray = AKT5.statements_search(KbId,SpeciesId,null,'object',StatementsObject);
    return FoundEnglishArray;
};


// ===================================== AKT5.getHierarchiesForObject


AKT5.getHierarchiesForObject = function (kbId,objectId) {
    var kb = AKT.KBs[kbId];
    var object = kb._formalTerms[objectId];

    var hierarchies = object.findHierarchies();

    var hierarchyIdArray = [];
    for (var i=0; i<hierarchies.length; i++) {
        var hierarchy = hierarchies[i];
        hierarchyIdArray.push(hierarchy._id);
    }
    return hierarchyIdArray;
/*    
    var links = AKT.KBs[kb]._subobjects;
    var hierarchiesList = {};
    $.each(links, function(i,link) {
        if (link.subitem === object) {
            hierarchiesList[link.hierarchy] = true;
        }
    });
    var hierarchies = [];
    for (var hierarchy in hierarchiesList) {
        hierarchies.push(hierarchy);
    }
    return hierarchies;
*/
};




// ================================== AKT5 utilities

AKT5.member = function (array,x) {
    for (var i=0;i<array.length; i++) {
        if (array[i] === x) {
            return true;
        }
    }
    return false;
};


// I do not like the over-loading of the list/n predicate in AKT5, but have retained it
// in the form of its JavaScript analogue for demonstration purposes.
AKT5.list = function (mode,arg1,arg2,arg3) {

    switch(mode) {
        case 'length':
            return AKT5.list_length(arg1);
            break;
        case 'concatenate':
            return AKT5.list_concatenate(arg1);
            break;
    }
};


AKT5.list_length = function (List) {
    if (Array.isArray(List)) {
        return List.length;
    } else {
        return Object.keys(List).length;
    }
};


AKT5.list_concatenate = function (stringArray) {

    var result = [];
    for (var i=0; i<stringArray.length; i++) {
        result += stringArray[i];
    }
    return result;
};
