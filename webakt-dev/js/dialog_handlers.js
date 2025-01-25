// This file (mainly) contains event handlers for dialog controls, ordered
// alphabetically.

// Note added 24 April 2022.   This WHOLE FILE is surely redundant, since all
// dialog handling should now be being done in individual widgets.
// TODO: Test this, by un-<scripting> this file altogether, and checking 
// everything out.

// A note on the use of event.stopPropagation()...
// This is added to *every* event handler, on the grounds that the *only*
// thing we want to do with that event is the immediate task of actioning
// whatever control was interacted with (e.g. button clicked, listbox 
// selection made).   It is important to stop events bubbling up to the 
// level of the panel, because there is a general-purpose handler (for the 
// selector '.panel') which brings it to the top whenever the body of the 
// panel is clicked.  If we didn't intercept clicks on buttons etc, then 
// any such click would bring its panel to the top, which is what we do not
// want if the job of the click is to open up a new dialog panel.



$(document).ready(function() {

// =============================================================================
// EVENTS
// In alphabetical order by dialog ID, except for initial Welcome dialog
// and generic class events (e.g. dialog X button to close it).


// -----------------------------------------------------------------------
// Welcome dialog
    $('#welcome60').on('click', function (event) {
        $('#welcome').css({display:"none"});
        $('#menus').css({display:"block"});
    });

    $('#xxxxxxxxxxxx').on('click', function (event) {
        console.log('Clicked on playback');
        AKT.timer = setInterval(AKT.singleStep,500);
    });


// -----------------------------------------------------------------------
// Class events

    // This event is not detected - not sure why.  Something to dowith event handler
    // deared beore widget created?   Bute doesn't seem to apply to .panel handler below.
    $('.dialog_close_buttonxxx').on('click', function (event) {
        console.debug("dialog_handlers.js - $('.dialog_close_button').on('click', function (event)");
        //var id = $(this).parent().parent()[0].id;
        //$('#'+id).css({display:"none"});
        var widgetElemet = $(this).parent().parent()[0];
        $(widgetElement).css({display:"none"});
    });

    $('.panel').on('click', function (event) {
        event.stopPropagation();
        if ($(this).hasClass('always_on_top')) return;
        AKT.incrementZindex("$('.panel').on('click', function ()");
        $(this).css({"z-index":AKT.state.zindex, zindex:AKT.state.zindex});
    });

    $('.panel').on('dragstart', function (event) {
        AKT.incrementZindex("$('.panel').on('dragstart', function ()");
        $(this).css({"z-index":AKT.state.zindex, zindex:AKT.state.zindex});
    });

    $("#macros_montage106").on("click", function () {   // Print tool montage, or save to pdf
        var divContents = $("#montage_1").html();
        var printWindow = window.open('', '', 'height=400,width=1200');
        printWindow.document.write('<html><head><title>Tool montage contents</title>');
        printWindow.document.write('</head><body >');
        printWindow.document.write(divContents);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
    });
 
// --------------------------------------------------------------------------
// Events aattached to individual elements (i.e. "controls"), ordered by dialog ID.


// ===================================================================  
// ========================================================================addtopic
    $('#addtopic101').on('click', function (event) {
        event.stopPropagation();
        $('#addtopic').css({display:"none"});
    });



// ===================================================================  
// ====================================================================boolean_search
    $('#boolean_search110xxx').on('click', function(event) {    // Search button
        event.stopPropagation();
        console.debug('BUTTON: Clicked on boolean_search Search button');
        var searchExpression = $('#boolean_search800').val();
        var widgetPanelId = AKT.createWidgetPanel("boolean_search");
        var kbId = AKT.state.current_kb;
        $('#'+widgetPanelId).boolean_search({kb:kbId, search_term:searchExpression});
    });



// ======================================================== formalterms
// ======================================================= formalterms: Details button


// ======================================================== formalterms: New button
    $('#formalterms104').on('click', function(event) {   
        event.stopPropagation();
        console.debug('BUTTON: Clicked on formalterms104 New button');
        AKT.showDialog('newformalterm');
    });


// ========================================================= formalterms: Delete button
    $('#formalterms105').on('click', function(event) {   
        event.stopPropagation();
        console.debug('BUTTON: Clicked on formalterms105 Delete button');
    });


// ========================================================= formalterms: ""
    $('#formalterms400').on('click', function(event) {   
        event.stopPropagation();
        console.debug('SELECT: Clicked on "Formal terms in selected definition" listbox');
    });


// =================================================== formalterms: " select
    $('#formalterms500xxx').on('click', function(event) {   
        event.stopPropagation();
        console.debug('SELECT: Clicked on "Formal term type" listbox');

        $('#formalterms400').empty();
        var kbId = AKT.state.current_kb;
        var selector = $('#formalterms500').find(':selected').text();
        console.debug(selector);
        var formalTermsArray = AKT.getFormalTerms(kbId,selector);
        AKT.loadOptions('formalterms400', formalTermsArray);
    });


// =================================================== formalterms: select
    $('#formalterms550').on('click', function(event) { 
        event.stopPropagation();
        console.debug('SELECT: Clicked on "Use in formal definitions" listbox');
    });



// ===================================================================  
// ===================================================================metadata    
    $('#metadata101').on('click', function (event) {      // Topics button
        event.stopPropagation();
        console.debug('BUTTON: Clicked on metadata Topics button');
        AKT.dialogOpener.topicHierarchies(AKT.state.current_kb);
        AKT.showDialog('topicHierarchies');
    });



// ===================================================================   
// ===================================================================kb_metadata    
    $('#metadata > .content > textarea').on('click', function (event) {     
        console.debug(104);
        AKT.kbs.new_kb.metadata = {
            name:$('#metadata800').val(),
            title:$('#metadata801').val(),
            description:$('#metadata802').val(),
            author:$('#metadata803').val(),
            acknowledgements:$('#metadata804').val(),
            studyarea:$('#metadata805').val(),
            methods:$('#metadata806').val(),
            timing:$('#metadata807').val()
        };
        localStorage.setItem('webakt_new_kb',JSON.stringify(AKT.kbs.new_kb));
    });



// ===================================================================  
// ===================================================================== list_select   
// In place of the macro list(select,List,Response) 
    $('#list_select120').on('click', function (event) {
        event.stopPropagation();
    });



// ===================================================================  
// ==================================================================  macros

// ============================================================================macros_montage
    $('#macros_montage102').on('click', function(event) {   // Run button
        console.debug('BUTTON: Clicked on tools (macros_montage) Run button');
        event.stopPropagation();

        var widgetPanelId = AKT.createWidgetPanel(AKT.state.current_tool,{containerId:'montage_1'});
        $('#'+widgetPanelId)[AKT.state.current_tool]({display:'montage'});

        AKT.incrementZindex("webakt1:$(.macros_montage102).on(click)/"+AKT.state.current_tool);
        $('#'+widgetPanelId).css({'z-index':AKT.state.zindex,'box-shadow':'none',height:'auto'});     
        $('#'+widgetPanelId+' > .titlebar').css({display:'none'});
        $('#'+widgetPanelId+' > .content').css({background:'none',border:'none',height:'auto'});
        $('#'+widgetPanelId+' > .content > div').css({overflow:'visible'});
        $('#'+widgetPanelId+' > .content > div').css({overflow:'visible'});

        $('#montage_1').find('.contents').append('<li>'+widgetPanelId+'</li>');
    });

    $('#macros_montage400').on('change', function (event, value) {
        console.debug('LISTBOX: Clicked on tools (macros_montage) tools listbox');
        event.stopPropagation();
        if (this.value === '') {
            var optionValue = value;
        } else {
            optionValue = this.value;
        }
        AKT.state.current_tool = optionValue;
    });


// ========================================================================= sources

// =================================================================statementdetails
    $('#statementdetails100').on('click', function (event) {
        event.stopPropagation();
        console.debug('SELECT: Clicked on statementdetails100: Save button');
        var newFormal = $('#statementdetails802').val();
        console.debug(newFormal);
        var nestedlist = AKT.makeNestedlist(newFormal);
        var english = AKT.translate(nestedlist);
        var kbId = AKT.state.current_kb;
        var n = AKT.kbs[kbId].sentences.length;
        var sentence = {id:n,formal:newFormal,nested_list:nestedlist,source:'blank',type:'attribute',formal_terms:[],english:english};
        console.debug(sentence);
        AKT.kbs[kbId].sentences.push(sentence);
    
        var englishStatements = [];
        var sentences = AKT.kbs[kbId].sentences;
        for (var i=0; i<sentences.length; i++) {
            englishStatements.push(i+1+': '+sentences[i].english);
        }
        AKT.loadOptions('viewallstatements400',englishStatements);

        $('#statementdetails').css({display:'none'});
    });


    $('#statementdetails102').on('click', function (event) {    
        event.stopPropagation();
        console.debug('SELECT: Clicked on statementdetails102: Translate button');
        var newFormal = $('#statementdetails802').val();
        var nestedlist = AKT.makeNestedlist(newFormal);
        var english = AKT.translate(nestedlist);
        $('#statementdetails800').val(english);
    });        



// =================================================================topicDetail
    $('#topicDetail102').on('click', function (event, value) {        //Show use in statements button
        AKT.dialogOpener.viewallstatements(AKT.state.current_kb);
    });



// =================================================================topicGeneral
    $('#topicGeneral100').on('click', function (event, value) {        // Details/Edit button
        var kbId = AKT.state.current_kb;
        var topicName = AKT.state.current_topic;
        AKT.dialogOpener.topicDetail(kbId,topicName);
        AKT.showDialog('topicDetail');
    });


    $('#topicGeneral400').on('change', function (event, value) {       // In this case, no action is taken.
        event.stopPropagation();
        if (this.value === '') {
            var optionValue = value;
        } else {
            optionValue = this.value;
        }
        AKT.state.current_topic = optionValue;
        console.debug(optionValue);
    });


// =================================================================topicHierarchies
    $('#topicHierarchies103xxx').on('click', function (event) {
        event.stopPropagation();
        console.debug('SELECT: Clicked on topicHierarchies listbox');
        AKT.showDialog('newTopicHierarchy');
    });

    // This is here purely because it works - it stops [the click associated 
    // with the next event handler being picked up and stopping
    // topicHierarchies having the highest z-index].
    $('#topicHierarchies400xxx').on('click', function (event, value) {
        event.stopPropagation();
    });

    $('#topicHierarchies400xxxx').on('change', function (event, value) {
        event.stopPropagation();
        // Needed this, since this.value is blank when triggered (in AKT.singleStep).
        if (this.value === '') {
            var optionValue = value;
        } else {
            optionValue = this.value;
        }
        var topicId = optionValue;
        AKT.dialogOpener.topic_hierarchy(topicId);
    });


// ==================================================================topic hierarchy
    $('#topic_hierarchy402').on('change', function (event, value) {
        event.stopPropagation();
        var kbId = AKT.state.current_kb;
        var kb = AKT.kbs[kbId];
        var topicTree = kb.extras.topicTree;
        //var topicId = this.value;
        if (this.value === '') {
            var optionValue = value;
        } else {
            optionValue = this.value;
        }
        var topicId = optionValue;
        $('#topic_hierarchy800').text(topicId);
        $('#topic_hierarchy802').text(topicId);
        AKT.loadOptions('topic_hierarchy401', topicTree[0][topicId]);
        var supertopics = AKT.getAllAncestors(topicTree, topicId);
        AKT.loadOptions('topic_hierarchy400', supertopics);

    });

    $('#topic_hierarchy108').on('click', function (event) {
        event.stopPropagation();
        AKT.showDialog('memo');
    });

    $('#topic_hierarchy105').on('click', function (event) {
        event.stopPropagation();
        AKT.showDialog('topicDetail');
    });

    $('#topic_hierarchy102').on('click', function (event) {
        event.stopPropagation();
        AKT.showDialog('addtopic');
    });

    $('#topic_hierarchy104').on('click', function (event) {
        event.stopPropagation();
        AKT.showDialog('movetopic');
    });

    $('#topic_hierarchy107').on('click', function (event) {
        event.stopPropagation();
        AKT.showDialog('viewallstatements');
    });


// =================================================================viewallstatements

    $('#viewallstatements400xxx').on('change', function (event, value) {
        event.stopPropagation();
        // Needed this, since this.value is blank when triggered (in AKT.singleStep).
        if (this.value === '') {
            var optionValue = value;
        } else {
            optionValue = this.value;
        }
        var kbId = AKT.state.current_kb;
        var kb = AKT.kbs[kbId];

        $('#viewallstatements800').text(optionValue);

        var i = parseInt(optionValue.split(':')[0],10);
        var formal = kb.sentences[i-1].formal;
        $('#viewallstatements801').text(i+': '+formal);
        
    });

    $('#viewallstatements102xxx').on('click', function (event) {
        event.stopPropagation();
        AKT.showDialog('statementdetails');
    });


});

