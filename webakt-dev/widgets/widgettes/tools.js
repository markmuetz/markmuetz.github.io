AKT.widgets.tools = {};


AKT.widgets.tools.setup = function (widget) {

};


AKT.widgets.tools.display = function (widget) {

    AKT.state.current_code = arguments.callee.toString();
    console.debug('Starting akt.dialog_Macros: display()');
    var kbId = AKT.state.current_kb;
    var kb = AKT.kbs[kbId];

    if (widget.options.show_titlebar) {
        var widgetTitlebar = $('<div class="titlebar">dialog_Macros<input type="button" value="X" class="dialog_close_button"/></div>');  
        $(widget.element).append(widgetTitlebar);
        $('.dialog_close_button').css({background:'yellow'});
        $('.dialog_close_button').on('click', function () {
            var id = $(this).parent().parent()[0].id;
            $('#'+id).css({display:"none"});
        });
    }

    $(widget.element).find('.listbox_tools').empty();
    // Note how easy it is to get the widgets (*not* the widget instances).
    // It's picking it up from the .akt object, at the start of each widget's code:
    //     $.widget('akt.statements_summary', {...
    // If we wanted to, we could get e.g. a title or the widget description, from
    // widgets[widgetId].metadata.
    // I prefer the actual name (e.g. "statements_summary"), rather than a prettified version of it
    // (e.g. Statements summary", or worse, "Summary of statements". since that would make it harder
    // to find its code etc.
    //var widgets = window.jQuery.akt;   // In fact, just using an array of widgetIds...


    for (var toolId in AKT.tools) {
        var option = $('<option value="'+toolId+'">'+toolId+'</option>');
        $(widget.element).find('.listbox_tools').append(option);
    }

    // EVENT HANDLERS
    $(widget.element).find('.button_run').on('click', function(event) {   // Run button
        console.log('BUTTON: Clicked on tools (macros) Run button');
        event.stopPropagation();
        var eventShiftKey = false;

        console.log('##',AKT.state.current_tool);
        //var widgetPanelId = AKT.createWidgetPanel(AKT.state.current_tool);
        //var x = $('#'+widgetPanelId)[AKT.state.current_tool]({});
        //console.log($(x).data());

        var panel = AKT.panelise({
            conventional:true,
            widget_name:AKT.state.current_tool,
            position:{left:'20px',top:'20px'},
            size:{width:'450px',height:'540px'},
            shift_key:eventShiftKey,
            options:{kbId:AKT.state.current_kb}
        });     
    });

    $(widget.element).find('.button_details').on('click', function(event) {   // Code button
        console.log(AKT.state.current_code);
    });


    $(widget.element).find('.listbox_tools').on('change', function (event, value) {
        event.stopPropagation();
        if (this.value === '') {
            var toolId = value;
        } else {
            toolId = this.value;
        }
        console.log(value,this.value,toolId,AKT.state.current_tool);
        AKT.state.current_tool = toolId;
        var tool = AKT[toolId];
        if (tool && tool.description) {
            $(widget.element).find('.textarea_description').val(tool.description);
        } else {
            $(widget.element).find('.textarea_description').val('No description available');
        }
    });

    $(widget.element).draggable({containment:'#workspace',handle:".titlebar"});
    $(widget.element).css({display:'block'});
};


AKT.widgets.tools.html = `
<div class="content" style="border:none;padding:15px;">

    <div style="float:left;">
        <fieldset style="float:left;">
            <legend>List of tools</legend>
            <select class="listbox_tools" size=15 style="width:300px; background:white; overflow-y:auto;">[]</select>
        </fieldset>

        <div style="float:left;">
            <fieldset>
                <legend>Tool Options</legend>

                <button class="button_description" style="display:none;width:75px;height:30px;">Description</button><br/>
                <button class="button_details" disabled style="width:75px;height:30px;">Details</button><br/>
                <button class="button_run" style="width:75px;height:30px;">Run</button><br/>
            </fieldset>
        </div>
    </div>

    <div style="clear:both;"></div>

    <fieldset>
        <legend>Description</legend>
        <textarea class="textarea_description" style="width:400px;height:100px; overflow-y:auto;"></textarea>
    </fieldset>

    <div style="clear:both;"></div>

</div>     <!-- End of content div -->
`;



