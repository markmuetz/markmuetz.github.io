(function ($) {

  /***********************************************************
   *         display_hierarchy widget
   ***********************************************************
   */
    $.widget('akt.display_hierarchy', {
        meta:{
            short_description: 'Displays a hierarchy as a collapsible tree',
            long_description: 'Produces a nested display of the two types of hierarchy that AKT deals with - object hierarchies or topic hierarchies.  Note that each *type* of hierarchy has a nuber of hierarchies in it.   ',
            author: 'Robert Muetzelfeldt',
            last_modified: 'August 2021',
            visible: true,
            options: {
            }
        },

        options: {
            kb:AKT.state.current_kb,
            show_titlebar:true,
            tree_type:'subobjects'
        },

        evaluate: function(kb) {
            var results = evaluate(kb);
            display(this, results);
            return results;
        },

        widgetEventPrefix: 'display_hierarchy:',

        _create: function () {
            console.debug('\n### Creating instance of widget "akt.display_hierarchy".',
                '\nElement ID:',this.element[0].id,'  Widget UUID:',this.uuid,'  Options:',this.options);
            var self = this;
            this.element.addClass('display_hierarchy-1');

            var kb = self.options.kb;
            var results = evaluate(kb);
            display(self, results);

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('display_hierarchy-1');
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
        console.debug('Starting akt.display_hierarchy: evaluate()');
        return null;
    }


    function display(widget, results) {
        console.debug('Starting akt.display_hierarchy: display()');
      
        var kb = widget.options.kb;
        var treeType = widget.options.tree_type;
        var tree = AKT.makeTree(kb,treeType);
        console.debug('\n+++++ ',tree);

        if (widget.options.show_titlebar) {
            var widgetTitlebar = $('<div class="titlebar">display_hierarchy<input type="button" value="X" class="dialog_close_button"/></div>');  
            $(widget.element).append(widgetTitlebar);
            $('.dialog_close_button').css({background:'yellow'});
            $('.dialog_close_button').on('click', function () {
                var id = $(this).parent().parent()[0].id;
                $('#'+id).css({display:"none"});
            });
        }
        var displayTypes = {subobjects:'Object', subtopics:'Topic'};
        //var widgetContent = $('<div class="content" style="padding:10px;padding-bottom:0px;top:0px;width:400px;height:400px;overflow-y:scroll;"></div>');
        var widgetContent = $('<div class="content" style="padding:10px;padding-bottom:0px;top:0px;width:400px;"></div>');
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
            var treeDown = tree[0]
            var ul = $('<ul></ul>');
            getAll(ul, treeDown, node, 0);
            return ul;

            function getAll(ul, treeDown, node, level) {
                level += 1;
                var children = treeDown[node];
                for (var i=0; i<children.length; i++) {
                    if (level === 1) {
                        var li = $('<li class="level'+level+'">'+children[i]+' hierarchy</li>');
                    } else {
                        li = $('<li class="level'+level+'">'+children[i]+'</li>');
                    }
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
