(function ($) {

  /***********************************************************
   *         dialog_Topics widget
   ***********************************************************
   */
    $.widget('akt.dialog_Topics', {
        meta:{
            short_description: 'dialog_Topics',
            long_description: 'dialog_Topics',
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

        widgetEventPrefix: 'dialog_Topics:',

        _create: function () {
            console.debug('\n### Creating instance of widget "akt.dialog_Topics".',
                '\nElement ID:',this.element[0].id,'  Widget UUID:',this.uuid,'  Options:',this.options);
            var self = this;
            this.element.addClass('dialog_Topics-1');

            createEmptyWidget(self);

            var results = evaluate(self, self.options);
            display(self.element, self.options, results);

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('dialog_Topics-1');
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

    // ================================= Functions

    function createEmptyWidget(widget) {

        if (widget.options.show_titlebar) {
            var widgetTitlebar = $(
                '<div class="title-bar">'+
                    '<div>dialog_Topics</div>'+
                    '<input type="button" value="X" class="dialog_close_button"/>'+
                '</div>');
            $(widget.element).append(widgetTitlebar);
            $('.dialog_close_button').on('click', function () {
                var id = $(this).parent().parent()[0].id;
                $('#'+id).css({display:"none"});
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
        console.debug('Starting akt.dialog_Topics: evaluate()...');
        var results = null;
        return results;
    }


    function display(widgetElement, widgetOptions, results) {

        var kbId = widgetOptions.kbId;
        var kb = AKT.kbs[kbId];

        var widgetContent = $(widgetElement).find('.content');

        var topics = AKT.getTopics(kbId);
        var topicNames = [];
        $.each(topics, function (i,topic) {
            topicNames.push(topic.name);
        });
        console.debug('\n00000 ',topicNames);
        AKT.loadOptions(widgetContent,'select_topics', topicNames);

        // EVENT HANDLERS
        $('#topicGeneral100').on('click', function (event, value) {        // Details/Edit button
            var kbId = AKT.state.current_kb;
            var topicName = AKT.state.current_topic;
            AKT.dialogOpener.topicDetail(kbId,topicName);
            AKT.showDialog('topicDetail');
        });


        $(widgetElement).draggable({containment:'#workspace',handle:".titlebar"});
        $(widgetElement).css({display:'block'});

    }


    // Ids should be removed.  User $(widgetContent).find(CLASS); instead.  Left in just now so elements can be 
    // matched up with event handlers.
    function baseHtml() {
    return `
<div class="content" style="padding:12px;border:none;">
    <fieldset style="margin-bottom:10px;">
        <legend>TOPICS :  </legend>
        <select id="topicGeneral400" class="select_topics" size=12 style="width:415px; background:white"></select>
    </fieldset>

    <div style="float:left;margin-left:40px;">
        <button id="topicGeneral100" class="button_details" style="width:85px;height:40px;">Details/Edit</button><br/>
        <button id="topicGeneral101" class="button_new" style="width:85px;height:40px;">New</button><br/>
        <button id="topicGeneral102" class="button_delete" style="width:85px;height:40px;">Delete</button><br/>
        <div style="clear:both;"></div>
    </div>

    <fieldset style="float:left;text-align:center;margin-left:40px;">
        <legend>Boolean options</legend>

        <button id="topicGeneral104" class="button_select" style="width:60px;height:20px;">Select</button><br/>
        <button id="topicGeneral105" class="button_and" style="width:35px;height:20px;">AND</button>
        <button id="topicGeneral106" class="button_or" style="width:35px;height:20px;">OR</button><br/>
        <button id="topicGeneral107" class="button_brackets" style="width:60px;height:20px;">( ... )</button><br/>
        <button id="topicGeneral108" class="button_clear" style="width:60px;height:20px;">Clear</button>
        <div style="clear:both;"></div>
    </fieldset>

    <div style="float:left;margin-left:40px;">
        <button id="topicGeneral109" class="button_search" style="width:85px;height:40px;">Search</button><br/>
        <button id="topicGeneral103" class="button_saveaskb" style="width:85px;height:40px;">Save as Kb</button>
        <div style="clear:both;"></div>
    </div>

    <fieldset style="float:left; margin-top:10px;">
        <legend>Boolean Search String</legend>
        <div> "or" binds more strongly than "and"<br/>Use parentheses ( )  </div>
        <textarea id="topicGeneral800" class="textarea_searchstring" style="width:415px;height:45px;"></textarea>
    </fieldset>

    <div style="clear:both;"></div>
        `;
    }

})(jQuery);
