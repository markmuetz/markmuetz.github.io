AKT.widgets.diagram_details = {};


AKT.widgets.diagram_details.setup = function (widget) {
    console.log('widget (diagram-details) setup options:',widget.options);


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
            var diagram = new diagram({id:id,name:name,location:location,year:year,suffix:suffix});
            //kb._diagrams['_'+id] = diagram;
        } else if (widget.options.mode === 'edit') {  // Non-editable once you've made this diagram
            var diagram = widget.options.diagram;
            name = diagram._name;
            location = diagram._location;
            year = diagram._year;
            suffix = diagram._suffix;
            id = diagram._id;
        }
        var interviewer = $(widget.element).find('.div_interviewer').text();
        var interviewee = $(widget.element).find('.div_interviewee').text();
        var sex = $(widget.element).find('.select_sex').val();
        var month = $(widget.element).find('.input_month').val();
        var day = $(widget.element).find('.input_day').val();

        $(widget.element).find('.div_id').text(id);

        // Update the diagram instance.
/*
        diagram._id =          id;
        diagram._name =        name;
        diagram._location =    location;
        diagram._year =        year;
        diagram._suffix =      suffix;
*/
        diagram._interviewer = interviewer;
        diagram._interviewee = interviewee;
        diagram._sex =         sex;
        diagram._month =       month;
        diagram._day =         day;
        kb._diagrams[id] = diagram;

        console.log(kb,diagram);

        var tempdiagram = {
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
        localStorage.setItem('latest_diagram',JSON.stringify(tempdiagram));

        AKT.recordEvent({
            file:'diagram_details.js',
            function:'AKT.widgets.diagram_details.setup()',
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
            message:'Clicked on the Update button in the diagram_details panel.'
        });

        AKT.trigger('new_diagram_created_event',{kb:kb,diagram:tempdiagram});
		kb.saveKbInLocalStorage();
        $('#message').text('diagrams have been updated');
    });


};


// ===============================================================================

AKT.widgets.diagram_details.display = function (widget) {
    console.log('widget (diagram_details) display options:',widget.options);

    var kbId = widget.options.kbId;
    var kb = AKT.KBs[kbId];

    if (diagram && diagram._memo) {
        var memo = diagram._memo;
    } else {
        memo = 'none';
    }
    $(widget.element).find('.div_memo').text(memo);

};


AKT.widgets.diagram_details.html = `
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



