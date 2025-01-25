(function ($) {

  /***********************************************************
   *         display_tree_text widget
   ***********************************************************
   */
    $.widget('akt.display_tree_text', {
        meta:{
            short_description: 'Displays a hierarchy as a collapsible tree',
            long_description: 'Displays a hierarchy as a collapsible tree.',
            author: 'Robert Muetzelfeldt',
            last_modified: 'August 2021',
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

        widgetEventPrefix: 'display_tree_text:',

        _create: function () {
            console.debug('\n========================================\nStarting display_tree_text...');
            console.debug(this.element);
            var self = this;
            this.element.addClass('display_tree_text-1');

            var kb = self.options.kb;
            var results = evaluate(kb);
            display(self, results);

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('display_tree_text-1');
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
        var counts = {all:0, attribute:0, causal:0, comparison:0, link:0};
        var countsIf = {all:0, attribute:0, causal:0, comparison:0, link:0};
        var sentences = AKT.kbs[kb].sentences;
        $.each(sentences, function(i, sentence) {
            counts['all'] += 1;
            counts[sentence.type] += 1;
            //if (sentence.formal.statement.includes(')if ')) {
            if (sentence.formal.includes(')if ')) {
                countsIf['all'] += 1;
                countsIf[sentence.type] += 1;
            }
        });
        return {sentences:counts, conditionals:countsIf};
    }


    function display(widget, results) {
        var counts = results.sentences;
        var countsIf = results.conditionals;
        var kb = widget.options.kb;

        if (widget.options.show_titlebar) {
            var widgetTitlebar = $('<div class="titlebar">display_tree_text<input type="button" value="X" class="dialog_close_button"/></div>');  
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

        var heading = $('<div class="tool_results_heading">Number of statements of each type used in the '+kb+
            ' knowledge base</div>');
        var table = $('<table></table>');
        $(table).append('<tr><td>TYPE</td><td>Number of statements</td><td>Conditions attached</td></tr>');
        var types = ['all', 'attribute', 'causal', 'comparison', 'link'];
        $.each(types, function(i, type) {
            $(table).append('<tr><td>'+type+'</td><td>'+counts[type]+'</td><td>'+countsIf[type]+'</td></tr>');
        });
        $(widgetContent).append(heading).append(table);
    }

})(jQuery);
