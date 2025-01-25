// TODO TODO Shift event hadlers into the setup() section.



AKT.widgets.topic_details = {};


AKT.widgets.topic_details.setup = function (widget) {
    var kbId = widget.options.kbId;
    var kb = AKT.KBs[kbId];

    // ================================================ NEW/VIEW/EDIT CUSTOMISATION

    // We modify the display of some elements (depending on mode=new/view/edit) 
    // here, at widgie creation time.  This will do for the time being, but may have
    // to be shifted to the display function if/when we allow the same panel to be
    // used repeatedly (instead of creating a new one each time, as now).
    // Note: the 'modal' class indicates that the display style for the element 
    // depends on the mode (i.e. new,view or edit).
    var mode = widget.options.mode;
    if (mode === 'new'){
        $(widget.element).find('.div_id').attr('disabled',false);
        $(widget.element).find('.button_update').attr('disabled',false);

    } else if (mode === 'view'){
        $(widget.element).find('div').attr('contenteditable',false);
        $(widget.element).find('.div_id').attr('readonly',true);
        $(widget.element).find('.button_statements').attr('disabled',false);
        $(widget.element).find('.button_update').css({display:'none'});

    } else if (mode === 'edit'){
        $(widget.element).find('.div_id').attr('contenteditable',true);
        $(widget.element).find('.div_id').attr('readonly',true);
        $(widget.element).find('.div_id').css({background:'#e0e0e0'});
        $(widget.element).find('.button_update').attr('disabled',false);
    }

    // ----------------------------------------------------------------------------------

    // TODO: fix this inconsistency; and add in type checking, error message etc
    if (widget.options.topic) { // The formal term object
        var topic = widget.options.topic; 
    } else if (widget.options.item_id) {   // The formal term id
        var topic = kb._topics[widget.options.item_id]; 
    }
/*
    $(widget.element).find('.button_in_hierarchy').on('click', function() {
        console.log('Clicked on topic In hierarchy button');
        var kbId = widget.options.kbId;
        var kb = AKT.kbs[kbId];
        console.log(topic);
        var eventShiftKey = event ? event.shiftKey : null;
        var panel = new Panel('dialog_Generic',
            eventShiftKey, 
            {left:'20px',top:'20px',width:'450px',height:'540px'}, 
            {widget_name:'hierarchy_tree', kbId:AKT.state.current_kb, tree_type:'topic',item_id:topic._id});
    });
*/

    $(widget.element).find('.button_in_hierarchy').on('click', function() {
        event.stopPropagation();
        console.debug('Clicked on topic_details In hierarchy button');
        var kbId = widget.options.kbId;
        var kb = AKT.KBs[kbId];

        var nodeId = widget.options.item_id;
        var hierarchies = kb._topicHierarchies;
        console.log('+++',hierarchies);

        var hierarchyId = null;
        $.each(hierarchies, function(id,hierarchy) {
            var hier = hierarchies[id];
            var nodes = hier.getAllDescendants(hier._root);
            if (nodes.includes(nodeId)) {
                console.log('yes!',nodeId,'is in',hier._id);
                hierarchyId = hier._id;
            } else {
                console.log('no!',nodeId,'is not in',hier._id);
            }
        });

        hierarchy = hierarchies[hierarchyId];
        console.log('hierarchy:',hierarchy);

/*        var panel = AKT.panelise({
            widget_name:'hierarchy_details',
            position:{left:'20px',top:'20px'},
            size:{width:'450px',height:'540px'},
            shift_key: event.shiftKey,
            options:{kbId:kbId, tree_type:'topic', hierarchy:hierarchy, type:'xxxx', item_id:topic._id}
        });
*/
            var panel = AKT.panelise({
                widget_name:'hierarchy_details',
                position:{left:'20px',top:'20px'},
                size:{width:'450px',height:'540px'},
                shift_key: event.shiftKey,
                //options:{kbId:kbId, mode:'view', tree_type:'topic', item_type:'topic_hierarchy', item:hierarchy, item_id:hierarchyId, extra:tempFormalTerm._id}
                options:{kbId:kbId, mode:'view', tree_type:'topic', item_type:'topic_hierarchy', item:hierarchy, item_id:hierarchyId}
            });

        AKT.recordEvent({
            file:'topic_details.js',
            function:'AKT.widgets.topic_details.setup()',
            element:widget.element,
            finds:['.button_in_hierarchy'],
            event:'click',
            value: topic._id,
            message:'Clicked on the In Hierarchy button in the topic_details panel.'
        });
    });


    $(widget.element).find('.button_update').on('click', function() {
        var kbId = widget.options.kbId;
        var kb = AKT.KBs[kbId];
        var id = $(widget.element).find('.div_id').text();
        var searchExpression = $(widget.element).find('.div_search_expression').text();
        var description = $(widget.element).find('.div_description').text();
        var objects = 'object';
        var topic = new Topic({id:id,description:description,search_expression:searchExpression,objects:objects});
        widget.topic = topic;
        kb._topics[id] = topic;
        //AKT.trigger('new_topic_created_event',{kb:kb,topic:topic});

        console.log(3501,topic);
        if (widget.options.mode==='new') {
            AKT.trigger('new_item_created_event',{kb:kb,item_type:'topic',item:topic});
        } else if (widget.options.mode==='edit') {
            AKT.trigger('item_changed_event',{kb:kb,item_type:'topic',item:topic});
        }
		AKT.saveKbInLocalStorage(kbId);
        $('#message').text('KB has been updated with new Topic with ID '+id+'.');
    });
};


AKT.widgets.topic_details.display = function (widget) {
    console.log('AKT.widgets.topic_details.display: ',widget.options);
    var kbId = widget.options.kbId;
    var kb = AKT.KBs[kbId];


    if (widget.options.mode === 'new') {
        $(widget.element).find('.div_search_expression').text(widget.options.search_expression);

    } else {
        // TODO: fix this inconsistency; and add in type checking, error message etc
        if (widget.options.item) { // The topic object
            var topic = widget.options.item; 
        } else if (widget.options.item_id) {   // The topic id
            topic = kb._topics[widget.options.item_id]; 
        }
        $(widget.element).find('.div_id').text(topic._id);
        $(widget.element).find('.div_search_expression').text(topic._search_term);
        $(widget.element).find('.div_description').text(topic._description);

        // TODO: Need to rename the _objects property!  It's really confusing...
        var objectCategories = topic._objects.split('+');  // object, objects+subobjects, object+superobjects
        $(widget.element).find('.checkbox_object').prop('checked', false);
        $(widget.element).find('.checkbox_subobjects').prop('checked', false);
        $(widget.element).find('.checkbox_superobjects').prop('checked', false);
        for (var i=0; i<objectCategories.length; i++) {
            if (objectCategories[i] === 'object') {
                $(widget.element).find('.checkbox_object').prop('checked', true);
            } else if (objectCategories[i] === 'subobjects') {
                $(widget.element).find('.checkbox_subobjects').prop('checked', true);
            } else if (objectCategories[i] === 'superobjects') {
                $(widget.element).find('.checkbox_superobjects').prop('checked', true);
            }
        }
    }


    function getTopic(topicName) {
        for (var i=0; i<kb.topics.length; i++) {
            if (kb.topics[i].name === topicName) {
                return kb.topics[i];
            }
        }
        return null;
    };

/*
    $(widget.element).find('.button_statements').on('click', function() {
        event.stopPropagation();
        console.debug('Clicked on topic_details Statements button');
        var kbId = widget.options.kbId;
        var kb = AKT.kbs[kbId];

        console.log(topic);
        var eventShiftKey = event ? event.shiftKey : null;
        var panel = new Panel('dialog_Generic', 
            eventShiftKey, 
            {left:'650px',top:'20px',width:'580px',height:'550px'},
            {widget_name:'statements', kbId:kbId, filters:{topic:true,topic_value:topic._id}});
    });

    $(widget.element).find('.button_diagram').on('click', function() {
        event.stopPropagation();
        console.debug('Clicked on topic_details diagram button');
        var kbId = widget.options.kbId;
        var kb = AKT.kbs[kbId];
        
        console.log('kb',kb);
        console.log('topic',topic);
        //var kbId = AKT.state.current_kb;
        //var kb = AKT.KBs[kbId];
        //var title = $('#load_diagram_local_storage_title').text();

        var diagram = new Diagram('diagram_from_topic','systo');
        AKT.state.current_diagram = diagram;  // The object, not the ID

        // Confusingly, Chromolaena is the topic name for acheampong.
        diagram.convertCausalToSysto(topic._id);

        //diagram.graphLayoutCola();  // Work on using cola stopped when I found that
        // springy did a good job with orphan subgraphs and links.
        console.log(AKT.state);
        diagram.graphLayoutSpringy(widget);
    });
*/
    $(widget.element).find('.button_statements').on('click', function() {
        event.stopPropagation();
        var kbId = widget.options.kbId;
        var kb = AKT.kbs[kbId];

        console.log(4441,widget.options);

        if (widget.topic){
            var topic = widget.topic;
        } else if (widget.options.item) {
            var topic = widget.options.item;
        } else {
            alert('Please click the Update button first.');
        }

        var eventShiftKey = event ? event.shiftKey : null;

        var panel = AKT.panelise({
            widget_name:'collection',
            position:{left:'20px',top:'20px'},
            size:{width:'550px',height:'540px'},
            shift_key: eventShiftKey,
            options:{kbId:AKT.state.current_kb,item_type:'statement',filters:{topic:{[topic._id]:true}}}
        });
    });


};


AKT.widgets.topic_details.html = `
<div class="content" style="background:inherit; margin:15px;border:none;">

    <div>
        <div style="float:left;width:40px;height:20px;">Topic</div>
        <div class="div_id" contenteditable style="float:left;width:220px;height:20px;border:1px solid #808080;background:white;"></div>
    </div>


    <fieldset>
        <legend>Boolean Search String</legend>
        <div class="div_search_expression" contenteditable style="width:250px;height:50px;border:1px solid #808080;background:white;"></div>
    </fieldset>

    <div>
        <fieldset style="float:left;">
            <legend>Search Mode</legend>
            <input class="checkbox checkbox_object" type="checkbox">
            <label for="topicDetail200">object</label><br/>

            <input class="checkbox checkbox_subobjects" type="checkbox" disabled>
            <label for="topicDetail201">subobjects</label><br/>

            <input class="checkbox checkbox_superobjects" type="checkbox" disabled>
            <label for="topicDetail202">superobjects</label><br/>
        </fieldset>
        <div style="clear:both;"></div>
    </div>

    <fieldset>
        <legend>Description</legend>
        <div class="div_description" conteteditable style="width:250px;height:130px;border:1px solid #808080;background:white;"></div>
    </fieldset>

    <button class="button_statements" style="width:80px;height:25px;" title="Show all statements for this topic.">Statements</button>
    <button class="button_in_hierarchy" style="width:80px;height:25px;" title="Show this topic in the topic hierarchies.">In hierarchy</button>
    <button class="button_update" style="width:80px;height:25px;" title="Update the KB">Update KB</button>
    <button class="button_diagram" style="display:none;width:140px;height:35px;" title="Generate and display the causal diagram for all causal statements for this topic.">Diagram</button>

</div>     <!-- End of content div -->
`;



