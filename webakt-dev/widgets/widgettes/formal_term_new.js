AKT.widgets.formal_term_new = {};


AKT.widgets.formal_term_new.setup = function (widget) {
/*
    var widgetSettings = $('<div></div>');
    $(widget.element).append(widgetSettings);

    var kbSelectElement = AKT.makeReprocessSelector(widget.element, widget.widgetName,
        'Knowledge base', AKT.getKbIds(), AKT.state.current_kb, 'kbId');
    $(widgetSettings).append(kbSelectElement);
*/
};


AKT.widgets.formal_term_new.display = function (widget) {
    console.debug('AKT.widgets.formal_term.display: ',widget.options);
    AKT.loadOptions(widget.element, 'select_types', [
        'action','attribute','comparison','link','process','value']);
   
    $(widget.element).find('.button_create').on('click', function () {
        var formalTerm = {};
        formalTerm.term = $(widget.element).find('.textarea_term').val();
        formalTerm.type = $(widget.element).find('.select_types').val();
        formalTerm.definition = $(widget.element).find('.textarea_definition').val();
        formalTerm.synonyms = $(widget.element).find('.textarea_synonyms').val().split(',');
        
        var kbId = widget.options.kbId;
        var kb = AKT.kbs[kbId];
        kb.formal_terms.push(formalTerm);
        $(widget.element).css('display','none');
    });
};


AKT.widgets.formal_term_new.html = `
<div class="content" style="border:none; padding:15px;">

    <div>
        <div style="float:left;width:80px;height:20px;">Formal Term</div>
        <textarea class="textarea_term" style="float:left;width:170px;height:20px;"></textarea>

        <div style="clear:left; float:left;width:40px;height:20px;margin-left:40px;">Type</div>
            <select class="select_types" size=6 style="float:left;width:110px; background:white"></select>

        <div style="clear:both;"></div>
    </div>

    <div style="margin-top:15px;">

        <div class="object_only" style="display:none;">
            <div style="float:left;width:45px;height:20px;">Part of :</div>
            <select class="select_superobjects" size=3 style="float:left;width:110px; background:white"></select>

            <div style="float:left;width:35px;height:20px;margin-left:15px;">Parts:</div>
            <select class="select_subobjects" size=3 style="float:left;width:110px; background:white"></select>

            <div style="clear:both;"></div>
        </div>

        <div style="clear:both;"></div>
    </div>

    <div style="margin-top:15px;">
        <div style="clear:left;float:left;width:60px;height:20px;">Definition: </div>
        <textarea class="textarea_definition" style="float:left;width:240px;height:65px;"></textarea>

        <div style="clear:both;"></div>
    </div>

    <div style="margin-top:10px;">
        <div style="clear:both;width:70px;height:20px;margin-left:100px;">Synonym(s) (separated by comma):</div>

        <div style="float:left;">
            <textarea class="textarea_synonyms" size=4 style="float:left;width:200px;margin-left:10px;margin-right:10px;background:white"></textarea>
        </div>

        <div style="display:none;"margin-top:0px;">
            <button class="button_add" style="margin:0px;width:50px;height:30px;">Add</button><br/>
            <button class="button_delete" style="margin-top:6px;width:50px;height:30px;">Delete</button>
        </div>
    </div>

    <div style="margin-top:10px;">
        <button class="button_create" style="float:right;width:55px;height:35px;margin-left:10px;" title="Click 'Create' if you wish to create this entry in the knowledge base">Create</button>
        <div style="clear:both;"></div>
    </div>

</div>     <!-- End of content div -->
`;



