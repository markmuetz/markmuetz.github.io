(function ($) {

  /***********************************************************
   *         number_of_statements widget
   ***********************************************************
   */
    $.widget('akt.number_of_statements', {
        meta:{
            short_description: 'Total number of statements',
            long_description: 'Produces a single integer value, for the number of statements in the knowledge base',
            author: 'Robert Muetzelfeldt',
            last_modified: 'January 2021',
            visible: true,
            options: {
            }
        },

        options: {
            kb:null
        },

        evaluate: function(kb) {
            var results = evaluate(kb);
            display(this, results);
            return results;
        },

        widgetEventPrefix: 'number_of_statements:',

        _create: function () {
            console.debug('\n### Creating instance of widget "akt.number_of_statements".',
                '\nElement ID:',this.element[0].id,'  Widget UUID:',this.uuid,'  Options:',this.options);
            var self = this;
            this.element.addClass('number_of_statements-1');

            var kb = self.options.kb;
            var results = evaluate(kb);
            display(self, results);

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('number_of_statements-1');
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
        console.debug('Starting akt.number_of_statements: evaluate()');
        return AKT.kbs[kb].sentences.length;
    }


    function display(widget, results) {
        console.debug('Starting akt.number_of_statements: display()');
        var widgetContent = $('<b class="inline_content">'+results+'</b>');
        $(widget.element).append(widgetContent);
    }

})(jQuery);
