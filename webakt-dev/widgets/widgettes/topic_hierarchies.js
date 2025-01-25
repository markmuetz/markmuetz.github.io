AKT.widgets.hierarchy_trees = {};


AKT.widgets.hierarchy_trees.setup = function (widget) {
        var widgetSettings = $('<div></div>');
        $(widget.element).append(widgetSettings);

        var kbSelectElement = AKT.makeReprocessSelector(widget.element, widget.widgetName,
            'Knowledge base', AKT.getKbIds(), AKT.state.current_kb, 'kbId');
        $(widgetSettings).append(kbSelectElement);

};


AKT.widgets.hierarchy_trees.display = function (widget) {
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
};


AKT.widgets.hierarchy_trees.html = `
<div class="content" style="border:none; padding:15px;">
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



