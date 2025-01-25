// December 2023
// Combined source-reference.js and source-interviewee into a single widget,
// source-details.   I have also abstracted the concept of a source property.
// These two steps greatly reduce the amount of code needed.
// the basic object that allows this is widget.props[type][propId],
// where type is 'person' or 'reference', and propId comes from an array of
// property names that is different for each of the two types.  So all of the
// code is the same for each property of each type.    The only type-specific
// code is the HTML for the divs in the form that contains the individual
// property values for a particular source.
// Note that widget.props[type] is an object containing key:value pairs, where
// key is a property name (e.g. location), and value is the type of HTML
// element used for it.   Mostly div, but this allow for input or select elements
// to be used.
// Note that this approach exploits the fact that the property name is the
// same for both the object that holds its value and the html element in the form.
// The basic code that handles this is thus something like:
//    var type = widget.options.type;  // 'person' or 'reference'
//    for (propId in widget.props[type]) {
//        $(widget.element).find('.div_'+propId).text(source['_'+propId]);
//    }

AKT.widgets.source_details = {};


AKT.widgets.source_details.setup = function (widget) {
    console.log('\n*** [source_details.js] AKT.widgets.source_details.setup(): options=',widget.options);

    $(widget.element).find('.source_type_'+widget.options.type).css({display:'block'});
    
    // Re-jigging of source_details to handle either person-type or reference-type 
    // source.    Note that user-defined 'extras' (e.g. ethnic_origin) are *not*
    // handled at this stage, until the mechanism for looping over properties is
    // adapted to handle these.
    // Note that each property (usually 'div') specifies the type of HTML element
    // used to get its value.  So, 'div' indicates a (contenteditable) <div> element.
    // This is to allow for others, e.g. a <select> element,in which case it would be
    // an object which lists the options available, rather than a simple string.
    widget.props = {
        person:{id:'div',type:'div',name:'div',interviewer:'div',location:'div',day:'div',month:'div',
            year:'div',sex:'div',ethnic_origin:'div',memo:'div'},
        reference:{id:'div',type:'div',name:'div',title:'div',publication:'div',year:'div',
            volume:'div',number:'div',pages:'div',memo:'div'}
    };


		widget.sample_sources = {
            person:[
                {id:'adam',
                type:'person',
                name:'Adam',
                location:'Gogoikrom',
                interviewer:'Agbo',
                sex:'M',
                day:23,'month':'jun','year':2000,
                memo:'none',
                ethnic_origin:'Northern',
                age:'<35'},

                {id:'fred',
                type:'person',
                name:'Fred',
                location:'Gogoikrom',
                interviewer:'Agbo',
                sex:'M',
                day:24,month:'jun',year:2000,
                memo:'none',
                ethnic_origin:'Northern',
                age:'<35'}
            ],
            reference:[
                {id:'bandy',
                type:'reference',
                name:'Bandy,D.E., Garrity,D.P. and Sanchez,P.A.',
                title:'The worldwide problem of slash-and-burn agriculture',
                publication:'Agroforestry Today',
                volume:'3',
                number:'5',
                pages:'2-6'}
            ]          
        };

    widget.counter = {person:0,reference:0};   // Separate counters for each source type in
    // sample sources in wizard.


    widget.source_type = 'person';
    $(widget.element).find('.div_source_type').css({display:'none'});
    $(widget.element).find('.div_source_type_person').css({display:'block'});


    // ================================================ NEW/VIEW/EDIT CUSTOMISATION

    // We modify the display of some elements (depending on mode=new/view/edit) 
    // here, at widgie creation time.  This will do for the time being, but may have
    // to be shifted to the display function if/when we allow the same panel to be
    // used repeatedly (instead of creating a new one each time, as now).
    // Note: the 'modal' class indicates that the display style for the element 
    // depends on the mode (i.e. new,view or edit).
    var mode = widget.options.mode;
    if (mode === 'new'){
        $(widget.element).find('.div_input').attr('contenteditable',true);
        $(widget.element).find('.div_id').attr('disabled',false);
        $(widget.element).find('.select_type').attr('disabled',false);
        $(widget.element).find('.button_update').attr('disabled',false);


    } else if (mode === 'view'){
        $(widget.element).find('.div_input').attr('contenteditable',false);
        $(widget.element).find('button').attr('disabled',true);
        $(widget.element).find('.button_statements').attr('disabled',false);
        $(widget.element).find('.button_update').css({display:'none'});
        $(widget.element).find('.button_wizard').css({display:'none'});
        $(widget.element).find('select').attr('disabled',true);

    } else if (mode === 'edit'){
        $(widget.element).find('.div_input').attr('contenteditable',true);
        $(widget.element).find('.div_id').attr({contenteditable:false,readonly:true});
        $(widget.element).find('.div_id').css({background:'#e0e0e0'});
        $(widget.element).find('.select_type').attr('disabled',true);
        $(widget.element).find('.button_update').attr('disabled',false);
    }

    if (widget.options.mode === 'new') {
        widget.temp_source = new Source();
    } else if (widget.options.mode === 'edit') {
        // 24 June 2024.  I'm now cloning the statement.
        // TODO: Change every xxx_details.js widgette to use this pattern.
        var source = widget.options.item;
        var sourceSpec = source.makeSpec();
        widget.temp_source = new Source(sourceSpec);
    }

   
    // =============================================================EVENT HANDLERS

    $(widget.element).find('.button_statements').on('click', function() {
        console.log('\n*** [source_details.js] Click event on "Statements" button');
        event.stopPropagation();
        var kbId = widget.options.kbId;
        var kb = AKT.kbs[kbId];

        var source = widget.options.item;

        var eventShiftKey = event ? event.shiftKey : null;
/*
        var panel = AKT.panelise({
            widget_name:'statements',
            position:{left:'650px',top:'20px'},
            size:{width:'580px',height:'550px'},
            shift_key: event.shiftKey,
            options:{kbId:kbId, filters:{source:{source._id:true}}}
        });
*/
        var panel = AKT.panelise({
            widget_name:'collection',
            position:{left:'20px',top:'20px'},
            size:{width:'550px',height:'540px'},
            shift_key: eventShiftKey,
            options:{kbId:AKT.state.current_kb,item_type:'statement',filters:{source:{[source._id]:true}}}
        });
    });
	
	
    $(widget.element).find('.button_wizard').on('click', function() {
        event.stopPropagation();
        console.log('\n*** [source_details.js] Click event on "Wizard" button');
        var kb = AKT.KBs['atwima'];  // Or AKT.kbs['atwima'];   ??
		// id,type,name,interviewer,location,sex,day,month,year,ethnic_origin,age,
        // id,type,name,title,publication,volume,number,pages

        var type = widget.source_type;  // 'person' or 'reference'
        var sampleSource = widget.sample_sources[type][widget.counter[type]];

        for (propId in widget.props[type]) {
            $(widget.element).find('.div_'+propId).text(sampleSource[propId]);
        }

        widget.counter[widget.source_type] += 1;
        if (widget.counter[type] >= widget.sample_sources[type].length) {
            widget.counter[type] = 0;
        }
	});


    $(widget.element).find('.button_update').on('click', function() {
        console.log('\n*** [source_details.js] Click event on "Update" button');
        event.stopPropagation();

        var kbId = AKT.state.current_kb;
        var kb = AKT.KBs[kbId];

        if (widget.options.mode ==='new') {
/*
            var id = $(widget.element).find('.div_id').text();
            if (!id) {
                alert('You must enter an ID before updating the knowledge base with this new Source.');
                return;
            }

            var type = $(widget.element).find('.select_type').find(":selected").val();
            if (!type) {
                alert('You must choose a source type (person or reference)');
                return;
            }     
            widget.temp_source._id = id;
            widget.temp_source._type = type;
*/ 
            var id = $(widget.element).find('.div_id').text();
            if (!id) {
                alert('You must enter an ID before updating the knowledge base with this new Source.');
                return;
            }
            var type = $(widget.element).find('.select_type').find(":selected").val();
            if (!type) {
                alert('You must choose a source type (person or reference)');
                return;
            }     
            var source = new Source({kb:kb});
            source._id = id;
            source._type = type;

        } else if (widget.options.mode === 'edit') {
            type = widget.options.item._type;
            source = widget.temp_source;
        }

        for (var propId in widget.props[type]) {  // type is 'person' or 'reference'
            if (propId==='id') continue;
            if (propId==='type') continue;
            source['_'+propId] = $(widget.element).find('.div_source_type_'+type).find('.div_'+propId).text();
        }
/*
        var tempSource = {
            id: id,
            name: name,
            location: location,
            year: year,
            suffix: suffix,
            type: 'reference'
        };
        localStorage.setItem('latest_source',JSON.stringify(tempSource));
*/
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
            message:'Clicked on the Update button in the source_details panel.'
        });
*/
        kb._sources[source._id] = source;
		AKT.saveKbInLocalStorage(kbId);

        if (widget.options.mode==='new') {
            AKT.trigger('new_item_created_event',{kb:kb,item_type:'source',item:widget.temp_source});
        } else if (widget.options.mode==='edit') {
            AKT.trigger('item_changed_event',{kb:kb,item_type:'source',item:widget.temp_source});
        }

        $('#message').text('The Sources list has been updated');
    });

    $(widget.element).find('.select_type').on('change', function(event) {
        console.log('\n*** [statement_details.js] Click event on "Type" <select> option');
        widget.source_type = $(this).find(":selected").val();
        var type = widget.source_type;
        $(widget.element).find('.div_source_type').css({display:'none'});
        $(widget.element).find('.div_source_type_'+type).css({display:'block'});

        var source = widget.sample_sources[type];
        for (propId in widget.props[type]) {
            //var prop = widget.props[type][propId];
            $(widget.element).find('.source_type_'+type).find('.div_'+propId).text(source['_'+propId]);
        }
    });
};


// ===============================================================================

AKT.widgets.source_details.display = function (widget) {
    console.log('\n*** [source_details.js] AKT.widgets.source_details.display(): options=',widget.options);

    var kbId = widget.options.kbId;
    var kb = AKT.KBs[kbId];
    var source = widget.options.item; 

    if (source) {
        var type = source._type;
        $(widget.element).find('.div_source_type').css({display:'none'});
        $(widget.element).find('.div_source_type_'+type).css({display:'block'});

        for (propId in widget.props[type]) {
            if (propId==='id') {
                $(widget.element).find('.div_id').text(source['_id']);
            } else if (propId==='type') {
                $(widget.element).find('.select_type').val(source._type);
            } else {
                $(widget.element).find('.div_source_type_'+type).find('.div_'+propId).text(source['_'+propId]);
            }
        }

    } else {         //sourceIndex = null - i.e. it's a new source
/*
        if (localStorage.getItem('latest_sourcexxx')) {
            var tempSource = JSON.parse(localStorage.getItem('latest_source'));
            //$(widget.element).find('.div_id').text('Will be derived from Source data');
            for (propId in widget.props[type]) {
                //var prop = widget.props[type][propId];
                $(widget.element).find('.div_'+propId).text(tempSource[propId]);
            }
        }
*/

/*
        for (propId in widget.sample_sources[type]) {
            //var prop = widget.props[type][propId];
            $(widget.element).find('.div_'+propId).text(widget.sample_sources[type][propId]);
        }
*/
    }

    // TODO: Doesn't show selected options! - i.e. values for current source
    $(widget.element).find('.div_user_labels').empty();

    $.each(kb._source_user_labels, function(labelId,possibleValues) {
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


AKT.widgets.source_details.html = `
<div class="content" style="border:none;padding:15px;background:inherit;">
    
    <!-- Top section, with ID and soure type elements -->
    <div>
        <div style="margin-top:4px;">
            <div style="float:left;display:inline-block;width:20px;">ID</div>
            <div class="div_id" contenteditable style="float:left; overflow:hidden; height:18px; width:125px; 
                background:white; border:solid 1px black;padding-left:5px;"></div>
        </div>

        <div style="margin-top:4px;">
            <div style="float:left;display:inline-block;width:30px;margin-left:10px;">Type</div>
            <select class="select_type">
                <option value="person">Person</option>
                <option value="reference">Reference</option>
            </select>
        </div>
        <div style="clear:both;"></div>
    </div>

        <!-- ====================== source-type-specific forms ====================== -->
        <!-- Only one will have CSS style set to display:block - the other(s) have display:none -->

        <!-- ......Start of source_type_person block....... -->
        <div class="div_source_type div_source_type_person" style="float:left;display:none;">

            <div style="margin-top:4px;">
                <div style="float:left;display:inline-block;width:70px;">Name</div>
                <div class="div_input div_name" style="float:left;overflow:hidden;height:18px;width:125;background:white;border:solid 1px black;padding-left:5px;"></div>
            </div>
            <div style="clear:both;"></div>

            <div style="margin-top:4px;">
                <div style="float:left;display:inline-block;width:70px;">Interviewer</div>
                <div class="div_input div_interviewer" style="float:left;overflow:hidden;height:18px;width:125px;background:white;border:solid 1px black;padding-left:5px;"></div>
            </div>
            <div style="clear:both;"></div>

            <div style="margin-top:4px;">
                <div style="float:left;display:inline-block;width:70px;">Location</div>
                <div class="div_input div_location" style="float:left;overflow:hidden;height:18px;width:125;background:white;border:solid 1px black;padding-left:5px;"></div>
            </div>
            <div style="clear:both;"></div>

            <div style="margin-top:4px;">
                <div style="float:left;display:inline-block;width:70px;">Sex</div>
                <div class="div_input div_sex" style="float:left;overflow:hidden;height:18px;width:25;background:white;border:solid 1px black;padding-left:5px;"></div>
                <div style="float:left;display:inline-block;width:70px;margin-left:10px;">M or F</div>
            </div>
            <div style="clear:both;"></div>

            <div style="margin-top:4px;">
                <div style="float:left;display:inline-block;width:25px;">Day</div>
                <div class="div_input div_day" style="float:left;overflow:hidden;height:18px;width:25;background:white;border:solid 1px black;padding-left:3px;"></div>
            </div>

            <div style="margin-top:4px;">
                <div style="float:left;display:inline-block;width:35px;margin-left:5px;">Month</div>
                <div class="div_input div_month" style="float:left;overflow:hidden;height:18px;width:35;background:white;border:solid 1px black;padding-left:2px;"></div>
            </div>

            <div style="margin-top:4px;">
                <div style="float:left;display:inline-block;width:27px;margin-left:5px;">Year</div>
                <div class="div_input div_year" style="float:left;overflow:hidden;height:18px;width:35;background:white;border:solid 1px black;padding-left:3px;"></div>
            </div>
            <div style="clear:both;"></div>

            <div style="margin-top:4px;">
                <div style="float:left;display:inline-block;width:70px;">Ethnic_origin</div>
                <div class="div_input div_ethnic_origin" style="float:left;overflow:hidden;height:18px;width:125;background:white;border:solid 1px black;padding-left:5px;"></div>
            </div>
            <div style="clear:both;"></div>

            <div style="margin-top:4px;">
                <div style="float:left;display:inline-block;width:70px;">Age</div>
                <div class="div_input div_age" style="float:left;overflow:hidden;height:18px;width:125px;background:white;border:solid 1px black;padding-left:5px;"></div>
            </div>
            <div style="clear:both;"></div>

            <div style="margin-top:4px;">
                <div style="float:left;display:inline-block;width:70px;">Memo</div>
                <div class="div_input div_memo" style="float:left;overflow:hidden;height:50px;width:300px;background:white;border:solid 1px black;padding-left:5px;"></div>
            </div>
            <div style="clear:both;"></div>

            <!-- div style="margin-top:4px;height:18px;">
                <div style="float:left;display:inline-block;width:70px;">Gender</div>
                <select id="" style="float:left;background:white;">
                    <option value="male">male</option>
                    <option value="female">female</option>
                    <option value="na">na</option>
                </select>
            </div>
            <div style="clear:both;"></div>
            -->

            <!-- container for user labels -->
            <div class="div_user_labels" style="margin-top:4px;"></div>
            
            <div style="clear:both;"></div>

            <!--div style="margin-top:4px;">
                <div style="float:left;display:inline-block;width:70px;">Date</div>
                <select id="" style="float:left;background:white;">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                    <option value="13">13</option>
                    <option value="14">14</option>
                    <option value="15">15</option>
                    <option value="16">16</option>
                    <option value="15">17</option>
                    <option value="18">18</option>
                    <option value="19">19</option>
                    <option value="20">20</option>
                    <option value="21">21</option>
                    <option value="22">22</option>
                    <option value="23">23</option>
                    <option value="24">24</option>
                    <option value="25">25</option>
                    <option value="26">26</option>
                    <option value="27">27</option>
                    <option value="28">28</option>
                    <option value="29">29</option>
                    <option value="30">30</option>
                    <option value="31">31</option>
                </select>
                <select id="" style="float:left;background:white;">
                    <option value="jan">January</option>
                    <option value="feb">February</option>
                    <option value="mar">March</option>
                    <option value="apr">April</option>
                    <option value="may">May</option>
                    <option value="jun">June</option>
                    <option value="jul">July</option>
                    <option value="aug">August</option>
                    <option value="sep">September</option>
                    <option value="oct">October</option>
                    <option value="nov">November</option>
                    <option value="dec">December</option>
                </select>
            </div>  -->

        </div>  <!-- End of source_type_person block -->


        <!-- ......Start of source_type_reference block........ -->
        <div class="div_source_type div_source_type_reference" style="display:none;float:left;">

            <div style="margin-top:4px;">
                <div style="float:left;display:inline-block;width:60px;">Author(s)</div>
                <div class="div_input div_name" style="float:left;overflow:auto;height:50px;width:185px;background:white;border:solid 1px black;padding-left:5px;"></div>
            </div>
            <div style="clear:both;"></div>

            <div style="margin-top:4px;">
                <div style="float:left;display:inline-block;width:60px;">Title</div>
                <div class="div_input div_title" style="float:left;overflow:auto;height:50px;width:185;background:white;border:solid 1px black;padding-left:5px;"></div>
            </div>
            <div style="clear:both;"></div>

            <div style="margin-top:4px;">
                <div style="float:left;display:inline-block;width:60px;">Publication</div>
                <div class="div_input div_publication" style="float:left;overflow:hidden;height:40px;width:185;background:white;border:solid 1px black;padding-left:5px;"></div>
            </div>

            <div style="float:left;display:inline-block;margin-left:5px;margin-right:4px;">Vol</div>
            <div class="div_input div_volume" style="float:left;overflow:hidden;background:white;border:solid 1px black;padding-left:5px;padding-right:5px;"></div>

            <div style="float:left;display:inline-block;margin-left:10px;margin-right:4px;">No.</div>
            <div class="div_input div_number" style="float:left;overflow:hidden;background:white;border:solid 1px black;padding-left:5px;padding-right:5px;"></div>

            <div style="float:left;display:inline-block;margin-left:10px;margin-right:4px;">Pages</div>
            <div class="div_input div_pages" style="float:left;overflow:hidden;background:white;border:solid 1px black;padding-left:5px;padding-right:5px;"></div>
            <div style="clear:both;"></div>

            <div style="margin-top:4px;">
                <div style="float:left;display:inline-block;width:70px;">Memo</div>
                <div class="div_input div_memo" style="float:left;overflow:hidden;height:50px;width:300px;background:white;border:solid 1px black;padding-left:5px;"></div>
            </div>
            <div style="clear:both;"></div>
        </div> <!-- End of source_type_reference block -->

    </div>   <!-- End of main block -->


    <div style="float:left;margin-left:15px;padding:top:15px;">
        <button class="button_update" style="width:70px;height:20px;margin:2px;">Update</button><br/>
        <button class="button_statements" style="width:70px;height:20px;margin:2px;">Statements</button><br/>
        <button class="button_wizard" style="width:70px;height:20px;margin:2px;">Wizard</button>
    </div>

    <div style="clear:both;"></div>

</div>     <!-- End of content div -->
`;



