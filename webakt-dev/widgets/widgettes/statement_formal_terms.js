AKT.widgets.statement_formal_terms = {};


AKT.widgets.statement_formal_terms.settings = {width:'400px',height:'260px'};


AKT.widgets.statement_formal_terms.setup = function (widget) {

    var kbId = widget.options.kbId;
    var kb = AKT.KBs[kbId];

    var widgetSettings = $('<div></div>');
    $(widget.element).find('.content').prepend(widgetSettings);

    var selectElement = AKT.makeReprocessSelector(
        widget.element, 
        widget.widgetName,
        'Knowledge base', 
        AKT.getKbIds(), 
        AKT.state.current_kb, 
        'kbId',
        'kb');
    $(widgetSettings).append(selectElement);

    var selectElement = AKT.makeReprocessSelector(
        widget.element, 
        widget.widgetName,
        'Formal term type', 
        ['all','action','attribute','comparison','link','object','process','value'], 
        'all',                 // Default value.
        'term_type',           // Name of the widget option that is assigned the listbox (<select>) option.
        'formal_term_type');   // Class name for the listbox (<select>) element.
    $(widgetSettings).append(selectElement);

    //var selectElement = AKT.makeReprocessSelector(widget.element, widget.widgetName,
    //    'Use in formal definitions', ['all','Formal Statements','Formal Conditions','Object Hierarchies'], 'all','use');
    //$(widgetSettings).append(selectElement);

    var options = widget.options;    
    if (options.term_type) {
        var term_type_filter = options.term_type;
    } else {
        term_type_filter = 'all';
    }
    formalTerms = kb.findFormalTerms({term_type:term_type_filter});

    $(widget.element).find('.button_details').on('click', function (event) {    // The Details button
        console.debug('BUTTON: Clicked on formal_term Details button');
        event.stopPropagation();

        var formalTermId = $(widget.element).find('.select_statement_formal_terms').val();
        var formalTerm = kb._formalTerms[formalTermId];  
        console.log('|| ',formalTermId,formalTerm);
        var panel = AKT.panelise({
            widget_name:'formal_term_details',
            position:{left:'650px',top:'20px'},
            size:{width:'580px',height:'450px'},
            shift_key: event.shiftKey,
            options:{kbId:kbId, mode:'details', formal_term:formalTerm}
        });
/*
        var formalTerm = formalTerms[id];   // The object, not the formal term string.

        var eventShiftKey = event ? event.shiftKey : null;
        var panel = new Panel('dialog_Generic', 
            eventShiftKey, 
            {left:'400px',top:'20px',width:'400px',height:'390px'}, 
            {widget_name:'formal_term_details', kbId:kbId, formal_term:formalTerm});
       
        //$('#dialog_SourceDetails').dialog_SourceDetails();
*/
    });

    $(widget.element).find('.button_new').on('click', function (event) {    // The New button
        console.debug('BUTTON: Clicked on formal_term New button');
        event.stopPropagation();
        var kbId = widget.options.kbId;
        alert('I am sorry, but I cannot currently let you create a new formal term.\nFormal terms can only be created by being identified in a statement.\nThis is to stop creating orphan formal terms, i.e. terms which are not actually used in statements.');
/*
        var eventShiftKey = event ? event.shiftKey : null;
        var panel = new Panel('dialog_Generic', 
            eventShiftKey, 
            {left:'400px',top:'20px',width:'400px',height:'390px'}, 
            {widget_name:'formal_term_new', kbId:kbId, formal_term:null});
       
        //$('#dialog_SourceDetails').dialog_SourceDetails();
*/
    });

    $(widget.element).find('.button_delete').on('click', function (event) {    // The Delete button
        console.debug('BUTTON: Clicked on formal_term Delete button');
        event.stopPropagation();
        var kbId = widget.options.kbId;
        alert('I am sorry, but I cannot currently let you delete a formal term.\nThis would invalidate all the statements that contain that term.\n');

/*
        var termType = widget.options.term_type;
        var use = widget.options.use;
        var termName = $(widget.element).find('.select_formalterms').val();
        deleteFormalTerm(termName);

        function deleteFormalTerm(termName) {
            for (var i=0; i<kb.formal_terms.length; i++) {
                if (kb.formal_terms[i].term === termName) {
                    kb.formal_terms.splice(i, 1); 
                    var formalTermsArray = AKT.getFormalTerms(kbId, termType, use);
                    AKT.loadOptions(widget.element, 'select_formalterms', formalTermsArray);
                    return;
                }
            }
            return;
        }
*/
    });

    $(widget.element).find('.button_statements').on('click', function (event) {    // The Statements button
        console.debug('BUTTON: Clicked on formal_term Statements button');
        event.stopPropagation();
        var kbId = widget.options.kbId;
        var termType = widget.options.term_type;
        var termName = $(widget.element).find('.select_formalterms').val();

        var eventShiftKey = event ? event.shiftKey : null;
        var panel = new Panel('dialog_Generic', 
            eventShiftKey, 
            {left:'400px',top:'20px',width:'600px',height:'500px'},
            {widget_name:'statements', kbId:kbId, simple_filter_word:termName});

    });

    $(widget.element).find('.legend_formal_term_type').on('click', function (event) {    // Ghost click target for tutorial
        console.log('BUTTON: Clicked on legend_formal_term_type');
        //$(widget.element).find('.select_formalterms option[value="esre"]').attr('selected',true);
/*
        event.stopPropagation();
        var kbId = widget.options.kbId;
        var termType = widget.options.term_type;
        var termName = $(widget.element).find('.select_formalterms').val();


        var panel = new Panel('dialog_Generic', 
            event.shiftKey, 
            {left:'400px',top:'20px',width:'600px',height:'500px'},
            {widget_name:'statements', kbId:kbId, simple_filter_word:termName});
*/
    });

};


AKT.widgets.statement_formal_terms.display = function (widget) {
    console.debug(widget.options);

    var kbId = widget.options.kbId;
    var kb = AKT.KBs[kbId];

    var options = widget.options;    

    if (options.term_type) {
        var term_type_filter = options.term_type;
    } else {
        term_type_filter = 'all';
    }
    //if (options.use) {
    //    var use_filter = options.use;
    //} else {
    //    var use_filter = 'all';
    //}
    kbFormalTerms = kb.findFormalTerms({term_type:term_type_filter});
    console.log('aaa ',kbFormalTerms);
    var statement = options.statement; 
    var statementFormalTerms = statement.findFormalTerms(term_type_filter);  
    console.log('bbb ',statementFormalTerms);
    //}

/* Sept 2022 Note sure what this code is doing.   Commented out.
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
    var nFormalTerms = Object.keys(formalTerms).length;

    AKT.loadSelectOptions(widget.element, 'select_statement_formal_terms', statementFormalTerms, ['id','id']);

    AKT.loadSelectOptions(widget.element, 'select_kb_formal_terms', kbFormalTerms, ['id','id']);

    $(widget.element).find('.div_nsources').text(nFormalTerms);

   //$(widgetElement).draggable({containment:'#workspace',handle:".titlebar"});
    //$(widgetElement).css({display:'block'});

};


AKT.widgets.statement_formal_terms.html = `
<div class="content" style="border:none; padding-left:15px;padding-right:15px;">

    <fieldset style="float:left;">
        <legend>Formal Terms in statement : </legend>
        <select class="select_statement_formal_terms" size=15 style="width:225px; background:white"></select>
    </fieldset>

    <fieldset style="float:left;">
        <legend>Formal Terms in KB : </legend>
        <select class="select_kb_formal_terms" size=15 style="width:225px; background:white"></select>
    </fieldset>

    <div style="float:left;margin-left:30px;margin-top:40px;">
        <button class="button_details" style="width:70px;height:30px;">Details</button><br/>
    </div>

    <div style="clear:both;"></div>

    <div style="display:none;margin-top:12px;">
        <div class="label" style="float:left;">Number of terms:</div>
        <div class="number" style="float:left;margin-left:10px;"></div>
    </div>
</div>     <!-- End of content div -->
`;



