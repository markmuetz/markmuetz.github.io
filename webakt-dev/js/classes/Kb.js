/** Class representing a knowledge base. 
* @constructor
*/

// Sample entries for images
//this._images.nyanya0001 = new Image({id:'nyanya0001',url:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR33JS988Kp1SL184AFRpm1uVCV7p2s4d1zew&usqp=CAU',description:'Picture of nyanya'});
//this._images.nyanya0002 = new Image({id:'nyanya0002',url:'http://www.africa.com',description:'Another picture of nyanya'});
//this._images.nyanya0003 = new Image({id:'nyanya0003',url:'http://www.africa.com',description:'Yet another picture of nyanya'});

class Kb {
    /**
     * Create a knowledge base class.
     * @param {object} spec - an object-literal containing initialising data.
     */
    constructor(spec) {     

        console.log('\n*** Class KB: constructor: spec:',spec);	
        this.from_local_storage = spec.from_local_storage;

		// Create properties for all collections.
		this._diagrams = {};
		this._formalTerms = {};
		this._images = {};
		this._metadata = {};
		this._objectHierarchies = {};
		this._sources = {};
		this._source_user_labels = {};
		this._statements = {};
		this._topics = {};
		this._topicHierarchies = {};
        this._keys = {};   // Synonym keys

		this.diagrams = {};
		this.formalTerms = {};
		this.images = {};
		this.objectHierarchies = {};
		this.sources = {};
		this.source_user_labels = {};
		this.statements = {};
		this.topics = {};
		this.topicHierarchies = {};
        this.keys = {};
		
        this._id = spec.name;

        this._cache = {};

        this._counters = {
            statement:0
        };
        if (spec.kb_from_file) {
            this._kb_from_file = spec.kb_from_file;
			this.loadKbFromFile(spec.kb_from_file);

        } else {
            this._counters = {};
			this._history = {};
            this._images = {};
            this._metadata = {};
            this._source_user_labels = [];    // TODO: This obviously should
                // be an empty array, unitl I provide a dialog to allow user to provide them for
                // a new KB.
        }
		
		if (!this._history) {
			this._history = {};
		}
		var date = new Date().toUTCString();
		this._history[date] = date;
		
        return this;

    }


			

/*
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
        if (this._sources) {
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
*/
    // ===========================================================
    // Add one instance of the appropriate class

    addFormalTerm = function(id,json) {
        this._formal_term[id] = json;
    }




    addSource = function(source) {
        if (source) {
            this._sources[source.id] = source;
        }
    }


    addStatement = function(statement) {
        if (statement) {
            this._statements[statement._id] = statement;
            AKT.trigger('new_statement_created_event',{statement:statement});
        }
    }


    addTopic = function(id,json) {
        this._topics[id] = json;
    }

	// skipBackup:Boolean argument suppresses writing KB to localStorage
	// if true.
	// If missing, it's false, which means that whole KB file *is* written
	// to localStorage.
	// Non-intuitive name is used to allow it being omitted to cause backup.
	add = function(id,object,skipBackup) {
		var lookupCollectionNameFromClassName = {
			FormalTerm:'formalTerms',
			Image:'images',
			ObjectHierarchy:'objectHierarchies',
			Source:'sources',
			Statement:'statements',
			Topic:'topics',
			TopicHierarchy:'topicHierarchies'
		};
		var className = object.constructor.name;  // This is how you get the class
													    // name for any object.
		var collectionName = lookupCollectionNameFromClassName[className];
		//if (!this[collectionName]) this[collectionName] = {};
		this[collectionName][id] = object;
		
		if (!skipBackup) {
			this.saveKbInLocalStorage();
		}
	}

    // ================================================ METHODS

    // GET ITEMS FROM A COLLECTION, FILTERED


    getCollection = function (collectionTypeId,filters) {

        // See js/collection_specs.js to see the function that's used to get all the items
        // for the named collection.   
        var collection = AKT.collection_specs[collectionTypeId];
        var theGetFunction = collection.name_for_kb_get_function;
        var items = this[theGetFunction](filters);

        return items;
    }


    // For legacy reasons, to stop old code breaking.
    findFormalTerms = function (filters) {
        return this.getFormalTerms(filters);
    }
    findStatements = function (filters) {
        return this.getStatements(filters);
    }
    findSources = function (filters) {
        return this.getSources(filters);
    }
    findObjectHierarchiesTerms = function (filters) {
        return this.getObjectHierarchiesTerms(filters);
    }
    findTopicHierarchies = function (filters) {
        return this.getTopicHierarchies(filters);
    }
    findTopics = function (filters) {
        return this.getTopics(filters);
    }
    findImages = function (filters) {
        return this.getImages(filters);
    }
    // End of section to handle legacy function calls.


    getDiagrams = function () {
        if (this._diagrams) {
            return this._diagrams;
        } else {
            return {};
        }
    }


    getDiagramNodes = function () {
        if (this._diagram_nodes) {
            return this._diagram_nodes;
        } else {
            return {};   // Need to create them here from formal terms
                         // (or causal statements?)
        }
    }


    getArcs = function () {
        if (this._diagram_arcs) {
            return this._diagram_arcs;
        } else {
            return {};   // Need to create them from causal statements
        }
    }


    getDiagrams = function () {
        if (this._diagrams) {
            return this._diagrams;
        } else {
            return {};
        }
    }


    getFormalTerms = function (filters) {
        console.log('\n####################################################')
        console.log('Kb.findFormalterms(filters)');
        console.log(filters);
        console.log('>>>\nfindFormalterms',filters,'\n',this._formalTerms);

        var okFormalterms= {};
/*
        if (filters.filters && typeof filters.filters === 'object') {
            for (var formaltermId in this._formalTerms) {
                var formalterm = this._formalTerms[formaltermId];
		        try {
                    if (formalterm.passFilters1(filters.filters)) {
                        okFormalterms[formaltermId] = formalterm;
                    } 
                }
                catch(error) {
			        console.log('ERROR: Invalid formal term, failed in FormalTerm.passFilters1()\n',formalterm);
                }
            }
        }
*/
        if (filters && typeof filters === 'object') {
            for (var formaltermId in this._formalTerms) {
                var formalterm = this._formalTerms[formaltermId];
		        try {
                    if (formalterm.passFilters1(filters)) {
                        okFormalterms[formaltermId] = formalterm;
                    } 
                }
                catch(error) {
			        console.log('ERROR: Invalid formal term, failed in FormalTerm.passFilters1()\n',formalterm);
                }
            }
        }
        return okFormalterms;
    }


    extractFormalTerms = function () {
        var allFormalTerms = {};
        for (var statementId in this._statements) {
            var statement = this._statements[statementId];
            var terms = statement.classifyFormalTerms();
            for (var termId in terms) {
                allFormalTerms[termId] = terms[termId];
            }
        }
        var count = [0,0,0,0];
        for (var id in allFormalTerms) {
            count[allFormalTerms[id].length] += 1;
        }
    }

    // Returns an ARRAY of the ID (key) of the words (formal terms) that satisfy the filters object.
    // E.g. filters = {term_type:'process'};
    findWords = function (filters) {   
        var words = [];
        for (var formalTermId in this._formalTerms) {
            var formalTerm = this._formalTerms[formalTermId];
            if (formalTerm.passFilters1(filters)) {
                words.push(formalTermId);
            }
        }
        return words;
    }


    getStatements = function (filters) {
        var okStatements = {};
        //console.log('>>>\n',filters,'\n',this._statements);
        //console.log(8607,filters);
        if (typeof filters === 'object') {
            //console.log(8608);
            for (var statementId in this._statements) {
                var statement = this._statements[statementId];
		        try {
                    if (statement.passFilters1(filters)) {
                        //console.log(statementId);
                        okStatements[statementId] = statement;
                    }
                }
                catch(error) {
			        //console.log('ERROR: Invalid statement, failed in Statement.passFilters()\n',statement);
                }
            }

        // See email to the AKT group dated 12th July 2022 on "extended boolean search"
        } else {  // filters is a string, being the pure JavaScript for the extended Boolean search
            var searchExpression = filters;
            for (var statementId in this._statements) {
                var statement = this._statements[statementId];
                console.log(8011,statementId,statement);
                //if (statement.extendedBooleanSearch(searchExpression)) {
                if (statement.includedInSearchExpressionJs(searchExpression)) {
                    okStatements[statementId] = statement;
                }
            }

        }
        return okStatements;
    }


    getObjectHierarchies = function () {
        return this._objectHierarchies;
    }


    getSources = function (filter) {   // 'options' allows for selectors, like GoJS 
                                            // for Nodes in Diagram
        if (!filter) {
            return this._sources;
        } else {
            return this._sources;
        }
    }


    getTopicHierarchies = function () {
        return this._topicHierarchies;
    }


    getTopics = function () {
        return this._topics;
    }

    getImages() {
        return this._images;
    }





    findFormalTermById = function(id) {
        if (id) {
            return this._formalTerms[id];
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
            return this._topics[id];
        } else {
            return null;
        }
    }

    // This is orphan code, but left in in case it's useful...
/*
    findHierarchies = function (type, links) {
        var hierarchies = {};
        var hierarchyIds = []; 

        if (Array.isArray(links)) {
            for (var i=0; i<links.length; i++) {
                var link = links[i];
                if (link.item === "top") {
                    hierarchyIds.push(link.hierarchy);
                }
            }
        } else {
            for (var id in links) {
                var link = links[id];
                if (link.item === "top") {
                    hierarchyIds.push(link.hierarchy);
                }
            }
        }

        for (var i=0; i<hierarchyIds.length; i++) {
            if (type === 'object') {
                var hierarchy = new ObjectHierarchy({id:hierarchyIds[i]});
            } else if (type === 'topic') {
                hierarchy = new TopicHierarchy({id:hierarchyIds[i]});
            } else {
                hierarchy = null;
            }
            hierarchies[hierarchyIds[i]] = hierarchy;
        }
        return hierarchies;
    }
*/


    countStatements = function () {
        var count = {
            att_value_unconditional:0,att_value_conditional:0,
            causes_unconditional:0,causes_conditional:0,
            comparison_unconditional:0,comparison_conditional:0};


        for (var statementId in this._statements) {
            var statement = this._statements[statementId];
/*
            if (statement.passFilters1({causal:false,comparison:false,conditional:false})) {
                count.att_value_unconditional += 1;
            } else if (statement.passFilters1({causal:false,comparison:false,unconditional:false})) {
                count.att_value_conditional += 1;
            } else if (statement.passFilters1({att_value:false,comparison:false,conditional:false})) {
                count.causes_unconditional += 1;
            } else if (statement.passFilters1({att_value:false,comparison:false,unconditional:false})) {
                count.causes_conditional += 1;
            } else if (statement.passFilters1({att_value:false,causal:false,conditional:false})) {
                count.comparison_unconditional += 1;
            } else if (statement.passFilters1({att_value:false,causal:false,unconditional:false})) {
                count.comparison_conditional += 1;
            }
        }
*/
            if (statement.passFilters1({type:{att_value:true},conditional:{no:true}})) {
                count.att_value_unconditional += 1;
            } else if (statement.passFilters1({type:{att_value:true},conditional:{yes:true}})) {
                count.att_value_conditional += 1;
            } else if (statement.passFilters1({type:{causal:true},conditional:{no:true}})) {
                count.causes_unconditional += 1;
            } else if (statement.passFilters1({type:{causal:true},conditional:{yes:true}})) {
                count.causes_conditional += 1;
            } else if (statement.passFilters1({type:{comparison:true},conditional:{no:true}})) {
                count.comparison_unconditional += 1;
            } else if (statement.passFilters1({type:{comparison:true},conditional:{yes:true}})) {
                count.comparison_conditional += 1;
            }
        }

        count.att_value = count.att_value_unconditional + count.att_value_conditional;
        count.causes = count.causes_unconditional + count.causes_conditional;
        count.comparison = count.comparison_unconditional + count.comparison_conditional;
        count.unconditional = count.att_value_unconditional + count.causes_unconditional + count.comparison_unconditional;
        count.conditional = count.att_value_conditional + count.causes_conditional + count.comparison_conditional;

        count.n1 = Object.keys(this._statements).length;
        count.n2 = count.att_value+count.causes+count.comparison;
        count.n3 = count.unconditional+count.conditional;

        return count;
    }        

    findNodeNames = function () {
        var okNodeNames = {};
        for (var statementId in this._statements) {
            var statement = this._statements[statementId];
            if (statement._node_names) {
                var nodeNames = statement._node_names;
                okNodeNames[nodeNames.start_name] = {id:nodeNames.start_name};
                okNodeNames[nodeNames.end_name] = {id:nodeNames.end_name};
            }
        }
        return okNodeNames;
    }


    findTopics = function (filters) {
        var okTopics = {};
        for (var topicId in this._topics) {
            var topic = this._topics[topicId];
            if (topic.passFilters(filters)) {
                okTopics[topicId] = topic;  // The topic object, not its ID.
            }
        }
        return okTopics;
    }


    findFormalTermsxxx = function (filters) {
        var okFormalTerms = {};
        for (var formalTermId in this._formalTerms) {
            var formalTerm = this._formalTerms[formalTermId];
            if (formalTerm.passFilters(filters)) {
                okFormalTerms[formalTermId] = formalTerm;
            }
        }
        return okFormalTerms;
    }



    // This looks at the key for every instance of the specified list of objects,
    // and finds the largest integer part of that key.   So if the list of objects is
    // this._statements, the key has the form snnn, and the prefix part is 's',
    // it finds the largest value for the nnn part.
    // objects could be anything, but is here because it is here in Class Kb because ot
    // is probably some collection of entities for this KB.
    // Currently only statements employ this type of key.
    findLargestIndex = function (objects,prefix) {
        var maxIndex = 0;
        for (var key in objects) {
            var index = parseInt(key.replace(prefix,''));
            maxIndex = index > maxIndex ? index : maxIndex;
        }
        return maxIndex;
    }


    checkStatements = function () {
        var kbId = this._id;
        AKT.state.statement_check = {ok:0,fail:0};
        $.each(this._statements, function(id,statement) {
            var result = statement.checkFormal();
            AKT.state.statement_check[result.peg.result] += 1;
            if (result.peg.result === 'fail') {
                //console.log(JSON.stringify(result));
            }
        });
        console.log('\nCheck counts: ',JSON.stringify(AKT.state.statement_check),'\n');
    }

    
    // This is purely to generate a test .csv file, for demo purposes.
    // In practice, the idea is that a knowledge elicitatpr would create a spreadsheet
    // with two table - one for the sentences, and one for the sources, cross-
    // referenced using the source number.
    generateCsv = function () {

        // Build source lookup table
        // The idea is to give each source a simple number, this being easier to type
        // than it's actual ID.
        var lookup = {};
        var i = 0;
        $.each(this._sources, function (sourceId,source) {
            i += 1;
            lookup[source._id] = i;
            var string = i + ';' + source._id;
            //console.log(string);
        });
            

        $.each(this._statements, function(statementId,statement) {
            var sourceIndexes = '';
            $.each(statement._sources, function(sourceId,source) {
                if (sourceIndexes === '') {
                    sourceIndexes += lookup[source];
                } else {
                    sourceIndexes += ','+lookup[source];
                }
            });
            //console.log(statementId,';',statement._formal,';',sourceIndexes,';',statement._memo);
        });
    }

    
    buildKbFromCsv = function (statements,sources) {
        //console.log(statements,sources);

        // First, create the lookup of sourceId given source number.
        // Note that source number is a string for an integer, not a real integer.
        var sourceIdLookup= {};
        var csvSourcesArray = [];
        var csvSources = sources.split('\n');
        for (var i=0;i<csvSources.length; i++) {
            csvSourcesArray[i] = csvSources[i].split('#');
            var index = csvSourcesArray[i][0];
            var sourceId = csvSourcesArray[i][1];
            sourceIdLookup[index] = sourceId;
            this._sources[sourceId] = new Source({
                day: 1,
                extras: 'none',
                id: sourceId,
                interviewee: 'xxx',
                interviewer: 'yyy',
                location: 'zzz',
                memo: null,
                month: 2,
                name: 'Fred',
                sex: 'm',
                suffix: 'a',
                year: 2000
            });
        }
        console.log(sourceIdLookup);

        var csvStatements = statements.split('\n');
        for (var i=0;i<csvStatements.length; i++) {
            var sources = [];
            var s = csvStatements[i].split('#');
            if (s.length >= 4) {
                s[2] = s[2].split(',');
                for (var j=0; j<s[2].length; j++) {
                    var index = s[2][j];
                    var sourceId = sourceIdLookup[index];
                    sources.push(this._sources[sourceId]);
                    //sourceIds.push(sourceId);
                }
                this._statements[s[0]] = new Statement({id:s[0],formal:s[1],sources:sources});
            }
        }

        console.log(this);
    }



    // Note that this method MUST come before loadKbFromFile, since otherwise
    // you get a "function not found" error!
    makeHierarchies1 = function (type,links) {
        var hierarchyNames = []; 
        var rootIds = [];


        console.log(1001,type,links);
        if (Array.isArray(links)) {  // It's this one.
            for (var i=0; i<links.length; i++) {
                var link = links[i];
                if (link.item === "top") {
                    hierarchyNames.push(link.hierarchy.replace(/ /g,'_'));
                    rootIds.push(link.subitem.replace(/ /g,'_'));
                }
            }
        } else {
            for (var id in links) {
                var link = links[id];
                if (link.item === "top") {
                    hierarchyNames.push(link.hierarchy.replace(/ /g,'_'));
                    rootIds.push(link.subitem);
                }
            }
        }

        var hierarchies = {};
        for (var i=0; i<hierarchyNames.length; i++) {
            var hierarchyName = hierarchyNames[i];
            var hierarchy = new Hierarchy({kb:this,type:type,root:rootIds[i],name:hierarchyName,links:links});
            hierarchies[hierarchyName] = hierarchy;
			
        }

        return hierarchies;
    }



    makeHierarchies2 = function (hierarchiesFromFile) {
        var hierarchies = hierarchiesFromFile;
        return hierarchies;
    }


    makeUlTree = function (treeType) {
        const tree = this.makeTree(treeType);
        var treeDown = tree[0]
        var ul = $('<ul class="myUL"></ul>');
        getAll(ul, treeDown, 'top', 0);
        return ul;

        function getAll(ul, treeDown, node, level) {
            level += 1;
            var children = treeDown[node];
            for (var i=0; i<children.length; i++) {
                if (level === 1) {
                    var li = $('<li class="level'+level+'">'+children[i]+'</li>');
                } else {
                    li = $('<li class="level'+level+'">'+children[i]+'</li>');
                }
                $(ul).append(li);
                if (treeDown[children[i]]) {
                    var ul1 = $('<ul class="nested"></ul>');
                    $(li).append(ul1);
                    getAll(ul1, treeDown, children[i], level);
                }
            }
        }
    };


    filter = function(filter) {
        var temp = {};
        $.each(this._filteredStatements, function(id,statement) {
            if (statement.passFilters(filter)) {
                temp[id] = statement;
            }
        });
        this._filteredStatements = temp;
        return this;
    }
                

    // You might think that I would generate a whole KB object from the internal KB object,
    // consisting of just those properties that need to be saved, and then JSON.stringify the
    // whole lot.  However, that produces a file with just one line in it, which is a pain
    // to work with.   The alternative is to use the third argument of JSON.stringify, but 
    // that puts each key:value pair on a separate line.
    // So instead I generate a string for each element (e.g. one statement, one source),
    // and add that to the eventual string, with a \n after each item.

    // 30 mins later...
    // Just decided to use 3rd argument of JSON.stringify, and just live with the
    // length output.  Not easy to get the strings handled as JSON.

    generateJsonFromKb = function () {

        var kbSpec = {
            metadata:{}, 
            formalTerms:{},
            statements:{}, 
            sources:{}, 
            source_user_labels:[],
            object_hierarchies:{},
            topic_hierarchies:{},
            topics:{},
            images:{},
            diagrams:{}
        };

        // Metadata
        for (var itemId in this._metadata) {
            if (itemId !== 'file') {   // This should not be saved in file, since user could change it.
                        // Only filled in when a user loads a KB from file.
                var item = this._metadata[itemId];
                kbSpec.metadata[itemId] = item;
            }
        };


        // Formal Terms
        for (var itemId in this._formalTerms) {
            var formalTerm = this._formalTerms[itemId];
            var formalTermSpec = formalTerm.makeSpec();
/*
            var formalTermSpec = {
                term: formalTerm._term,
                type: formalTerm._type,
                language: formalTerm._language,
                definition:formalTerm._definition,
                images: formalTerm._images,
                synonyms:formalTerm._synonyms,
                memo: formalTerm._memo
            };
*/
            kbSpec.formalTerms[itemId] = formalTermSpec;
        }
        console.log(7500,kbSpec.formalTerms);


        // Statements
        for (var itemId in this._statements) {
            var statement = this._statements[itemId];
            var statementSpec = statement.makeSpec();
            kbSpec.statements[itemId] = statementSpec;
        }

        // Sources
        for (var itemId in this._sources) {
            var source = this._sources[itemId];
            var sourceSpec = source.makeSpec();
            kbSpec.sources[itemId] = sourceSpec;
        }

        // Topics
        for (var itemId in this._topics) {
            var topic = this._topics[itemId];
            var topicSpec = {
                id: topic._id,
                name: topic._id,   // TODO: should be name!!
                description: topic._description,
                search_term: topic._search_term,
                nested_list: topic._json,
                objects: topic._objects
            };
            kbSpec.topics[itemId] = topicSpec;
        }

        // Object hierarchies
        for (var itemId in this._objectHierarchies) {
            var objectHierarchy = this._objectHierarchies[itemId];
            var object_hierarchy = {
                id: objectHierarchy._id,
                name: objectHierarchy._name,   
                root: objectHierarchy._root,
                tree_down: objectHierarchy._tree_down,
                type: objectHierarchy._type
            };
            kbSpec.object_hierarchies[itemId] = object_hierarchy;
        }

        // Topic hierarchies
        for (var itemId in this._topicHierarchies) {
            var topicHierarchy = this._topicHierarchies[itemId];
            var topic_hierarchy = {
                id: topicHierarchy._id,
                name: topicHierarchy._name,   
                root: topicHierarchy._root,
                tree_down: topicHierarchy._tree_down,
                type: topicHierarchy._type
            };
            kbSpec.topic_hierarchies[itemId] = topic_hierarchy;
        }

        // Images
        console.log(9020,this._images);
        for (var itemId in this._images) {
            var image = this._images[itemId];
            var imageSpec = {
                id: image._id,
                title: image._title,
                caption: image._caption,
                url: image._url,
                memo: image._url
            }
            kbSpec.images[itemId] = imageSpec;
        }

        // Diagrams
        for (var itemId in this._diagrams) {
            var diagram = this._diagrams[itemId];
            if (diagram._subgraph) {
                // We need to cut out the statements property of each arc, to avoid
                // JSON.stringify failing because of circular reference.
                var arcs1 = diagram._subgraph.arcs;
                var arcs2 = {};
                for (var arcId in arcs1) {
                    arcs2[arcId] = {
                        id:arcId,
                        type:arcs1[arcId].type,
                        start_node_id:arcs1[arcId].start_node_id,
                        end_node_id:arcs1[arcId].end_node_id
                    }
                }
                var diagramSpec = {
                    id: diagram._id,
                    language: diagram._language,
                    title: diagram._title,
                    memo: diagram._memo,
                    subgraph: {
                        id:diagram._subgraph.id,
                        type:diagram._subgraph.type,
                        nodes:diagram._subgraph.nodes,
                        arcs:arcs2
                    },
                };
                kbSpec.diagrams[itemId] = diagramSpec;
            }
        }

        console.log(9011,kbSpec);
        return kbSpec;
    }

    generateJsonFromKbForSearch = function () {

        var searchArray = [];

        // Metadata
        for (var itemId in this._metadata) {
            var item = this._metadata[itemId];
            searchArray.push(['metadata',itemId,item]);
        };

/*
        // Formal Terms
        for (var itemId in this._formalTerms) {
            var formalTerm = this._formalTerms[itemId];
            var formalTermJson = {
                term: formalTerm._term,
                type: formalTerm._type,
                definition:formalTerm._definition,
                synonyms:formalTerm._synonyms,
                memo: formalTerm._memo
            };
            kbSpec.formalTerms[itemId] = formalTermJson;
        }
*/

        // Statements
        for (var itemId in this._statements) {
            var statement = this._statements[itemId];
            var statementJson = {
                id: statement._id,
                json: statement._json,
                type: statement._type,
                description:statement._description,
                source_ids:statement._sources,
                memo: statement._memo
            };
            searchArray.push(['statement',itemId,JSON.stringify(statementJson)]);
        }
/*
        // Sources
        for (var itemId in this._sources) {
            var source = this._sources[itemId];
            var sourceJson = {
                id: source._id,
                name: source._name,
                location: source._location,
                suffix: source._suffix,
                method: source._method,
                interviewer: source._interviewer,
                interviewee: source._interviewee,
                sex: source._sex,
                day: source._day,
                month: source._month,
                year: source._year,
                memo: source._memo,
                extras: source._extras
            }
            kbSpec.sources[itemId] = sourceJson;
        }

        // Topics
        for (var itemId in this._topics) {
            var topic = this._topics[itemId];
            var topicJson = {
                id: topic._id,
                name: topic._id,   // TODO: should be name!!
                description: topic._description,
                search_term: topic._search_term,
                nested_list: topic._json,
                objects: topic._objects
            };
            kbSpec.topics[itemId] = topicJson;
        }

        kbSpec.object_hierarchies = this._objectHierarchies;
        kbSpec.topic_hierarchies = this._topicHierarchies;

        return kbSpec;
*/
    }




                   


    loadKbFromFile = function (file_kb) {
		try {
			var items = file_kb.metadata;
			for (var itemId in items) {
				this._metadata[itemId] = items[itemId];
			}
		}
		catch (error) {
			alert('ERROR while loading KB from file\nLoading metadata\n\nHere is the error message:\n'+error);
		}

        // formalTerms
		// Settle on one or other
        if (file_kb.formalTerms) {   
            var formalTerms = file_kb.formalTerms;
        } else if (file_kb.formal_terms) {    
            formalTerms = file_kb.formal_terms;
        }
        for (var id in formalTerms) {  
            var spec = formalTerms[id];
            spec.kb = this._id;
            var formalTerm = new FormalTerm({kb:this, id:id, from_file:spec});
            this._formalTerms[id] = formalTerm;
			this.add(id,formalTerm,true);
        }


        // object hierarchies
        if (file_kb.object_hierarchies) {     // This is the webAKT {} format.
            for (var id in file_kb.object_hierarchies) {
                var hierarchy = new Hierarchy(file_kb.object_hierarchies[id]);
                this._objectHierarchies[id] = hierarchy;
            }
        } else if (file_kb.subobjects) {      // This is the legacy AKT5 [] format
            for (var i=0; i<file_kb.subobjects.length; i++) {
                var hier = file_kb.subobjects[i];
                var hierarchy = new Hierarchy(hier);
                this._objectHierarchies[hier.id] = hierarchy;
            }
        }


        // sources
		for (var id in file_kb.sources) {
			var source = new Source({id:id, from_file:file_kb.sources[id]});
            // This allows for legacy KBs:
            if (!source._type) {
                source._type = 'person';
            }
			this._sources[id] = source;
			this.add(id,source,true);
		}
 
/* Sept 2024 
Re-write, below, to simply ignore statements that cannot be handled.
        // statements
        this._graph = {nodes:{},arcs:{}};
		var nFail = 0;
		for (var id in file_kb.statements) {
			var statement = new Statement({id:id, kb:this, from_file:file_kb.statements[id]});
			var parseResult = statement.checkFormal(file_kb.statements[id].formal).peg;
			if (parseResult.result === 'fail') {
				nFail += 1;
				console.log('\nFail',nFail,statement._id,statement._rawFormal,'\nfail:',parseResult.error);
			}
			this._statements[id] = statement;
            if (statement) {
                var nodesAndArc = statement.makeNodesAndArc();
                //console.log(nodesAndArc);
                if (nodesAndArc) {
                    var startNode = nodesAndArc.start_node;
                    var endNode = nodesAndArc.end_node;
                    var arc = nodesAndArc.arc;

                    this._graph.nodes[startNode.id] = startNode;
                    this._graph.nodes[endNode.id] = endNode;

                    // We need to check if this arc already exists.
                    // If it does, then we need to modify the existing instance, to add this
                    // statement to its list of relevant statements.
                    if (this._graph.arcs[arc.id]) {
                        this._graph.arcs[arc.id].statements.push(statement);
                    } else {
                        this._graph.arcs[arc.id] = arc;
                    }
                }
            }
		}
        this._filteredStatements = this._statements;
*/
        // statements
        this._graph = {nodes:{},arcs:{}};
		var nFail = 0;
		for (var id in file_kb.statements) {
			var statement = new Statement({id:id, kb:this, from_file:file_kb.statements[id]});
			var parseResult = statement.checkFormal(file_kb.statements[id].formal).peg;
			if (parseResult.result === 'fail') {
				nFail += 1;
				console.log('\nFault in Kb.js\nParsing new statement failed\n', nFail,statement._id,statement._rawFormal,'\n:',parseResult.error);
			} else {
			    this._statements[id] = statement;
                if (statement) {
                    var nodesAndArc = statement.makeNodesAndArc();
                    //console.log(nodesAndArc);
                    if (nodesAndArc) {
                        var startNode = nodesAndArc.start_node;
                        var endNode = nodesAndArc.end_node;
                        var arc = nodesAndArc.arc;

                        this._graph.nodes[startNode.id] = startNode;
                        this._graph.nodes[endNode.id] = endNode;

                        // We need to check if this arc already exists.
                        // If it does, then we need to modify the existing instance, to add this
                        // statement to its list of relevant statements.
                        if (this._graph.arcs[arc.id]) {
                            this._graph.arcs[arc.id].statements.push(statement);
                        } else {
                            this._graph.arcs[arc.id] = arc;
                        }
                    }
                } else {
                    nFail += 1;
                    console.log('\nFault in Kb.js\nnew Statement failed\n', nFail,id,file_kb.statements[id]);
                }
            }
		}
        this._filteredStatements = this._statements;

        // topics
        for (var id in file_kb.topics) {
            var id1 = id.replace(/ /g,'_');
            var topic = new Topic({id:id1,from_file:file_kb.topics[id]});
            this._topics[id1] = topic;
			this.add(id1,topic,true);
        }


        // topic hierarchies
        if (file_kb.topic_hierarchies) {         // This is the webAKT {} format.
            for (var id in file_kb.topic_hierarchies) {
                var hierarchy = new Hierarchy(file_kb.topic_hierarchies[id]);
                this._topicHierarchies[id] = hierarchy;
            }
        } else if (file_kb.subtopics) {          // This is the legacy AKT5 [] format.
            for (var i=0; i<file_kb.subtopics.length; i++) {
                var hier = file_kb.subtopics[i];
                var hierarchy = new Hierarchy(hier);
                this._topicHierarchies[hier.id] = hierarchy;
            }
        }


        // source_user_labels
        this._source_user_labels = file_kb.source_user_labels;


        // images
        if (file_kb.images) {
            var images = file_kb.images;
            if (Array.isArray(images)) {
                for (var i=0; i<images.length; i++) {
                    var id = images[i].id;
                    var image = new Image(id, images[i]);
                    this._images[id] = image;
                }
            } else {
                for (var id in images) {
                    var image = new Image(id, images[id]);
                    this._images[id] = image;
                }
            }
			//this.add(id,image,true);
        }


        this._diagramsOld = file_kb.diagrams;

        if (Array.isArray(file_kb.diagrams)) {
            for (var i=0; i<file_kb.diagrams.length; i++) {
                var id = file_kb.diagrams[i].name;
                var diagram = new Diagram(id,'joint',file_kb.diagrams[i]);
                this._diagrams[id] = diagram;
            }
        } else {
            for (var id in file_kb.diagrams) {
                console.log(9301,file_kb.diagrams[id]);
                var diagram = new Diagram(id,file_kb.diagrams[id]);
                //diagram.convertSystoToJoint();
                this._diagrams[id] = diagram;
            }
        }
		//this.add(id,diagram);

        // 2 Sept 2023 Moving towards always extracting nodes and arcs from statements
        // on the fly, e.g. when topic selected and statements filtered, rather than
        // previous strategy of building up a complete list first.
        // So, code from this.convertCausalToSysto() has been reconfigured as a
        // Statement method makeNodesAndArc().
        //this._systo = this.convertCausalToSysto();
		
        AKT.KBs[this._id] = this;
		if (!this.from_local_storage) AKT.saveKbInLocalStorage(this._id);
    }


    // This code was originally in Diagram.  However, in response to the need to
    // be able to change a diagram dynamically, e.g. by clicking on a node, I'm 
    // shifting the code here so that the graph for the whole KB is worked out
    // once (or whenever the KB is changed), rather than for each diagram.

    // The code is rather convoluted.  To help understand it, it might be helpful to
    // know what the endpoint is.  Basically, a representation of a graph of causal relationships
    // for the whole model, using Systo format, extended to allow for efficient two-way lookup for:
    // - finding the start_node and end_node OBJECTS, with arc_id as the key, for each arc; and
    // - finding the set of inarc and outarc OBJECTS for each node, with node_id as the key, 
    //   represented as a map (object-literal) rather than as an array.

    // Notes added 13 Aug 2023:
    // Note that, since this graph relates to the topology of the causal relationships in the whole
    // KB, the inclusion of node positions (which is random), is irrelevant to the position of the
    // nodes in any one diagram.    This is worked out using the graph-layout mechanism when a 
    // particular diagram is created, which 
    // can then be modified by user dragging nodes around, and/or by requesting a refresh of the
    // graph layout.   The node positions are then saved with the diagram.  The graph constructed 
    // using this method is *not* saved when the user saves a KB, but is reconstructed when the user
    // loads a KB (and possibly whenever the user adds/removes any (causal) statement.

    // So, there are n+1 instances of a Systo graph for any one KB: n being the number
    // of diagrams associated with the KB, and the +1 being the (diagram-independent) graph
    // of all the causal relationships, constructed in this function.
    
    convertCausalToSysto = function () {
        
        var nodes = {};
        var arcs = {};
        //var statements = kb.findStatements({att_value:false,comparison:false,topic:true,topic_value:searchExpression});
        // Note that we now remove the topic filter - filtering will be done on the whole graph.
        var statements = this.findStatements({att_value:false,comparison:false});

        // We loop over all the (causal) statements, and create arc objects.
        // I've deliberately left this with meaningfully-named intermediate variables,
        // to make the steps explicit.
        var nodes = {};
        var arcs = {};
        for (var statementId in statements) {
            // Put this as a method in Statement class.
            var statement = statements[statementId];
            var json = statement.json;
            var nodePair = extractCauseAndEffectParts(json);
            if (nodePair) {
                var arc = {};
                var nodeIdPair = [];
                for (var i=0; i<=1; i++) {
                    var node = nodePair[i];
                    if (node[0] === 'att_value') {
                        var truncated = node.slice(0,-1);  // Removes the last element, i.e. the value element.
                        var flat = truncated.flat(99); // Flattens the possibly-nested array.
                        var filtered = flat.filter(function(v) {  // Removes keywords.
                            return v!=='att_value' && v!== 'process' && v!== 'action' && v!=='part';
                        });
                        var nodeId = filtered.join('_');   // Concatenates into a string.
                        nodeIdPair[i] = nodeId;
                        // TODO: Add type, x,y...
                        if (!nodes[nodeId]) {
                            nodes[nodeId] = {
                                id:nodeId,
                                type:'object',
                                label:nodeId,
                                json:node,
                                x:500*Math.random(),y:500*Math.random(),
                                statementIds:[statementId]
                            };  
                        } else {
                            nodes[nodeId].statementIds.push(statementId);
                        }
                    }
                }
                var arcId = nodeIdPair.join('__');
                statement._arc_id = arcId;
                arcs[arcId] = {id:arcId, start_node_id:nodeIdPair[0], end_node_id:nodeIdPair[1]};
            }
        }
        console.log(4310,nodes);
        console.log(4311,arcs);
/*
        // We now loop over all the arc objects, and create node objects, including arrays
        // of the inarcs and outarcs for each node.
        for (var arcId in arcs) {   // arcId is the same as the causal statement id.
            var arc = arcs[arcId];
            if (!nodes[arc.start_node_id]) {
                nodes[arc.start_node_id] = {
                    type:    'object', 
                    label:   arc.start_node_id.replace(/_/g,'\n'),
                    centrex: Math.round(800*Math.random()), 
                    centrey: Math.round(400*Math.random()),
                    inarcs:  {},
                    outarcs: {}
                };
            }
            arc.start_node = nodes[arc.start_node_id];
            nodes[arc.start_node_id].outarcs[arcId] = arc;

            if (!nodes[arc.end_node_id]) {
                nodes[arc.end_node_id] = {
                    type:    'object', 
                    label:   arc.end_node_id.replace(/_/g,'\n'),
                    centrex: Math.round(800*Math.random()), 
                    centrey: Math.round(400*Math.random()),
                    inarcs:  {},
                    outarcs: {}
                };
            }
            arc.end_node = nodes[arc.end_node_id];
            nodes[arc.end_node_id].inarcs[arcId] = arc;
        }
*/
        for (var arcId in arcs) {   // arcId is the same as the causal statement id.
            var arc = arcs[arcId];
            arc.start_node = nodes[arc.start_node_id];
            arc.end_node = nodes[arc.end_node_id];
        }
        //this._systo = systo;
        //this._joint = this.convertSystoToJoint();
        console.log(4401,nodes);
        console.log(4402,arcs);
        return {nodes:nodes, arcs:arcs};
                

        function extractCauseAndEffectParts(json) {
            if (json[0] !== 'if') {
                var jsonMain = json;
            } else {
                jsonMain = json[1];
            }
            var json = removeNot(json);
            if (jsonMain[0] == 'causes1way') {
                return [jsonMain[1],jsonMain[2]];
            // // Separate, since might handle bi-directional aspect differently sometime...
            } else if (jsonMain[0] == 'causes2way') { 
                return [jsonMain[1],jsonMain[2]];
            } else {
                return null;
            }
        }

        function removeNot(json) {
            if (json[0]==='not') {
                console.log(json);
            }
        }
/*
        function processMain(json) {
            if (json[0] === 'causes1way') {
                console.log('\n6050\n',json[1],'\n',json[2]);
                var startNodeId = processCausalPart(json[1]);
                var endNodeId = processCausalPart(json[2]);
                return {start_node_id:startNodeId,end_node_id:endNodeId};
            } else if (json[0] === 'causes2way') {  // Separate, since might handle bi-directional aspect sometime...
                var startNodeId = processCausalPart(json[1]);
                var endNodeId = processCausalPart(json[2]);
                return {start_node_id:startNodeId,end_node_id:endNodeId};
            } else {
                return null;
            }
        }

        function processCausalPart(json) {
            if (typeof json === 'string') {
                return json;
            } else if (json[0] === 'att_value') {
                var arg1 = processArg1(json[1]);
                var attribute = json[2];
                return arg1+'_'+attribute;
            } else if (json[0] === 'process') {
                var arg1 = processArg1(json[1]);
                if (json[2]) {
                    var attribute = json[2];
                    return arg1+'_'+attribute;
                } else {
                    return arg1;
                }
            } else if (json[0] === 'action') {
                var arg1 = processArg1(json[1]);
                var attribute = json[2];
                return arg1+'_'+attribute;
            }
        }

        // Obviously, unnecessary duplication, since different predicates are handled
        // using the same code, allowing for 1 to 3 arguments.  Left as it is in case
        // someone decides to handle each of the 4 cases differently.

        function processArg1(json) {
            if (typeof json === 'string') {
                return json;   // It's a simple object
            } else if (json[0] === 'part') {
                return json[1]+'_'+json[2];
            } else if (json[0] === 'process') {
                if (json.length === 2) {
                    return processArg1(json[1]);
                } else if (json.length === 3) {
                    return processArg1(json[1])+'_'+json[2];
                } else if (json.length === 4) {
                    return processArg1(json[1])+'_'+json[2]+'_'+json[3];
                }
            } else if (json[0] === 'action') {
                if (json.length === 2) {
                    return json[1];
                } else if (json.length === 3) {
                    return json[1]+'_'+json[2];
                } else if (json.length === 4) {
                    return json[1]+'_'+json[2]+'_'+json[3];
                }
            }
        }
*/
    }


    crosscheckFormalTerms = function () {
        console.log('starting...');
        var formalTermsFromKb = this._formalTerms;
        var formalTermsFromStatements = this.extractFormalTermsFromStatements();
        console.log(formalTermsFromKb);
        console.log(formalTermsFromStatements);
        var composite = {};

        for (var id1 in formalTermsFromKb) {
            composite[id1] = {kb:formalTermsFromKb[id1]._type};
        }

        for (var id2 in formalTermsFromStatements) {
            if (composite[id2]) {
                composite[id2].statements = formalTermsFromStatements[id2];
            } else {
                composite[id2] = {statements:formalTermsFromStatements[id2]};
            }
        }

        for (var id in composite) {
            if (composite[id].kb && composite[id].statements) {
            } else if (composite[id].kb) {
                //console.log('kb: ',id,composite[id].kb);
            } else if (composite[id].statements) {
                //console.log('statements: ',id,composite[id].statements);
            }
        }

        for (var id in composite) {
            if (composite[id].kb && composite[id].statements) {
                //console.log(this._formalTerms[id]._type,formalTermsFromStatements[id][0]);
                this._formalTerms[id]._type = formalTermsFromStatements[id][0];
            }
        }
    }


    extractFormalTermsFromStatements = function () {
        var statements = this._statements;
        var allTerms = {};
        var countStarted = {};
        var countObject = {};
        var countPart = {};
        for (var statementId in statements) {
            var statement = statements[statementId];
            var terms = statement.classifyFormalTerms();
            //console.log(statementId,terms);
            for (var termId in terms) {
                if (termId === 'acheampong') {
                    console.log('+++ ',terms[termId][0],statementId,JSON.stringify(statement.json));
                }

                if (!countStarted[termId]) {
                    countObject[termId] = 0;
                    countPart[termId] = 0;
                }
                var term = terms[termId];
                //console.log('* ',termId,term);
                if (term[0] === 'object') {
                    countStarted[termId] = true;
                    countObject[termId] += 1;
                }
                if (term[0] === 'part') {
                    countStarted[termId] = true;
                    countPart[termId] += 1;
                }
                allTerms[termId] = terms[termId];
            }
        }
        for (var termId in countObject) {
            if (countObject[termId]>0 || countPart[termId]>0) {
                if (countObject[termId]>0 && countPart[termId]>0) {
                    console.log('*** ',termId,countObject[termId],countPart[termId]);
                } else {
                    //console.log('    ',termId,countObject[termId],countPart[termId]);
                }
            }
        }
        return allTerms;
    }

    // ============================================ DELETE ITEMS
    // These assume that an array of IDs are provided for the component type.

    deleteSources(sourceIds) {
        for (var i=0; i<sourceIds; i++) {
            delete this._sources[sourceIds[i]];
        }
        AKT.trigger('source_changed_event',{});
		AKT.saveKbInLocalStorage(kbId);
        $('#message').text('Sources have been updated');
    }

    deleteStatements(statementIds) {
        for (var i=0; i<statementIds; i++) {
            delete this._statements[statementIds[i]];
        }
        AKT.trigger('statement_changed_event',{});
		AKT.saveKbInLocalStorage(kbId);
        $('#message').text('Statements have been updated');
    }

    deleteFormalTerms(formalTermIds) {
        for (var i=0; i<formalTermIds; i++) {
            delete this._formalTerms[formalTermIds[i]];
        }
        AKT.trigger('formal_term_changed_event',{});
		AKT.saveKbInLocalStorage(kbId);
        $('#message').text('Formal terms have been updated');
    }

    deleteObjectHierarchies(objectHierarchyIds) {
        for (var i=0; i<objectHierarchyIds; i++) {
            delete this._objectHierarchies[objectHierarchyIds[i]];
        }
        AKT.trigger('object_hierarchy_changed_event',{});
		AKT.saveKbInLocalStorage(kbId);
        $('#message').text('Object hierarchies have been updated');
    }

    deleteTopics(topicIds) {
        for (var i=0; i<topicIds; i++) {
            delete this._topics[topicIds[i]];
        }
        AKT.trigger('topic_changed_event',{});
		AKT.saveKbInLocalStorage(kbId);
        $('#message').text('Topics have been updated');
    }

    deleteTopicHierarchies(topicHierarchyIds) {
        for (var i=0; i<topicHierarchyIds; i++) {
            delete this._topicHierarchies[topicHierarchyIds[i]];
        }
        AKT.trigger('topic_hierarchy_changed_event',{});
		AKT.saveKbInLocalStorage(kbId);
        $('#message').text('Topic hierarchies have been updated');
    }

    deleteDiagrams(diagramIds) {
        for (var i=0; i<diagramIds; i++) {
            delete this._diagrams[diagramIds[i]];
        }
        AKT.trigger('diagram_changed_event',{});
		AKT.saveKbInLocalStorage(kbId);
        $('#message').text('Diagrams have been updated');
    }

    deleteImages(imageIds) {
        for (var i=0; i<imageIds; i++) {
            delete this._images[imageIds[i]];
        }
        AKT.trigger('image_changed_event',{});
		AKT.saveKbInLocalStorage(kbId);
        $('#message').text('Images have been updated');
    }
	
    
}
