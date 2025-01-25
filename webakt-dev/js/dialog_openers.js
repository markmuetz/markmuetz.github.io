// dialog_openers.js
// Robert Muetzelfeldt, June 2021
// Populates the object AKT.dialogOpener with functions, in alphabetical order.
// Each function manages the opening of one dialog, on the basis of
// zero or more arguments.
// The name of the function is exactly the same as the ID of the dialog's HTML.

// Note that previously the code responsible for opening a dialog was held
// in AKT.menuHandlers or AKT.dialogHandlers.   However, some dialogs
// can be opened in more than one way, so it makes sense to extract the
// code for doing this into a separate groupp of functions.



AKT.dialogOpener.formalterms = function(kbId) {
    $('#formalterms').css({display:"block", float:"none", "z-index":AKT.state.zindex, zindex:AKT.state.zindex});

    AKT.loadOptions('formalterms500', ['all','action','attribute','comparison','link','object','process','value']);
    AKT.loadOptions('formalterms550', ['all','Formal Statements','Formal Cnditions','Object Hierarchies','Unused']);

    var kbId = AKT.state.current_kb;
    var selector = $('#formalterms500').val();
    var formalTermsArray = AKT.getFormalTerms(kbId,selector);
    AKT.loadOptions('formalterms400', formalTermsArray);
};



AKT.dialogOpener.formaltermdetails = function(kbId,formaltermId) {
    $('#formaltermdetails').css({display:"block", float:"none", "z-index":AKT.state.zindex, zindex:AKT.state.zindex});
    $('#formaltermdetails801').text(formaltermId);
};



AKT.dialogOpener.metadata = function(kbId) {
    var kb = AKT.kbs[kbId];
    console.debug(kbId);
    $('#metadata800').text(kb.metadata.title);
    $('#metadata801').text(kb.metadata.description);
    $('#metadata802').text(kb.metadata.author);
    $('#metadata803').text(kb.metadata.acknowledgements);
    $('#metadata804').text(kb.metadata.associated_documentation);
    $('#metadata805').text(kb.metadata.study_area);
    $('#metadata806').text(kb.metadata.methods);
    $('#metadatao807').text(kb.metadata.timing);
    AKT.showDialog('metadata');
    $('#metadata').draggable({containment:'#workspace',handle:".title-bar"});
};



AKT.dialogOpener.macros = function() {
    $('#macros').css({display:"block", float:"none", "z-index":AKT.state.zindex, zindex:AKT.state.zindex});
    $('#macros400').empty();

    // Note how easy it is to get the widgets (*not* the widget instances).
    // It's picking it up from the .akt object, at the start of each widget's code:
    //     $.widget('akt.statements_summary', {...
    // If we wanted to, we could get e.g. a title or the widget description, from
    // widgets[widgetId].metadata.
    // I prefer the actual name (e.g. "statements_summary"), rather than a prettified version of it
    // (e.g. Statements summary", or worse, "Summary of statements". since that would make it harder
    // to find its code etc.
    var widgets = window.jQuery.akt;
    for (var widgetId in widgets) {
        var option = $('<option value="'+widgetId+'">'+widgetId+'</option>');
        $('#macros400').append(option);
    }
};



AKT.dialogOpener.sourcedetails = function(kbId,sourceIndex) {

    var kb = AKT.kbs[kbId];

    if (sourceIndex) {
        var sourceObject = AKT.getSources(kbId)[sourceIndex];  
        $('#sourcedetails801').text(sourceObject.name);
        $('#sourcedetails802').text(sourceObject.location);
        $('#sourcedetails803').text(sourceObject.year);
        $('#sourcedetails804').text(sourceObject.suffix);
        $('#sourcedetails901').text(sourceObject.interviewer);
        $('#sourcedetails902').text(sourceObject.interviewee);

    } else {         //sourceIndex = null - i.e. it's a new sorce
        $('#sourcedetails801').text('');
        $('#sourcedetails802').text('');
        $('#sourcedetails803').text('');
        $('#sourcedetails804').text('');
        $('#sourcedetails901').text('');
        $('#sourcedetails902').text('');
    }

    // TODO: Doesne't show selected options! - i.e. values for current source
    $('#sourcedetails500').empty();
    $.each(kb.sourceUserLabels, function(labelId,possibleValues) {
        var label = $('<label style="display:inline-block;width:120px;margin-top:10px;">'+labelId+'</label>');
        var select = $('<select style="width:150px;background:white;"></select>');
        $.each(possibleValues, function(i,val) {
            var option = $('<option value="'+val+'">'+val+'</option>');
            $(select).append(option);
        });
        $('#sourcedetails500').append(label).append(select);
    });
    AKT.showDialog('sourcedetails');
};


AKT.dialogOpener.sources = function(kbId) {
    $('#sources').css({display:"block", float:"none", "z-index":AKT.state.zindex, zindex:AKT.state.zindex});
    var sources = AKT.getSources(kbId);  
    console.debug('\n',sources);
    var sourceNames = [];
    $.each(sources, function(i,source) {
        console.debug(source);
        if (source) {
            sourceNames.push(source.name+','+source.location+','+source.year+source.suffix);
        }
    });
    AKT.loadOptions('sources400', sourceNames, true);
};



AKT.dialogOpener.topicDetail = function(kbId, topicName) {
    console.debug('topicDetail selected!');
    var topics = AKT.getTopics(kbId);
    for (var i=0; i<topics.length; i++) {
        var topic = topics[i];
        if (topicName === topic.name) {
            break;
        }
    }
    console.debug(topic);
    console.debug(kbId,topic.name);
    $('#topicDetail801').val(topic.name);
    $('#topicDetail802').val(topic.description);
    $('#topicDetail804').val(topic.search_term);
    $('#topicDetail200').prop('checked',false);
    $('#topicDetail201').prop('checked',false);
    $('#topicDetail202').prop('checked',false);
    if (topic.objects === 'object') {
        $('#topicDetail200').prop('checked',true);
    } else if (topic.objects === 'object+subobjects') {
        $('#topicDetail200').prop('checked',true);
        $('#topicDetail201').prop('checked',true);
    }
    AKT.dialogOpener.viewallstatements(AKT.state.current_kb);

    AKT.showDialog('topicDetail');
};



AKT.dialogOpener.topicGeneral = function(kbId) {
    console.debug('topicGeneral selected!');
    var topics = AKT.getTopics(kbId);
    var topicNames = [];
    $.each(topics, function (i,topic) {
        topicNames.push(topic.name);
    });
    AKT.loadOptions('topicGeneral400', topicNames);
    AKT.showDialog('topicGeneral');
};



AKT.dialogOpener.topicHierarchies = function(kbId) {
    var topicHierarchies = AKT.getHierarchies(kbId, "subtopics");
    AKT.loadOptions('topicHierarchies400', topicHierarchies);
    AKT.showDialog('topicHierarchies');
};



AKT.dialogOpener.topic_hierarchy = function(topicId) {
    var kbId = AKT.state.current_kb;
    var kb = AKT.kbs[kbId];
    var topicTree = kb.extras.topicTree;
    $('#topic_hierarchy1005').text(topicId);
    $('#topic_hierarchy1006').text(topicId);
    $('#topic_hierarchy800').text(topicId);
    $('#topic_hierarchy801').text(topicId);
    $('#topic_hierarchy802').text(topicId);
    var allSubtopicIds = AKT.getAllDescendants(topicTree, topicId); 
    AKT.loadOptions('topicHierarchies401', allSubtopicIds);
    AKT.loadOptions('topic_hierarchy402', allSubtopicIds);
    AKT.loadOptions('topic_hierarchy401', topicTree[0][topicId]);
    AKT.showDialog('topic_hierarchy');
};



AKT.dialogOpener.viewallstatements = function(kbId) {
    $('#viewallstatements').css({display:"block", float:"none", "z-index":AKT.state.zindex, zindex:AKT.state.zindex});
    
    var englishStatements = [];
    var sentences = AKT.kbs[kbId].sentences;
    for (var i=0; i<sentences.length; i++) {
        englishStatements.push(i+1+': '+sentences[i].english);
    }
    AKT.loadOptions('viewallstatements400',englishStatements);

    $('#viewallstatements1009').text(sentences.length);
};
