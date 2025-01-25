AKT.widgets.metadata = {};


AKT.widgets.metadata.setup = function (widget) {
    var widgetSettings = $('<div></div>');
    $(widget.element).append(widgetSettings);

    var kbSelectElement = AKT.makeReprocessSelector(widget.element, widget.widgetName,
        'Knowledge base', AKT.getKbIds(), AKT.state.current_kb, 'kbId');
    $(widgetSettings).append(kbSelectElement);

	
	
    $(widget.element).find('.button_wizard').on('click', function() {
        event.stopPropagation();
        console.debug('Clicked on Wizard button');

/*
        var kb = AKT.KBs['atwima'];  // Or AKT.kbs['atwima'];   ??
		
		var metadata = kb._metadata;
		
        var project = kb._metadata.projects;
        var file = kb._metadata.file;
        var title = kb._metadata.title;
        var description = kb._metadata.description;
        var author = kb._metadata.author;
        var acknowledgements = kb._metadata.acknowledgements;
        var associated_documentation = kb._metadata.associated_documentation;
        var study_area = kb._metadata.study_area;
        var methods = kb._metadata.methods;
        var timing = kb._metadata.timing;
*/
        var project = 'Tutorial 2';
        var title = 'Bandy et al slash-and-burn paper';
        var description = 'This knowledge base is based on Bandy et al (1993) paper on "The worldwide problem of slash-and-burn agriculture"';
        var author = 'Bandy, D.E., Garrity, D.P. and Sanchez, P.A.';
        var acknowledgements = '';
        var associated_documentation = '';
        var study_area = 'Global';
        var methods = 'Literature review';
        var timing = '1993';
		
        $(widget.element).find('.textarea_project').val(project);
        $(widget.element).find('.textarea_title').val(title);
        $(widget.element).find('.textarea_description').val(description);
        $(widget.element).find('.textarea_author').val(author);
        $(widget.element).find('.textarea_acknowledgements').val(acknowledgements);
        $(widget.element).find('.textarea_associated_documentation').val(associated_documentation);
        $(widget.element).find('.textarea_study_area').val(study_area);
        $(widget.element).find('.textarea_methods').val(methods);
        $(widget.element).find('.textarea_timing').val(timing);
	});




    $(widget.element).find('.button_update').on('click', function (event) {      // Update button
        console.log('Update button in metadata.js');
        event.stopPropagation();
        var kbId = AKT.state.current_kb;
        var kb = AKT.KBs[kbId];

        // Put current form text fields into working variables.
        var project = $(widget.element).find('.textarea_project').val();
        var file = $(widget.element).find('.textarea_file').val();
        var title = $(widget.element).find('.textarea_title').val();
        var description = $(widget.element).find('.textarea_description').val();
        var author = $(widget.element).find('.textarea_author').val();
        var acknowledgements = $(widget.element).find('.textarea_acknowledgements').val();
        var associated_documentation = $(widget.element).find('.textarea_associated_documentation').val();
        var study_area = $(widget.element).find('.textarea_study_area').val();
        var methods = $(widget.element).find('.textarea_methods').val();
        var timing = $(widget.element).find('.textarea_timing').val();

        // Use these variables to update the kb._metadata properties...
        kb._metadata.project = project;
        kb._metadata.file = file;
        kb._metadata.title = title;
        kb._metadata.description = description;
        kb._metadata.author = author;
        kb._metadata.acknowledgements = acknowledgements;
        kb._metadata.associated_documentation = associated_documentation;
        kb._metadata.study_area = study_area;
        kb._metadata.methods = methods;
        kb._metadata.timing = timing;

        // ... and to store the same information in the event record for this event.
        // Note that it is easy to see in this particular case how we could compact 
        // this down with a loop, but I am leaving it like this since this may
        // not in general be true (the value entry might be different from the find
        // entry; the type of field may not be textarea).
        // Note also that the correct processing of this, record by record, is done
        // in AKT.playRecording(). Look at that to see how it works.

        AKT.recordEvent({
            event:'click',
            element:widget.element,
            finds:['.button_update'],
            values:[
                {value:project,        find:'.textarea_project',     type:'textarea'}, 
                {value:file,           find:'.textarea_file',        type:'textarea'}, 
                {value:title,          find:'.textarea_title',       type:'textarea'}, 
                {value:description,    find:'.textarea_description', type:'textarea'}, 
                {value:author,         find:'.textarea_author',      type:'textarea'}, 
                {value:acknowledgements, find:'.textarea_acknowledgements', type:'textarea'}, 
                {value:associated_documentation, find:'.textarea_associated_documentation', type:'textarea'}, 
                {value:study_area,     find:'.textarea_study_area',  type:'textarea'}, 
                {value:methods,        find:'.textarea_methods',     type:'textarea'}, 
                {value:timing,         find:'.textarea_timing',      type:'textarea'}
            ],
            message:'Clicked on .button_update in metadata.js.'
        });

        $('#message').html('Metadata has been updated');

		AKT.saveKbInLocalStorage(kbId);
    });
};

AKT.widgets.metadata.settings = {width:'400px',height:'400px'};


AKT.widgets.metadata.display = function (widget) {
    var kbId = AKT.state.current_kb;
    var kb = AKT.KBs[kbId];

    var widgetContent = $(widget.element).find('.content');

    $(widgetContent).find('.textarea_project').val(kb._metadata.project);
    $(widgetContent).find('.textarea_file').val(kb._metadata.file);
    $(widgetContent).find('.textarea_title').val(kb._metadata.title);
    $(widgetContent).find('.textarea_description').val(kb._metadata.description);
    $(widgetContent).find('.textarea_author').val(kb._metadata.author);
    $(widgetContent).find('.textarea_acknowledgements').val(kb._metadata.acknowledgements);
    $(widgetContent).find('.textarea_associated_documentation').val(kb._metadata.associated_documentation);
    $(widgetContent).find('.textarea_study_area').val(kb._metadata.study_area);
    $(widgetContent).find('.textarea_methods').val(kb._metadata.methods);
    $(widgetContent).find('.textarea_timing').val(kb._metadata.timing);

    // Event Handlers

    // Not actually in use - can't see much point in having it here, when you can
    // get it from KB > Topic Hierarchies (? or Topics ?)
    $('#metadata101').on('click', function (event) {      // Topics button
        event.stopPropagation();
        $('#dialog_TopicHierarchies').dialog_TopicHierarchies();
    });
};



AKT.widgets.metadata.html = `
        <div class="content" style="background:inherit; height:auto; padding:12px;border:none;">

            <div class="w3-row w3-border">
                <div class="w3-container w3-half" style="padding:2px;">
                    <legend style="line-height:14px;">Project name</legend>
                    <textarea class="textarea_project" style="resize:vertical;overflow:hidden; width:100%; height:22px;">Freddy</textarea>
                </div>
                <div class="w3-container w3-half" style="padding:2px;">
                    <legend style="line-height:14px;">File name</legend>
                    <textarea class="textarea_file" disabled style="resize:vertical;overflow:hidden; width:100%; height:22px; color:#808080;"></textarea>
                </div>
            </div>

            <div style="padding:2px;width:100%;">
                <legend style="line-height:14px;">Title of the knowledge base</legend>
                <textarea class="textarea_title" style="resize:vertical;width:100%;height:35px;"></textarea>
            </div>

            <div style="padding:2px;width:100%;">
                <legend style="line-height:14px;">Description</legend>
                <textarea class="textarea_description" style="resize:vertical;width:100%;height:60px;"></textarea>
            </div>

            <div class="w3-row w3-border">
                <div class="w3-container w3-half" style="padding:2px;">
                    <legend style="line-height:14px;">Author of knowledge base</legend>
                    <textarea class="textarea_author" style="resize:vertical;width:100%;height:40px;"></textarea>
                </div>

                <div class="w3-container w3-half" style="padding:2px;">
                    <legend style="line-height:14px;">Acknowledgements</legend>
                    <textarea class="textarea_acknowledgements" style="resize:vertical;width:100%;height:40px;"></textarea>
                </div>
            </div>

            <div class="w3-row w3-border">
                <div class="w3-container w3-half" style="padding:2px;">
                    <legend style="line-height:14px;">Associated Documentation</legend>
                    <textarea class="textarea_associated_documentation" style="resize:vertical;width:100%;height:35px;"></textarea>
                </div>

                <div class="w3-container w3-half" style="padding:2px;">
                    <legend style="line-height:14px;">Study Area</legend>
                    <textarea class="textarea_study_area" style="resize:vertical;width:100%;height:35px;"></textarea>
                </div>
            </div>

            <div class="w3-row w3-border">
                <div class="w3-container w3-half" style="padding:2px;">
                    <legend style="line-height:14px;">Methods</legend>
                    <textarea class="textarea_methods" style="resize:vertical;width:100%;height:35px;"></textarea>
                </div>

                <div class="w3-container w3-half" style="padding:2px;">
                    <legend style="line-height:14px;">Timing</legend>
                    <textarea class="textarea_timing" style="resize:vertical;width:100%;height:20px;"></textarea>
                </div>
            </div>

            <button id="metadata100" style="display:none;float:right;width:80px;height:40px;">Pictures<br/>Diagrams</button>
            <button id="metadata101" style="display:none;float:right;width:80px;height:40px;">Topics</button>
            <button id="metadata102" style="display:none;width:80px;height:40px;">Knowledge categories</button>

            <button class="button_update inwidget_recording" style="float:right;width:60px;height:22px;">Update</button>
            <button class="button_wizard inwidget_recording" style="float:right;width:60px;height:22px;">Wizard</button>

        </div>     <!-- End of content div -->
        `;
