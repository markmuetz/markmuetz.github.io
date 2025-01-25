(function ($) {

  /***********************************************************
   *         dialog_Hierarchies widget
   ***********************************************************
   August 2021
   This is intended to be a generic widget for handling either type of hierarchhy - topic or 
   object.   The way they are represented and handled in AKT5 is so similar that it seems 
   pointess to have two widgets for them, especially since my code for reasoning with them
   is already generalised (in js/hierarchies.js).
   The current hierarchy type is set by an option.
   Reminder: AKT uses the term 'hierarchy' to mean one of several user-defined groupings
   for topics, and ditto for objects.   Thus, it doesn't think in terms of  one "topic hierarchy",
   but rather "several topic hierarchies", and ditto for objects.   I have kept with this
   convention, but frankly can't really see the reason for doing it this way, as opposed to
   having one topic hierarachy, and one object hierarhy.
   */

    $.widget('akt.dialog_Hierarchies', {
        meta:{
            short_description: 'dialog_Hierarchies',
            long_description: 'dialog_Hierarchies',
            author: 'Robert Muetzelfeldt',
            last_modified: 'August 2021',
            visible: true,
            options: {
            }
        },

        options: {
            display_hierarchy_members: false,   // This is usually redundant, since the same
                // information is shown in the hierarchy dialog window which opens
                // when you select one hierarchy.
            type: 'topic',
            kb: null,
            show_titlebar:true
        },

        evaluate: function(kb) {
            var results = evaluate(kb);
            display(this, results);
            return results;
        },

        widgetEventPrefix: 'dialog_Hierarchies:',

        _create: function () {
            console.debug('\n### Creating instance of widget "akt.dialog_Hierarchies".',
                '\nElement ID:',this.element[0].id,'  Widget UUID:',this.uuid,'  Options:',this.options);
            var self = this;
            this.element.addClass('dialog_Hierarchies-1');

            createEmptyWidget(self);

            var kb = self.options.kb;
            var results = evaluate(kb);
            display(self, results);

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('dialog_Hierarchies-1');
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
            var titlebarDiv = AKT.makeWidgetTitlebar(widget.widgetName, widget.element);
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
        console.debug('Starting akt.dialog_Hierarchies: evaluate()...');
        var results = null;
        return results;
    }


    function display(widget, results) {
        console.debug('Starting akt.dialog_Hierarchies: display()');
        var kbId = AKT.state.current_kb;
        var kb = AKT.kbs[kbId];

        var widgetContent = $(widget.element).find('.content');

        // SETUP
        var hierarchies = AKT.getHierarchies(kbId, "subtopics");   // TODO: topic or object
        AKT.loadOptions(widgetContent,'hierarchy_select', hierarchies);


        // EVENT HANDLERS
        $('#topicHierarchies103').on('click', function (event) {
            event.stopPropagation();
            console.debug('SELECT: Clicked on topicHierarchies listbox');
            AKT.showDialog('newTopicHierarchy');
        });

        // This is here purely because it works - it stops [the click associated 
        // with the next event handler being picked up and stopping
        // topicHierarchies having the highest z-index].
        $(widget.element).find('.hierarchy_select').on('click', function (event, value) {
            event.stopPropagation();
        });

        $(widget.element).find('.hierarchy_select').on('change', function (event, value) {
            console.debug('hierarchy_select',value,this.value);
            event.stopPropagation();
            // Needed this, since this.value is blank when triggered (in AKT.singleStep).
            if (this.value === '') {
                var optionValue = value;
            } else {
                optionValue = this.value;
            }
            var topicId = optionValue;
            AKT.state.topic_id = topicId;
            var dialog = 'dialog_Hierarchy';
            AKT.openDialog(dialog, event.shiftKey, {left:'200px',top:'20px',width:'550px',height:'540px'}, {kbId:AKT.state.current_kb,type:'topic'});
            //$('#dialog_Hierarchy').dialog_Hierarchy();
        });

        $(widget.element).draggable({containment:'#workspace',handle:".titlebar"});
        var zindex = AKT.incrementZindex("dialog_Hierarchies");
        $(widget.element).css({display:'block','z-index':zindex});
    }


    function baseHtml() {
        return `<div class="content" style="border:none; padding:15px;">
    <div class="topic_hierarchies_info" style="display:none;width:100%;padding-left:20px;padding-right:20px;padding-top:10px;">This knowledge base contains information classified under different categories called topics.  These topics may be organised under different topic hierarchies.  To see the statements defined by a particular topic hierarchy, first select the topic hierarchy then click on the statements button.</div>
    <div class="object_hierarchies_info" style="display:none;width:100%;padding-left:20px;padding-right:20px;padding-top:10px;">This knowledge base contains differengt types of object.  These objects may be organised under different object hierarchies.</div>

    <div style="margin-left:20px;margin-top:20px;">
        <div style="float:left;width:150px;height:20px;">Selected Topic Hierarchy:</div>
        <textarea id="topicHierarchies801" style="float:left;width:330px;height:20px;"></textarea>
        <div style="clear:both;"></div>
    </div>

    <div style="float:left;margin-left:20px;">
        <fieldset>
            <legend>Topic Hierarchies </legend>
            <select class="hierarchy_select" size=7 style="width:420px; background:white">ListBox</select>
        </fieldset>

        <fieldset class="hierarchy_members" style="display:none;">
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


