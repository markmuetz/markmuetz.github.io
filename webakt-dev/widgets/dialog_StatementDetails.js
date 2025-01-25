(function ($) {

  /***********************************************************
   *         dialog_StatementDetails widget
   ***********************************************************
   */
    $.widget('akt.dialog_StatementDetails', {
        meta:{
            short_description: 'dialog_StatementDetails',
            long_description: 'dialog_StatementDetails',
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

        widgetEventPrefix: 'dialog_StatementDetails:',

        _create: function () {
            console.debug('\n### Creating instance of widget "akt.dialog_StatementDetails".',
                '\nElement ID:',this.element[0].id,'  Widget UUID:',this.uuid,'  Options:',this.options);
            var self = this;
            this.element.addClass('dialog_StatementDetails-1');

            var kb = self.options.kb;
            var results = evaluate(kb);
            display(self, results);

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('dialog_StatementDetails-1');
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
        console.debug('Starting akt.dialog_StatementDetails: evaluate()...');
        var results = null;
        return results;
    }


    function display(widget, results) {
        console.debug('\nStarting akt.dialog_StatementDetails: display()');
        console.debug(results);
        var kbId = AKT.state.current_kb;
        var kb = AKT.kbs[kbId];

        if (widget.options.show_titlebar) {
            var widgetTitlebar = $('<div class="titlebar">dialog_StatementDetails<input type="button" value="X" class="dialog_close_button"/></div>');  
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
        var sentenceIndex = AKT.state.sentence_index;  
        var sentence = kb.sentences[sentenceIndex-1];
        console.debug(sentenceIndex, kb.sentences);
        console.debug(sentence);
        $(widget.element).find('.textarea_english').val(sentence.english);   // TODO: Need to separate out the condition,
        $(widget.element).find('.textarea_formal').val(sentence.formal);    // if any, and add to next textarea.
        $('#statementdetails1006').append('<option>'+sentence.source+'</option>');  // Need to tidy up text.

        // EVENT HANDLERS

        $(widget.element).draggable({containment:'#workspace',handle:".titlebar"});
        var zindex = AKT.incrementZindex("dialog_StatementDetails");
        $(widget.element).css({display:'block','z-index':zindex});
    }


    function baseHtml() {
        return `<div class="content" style="border:none;padding:10px;">

    <div style="float:left;">Statement No :</div>
    <div id="statementdetails1001" style="float:left;"></div>
    <div style="float:left;margin-left:100px;">Knowledge Base : </div>
    <div id="statementdetails1002" style="float:left;"></div>

    <fieldset>
        <div style="float:left;">Source  /<br/>Derivation</div>
        <select id="statementdetails1006" style="float:left; clear:right;width:470px;height:20px;background:white;">[]</select>
        <button id="statementdetails103" style="width:90px;height:20px;margin-left:50px;margin-top:10px;">Sources</button>
        <button id="statementdetails108" style="width:90px;height:20px;margin-left:50px;margin-top:10px;">Derivation</button>
        <button id="statementdetails110" style="width:150px;height:20px;margin-left:50px;margin-top:10px;">Knowledge Categories</button>
    </fieldset>

    <fieldset style="float:left;">
        <legend>Natural Language:</legend>

        <textarea class="textarea_english" style="width:420px;height:35px;"></textarea>
        <div style="width:30px;height:20px;background:none">IF :</div>
        <textarea id="statementdetails801" style="width:420px;height:35px;"></textarea>
    </fieldset>

    <div style="float:left;text-align:center;padding:10px;">
        <button id="statementdetails100" style="width:72px;height:25px;margin:5px;">Save</button><br/>
        <button id="statementdetails105" style="width:100px;height:25px;margin:5px;">Formal Terms</button><br/>
        <button id="statementdetails106" style="width:75px;height:25px;margin:5px;">Memo</button>
    </div>

    <fieldset style="float:left;">
        <legend>Formal Language Statement :</legend>

        <textarea class="textarea_formal" style="width:420px;height:35px;"></textarea>
        <div style="width:30px;height:20px;">IF :</div>
        <textarea id="statementdetails803" style="width:420px;height:35px;"></textarea>
    </fieldset>

    <div style="float:left;text-align:center;padding:10px;">
        <button id="statementdetails104" style="width:72px;height:35px;margin:5px;">Syntax Check</button><br/>
        <button id="statementdetails102" style="width:72px;height:25px;margin:5px;">Translate</button><br/>
        <button id="statementdetails107" style="width:100px;height:35px;margin:5px;">Auto grammar help</button>
    </div>

</div>     <!-- End of content div -->
`;
    }

})(jQuery);


