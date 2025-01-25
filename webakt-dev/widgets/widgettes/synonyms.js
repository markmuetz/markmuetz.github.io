/* 
I had a choice of
AKT.widgets[CodeSection][[WidgetName]
or
AKT.widgets[WidgetName][CodeSection]
and have opted for the latter, since it keeps everything for one widget together.
It also makes it easierto add additional code sections, rather than having to
tinker with the main webAKT file.
It does mean that I need to define
AKT.widgets[WidgetName] as an object, as in the first line below.
*/

AKT.widgets.synonyms = {};

//===================================================== SETUP CODE
// ... for when the widget instance is first created.

AKT.widgets.synonyms.setup = function (widget) {
    var widgetSettings = $('<div></div>');
    $(widget.element).append(widgetSettings);

    var kbSelectElement = AKT.makeReprocessSelector(widget.element, widget.widgetName,
        'Knowledge base', AKT.getKbIds(), AKT.state.current_kb, 'kbId');
    $(widgetSettings).append(kbSelectElement);
};



// =================================================== DISPLAY CODE
// ... for each time the widget instance is called.

AKT.widgets.synonyms.display = function (widget) {
    console.debug('Starting AKT.widgets.display.dialog_Synonyms');
    var kbId = widget.options.kbId;
    var kb = AKT.kbs[kbId];
    var formalTerms = kb.formal_terms;
    AKT.reverse_synonym = {};
    var synonyms = [];
    $.each(formalTerms, function (i,formalTerm) {
        if (formalTerm.synonyms && formalTerm.synonyms.length>0) {
            $.each(formalTerm.synonyms, function(j,synonym) {
                synonyms.push(synonym);
                AKT.reverse_synonym[synonym] = formalTerm.term;
            });
        }
    });
    AKT.loadOptions('synonyms400', synonyms.sort(function (a, b) {
        return a.toLowerCase().localeCompare(b.toLowerCase());
    }));


    // EVENT HANDLERS
    $('#synonyms102').on('click', function() {
        $('#dialog_FormalTermDetails').dialog_FormalTermDetails();
    });

    $('#synonyms400').on('change', function() {
        if (this.value === '') {
            var optionValue = value;
        } else {
            optionValue = this.value;
        }
        var synonym = optionValue;
        AKT.state.current_synonym = synonym;
        var formalTerm = AKT.reverse_synonym[synonym];
        AKT.state.formal_term_id = formalTerm;
        
        $('#synonyms801').val(synonym);
        $('#synonyms802').val(formalTerm);
    });
};



// ================================================== HTML
// ... defining the widget HTML elements.
// We do it this way so that it looks lke regular HTML.
// Alternatively, th same elements could be created in jQuery, as extra code
// inside the setup procedure.

AKT.widgets.synonyms.html = `
<div class="content" style="background:inherit; padding:15px;border:none;">

    <div>
        <div id="synonyms1002" class="label" style="float:left;width:65px;height:20px;">Synonym : </div>
        <textarea id="synonyms801" style="float:left;width:160px;height:20px;"></textarea>
    </div>

    <div style="clear:both;"></div>

    <div>
        <div id="synonyms1003" class="label" style="float:left;width:65px;height:20px;"> for : </div>
        <textarea id="synonyms802" style="float:left;width:160px;height:20px;"></textarea>
    </div>

    <div style="clear:both;"></div>

    <div>
        <fieldset id="synonyms1100" style="float:left;">
            <legend>Synonyms: </legend>
            <select id="synonyms400" size=10 style="width:130px; background:white">[]</select>
        </fieldset>

        <div style="float:left;margin-top:10px;margin-left:20px;">
            <button id="synonyms102" style="width:60px;height:25px;margin-top:10px;"><span class="control_id">102:</span>Details</button><br/>
            <button id="synonyms100" style="width:60px;height:25px;margin-top:10px;"><span class="control_id">100:</span>New</button><br/>
            <button id="synonyms105" style="width:60px;height:25px;margin-top:10px;"><span class="control_id">105:</span>Delete</button><br/>
            <button id="synonyms101" style="width:60px;height:25px;margin-top:10px;"><span class="control_id">101:</span>Close</button>
        </div>
    </div>

    <div style="clear:both;"></div>

</div>     <!-- End of content div -->
`;


