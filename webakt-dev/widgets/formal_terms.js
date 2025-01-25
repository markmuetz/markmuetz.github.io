(function ($) {

  /***********************************************************
   *         formal_terms widget
   ***********************************************************
   */
    $.widget('akt.formal_terms', {
        meta:{
            short_description: 'Finds and display all fromal terms',
            long_description: 'Finds and displays all formal terms, i.e. each and every term used in a statement',
            author: 'Robert Muetzelfeldt',
            last_modified: 'February 2021',
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

        widgetEventPrefix: 'formal_terms:',

        _create: function () {
            console.debug('\n========================================\nStarting formal_terms...');
            console.debug(this.element);
            var self = this;
            this.element.addClass('formal_terms-1');

            var kb = self.options.kb;
            var results = evaluate(kb);
            display(self, results);

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('formal_terms-1');
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
        var sentences = AKT.kbs[kb].sentences;
        var formalTerms = {};
        $.each(sentences, function(i, sentence) {
            processNestedList(sentence.nested_list,formalTerms);
        });
        console.debug(formalTerms);
        return formalTerms;
    }

    function processedNestedList(list,terms) {
        for (var i=0; i<list.length; i++) {
            if (typeof(item) === 'string') {
                var item = list[i];
                terms[item] = true;
            } else {
                processNestedList(item,terms);
            }
        }
        return terms;
    }


        }
            
    function display(widget, results) {
        var widgetContent = $('<b class="inline_content">'+results+'</b>');
        $(widget.element).append(widgetContent);
    }

})(jQuery);
