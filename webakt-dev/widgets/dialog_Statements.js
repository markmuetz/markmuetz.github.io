(function ($) {

  /***********************************************************
   *         dialog_Statements widget
   ***********************************************************
   */
    $.widget('akt.dialog_Statements', {
        meta:{
            short_description: 'dialog_Statements',
            long_description: 'dialog_Statements',
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

        widgetEventPrefix: 'dialog_Statements:',

        _create: function () {
            console.debug('\n### Creating instance of widget "akt.dialog_Statements".',
                '\nElement ID:',this.element[0].id,'  Widget UUID:',this.uuid,'  Options:',this.options);
            var self = this;
            this.element.addClass('dialog_Statements-1');

            createEmptyWidget(self);

            var results = evaluate(self, self.options);
            display(self.element, self.options, results);

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('dialog_Statements-1');
            this.element.empty();
            this._super();
        },
        _setOption: function (key, value) {
            console.debug('setOption dialog_Statements: ',key,' = ',value);
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
        console.debug('Starting akt.dialog_Statements: evaluate()...');
        var results = null;
        return results;
    }


    function display(widgetElement, widgetOptions, results) {

        var kbId = widgetOptions.kbId;
        var kb = AKT.kbs[kbId];
        console.debug(kb);

        var widgetContent = $(widgetElement).find('.content');

        // This should probably be done when KB is loaded, but then has to be
        // updated whenever a sentence is changed or added...
        var sentences = kb.sentences;
        for (var i=0; i<sentences.length; i++) {
            var english = AKT.translate(sentences[i].nested_list);
            sentences[i].english = english.replace(/  /g," ");
        }
        var englishStatements = [];
        for (var i=0; i<sentences.length; i++) {
            englishStatements.push(i+1+': '+sentences[i].english);
        }
        AKT.loadOptions(widgetContent, 'viewallstatements400', englishStatements, true);

        $('#viewallstatements1009').text(sentences.length);

        // EVENT HANDLERS
        $(widgetContent).find('.viewallstatements400').on('change', function (event, value) {
            event.stopPropagation();
            // Needed this, since this.value is blank when triggered (in AKT.singleStep).
            if (this.value === '') {
                var optionValue = value;
            } else {
                optionValue = this.value;
            }
            console.debug(value,this.value,$(this).val());

            $('#viewallstatements800').text(optionValue);

            var i = parseInt(optionValue.split(':')[0],10);
            var sentenceIndex = i;
            AKT.state.sentence_index = sentenceIndex;
            var formal = kb.sentences[i-1].formal;
            $('#viewallstatements801').text(i+': '+formal);
            
        });

        $('#viewallstatements104').on('click', function (event) {   // Statement details button
            event.stopPropagation();
            //AKT.showDialog('statementdetails');

            //$('#dialog_StatementDetails').dialog_StatementDetails();
            var dialog = 'dialog_StatementDetails';
            AKT.openDialog(dialog, event.shiftKey, {left:'400px',top:'20px',width:'580px',height:'550px'}, {kbId:AKT.state.current_kb});
        });

    }


    function baseHtml() {
        return `<div class="content" style="border:none;padding:15px;">
    <fieldset style="float:left;">
        <legend>Selected Statement</legend>

        <label for="viewallstatements800">Natural Language</label><br/>
        <textarea id="viewallstatements800" style="width:420px;height:40px;"></textarea><br/>

        <label for="viewallstatements800">Formal Language</label><br/>
        <textarea id="viewallstatements801" style="width:420px;height:40px;"></textarea>
    </fieldset>

    <div style="float:left;margin-left:20px;margin-top:10px;">
        <button id="viewallstatements104" style="width:65px;height:30px;">Details</button><br/>
        <button id="viewallstatements103" style="width:65px;height:30px;">Edit</button><br/>
        <button id="viewallstatements102" style="width:65px;height:30px;">New</button><br/>
        <button id="viewallstatements100" style="width:65px;height:30px;">Delete</button>
    </div>


    <button id="viewallstatements106" style="clear:left;float:left;width:125px;height:30px;">Numerical</button>
    <button id="viewallstatements120" style="float:left;width:130px;height:30px;">All Statements</button>
    <div style="float:right;">
        <div style="width:130px;height:20px;">Number of statements</div>
        <div id="viewallstatements1009" style="width:75px;height:20px;">0</div>
    </div>

    <select class="sentences viewallstatements400" size="15" style="left:10px;top:240px;width:535px; background:white;">

    <!-- In the Prolog source, but not in the current version of AKT5.
    <div id="viewallstatements1010" class="label" style="left:297px;top:202px;width:40px;height:25px;">with at least </div>
    <select id="viewallstatements805" style="left:335px;top:205px;width:40px;height:20px;160px;">[]</select>
    <div id="viewallstatements1011" class="label" style="left:378px;top:210px;width:60px;height:25px;">condition(s)</div>
    -->

    <fieldset style="float:left;">
        <legend>Diagram Selection Type</legend>

        <button id="viewallstatements110" style="width:95px;height:30px;">All Statements</button>

        <button id="viewallstatements113" style="width:60px;height:30px;">Causes</button>

        <button id="viewallstatements114" style="width:60px;height:30px;">Effects</button>

        <button id="viewallstatements111" style="width:65px;height:30px;">Navigate</button>
    </fieldset>

    <button id="viewallstatements112" style="float:right;margin-right:20px;margin-top:20px;width:110px;height:30px;">Print Statements</button>

</div>     <!-- End of content div -->
`;
    }

})(jQuery);
