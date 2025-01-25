/** Class representing a statement. 
* @constructor
*/
class Kb {
    /**
     * Create a knowledge base class.
     * @param {object} spec - an object-literal containing initialising data.
     */
    constructor(spec) {
        this._name = spec.name;
        this._formalTerms = {};
        this._objectHierarchies = {};
        this._sources = {};
        this._statements = {};
        this._topics = {};
        this._topicHierarchies = {};
        this._counters = {
            statement:0
        };
        if (spec.kb_from_file) {
            this.loadKbFromFile(spec.kb_from_file);
        }
        console.debug(this);

    }


    get objects() {
        if (this._objects) {
            return this._objects;
        } else {
            return null;
        }
    }


    get formalTerms() {
        if (this._formalTerms) {
            return this._formalTerms;
        } else {
            return null;
        }
    }


    get sources() {
        if (this.sources) {
            return this._sources;
        } else {
            return null;
        }
    }


    get statements() {
        if (this._statements) {
            return this._statements;
        } else {
            return null;
        }
    }


    get topics() {
        if (this._topics) {
            return this._topics;
        } else {
            return null;
        }
    }


    // ===========================================================
    // Add one instance of the appropriate class

    addFormalTerm = function(id,json) {
        this._formal_term[id] = json;
    }


    addSource = function(id,json) {
        this._sources[id] = json;
    }


    addStatement = function(statement) {
        if (statement) {
            const i = this._counters.statement+1;
            const id = 's'+i;
            this._statements[id] = statement;
            this._counters.statement += 1;
        }
    }


    addTopic = function(id,json) {
        this._topics[id] = json;
    }


    // ================================================ METHODS

    // ------------------------------------------------ FORMAL TERMS
    findFormalTerms = function (term_type, use) {

        let formalTerms = this._formalTerms;
        var result1 = [];
        var result2 = [];

        // First, select formal terms of the required type (or 'all')
        if (term_type === 'all') {
            for (var i=0; i<formalTerms.length; i++) {
                result1.push(formalTerms[i].term);
            }
        } else {
            for (var i=0; i<formalTerms.length; i++) {
                if (formalTerms[i].type === term_type) {
                   result1.push(formalTerms[i].term);
                }
            }
        }

        // Now, select those that have the required 'use'
        if (use === 'all') {
            var result2 = result1;

        } else if (use === 'Object Hierarchies') {
            result2 = [];
            for (var i=0; i<result1.length; i++) {
                for (var j=0; j<kb.subobjects.length; j++) {
                    if (result1[i] === kb.subobjects[j][1] || result1[i] === kb.subobjects[j][2]) {
                        result2.push(result1[i]);
                        break;
                    }
                }
            }

        } else if (use === 'Formal Statements') {
            for (var i=0; i<result1.length; i++) {
                for (var j=0; j<kb.sentences.length; j++) {
                    var nestedList = kb.sentences[j].nested_list;
                    if (nestedList[0] === 'if') {   // It's a conditional sentence
                        // [1] is the statement part of the sentence
                        if (nestedList[1].flat(99).includes(result1[i])) {
                            result2.push(result1[i]);
                            break;
                        }
                    } else {   // It's not a conditional sentence
                        if (nestedList.flat(99).includes(result1[i])) {
                            result2.push(result1[i]);
                            break;
                        }
                    }
                }
            }


        } else if (use === 'Formal Conditions') {
            for (var i=0; i<result1.length; i++) {
                for (var j=0; j<kb.sentences.length; j++) {
                    var nestedList = kb.sentences[j].nested_list;
                    if (nestedList[0] === 'if') {   // It's a conditional sentence
                        // [2] is the conditional part of the sentence.
                        if (nestedList[2].flat(99).includes(result1[i])) {
                            result2.push(result1[i]);
                            break;
                        }
                    }
                }
            }
        }

        return result2;
    }


    // --------------------------------------------------------------- STATEMENTS
    findFormalTermById = function(id) {
        if (id) {
            return this._statements[id];
        } else {
            return null;
        }
    }


    findSourceById = function(id) {
        if (id) {
            return this._statements[id];
        } else {
            return null;
        }
    }


    findStatementById = function(id) {
        if (id) {
            return this._statements[id];
        } else {
            return null;
        }
    }


    findTopicById = function(id) {
        if (id) {
            return this._statements[id];
        } else {
            return null;
        }
    }

    // Hierarchies
    // The returned array holds the NAMES of the actual hierarchies, not
    // the hierachy itself.
    // This should reference Kb.hierarchies ...
    findObjectHierarchies = function (links) {
        console.debug(links);
        var hierarchies = {};
        var hierarchyIds = [];  // Currently an array with 2 elements (treedown,treeup).  Maybe change to
                               // an object, {treedown:[],treeup:{[] ?  More explicit.
        for (var i=0; i<links.length; i++) {
            var link = links[i];
            console.debug(link);
            if (link.item === "top") {
                hierarchyIds.push(link.hierarchy);
            }
        }

        console.debug('\n\n\n=======================\nOH ',hierarchyIds);
        for (var j=0; j<hierarchyIds.length; j++) {
            var hierarchy = new ObjectHierarchy({id:hierarchyIds[i]});
            hierarchies[hierarchyIds[i]] = hierarchy;
            console.debug('OH ',hierarchy);
        }
        return hierarchies;
    }


    findTopicHierarchies = function (links) {
        var hierarchies = {};
        var hierarchyIds = [];  // Currently an array with 2 elements (treedown,treeup).  Maybe change to
                               // an object, {treedown:[],treeup:{[] ?  More explicit.
        for (var i=0; i<links.length; i++) {
            var link = links[i];
            if (link.topic === "top") {
                hierarchyIds.push(link.hierarchy);
            }
        }

        console.debug('\n\n\n=============================\nTH ',hierarchyIds);
        for (var i=0; i<hierarchyIds.length; i++) {
            var hierarchy = new ObjectHierarchy({id:hierarchyIds[i]});
            hierarchies[hierarchyIds[i]] = hierarchy;
            console.debug('TH ',hierarchyIds[i],hierarchy);
        }
        return hierarchies;
    }



    loadKbFromFile = function (kb) {

        // formalTerms
        for (var i=0; i<kb.formal_terms.length; i++) {
            var id = kb.formal_terms[i].id;
            var formalTerm = new FormalTerm({id:id,from_file:kb.formal_terms[i]});
            this._formalTerms[id] = formalTerm;
        }

        // object hierarchies
        this._objectHierarchies = this.findObjectHierarchies(kb.subobjects);

        // sources
        for (var i=0; i<kb.sources.length; i++) {
            var id = kb.sources[i].id;
            var source = new Source({id:id,from_file:kb.sources[i]});
            this._sources[id] = source;
        }

        // statements
        for (var i=0; i<kb.sentences.length; i++) {
            var id = kb.sentences[i].id;
            var statement = new Statement({id:id,from_file:kb.sentences[i]});
            this._statements[id] = statement;
        }

        // topics
        for (var i=0; i<kb.topics.length; i++) {
            var id = kb.topics[i].id;
            var topic = new Topic({id:id,from_file:kb.topics[i]});
            this._topics[id] = topic;
        }

        // topic hierarchies
        this._topicHierarchies = this.findTopicHierarchies(kb.subtopics);

        // Each link is a 3-element array;  [HierarchyName,Item,SubItem]
        // dimension is one of subtopics or subobjects, being the key for the
        // corresonding sections of a kb.

        // 'dimension' is either 'subtopics' or 'subobjects'
        // The returned array holds the NAMES of the actual hierarchies, not
        // the hierachy itself.

        // Currently, builds hierarchy just for objects.  Need to
        // consider whether Hierarchy class is generic, or separate
        // ones for obects and topics.
/*
        console.debug(this);
        console.debug(this._hierarchies);
        for (var i=0; i<kb.subobjects.length; i++) {
            var link = kb.subobjects[i];
            if (link.object === "top") {
                console.debug(this);
                this._hierarchies[link.hierarchy] = [];
            }
        }  
*/     
    }


}

