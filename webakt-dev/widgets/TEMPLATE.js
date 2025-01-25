(function ($) {

  /***********************************************************
   *         TEMPLATE widget
   ***********************************************************
   */
    $.widget('akt.TEMPLATE', {
        meta:{
            short_description: 'TEMPLATE',
            long_description: 'TEMPLATE',
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

        widgetEventPrefix: 'TEMPLATE:',

        _create: function () {
            console.debug('\n### Creating instance of widget "akt.TEMPLATE".',
                '\nElement ID:',this.element[0].id,'  Widget UUID:',this.uuid,'  Options:',this.options);
            var self = this;
            this.element.addClass('TEMPLATE-1');

            var kb = self.options.kb;
            var results = evaluate(kb);
            display(self, results);

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('TEMPLATE-1');
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
        console.debug('Starting akt.TEMPLATE: evaluate()...');
        var results = null;
        return results;
    }


    function display(widget, results) {
        console.debug('Starting akt.TEMPLATE: display()');
        console.debug(results);
        var kb = AKT.state.current_kb;

        if (widget.options.show_titlebar) {
            var widgetTitlebar = $('<div class="titlebar">TEMPLATE<input type="button" value="X" class="dialog_close_button"/></div>');  
            $(widget.element).append(widgetTitlebar);
            $('.dialog_close_button').css({background:'yellow'});
            $('.dialog_close_button').on('click', function () {
                var id = $(this).parent().parent()[0].id;
                $('#'+id).css({display:"none"});
            });
        }
        var widgetContent = $('<div class="content" style="overflow:auto; padding:10px; padding-bottom:0px; top:0px; width:400px; height:500;"></div>');
        $(widgetContent).resizable();
        $(widget.element).append(widgetContent);

        var displayHeading = $('<h3 class="widget_display_heading">Tabular display of all information about sources in the '+kb+' knowledge base</h3>');
        $(widgetContent).append(displayHeading);
        var content = $('<div></div>');
        $(widgetContent).append(content);
    }

})(jQuery);
