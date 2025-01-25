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

        widgetEventPrefix: 'dialog_Sources:',

        _create: function () {
            console.debug('\n### Creating instance of widget "akt.dialog_Sources".',
                '\nElement ID:',this.element[0].id,'  Widget UUID:',this.uuid,'  Options:',this.options);
            var self = this;
            this.element.addClass('dialog_Sources-1');

            var kb = self.options.kb;
            var results = evaluate(kb);
            display(self, results);

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('dialog_Sources-1');
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
        console.debug('Starting akt.dialog_Sources: evaluate()...');
        var results = null;
        return results;
    }


    function display(widget, results) {
        console.debug('Starting akt.dialog_Sources: display()');
        console.debug(results);
        var kbId = AKT.state.current_kb;
        var kb = AKT.kbs[kbId];

        if (widget.options.show_titlebar) {
            var widgetTitlebar = $('<div class="titlebar">dialog_Sources<input type="button" value="X" class="dialog_close_button"/></div>');  
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
        var sources = AKT.getSources(kbId);  
        var sourceNames = [];
        $.each(sources, function(i,source) {
            if (source) {
                sourceNames.push(source.name+','+source.location+','+source.year+source.suffix);
            }
        });
        AKT.loadOptions('sources400', sourceNames, true);

        // EVENT HANDLERS
        $('#sources101').on('click', function (event) {   // The OK button
            console.debug('BUTTON: Clicked on sources OK button');
            event.stopPropagation();
            $('#dialog_Sources').css({display:'none'});
        });


        $('#sources102').on('click', function (event) {    // The Details button
            console.debug('BUTTON: Clicked on sources Details button');
            event.stopPropagation();
            var optionValue = $('#sources400').val();
            var kbId = AKT.state.current_kb;
            //AKT.state.currentSource = AKT.kbs[AKT.state.current_kb].source_details[parseInt(optionValue)];
            var sourceIndex = parseInt(optionValue);
            AKT.state.source_index = sourceIndex;
           
            $('#dialog_SourceDetails').dialog_SourceDetails();
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

        $(widget.element).draggable({containment:'#workspace',handle:".titlebar"});
        $(widget.element).css({display:'block'});
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
        <select id="sources400" size=15" style="width:300px; background:white"></select>
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


