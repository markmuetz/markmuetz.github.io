AKT.widgets.diagrams = {};


AKT.widgets.diagrams.setup = function (widget) {
    console.log('widget/setup (diagrams) options:',widget.options);
    var self = this;
    var widgetSettings = $('<div></div>');
    $(widget.element).find('.content').prepend(widgetSettings);
    var kbId = widget.options.kbId;
    var kb = AKT.KBs[kbId];


    // 6. Change in the diagrams listbox.
    $(widget.element).find('.listbox_diagrams').on('change', function (event, value) {
        console.log('#### 163 ',kb.diagrams);
        event.stopPropagation();
        // Needed this, since this.value is blank when triggered (in AKT.singleStep).
        //if (this.value === '') {
        //    var optionValue = value;
        //} else {
        //    optionValue = this.value;
        //}
        console.log($(this).val(),value);
        var diagramId = $(this).val();
        var diagram = kb._diagrams[diagramId];
        AKT.state.current_diagram = diagram;   // Note: the diagram object, not its ID!
        $(widget.element).find('.div_english').html('<span>'+diagramId+': '+diagram.english+'</span>');

        //var i = parseInt(optionValue.split(':')[0],10);
        //var sentenceIndex = i;
        //AKT.state.sentence_index = sentenceIndex;
        $(widget.element).find('.textarea_formal_language').text(diagramId+': '+diagram.formal);
        
    });



    // ====================================================================================== BUTTON: Details
    // 7a. Click on the 'View' button.
    $(widget.element).find('.button_view').on('click', function (event) {   // diagram View button
        event.stopPropagation();

        //var diagramId = $(widget.element).find('.listbox_diagrams').val();

/* Old method - use widget.options.diagramId
        if (widget.options.diagramId) {
            var diagramId = widget.options.diagramId;
            var diagram = kb.diagrams[diagramId];
        }
*/
        // Alternative method: uses the fact that AKT.myListbox sets an
        // HTML data-key attribute for every <tr> element in the listbox.
        var diagramId = $(widget.element).find('.tr_listbox[data-selected="yes"]').data('key');

        if (diagramId) {
            var diagram = kb._diagrams[diagramId];

            var panel = AKT.panelise({
                widget_name:'diagram_details',
                position:{left:'650px',top:'20px'},
                size:{width:'580px',height:'450px'},
                shift_key: event.shiftKey,
                options:{kbId:kbId, mode:'view', item_id:diagramId, diagram:diagram}
            });

            $('#'+panel._id).dialog_Generic('option', 'diagram', diagram);
        } else {
            alert('Please first select a diagram from the listbox.');
        }


    });


    // ======================================================================= BUTTON: Edit
    // 7b. Click on the 'Edit' button.
    $(widget.element).find('.button_edit').on('click', function (event) {   
        console.log('BUTTON: Clicked on diagrams Edit button');
        event.stopPropagation();

        //var diagramId = $(widget.element).find('.listbox_diagrams').val();
        var diagramId = $(widget.element).find('.tr_listbox[data-selected="yes"]').data('key');

        if (diagramId) {
            var diagram = kb._diagrams[diagramId];

            var panel = AKT.panelise({
                widget_name:'diagram_details',
                position:{left:'650px',top:'20px'},
                size:{width:'580px',height:'450px'},
                shift_key: event.shiftKey,
                options:{kbId:kbId, mode:'edit', item_id:diagramId, diagram:diagram}
            });
        } else {
            alert('Please first select a diagram from the listbox.');
        }
    });


    // 7c. Click on the 'New' button.
    $(widget.element).find('.button_new').on('click', function (event) {   // diagram new button
        console.log('BUTTON: Clicked on the diagrams New button');
        event.stopPropagation();

        var panel = AKT.panelise({
            widget_name:'diagram_details',
            position:{left:'650px',top:'20px'},
            size:{width:'580px',height:'450px'},
            shift_key: event.shiftKey,
            options:{kbId:kbId, mode:'new'}
        });
    });


    // Click on the 'Delete' button.
    $(widget.element).find('.button_delete').on('click', function (event) {   // Delete button
        console.log('BUTTON: Clicked on the diagrams Delete button');
        event.stopPropagation();
        var kbId = widget.options.kbId;
        var kb = AKT.KBs[kbId];

        widget.listbox.deleteCheckedIds();
        self.display(widget);
		kb.saveKbInLocalStorage();
    });


    // Button Select_all
    $(widget.element).find('.button_select_all').on('click', function (event) {   // diagram Select_all button
        if ($(this).text() === 'Select all') {
            widget.listbox.selectAll();
            $(this).text('Deselect all');
        } else {
            widget.listbox.deselectAll();
            $(this).text('Select all');
        }
    });


    // Button Invert
    // Inverting the checked status of diagrams is useful for deleting all but a few.
    // The code is a cunning way to do this inverting.  
    // We fits set the data-checked HTML attribute to false for all checkboxes.
    // We then set it to true for those that are currently checked, and then set their checked property to be false.
    // Finally, we set the checked property to be true for all the rest.
    $(widget.element).find('.button_invert').on('click', function (event) {   // diagram Select_all button
        widget.listbox.invertChecked();
    });


    // -----------------------------------------------------------------------------
    // Custom event handlers
    $(document).on('new_diagram_created_event', function(event,args) {
        self.display(widget);
    });

    $(document).on('diagram_changed_event', function(event,args) {
        self.display(widget);
    });


    $(document).on('diagram_deleted_event', function(event,args) {
        self.display(widget);
    });

};


// ===================================================================================
AKT.widgets.diagrams.display = function (widget) {
    console.log('widget/display (diagrams):',widget.options);
    var kbId = widget.options.kbId;
    var kb = AKT.KBs[kbId];
 
    widget.listbox = new Listbox({
        widget_element:    widget.element,
        div_element_class: 'mylistbox_diagrams',
        items:             {}
,
        property_names:    ['_id', '_english', '_formal'],
        include_key:       false,
        kb:                kb,
        container_object:  'diagrams'
    });
};

AKT.widgets.diagrams.html = `
<div class="content" style="background:inherit; border:none;padding:5px;">


    <div class="w3-row">
        <div class="w3-col w3-right w3-container" style="width:75px;margin:15px;">
            <button class="button_new" style="width:70px;height:27px;">New</button><br/>
            <button class="button_view" style="width:70px;height:27px;">View</button><br/>
            <button class="button_edit" style="width:70px;height:27px;">Edit</button><br/>
            <button class="button_delete" style="width:70px;height:27px;">Delete</button>
            <button class="button_select_all" style="width:70px;height:27px;">Select all</button>
            <button class="button_invert" style="width:70px;height:27px;">Invert</button>
        </div>

        <div class="w3-rest w3-container mylistbox mylistbox_diagrams" 
            style="overflow-y:auto; height:200px; border:solid 1px black; background:white;">
        </div>
    </div>


</div>     <!-- End of content div -->
`;

