(function ($) {

  /***********************************************************
   *         dialog_Sources widget
   ***********************************************************
   */
    $.widget('akt.dialog_Sources', {
        meta:{
            short_description: 'dialog_Sources',
            long_description: 'dialog_Sources',
            author: 'Robert Muetzelfeldt',
            last_modified: 'August 2021',
            visible: false,
            options: {
            }
        },

        options: {
            kbId: null,
            show_titlebar: true
        },

        widgetEventPrefix: 'dialog_Sources:',

        _create: function () {
            console.debug('\n### Creating instance of widget "akt.dialog_Sources".',
                '\nElement ID:',this.element[0].id,'  Widget UUID:',this.uuid,'  Options:',this.options);
            var self = this;
            this.element.addClass('dialog_Sources-1');

            createEmptyWidget(self);

            var results = evaluate(self, self.options);
            display(self.element, self.options, results);

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('dialog_Sources-1');
            this.element.empty();
            this._super();
        },

        _setOption: function (key, value) {
            console.debug('\n** dialog_Sources: setOption: ',key,' = ',value);
            var self = this;
            var prev = this.options[key];
            if (key === 'visible' && value) {
                $(self.element).css({display:'block'});
                display(self, null);   // TODO: check this
            } else {
                self.options[key] = value;
                display(self.element, self.options, null);
            }
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

    // ================================= Functions

    function createEmptyWidget(widget) {

        // See comments in AKT.makeWidgetTitlebar(): I can't see why
        // event handler can't go there.  It works for AKT.reprocess...
        if (widget.options.show_titlebar) {
            console.debug(widget.widgetName);
            var titlebarDiv = AKT.makeWidgetTitlebar(widget.widgetName,widget.element);
            $(widget.element).append(titlebarDiv);
            $(widget.element).find('.w3-right').on('click', function () {
                $(widget.element).css({display:"none"});
            });
        }

        var widgetSettings = $('<div></div>');
        $(widget.element).append(widgetSettings);

        var kbSelectElement = AKT.makeReprocessSelector(widget.element, widget.widgetName,
            'Knowledge base', AKT.getKbIds(), AKT.state.current_kb, 'kbId');
        $(widgetSettings).append(kbSelectElement);

        var widgetContent = $(baseHtml());
        $(widget.element).append(widgetContent);

        $(widget.element).css({display:'block'});
        $(widget.element).draggable();
    }


    function evaluate(widget, options) {
        console.debug('Starting akt.dialog_Sources: evaluate()...');
        var results = null;
        return results;
    }


    function display(widgetElement, widgetOptions, results) {
        console.debug('Starting akt.dialog_Sources: display()...');

        var kbId = widgetOptions.kbId;
        var kb = AKT.kbs[kbId];

        var widgetContent = $(widgetElement).find('.content');
        var sources = kb.sources;  
        var sourceIds = [];
        $.each(sources, function(i,source) {
            if (source) {
                sourceIds.push(source.id);
            }
        });
        AKT.loadOptions(widgetContent, 'select_sources', sourceIds, true);

        // EVENT HANDLERS
        $('#sources101').on('click', function (event) {   // The OK button
            console.debug('BUTTON: Clicked on sources OK button');
            event.stopPropagation();
            $('#dialog_Sources').css({display:'none'});
        });


        $('#sources102').on('click', function (event) {    // The Details button
            console.debug('BUTTON: Clicked on sources Details button');
            event.stopPropagation();
            var optionValue = $(widgetElement).find('.select_sources').val();
            var kbId = AKT.state.current_kb;
            //AKT.state.currentSource = AKT.kbs[AKT.state.current_kb].source_details[parseInt(optionValue)];
            var sourceIndex = parseInt(optionValue);
            AKT.state.source_index = sourceIndex;
            console.debug(kbId,optionValue,sourceIndex);

            var dialog = 'dialog_SourceDetails';
            AKT.openDialog(dialog, event.shiftKey, {left:'200px',top:'20px',width:'550px',height:'540px'}, {kbId:AKT.state.current_kb});
           
            //$('#dialog_SourceDetails').dialog_SourceDetails();
        });


        $('#sources104').on('click', function (event) {    // The New button
            console.debug('BUTTON: Clicked on sources New button');
            event.stopPropagation();
            var optionValue = null;
            var kbId = AKT.state.current_kb;
            //AKT.state.currentSource = AKT.kbs[AKT.state.current_kb].source_details[parseInt(optionValue)];
            var sourceIndex = null;
            AKT.state.source_index = null;
           
            $('#dialog_SourceDetails').dialog_SourceDetails();
        });


        $('#sources105').on('click', function (event) {    // The Delete button
            var optionValue = $('#sources400').val();
            var kbId = AKT.state.current_kb;
            var sources = AKT.getSources(kbId);  
            var sourceIndex = parseInt(optionValue);
            var source = sources[sourceIndex];
            var label = source.name+','+source.location+','+source.year+source.suffix;
            if (confirm('Confirm that you wish to remove the source:\n'+label)) {
                delete AKT.kbs[kbId].source_details[sourceIndex];
            }
        });

    }


    function baseHtml() {
        return `<div class="content" style="border:none;padding:15px;">

    <div>
        <div style="float:left;">Selected Source: </div>
        <div id="sources801" style="float:left;margin-left:5px;">None selected</div>
    </div>

    <div style="margin-bottom:20px;padding-bottom:20px;">
        <div style="clear:left;float:left;">Source Type: </div>
        <div id="sources802" style="float:left;"></div>
    </div>

    <div style="clear:both;">Please select information source...</div>

    <fieldset style="clear:left;float:left;">
        <legend>Sources</legend>
        <select class="select_sources" size=15" style="width:300px; background:white"></select>
    </fieldset>

    <div style="float:left; text-align:center">
        <fieldset>
            <legend>New Source</legend>

            <button id="sources104" style="width:60px;height:20px;;margin:5px;">New</button><br/>

            <input id="sources201" type="radio" group="source_type"><label for="sources201">Interview</label><br/>
            <input id="sources202" type="radio" group="source_type"><label for="sources202">Reference</label><br/>
        </fieldset>

        <button id="sources101" style="width:65px;height:25px;margin:5px;">OK</button><br/>
        <button id="sources102" style="width:65px;height:25px;margin:5px;">Details</button><br/>
        <button id="sources105" style="width:65px;height:25px;margin:5px;">Delete</button><br/>
        <button id="sources106" style="width:65px;height:25px;margin:5px;">Statements</button>
    </div>
    
    <div style="clear:both;"></div>

</div>     <!-- End of content div -->
`;
    }

})(jQuery);
