(function ($) {

  /***********************************************************
   *         springy widget
   ***********************************************************
   */
    $.widget('akt.springy', {
        meta:{
            short_description: 'Basic force-directed graph layout',
            long_description: 'Basic force-directed graph layout.',
            author: 'Robert Muetzelfeldt',
            last_modified: 'March 2021',
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

        widgetEventPrefix: 'springy:',

        _create: function () {
            console.debug('\n### Creating instance of widget "akt.springy".',
                '\nElement ID:',this.element[0].id,'  Widget UUID:',this.uuid,'  Options:',this.options);
            var self = this;
            this.element.addClass('springy-1');

            console.debug(301, self.options);
            var kb = self.options.kb;
            var results = evaluate(kb);
            display(self, results);

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('springy-1');
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
        console.debug('Starting akt.springy: evaluate()');
        return;
    }


    function display(widget, results) {
        console.debug('Starting akt.springy: display()');
        var kb = widget.options.kb;

        if (widget.options.show_titlebar) {
            var widgetTitlebar = $('<div class="titlebar">springy<input type="button" value="X" class="dialog_close_button"/></div>');  
            $(widget.element).append(widgetTitlebar);
            $('.dialog_close_button').css({background:'yellow'});
            $('.dialog_close_button').on('click', function () {
                var id = $(this).parent().parent()[0].id;
                $('#'+id).css({display:"none"});
            });
        }
        var widgetContent = $('<div id="springy_content" style="width:650px; height:490px;"></div>');
        var canvas = $('<canvas id="springydemo" class="content" width="640" height="480" />');
        $(widgetContent).resizable();
        $(widget.element).append(widgetContent);
        $(widgetContent).append(canvas);

        // =============================== springy!
        var graph = new Springy.Graph();

        var dennis = graph.newNode({
          label: 'Dennis',
          ondoubleclick: function() { console.log("Hello!"); }
        });
        var michael = graph.newNode({label: 'Michael'});
        var jessica = graph.newNode({label: 'Jessica'});
        var timothy = graph.newNode({label: 'Timothy'});
        var barbara = graph.newNode({label: 'Barbara'});
        var franklin = graph.newNode({label: 'Franklin'});
        var monty = graph.newNode({label: 'Monty'});
        var james = graph.newNode({label: 'James'});
        var bianca = graph.newNode({label: 'Bianca'});

        graph.newEdge(dennis, michael, {color: '#00A0B0'});
        graph.newEdge(michael, dennis, {color: '#6A4A3C'});
        graph.newEdge(michael, jessica, {color: '#CC333F'});
        graph.newEdge(jessica, barbara, {color: '#EB6841'});
        graph.newEdge(michael, timothy, {color: '#EDC951'});
        graph.newEdge(franklin, monty, {color: '#7DBE3C'});
        graph.newEdge(dennis, monty, {color: '#000000'});
        graph.newEdge(monty, james, {color: '#00A0B0'});
        graph.newEdge(barbara, timothy, {color: '#6A4A3C'});
        graph.newEdge(dennis, bianca, {color: '#CC333F'});
        graph.newEdge(bianca, monty, {color: '#EB6841'});
        console.debug(graph);
        $('#springydemo').springy({
            graph: graph,
            nodeSelected: function(node){
              console.log('Node selected: ' + JSON.stringify(node.data));
            }
        });


    }

})(jQuery);
