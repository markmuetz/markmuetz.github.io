(function ($) {

  /***********************************************************
   *         dialog_TopicHierarchies widget
   ***********************************************************
   */
    $.widget('akt.dialog_TopicHierarchies', {
        meta:{
            short_description: 'dialog_TopicHierarchies',
            long_description: 'dialog_TopicHierarchies',
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

        widgetEventPrefix: 'dialog_TopicHierarchies:',

        _create: function () {
            console.debug('\n### Creating instance of widget "akt.dialog_TopicHierarchies".',
                '\nElement ID:',this.element[0].id,'  Widget UUID:',this.uuid,'  Options:',this.options);
            var self = this;
            this.element.addClass('dialog_TopicHierarchies-1');

            createEmptyWidget(self);

            var kb = self.options.kb;
            var results = evaluate(kb);
            display(self, results);

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('dialog_TopicHierarchies-1');
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


    // ================================= Functions

    function createEmptyWidget(widget) {

        if (widget.options.show_titlebar) {
            var widgetTitlebar = $(
                '<div class="title-bar">'+
                    '<div>dialog_TopicHierarchies</div>'+
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


    function evaluate(kbId) {
        console.debug('Starting akt.dialog_TopicHierarchies: evaluate()...');
        var results = null;
        return results;
    }


    function display(widget, results) {
        console.debug('Starting akt.dialog_TopicHierarchies: display()');
        var kbId = AKT.state.current_kb;
        var kb = AKT.kbs[kbId];

        var widgetContent = $(widget.element).find('.content');

        // SETUP
        var topicHierarchies = AKT.getHierarchies(kbId, "subtopics");
        AKT.loadOptions(widgetContent,'topicHierarchies400', topicHierarchies);


        // EVENT HANDLERS
        $('#topicHierarchies103').on('click', function (event) {
            event.stopPropagation();
            console.debug('SELECT: Clicked on topicHierarchies listbox');
            AKT.showDialog('newTopicHierarchy');
        });

        // This is here purely because it works - it stops [the click associated 
        // with the next event handler being picked up and stopping
        // topicHierarchies having the highest z-index].
        $('#topicHierarchies400').on('click', function (event, value) {
            event.stopPropagation();
        });

        $('#topicHierarchies400').on('change', function (event, value) {
            event.stopPropagation();
            // Needed this, since this.value is blank when triggered (in AKT.singleStep).
            if (this.value === '') {
                var optionValue = value;
            } else {
                optionValue = this.value;
            }
            var topicId = optionValue;
            AKT.state.topic_id = topicId;
            $('#dialog_TopicHierarchy').dialog_TopicHierarchy();
            //AKT.dialogOpener.topic_hierarchy(topicId);
        });

        $(widget.element).draggable({containment:'#workspace',handle:".titlebar"});
        var zindex = AKT.incrementZindex("dialog_TopicHierarchies");
        $(widget.element).css({display:'block','z-index':zindex});
    }


    function baseHtml() {
        return `<div class="content" style="border:none; padding:15px;">
    <div id="topicHierarchies1001" style="width:100%;padding-left:20px;padding-right:20px;padding-top:10px;">This knowledge base contains information classified under different categories called topics.  These topics may be organised under different topic hierarchies.  To see the statements defined by a particular topic hierarchy, first select the topic hierarchy then click on the statements button.</div>

    <div style="margin-left:20px;margin-top:20px;">
        <div style="float:left;width:150px;height:20px;">Selected Topic Hierarchy:</div>
        <textarea id="topicHierarchies801" style="float:left;width:330px;height:20px;"></textarea>
        <div style="clear:both;"></div>
    </div>

    <div style="float:left;margin-left:20px;">
        <fieldset>
            <legend>Topic Hierarchies </legend>
            <select class="topicHierarchies400" size=7 style="width:420px; background:white">ListBox</select>
        </fieldset>

        <fieldset>
            <legend>Topics in selected hierarchy</legend>
            <select id="topicHierarchies401" size=9 style="width:420px; background:white">ListBox</select>
        </fieldset>
    </div>

    <fieldset style="float:left;">
    <legend>Topic Hierarchy</legend>
        <button id="topicHierarchies103" style="width:80px;height:35px;margin:5px;">New</button><br/>
        <button id="topicHierarchies104" style="width:80px;height:35px;margin:5px;">Delete</button><br/>
        <button id="topicHierarchies105" style="width:80px;height:50px;margin:5px;">Save as new Kb</button><br/>
        <button id="topicHierarchies106" style="width:80px;height:50px;margin:5px;">Show statements</button>
    </fieldset>

    <div style="clear:both;"></div>
</div>     <!-- End of content div -->
`;
    }

})(jQuery);


