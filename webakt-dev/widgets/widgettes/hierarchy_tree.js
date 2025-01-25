// The term 'node' refers to one thing on the hierarchy tree (an object or a topic).
// The term 'item' refers to one thing obtained from a collection of either formal
// term objects, or topics.
// The confusion arises from the fact that hierarchy is a generic concept (we
// have both object hierarchies and topic hierarchies), so we need a generic term
// for the individual bits.  And and the way we handle collections of things (statements,
// formal terms, sources, topics...) is also generic, so we call them 'items'.

// Here, the only reference to items is args.item_id, referring to the iem being supplied 
// by a custom event(selected from an AKT.myListBox menu).

// Finally, note that they come together when we test for their equality, e.g.
// if (nodeId === args.item_id) {...


AKT.widgets.hierarchy_tree = {};


AKT.widgets.hierarchy_tree.setup = function (widget) {
    var widgetSettings = $('<div></div>');
    $(widget.element).append(widgetSettings);
    widget.state = {};

    var kbSelectElement = AKT.makeReprocessSelector(widget.element, widget.widgetName,
        'Knowledge base', AKT.getKbIds(), AKT.state.current_kb, 'kbId');
    $(widgetSettings).append(kbSelectElement);

    if (widget.options.tree_type === 'object') {
        $(widget.element).find('.legend_add_nodes').text('Object');
        $(widget.element).find('.button_add_nodes').text('Add objects');
    } else if (widget.options.tree_type === 'topic') {
        $(widget.element).find('.legend_add_nodes').text('Topic');
        $(widget.element).find('.button_add_nodes').text('Add topics');
    }


    $(widget.element).find('.button_new_hierarchy').on('click', function (event) {    // The new_hierarchy button
        console.log('BUTTON: Clicked on new_hierarchy button');
        console.log(widget.options);
        AKT.trigger('trigger_new_hierarchy',{tree_type:widget.options.tree_type});
    });


    $(widget.element).find('.button_new_branch').on('click', function (event) {    // The new_branch button
        console.log('BUTTON: Clicked on new_branch button');
        console.log(widget.options);
        var kbId = AKT.state.current_kb;
        var kb = AKT.KBs[kbId];
/*
        var trSelected = $(widget.element).find('table.treetable').find('tr.selected');
        var nodeId = $(trSelected).data('tt-id');
        var parentId = $(trSelected).data('tt-parent-id');
        console.log('NEW: nodeId,parentId: ', nodeId, parentId);
        var trSelected = $(widget.element).find('.div_treetable').find('tr.selected');
        $(trSelected).attr('data-tt-branch',true);
*/
        var trSelected = $(widget.element).find('table.treetable').find('tr.selected');
        var nodeId = $(trSelected).data('tt-id');
        var parentId = $(trSelected).data('tt-parent-id');
        console.log('nodeId,parentId: ', nodeId, parentId);

        if (parentId) {
            var hierarchy = kb._objectHierarchies[parentId];
        } else {
            var hierarchy = kb._objectHierarchies[nodeId];
        }
        
        hierarchy._tree_down[nodeId] = [];
        
/*
        var hier = new Hierarchy({kb:kb,type:'object',name:'fred',links:[]});
        hier._tree_down['top'] = [];
        //hier._tree_down[nodeId].push(args.item_id);
        //hier._tree_up[args.item_id] = nodeId;
        hier.addNode('top','a');
        hier.addNode('top','b');
        hier.addNode('top','c');
        hier.addNode('b','m');
        console.log(hier);
*/
        kb._objectHierarchies[hierarchy._id] = hierarchy;

        var treeTable = $(widget.element).find('table.'+hierarchy._id)
        hierarchy.getCurrentState(treeTable);
        $(widget.element).find('.div_treetable_'+hierarchy._id).find('table').remove();
        hierarchy.makeTreeTable(widget);

/*        var hierarchies = kb._objectHierarchies;

        console.log('\n\n===========================\nCURRENT TREETABLE');
        $.each(hierarchies, function(id,hierarchy) {
            var currentTreeTable = $(widget.element).find('table.'+id);
            hierarchy.getCurrentState(currentTreeTable);
        });

        console.log('\n\n*******************************\nMAKING NEW TREETABLE');
        $(widget.element).find('.div_treetable').empty();
        $.each(hierarchies, function(id,hierarchy) {
            var treeTable = hierarchies[id].makeTreeTable(widget);
        });
*/
    });


    $(widget.element).find('.button_add_nodes').on('click', function (event) {    // The add nodes (objects or topics) button
        console.debug('BUTTON: Clicked on add_nodes button');

        event.stopPropagation();
        var kbId = AKT.state.current_kb;
        var kb = AKT.KBs[kbId];

        var trSelected = $(widget.element).find('table.treetable').find('tr.selected');
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
    });


// --------------------------------------------------------------------------
// Custom event handlers

    // This is sort-of unnecessary - could just as well be handled by button_new_hierarchy handler.
    $(document).on('trigger_new_hierarchy', function(event,args) {
        console.log('new_hierarchy triggered!');
        var kbId = AKT.state.current_kb;
        var kb = AKT.KBs[kbId];
        console.log('tree_type: ',args.tree_type);

        if (args.tree_type === 'object') {
            var hierarchyName = prompt('New object hierarchy name: ','new_object_hierarchy');
            var rootObjectId = prompt('Root object ID: ');  // Needs toallow user to select from 
                                                            // formal term objects.
            var hierarchy = new Hierarchy({kb:kb,type:'object',root:rootObjectId,name:hierarchyName,links:[]});
            console.log(hierarchy);
            kb._objectHierarchies[hierarchyName] = hierarchy;
            var hierarchies = kb._objectHierarchies;
        } else if (args.tree_type === 'topic') {
            var hierarchyName = prompt('New topic hierarchy name: ','new_topic_hierarchy');
            var hierarchy = new Hierarchy({kb:kb,type:'topic',name:hierarchyName,links:[]});
            kb._topicHierarchies[hierarchyName] = hierarchy;
            var hierarchies = kb._topicHierarchies;
        }

        console.log('\n\n===========================\nCURRENT TREETABLE');
        //$.each(hierarchies, function(id,hierarchy) {
        //    var currentTreeTable = $(widget.element).find('table.'+id);
        //    hierarchy.getCurrentState(currentTreeTable);
        //});

        console.log('\n\n*******************************\nMAKING NEW TREETABLE');
        //$(widget.element).find('.div_treetable').empty();
        //$.each(hierarchies, function(id,hierarchy) {
        //    console.log(id,hierarchies[id]);
        //    var treeTableDiv = hierarchies[id].makeTreeTableDiv(widget);
        //    var treeTable = hierarchies[id].makeTreeTable(widget);
        //});
        var treeTableDiv = hierarchy.makeTreeTableDiv(widget);
        var treeTable = hierarchy.makeTreeTable(widget);
    });

    $(document).on('item_selected_event', function(event,args) {
        console.log('item_selected!');
        console.log(args);
        var kbId = AKT.state.current_kb;
        var kb = AKT.KBs[kbId];

        //if (args.item_type === 'object') {
        var trSelected = $(widget.element).find('.div_treetable').find('tr.selected');
        
        var table = $(trSelected).parents('table')[0];   // Gets the first parent element that is a table.
        if (args.item_type === 'object') {
            var hierarchies = kb._objectHierarchies;
        } else if (args.item_type === 'topic') {
            hierarchies = kb._topicHierarchies;
        }
        var hierarchyId = $(table).attr('data-hierarchy-name');
        var hierarchy = hierarchies[hierarchyId];
        var newNodeId = args.item_id;  // the ID of the formal term object that is being added.
        var selectedNodeId = $(trSelected).data('tt-id');  // The ID of the selected parent node.
        console.log('hierarchyId,newNodeId,selectedNodeId:',hierarchyId,newNodeId,selectedNodeId);
        hierarchy.addNode(selectedNodeId,newNodeId);  // The selected node is the parent
                                                      // for the new node.
        var treeTable = $(widget.element).find('table.'+hierarchyId)
        hierarchy.getCurrentState(treeTable);
        $(widget.element).find('.div_treetable_'+hierarchyId).find('table').remove();
        hierarchy.makeTreeTable(widget);

/*
        console.log('\n\n===========================\nCURRENT TREETABLE');
        $.each(hierarchies, function(id,hierarchy) {
            var currentTreeTable = $(widget.element).find('table.'+id);
            hierarchy.getCurrentState(currentTreeTable);
        });

        $(widget.element).find('.div_treetable').empty();

        $.each(hierarchies, function(id,hierarchy) {
            var treeTable = hierarchies[id].makeTreeTable(widget);
        });
*/
    });




    $(widget.element).find('.button_entry_details').on('click', function (event) {    // The entry_details button
        console.debug('BUTTON: Clicked on entry_details button');

        event.stopPropagation();
        var kbId = AKT.state.current_kb;
        //var element = $(widgetContent).find('.jstree-clicked');
        //var nodeText = element[element.length-1].lastChild.data;
        var nodeText = $(widget.element).find('table.treetable').find('tr.selected').data('tt-id');
        console.log('nodeText: ',nodeText);

        var type = widget.options.tree_type;
        console.log(type);

        if (type === 'object') {
            var panel = new Panel('dialog_Generic', 
                event.shiftKey, 
                {left:'580px',top:'20px',width:'350px',height:'450px'}, 
                {kbId:AKT.state.current_kb, widget_name:'formal_term_details', term:nodeText});
        } else if (type === 'topic') {
            var panel = new Panel('dialog_Generic', 
                event.shiftKey, 
                {left:'580px',top:'20px',width:'350px',height:'450px'}, 
                {kbId:AKT.state.current_kb, widget_name:'topic_details', topic_id:nodeText});
        }
    });

    $(widget.element).find('.divHierarchyLabel').on('click', function(event) {
        event.stopPropagation();
        if ($(this).next().css('display') === 'none') {
            $(this).next().css('display','block');
        } else {
            $(this).next().css('display','none');
        }
    });

    $(widget.element).find('.button_details').on('click', function (event) {    // The Details button
        console.debug('BUTTON: Clicked on sources Details button');

        event.stopPropagation();
        var kbId = AKT.state.current_kb;
        //var element = $(widgetContent).find('.jstree-clicked');
        //var nodeText = element[element.length-1].lastChild.data;
        var nodeText = $(widget.element).find('table.treetable').find('tr.selected').data('tt-id');
        console.log('nodeText: ',nodeText);

        var type = widget.options.tree_type;
        console.log(type);

        if (type === 'object') {
            var panel = new Panel('dialog_Generic', 
                event.shiftKey, 
                {left:'580px',top:'20px',width:'350px',height:'450px'}, 
                {kbId:AKT.state.current_kb, widget_name:'formal_term_details', term:nodeText});
        } else if (type === 'topic') {
            var panel = new Panel('dialog_Generic', 
                event.shiftKey, 
                {left:'580px',top:'20px',width:'350px',height:'450px'}, 
                {kbId:AKT.state.current_kb, widget_name:'topic_details', topic_id:nodeText});
        }
    });
};



AKT.widgets.hierarchy_tree.display = function (widget) {
    console.log('hierarchy_tree options:',widget.options);
    var kbId = widget.options.kbId;
    var KB1 = AKT.KBs[kbId];

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
        var treeTableDiv = hierarchy.makeTreeTableDiv(widget);
        var treeTable = hierarchy.makeTreeTable(widget);
/* Experimented with drag-and-drop which is supported by treetable.
   I couldn't get it to work, but have decided not to pursue this,
   since it's hardly a crucial bit of functionality.
   I have made a local copy of the treetable that does include a 
   demo for this, so should be able to get it working (starting by
   pasting in the demo sample table into webAKT).
        $(treeTable).find('.treetable_tr').draggable({
          helper: "clone",
          opacity: .75,
          refreshPositions: true,
          revert: "invalid",
          revertDuration: 300,
          scroll: true
        });

        //$("#example-advanced .folder").each(function() {
        $(treeTable).find('tr').each(function() {
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

    });


};



AKT.widgets.hierarchy_tree.html = `
<div class="content" style="border:none;padding:15px;">

    <fieldset style="display:none;float:left;">
        <legend style="font-size:13px;"> Hierarchies </legend>
        <div id="temporary_divHierarchies" class="divHierarchies" style="float:left;margin-top:0px;width:200px;max-height:350px;overflow-y:overlay;"></div>
    </fieldset>

    <div class="div_treetables" style="float:left;height:500px;overflow-y:auto;">
    </div>

    <div style="float:right;">
        <fieldset style="width:80px; margin-right:20px;">
            <legend style="font-size:13px;"> Hierarchy </legend>
            <button class="button_new_hierarchy" style="width:70px; margin:3px;">New</button>
            <button class="button_delete_hierarchy" style="width:70px; margin:3px;">Delete</button>
        </fieldset>

        <fieldset style="width:80px; margin-top:7px; margin-right:20px;">
            <legend style="font-size:13px;"> Branch </legend>
            <button class="button_new_branch" style="width:70px; margin:3px;">New</button>
            <button class="button_delete_branch" style="width:70px; margin:3px;">Delete</button>
        </fieldset>

        <fieldset style="width:80px; margin-top:7px; margin-right:10px;">
            <legend class="legend_add_nodes" style="font-size:13px;"></legend>
            <button class="button_add_nodes" style="width:70px; margin:3px;"></button>
            <button class="button_delete_entry" style="width:70px; margin:3px;">Delete</button>
            <button class="button_entry_details" style="width:70px; margin:3px;">Details</button>
        </fieldset>
    </div>
    <div style="clear:both;"></div>

</div>     <!-- End of content div -->
`;



