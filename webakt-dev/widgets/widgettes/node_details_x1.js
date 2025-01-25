AKT.widgets.node_details = {};


AKT.widgets.node_details.setup = function (widget) {
    console.log('widget (node-details) setup options:',widget.options);


    $(widget.element).find('.button_update').on('click', function() {
        event.stopPropagation();
        console.log('update',widget.options);
        //var kbId = widget.options.kbId;
        var kbId = AKT.state.current_kb;
        var kb = AKT.KBs[kbId];
        console.log(kbId,kb);

        if (widget.options.mode ==='new') {
            var name = $(widget.element).find('.div_name').text();
            var location = $(widget.element).find('.div_location').text();
            var year = $(widget.element).find('.div_year').text();
            var suffix = $(widget.element).find('.div_suffix').text();
            var id = name+'_'+location+'_'+year+suffix;
            var node = new node({id:id,name:name,location:location,year:year,suffix:suffix});
            //kb._nodes['_'+id] = node;
        } else if (widget.options.mode === 'edit') {  // Non-editable once you've made this node
            var node = widget.options.node;
            name = node._name;
            location = node._location;
            year = node._year;
            suffix = node._suffix;
            id = node._id;
        }
        var interviewer = $(widget.element).find('.div_interviewer').text();
        var interviewee = $(widget.element).find('.div_interviewee').text();
        var sex = $(widget.element).find('.select_sex').val();
        var month = $(widget.element).find('.input_month').val();
        var day = $(widget.element).find('.input_day').val();

        $(widget.element).find('.div_id').text(id);

        // Update the node instance.
/*
        node._id =          id;
        node._name =        name;
        node._location =    location;
        node._year =        year;
        node._suffix =      suffix;
*/
        node._interviewer = interviewer;
        node._interviewee = interviewee;
        node._sex =         sex;
        node._month =       month;
        node._day =         day;
        kb._nodes[id] = node;

        console.log(kb,node);

        var tempnode = {
            id: id,
            name: name,
            location: location,
            year: year,
            suffix: suffix,
            interviewer: interviewer,
            interviewee: interviewee,
            sex: sex,
            month: month,
            day: day
        };
        localStorage.setItem('latest_node',JSON.stringify(tempnode));

        AKT.recordEvent({
            file:'node_details.js',
            function:'AKT.widgets.node_details.setup()',
            element:widget.element,
            finds:['.button_update'],
            event:'click',
            values:[
                {value:name,        find:'.div_name',        type:'div'},
                {value:location,    find:'.div_location',    type:'div'},
                {value:year,        find:'.div_year',        type:'div'},
                {value:suffix,      find:'.div_suffix',      type:'div'},
                {value:interviewer, find:'.div_interviewer', type:'div'},
                {value:interviewee, find:'.div_interviewee', type:'div'},
                {value:sex,         find:'.div_sex',         type:'div'},
                {value:month,       find:'.input_month',     type:'input'},
                {value:day,         find:'.input_day',       type:'input'},
            ],
            message:'Clicked on the Update button in the node_details panel.'
        });

        AKT.trigger('new_node_created_event',{kb:kb,node:tempnode});
		kb.saveKbInLocalStorage();
        $('#message').text('nodes have been updated');
    });


};


// ===============================================================================

AKT.widgets.node_details.display = function (widget) {
    console.log('widget (node_details) display options:',widget.options);

    var kbId = widget.options.kbId;
    var kb = AKT.KBs[kbId];

    if (node && node._memo) {
        var memo = node._memo;
    } else {
        memo = 'none';
    }
    $(widget.element).find('.div_memo').text(memo);

};


AKT.widgets.node_details.html = `
<div class="content" style="border:none;padding:15px;background:inherit;">

    <div>
        <div style="float:left;">ID:</div>
        <div class="div_id" style="float:left; font-weight:bold; color:#909090; margin-left:5px;"></div>
    </div>

    <div style="clear:both;"></div>

    <!-- Start of main block -->
    <div style="float:left;width:200px;height:100px;background;yellow;">
    </div>   <!-- End of main block -->

    <div style="float:left;margin-left:15px;padding:top:15px;">
        <button class="button_update" style="width:70px;height:20px;margin:2px;">Update</button><br/>
        <button class="button_statements" style="width:70px;height:20px;margin:2px;">Statements</button><br/>
        <button class="button_wizard" style="width:70px;height:20px;margin:2px;">Wizard</button>
    </div>

    <div style="clear:both;"></div>

    <div>
        <div>Memo</div>
        <div class="div_memo" style="width:300px;height:50px;overflow-y:auto;float:left;background:white;border:solid 1px black;padding:4px;"></div>
    </div>
    <div style="clear:both;"></div>

</div>     <!-- End of content div -->
`;



