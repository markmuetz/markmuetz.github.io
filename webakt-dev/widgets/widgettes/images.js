// Images
// TODO: change 'source' to 'image' wherever 'source' occurs.
// TODO: change HTML element IDs to meaningfully-named classes.

AKT.widgets.images = {};

AKT.widgets.images.settings = {width:'500px',height:'300px'};


AKT.widgets.images.setup = function (widget) {

    var self = this;
    console.log('\nIMAGES setup: ',widget.options);
    var widgetContent = $(widget.element).find('.content');

    var widgetSettings = $('<div></div>');
    $(widget.element).append(widgetSettings);

    var kbSelectElement = AKT.makeReprocessSelector(widget.element, widget.widgetName,
        'Knowledge base', AKT.getKbIds(), AKT.state.current_kb, 'kbId');
    $(widgetContent).prepend(kbSelectElement);


    // BUTTON EVENT HANDLERS
    $(widgetContent).find('.button_new').on('click', function (event) {
        var kbId = widget.options.kbId;
        var kb = AKT.KBs[kbId];
        console.log('BUTTON: Clicked on image New button');
        event.stopPropagation();

        var panel = new Panel('dialog_Generic', 
            event.shiftKey, 
            {left:'400px',top:'20px',width:'470px',height:'440px'}, 
            {widget_name:'image_details', kbId:kbId, mode:'new'});   
       
    });


    $(widgetContent).find('.button_view').on('click', function (event) {
        console.debug(widget.options);
        var kbId = widget.options.kbId;
        var kb = AKT.KBs[kbId];
        console.debug('BUTTON: Clicked on image Details button');
        event.stopPropagation();

        //var id = $(widgetContent).find('.select_images').val();
        var id = widget.options.current_id;
        if (!id) {
            alert('Please first select an image.');
            return;
        }
        console.debug('image ID:',id);
        var image = kb._images[id];   // The object, not the image itself.
        if (!image._id) {  // TODO. Fix this hack - no sure why it's not done in new Image().
            image._id = id;
        }

        var panel = new Panel('dialog_Generic', 
            event.shiftKey, 
            {left:'400px',top:'20px',width:'500px',height:'440px'}, 
            {widget_name:'image_details', kbId:kbId, mode:'view', image_id:id, image:image});
           });


    $(widgetContent).find('.button_edit').on('click', function (event) {
        console.debug(widget.options);
        var kbId = widget.options.kbId;
        var kb = AKT.KBs[kbId];
        console.debug('BUTTON: Clicked on image Details button');
        event.stopPropagation();

        //var id = $(widgetContent).find('.select_images').val();
        var id = widget.options.current_id;
        console.debug(id);
        var image = kb._images[id];   // The object, not the image itself.
        console.debug(id);

        var panel = new Panel('dialog_Generic', 
            event.shiftKey, 
            {left:'400px',top:'20px',width:'500px',height:'440px'}, 
            {widget_name:'image_details', kbId:kbId, mode:'edit', image:image});
       
        //$('#dialog_SourceDetails').dialog_SourceDetails();
    });


    $(document).on('image_changed_event', function(event,args) {
        self.display(widget);
    });

};


AKT.widgets.images.display = function (widget) {
    console.log('\nIMAGES display: ',widget.options);

    var filters = widget.options.filters;
    if (filters && filters.formal_term) {
        var formaltermId = filters.formal_term_value;
    }
    var kbId = widget.options.kbId;
    var kb = AKT.KBs[kbId];

    var widgetContent = $(widget.element).find('.content');

    var images = kb.findImages();
    var nImages = Object.keys(images).length;

    //AKT.loadSelectOptions(widgetContent, 'select_images', images, ['id','id']);



    $(widget.element).draggable({containment:'#workspace',handle:".titlebar"});
    $(widget.element).css({display:'block'});

    for (var id in kb._images) {
        console.log(formaltermId,id);
        //if (formaltermId === 'akata' && (id==='ciat1026' || id==='ciat1027')) {
            var image = kb._images[id];
            var caption = image._caption
            var divImage = $('<div class="div_image" data-id="'+id+'" style="float:left; border:solid 4px #d0d0d0;margin:1px;" title="'+caption+'"></div>');
            var imgImage = $('<img class="img_image" crossorigin="anonymous" style="width:150px; height:150px;border:solid 1px black"></img>');
            var divId = $('<div style=width:150px;height:14px;>'+id+'</div>');
            var divLabel = $('<div style=width:150px;height:48px;line-height:12px;>'+caption.substr(0,65)+'...</div>');
            $(divImage).append(imgImage).append(divId).append(divLabel);
            $(widget.element).find('.div_images').append(divImage);
            //var url = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR33JS988Kp1SL184AFRpm1uVCV7p2s4d1zew&usqp=CAU';
            //var url ='https://live.staticflickr.com/65535/51133666863_4fce15b5aa_z.jpg';
            var url = image._url;
            $(imgImage).attr('src',url);

            $(divImage).on('click', function (event) {
                console.log(this);
                console.log($(this)[0]);
                console.log($(this)[0].dataset);
                console.log($(this)[0].dataset.id);
                console.log($(this).data('id'));
                var imageId = $(this).data('id');
                event.stopPropagation();
                $(widget.element).find('.div_image').css({border:'solid 4px #d0d0d0'});
                $(this).css({border:'solid 4px blue'});
                widget.options.current_id = imageId;
                console.log(widget.options);
                AKT.trigger('item_selected_event',{
				    item_type:'image',
				    item_id:imageId
                });
                //widget._destroy();
            });
        //}
    }

};


AKT.widgets.images.html = `
<div class="content" style="padding:6px;border:none;">

    <div style="margin-top:7px;margin-left:0x;">
        <button class="button_new" style="float:left;margin-left:10px;width:60px;height:30px;">New</button>
        <button class="button_view" style="float:left;width:60px;height:30px;">View</button>
        <button class="button_edit" style="float:left;width:60px;height:30px;">Edit</button>
        <button class="button_delete" disabled style="float:right;width:60px;height:30px;">Delete</button>
        <div style="clear:both;"></div>
    </div>


    <div class="div_images" style="width:510px;height:500px; margin-top:10px;border:solid 1px black; overflow-y:auto;"></div>
`;




