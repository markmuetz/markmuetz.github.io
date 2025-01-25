AKT.widgets.formal_terms = {};


// ============================================================================
// The widget's settings.
// ============================================================================

AKT.widgets.formal_terms.settings = {
    width:'400px',
    height:'260px',
    filters:{
        termtype:{
            control_type:'dropdown',
            options:['','action','attribute','comparison','link','object','process','value']
        },
        language:{
            control_type:'checkboxes',
            options:['english','french','latin','local']
        },
        has_memo:{
            control_type:'checkboxes',
            options: ['yes','no']
        },
        has_definition:{
            control_type:'checkboxes',
            options: ['yes','no']
        },
        has_images:{
            control_type:'checkboxes',
            options: ['yes','no']
        },
        has_synonyms:{
            control_type:'checkboxes',
            options: ['yes','no']
        },
        has_statements:{
            control_type:'checkboxes',
            options: ['yes','no'],
        }
    }
};


// ============================================================================
// The widget's setup() function.
// ============================================================================
AKT.widgets.formal_terms.setup = function (widget) {
    console.log(8001,widget);
    console.log(8002,this.settings);
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
    if (!widget.options.filters) {
        widget.options.filters = {};
    }
    var filters = widget.options.filters;

    var filterSettings = this.settings.filters;
    for (var categoryId in filterSettings) {
        var filterSetting = filterSettings[categoryId];
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
               
        var categoryIds = Object.keys(self.settings.filters);
        var filters = {};
        for (var i=0; i<categoryIds.length; i++) {
            var categoryId = categoryIds[i];

            if (categoryId !== 'termtype') {  // TODO: Fix temporary hack to handle termtype as select element.
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
                } else if (typeof checked === 'array') {
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
        AKT.widgets.formal_terms.display(widget);
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
        AKT.widgets.formal_terms.display(widget);
    });


    // View selected formal_term.
    $(widget.element).find('.button_view').on('click', function (event) {    // The Details button
        console.debug('BUTTON: Clicked on formal_term View button');
        event.stopPropagation();

        var formalTermId = $(widget.element).find('.tr_listbox[data-selected="yes"]').data('key');
        if (formalTermId) {
            var formalTerm = kb._formalTerms[formalTermId];

            AKT.recordEvent({
                file:'formal_terms.js',
                function:'AKT.widgets.formal_terms.setup()',
                element:widget.element,
                finds:['.button_view'],
                event:'click',
                value: formalTermId,
                message:'Clicked on .button_view in formal_terms.js.'});

            var panel = AKT.panelise({
                widget_name:'formal_term_details',
                position:{left:'650px',top:'20px'},
                size:{width:'580px',height:'450px'},
                shift_key: event.shiftKey,
                options:{kbId:kbId, mode:'view', formal_term:formalTerm, item_id:formalTerm._id}
            });
        } else {
            alert('Please first select a formal term from the listbox.');
        }
    });


    // Edit selected term.
    $(widget.element).find('.button_edit').on('click', function (event) {    // The Edit button
        console.debug('BUTTON: Clicked on formal_term Edit button');
        event.stopPropagation();

        var formalTermId = $(widget.element).find('.tr_listbox[data-selected="yes"]').data('key');
        if (formalTermId) {
            var formalTerm = kb._formalTerms[formalTermId];

            AKT.recordEvent({
                file:'formal_terms.js',
                function:'AKT.widgets.formal_terms.setup()',
                element:widget.element,
                finds:['.button_edit'],
                event:'click',
                value: formalTermId,
                message:'Clicked on .button_edit in formal_terms.js.'});

            var thisWidget = 'formal_term';
            var panel = AKT.panelise({
                widget_name:thisWidget+'_details',
                position:{left:'650px',top:'20px'},
                size:{width:'580px',height:'450px'},
                shift_key: event.shiftKey,
                options:{kbId:kbId, mode:'edit', formal_term:formalTerm}
            });
        } else {
            alert('Please first select a formal term from the listbox.');
        }
    });


    //Create new selected term.
    $(widget.element).find('.button_new').on('click', function (event) {    // The New button
        console.debug('BUTTON: Clicked on formal_term New button');
        event.stopPropagation();
        var kbId = widget.options.kbId;

        var panel = AKT.panelise({
            widget_name:'formal_term_details',
            position:{left:'650px',top:'20px'},
            size:{width:'580px',height:'450px'},
            shift_key: event.shiftKey,
            options:{kbId:kbId, mode:'new'}
        });
    });


    // Delete selected term(s) (Note: can be more than one).
    $(widget.element).find('.button_delete').on('click', function (event) {    // The Delete button
        console.debug('BUTTON: Clicked on formal_term Delete button');
        event.stopPropagation();
        var kbId = widget.options.kbId;
        alert('I am sorry, but I cannot currently let you delete a formal term.\nThis would invalidate all the statements that contain that term.\n');
    });


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
            file:'formal_terms.js',
            function:'AKT.widgets.formal_terms.setup()',
            element:widget.element,
            finds:['.button_statements'],
            event:'click',
            value: formalTermId,
            message:'Clicked on the Statements button in the formal_terms panel.'
        });
    });


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
    $(document).on('new_formalterm_created_event', function(event,args) {
        self.display(widget);
    });

    $(document).on('formalterm_changed_event', function(event,args) {
        self.display(widget);
    });

};


// ============================================================================
// The widget's display() function.
// ============================================================================
AKT.widgets.formal_terms.display = function (widget) {

    console.log(7200,widget.options);

    var widgetContent = $(widget.element).find('.content');

    var kbId = widget.options.kbId;
    var kb = AKT.KBs[kbId];

    var options = widget.options;    
    if (options.statement) {   //Gets formal terms for one single statement
        var statement = options.statement; 
        var formalTerms = statement.findFormalTerms();  

    } else {  // Gets formal terms for the *whole knowledge base*, filtered.
        var filters = options.filters;
        formalTerms = kb.findFormalTerms(filters);
    }

    var extendedFormalTermStrings = [];
    for (var id in formalTerms) {
        if (formalTerms[id]._synonyms.length === 0) {
            extendedFormalTermStrings.push(id);
        } else {
            synonymsString = JSON.stringify(formalTerms[id]._synonyms);
            extendedFormalTermStrings.push(id+': '+synonymsString+'');
        }
    }        
    var nFormalTerms = Object.keys(formalTerms).length;

    new Listbox({
        widget_element:    widget.element,
        div_element_class: 'div_widget_listbox_container',
        item_type:         'formal_term',
        items:             formalTerms,
        property_names:    ['_id', '_type'],
        include_key:       false,
        kb:                kb,
        container_object:  'formal_terms',
        widget:            widget
    });

    $(widgetContent).find('.div_nsources').text(nFormalTerms);

   //$(widgetElement).draggable({containment:'#workspace',handle:".titlebar"});
    //$(widgetElement).css({display:'block'});

};


// ============================================================================
// The widget's HTML.
// ============================================================================

AKT.widgets.formal_terms.html = `
<div class="content" style="background:inherit; border:none; padding-left:15px;padding-right:15px;">

    <div class="div_filters" style="display:none;"></div>

    <div class="w3-row div_widget_listbox_container"></div>

    <div style="display:none;margin-top:12px;">
        <div class="label" style="float:left;">Number of terms:</div>
        <div class="number" style="float:left;margin-left:10px;"></div>
    </div>
</div>     <!-- End of content div -->
`;



