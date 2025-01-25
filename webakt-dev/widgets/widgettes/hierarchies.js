// The term 'node' refers to one thing on the hierarchy tree (an object or a topic).
// The term 'item' refers to one thing obtained from a collection of either formal
// term objects, or topics.
// The confusion arises from the fact that hierarchy is a generic concept (we
// have both object hierarchies and topic hierarchies), so we need a generic term
// for the individual bits.  And the way we handle collections of things (statements,
// formal terms, sources, topics...) is also generic, so we call them 'items'.

// Here, the only reference to items is args.item_id, referring to the iem being supplied 
// by a custom event(selected from an AKT.myListBox menu).

// Finally, note that they come together when we test for their equality, e.g.
// if (nodeId === args.item_id) {...

// 30 Jan 2024 TODO: I seem to be using 3 different methods for remembering the current hierarchy 
// (i.e. in statements of the form: var hierarchy = ....):
// self.hierarchy = hierarchy;
// AKT.state.current_hierarchy = hierarchy; and
// widget.options.hierarchy = hierarchy;   !!!
// How horrible is that?   Need to decide on the best pattern ... and use it in every 
// panel that deals with a collection of things (statements, sources, etc).

AKT.widgets.hierarchies = {};


AKT.widgets.hierarchies.setup = function (widget) {
    var self = this;

    widget.state = {};
/*
    var widgetSettings = $('<div></div>');
    $(widget.element).append(widgetSettings);

    var kbSelectElement = AKT.makeReprocessSelector(widget.element, widget.widgetName,
        'Knowledge base', AKT.getKbIds(), AKT.state.current_kb, 'kbId');
    $(widgetSettings).append(kbSelectElement);
*/
    var widgetSettings = $('<div></div>');
    $(widget.element).find('.content').prepend(widgetSettings);

    var kbSelectElement = AKT.makeReprocessSelector(widget.element, widget.widgetName,
        'Knowledge base', AKT.getKbIds(), AKT.state.current_kb, 'kbId');
    $(widgetSettings).append(kbSelectElement);




    $(widget.element).find('.button_view').on('click', function (event,value) {   // Hierarchy view button
        console.log('BUTTON: Clicked on hierarchies View button');
        event.stopPropagation();

        var kbId = AKT.state.current_kb;
        var kb = AKT.KBs[kbId];
        console.log(value,widget.options);

/*
        if (value) {
            var hierarchyId = value;
        } else {
            hierarchyId = $(widget.element).find('.div_hierarchies').find('.selected').parent().attr('data-hierarchy-id');
        }
        console.log(value,widget.options,hierarchyId);
*/
        //var hierarchyId = $(widget.element).find('.tr_listbox[data-selected="yes"]').data('key');
        var hierarchyId = options.item_id;
        console.log(value,widget.options,hierarchyId);


        if (!hierarchyId) {
            alert('No hierarchy selected.\nYou need to click on the hierarchy name to select it.');
            return;
        }

        if (widget.options.tree_type === 'object') {
            var hierarchy = kb._objectHierarchies[hierarchyId];
            console.log(hierarchy);
        } else if (widget.options.tree_type === 'topic') {
            var hierarchy = kb._topicHierarchies[hierarchyId];
        }
        self.hierachy = hierarchy;

        var panel = AKT.panelise({
            widget_name:'hierarchy_details',
            position:{left:'650px',top:'20px'},
            size:{width:'580px',height:'450px'},
            shift_key: event.shiftKey,
            options:{kbId:kbId, mode:'view', tree_type:widget.options.tree_type, item_id:hierarchy._root, hierarchy:hierarchy}
        });

        //$('#'+panel._id).dialog_Generic('option', 'hierarchy', hierarchy);

    });


    $(widget.element).find('.button_edit').on('click', function (event,value) {   // Hierarchy details button
        console.log('BUTTON: Clicked on hierarchies Edit button');
        event.stopPropagation();

        var kbId = AKT.state.current_kb;
        var kb = AKT.KBs[kbId];
        console.log(value,widget.options);

        if (value) {
            var hierarchyId = value;
        } else {
            //hierarchyId = $(widget.element).find('.div_hierarchies').find('.selected').parent().attr('data-hierarchy-id');
            hierarchyId = $(widget.element).find('.tr_listbox[data-selected="yes"]').data('key');
        }
        console.log(value,widget.options,hierarchyId);

        if (!hierarchyId) {
            alert('No hierarchy selected.\nYou need to click on the hierarchy id to select it.');
            return;
        }

        if (widget.options.tree_type === 'object') {
            var hierarchy = kb._objectHierarchies[hierarchyId];
        } else if (widget.options.tree_type === 'topic') {
            var hierarchy = kb._topicHierarchies[hierarchyId];
        }
        self.hierachy = hierarchy;

        AKT.recordEvent({
            file:'hierarchies.js',
            function:'AKT.widgets.hierarchies.setup()',
            element:widget.element,
            finds:['.button_edit'],
            event:'click',
            value:hierarchyId,
            message:'Clicked on .button_edit in hierarchies.js.'});

        var panel = AKT.panelise({
            widget_name:'hierarchy_details',
            position:{left:'650px',top:'20px'},
            size:{width:'580px',height:'450px'},
            shift_key: event.shiftKey,
            options:{kbId:kbId, mode:'edit', hierarchy:hierarchy}
        });

        //$('#'+panel._id).dialog_Generic('option', 'hierarchy', hierarchy);

    });


    $(widget.element).find('.button_new').on('click', function (event) {   // New Hierarchy button
        console.log('BUTTON: Clicked on New button');
        event.stopPropagation();

        var kbId = AKT.state.current_kb;
        var kb = AKT.KBs[kbId];

        AKT.recordEvent({
            file:'hierarchies.js',
            function:'AKT.widgets.hierarchies.setup()',
            element:widget.element,
            finds:['.button_new'],
            event:'click',
            message:'Clicked on .button_new in hierarchies.js.'
        });

        var panel = AKT.panelise({
            widget_name:'hierarchy_details',
            position:{left:'650px',top:'20px'},
            size:{width:'580px',height:'450px'},
            shift_key: event.shiftKey,
            options:{kbId:kbId, mode:'new', type:widget.options.tree_type}
        });
    });

/*
NOTE: The way this works is subtlely different from the same
task in the formal_terms widget.   

In that, the formalTermId is picked up using:
  var formalTermId = $(widget.element).find('.tr_listbox[data-selected="yes"]').data('key');
I.e. the selected state is indicated by a tr data- attribute, because
that's what I do in AKT.myListbox().

Here, I use:
  var formalTermId = $(widget.element).find('.treetable_tr.selected').data('tt-id');
I.e. the selected state is indicated by a tr class, because that's
what I do in AKT.treetable().

There is no reason why they should be the same, except that it would be
more consistent to use one method or the other in both situations.  I
can't offhand think if one approach is inherently better than the other.
Note also the return data- label ('key' vs 'tt-id'), but that's a 
function of using treetable.js for the hierarchy, so might as well leave as is.
TODO: Check this out.
*/

    $(widget.element).find('.button_details').on('click', function (event) {    // The Details button
        console.log('BUTTON: Clicked on object hierarchy node details button');
        console.log(widget.options);
        event.stopPropagation();

        var kbId = AKT.state.current_kb;
        var kb = AKT.KBs[kbId];

        // Condense thes two sections into one.
        if (widget.options.tree_type === 'object') {
            var formalTermId = $(widget.element).find('.treetable_tr.selected').data('tt-id');
            console.log('** ',formalTermId,' **');
            if (formalTermId) {
                var formalTerm = kb._formalTerms[formalTermId];

                AKT.recordEvent({
                    file:'hierarchies.js',
                    function:'AKT.widgets.formal_terms.setup()',
                    element:widget.element,
                    finds:['.button_view'],
                    event:'click',
                    value: formalTermId,
                    message:'Clicked on .button_view in hierarchies.js.'});

                var panel = AKT.panelise({
                    widget_name:'formal_term_details',
                    position:{left:'650px',top:'20px'},
                    size:{width:'580px',height:'450px'},
                    shift_key: event.shiftKey,
                    options:{kbId:kbId, mode:'view', formal_term:formalTerm}
                });
            } else {
                alert('Please first select a formal term from the listbox.');
            }
        } else if (widget.options.tree_type === 'topic') {
            var topicId = $(widget.element).find('.treetable_tr.selected').data('tt-id');
            console.log('** ',topicId,' **');
            if (topicId) {
                var topic = kb._topics[topicId];

                AKT.recordEvent({
                    file:'hierarchies.js',
                    function:'AKT.widgets.hierarchies.setup()',
                    element:widget.element,
                    finds:['.button_view'],
                    event:'click',
                    value: topicId,
                    message:'Clicked on .button_view in hierarchies.js.'});

                var panel = AKT.panelise({
                    widget_name:'topic_details',
                    position:{left:'650px',top:'20px'},
                    size:{width:'580px',height:'450px'},
                    shift_key: event.shiftKey,
                    options:{kbId:kbId, mode:'view', topic:topic}
                });
            } else {
                alert('Please first select a topic from the listbox.');
            }
        } else {
            alert('*** INTERNAL ERROR *** Ask Robert to sort it out, saying "hierarchies.js": $(widget.element).find(".button_details").on("click",...');
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


    // ------------------------------------------------------------------------------
    // Custom event handlers

    // TODO 3rd Nov: This handler should only handle any display changes resulting from the
    // creation of a new hierarchy.   It should *not* manage the actions associated with
    // creation of the hierarchy itself.   So it's likely that it will actually do very
    // little, just creating the container div that holds the hierarchy tree itself (and 
    // which is handled by the custom event "hierarchy_changed_event")


    // -----------------------------------------------------------------------------
    // Custom event handlers
    $(document).on('new_hierarchy_created_event', function(event,args) {
        console.log('new_hierarchy_created_event',args);
        self.display(widget);
    });

    $(document).on('hierarchy_changed_event', function(event,args) {
        console.log('new_hierarchy_changed_event',args);
        self.display(widget);
    });


    $(document).on('hierarchy_deleted_event', function(event,args) {
        console.log('new_hierarchy_deleted_event',args);
        self.display(widget);
    });


    $(document).on('item_selected_eventxxx', function(event,args) {
        console.log('item_selected!');
        console.log(args);
        var kbId = AKT.state.current_kb;
        var kb = AKT.KBs[kbId];

        var trSelected = $(widget.element).find('.div_hierarchy').find('tr.selected');
        
        var table = $(trSelected).parents('table')[0];   // Gets the first parent element that is a table.
        if (args.item_type === 'object') {
            var hierarchies = kb._objectHierarchies;
        } else if (args.item_type === 'topic') {
            hierarchies = kb._topicHierarchies;
        }
        var hierarchyId = $(table).attr('data-hierarchy-id');
        var hierarchy = hierarchies[hierarchyId];
        self.hierachy = hierarchy;
        var newNodeId = args.item_id;  // the ID of the formal term object that is being added.
        var selectedNodeId = $(trSelected).data('tt-id');  // The ID of the selected parent node.
        console.log('hierarchyId,newNodeId,selectedNodeId:',hierarchyId,newNodeId,selectedNodeId);
        hierarchy.addNode(selectedNodeId,newNodeId);  // The selected node is the parent
                                                      // for the new node.
        var tableTreetable = $(widget.element).find('table.'+hierarchyId)
        hierarchy.getCurrentState(tableTreetable);
        $(widget.element).find('.div_hierarchy_'+hierarchyId).find('table').remove();
        hierarchy.makeTreetable(widget);
    });


/*
    $(document).on('hierarchy_changed_event', function(event,args) {
        console.log('hierarchies.js: Reacting to **hierarchy_changed_event** with args: ',args);

        //var kbId = AKT.state.current_kb;
        //var kb = AKT.KBs[kbId];

        //var hierarchyId = args.hierarchy_id;
        //var hierarchy = kb._hierarchies[hierarchyId];
        var hierarchy = args.hierarchy;

        var divTreetable = hierarchy.makeTreetableDiv(widget);
        var tableTreetable = hierarchy.makeTreetable(widget);
        $(widget.element).find('.hierarchy_'+hierarchy._id).empty();
        $(widget.element).find('.hierarchy_'+hierarchy._id).append(divTreetable);
        $(divTreetable).append(tableTreetable);
    });
*/
};



AKT.widgets.hierarchies.display = function (widget) {
    console.log('hierarchies.display() options:',widget.options);
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

    var kbId = widget.options.kbId;
    var kb = AKT.KBs[kbId];

    var sources = kb.findSources();
    console.log(sources);
    var nSources = Object.keys(sources).length;

    new Listbox({
        widget_element:    widget.element,
        div_element_class: 'div_widget_listbox_container',
        item_type:         'hierarchy',
        items:             hierarchies,
        property_names:    ['_id', '_name', '_type'],
        include_key:       false,
        kb:                kb,
        container_object:  'hierarchies',
        tree_type:         widget.options.tree_type,
        widget:            widget
    });

/*
    AKT.myListbox({
        widget_element:    widget.element,
        div_element_class: 'div_hierarchies',
        items:             hierarchies,
        //property_names:    ['_id', '_name','_type'],
        property_names:    ['_id'],
        include_key:       false
    });
*/
/* This is what used to happen (up to Dec 2022) - display of all hierarchy trees.
    $.each(hierarchies, function(id,hierarchy) {
        var hierarchy = hierarchies[id];
        var divTreetable = hierarchy.makeTreetableDiv(widget);
        var tableTreetable = hierarchy.makeTreetable(widget);
        var hierarchyType = widget.options.tree_type;
        var itemId = widget.options.item_id;
        console.log(itemId);
        $(widget.element).find('.div_hierarchies').append(divTreetable);
        $(divTreetable).append(tableTreetable);
        try {
            $(tableTreetable).treetable('reveal', itemId);
            var node = $(tableTreetable).treetable('node', itemId);
            $(node.row).css('background','yellow');
        }
        catch(err) {
        }
    });
*/

};



AKT.widgets.hierarchies.html = `
<div class="content" style="background:inherit; border:none;padding:15px;">

    <div class="w3-row div_widget_listbox_container"></div>

</div>     <!-- End of content div -->
`;




