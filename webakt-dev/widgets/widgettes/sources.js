AKT.widgets.sources = {};


AKT.widgets.sources.setup = function (widget) {

    var self = this;

    var kbId = widget.options.kbId;
    var kb = AKT.KBs[kbId];

    var sources = kb.findSources();
    var nSources = Object.keys(sources).length;

    //AKT.loadSelectOptions(widget.element, 'listbox_sources', sources, ['id','id']);

    $(widget.element).find('.div_nsources').text(nSources);

    var widgetSettings = $('<div></div>');
    $(widget.element).find('.content').prepend(widgetSettings);

    var kbSelectElement = AKT.makeReprocessSelector(widget.element, widget.widgetName,
        'Knowledge base', AKT.getKbIds(), AKT.state.current_kb, 'kbId');
    $(widgetSettings).append(kbSelectElement);


    // -----------------------------------------------------------------------------------
    // User Interaction event handlers

    $(widget.element).find('.button_ok').on('click', function (event) {   // The OK button
        console.debug('BUTTON: Clicked on sources OK button');
        event.stopPropagation();
        $('#dialog_Sources').css({display:'none'});   // TODO: Bring this up-to-date, with AKT.panelise()

        AKT.recordEvent({
            file:'sources.js',
            function:'AKT.widgets.sources.setup()',
            element:widget.element,
            finds:['.button_ok'],
            event:'click',
            value: '',
            message:'Clicked on the OK button in the sources panel.'
        });
        
    });


    $(widget.element).find('.button_viewxxx').on('click', function (event) {   // Details button
        console.log('BUTTON: Clicked on the View button');
        event.stopPropagation();

        console.log('>><< sources widget.options: ',widget.options);
        console.log($(widget.element).find('.tr_listbox').data('key'));

/*  Old method - use widget.options.sourceId
    Automatically calls the widget's diaplay() method.
        if (widget.options.sourceId) {
            var sourceId = widget.options.sourceId;
            var source = kb._sources[sourceId];
        }
*/
        // Alternative method: uses thefact that AKT.myListbox sets an
        // HTML data-key attribute for every <tr> element in the listbox.
        var sourceId = $(widget.element).find('.tr_listbox[data-selected="yes"]').data('key');
        if (!sourceId) {
            alert('Please first select a source from the list of sources.');
            return;
        }
        var source = kb._sources[sourceId];
        console.log(9999,source,kb);

        var panel = AKT.panelise({
            widget_name:'source_details',
            position:{left:'650px',top:'20px'},
            size:{width:'580px',height:'450px'},
            shift_key: event.shiftKey,
            options:{kbId:kbId, mode:'view', item_id:sourceId, type:source._type, source:source}
        });
        $('#'+panel._id).dialog_Generic('option', 'source', source);    // ???????


        AKT.recordEvent({
            file:'sources.js',
            function:'AKT.widgets.sources.setup()',
            element:widget.element,
            finds:['.button_view'],
            event:'click',
            value: sourceId,
            message:'Clicked on the View button in the sources panel.'
        });

    });


    $(widget.element).find('.button_edit').on('click', function (event) {   // Edit button
        console.log('BUTTON: Clicked on the Edit button');
        event.stopPropagation();

        console.log('>><< sources widget.options: ',widget.options);
        console.log($(widget.element).find('.tr_listbox').data('key'));

/*  Old method - use widget.options.sourceId
    Automatically calls the widget's diaplay() method.
        if (widget.options.sourceId) {
            var sourceId = widget.options.sourceId;
            var source = kb._sources[sourceId];
        }
*/
        // Alternative method: uses thefact that AKT.myListbox sets an
        // HTML data-key attribute for every <tr> element in the listbox.
        var sourceId = $(widget.element).find('.tr_listbox[data-selected="yes"]').data('key');
        if (!sourceId) {
            alert('Please first select a source from the list of sources.');
            return;
        }
        var source = kb._sources[sourceId];

        var panel = AKT.panelise({
            widget_name:'source_details',
            position:{left:'650px',top:'20px'},
            size:{width:'580px',height:'450px'},
            shift_key: event.shiftKey,
            options:{kbId:kbId, mode:'edit', item_id:sourceId, type:source._type, source:source}
        });
        $('#'+panel._id).dialog_Generic('option', 'source', source);    // ???????

        AKT.recordEvent({
            file:'sources.js',
            function:'AKT.widgets.sources.setup()',
            element:widget.element,
            finds:['.button_edit'],
            event:'click',
            value: sourceId,
            message:'Clicked on the Edit button in the sources panel.'
        });

    });



    $(widget.element).find('.button_new').on('click', function (event) {    // The New button
        console.debug('BUTTON: Clicked on the New button');
        event.stopPropagation();
        var id = $(widget.element).find('.mylistbox_sources').val();
        var source = sources[id];

        var eventShiftKey = event ? event.shiftKey : null;
        var panel = AKT.panelise({
            widget_name:'source_details',
            position:{left:'650px',top:'20px'},
            size:{width:'580px',height:'450px'},
            shift_key: event.shiftKey,
            options:{kbId:kbId, mode:'new', type:'person', source:null}
        });

        AKT.recordEvent({
            file:'sources.js',
            function:'AKT.widgets.sources.setup()',
            element:widget.element,
            finds:['.button_new_person'],
            event:'click',
            value: '',
            message:'Clicked on the New Person button in the sources panel.'
        });
    });


    $(widget.element).find('.button_deletexxx').on('click', function (event) {    // The Delete button
        event.stopPropagation();
        var optionValue = $('#sources400').val();
        var kbId = AKT.state.current_kb;
        var sources = AKT.getSources(kbId);  
        var sourceIndex = parseInt(optionValue);
        var source = sources[sourceIndex];
        var label = source.name+','+source.location+','+source.year+source.suffix;
        // This must be coditional on the event *NOT* being fired by event playback.
        //if (confirm('Confirm that you wish to remove the source:\n'+label)) {
        //    delete AKT.kbs[kbId].source_details[sourceIndex];
        //}

        AKT.recordEvent({
            file:'sources.js',
            function:'AKT.widgets.sources.setup()',
            element:widget.element,
            finds:['.button_delete'],
            event:'click',
            value: '',
            message:'Clicked on the Delete button in the sources panel.'
        });
    });


    // This event handler does not do what it says it does!
    $(widget.element).find('.button_link_to_statement').on('click', function (event) {    // The link_to_statement button
        event.stopPropagation();
        var optionValue = $(widget.element).find('.listbox_sources').val();
        var kbId = AKT.state.current_kb;
        //var sources =Id AKT.getSources(kbId);  
        var sourceIndex = parseInt(optionValue);
        //var source = sources[sourceIndex];

        // This must be coditional on the event *NOT* being fired by event playback.
        //if (AKT.state.current_statement) {
        //    var statement = AKT.state.current_statement;
        //    confirm('Sure you want to link the source '+optionValue+' to the statement '+statement._id+'?');
        //} else {
        //    alert('No statement currently selected.');
        //}

        AKT.recordEvent({
            file:'sources.js',
            function:'AKT.widgets.sources.setup()',
            element:widget.element,
            finds:['.button_link_to_statement'],
            event:'click',
            value: '',
            message:'Clicked on the Link-to-Statement button in the sources panel.'
        });

    });


    // Click on the 'Delete' button.
/*
    $(widget.element).find('.button_delete').on('click', function (event) {   // Statement new button
        console.log('BUTTON: Clicked on the sources Delete button');
        event.stopPropagation();
        var kbId = widget.options.kbId;
        var kb = AKT.KBs[kbId];

        var sourceId = $(widget.element).find('.tr_listbox[data-selected="yes"]').data('key');

        if (sourceId) {
            delete kb._sources[sourceId];
            AKT.trigger('source_deleted_event',{kb:kb,sourceId:sourceId});
        } else {
            alert('Please first select a source from the listbox.');
        }
    });
*/

    // Click on the 'Delete' button.
    $(widget.element).find('.button_delete').on('click', function (event) {   // Source Delete button
        console.log('BUTTON: Clicked on the sources Delete button');
        event.stopPropagation();
        var kbId = widget.options.kbId;
        var kb = AKT.KBs[kbId];
        widget.listbox.deleteCheckedIds();
        self.display(widget);
		kb.saveKbInLocalStorage();
    });


    // Custom event handlers
    $(document).on('new_source_created_event', function(event,args) {
        self.display(widget);
    });

    $(document).on('source_changed_event', function(event,args) {
        self.display(widget);
    });

    $(document).on('source_deleted_event', function(event,args) {
        self.display(widget);
    });
};


// ====================================================================================

AKT.widgets.sources.display = function (widget) {
    console.log('\n** STARTING sources.display **',widget.options);
/*
    var kbId = widget.options.kbId;
    var kb = AKT.kbs[kbId];

    var widgetContent = $(widget.element).find('.content');
    var sources = kb.sources;  
    var sourceIds = [];
    $.each(sources, function(i,source) {
        if (source) {
            sourceIds.push(source.id);
        }
    });
    AKT.loadOptions(widgetContent, 'select_sources', sourceIds, true);
*/

    var kbId = widget.options.kbId;
    var kb = AKT.KBs[kbId];

    var sources = kb.findSources();
    console.log(sources);
    var nSources = Object.keys(sources).length;


    new Listbox({
        widget_element:    widget.element,
        div_element_class: 'div_widget_listbox_container',
        item_type:         'source',
        items:             sources,
        property_names:    ['_id', '_name', '_type'],
        include_key:       false,
        kb:                kb,
        container_object:  'sources',
        widget:            widget
    });
/*
    widget.listbox = new Listbox({
        widget_element:    widget.element,
        div_element_class: 'mylistbox_sources',
        items:             sources,
        property_names:    ['_id', '_name', '_type'],
        include_key:       false,
        kb:                kb,
        container_object:  'sources'
    });
*/

/*
    // This has to go in display rather than setup, because we build the table after setup
    $(widget.element).find('.mylistbox_sources').find('.tr_listbox').on('click', function (event, value) {
        console.log(999);
        event.stopPropagation();
        // Needed this, since this.value is blank when triggered (in AKT.singleStep).
        //if (this.value === '') {
        //    var optionValue = value;
        //} else {
        //    optionValue = this.value;
        //}
        $(widget.element).find('.mylistbox_sources').find('.tr_listbox').css({background:'white'});
        $(widget.element).find('.mylistbox_sources').find('.tr_listbox:odd').css({background:'#d0d0d0'});
        $(this).css({background:'yellow'});
        var sourceId = $(this).attr('data-key');
        widget.options.sourceId = sourceId;   // Hacky...
        var source = kb._sources[sourceId];
        AKT.state.current_source = source;   // Note: the Source object, not its ID!
        console.log(source);
    });
*/

    $(widget.element).find('.div_nsources').text(nSources);
};


AKT.widgets.sources.html = `
<div class="content" style="border:none;background:inherit;padding:5px;padding-left:10px;">

    <!--div style="float:left;">
        <div>
            <div style="float:left;">Selected Source: </div>
            <div id="sources801" style="float:left;margin-left:5px;">None selected</div>
        </div>

        <div style="margin-bottom:20px;padding-bottom:20px;">
            <div style="clear:left;float:left;">Source Type: </div>
            <div id="sources802" style="float:left;"></div>
        </div>
    </div-->

    <div class="w3-row div_widget_listbox_container">
    </div>
    
    <div style="clear:both;"></div>

    <div style="float:right;">
        <div style="float:left;">Number of sources: </div>
        <div class="div_nsources" style="float:left;"></div>
    </div>

    <div style="float:left; text-align:center">
        <!--fieldset>
            <legend>New Source</legend>
            <button class="button_new" style="width:60px;height:20px;margin:5px;">New</button><br/>
            <input class="radio_interview" type="radio" group="source_type"><label>Interview</label><br/>
            <input class="radio_reference" type="radio" group="source_type"><label>Reference</label><br/>
        </fieldset-->
        <!--button class="button_ok" disabled style="width:65px;height:25px;margin:5px;">OK</button><br/>
        <button class="button_details" style="width:65px;height:25px;margin:5px;">Details</button><br/>
        <button class="button_delete" disabled style="width:65px;height:25px;margin:5px;">Delete</button><br/-->
    </div>
    
</div>     <!-- End of content div -->
`;



