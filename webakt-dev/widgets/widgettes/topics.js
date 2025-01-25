AKT.widgets.topics = {};


AKT.widgets.topics.setup = function (widget) {
    console.log('^^^',JSON.stringify(widget.options));
    console.log('^^^',widget.options);
    var widgetSettings = $('<div></div>');
    $(widget.element).append(widgetSettings);
    var kbId = widget.options.kbId;
    var kb = AKT.KBs[kbId];

    var widgetContent = $(widget.element).find('.content');

    var widgetSettings = $('<div></div>');
    $(widget.element).append(widgetSettings);

    var kbSelectElement = AKT.makeReprocessSelector(widget.element, widget.widgetName,
        'Knowledge base', AKT.getKbIds(), AKT.state.current_kb, 'kbId');
    $(widgetSettings).append(kbSelectElement);

    console.log(kb._topicHierarchies);
    var hierarchyIds = ['all'];
    $.each(kb._topicHierarchies, function(id,hierarchy) {
        hierarchyIds.push(id);
    });

    var selectElement = AKT.makeReprocessSelector(widget.element, widget.widgetName,
        'Topic hierarchy', hierarchyIds, 'all', 'hierarchyId');
    $(widgetSettings).append(selectElement);

    $(widget.element).append(widgetContent);

/*
    var hierarchies = ['all'];
    $.each(kb._topicHierarchies, function(id,hierarchy) {
        hierarchies.push(id);
    });
    AKT.loadOptions(widgetContent,'listbox_hierarchies', hierarchies);
*/

    $(widget.element).css({display:'block'});
    $(widget.element).draggable();

    // EVENT HANDLERS
    $(widgetContent).find('.listbox_hierarchies').on('change', function () {
        event.stopPropagation();
        var kbId = widget.options.kbId;
        var kb = AKT.KBs[kbId];
        var hierarchyValue = $(widget.element).find('.listbox_hierarchies').val();
        widget.options.filters = {hierarchy_value:hierarchyValue};
        $(widget.element).dialog_Generic('option', 'filters', widget.options.filters);
        $(widget.element).blur();
    });


    $(widget.element).find('.button_view').on('click', function (event, value) {    
        event.stopPropagation();
        var kbId = widget.options.kbId;
        var kb = AKT.KBs[kbId];

        //var topicId = $(widget.element).find('.listbox_topics').val();
        //var topic = kb._topics[topicId];
        var topicId = $(widget.element).find('.tr_listbox[data-selected="yes"]').data('key');
        var topic = kb._topics[topicId];
        console.log('topicId, topic: ',topicId,topic,kb._topics);

        var panel = AKT.panelise({
            widget_name:'topic_details',
            position:{left:'650px',top:'20px'},
            size:{width:'580px',height:'450px'},
            shift_key: event.shiftKey,
            options:{kbId:kbId, mode:'view', topic:topic,item_id:topic._id}
        });

        $('#'+panel._id).dialog_Generic('option', 'topic', topic);

    });


    $(widget.element).find('.button_edit').on('click', function (event, value) {    
        event.stopPropagation();
        var kbId = widget.options.kbId;
        var kb = AKT.KBs[kbId];

        //var topicId = $(widget.element).find('.listbox_topics').val();
        //var topic = kb._topics[topicId];
        var topicId = $(widget.element).find('.tr_listbox[data-selected="yes"]').data('key');
        var topic = kb._topics[topicId];
        console.log('topicId, topic: ',topicId,topic,kb._topics);

        var panel = AKT.panelise({
            widget_name:'topic_details',
            position:{left:'650px',top:'20px'},
            size:{width:'580px',height:'450px'},
            shift_key: event.shiftKey,
            options:{kbId:kbId, mode:'edit', topic:topic}
        });

        $('#'+panel._id).dialog_Generic('option', 'topic', topic);
    });


    $(widget.element).find('.button_new').on('click', function (event) {    // The New button
        console.debug('BUTTON: Clicked on topic New button');
        event.stopPropagation();
        var kbId = widget.options.kbId;
        var kb = AKT.KBs[kbId];
/*
        var panel = AKT.panelise({
            widget_name:'topic_details',
            position:{left:'650px',top:'20px'},
            size:{width:'580px',height:'450px'},
            shift_key: event.shiftKey,
            options:{kbId:kbId, mode:'new'}
        });

        $('#'+panel._id).dialog_Generic('option', 'topic', topic);
*/
        alert('To create a new topic...\nGo to KB > Boolean search, enter a search expression, then click the "Create Topic" button.\n\nThis is a temporary measure until a better way is designed following discussions with the AKT team.');
    });


};


AKT.widgets.topics.display = function (widget) {
    console.log('\n** STARTING statements.display **',widget.options);
    var kbId = widget.options.kbId;
    var kb = AKT.KBs[kbId];

    var widgetContent = $(widget.element).find('.content');

/*
    if (widget.options.filters) {
        var filters = widget.options.filters;
    } else {
        filters = {};
    }

    if (filters.hierarchyId) {
        var hierarchyId = filters.hierarchyId;
        $(widget.element).find('.listbox_hierarchies option[value="'+hierarchyId+'"]').prop('selected',  true);
    }
*/

    var options = widget.options;    
    if (options.statement) {   //Gets formal terms for one single statement.  TODO: fix for topics!
        var statement = options.statement; 
        var formalTerms = statement.findFormalTerms();  

    } else {  // Gets topics for the *whole knowledge base*, filtered
        if (options.hierarchyId) {
            var hierarchyId_filter = options.hierarchyId;
        } else {
            hierarchyId_filter = 'all';
        }
        topics = kb.findTopics({hierarchyId:hierarchyId_filter});
    }

    new Listbox({
        widget_element:    widget.element,
        div_element_class: 'div_widget_listbox_container',
        item_type:         'topic',
        items:             topics,
        property_names:    ['_id','_search_term'],
        include_key:       false,
        kb:                kb,
        container_object:  'topics',
        widget:            widget
    });

    $(widget.element).draggable({containment:'#workspace',handle:".titlebar"});
    $(widget.element).css({display:'block'});

};

AKT.widgets.topics.html = `
<div class="content" style="background:inherit; padding:10px;border:none;">

    <div class="w3-row div_widget_listbox_container"></div>

    <div style="clear:both;"></div>
</div>
`;



