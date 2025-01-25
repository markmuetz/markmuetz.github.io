AKT.widgets.boolean_search = {};


AKT.widgets.boolean_search.setup = function (widget) {

    var widgetContent = widget.element.find('.content');
    // The types of term that can be used in a search expression are the various
    // formal_term types, which appear in the selected statements themselves, plus 
    // sources and topics, which are associated with statements.   These are not
    // distinguished in any way - we therefore must check a term against the three
    // lists to see whether it is a valid term and what type it is.   This of course
    // assumes that each term must be of only one type.
/*
    var types = {
        action:{id:'action'},
        attribute:{id:'attribute'},
        object:{id:'object'},
        process:{id:'process'},
        source:{id:'source'},
        topic:{id:'topic'}
    };
    AKT.loadSelectOptions(widgetContent, 'listbox_types', types, ['id','id']);
*/

    var widgetSettings = $('<div></div>');
    $(widget.element).find('.content').prepend(widgetSettings);

    var selectElement = AKT.makeReprocessSelector(
        widget.element, 
        widget.widgetName,
        'Category', 
        ['all','action','attribute','comparison','link','object','process','value'], 
        'all',                 // Default value.
        'term_type',           // Name of the widget option that is assigned the listbox (<select>) option.
        'formal_term_type');   // Class name for the listbox (<select>) element.
    $(widgetSettings).append(selectElement);


    $(widgetContent).find('.button_select').on('click', function () {
/*
        // Allow for multiple selection, interpreted as disjunction.
        var selecteds = $(widgetContent).find('.listbox_type_values').val();
        if (selecteds.length === 1) {
            var selectedsString = ' '+selecteds[0]+' ';
        } else {
            var selectedsString = '('+selecteds[0];
            for (var i=1;i<selecteds.length;i++) {
                selectedsString += ' or '+selecteds[i];
            }
            selectedsString += ')';
        }
*/
        var selectedsString = $(widgetContent).find('.listbox_type_values').val();
        var currentSearchExpression = $(widgetContent).find('.textarea_search_box').val();
        $(widgetContent).find('.textarea_search_box').val(currentSearchExpression+selectedsString);
    });

    $(widgetContent).find('.button_and').on('click', function () {
        var currentSearchExpression = $(widgetContent).find('.textarea_search_box').val();
        $(widgetContent).find('.textarea_search_box').val(currentSearchExpression+' and ');
    });

    $(widgetContent).find('.button_or').on('click', function () {
        var currentSearchExpression = $(widgetContent).find('.textarea_search_box').val();
        $(widgetContent).find('.textarea_search_box').val(currentSearchExpression+' or ');
    });

    $(widgetContent).find('.button_not').on('click', function () {
        var currentSearchExpression = $(widgetContent).find('.textarea_search_box').val();
        $(widgetContent).find('.textarea_search_box').val(currentSearchExpression+' not ');
    });

    $(widgetContent).find('.button_clear').on('click', function () {
        $(widgetContent).find('.textarea_search_box').val('');
    });

    $(widgetContent).find('.button_searchXXX').on('click', function () {
        event.stopPropagation();
        var kbId = widget.options.kbId;
        var kb = AKT.kbs[kbId];


        var searchExpression = $(widgetContent).find('.textarea_search_box').val();
        var searchExpressionJs = AKT.convertSearchExpressionToJavascript(searchExpression);

        var eventShiftKey = event ? event.shiftKey : null;
        var panel = new Panel('dialog_Generic', 
            eventShiftKey, 
            {left:'650px',top:'20px',width:'580px',height:'550px'},
            {widget_name:'statements', kbId:kbId, filters:{search_expression_js:searchExpressionJs}});

/*  This is the code used for the topic_details.js Statements button.   Note that it is in terms of the
    TOPIC, not the SEARCH EXPRESSION.   We either have to create a dummy topic behind the scenes, or
    make a new filter which works directly with the Boolean expression.
        var panel = AKT.panelise({
            widget_name:'collection',
            position:{left:'20px',top:'20px'},
            size:{width:'550px',height:'540px'},
            shift_key: eventShiftKey,
            options:{kbId:AKT.state.current_kb,item_type:'statement',filters:{topic:{[topic._id]:true}}}
        });
*/
    });

    $(widgetContent).find('.button_mysearch').on('click', function () {
        var kbId = widget.options.kbId;
        var kb = AKT.kbs[kbId];

        // The user has to type in pure JavaScript!
        var searchExpressionJs = $(widgetContent).find('.textarea_search_box').val();

        var eventShiftKey = event ? event.shiftKey : null;
        var panel = new Panel('dialog_Generic', 
            eventShiftKey, 
            {left:'650px',top:'20px',width:'580px',height:'550px'},
            {widget_name:'statements', kbId:kbId, extended_boolean_search:searchExpressionJs});
    });


    $(widget.element).find('.button_create_topic').on('click', function (event) {    // The New button
        console.debug('BUTTON: Clicked on boolean_search create_topic button');
        event.stopPropagation();
        var kbId = widget.options.kbId;

        var searchExpression = $(widget.element).find('.textarea_search_box').val();
        var searchExpressionJs = AKT.convertSearchExpressionToJavascript(searchExpression);
        console.log(2010,searchExpressionJs);
        var panel = AKT.panelise({
            widget_name:'topic_details',
            position:{left:'650px',top:'20px'},
            size:{width:'580px',height:'450px'},
            shift_key: event.shiftKey,
            options:{kbId:kbId, mode:'new', search_expression:searchExpression}
        });
    });

};


AKT.widgets.boolean_search.display = function (widget) {

    var widgetContent = widget.element.find('.content');

    console.log(9101,widget.options);
    var kbId = widget.options.kbId;
    var kb = AKT.KBs[kbId];

/*
    var type = $(widget.element).find('.listbox_types').val();
    if (['attribute','action','object','process','value'].includes(type)) {
        var type_values = {};
        for (var id in kb._formalTerms) {
            var term = kb._formalTerms[id];
            if (term.type === type) {
                type_values[term.id] = term;
            }
        }
    } else if (type === 'source') {
        type_values = kb._sources;
    } else if (type === 'topic') {
        type_values = kb._topics;
    }
    console.log(widgetContent,type_values);
    AKT.loadSelectOptions(widgetContent, 'listbox_type_values', type_values, ['id','id']);
    $(widget.element).blur();
*/

    var options = widget.options;    
    if (options.term_type) {
        var term_type_filter = options.term_type;
    } else {
        term_type_filter = 'all';
    }

    var language_filter = 'english';

    if (term_type_filter === 'all') {
        var filters = {};
    } else {
        var filters = {termtype:{[term_type_filter]:true}};
    }
    //var formalTerms = kb.findFormalTerms({term_type:term_type_filter});
    //formalTerms = kb.findFormalTerms({term_type:term_type_filter,language:language_filter,filters:filters});
    formalTerms = kb.findFormalTerms(filters);

    console.log('\noptions: ',widget.options);
    console.log('term_type_filter: ',term_type_filter);
    console.log('formalTerms: ',formalTerms);
    AKT.loadSelectOptions(widgetContent, 'listbox_type_values', formalTerms, ['id','id']);
};


AKT.widgets.boolean_search.html = `
<div class="content" style="border:none; padding:7px; width:450px;">
<div>
    <div style="float:left;margin-top:0px;">
        <select class="listbox_type_values" size=10 style="width:240px; background:white;margin-top:10px;"></select><br/>
        <button class="button_details" style="width:150px;height:25px;margin-top:5px;">Details for selected term</button>
        <button class="button_select" style="width:60px;height:25px;margin:3px;">Select</button><br/>
    </div>

    <div style="float:left;text-align:left;margin-top:0px;">
        <fieldset disabled>
            <legend>Search options</legend>

            <input class="radio_object radio" type="radio">
            <label>object</label><br/>

            <input class="radio_subobjects radio" type="radio">
            <label>subobjects</label><br/>

            <input class="radio_superobjects radio" type="radio">
            <label>superobjects</label><br/>

        </fieldset>
    </div>


    <fieldset style="float:left;width:95%;margin-top:5px;">
        <legend>Boolean Search String</legend>
        <button class="button_and" style="width:35px;height:20px;">and</button>
        <button class="button_or" style="width:35px;height:20px;margin-left:5px;">or</button>
        <button class="button_not" style="width:35px;height:20px;margin-left:5px;">not</button>
        <button class="button_clear" style="float:right;width:60px;height:20px;">Clear</button>
        <textarea class="textarea_search_box" style="margin-top:4px;width:100%;height:45px;" title="Try entering: &#10&nbsp;&nbsp;trees&#10or &#10&nbsp;&nbsp;trees and (water or moisture)"></textarea>
    </fieldset>

    <button class="button_create_topic" style="float:right;width:80px;height:30px;margin:10px;">Create topic</button>
    <button class="button_search" style="display:none;float:right;width:70px;height:30px;margin:10px;">Search</button>
    <button class="button_mysearch" style="display:none; float:right;width:70px;height:30px;margin:10px;">MySearch</button>

<div style="clear:both"></div>
</div>
</div>     <!-- End of content div -->
`;

/* IMPORTANT NOTE, Dec 2021
The following HTML coresponds closely to the Boolean Search dialog window which displays 
in the latest (2020) version of AKT5, the one I installed at the start of the webAKT project.
It includes some checkboxes - the ones listed below in the HTML code.   
HOWEVER: these do not appear in the version of the dialog window which is shown in the
version of the AKT5 Manual (dated 2001!)which is available for download from the AKT5 website.
For consistency with the Manual, and because I do not understand what a couple of the checkboxes
actually do, I have used the version of the dialog window described in the Manual, adapted
slightly to improve positioning of buttons.
 
AKT.widgets.boolean_search.html = `
<div class="content" style="border:none; padding:10px; width:560px;">

    <div style="float:left;margin-top:10px;">
        <fieldset style="width:200px;">
            <div>Display knowledge base terms of the type:...</div>
            <select class="listbox_term_type" style="width:180px;height:20px;"></select>

            <select class="listbox_terms" size=16 style="width:180px; background:white;margin-top:10px;"></select>
        </fieldset>
    </div>

    <div style="float:left;text-align:center;margin-top:10px;">
        <button class="button_details" style="width:70px;height:35px;margin-top:70px;">Details</button>
        <fieldset style="text-align:center;margin-top:40px;">
            <legend>Search box editing</legend>
            <button class="button_select" style="width:60px;height:20px;margin:3px;">Select</button><br/>
            <button class="button_and" style="width:35px;height:20px;margin:3px;">AND</button>
            <button class="button_or" style="width:35px;height:20px;margin:3px;">OR</button><br/>
            <button class="button_not" style="width:35px;height:20px;margin:3px;">NOT</button><br/>
            <button class="button_brackets" style="width:60px;height:20px;margin:3px;">( ... )</button><br/>
            <button class="button_clear" style="width:60px;height:20px;margin:3px;">Clear</button>
        </fieldset>
    </div>

    <fieldset style="float:left; width:200px;">
        <legend>Search options</legend>

        <input class="radio_object radio" type="radio">
        <label>object</label><br/>

        <input class="radio_subobjects radio" type="radio">
        <label>subobjects</label><br/>

        <input class="radio_superobjects radio" type="radio">
        <label>superobjects</label><br/>

        <input class="checkbox_formal_terms checkbox" type="checkbox">
        <label>Search the statement's formal terms</label><br/>

        <input class="checkbox_conditions checkbox" type="checkbox">
        <label>Search the statement's conditions</label><br/>

        <input class="checkbox_sources checkbox" type="checkbox">
        <label for="boolean_search117">Search the statement's sources</label><br/>

        <input class="checkbox_knowledge_categories checkbox" type="checkbox">
        <label>Search the knowledge categories</label><br/>


        <input class="checkbox_user_value checkbox" type="checkbox">
        <label>Allow 'user value' matches within any of a statement's sources.</label><br/>

        <input class="input_min_sources" type="text" style="width:25px;"> <!-- NOTE: This was a textarea! -->
        <label>Search statements with a minimum of 'N' sources.</label><br/>
    </fieldset>

    <fieldset style="float:left;width:95%;margin-top:5px;">
        <legend>Boolean Search String</legend>
        <textarea class="textarea_search_box" style="width:100%;height:45px;" title="Try entering: &#10&nbsp;&nbsp;trees&#10or &#10&nbsp;&nbsp;trees and (water or moisture)"></textarea>
    </fieldset>

    <button class="button_create_topic" style="float:right;width:80px;height:30px;margin:10px;">Create topic</button>
    <button class="button_search" style="float:right;width:70px;height:30px;margin:10px;">Search</button>

</div>     <!-- End of content div -->
`;
*/



