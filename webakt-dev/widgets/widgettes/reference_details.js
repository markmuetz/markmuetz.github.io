AKT.widgets.reference_details = {};


AKT.widgets.reference_details.setup = function (widget) {
    console.log('widget (reference-details) setup options:',widget.options);
    
    // Rejigging of source_details to handle either interviewee-type or reference-type 
    // source.    Note that user-defined 'extras' (e.g. ethnic_origin) are *not*
    // handled at this stage, until the mechanism for looping over properties is
    // adapted to handle these.
    widget.props = {
        interviewee:['id','name','sufix','location','year','interviewer','interviewee',
            'sex','memo'],
        reference:['id','name','suffix','authors','title','publication','year','month',
            'day','volume','number','pages','memo']
    };

    $(widget.element).find('.button_statements').on('click', function() {
        event.stopPropagation();
        var kbId = widget.options.kbId;
        var kb = AKT.kbs[kbId];

        console.log(widget.options);

        var source = widget.options.source;

        var eventShiftKey = event ? event.shiftKey : null;

        var panel = AKT.panelise({
            widget_name:'statements',
            position:{left:'650px',top:'20px'},
            size:{width:'580px',height:'550px'},
            shift_key: event.shiftKey,
            options:{kbId:kbId, filters:{source:true, source_value:source._id}}
        });
    });
	
	
    $(widget.element).find('.button_wizard').on('click', function() {
        event.stopPropagation();
        console.log('Clicked on Wizard button');
        var kb = AKT.KBs['atwima'];  // Or AKT.kbs['atwima'];   ??
		
		var sources = {
            "Adam_Gogoikrom_2000a":{
                "id":"Adam_Gogoikrom_2000a",
                "name":"Adam","location":"Gogoikrom",
                "suffix":"a", "method":"interview",
                "interviewer":"Agbo",
                "interviewee":"Adam",
                "sex":"M","day":23,"month":"jun","year":2000,"memo":"none",
                "extras":{"Ethnic origin":"Northern","Age":"<35"}},
            "Amoako_Gogoikrom_2000a":{
                "id":"Amoako_Gogoikrom_2000a",
                "name":"Amoako","location":"Gogoikrom",
                "suffix":"a","method":"interview",
                "interviewer":"Agbo",
                "interviewee":"Amoako",
                "sex":"M","day":15,"month":"jun","year":2000,"memo":"none",
                "extras":{"Ethnic origin":"na","Age":"na"}},
            "Ampadu_Kyereyase_2000a":{
                "id":"Ampadu_Kyereyase_2000a",
                "name":"Ampadu","location":"Kyereyase",
                "suffix":"a","method":"interview",
                "interviewer":"Agbo",
                "interviewee":"Ampadu",
                "sex":"M","day":9,"month":"jun","year":2000,"memo":"none",
                "extras":{"Ethnic origin":"Ashanti","Age":">35"}}
        };
		for (var id in sources) {
			var source = sources[id];
            var type = widget.options.type;  // 'interviewee' or 'reference'
			
            for (var i=0; i<widget.props[type].length; i++) {
                var prop = widget.props[type][i];
                $(widget.element).find('.div_'+prop).text(source['_'+prop]);
            }
/*
			var id = source.id;
            var name = source.name;
			var year = source.year;			
			var suffix = source.suffix;
			var authors = source.authors;
			var title = source.title;
			var publication = source.publication;
			var volume = source.volume;
			var number = source.number;
			var pages = source.pages;
			var memo = source.memo;
 			
            console.log(7700,id);
			$(widget.element).find('.div_id').text(id);
			$(widget.element).find('.div_name').text(name);
			$(widget.element).find('.div_year').text(year);
			$(widget.element).find('.div_suffix').text(suffix);
			$(widget.element).find('.div_title').text(title);
			$(widget.element).find('.div_publication').text(publication);
			$(widget.element).find('.div_volume').text(volume);
			$(widget.element).find('.div_number').text(number);
			$(widget.element).find('.div_pages').text(pages);
			$(widget.element).find('.div_memo').text(memo);
*/			
			$(widget.element).find('.button_update').trigger('click');
		}
	});


    $(widget.element).find('.button_update').on('click', function() {
        event.stopPropagation();
        console.log('update',widget.options);
        //var kbId = widget.options.kbId;
        var kbId = AKT.state.current_kb;
        var kb = AKT.KBs[kbId];
        console.log(kbId,kb);

        if (widget.options.mode ==='new') {
            var name = $(widget.element).find('.div_name').text();
            var suffix = $(widget.element).find('.div_suffix').text();
            var id = name+'_'+suffix;
            var source = new Source({id:id,name:name, suffix:suffix});

        } else if (widget.options.mode === 'edit') {  // Non-editable once you've made this source
            var source = widget.options.source;
            name = source._name;
            suffix = source._suffix;
            id = source._id;
        }
        var authors = $(widget.element).find('.div_authors').text();
        var title = $(widget.element).find('.div_title').text();
        var publication = $(widget.element).find('.div_publication').text();
        var year = $(widget.element).find('.div_year').text();
        var volume = $(widget.element).find('.div_volume').text();
        var number = $(widget.element).find('.div_number').text();
        var pages = $(widget.element).find('.div_pages').text();

        $(widget.element).find('.div_id').text(id);

        // Update the Source instance.

        source._id =          id;
        source._name =        name;
        source._year =        year;
        source._suffix =      suffix;

        source._authors =     authors;
        source._title =       title;
        source._publication = publication;
        source._volume =      volume;
        source._number =      number;
        source._pages =       pages;

        source._type =        'reference';

        kb._sources[id] = source;

        console.log(7777,kb,source);

        var tempSource = {
            id: id,
            name: name,
            location: location,
            year: year,
            suffix: suffix,
            type: 'reference'
        };
        localStorage.setItem('latest_source',JSON.stringify(tempSource));
/*
        AKT.recordEvent({
            file:'source_details.js',
            function:'AKT.widgets.source_details.setup()',
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
            message:'Clicked on the Update button in the reference_details panel.'
        });
*/
        AKT.trigger('new_source_created_event',{kb:kb,source:tempSource});
		AKT.saveKbInLocalStorage(kbId);
        $('#message').text('Sources have been updated');
    });

/*
    $(widget.element).find('.button_save').on('click', function() {
        console.log('Clicked on Save');
        console.log(widget.options);

        AKT.recordEvent({
            file:'statements.js',
            function:'AKT.widgets.statement_details.setup()',
            event:'click',
            element:widget.element,
            finds:['.button_save'],
            values:[
                {value:$(widget.element).find('.div_formal_main').text(), find:'.div_formal_main', type:'div'},
                {value:$(widget.element).find('.div_formal_if').text(),   find:'.div_formal_if',   type:'div'}
            ],
            message:'Clicked on .button_save in statement_details.js.'
        });

        var kbId = widget.options.kbId;
        var kb = AKT.KBs[kbId];

        if (widget.options.mode === 'new') {
            var statement = new Statement({kb:kb,formal:formal});
            console.log('new',statement);
            kb._statements[statement._id] = statement;
            // formalTerms has structure {a:['object'],b:['attribute'],c:['value']} for statement att_value(a,b,c)
            var formalTerms = statement.classifyFormalTerms();
            console.log(formalTerms);
            for (var id in formalTerms) {
                var formalTerm = new FormalTerm({id:id,type:formalTerms[id][0],kb:kb,synonyms:[],description:''});
                kb._formalTerms[id] = formalTerm;
            }
            console.log(statement);
            statement._json = this.generateJsonFromFormal(formal);
            statement._english = statement.generateEnglish();
            AKT.trigger('new_statement_created_event',{kb:kb,statement:statement});

        } else if (widget.options.mode === 'details') {   // Temporary - no changes made in details mode. Should be in edit.
            statement = widget.options.source;
            statement._formal = formal;
            statement._json = statement.generateJsonFromFormal(formal);
            statement._english = statement.generateEnglish();
            console.log(statement);
            console.log(kb._statements);
            AKT.trigger('statement_changed_event',{kb:kb,statement:statement});

        } else if (widget.options.mode === 'edit') {
            statement = widget.options.statement;
            statement._formal = formal;
            statement._json = statement.generateJsonFromFormal(formal);
            statement._english = statement.generateEnglish();
            console.log(statement);
            console.log(kb._statements);
            AKT.trigger('statement_changed_event',{kb:kb,statement:statement});
        }

    });
*/

};


// ===============================================================================

AKT.widgets.reference_details.display = function (widget) {
    console.log('widget (source_details) display options:',widget.options);

    var kbId = widget.options.kbId;
    var kb = AKT.KBs[kbId];
    var source = widget.options.source; 
    var type = widget.options.type;  // 'interviewee' or 'reference'

    if (source) {
        for (var i=0; i<widget.props[type].length; i++) {
            var prop = widget.props[type][i];
            $(widget.element).find('.div_'+prop).text(source['_'+prop]);
        }
/*
        $(widget.element).find('.div_id').text(source._id);
        $(widget.element).find('.div_name').text(source._name);
        $(widget.element).find('.div_year').text(source._year);
        $(widget.element).find('.div_suffix').text(source._suffix);
        $(widget.element).find('.div_authors').text(source._authors);
        $(widget.element).find('.div_title').text(source._title);
        $(widget.element).find('.div_publication').text(source._publication);
        $(widget.element).find('.div_volume').text(source._volume);
        $(widget.element).find('.div_number').text(source._number);
        $(widget.element).find('.div_pages').text(source._pages);
        $(widget.element).find('.div_memo').text(source._memo);
*/
    } else {         //sourceIndex = null - i.e. it's a new source
        if (localStorage.getItem('latest_sourcexxx')) {
            var tempSource = JSON.parse(localStorage.getItem('latest_source'));
            console.log(123,tempSource);
            //$(widget.element).find('.div_id').text('Will be derived from Source data');
            for (var i=0; i<widget.props.length; i++) {
                var prop = widget.props[i];
                $(widget.element).find('.div_'+prop).text(tempSource[prop]);
            }
/*
            $(widget.element).find('.div_name').text(tempSource.name);
            $(widget.element).find('.div_year').text(tempSource.year);
            $(widget.element).find('.div_suffix').text(tempSource.suffix);
            $(widget.element).find('.div_authors').text(tempSource.authors);
            $(widget.element).find('.div_title').text(tempSource.title);
            $(widget.element).find('.div_publication').text(tempSource.publication);
            $(widget.element).find('.div_volume').text(tempSource.volume);
            $(widget.element).find('.div_number').text(tempSource.number);
            $(widget.element).find('.div_pages').text(tempSource.pages);
            $(widget.element).find('.div_memo').text(tempSource.memo);
*/
        } else {
/*
            $(widget.element).find('.div_id').text('Will be derived from Reference data');
            $(widget.element).find('.div_year').text('');
            $(widget.element).find('.div_suffix').text('');
            $(widget.element).find('.div_title').text('');
            $(widget.element).find('.div_authors').text('');
            $(widget.element).find('.div_title').text('');
            $(widget.element).find('.div_volume').text('');
            $(widget.element).find('.div_number').text('');
            $(widget.element).find('.div_pages').text('');
            $(widget.element).find('.div_memo').text('');
*/
        }
    }

    // TODO: Doesn't show selected options! - i.e. values for current source
    $(widget.element).find('.div_user_labels').empty();

    console.log('\n5001',kb);
    $.each(kb._source_user_labels, function(labelId,possibleValues) {
        console.log(labelId,possibleValues);
        var label = $('<label style="display:inline-block;width:70px;margin-top:4px;">'+labelId+'</label>');
        var select = $('<select style="width:150px;background:white;"></select>');
        $.each(possibleValues, function(i,val) {
            var option = $('<option value="'+val+'">'+val+'</option>');
            $(select).append(option);
        });
        $(widget.element).find('.div_user_labels').append(label).append(select).append('<br/>');
    });

    if (source && source._memo) {
        var memo = source._memo;
    } else {
        memo = 'none';
    }
    $(widget.element).find('.div_memo').text(memo);


    // TODO: Get KB amended so above code works.   Need to list value set for each label.

/*
    var select = $('<select style="width:150px;background:white;"></select>');
    $.each(kb._source_user_labels, function(i,label) {
        var option = $('<option value="'+label+'">'+label+'</option>');
        $(select).append(option);
    });
    $('#div_user_user_labels').append('<br/>').append(select).append('<br/>');
*/
};


AKT.widgets.reference_details.html = `
<div class="content" style="border:none;padding:15px;background:inherit;">

    <div>
        <div style="float:left;">ID:</div>
        <div class="div_id" style="float:left; font-weight:bold; color:#909090; margin-left:5px;"></div>
    </div>

    <div style="clear:both;"></div>

    <!-- Start of main block -->
    <div style="float:left;">
        <fieldset style="float:left;margin-bottom:5px;">
            <legend>Source keys</legend>

            <div style="float:left;width:50px;">Name</div>
            <div class="div_name" contenteditable style="float:left;overflow:hidden;width:135px;background:white;border:solid 1px black;padding-left:5px;margin-top:2px;">bandy_da</div><br/>

            <div style="float:left;width:50px;margin-top:2px;">Year</div>
            <div class="div_year" contenteditable style="float:left;overflow:hidden;width:50px;background:white;border:solid 1px black;padding-left:5px;margin-top:2px;">1993</div>

            <div style="float:left;width:35px;margin-left:30px;margin-top:2px;">Suffix</div>
            <div class="div_suffix" contenteditable style="float:left;overflow:hidden;width:20px;background:white;border:solid 1px black;padding-left:5px;margin-top:2px;">a</div>
        </fieldset>
        <div style="clear:both;"></div>

        <div style="margin-top:4px;">
            <div style="float:left;display:inline-block;width:60px;">Author(s)</div>
            <div class="div_authors" contenteditable style="float:left;overflow:auto;height:50px;width:225px;background:white;border:solid 1px black;padding-left:5px;">Bandy,D.E., Garrity,D.P. and Sanchez,P.A.</div>
        </div>
        <div style="clear:both;"></div>

        <div style="margin-top:4px;">
            <div style="float:left;display:inline-block;width:60px;">Title</div>
            <div class="div_title" contenteditable style="float:left;overflow:auto;height:50px;width:225;background:white;border:solid 1px black;padding-left:5px;">The worldwide problem of slash-and-burn agriculturexxx</div>
        </div>
        <div style="clear:both;"></div>

        <div style="margin-top:4px;">
            <div style="float:left;display:inline-block;width:60px;">Publication</div>
            <div class="div_publication" contenteditable style="float:left;overflow:hidden;height:40px;width:225;background:white;border:solid 1px black;padding-left:5px;">Agroforestry Today</div>
        </div>

        <div style="float:left;display:inline-block;margin-left:60px;margin-right:4px;">Vol</div>
        <div class="div_volume" contenteditable style="float:left;overflow:hidden;background:white;border:solid 1px black;padding-left:5px;padding-right:5px;">5</div>

        <div style="float:left;display:inline-block;margin-left:10px;margin-right:4px;">No.</div>
        <div class="div_number" contenteditable style="float:left;overflow:hidden;background:white;border:solid 1px black;padding-left:5px;padding-right:5px;">3</div>

        <div style="float:left;display:inline-block;margin-left:10px;margin-right:4px;">Pages</div>
        <div class="div_pages" contenteditable style="float:left;overflow:hidden;background:white;border:solid 1px black;padding-left:5px;padding-right:5px;">2-6</div>
        <div style="clear:both;"></div>

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



