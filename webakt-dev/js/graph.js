// This file contains utilities for handling the knowledge-base graph.  Currently, this is causes and links
// re;arionships (the sorts of things displayed in an AKT5/webAKT diagram, but could be extended to handle
// e.g. conditions for att_value and causes statements.

// The main initial pirpose is to provide functions for mapping between statements and their diagrammac 
// representation, in both directions.


$(document).ready(function() {


    AKT.makeGraphFromStatements = function () {

        var graph = {nodes:{},arcs:{}};
        var statements = AKT.kbs[AKT.state.current_kb].sentences;
        $.each(statements, function(i,statement) {
            var nestedList = statement.nested_list;
            if (nested_list[0] === 'causes1way') {
                var nodeLabel1 = getNodeLabel(nested_list[1]);
                var nodeLabel2 = getNodeLabel(nested_list[2]);
                if (!graph.nodes[node1.label]) {
                    graph.nodes[node1.label] = true;
                }
                if (!graph.nodes[node2.label]) {
                    graph.nodes[node2.label] = true;
                }
                arcs[nodeLabel1+'_+_'+nodeLabel2] = {source:nodeLabel1,target:nodeLabel2};
            }
        });
        console.debug(graph);

        function getNodeLabel(struct) {
            var flattened = struct.flat();
            var condensed = [];
            for (var i=0; i<flattened.length; i++) {
               var element = flattened[i];
                if (el==='att_value' || el==='process' || el==='part') {
                    continue;
                } else {
                    condensed.push(el);
                }
            }
            var label = condensed[0];
            for (var i=1; i<condensed[i]-1; i++) {     // Leave out the last item (the actual value)
                label += '_'+condensed[i];
            }
            return label;
        }

    };

});
