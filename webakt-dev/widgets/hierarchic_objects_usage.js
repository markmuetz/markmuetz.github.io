(function ($) {
    if (!AKT.tools) AKT.tools = {};
    AKT.tools.hierarchic_objects_usage = {
        short_description: 'Hierarchic objects usage',
        long_description: 'Hierarchic objects usage',
        author: 'Robert Muetzelfeldt',
        last_modified: 'August 2024'
    };

  /***********************************************************
   *         hierarchic_objects_usage widget
   ***********************************************************
   */
    $.widget('akt.hierarchic_objects_usage', {
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
            show_titlebar:true,
            tree_type: 'subobjects'
        },

        evaluate: function(kb) {
            var results = evaluate(kb);
            display(this, results);
            return results;
        },

        widgetEventPrefix: 'hierarchic_objects_usage:',

        _create: function () {
            console.debug('\n### Creating instance of widget "akt.hierarchic_objects_usage".',
                '\nElement ID:',this.element[0].id,'  Widget UUID:',this.uuid,'  Options:',this.options);
            var self = this;
            this.element.addClass('hierarchic_objects_usage-1');

            console.debug(301, self.options);
            var kb = self.options.kb;
            var results = evaluate(kb);
            display(self, results);

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('hierarchic_objects_usage-1');
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
        console.debug('Starting akt.hierarchic_objects_usage: evaluate()');
        return null;
    }


    function display(widget, results) {
        console.debug('Starting akt.hierarchic_objects_usage: display()');

        var kb = widget.options.kb;
        var treeType = widget.options.tree_type;
        var tree = AKT.makeTree(kb,treeType);
        console.debug(tree);

        if (widget.options.show_titlebar) {
            var widgetTitlebar = $('<div class="titlebar">hierarchic_objects_usage<input type="button" value="X" class="dialog_close_button"/></div>');  
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
        var displayHeading = $('<h3 class="widget_display_heading">Usage of the same object within different object hierarchies in the '+widget.options.kb+' knowledge base</h3>');
        $(widgetContent).append(displayHeading);
        $(widgetContent).append('<div contenteditable="true" style="width:100%; background:#e0e0e0;"></div>');

        var treeDown = tree[0];
        var results = {};
        var reverseResults = {};
        var revs = {};
        var table = [];
        var hierarchies = treeDown.top;
        for (var i=0; i<hierarchies.length; i++) {
            var hierarchy = hierarchies[i];
            results[hierarchy] = [];
            table[hierarchy] = [];
            getAllDescendants(tree, hierarchy, hierarchy);
        }
        console.debug(results);
        console.debug(reverseResults);
        console.debug(table);
        console.debug(revs);

        var multipleDiv = $('<div style="margin-left:15px;"></div>');
        $(multipleDiv).append('<b>Objects in more than one hierarchy:<b><br/>');
        for (key in reverseResults) {
            if (reverseResults[key].length>1) {
                var entry = $('<span>'+key+': '+JSON.stringify(reverseResults[key])+'</span><br/>');
                $(multipleDiv).append(entry);
            }
        }
        $(widgetContent).append(multipleDiv);


        var table = $('<table style="border-collapse:collapse;"></table>');
        var tr = $('<tr></tr>');
        var td = $('<td></td>');
        $(tr).append(td);
        for (var i=0; i<hierarchies.length; i++) {
            var th = $('<th style="width:65px; text-align:center; border:solid 1px black;">'+hierarchies[i]+'</th>');
            $(tr).append(th);
        }
        $(table).append(tr);

        // Thanks to https://stackoverflow.com/questions/9658690/is-there-a-way-to-sort-order-keys-in-javascript-objects
        Object.keys(revs)
        .sort()
        .forEach(function(key,i) {
            var tr = $('<tr></tr>');
            var td = $('<td style="border:solid 1px black;">'+key+'</td>');
            $(tr).append(td);
            for (i=0; i<hierarchies.length; i++) {
                if (revs[key][hierarchies[i]]) {
                    var td = $('<td style="width:60px; text-align:center; border:solid 1px black;">X</td>');
                } else {
                    var td = $('<td style="width:60px; text-align:center; border:solid 1px black;"></td>');
                }
                $(tr).append(td);
            }
            $(table).append(tr);
        });
        $(widgetContent).append(table);
        $(widgetContent).append('<div contenteditable="true" style="width:100%; background:#e0e0e0;"></div>');
        //var content = getAllDescendants(tree, "top");
        
        //$(widgetContent).append(heading).append(content);

        function getAllDescendants(tree, hierarchy, node) {
            var treeDown = tree[0]
            getAll(treeDown, hierarchy, node);
            return results;

            function getAll(treeDown, hierarchy, node) {
                var children = treeDown[node];
                for (var i=0; i<children.length; i++) {
                    results[hierarchy].push(children[i]);
                    if (reverseResults[children[i]]) {
                        reverseResults[children[i]].push(hierarchy);
                    } else {
                        reverseResults[children[i]] = [hierarchy];
                    }
                    if (revs[children[i]]) {
                        revs[children[i]][hierarchy] = true;
                    } else {
                        revs[children[i]] = {};
                        revs[children[i]][hierarchy] = true;
                    }
                    table[hierarchy][children[i]] = true;
                    if (treeDown[children[i]]) {
                        getAll(treeDown, hierarchy, children[i]);
                    }
                }
            }
        };

/*
        var content = getAllDescendants(tree, "top");
        
        var heading = $('<div class="tool_results_heading">'+treeType+'</div>');
        $(widgetContent).append(heading).append(content);
        $('.level1').css({"font-weight":"600", color:"#700000", "font-size":"15px", "margin-top":"10px"});
        $('.level2').css({"font-weight":"normal", color:"black", "font-size":"14px", "margin-top":"0px"});
        $('.level3').css({"font-weight":"normal", "font-size":"13px", "margin-top":"0px"});
        $('.level4').css({"font-weight":"normal"});
        $('.level5').css({"font-weight":"normal"});

        function getAllDescendants(tree, node) {
            var treeDown = tree[0]
            var ul = $("<ul></ul>");
            getAll(ul, treeDown, node, 0);
            return ul;

            function getAll(ul, treeDown, node, level) {
                level += 1;
                var children = treeDown[node];
                for (var i=0; i<children.length; i++) {
                    var li = $('<li class="level'+level+'">'+children[i]+'</li>');
                    $(ul).append(li);
                    if (treeDown[children[i]]) {
                        var ul1 = $("<ul></ul>");
                        $(li).append(ul1);
                        getAll(ul1, treeDown, children[i], level);
                    }
                }
            }
        };
*/
        $(widgetContent).append(table);
    }

})(jQuery);
