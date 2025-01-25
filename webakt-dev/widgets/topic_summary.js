(function ($) {

  /***********************************************************
   *         topic_summary widget
   ***********************************************************
   */
    $.widget('akt.topic_summary', {
        meta:{
            short_description: 'Displays a hierarchy as a collapsible tree',
            long_description: 'Produces a nested display of the two types of hierarchy that AKT deals with - object hierarchies or topic hierarchies.  Note that each *type* of hierarchy has a nuber of hierarchies in it.   ',
            author: 'Robert Muetzelfeldt',
            last_modified: 'December 2020',
            visible: true,
            options: {
            }
        },

        options: {
            kb:AKT.state.current_kb,
            show_titlebar:true,
            tree_type:'subtopics'
        },

        evaluate: function(kb) {
            var results = evaluate(kb);
            display(this, results);
            return results;
        },

        widgetEventPrefix: 'topic_summary:',

        _create: function () {
            console.debug('\n### Creating instance of widget "akt.topic_summary".',
                '\nElement ID:',this.element[0].id,'  Widget UUID:',this.uuid,'  Options:',this.options);
            var self = this;
            this.element.addClass('topic_summary-1');

            var kb = self.options.kb;
            var results = evaluate(kb);
            display(self, results);

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('topic_summary-1');
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
        console.debug('Starting akt.topic_summary: evaluate()');
        return null;
    }


    function display(widget, results) {
        console.debug('Starting akt.topic_summary: display()');
      
        var kb = widget.options.kb;
        var treeType = widget.options.tree_type;
        var tree = AKT.makeTree(kb,treeType);
        AKT.kbs[kb].object_tree = AKT.makeTree(kb,'subobjects');
        console.debug('\n## ',AKT);

        if (widget.options.show_titlebar) {
            var widgetTitlebar = $('<div class="titlebar">topic_summary<input type="button" value="X" class="dialog_close_button"/></div>');  
            $(widget.element).append(widgetTitlebar);
            $('.dialog_close_button').css({background:'yellow'});
            $('.dialog_close_button').on('click', function () {
                var id = $(this).parent().parent()[0].id;
                $('#'+id).css({display:"none"});
            });
        }
        var displayTypes = {subobjects:'Object', subtopics:'Topic'};
        //var widgetContent = $('<div class="content" style="padding:10px;padding-bottom:0px;top:0px;width:400px;height:400px;overflow-y:scroll;"></div>');
        var widgetContent = $('<div class="content" style="overflow:auto; padding:10px; padding-bottom:0px; top:0px; width:400px; height:500;"></div>');
        $(widgetContent).resizable();
        $(widget.element).append(widgetContent);

        var displayHeading = $('<h3 class="widget_display_heading">Hierarchical display of the '+displayTypes[treeType]+' hierarchies in the '+kb+' knowledge base</h3>');
        $(widgetContent).append(displayHeading);
        $(widgetContent).append('<div contenteditable="true" style="width:100%; background:#e0e0e0;"></div>');

        //var content = $('<div>'+JSON.stringify(tree)+'</div>');
        var content = getAllDescendants(tree, "top");
        $(widgetContent).append(content);

        $('.level1').css({"font-weight":"bold", color:"#700000", "font-size":"14px", "margin-top":"10px"});
        $('.level2').css({"font-weight":"normal", color:"black", "font-size":"14px", "margin-top":"0px"});
        $('.level3').css({"font-weight":"normal", "font-size":"13px", "margin-top":"0px"});
        $('.level4').css({"font-weight":"normal"});
        $('.level5').css({"font-weight":"normal"});

        $(widgetContent).append('<div contenteditable="true" style="width:100%; background:#e0e0e0;"></div>');

        function getAllDescendants(tree, node) {
            var temporary = [];
            var treeDown = tree[0]
            var ul = $('<ul></ul>');
            getAll(ul, treeDown, node, 0);
            return ul;

            function getAll(ul, treeDown, node, level) {
                var kbId = AKT.state.current_kb;
                var kb = AKT.kbs[kbId];
                level += 1;
                var children = treeDown[node];
                for (var i=0; i<children.length; i++) {
                    var info = AKT.getTopicInfo(children[i]);
                    var statements = AKT.booleanSearch(kb.sentences, info.search_term,
                        {include_conditions:false,include_subobjects:info.objects});
                    var nStatements = statements.length;
                    if (info.search_term === 'nwura_bone') {
                        for (j=0; j<nStatements; j++) {
                            console.debug(statements[j].id,statements[j].formal);
                        }
                    }

                    console.debug('\n',children[i],info,nStatements);
                    var extra = level===1 ? ' hierarchy: ' : ': ';
                    var description = info.description === '' ? 'none' : info.description;
                    var li = $('<li class="level'+level+'" title="'+AKT.makeBold('Description')+':   '+description+'\nSearch expression:   '+info.search_term+'\nInclude object and/or subobject:   '+info.objects+'">'+children[i]+extra+nStatements+'</li>');
                    $(ul).append(li);
                    if (treeDown[children[i]]) {
                        var ul1 = $("<ul></ul>");
                        $(li).append(ul1);
                        getAll(ul1, treeDown, children[i], level);
                    }
                }
            }
        };
     }

})(jQuery);
