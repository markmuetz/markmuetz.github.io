(function ($) {

  /***********************************************************
   *         diagram1 widget
   ***********************************************************
   See bottom of file for JointJS tips!
   */
    $.widget('akt.diagram1', {
        meta:{
            short_description: 'Displays causal and link relationships',
            long_description: 'Displays causal and link relationships.  This is the version that is used when accessed from the Diagram menu.   The alternative is the "diagram_only" widget, but this is accessed via the Tools menu.   Currently (Dec 2021) diagram_only seems to be not working, although potentially it could be better (with e.g. the abilityto drag the canvas around).',
            author: 'Robert Muetzelfeldt',
            last_modified: 'Dec 2021',
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

        widgetEventPrefix: 'diagram1:',

        _create: function () {
            console.log('\n### Creating instance of widget "akt.diagram1".',
                '\nElement ID:',this.element[0].id,'  Widget UUID:',this.uuid,'  Options:',this.options);
            var self = this;
            this.element.addClass('diagram1-1');

            var kb = self.options.kb;
            var results = evaluate(kb);
            display(self, results);

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('diagram1-1');
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


function layout() {
var graphBBox = joint.layout.DirectedGraph.layout(graph, {
    nodeSep: 50,
    edgeSep: 80,
    rankDir: "TB"
});
}


    function evaluate(kb) {
        console.log('Starting akt.diagram1: evaluate()');
        return null;
    }


    function display(widget, results) {
        console.log('Starting akt.diagram1: display()');

        var instance = "something_unique";  // .... the widget's UUID
        var kb = widget.options.kb;

        if (widget.options.show_titlebar) {
            var widgetTitlebar = $('<div class="titlebar">diagram1<input type="button" value="X" class="dialog_close_button"/></div>');  
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
       
        var topDiv = $('<div id="'+instance+'_top_div" style="width:100%; background:#d4d0c8;"></div>');
        $(widgetContent).append(topDiv);
        $(topDiv).append('<div style="float:left;">diagram1 106</div>');
        $(topDiv).append(
        '<div style="float:left; margin-left:10%;">'+
            '<input type="radio" id="all" name="view" value="all" checked>'+
            '<label for="all">all</label>'+
            '<input type="radio" id="causal" name="view" value="causal" style="margin-left:10px;">'+
            '<label for="causal">causal</label>'+
            '<input type="radio" id="link" name="view" value="link" style="margin-left:10px;">'+
            '<label for="link">link</label>'+
        '</div>');
function layout() {
var graphBBox = joint.layout.DirectedGraph.layout(graph, {
    nodeSep: 50,
    edgeSep: 80,
    rankDir: "TB"
});
}
        $(topDiv).append(
            '<input type="button" style="float:left;margin-left:8%;" id="'+instance+'_copy_to_clipboard" value="Copy to Clipboard">'+
            '<input type="button" style="float:left;margin-left:10px;" id="'+instance+'_save" class="diagram1_save" value="Save">'+
            '<input type="button" style="float:left;margin-left:10px;" id="'+instance+'_load" class="diagram1_load" value="Load">'+
            '<input type="button" onclick="layout();" style="float:left;margin-left:3%;" id="'+instance+'_menu" value="Menu">');

        // The <div> panels holding the left and right controls, and the diagram1 between them.
        // Note that the order of declaring the 3 divs is important (I think).
        var mainDiv = $('<div class="w3-row"></div>');
        $(widgetContent).append(mainDiv);


        var leftDiv = $('<div id="'+instance+'_left_div" class="w3-col w3-left w3-container" style="margin-top:0px; padding:5px; width:110px;"></div>');
        var rightDiv = $('<div id="'+instance+'_right_div" class="w3-col w3-right w3-container" style="margin-top:0px; padding:5px; width:130px;"></div>');
        //var diagram1Div = $('<div id="'+instance+'_diagram1_div" class="w3-rest w3-container" style="background:white; height:90%;"></div>');
        var diagram1Div = $('<div id="diagram1" class="w3-rest w3-container" style="oveflow:scroll; background:pink; width:600px;height:600px;"></div>');
        $(mainDiv).append(leftDiv).append(rightDiv).append(diagram1Div);

       // Left-hand panel
       $(leftDiv).append(
        '<fieldset style="position:static;">'+
            '<legend>Add node</legend>'+
            '<input type="button" id="'+instance+'_add_object" class="diagram1_button_left node_object" value="Object"><br>'+
            '<input type="button" id="'+instance+'_add_attribute" class="diagram1_button_left node_attribute" value="Attribute"><br>'+
            '<input type="button" id="'+instance+'_add_process" class="diagram1_button_left node_process" value="Process"><br>'+
            '<input type="button" id="'+instance+'_add_action" class="diagram1_button_left node_action" value="Action"><br>'+
         '</fieldset>');
        $(leftDiv).append(
        '<fieldset style="position:static;">'+
            '<legend>Add link</legend>'+
            '<input type="button" id="'+instance+'_add_causes1way" class="diagram1_button_left link_causes1way" value="Causes1way" style="width:60px;"><br>'+
            '<input type="button" id="'+instance+'_add_causes2way" class="diagram1_button_left link_causes2way" value="Causes2way" style="width:60px;"><br>'+
            '<input type="button" id="'+instance+'_add_link" class="diagram1_button_left link_link" value="Link" style="width:60px;"><br>'+
         '</fieldset>');
        $(leftDiv).append(
        '<fieldset style="position:static;">'+
            '<legend>Delete</legend>'+
            '<input type="button" id="'+instance+'_delete_node_or_link" class="diagram1_button_left" value="Node/Link" style="width:60px;"><br>'+
         '</fieldset>');
        $(leftDiv).append(
        '<fieldset style="position:static;">'+
            '<legend>Hide</legend>'+
            '<input type="button" id="'+instance+'_hide_node_or_link" class="diagram1_button_left" value="Node/Link" style="width:60px;"><br>'+
         '</fieldset>');
        $(leftDiv).append(
        '<fieldset style="position:static;">'+
            '<legend>Show/Hide</legend>'+
            '<input type="button" id="'+instance+'_show_hide_label" class="diagram1_button_left" value="Label" style="width:60px;"><br>'+
         '</fieldset>');


        // Right-hand panel
        $(rightDiv).append(
        '<fieldset style="position:static;">'+
            '<legend>Zoom</legend>'+
            '<input type="button" id="'+instance+'_zoom_in" class="diagram1_button_right" value="Zoom in">'+
            '<input type="button" id="'+instance+'_zoom_out" class="diagram1_button_right" value="Zoom out">'+
            '<input type="button" id="'+instance+'_centre_zoom" class="diagram1_button_right" value="Centre Zoom">'+
         '</fieldset>');

        $(rightDiv).append(
        '<fieldset style="position:static;">'+
            '<legend>Label Mode</legend>'+
            '<input type="button" id="'+instance+'_label_mode_left" style="float:left;" value="&lt;">'+
            '<input type="button" id="'+instance+'_label_mode_right" style="float:left;" value="&gt;">'+
            '<input type="button" id="'+instance+'_label_mode_auto" style="float:left; width:40px;" value="Auto">'+
         '</fieldset>');
        $(rightDiv).append(
        '<fieldset style="position:static;">'+
            '<input type="button" id="'+instance+'_refresh" class="diagram1_button_right" value="Refresh">'+
            '<input type="button" id="'+instance+'_show_paths" class="diagram1_button_right" value="Show Paths">'+
            '<input type="button" id="'+instance+'_print_window" class="diagram1_button_right" value="Print Window">'+
            '<input type="button" id="'+instance+'_statements" class="diagram1_button_right" value="Statements">'+
        '<fieldset>');
        $(rightDiv).append(
        '<fieldset style="position:static;">'+
            '<legend>Explore</legend>'+
            '<input type="button" id="'+instance+'_navigate" class="diagram1_button_right" value="Navigate">'+
            '<input type="button" id="'+instance+'_sources" class="diagram1_button_right" value="Sources">'+
            '<input type="button" id="'+instance+'_causes" class="diagram1_button_right" value="Causes">'+
            '<input type="button" id="'+instance+'_effects" class="diagram1_button_right" value="Effects">'+
            '<input type="button" id="'+instance+'_undo" class="diagram1_button_right" value="Undo">'+
         '</fieldset>');
        $(rightDiv).append(
        '<fieldset style="position:static;">'+
            '<legend>Select diagram</legend>'+
            //'<label for="'+instance+'_select_diagram1_left">&lt;</label>'+
            '<input type="button" id="'+instance+'_select_diagram1_left" style="float:left; width:44px;" value="&lt;">'+
            '<input type="button" id="'+instance+'_select_diagram1_right" style="float:left; width:44px;" value="&gt;">'+
         '</fieldset>');

        $('.diagram1_button_left').css({width:'80px',padding:'2px'});
        $('.diagram1_button_right').css({width:'90px',padding:'3px'});

        var nodeDialog = $('<div class="diagram1_node_dialog" '+
            'style="width:100px;height:100px;background:yellow;display:none;">Node dialog</div>');
        var linkDialog = $('<div class="diagram1_link_dialog" '+
            'style="width:100px;height:100px;background:yellow;display:none;">Link dialog</div>');
        $(leftDiv).append(nodeDialog).append(linkDialog);
        $('.diagram1_node_dialog').on('click', function() {
            $(this).css({display:'none'});
        });
        $('.diagram1_link_dialog').on('click', function() {
            $(this).css({display:'none'});
        });


        var graph = new joint.dia.Graph;
        //var paper = new joint.dia.Paper({ el: $('#paper'), width: 580, height: 460, gridSize: 1, model: graph, linkPinning:false });
        var paper = new joint.dia.Paper({ el: $('#paper'), width: 2000, height: 2000, gridSize: 1, model: graph, linkPinning:false });
        paper.scale(1);


        // handlers
        $('.diagram1_save').on('click', function() {
            $('#save_diagram1_local_storage').css({display:'block'});
        });

        $('.diagram1_load').on('click', function() {
            graph.removeCells(graph.getElements());
            graph.removeLinks(graph.getLinks());
            $('#load_diagram1_local_storage').css({display:'block'});
        });

        $('#save_diagram1_local_storage_ok').on('click', function(event) {
            $('#save_diagram1_local_storage').css({display:'none'});
            var title = $('#save_diagram1_local_storage_title').val();
            savediagram1ToLocalStorage(graph, title);
        });

        $('#load_diagram1_local_storage_ok').on('click', function(event,element) {
            $('#load_diagram1_local_storage').css({display:'none'});
            var title = $('#load_diagram1_local_storage_title').val();
            var diagram1String = localStorage.getItem(title);
            var diagram1Object = JSON.parse(diagram1String);
            var nodes = diagram1Object.nodes;
            for (var i=0; i<nodes.length; i++) {
                var node = new joint.shapes.standard.Rectangle(nodes[i]);
                node.addTo(graph);
            }
            var links = diagram1Object.links;
            for (var i=0; i<links.length; i++) {
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

        function process_node_or_link_button(button, group, type) {
            if (AKT.state.mytype === type) {
                $('.diagram1_button_left').css({border:'solid 1px #808080', background:'#f0f0f0'});
                AKT.state.mytype = 'pointer';
                if (group === 'link') {
                    _.each(graph.getElements(), function(el) {
                        el.removeAttr('body/magnet').removeAttr('text/pointer-events');
                    });
                }
            } else {
                $('.diagram1_button_left').css({border:'solid 1px #808080', background:'#f0f0f0'});
                $(button).css({border:'solid 1px #808080', background:'#88ff88'});
                AKT.state.mytype = type;
                if (group === 'link') {
                    _.each(graph.getElements(), function(el) {
                        el.attr('body/magnet', true).attr('text/pointer-events', 'none');
                    });
                }
            }
        }
        initialiseJointjs(graph, paper, widget);
    }


function initialiseJointjs(graph, paper, widget) {
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



    joint.shapes.standard.Rectangle.define('examples.CustomRectangle', {
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
    }, {
        // inherit joint.shapes.standard.Rectangle.markup
    }, {
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
    });


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
        $('.diagram1_button_left').css({border:'solid 1px #808080', background:'#f0f0f0'});
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

paper.on('cell:pointerdblclick', function(cellView) {
    var isElement = cellView.model.isElement();
    var type = cellView.model.type;
    var message = (isElement ? 'Element' : 'Link') + ' clicked';
    console.log(101,cellView);
    //info.attr('label/text', message);
    //info.attr('body/visibility', 'visible');
    //info.attr('label/visibility', 'visible');
    //AKT.state.currentElement = currentElement;
    if (isElement) {
        if (type === 'object') {
            $('#node_object_dialog').css({display:'block'});
        } else if (type === 'attribute') {
            $('#node_attribute_dialog').css({display:'block'});
        } else if (type === 'process') {
            $('#node_process_dialog').css({display:'block'});
        } else if (type === 'action') {
            $('#node_action_dialog').css({display:'block'});
        }
    } else {
        $('.diagram1_link_dialog').css({display:'block'});
    }
});

function resetAll(paper) {
    paper.drawBackground({
        color: 'white'
    })

    var elements = paper.model.getElements();
    for (var i = 0, ii = elements.length; i < ii; i++) {
        var currentElement = elements[i];
        currentElement.attr('body/stroke', 'black');
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
//===========================================
    graph.on('change:source change:target', function(link, collection, opt) {
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
            createLink(sourceId, targetId, mytype);
        }
        saveDiagramToLocalStorage(graph, 'current');
    });

// Create a link between a source element with id `s` and target element with id `t`.
function createLink(sourceId, targetId, mytype) {
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
        link.set('mytype',mytype);
        link.set('vertices', [calculateCurveVertexPosition(along, source, target)]);

    } else if (mytype === 'causes2way') {
        var along = 0.5;
        var link = new joint.shapes.standard.Link({
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
        link.set('mytype',mytype);
        link.set('vertices', [calculateCurveVertexPosition(along, source, target)]);
    }
    $('.diagram1_button_left').css({border:'solid 1px #808080', background:'#f0f0f0'});
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
    return {x:mx-(ty-sy)*40/hyp, y:my+(tx-sx)*40/hyp};
}


function makeId(mytype) {
    count[mytype] += 1;
    return mytype+count[mytype];
}


    // Create a node with `id` at the position `p`.
    function createNode(id, p, mytype) {
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
            node.on('pointerdown', function(element) {
                //mytype = element.attributes.arcTypeId;
                var mytype = AKT.state.mytype;
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
}



    function saveDiagramToLocalStorage(graph, title) {
        var diagramObject = {nodes:[],links:[]};
        _.each(graph.getElements(), function(el) {
            diagramObject.nodes.push(el.attributes);
        });
        _.each(graph.getLinks(), function(el) {
            diagramObject.links.push(el.attributes);
        });
        var diagramString = JSON.stringify(diagramObject);
        localStorage.setItem(title, diagramString);
    }

})(jQuery);

/*  JointJS tips
1. Include joint.css in the loaded style sheets!
It styles SVG as well as HTML.
The only reason (but it's a good one) that I can see for doing this is to change the 
appearance of a link while dragging it to a node.   Without the CSS, it is big, black, 
big thick arrowheads, and big "tools" attached to it (options and delete tools).
Including joint.css gets rid of all of this, and makes it a thin line without adornments.


*/

