class Panel {

    constructor(dialogId, shiftKey, size, options, calledFromPanelise) {
        if (!calledFromPanelise) {
            console.log('\n*** ATTENTION *** newPanel() not called from AKT.panelise()!  Widgette: ',options.widget_name);
        }
        console.log('\n\n=================================================================\n*** Class Panel: constructor: dialogId=',dialogId,'; options=',options);

        this._dialogId = dialogId;
        this._shiftKey = shiftKey;
        this._size = size;
        this._options = options;
        var self = this;

        AKT.state.panels_counter.total += 1;
        this._index = AKT.state.panels_counter;
        //var side = (this._index-1) % 2;    // 0 or 1
        var subname = options.widget_name;
        console.log(9200,options);
        if (subname === 'hierarchies') {
            subname = options.tree_type+'_hierarchies';
        } else if (subname === 'hierarchy_details') {
            subname = options.item_type+'_details';
        }

        // For collections.   So, the old 'statements' now becomes 'statement_collection'.
        if (options.widget_name === 'collection') {
            subname = options.item_type+'_collection';
        }
        
        var titleColours = {
            summary:'#d5dbdb',
            metadata:'#aeb6bf',
            statements:'#e6b0aa',
            statement_details:'#f5b7b1',
            sources:'#d7bde2',
            source_details:'#d2b4de',
            formal_terms:'#a9cce3',
            formal_term_details:'#aed6f1',
            object_hierarchies:'#a3e4d7',
            object_hierarchy_details:'#a2d9ce',
            topics:'#a9dfbf',
            topic_details:'#abebc6',
            topic_hierarchies:'#f9e79f',
            topic_hierarchy_details:'#fad7a0',
            unused1:'#f5cba7',
            unused2:'#edbb99'
        }

        if (titleColours[subname]) {
            var titleColour = titleColours[subname];
        } else {
            titleColour = '#abb2b9';
        }

        if (subname.includes('_details')) {   // TODO: Fix this hack
            var side = 1;
            AKT.state.panels_counter.right += 1;
            var column_counter = AKT.state.panels_counter.right;
        } else {
            side = 0;
            AKT.state.panels_counter.left += 1;
            column_counter = AKT.state.panels_counter.left;
        }
        var offset = column_counter*10;  // both horizontal and vertical
        var left = side*600 + offset;
        var top = 40+offset*2;

        var zindex = AKT.incrementZindex('Panel.js: constructor. dialogId:',panelId,'\nOptions:',options);

        //var settings = AKT.widgets[options.widget_name].settings;

/*
        if (!AKT.state.panel_counter[subname]) {
            AKT.state.panel_counter[subname] = 1;
            var panelId = subname + '_1';

            // Use this one if attempt (below) to autofit the panel's <div> around its elements fails.
            //$('#workspace').append('<div id="'+panelId+'" class="panel dialog" style="position:absolute;display:block;left:'+size.left+';top:'+size.top+';width:'+settings.width+';height:'+settings.height+';"></div>');

            var panelDiv = $('<div id="'+panelId+'" class="panel dialog" style="z-index:'+zindex+'; position:absolute; display:block; left:'+left+'px; top:'+top+'px;"></div>');
            $(panelDiv).resizable();
            $('#workspace').append(panelDiv);
            //$('#'+panelId)[dialogId]({visible:true, kbId:AKT.state.current_kb});


            // This is where widget instance is actually created.
            var widgetInstance = $('#'+panelId)[dialogId](options);
            var widge = $('#'+panelId)[dialogId]('instance');
            console.log(112,widgetInstance);
            console.log(114,$(widgetInstance));
            console.log(115,widge);

            $('#'+panelId).on('click',function() {
                var zindex = AKT.incrementZindex("menu_handlers.js: AKT.menuHandler.menu_kb_statements()");
                $(this).css('z-index',zindex);
            });
            $('#'+panelId).on('drag',function() {
                var zindex = AKT.incrementZindex("menu_handlers.js: AKT.menuHandler.menu_kb_statements()");
                $(this).css('z-index',zindex);
            });
            $('#'+panelId).on('start',function() {
                var zindex = AKT.incrementZindex("menu_handlers.js: AKT.menuHandler.menu_kb_statements()");
                $(this).css('z-index',zindex);
            });

        } else {
            AKT.state.panel_counter[subname] += 1;
            panelId = subname + '_' + AKT.state.panel_counter[subname];
            console.debug('panelId rest: ',panelId);
            //$('#workspace').append('<div id="'+panelId+'" class="panel dialog" style="position:absolute;display:block;left:75px;top:70px;width:580px;height:580px;"></div>');

            // Use this one if attempt (below) to autofit the panel's <div> around its elements fails.
            //$('#workspace').append('<div id="'+panelId+'" class="panel dialog" style="position:absolute;display:block;left:'+size.left+';top:'+size.top+';width:'+settings.width+';height:'+settings.height+';"></div>');

            var panelDiv = $('<div id="'+panelId+'" class="panel dialog" style="z-index:zindex; ; position:absolute; display:block; left:'+left+'px;top:'+top+'px;"></div>');
            $('#workspace').append(panelDiv);
            $('#'+panelId)[dialogId](options);
            $('#'+panelId).on('click',function() {
                var zindex = AKT.incrementZindex("menu_handlers.js: AKT.menuHandler.menu_kb_statements()");
                $(this).css('z-index',zindex);
            });
        }
*/

        if (!AKT.state.panel_counter[subname]) {
            AKT.state.panel_counter[subname] = 0;
        }
        AKT.state.panel_counter[subname] += 1;
        var panelId = subname + '_' + AKT.state.panel_counter[subname];
        AKT.state.panel_last_of_type[subname] = this;
        var panelIdDisplay = panelId;
        if (panelId.includes('_details')) {   // TODO: Fix this hack
            panelIdDisplay = panelId + ' ('+options.kbId+':'+options.item_id+')';
        } else {
            panelIdDisplay = panelId + ' ('+options.kbId+')';
        }
        // Use this one if attempt (below) to autofit the panel's <div> around its elements fails.
        //$('#workspace').append('<div id="'+panelId+'" class="panel dialog" style="position:absolute;display:block;left:'+size.left+';top:'+size.top+';width:'+settings.width+';height:'+settings.height+';"></div>');

        if (subname ==='diagram_details') {
            left = 50;
            top = 50;
        }
        if (subname ==='node_details') {
            left = 300;
            top = 60;
        }

        var panelDiv = $('<div id="'+panelId+'" class="panel dialog" style="z-index:'+zindex+'; position:absolute; display:block; left:'+left+'px; top:'+top+'px;"></div>');
        $('#workspace').append(panelDiv);
        $(panelDiv).resizable();
        $(panelDiv).draggable({handle:".titlebar",containment:"#workspace"});

        $('#panel_list').append('<div class="'+panelId+'" style="float:left;background:#e0e0e0;font-size:10px;margin-right:11px;">'+panelIdDisplay+'</div> ');

        // So, what is happening here is that sometimes we need to somehow constrain the width of the panel.
        // The trigger example is for the statements widgette, which has an AKT.myListbox which we want to
        // expand width-wise when the user re-sizes the panel: we ise w3.css class="res" for this.   Without
        // any constraint, it makes the myListbox table very wide (>2000px).
        // We could pass in the optional initial width when we create the panel, but then we would have to do
        // that every time we create (for example) a statements panel.   So instead we have this hack...
        if (options.widget_name === 'statements') {
            //$(panelDiv).css({width:'600px'});  
            $(panelDiv).resizable('option', 'handles', 'e,s');
            $(panelDiv).resizable('option', 'minHeight', 300);
        } else if (options.widget_name === 'sources') {
            $(panelDiv).css('width','600px');  
            $(panelDiv).resizable('option', 'handles', 'e,s');
            $(panelDiv).resizable('option', 'minHeight', 300);
        } else if (options.widget_name === 'metadata') {
            $(panelDiv).css('width','600px');  
            $(panelDiv).resizable('option', 'handles', 'e');
        } else if (options.widget_name === 'statement_details') {
            //$(panelDiv).css('width','570px');  
            $(panelDiv).resizable('option', 'handles', 'e');
        }

        // Make titlebar, including panel Close button.
        var titlebarDiv = $('<div class="w3-row titlebar" style="height:21px; background:'+titleColour+'; padding:2px;border-bottom:solid 1px black;font-size:12px;"></div>');
        var closeButtonDiv = ('<div class="w3-right dialog_close_button" style="width:18px;max-height:20px;background:#e0e0e0; margin-right:5px;" title="Close panel"><b>X</b></div>');
        var minimiseButtonDiv = ('<div class="w3-right dialog_minimise_button" style="width:18px;max-height:17px;font-size:20px;background:#e0e0e0; margin-right:5px;"><div style="font-size:20px;margin-top:-16px;height:40px;" title="Minimise panel"><b>_</b></div></div>');
        var helpButtonDiv = ('<div class="w3-right dialog_help_button" style="width:18px;max-height:20px;background:#e0e0e0; margin-right:5px;" title="Help"><b>?</b></div></div>');
        var settingsButtonDiv = ('<div class="w3-right dialog_settings_button" style="width:18px;max-height:20px;background:#e0e0e0; margin-right:5px;" title="Settings"><b>&#x2699</b></div></div>');

        var panelLabel = panelId;
        var titleDiv = $('<div class="w3-rest" style="text-align:center;">'+panelIdDisplay+'</div>');
        $(titlebarDiv).append(closeButtonDiv).append(minimiseButtonDiv).append(settingsButtonDiv).append(helpButtonDiv).append(titleDiv);
        $(panelDiv).append(titlebarDiv);

        // **** THIS IS WHERE WIDGET INSTANCE IS ACTUALLY CREATED ****
        // Note that dialogId is almost always 'dialog_Generic'.  The name of the particular widgette
        // is passed in as an option.
        // Assigning the result to 'widgetInstance', and seeing what an instance lloks like in 'widge',
        // is purely for informing mself on the dfference between the two.

        var widgetInstance = $('#'+panelId)[dialogId](options);

        var widge = $('#'+panelId)[dialogId]('instance');
        // 'widge' is exactly the same as 'this' or 'self' in the code for a widget, or 'widget' in the code
        // for a widgette.   
        // 'widgetInstance' is exactly the same as 'widge.element[0]'.
        // So, I am not sure what 'widgetInstance' actually is.    But it seems like in general I need to
        // treat 'widge' as the widget instance.
        // Un-comment the following 2 lines to check it out.
        //console.log('widgetInstance: ',widgetInstance);
        //console.log('widge         : ',widge);

        $('#'+panelId).on('click',function(event) {
            event.stopPropagation();
            var zindex = AKT.incrementZindex('Panel.js: click. dialogId:',panelId,'\nOptions:',options);
            $(this).css('z-index',zindex);
        });

        $('#'+panelId).on('mousedown',function(event) {
        event.stopPropagation();
        var zindex = AKT.incrementZindex('Panel.js: start. dialogId:',panelId,'\nOptions:',options);
            $(this).css('z-index',zindex);
        });

        $('#panel_list').find('.'+panelId).on('click',function() {
            var zindex = AKT.incrementZindex('Panel.js: click. dialogId:',panelId,'\nOptions:',options);
            $('#'+panelId).css({display:'block','z-index':zindex});
        });

        $('#'+panelId).find('.dialog_minimise_button').on('click', function () {
            $('#'+panelId).css({display:'none'});
        });

        $('#'+panelId).find('.dialog_close_button').on('click', function () {
            $('#panel_list').find('.'+panelId).remove();
            $('#'+panelId).remove();
            $('#'+panelId)[dialogId]('destroy');
            $('#'+panelId).css({display:'none'});
        });

        $('#div_help').on('click',function() {
            $(this).css({display:'none'});
        });

        $('#'+panelId).find('.dialog_help_button').on('click', function () {
            var helpname = helpName(subname);
            $('#div_help').html($('#ref_'+helpname).html());
            $('#div_help').css({display:'block'});

            function helpName(subName) {
                var helpNameLookup = {
                    formal_terms:'formal_term_collection',
                    images:'image_collection',
                    object_hierarchies:'object_hierarchy_collection',
                    statements:'statement_collection',
                    sources:'source_collection',
                    topics:'topic_collection',
                    topic_hierarchies:'topic_hierarchy_collection'
                }
                if (helpNameLookup[subName]) {
                    return helpNameLookup[subname];
                } else {
                    return subName;
                }
            }
        });



        $('#'+panelId).find('.dialog_settings_button').on('click', function () {
            console.log(options);
            console.log('Clicked on settings button for ',subname);
            console.log('item_type = ',options.item_type);

            // The settings dialog is specific to the widget type, or the collection
            // type if it is a collection.   Therefore, all we do here is to empty
            // the Settings dialog, then insert the heading for it, a blank div
            // for holding the widget-specific settings, and the cancel button.
            // The OK button-handling code is not added here, since it can involve some 
            // widget-specific processing (as is the case with setting the collection
            // properties to be shown as columns in the Listbox table).

            var settingsDialog = $('#div_settings_container');
            $(settingsDialog).empty();
            $(settingsDialog).append('<h5>Settings for '+subname+'</h5>');

            // The following div is for the widget-specific settings themselves, to be
            // inserted by each widget as appropriate..
            $(settingsDialog).append('<div class="div_settings")</div>');
            $(settingsDialog).append('<button class="button_cancel">Cancel</button>');
            $(settingsDialog).append('<button class="button_ok">OK</button>');
            $(settingsDialog).css({display:'block'});

            AKT.trigger('created_widget_settings_dialog_event',{ 
                panel_id: panelId,
                dialog_id: dialogId,
	            item_type:  'statement'
	        });
        });


/*
            $(widget.element).find('.w3-right').on('click', function () {
                AKT.recordEvent({
                    file:'dialog_Generic.js',
                    function:'createEmptyWidget()',
                    event:'click',
                    element:widget.element,
                    finds:['.dialog_close_button'],
                    message:'Clicked on the generic widgette close button'
                });
                $(widget.element).css({display:"none"});
            });
*/

        $('buttonxxx').on('click', function (event) {
            console.log('EVENT: button-click ', $(panelDiv).attr('id'), event.target.classList[0]);
            var step1 = {
                eventType:'highlight',
                selector:'#'+$(panelDiv).attr('id')+' .'+event.target.classList[0]
            };
            var step2 = {
                eventType:'click',
                selector:'#'+$(panelDiv).attr('id')+' .'+event.target.classList[0]
            };
            AKT.eventRecord.push(step1);
            AKT.eventRecord.push(step2);
        });

        // Disabled while trying to sort out problem with editing table in diagram dialog
        $('trXXXX').on('click', function (event) {
            console.log('EVENT: tr-click ', $(panelDiv).attr('id'), event.target.classList[0],event);
            var step1 = {
                eventType:'highlight',
                selector:'#'+$(panelDiv).attr('id')+' .'+event.target.classList[0]
            };
            var step2 = {
                eventType:'click',
                selector:'#'+$(panelDiv).attr('id')+' .'+event.target.classList[0]
            };
            AKT.eventRecord.push(step1);
            AKT.eventRecord.push(step2);
        });

        $('selectXXX').on('change', function (event) {
            console.log('EVENT: select-change ', $(panelDiv).attr('id'), event.target.classList[0]);
            var step1 = {
                eventType:'highlight',
                selector:'#'+$(panelDiv).attr('id')+' .'+event.target.classList[0]
            };
            var step2 = {
                eventType:'click',
                selector:'#'+$(panelDiv).attr('id')+' .'+event.target.classList[0]
            };
            AKT.eventRecord.push(step1);
            AKT.eventRecord.push(step2);
        });

        // --------------------------------------------------------------------------
        // Dec 2022 Trying to revive doing event-recording in Panelise() !

        $('button:not(.inwidget_recording)').on('click', function (event) {
            var panelId = $(panelDiv).attr('id');
            var elementClass = event.target.classList[0];

            var action = new Action({
                element_id: widge.element[0].id,
                selector:   '.'+elementClass,
                type:       'click',
                message:    'Panel.js constructor: Clicked on button with class '+elementClass+' in '+panelId+'.',
                prompt:     'Click on the <b>'+event.target.innerText+'</b> button in the '+panelId+' panel.'
            });

            AKT.action_list.add(action);   // Only actually does add it if (AKT.state.event_recording && !AKT.state.playing_events) is true.
        });


        $('select').on('change', function (event) {
            var panelId = $(panelDiv).attr('id');
            var elementClass = event.target.classList[0];
            var selectedOption = $(widge.element).find('.'+elementClass).find(":selected").val();

            var action = new Action({
                element_id: widge.element[0].id,
                selector:   '.'+elementClass,
                type:       'change',
                value:      selectedOption,
                message:    'Panel.js constructor: Clicked on select with class '+elementClass+' in '+panelId+
                            ' with option '+selectedOption+'.'
            });

            console.log('action: ',action);
            AKT.action_list.add(action);   // Only actually does add it if (AKT.state.event_recording && !AKT.state.playing_events)
        });

        $('input').on('change', function (event) {
            var panelId = $(panelDiv).attr('id');
            var elementClass = event.target.classList[0];
            var selectedOption = $(widge.element).find('.'+elementClass).val();
            var checked = $(widge.element).find('.'+elementClass).is(':checked');

            if ($("#isAgeSelected").is(':checked')) {
                var checkedxxx = true;
            } else {
                checkedxxx = false;
            }

            var action = new Action({
                element_id: widge.element[0].id,
                selector:   '.'+elementClass,
                type:       'change',
                value:      checked,
                message:    'Panel.js constructor: Clicked on input with class '+elementClass+' in '+panelId+
                            ' with value '+checked+'.'
            });

            AKT.action_list.add(action);   // Only actually does add it if (AKT.state.event_recording && !AKT.state.playing_events)

        });

        this._id = panelId;
        return this;
    }
}

        


