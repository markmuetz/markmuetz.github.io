(function ($) {

    if (!AKT.tools) AKT.tools = {};
    AKT.tools.statements_count = {
        short_description: 'Displays the number of statements',
        long_description: 'Calculates the number of statements in the knowledge base.',
        author: 'Robert Muetzelfeldt',
        last_modified: 'August 2024'
    };

    $.widget('akt.statements_count', {

        options: {
            kb:AKT.state.current_kb,
            show_titlebar:true
       },

        evaluate: function(kb) {
            var results = evaluate(kb);
            display(this, results);
            return results;
        },

        widgetEventPrefix: 'statements_count:',

        _create: function () {
            var self = this;
            this.element.addClass('statements_summary-1');

            var kb = self.options.kb;
            var results = evaluate(kb);
            display(self, results);

            this._setOptions({
            });
        },
/*
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
*/
    });

    function evaluate(kbId) {
        console.debug('Starting akt.statements_count: evaluate()...');

        var count = 0;
        var statements = AKT.KBs[kbId]._statements;
        for (var id in statements) {
            count += 1;
        }

        return count;
    }


    function display(widget, results) {
        console.debug('Starting akt.statements_summary: display()');

/*
        if (widget.options.show_titlebar) {
            var widgetTitlebar = AKTdisplays.widgetTitlebar(widget, 'statements_summary');
        }
        //var widgetContent = AKTdisplays.statements_summary(results).jqueryObject;
        results.id = 'statements_summary';
        var widgetContent = AKTdisplays.tabulate(results).jqueryObject;
        //console.debug(widgetContent[0].innerHtml);
        $(widget.element).append(widgetContent);
        sorttable.makeSortable($("#statements_summary_table")[0]);

        var displayHeading = $('<h4 class="widget_display_heading">Number of statements of each type in the '+widget.options.kb+' knowledge base</h4>');
        $(widgetContent).prepend('<div contenteditable="true" style="width:100%; background:#e0e0e0;"></div>');
        $(widgetContent).prepend(displayHeading);
        $(widgetContent).append('<div contenteditable="true" style="width:100%; background:#e0e0e0;"></div>');
*/
        var mainDiv = $('<div></div>');
        $(mainDiv).append('<div>Number of statements</div>');
        $(mainDiv).append('<div>'+results+'</div');
        $(widget.element).append(mainDiv);
    }

})(jQuery);
