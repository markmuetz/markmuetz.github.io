(function ($) {

  /***********************************************************
   *         dialog_TopicGeneral widget
   ***********************************************************
   */
    $.widget('akt.dialog_TopicGeneral', {
        meta:{
            short_description: 'dialog_TopicGeneral',
            long_description: 'dialog_TopicGeneral',
            author: 'Robert Muetzelfeldt',
            last_modified: 'August 2021',
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

        widgetEventPrefix: 'dialog_TopicGeneral:',

        _create: function () {
            console.debug('\n### Creating instance of widget "akt.dialog_TopicGeneral".',
                '\nElement ID:',this.element[0].id,'  Widget UUID:',this.uuid,'  Options:',this.options);
            var self = this;
            this.element.addClass('dialog_TopicGeneral-1');

            var kb = self.options.kb;
            var results = evaluate(kb);
            display(self, results);

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('dialog_TopicGeneral-1');
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
        console.debug('Starting akt.dialog_TopicGeneral: evaluate()...');
        var results = null;
        return results;
    }


    function display(widget, results) {
        console.debug('Starting akt.dialog_TopicGeneral: display()');
        console.debug(results);
        var kbId = AKT.state.current_kb;
        var kb = AKT.kbs[kbId];

        if (widget.options.show_titlebar) {
            var widgetTitlebar = $('<div class="titlebar">dialog_TopicGeneral<input type="button" value="X" class="dialog_close_button"/></div>');  
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
        var topics = AKT.getTopics(kbId);
        var topicNames = [];
        $.each(topics, function (i,topic) {
            topicNames.push(topic.name);
        });
        AKT.loadOptions('topicGeneral400', topicNames);

        // EVENT HANDLERS
        $('#topicGeneral100').on('click', function (event, value) {        // Details/Edit button
            var kbId = AKT.state.current_kb;
            var topicName = AKT.state.current_topic;
            AKT.dialogOpener.topicDetail(kbId,topicName);
            AKT.showDialog('topicDetail');
        });


        $(widget.element).draggable({containment:'#workspace',handle:".titlebar"});
        $(widget.element).css({display:'block'});
    }


    function baseHtml() {
        return `
<div class="content" style="padding:15px;border:none;">
    <fieldset style="margin-bottom:10px;">
        <legend>TOPICS :  </legend>
        <select id="topicGeneral400" size=12 style="width:415px; background:white"></select>
    </fieldset>

    <div style="float:left;margin-left:40px;">
        <button id="topicGeneral100" style="width:85px;height:40px;">Details/Edit</button><br/>
        <button id="topicGeneral101" style="width:85px;height:40px;">New</button><br/>
        <button id="topicGeneral102" style="width:85px;height:40px;">Delete</button><br/>
        <div style="clear:both;"></div>
    </div>

    <fieldset style="float:left;text-align:center;margin-left:40px;">
        <legend>Boolean options</legend>

        <button id="topicGeneral104" style="width:60px;height:20px;">Select</button><br/>
        <button id="topicGeneral105" style="width:35px;height:20px;">AND</button>
        <button id="topicGeneral106" style="width:35px;height:20px;">OR</button><br/>
        <button id="topicGeneral107" style="width:60px;height:20px;">( ... )</button><br/>
        <button id="topicGeneral108" style="width:60px;height:20px;">Clear</button>
        <div style="clear:both;"></div>
    </fieldset>

    <div style="float:left;margin-left:40px;">
        <button id="topicGeneral109" style="width:85px;height:40px;">Search</button><br/>
        <button id="topicGeneral103" style="width:85px;height:40px;">Save as Kb</button>
        <div style="clear:both;"></div>
    </div>

    <fieldset style="float:left; margin-top:10px;">
        <legend>Boolean Search String</legend>
        <div> "or" binds more strongly than "and"<br/>Use parentheses ( )  </div>
        <textarea id="topicGeneral800" style="width:415px;height:45px;"></textarea>
    </fieldset>

    <div style="clear:both;"></div>

</div>     <!-- End of content div -->
`;
    }

})(jQuery);


