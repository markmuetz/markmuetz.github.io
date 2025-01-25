(function ($) {

  /***********************************************************
   *         dialog_metadata widget
   ***********************************************************
   */
    $.widget('akt.dialog_metadata', {
        meta:{
            short_description: 'dialog_metadata',
            long_description: 'dialog_metadata',
            author: 'Robert Muetzelfeldt',
            last_modified: 'July 2021',
            visible: true,
            options: {
            }
        },

        options: {
            kb:null,
            show_titlebar:true
        },

        evaluate: function(kb) {
            var results = evaluate(kb);
            display(this, results);
            return results;
        },

        widgetEventPrefix: 'dialog_metadata:',

        _create: function () {
            console.debug('\n### Creating instance of widget "akt.dialog_metadata".',
                '\nElement ID:',this.element[0].id,'  Widget UUID:',this.uuid,'  Options:',this.options);
            var self = this;
            this.element.addClass('dialog_metadata-1');

            var kb = self.options.kb;
            var results = evaluate(kb);
            display(self, results);

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('dialog_metadata-1');
            this.element.empty();
            this._super();
        },
        _setOption: function (key, value) {
            var self = this;
            var prev = this.options[key];
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

    function evaluate(kbId) {
        console.debug('Starting akt.dialog_metadata: evaluate()...');
        var results = null;
        return results;
    }


    function display(widget, results) {
        console.debug('Starting akt.dialog_metadata: display()');
        console.debug(results);
        var kbId = AKT.state.current_kb;
        var kb = AKT.kbs[kbId];

        if (widget.options.show_titlebar) {
            var widgetTitlebar = $(AKT.titlebar);  
            $(widget.element).append(widgetTitlebar);
            $('.dialog_close_button').on('click', function () {
                var id = $(this).parent().parent()[0].id;
                $('#'+id).css({display:"none"});
            });
        }
        var widgetContent = $(`
        <div class="content" style="padding:12px;border:none;">

            <fieldset style="display:inline-block;">
                <legend>Title of the knowledge base</legend>
                <textarea id="metadata800" style="width:490px;height:35px;"></textarea>
            </fieldset>

            <fieldset style="display:inline-block;">
                <legend>What is the knowledge base about</legend>
                <textarea id="metadata801" style="width:490px;height:80px;"></textarea>
            </fieldset>

            <fieldset style="display:inline-block; float:left;">
                <legend>Author of knowledge base</legend>
                <textarea id="metadata802" style="width:230px;height:35px;"></textarea>
            </fieldset>

            <fieldset style="display:inline-block; float:left;">
                <legend>Acknowledgements</legend>
                <textarea id="metadata803" style="width:230px;height:35px;"></textarea>
            </fieldset>

            <fieldset style="display:inline-block; float:left;">
                <legend>Associated Documentation</legend>
                <textarea id="metadata804" style="width:230px;height:35px;"></textarea>
            </fieldset>

            <fieldset style="display:inline-block; float:left;">
                <legend>Study Area</legend>
                <textarea id="metadata805" style="width:230px;height:35px;"></textarea>
            </fieldset>

            <fieldset style="display:inline-block; float:left;">
                <legend>Methods</legend>
                <textarea id="metadata806" style="width:230px;height:35px;"></textarea>
            </fieldset>

            <fieldset style="display:inline-block; float:left;">
                <legend>Timing</legend>
                <textarea id="metadata807" style="width:230px;height:20px;"></textarea>
            </fieldset>

            <button id="metadata100" style="display:none;width:80px;height:40px;">Pictures<br/>Diagrams</button>

            <button id="metadata101" style="float:right;width:80px;height:40px;">Topics</button>

            <button id="metadata102" style="display:none;width:80px;height:40px;">Knowledge categories</button>

            <button id="metadata103" style="float:right;width:80px;height:40px;">Save</button>

            <div style="clear:both;"></div>

        </div>     <!-- End of content div -->
        `);
        $(widget.element).append(widgetContent);
        $('#metadata800').text(kb.meta.title);
        $('#metadata801').text(kb.meta.description);
        $('#metadata802').text(kb.meta.author);
        $('#metadata803').text(kb.meta.acknowledgements);
        $('#metadata804').text(kb.meta.associated_documentation);
        $('#metadata805').text(kb.meta.study_area);
        $('#metadata806').text(kb.meta.methods);
        $('#metadatao807').text(kb.meta.timing);
        $(widget.element).css({display:'block'});
    }

})(jQuery);
