AKT.widgets.topic = {};


AKT.widgets.topic.setup = function (widget) {

};


AKT.widgets.topic.display = function (widget) {
    console.debug('AKT.widgets.topic.display: ',widget.options);
    var kbId = widget.options.kbId;
    var kb = AKT.KBs[kbId];
    var topicId = widget.options.topic;
    var topic = kb.findTopicById(topicId);

    $(widget.element).find('.textarea_topic').val(topic._id);
    $(widget.element).find('.textarea_searchterm').val(topic._searchTerm);
    $(widget.element).find('.textarea_description').val(topic._description);


    var objects = topic.objects.split('+');
    $(widget.element).find('.checkbox_object').prop('checked', false);
    $(widget.element).find('.checkbox_subobjects').prop('checked', false);
    $(widget.element).find('.checkbox_superobjects').prop('checked', false);
    for (var i=0; i<objects.length; i++) {
        if (objects[i] === 'object') {
            $(widget.element).find('.checkbox_object').prop('checked', true);
        } else if (objects[i] === 'subobjects') {
            $(widget.element).find('.checkbox_subobjects').prop('checked', true);
        } else if (objects[i] === 'superobjects') {
            $(widget.element).find('.checkbox_superobjects').prop('checked', true);
        }
    }

    function getTopic(topicName) {
        for (var i=0; i<kb.topics.length; i++) {
            if (kb.topics[i].name === topicName) {
                return kb.topics[i];
            }
        }
        return null;
    };
};


AKT.widgets.topic.html = `
<div class="content" style="margin:15px;border:none;">

    <div>
        <div style="float:left;width:40px;height:20px;">Topic</div>
        <textarea class="textarea_topic" style="float:left;width:220px;height:20px;"></textarea>
    </div>


    <fieldset>
        <legend>Boolean Search String</legend>
        <textarea class="textarea_searchterm" style="width:250px;height:50px;"></textarea>
    </fieldset>

    <div>
        <fieldset style="float:left;">
            <legend>Search Mode</legend>
            <input class="checkbox checkbox_object" type="checkbox">
            <label for="topicDetail200">object</label><br/>

            <input class="checkbox checkbox_subobjects" type="checkbox">
            <label for="topicDetail201">subobjects</label><br/>

            <input class="checkbox checkbox_superobjects" type="checkbox">
            <label for="topicDetail202">superobjects</label><br/>
        </fieldset>

        <button id="topicDetail100" style="float:left;width:60px;height:35px;margin-left:30px;margin-top:30px;">Save</button>

        <div style="clear:both;"></div>
    </div>

    <fieldset>
        <legend>Description</legend>
        <textarea class="textarea_description" style="width:250px;height:130px;"></textarea>
    </fieldset>

    <button id="topicDetail102" style="width:140px;height:35px;">Show use in statements</button>
    <button id="topicDetail103" style="width:140px;height:35px;">Show use in hierarchies</button>

</div>     <!-- End of content div -->
`;



