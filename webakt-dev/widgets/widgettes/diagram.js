// 3 April 2022
// This is a merger of the original diagram.js (used for drawing diagrams; kept as diagram_frozen2.js), and the diagram.js
// which was used for displaying automatically-generated graph layouts for diagrams generated
// from causal links for a chosen topic (kept as diagram_layout_only_for_class.js).

// 28 April 2022
// Extracted code for putting up the "node template" dialog, to make it into a separate widget (node_details.js - 
// a widget, not a widgette).   

// 7 August 2023 Now made into a separate widgette.

AKT.widgets.diagram = {};


AKT.widgets.diagram.setup = function (widget) {
    console.log('Starting akt.diagram: setup()');

    AKT.state.current_widget = widget;

    var self = this;

    $('.dialog').draggable();


    $(widget.element).find('.diagram_button_left').css({width:'80px',padding:'2px'});
    $(widget.element).find('.diagram_button_right').css({width:'90px',padding:'3px'});

    $(widget.element).find('.table_attribute_cause_effect_values').css({
        'border-collapse':'collapse'});
    $(widget.element).find('.table_attribute_cause_effect_values tr').css({
        'border-collapse':'collapse'});
    $(widget.element).find('.table_attribute_cause_effect_values th').css({
        'border-collapse':'collapse', border:'solid 1px black', width:'70px', height:'20px'});
    $(widget.element).find('.table_attribute_cause_effect_values td').css({
        'border-collapse':'collapse',  'border':'solid 1px black', width:'70px', height:'20px'});

    var instance = "something_unique";  // .... the widget's UUID
    var kbId = widget.options.kbId;
    var kb = AKT.KBs[kbId];

    var diagram = new Diagram('new','systo');
    kb._diagrams.new = diagram;

    // Listbox with plain list of topics.
    var hierarchyId_filter = 'all';
    var topics = kb.findTopics({hierarchyId:hierarchyId_filter});
    for (var topicId in topics) {
        var topic = topics[topicId];
        var subgraph = diagram.makeSubgraph(topicId,false);
        var nNodes = Object.keys(subgraph.nodes).length; 
        var nArcs = Object.keys(subgraph.arcs).length;  

        var nConditional = 0;
        for (var iArc in subgraph.arcs) {
            var arc = subgraph.arcs[iArc];
            if (arc.type === 'condition') {
                nConditional += 1;               
            }
        }
        topic._info = topicId+': '+nNodes+'/'+nArcs+':'+nConditional;
    } 
 
    AKT.loadSelectOptions(widget.element, 'listbox_topics', topics, ['_id','_info'],{title:'_search_term'});
    // End of topics listbox

    var jgraph = new joint.dia.Graph;
    diagram.jgraph = jgraph;   // TODO: Change all graph to jgraph
    AKT.state.current_graph = jgraph;
    // Change width and height here to create a bigger canvas, and cause the panel itself to size accordingly.
    //var paper = new joint.dia.Paper({ el: $(widget.element).find('.div_paper'), width: 1100, height: 600, gridSize: 1, model: graph, linkPinning:false });
    var paper = new joint.dia.Paper({
        el: $(widget.element).find('.div_paper'), 
        width: 700, 
        height: 500, 
        gridSize: 1, 
        model: jgraph, 
        linkPinning:false });
    paper.scale(1);
    widget.scale = 1;


    $(widget.element).on( "resizexxx", function(event, ui) {
        var width = $(widget.element).width()-250;   //For when left and right button blocks are displayed...
        height = $(widget.element).height()-100;
        //var width = $(widget.element).width()-0;
        //var height = $(widget.element).height()-50;
        $(widget.element).find('.div_paper').css({width:width+'px',height:height+'px'});
        paper.scaleContentToFit({ padding: 10 });
    });

    
    // This is the info box that appears when e.g. user hovers over a jlink.
    // For future ref, try this wordwrapping function:
    // https://stackoverflow.com/questions/23823295/word-wrapping-in-jointjs
    var jlinkInfobox = new joint.shapes.standard.Rectangle();   
    //var jlinkInfobox = joint.shapes.basic.TextBlock();
    jlinkInfobox.position(300,300);  //This is set according to current mouse position.
    jlinkInfobox.resize(300, 90);
    jlinkInfobox.attr({
        body: {
            stroke: 'black', 
            strokeWidth: 1, 
            fill:'#f0f0a0', 
            display:'none'
        },
        label: {
            textWrap: {
                text: ''
            },
            textVerticalAnchor: 'top',
            textAnchor: 'left',
            refX: 4,
            refY: 3,
            fontSize:11,
            style: { stroke: 'black', strokeWidth:0.3}
        }
        //display: 'none'
    });
    jlinkInfobox.akt_type = 'attribute';
    jlinkInfobox.status = 'no_name';
    jlinkInfobox.addTo(jgraph);
    widget.jlinkInfobox = jlinkInfobox;


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


    // Store datalist option values in arrays, one for each syntactic element
    var syntacticElementTypes = ['actions', 'attributes','objects', 'parts', 'processes', 'values'];
    AKT.state.memory = {};
    $.each(syntacticElementTypes, function(i, type) {
        AKT.state.memory[type] = [];
        var list = $('#'+type).find('option');
        $.each(list, function(j,item) {
            AKT.state.memory[type].push(item.value);
        });
    });

    $('#cause_attval_options > input').attr('disabled','true');
    $('#effect_attval_options > input').attr('disabled','true');
    $('#cause_attval_options > label').css({color:'#808080'});
    $('#effect_attval_options > label').css({color:'#808080'});





// =========================  BUTTON EVENT HANDLERS  =======================================

    $(widget.element).find('.button_all').on('click', function () {
        event.stopPropagation();
        var kbId = widget.options.kbId;
        var kb = AKT.KBs[kbId];
        jgraph.clear();
        AKT.state.diagram_counter += 1;
        AKT.state.current_diagram = diagram;  // The object, not the ID

        var subgraph = {nodes:{},arcs:{}};  // This is the subgraph, for this diagram.

        var statements = kb._statements;
        for (var statementId in statements) {
            var statement = statements[statementId];
            var arc = statement._arc;
            if (arc) {
                var startNode = arc.start_node;
                var endNode = arc.end_node;
                subgraph.nodes[startNode.id] = startNode;
                subgraph.nodes[endNode.id] = endNode;
                subgraph.arcs[arc.id] = arc;
            }
        }

        diagram._subgraph = subgraph;
        diagram.graphLayoutSpringy(widget);
        $(widget.element).blur();
    });


    $('.diagram_save').on('click', function() {
        $('#save_diagram_local_storage').css({display:'block'});
    });


    $('.diagram_load').on('click', function() {
        jgraph.removeCells(jgraph.getElements());
        jgraph.removeLinks(jgraph.getLinks());
        $('#load_diagram_local_storage').css({display:'block'});
    });


    $('#save_diagram_local_storage_ok').on('click', function(event) {
        console.log('\n90. clicked on Save button');
        $('#save_diagram_local_storage').css({display:'none'});
        var title = $('#save_diagram_local_storage_title').val();
        saveDiagramToLocalStorage(jgraph, title);
    });


    $('#load_diagram_local_storage_ok').on('click', function(event,element) {
        $('#load_diagram_local_storage').css({display:'none'});
        var title = $('#load_diagram_local_storage_title').val();
        var diagramString = localStorage.getItem(title);
        var jointObject = JSON.parse(diagramString); 
        var nodes = jointObject.nodes;
        for (var i=0; i<nodes.length; i++) {
            var node = new joint.shapes.standard.Rectangle(nodes[i]);
            node.addTo(jgraph);
        }
        var links = jointObject.links;
        for (var i=0; i<links.length; i++) {
            console.log(links[i]);
            var link = new joint.shapes.standard.Link(links[i]);
            link.addTo(jgraph);
        }
    });



    $(widget.element).find('.link_causes1way_dialog_ok').on('click', function() {
        var kbId = AKT.state.current_kb;
        var kb = AKT.KBs[kbId];
        for (var i=1; i<=3; i++) {
            console.log('\n**',i);
            var sourceValue = $(this).parent().parent().find('.cause_value_'+i+' input').val();
            var targetValue = $(this).parent().parent().find('.effect_value_'+i+' input').val();
            if (sourceValue === '' && targetValue === '') break;

            console.log(i,sourceValue,targetValue);
            var sourceJson = JSON.parse(JSON.stringify(AKT.state.currentSourceNode.json));    // There has to be a better way.   Maybe
            var targetJson = JSON.parse(JSON.stringify(AKT.state.currentTargetNode.json));    // use a data-attribute, or a text field?
            console.log(6001,AKT.state);
            console.log(6002,JSON.stringify(sourceJson));
            console.log(6003,JSON.stringify(targetJson));
            // TODO: att_value must be treated separately for each of source and target nodes, since 
            // object/process/action don't have a value!
            if (sourceJson[0] === 'attribute') {
                sourceJson[0] = 'att_value';
            }
            if (targetJson[0] === 'attribute') {
                targetJson[0] = 'att_value';
            }
            if (sourceValue) {
                sourceJson.push(sourceValue);
            }
            if (targetValue) {
                targetJson.push(targetValue);
            }
            console.log(6004,JSON.stringify(sourceJson));
            console.log(6005,JSON.stringify(targetJson));
            var json = ['causes1way',sourceJson, targetJson];
            console.log(6006,JSON.stringify(json));
            var n = kb.findLargestIndex(kb._statements,'s')+1;
            var id = 's'+n;
            console.log(6007,id);
            var statement = new Statement({id:id,json:json});
            console.log(6008,statement);
            var formal = statement.makeFormalFromJson();
            console.log(6009,formal);
            var english = statement.makeEnglishFromJson();
            console.log(i,n,id);
            console.log(json);
            console.log(formal);
            kb._statements[id] = statement;
        }
        $(this).parent().parent().css({display:'none'});
    });

    // Click an Add Node button
    $('.button_add_node').on('click', function(event,item) {
        var category = event.currentTarget.dataset.category;  // 'node' or 'link'
        var type = event.currentTarget.dataset.type;
        process_node_or_link_button(this, category, type);   // 'attribute', 'object', 'process' or 'action'
    });

    // Click an Add Link button
    $('.button_add_link').on('click', function(event,item) {
        var category = event.currentTarget.dataset.category;  // 'node' or 'link'
        var type = event.currentTarget.dataset.type;   // 'causes1way', 'causes2way' or 'link'
        console.log('===',category,type);

        process_node_or_link_button(this, category, type);
    });


    $('.link_condition').on('click', function () {

        _.each(jgraph.getElements(), function(jnode) {
            if (jnode.attributes.size.width === 7) {  // TODO: Horrible way of finding vertex 
                                                      // node on causal arcs for condition arcs.
                jnode.attr('./display','block');
            }
        });

    });


    $('.button_delete_node_or_link').on('click', function () {
        var jgraph = diagram.jgraph;
        _.each(jgraph.getLinks(), function(jlink) {
            if (jlink.selected) {
                jgraph.getCell(jlink.id).remove();
            }
        });
        _.each(jgraph.getElements(), function(jnode) {
            if (jnode.selected) {
                _.each(jgraph.getLinks(), function(jlink) {
                    if (jlink.source.id===jnode.id || jlink.target.id===jnode.id) {
                        jgraph.getCell(jlink.id).remove();
                    }
                });
                jgraph.getCell(jnode.id).remove();
            }
        });
    });


    $('.button_zoom_in').on('click', function(event,item) {

        event.preventDefault();
        ev = event.originalEvent;

        console.log(V(paper.viewport).scale().sx);

        //var delta = Math.max(-1, Math.min(1, (0.5 || -ev.detail))) / 50;
        var scaleChange = 1/0.9;
        var offsetX = (ev.offsetX || ev.clientX - $(this).offset().left); // offsetX is not defined in FF
        var offsetY = (ev.offsetY || ev.clientY - $(this).offset().top); // offsetY is not defined in FF
        var p = offsetToLocalPoint(offsetX, offsetY);
        //var newScale = V(paper.viewport).scale().sx + delta; // the current paper scale changed by delta

        //if (newScale > 0.1 && newScale < 2) {
            paper.setOrigin(0, 0); // reset the previous viewport translation
            //paper.scale(newScale, newScale, p.x, p.y);
            widget.scale = widget.scale*scaleChange;
            paper.scale(widget.scale,widget.scale,550,300);
        //}

        function offsetToLocalPoint(x, y) {
            var svgPoint = paper.svg.createSVGPoint();
            svgPoint.x = x;
            svgPoint.y = y;
            // Transform point into the viewport coordinate system.
            var pointTransformed = svgPoint.matrixTransform(paper.viewport.getCTM().inverse());
            return pointTransformed;
        }
    });


    $('.button_zoom_out').on('click', function(event,item) {

        event.preventDefault();
        ev = event.originalEvent;

        //var delta = Math.max(-1, Math.min(1, (0.5 || -ev.detail))) / 50;
        var scaleChange = 0.9;
        var offsetX = (ev.offsetX || ev.clientX - $(this).offset().left); // offsetX is not defined in FF
        var offsetY = (ev.offsetY || ev.clientY - $(this).offset().top); // offsetY is not defined in FF
        var p = offsetToLocalPoint(offsetX, offsetY);
        //var newScale = V(paper.viewport).scale().sx + delta; // the current paper scale changed by delta

        console.log(offsetX,offsetY,p.x,p.y);
        //if (newScale > 0.25 && newScale < 4) {
            paper.setOrigin(0, 0); // reset the previous viewport translation
            //paper.scale(newScale, newScale, p.x, p.y);
            widget.scale = widget.scale*scaleChange;
            paper.scale(widget.scale,widget.scale,600,300);
        //}

        function offsetToLocalPoint(x, y) {
            var svgPoint = paper.svg.createSVGPoint();
            svgPoint.x = x;
            svgPoint.y = y;
            // Transform point into the viewport coordinate system.
            var pointTransformed = svgPoint.matrixTransform(paper.viewport.getCTM().inverse());
            return pointTransformed;
        }
    });

// ================================   Buttons in node and link creation dialogs
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
        jgraph.clear();
        var topicId = $(widget.element).find('.listbox_topics').val();
        AKT.state.diagram_counter += 1;
        AKT.state.current_diagram = diagram;  // The object, not the ID

        console.log('\n\nCalling diagram.makeSubgraph() from button_display');
        diagram._subgraph = diagram.makeSubgraph(topicId,true);
        console.log('\n==+++',diagram._subgraph);
        if (Object.keys(diagram._subgraph.arcs).length > 0) {
            diagram.graphLayoutSpringy(widget);
            $(widget.element).blur();
        } else {
            alert('There are no causal statements for the chosen topic.');
        }
        jlinkInfobox.addTo(jgraph);
    });


    $(widget.element).find('.checkbox_arc_info').on('click', function () {

        if ($(widget.element).find('.checkbox_arc_info').is(':checked')) {
        } else {
            jlinkInfobox.attr({
                body:{display:'none'},
                label:{display:'none'}
            });
        }
    });



// ===========================  JOINT HANDLERS  ===============================
/*   Left over from faied svg-drag-zoom experiment
    paper.on('blank:pointerdown', function() {
      panZoom.enablePan();
    });
      
    paper.on('blank:pointerup', function() {
      panZoom.disablePan();
    });
*/
// =============================================================================================
// Code for panning.
//First solution in https://stackoverflow.com/questions/28431384/how-to-make-a-paper-draggable/35149108#35149108
// Tried subsequent svg-pan-zoom.  Worked in standalone demo, but got some untraceable error when added in here.
// anyway, this very simple solution works finr, even with scaling.

    paper.on('blank:pointerdown', function(event, x, y) {
        //var scale = V(paper.viewport).scale(); 
        var scale = widget.scale;
        console.log('scale:',scale);
        widget.dragStartPosition = { x: x * scale, y: y * scale};    
    });


    paper.on('cell:pointerup blank:pointerup', function(cellView, x, y) {
        delete widget.dragStartPosition;
    });


    $(widget.element).find('.div_paper').mousemove(function(event) {
        if (widget.dragStartPosition) {
            paper.translate(event.offsetX - widget.dragStartPosition.x, 
                    event.offsetY - widget.dragStartPosition.y);
        }
    });

// ===============================================================================================


    paper.on('blank:pointerdblclick', function(evt, x, y) {
        console.log('diagram.js: paper.on("blank:pointerdblclick"');
        evt.stopPropagation();
        var kbId = widget.options.kbId;
        var kb = AKT.KBs[kbId];

        var nodeTypes = {attribute:true, object:true, process:true, action:true};
        var nodeType = AKT.state.mytype;
        console.log(':::',nodeType,x,y);

        $('.diagram_button_left').css({border:'solid 1px #808080', background:'#f0f0f0'});

        var panel = AKT.panelise({
            widget_name:'node_details',
            position:{left:'20px',top:'20px'},
            size:{width:'410px',height:'375px'},
            shift_key: event.shiftKey,
            options:{
                kbId:kbId, 
                opened_by_widgie:widget,
                diagram:  diagram,
                mode:     'new_node',
                node_type:nodeType,
                x:        x,
                y:        y
            }
        });

        AKT.state.mytype = 'pointer';
    });



    //====================================================

    paper.on('element:pointerdblclick', function(elementView) {
        AKT.state.currentElement = elementView.model;
    });


    paper.on({
        'element:contextmenu': onElementRightClick
    });

    function onElementRightClick(view) {
    }


    // -------------------------------------------------------------
    // NODE ("ELEMENT") EVENTS

    paper.on('element:pointerdblclick', function(elementView) {
        console.log('diagram.js paper.on("cell:pointerdblclick"');
        //var isElement = cellView.model.isElement();
        //var type = cellView.model.type;
        //var message = (isElement ? 'Element' : 'Link') + ' clicked';

        var jnode = elementView.model;

        //if (isElement) {
            /*$('#div_node_details_dialog').node_details('option',{
                mode:'node',   // Alternatives are statement types ('attval','cause','effect')
                node_type:type, 
                node_id:cellView.model.id, 
                node:cellView.model
            });
            $('#div_node_details_dialog').css({display:'block'});*/
        $(widget.element).dialog_Generic('option','mode','node');
        $(widget.element).dialog_Generic('option','node_type',jnode.akt_type);
        $(widget.element).dialog_Generic('option','node_id',jnode.id);
        $(widget.element).dialog_Generic('option','node',jnode);
        $(widget.element).css('display','block');
        var kbId = widget.options.kbId;
        var kb = AKT.kbs[kbId];

        var panel = AKT.panelise({
            widget_name:'node_details',
            position:{left:'20px',top:'20px'},
            size:{width:'410px',height:'375px'},
            shift_key: event.shiftKey,
            options:{kbId:kbId, opened_by_widgie:widget,
                diagram:  diagram,
                mode:     'node',  // TODO: Not needed!
                node_type:jnode.akt_type, 
                node_id:  jnode.id, 
                node:     jnode}
        });

        var kbId = widget.options.kbId;
        var kb = AKT.kbs[kbId];
    });



    paper.on('element:pointerclick', function(elementView) {
        console.log('\ndiagram.js: paper.on("element:pointerclick"');
        var jnode = elementView.model;
        console.log(jnode.selected,jnode.attributes.attrs);
        console.log(jnode);

        if (jnode.selected) {
            jnode.attr({
                body: {
                    stroke: 'black', 
                    strokeWidth: 1, 
                    fill:'white'
                }
            });
            jnode.selected = false;
        
        } else {
            jnode.attr({
                body: {
                    stroke: 'blue', 
                    strokeWidth: 2, 
                    fill:'white'
                }
            });
            jnode.selected = true;
        }
    });


    paper.on('element:pointermove', function (jnodeView) {
        var jnode = jnodeView.model;
        _.each(jgraph.getLinks(), function(jlink) {
            if (jlink.attributes.source.id===jnode.id || jlink.attributes.target.id===jnode.id) {
                if (jlink.jnode_vertex && jlink.jnode_vertex.position) {  // See comment for link:pointermove
                    jlink.jnode_vertex.position(jlink.attributes.vertices[0].x-5,jlink.attributes.vertices[0].y-5);
                }
            }
        });
    });

    paper.on('element:mouseenterxxx', function(element) {
    });


    paper.on('element:mouseleavexxx', function(element) {
    });


    // -------------------------------------------------------------
    // ARC ("LINK") EVENTS

    paper.on('link:pointermove', function (jlinkView) {
        var jlink = jlinkView.model;
        // Not sure why jlink does not have a jnode_vertex for one arc.   So following test is
        // a hack to stop the console error messages.  I think, but am not sure, that this
        // is a separate issue from the jnode_vertex on the condition arc not moving when (and 
        // only when) a node on the causal arc it points to is moved.
        if (jlink.jnode_vertex && jlink.jnode_vertex.position) {
            jlink.jnode_vertex.position(jlink.attributes.vertices[0].x-5,jlink.attributes.vertices[0].y-5);
        }
    });


    // This event is triggered in two quite different situations.

    // First, when the user drags an arc to change its shape.   In this case,
    // all we do is recalculate and change the jlink along and offset parameters.

    // Second, when a new jlink is drawn between 2 nodes.   In this case,
    // the temporary link that is drawn as the user moves the mouse between
    // the 2 nodes (a straight line) is replaced by a webAKT one, created with
    // diagram.createJlink().  
    paper.on('link:pointerup', function(linkView) {
        console.log('diagram.js: paper.on("link:pointerup"');
        console.log('linkView.model:',linkView.model);
        console.log('mytype:',AKT.state.mytype);

        var jlink = linkView.model;

        // This is for when the user has just finished dragging an existing jlink...
        if (jlink.along) {  // Existing link test: the jlink already has an 'along' property.
            var jlinkParams = jlink.calculateParams(); // Re-calculate the parameters
            jlink.along = jlinkParams.along;
            jlink.offset = jlinkParams.offset;

        // ... and this is for the first time, when a new link has just been dragged.
        } else {   // The jlink doesn't already have an 'along' property.
            var type = AKT.state.mytype;  // From the jlink type button the user has clicked.
            console.log(type);

            try {
                var along = 0.5;
                var offset = 20;
                jgraph.getCell(linkView.model.id).remove(); // Remove the temporary link -
                                // the straight line displayed when the link is dragged.
                var sourceId = linkView.model.attributes.source.id;
                var targetId = linkView.model.attributes.target.id;
       
                var arc = {
                    id: sourceId+'__'+targetId,
                    start_node: {id:sourceId},
                    end_node: {id:targetId},
                    along: along,
                    offset: offset,
                    type: type
                };
                diagram.createJlink(arc);

            } catch (error) {
                console.error(error);
            }
        }
    });


    paper.on('link:mouseover', function(linkView, event) {
        if ($(widget.element).find('.checkbox_arc_info').is(':checked')) {
            var jlink = linkView.model;
            //console.log(jlink);
            //console.log(jlink.arc.statements);
            //var x = jlink.attributes.vertices[0].x;
            //var y = jlink.attributes.vertices[0].y;
            if (jlink.arc && jlink.arc.statements) {
                jlinkInfobox.position(event.originalEvent.offsetX+15,event.originalEvent.offsetY);
                //jlinkInfobox.position(x+15,y);  //This is set according to current mouse position.
                var statements = jlink.arc.statements;
                var text = '';
                for (var i=0; i<statements.length; i++) {
                    if (i>0) text += '\n';
                    text += statements[i]._id+': '+statements[i]._formal.replaceAll(',',', ');
                    //var textWrapped = AKT.mywrap(statement._formal,100).wrappedString;
                }
                jlinkInfobox.attr({
                    body:{display:'block'},
                    label:{
                        //text:statement._id+': '+text,
                        textWrap:{text:text,width:200,height:null},
                        display:'block'
                    }
                });
                jlinkInfobox.toFront();
            }
        }
    });


    paper.on('link:pointerclick', function(linkView) {
        console.log('diagram.js: paper.on("link:pointerclick"');
        var jlink = linkView.model;

        if (jlink.selected) {
            jlink.attr({
                line:{
                    stroke:'#dd0000',
                    strokeWidth:2,
                    targetMarker: {
                        'fill': '#dd0000',
                        'stroke': 'none',
                        'type': 'path',
                        'd': 'M 12 -6 0 0 12 6 Z'
                    }
                }
            });
            jlink.selected = false;
        
        } else {
            jlink.attr({
                line:{
                    stroke:'#0000dd',
                    strokeWidth:3,
                    targetMarker: {
                        'fill': '#0000dd',
                        'stroke': 'none',
                        'type': 'path',
                        'd': 'M 12 -6 0 0 12 6 Z'
                    }
                }
            });
            jlink.selected = true;
        }
    });


    paper.on('link:pointerdblclick', function(linkView) {
        console.log('diagram.js: paper.on("link:pointerdblclick"');

        var jlink = linkView.model;
        if (jlink.attributes.type === 'condition') {
            return;
        }

        jlink.attr({
            line:{
                stroke:'green',
                strokeWidth:3
            }
        });
        var sourceId = linkView.model.attributes.source.id;
        var jnodeSource = jgraph.getCell(sourceId);
        console.log('jnodeSource:',jnodeSource);
        AKT.state.currentSourceNode = jnodeSource;
        jnodeSource.attr({
            body:{
                stroke:'blue',
                strokeWidth:1
            }
        });
        var targetId = linkView.model.attributes.target.id;
        var jnodeTarget = jgraph.getCell(targetId);
        console.log('jnodeTarget:',jnodeTarget);
        AKT.state.currentTargetNode = jnodeTarget;
        jnodeTarget.attr({
            body:{
                stroke:'blue',
                strokeWidth:1
            }
        });

        var kbId = AKT.state.current_kb;

        var dialog = $(widget.element).find('.link_causes1way_dialog');
        dialog.find('.span_source').text(jnodeSource.makeNodeName(jnodeSource.json)+': '+jnodeSource.makeNodeFormal(jnodeSource.json));
        dialog.find('.span_target').text(jnodeTarget.makeNodeName(jnodeTarget.json)+': '+jnodeTarget.makeNodeFormal(jnodeTarget.json));

        if (jnodeSource.json[0] === 'attribute'){
            dialog.find('.table_attribute_cause_values').css({display:'block'});
        } else {
            dialog.find('.table_attribute_cause_values').css({display:'none'});
        }
        if (jnodeTarget.json[0] === 'attribute'){
            dialog.find('.table_attribute_effect_values').css({display:'block'});
        } else {
            dialog.find('.table_attribute_effect_values').css({display:'none'});
        }

        dialog.css({display:'block'});
    });


// ==================================== CUSTOM EVENT LISTENERS =====================

    // This custom event is triggered when the graph is ready to be rendered,
    // i.e. when the Springy.Renderer's "done()" method (in the Diagram.
    // graphLayoutSpringy method) is being executed.
    $(document).on('diagram_ready_event', function(event,args) {
        console.log(args);
        if (AKT.state.diagram_counter >= 1) {
            var diagram = AKT.state.current_diagram;  // The object, not the ID
            diagram.render('jointjs');
        }
    });


    // This custom event is triggered when a node has been edited, and the OK button
    // clicked.
    $(document).on('node_edited_event', function(event,args) {
        console.log(args);
    });


// ==================================  FUNCTIONS  ==================================


    // --------------------------------------------------------------------------------

    function process_node_or_link_button(button, group, type) {
        if (AKT.state.mytype === type) {
            $('.diagram_button_left').css({border:'solid 1px #808080', background:'#f0f0f0'});
            AKT.state.mytype = 'pointer';
            if (group === 'link') {
                _.each(jgraph.getElements(), function(el) {
                    el.removeAttr('body/magnet').removeAttr('text/pointer-events');
                });
            }
        } else {
            $('.diagram_button_left').css({border:'solid 1px #808080', background:'#f0f0f0'});
            $(button).css({border:'solid 1px #808080', background:'#88ff88'});
            AKT.state.mytype = type;
            console.log('====',group,type);
            if (group === 'link') {
                _.each(jgraph.getElements(), function(el) {
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


    function saveDiagramToLocalStorage(jgraph, key) {
        //console.log('\n102 function saveDiagramToLocalStorage',key);
        var jointObject = {nodes:[],links:[]};
        _.each(jgraph.getElements(), function(el) {
            jointObject.nodes.push(el.attributes);
        });
        _.each(jgraph.getLinks(), function(el) {
            jointObject.links.push(el.attributes);
        });
        //console.log(jointObject);
        
        var diagramString = JSON.stringify(jointObject);
        localStorage.setItem(key, diagramString);
    }

    // IMPORTANT: See https://jsfiddle.net/ubj194ps/
    // and my demo at webakt_extra/JointJS,
    // and the svg-pan-zoom page at https://www.npmjs.com/package/svg-pan-zoom?activeTab=readme
    // and this StackOverflow page: https://stackoverflow.com/questions/28431384/how-to-make-a-paper-draggable/35149108#35149108
/*
    const panZoom = svgPanZoom(paper.svg, {
        viewportSelector: paper.layers,
        zoomEnabled: true,
        panEnabled: true,
        controlIconsEnabled: true,
        maxZoom: 2,
        minZoom: 0.1,
        onUpdatedCTM: (function() {
          var currentMatrix = paper.matrix();
          console.log(currentMatrix);
        	return function onUpdatedCTM(matrix) {
             const { a, d, e, f } = matrix;
             const { a: ca, d: cd, e: ce, f: cf } = currentMatrix;         
             const translateChanged = (e !== ce || f !== cf)
             if (translateChanged) {
	             paper.trigger('translate', e - ce, f - cf);
             }
             const scaleChanged = (a !== ca || d !== cd);         
             if (scaleChanged) {
	             paper.trigger('scale', a, d, e, f);
             }
             currentMatrix = matrix;
          }
        })()
    });
*/
    console.log('End of setup');
};




AKT.widgets.diagram.display = function (widget) {
    console.log('\ndiagram:display() ',AKT.state,widget.options);
    if (AKT.state.diagram_counter >= 1) {
        var diagram = AKT.state.current_diagram;  // The object, not the ID
        diagram.render('jointjs');
    }
};




AKT.widgets.diagram.html = `
<div class="content" style="border:none;padding:5px;">

    <!-- ============== statement popup ================== -->
    <div class="popup" style="position:absolute; visibility:hidden; left:20px; top:50px; padding:4px; width:500px; border:solid 3px blue; background:#eeffee; z-index:10000;">Statement...</div>

    <!-- ============== top div ================= -->
    <div class="top_div" style="width:100%; background:#d4d0c8;"></div>
        <div style="float:left; margin-left:10px;">
            <input type="radio" id="all" name="view" value="all" checked>
            <label for="all">all</label>
            <input type="radio" id="causal" name="view" value="causal" style="margin-left:10px;">
            <label for="causal">causal</label>
            <input type="radio" id="link" name="view" value="link" style="margin-left:10px;">
            <label for="link">link</label>
        </div>
        <!--input type="button" style="float:left;margin-left:8%;" id="'+instance+'_copy_to_clipboard" value="Copy to Clipboard"-->
        <!--input type="button" style="float:left;margin-left:8%;" id="load_acheampong" value="Load acheampong">
        <input type="button" style="float:left;margin-left:8%;" id="show_acheampong" value="Show acheampong"-->

        <div style="float:left;margin-left:30px;">Topic</div>
        <select class="listbox_topics" style="float:left; margin-left:5px;"></select>
        <input type="button" style="float:left;margin-left:10px;" class="button_display" value="Display">

        <input type="button" style="float:left;margin-left:10px;" id="'+instance+'_save diagram_save" value="Save">
        <input type="button" style="float:left;margin-left:10px;" id="'+instance+'_load diagram_load" value="Load">
        <input type="button" onclick="layout();" style="float:left;margin-left:3%;" id="'+instance+'_menu" value="Menu">
    </div>

    <!-- ============== main div ================= -->
    <!-- The container for left_div, right_div and diagram_div -->
    <div class="main_div w3-row">

        <!-- ============== left div ================= -->
        <div class="left_div w3-col w3-left w3-container" style="margin-top:0px; padding:5px; width:110px;">
            <fieldset style="position:static;">
                <legend>Add node</legend>
                <input type="button" class="button_add_node button_add_attribute diagram_button_left node_attribute" data-category="node" data-type="attribute" value="Attribute"><br>
                <input type="button" class="button_add_node button_add_object diagram_button_left node_object" data-category="node" data-type="object" value="Object"><br>
                <input type="button" class="button_add_node button_add_process diagram_button_left node_process" data-category="node" data-type="process"  value="Process"><br>
                <input type="button" class="button_add_node button_add_action diagram_button_left node_action" data-category="node" data-type="action" value="Action"><br>
             </fieldset>

            <fieldset style="position:static;">
                <legend>Add link</legend>
                <input type="button" class="button_add_link button_add_causes1way diagram_button_left link_causes1way" data-category="link" data-type="causes1way" value="Causes1way" style="width:60px;"><br>
                <input type="button" class="button_add_link button_add_causes2way diagram_button_left link_causes2way" data-category="link" data-type="causes2way" value="Causes2way" style="width:60px;"><br>
                <input type="button" class="button_add_link button_add_link diagram_button_left link_link" data-category="link" data-type="link" value="Link" style="width:60px;"><br>
                <input type="button" class="button_add_link button_add_link diagram_button_left link_condition" data-category="link" data-type="condition" value="Condition" style="width:60px;"><br>
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
                <input type="checkbox" class="checkbox_node_info" style="float:left;" value="node_info" style="width:60px;">&nbsp;Node info</input><br/>
                <input type="checkbox" class="checkbox_arc_info" style="float:left;" value="arc_info" style="width:60px;">&nbsp;Arc info</input>
             </fieldset>
        </div>    <!-- End of left div -->

        <!-- ============== right div ================= -->
        <div class="right_div w3-col w3-right w3-container" style="margin-top:0px; padding:5px; width:130px;">
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
        <div id="paper" class="w3-rest w3-container div_paper" style="background:white; width:500px; height:500px;"></div>

    </div>  <!-- End of main_div, the w3.css container for left_div, right_div and diagram_div -->


    <!-- =========== DIALOGS ======================================================================= -->

    <!-- =========== link_causes1way_dialog ============ -->
    <div class="dialog always_on_top link_causes1way_dialog" style="display:none;position:absolute;border:solid 1px black; background:white; left:50px;top:80px;padding-bottom:10px;z-index:100000;">

        <div class="dialog_title" style="background:#ffa0a0;">
            <div class="dialog_id">link_causes1way_dialog</div>link_causes1way_dialog
        </div>

        <div class="dialog_body" style="border:none; padding:10px;">
            <div><span>Cause: </span><span class="span_source"></span></span></div>
            <div><span>Effect:</span><span class="span_target"></span></span></div>

            <div>
                <table class="table_attribute_cause_values" style="float:left;">
                    <tr>
                        <th>Cause attribute's value</td>
                    </tr>
                    <tr>
                        <td class="cause_value_1"><input type="text" style="background:white;"></input></td>
                    </tr>
                    <tr>
                        <td class="cause_value_2"><input type="text" style="background:white;"></input></td>
                    </tr>
                    <tr>
                        <td class="cause_value_3"><input type="text" style="background:white;"></input></td>
                    </tr>
                </table>
                <table class="table_attribute_effect_values" style="float:left;">
                    <tr>
                        <th>Effect attribute's value</td>
                    </tr>
                    <tr>
                        <td class="effect_value_1"><input type="text" style="background:white;"></input></td>
                    </tr>
                    <tr>
                        <td class="effect_value_2"><input type="text" style="background:white;"></input></td>
                    </tr>
                    <tr>
                        <td class="effect_value_3"><input type="text" style="background:white;"></input></td>
                    </tr>
                </table>
                <div style="clear:both;"></div>
            </div>

            <input type="button" class="link_causes1way_dialog_ok" style="float:right;" value="OK">
            <input type="button" class="link_causes1way_dialog_cancel" style="float:right;" value="Cancel">
        </div>
    </div>     <!-- End of dialog div -->



    <!-- ------------------------------------------------------------------------ -->
    <!-- Node template dialog (container element for the node_details.js widget) -->
    <!--div id="div_node_details_dialog" class="dialog always_on_top" style="display:none; position:absolute; border:solid 1px black; background:#d4d0c8;left:50px;top:80px;z-index:100000">
    </div-->


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


