(function ($) {

  /***********************************************************
   *         dialog_Metadata widget
   ***********************************************************
   */
    $.widget('akt.dialog_Metadata', {
        meta:{
            short_description: 'dialog_Metadata',
            long_description: 'dialog_Metadata',
            author: 'Robert Muetzelfeldt',
            last_modified: 'July 2021',
            visible: false,
            options: {
            }
        },

        options: {
            kb:null,
            show_titlebar:true
        },

        reprocess: function(options) {
            console.debug('dialog_Metadata - reprocess(kb)',options);
            var results = evaluate(this, options);
            display(this, options, results);
            return results;
        },

        widgetEventPrefix: 'dialog_Metadata:',

        _create: function () {
            console.debug('\n### Creating instance of widget "akt.dialog_Metadata".',
                '\nElement ID:',this.element[0].id,'  Widget UUID:',this.uuid,'  Options:',this.options);
            var self = this;
            this.element.addClass('dialog_Metadata-1');

            createEmptyWidget(self);

            var results = evaluate(self, self.options);
            display(self, self.options, results);

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('dialog_Metadata-1');
            this.element.empty();
            this._super();
        },
        _setOption: function (key, value) {
            var self = this;
            var prev = this.options[key];
            if (key === 'visible' && value) {
                $(self.element).css({display:'block'});
                display(self, self.options, null);   // TODO: check this
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


    function createEmptyWidget(widget) {
    }

    function evaluate(widget, options) {
        console.debug('Starting akt.dialog_Metadata: evaluate()...');
        var results = null;
        return results;
    }


    function display(widget, options, results) {
        console.debug('\nStarting akt.dialog_Metadata: display()');
        console.debug(results);
        var kbId = options.kbId;
        var kb = AKT.kbs[kbId];
        console.debug(kbId,kb);

        $(widget.element).empty();

        if (widget.options.show_titlebar) {
            var widgetTitlebar = $(
                '<div class="title-bar">'+
                    '<div>Knowledge base metadata</div>'+
                    '<input type="button" value="X" class="dialog_close_button"/>'+
                '</div>');
            $(widget.element).append(widgetTitlebar);
            $('.dialog_close_button').on('click', function () {
                var id = $(this).parent().parent()[0].id;
                $('#'+id).css({display:"none"});
            });
        }

        var widgetSettings
        // SETUP
        var widgetContent = $(baseHtml());
        $(widget.element).append(widgetContent);

        var kbSelector = AKT.makeKbSelector(widget);
        $(widgetContent).prepend(kbSelector);

        //$('#metadata800').text(kb.meta.title);
        $(widgetContent).find('.title').text(kb.meta.title);
        $(widgetContent).find('.description').text(kb.meta.description);
        $(widgetContent).find('.author').text(kb.meta.author);
        $(widgetContent).find('.acknowledgements').text(kb.meta.acknowledgements);
        $(widgetContent).find('.associated_documentation').text(kb.meta.associated_documentation);
        $(widgetContent).find('.study_area').text(kb.meta.study_area);
        $(widgetContent).find('.methods').text(kb.meta.methods);
        $(widgetContent).find('.timing').text(kb.meta.timing);

        $(widget.element).css({display:'block'});
        $(widget.element).draggable();

        // Event Handlers
        $('#metadata101').on('click', function (event) {      // Topics button
            event.stopPropagation();
            console.debug('BUTTON: Clicked on metadata Topics button');
            $('#dialog_TopicHierarchies').dialog_TopicHierarchies();
            //AKT.dialogOpener.topicHierarchies(AKT.state.current_kb);
            //AKT.showDialog('topicHierarchies');
        });

    }


    function baseHtml() {
    return `
        <div class="content" style="padding:12px;border:none;">

            <fieldset style="display:inline-block;">
                <legend>Title of the knowledge base</legend>
                <textarea id="metadata800" class="title" style="width:490px;height:35px;"></textarea>
            </fieldset>

            <fieldset style="display:inline-block;">
                <legend>What is the knowledge base about</legend>
                <textarea id="metadata801" class="description" style="width:490px;height:80px;"></textarea>
            </fieldset>

            <fieldset style="display:inline-block; float:left;">
                <legend>Author of knowledge base</legend>
                <textarea id="metadata802" class="author" style="width:230px;height:35px;"></textarea>
            </fieldset>

            <fieldset style="display:inline-block; float:left;">
                <legend>Acknowledgements</legend>
                <textarea id="metadata803" class="acknowledgements" style="width:230px;height:35px;"></textarea>
            </fieldset>

            <fieldset style="display:inline-block; float:left;">
                <legend>Associated Documentation</legend>
                <textarea id="metadata804" class="associated_documentation" style="width:230px;height:35px;"></textarea>
            </fieldset>

            <fieldset style="display:inline-block; float:left;">
                <legend>Study Area</legend>
                <textarea id="metadata805" class="study_area" style="width:230px;height:35px;"></textarea>
            </fieldset>

            <fieldset style="display:inline-block; float:left;">
                <legend>Methods</legend>
                <textarea id="metadata806" class="methods" style="width:230px;height:35px;"></textarea>
            </fieldset>

            <fieldset style="display:inline-block; float:left;">
                <legend>Timing</legend>
                <textarea id="metadata807" class="timing" style="width:230px;height:20px;"></textarea>
            </fieldset>

            <button id="metadata100" style="display:none;width:80px;height:40px;">Pictures<br/>Diagrams</button>

            <button id="metadata101" style="float:right;width:80px;height:40px;">Topics</button>

            <button id="metadata102" style="display:none;width:80px;height:40px;">Knowledge categories</button>

            <button id="metadata103" style="float:right;width:80px;height:40px;">Save</button>

            <div style="clear:both;"></div>

        </div>     <!-- End of content div -->
        `;
    }

})(jQuery);
