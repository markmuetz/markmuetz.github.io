// The term 'node' refers to one thing on the hierarchy tree (an object or a topic).
// The term 'item' refers to one thing obtained from a collection of either formal
// term objects, or topics.
// The confusion arises from the fact that hierarchy is a generic concept (we
// have both object hierarchies and topic hierarchies), so we need a generic term
// for the individual bits.  And the way we handle collections of things (statements,
// formal terms, sources, topics...) is also generic, so we call them 'items'.

// Here, the only reference to items is args.item_id, referring to the item being supplied 
// by a custom event(selected from an AKT.myListBox menu).

// Finally, note that they come together when we test for their equality, e.g.
// if (nodeId === args.item_id) {...


AKT.widgets.hierarchy_details = {};


AKT.widgets.hierarchy_details.setup = function (widget) {
    var widgetSettings = $('<div></div>');
    $(widget.element).append(widgetSettings);
    widget.state = {};

    if (widget.options.tree_type === 'object') {
        $(widget.element).find('.legend_add_nodes').text('Object');
        $(widget.element).find('.button_add_nodes').text('Add objects');
    } else if (widget.options.tree_type === 'topic') {
        $(widget.element).find('.legend_add_nodes').text('Topic');
        $(widget.element).find('.button_add_nodes').text('Add topics');
    }


    $(widget.element).find('.button_new_branch').on('click', function (event) {    // The new_branch button
        event.stopPropagation();
        console.log('BUTTON: Clicked on new_branch button');
        console.log(widget.options);
        var kbId = AKT.state.current_kb;
        var kb = AKT.KBs[kbId];

        var trSelected = $(widget.element).find('table.table_treetable').find('tr.selected');
        var table = $(trSelected).parents('table')[0];   // Gets the first parent element that is a table.
        var hierarchyId = $(table).attr('data-hierarchy-name');
        var nodeId = $(trSelected).data('tt-id');
        if (hierarchyId && nodeId) {
            var hierarchy = kb._objectHierarchies[hierarchyId];
            hierarchy._tree_down[nodeId] = [];
        } else {
            alert('Please first select a node (object or topic) in the hierarchy.');
            return;
        }
        
        kb._objectHierarchies[hierarchy._id] = hierarchy;

        var tableTreetable = $(widget.element).find('table.'+hierarchy._id)
        hierarchy.getCurrentState(tableTreetable);
        $(widget.element).find('.hierarchy_'+hierarchy._id).find('table').remove();
        var treetableTable = hierarchy.makeTreetable(widget);
        $(widget.element).find('.hierarchy_'+hierarchy._id).append(treetableTable);

        AKT.recordEvent({
            file:'hierarchy_details.js',
            function:'AKT.widgets.hierarchy_details.setup()',
            element:widget.element,
            finds:['.button_new_branch'],
            event:'click',
            value: '',
            message:'Clicked on the new_branch button in the hierarchy_details panel.'
        });
    });


    // All this really does is to set AKT.state.listening_for_formal_term to true;
    // This means that, when you click in the formal_terms listbox, that event will cause
    // a node to be added here.  Well, at least that's the theory...

    // TODO: This must tbe modified to set the add_nodes mode, so that clicks in
    // the formal_terms listbox only add nodes to the hierarchy when this mode is selected.
	// 20/3/23 DONE
	
    $(widget.element).find('.button_append').on('click', function (event) {    // The add nodes (objects or topics) button
        console.debug('BUTTON: Clicked on add_nodes button');

        event.stopPropagation();
        var kbId = AKT.state.current_kb;
        var kb = AKT.KBs[kbId];
        
		$(this).css({background:'yellow'});
        AKT.state.listening_for_formal_term = true;

        var trSelected = $(widget.element).find('table.table_treetable').find('tr.selected');
		console.log('add_nodes:',trSelected);
        var nodeId = $(trSelected).data('tt-id');
        var parentId = $(trSelected).data('tt-parent-id');
        console.log('nodeId,parentId: ', nodeId, parentId);

        if (widget.options.tree_type === 'object') {
            if (parentId) {
                var hierarchy = kb._objectHierarchies[parentId];
            } else {
                var hierarchy = kb._objectHierarchies[nodeId];
            }
        } else if (widget.options.tree_type === 'topic') {
            if (parentId) {
                var hierarchy = kb._topicHierarchies[parentId];
            } else {
                var hierarchy = kb._topicHierarchies[nodeId];
            }
        }

        AKT.recordEvent({
            file:'hierarchy_details.js',
            function:'AKT.widgets.hierarchy_details.setup()',
            element:widget.element,
            finds:['.button_add_nodes'],
            event:'click',
            message:'Clicked on the add_nodes in the hierarchy_details panel.'});

    });


    $(widget.element).find('.button_accept').on('click', function (event) {    // The 'accept'button for
        event.stopPropagation();
                // hierarchy and root node names.
        console.debug('BUTTON: Clicked on accept button');

        var kbId = AKT.state.current_kb;
        var kb = AKT.KBs[kbId];

        var hierarchyName = $(widget.element).find('.div_hierarchy_name').text();
        var rootNodeName = $(widget.element).find('.div_root_node_name').text();
        if (hierarchyName === '' && rootNodeName === '') {
            alert('You must enter a name for the hierarchy and a name for the root node of the hierarchy.');
            return;
        } else if (hierarchyName === '') {
            alert('You must enter a name for the hierarchy.');
            return;
        } else if (rootNodeName === '') {
            alert('You must enter a name for the root node of the hierarchy.');
            return;
        }

        AKT.state.current_hierarchy = hierarchy;

        $(widget.element).find('.div_hierarchies').text('');

        if (widget.options.tree_type) {
            var hierarchyType = widget.options.tree_type;
        } else {
            hierarchyType = 'object';
        }

        if (hierarchyType === 'object') {
            var hierarchy = new Hierarchy({kb:kb,type:'object',name:hierarchyName,root:rootNodeName,links:[]});
            kb._objectHierarchies[hierarchyName] = hierarchy;
        } else if (hierarchyType === 'topic') {
            var hierarchyName = prompt('New topic hierarchy name: ','new_topic_hierarchy');
            var hierarchy = new Hierarchy({kb:kb,type:'topic',name:hierarchyName,links:[]});
            kb._topicHierarchies[hierarchyName] = hierarchy;
            //var hierarchies = kb._topicHierarchies;
        }

        AKT.state.current_hierarchy = hierarchy;

        AKT.recordEvent({
            file:'hierarchy_details.js',
            function:'AKT.widgets.setup()',
            element:widget.element,
            finds:['.button_accept'],
            event:'click',
            value: '',
            message:'Clicked on the accept (green tick) button in the hierarchy_details panel.'});

        AKT.trigger('new_hierarchy_created_event',{hierarchy:hierarchy});
    });


    $(widget.element).find('.button_node_details').on('click', function (event) {    // The Details button
        console.debug('BUTTON: Clicked on node_details button');
        console.log('options:',widget.options);

        event.stopPropagation();
        var kbId = AKT.state.current_kb;
        var kb = AKT.KBs[kbId];

        //var element = $(widgetContent).find('.jstree-clicked');
        //var nodeText = element[element.length-1].lastChild.data;
        var hierarchyItemId = $(widget.element).find('table.table_treetable').find('tr.selected').data('tt-id');
        console.log('nodeText: ',hierarchyItemId);
        if (hierarchyItemId) {      
            var type = widget.options.tree_type;  

            if (type === 'object') {
                var formalTermId = hierarchyItemId;
                var formalTerm = kb._formalTerms[formalTermId];  
                var panel = AKT.panelise({
                    widget_name:'formal_term_details',
                    position:{left:'650px',top:'20px'},
                    size:{width:'580px',height:'450px'},
                    shift_key: event.shiftKey,
                    options:{kbId:kbId, mode:'details', formal_term:formalTerm, item_id:formalTermId}
                });
            } else if (type === 'topic') {
                var topicId = hierarchyItemId;
                var topic = kb._topics[topicId];   // 'nodeText' is the same as topicId!
                var panel = AKT.panelise({
                    widget_name:'topic_details',
                    position:{left:'650px',top:'20px'},
                    size:{width:'580px',height:'450px'},
                    shift_key: event.shiftKey,
                    options:{kbId:kbId, mode:'details', topic:topic, item_id:topicId}
                });
            }
        } else {
            alert('Please select an item from the hierarchy.');
        }

    });


    // --------------------------------------------------------------------------------
    // Custom event handlers

    // Jan 2023 Disabled this, since it gets fired whenever you select an item!!   
    // Not sure what I was thinking when I put it in in the first place.
    // It could have a use when you want to reuse the same details panel when a new
    // item is selected...
    $(document).on('item_selected_event', function(event,args) {
	    if (!AKT.state.listening_for_formal_term) return;
		
        console.log('item_selected!');
        console.log(args);
        var kbId = AKT.state.current_kb;
        var kb = AKT.KBs[kbId];

        //if (args.item_type === 'object') {
        var trSelected = $(widget.element).find('.div_hierarchies').find('tr.selected');
        console.log(11,trSelected);
		
		// Is it already a branch node?   If not, make it into one.
		if ($(trSelected).data('ttBranch')) {
			console.log('++ It is a branch !!');
		} else {
	        var trSelected = $(widget.element).find('table.table_treetable').find('tr.selected');
			var table = $(trSelected).parents('table')[0];   // Gets the first parent element that is a table.
			var hierarchyId = $(table).attr('data-hierarchy-name');
			var nodeId = $(trSelected).data('tt-id');
			if (hierarchyId && nodeId) {
				var hierarchy = kb._objectHierarchies[hierarchyId];
				hierarchy._tree_down[nodeId] = [];
			} else {
				alert('Please first select a node (object or topic) in the hierarchy.');
				return;
			}
			
			kb._objectHierarchies[hierarchy._id] = hierarchy;

			var tableTreetable = $(widget.element).find('table.'+hierarchy._id)
			hierarchy.getCurrentState(tableTreetable);
			$(widget.element).find('.hierarchy_'+hierarchy._id).find('table').remove();
			var treetableTable = hierarchy.makeTreetable(widget);
			$(widget.element).find('.hierarchy_'+hierarchy._id).append(treetableTable);
		}
			
        
        var table = $(trSelected).parents('table')[0];   // Gets the first parent element that is a table.
        console.log(12,table);
        if (args.item_type === 'object') {
            var hierarchies = kb._objectHierarchies;
        } else if (args.item_type === 'topic') {
            hierarchies = kb._topicHierarchies;
        }
        var hierarchyId = $(table).attr('data-hierarchy-name');
        console.log(13,hierarchyId);
        var hierarchy = hierarchies[hierarchyId];
        var newNodeId = args.item_id;  // the ID of the formal term object that is being added.
        var selectedNodeId = $(trSelected).data('tt-id');  // The ID of the selected parent node.
        console.log('hierarchyId,newNodeId,selectedNodeId:',hierarchyId,newNodeId,selectedNodeId);
        hierarchy.addNode(selectedNodeId,newNodeId);  // The selected node is the parent
                                                      // for the new node.
        var tableTreetable = $(widget.element).find('table.'+hierarchyId)
        console.log(tableTreetable);
        hierarchy.getCurrentState(tableTreetable);
        $(widget.element).find('.hierarchy_'+hierarchyId).find('table').remove();
        var treetable = hierarchy.makeTreetable(widget);
        $(widget.element).find('.hierarchy_'+hierarchyId).append(treetable);

        AKT.trigger('hierarchy_changed_event',{hierarchy:hierarchy});
/*
        console.log('\n\n===========================\nCURRENT TREETABLE');
        $.each(hierarchies, function(id,hierarchy) {
            var currentTreeTable = $(widget.element).find('table.'+id);
            hierarchy.getCurrentState(currentTreeTable);
        });

        $(widget.element).find('.div_hierarchy').empty();

        $.each(hierarchies, function(id,hierarchy) {
            var tableTreetable = hierarchies[id].makeTreetable(widget);
        });
*/
    });


    $(document).on('new_hierarchy_created_event', function(event,args) {
        console.log('hierarchies.js: Reacting to **new_hierarchy_created_event** with args: ',args);
        //self.display(widget);
        
        var hierarchy = args.hierarchy;
        var divTreetable = hierarchy.makeTreetableDiv(widget);
        var tableTreetable = hierarchy.makeTreetable(widget);
        $(widget.element).find('.div_hierarchies').append(divTreetable);
        $(divTreetable).append(tableTreetable);

        $(divTreetable).find('.hierarchy_hierarchy_name').css('display','none');
    });

};


// ======================================================================================

AKT.widgets.hierarchy_details.display = function (widget) {
    console.log('hierarchy_details options:\n',widget.options);
    var kbId = widget.options.kbId;
    var KB1 = AKT.KBs[kbId];

    var hierarchy = widget.options.hierarchy;
    if (!hierarchy) return;

    //var hierarchy = hierarchies[id];
    var divTreetable = hierarchy.makeTreetableDiv(widget);
    var tableTreetable = hierarchy.makeTreetable(widget);
    var hierarchyType = widget.options.hierarchy_type;
    var itemId = widget.options.item_id;
    //console.log(itemId);
    $(widget.element).find('.div_hierarchies').append(divTreetable);
    $(divTreetable).append(tableTreetable);
    try {
        $(tableTreetable).treetable('reveal', itemId);
        var node = $(tableTreetable).treetable('node', itemId);
        $(node.row).css('background','yellow');
    }
    catch(err) {
    }



        $(widget.element).find('.div_hierarchies').find('.treetable_tr').on('click', function (event, value) {
            event.stopPropagation();
            console.log('--> ',$(this));
            // Needed this, since this.value is blank when triggered (in AKT.singleStep).
            //if (this.value === '') {
            //    var optionValue = value;
            //} else {
            //    optionValue = this.value;
            //}
            
            var divElement = $(widget.element).find('.div_hierarchies');
            var tableElement = $(divElement).find('table');
            var key = $(this).attr('data-tt-id');
            console.log('key:',key);
            if (!value || key === value) {
                $(tableElement).find('tr:even').css({background:'white'});
                $(tableElement).find('tr:odd').css({background:'#e8e8e8'});
                $(divElement).find('.tr_listbox').removeAttr('data-selected');
                $(divElement).find('.tr_listbox').removeClass('selected');
                $(this).css({background:'yellow'});
                $(this).attr('data-selected','yes');
                $(this).addClass('selected');
                //AKT.trigger('item_selected_event',{item_type:args.item_type,item_id:key});

                AKT.recordEvent({
                    file:'hierarchy_details.js',
                    function:'display()',
                    //element:args.widget_element,
                    element:widget.element,
                    finds:['.treetable_tr'],
                    event:'click',
                    //message:'Clicked on a treetable table row in '+args.widget_element[0].id,
                    message:'Clicked on a treetable table row in '+widget.element[0].id,
                    value:key
                });

            }

        });




/*
    $(widget.element).find('.div_hierarchy').empty();
    console.log(1,hierarchy);
    var divTreetable = hierarchy.makeTreetableDiv(widget);
    console.log(2,divTreetable);
    $(widget.element).find('.div_hierarchies').append(divTreetable);
    var tableTreetable = hierarchy.makeTreetable(widget);
    console.log(3,tableTreetable);
    $(tableTreetable).treetable('expandNode',hierarchy._id);
    //$(tableTreetable).treetable('expandAll',true);
    $(divTreetable).append(tableTreetable);
*/

/*
    var hierarchy = widget.options.hierarchy;
    var tableTreetable = $(widget.element).find('table.'+hierarchy._id)
    hierarchy.getCurrentState(tableTreetable);
    $(widget.element).find('.hierarchy_'+hierarchy._id).find('table').remove();
    $(widget.element).find('.hierarchy_'+hierarchy._id).append(hierarchy.makeTreetable(widget));
*/
/*
    var treeType = widget.options.tree_type;
    if (treeType === 'object') {
        var hierarchies = KB1._objectHierarchies;
    } else {
        var hierarchies = KB1._topicHierarchies;
    }
    console.log(hierarchies);

    var divHierarchies = $(widget.element).find('.divHierarchies');

    // Sept 2022.  Using treetable to make a table-like hierarchical display,
    // with multiple columns.
    $.each(hierarchies, function(id,hierarchy) {
        var hierarchy = hierarchies[id];
        var divTreetable = hierarchy.makeTreetableDiv(widget);
        var tableTreetable = hierarchy.makeTreetable(widget);
*/
/* Experimented with drag-and-drop which is supported by treetable.
   I couldn't get it to work, but have decided not to pursue this,
   since it's hardly a crucial bit of functionality.
   I have made a local copy of the treetable that does include a 
   demo for this, so should be able to get it working (starting by
   pasting in the demo sample table into webAKT).
        $(tableTreetable).find('.treetable_tr').draggable({
          helper: "clone",
          opacity: .75,
          refreshPositions: true,
          revert: "invalid",
          revertDuration: 300,
          scroll: true
        });

        //$("#example-advanced .folder").each(function() {
        $(tableTreetable).find('tr').each(function() {
          $(this).parents("tr").droppable({
            accept: ".treetable_tr",
            drop: function(e, ui) {
              console.log('drop');
              var droppedEl = ui.draggable.parents("tr");
              $('#treetable_'+id).treetable("move", droppedEl.data("tt-id"), $(this).data("tt-id"));
            },
            hoverClass: "accept",
            over: function(e, ui) {
              console.log('over');
              var droppedEl = ui.draggable.parents("tr");
              if(this != droppedEl[0] && !$(this).is(".expanded")) {
                $('#treetable_'+id).treetable("expandNode", $(this).data("tt-id"));
              }
            }
          });
        });
*/

    //});


};



AKT.widgets.hierarchy_details.html = `
<div class="content" style="border:none;padding:15px;">

    <div>
        <div style="float:left;">
            <div>
                <div style="float:left; width:100px;">Hierarchy name</div>
                <div class="div_hierarchy_name" contenteditable style="float:left; width:200px; height:20px; padding:3px; border:solid 1px black; background:white;">Crop</div>
            </div>
            <div style="clear:both;"></div>
            <div>
                <div style="float:left; width:100px;">Root node name</div>
                <div class="div_root_node_name" contenteditable style="float:left; width:200px; height:20px; padding:3px; border:solid 1px black; background:white;">crop</div>
            </div>  
            <div style="clear:both;"></div>
        </div>

        <button class="button_accept" style="float:left; margin-left:15px; background;white; font-weight:bold; font-size:24px; color:#00cc00;">&#10004;</button>
        <div style="clear:both;"></div>
    </div>

    <div class="w3-row">
        <div class="w3-col w3-right w3-container" style="width:80px">
            <button class="button_new_branch" style="display:none; width:70px; margin:3px;">New branch</button>
            <button class="button_append" style="width:70px; margin:3px;">Append</button>
            <button class="button_delete_node" style="width:70px; margin:3px;">Delete</button>
            <button class="button_node_details" style="width:70px; margin:3px;">Details</button>
        </div>

        <div class="w3-rest w3-container">
            <div class="div_hierarchies" style="min-width:300px; min-height:300px; max-height:400px;background:white; border:solid 1px blue; margin-top:7px; overflow-y:auto;"></div>
        </div>
    </div>

</div>     <!-- End of content div -->
`;




