
class Hierarchy {
    /**
     * Create a hierarchy.
     * @param {object} spec - an object-literal containing initialising data.
     */
    constructor(spec) {

        if (spec.kb) {
            this._kb = spec.kb;  // The Object, not its ID
        } else {
            var kbId = AKT.state.current_kb;
            this._kb = AKT.KBs[kbId];
        }

        if (spec.id && spec.type && spec.root) {
            this._id = spec.id.replace(/ /g,'_');  // Should have been done already.
            this._type = spec.type;
            this._root = spec.root;
        } else {
            console.log('ERROR ERROR ERROR\nNot your fault.\nMissing id, type or root arguments for new Hierarchy().');
            return null;
        }

        // We only need to store tree_down (the nodes below each node) externally.
        // Here, we work out the converse, tree_up (the node above each node) for
        // efficient lookup in each direction.
        // Example:
        // tree_down = {a:['a1','a2'], b:['b1','b2']}
        // tree_up = {a1:'a', a2:'a', b1:'b', b2:'b'}
        if (spec.tree_down) {
            this._tree_down = spec.tree_down;
            this._tree_up = {};
            for (var id in spec.tree_down) { 
                var lowerIds = spec.tree_down[id];
                for (var j=0; j<lowerIds.length; j++) {
                    var lowerId = lowerIds[j];
                    this._tree_up[lowerId] = id;
                }
            }
                    
        } else {
            this._tree_down = {};
            this._tree_down[this._root] = [];
            this._tree_up = {};
        }
/*
        if (spec.tree_up) {
            this._tree_up = spec.tree_up;
        } else {
            this._tree_up = {};
        }
*/
        this._state = {selected:{},expanded:{},last_added:{},recently_added:{}};

// TODO: This code is still needed!   It handles legacy KBs, in AKT5's old format
// for repesenting hierarchies.   
/*         
        var links = this.cleanLinks(spec.links);
        if (links.length === 0) {
            this._tree_down = {};
            this._tree_down[this._root] = [];
            this._tree_up = {};
        } else {
            var tree = this.makeTree(spec.type,this._id,links);
            this._tree_down = tree[0];
            this._tree_up = tree[1];
        }
*/
    }


    addNode = function (parentId, nodeId) {
        if (!this._tree_down[parentId]) {
            this._tree_down[parentId] = [];
        }
        this._tree_down[parentId].push(nodeId);
        this._tree_up[nodeId] = parentId;

        this._state.recently_added[nodeId] = true;
        this._state.last_added = {};
        this._state.last_added[nodeId] = true;
    }

/*        
                if (hierarchy._tree_down[nodeId]) {
                    hierarchy._tree_down[nodeId].push(args.item_id);
                } else {
                    hierarchy._tree_down[nodeId] = [];
                    hierarchy._tree_down[nodeId].push(args.item_id);
                }
                hierarchy._tree_up[args.item_id] = nodeId;

                hierarchy._state.recently_added[args.item_id] = true;
                hierarchy._state.last_added = {};
                hierarchy._state.last_added[args.item_id] = true;
*/

// TODO: This code is still needed!   It handles legacy KBs, in AKT5's old format
// for repesenting hierarchies.   See constructor.
    cleanLinks = function (specLinks) {
        var links = [];
        for (var i=0; i<specLinks.length; i++) {
            var specLink = specLinks[i];
            var hierarchy = specLink.hierarchy.replace(/ /g,'_');
            var item = specLink.item.replace(/ /g,'_');
            var subitem = specLink.subitem.replace(/ /g,'_');
            links.push({hierarchy:hierarchy,item:item,subitem:subitem});
        }
        return links;
    }



    // This method allows for the property value to be computed, rather than simply being
    // a native one for this Class.   See the same method in Statement.js.
    // So, in principle every reference to Collection._PropertyId should be changed to
    // Collection.getPropertyValue(PropertyId).
    getPropertyValue = function (propertyId) {
        if (this['_'+propertyId]) {
            return this['_'+propertyId];

        } else {
            return null;
        }
    }

// ========================================================== HIERARCHIES
// Each link is a 3-element array;  [HierarchyName,Item,SubItem]
// dimension is one of subtopics or subobjects, being the key for the
// corresonding sections of a kb.


    makeTree = function (typeId,hierarchyId,links) {
        //console.log('makeTree: ',typeId,hierarchyId,links);
        var treeDown = {};
        //treeDown[hierarchyId] = [];
        var treeUp = {};
        //if (typeId === 'object') console.log('/n',typeId,hierarchyId,links);
        if (Array.isArray(links)) {    // It's this one, not the else option below, 
                                       // since hierarchy links are the exception
                                       // and stored in an array rather than an object,
                                       // since they don't really have a 'key'.
            for (var i=0; i<links.length; i++) {
                var link = links[i];
                link.item = link.item.replace(/ /g,'_');
                link.subitem = link.subitem.replace(/ /g,'_');
                if (link.hierarchy === hierarchyId && link.item !== 'top') {
                    if (!treeDown[link.item]) {
                        treeDown[link.item] = [];
                    }
                    treeDown[link.item].push(link.subitem);
                    treeUp[link.subitem] = link.item;
                }
            }
        } else {
            for (var id in links) {
                var link = links[id];
                if (link.hierarchy === hierarchyId && link.item !== 'top') {
                    if (!treeDown[link.item]) {
                        treeDown[link.item] = [];
                    }
                    treeDown[link.item].push(link.subitem);
                    treeUp[link.subitem] = link.item;
                }
            }
        }
        return [treeDown,treeUp];
    }



    makeUlTree = function () {
        var hierarchyId = this._id;
        var treeDown = this._tree_down;
        console.log('-- ',hierarchyId, treeDown);
        var ul = $('<ul class="myUL"></ul>');
        getAll(ul, treeDown, hierarchyId, 0);
        return ul;

        function getAll(ul, treeDown, node, level) {
            level += 1;
            var children = treeDown[node];
            for (var i=0; i<children.length; i++) {
                if (level === 1) {
                    var li = $('<li id="'+hierarchyId+'_'+children[i]+'" class="level'+level+'">'+children[i]+'</li>');
                } else {
                    li = $('<li id="'+hierarchyId+'_'+children[i]+'" class="level'+level+'">'+children[i]+'</li>');
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


    makeTreetableDiv = function (widget) {
        console.log('Hierarchy.makeTreetableDiv()');
        var hierarchyId = this._id;
        console.log(this._id);
        var div = $('<div class="div_hierarchy hierarchy_'+hierarchyId+'" data-hierarchy-id="' + hierarchyId + '" style="padding:5px;"></div>');
        //var divHierarchyName = $('<div class="hierarchy_hierarchy_id" style="padding-left:5px;padding-right:5px;">'+hierarchyId+'</div>');
        //$(div).append(divHierarchyName);
        //$(widget.element).find('.div_hierarchies').append(div);

/*
        $(divHierarchyName).on('click', function(event) {
            console.log('Clicked on name div');
            $(widget.element).find('.hierarchy_hierarchy_id').css({background:''});
            $(widget.element).find('.hierarchy_hierarchy_id').removeClass('selected');
            $(this).css({background:'b'});
            $(this).addClass('selected');

            var hierarchyId = $(this).text();
            AKT.recordEvent({
                file:'Hierarchy.js',
                function:'makeTreetableDiv()',
                element:widget.element,
                finds:['.hierarchy_hierarchy_id'],
                event:'click',
                value: hierarchyId,
                message:'Clicked on a hierarchy name in the hierarchies panel.'});
            //var hierarchyId = $(this).parent().attr('data-hierarchy-id');
        });
*/
		var table = this.makeTreetable(widget);
		$(div).append(table);
        return div;
    };


    // Built using the treetable jQuery plugin
    // https://www.jqueryscript.net/demo/jQuery-Plugin-For-Displaying-A-Tree-Of-Data-In-A-Table-treetable/
    makeTreetable = function (widget) {
        var hierarchyId = this._id;
        var type = this._type;
        var kb = this._kb;
        var rootId = this._root;
        var treeDown = this._tree_down;
        var self = this;

        var table = $('<table class="table_treetable '+this._id+'" data-hierarchy-id="' + hierarchyId + '"style="margin:2px;font-size:10px;"></table>');
        //var thead = $('<thead><tr><th>Object</th><th>Position</th></tr></thead>');
        var tbody = $('<tbody></tbody>');
        $(table).append(tbody);

        // This is where we actually build the table, recursing down the levels in the hierarchy,
        // and inserting a table row for every node (branch or leaf) in the hierarchy..
        //console.log('\n\n\n??????????????????????????????????????????????????');
        //.log('tbody:',tbody);
        //console.log('treeDown:',treeDown);
        //console.log('rootId:',rootId);
        //console.log('\n');
        if (Object.keys(treeDown).length > 0) {
            var k=0;
            var level = 0;
            getAll(tbody, treeDown, null, rootId, level);  // parentId is null.
        }
        //$(widget.element).find('.hierarchy_'+hierarchyId).append(table);

        $(table).treetable({ 
            expandable: true,
        });

        $(table).treetable({ 
          branchAttr: "ttBranch",
          clickableNodeNames: false,
          column: 0,
          columnElType: "td", // i.e. 'td', 'th' or 'td,th'
          expandable: true,
          expanderTemplate: "<a href='#'>&nbsp;</a>",
          indent: 19,
          indenterTemplate: "<span class='indenter'></span>",
          cellTemplate: '',
          initialState: "collapsed",
          nodeIdAttr: "ttId", // <a href="https://www.jqueryscript.net/tags.php?/map/">map</a>s to data-tt-id
          parentIdAttr: "ttParentId", // maps to data-tt-parent-id
          stringExpand: "Expand",
          stringCollapse: "Collapse",

          // Events
          onInitialized: null,
          onNodeCollapse: null,
          onNodeExpand: null,
          onNodeInitialized: null
        });
        $(table).on("mousedown", "tr", function() {
          $(".selected").not(this).removeClass("selected");
          $(this).toggleClass("selected");
        });
		
        //$(table).treetable('expandNode',hierarchy._id);
		$(table).treetable('expandAll',true);

        //if (this._state && hierarchyId === 'trees') {
        //    $(table).treetable('expandNode','odoma');
        //}
        if (!this._state) {
            this._state = {
                expanded:{},       // Show subtree for specified node(s).
                selected:{},       // Mark this node as having been selected.
                last_added:{},     // Mark this node as being the last one added.
                recently_added:{}  // Mark these node(s) as having been added recently.
            };
        }

        for (var id in this._state.expanded) {
            $(table).treetable('expandNode',id);
        }

        for (var id in this._state.selected) {
            $(table).find('tr[data-tt-id=' + id + ']').addClass("selected");
        }

        for (var id in this._state.last_added) {
            $(table).find('tr[data-tt-id=' + id + ']').addClass("last_added");
        }

        for (var id in this._state.recently_added) {
            $(table).find('tr[data-tt-id=' + id + ']').addClass("recently_added");
        }

        $(table).find('.recently_added').css({color:'blue'});
        $(table).find('.last_added').css({background:'yellow'});

		console.log(1999,table);
        return table;


        function getAll(tbody, treeDown, parentId, nodeId, level) {
            //console.log('\ngetAll:',level,parentId,nodeId);
            //console.log(treeDown);

            if (treeDown[nodeId] && treeDown[nodeId].length === 0) {
                var isEmptyBranch = true;
            } else {
                isEmptyBranch = false;
            }

            // Obviously, following is temporary hack until a proper selection mechanism for user.
            if (type === 'object') {
                var tr = self.buildTableRow(parentId,nodeId,level,isEmptyBranch,type,['_id','_synonyms']);
            } else if (type === 'topic') {
                tr = self.buildTableRow(parentId,nodeId,level,isEmptyBranch,type,['_id','_search_term']);
            }
            $(tbody).append(tr);

            if (treeDown[nodeId]) {
                level += 1;
                var children = treeDown[nodeId].sort();
                //console.log(children);

                for (var i=0; i<children.length; i++) {
                    //k += 1;
                    var childId = children[i];
                    //if (treeDown[childId]) {
                        getAll(tbody, treeDown, nodeId, childId, level);
                    //}
                }
            }
        }
    }


    buildTableRow = function (parentId,nodeId,level,isEmptyBranch,hierType,propertyIds) {
        var kb = this._kb;
        var kbId = AKT.state.current_kb;
        var kb = AKT.KBs[kbId];

        if (!level) {
            var level = 0;
        }
/*
        if (thisId === state.selected[thisItem]) {
            var trString = '<tr class="treetable_tr levelxx selected'+level+'" data-tt-id="'+thisId+'" data-tt-parent-id="'+parentId+'"></tr>';
        } else {
            var trString = '<tr class="treetable_tr levelxx'+level+'" data-tt-id="'+thisId+'" data-tt-parent-id="'+parentId+'"></tr>';
        }
*/
        var tr = $('<tr class="treetable_tr levelxx'+level+' '+nodeId+'" data-tt-id="'+nodeId+'"></tr>');

        if (parentId) {
            $(tr).attr('data-tt-parent-id',parentId);
        }
        if (isEmptyBranch || !parentId) {
            $(tr).attr('data-tt-branch',true);
        }

        // item is either a formal term of type object, or a topic, depending on the 
        // type of hierarchy.
        if (hierType === 'object') {
            if (kb._formalTerms[nodeId]) {
                var item = kb._formalTerms[nodeId];
            } else {
                item = new FormalTerm();   // Use default settings - TODO: remove this temporary measure
                kb._formalTerms[nodeId] = item;
            }
        } else {
            item = kb._topics[nodeId];
        }
		
		//console.log('hier..',item,propertyIds);
        if (item) {
            for (var i=0; i<propertyIds.length; i++) {
                var propId = propertyIds[i];
                // Remove JSON double-quotes, and insert a space after every comma to
                // get word-wrapping for Boolean expressions (only needed for topics).
                if (item[propId]) {
                    var tdString = JSON.stringify(item[propId]).replaceAll('"','').replaceAll(',',', ');
                } else {
                    tdString = '-+-';
                }

                // This is needed to stop long first cell starting at left-hand edge.
                if (i === 0) {
                    var td = $('<td style="min-width:200px;max-width:300px;vertical-align:top;">'+tdString+'</td>');
                } else {
                    var td = $('<td style="width:140px;max-width:300px;vertical-align:top;">'+tdString+'</td>');
                }
                $(tr).append(td);
            }
        } else {
            for (var i=0; i<propertyIds.length; i++) {
                var td = $('<td>+++</td>');
                $(tr).append(td);
            }
        }

        if ($(tr).hasClass('selected')) {
            $(tr).css({color:'black',background:'red'});
        } else {
            $(tr).css({color:'black'});
        }
        
        return tr;
    }


/*
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
*/

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

    //Explanation:
    //The treetable itself is contructed using a Hierarchy method, which sort-of seems right.
    // However, since we (currently) re-create the whole HTML <table> each time the user
    // makes some sort of change (adding a hierarchy, subhierarchy or object/topic), we need to 
    // remember the state of the hierarchy as displayed (which node is selected; whether the
    // hierarchy itself and its subhoerarchies are collapsed or expanded.   Arguably, this is
    // including functionality in the Hierarchy class which shouldn't be here, being more concerned
    // with display, and
    //     hierarchy.getCurrentState()
    //  is wrong, since there could be more than one display for one hierarchy, so we have to use
    //     hierarchy.getCurrentState(table),
    // but I think it's better than cluttering up the code for the hierarchy display
    // code (currently in the widgette "hierarchy_tree").

    // Hierarchy.state: properties:
    // - expanded
    // - selected
    // - last_added... so that it can be highlghted to bring it to the user's attention.
    // - recently_added... so that the user knows which have been added "recently".
    getCurrentState = function (tableTreetable) {
        // Don't re-initialise state.last_added and state.recently_added.
        var state = this._state;
        state.expanded = {};
        state.selected = {};
        $(tableTreetable).find('.expanded').each(function(index) {
            var id = $(this).data('tt-id');
            state.expanded[id] = true;
        });
        $(tableTreetable).find('.selected').each(function(index) {
            var id = $(this).data('tt-id');
            state.selected[id] = true;
        });
        this._state = state;
    }



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
	
	createBranch = function () {

	}

}
