(function ($) {

  /***********************************************************
   *         knowledge_base_report widget
   ***********************************************************
   */
    $.widget('akt.knowledge_base_report', {
        meta:{
            short_description: 'knowledge_base_report',
            long_description: 'knowledge_base_report',
            author: 'Robert Muetzelfeldt',
            last_modified: 'April 2021',
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

        widgetEventPrefix: 'knowledge_base_report:',

        _create: function () {
            console.debug('\n### Creating instance of widget "akt.knowledge_base_report".',
                '\nElement ID:',this.element[0].id,'  Widget UUID:',this.uuid,'  Options:',this.options);
            var self = this;
            this.element.addClass('knowledge_base_report-1');

            var kb = self.options.kb;
            var results = evaluate(kb);
            display(self, results);

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('knowledge_base_report-1');
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
        console.debug('Starting akt.knowledge_base_report: evaluate()...');
        return;
    }

    // Major issues are surfacing here, in trying to make a tool that depends on other 
    // tools.  For example, separation between logic and display becomes artificial, so
    // following could equally well be put into evaluate.  Or put all evaluates ito
    // evaluate(), then pass all jQuery objects (or HTML...) into display().
    function display(widget, results) {
        console.debug('Starting akt.knowledge_base_report: display()');
        console.debug(results);
        var kbId = widget.options.kb;
        if (widget.options.show_titlebar) {
            var widgetTitlebar = AKTdisplays.widgetTitlebar(widget, 'knowledge_base_report');
        }

        // statements_summary
        var results1 = AKTtools.statements_summary(kbId);
        var widgetContent1 = AKTdisplays.statements_summary(results1).jqueryObject;
        $(widget.element).append(widgetContent1);
        // MUST go here, since must be added to DOM before calling sorttable...
        // Not ideal -try doing by class when all tools have been added to DOM?
        sorttable.makeSortable($("#statements_summary_table")[0]);

    }

})(jQuery);
