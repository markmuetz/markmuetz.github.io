(function ($) {

  /***********************************************************
   *         user_text widget
   ***********************************************************
   */
    $.widget('akt.user_text', {
        meta:{
            short_description: 'A simple text box',
            long_description: 'A simple text box',
            author: 'Robert Muetzelfeldt',
            last_modified: 'March 2021',
            visible: true,
            options: {
            }
        },

        options: {
            show_titlebar:true
        },

        evaluate: function() {
            var results = evaluate();
            display(this, results);
            return results;
        },

        widgetEventPrefix: 'user_text:',

        _create: function () {
            console.debug('\n### Creating instance of widget "akt.user_text".',
                '\nElement ID:',this.element[0].id,'  Widget UUID:',this.uuid,'  Options:',this.options);
            var self = this;
            this.element.addClass('user_text-1');

            var kb = self.options.kb;
            var results = evaluate(kb);
            display(self, results);

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('user_text-1');
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

    function evaluate(kb) {
        console.debug('Starting akt.user_text: evaluate()');
    }


    function display(widget, results) {
        console.debug('Starting akt.user_text: display()');

        if (widget.options.show_titlebar) {
            var widgetTitlebar = $('<div class="titlebar">user_text<input type="button" value="X" class="dialog_close_button"/></div>');  
            $(widget.element).append(widgetTitlebar);
            $('.dialog_close_button').css({background:'yellow'});
            $('.dialog_close_button').on('click', function () {
                var id = $(this).parent().parent()[0].id;
                $('#'+id).css({display:"none"});
            });
        }
        var widgetContent = $('<div class="content"></div>');
        $(widgetContent).resizable();
        $(widget.element).append(widgetContent);

        var textArea = $('<textarea rows="4" cols="50">Enter text here</textarea>');

        $(widgetContent).append(textArea);
    }

})(jQuery);
