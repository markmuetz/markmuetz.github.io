AKT.widgets.summary = {};


AKT.widgets.summary.setup = function (widget) {
    // -----------------------------------------------------------------------------
    // Custom event handlers
    $(document).on('new_statement_created_event', function(event,args) {
        self.display(widget);
    });
};

AKT.widgets.summary.settings = {width:'400px',height:'400px'};


AKT.widgets.summary.display = function (widget) {
    var kbId = AKT.state.current_kb;
    var kb = AKT.KBs[kbId];

    // Widget styles
    $(widget.element).find('h2').css({
        'float':'left',
        'font-size':'14px',
        'color':'#d00000',
        'margin-bottom':'0px'});
    $(widget.element).find('table').css({
        'margin-top':'0px'});
    $(widget.element).find('.div_view').css({
        'margin-left':'6px',
        'margin-top':'12px',
        'color':'blue',
        'float':'left'});

    // Metadata
    $(widget.element).find('.metadata').find('.id').text(kb._metadata.id);
    $(widget.element).find('.metadata').find('.title').text(kb._metadata.title);


    // Statements
    $(widget.element).find('.statements').find('table,tr,td').css({
        border:'1px solid black',
        'border-collapse':'collapse',
        'text-align':'right',
        'padding-right':'5px',
        'padding-left':'5px'});
    var counts = kb.countStatements();

    for (var key in counts) {
        $(widget.element).find('.statements').find('.'+key).text(counts[key]);
    }

    // Sources
    var nSource = {person:0,reference:0};
    var nSourceByLocation = {};
    for (var id in kb._sources) {
        var source = kb._sources[id];
        var type = source._type;
        if (type === 'reference') {
            nSource.reference += 1;
        } else if (type === 'person') {
            nSource.person += 1;
            var location = source._location;
            if (!nSourceByLocation[location]) nSourceByLocation[location] = 0;
            nSourceByLocation[location] += 1;
        }
    }

    $(widget.element).find('.sources').append('<div><span>References: </span><span>'+nSource.reference+'</span></div>');
    $(widget.element).find('.sources').append('<div><span>Interviewees: </span><span>'+nSource.person+'</span></div>');

    for (var location in nSourceByLocation) {
        $(widget.element).find('.sources').append('<div style="margin-left:10px;"><span>'+location+': </span><span>'+nSourceByLocation[location]+'</span></div>');
    }


    // Formal terms
    var counts = {object:0, attribute:0, value:0, process:0, action:0, comparison:0, total:0};
    for (var id in kb._formalTerms) {
        var formalTerm = kb._formalTerms[id];
        counts[formalTerm._type] += 1;
        counts.total += 1;
    }

    for (var key in counts) {
        $(widget.element).find('.formal_terms').find('.'+key).text(counts[key]);
    }


    // Object hierarchies
    for (var id in kb._objectHierarchies) {
        var hierarchy = kb._objectHierarchies[id];
        var nTerms = Object.keys(hierarchy._tree_up).length;
        $(widget.element).find('.object_hierarchies').find('table').
            append('<tr><td>'+hierarchy._id+'</td><td>'+nTerms+'</td></tr>');
    }


    // Topics
    var nTopic = 0;
    for (var id in kb._topics) {
        nTopic += 1;
    }
    $(widget.element).find('.topics').find('.number').text(nTopic);


    // Topic hierarchies
    for (var id in kb._topicHierarchies) {
        var hierarchy = kb._topicHierarchies[id];
        var nTerms = Object.keys(hierarchy._tree_up).length;

        $(widget.element).find('.topic_hierarchies').find('table').
            append('<tr><td>'+hierarchy._id+'</td><td>'+nTerms+'</td></tr>');
    }


    // Images
    var nImages = Object.keys(kb._images).length;

    $(widget.element).find('.images').find('.number').text(nImages);



    // ======================================================================== EVENT HANDLING
    // Event handling - handles links to open up widget for corresponding part of the KB summary.
    // There's a lot of similarity here, which no doubt could be abstracted out into a single
    // event handler- as indeed is the case in menuHandlers.js, from which this code was lifted.
    // But some differ in their options.   Simples thing is to keep them separate.

    $(widget.element).find('.div_view_metadata').on('click', function(event) {
        event.stopPropagation();
        var eventShiftKey = event ? event.shiftKey : null;

        var panel = AKT.panelise({
            widget_name:'metadata',
            position:{left:'20px',top:'20px'},
            size:{width:'550px',height:'540px'},
            shift_key: eventShiftKey,
            options:{kbId:AKT.state.current_kb}
        });
    });

    $(widget.element).find('.div_view_statements').on('click', function(event) {
        event.stopPropagation();
        var eventShiftKey = event ? event.shiftKey : null;

        var panel = AKT.panelise({
            widget_name:'collection',
            position:{left:'20px',top:'20px'},
            size:{width:'550px',height:'540px'},
            shift_key: eventShiftKey,
            options:{kbId:AKT.state.current_kb,item_type:'statement'}
        });
    });

    $(widget.element).find('.div_view_sources').on('click', function(event) {
        event.stopPropagation();
        var eventShiftKey = event ? event.shiftKey : null;

        var panel = AKT.panelise({
            widget_name:'collection',
            position:{left:'20px',top:'20px'},
            size:{width:'550px',height:'540px'},
            shift_key: eventShiftKey,
            options:{kbId:AKT.state.current_kb,item_type:'source'}
        });
    });

    $(widget.element).find('.div_view_formal_terms').on('click', function(event) {
        event.stopPropagation();
        var eventShiftKey = event ? event.shiftKey : null;

        var panel = AKT.panelise({
            widget_name:'collection',
            position:{left:'20px',top:'20px'},
            size:{width:'550px',height:'540px'},
            shift_key: eventShiftKey,
            options:{kbId:AKT.state.current_kb,item_type:'formal_term'}
        });
    });

    $(widget.element).find('.div_view_object_hierarchies').on('click', function(event) {
        event.stopPropagation();
        var eventShiftKey = event ? event.shiftKey : null;

    var panel = AKT.panelise({
        widget_name:'collection',
        position:{left:'20px',top:'20px'},
        size:{width:'450px',height:'540px'},
        shift_key: eventShiftKey,
        options:{kbId:AKT.state.current_kb, tree_type:'object',item_type:'object_hierarchy'}
    });
    });

    $(widget.element).find('.div_view_topics').on('click', function(event) {
        event.stopPropagation();
        var eventShiftKey = event ? event.shiftKey : null;

        var panel = AKT.panelise({
            widget_name:'collection',
            position:{left:'20px',top:'20px'},
            size:{width:'550px',height:'540px'},
            shift_key: eventShiftKey,
            options:{kbId:AKT.state.current_kb,item_type:'topic'}
        });
    });

    $(widget.element).find('.div_view_topic_hierarchies').on('click', function(event) {
        event.stopPropagation();
        var eventShiftKey = event ? event.shiftKey : null;

        var panel = AKT.panelise({
            widget_name:'collection',
            position:{left:'20px',top:'20px'},
            size:{width:'410px',height:'375px'},
            shift_key: eventShiftKey,
            options:{kbId:AKT.state.current_kb, tree_type:'topic', item_type:'topic_hierarchy'}
        });
    });

    $(widget.element).find('.div_view_images').on('click', function(event) {
        event.stopPropagation();
        var eventShiftKey = event ? event.shiftKey : null;

        var panel = AKT.panelise({
            widget_name:'images',
            position:{left:'20px',top:'20px'},
            size:{width:'500px',height:'400px'},
            shift_key:eventShiftKey,
            options:{kbId:AKT.state.current_kb}
        });
    });


};



AKT.widgets.summary.html = `
    <div class="content" style="background:inherit; height:500px; overflow:auto; padding:12px;border:none;">

        <div class="metadata">
            <h2>Metadata</h2>
            <div class="div_view div_view_metadata">View</div>
            <div style="clear:both"></div>
            <table style="max-width:350px;">
                <tr>
                    <td style="font-weight:bold; font-size:11px;">ID</td>
                    <td class="id"></td>
                </tr>
                <tr>
                    <td style="font-weight:bold; font-size:11px; vertical-align:top;">Title</td>
                    <td class="title"></td>
                </tr>
            </table>
        </div>

        <div class="statements">
            <h2>Statements</h2>
            <div class="div_view div_view_statements">View</div>
            <div style="clear:both"></div>
            <table>
                <tr>
                    <td></td>
                    <td>Unconditional</td>
                    <td>Conditional</td>
                    <td>TOTAL</td>
                </tr>
                <tr>
                    <td>att_value</td>
                    <td class="att_value_unconditional"></td>
                    <td class="att_value_conditional"></td>
                    <td class="att_value"></td>
                </tr>
                <tr>
                    <td>causes</td>
                    <td class="causes_unconditional"></td>
                    <td class="causes_conditional"></td>
                    <td class="causes"></td>
                </tr>
                <tr>
                    <td>comparison</td>
                    <td class="comparison_unconditional"></td>
                    <td class="comparison_conditional"></td>
                    <td class="comparison"></td>
                </tr>
                <tr>
                    <td>TOTAL</td>
                    <td class="unconditional"></td>
                    <td class="conditional"></td>
                    <td class="n1"></td>
            </table>
        </div>

        <div class="sources">
            <h2>Sources</h2>
            <div class="div_view div_view_sources">View</div>
            <div style="clear:both"></div>
        </div>

        <div class="formal_terms">
            <h2>Formal terms</h2>
            <div class="div_view div_view_formal_terms">View</div>
            <div style="clear:both"></div>
            <table>
                <tr>
                    <td>Object</td>
                    <td class="object"></td>
                </tr>
                <tr>
                    <td>Attribute</td>
                    <td class="attribute"></td>
                <tr>
                    <td>Value</td>
                    <td class="value"></td>
                </tr>
                <tr>
                    <td>Process</td>
                    <td class="process"></td>
                </tr>
                <tr>
                    <td>Action</td>
                    <td class="action"></td>
                </tr>
                  <tr>
                    <td>Comparison</td>
                    <td class="action"></td>
                </tr>
                <tr>
                    <td>Total</td>
                    <td class="total"></td>
                </tr>
                </tr>
            </table>
        </div>

        <div class="object_hierarchies">
            <h2>Object hierarchies</h2>
            <div class="div_view div_view_object_hierarchies">View</div>
            <div style="clear:both"></div>
            <table>
                <tr>
                    <td><u>Name</u></td>
                    <td><u>N terms</u></td>
                </tr>
            </table>
        </div>

        <div class="topics">
            <h2>Topics</h2>
            <div class="div_view div_view_topics">View</div>
            <div style="clear:both"></div>
            <table>
                <tr>
                    <td>Number: </td>
                    <td class="number"></td>
                </tr>
            </table>
        </div>

        <div class="topic_hierarchies">
            <h2>Topic hierarchies</h2>
            <div class="div_view div_view_topic_hierarchies">View</div>
            <div style="clear:both"></div>
            <table>
                <tr>
                    <td><u>Name</u></td>
                    <td><u>N topics</u></td>
                </tr>
            </table>
        </div>

        <div class="images">
            <h2>Images</h2>
            <div class="div_view div_view_images">View</div>
            <div style="clear:both"></div>
            <table>
                <tr>
                    <td>Number: </td>
                    <td class="number"></td>
                </tr>
            </table>
        </div>


    </div>     <!-- End of content div -->
    `;
