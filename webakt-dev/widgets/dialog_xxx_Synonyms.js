(function ($) {

  /***********************************************************
   *         dialog_Synonyms widget
   ***********************************************************
   */
    $.widget('akt.dialog_Synonyms', {
        meta:{
            short_description: 'dialog_Synonyms',
            long_description: 'dialog_Synonyms',
            author: 'Robert Muetzelfeldt',
            last_modified: 'July 2021',
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

        widgetEventPrefix: 'dialog_Synonyms:',

        _create: function () {
            console.debug('\n### Creating instance of widget "akt.dialog_Synonyms".',
                '\nElement ID:',this.element[0].id,'  Widget UUID:',this.uuid,'  Options:',this.options);
            var self = this;
            this.element.addClass('dialog_Synonyms-1');

            var kb = self.options.kb;

            createEmptyWidget(self);
            var results = evaluate(kb);
            display(self, results);

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('dialog_Synonyms-1');
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

// ================================================================================


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



    function evaluate(kbId) {
        console.debug('Starting akt.dialog_Synonyms: evaluate()...');
        var results = null;
        return results;
    }


    function display(widget, results) {
        console.debug('Starting akt.dialog_Synonyms: display()');
        console.debug(results);
        var kbId = AKT.state.current_kb;
        var kb = AKT.kbs[kbId];

        // SETUP
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

        var zindex = AKT.incrementZindex("dialog_Synonyms");
        $(widget.element).css({display:'block','z-index':zindex});
    }


    function baseHtml() {
        // TODO: replace XXXXX with the name of the current KB
        return `<div class="content" style="padding:15px;border:none;">
<div id="synonyms1000" class="label" style="width:260px;height:20px;">Kb Name: XXXXX</div>

<div>
    <div id="synonyms1002" class="label" style="float:left;width:65px;height:20px;">Synonym : </div>
    <textarea id="synonyms801" style="float:left;width:160px;height:20px;"></textarea>
</div>

<div>
    <div id="synonyms1003" class="label" style="float:left;width:65px;height:20px;"> for : </div>
    <textarea id="synonyms802" style="float:left;width:160px;height:20px;"></textarea>
</div>

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

</div>     <!-- End of content div -->
`;
    }

})(jQuery);


