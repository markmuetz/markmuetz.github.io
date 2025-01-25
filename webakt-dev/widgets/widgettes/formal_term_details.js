// Local test images
// file:///home/robert/Projects/AKT/webakt/dev/test_image_access.gif
// file:///home/robert/Projects/AKT/webakt/dev/images/Panicum_maximum_reduced.jpg

AKT.widgets.formal_term_details = {};


// Original CSS for slider tool is at the bottom of this file, commented out.

AKT.widgets.formal_term_details.setup = function (widget) {

    console.log(7201,widget.options);
    AKT.state.current_widget = widget;
    var self = this;

    // Thanks to https://webdesign.tutsplus.com/how-to-build-a-simple-carousel-with-vanilla-javascript--cms-41734t 



    var kbId = widget.options.kbId;
    var kb = AKT.KBs[kbId];

    if (widget.options.mode === 'new') {
        var tempFormalTerm = new FormalTerm({kb:kb});
    } else if (widget.options.mode === 'view' || widget.options.mode === 'edit') {
        var formalTerm = widget.options.item;
        var formalTermSpec = formalTerm.makeSpec();
        tempFormalTerm = new FormalTerm(formalTermSpec);
    }

    widget.temp_formal_term = tempFormalTerm;  // So it's available. 

    //var widgetSettings = $('<div></div>');
    //$(widget.element).find('.content').prepend(widgetSettings);

    // Note: We modify the display of some elements (depending on mode=new/view/edit) 
    // here, at widgie creation time.  This will do for the time being, but may have
    // to be shifted to the display function if/when we allow the same panel to be
    // used repeatedly (instead of creating a new one each time, as now).
    // Note: the 'modal' class indicates that the display style for the element 
    // depends on the mode (i.e. new,view or edit).
    var mode = widget.options.mode;

	if (mode === "new") {
        $(widget.element).find('button').filter('.modal').attr('disabled',false);
        $(widget.element).find('div').filter('.editable').attr('contenteditable',true);

        var selectElement = AKT.makeReprocessSelector(
            widget.element, 
            widget.widgetName,
            '',                    // Label: here, provided for container element with class .div_type
            ['Select term type...','action','attribute','comparison','link','object','process','value'], 
            '---',                 // Default value.
            'term_type',           // Name of the widget option that is assigned the listbox (<select>) option.
            'formal_term_type',    // Class name for the listbox (<select>) element.
            'div_type');           // Class name for this widget's container element for the <select> element.
            // Note that the last argument will either hold the non-editable formal term type (for modes view
            // and edit), or the <select> element (for mode new).

        $(widget.element).find('.div_type').append(selectElement);
        $(widget.element).find('.button_in_hierarchy').css({display:'none'});
        $(selectElement).css({'margin-left':'0px',padding:'3px;'});
        //$(widget.element).find('.div_name').prop('disabled',false);

        var selectElement = AKT.makeReprocessSelector(
            widget.element, 
            widget.widgetName,
            '',                    // Label: here, provided for container element with class .div_type
            ['Select language...','english','french','latin','local','blank'], 
            '---',                 // Default value.
            'language',           // Name of the widget option that is assigned the listbox (<select>) option.
            'formal_term_language',    // Class name for the listbox (<select>) element.
            'div_language');           // Class name for this widget's container element for the <select> element.
            // Note that the last argument will either hold the non-editable formal term type (for modes view
            // and edit), or the <select> element (for mode new).

        $(widget.element).find('.div_language').append(selectElement);
        $(selectElement).css({'margin-left':'0px',padding:'3px;'});
        //$(widget.element).find('.div_name').prop('disabled',false);
		
	} else if (mode === 'view') {
		$(widget.element).find('.button_update').css({display:'none'});
        $(widget.element).find('button').filter('.modal').attr('disabled',true);
		$(widget.element).find('.button_add_image').css({display:'none'});
		$(widget.element).find('.button_remove_image').css({display:'none'});
        $(widget.element).find('div').filter('.editable').attr('contenteditable',false);
        $(widget.element).find('.div_name').text(widget.options.item_id);
        $(widget.element).find('.div_type').append('<div class="modes_view_and_edit" disabled style="padding-left:3px;font-weight:bold; background:white;">'+tempFormalTerm._type+'</div>');
        $(widget.element).find('.div_language').append('<div class="modes_view_and_edit" disabled style="padding-left:3px;font-weight:bold; background:white;">'+tempFormalTerm._language+'</div>');
        //$(widget.element).find('.div_name').prop('disabled',true);
        if (widget.options.item._type !== 'object') {
            $(widget.element).find('.button_in_hierarchy').css({display:'none'});
		}
	} else if (mode === 'edit') {
        $(widget.element).find('button').filter('.modal').attr('disabled',false);
        $(widget.element).find('div').filter('.editable').attr('contenteditable',true);
        $(widget.element).find('.div_name').text(widget.options.item_id);
        $(widget.element).find('.div_type').append('<div class="modes_view_and_edit" disabled style="padding-left:3px;font-weight:bold; background:white;">'+tempFormalTerm._type+'</div>');
        $(widget.element).find('.div_language').append('<div class="modes_view_and_edit" disabled style="padding-left:3px;font-weight:bold; background:white;">'+tempFormalTerm._language+'</div>');
        //$(widget.element).find('.div_name').prop('disabled',true);
        if (widget.options.item._type !== 'object') {
            $(widget.element).find('.button_in_hierarchy').css({display:'none'});
		}
		
	} else {
		alert('System error in hierarchy_details.js\nNot your fault\nUnrecognised mode '+mode+' in setup()');
        return;
	}


    // ----------------------------------------------------------------------
    // User interaction event handlers

    $(widget.element).find('.button_statements').on('click', function() {
        event.stopPropagation();
        console.log('Clicked on Statements button');
        var kbId = widget.options.kbId;
        var kb = AKT.kbs[kbId];

        var eventShiftKey = event ? event.shiftKey : null;
/*
        var panel = AKT.panelise({
            widget_name:'statements',
            position:{left:'200px',top:'20px'},
            size:{width:'550px',height:'540px'},
            shift_key: event.shiftKey,
            options:{kbId:kbId, filters:{formal_term:true,formal_term_value:tempFormalTerm._id}}
        });
*/
        var panel = AKT.panelise({
            widget_name:'collection',
            position:{left:'20px',top:'20px'},
            size:{width:'550px',height:'540px'},
            shift_key: eventShiftKey,
            options:{kbId:AKT.state.current_kb,item_type:'statement',filters:{formal_term:{[tempFormalTerm._id]:true}}}
        });

        AKT.recordEvent({
            file:'formal_term_details.js',
            function:'AKT.widgets.formal_term_details.setup()',
            element:widget.element,
            finds:['.button_statements'],
            event:'click',
            value: tempFormalTerm._id,
            message:'Clicked on the Statements button in the formal_term_details panel.'
        });

    });


    $(widget.element).find('.button_images').on('click', function() {
        event.stopPropagation();
        console.log('Clicked on Images button');
        var kbId = widget.options.kbId;
        var kb = AKT.kbs[kbId];

        var eventShiftKey = event ? event.shiftKey : null;

        var panel = AKT.panelise({
            widget_name:'images',
            position:{left:'200px',top:'20px'},
            size:{width:'550px',height:'540px'},
            shift_key: event.shiftKey,
            //options:{kbId:kbId, filters:{formal_term:true,formal_term_value:tempFormalTerm._id}}
            options:{kbId:kbId, filters:{}}
        });

        AKT.recordEvent({
            file:'formal_term_details.js',
            function:'AKT.widgets.formal_term_details.setup()',
            element:widget.element,
            finds:['.button_images'],
            event:'click',
            value: tempFormalTerm._id,
            message:'Clicked on the Images button in the formal_term_details panel.'
        });

    });


    $(widget.element).find('.button_in_hierarchy').on('click', function() {
        event.stopPropagation();
        console.debug('Clicked on In hierarchy button');
        var kbId = widget.options.kbId;
        var kb = AKT.KBs[kbId];

        var nodeId = widget.options.item_id;
        var hierarchies = kb._objectHierarchies;

        var hierarchyId = null;
        var hierarchyIds = [];
        $.each(hierarchies, function(id,hierarchy) {
            var hier = hierarchies[id];
            var nodes = hier.getAllDescendants(hier._root);
            if (nodes.includes(nodeId)) {
                console.log('yes!',nodeId,'is in',hier._id);
                hierarchyId = hier._id;
                hierarchyIds.push(hierarchyId);
            } else {
                console.log('no!',nodeId,'is not in',hier._id);
            }
        });

        for (var i=0; i<hierarchyIds.length; i++) {
            hierarchyId = hierarchyIds[i];
            hierarchy = hierarchies[hierarchyId];
            var panel = AKT.panelise({
                widget_name:'hierarchy_details',
                position:{left:'20px',top:'20px'},
                size:{width:'450px',height:'540px'},
                shift_key: event.shiftKey,
                options:{kbId:kbId, mode:'view', tree_type:'object', item_type:'object_hierarchy', item:hierarchy, item_id:hierarchyId, extra:tempFormalTerm._id}
            });
        }

        // Obsolete code - left in as reminder to fix it.
        AKT.recordEvent({
            file:'formal_term_details.js',
            function:'AKT.widgets.formal_term_details.setup()',
            element:widget.element,
            finds:['.button_in_hierarchy'],
            event:'click',
            value: tempFormalTerm._id,
            message:'Clicked on the In Hierarchy button in the formal_term_details panel.'
        });

    });


    $(widget.element).find('.button_wizard').on('click', function() {
        event.stopPropagation();
        console.debug('Clicked on Wizard button');
        var kb = AKT.KBs['atwima'];  // Or AKT.kbs['atwima'];   ??
		
		var formalTerms = kb._formalTerms;
		for (var id in formalTerms) {
			var formalTerm = formalTerms[id];
			
            var name = id;
			var type = formalTerm._type;
            var definition = formalTerm._definition;
            var memo = formalTerm._memo;
			var synonyms = 'no,synonyms';
			
 			
			//$(widget.element).find('.div_definition').selected = type;   /// TODO: fix this!!
			//$(widget.element).find('.formal_term_type').find('option[value="'+type+'"]').attr('selected',true);
			widget.options.term_type = type;
			$(widget.element).find('.div_name').text(name);
            $(widget.element).find('.div_definition').text(definition);
            $(widget.element).find('.div_synonyms').text(synonyms);
            $(widget.element).find('.div_memo').text(memo);
			
			$(widget.element).find('.button_update').trigger('click');
		}
	});


    // Adapted from source_details
    $(widget.element).find('.button_update').on('click', function() {
        event.stopPropagation();
        console.log('update',widget.options);
        //var kbId = widget.options.kbId;
        var kbId = AKT.state.current_kb;
        var kb = AKT.KBs[kbId];
        console.log(kbId,kb);

        if (widget.options.mode ==='new') {
            var name = $(widget.element).find('.div_name').text();
            if (kb._formalTerms[name]) {
                alert('The formal term "' + name + '" already exists.   Please click the "Edit" button in the formal_terms panel instead.');
                $(widget.element).find('.dialog_close_button').click();
                return;
            }
            var type = widget.options.term_type;
            console.log('name:',name,':   type:',type);
            if (!type || type === 'Select the term type...') {
                alert('Please select the type of formal term from the drop-down box.');
                return;
            } else if (!name) {
                alert('Please provide a name for the formal term.');
            }
            var id = name;
            var type = widget.options.term_type;
            var language = widget.options.language;
            var definition = $(widget.element).find('.div_definition').text();
            //var synonyms = $(widget.element).find('.div_synonyms').text().split(',');
            var memo = $(widget.element).find('.div_memo').text();
            //AKT.loadTable(widget.element, 'table_synonyms', formalTerm.synonyms, true);   // Loads rows
            // into a one-column table, one <tr<td>...</td></tr> for each instance of the 3rd argument.

            // Gather up the synonyms.
            var synonyms = [];
            var jqSynonyms = $(widget.element).find('.div_synonym');
            for (var i=0; i<jqSynonyms.length; i++) {
                var jqSynonym = jqSynonyms[i];
                var term = $(jqSynonym).find('input').val();
                if (term) {
                    var lang = $(jqSynonym).find('select option:selected').text();
                    if (lang) {
                        var synonym = {term:term,language:lang};
                    } else {
                        synonym = {term:term};
                    }
                    synonyms.push(synonym);
                }
            }

            var images = {};
            $(widget.element).find('.div_image_id').each(function(){
                var imageId = $(this).text();
                var image = kb._images[imageId];
                images[imageId] = image;
            });
            console.log(9012,images);

            // *** SEE BOTTOM OF PAGE FOR EXPERIMENTAL CODE FOR "CONCEPT"

        } else if (widget.options.mode === 'edit') {
            console.log('EDIT: ',widget.options.item);
            var formalTerm = widget.options.item;
            var name = formalTerm._name;
            var type = formalTerm._type;
            var definition = $(widget.element).find('.div_definition').text();
            var synonyms = $(widget.element).find('.div_synonyms').text().split(',');
            var memo = $(widget.element).find('.div_memo').text();
            id = formalTerm._id;

            var images = {};
            $(widget.element).find('.div_image_id').each(function(){
                var imageId = $(this).text();
                var image = kb._images[imageId];
                images[imageId] = image;
            });
        }

        tempFormalTerm._name = name;
        tempFormalTerm._id = id;
        tempFormalTerm._type = type;
        tempFormalTerm._definition = definition;
        tempFormalTerm._memo = memo;
        tempFormalTerm._synonyms = synonyms;
        tempFormalTerm._images = images;
        console.log(9601,tempFormalTerm);

        $(widget.element).find('.div_id').text(id);

        kb._formalTerms[id] = tempFormalTerm;
		AKT.saveKbInLocalStorage(kbId)
        $('#message').text('The Formal Terms list has been updated');

        if (widget.options.mode==='new') {
            AKT.trigger('new_item_created_event',{kb:kb,item_type:'formal_term',item:formalTerm});
        } else if (widget.options.mode==='edit') {
            AKT.trigger('item_changed_event',{kb:kb,item_type:'formal_term',item:formalTerm});
        }

        //AKT.trigger('new_formal_term_created_event',{kb:kb,formal_term:formalTerm});
        $('#message').text('The Formal Terms list has been updated');
	    AKT.saveKbInLocalStorage(kbId);
    });


    $(widget.element).find('.button_add_synonym').on('click', function() {

        $('.ui-dialog').css('z-index',1000000);
        $('#dialog1').dialog('open');
        $('#dialog1').find('button').on('click', function() {
            var name = $('#dialog1').find('input').val();
            var language = $('#dialog1').find('option:selected').text();
            if (language) {
                $(widget.element).find('.table_synonyms').append('<tr><td>'+name+' ('+language+')</td></tr>');
            } else {
                $(widget.element).find('.table_synonyms').append('<tr><td>'+name+'</td></tr>');
            }
            var formalTerm = new FormalTerm({id:name,type:'object',kb:kb,synonyms:[],definition:''});
            kb._formalTerms[name] = formalTerm;
            $('#dialog1').dialog('close');
        });   
        //});
        //var formalTerm = prompt('Formal term: ');
        //console.log(formalTerm);
        //$(widget.element).find('.table_synonyms').append('<tr><td>'+formalTerm+'</td></tr>');
    });


    // Image-related buttons


    $(widget.element).find('.button_add_image').on('click', function (event) {   // add_source button
        console.log('BUTTON: Clicked on Add image button');
        event.stopPropagation();

        var kbId = widget.options.kbId;
        var kb = AKT.KBs[kbId];

        AKT.state.current_listener = {uuid:widget.uuid,type:'image'};

        var eventShiftKey = event ? event.shiftKey : null;

        var panel = AKT.panelise({
            widget_name:'images',
            position:{left:'20px',top:'20px'},
            size:{width:'470px',height:'390px'},
            shift_key: event.shiftKey,
            options:{kbId:kbId}
        });
    });


    $(widget.element).find('.button_remove_image').on('click', function (event) {   
        console.log('BUTTON: Clicked on Remove image button - currently does nothing!');
        event.stopPropagation();

        var kbId = widget.options.kbId;
        var kb = AKT.KBs[kbId];

/* Derived from button_remove_source in statement_details.
   Needs to be adapted for images.
        var statement = widget.options.statement;

        console.log(kb);
        var id = $(widget.element).find('.select_sources').val();
        var source = kb._sources[id];
        console.log(kb,statement,id,source);

        var eventShiftKey = event ? event.shiftKey : null;

        var panel = AKT.panelise({
            widget_name:'source_details',
            position:{left:'20px',top:'20px'},
            size:{width:'470px',height:'390px'},
            shift_key: event.shiftKey,
            options:{kbId:kbId, source:source}
        });
*/
    });


    // This is derived from $(document).on('item_selected_event,...)in statement_details
    // for getting a source.
    // But in this case it detects which image in the images widgette a user has selected.
    // Unlike the statement_details case, this does not pick up that event from the 
    // generic listbox structure, but from the grid of images.
	$(document).on('item_selected_event', function(event,args) {
        console.log(7001,args,widget);
        if (args.item_type !== 'image') return;
        console.log('7002a',AKT.state.current_listener);
        console.log('7002b',widget.uuid);
        console.log('7002c',AKT.state.current_listener.uuid);
        // We are asking: Is the uuid of this widget the same as the widget uuid that is currently
        // awaiting an "item_selected"event"?
        if (AKT.state.current_listener && 
                args.item_type === 'image' &&
                AKT.state.current_listener.type === 'image' && 
                widget.uuid === AKT.state.current_listener.uuid) {
            console.log(7003);
            var kbId = widget.options.kbId;
            var kb = AKT.KBs[kbId];
            var imageId = args.item_id;
            var image = kb._images[imageId];
            console.log(7004,image);
            var formalTerm = widget.options.item;
            if (formalTerm && formalTerm._images) {
                formalTerm._images[imageId] = image;
            } else {
                tempFormalTerm._images = {imageId:image};
            }

            $(widget.element).find('.slides-container').append(`
                <li class="slide">
                    <div style="width:100%;height:100%;">
                        <img src="`+image._url+`" style="width:100%;height:90%;"></img>
                        <div>`+image._caption+`</div>
                        <div class="div_image_id">`+imageId+`</div>
                    </div>
                </li>
            `);

            AKT.state.current_listener = {uuid:null,listener_id:null};
            AKT.slidersCss(widget);
        }
    });

};



AKT.widgets.formal_term_details.display = function (widget) {
    console.log('formal_term_details options:/n',widget.options);
    var kbId = widget.options.kbId;
    var kb = AKT.KBs[kbId];

    var tempFormalTerm = widget.temp_formal_term;  // For convenience.

    $(widget.element).find('.div_term').text(tempFormalTerm._id);
    $(widget.element).find('.div_type').text(tempFormalTerm._type);
    $(widget.element).find('.div_language').text(tempFormalTerm._language);
    $(widget.element).find('.div_definition').text(tempFormalTerm._definition);
    $(widget.element).find('.div_memo').text(tempFormalTerm._memo);

    //AKT.loadOptions(widget.element, 'select_synonyms', formalTerm.synonyms, true);
    AKT.loadTable(widget.element, 'table_synonyms', tempFormalTerm._synonyms, true);   // Loads rows into a one-column table,
            // one <tr><td>...</td></tr> for each instance of the 3rd argument.

    var images = tempFormalTerm._images;
    for (var imageId in images) {
        var image = images[imageId];
        $(widget.element).find('.slides-container').append(`
            <li class="slide">
                <div style="width:100%;height:100%;">
                    <img src="`+image._url+`" style="width:100%;height:90%;"></img>
                    <div>`+image._caption+`</div>
                    <div class="div_image_id">`+imageId+`</div>
                </div>
            </li>
        `);
        AKT.slidersCss(widget);
    }
    
    // See bottom of file for test code for local images.
};


AKT.widgets.formal_term_details.html = `
<div class="content" style="background:inherit;border:none; padding:10px;">
    <div>
        <div style="float:left;height:20px;padding-right:5px;">Name:</div>
        <div class="div_name" contenteditable style="font-weight:bold; float:left; background:white; width:170px; height:20px; resize:horizontal; padding-left:3px;"></div>
        
        <div style="float:left;">
            <div style="float:left;height:20px;width:65px;margin-left:15px;padding-right:5px;">Type:</div>
            <div class="div_type" style="float:left; width:100px; height:20px;"></div>
        <div style="clear:both;"></div>
            <div style="float:left;height:20px;width:65px;margin-left:15px;padding-right:5px;">Language:</div>
            <div class="div_language" style="float:left; width:100px; height:20px;"></div>
        <div style="clear:both;"></div>
    </div>

    <div style="margin-top:15px; display:none;">

        <div class="object_only">
            <div style="float:left;width:60px;height:20px;">Part of :</div>
            <select class="select_superobjects" size=3 style="float:left;width:140px; background:white"></select>

            <div style="float:left;width:45px;height:20px;margin-left:15px;">Parts:</div>
            <select class="select_subobjects" size=3 style="float:left;width:140px; background:white"></select>

            <div style="clear:both;"></div>
        </div>

        <div style="clear:both;"></div>
    </div>

    <div >
        <div style="float:left;">

            <!-- DEFINITION -->
            <div style="margin-top:10px;">
                <div style="width:70px;height:20px;">Definition: </div>
                <div class="div_definition" contenteditable style="border:solid 1px black; background:white; width:180px;height:65px;"></div>
            </div>


            <!--SYNONYMS -->
            <div style="margin-top:10px;">
                <div>
                    <div style="float:left;width:70px;height:20px;">Synonym(s):</div>
                    <button class="button_add_synonym" style="float:left;padding-left:3px;padding-right:3px;margin-bottom:2px;">Add</button>
                    <div style="clear:both;"></div>
                </div>
                <div style="overflow:auto; border:solid 1px black; background:white; width:180px; height:0; min-height:65px;">
                    <table class="table_synonyms" style="margin:0px;">
                    </table>
                </div>
                

                <div style="display:none;margin-top:0px;">
                    <button class="button_add" style="margin:0px;width:50px;height:30px;">Add</button><br/>
                    <button class="button_delete" style="margin-top:6px;width:50px;height:30px;">Delete</button>
                </div>
            </div>


            <!-- MEMO -->
            <div style="margin-top:10px;">
                <div style="width:70px;height:20px;">Memo: </div>
                <div class="div_memo" contenteditable style="border:solid 1px black; background:white; width:180px;height:65px;"></div>
            </div>
        </div>


        <!-- IMAGE -->
        <!-- Thanks to https://webdesign.tutsplus.com/how-to-build-a-simple-carousel-with-vanilla-javascript--cms-41734t -->
        <!-- Orginal HTML first, then my adapted version.   Eventually all code will be packaged in a single function -->
        <div class="div_image" style="float:left;width:252px;height:252px;margin:7px;margin-top:30px;background:white;border:solid 1px black;">
            <section class="slider-wrapper">
                <button class="slide-arrow" id="slide-arrow-prev">&#8249;</button>
                <button class="slide-arrow" id="slide-arrow-next">&#8250;</button>
              
                <ul class="slides-container" id="slides-container" style="padding-inline-start:0px;">
              </ul>
            </section>
        </div>

        <div style="clear:both;"></div>
    </div>


    <!-- BUTTONS -->
    <div style="margin-bottom:8px;">
        <button class="button_statements" style="float:left;width:80px;height:25px;margin-left:10px;" title="Shows the statements that contain this formal term.">Statements</button>
        <button class="button_in_hierarchy" style="float:left;width:80px;height:25px;margin-left:10px;" title="If this term is an object, shows where it occurs in its object hierarchy." >In Hierarchy</button>

        <div class="div_images_buttons" style="float:left;">
            <button class="button_images" style="float:left;width:50px;height:25px;margin-left:10px;" title="Open the Images panel to display all images" >Images</button>
            <button class="button_add_image" style="float:left;width:40px;height:25px;margin-left:0px;" title="To add an image, click on the Images button if not already done, then click on an image in the images panel.">Add</button>
            <button class="button_remove_image" style="float:left;width:50px;height:25px;margin-left:0px;" title="Remove image">Remove</button>
            <div style="clear:both;"></div>
        </div>

        <button class="button_update" style="float:right;width:60px;height:25px;margin-left:10px;" title="Updates this entry in the knowledge base.">Update</button>

    </div>
    
    <div style="clear:both;"></div>

</div>     <!-- End of content div -->
`;

/* Original CSS
.slider-wrapper {
  margin: 1rem;
  position: relative;
  overflow: hidden;
}
.slides-container {
  height: calc(100vh - 2rem);
  width: 100%;
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  overflow: scroll;
  scroll-behavior: smooth;
}
.slide {
  width: 100%;
  height: 100%;
  flex: 1 0 100%;
}

... To get rid of horizontal scrollbar...
.slides-container {
    scrollbar-width: none;  Firefox 
    -ms-overflow-style: none;   Internet Explorer 10+ 
}
 WebKit 
.slides-container::-webkit-scrollbar { 
    width: 0;
    height: 0;
}
*/

/*
.slide-arrow {
  position: absolute;
  display: flex;
  top: 0;
  bottom: 0;
  margin: auto;
  height: 4rem;
  background-color: white;
  border: none;
  width: 2rem;
  font-size: 3rem;
  padding: 0;
  cursor: pointer;
  opacity: 0.5;
  transition: opacity 100ms;
}
.slide-arrow:hover,
.slide-arrow:focus {
  opacity: 1;
}
#slide-arrow-prev {
  left: 0;
  padding-left: 0.25rem;
  border-radius: 0 2rem 2rem 0;
}
#slide-arrow-next {
  right: 0;
  padding-left: 0.75rem;
  border-radius: 2rem 0 0 2rem;
}
*/

    /* Carousel slider original code
    const slidesContainer = document.getElementById("slides-container");
    const slide = document.querySelector(".slide");
    const prevButton = document.getElementById("slide-arrow-prev");
    const nextButton = document.getElementById("slide-arrow-next");
    nextButton.addEventListener("click", () => {
      const slideWidth = slide.clientWidth;
      slidesContainer.scrollLeft += slideWidth;
    });
    prevButton.addEventListener("click", () => {
      const slideWidth = slide.clientWidth;
      slidesContainer.scrollLeft -= slideWidth;
    });
    */

            // Check which if any of the synonyms are already formal terms.
            // If none, then the new formal term will result in the creation of a new 
            // Concept.    
            // If just one, then its Concept will be used for the new formal term, and
            // also for the other synonyms (if any).
            // If more than one, then that's an error if their Concepts are different. That
            // should not have been allowed to occur!
            // Nov 2023: The following code is work in progress, indeed class Concept() is 
            // not yet implemented.
/*
            var nAlreadyKnown = 0;
            var alreadyKnowns = [];
            for (var i=0; i<synonyms.length; i++) {
                var synonym = synonyms[i];
                if (kb._formalTerms[synonym.name]) {
                    nAlreadyKnown += 1;
                    alreadyKnowns.push(synonym);  
                }
            }
            
            if (nAlreadyKnown === 0) {
                var concept = new Concept(synonym);
                //var conceptId = AKT.createNewId('concept');  Implement this.
                AKT.state.counter.concepts += 1;  // Temporary
                var iConcept = AKT.state.counter.concepts;
                kb._concepts[iConcept] = concept;
                for (var i=0; i<synonyms.length; i++) {
                    var synonym = synonyms[i];
                    synonym.concept =  concept;   //TODO: No!
                }
            } else if (nAlreadyKnown >0) {
            } else {  // Check if their Concepts are different!
            }                    
*/

/*
        if (formalTerm.id === "nyanya") {
            $(widget.element).find('.div_image').append('<img style="width:250px; height:250px;" SRC="images/momordica_charantia.gif">');
        } else if (formalTerm.id === "cocoyam") {
            $(widget.element).find('.div_image').append('<img style="width:250px; height:250px;" SRC="images/Bakweri_cocoyam_farmer_from_Cameroon.jpg">');
        } else if (formalTerm.id === "esre") {
            $(widget.element).find('.div_image').append('<img style="width:250px; height:250px;" SRC="images/Panicum_maximum_reduced.jpg">');
        } else {
            AKT5.show('<img style="float:right; margin:10px; width:200px; height:200px; background:white;" SRC="no_image.gif">');
        }
        AKT.slidersCss(widget);
*/

