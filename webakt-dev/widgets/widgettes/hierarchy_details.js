// The term 'node' refers to one thing on the hierarchy tree (an object or a topic).
// The term 'item' refers to one thing obtained from a collection of either formal
// term objects, or topics.
// The confusion arises from the fact that hierarchy is a generic concept (we
// have both object hierarchies and topic hierarchies), so we need a generic term
// for the individual bits.  And the way we handle collections of things (statements,
// formal terms, sources, topics...) is also generic, so we call them 'items'.

// Just to add to the confusion:
// In diagramming, a diagram consists of nodes and arcs/links...

// Here, the only reference to items is args.item_id, referring to the item being supplied 
// by a custom event(selected from an AKT.myListBox menu).

// Finally, note that they come together when we test for their equality, e.g.
// if (nodeId === args.item_id) {...

// 22 March 2023 Attempting to put a lot of the business code into the Hierarchy.js
// class, to improve the logic and readability, and to simplify the code in this
// widgette.

// 30 Jan 2024 TODO: I seem to be using 3 different methods for remembering the current hierarchy 
// (i.e. in statements of the form: var hierarchy = ....):
// self.hierarchy = hierarchy;
// AKT.state.current_hierarchy = hierarchy; and
// widget.options.hierarchy = hierarchy;   !!!
// How horrible is that?   Need to decide on the best pattern ... and use it in every 
// panel that deals with a collection of things (statements, sources, etc).

AKT.widgets.hierarchy_details = {};


AKT.widgets.hierarchy_details.setup = function (widget) {
	console.log(180,widget.options);
    var widgetSettings = $('<div></div>');
    $(widget.element).append(widgetSettings);
    widget.state = {};
    var self = this;

    if (widget.options.item_type === 'object_hierarchy') {
        $(widget.element).find('.legend_add_nodes').text('Object');
        $(widget.element).find('.button_add_nodes').text('Add objects');
    } else if (widget.options.item_type === 'topic_hierarchy') {
        $(widget.element).find('.legend_add_nodes').text('Topic');
        $(widget.element).find('.button_add_nodes').text('Add topics');
    }

	// Impose CSS changes depending on which mode has been selected (by user
	// explicitly, or under program control).
	// This is slightly long-winded, but clearly gathers together the various
	// CSS settings for each mode.
	var mode = widget.options.mode;
	if (mode === "view") {
		$(widget.element).find('.div1_hierarchy_id').css({display:'block'});
		$(widget.element).find('.div1_root_node_name').css({display:'none'});
		$(widget.element).find('.button_accept').css({display:'none'});
		$(widget.element).find('.button_append').css({display:'none'});
		$(widget.element).find('.button_delete_node').css({display:'none'});
		$(widget.element).find('.button_update').css({display:'none'});
        $(widget.element).find('.div_hierarchy_id').text(widget.options.item_id);
		
	} else if (mode === 'edit') {
		$(widget.element).find('.div1_hierarchy_id').css({display:'block'});
		$(widget.element).find('.div1_root_node_name').css({display:'none'});
		$(widget.element).find('.button_accept').css({display:'none'});
        $(widget.element).find('.div_hierarchy_id').text(widget.options.item_id);
		
	} else if (mode === 'new') {
		$(widget.element).find('.div1_hierarchy_id').css({display:'block'});
		$(widget.element).find('.div1_root_node_name').css({display:'block'});
		$(widget.element).find('.button_accept').css({display:'block'});
		
	} else {
		alert('System error in hierarchy_details.js\nNot your fault\nUnrecognised mode '+mode+' in setup()');
	}

    $(widget.element).find('.button_new_branch').on('click', function (event) {    // The new_branch button
        event.stopPropagation();
        console.log('BUTTON: Clicked on new_branch button');
        console.log(widget.options);
        var kbId = AKT.state.current_kb;
        var kb = AKT.KBs[kbId];

        var trSelected = $(widget.element).find('table.table_treetable').find('tr.selected');
        var table = $(trSelected).parents('table')[0];   // Gets the first parent element that is a table.
        var hierarchyId = $(table).attr('data-hierarchy-id');
        var nodeId = $(trSelected).data('tt-id');
        if (hierarchyId && nodeId) {
            var hierarchy = kb._objectHierarchies[hierarchyId];
            hierarchy._tree_down[nodeId] = [];
            self.hierarchy = hierarchy;
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
		console.log('\n\n\n===========================================');
        console.debug('BUTTON: Clicked on append button');

        event.stopPropagation();
        var kbId = AKT.state.current_kb;
        var kb = AKT.KBs[kbId];

        if (widget.options.item_type === 'object_hierarchy') {
/*
            var widgies = AKT.getWidgiesByKbAndType(kbId,'formal_term_collection')
            console.log(widgies, widgies.length)
            if (widgies.length === 0) {
                console.log('There is currently no formal_terms widgette instance!  So, I will create one.');
                var panel = AKT.panelise({
                    widget_name:'formal_terms',
                    position:{left:'20px',top:'20px'},
                    size:{width:'410px',height:'375px'},
                    shift_key: null,
                    options:{kbId:AKT.state.current_kb, term_type:'object'}
                });
            } else {
                console.log('There is a formal_terms widgette instance!');
            }
*/
            if (parentId) {
                var hierarchy = kb._objectHierarchies[parentId];
            } else {
                var hierarchy = kb._objectHierarchies[nodeId];
            }
        } else if (widget.options.item_type === 'topic_hierarchy') {
            if (parentId) {
                var hierarchy = kb._topicHierarchies[parentId];
            } else {
                var hierarchy = kb._topicHierarchies[nodeId];
            }
        }
        self.hierarchy = hierarchy;
        
		$(this).css({background:'yellow'});
        AKT.state.listening_for_formal_term = true;
		AKT.state.active_panel_id = widget.element[0].id;

        var trSelected = $(widget.element).find('table.table_treetable').find('tr.selected');
		console.log('add_nodes:',trSelected);
        var nodeId = $(trSelected).data('tt-id');
        var parentId = $(trSelected).data('tt-parent-id');
        console.log('nodeId,parentId: ', nodeId, parentId);

        AKT.recordEvent({
            file:'hierarchy_details.js',
            function:'AKT.widgets.hierarchy_details.setup()',
            element:widget.element,
            finds:['.button_add_nodes'],
            event:'click',
            message:'Clicked on the add_nodes in the hierarchy_details panel.'});

    });


    $(widget.element).find('.button_accept').on('click', function (event) {    // The 'accept' 
        // button for hierarchy and root node names - a green tick.
        event.stopPropagation();
        console.debug('BUTTON: Clicked on accept button');

        var kbId = AKT.state.current_kb;
        var kb = AKT.KBs[kbId];

        var hierarchyName = $(widget.element).find('.div_hierarchy_id').text();
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

        console.log(widget.options);
        var hierarchyType = widget.options.item_type;

        console.log(2011,hierarchyType,hierarchyName,rootNodeName);
        if (hierarchyType === 'object_hierarchy') {
            var hierarchy = new Hierarchy({kb:kb,type:'object',id:hierarchyName,root:rootNodeName,links:[]});
            widget.options.item_id = hierarchyName;
            kb._objectHierarchies[hierarchyName] = hierarchy;
        } else if (hierarchyType === 'topic_hierarchy') {
            //var hierarchyName = prompt('New topic hierarchy name: ','new_topic_hierarchy');
            //var hierarchy = new Hierarchy({kb:kb,type:'topic',id:hierarchyName,links:[]});
            var hierarchy = new Hierarchy({kb:kb,type:'topic',id:hierarchyName,root:rootNodeName,links:[]});
            widget.options.item_id = hierarchyName;
            kb._topicHierarchies[hierarchyName] = hierarchy;
            //var hierarchies = kb._topicHierarchies;
        }
        console.log(2012, hierarchy);
        self.hierarchy = hierarchy;
        AKT.state.current_hierarchy = hierarchy;
        widget.options.hierarchy = hierarchy;
        AKT.recordEvent({
            file:'hierarchy_details.js',
            function:'AKT.widgets.setup()',
            element:widget.element,
            finds:['.button_accept'],
            event:'click',
            value: '',
            message:'Clicked on the accept (green tick) button in the hierarchy_details panel.'});

        AKT.trigger('new_item_created_event',{hierarchy:hierarchy,item_type:'object_hierarchy'});
        self.display(widget);
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
            var hierarchyType = widget.options.item_type;  

            if (hierarchyType === 'object_hierarchy') {
                var formalTermId = hierarchyItemId;
                var formalTerm = kb._formalTerms[formalTermId];  
                var panel = AKT.panelise({
                    widget_name:'formal_term_details',
                    position:{left:'650px',top:'20px'},
                    size:{width:'580px',height:'450px'},
                    shift_key: event.shiftKey,
                    options:{kbId:kbId, mode:'view', item:formalTerm, item_id:formalTermId}
                });
            } else if (hierarchyType === 'topic_hierarchy') {
                var topicId = hierarchyItemId;
                var topic = kb._topics[topicId];   // 'nodeText' is the same as topicId!
                var panel = AKT.panelise({
                    widget_name:'topic_details',
                    position:{left:'650px',top:'20px'},
                    size:{width:'580px',height:'450px'},
                    shift_key: event.shiftKey,
                    options:{kbId:kbId, mode:'view', item:topic, item_id:topicId}
                });
            }
        } else {
            alert('Please select an item from the hierarchy.');
        }

    });

    $(widget.element).find('.button_update').on('click', function() {
        event.stopPropagation();
        console.log('update',widget.options);
        //var kbId = widget.options.kbId;
        var kbId = AKT.state.current_kb;
        var kb = AKT.KBs[kbId];

        console.log('---',self.hierarchy);
        AKT.trigger('hierarchy_changed_event',{kb:kb, hierarchy:self.hierarchy, hierarchy_type:widget.options.item_type});

		AKT.saveKbInLocalStorage(kbId);
        console.log('\n\nKB saved to localStorage!',kbId,kb);
    });

    // --------------------------------------------------------------------------------
    // Custom event handlers

	// This event listener listens out for a selection event in a 
	// myListbox displaying formal terms, which in this situation is doing 
	// the same job as an HTML <select> element.
	
	// This is detected by the on('item_selected_event', ...) event handler,
	// which updates the hierarchy, then in turn triggers a custom event,
	// the 'kb_changed_event' event.   This is detected by the 
	// on('kb_changed_event', ...) event handler, which the processes it
	// re-displaying the hierarchy treetable.

	// 22 March 2023. Technique I am now using is to set an AKT.state boolean
	// property when a particular widget is waiting for a selection from an
	// AKT.myListbox.  Here, the property is AKT.state.listening_for_formal_term.
	// I also have set the widget instance (i.e. panel) ID, using
	// AKT.state.active_panel_id = widget.element[0].id,
	// to ensure that only the active panel can respond to the event.
	// The test below checks for both of these.
	
	$(document).on('item_selected_event', function(event,args) {
        console.log(9001,args);
        console.log(9002,AKT.state.listening_for_formal_term, AKT.state.active_panel_id, widget.element[0].id);
	    if (AKT.state.listening_for_formal_term &&
				AKT.state.active_panel_id === widget.element[0].id) {
			console.log(9003,'listener:item_selected_event:',args,widget.element[0].id);

			if (widget.options.hierarchy) {
				var hierarchy = widget.options.hierarchy;
			} else {
				hierarchy = AKT.state.current_hierarchy;
			}
            self.hierarchy = hierarchy;
			var trSelected = $(widget.element).find('.div_hierarchies').find('tr.selected');
			var parentId = $(trSelected).data('tt-id');
			var newNodeId = args.item_id;  // The ID of the topic or formal term object that is being added.
				// This is picked up from e.g. a click in a formal_terms myListbox.
			hierarchy.addNode(parentId,newNodeId);  
			console.log(widget.options);
			AKT.trigger('kb_changed_event',{
				source_panel_id:widget.element[0].id,
				kb_id:widget.options.kbId,
				category:'object_hierarchies',
				instance:hierarchy,
				change:{type:'node_added',parentId:parentId,nodeId:newNodeId}
			});
		}
    });


	$(document).on('kb_changed_event', function(event,args) {
		if (args.kb_id === widget.options.kbId &&
				args.category === 'object_hierarchies') {
			console.log('listener:kb_changed_event:',args,widget.element[0].id);
			var hierarchy = args.instance;
            self.hierarchy = hierarchy;
			var divTreetable = hierarchy.makeTreetableDiv();
			$(widget.element).find('.div_hierarchies').html(divTreetable);
		}
	});
	

	// Why is this here?   Can't see a reason.   Probably legacy left-over from
	// before there was a separate hierarchy_details widget.
    $(document).on('new_hierarchy_created_eventxxxx', function(event,args) {
        console.log('\n\n++++++++++++++++++++++++++++++++++++\nhierarchy_details.js:\nReacting to **new_hierarchy_created_event** \nwith args: ',args,'\n-----------------------------------------------');
        console.log(widget);
        //self.display(widget);
/*
        var hierarchy = args.hierarchy;
        var divTreetable = hierarchy.makeTreetableDiv(widget);
        var tableTreetable = hierarchy.makeTreetable(widget);
        $(widget.element).find('.div_hierarchies').append(divTreetable);
        $(divTreetable).append(tableTreetable);

        $(divTreetable).find('.hierarchy_hierarchy_id').css('display','none');
*/
    });

};


// ======================================================================================

AKT.widgets.hierarchy_details.display = function (widget) {
    console.log('\n\n\n***************************** \ndisplay:options:\n',widget.options);

    var kbId = widget.options.kbId;
    var kb = AKT.KBs[kbId];
    console.log(kb);
    console.log(widget.options);

    var hierarchyType = widget.options.item_type;
    var hierarchyId = widget.options.item_id;
    console.log(hierarchyType);
    console.log(hierarchyId);
    console.log(AKT.collection_specs);
    var hierarchy = kb['_'+AKT.collection_specs[hierarchyType].plural][hierarchyId];
    if (!hierarchy) return;
    self.hierarchy = hierarchy;

    var divTreetable = hierarchy.makeTreetableDiv(widget);
    var tableTreetable = hierarchy.makeTreetable(widget);
    var itemId = widget.options.item_id;
    //var itemId = 'crop';

    $(widget.element).find('.div_hierarchies').append(divTreetable);
    //$(divTreetable).append(tableTreetable);
    if (itemId) {
        try {
            $(tableTreetable).treetable('reveal', itemId);
            var node = $(tableTreetable).treetable('node', itemId);
            $(node.row).css('background','yellow');
        }
        catch(err) {
            console.log(err);
        }
    } else if (widget.options.mode==='new') {
        var rootNodeName = $(widget.element).find('.div_root_node_name').text();
        itemId = rootNodeName;
        $(tableTreetable).treetable('reveal', itemId);
        var node = $(tableTreetable).treetable('node', itemId);
        $(node.row).css('background','yellow');
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
<div class="content" style="background:inherit; border:none;padding:15px;">

    <div>
        <div style="float:left;">
            <div class="div1_hierarchy_id">
                <div style="float:left; width:100px;">Hierarchy name</div>
                <div class="div_hierarchy_id" contenteditable style="float:left; width:200px; height:20px; padding:3px; border:solid 1px black; background:white;">New_hierarchy</div>
            </div>
            <div style="clear:both;"></div>
            <div class="div1_root_node_name">
                <div style="float:left; width:100px;">Root node name</div>
                <div class="div_root_node_name" contenteditable style="float:left; width:200px; height:20px; padding:3px; border:solid 1px black; background:white;">top</div>
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
            <button class="button_update" style="width:70px; margin:3px;">Update</button>
        </div>

        <div class="w3-rest w3-container">
            <div class="div_hierarchies" style="min-width:300px; min-height:300px; max-height:400px;background:white; border:solid 1px blue; margin-top:7px; overflow-y:auto;"></div>
        </div>
    </div>

</div>     <!-- End of content div -->
`;




