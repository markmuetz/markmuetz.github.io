(function ($) {

  /***********************************************************
   *         diagram_only widget
   ***********************************************************
   See bottom of file for JointJS tips!
   */
    $.widget('akt.diagram_only', {
        meta:{
            short_description: 'Displays causal and link relationships',
            long_description: 'Displays causal and link relationships',
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
        var baselayerDiv = $('<div id="base_layer" style="position:absolute; top:8px; left:8px; width:72px; height:72px; border:solid 1px black; background:#d0d0d0; z-index:1000;"></div>');
        var dragmeDiv = $('<div id="dragme" style="position:absolute; top:25px; left:25px; width:20px; height:20px; border:solid 1px black; background:white;"></div>');
        $(baselayerDiv).append(dragmeDiv);

        var paperDiv = $('<div id="paper" style="border:solid 1px black;"></div>');

        var settingsDiv = $('<div class="settings"></div>');
        var zoomToFitButton = $('<button id="zoom_to_fit" style="padding:7px; margin-right:10px;">Zoom to fit</button>');
        var scaleLabel = $('<label for="scale" title="Scale factor">Scale factor</label>');
        var scaleInput = $('<input id="scale" type="range" value="1.00" step="0.1" min="0.5" max="2" autocomplete="off"/>');
        var scaleOutput = $('<output for="scale">1.00</output>');
        var loadButton = $('<input type="button" style="float:left;margin-left:10px;" id="'+instance+'_load" class="diagram_load" value="Load">');
        $(settingsDiv).append(zoomToFitButton).append(scaleLabel).append(scaleInput).append(scaleOutput).append(loadButton);
        $(widgetContent).append(baselayerDiv).append(paperDiv).append(settingsDiv);

        // SETTING-UP
        $('#dragme').css({top:'0px', left:'0px', width:'70px', height:'70px','z-index':1000})
            .draggable({containment:'parent'});

        var graph = new joint.dia.Graph();
        var paper = new joint.dia.Paper({
            el: $('#paper'),
            width: 700,
            height: 450,
            model: graph,
            //defaultConnectionPoint: { name: 'anchor' }
            linkPinning:false   // This is essential for displaying arrowheads whne diagram loaded!
        });


        $('.diagram_load').on('click', function() {
            graph.removeCells(graph.getElements());
            graph.removeLinks(graph.getLinks());
            $('#load_diagram_local_storage').css({display:'block'});
        });

        $('#load_diagram_local_storage_ok').on('click', function(event,element) {
            $('#load_diagram_local_storage').css({display:'none'});
            var title = $('#load_diagram_local_storage_title').val();
            var diagramString = localStorage.getItem(title);
            var diagramObject = JSON.parse(diagramString);
            var nodes = diagramObject.nodes;
            for (var i=0; i<nodes.length; i++) {
                var node = new joint.shapes.standard.Rectangle(nodes[i]);
                node.addTo(graph);
            }
            var links = diagramObject.links;
            for (var i=0; i<links.length; i++) {
                console.debug(links[i]);
                var link = new joint.shapes.standard.Link(links[i]);
                link.addTo(graph);
            }
        });

        // ==============================================================================
        // GRAPH-SPECIFIC CODE
        var elements = [

            new joint.shapes.standard.Path({
                position: { x: 75, y: 175 },
                size: { width: 100, height: 40 },
                attrs: {
                    label: { text: 'joint' },
                    body: { refD: 'M 0 0 L 100 0 80 20 100 40 0 40 Z' }
                }
            }),

            new joint.shapes.standard.Path({
                position: { x: 200, y: 275 },
                size: { width: 100, height: 40 },
                attrs: {
                    label: { text: 'dia' },
                    body: { refD: 'M 20 0 L 100 0 80 20 100 40 20 40 0 20 Z' }
                }
            }),

            new joint.shapes.standard.Path({
                position: { x: 200, y: 75 },
                size: { width: 100, height: 40 },
                attrs: {
                    label: { text: 'util' },
                    body: { refD: 'M 20 0 L 100 0 80 20 100 40 20 40 0 20 Z' }
                }
            }),

            new joint.shapes.standard.Path({
                position: { x: 200, y: 175 },
                size: { width: 100, height: 40 },
                attrs: {
                    label: { text: 'shapes' },
                    body: { refD: 'M 20 0 L 100 0 80 20 100 40 20 40 0 20 Z' }
                }
            }),

            new joint.shapes.standard.Path({
                position: { x: 325, y: 175 },
                size: { width: 100, height: 40 },
                attrs: {
                    label: { text: 'basic' },
                    body: { refD: 'M 20 0 L 100 0 80 20 100 40 20 40 0 20 Z' }
                }
            }),

            new joint.shapes.standard.Path({
                position: { x: 450, y: 150 },
                size: { width: 100, height: 40 },
                attrs: {
                    label: { text: 'Path' },
                    body: { refD: 'M 20 0 L 100 0 100 40 20 40 0 20 Z' }
                }
            }),

            new joint.shapes.standard.Path({
                position: { x: 450, y: 200 },
                size: { width: 100, height: 40 },
                attrs: {
                    label: { text: 'Text' },
                    body: { refD: 'M 20 0 L 100 0 100 40 20 40 0 20 Z' }
                }
            }),

            new joint.shapes.standard.Path({
                position: { x: 325, y: 250 },
                size: { width: 100, height: 40 },
                attrs: {
                    label: { text: 'Paper' },
                    body: { refD: 'M 20 0 L 100 0 100 40 20 40 0 20 Z' }
                }
            }),

            new joint.shapes.standard.Path({
                position: { x: 325, y: 300 },
                size: { width: 100, height: 40 },
                attrs: {
                    label: { text: 'Graph' },
                    body: { refD: 'M 20 0 L 100 0 100 40 20 40 0 20 Z' }
                }
            }),

            new joint.shapes.standard.Path({
                position: { x: 325, y: 100 },
                size: { width: 100, height: 40 },
                attrs: {
                    label: { text: 'getByPath' },
                    body: { refD: 'M 20 0 L 100 0 100 40 20 40 0 20 Z' }
                }
            }),

            new joint.shapes.standard.Path({
                position: { x: 325, y: 50 },
                size: { width: 100, height: 40 },
                attrs: {
                    label: { text: 'setByPath' },
                    body: { refD: 'M 20 0 L 100 0 100 40 20 40 0 20 Z' }
                }
            })
        ];

        // add all elements to the graph
        graph.resetCells(elements);

        var linkEnds = [
            { source: 0, target:  1 }, { source: 0, target: 2 }, { source: 0, target: 3 },
            { source: 1, target:  7 }, { source: 1, target: 8 },
            { source: 2, target:  9 }, { source: 2, target: 10 },
            { source: 3, target:  4 },
            { source: 4, target:  5 }, { source: 4, target:  6 }
        ];

        // add all links to the graph
        linkEnds.forEach(function(ends) {
            new joint.shapes.standard.Link({
                source: { id: elements[ends.source].id },
                target: { id: elements[ends.target].id },
                z: -1 // make sure all links are displayed under the elements
            }).addTo(graph);
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
            paper.setOrigin(parseInt(-14*ui.position.left+350), parseInt(-14*ui.position.top+350));
        });

        $('#zoom_to_fit').on('click', fitToContent);

        $('#scale').on('input change', function() {
            var scale = parseFloat(this.value);
            paper.scale(scale);
            $('#dragme').css({width:parseInt(70*scale/3+'px'), height:parseInt(70*scale/3+'px')});
        });

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

        graph.on('change', function() {
            svgContainer.hideAll();
            updateBBox();
        });

        updateBBox();

   }


})(jQuery);


