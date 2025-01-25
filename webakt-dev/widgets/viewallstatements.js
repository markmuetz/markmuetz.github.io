(function ($) {

  /***********************************************************
   *         DIALOG_TEMPLATE widget
   ***********************************************************
   */
    $.widget('akt.DIALOG_TEMPLATE', {
        meta:{
            short_description: 'DIALOG_TEMPLATE',
            long_description: 'DIALOG_TEMPLATE',
            author: 'Robert Muetzelfeldt',
            last_modified: 'April 2021',
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

        widgetEventPrefix: 'DIALOG_TEMPLATE:',

        _create: function () {
            console.debug('\n### Creating instance of widget "akt.DIALOG_TEMPLATE".',
                '\nElement ID:',this.element[0].id,'  Widget UUID:',this.uuid,'  Options:',this.options);
            var self = this;
            this.element.addClass('DIALOG_TEMPLATE-1');

            var kb = self.options.kb;
            var results = evaluate(kb);
            display(self, results);

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('DIALOG_TEMPLATE-1');
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
        console.debug('Starting akt.DIALOG_TEMPLATE: evaluate()...');
        var results = null;
        return results;
    }


    function display(widget, results) {
        console.debug('Starting akt.DIALOG_TEMPLATE: display()');
        console.debug(results);
        var kbId = AKT.state.current_kb;
        var kb = AKT.kbs[kbId];

        if (widget.options.show_titlebar) {
            var widgetTitlebar = $('<div class="titlebar">DIALOG_TEMPLATE<input type="button" value="X" class="dialog_close_button"/></div>');  
            $(widget.element).append(widgetTitlebar);
            $('.dialog_close_button').css({background:'yellow'});
            $('.dialog_close_button').on('click', function () {
                var id = $(this).parent().parent()[0].id;
                $('#'+id).css({display:"none"});
            });
        }
        var widgetContent = $(baseHtml());
        $(widget.element).append(widgetContent);

        // SETUP

        // EVENT HANDLERS

        $(widget.element).draggable({containment:'#workspace',handle:".titlebar"});
        $(widget.element).css({display:'block'});
    }


    function baseHtml() {
        return ___HTML___;
    }

})(jQuery);


