(function ($) {

  /***********************************************************
   *         dialog_TopicDetails widget
   ***********************************************************
   */
    $.widget('akt.dialog_TopicDetails', {
        meta:{
            short_description: 'dialog_TopicDetails',
            long_description: 'dialog_TopicDetails',
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

        widgetEventPrefix: 'dialog_TopicDetails:',

        _create: function () {
            console.debug('\n### Creating instance of widget "akt.dialog_TopicDetails".',
                '\nElement ID:',this.element[0].id,'  Widget UUID:',this.uuid,'  Options:',this.options);
            var self = this;
            this.element.addClass('dialog_TopicDetails-1');

            var kb = self.options.kb;
            var results = evaluate(kb);
            display(self, results);

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('dialog_TopicDetails-1');
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
        console.debug('Starting akt.dialog_TopicDetails: evaluate()...');
        var results = null;
        return results;
    }


    function display(widget, results) {
        console.debug('Starting akt.dialog_TopicDetails: display()');
        console.debug(results);
        var kbId = AKT.state.current_kb;
        var kb = AKT.kbs[kbId];

        if (widget.options.show_titlebar) {
            var widgetTitlebar = $('<div class="titlebar">dialog_TopicDetails<input type="button" value="X" class="dialog_close_button"/></div>');  
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

        // EVENT HANDLERS

        $(widget.element).draggable({containment:'#workspace',handle:".titlebar"});
        $(widget.element).css({display:'block'});
    }


    function baseHtml() {
        return `<div class="content" style="margin:15px;border:none;">

    <div>
        <div style="float:left;width:40px;height:20px;">Topic</div>
        <textarea id="topicDetail801" style="float:left;width:220px;height:20px;"></textarea>
    </div>


    <fieldset>
        <legend>Boolean Search String</legend>
        <textarea id="topicDetail804" style="width:250px;height:50px;"></textarea>
    </fieldset>

    <div>
        <fieldset style="float:left;">
            <legend>Search Mode</legend>
            <input id="topicDetail200" class="checkbox" type="checkbox">
            <label for="topicDetail200">object</label><br/>

            <input id="topicDetail201" class="checkbox" type="checkbox">
            <label for="topicDetail201">subobjects</label><br/>

            <input id="topicDetail202" class="checkbox" type="checkbox">
            <label for="topicDetail202">superobjects</label><br/>
        </fieldset>

        <button id="topicDetail100" style="float:left;width:60px;height:35px;margin-left:30px;margin-top:30px;">Save</button>

        <div style="clear:both;"></div>
    </div>

    <fieldset>
        <legend>Description</legend>
        <textarea id="topicDetail802" style="width:250px;height:130px;"></textarea>
    </fieldset>

    <button id="topicDetail102" style="width:140px;height:35px;">Show use in statements</button>
    <button id="topicDetail103" style="width:140px;height:35px;">Show use in hierarchies</button>

</div>     <!-- End of content div -->
`;
    }

})(jQuery);


