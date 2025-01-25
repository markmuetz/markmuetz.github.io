(function ($) {

  /***********************************************************
   *         dialog_Macros widget
   ***********************************************************
   */
    $.widget('akt.dialog_Macros', {
        meta:{
            short_description: 'dialog_Macros',
            long_description: 'dialog_Macros',
            author: 'Robert Muetzelfeldt',
            last_modified: 'April 2021',
            visible: true,
            options: {
            }
        },

        options: {
            kb:null,
            show_titlebar:true
        },

        evaluate: function(kb) {
            var results = evaluate(kb);
            display(this, results);
            return results;
        },

        widgetEventPrefix: 'dialog_Macros:',

        _create: function () {
            console.debug('\n### Creating instance of widget "akt.dialog_Macros".',
                '\nElement ID:',this.element[0].id,'  Widget UUID:',this.uuid,'  Options:',this.options);
            var self = this;
            this.element.addClass('dialog_Macros-1');

            var kb = self.options.kb;
            var results = evaluate(kb);
            display(self, results);

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('dialog_Macros-1');
            this.element.empty();
            this._super();
        },
        _setOption: function (key, value) {
            var self = this;
            var prev = this.options[key];
            var fnMap = {
            };

            // base
            this._super(key, value);

            if (key in fnMap) {
                fnMap[key]();

                // Fire event
                this._triggerOptionChanged(key, prev, value);
            }
        },

        _triggerOptionChanged: function (optionKey, previousValue, currentValue) {
            this._trigger('setOption', {type: 'setOption'}, {
                option: optionKey,
                previous: previousValue,
                current: currentValue
            });
        }
    });

    function evaluate(kbId) {
        console.debug('Starting akt.dialog_Macros: evaluate()...');
        var results = null;
        return results;
    }


    function display(widget, results) {
        console.debug('Starting akt.dialog_Macros: display()');
        console.debug(results);
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
        var widgetContent = $(baseHtml());
        $(widget.element).append(widgetContent);

        // SETUP
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

        // EVENT HANDLERS
        $('#macros102').on('click', function(event) {   // Run button
            console.debug('BUTTON: Clicked on tools (macros) Run button');
            event.stopPropagation();

            var widgetPanelId = AKT.createWidgetPanel(AKT.state.current_tool);
            $('#'+widgetPanelId)[AKT.state.current_tool]({});

            AKT.incrementZindex("webakt1:$(.macros102).on(click)/"+AKT.state.current_tool);
            $('#'+widgetPanelId).css({"z-index":AKT.state.zindex});
         
        });

        $('#macros400').on('change', function (event, value) {
            event.stopPropagation();
            if (this.value === '') {
                var optionValue = value;
            } else {
                optionValue = this.value;
            }
            AKT.state.current_tool = optionValue;
        });

        $(widget.element).draggable({containment:'#workspace',handle:".titlebar"});
        $(widget.element).css({display:'block'});
    }


    function baseHtml() {
        return `<div class="content" style="border:none;padding:15px;">

    <fieldset style="float:left;">
        <legend>Notes</legend>
        <textarea id="macros800" style="width:240px;height:217px;"></textarea>
    </fieldset>

    <fieldset style="float:left;">
        <legend>List of tools</legend>
        <select id="macros400" size=15 style="width:230px; background:white">[]</select>
    </fieldset>

    <div style="float:left; text-align:center">
        <fieldset>
            <legend>Tool Options</legend>

            <button id="macros100" style="width:75px;height:30px;">Description</button><br/>
            <button id="macros101" style="width:75px;height:30px;">Details</button><br/>
            <button id="macros102" style="width:75px;height:30px;">Run</button><br/>
            <button id="macros103" style="width:75px;height:30px;">New</button><br/>
            <button id="macros104" style="width:75px;height:30px;">Delete</button>
        </fieldset>

        <button id="macros105" style="width:75px;height:30px;">Save tool file</button>
    </div>

    <div style="clear:both;"></div>

</div>     <!-- End of content div -->
`;
    }

})(jQuery);


