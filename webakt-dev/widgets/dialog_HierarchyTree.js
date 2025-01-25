(function ($) {

  /***********************************************************
   *         dialog_HierarchyTree widget
   ***********************************************************
   */
    $.widget('akt.dialog_HierarchyTree', {
        meta:{
            short_description: 'Displays a hierarchy as a collapsible tree',
            long_description: 'Produces a nested display of the two types of hierarchy that AKT deals with - object hierarchies or topic hierarchies.  Note that each *type* of hierarchy has a nuber of hierarchies in it.  Note that this started life as Tool for showing either of the two types of hierarchy.  It is now (Aug 2021) being evaluate as a possible replacement for two dialog widgets: dialog_Hierarchies and dialog_Hierarchy, which show the set of hierarchies and the items within one hierrchy respectively. ',
            author: 'Robert Muetzelfeldt',
            last_modified: 'August 2021',
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

        widgetEventPrefix: 'dialog_HierarchyTree:',

        _create: function () {
            console.debug('\n### Creating instance of widget "akt.dialog_HierarchyTree".',
                '\nElement ID:',this.element[0].id,'  Widget UUID:',this.uuid,'  Options:',this.options);
            var self = this;
            this.element.addClass('dialog_HierarchyTree-1');

            var kb = self.options.kb;

            createEmptyWidget(self);
            var results = evaluate(kb);
            display(self, results);

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('dialog_HierarchyTree-1');
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


    // ================================= Functions

    function createEmptyWidget(widget) {

        // See comments in AKT.makeWidgetTitlebar(): I can't see why
        // event handler can't go there.  It works for AKT.reprocess...
        if (widget.options.show_titlebar) {
            console.debug(widget.widgetName);
            var titlebarDiv = AKT.makeWidgetTitlebar(widget.widgetName,widget.element);
            $(widget.element).append(titlebarDiv);
            $(widget.element).find('.w3-right').on('click', function () {
                $(widget.element).css({display:"none"});
            });
        }

        var widgetSettings = $('<div></div>');
        $(widget.element).append(widgetSettings);

        var kbSelectElement = AKT.makeReprocessSelector(widget.element, widget.widgetName,
            'Knowledge base', AKT.getKbIds(), AKT.state.current_kb, 'kbId');
        $(widgetSettings).append(kbSelectElement);

        $(widget.element).css({display:'block'});
        $(widget.element).draggable();
    }


    function evaluate(kb) {
        console.debug('Starting akt.dialog_HierarchyTree: evaluate()');
        return null;
    }


    function display(widget, results) {
        console.debug('Starting akt.dialog_HierarchyTree: display()');
      
        var kbId = widget.options.kbId;
        var treeType = widget.options.tree_type;

/*
        if (widget.options.show_titlebar) {
            var widgetTitlebar = $('<div class="titlebar">dialog_HierarchyTree<input type="button" value="X" class="dialog_close_button"/></div>');  
            $(widget.element).append(widgetTitlebar);
            $('.dialog_close_button').css({background:'yellow'});
            $('.dialog_close_button').on('click', function () {
                var id = $(this).parent().parent()[0].id;
                $('#'+id).css({display:"none"});
            });
        }
*/


        var displayTypes = {subobjects:'Object', subtopics:'Topic'};
        //var widgetContent = $('<div class="content" style="padding:10px;padding-bottom:0px;top:0px;width:400px;height:400px;overflow-y:scroll;"></div>');
        
        var widgetContent = $('<div class="content" style="border:none; padding-left:15px;padding-right:15px;"></div>');
        //$(widgetContent).resizable();
        $(widget.element).append(widgetContent);

        var displayHeading = $('<div style="font-weight:bold; font-size:14px;">Atwima: '+displayTypes[treeType]+' hierarchies</div>');
        $(widgetContent).append(displayHeading);
        //$(widgetContent).append('<div contenteditable="true" style="width:100%; background:#e0e0e0;"></div>');

        //var content = $('<div>'+JSON.stringify(tree)+'</div>');
        var tree = AKT.makeTree(kbId,treeType);
        console.debug('\n+++++ ',tree);
        var tree = makeUlTree(tree, "top");
        var html = $('<div id="html" class="demo" style="margin-top:15px;height:410px;overflow-y:overlay;"></div');
        $(html).append(tree);
        var content = $('<div style="float:left;"></div>');
        $(content).append(html);
        
/*
        var content = $(`
	        <div id="html" class="demo">
		        <ul>
			        <li data-jstree='{ "opened" : true }'>Root node
				        <ul>
					        <li data-jstree='{ "selected" : true }'>Child node 1</li>
					        <li>Child node 2</li>
				        </ul>
			        </li>
		        </ul>
	        </div>
        `);
*/

        $(widgetContent).append(content);
        $.jstree.defaults.core.themes.icons = false;
        $('#html').jstree();

        var buttonsDiv = $('<div style="float:left; width:80px; margin:20px;"></div>');

        var hierarchyFieldset = $('<fieldset style="width:80px;"></fieldset>');
        $(hierarchyFieldset).append('<legend><b>Hierarchy</b></legend>');
        $(hierarchyFieldset).append('<button style="width:70px; margin:5px;">New</button>');
        $(hierarchyFieldset).append('<button style="width:70px; margin:5px;">Delete</button>');
        $(hierarchyFieldset).append('<button style="width:70px; margin:5px;">Save as new KB</button>');
        $(hierarchyFieldset).append('<button style="width:70px; margin:5px;">Show statements</button>');
        $(hierarchyFieldset).append('<button style="width:70px; margin:5px;">Memo</button>');

        var topicFieldset = $('<fieldset style="width:80px;"></fieldset>');
        $(topicFieldset).append('<legend><b>Topic</b></legend>');
        $(topicFieldset).append('<button style="width:70px; margin:5px;">New</button>');
        $(topicFieldset).append('<button style="width:70px; margin:5px;">Delete</button>');
        $(topicFieldset).append('<button style="width:70px; margin:5px;">Detach</button>');
        $(topicFieldset).append('<button style="width:70px; margin:5px;">Details</button>');
        $(topicFieldset).append('<button style="width:70px; margin:5px;">Show statements</button>');
        $(topicFieldset).append('<button style="width:70px; margin:5px;">Memo</button>');

        $(buttonsDiv).append(hierarchyFieldset).append(topicFieldset);
        $(widgetContent).append(buttonsDiv);
        $(widgetContent).append('<div style="clear:both;"></div>');

/*        
        $(widgetContent).find('.myUL').css({margin:'0px', padding:'0px'});
        $(widgetContent).find('ul').css({'list-style-type': 'none'});
        $(widgetContent).find('.myUL').css({'list-style-type': 'none'});
        $(widgetContent).find('.caret').css({cursor:'pointer', 'user-select': 'none'});
        $(widgetContent).find('.caret::before').css({content:'\25B6', color:'black', display:'inline-block', 'margin-right':'6px'});
        $(widgetContent).find('.caret-down::before').css({transform:'rotate(90deg)'});
        $(widgetContent).find('.active').css({display:'block'});
        $(widgetContent).find('.nested').css({display:'none'});

        // For collapsible-tree
        var toggler = document.getElementsByClassName("caret");
        console.debug(toggler);
        var i;
        for (i = 0; i < toggler.length; i++) {
          console.debug(i,toggler[i]);
          toggler[i].addEventListener("click", function() {
            console.debug('\nclicked1a:',this);
            console.debug('clicked1b:',this.parentElement);
            this.parentElement.querySelector(".nested").classList.toggle("active");
            console.debug('clicked2a:',this);
            console.debug('clicked2b:',this.parentElement);
            this.classList.toggle("caret-down");
            console.debug('clicked3a:',this);
            console.debug('clicked3b:',this.parentElement);
          });
        }
*/
        $('.level1').css({"font-weight":"bold", color:"#700000", "font-size":"12px", "margin-top":"10px"});
        $('.level2').css({"font-weight":"normal", color:"black", "font-size":"12px", "margin-top":"0px"});
        $('.level3').css({"font-weight":"normal", "font-size":"12px", "margin-top":"0px"});
        $('.level4').css({"font-weight":"normal"});
        $('.level5').css({"font-weight":"normal"});

        //$(widgetContent).append('<div contenteditable="true" style="width:100%; background:#e0e0e0;"></div>');


/*
        function makeUlTree(tree, node) {
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
*/
        function makeUlTree(tree, node) {
            var treeDown = tree[0]
            var ul = $('<ul class="myUL"></ul>');
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
                        var ul1 = $('<ul class="nested"></ul>');
                        $(li).append(ul1);
                        getAll(ul1, treeDown, children[i], level);
                    }
                }
            }
        };

     }


})(jQuery);
