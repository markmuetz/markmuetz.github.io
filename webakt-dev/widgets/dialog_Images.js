(function ($) {

  /***********************************************************
   *         dialog_Images widget
   ***********************************************************
    This is a brand new dialog window.    AKT5 does have a 
    Memos command in the KB menu, but this requires the use to select
    the categorry that the memo is for (e.g. source); and it does not give
    the user the option of seeing the instance that the memo is for.
    In contrast, this makes teh category into a <select> listbox in the
    window (so you can easiy switch between caegories); and links to 
    the relevant instance.

    Personally, I can't see why this should be here at all.   Surely the entry
    point for a memo should be the instance (source, statememnt...) that the memo
    is for, notthe memo itself.   But argaably the KB menu's main job is to
    allow inspection of the underlying KB file, and memos is a top-level
    section in the file, so I guess that justifies it to some extent.
   */
    $.widget('akt.dialog_Images', {
        meta:{
            short_description: 'dialog_Images',
            long_description: 'dialog_Images',
            author: 'Robert Muetzelfeldt',
            last_modified: 'August 2021',
            visible: false,
            options: {
            }
        },

        options: {
            kbId: null,
            category: 'source',
            show_titlebar: true
        },

        widgetEventPrefix: 'dialog_Images:',

        _create: function () {
            console.debug('\n### Creating instance of widget "akt.dialog_Images".',
                '\nElement ID:',this.element[0].id,'  Widget UUID:',this.uuid,'  Options:',this.options);
            var self = this;
            this.element.addClass('dialog_Images-1');

            createEmptyWidget(self);

            var results = evaluate(self, self.options);
            display(self.element, self.options, results);

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('dialog_Images-1');
            this.element.empty();
            this._super();
        },
        _setOption: function (key, value) {
            var self = this;
            var prev = this.options[key];
            if (key === 'visible' && value) {
                $(self.element).css({display:'block'});
                display(self, null);   // TODO: check this
            } else {
                self.options[key] = value;
                display(self.element, self.options, null);
            }
            var fnMap = {
            };

            // base
            this._super(key, value);

            if (key in fnMap) {
                fnMap[key]();

                // Fire event
                this._triggerOptionChanged(key, prev, value);
            }
        },

        _triggerOptionChanged: function (optionKey, previousValue, currentValue) {
            this._trigger('setOption', {type: 'setOption'}, {
                option: optionKey,
                previous: previousValue,
                current: currentValue
            });
        }
    });

    // ================================= Functions

    function createEmptyWidget(widget) {

        if (widget.options.show_titlebar) {
            var widgetTitlebar = $(
                '<div class="title-bar">'+
                    '<div>dialog_Images</div>'+
                    '<input type="button" value="X" class="dialog_close_button"/>'+
                '</div>');
            $(widget.element).append(widgetTitlebar);
            $('.dialog_close_button').on('click', function () {
                var id = $(this).parent().parent()[0].id;
                $('#'+id).css({display:"none"});
            });
        }

        var widgetSettings = $('<div></div>');
        $(widget.element).append(widgetSettings);

        var kbSelectElement = AKT.makeReprocessSelector(widget.element, widget.widgetName,
            'Knowledge base', AKT.getKbIds(), AKT.state.current_kb, 'kbId');
        $(widgetSettings).append(kbSelectElement);

        var widgetContent = $(baseHtml());
        $(widget.element).append(widgetContent);

        $(widget.element).css({display:'block'});
        $(widget.element).draggable();
    }


    function evaluate(widget, options) {
        console.debug('Starting akt.dialog_Images: evaluate()...');
        var results = null;
        return results;
    }


    function display(widgetElement, widgetOptions, results) {

        var widgetContent = $(widgetElement).find('.content');

        var imageIdArray = AKT.getImageIds(widgetOptions.kbId,widgetOptions.category);
        console.debug(imageIdArray);
        AKT.loadOptions(widgetContent, 'select_images', imageIdArray);


        // EVENT HANDLERS
        $(widgetContent).find('.select_images').on('change', function (event, value) {
            var kbId = $(widgetElement).dialog_Images('instance').options.kbId;
            console.debug($(this).val());
            var imageUrl = AKT.getImage(kbId, $(this).val());
            $(widgetContent).find('.img_image').attr('src',imageUrl);
            //$(widgetContent).find('.img_image').attr('src','file:///home/robert/Projects/AKT/webakt/dev/images/Bakweri_cocoyam_farmer_from_Cameroon.jpg');
        });


        $(widgetElement).draggable({containment:'#workspace',handle:".titlebar"});
        $(widgetElement).css({display:'block'});

    }


    // Ids should be removed.  User $(widgetContent).find(CLASS); instead.  Left in just now so elements can be 
    // matched up with event handlers.
    function baseHtml() {
    return `
<div class="content" style="padding:12px;border:none;">
    <fieldset style="float:left; margin-bottom:10px;">
        <legend>Images</legend>
        <select id="topicGeneral400" class="select_images" size=10 style="width:250px; background:white"></select>
    </fieldset>

    <div style="float:left;margin-top:20px;margin-left:40px;">
        <button id="topicGeneral100" class="button_details" style="width:85px;height:40px;">Details/Edit</button><br/>
        <button id="topicGeneral101" class="button_new" style="width:85px;height:40px;margin-top:15px;">New</button><br/>
        <button id="topicGeneral102" class="button_delete" style="width:85px;height:40px;margin-top:15px;">Delete</button><br/>
        <div style="clear:both;"></div>
    </div>

    <div style="clear:both;"></div>

    <img class="img_image" style="width:400px;max-height:250px;"></img>
        `;
    }

})(jQuery);
