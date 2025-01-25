(function ($) {

  /***********************************************************
   *         sources_table widget
   ***********************************************************
   */
    $.widget('akt.sources_table', {
        meta:{
            short_description: 'sources_table',
            long_description: 'sources_table',
            author: 'Robert Muetzelfeldt',
            last_modified: 'May 2021',
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

        widgetEventPrefix: 'sources_table:',

        _create: function () {
            console.debug('\n### Creating instance of widget "akt.sources_table".',
                '\nElement ID:',this.element[0].id,'  Widget UUID:',this.uuid,'  Options:',this.options);
            var self = this;
            this.element.addClass('sources_table-1');

            var kb = self.options.kb;
            var results = evaluate(kb);
            display(self, results);

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('sources_table-1');
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
        console.debug('Starting akt.sources_table: evaluate()...');
        return null;
    }


    function display(widget, results) {
        console.debug('Starting akt.sources_table: display()');
        console.debug(results);
        var kb = widget.options.kb;

        if (widget.options.show_titlebar) {
            var widgetTitlebar = $('<div class="titlebar">topic_summary<input type="button" value="X" class="dialog_close_button"/></div>');  
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
        var table = $('<table></table>');
        $(content).append(table);
        var sourceDetails = AKT.kbs[kb].source_details;
        $.each(sourceDetails, function(i,sourceDetail) {
            var row = $('<tr></tr>');
            $(table).append(row);
            $(row).append('<td>'+sourceDetail.source+'</td>');
            $(row).append('<td>'+sourceDetail.method+'</td>');
            $(row).append('<td>'+sourceDetail.interviewer+'</td>');
            $(row).append('<td>'+sourceDetail.interviewee+'</td>');
            $(row).append('<td>'+sourceDetail.sex+'</td>');
            $(row).append('<td>'+sourceDetail.date+'</td>');
            $(row).append('<td>'+sourceDetail.extra+'</td>');
        });
        $(widgetContent).append(content);
    }
/*
{
    source:"source('Adam, Y.','Gogoikrom',2000,a)", 
    method:"interview", 
    interviewer:"'Agbo,'('R.','Frost,','W.','Moss,','C.')", 
    interviewee:"'Yakubu'('Adam,','32,','Gogoikrom')", 
    sex:"M", 
    date:"date(23,jun,2000)", 
    extra:"['<35','Northern','','']"
},
*/

})(jQuery);
