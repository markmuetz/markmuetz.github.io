AKT.widgetsdiagram_from_topic = {};


AKT.widgetsdiagram_from_topic.setup = function (widget) {
    console.log('Starting aktdiagram_from_topic: setup()');

    $(widget.element).find('.diagram_button_left').css({width:'80px',padding:'2px'});
    $(widget.element).find('.diagram_button_right').css({width:'90px',padding:'3px'});

    var instance = "something_unique";  // .... the widget's UUID
    var kbId = widget.options.kbId;
    var kb = AKT.KBs[kbId];

    // Listbox with plain list of topics.
    var hierarchyId_filter = 'all';
    var topics = kb.findTopics({hierarchyId:hierarchyId_filter});
    AKT.loadSelectOptions(widget.element, 'listbox_topics', topics, ['_id','_id'],{title:'_search_term'});
    // End of topics listbox

    var graph = new joint.dia.Graph;
    AKT.state.current_graph = graph;
    // Change width and height here to create a bigger canvas, and cause the panel itself to size accordingly.
    //var paper = new joint.dia.Paper({ el: $(widget.element).find('.div_paper'), width: 1100, height: 600, gridSize: 1, model: graph, linkPinning:false });
    var paper = new joint.dia.Paper({ el: $(widget.element).find('.div_paper'), width: 900, height: 500, gridSize: 1, model: graph, linkPinning:false });
    paper.scale(1);

    $(widget.element).on( "resize", function(event, ui) {
        //var width = $(widget.element).width()-250;   For when left and right button blocks are displayed...
        //var height = $(widget.element).height()-100;
        var width = $(widget.element).width()-0;
        var height = $(widget.element).height()-50;
        console.log(width,height);
        $(widget.element).find('.div_paper').css({width:width+'px',height:height+'px'});
        paper.scaleContentToFit({ padding: 10 });
    });

    var m = {};
    AKT.state.mytype = 'pointer';
    var count = {object:0, attribute:0, process:0, action:0, causes1way:0, causes2way:0, link:0};
    var nodeReady = false;
    var flowPad = null;
    var influencePad = null;

    // Presentational attributes.
    var attrs = {
        elementDefault: {
            text: { fill: '#fff', style: { 'text-shadow': '1px 1px 1px #999', 'text-transform': 'capitalize' }},
            circle: { fill: '#feb663', stroke: 'white' }
        },
        elementSelected: {
            circle: { fill: '#9687fe' }
        },
        elementHighlighted: {
            circle: { fill: '#31d0c6' }
        },
        linkDefault: {
            '.connection': { stroke: '#6a6c8a', 'stroke-width': 1 }
        },
        linkDefaultDirected: {
            '.marker-target': { d: 'M 12 0 L 0 6 L 12 12 z' }
        },
        linkHighlighted: {
            '.connection': { stroke: '#33334e', 'stroke-width': 5 }
        },
        linkFlow: {
            '.marker-target': { d: 'M 12 0 L 0 6 L 12 12 z'},
            '.connection': { stroke: '#33334e', 'stroke-width': 5 }
        },
        linkInfluence: {
            '.marker-target': { d: 'M 12 0 L 0 6 L 12 12 z' }
        }
    };



    joint.shapes.standard.Rectangle.define('examples.CustomRectangle',
        {
            attrs: {
                body: {
                    rx: 10, // add a corner radius
                    ry: 10,
                    strokeWidth: 2,
                    fill: 'white',
                    stroke: 'blue'
                },
                label: {
                    textAnchor: 'left', // align text to left
                    refX: 10, // offset text from right edge of model bbox
                    fill: 'black',
                    fontSize: 10
                }
            }
        }, 
        {
            // inherit joint.shapes.standard.Rectangle.markup
        }, 
        {
            createRandom: function() {

                var rectangle = new this();

                var fill = '#' + ('000000' + Math.floor(Math.random() * 16777215).toString(16)).slice(-6);
                var stroke = '#' + ('000000' + Math.floor(Math.random() * 16777215).toString(16)).slice(-6);
                var strokeWidth = Math.floor(Math.random() * 6);
                var strokeDasharray = Math.floor(Math.random() * 6) + ' ' + Math.floor(Math.random() * 6);
                var radius = Math.floor(Math.random() * 21);

                rectangle.attr({
                    body: {
                        fill: fill,
                        stroke: stroke,
                        strokeWidth: strokeWidth,
                        strokeDasharray: strokeDasharray,
                        rx: radius,
                        ry: radius
                    },
                    label: { // ensure visibility on dark backgrounds
                        fill: 'black',
                        stroke: 'white',
                        strokeWidth: 1,
                        fontWeight: 'bold'
                    }
                });

                return rectangle;
            }
        }
    );



// =========================  BUTTON EVENT HANDLERS  =======================================

    $('.diagram_save').on('click', function() {
        $('#save_diagram_local_storage').css({display:'block'});
    });

    $('.diagram_load').on('click', function() {
        graph.removeCells(graph.getElements());
        graph.removeLinks(graph.getLinks());
        $('#load_diagram_local_storage').css({display:'block'});
    });

    $('#save_diagram_local_storage_ok').on('click', function(event) {
        console.log('\n90. clicked on Save button');
        $('#save_diagram_local_storage').css({display:'none'});
        var title = $('#save_diagram_local_storage_title').val();
        saveDiagramToLocalStorage(graph, title);
    });

    $('#load_diagram_local_storage_ok').on('click', function(event,element) {
        $('#load_diagram_local_storage').css({display:'none'});
        var title = $('#load_diagram_local_storage_title').val();
        var diagramString = localStorage.getItem(title);
        var jointObject = JSON.parse(diagramString); 
        var nodes = jointObject.nodes;
        for (var i=0; i<nodes.length; i++) {
            var node = new joint.shapes.standard.Rectangle(nodes[i]);
            node.addTo(graph);
        }
        var links = jointObject.links;
        for (var i=0; i<links.length; i++) {
            console.log(links[i]);
            var link = new joint.shapes.standard.Link(links[i]);
            link.addTo(graph);
        }
    });


    $('#node_object_dialog_ok').on('click', function() {
        var objectName = $('#node_object_dialog_name').val();
        var partName = $('#node_object_dialog_partname').val();
        var result = AKT.mywrap(objectName+' '+partName,10);
        AKT.state.currentElement.attr('label/text',result.wrappedString);
        AKT.state.currentElement.resize(Math.max(60,4+7.2*result.nchars), Math.max(35,4+11*result.nlines));
        $('#node_object_dialog').css({display:'none'});
        saveDiagramToLocalStorage(graph, 'current');
    });

    $('#node_attribute_dialog_ok').on('click', function() {
        var objectName = $('#node_attribute_dialog_object_name').val();
        var partName = $('#node_attribute_dialog_objectpart_name').val();
        var attributeName = $('#node_attribute_dialog_attribute_name').val();
        var result = AKT.mywrap(objectName+' '+partName+' '+attributeName);
        AKT.state.currentElement.attr('label/text',result.wrappedString);
        AKT.state.currentElement.resize(Math.max(60,4+7.2*result.nchars), Math.max(35,4+11*result.nlines));
        $('#node_attribute_dialog').css({display:'none'});
        saveDiagramToLocalStorage(graph, 'current');
    });

    $('.node_object').on('click', function(event,item) {
        process_node_or_link_button(this, 'node', 'object');
    });
    $('.node_attribute').on('click', function(event,item) {
        process_node_or_link_button(this, 'node', 'attribute');
    });
    $('.node_process').on('click', function(event,item) {
        process_node_or_link_button(this, 'node', 'process');
    });
    $('.node_action').on('click', function(event,item) {
        process_node_or_link_button(this, 'node', 'action');
    });
    $('.link_causes1way').on('click', function(event,item) {
        process_node_or_link_button(this, 'link', 'causes1way');
    });
    $('.link_causes2way').on('click', function(event,item) {
        process_node_or_link_button(this, 'link', 'causes2way');
    });
    $('.link_link').on('click', function(event,item) {
        process_node_or_link_button(this, 'link', 'link');
    });

    // Buttons in node and link creation dialogs
    $('.diagram_node_dialog').on('click', function() {
        $(this).css({display:'none'});
    });
    $('.diagram_link_dialog').on('click', function() {
        $(this).css({display:'none'});
    });


// =========================== LISTBOX HANDLERS  ==============================

    $(widget.element).find('.button_display').on('click', function() {
        event.stopPropagation();
        var kbId = widget.options.kbId;
        var kb = AKT.KBs[kbId];
        graph.clear();
        var topicId = $(widget.element).find('.listbox_topics').val();
        var diagram = new Diagram('acheampong_from_topic','systo');
        AKT.state.diagram_counter += 1;
        AKT.state.current_diagram = diagram;  // The object, not the ID

        console.log('topicId::: ',topicId);
        //diagram.convertCausalToSysto(topicId);
        diagram.makeSubgraph(topicId);
        if (Object.keys(diagram._systo.arcs).length > 0) {
            console.log('\n## n nodes: ',Object.keys(diagram._systo.nodes).length);  // 41
            console.log('## n arcs:  ',Object.keys(diagram._systo.arcs).length);     // 33
            //diagram.graphLayoutCola();  // Work on using cola stopped when I found that
            // springy did a good job with orphan subgraphs and links.
            console.log('diagram: ',diagram);
            var i=0;
            for (var arcId in diagram._systo.arcs) {
                i += 1;
                var arc = diagram._systo.arcs[arcId];
                //console.log(i,arcId,arc.start_node_id, arc.end_node_id);
            }
            var i=0;
            for (var nodeId in diagram._systo.nodes) {
                i += 1;
                var node = diagram._systo.nodes[nodeId];
                //console.log(i, nodeId, node.centrex, node.centrey);
            }
            diagram.graphLayoutSpringy(widget);
            $(widget.element).blur();
        } else {
            alert('There are no causal statements for the chosen topic.');
        }
    });


// ===========================  JOINT HANDLERS  ===============================

    paper.on('blank:pointerdblclick', function(evt, x, y) {
        evt.stopPropagation();
    //paper.on('blank:pointerclick', function(evt, x, y) {
        var nodeTypes = {object:true, attribute:true, process:true, action:true};
        //var valve = graph.getCell('valve');
        //if (valve) valve.attr('circle/magnet', true).attr('text/pointer-events', 'none');
        var mytype = AKT.state.mytype;
        //if (editMode) {
            //var node = n(_.uniqueId('n'), x + '@' + y);
        if (nodeTypes[mytype]) {
            var node = createNode(_.uniqueId('n'), {x:x, y:y}, mytype);
        }
        saveDiagramToLocalStorage(graph, 'current');
            //node.attr('body/magnet', true).attr('text/pointer-events', 'none');
        //}
        $('.diagram_button_left').css({border:'solid 1px #808080', background:'#f0f0f0'});
        AKT.state.mytype = 'pointer';
        _.each(graph.getElements(), function(el) {
            el.removeAttr('body/magnet').removeAttr('text/pointer-events');
        });
    });

    //====================================================
    // From jointjs events tutorial
    paper.on('blank:pointerdblclickxxx', function() {
        resetAll(this);

        info.attr('body/visibility', 'hidden');
        info.attr('label/visibility', 'hidden');

        this.drawBackground({
            color: 'orange'
        })
    });


    paper.on('element:pointerdblclick', function(elementView) {
        //resetAll(this);

        AKT.state.currentElement = elementView.model;

        //currentElement.attr('body/stroke', 'orange')
    });

    paper.on('link:pointerdblclick', function(linkView) {
        //resetAll(this);

        var currentLink = linkView.model;
        //currentLink.attr('line/stroke', 'orange')
        //currentLink.label(0, {
        //    attrs: {
        //        body: {
        //            stroke: 'orange'
        //        }
        //    }
        //})
    });


    paper.on('cell:pointerclickxxx', function(cellView) {
        var isElement = cellView.model.isElement();
        var type = cellView.model.type;
        var message = (isElement ? 'Element' : 'Link') + ' clicked';
        console.log(200,isElement);
        console.log(201,cellView);
        console.log(202,cellView.model.id);
    });


    paper.on({
        'element:contextmenu': onElementRightClick
    });

    function onElementRightClick(view) {
        console.log(300,view);
    }

    paper.on('cell:pointerdblclick', function(cellView) {
        var isElement = cellView.model.isElement();
        var type = cellView.model.type;
        var message = (isElement ? 'Element' : 'Link') + ' clicked';
        console.log(100,isElement);
        console.log(101,cellView);
        console.log(102,cellView.model.id);
        var nodeName = cellView.model.id;

        if (isElement) {
            if (type === 'object') {
                $('#node_object_dialog').css({display:'block'});
                console.log('object');
            } else if (type === 'attribute') {
                $('#node_attribute_dialog').css({display:'block'});
            } else if (type === 'process') {
                $('#node_process_dialog').css({display:'block'});
            } else if (type === 'action') {
                $('#node_action_dialog').css({display:'block'});
            }
        } else {
            $('.diagram_link_dialog').css({display:'block'});
        }

        var kbId = widget.options.kbId;
        var kb = AKT.kbs[kbId];

        var eventShiftKey = event ? event.shiftKey : null;
        var panel = new Panel('dialog_Generic', 
            eventShiftKey, 
            {left:'650px',top:'20px',width:'580px',height:'550px'},
            {widget_name:'statements', kbId:kbId, filters:{node_names:true,node_name_values:{start_name:nodeName,end_name:nodeName}}});

    });


    paper.on('element:mouseenter', function(element) {
    });


    paper.on('e:mouseleave', function(element) {
    });


    paper.on('link:mouseenter', function(linkView) {
        console.log(linkView);
        linkView.model.attr({
            line:{
                stroke:'blue',
                strokeWidth:3
            }
        });
        var sourceId = linkView.model.attributes.source.id;
        var source = graph.getCell(sourceId);
        source.attr({
            body:{
                stroke:'blue',
                strokeWidth:3
            }
        });
        source.resize(80,45);
        var targetId = linkView.model.attributes.target.id;
        var target = graph.getCell(targetId);
        target.attr({
            body:{
                stroke:'blue',
                strokeWidth:3
            }
        });
        target.resize(80,45);

        var kbId = AKT.state.current_kb;
        $(widget.element).find('.popup').css({visibility:'visible'});
        $(widget.element).find('.popup').html(AKT.KBs[kbId]._statements[linkView.model.id].english);
    });


    paper.on('link:mouseleave', function(linkView) {
        linkView.model.attr({
            line:{
                stroke:'red',
                strokeWidth:2
            }
        });
        var sourceId = linkView.model.attributes.source.id;
        var source = graph.getCell(sourceId);
        source.attr({
            body:{
                stroke:'red',
                strokeWidth:2
            }
        });
        source.resize(60,35);
        var targetId = linkView.model.attributes.target.id;
        var target = graph.getCell(targetId);
        target.attr({
            body:{
                stroke:'red',
                strokeWidth:2
            }
        });
        target.resize(60,35);
        $(widget.element).find('.popup').css({visibility:'hidden'});
    });



    graph.on('change:source change:target', function (link, collection, opt) {
        console.log('\n******* graph.on...()');

        var aktId = link.id;
        //var sourceId = link.get('source').id;
        //var source = graph.getCell(sourceId);
        //var sourcePadId = link.get('source').id;
        //var sourcePad = graph.getCell(sourcePadId);
        var sourceId = link.get('source').id;
        var source = graph.getCell(sourceId);
        //mytype = sourcePad.attributes.arcTypeId;
        mytype = AKT.state.mytype;

        var targetId = link.get('target').id;
        var target = graph.getCell(targetId);

        if (opt.ui && sourceId && targetId) {
            link.remove();
            createLink(aktId, sourceId, targetId, mytype);
        }
        saveDiagramToLocalStorage(graph, 'current');
    });

// ==================================  FUNCTIONS  ==================================

    // Create a link between a source element with id `s` and target element with id `t`.
    function createLink(aktId,sourceId, targetId, mytype) {
        console.log('createLink');
    /*
        (new joint.dia.Link({
            id: [s,t].sort().join(),
            source: { id: s },
            target: { id: t },
            z: -1,
            attrs: mode==='flow' ? attrs.linkFlow : attrs.linkInfluence
        })).addTo(graph);
        */
        var source = graph.getCell(sourceId);
        var target = graph.getCell(targetId);
    /*
        if (mytype === 'causes1way' || mytype === 'causes2way') {
            var link = new joint.dia.Link({
                id: [sourceId,targetId].sort().join(),
                source: { id: sourceId },
                target: { id: targetId },
                z: -1,
                attrs: {
                    '.marker-target': { d: 'M 14 0 L 0 7 L 14 14 z', fill:'#c0c0c0', stroke: 'black', 'stroke-width': 1 },
                    '.connection': { fill:'#c0c0c0', stroke: '#c0c0c0', 'stroke-width': 7 }
                }
            });
            link.addTo(graph);
            link.set('mytype',mytype);
    */
    /*
            var valveId = makeId('valve');
            var node = createNode(valveId,calculateMidnodePosition(source, target), 'valve');
            node.attr('body/magnet', true).attr('text/pointer-events', 'none');
            //node.set('stopDelegation',true);
            node.set('elementMove',false);
            node.set('link_id', link.id);  // These two lines reciprocally associate the valve node with the
            link.set('valve_id', node.id);  // flow link.  Note that having both violates DRY!
            //node.attr('circle/magnet', true).attr('text/pointer-events', 'none');
            // node.removeAttr('circle/magnet').removeAttr('text/pointer-events');
            mode = 'stock';
    */
        if (mytype === 'causes1way') {
            //(new joint.dia.Link({
            var along = 0.5;
            var link = new joint.shapes.standard.Link({
                akt_id: aktId,
                id: [sourceId,targetId].sort().join(),
                source: { id: sourceId },
                target: { id: targetId },
                along: along,
                smooth: true,
                z: -1,
                type:'causes1way',
                attrs: {
                    line: {
                        stroke: '#dd0000',
                        strokeWidth:2,
                    //'.marker-source': { d: 'M 12 0 L 0 6 L 12 12 z'},
                    //'.marker-target': { d: 'M 12 0 L 0 6 L 12 12 z'}
                        targetMarker: {
                            'fill': '#dd0000',
                            'stroke': 'none',
                            'type': 'path',
                            'd': 'M 12 -6 0 0 12 6 Z'
                        }
                    }
                    //'.marker-target': { d: 'M 32 0 L 0 6 L 12 12 z'},
                    //'.connection': { fill:'red', stroke: 'red', 'stroke-width': 1 }
                }
            });
            link.addTo(graph);
            console.log('\n...');
            link.set('akt_id',aktId);
            link.set('mytype',mytype);
            console.log(link);
            link.set('vertices', [calculateCurveVertexPosition(along, source, target)]);

        } else if (mytype === 'causes2way') {
            var along = 0.5;
            var link = new joint.shapes.standard.Link({
                akt_id: aktId,
                id: [sourceId,targetId].sort().join(),
                source: { id: sourceId },
                target: { id: targetId },
                along: along,
                smooth: true,
                z: -1,
                type: 'causes2way',
                attrs: {
                    line: {
                        stroke: '#dd0000',
                        strokeWidth:3,
                    //'.marker-source': { d: 'M 12 0 L 0 6 L 12 12 z'},
                    //'.marker-target': { d: 'M 12 0 L 0 6 L 12 12 z'}
                        sourceMarker: {
                            'fill': '#dd0000',
                            'stroke': 'none',
                            'type': 'path',
                            //'d': 'M 5 -10 L -15 0 L 5 10 Z'
                            'd': 'M 12 -6 0 0 12 6 Z'
                        },
                        targetMarker: {
                            'fill': '#dd0000',
                            'stroke': 'none',
                            'type': 'path',
                            'd': 'M 12 -6 0 0 12 6 Z'
                        }
                    }
                    //'.marker-target': { d: 'M 32 0 L 0 6 L 12 12 z'},
                    //'.connection': { fill:'red', stroke: 'red', 'stroke-width': 1 }
                }
            });
            link.addTo(graph);
            link.set('akt_id',aktId);
            link.set('mytype',mytype);
            link.set('vertices', [calculateCurveVertexPosition(along, source, target)]);

        } else if (mytype === 'link') {
            //(new joint.dia.Link({
            var along = 0.5;
            var link = new joint.shapes.standard.Link({
                id: [sourceId,targetId].sort().join(),
                source: { id: sourceId },
                target: { id: targetId },
                along: along,
                smooth: true,
                z: -1,
                type: 'link',
                attrs: {
                    line:{stroke:'blue'},
                    '.marker-target': { d: 'M 12 0 L 0 6 L 12 12 z'},
                    '.marker-source': { d: 'M 12 0 L 0 6 L 12 12 z'},
                    '.connection': { fill:'blue', stroke: 'blue', 'stroke-width': 3 },
                     sourceMarker: {
                            'fill': 'green',
                            'stroke': 'none',
                            //'d': 'M 5 -10 L -15 0 L 5 10 Z'
                            'd': 'M 10 -10 L -15 0 L 5 10 Z'
                      }

                }
            });
            link.addTo(graph);
            link.set('akt_id',aktId);
            link.set('mytype',mytype);
            link.set('vertices', [calculateCurveVertexPosition(along, source, target)]);
        }
        //link.on('mouseenter', function () {
        //    console.log(this);
        //});
        $('.diagram_button_left').css({border:'solid 1px #808080', background:'#f0f0f0'});
        AKT.state.mytype = 'pointer';
        _.each(graph.getElements(), function(el) {
            el.removeAttr('body/magnet').removeAttr('text/pointer-events');
        });
    }

    function calculateCurveVertexPosition(along, source, target) {
        var sx = source.attributes.position.x + 22;
        var sy = source.attributes.position.y + 17;
        var tx = target.attributes.position.x + 22;
        var ty = target.attributes.position.y + 17;
        var mx = (sx+tx)*along;
        var my = (sy+ty)*along;
        var hyp = Math.sqrt((tx-sx)**2 + (ty-sy)**2);
        return {x:mx-(ty-sy)*20/hyp, y:my+(tx-sx)*20/hyp};
    }


    // Create a node with `id` at the position `p`.
    function createNode(id, p, mytype) {
        console.log('createNode()');
        if (AKT.state.mytype === 'object') {  
            var node = new joint.shapes.standard.Rectangle();
            node.position(p.x-33, p.y-20);
            node.resize(60, 35);
            node.attr({
                body: {stroke: 'blue', strokeWidth: 2},
                label: {
                  /*textWrap: {
                        text:'grass leaf production and yield',
                        height: 35,
                        width: 50,
                        ellipsis: true
                    },*/
                    text: 'object',
                    textVerticalAnchor: 'top',
                    textAnchor: 'left',
                    refX: 4,
                    refY: 3,
                    fontSize:10,
                    style: { stroke: 'black', strokeWidth:0.3}
                }
            });
            node.type = 'object';
            node.addTo(graph);
            //node.on('pointerdown', function(element) {
                //mytype = element.attributes.arcTypeId;
            //    var mytype = AKT.state.mytype;
            //});
            node.on('change:position', function(element, position) {
                console.log('-->> node change:position');
                updateMidnodes(element);
                //updateLabelPosition(element);
                //updateArcPadPosition(element, 'flow');
                //updateArcPadPosition(element, 'influence');
            });
            //nodeLabel.attr('circle/magnet', true).attr('text/pointer-events', 'none');
            node.attr('body/magnet', true).attr('text/pointer-events', 'none');


        } else if (AKT.state.mytype === 'attribute') {
            var node = new joint.shapes.standard.Rectangle();
            node.position(p.x-33, p.y-20);
            node.resize(60, 35);
            node.attr({
                body: {stroke: 'brown', strokeWidth: 2},
                label: {
                    text: 'attribute', 
                    fontSize:10,
                    textVerticalAnchor: 'top',
                    textAnchor: 'left',
                    refX: 4,
                    refY: 3,
                    fontSize:10,
                    style: { stroke: 'black', strokeWidth:0.3}
                }
            });
            //node.type = 'attribute';
            node.type = 'attribute';
            node.addTo(graph);

        } else if (AKT.state.mytype === 'process') {      
            var node = new joint.shapes.standard.Ellipse();
            node.position(p.x-33, p.y-20);
            node.resize(65, 45);
            node.attr({
                body: {fill: 'white',stroke:'#00ff00',strokeWidth:2},
                label: {text: 'process', fontSize:10}
            });
            node.type = 'process';
            node.addTo(graph);

        } else if (AKT.state.mytype === 'action') {    
            var node = new joint.shapes.examples.CustomRectangle();
            node.position(p.x-33, p.y-20);
            node.resize(60,35);
            node.attr({
                body: {fill: 'white',stroke:'blue',strokeWidth:2},
                label: {text:'action', fontSize:10}
            });
            node.type = 'action';
            node.addTo(graph);
        }

        return node;
    }


    function process_node_or_link_button(button, group, type) {
        if (AKT.state.mytype === type) {
            $('.diagram_button_left').css({border:'solid 1px #808080', background:'#f0f0f0'});
            AKT.state.mytype = 'pointer';
            if (group === 'link') {
                _.each(graph.getElements(), function(el) {
                    el.removeAttr('body/magnet').removeAttr('text/pointer-events');
                });
            }
        } else {
            console.log('~');
            $('.diagram_button_left').css({border:'solid 1px #808080', background:'#f0f0f0'});
            $(button).css({border:'solid 1px #808080', background:'#88ff88'});
            AKT.state.mytype = type;
            if (group === 'link') {
                _.each(graph.getElements(), function(el) {
                    el.attr('body/magnet', true).attr('text/pointer-events', 'none');
                });
            }
        }
    }


    function makeId(mytype) {
        count[mytype] += 1;
        return mytype+count[mytype];
    }


    function resetAll(paper) {
        console.log('\n******* resetAll()');
        paper.drawBackground({
            color: 'white'
        })

        var elements = paper.model.getElements();
        for (var i = 0, ii = elements.length; i < ii; i++) {
            var currentElement = elements[i];
            currentElement.attr('body/stroke', 'black');
            currentElement.on('change', function () {
                console.log('xxx');
            });
        }

        var links = paper.model.getLinks();
        for (var j = 0, jj = links.length; j < jj; j++) {
            var currentLink = links[j];
            currentLink.attr('line/stroke', 'black');
            currentLink.label(0, {
                attrs: {
                    body: {
                        stroke: 'black'
                    }
                }
            })
        }
    }


    function saveDiagramToLocalStorage(graph, key) {
        console.log('\n102 function saveDiagramToLocalStorage',key);
        var jointObject = {nodes:[],links:[]};
        _.each(graph.getElements(), function(el) {
            jointObject.nodes.push(el.attributes);
        });
        _.each(graph.getLinks(), function(el) {
            jointObject.links.push(el.attributes);
        });
        console.log(jointObject);
        
        var diagramString = JSON.stringify(jointObject);
        localStorage.setItem(key, diagramString);
    }



    function updateMidnodes(element) {
        _.each(graph.getLinks(), function(link) {
            var sourceId = link.get('source').id;
            var targetId = link.get('target').id;
            if (element.id === sourceId || element.id === targetId) {
                // Calculate link mid-point (maybe JointJS geometry should be use instead?)
                var source = graph.getCell(sourceId);
                var target = graph.getCell(targetId);
                // Use actual width and height!
                var sx = source.attributes.position.x + 22;
                var sy = source.attributes.position.y + 17;
                var tx = target.attributes.position.x + 22;
                var ty = target.attributes.position.y + 17;

                // We need to re-calculate the link's vertex position (i.e.
                // the point that the curve goes through).    
                var along = link.attributes.along;
                var mx = (sx+tx)*along;
                var my = (sy+ty)*along;
                var hyp = Math.sqrt((tx-sx)**2 + (ty-sy)**2);
                link.set('vertices', [{x:mx-(ty-sy)*20/hyp, y:my+(tx-sx)*20/hyp}]);
            }
        });
    }


    console.log('End of setup');
};




AKT.widgetsdiagram_from_topic.display = function (widget) {
    console.log('\ndiagram:display() ',AKT.state);
    if (AKT.state.diagram_counter >= 1) {
        var diagram = AKT.state.current_diagram;  // The object, not the ID
        var graph = AKT.state.current_graph;  // The object, not the ID

        var jointObject = diagram.convertSystoToJoint();

        var nodes = jointObject.nodes;
        for (var i=0; i<nodes.length; i++) {
            var node = new joint.shapes.standard.Rectangle(nodes[i]);
                node.on('change:position', function(element, position) {
                    updateMidnodes(element);
                });
            node.addTo(graph);
        }
        var links = jointObject.links;
        for (var i=0; i<links.length; i++) {
            var link = new joint.shapes.standard.Link(links[i]);
            var source = graph.getCell(link.attributes.source.id);
            var target = graph.getCell(link.attributes.target.id);
            if (source && target) {   // TODO: temporary hack.  Need to see why some targets are undefined.
                link.set('vertices', [calculateCurveVertexPosition(0.5, source, target)]);
                link.addTo(graph);
            }
        }
    }


    function updateMidnodes(element) {
        _.each(graph.getLinks(), function(link) {
            var sourceId = link.get('source').id;
            var targetId = link.get('target').id;
            if (element.id === sourceId || element.id === targetId) {
                // Calculate link mid-point (maybe JointJS geometry should be use instead?)
                var source = graph.getCell(sourceId);
                var target = graph.getCell(targetId);
                // Use actual width and height!
                var sx = source.attributes.position.x + 22;
                var sy = source.attributes.position.y + 17;
                var tx = target.attributes.position.x + 22;
                var ty = target.attributes.position.y + 17;

                // We need to re-calculate the link's vertex position (i.e.
                // the point that the curve goes through).    
                var along = link.attributes.along;
                var mx = (sx+tx)*along;
                var my = (sy+ty)*along;
                var hyp = Math.sqrt((tx-sx)**2 + (ty-sy)**2);
                link.set('vertices', [{x:mx-(ty-sy)*20/hyp, y:my+(tx-sx)*20/hyp}]);
            }
        });
    }


    function calculateCurveVertexPosition(along, source, target) {
        var sx = source.attributes.position.x + 22;
        var sy = source.attributes.position.y + 17;
        var tx = target.attributes.position.x + 22;
        var ty = target.attributes.position.y + 17;
        var mx = (sx+tx)*along;
        var my = (sy+ty)*along;
        var hyp = Math.sqrt((tx-sx)**2 + (ty-sy)**2);
        return {x:mx-(ty-sy)*20/hyp, y:my+(tx-sx)*20/hyp};
    }

};


AKT.widgetsdiagram_from_topic.html = `
<div class="content" style="border:none;padding:5px;">

    <!-- ============== statement popup ================== -->
    <div class="popup" style="position:absolute; visibility:hidden; left:20px; top:50px; padding:4px; width:500px; border:solid 3px blue; background:#eeffee; z-index:10000;">Statement...</div>

    <!-- ============== top div ================= -->
    <div class="top_div" style="width:100%; background:#d4d0c8;"></div>
        <!--div style="float:left; margin-left:200px;">
            <input type="radio" id="all" name="view" value="all" checked>
            <label for="all">all</label>
            <input type="radio" id="causal" name="view" value="causal" style="margin-left:10px;">
            <label for="causal">causal</label>
            <input type="radio" id="link" name="view" value="link" style="margin-left:10px;">
            <label for="link">link</label>
        </div-->
        <!--input type="button" style="float:left;margin-left:8%;" id="'+instance+'_copy_to_clipboard" value="Copy to Clipboard"-->
        <div style="float:left;">Topics</div>
        <select class="listbox_topics" style="float:left; margin-left:5px;"></select>
        <input type="button" style="float:left;margin-left:10px;" class="button_display" value="Display">
        <!--input type="button" style="float:left;margin-left:10px;" id="'+instance+'_save diagram_save" value="Save">
        <input type="button" style="float:left;margin-left:10px;" id="'+instance+'_load diagram_load" value="Load">
        <input type="button" onclick="layout();" style="float:left;margin-left:3%;" id="'+instance+'_menu" value="Menu"-->
    </div>

    <!-- ============== main div ================= -->
    <!-- The container for left_div, right_div and diagram_div -->
    <div class="main_div w3-row">

        <!-- ============== left div ================= width: 110px; -->
        <div class="left_div w3-col w3-left w3-container" style="display:none;margin-top:0px; padding:5px; width:0px;">
            <fieldset style="position:static;">
                <legend>Add node</legend>
                <input type="button" class="button_add_object diagram_button_left node_object" value="Object"><br>
                <input type="button" class="button_add_attribute diagram_button_left node_attribute" value="Attribute"><br>
                <input type="button" class="button_add_process diagram_button_left node_process" value="Process"><br>
                <input type="button" class="button_add_action diagram_button_left node_action" value="Action"><br>
             </fieldset>

            <fieldset style="position:static;">
                <legend>Add link</legend>
                <input type="button" class="button_add_causes1way diagram_button_left link_causes1way" value="Causes1way" style="width:60px;"><br>
                <input type="button" class="button_add_causes2way diagram_button_left link_causes2way" value="Causes2way" style="width:60px;"><br>
                <input type="button" class="button_add_link diagram_button_left link_link" value="Link" style="width:60px;"><br>
             </fieldset>

            <fieldset style="position:static;">
                <legend>Delete</legend>
                <input type="button" class="button_delete_node_or_link diagram_button_left" value="Node/Link" style="width:60px;"><br>
             </fieldset>

            <fieldset style="position:static;">
                <legend>Hide</legend>
                <input type="button" class="button_hide_node_or_link diagram_button_left" value="Node/Link" style="width:60px;"><br>
             </fieldset>'

            <fieldset style="position:static;">
                <legend>Show/Hide</legend>
                <input type="button" class="button_show_hide_label diagram_button_left" value="Label" style="width:60px;"><br>
             </fieldset>
        </div>    <!-- End of left div -->

        <!-- ============== right div ================= width:130px; -->
        <div class="right_div w3-col w3-right w3-container" style="display:none; margin-top:0px; padding:5px; width:0px;">
            <fieldset style="position:static;">
                <legend>Zoom</legend>
                <input type="button" class="button_zoom_in diagram_button_right" value="Zoom in">
                <input type="button" class="button_zoom_out diagram_button_right" value="Zoom out">
                <input type="button" class="button_centre_zoom diagram_button_right" value="Centre Zoom">
             </fieldset>

            <fieldset style="position:static;">
                <legend>Label Mode</legend>
                <input type="button" class="button_label_mode_left" style="float:left;" value="&lt;">
                <input type="button" class="button_label_mode_right" style="float:left;" value="&gt;">
                <input type="button" class="button_label_mode_auto" style="float:left; width:40px;" value="Auto">
             </fieldset>

            <fieldset style="position:static;">
                <input type="button" class="button_refresh diagram_button_right" value="Refresh">
                <input type="button" class="button_show_paths diagram_button_right" value="Show Paths">
                <input type="button" class="button_print_window diagram_button_right" value="Print Window">
                <input type="button" class="button_statements diagram_button_right" value="Statements">
            </fieldset>

            <fieldset style="position:static;">
                <legend>Explore</legend>
                <input type="button" class="button_navigate diagram_button_right" value="Navigate">
                <input type="button" class="button_sources diagram_button_right" value="Sources">
                <input type="button" class="button_causes diagram_button_right" value="Causes">
                <input type="button" class="button_effects diagram_button_right" value="Effects">
                <input type="button" class="button_undo diagram_button_right" value="Undo">
             </fieldset>

            <fieldset style="position:static;">
                <legend>Select Diagram</legend>
                //'<label for="instance+'_select_diagram_left">&lt;</label>
                <input type="button" class="button_select_diagram_left" style="float:left; width:44px;" value="&lt;">
                <input type="button" class="button_select_diagram_right" style="float:left; width:44px;" value="&gt;">
             </fieldset>
        </div>

        <!-- =========== diagram div =================== -->
        <div class="w3-rest w3-container div_paper" style="background:#ffffa0;"></div>

    </div>  <!-- End of main_div, the w3.css container for left_div, right_div and diagram_div -->


    <!-- =========== DIALOGS ======================================================================= -->
    <!-- =========== node_object_dialog ============ -->
    <div id="node_object_dialog" class="dialog always_on_top" style="display:none; border:solid 1px black; position:absolute; backround:#d4d0c8; left:50px;top:80px;width:300px;height:185px;z-index:100000">

        <div>
            <div class="dialog_title" style="background:#e0e0e0;">
                <div style="float:left;margin-left:10px;">node_object_dialog</div>
                <input type="button" style="float:right;" value="X" class="dialog_close_button"/>
                <div style="clear:both;" />
            </div>
        </div>

        <div class="dialog_body" style="border:none; background:#d4d0c8;padding:10px; height:162px;">
            <div>
                <input type="text" style="float:right;" id="node_object_dialog_name" name="object_name"/>
                <div style="float:right;">Object name</div>
            </div>
            <div style="clear:both;"></div>
            <div>
                <input type="text" style="float:right;" id="node_object_dialog_partname" name="part_name"/>
                <div style="float:right;">Part name (optional)</div>
            </div>
            <div style="clear:both;"></div>
            <div>
                <input type="button" id="node_object_dialog_ok" style="float:right;" value="OK">
                <input type="button" id="node_object_dialog_cancel" style="float:right;" value="Cancel">
            </div>
        </div>
    </div>     <!-- End of dialog div -->

    <!-- =========== node_attribute_dialog ============ -->
    <div id="node_attribute_dialog" class="dialog always_on_top" style="display:none; position:absolute; border:solid 1px black; background:#d4d0c8;left:50px;top:80px;width:300px;height:185px;z-index:100000">

        <div class="dialog_title">
            <div class="dialog_id">node_attribute_dialog</div><input type="button" value="X" class="dialog_close_button"/>
        </div>

        <div class="dialog_body" style="border:none;background:#d4d0c8; padding:10px;height:162px;">
            <input type="text" style="float:right;" id="node_attribute_dialog_object_name">
            <label for="node_attribute_dialog_object_name" style="float:right;">Object name</label>
            <br/>

            <input type="text" style="float:right;" id="node_attribute_dialog_objectpart_name">
            <label for="node_attribute_dialog_objectpart_name" style="float:right;">Part name (optional)</label>
            <br/>

            <input type="text" style="float:right;" id="node_attribute_dialog_attribute_name">
            <label for="node_attribute_dialog_attribute_name" style="float:right;">Attribute name</label>
            <br/>
            <br/>

            <input type="button" id="node_attribute_dialog_ok" style="float:right;" value="OK">
            <input type="button" id="node_attribute_dialog_cancel" style="float:right;" value="Cancel">
        </div>
    </div>     <!-- End of dialog div -->


    <!-- =========== link_causes1way_dialog ============ -->
    <div id="link_causes1way_dialog" class="dialog always_on_top" style="display:none;position:absolute;border:solid 1px black; left:50px;top:80px;width:300px;height:185px;z-index:100000;">

        <div class="dialog_title">
            <div class="dialog_id">link_causes1way_dialog</div>link_causes1way_dialog<input type="button" value="X" class="dialog_close_button"/>
        </div>

        <div class="dialog_body" style="border:none; padding:10px;height:162px;">
            <input type="text" style="float:right;" id="link_causes1way_dialog_effectvalue">
            <label for="link_causes1way_dialog_effectvalue" style="float:right;">Effect value</label>
            <br/>
            <br/>

            <input type="button" id="node_object_dialog_ok" style="float:right;" value="OK">
            <input type="button" id="node_object_dialog_cancel" style="float:right;" value="Cancel">
        </div>
    </div>     <!-- End of dialog div -->


    <!-- =========== save_diagram_local_storage ============ -->
    <div id="save_diagram_local_storage" class="dialog always_on_top" style="display:none; position:absolute; border:solid 1px black; background:#d4d0c8;left:20px;top:40px;width:300px;height:185px;z-index:100000">

        <div class="dialog_title">
            <div class="dialog_id">save_diagram_local_storage</div>save_diagram_local_storage<input type="button" value="X" class="dialog_close_button"/>
        </div>

        <div class="dialog_body" style="border:none;background:#d4d0c8; padding:10px;height:162px;">
            <input type="text" style="float:right;" id="save_diagram_local_storage_title">
            <label for="save_diagram_local_storage_title" style="margin-right:5px;float:right;">Diagram title</label>
            <br/>
            <input type="button" id="save_diagram_local_storage_ok" style="float:right;" value="OK">
            <input type="button" id="save_diagram_local_storage_cancel" style="float:right;" value="Cancel">
        </div>
    </div>     <!-- End of dialog div -->


    <!-- =========== load_diagram_local_storage ============ -->
    <div id="load_diagram_local_storage" class="dialog always_on_top" style="display:none; position:absolute; border:solid 1px black; background:#d4d0c8;left:20px;top:40px;width:300px;height:185px;z-index:100000">

        <div class="dialog_title">
            <div class="dialog_id">load_diagram_local_storage</div>load_diagram_local_storage<input type="button" value="X" class="dialog_close_button"/>
        </div>

        <div class="dialog_body" style="border:none;background:#d4d0c8; padding:10px;height:162px;">
            <input type="text" style="float:right;" id="load_diagram_local_storage_title">
            <label for="load_diagram_local_storage_title" style="margin-right:5px;float:right;">Diagram title</label>
            <br/>
            <input type="button" id="load_diagram_local_storage_ok" style="float:right;" value="OK">
            <input type="button" id="load_diagram_local_storage_cancel" style="float:right;" value="Cancel">
        </div>
    </div>     <!-- End of dialog div -->



    <!-- =========== make_subdiagram ============ -->
    <div id="make_subdiagram" class="dialog always_on_top" style="display:none; position:absolute; border:solid 1px black; background:#d4d0c8;left:20px;top:40px;width:300px;height:185px;z-index:100000">

        <div class="dialog_title">
            <div class="dialog_id">make_subdiagram</div>make_subdiagram<input type="button" value="X" class="dialog_close_button"/>
        </div>

        <div class="dialog_body" style="border:none;background:#d4d0c8; padding:10px;height:162px;">
            <input type="text" style="float:right;" id="make_subdiagram_title">
            <label for="make_subdiagram_title" style="margin-right:5px;float:right;">Search expression</label>
            <br/>
            <input type="button" id="make_subdiagram_ok" style="float:right;" value="OK">
            <input type="button" id="make_subdiagram_cancel" style="float:right;" value="Cancel">
        </div>
    </div>     <!-- End of dialog div -->
</div>
`;



