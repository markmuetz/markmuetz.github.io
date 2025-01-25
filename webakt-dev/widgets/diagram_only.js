(function ($) {

  /***********************************************************
   *         diagram_only widget
   ***********************************************************
   See bottom of file for JointJS tips!
   */
    $.widget('akt.diagram_only', {
        meta:{
            short_description: 'Displays causal and link relationships without old AKT5 controls',
            long_description: 'Displays causal and link relationships without old AKT5 controls',
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

        widgetEventPrefix: 'diagram_only:',

        _create: function () {
            console.debug('\n### Creating instance of widget "akt.diagram_only".',
                '\nElement ID:',this.element[0].id,'  Widget UUID:',this.uuid,'  Options:',this.options);
            var self = this;
            this.element.addClass('diagram_only-1');

            var kb = self.options.kb;
            var results = evaluate(kb);
            display(self, results);

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('diagram_only-1');
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
        console.debug('Starting akt.diagram_only: evaluate()');
        return null;
    }


    function display(widget, results) {
        console.debug('Starting akt.diagram_only: display()');

        var instance = "something_unique";  // .... the widget's UUID
        var kb = widget.options.kb;

        if (widget.options.show_titlebar) {
            var widgetTitlebar = $('<div class="titlebar">diagram_only<input type="button" value="X" class="dialog_close_button"/></div>');  
            $(widget.element).append(widgetTitlebar);
            $('.dialog_close_button').css({background:'yellow'});
            $('.dialog_close_button').on('click', function () {
                var id = $(this).parent().parent()[0].id;
                $('#'+id).css({display:"none"});
            });
        }
        var widgetContent = $('<div class="content" style="padding:10px;padding-bottom:0px;top:0px;width:850px;height:500px;"></div>');
        $(widgetContent).resizable();
        $(widget.element).append(widgetContent);

        // Create diagram elements
        var baselayerDiv = $('<div id="base_layer" style="position:absolute; top:10px; left:10px; width:72px; height:72px; border:solid 1px black; background:#d0d0d0; z-index:1000;"></div>');
        var dragmeDiv = $('<div id="dragme" style="position:absolute; top:25px; left:25px; width:20px; height:20px; border:solid 1px black; background:white;"></div>');
        $(baselayerDiv).append(dragmeDiv);

        var paperDiv = $('<div id="paper" style="border:solid 1px black;"></div>');

        var settingsDiv = $('<div class="settings"></div>');
        var saveInputButton = $('<input type="button" style="float:left;" id="'+instance+'_save" class="diagram_save" value="Save">');
        var loadInputButton = $('<input type="button" style="float:left;margin-left:5px;" id="'+instance+'_load" class="diagram_load" value="Load">');
        var zoomtofitInputButton = $('<input type="button" style="float:left;margin-left:5px;" id="'+instance+'_zoomtofit" class="diagram_zoomtofit" value="Zoom to fit">');
        var scaleLabel = $('<label for="scale" style="float:left;margin-left:5px;" title="Scale factor">Scale factor</label>');
        var scaleInput = $('<input id="scale" style="float:left;margin-left:2px;" type="range" value="1.00" step="0.1" min="0.5" max="2" autocomplete="off"/>');
        var scaleOutput = $('<output for="scale" style="float:left;margin-left:2px;">1.00</output>');
        var makeSubdiagramInputButton = $('<input type="button" style="float:left;margin-left:5px;" id="'+instance+'_make_subdiagram" class="make_subdiagram" value="Make subdiagram">');
        $(settingsDiv).append(saveInputButton).append(loadInputButton).append(zoomtofitInputButton).append(scaleLabel).append(scaleInput).append(scaleOutput).append(makeSubdiagramInputButton);
        $(widgetContent).append(baselayerDiv).append(paperDiv).append(settingsDiv);

        // SETTING-UP
        $('#dragme').css({top:'0px', left:'0px', width:'70px', height:'70px','z-index':1000})
            .draggable({containment:'parent'});

        var graph = new joint.dia.Graph();
        var paper = new joint.dia.Paper({
            el: $('#paper'),
            width: 900,
            height: 600,
            model: graph,
            //defaultConnectionPoint: { name: 'anchor' }
            linkPinning:false,   // This is essential for displaying arrowheads when diagram loaded!
            interactive: {
                linkMove: false,
                labelMove: true,
                arrowheadMove: false,
                vertexMove: true,
                vertexAdd: false,
                vertexRemove: false,
                useLinkTools: false
            }
        });
        paper.setGridSize(1);


        $('.diagram_load').on('click', function() {
            graph.removeCells(graph.getElements());
            graph.removeLinks(graph.getLinks());
            $('#load_diagram_local_storage').css({display:'block'});
        });

        $('.make_subdiagram').on('click', function() {
            graph.removeCells(graph.getElements());
            graph.removeLinks(graph.getLinks());
            $('#make_subdiagram').css({display:'block'});
        });

        $('#load_diagram_local_storage_ok').on('click', function(event,element) {
            var kbId = AKT.state.current_kb;
            var kb = AKT.kbs[kbId];
            $('#load_diagram_local_storage').css({display:'none'});
            var title = $('#load_diagram_local_storage_title').val();
            var diagramString = localStorage.getItem(title);
            var diagramObject = JSON.parse(diagramString);
            var nodes = diagramObject.nodes;
            for (var i=0; i<nodes.length; i++) {
                var node = new joint.shapes.standard.Rectangle(nodes[i]);
                console.debug(node.attributes.attrs.text);
                console.debug(node.attributes.attrs.text['font-family']);
                node.addTo(graph);
            }
            var links = diagramObject.links;
            for (var i=0; i<links.length; i++) {
                console.debug(i, links[i]);
                links[i].vertices = [];
                if (links[i].type === 'causes1way') {
                    causeType = 1;
                } else if (links[i].type === 'causes2way') {
                    causeType = 2;
                }
                var aktId = parseInt(links[i].akt_id,10)-1;
                var nestedList = kb.sentences[aktId].nested_list;
                var english = AKT.translate(nestedList);
                var wrappedEnglish = joint.util.breakText(aktId+': '+english, {
                    width: 120
                });
                var link = new joint.shapes.standard.Link(links[i]);
                link.addTo(graph);
                link.appendLabel({
                    attrs: {
                        text: {
                            text: ' + ' + causeType + ' -',
                            fontSize:12,
                            fontWeight: 'bold'
                        }
                    },
                    position: {
                        distance: 0.9,
                        offset: 10,
                    }
                });
                link.appendLabel({
                    attrs: {
                        text: {
                            text: wrappedEnglish,
                            fontSize:10,
                            textAnchor:'middle'   // 'left' looks nicer than 'moddle', but problems when try to drag to left of link start
                        },
                        rect: {
                            //style:{stroke:'black','stroke-width':'7px'},
                            //stroke:'red',
                            //'stroke-width':'7px'
                            fill:'rgb(255,255,255,0.7)',
                        }
                    },
                    position: {
                        distance: 0.4,
                        offset: 30,
                    }

                });
            }
        });


        $('#make_subdiagram_ok').on('click', function(event,element) {
            $('#make_subdiagram').css({display:'none'});
            var searchExpression = $('#make_subdiagram_ok').val();
            var allStatements = AKT.kbs[AKT.state.current_kb].sentences;
            var statements = AKT.booleanSearch(allStatements,'trees');
            var aktGraph = AKT.makeGraphFromStatements(statements);
            var aktGraphLayouted = AKT.graphLayoutSpringy(aktGraph);
        });

        // ==============================================================================
        // GRAPH-SPECIFIC CODE
        var elements = [
        ];

        // add all elements to the graph
        graph.resetCells(elements);

        var linkEnds = [
        ];

        // add all links to the graph
/*
        linkEnds.forEach(function(ends) {
            new joint.shapes.standard.Link({
                source: { id: elements[ends.source].id },
                target: { id: elements[ends.target].id },
                z: -1 // make sure all links are displayed under the elements
            }).addTo(graph);
        });
*/
        linkEnds.forEach(function(ends) {
            var link = new joint.shapes.standard.Link({
                source: { id: elements[ends.source].id },
                target: { id: elements[ends.target].id },
                z: -1 // make sure all links are displayed under the elements
            });
            link.appendLabel({
                attrs: {
                    text: {
                        text: 'Hello, World!'
                    }
                }
            });
            link.addTo(graph);
        });

        // End of graph-specific code

        // =====================================================================================
        // SVG UTILITY CODE

        // Cache bbox elements
        var $bboxX = $('#bbox-x');
        var $bboxY = $('#bbox-y');
        var $bboxW = $('#bbox-width');
        var $bboxH = $('#bbox-height');
        var $grid = $('#grid');

        // Cache svg elements
        var svg = V(paper.svg);
        var svgVertical = V('path').attr('d', 'M -10000 -1 L 10000 -1');
        var svgHorizontal = V('path').attr('d', 'M -1 -10000 L -1 10000');
        var svgRect = V('rect');
        var svgAxisX = svgVertical.clone().addClass('axis');
        var svgAxisY = svgHorizontal.clone().addClass('axis');
        var svgBBox = svgRect.clone().addClass('bbox');


        svgBBox.hide = joint.util.debounce(function() {
            svgBBox.removeClass('active');
        }, 500);

        // svg Container - contains all non-jointjs svg elements
        var svgContainer = [];

        svgContainer.showAll = function() {
            this.forEach(function(v) { v.addClass('active'); });
        };

        svgContainer.hideAll = function() {
            this.forEach(function(v) { v.removeClass('active'); });
        };

        svgContainer.removeAll = function() {
            while (this.length > 0) {
                this.pop().remove();
            }
        };


        function updateBBox() {

            var bbox = paper.getContentBBox();

            $bboxX.text(Math.round(bbox.x - paper.options.origin.x));
            $bboxY.text(Math.round(bbox.y - paper.options.origin.y));
            $bboxW.text(Math.round(bbox.width));
            $bboxH.text(Math.round(bbox.height));

            svgBBox.attr(bbox).addClass('active').hide();
        }

        // End of SVG utility code


        // ===============================================================================================
        // TOP-LEVEL GRAPH-VIEWING CODE

        function fitToContent() {
            svgContainer.removeAll();
            paper.scaleContentToFit({
                padding: 0,
                minScale: parseFloat(0.2),
                maxScale: parseFloat(5),
                //scaleGrid: parseFloat($stfScaleGrid.val()),
                preserveAspectRatio: true
            });

            var bbox = paper.getContentBBox();

            svgContainer.showAll();
            //$('#paper').css({width:'700px',height:'700px'});
        }


        // Event handlers
        $('#dragme').on('drag', function(event,ui) {
            paper.setOrigin(parseInt(-14*ui.position.left), parseInt(-14*ui.position.top));
        });

        $('#zoom_to_fit').on('click', fitToContent);

        $('#scale').on('input change', function(event) {
            var scale = parseFloat(this.value);
            paper.scale(scale);
            $('#dragme').css({width:parseInt(70*scale/3+'px'), height:parseInt(70*scale/3+'px')});
        });
        $('#scale').trigger('change',1);    // The only way I have found to get the
            // "dragme" box to be displayed in the navigation box.

        paper.on({
            scale: function(scale) {
                $('#scale').val(scale).next().text(scale.toFixed(2));
                svgContainer.hideAll();
            },

            translate: function(ox, oy) {
                svgAxisX.translate(0, oy, { absolute: true });
                svgAxisY.translate(ox, 0, { absolute: true });
                svgContainer.hideAll();
            },

            resize: function(width, height) {
                $('#w').val(width).next().text(Math.round(width));
                $('#h').val(height).next().text(Math.round(height));
                svgContainer.hideAll();
            }
        });

        paper.on('link:mouseenter', function(linkView) {
            var kbId = AKT.state.current_kb;
            var kb = AKT.kbs[kbId];
            var model = linkView.model;
            var aktId = parseInt(model.attributes.akt_id,10);
            var nestedList = kb.sentences[aktId-1].nested_list;
            var english = AKT.translate(nestedList);
            console.debug(english);
            model.attr({line:{stroke:'blue',targetMarker:{fill:'blue'}}})
            model.attr({
                label: {
                    textPath: {
                        selector: 'line',
                        startOffset: '50%'
                    },
                    textAnchor: 'middle',
                    textVerticalAnchor: 'middle',
                    text: 'Label Along Path',
                    fill: '#f6f6f6',
                    fontSize: 12,
                    fontWeight: 'bold',
                    fontFamily: 'fantasy'
                }
             });
         });

        paper.on('link:mouseleave', function(linkView) {
            var model = linkView.model;
            model.attr({line:{stroke:'red',targetMarker:{fill:'red'}}})
         });


        graph.on('change', function() {
            svgContainer.hideAll();
            updateBBox();
        });

        updateBBox();

   }


})(jQuery);


