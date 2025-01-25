AKT.widgets.statements = {};

AKT.widgets.statements.settings = {
    width:'400px',
    height:'260px',
    filters:{
        type:{
            control_type:'checkboxes',
            options:['att_value','causal','comparison']
        },
        conditional:{
            control_type:'checkboxes',
            options: ['yes','no']
        },
        formal_term:{
            control_type:'dropdown',
            options: ['']
        },
        source:{
            control_type:'dropdown',
            options: ['']
        },
        topic:{
            control_type:'dropdown',
            options: ['']
        }
    }
};

AKT.widgets.statements.setup = function (widget) {
    console.log('widget/setup (statements) options:',widget.options);
    var self = this;
    var divWidgetSettings = $('<div></div>');
    $(widget.element).find('.content').prepend(divWidgetSettings);
    var kbId = widget.options.kbId;
    var kb = AKT.KBs[kbId];

    var kbSelectElement = AKT.makeReprocessSelector(widget.element, widget.widgetName,
        'Knowledge base', AKT.getKbIds(), AKT.state.current_kb, 'kbId');
    $(divWidgetSettings).append(kbSelectElement);

    // Start of filtering experimental section, April 2024.
    // AKT.makeFilterDiv() makes the container and the checkboxes needed for a particular filter 
    // category, and is (currently) located in webakt.js.
    // The event handler that responds to checkbox events is below:
    // $(widget.element).find('.checkbox_included').on('change', function (event,value) {...});

    $(divWidgetSettings).append(`
        <div style="float:left; margin-left:20px;">
            <div style="float:left;">Filters:</div>
            <button class="button_show_hide" style="float:left;padding-left:3px;padding-right:3px;margin-left:5px;">Show</button>
            <button class="button_apply" style="float:left;padding-left:3px;padding-right:3px;margin-left:5px;">Apply</button>
            <button class="button_ignore" style="float:left;padding-left:3px;padding-right:3px;margin-left:5px;">Ignore</button>
        </div>
    `);
    $(divWidgetSettings).append('<div style="clear:both;"></div>');

    var filters = widget.options.filters;
    if (!widget.options.filters) {
        widget.options.filters = {};
    }

    var filterSettings = this.settings.filters;

    // Populate formal_term, source and topic filters.
    for (var id in kb._formalTerms) {
        filterSettings.formal_term.options.push(id);
    }
    for (var id in kb._sources) {
        filterSettings.source.options.push(id);
    }
    for (var id in kb._topics) {
        filterSettings.topic.options.push(id);
    }

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

    // End of filtering experimental setion.

/*
    var div_filter_type = AKT.makeFilterDiv({
        widget: widget,
        category: 'type',
        options: ['att_value','causal','comparison']
    });
    $(widget.element).find('.div_filters').append(div_filter_type);

    var div_filter_language = AKT.makeFilterDiv({
        widget: widget,
        category: 'conditional',
        options: ['no','yes']
    });
    $(widget.element).find('.div_filters').append(div_filter_language);

 
    if (widget.options.term_type) {
        var term_type_filter = widget.options.term_type;
    } else {
        term_type_filter = 'all';
    }
    if (widget.options.use) {
        var use_filter = widget.options.use;
    } else {
        var use_filter = 'all';
    }
    if (widget.options.topic) {
        var topic_filter = widget.options.topic;
    } else {
        var topic_filter = 'all';
    }

    var formalTerms = kb.findFormalTerms({term_type:term_type_filter,use:use_filter});
    AKT.loadSelectOptions(widget.element, 'listbox_formal_terms', formalTerms, ['id','id']);

    var sources = kb.findSources({});
    AKT.loadSelectOptions(widget.element, 'listbox_sources', sources, ['id','id']);

    var topics = kb.findTopics({});
    AKT.loadSelectOptions(widget.element, 'listbox_topics', topics, ['id','id']);

    var nodeNames = kb.findNodeNames();   
    AKT.loadSelectOptions(widget.element, 'listbox_node_names', nodeNames, ['id','id']);
*/

    // ============================================================================
    // EVENT HANDLERS
    // The following events are handled:
    // 1. Change in any checkbox (with options for the formal_term and source checkboxes).
    // 2. Change in the 'formal term types' listbox.
    // 3. Change in the 'formal terms' listbox.
    // 4. Change in the 'sources' listbox.
    // 5. Change in the statements listbox.
    // 6. Click on the 'New' button.
    // 7. Click on the 'View' button.


    // 1. Change in any checkbox (with options for the formal_term and source checkboxes).
    // We can handle checkboxes generically, since we just pick up the value associated 
    // with it (e.g. 'att_value' and its checked/unchecked state, and use this to filter
    // statements and refresh the list of selected statements.

    // Event handlers for filters
    // =============================


    $(widget.element).find('.button_show_hide').on('click', function() {
        if ($(this).text()==='Show') {
            $(widget.element).find('.div_filters').css({display:'block'});
            $(this).text('Hide');
        } else {
            $(widget.element).find('.div_filters').css({display:'none'});
            $(this).text('Show');
        }
    });


    $(widget.element).find('.button_apply').on('click', function (event,value) {
        event.stopPropagation();
               

        var categoryIds = Object.keys(self.settings.filters);
        var filters = {};
/*
        for (var i=0; i<categoryIds.length; i++) {
            var categoryId = categoryIds[i];
            console.log('\n',5001,i,categoryId,$(widget.element).find('.div_'+categoryId).find('input:checked'));
            var nChecked = $(widget.element).find('.div_'+categoryId).find('input:checked').length;  // Number of checked
                    // checkboxes for this category.
            console.log(5002,nChecked);
            if (nChecked > 0) {   // if no checkboxes for this category are checked, then omit this filter
                                  // altogether (so effect is same as having them all checked).
                console.log(5003,$(widget.element).find('.div_'+categoryId).find('input'));
                filters[categoryId] = {};  // Checked setting[s] for this category.  Each property will be one 
                    // of the category's options.  
                for (var j=0; j<nChecked; j++) {
                    console.log(5004,$(widget.element).find('.div_'+categoryId).find('input:checked')[j]);
                    var optionId = $(widget.element).find('.div_'+categoryId).find('input:checked')[j].dataset.option;
                    console.log(5005,categoryId,optionId);
                    filters[categoryId][optionId] = true;
                }
            }
        }
*/
        var filters = {};
        for (var i=0; i<categoryIds.length; i++) {
            var categoryId = categoryIds[i];

            if (categoryId === 'type' || categoryId === 'conditional') {  // TODO: Fix temporary hack to handle termtype as select element.
                console.log('\n',5001,i,categoryId,$(widget.element).find('.div_'+categoryId).find('input:checked'));
                var nChecked = $(widget.element).find('.div_'+categoryId).find('input:checked').length;  // Number of checked
                        // checkboxes for this category.
                console.log(5002,nChecked);
                if (nChecked > 0) {   // if no checkboxes for this category are checked, then omit this filter
                                      // altogether (so effect is same as having them all checked).
                    console.log(5003,$(widget.element).find('.div_'+categoryId).find('input'));
                    filters[categoryId] = {};  // Checked setting[s] for this category.  Each property will be one 
                        // of the category's options.  
                    for (var j=0; j<nChecked; j++) {
                        console.log(5004,$(widget.element).find('.div_'+categoryId).find('input:checked')[j]);
                        var optionId = $(widget.element).find('.div_'+categoryId).find('input:checked')[j].dataset.option;
                        console.log(5005,categoryId,optionId);
                        filters[categoryId][optionId] = true;
                    }
                }
            } else {    // Section to handle when category uses select element rather than checkboxes.
                var checked = $(widget.element).find('.div_'+categoryId).find('select').val();
                console.log(7030,checked);
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
            console.log(7031,filters);
        }
        //var filters1 = JSON.parse(JSON.stringify(filters));
        //console.log(5007,filters1);
        widget.options.filters = filters;
        console.log(5008,widget.options.filters);

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
        AKT.widgets.statements.display(widget);
        $(widget.element).blur();
    });        






    // This is generalised for the 5 "Include..." checkboxes relating to characteristics of each
    // statement that should be *included* in the statements listbox.
    $(widget.element).find('.checkbox_includedxxx').on('change', function (event,value) {
        event.stopPropagation();
               
        var included = $(this).val();   // This is how we generalise this event handler.
        // Values are att_val, causal, comparison, conditional and nonconditional.

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

        //$(widget.element).dialog_Generic('option', 'filters', widget.options.filters);
        AKT.widgets.statements.display(widget);
        $(widget.element).blur();
    });        


    // Avoiding over-generalising "Restrict to..." checkboxes - handling each one separately
    $(widget.element).find('.checkbox_formal_term').on('change', function (event,value) {
        event.stopPropagation();

        if (value) {
            widget.options.filters.formal_term = value;
        } else {
            widget.options.filters.formal_term = $(this)[0].checked;
        }

        var filterTypeValue = $(widget.element).find('.listbox_formal_terms').val();
        
        //widget.options.filters.formal_term = $(this)[0].checked;
        widget.options.filters.formal_term_value = filterTypeValue;

        //$(widget.element).dialog_Generic('option', 'filters', widget.options.filters);
        AKT.widgets.statements.display(widget);
        $(widget.element).blur();
    });


    $(widget.element).find('.checkbox_source').on('change', function (event,value) {
        event.stopPropagation();

        if (value) {
            widget.options.filters.source = value;
        } else {
            widget.options.filters.source = $(this)[0].checked;
        }

        var filterTypeValue = $(widget.element).find('.listbox_sources').val();
        
        //widget.options.filters.source = $(this)[0].checked;
        widget.options.filters.source_value = filterTypeValue;

        //$(widget.element).dialog_Generic('option', 'filters', widget.options.filters);
        AKT.widgets.statements.display(widget);
        $(widget.element).blur();
    });


    $(widget.element).find('.checkbox_topic').on('change', function (event,value) {
        event.stopPropagation();
        
        if (value) {
            widget.options.filters.topic = value;
        } else {
            widget.options.filters.topic = $(this)[0].checked;
        }

        var filterTypeValue = $(widget.element).find('.listbox_topics').val();

        //widget.options.filters.topic = $(this)[0].checked;
        widget.options.filters.topic_value = filterTypeValue;

        //$(widget.element).dialog_Generic('option', 'filters', widget.options.filters);
        AKT.widgets.statements.display(widget);
        $(widget.element).blur();
    });


    $(widget.element).find('.checkbox_node_name').on('change', function (event,value) {
        event.stopPropagation();

        var filterTypeValue = $(widget.element).find('.listbox_node_names').val();

        widget.options.filters.node_name = $(this)[0].checked;
        widget.options.filters.node_name_value = filterTypeValue;

        //$(widget.element).dialog_Generic('option', 'filters', widget.options.filters);
        AKT.widgets.statements.display(widget);
        $(widget.element).blur();
    });


    // Event handlers for listboxes
    // ============================

    // 2. Change in the 'formal term types' listbox.
    // User selects a formal term *type* from the listbox, and this loads up the
    // formal terms listbox with terms just of that type.
    $(widget.element).find('.listbox_formal_term_types').on('change', function () {
        event.stopPropagation();
        var kbId = widget.options.kbId;
        var kb = AKT.KBs[kbId];
        var formalTerms = kb.findFormalTerms({term_type:$(this).val(),use:use_filter});
        AKT.loadSelectOptions(widget.element, 'listbox_formal_terms', formalTerms, ['id','id']);
    });


    // 3. Change in the 'formal terms' listbox.
    // User selects a formal term from the listbox, and this causes the list of statements to be
    // re-filtered for this term, *provided that* the formal term checkbox is checked.
    $(widget.element).find('.listbox_formal_terms').on('change', function (event,value) {

        if (value) {
            $(this).val(value);
        } else {
        }

        event.stopPropagation();
        if ($(widget.element).find('.checkbox_formal_term')[0].checked) {
            var filterTypeValue = $(widget.element).find('.listbox_formal_terms').val();
            widget.options.filters.formal_term_value = filterTypeValue;

            //$(widget.element).dialog_Generic('option', 'filters', widget.options.filters);
            AKT.widgets.statements.display(widget);
            $(widget.element).blur();
        }
    });


    // 4. Change in the 'sources' listbox.
    // User selects a source from the listbox, and this causes the list of statements to be
    // re-filtered for this term, *provided that* the source checkbox is checked.
    $(widget.element).find('.listbox_sources').on('change', function (event,value) {
        console.log('\n&&&& value',value);
        event.stopPropagation();

        if (value) {
            $(this).val(value);
        } else {
        }

        if ($(widget.element).find('.checkbox_source')[0].checked) {
            var filterTypeValue = $(widget.element).find('.listbox_sources').val();
            console.log(filterTypeValue);
            widget.options.filters.source_value = filterTypeValue;

            //$(widget.element).dialog_Generic('option', 'filters', widget.options.filters);
            AKT.widgets.statements.display(widget);
            $(widget.element).blur();
        }
    });


    // 5. Change in the 'topic' listbox.
    // User selects a topic from the listbox, and this causes the list of statements to be
    // re-filtered for this term, *provided that* the topic checkbox is checked.
    $(widget.element).find('.listbox_topics').on('change', function (event,value) {
        event.stopPropagation();

        if (value) {
            $(this).val(value);
        } else {
        }

        if ($(widget.element).find('.checkbox_topic')[0].checked) {
            var filterTypeValue = $(widget.element).find('.listbox_topics').val();
            widget.options.filters.topic_value = filterTypeValue;

            //$(widget.element).dialog_Generic('option', 'filters', widget.options.filters);
            AKT.widgets.statements.display(widget);
            $(widget.element).blur();
        }
    });


    // 6. Change in the statements listbox.
    $(widget.element).find('.listbox_statements').on('change', function (event, value) {
        console.log('#### 163 ',kb.statements);
        event.stopPropagation();
        // Needed this, since this.value is blank when triggered (in AKT.singleStep).
        //if (this.value === '') {
        //    var optionValue = value;
        //} else {
        //    optionValue = this.value;
        //}
        console.log($(this).val(),value);
        var statementId = $(this).val();
        var statement = kb._statements[statementId];
        AKT.state.current_statement = statement;   // Note: the Statement object, not its ID!
        $(widget.element).find('.div_english').html('<span>'+statementId+': '+statement.english+'</span>');

        //var i = parseInt(optionValue.split(':')[0],10);
        //var sentenceIndex = i;
        //AKT.state.sentence_index = sentenceIndex;
        $(widget.element).find('.textarea_formal_language').text(statementId+': '+statement.formal);
        
    });




    // -----------------------------------------------------------------------------
    // Custom event handlers
    $(document).on('new_statement_created_event', function(event,args) {
        self.display(widget);
    });

    $(document).on('statement_changed_event', function(event,args) {
        self.display(widget);
    });


    $(document).on('statement_deleted_event', function(event,args) {
        self.display(widget);
    });

};


// ===================================================================================
AKT.widgets.statements.display = function (widget) {
    console.log('widget/display (statements):',widget.options);
    var kbId = widget.options.kbId;
    var kb = AKT.KBs[kbId];
 
    if (widget.options.filters) {
        var filters = widget.options.filters;
/*
        if (filters.formal_term) {
            var formalTermId = filters.formal_term_value;
            var formalTermTypeId = kb._formalTerms[formalTermId].type;
            $(widget.element).find('.checkbox_formal_term').prop('checked',true);
            $(widget.element).find('.listbox_formal_terms option[value="'+formalTermId+'"]').prop('selected',  true);
            $(widget.element).find('.listbox_formal_term_types option[value="'+formalTermTypeId+'"]').prop('selected',  true);
        }

        if (filters.source) {
            var sourceId = filters.source_value;
            $(widget.element).find('.checkbox_source').prop('checked',true);
            $(widget.element).find('.listbox_sources option[value="'+sourceId+'"]').prop('selected',  true);
        }

        if (filters.topic) {
            var sourceId = filters.topic_value;
            $(widget.element).find('.checkbox_topic').prop('checked',true);
            $(widget.element).find('.listbox_topics option[value="'+sourceId+'"]').prop('selected',  true);
        }
*/
		console.log(6601,kb._statements,filters);
        var statements = kb.findStatements(filters);  

    // See email to the AKT group dated 12th July 2022 on "extended boolean search"
    } else if (widget.options.extended_boolean_search) {
        console.log(8001,widget.options);
        statements = kb.findStatements(widget.options.extended_boolean_search);
        console.log(8002,statements);
    } else if (widget.options.search_expression_js) {
        console.log(8003,widget.options);
        statements = kb.findStatements(widget.options.extended_boolean_search);
        console.log(8004,statements);
    }

    var nStatements = Object.keys(statements).length;
    $(widget.element).find('.div_nstatements').text(nStatements);

    // 7 March 2023 This is a temporary hack.  I'm basically trying to get away from
    // having various forms of the statement stored as extra properties, instead
    // calculating these when needed.   So although I add these properties here, 
    // it's purely for use by AKT.myListbox.
	// The proper solution is to have AKT.myListbox itself call the relevant
	// functions itself for each cell in each row, but this requires the function
	// (or function name?) to be supplied for each column in the myListbox table.
    for (var id in statements) {
        var statement = statements[id];
        statement._formal = statement.makeFormalFromJson({colourise:false,title:false});
        statement._english = statement.makeEnglishFromJson({colourise:true,title:true});
    }

    new Listbox({
        widget_element:    widget.element,
        div_element_class: 'div_widget_listbox_container',
        item_type:         'statement',
        items:             statements,
        property_names:    ['_id', '_english', '_formal'],
        include_key:       false,
        kb:                kb,
        container_object:  'statements',
        widget:            widget
    });

    // Note that the css has to be applied *after* the element has been 
    // created - in this case, after the myListbox tablel rows have been 
    // created.
    $(widget.element).find('.formal_term_action').css({color:'orange'});
    $(widget.element).find('.formal_term_process').css({color:'brown'});
    $(widget.element).find('.formal_term_object').css({color:'red'});
    $(widget.element).find('.formal_term_part').css({color:'purple'});
    $(widget.element).find('.formal_term_attribute').css({color:'blue'});
    $(widget.element).find('.formal_term_value').css({color:'green'});


    $('#viewallstatements1009').text(nStatements);

/*
    var h = $(widget.element).height()-145;
    $(widget.element).find('.mylistbox_statements').css('height',h+'px');
    $(widget.element).on( "resize", function( event, ui ) {
        var h = $(widget.element).height()-145;
        $(widget.element).find('.mylistbox_statements').css('height',h+'px');
    });
*/

};

AKT.widgets.statements.html = `
<div class="content" style="background:inherit; border:none;padding:5px;">

    <div class="div_filters" style="display:none; float:left;"></div>

    <div>
<!--
        <div style="float:left; margin-right:15px;">
            <div style="float:left;">
                <span>Include....</span><br/>
                <input type="checkbox" class="checkbox_att_value checkbox_included" checked value="att_value"/>
                <label>att_value</label><br/>
                <input type="checkbox" class="checkbox_causal checkbox_included" checked value="causal" />
                <label>causal</label><br/>
                <input type="checkbox" class="checkbox_comparison checkbox_included" checked value="comparison" />
                <label>comparison</label>
            </div>

            <div style="float:left;margin-left:15px;">
                <br/>
                <input type="checkbox" class="checkbox_non_conditional checkbox_included" checked value="non_conditional" />
                <label>non-conditional</label><br/>
                <input type="checkbox" class="checkbox_conditional checkbox_included" checked value="conditional" />
                <label>conditional</label>
            </div>
        </div>
-->
        <!--div style="float:left;">
            <select class="listbox_formal_terms" style="width:120px;"></select>
            <span>Restrict to...</span><br/>

            <input type="checkbox" class="checkbox_formal_term" value="formal_term" />
            <label style="display:inline-block;margin-left:17px;width:80px;">formal term</label>
            <span> of type </span>
            <select  class="listbox_formal_term_types">
                <option value="all">all</option>
                <option value="object">object</option>
                <option value="attribute">attribute</option>
                <option value="value">value</option>
                <option value="process">process</option>
                <option value="action">action</option>
            </select><br/>

            <input type="checkbox" class="checkbox_source" value="source" />
            <label style="display:inline-block;margin-left:17px;width:80px;">source</label>
            <select class="listbox_sources" style="width:120px;"></select><br/>

            <input type="checkbox" class="checkbox_topic" value="topic" />
            <label style="display:inline-block;margin-left:17px;width:80px;">topic</label>
            <select class="listbox_topics" style="width:120px;"></select><br/>

            <...Nov 22 Odd: I have this listbox, but no code for handling it!  So commented out.
            <input type="checkbox" class="checkbox_node_names" value="node_name" />
            <label style="display:inline-block;margin-left:17px;width:80px;">node name</label>
            <select class="listbox_node_names" style="width:120px;"></select><br/>
            ..>
        </div>   -->
    </div>

    <div style="clear:both;"></div>

    <div class="w3-row div_widget_listbox_container">
    </div>


    <fieldset style="display:none; float:left;margin-top:10px;">
        <legend>Selected Statement</legend>

        <div style="float:left;">
            <label>Natural Language</label><br/>
            <div class="div_english" style="border:solid 1px black;background:white;width:420px;height:40px;"></div><br/>
        </div>

        <div style="clear:both;"></div>

        <div style="float:left;">
            <label>Formal Language</label><br/>
            <textarea class="textarea_formal_language" style="width:420px;height:40px;"></textarea>
        </div>
    </fieldset>

    <div style="clear:both;"></div>

    <div style="float:right;">
        <div style="float:left; width:130px;height:20px;">Number of statements</div>
        <div class="div_nstatements" style="float:left; width:75px;height:20px;">0</div>
    </div>

    <!--div>
        <button id="viewallstatements106" style="float:left;width:125px;height:30px;">Numerical</button>
        <button id="viewallstatements120" style="float:left;width:130px;height:30px;">All Statements</button>
    </div-->

    <div style="clear:both;"></div>

    <!-- In the Prolog source, but not in the current version of AKT5.
    <div id="viewallstatements1010" class="label" style="left:297px;top:202px;width:40px;height:25px;">with at least </div>
    <select id="viewallstatements805" style="left:335px;top:205px;width:40px;height:20px;160px;">[]</select>
    <div id="viewallstatements1011" class="label" style="left:378px;top:210px;width:60px;height:25px;">condition(s)</div>
    -->

    <!--fieldset style="float:left;margin-top:10px;">
        <legend>Diagram Selection Type</legend>
        <button id="viewallstatements110" style="width:95px;height:30px;">All Statements</button>
        <button id="viewallstatements113" style="width:60px;height:30px;">Causes</button>
        <button id="viewallstatements114" style="width:60px;height:30px;">Effects</button>
        <button id="viewallstatements111" style="width:65px;height:30px;">Navigate</button>
    </fieldset>

    <button id="viewallstatements112" style="float:right;margin-right:20px;margin-top:20px;width:110px;height:30px;">Print Statements</button-->

    <div style="clear:both;"></div>

</div>     <!-- End of content div -->
`;

