(function ($) {

  /***********************************************************
   *         dialog_TopicHierarchy widget
   ***********************************************************
   */
    $.widget('akt.dialog_TopicHierarchy', {
        meta:{
            short_description: 'dialog_TopicHierarchy',
            long_description: 'dialog_TopicHierarchy',
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

        widgetEventPrefix: 'dialog_TopicHierarchy:',

        _create: function () {
            console.debug('\n### Creating instance of widget "akt.dialog_TopicHierarchy".',
                '\nElement ID:',this.element[0].id,'  Widget UUID:',this.uuid,'  Options:',this.options);
            var self = this;
            this.element.addClass('dialog_TopicHierarchy-1');

            var kb = self.options.kb;
            var results = evaluate(kb);
            display(self, results);

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('dialog_TopicHierarchy-1');
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
        console.debug('Starting akt.dialog_TopicHierarchy: evaluate()...');
        var results = null;
        return results;
    }


    function display(widget, results) {
        console.debug('Starting akt.dialog_TopicHierarchy: display()');
        console.debug(results);
        var kbId = AKT.state.current_kb;
        var kb = AKT.kbs[kbId];

        if (widget.options.show_titlebar) {
            var widgetTitlebar = $('<div class="titlebar">dialog_TopicHierarchy<input type="button" value="X" class="dialog_close_button"/></div>');  
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
        var topicId = AKT.state.topic_id;
        var topicTree = kb.extras.topicTree;
        $('#topic_hierarchy1005').text(topicId);
        $('#topic_hierarchy1006').text(topicId);
        $('#topic_hierarchy800').text(topicId);
        $('#topic_hierarchy801').text(topicId);
        $('#topic_hierarchy802').text(topicId);
        var allSubtopicIds = AKT.getAllDescendants(topicTree, topicId); 
        AKT.loadOptions('topicHierarchies401', allSubtopicIds);
        AKT.loadOptions('topic_hierarchy402', allSubtopicIds);
        AKT.loadOptions('topic_hierarchy401', topicTree[0][topicId]);
        AKT.showDialog('topic_hierarchy');

        // EVENT HANDLERS
        $('#topic_hierarchy402').on('change', function (event, value) {
            event.stopPropagation();
            var topicTree = kb.extras.topicTree;
            //var topicId = this.value;
            if (this.value === '') {
                var optionValue = value;
            } else {
                optionValue = this.value;
            }
            var topicId = optionValue;
            $('#topic_hierarchy800').text(topicId);
            $('#topic_hierarchy802').text(topicId);
            AKT.loadOptions('topic_hierarchy401', topicTree[0][topicId]);
            var supertopics = AKT.getAllAncestors(topicTree, topicId);
            AKT.loadOptions('topic_hierarchy400', supertopics);

        });

        $('#topic_hierarchy108').on('click', function (event) {
            event.stopPropagation();
            AKT.showDialog('memo');
        });

        $('#topic_hierarchy105').on('click', function (event) {
            event.stopPropagation();
            AKT.showDialog('topicDetail');
        });

        $('#topic_hierarchy102').on('click', function (event) {
            event.stopPropagation();
            AKT.showDialog('addtopic');
        });

        $('#topic_hierarchy104').on('click', function (event) {
            event.stopPropagation();
            AKT.showDialog('movetopic');
        });

        $('#topic_hierarchy107').on('click', function (event) {
            event.stopPropagation();
            AKT.showDialog('viewallstatements');
        });

        $(widget.element).draggable({containment:'#workspace',handle:".titlebar"});
        var zindex = AKT.incrementZindex("dialog_TopicHierarchy");
        $(widget.element).css({display:'block','z-index':zindex});
    }


    function baseHtml() {
        return `<div class="content" style="border:none;padding:10px;">
    <div>
        <span>Topic hierarachy: '</span><span id="topic_hierarchy801">XXXX</span>
    </div>

    <div>
        <span>Selected topic: '</span><span id="topic_hierarchy800">YYYY</span>
    </div>

    <fieldset style="float:left;">
        <legend>Topics in hierarchy</legend>
        <select id="topic_hierarchy402" size=16 style="width:130px; background:white">[]</select>
    </fieldset>

    <fieldset style="float:left;">
        <legend>Topic Hierarchy Structure</legend>

        <label for="topic_hierarchy400">Supertopics:</label><br/>
        <select id="topic_hierarchy400" size=5 style="width:110px; background:white"></select>

        <div style="margin-top:5px; margin-bottom:8px;">
            <div>Topic: '</div><div id="topic_hierarchy802" style="border:solid 1px black;"></div>
        </div>

        <label for="topic_hierarchy401">Immed. Subtopics:</label><br/>
        <select id="topic_hierarchy401" size=7 style="width:110px; background:white"></select>
    </fieldset>

    <div style="float:left;margin-top:20px; text-align:center;">
        <button id="topic_hierarchy108" style="width:80px;height:25px;">Memo</button><br/>
        <button id="topic_hierarchy105" style="width:80px;height:25px;">Topic Details</button><br/>

        <fieldset>
            <legend>Selected Topic</legend>

            <button id="topic_hierarchy102" style="width:70px;height:25px;">Add a Topic</button><br/>
            <button id="topic_hierarchy103" style="width:70px;height:25px;">Detach</button><br/>
            <button id="topic_hierarchy104" style="width:70px;height:25px;">Move</button><br/>
        </fieldset><br/>

        <button id="topic_hierarchy107" style="width:100px;height:30px;">Topic Statements</button><br/>
        <button id="topic_hierarchy106" style="width:100px;height:30px;">View Tree</button>
    </div>

</div>     <!-- End of content div -->
`;
    }

})(jQuery);


