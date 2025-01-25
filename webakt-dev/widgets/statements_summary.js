(function ($) {

    if (!AKT.tools) AKT.tools = {};
    AKT.tools.statements_summary = {
        short_description: 'Displays the number of statements of each type',
        long_description: 'Produces a table summarising the number of statements of each type that exist in the knowledge base.  It also shows how many statements of each type have conditions attached to them.',
        author: 'Robert Muetzelfeldt',
        last_modified: 'August 2024'
    };

  /***********************************************************
   *         statements_summary widget
   ***********************************************************
   */
    $.widget('akt.statements_summary', {
        meta:{
            short_description: 'Displays the number of statements of each type',
            long_description: 'Produces a table summarising the number of statements of each type that exist in the knowledge base.  It also shows how many statements of each type have conditions attached to them.',
            author: 'Robert Muetzelfeldt',
            last_modified: 'December 2020',
            visible: true,
            options: {
            }
        },

        options: {
            kb:AKT.state.current_kb,
            show_titlebar:true
       },

        evaluate: function(kb) {
            var results = evaluate(kb);
            display(this, results);
            return results;
        },

        widgetEventPrefix: 'statements_summary:',

        _create: function () {
            console.debug('\n### Creating instance of widget "akt.statements_summary".',
                '\nElement ID:',this.element[0].id,'  Widget UUID:',this.uuid,'  Options:',this.options);
            var self = this;
            this.element.addClass('statements_summary-1');

            console.debug(301, self.options);
            var kb = self.options.kb;
            var results = evaluate(kb);
            display(self, results);

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('statements_summary-1');
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
        console.debug('Starting akt.statements_summary: evaluate()...');

        var kbId = AKT.state.current_kb;
        var counts = {all:0, attribute:0, causal:0, comparison:0, link:0};
        var countsIf = {all:0, attribute:0, causal:0, comparison:0, link:0};
        
        var sentences = AKT.KBs[kbId]._statements;
        console.log(kbId,sentences);
        $.each(sentences, function(i, sentence) {
            counts['all'] += 1;
            counts[sentence.type] += 1;
            if (sentence.formal.includes(' if ')) {
                countsIf['all'] += 1;
                countsIf[sentence.type] += 1;
            }
        });

        var table = [];
        $.each(['all','attribute','causal','comparison','link'], function(i,type) {
            table[i] = [type,counts[type],countsIf[type]];
        });

        return {title:'statements_summary',headers:['TYPE','STATEMENTS','CONDITIONAL'],table:table,options:{}};
    }


    function display(widget, results) {
        console.debug('Starting akt.statements_summary: display()');
        console.debug(results);
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
    }

})(jQuery);
