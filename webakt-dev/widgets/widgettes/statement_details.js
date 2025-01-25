AKT.widgets.statement_details = {};


// ======================================================================== SETUP
AKT.widgets.statement_details.setup = function (widget) {
    console.log('\n*** [statement_details.js] AKT.widgets.statement_details.setup(): options=',widget.options);
    var self = this;

    AKT.state.current_widget = widget;
    widget.counter = 0;

        var tut2_statements = [
            {id:"1",formal:'action(burning,site) causes1way att_value(pests,numbers,decrease)',sources:['bandy']}, 
            {id:"2",formal:'action(burning,site) causes1way att_value(crops_disease,level,decrease)',sources:['bandy']}, 

            {id:"3",formal:'att_value(process(soil,erosion),rate,minimal) if link(covers,vegetation,soil)',sources:['bandy']},
            {id:"4",formal:'att_value(process(soil,erosion),rate,high) if link(not_covers,vegetation,soil)',sources:['bandy']},

            {id:"5",formal:'action(clearing,site) causes1way att_value(soil,temperature,increase)',sources:['bandy']}, 
            {id:"6",formal:'att_value(soil,temperature,increase) causes2way att_value(process(organic_matter,decomposition),rate,increase)',sources:['bandy']}, 
            {id:"7",formal:'att_value(site,time_since_burning,range(0_years,2_years))',sources:['bandy']}, 
            {id:"8",formal:'action(harvesting,crops) causes1way att_value(part(soil,nutrients),level,decrease)',sources:['bandy']}, 
            {id:"9",formal:'process(leaching) causes1way att_value(part(soil,nutrients),level,decrease)',sources:['bandy']}, 
            {id:"10",formal:'att_value(part(soil,nutrients),level,decrease) causes2way att_value(soil,fertility,decrease)',sources:['bandy']}, 
            {id:"11",formal:'att_value(weeds,density,increase) causes2way att_value(crops,yield,decrease)',sources:['bandy']}, 

            {id:"12",formal:'att_value(process(soil,erosion),rate,severe) if att_value(process(soil,erosion),location,hillside) and att_value(site,vegetation_cover,bare)',sources:['bandy']},
            {id:"13",formal:'att_value(process(soil,erosion),rate,increase) causes2way att_value(process(waterways,siltation),rate,increase)',sources:['bandy']}, 
            {id:"14",formal:'att_value(process(waterways,siltation),rate,increase) causes2way att_value(action(production,fish),rate,decrease)',sources:['bandy']}, 
            {id:"15",formal:'att_value(action(fallowing,land),frequency,regular) causes1way att_value(weeds,population,decrease)',sources:['bandy']}, 
            {id:"16",formal:'process(canopy,closure) causes1way process(weeds,death)',sources:['bandy']}
        ]; 

        var kbId = widget.options.kbId;
        var kb = AKT.KBs[kbId];
		
        if (widget.options.mode === 'new') {
            widget.temp_statement = new Statement({kb:kb});
        } else if (widget.options.mode === 'edit') {
            // 24 June 2024.  I'm now cloning the statement.
            // TODO: Change every xxx_details.js widgette to use this pattern.
            var statement = widget.options.item;
            var statementSpec = statement.makeSpec();
            widget.temp_statement = new Statement(statementSpec);
        }

    // Note: We modify the display of some elements (depending on mode=new/view/edit) 
    // here, at widgie creation time.  This will do for the time being, but may have
    // to be shifted to the display function if/when we allow the same panel to be
    // used repeatedly (instead of creating a new one each time, as now).
    // Note: the 'modal' class indicates that the display style for the element 
    // depends on the mode (i.e. new,view or edit).
    var mode = widget.options.mode;
    if (mode === 'new' || mode === 'edit'){
        $(widget.element).find('button').filter('.modal').attr('disabled',false);
        $(widget.element).find('div').filter('.modal').attr('contenteditable',true);

    } else if (mode === 'view') {
        $(widget.element).find('.div_edit_buttons').css({display:'none'});
        $(widget.element).find('button').filter('.modal').attr('disabled',true);
        $(widget.element).find('div').filter('.div_memo').attr('contenteditable',false);
    }


    // ============================================================================ BUTTONS

    // Nov 2024.  I have removed this, since only relevant for New statement, which will
    // not have, and should not have, its formal terms extracted and added to the 
    // formal_terms collection.  HTML <button> element has been commented out.
    $(widget.element).find('.button_colourxxx').on('click',function() {
        console.log('\n*** [statement_details.js] Click event on "Colour" button');
        var statement = widget.options.item;
        if ($(this).text() === 'Colour') {
            // TODO: Next 6 lines of code should go into statement methods.
            var formalHtml = statement.makeFormalFromJson({colourise:true,title:true});
            var englishHtml = statement.makeEnglishFromJson({colourise:true,title:true});

            formalHtml = formalHtml.replace('if','<b>if</b><br/>');
            englishHtml = englishHtml.replace('if','<b>if</b><br/>');

            // Add line-wrapping break-points (the HTML <wbr> tag) after commas in the formal version.
            let regex = /,/g;
            formalHtml = formalHtml.replace(regex,',<wbr>');

            $(widget.element).find('.div_formal').html(formalHtml);  
            $(widget.element).find('.div_english').html(englishHtml);  

            // Note that the css has to be applied *after* the element has been 
            // created - in this case, the <span>...</span> displaying the 
            // statement.
            $(widget.element).find('.formal_term_action').css({color:'orange'});
            $(widget.element).find('.formal_term_process').css({color:'brown'});
            $(widget.element).find('.formal_term_object').css({color:'red'});
            $(widget.element).find('.formal_term_part').css({color:'purple'});
            $(widget.element).find('.formal_term_attribute').css({color:'blue'});
            $(widget.element).find('.formal_term_value').css({color:'green'});

            $(widget.element).find('.div_formal').attr('contenteditable',false);
            $(this).text('B&W');
        } else {
            var formal = statement.makeFormalFromJson();
            var english = statement.makeEnglishFromJson();
            $(widget.element).find('.div_formal').html(formal);  
            $(widget.element).find('.div_english').html(english);  

            $(widget.element).find('.div_formal').attr('contenteditable',true);
            $(this).text('Colour');
        }
    });

    $(widget.element).find('.button_check').on('click', function() {
        console.log('\n*** [statement_details.js] Click event on "Check" button');
        event.stopPropagation();
        var kbId = widget.options.kbId;
        var kb = AKT.KBs[kbId];

        const divFormal = $(widget.element).find('.div_formal');

        const regex = /<\/?\w[^>]*>/g;
        var formalHtml = $(divFormal).html();
        var formal = formalHtml.replace(regex, '');
        var tempStatement = new Statement({kb:kb,formal:formal});

        try {
            var result = parser.parse(formal);
            $(widget.element).find('.div_formal_flag').css({background:'#50ff50'});
            var tempStatement = new Statement({kb:kb,formal:formal});
            widget.options.statement = tempStatement;
            var english = tempStatement.makeEnglishFromJson({colourise:true,title:true});
            if (english) {
                $(widget.element).find('.div_english').html(english);
            }
        }
        catch(error) {
            $(widget.element).find('.div_formal_flag').css({background:'red'});
            $(widget.element).find('.div_english').text(' ');
        }
    });

    $(widget.element).find('.button_colour').css({display:'block'});


    $(widget.element).find('.button_template').on('click', function() {
        console.log('\n*** [statement_details.js] Click event on "Template" button');
        event.stopPropagation();
        var kbId = widget.options.kbId;
        var kb = AKT.kbs[kbId];

        AKT.recordEvent({
            element:widget.element,
            finds:['.button_template'],
            event:'click',
            message:'Clicked the Template button in the statement_details widget'});
        //$('#div_node_template_dialog').node_template({mode:'statement'});
        //$('#div_node_template_dialog').css({display:'block'});

        var panel = AKT.panelise({
            widget_name:'statement_template',
            position:{left:'20px',top:'20px'},
            size:{width:'410px',height:'375px'},
            shift_key: event.shiftKey,
            options:{kbId:kbId, opened_by_widgie:widget}
        });

    });


    // Formal terms button
    $(widget.element).find('.button_formal_terms').on('click', function() {
        console.log('\n*** [statement_details.js] Click event on "Formal terms" button');
        event.stopPropagation();
        var kbId = widget.options.kbId;
        var kb = AKT.kbs[kbId];

        var eventShiftKey = event ? event.shiftKey : null;

        var panel = AKT.panelise({
            widget_name:'collection',
            position:{left:'20px',top:'20px'},
            size:{width:'410px',height:'375px'},
            shift_key: event.shiftKey,
            options:{kbId:kbId, item_type:'formal_term', filters:{term_type:'all', use:'all'},statement:widget.options.statement}
        });
    });


    $(widget.element).find('.button_source_details').on('click', function (event) {   // Source details button
        console.log('\n*** [statement_details.js] Click event on "Source details" button');
        event.stopPropagation();

        var kbId = widget.options.kbId;
        var kb = AKT.KBs[kbId];

        var itemId = $(widget.element).find('.select_sources').val();
        var item = kb._sources[itemId];

        var options = {kbId:kbId, mode:'view', item_type:'source', item_id:itemId, item:item};

        var panel = AKT.panelise({
            widget_name:  'source_details',
            position:     {left:'650px',top:'20px'},
            size:         {width:'580px',height:'450px'},
            shift_key:    event.shiftKey,
            options:      options
        });
    });


    $(widget.element).find('.button_add_source').on('click', function (event) {   // add_source button
        console.log('\n*** [statement_details.js] Click event on "Add source" button');
        event.stopPropagation();

        var kbId = widget.options.kbId;
        var kb = AKT.KBs[kbId];

        AKT.state.current_listener = {uuid:widget.uuid,type:'source'};

        var eventShiftKey = event ? event.shiftKey : null;

        var panel = AKT.panelise({
            widget_name:'collection',
            position:{left:'20px',top:'20px'},
            size:{width:'470px',height:'390px'},
            shift_key: eventShiftKey,
            options:{kbId:AKT.state.current_kb,item_type:'source'}
        });

/*
        var panel = AKT.panelise({
            widget_name:'sources',
            position:{left:'20px',top:'20px'},
            size:{width:'470px',height:'390px'},
            shift_key: event.shiftKey,
            options:{kbId:kbId}
        });
*/
    });


    $(widget.element).find('.button_remove_source').on('click', function (event) {  
        console.log('\n*** [statement_details.js] Click event on Remove source button');
        event.stopPropagation();

        var kbId = widget.options.kbId;
        var kb = AKT.KBs[kbId];

        var statement = widget.temp_statement;
        var sourceId = $(widget.element).find('.select_sources').val();

        var sourceIds = statement._sources;
        var index = sourceIds.indexOf(sourceId);
        if (index !== -1) {
          sourceIds.splice(index, 1);
        }
        $(widget.element).find('.select_sources').find('option[value='+sourceId+']').remove(); 
        var eventShiftKey = event ? event.shiftKey : null;
/*
        var panel = AKT.panelise({
            widget_name:'source_details',
            position:{left:'20px',top:'20px'},
            size:{width:'470px',height:'390px'},
            shift_key: event.shiftKey,
            options:{kbId:kbId, source:source}
        });
*/
    });



    // Example used in AKT Manual, Chapter 14, Creating a simple knowledge base
    $(widget.element).find('.button_tut2_single').on('click', function() {
        event.stopPropagation();
        console.log('\n*** [statement_details.js] Click event on "Tut2 1" button');
		var kbId = 'atwima';
        var kb = AKT.KBs[kbId];  // 

        if (widget.counter>=tut2_statements.length) {
            alert('No more!');
            return;
        }

        var formal = tut2_statements[widget.counter].formal;
        var sources = tut2_statements[widget.counter].sources;
        $(widget.element).find('.div_formal').text(formal);
        $(widget.element).find('.select_sources').empty();
        $(widget.element).find('.select_sources').append('<option value="'+sources[0]+'">'+sources[0]+'</option>');
        widget.counter += 1;
     
        try {
            var result = parser.parse(formal);
            $(widget.element).find('.div_formal_flag').css({background:'#50ff50'});
        }
        catch(error) {
            console.log('\n** [statement_details.js] ERROR: parsing statement: error=',error);
            $(widget.element).find('.div_formal_flag').css({background:'red'});
        }
   	});



    // Example used in AKT Manual, Chapter 14, Creating a simple knowledge base
    $(widget.element).find('.button_tut2_all').on('click', function() {
        event.stopPropagation();
        console.log('\n*** [statement_details.js] Click event on "Tut2 all" button');
		var kbId = AKT.state.current_kb;
        var kb = AKT.KBs[kbId];

        for (var i=0; i<tut2_statements.length; i++) {
            var statement = tut2_statements[i];

            var formal = statement.formal;
            var sources = statement.sources;
            $(widget.element).find('.div_formal').text(formal);
            $(widget.element).find('.select_sources').empty();
            $(widget.element).find('.select_sources').append('<option>'+sources[0]+'</option>');
         
            try {
                var result = parser.parse(formal);
                $(widget.element).find('.div_formal_flag').css({background:'#50ff50'});
			    $(widget.element).find('.button_update').trigger('click');
            }
            catch(error) {
                console.log('\n*** [statement_details.js] ERROR: parsing statement: error=',error);
                $(widget.element).find('.div_formal_flag').css({background:'red'});
            }
        }
   	});




    // ============================================================================ update
    // This should only be callable if mode = new or edit.
    $(widget.element).find('.button_update').on('click', function() {
        console.log('\n*** [statement_details.js] Click event on "Update" button');
        event.stopPropagation();
		var kbId = AKT.state.current_kb;
        var kb = AKT.KBs[kbId];

        if (widget.options.mode === 'new') {
            var statement = new Statement({kb:kb});
            var n = kb.findLargestIndex(kb._statements,'s');
            var n1 = n+1;
            statement._id = 's'+n1;
        } else {
            statement = widget.temp_statement;
        }

        // This regex strips out any HTML markup in the displayed formal statement.
        const regex = /<\/?\w[^>]*>/g;
        var formalHtml = $(widget.element).find('.div_formal').text();
        var formal = formalHtml.replace(regex, '');
        statement._formal = formal;
        // Note that we re-generate the JSON here from the formal statement, even if
        // the user used the statement_template.js widget to create the statement - 
        // that passes back (in the 'statement_template_ok_event' event) the json
        // created from the template.
        statement._json = statement.makeJsonFromFormal(formal);
        statement._english = statement.makeEnglishFromJson();
        $(widget.element).find('.div_english').text(statement._english);

        // formalTerms has structure {a:['object'],b:['attribute'],c:['value']} for statement att_value(a,b,c)
        var formalTerms = statement.classifyFormalTerms();
        for (var id in formalTerms) {
            var formalTerm = new FormalTerm({id:id,type:formalTerms[id][0],kb:kb,synonyms:[],description:''});
            kb._formalTerms[id] = formalTerm;
        }

        // Sources
        //var selectOptions = $(widget.element).find('option');
        var selectOptions = $(widget.element).find('.select_sources').find('option'); 
        statement._sources = [];
        $.each(selectOptions, function(i,selectOption) {
            statement._sources.push($(selectOption).text());
        });

        statement._memo = $(widget.element).find('.div_memo').text();

        kb._statements[statement._id] = statement;
		AKT.saveKbInLocalStorage(kbId);

        if (widget.options.mode==='new') {
            AKT.trigger('new_item_created_event',{kb:kb,item_type:'statement',item:statement});
        } else if (widget.options.mode==='edit') {
            AKT.trigger('item_changed_event',{kb:kb,item_type:'statement',item:statement});
        }

        $('#message').text('The Statements list has been updated');
	});


    // ----------------------------------------------------------------------- INPUT EVENTS
    $(widget.element).find('.div_formal').on('input', function (event) {
        console.log('\n*** [statement_details.js] Keyboard event');
        var kbId = widget.options.kbId;
        var kb = AKT.KBs[kbId];

        const divFormal = $(widget.element).find('.div_formal');

        const regex = /<\/?\w[^>]*>/g;
        var formalHtml = $(divFormal).html();
        var formal = formalHtml.replace(regex, '');

        try {
            var result = parser.parse(formal);
            $(widget.element).find('.div_formal_flag').css({background:'#50ff50'});
            var tempStatement = new Statement({kb:kb,formal:formal});
            widget.options.statement = tempStatement;
            var english = tempStatement.makeEnglishFromJson({colourise:true,title:true});
            if (english) {
                $(widget.element).find('.div_english').html(english);
            }
        }
        catch(error) {
            $(widget.element).find('.div_formal_flag').css({background:'red'});
            $(widget.element).find('.div_english').text(' ');
        }
    });


    // ------------------------------------------------------------ CUSTOM EVENTS

    // The "item_selected_event" is triggered by clicking on one item (in this case,
    // a source) in the Listbox table listing the (in this case) sources in the KB.   
    // See the documentation on the Listbox and how it is used.
	$(document).on('item_selected_event', function(event,args) {
        //var widget = AKT.state.current_widget;
        // We are asking: Is the uuid of this widget the same as the widget uuid that is currently
        // awaiting an "item_selected"event"?
        if (AKT.state.current_listener && 
                args.item_type === 'source' &&
                AKT.state.current_listener.type === 'source' && 
                widget.uuid === AKT.state.current_listener.uuid) {
            console.log('\n*** [statement_details.js] Acting on an "item_selected_event"');
            var kbId = widget.options.kbId;
            var kb = AKT.KBs[kbId];
            var sourceId = args.item_id;
            var source = kb._sources[sourceId];
            var statement = widget.temp_statement;
            var sourcesArray = statement._sources;
            $(widget.element).find('.select_sources').append('<option value="'+sourceId+'">'+sourceId+'</option>');
            sourcesArray.push(sourceId);
            AKT.state.current_listener = {uuid:null,type:null};
        }
    });

	$(document).on('new_statement_created_event', function(event,args) {
    });


    // The statement_template.js widgette returns the formal string created from 
    // the template form.
	$(document).on('statement_template_ok_event', function(event,args) {
        console.log('\n*** [statement_details.js] Acting on a "template_ok_event"');
        var kbId = widget.options.kbId;
        var kb = AKT.KBs[kbId];

        $(widget.element).find('.div_formal').text(args.formal);

        const divFormal = $(widget.element).find('.div_formal');

        const regex = /<\/?\w[^>]*>/g;
        var formalHtml = $(divFormal).html();
        var formal = formalHtml.replace(regex, '');
        var tempStatement = new Statement({kb:kb,formal:formal});

        try {
            var result = parser.parse(formal);
            $(widget.element).find('.div_formal_flag').css({background:'#50ff50'});
            var tempStatement = new Statement({kb:kb,formal:formal});
            widget.options.statement = tempStatement;
            var english = tempStatement.makeEnglishFromJson({colourise:true,title:true});
            if (english) {
                $(widget.element).find('.div_english').html(english);
            }
        }
        catch(error) {
            $(widget.element).find('.div_formal_flag').css({background:'red'});
            $(widget.element).find('.div_english').text(' ');
        }
    });

};


// ================================================================== DISPLAY
AKT.widgets.statement_details.display = function (widget) {

    console.log('\n*** [statement_details.js] AKT.widgets.statement_details.display(): options=',widget.options);

    $(widget.element).find('.div_keywords > button').css({'padding-left':'3px','padding-right':'3px'});

    var kbId = widget.options.kbId;
    var kb = AKT.KBs[kbId];
    $(widget.element).find('.div_kb_id').text(kbId);    

    if (widget.options.item) {     // This is skipped if it's a New statement.
        var statement = widget.options.item;
        $(widget.element).find('.div_statement_id').text(statement._id); 

        if (widget.options.mode === 'view' || widget.options.mode === 'edit') {   // Starting display colourises formal and English.
            // TODO: Next 6 lines of code should go into statement methods.
            var formalHtml = statement.makeFormalFromJson({colourise:true,title:true});
            var englishHtml = statement.makeEnglishFromJson({colourise:true,title:true});

            formalHtml = formalHtml.replace('if','<b>if</b><br/>');
            englishHtml = englishHtml.replace('if','<b>if</b><br/>');

            // Add line-wrapping break-points (the HTML <wbr> tag) after commas in the formal version.
            let regex = /,/g;
            formalHtml = formalHtml.replace(regex,',<wbr>');

            // Now insert the various bits into their respective HTML elements.
            $(widget.element).find('.div_kb_id').text(kbId);    
            $(widget.element).find('.div_statement_id').text(statement._id); 

            $(widget.element).find('.div_formal').html(formalHtml);  
            $(widget.element).find('.div_english').html(englishHtml);  

            // Note that the css has to be applied *after* the element has been 
            // created - in this case, the <span>...</span> displaying the 
            // statement.
            $(widget.element).find('.formal_term_action').css({color:'orange'});
            $(widget.element).find('.formal_term_process').css({color:'brown'});
            $(widget.element).find('.formal_term_object').css({color:'red'});
            $(widget.element).find('.formal_term_part').css({color:'purple'});
            $(widget.element).find('.formal_term_attribute').css({color:'blue'});
            $(widget.element).find('.formal_term_value').css({color:'green'});

        } else if(widget.options.mode === 'edit') {
            var formal = statement.makeFormalFromJson();
            var english = statement.makeEnglishFromJson();
            $(widget.element).find('.div_formal').html(formal);  
            $(widget.element).find('.div_english').html(english);  
        }

        $(widget.element).find('.div_memo').text(statement._memo);
        AKT.loadOptions(widget.element, 'select_sources', statement.sources);

            /* Commented out, until I find a way of being able to edit a formal_term as
               well as getting up a formal_term_details panel!
            $(widget.element).find('.formal_term').on('click', function (event) {    // The Details button
                console.debug('BUTTON: Clicked on a formal term in the statement.');
                event.stopPropagation();

                var formalTermId = $(this).text();
                console.log($(this),formalTermId);
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
                        options:{kbId:kbId, mode:'view', formal_term:formalTerm}
                    });
                } else {
                    alert('Please first select a formal term from the listbox.');
                }
            });
            */

    } else {
        return;
        // For entering a New statement
        // I have retained AKT5's separate boxes for the main and conditional parts
        // of a statement.   Since both are handled identically, I've put the code
        // into a function which is caled twice, once for each part.
        // The second argument is the "placeholder" (tech speak for the grey prompt
        // that you sometimes see in input boxes).

        // I have tried published solutions to use the HTML placeholder attribute,
        // instead of my hacked solution, for inside a <div>, but I can't get it to work.
        // See e.g. https://stackoverflow.com/questions/20726174/placeholder-for-contenteditable-div
        handleFormalDiv(divFormalMain,'main part');
        handleFormalDiv(divFormalIf,'conditional part');

        function handleFormalDiv(divFormal, placeholder) {
            $(divFormal).text(placeholder);    
            $(divFormal).css({'color':'#808080','font-size':'13px'});   

            $(divFormal).on('click', function(e) {
                if ($(divFormal).text() === placeholder) {
                    $(divFormal).text('');
                    $(divFormal).css({'color':'black','background-color':'yellow'});    
                }
            });
        }
    }


};




// =============================================================================== HTML
AKT.widgets.statement_details.html = `
<div class="content" style="border:none;padding:10px;">

    <div style="float:left;">Knowledge Base: </div>
    <div class="div_kb_id" style="float:left;font-weight:bold;margin-left:4px;"></div>
    <div style="float:left;margin-left:100px;">Statement ID:</div>
    <div class="div_statement_id" style="float:left;font-weight:bold;margin-left:4px;"></div>

    <div style="clear:both;" />

    <div style="float:left;">

        <!-- Formal ---------------------------------------------------->
        <fieldset>
            <legend>Formal Language</legend>
            <div class="div_keywords" style="display:none;">
                <button>att_value</button>
                <button>action</button>
                <button>part</button>
                <button>process</button>
                <button>causes1way</button>
                <button>causes2way</button>
            </div>
            <div class="div_quickies" style="display:none;">
                <button>att_value(a,b,c)</button><br/>
                <button>att_value(a,b,c) causes1way att_value(d,e,f)</button><br/>
                <button>att_value(a,b,c) if att_value(x,y,z)</button><br/>
                <button>att_value(a,b,c) causes1way att_value(d,e,f) if att_value(x,y,z)</button>
            </div>

            <div style="padding:1px;">
                <div class="div_formal modal" contenteditable style="float:left;overflow-y:auto;line-height:1;word-wrap:break-word;white-space:normal;font-size:13px;width:410px;height:50px;border:solid 1px #a0a0a0;background:white;"></div>
                <div class="div_formal_flag" style="float:left;width:10px;height:35px;background:white;"></div>
                <div style="clear:both;"></div>
            </div>
        </fieldset>


        <!-- English --------------------------------------------------------->
        <fieldset>
            <legend>English</legend>
            <div class="div_english" style="overflow-y:auto;line-height:1;font-size:13px;padding:1px;width:420px;height:50px;border:solid 1px 3a0a0a0;background:#f0f0f0;"></div>
        </fieldset>


        <!-- Sources --------------------------------------------------------->
        <fieldset>
            <legend>Source(s)</legend>
            <div style="float:left;">Source  /<br/>Derivation</div>
            <select class="select_sources" size="5" style="float:left; clear:right;width:220px;background:white;">[]</select>
            <div style="float:left;width:120px;">
                <button class="button_source_details" style="width:100px;height:20px;margin-left:20px;margin-top:0px;">Source details</button>
                <button class="button_add_source modal" style="width:100px;height:20px;margin-left:20px;margin-top:4px;">Add source</button>
                <button class="button_remove_source modal" style="width:100px;height:20px;margin-left:20px;margin-top:4px;">Remove source</button>
            </div>
        </fieldset>


        <!-- Memo ------------------------------------------------------------->
        <fieldset>
            <legend>Memo</legend>
            <div class="div_memo" contenteditable modal style="width:420px;00px;height:50px;background:white;border:solid 1px black;"></div>
        </fieldset>
    </div>

    <!-- Buttons -------------------------------------------------------------->
    <div class="div_edit_buttons" style="float:left;width:100px;text-align:center;padding:10px;">
        <!--button class="button_colour" style="display:block;width:70px;height:26px;margin:5px;">Colour</button><br/-->
        <button class="button_check" style="width:70px;height:25px;margin:5px;">Check</button><br/>
        <button class="button_template modal" style="width:70px;height:25px;margin:5px;">Template</button>
        <!--button class="button_formal_terms" style="width:70px;height:40px;margin:5px;">Formal Terms</button><br/-->
        <fieldset>
            <legend>Wizard</legend>
            <button class="button_tut2_single modal inwidget_recording" style="width:70px;height:25px;margin:0px;margin-top:0px;" title="Statements used in webAKT Tutorial 2.\nEach click loads 1 statement, and you must click\nthe Update button to add the statement to the KB.">Tut2 1</button><br/>
            <button class="button_tut2_all modal inwidget_recording" style="width:70px;height:25px;margin:0px;"title="Statements used in webAKT Tutorial 2.\nCycles through all the statements, whic\nare automatically added to the KB.">Tut2 all</button><br/>
            <button class="button_atwima_single modal inwidget_recording" style="width:70px;height:25px;margin:0px;">Atwima 1</button><br/>
            <button class="button_atwima_all modal inwidget_recording" style="width:70px;height:25px;margin:0px;margin-bottom:0px;">Atwima all</button><br/>
        </fieldset>
        <button class="button_update modal inwidget_recording" style="width:70px;height:25px;margin:5px;">Update</button><br/>
    </div>

</div>     <!-- End of content div -->
`;


/*  DEAD, POSSIBLY REDUNDANT, CODE
A graveyard (or maybe just a mortuary) for the click-handling code for buttons that are no longer 
in use, but could possbly be brought back to life.
To avoid cluttering up main code block.



    /// ------------------------------------------------------------------- BUTTON CLICK EVENTS
    $(widget.element).find('.button_translate').on('click', function() {
        event.stopPropagation();
        var kbId = widget.options.kbId;
        var kb = AKT.kbs[kbId];

        // Does nothing!   Old code separated statement into main and conditional bits.
        var formal = $(widget.element).find('.div_formal').text();
        var tempStatement = new Statement({kb:kb,formal:formal});
        var english = tempStatement.makeEnglishFromJson({colourise:true,title:true});
        console.log(tempStatement,english);
        $(widget.element).find('.div_english').html(english);

        $(widget.element).find('.formal_term_action').css({color:'orange'});
        $(widget.element).find('.formal_term_process').css({color:'brown'});
        $(widget.element).find('.formal_term_object').css({color:'red'});
        $(widget.element).find('.formal_term_part').css({color:'purple'});
        $(widget.element).find('.formal_term_attribute').css({color:'blue'});
        $(widget.element).find('.formal_term_value').css({color:'green'});
    });



    // Magic button - generates a syntacticaly-correct statement!
    $(widget.element).find('.button_magic').on('click', function() {
        event.stopPropagation();

        var statementJson = AKT.makeStatement();
        var statement = new Statement({json:statementJson});
        var formal = statement.makeFormal();
        $(widget.element).find('.div_formal').html(formal);

        const regex = /<\/?\w[^>]*>/g;

        try {
            var result = parser.parse(formal);
            $(widget.element).find('.div_formal_flag').css({background:'#50ff50'});
            console.log(result);
        }
        catch(error) {
            $(widget.element).find('.div_formal_flag').css({background:'red'});
            console.log('name:',error.name, '\nmessage:',error.message, '\nfound:',error.found, '\nlocation:',error.location.start.offset);
        }
    });


 


    $(widget.element).find('.div_keywords > button').on('click', function() {
        event.stopPropagation();
        console.log($(this).text());
        var formalSoFar = $(widget.element).find('.div_formal_main').text();
        var formalPlus = formalSoFar + $(this).text();
        $(widget.element).find('.div_formal_main').text(formalPlus);
    });


    $(widget.element).find('.div_quickies > button').on('click', function() {
        event.stopPropagation();
        var formal = $(this).text();
        $(widget.element).find('.div_formal').text(formal);
        try {
            var result = parser.parse(formal);
            $(widget.element).find('.div_formal_flag').css({background:'#50ff50'});
        }
        catch(error) {
            $(widget.element).find('.div_formal_flag').css({background:'red'});
        }
    });


    $(widget.element).find('.button_wizardxxx').on('click', function() {
        event.stopPropagation();
        console.log('Clicked on Wizard button');

        var testStatements = [
        'action(burning,site) causes1way att_value(pests,numbers,decrease)',
        'action(burning,site) causes1way att_value(crops_disease, level, decrease)',
        'action(clearing, site) causes1way att_value(soil,temperature,increase)',
        'att_value(soil,temperature,increase) causes2way att_value(process(organic_matter, decomposition),rate, increase)',
        'att_value(site, nutrient_availability, high) if att_value(site, time_since_burning,range(0_years, 2_years))',
        'action(harvesting, crops) causes1way att_value(part(soil, nutrients),level,decrease)',
        'process(leaching) causes1way att_value(part(soil,nutrients),level, decrease)',
        'att_value(part(soil, nutrients),level, decrease) causes2way att_value(soil, fertility, decrease)',
        'att_value(weeds, density, increase) causes2way att_value(crops, yield, decrease)',
        'att_value(process(soil, erosion), rate,minimal) if link(covers, vegetation, soil)',
        'att_value(process(soil, erosion), rate, high) if link(not_covers, vegetation, soil)',
        'att_value(process(soil, erosion),rate, severe) if att_value(process(soil, erosion), location, hillside) and att_value(site, vegetation_cover, bare)',
        'att_value(process(soil, erosion), rate, increase) causes2way att_value(process(waterways, siltation), rate, increase)',
        'att_value(process(waterways, siltation),rate, increase) causes2way att_value(action(production,fish), rate, decrease)',
        'att_value(action(fallowing,land),frequency,regular) causes1way att_value(weeds, population,decrease)',
        'process(canopy,closure) causes1way process(weeds,death)'];
		
		for (var i=0; i<testStatements.length; i++) {
			var formal = testStatements[i];
			console.log('++',formal);
			$(widget.element).find('.div_formal').text(formal);
			$(widget.element).find('.button_update').trigger('click');
		}
	});


    // From hierarchy_details.js
	$(document).on('item_selected_event', function(event,args) {
	    if (AKT.state.listening_for_formal_term &&
				AKT.state.active_panel_id === widget.element[0].id) {
			console.log('listener:item_selected_event:',args,widget.element[0].id);

			if (widget.options.hierarchy) {
				var hierarchy = widget.options.hierarchy;
			} else {
				hierarchy = AKT.state.current_hierarchy;
			}
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



	$(document).on('statement_template_ok_eventxxx', function(event,args) {
        console.log('**^^',args);

        var kbId = AKT.state.current_kb;
        var kb = AKT.KBs[kbId];

        var tempStatement = new Statement({kb:kb,json:args.json});
        tempStatement._formal = tempStatement.makeFormalFromJson();
        //statement._english = statement.makeEnglishFromJson();
        $(widget.element).find('.div_formal').text(tempStatement._formal);
        //$(widget.element).find('.div_english').text(statement._english);
        //widget.statement = statement;
        //kb._statements[id] = statement;
        console.log('+',tempStatement);
    });
*/
