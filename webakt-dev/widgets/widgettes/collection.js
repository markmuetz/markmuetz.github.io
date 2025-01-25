AKT.widgets.collection = {};


// ============================================================================
// The widget's settings.
// ============================================================================
AKT.widgets.collection.settings = {
    statement:{
        styles: [    // An array, to allow for multiple selector:css combinations
            {selector:'table tr:odd',
             default_css:{'background-color':'white','color':'black'},
             sample_css:{'background-color':'#d00','color':'#fff'},
             current_css:{'background-color':'white','color':'black'}
            }
        ]
    },  // End of statement settings
    source:{
        styles: [    // An array, to allow for multiple selector:css combinations
            {selector:'table tr:odd',
             default_css:{'background-color':'white','color':'black'},
             sample_css:{'background-color':'#d00','color':'#fff'},
             current_css:null    // Picked up from the Settings dialog
            }
        ]
    }   // End of source settings
};

// ============================================================================
// The widget's setup() function.
// ============================================================================
AKT.widgets.collection.setup = function (widget) {
    console.log('\n*** AKT.widgets.collection.setup(): widget=',widget);
    var self = this;

    var kbId = widget.options.kbId;
    var kb = AKT.KBs[kbId];

    var divWidgetSettings = $('<div></div>');
    $(widget.element).find('.content').prepend(divWidgetSettings);

    var selectElement = AKT.makeReprocessSelector(
        widget.element, 
        widget.widgetName,
        'KB', 
        AKT.getKbIds(), 
        AKT.state.current_kb, 
        'kbId',
        'kb');
    $(divWidgetSettings).append(selectElement);

    $(divWidgetSettings).append(`
        <div style="float:left; margin-left:20px;">
            <div style="float:left;">Filters:</div>
            <button class="button_show_hide" style="float:left;padding-left:3px;padding-right:3px;margin-left:5px;">Show</button>
            <button class="button_apply" style="float:left;padding-left:3px;padding-right:3px;margin-left:5px;">Apply</button>
            <button class="button_ignore" style="float:left;padding-left:3px;padding-right:3px;margin-left:5px;">Ignore</button>
        </div>
    `);
    $(divWidgetSettings).append('<div style="clear:both;"></div>');

    // ================================ FILTERING SECTION ==============================
    // "filters" are the actual filters the user has chosen.
    // "filterSettings" are the fixed characteristics of (potential) filters, like
    // their category and options.

    var itemType = widget.options.item_type;     // 'statement', 'source', ...

    if (!widget.options.filters) {
        widget.options.filters = {};
    }
    var filters = widget.options.filters;

    var collectionSpec = AKT.collection_specs[itemType];   // In collection_specs.js
    var filterSettings = collectionSpec.filters;

    var filters = widget.options.filters;
    if (!widget.options.filters) {
        widget.options.filters = {};
    }

    for (var categoryId in filterSettings) {
        var filterSetting = filterSettings[categoryId];

        if (!filterSetting.options) {
            filterSetting.options = [' '];
            var items = kb['_'+filterSetting.kb_collection];   // e.g. 'sources','formalTerms', etc
            for (var itemId in items) {
                filterSetting.options.push(itemId);
            }
        }

        var div_filter = AKT.makeFilterDiv({
            widget: widget,
            category: categoryId,
            options: filterSetting.options,
            control_type:filterSetting.control_type
        });
        $(widget.element).find('.div_filters').append(div_filter);
    }

    // ::::::::::::::::::::::::::End of filtering section :::::::::::::::::::::::::::::



    // -----------------------------------------------------------------------
    // User interaction event handlers

    $(widget.element).find('.button_apply').on('click',function () {
        event.stopPropagation();

        var categoryIds = Object.keys(collectionSpec.filters);
        var filters = {};
        for (var i=0; i<categoryIds.length; i++) {
            var categoryId = categoryIds[i];
            console.log(9501,categoryId,collectionSpec.filters[categoryId].control_type);
            var controlType = collectionSpec.filters[categoryId].control_type;

            //if (categoryId !== 'termtype') {  // TODO: Fix temporary hack to handle termtype as select element.
            if (controlType === 'checkboxes') {  
                console.log('\n',5001,i,categoryId,$(widget.element).find('.div_'+categoryId).find('input:checked'));
                var nChecked = $(widget.element).find('.div_'+categoryId).find('input:checked').length;  // Number of
                        // checked checkboxes for this category.
                if (nChecked > 0) {   // if no checkboxes for this category are checked, then omit this filter
                                      // altogether (so effect is same as having them all checked).
                    filters[categoryId] = {};  // Checked setting[s] for this category.  Each property will be one 
                        // of the category's options.  
                    for (var j=0; j<nChecked; j++) {
                        var optionId = $(widget.element).find('.div_'+categoryId).
                            find('input:checked')[j].dataset.option;
                        filters[categoryId][optionId] = true;
                    }
                }
            } else {    // For when category uses select element rather than checkboxes.
                var checked = $(widget.element).find('.div_'+categoryId).find('select').val();
                if (typeof checked==='string' && checked.length>0) {
                    optionId = checked;
                    filters[categoryId] = {};  
                    filters[categoryId][optionId] = true;
                } else if (typeof checked === 'array') {   // This is not an allowable value for typeof!??
                    // Should be Array.isArray(checked), surely?
                    nChecked = checked.length;
                    if (nChecked > 0) {   // if no checkboxes for this category are checked, then omit this filter
                                          // altogether (so effect is same as having them all checked).
                        filters[categoryId] = {};  
                        for (var j=0; j<nChecked; j++) {
                            optionId = checked[j];
                            filters[categoryId][optionId] = true;
                        }
                    }
                }
            }
        }
        widget.options.filters = filters;

/* 6th April 2024.  Commented out, because changes to widget.options.filters here was interfering with 
   settings in previous block of code.
        if (value === undefined) {   // The normal case - user using the user interface.
            widget.options.filters[included] = $(this).prop('checked');
        } else {                     // Playback of recorded actions.
            if (value === true) {
                widget.options.filters[included] = true;
                $(this).prop('checked',true);
            } else {
                widget.options.filters[included] = false;
                $(this).prop('checked',false);
            }
        }
*/
        // Can't see any reason for using this original, convoluted, method for calling display():
        // $(widget.element).dialog_Generic('option', 'filters', widget.options.filters);
        // so replaced with following, direct, way of calling display().
        AKT.widgets.collection.display(widget);
        $(widget.element).blur();
    });        


    // Simple way to toggle show/hide for filter block.
    $(widget.element).find('.button_show_hide').on('click', function() {
        if ($(this).text()==='Show') {
            $(widget.element).find('.div_filters').css({display:'block'});
            $(this).text('Hide');
        } else {
            $(widget.element).find('.div_filters').css({display:'none'});
            $(this).text('Show');
        }
    });


    // Ignore all filters.
    $(widget.element).find('.button_ignore').on('click', function() {
        widget.options.filters = {};
        AKT.widgets.collection.display(widget);
    });


    // ===================================================================================
    // Buttons to invoke operations on the Listbox (New/view/Edit/Delete/SelectAll/Invert)

    $(widget.element).find('.button_new').on('click', function (event) {   // View button
        console.log('\n*** Click event on New button');
        event.stopPropagation();

        if (itemType === 'topic') {
            // NO!  Mechanism for creating a new topic is currently (Nov 2024) via the 
            //      Boolean search panel.
            //      Note that the topic ID is sent to the Statements filter, not the Boolean expression.
            alert('You currently cannot create a new Topic this way.\nPlease got to the Boolean Search command in the KB menu.');
        } else {
            openDetailsPanel(widget,'new');
        }
    });


    $(widget.element).find('.button_view').on('click', function (event) {   // View button
        console.log('\n*** Click event on View button');
        event.stopPropagation();
        openDetailsPanel(widget,'view');
    });


    $(widget.element).find('.button_edit').on('click', function (event) {   // Edit button
        console.log('\n*** Click event on Edit button');
        event.stopPropagation();

        openDetailsPanel(widget,'edit');
    });


    $(widget.element).find('.button_delete').on('click', function (event) {   // Delete button
        console.log('\n*** Click event on Delete button');
        console.log(widget.options);
        event.stopPropagation();

        var kbId = AKT.state.current_kb;
        var kb = AKT.KBs[kbId];

        var itemType = widget.options.item_type;
        var kbCollectionId = AKT.collection_specs[itemType].plural;  // I.e. 'statement' becomes 'statements'

        var itemIds = widget.listbox.findCheckedIds();

        for (var i=0; i<itemIds.length; i++) {
            var itemId = itemIds[i];
            delete kb['_'+kbCollectionId][itemId];
        }

        // This event is not implemented yet.
        AKT.trigger(itemType+'_deleted_event',{ 
	        item_type:  itemType,
	        item_id:    itemIds[0]});

        // I'm using this as a temporary measure.
        AKT.trigger('item_changed_event',{kb:kb,item_type:itemType});

        AKT.saveKbInLocalStorage(kbId);
    });


    // Button Select_all
    $(widget.element).find('.button_select_all').on('click', function (event) {   // Select_all button
        widget.listbox.selectAll();
    });


    // Button Deselect_all
    $(widget.element).find('.button_deselect_all').on('click', function (event) {   // Select_all button
        widget.listbox.deselectAll();
    });


    // Button Invert
    // Inverting the checked status of items is useful for deleting all but a few.
    // The code is a cunning way to do this inverting.  
    // We fits set the data-checked HTML attribute to false for all checkboxes.
    // We then set it to true for those that are currently checked, and then set their checked property to be false.
    // Finally, we set the checked property to be true for all the rest.
    $(widget.element).find('.button_invert').on('click', function (event) {   // Select_all button
        widget.listbox.invertChecked();
    });


    // =====================================================================================
    // Functions to undertake operations on the Listbox (New/view/Edit/Delete/SelectAll/Invert)

    function openDetailsPanel(widget,mode)  {

        var itemType = widget.options.item_type;

        var kbId = kb._id;

        if (mode==='view' || mode==='edit') {
            var selectedItemIds = widget.listbox.findCheckedIds();

            if (selectedItemIds.length === 0) {
                alert('Please select one '+itemType+' from the list.');
                return;

            } else if (selectedItemIds.length >1) {
                alert('You can only select one '+itemType+' from the list.');
                return;
            }
            var itemId = selectedItemIds[0];  // Temporary hack: only uses one selected item.

        } else {
            itemId = null;  // When mode='new'
        }

        // This is a way of allowing us to set options that are specific to a particular
        // type of item.
        // So, if itemType = 'statement', then this sets the custom option 'statement' to the
        // item itself, i.e. a particular statement.  This means that, when the user clicks 
        // the View or Edit button, the relevant xxx_details panel gets the item it is 
        // expecting.    For example, if the Listbox is in the statements panel, then the
        // statement_details panel is created when the user clicks View or Edit, and the 
        // widget.options object contains the property 'statement', whose value is the
        // currently-selected statement.

        // TODO: Add the collection name (the key used in the KB) as another
        // argument for the new Listbox call.

        // Replace following by two lookup tables: one for getting the items (i.e. the 
        // name for the collection in the KB); and one for the widget name.
        // Do not use the first one if mode='new' (so itemId is null).
        if (itemType === 'formal_term') {           
            var items = kb._formalTerms;
            var widgetName = 'formal_term_details';

        } else if (itemType === 'object_hierarchy') { 
            items = kb._objectHierarchies;
            widgetName = 'hierarchy_details';

        } else if (itemType === 'topic_hierarchy') {
            items = kb._topicHierarchies;
            widgetName = 'hierarchy_details';

        } else {
            var items = kb['_'+itemType+'s'];
            widgetName = itemType+'_details';
        }
        if (itemId) {
            var item = items[itemId]; 
        }  

        var options = {kbId:kbId, mode:mode, item_type:itemType, item_id:itemId, item:item};

        var panel = AKT.panelise({
            widget_name:  widgetName,
            position:     {left:'650px',top:'20px'},
            size:         {width:'580px',height:'450px'},
            shift_key:    event.shiftKey,
            options:      options
        });
    }

    findCheckedIdsxxx = function () {
        var itemKeys = [];
        var checkedInputs = $(this.divElement).find('input:checked');
        console.log('===++',checkedInputs);
        for (var i=0; i<checkedInputs.length; i++) {
            var checkedInput = checkedInputs[i];
            var itemKey = $(checkedInput).parent().parent().attr('data-key');
            itemKeys.push(itemKey);
        }
        return itemKeys;
    }

    deleteCheckedIdsxxx = function () {
        var kbId = AKT.state.current_kb;
        var kb = AKT.KBs[kbId];

        console.log('***',widget.options);
        //var containerObject = this.args.container_object;
        var itemType = widget.options.item_type;

        //var itemKeys = [];
        //var checkedInputs = $(this.divElement).find('input:checked');
        var checkedInputs = widget.listbox.findCheckedIds();
        console.log('+++',checkedInputs);
        // Replace following by two lookup tables: one for getting the items (i.e. the 
        // name for the collection in the KB); and one for the widget name.
        // Do not use the first one if mode='new' (so itemId is null).
        if (itemType === 'formal_term') {           
            var items = kb._formalTerms;
            var widgetName = 'formal_term_details';

        } else if (itemType === 'object_hierarchy') { 
            items = kb._objectHierarchies;
            widgetName = 'hierarchy_details';

        } else if (itemType === 'topic_hierarchy') {
            items = kb._topicHierarchies;
            widgetName = 'hierarchy_details';

        } else {
            var items = kb['_'+itemType+'s'];
            widgetName = itemType+'_details';
        }
        console.log('...',items);

        var deletedItems = [];
        for (var i=0; i<checkedInputs.length; i++) {
            var checkedInput = checkedInputs[i];
            console.log(i,checkedInput);
            //var itemKey = $(checkedInput).parent().parent().attr('data-key');
            var itemKey = checkedInput;
            console.log(itemKey);
            deletedItems.push(items[itemKey]);
            delete items[itemKey];
        }
        //AKT.trigger('items_deleted_event',{kb:kb,item_type:'statement',deleted_items:deletedItems});
        self.display(widget);
    }


    invertCheckedxxx = function () {
       $(this.divElement).find('input[type=checkbox]').attr('data-checked',false);
       $(this.divElement).find('input[type=checkbox]:checked').attr('data-checked',true).prop('checked',false);
       $(this.divElement).find('input[type=checkbox][data-checked=false]').prop('checked',true);
    }


    selectAllxxx = function () {
            $(this.divElement).find('input[type=checkbox]').prop('checked',true);
    }


    deselectAllxxx = function () {
            $(this.divElement).find('input[type=checkbox]').prop('checked',false);
    }


/*
    // Open statements panel and display all statements containing the selected term.
    $(widget.element).find('.button_statements').on('click', function (event) {    // The Statements button
        console.debug('BUTTON: Clicked on formal_term Statements button');
        event.stopPropagation();
        var kbId = widget.options.kbId;
        var termType = widget.options.term_type;
        var formalTermId = $(widget.element).find('.select_formalterms').val();

        var eventShiftKey = event ? event.shiftKey : null;

        var panel = AKT.panelise({
            widget_name:'statements',
            position:{left:'400px',top:'20px'},
            size:{width:'600px',height:'500px'},
            shift_key: event.shiftKey,
            options:{kbId:kbId, simple_filter_word:formalTermId}
        });

        AKT.recordEvent({
            file:'collection.js',
            function:'AKT.widgets.collection.setup()',
            element:widget.element,
            finds:['.button_statements'],
            event:'click',
            value: formalTermId,
            message:'Clicked on the Statements button in the collection panel.'
        });
    });
*/

    // ?? Left in for legacy reasons...
    $(widget.element).find('.legend_formal_term_type').on('click', function (event) {    // Ghost click target for tutorial
        console.log('BUTTON: Clicked on legend_formal_term_type');
        //$(widget.element).find('.select_formalterms option[value="esre"]').attr('selected',true);
/*
        event.stopPropagation();
        var kbId = widget.options.kbId;
        var termType = widget.options.term_type;
        var termName = $(widget.element).find('.select_formalterms').val();

*/
    });


    function scrollToBottom() {
       var scrollBottom = Math.max($('#Table0').height() - $('#myDiv').height() + 20, 0);
       $('#myDiv').scrollTop(scrollBottom);
    }
    //$(document).ready( scrollToBottom );

    // Custom event handlers
    // Note that we do *NOT* handle other housekeeping tasks here, such as updating the KBs
    // and saving to Local Storage.   This is because those tasks need to be done where the 
    // event is triggered, to ensure that it is done once and not more than once.

    $(document).on('new_item_created_event', function(event,args) {
        if (args.item_type && args.item_type===widget.options.item_type) {
            self.display(widget);
        }
    });

    $(document).on('item_changed_event', function(event,args) {
        if (args.item_type && args.item_type===widget.options.item_type) {
            self.display(widget);
        }
    });

    $(document).on('items_deleted_eventxxx', function(event,args) {
        if (args.item_type && args.item_type===widget.options.item_type) {
            self.display(widget);
        }
    });


    // This event is triggered in Panel.js, when the user clicks on the Panel's
    // Settings icon (the cogwheel).    Its code clears the current contents of 
    // the dialog, and adds in a heading for the widget type (or the collection 
    // type, if it is a collection).
    $(document).on('created_widget_settings_dialog_event', function(event,args) {
        console.log('##1 created_widget_settings_dialog_event',args);
        if (true || args.item_type && args.item_type===widget.options.item_type) {
            console.log('##2 created_widget_settings_dialog_event',args);
            $('#div_settings_container').css({display:'block'});
            var settingsDiv = $('#div_settings_container').find('.div_settings');
            $(settingsDiv).empty();

            $(settingsDiv).append('<p style="margin:0px;line-height:1;">Listbox<br/>properties</p>');
            var collectionSpec = AKT.collection_specs[args.item_type];   // In collection_specs.js
            var selectElement = $('<select multiple="true" size="8"></select>');
            $(settingsDiv).append(selectElement);
            $(selectElement).focus();

            for (var propId in collectionSpec.properties) {
                var prop = collectionSpec.properties[propId];
                if (prop.listbox) {
                    $(selectElement).append('<option selected>'+propId+'</option>');
                } else {
                    $(selectElement).append('<option>'+propId+'</option>');
                }
            }

            var tableAlternateRowsCheckbox = $(`
                <div class="div_table_alternate_rows">
                    <div>Table alternate_rows</div>
                    <input type="checkbox" name="scales" />
                </div>
            `);
            //$(settingsDiv).append(tableAlternateRowsCheckbox);
            
            var divStyle = $(`
                <div class="div_style" style="padding-top:10px;padding-bottom:10px;">
                    <div>
                        <div style="float:left;width:145px;">Selector</div>
                        <div style="float:left;width:150px;">CSS</div>
                    </div>
                    <input class="input_style_selector" type="text" title="table tr:odd" value="table tr:odd"/>
                    <input class="input_style_css" type="text" title='{"background-color":"#d00","color":"#fff"}' value='{"background-color":"#d00","color":"#fff"}' />
                </div>
            `);
            $(settingsDiv).append(divStyle);


            $('#div_settings_container').find('.button_cancel').on('click', function() {
                $(settingsDialog).empty();
                $(settingsDialog).css({display:'none'});
            });
            

            $('#div_settings_container').find('.button_ok').on('click', function() {
                var properties = AKT.collection_specs[args.item_type].properties;
                for (var propertyId in properties) {
                    if (properties.hasOwnProperty(propertyId)) {
                        properties[propertyId].listbox = false;
                    }
                }
                // Note that selectedProperties is an array, since the select element has multiple=true.
                var selectedProperties = $('#div_settings_container').find('select').val();
                // See js/collection_specs.js to see the specs for the item_type collection.
                for (var i=0;i<selectedProperties.length;i++) {
                    AKT.collection_specs[args.item_type].properties[selectedProperties[i]].listbox = true;
                }
                $('#div_settings_container').css({display:'none'});
                var widge = $('#'+args.panel_id)[args.dialog_id]('instance');
                AKT.widgets.collection.display(widge);

/*
                var styles = AKT.widgets.collection.settings['statement'].styles[0];
                if ($(tableAlternateRowsCheckbox).find('input').prop('checked')) {
                    // Temporary:
                    styles.current_css = styles.sample_css;
                    $(widget.element).find(styles.selector).css(styles.current_css);
                } else {
                    $(widget.element).find(styles.selector).css(styles.default_css);
                }
*/
                var styleSelector = $('#div_settings_container').find('.input_style_selector').val();
                var styleCss = $('#div_settings_container').find('.input_style_css').val();
                console.log(styleSelector,styleCss);
                if (styleSelector && styleCss) {
                    var cssObject = JSON.parse(styleCss);
                    $(widget.element).find(styleSelector).css(cssObject);
                }
                $('#div_settings_container').empty();
                $('#div_settings_container').css({display:'none'});
            });

            self.display(widget);
        }
    });


};


// ============================================================================
// The widget's display() function.
// ============================================================================
AKT.widgets.collection.display = function (widget) {

    console.log('\n*** AKT.widgets.collection.display(): options=',options);
    var options = widget.options;
    
    var itemType = options.item_type;   // 'statement', 'source', ....
    var collectionSpec = AKT.collection_specs[itemType];

    var widgetContent = $(widget.element).find('.content');

    var kbId = widget.options.kbId;
    var kb = AKT.KBs[kbId];

    // TODO: Fix to fit in with the generic "collections" approach.
    if (options.statement) {   //Gets formal terms for one single statement
        var statement = options.statement; 
        var formalTerms = statement.findFormalTerms();  

    } else {  // Gets items for the whole knowledge base, filtered.
        var items = kb.getCollection(itemType,options.filters);
    }

/*
    var extendedFormalTermStrings = [];
    for (var id in formalTerms) {
        if (formalTerms[id]._synonyms.length === 0) {
            extendedFormalTermStrings.push(id);
        } else {
            synonymsString = JSON.stringify(formalTerms[id]._synonyms);
            extendedFormalTermStrings.push(id+': '+synonymsString+'');
        }
    }    
*/    
    var nItems = Object.keys(items).length;

    if (itemType === 'statement') {
        var statements = kb._statements;
        for (id in statements) {
            var statement = statements[id];
            statement._english = statement.makeEnglishFromJson();
        }
    }

    var listboxProps= [];
    for (var propId in collectionSpec.properties) {
        var prop = collectionSpec.properties[propId];
        if (prop.listbox) {
            //listboxProps.push('_'+propId);
            listboxProps.push(propId);
        }
    }

    if (itemType==='object_hierarchy' || itemType==='topic_hierarchy') {
        var itemType = 'hierarchy';
    }
    widget.listbox = new Listbox({
        widget_element:    widget.element,
        div_element_class: 'div_widget_listbox_container',
        item_type:         itemType,
        items:             items,
        property_names:    listboxProps,
        include_key:       false,
        kb:                kb,
        container_object:  'collection',
        widget:            widget
    });

    $(widgetContent).find('.div_nitems').text(nItems);

   //$(widgetElement).draggable({containment:'#workspace',handle:".titlebar"});
    //$(widgetElement).css({display:'block'});

};


// ============================================================================
// The widget's HTML.
// ============================================================================

AKT.widgets.collection.html = `
<div class="content" style="background:inherit; border:none; padding-left:15px;padding-right:15px;">

    <div class="div_filters" style="display:none;"></div>

    <div class="w3-col w3-right w3-container" style="width:75px;margin:15px;">
        <button class="button_new" style="width:70px;height:27px;">New</button><br/>
        <button class="button_view" style="width:70px;height:27px;">View</button><br/>
        <button class="button_edit" style="width:70px;height:27px;">Edit</button><br/>
        <button class="button_delete" style="width:70px;height:27px;">Delete</button>
        <button class="button_select_all" style="width:70px;height:27px;">Select all</button>
        <button class="button_deselect_all" style="width:70px;height:27px;">Deselect all</button>
        <button class="button_invert" style="width:70px;height:27px;">Invert</button>
    </div>

    <div class="w3-rest w3-container div_widget_listbox_container"></div>

    <div style="display:none;margin-top:12px;">
        <div class="label" style="float:left;">Number of terms:</div>
        <div class="number" style="float:left;margin-left:10px;"></div>
    </div>
</div>     <!-- End of content div -->
`;



AKT.widgets.collection.settings_html = `
<div>
    <div>Title</div>

    <div class="content" style="background:inherit; border:none; padding-left:15px;padding-right:15px;">

        <div class="div_settings">
            <select class="select_properties_to_display" multiple="true" size="5">
                <option value="type">Type</option>
                <option value="valid">Valid</option>
                <option value="conditional">Conditional</option>
                <option value="has_source>">Has source</option>
            </select>
        </div>

    </div>     <!-- End of content div -->
</div>
`;


