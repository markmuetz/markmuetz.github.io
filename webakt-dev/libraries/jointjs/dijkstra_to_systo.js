console.debug('dijkstra_to_systo.js');
var m = {};
var mytype = 'stock';
var count = {node:0, valve:0, cloud:0, variable:0, flow:0, influence:0};
var nodeReady = false;
var flowPad = null;
var influencePad = null;

function mtype_is_stock() {
    mtype = "stock";
}
function mtype_is_variable() {
    mtype = "variable";
}
function mtype_is_cloud() {
    mtype = "cloud";
}

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

var graph = new joint.dia.Graph;
var paper = new joint.dia.Paper({ el: $('#paper'), width: 800, height: 400, gridSize: 1, model: graph, linkPinning:false });
paper.on('element:mouseenterxxx', function(elementView) {
    elementView.addTools(new joint.dia.ToolsView({
        tools: [
            new joint.elementTools.Button({
                markup: [{
                    tagName: 'circle',
                    selector: 'button',
                    attributes: {
                        'r': 7,
                        'fill': '#001DFF',
                        'cursor': 'pointer'
                    }
                }, {
                    tagName: 'path',
                    selector: 'icon',
                    attributes: {
                        'd': 'M -2 4 2 4 M 0 3 0 0 M -2 -1 1 -1 M -1 -4 1 -4',
                        'fill': 'none',
                        'stroke': '#FFFFFF',
                        'stroke-width': 2,
                        'pointer-events': 'none'
                    }
                }],
                x: '100%',
                action: function(evt) {
                    console.debug('View id: ' + this.id + '\n' + 'Model id: ' + this.model.id);
                }
            })
        ]
    }));
});
paper.on('element:mouseleavexxx', function(elementView) {
    elementView.removeTools();
});


// Create a node with `id` at the position `p`.
function createNode(id, p, mytype) {
    if (mytype === 'stock') {
        var node = (new joint.shapes.standard.Rectangle({
            id: id,
            position: { x:p.x-22, y:p.y-17 },
            size: { width: 45, height: 35 },
            attrs: {
                body: {fill: '#e0e0e0'},
                //text: {text: id, 'ref-y':30}
                //text: {text: 'XXXXX'}
            },
            label_id: id+'_label',
            mytype: 'stock',
            flow_pad_id: id+'_flow_pad',
            influence_pad_id: id+'_influence_pad'
        })).addTo(graph);

        node.on('change:position', function(element, position) {
            updateMidnodes(element);
            updateLabelPosition(element);
            updateArcPadPosition(element, 'flow');
            updateArcPadPosition(element, 'influence');
        });
/*
        'element:mouseenter': function(elementView) {
            var model = elementView.model;
            var bbox = model.getBBox();
            var ellipseRadius = (1 - Math.cos(g.toRad(45)));
            var offset = model.attr(['pointers', 'pointerShape']) === 'ellipse'
                ? { x: -ellipseRadius * bbox.width / 2, y: ellipseRadius * bbox.height / 2  }
                : { x: -3, y: 3 };

            elementView.addTools(new joint.dia.ToolsView({
                tools: [
                    new joint.elementTools.Remove({
                        useModelGeometry: true,
                        y: '0%',
                        x: '100%',
                        offset: offset
                    })
                ]
            }));
        },
*/
        makeNodeLabel(node);


    } else if (mytype === 'cloud') {
        var node = (new joint.shapes.standard.Ellipse({
            id: id,
            position: { x: p.x-25, y: p.y-20 },
            size: { width: 50, height: 40 },
            attrs: {
                body: {fill: '#e0e0e0'},
                text: {text: '     '}
            }
        })).addTo(graph);
        node.on('change:position', function(element, position) {
            updateMidnodes(element);
        });

    } else if (mytype === 'variable') {
        var node = (new joint.shapes.standard.Ellipse({
            id: id,
            position: { x: p.x-25, y: p.y-10 },
            size: { width: 50, height: 20 },
            attrs: {
                body: {fill: 'white'},
                text: {text: id}
            }
        })).addTo(graph);
        node.on('change:position', function(element, position) {
            updateMidnodes(element);
        });

    } else if (mytype === 'valve') {
        var node = (new joint.shapes.standard.Ellipse({
            id: id,
            position: { x: p.x-10, y: p.y-10 },
            size: { width:20, height: 20 },
            elementMove: false,
            attrs: {
                body: {fill:'#e0e0e0', stroke:'#808080'},
                //text: {text: id}
            },
            label_id: id+'_label'
        })).addTo(graph);

        node.on('change:position', function(element, position) {
            updateMidnodes(element);
            updateLabelPosition(element);
        });

        makeNodeLabel(node);
    }

    return node;
}

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

    if (mytype === 'flow') {
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

        var valveId = makeId('valve');
        var node = createNode(valveId,calculateMidnodePosition(source, target), 'valve');
        node.attr('body/magnet', true).attr('text/pointer-events', 'none');
        //node.set('stopDelegation',true);
        node.set('elementMove',false);
        node.set('link_id', link.id);  // These two lines reciprocally associate the valve node with the
        link.set('valve_id', node.id);  // flow link.  Note that having both violates DRY!
        //node.attr('circle/magnet', true).attr('text/pointer-events', 'none');
        // node.removeAttr('circle/magnet').removeAttr('text/pointer-events');
        console.debug(node);
        mode = 'stock';
        
    } else if (mytype === 'influence') {
        //(new joint.dia.Link({
        var along = 0.5;
        var link = new joint.shapes.standard.Link({
            id: [sourceId,targetId].sort().join(),
            source: { id: sourceId },
            target: { id: targetId },
            along: along,
            smooth: true,
            z: -1,
            attrs: {
                '.marker-target': { d: 'M 12 0 L 0 6 L 12 12 z'}
            }
        });
        link.addTo(graph);
        link.set('mytype',mytype);
        link.set('vertices', [calculateCurveVertexPosition(along, source, target)]);
    }
}

paper.on('element:mouseenter', function(element) {
    if (nodeReady) {
        var node = element.model;
        if (node.attributes.mytype === 'stock') {
            activeNode = node;
            console.debug(node);
            flowPad = makeNodeArcPad(node, 'flow');
            influencePad = makeNodeArcPad(node, 'influence');
        }
    }
});


paper.on('element:mouseleave', function(element) {
    nodeReady = true;
    if (flowPad) flowPad.remove();
    if (influencePad) influencePad.remove();
});

paper.on('link:pointerdown', function(link) {
    console.debug(link.model.attributes.source, link.model.attributes.target);
    if (link.model.attributes.target && link.model.attributes.target.id) {
        var sourceId = link.model.attributes.source.id;
        var source = graph.getCell(sourceId);
        var targetId = link.model.attributes.target.id;
        var target = graph.getCell(targetId);
        var sx = source.attributes.position.x;
        var sy = source.attributes.position.y;
        var tx = target.attributes.position.x;
        var ty = target.attributes.position.y;
        var line = new g.Line(new g.Point(sx,sy), new g.Point(tx,ty));

        if (link && link.model && link.model.attributes && link.model.attributes.vertices) {
            var vertex = link.model.attributes.vertices[0];
            var point = new g.point(vertex.x, vertex.y)
            var offset = line.pointOffset(point);
            var closestPoint1 = line.closestPoint(point);
            var closestPoint2 = line.closestPointLength(point);
            var closestPoint3 = line.closestPointNormalizedLength(point);
            console.debug('\n', {sx:sx,sy:sy}, {tx:tx, ty:ty}, '\n',offset, closestPoint1, closestPoint2, closestPoint3);
        }
    }
});

// When a new link is created via UI (in Edit mode), remove the previous link
// and create a new one that has the ID constructed as "nodeA,nodeB". The
// reason we're removing the old link below is that it is not a good idea
// to change IDs of any model in JointJS.
graph.on('change:source change:target', function(link, collection, opt) {
    //var sourceId = link.get('source').id;
    //var source = graph.getCell(sourceId);
    var sourcePadId = link.get('source').id;
    var sourcePad = graph.getCell(sourcePadId);
    var sourceId = sourcePad.attributes.node_id;
    var source = graph.getCell(sourceId);
    //console.debug('\nXXXX ',link, '\n', sourcePad, sourceId, source);
    console.debug('XX ',sourcePad.attributes.arcTypeId);  
    mytype = sourcePad.attributes.arcTypeId;

    var targetId = link.get('target').id;
    var target = graph.getCell(targetId);

    //console.debug(source, target);
    if (target && mytype === 'flow') {
        var sx = source.attributes.position.x;
        var sy = source.attributes.position.y;
        var tx = target.attributes.position.x;
        var ty = target.attributes.position.y;
        createNode('valve',{x:(sx+tx)/2, y:(sy+ty)/2}, 'valve_'+sourceId+'_'+targetId);
        //n(link.attributes.valve_id,{x:(sx+tx)/2, y:(sy+ty)/2});
    }
    //console.debug('\n',mode, sourceId, targetId, opt.ui);
    console.debug('#### ',opt.ui, sourceId, targetId, mytype);
    if (opt.ui && sourceId && targetId) {
        //console.debug('    ***');
        link.remove();
        createLink(sourceId, targetId, mytype);
    }
});



// UI.

var directed = true;
$('#opt-directed').on('change', function(evt) {
    directed = $(evt.target).is(':checked');
    _.each(graph.getLinks(), function(link) {
        if (directed) {
            link.attr(attrs.linkDefaultDirected);
        } else {
            link.removeAttr('.marker-target');
        }
    });
});

var editMode = true;
$('#opt-edit').on('change', function(evt) {
    editMode = $(evt.target).is(':checked');
    _.each(graph.getElements(), function(el) {
        console.debug(el);
        if (editMode) {
            el.attr('body/magnet', true).attr('text/pointer-events', 'none');
            //el.attr('circle/magnet', true).attr('text/pointer-events', 'none');
        } else {
            //el.removeAttr('circle/magnet').removeAttr('text/pointer-events');
            el.removeAttr('body/magnet').removeAttr('text/pointer-events');
        }
    });
});

paper.on('blank:pointerdblclick', function(evt, x, y) {
    //console.debug('\n+++++++\n', graph.getCell('valve'));
    //var valve = graph.getCell('valve');
    //if (valve) valve.attr('circle/magnet', true).attr('text/pointer-events', 'none');
    console.debug(mytype);
    if (editMode) {
        //var node = n(_.uniqueId('n'), x + '@' + y);
        var node = createNode(_.uniqueId('n'), {x:x, y:y}, mytype);
        //node.attr('body/magnet', true).attr('text/pointer-events', 'none');
    }
});


function updateMidnodes(element){
    _.each(graph.getLinks(), function(link) {
        //console.debug('   ', element.id, link);
        var sourceId = link.get('source').id;
        var targetId = link.get('target').id;
        //if (element.id === link.attributes.source.id || element.id === link.attributes.target.id) {
        if (element.id === sourceId || element.id === targetId) {
            // Calculate lik mid-point (maybe JointJS geometry should be use instead?)
            var source = graph.getCell(sourceId);
            var target = graph.getCell(targetId);
            // Use actual width and height!
            var sx = source.attributes.position.x + 22;
            var sy = source.attributes.position.y + 17;
            var tx = target.attributes.position.x + 22;
            var ty = target.attributes.position.y + 17;

            // If it's an influence link, we need to re-calculate its vertex position (i.e.
            // the point that the curve goes through).    
            // Or if it's a flow link, we need to recalculate the location of the midnode so
            // that it till lies on the link.    
            // Note that both of these are having to be done because JointJS appears not to
            // have built-in-support for them, unlike other libraries.
            if (link.attributes.mytype === 'influence') {
                console.debug('-----');
                //var vx = mx - 0.2*(ty-sy);   // Calculates vertex position as right-angle offset 
                //var vy = my + 0.2*(tx-sx);   // from middle of link.
                //link.set('vertices', [{ x: vx, y: vy }]);
                var along = link.attributes.along;
                var mx = (sx+tx)*along;
                var my = (sy+ty)*along;
                var hyp = Math.sqrt((tx-sx)**2 + (ty-sy)**2);
                link.set('vertices', [{x:mx-(ty-sy)*40/hyp, y:my+(tx-sx)*40/hyp}]);

            } else if (link.attributes.mytype ==='flow') {
                var mx = (sx+tx)/2;
                var my = (sy+ty)/2;
                var valve = graph.getCell(link.attributes.valve_id);
                valve.set('position', {x:mx-10, y:my-10});
            }
        }
    });
}


function calculateMidnodePosition(source, target) {
    var sx = source.attributes.position.x + 22;
    var sy = source.attributes.position.y + 17;
    var tx = target.attributes.position.x + 22;
    var ty = target.attributes.position.y + 17;
    return {x:(sx+tx)/2, y:(sy+ty)/2};
}


/*
function calculateCurveVertexPosition(source, target) {
    var sx = source.attributes.position.x + 22;
    var sy = source.attributes.position.y + 17;
    var tx = target.attributes.position.x + 22;
    var ty = target.attributes.position.y + 17;
    var mx = (sx+tx)/2;
    var my = (sy+ty)/2;
    return {x:mx-0.2*(ty-sy), y:my+0.2*(tx-sx)};
}
*/
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


function makeNodeLabel(node) {

    var p = node.attributes.position;

    var nodeLabel = (new joint.shapes.standard.Rectangle({
        id: node.id+'_label',
        position: { x: p.x, y: p.y+40 },
        size: { width: 45, height: 15 },
        attrs: {
            body: {stroke:'white', 'stroke-width':0, fill: 'white'},
            //text: {text: id, 'ref-y':30}
            text: {text: 'stock_'+node.id}
        },
        node_id: node.id,
        offsetx: 0,
        offsety: 40
    }));

    nodeLabel.addTo(graph);
    //nodeLabel.attr('circle/magnet', true).attr('text/pointer-events', 'none');
    //nodeLabel.attr('body/magnet', true).attr('text/pointer-events', 'none');

    nodeLabel.on('change:position', function(nodeLabel, position) {
        var nodeId = nodeLabel.attributes.node_id;
        var node = graph.getCell(nodeId);
        nodeLabel.set('offsetx', nodeLabel.attributes.position.x - node.attributes.position.x);
        nodeLabel.set('offsety', nodeLabel.attributes.position.y - node.attributes.position.y);
    });
}


function makeNodeArcPad(node, arcTypeId) {

    var p = node.attributes.position;

    var padFill = arcTypeId === 'flow' ?'blue' : 'red';
    var arcPad = (new joint.shapes.standard.Rectangle({
        id: node.id+'_'+arcTypeId+'_pad',
        position: { x: p.x+40, y: arcTypeId==='flow' ? p.y : p.y+12 },
        size: { width: 14, height: 10 },
        attrs: {
            body: {stroke:'white', 'stroke-width':0, fill: padFill},
            //text: {text: id, 'ref-y':30}
            text: {text: '    '}
        },
        node_id: node.id,
        arcTypeId: arcTypeId,
        offsetx: 40,
        offsety: arcTypeId==='flow' ? 0 : 12
    }));

    arcPad.addTo(graph);
    arcPad.on('pointerdown', function(element) {
        mytype = element.attributes.arcTypeId;
        console.debug('***', element, mytype);
    });
    //nodeLabel.attr('circle/magnet', true).attr('text/pointer-events', 'none');
    arcPad.attr('body/magnet', true).attr('text/pointer-events', 'none');

    return arcPad;
}



function updateLabelPosition(node) {
    var label = graph.getCell(node.attributes.label_id);
    if (label) {
        var labelx = node.attributes.position.x +label.attributes.offsetx;
        var labely = node.attributes.position.y +label.attributes.offsety;
        label.set('position', {x:labelx, y:labely});
    }
}


function updateArcPadPosition(node, arcTypeId) {
    var pad = graph.getCell(node.attributes[arcTypeId+'_pad_id']);
    if (pad) {
        var padx = node.attributes.position.x +pad.attributes.offsetx;
        var pady = node.attributes.position.y +pad.attributes.offsety;
        pad.set('position', {x:padx, y:pady});
    }
}


var infoButton = new joint.elementTools.Button({
    focusOpacity: 0.5,
    // top-right corner
    x: '100%',
    y: '0%',
    offset: { x: -5, y: -5 },
    action: function(evt) {
        alert('View id: ' + this.id + '\n' + 'Model id: ' + this.model.id);
    },
    markup: [{
        tagName: 'circle',
        selector: 'button',
        attributes: {
            'r': 7,
            'fill': '#001DFF',
            'cursor': 'pointer'
        }
    }, {
        tagName: 'path',
        selector: 'icon',
        attributes: {
            'd': 'M -2 4 2 4 M 0 3 0 0 M -2 -1 1 -1 M -1 -4 1 -4',
            'fill': 'none',
            'stroke': '#FFFFFF',
            'stroke-width': 2,
            'pointer-events': 'none'
        }
    }]
});
