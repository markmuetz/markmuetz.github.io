(function ($) {

  /***********************************************************
   *         dialog_FormalTerms widget
   ***********************************************************
   */
    $.widget('akt.dialog_FormalTerms', {
        meta:{
            short_description: 'dialog_FormalTerms',
            long_description: 'dialog_FormalTerms',
            author: 'Robert Muetzelfeldt',
            last_modified: 'April 2021',
            visible: true,
            options: {
            }
        },

        options: {
            kbId:null,
            term_type: 'all',
            use: 'all',
            show_titlebar:true
        },


        reprocess: function(options) {
            var results = evaluate(this, options);
            display(this, options, results);
            return results;
        },


        widgetEventPrefix: 'dialog_FormalTerms:',


        _create: function () {
            console.debug('\n### Creating instance of widget "akt.dialog_FormalTerms".',
                '\nElement ID:',this.element[0].id,'  Widget UUID:',this.uuid,'  Options:',this.options);
            var self = this;
            this.element.addClass('dialog_FormalTerms-1');

            createEmptyWidget(self);

            var kb = self.options.kb;
            var results = evaluate(self, self.options);
            display(self.element, self.options, results);

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('dialog_FormalTerms-1');
            this.element.empty();
            this._super();
        },

        _setOption: function (key, value) {
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


    // ==================================================================

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

        var kbSelectElement = AKT.makeReprocessSelector(widget.element, widget.widgetName,
            'Formal term type', ['all','action','attribute','comparison','link','object','process','value'], 'all', 'term_type');
        $(widgetSettings).append(kbSelectElement);

        var kbSelectElement = AKT.makeReprocessSelector(widget.element, widget.widgetName,
            'Use in formal definitions', ['all','Formal Statements','Formal Conditions','Object Hierarchies'], 'all','use');
        $(widgetSettings).append(kbSelectElement);

        var widgetContent = $(baseHtml());
        $(widget.element).append(widgetContent);

        $(widget.element).css({display:'block'});
        $(widget.element).draggable();
    }


    function evaluate(widget, options) {
        console.debug('Starting akt.dialog_FormalTerms: evaluate()...');
        var results = null;
        return results;
    }


    function display(widgetElement, widgetOptions, results) {
        console.debug('\n\nStarting akt.dialog_FormalTerms: display()');

        var kbId = widgetOptions.kbId;
        var kb = AKT.kbs[kbId];
        var term_type = widgetOptions.term_type;
        var use = widgetOptions.use;

        var widgetContent = $(widgetElement).find('.content');

        var formalTermsArray = AKT.getFormalTerms(kbId, term_type, use);
        AKT.loadOptions(widgetContent, 'select_formalterms', formalTermsArray);

        $(widgetElement).find('.number').text(formalTermsArray.length);

       //$(widgetElement).draggable({containment:'#workspace',handle:".titlebar"});
        //$(widgetElement).css({display:'block'});

        $('#formalterms102').on('click', function (event) {    // The Details button
            console.debug('BUTTON: Clicked on sources Details button');
            event.stopPropagation();
            var optionValue = $(widgetElement).find('.select_formalterms').val();
            var kbId = AKT.state.current_kb;
            //AKT.state.currentSource = AKT.kbs[AKT.state.current_kb].source_details[parseInt(optionValue)];
            var sourceIndex = parseInt(optionValue);
            AKT.state.source_index = sourceIndex;
            console.debug(kbId,optionValue,sourceIndex);

            var dialog = 'dialog_FormalTermDetails';
            AKT.openDialog(dialog, event.shiftKey, {left:'200px',top:'20px',width:'550px',height:'540px'}, {kbId:AKT.state.current_kb});
           
            //$('#dialog_SourceDetails').dialog_SourceDetails();
        });

    }

    function baseHtml() {
        return `
<div class="content" style="border:none; padding-left:15px;padding-right:15px;">


    <fieldset style="float:left;">
        <legend for="formalterms400">Formal Terms in selected definition : </legend>
        <select class="select_formalterms" size=15 style="width:225px; background:white"></select>
    </fieldset>

    <div style="float:left;margin-left:30px;margin-top:40px;">
        <button id="formalterms102" style="width:65px;height:30px;"><span class="control_id">102:</span>Details</button><br/>
        <button id="formalterms104" style="width:65px;height:30px;margin-top:20px;"><span class="control_id">104:</span>New</button><br/>
        <button id="formalterms105" style="width:65px;height:30px;margin-top:20px;"><span class="control_id">105:</span>Delete</button><br/>
    </div>

    <div style="clear:both;"></div>

    <div style="margin-top:12px;">
        <div class="label" style="float:left;">Number of terms:</div>
        <div class="number" style="float:left;margin-left:10px;"></div>
    </div>
</div>     <!-- End of content div -->
        `;
    }

})(jQuery);
