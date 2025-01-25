(function ($) {

  /***********************************************************
   *         dialog_Hierarchy widget
   ***********************************************************
   */
    $.widget('akt.dialog_Hierarchy', {
        meta:{
            short_description: 'dialog_Hierarchy',
            long_description: 'dialog_Hierarchy',
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

        widgetEventPrefix: 'dialog_Hierarchy:',

        _create: function () {
            console.debug('\n### Creating instance of widget "akt.dialog_Hierarchy".',
                '\nElement ID:',this.element[0].id,'  Widget UUID:',this.uuid,'  Options:',this.options);
            var self = this;
            this.element.addClass('dialog_Hierarchy-1');

            var kb = self.options.kb;
            var results = evaluate(kb);
            display(self, results);

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('dialog_Hierarchy-1');
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
        console.debug('Starting akt.dialog_Hierarchy: evaluate()...');
        var results = null;
        return results;
    }


    function display(widget, results) {
        console.debug('Starting akt.dialog_Hierarchy: display()');
        console.debug(results);
        var kbId = AKT.state.current_kb;
        var kb = AKT.kbs[kbId];

        if (widget.options.show_titlebar) {
            var widgetTitlebar = $('<div class="titlebar">dialog_Hierarchy<input type="button" value="X" class="dialog_close_button"/></div>');  
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
        console.debug(topicTree);
        $(widget.element).find('.span_topic_hierarchy').text(topicId);
        $(widget.element).find('.span_selected_topic').text(topicId);
        $(widget.element).find('.div_topic').text(topicId);
        $('#topic_hierarchy801').text(topicId);
        $('#topic_hierarchy802').text(topicId);

        var allSubtopicIds = AKT.getAllDescendants(topicTree, topicId); 
        console.debug(allSubtopicIds);
        AKT.loadOptions(widgetContent,'select_topics', allSubtopicIds);

        var supertopics = AKT.getAllAncestors(topicTree, topicId);
        console.debug(supertopics);
        AKT.loadOptions(widgetContent,'select_supertopics', supertopics);

        var subtopicIds = AKT.getChildren(topicTree, topicId); 
        console.debug(subtopicIds);
        AKT.loadOptions(widgetContent,'select_subtopics', subtopicIds);

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
            console.debug(supertopics);
            AKT.loadOptions('select_supertopics', supertopics);

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
        var zindex = AKT.incrementZindex("dialog_Hierarchy");
        $(widget.element).css({display:'block','z-index':zindex});
    }


    function baseHtml() {
        return `<div class="content" style="border:none;padding:10px;">
    <div>
        <span>Topic hierarachy:</span><span class="span_topic_hierarchy">XXXX</span>
    </div>

    <div>
        <span>Selected topic:</span><span class="span_selected_topic">YYYY</span>
    </div>

    <fieldset style="float:left;">
        <legend>Topics in hierarchy</legend>
        <select class="select_topics" size=16 style="width:130px; background:white">[]</select>
    </fieldset>

    <fieldset style="float:left;">
        <legend>Topic Hierarchy Structure</legend>

        <label>Supertopics:</label><br/>
        <select class="select_supertopics" size=5 style="width:110px; background:white"></select>

        <div style="margin-top:5px; margin-bottom:8px;">
            <div>Topic: </div><div class="div_topic" style="border:solid 1px black;"></div>
        </div>

        <label>Immed. Subtopics:</label><br/>
        <select class="select_subtopics" size=7 style="width:110px; background:white"></select>
    </fieldset>

    <div style="float:left;margin-top:20px; text-align:center;">
        <button class="button_memo" style="width:80px;height:25px;">Memo</button><br/>
        <button class="button_details" style="width:80px;height:25px;">Topic Details</button><br/>

        <fieldset>
            <legend>Selected Topic</legend>

            <button class="button_add" style="width:70px;height:25px;">Add a Topic</button><br/>
            <button class="button_detach" style="width:70px;height:25px;">Detach</button><br/>
            <button class="button_move" style="width:70px;height:25px;">Move</button><br/>
        </fieldset><br/>

        <button class="button_statements" style="width:100px;height:30px;">Topic Statements</button><br/>
        <button class="button_view_tree" style="width:100px;height:30px;">View Tree</button>
    </div>

</div>     <!-- End of content div -->
`;
    }

})(jQuery);


