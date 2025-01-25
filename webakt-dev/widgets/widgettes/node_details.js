/*
2 Aug 2023
Robert Muetzelfeldt
node_details
This widget uses a "template" approach to enable a user to define webAKT diagram nodes.

The node_details widgette is closely related, and is essentally a subset of this one, but
restricted to diagram nodes.  The two could be merged, to avoid code duplication, but are kept
separate during development. 

21 Aug 2023
This version (node_details.js) presents the template appropriate to the user's choice of
node.  See node_details_x1.js for the previous pattern.
*/


AKT.widgets.node_details = {};


AKT.widgets.node_details.setup = function (widget) {

    if (widget.options.mode === 'existing_node') {
        $(widget.element).find('.div_formal_label').css({display:'none'});
        $(widget.element).find('.div_wordlist').css({display:'none'});
        $(widget.element).find('.div_template_section').css({display:'none'});
    }

    var thisNode = {};

    console.log(1501,widget.options);

    //var formal = widget.options.node.makeNodeFormal();
    //console.log(formal);

    var kbId = AKT.state.current_kb;
    var kb = AKT.KBs[kbId];

    if (widget.options.mode === 'existing_node') {
        var nodeId = widget.options.node_id;
        var node = kb._graph.nodes[nodeId];
        console.log(1502,node);
        var formal = widget.options.node.makeNodeFormal(node.json);
        console.log(1503,formal);
        $(widget.element).find('.div_formal').text(formal);
    }

    if (widget.options.show_titlebar) {
        var widgetTitlebar = $(
            '<div class="title-bar">'+
                '<div>node_details</div>'+
                '<input type="button" value="X" class="dialog_close_button"/>'+
            '</div>');
        $(widget.element).append(widgetTitlebar);
        $('.dialog_close_button').on('click', function () {
            var id = $(this).parent().parent()[0].id;
            $('#'+id).css({display:"none"});
        });
    }

    // TODO The inclusion of the creation of the suggested-word lists here is a temporary hack.
    // It must be re-created (or updated) each time the user adds a new formal term.
    var wordLists = {};
    // For the time being, 'part' will be the same as 'object' (as it is in AKT5,
    // which does not distinguish between the two).
    // TODO: We need to have a discussion whether we can make 'part' a separate type,
    // since in practice there is little or no overlap between the two types.
    var types = ['action', 'attribute','object', 'process', 'value'];
    for (var i=0; i<types.length; i++) {
        var type = types[i];
        wordLists[type] = kb.findWords({term_type:type}); 
    }
    wordLists['part'] = wordLists['object'];
    widget.wordLists = wordLists;


    $(widget.element).find('.letters').find('div').css({float:'left','font-family':'courier','font-size':'18px'});

    $(widget.element).css({display:'block'});        
    var kbId = AKT.state.current_kb;
    var kb = AKT.KBs[kbId];

    $(widget.element).find('.div_id').text(widget.options.node_id);

    var nodeType = widget.options.node_type;
    if (nodeType === 'attribute') {
        $(widget.element).find('.attribute_options').css({display:'block'});
        $(widget.element).find('.attribute_options > input').attr('disabled',false);
        $(widget.element).find('.attribute_options > label').css({color:'black'});
        $('.attribute').css({display:"block"});
        $(widget.element).find('.div_templates').css({display:'none'});

    // object, process or action selected
    } else {
        //$(parentElement).find('.attribute_options > input').attr('disabled',true);
        //$(parentElement).find('.attribute_options > label').css({color:'#808080'});
        //parentElement).find('.template').css({display:'none'});
        var templateClass = '.'+nodeType+'_template';
        $(widget.element).find(templateClass).css({display:'block'});
        $(widget.element).find('.div_templates').css({display:'block'});
    }

/*
        var i = kb.findLargestIndex(kb._nodes,'s')+1;
        var id = 's' + i;
        var node = new node({id:id,json:json});
        kb._nodes[id] = node;
        AKT.trigger('new_node_created_event',{kb:kb,node:node});

        //var currentWidget = AKT.state.current_widget;
        //$(currentWidget.element).dialog_Generic('option', 'node', node);
        var source_widgie = widget.options.opened_by_widgie;
        source_widgie.options.node = node;
        $(source_widgie.element).find('.div_formal').text(formal);
        $(source_widgie.element).find('.div_english').text(english);
*/
        //var id = $(this).parent().parent()[0].id;
        //$('#'+id).css({display:"none"});

    // This is not the same as the OK button..  
    // Rather, this converts the template contents into a formal node
    // phrase.
    $(widget.element).find('.button_accept').on('click', function() {
        AKT.recordEvent({
            element:widget.element,
            finds:['#button_node_type_dialog_display'],
            event:'click',
            message:'Clicked the Accept button in the node_details widget'});
        // The filter operation removes empty elements.
        var rawJson = processTemplate();
        var json = rawJson.filter(function(n){return n}); 
        console.log(50001,rawJson,json);
        // Very clumsy, but works...
        var array = json.flat(9);
        var id = '';
        for (var i=0;i<array.length;i++) {
            var a = array[i];
            if (a!=='attribute' && a!=='part' && a!=='process' && a!=='action' && a!=='object') {
                if (id==='') {
                    id += a;
                } else {
                    id += '_'+a;
                }
            }
        }
        console.log(50002,id);
        // This uses the statement object to create the formal node phrase from its JSON!
        // Nov 2024 - no it doesn't!   Temporary replacement
/*
        var s = new Statement({json:json});
        console.log(json,s);
        var formal = s.makeFormalFromJson();
        $(widget.element).find('.div_formal').text(formal);
*/
        if (json[0] === 'attribute') {
            var formal = 'attribute('+json[1]+','+json[2]+')';
        } else if (json[0] === 'object') {
            var formal = 'object('+json[1]+')';
        } else if (json[0] === 'process') {
            var formal = 'process('+json[1]+')';
        } else if (json[0] === 'action') {
            var formal = 'action('+json[1]+')';
        }
        $(widget.element).find('.div_formal').text(formal);

        thisNode.id = id;
        thisNode.json = json;
        thisNode.formal = formal;

/*
        var s = new Statement({json:json});
        var formal = s.makeFormalFromJson();
        console.log(8901,s,formal);

        console.log(8800,json,array,id);
        console.log(8801,widget.options);
        var systoNode = widget.options.diagram._systo.nodes[widget.options.node_id];
        systoNode.json = json;
        systoNode.formal = formal;
        systoNode.id = widget.options.node_id;
        systoNode.label = id;
        //console.log(8802,widget.options);
        //var phrase = widget.options.node_type + '(' + id + ')';
        $(widget.element).find('.div_formal').text(formal);
        $('.div_node_json').text(id);
        //var node = new Node({id:'temp',json:json});
        widget.node = {json:json,formal:formal};
*/
    });   


    $(widget.element).find('.button_okxxx').on('click', function() {

        console.log('}}}',widget.options);
        var diagram = widget.options.diagram;

        var id = thisNode.id;

        var node = {
            id: id,
            node_type: widget.options.node_type,
            label: id,
            centrex: widget.options.x,
            centrey: widget.options.y,
            json: thisNode.json,
            formal: thisNode.formal
        }

        diagram._systo.nodes[id] = node;
        //diagram.render();
        $(widget.element).css({display:'none'});

        AKT.trigger('node_created_event',{id:'fred'});

        console.log(diagram);
    });


    $(widget.element).find('.button_ok').on('click', function() {
        console.log('\nEVENT clicked on button_ok in node_details.js');
        console.log('}}}options',widget.options);
        var diagram = widget.options.diagram;
        console.log(50002,thisNode);
        var id = thisNode.id;

        var formal = $(widget.element).find('.div_formal').text();
        var formal1 = formal.replace('attribute','att_value');
        var formal2 = formal1.replace(')',',x)');
/*
        var s = new Statement({formal:formal2});
        var json1 = s.makeJsonFromFormal(formal2);
        if (json1[0]==='att_value') {
            var pred = 'attribute';
        } else {
            pred = json1[0];
        }
        var json = [pred,json1[1],json1[2]];

        var array = json.flat(9);
        var id = '';
        for (var i=0;i<array.length;i++) {
            var a = array[i];
            if (a!=='attribute' && a!=='part' && a!=='process' && a!=='action' && a!=='object') {
                if (id==='') {
                    id += a;
                } else {
                    id += '_'+a;
                }
            }
        }
*/
        console.log(50003,formal1);
        if (formal1.includes('att_value')) {
            var formal3 = formal1.replace('(',',');
            var formal4 = formal3.replace(')',',');
            var json = formal4.split(',');
            json[0] = 'attribute';
            //json[3] = 'xxx';
        } else if (formal1.includes('object')) {
            var formal3 = formal1.replace('(',',');
            var json = formal3.split(',');
        } else if (formal1.includes('process')) {
            var formal3 = formal1.replace('(',',');
            var json = formal3.split(',');
        } else if (formal1.includes('action')) {
            var formal3 = formal1.replace('(',',');
            var json = formal3.split(',');
        }
        console.log(50004,json);

        //console.log(2010,formal,s,json,id);
        var node = {
            id: id,
            type: widget.options.node_type,    // TODO: Should be widget.options.node_type,
            label: id,
            centrex: widget.options.x,
            centrey: widget.options.y,
            //json: thisNode.json1,
            json:json,
            formal: thisNode.formal
        }
        console.log(1701,' Systo node 1:',node);
    
        if (!diagram._subgraph) {
            diagram._subgraph = {nodes:{},arcs:{}};
        }
        diagram._subgraph.nodes[id] = node;

        //var x = widget.options.x;
        //var y = widget.options.y;
        //var aktType = widget.options.node_type;
        //var json = thisNode.json;
        //diagram.render();
        $(widget.element).css({display:'none'});

        //AKT.trigger('new_node_event',{id:id,x:x,y:y,mytype:mytype});
        //var node = diagram.createNode1(id, {x:x, y:y}, aktType,json);

        //var node = {id:id,type:widget.options.node_type,label:id,centrex:x,centrey:y,json:json};
        console.log(1702,'Systo node 2',node);
        diagram.createJnode(node);

        var label = id.replace(/_/g, ' ');
        var labelWrapped = AKT.mywrap(label,15).wrappedString;


        //saveDiagramToLocalStorage(jgraph, 'current');
        $('.diagram_button_left').css({border:'solid 1px #808080', background:'#f0f0f0'});
        AKT.state.mytype = 'pointer';
        _.each(diagram.jgraph.getElements(), function(el) {
            el.removeAttr('body/magnet').removeAttr('text/pointer-events');
        });

        $(this).css({display:'none'});
        console.log(diagram);
    });


    function processTemplate() {            
        var mode = widget.options.mode;

        // To save duplication, we try to pick up all possible fields here,
        // even if they are not present in some of the dialogs.
        // We do it twice, for main1 and main2.
        var mainJson = [];
        var mainClass = '.div_main1';

        //var nodeType = $(widget.element).find(mainClass).find("input[name='node_types1"+"']:checked").val();
        //if (!nodeType) {
        //    nodeType = 'attribute';
        //}
        var attributeType = $(widget.element).find(mainClass).find("input[name='attribute_types1"+"']:checked").val();
        console.log(nodeType,attributeType);

        if (nodeType === 'attribute') {
            var templateClass = '.'+attributeType+'_template';
        } else {
            var templateClass = '.'+nodeType+'_template';
        }
        console.log('templateClass:',templateClass);

        var templateElement = $(widget.element).find(mainClass).find(templateClass);
        var object1 = $(templateElement).find('.object1').val();
        var part1 = $(templateElement).find('.part1').val();
        var object2 = $(templateElement).find('.object2').val();
        var part2 = $(templateElement).find('.part2').val();
        var process = $(templateElement).find('.process').val();
        var action = $(templateElement).find('.action').val();
        var attribute = $(templateElement).find('.attribute').val();

        console.log('object1,part1,object2,part2,process,action,attribute\n',
            ' o1',object1,' p1',part1,' o2',object2,' p2',part2,' : pr',process,' ac',action,' at',attribute);
        var fullObject1 = getFullObject(object1,part1);
        var fullObject2 = getFullObject(object2,part2);

        //console.log(8701,mainClass,1,fullObject1,2,fullObject2,3,process,4,action,5,attribute);

        // attribute-object
        if (nodeType === 'attribute') {
            if (attributeType === 'attribute_object') {
                var json = ['attribute',fullObject1,attribute];

            // attribute-process
            } else if (attributeType === 'attribute_process') {
                if (fullObject1) {
                    if (fullObject2) {
                        var json = ['attribute',['process',fullObject1,process,fullObject2],attribute];
                    } else {
                        json = ['attribute',['process',fullObject1,process],attribute];
                    }
                } else {
                    json = ['attribute',['process',process],attribute];
                }

            // attribute-action
            } else if (attributeType === 'attribute_action') {
                if (fullObject1) {
                    if (fullObject2) {
                        var json = ['attribute',['action',action,fullObject1,fullObject2],attribute];
                    } else {
                        json = ['attribute',['action',action,fullObject1],attribute];
                    }
                } else {
                    json = ['attribute',['action',action],attribute];
                }
            }

        // object
        } else if (nodeType === 'object') {
            var json = ['object',fullObject1];

        // process
        } else if (nodeType === 'process') {
            if (fullObject1) {
                if (fullObject2) {
                    var json = ['process',fullObject1,process,fullObject2];
                } else {
                    json = ['process',fullObject1,process];
                }
            } else {
                json = ['process',process];
            }

        // action
        } else if (nodeType === 'action') {

            if (fullObject1) {
                if (fullObject2) {
                    var json = ['action',action,fullObject1,fullObject2];
                } else {
                    json = ['action',action,fullObject1];
                }
            } else {
                json = ['action',action];
            }
        }

        return json;


        function getFullObject(object,part) {
            if (part === '') {
                return object;
            } else {
                return ['part',object,part];
            }
        }
    }


    $(widget.element).find('.button_cancel').on('click', function() {
        $(widget.element).css({display:'none'});
    });

// ===================================================================================
// Here we handle the radio buttons, for the different types of node
// They are in two groups.
// The first group is for the 4 top-level categories (attribute, object, process or action).
// If the user choses attribute, then the second group is enabled, for attribute, process or action.


    function displayAttributeOptions() {
        console.log('displayAttributeOptions');
        $(widget.element).find('.attribute_only').css({display:'block'});
        $(widget.element).find('.div_main1').css({display:'block'});
        $(widget.element).find('.nodetype_options').css({display:'block'});
        $(widget.element).find('.attribute_options > input').attr('disabled',false);
        $(widget.element).find('.attribute_options > label').css({color:'black'});
        $(widget.element).find('.attribute').css({display:"block"});
        $(widget.element).find('.div_templates').css({display:'block'});
    }


/* This is now obsolete, since the node type is picked up from the diagram window.
    $(widget.element).find('.nodetype_options input').on('change',function(event,type) {
        console.log('*** .nodetype_options');
        console.log(event);
        console.log(this);
        var parentElement = $(this).parent().parent().parent();
        AKT.recordEvent({
            element: widget.element,
            finds:   ['.'+parentElement[0].className,'.nodetype_options input'],
            qualifier: "[value='"+event.target.value+"']",
            event:   'change',
            value:   event.target.value,
            message: 'Clicked a nodetype_options radiobutton in the node_details widget'});
        $(this).attr('checked',true);
        if (!type) type = event.target.value;
        $(parentElement).find('.template').css({display:'none'});
        
        if (type === 'attribute') {
            $(parentElement).find('.attribute_options > input').attr('disabled',false);
            $(parentElement).find('.attribute_options > label').css({color:'black'});
            $('.attribute').css({display:"block"});

        // object, process or action radio button selected
        } else {
            $(parentElement).find('.attribute_options > input').attr('disabled',true);
            $(parentElement).find('.attribute_options > label').css({color:'#808080'});
            $(parentElement).find('.template').css({display:'none'});
            var templateClass = '.'+type+'_template';
            $(parentElement).find(templateClass).css({display:'block'});
        }
    });
*/

    // One of the attribute radio buttons (object, process or action) is selected.
    $(widget.element).find('.attribute_options input').on('change',function(event,attributeType) {
        console.log('*** .attribute_options');
        var parentElement = $(this).parent().parent().parent();
        AKT.recordEvent({
            element: widget.element,
            finds:   ['.'+parentElement[0].className,'.attribute_options input'],
            qualifier: "[value='"+event.target.value+"']",
            event:   'change',
            value:   event.target.value,
            message: 'Clicked an attribute_options radiobutton in the node_details widget'});
        $(this).attr('checked',true);
        if (!attributeType) attributeType = event.target.value;
        //if (!attributeType) attributeType = event.target.value;  TODO check if needed (shouldn't be)
        $(widget.element).find('.div_templates').css({display:'block'});
        $(parentElement).find('.template').css({display:'none'});
        var templateClass = '.'+attributeType+'_template';
        $(parentElement).find(templateClass).css({display:'block'});
    });


    $(widget.element).find('.listbox_wordlist').on('change', function(event,value) {
        console.log('4000',$(this).val());
        AKT.recordEvent({
            element: widget.element,
            finds:   ['.listbox_wordlist'],
            //qualifier: "[value='"+event.target.value+"']",
            event:   'select',
            value:   event.target.value,
            message: 'Clicked on the wordlist listbox (select element) in the node_details widget'});
        console.log('4001',AKT.state.current_input_element,value,event.target.value);
        console.log('4002',$(AKT.state.current_input_element));
        if (!value) value = event.target.value;
        $(AKT.state.current_input_element).val(value);
        //$(AKT.state.current_input_element).value = value;
    });
        

    // --------------------------------------------------- Word suggestion list
    // Note: We have to include the template input event handlers here, since otherwise 
    // they won't be registered after cloning .template elements.

    function handleInputEvent(element, event, eventType, arg) {
        console.log('\nhandleInputEvent:\n',element, '\n', event, '\n', eventType, '\n', arg);
        console.log('* 3010');
        console.log($(element));
        console.log($(element).parents());

        var parentElement = $(element).parent().parent().parent().parent();
        console.log('main? ',parentElement[0].className);
        if (!arg) arg = event.target.value;
        AKT.state.current_input_element = element;
        console.log('* 3010');
        console.log($(element));
        console.log($(element).parents());
        var inputVal = $(element).val();
        var type = $(element).attr('list');
        console.log('* 3011: ', inputVal,' : ', type);

        //$(widget).parent().parent().find('.template').css({display:'none'});
        //$(widget).parent().css({display:'block'});
        //var inputVal = $(widget).val();
        //var type = $(widget).attr('list');
        var wordList = widget.wordLists[type];
        var options = '';
        for (var i=0; i<wordList.length; i++) {
            //if (wordList[i].startsWith(inputVal)) {
                options += '<option value="' + wordList[i] + '" >'+wordList[i]+'</option>';
            //}
        }
        $(widget.element).find('.listbox_wordlist').empty();
        $(widget.element).find('.listbox_wordlist').append(options);
    }

    $(widget.element).find(".line").find('input').on('mousedown',function(event, arg) {
        console.log('* 3001',event,arg);
        var parent2 = $(this).parent().parent()[0];
        var parent4 = $(this).parent().parent().parent().parent()[0];
        var parent2ClassName = parent2.className.replace(/ /g,'.');
        var parent4ClassName = parent4.className.replace(/ /g,'.');
        AKT.recordEvent({
            element: widget.element,
            finds:   ['.'+parent4ClassName,'.'+parent2ClassName,'input.'+$(this)[0].className],
            event:   'mousedown',
            value:   event.target.value,
            message: 'Clicked on '+event.target.value+' input field in the node_details widget'});

        handleInputEvent(this, event, 'mousedown', arg);
    });

    $(widget.element).find(".attribute").find('input').on('keyup',function(event, arg) {
        console.log('* 3002');
        handleInputEvent(this, event, 'keyup', arg);
    });


    // --------------------------------------------------- End of event handlers
}   // End of createEmptyWidget()



AKT.widgets.node_details.display = function (widget) {

    console.log('display...',widget.options);
/*
        $(widget.element).find('.div_main1').css({display:'block'});
        $(widget.element).find('.div_main2').css({display:'none'});
        

        // Customise radiobuttons for the widget's "mode" option.

        $(widget.element).find('.node_only').css({display:'block'});
        $(widget.element).find('.div_main2').css({display:'none'});
        $(widget.element).find('.line_value').css({display:'none'});
        $(widget.element).find('.attribute_options > input').attr('disabled',true);
        $(widget.element).find('.attribute_options > label').css({color:'#808080'});
        $(widget.element).find('.attribute').css({display:"block"});
        $(widget.element).find('.line > ').css({'margin-bottom':'3px'});
*/
    var nodeType = widget.options.node_type;
    if (nodeType === 'attribute') {
        $(widget.element).find('.attribute_options').css({display:'block'});
        $(widget.element).find('.attribute_options > input').attr('disabled',false);
        $(widget.element).find('.attribute_options > label').css({color:'black'});
        $('.attribute').css({display:"block"});

    // object, process or action selected
    } else {
        //$(parentElement).find('.attribute_options > input').attr('disabled',true);
        //$(parentElement).find('.attribute_options > label').css({color:'#808080'});
        //parentElement).find('.template').css({display:'none'});
        var templateClass = '.'+nodeType+'_template';
        $(widget.element).find(templateClass).css({display:'block'});
    }
    }




AKT.widgets.node_details.html = `
<div id="div_node_details_dialog" class="content" style="padding-left:10px;padding-right:10px;padding-top:0px;padding-bottom:5px;">

    <div style="height:25px;">
        <div style="float:left;">Node ID: </div>
        <div class="div_id" disabled style="float:left; margin-left:6px;"></div>
        <div style="clear:both;"></div>
    </div>


    <div class="div_main" style="float:left;">  <!-- The container for radio-buttons and templates -->
        <br/>
        <div class="div_formal_label"><b>EITHER:</b> Enter a node clause using AKT's formal notation:</div>

        <div>
            <div style="float:left;">Formal</div>
            <div class="div_formal" contenteditable style="float:left; height:50px; width:400px; border:solid 1px black; background:white; margin:3px;"></div>
        </div>
            
        <div style="clear:both"></div>

        <hr style="width:100%; height:0px; border:solid #a0a0a0 3px; margin-top:4px; margin-bottom:4px;" />

        <div class="div_template_section">
            <div><b>OR:</b> Use a template to build up the clause.</div>

            <div class="div_main1" style="margin-top:5px;">   

                <div class="div_options" style="float:left;">

                    <div>The node is an attribute of:</div>
                    <div class="attribute_options" style="display:none; float:left; margin-left:6px;">
                        <input type="radio" class="attribute_option attribute_object_option" name="attribute_types1" value="attribute_object">
                        <label>an object</label><br>
                        <input type="radio" class="attribute_option attribute_process_option" name="attribute_types1" value="attribute_process">
                        <label>a process</label><br>
                        <input type="radio" class="attribute_option attribute_action_option" name="attribute_types1" value="attribute_action">
                        <label>an action</label><br>
                    </div>

                    <div style="clear:both;"></div>
                </div>   <!-- End of <div class="div_options"> -->


                <!-- ------------------------------------------------------------------------------------ -->
                <div class="div_templates" style="float:left;margin-left:10px;margin-top:7px;padding:4px;border:solid 1px black;">

                    <div class="template attribute_object_template" style="display:none;" name="attribute_object">
                        <div class="line">
                            <div style="float:left; width:60px;">Object</div>
                            <input class="object1"   list="object"    style="float:left;"/>
                            <input class="part1"     list="part"      placeholder="Part (optional)" style="float:left;"/>
                        </div>
                        <div style="clear:both"></div>
                        <div class="line"> 
                            <div style="float:left; width:60px;">Attribute</div>
                            <input class="attribute" list="attribute" />
                        </div>
                    </div>

                    <div class="template attribute_process_template" style="display:none;" data-myclass="attribute_process_template" name="attribute_process">
                        <div class="line"> 
                            <div style="float:left; width:60px;">Object1</div>
                            <input class="object1"   list="object"    placeholder="Optional"  style="float:left;"/>
                            <input class="part1"     list="part"      placeholder="Part (optional)"  style="float:left;"/>
                        </div>
                        <div style="clear:both"></div>
                        <div class="line"> 
                            <div style="float:left; width:60px;">Process</div>
                            <input class="process"   list="process"  style="float:left;"/>
                        </div>
                        <div style="clear:both"></div>
                        <div class="line"> 
                            <div style="float:left; width:60px;">Object2</div>
                            <input class="object2"   list="object"    placeholder="Optional"  style="float:left;"/>
                            <input class="part2"     list="part"      placeholder="Part (optional)"  style="float:left;"/>
                        </div>
                        <div style="clear:both"></div>
                        <div class="line"> 
                            <div style="float:left; width:60px;">Attribute</div>
                            <input class="attribute" list="attribute" style="float:left;"/>
                        </div>
                    </div>

                    <div class="template attribute_action_template" style="display:none;" name="attribute_action">
                        <div class="line"> 
                            <div style="float:left; width:60px;">Action</div>
                            <input class="action"    list="action" style="float:left;"/>
                        </div>
                        <div style="clear:both"></div>
                        <div class="line"> 
                            <div style="float:left; width:60px;">Object1</div>
                            <input class="object1"   list="object"    placeholder="Optional"  style="float:left;"/>
                            <input class="part1"     list="part"      placeholder="Part (optional)"  style="float:left;"/>
                        </div>
                        <div style="clear:both"></div>
                        <div class="line"> 
                            <div style="float:left; width:60px;">Object2</div>
                            <input class="object2"      list="object"    placeholder="Optional"  style="float:left;"/>
                            <input class="part2"          list="part"      placeholder="Part (optional)"  style="float:left;"/>
                        </div>
                        <div style="clear:both"></div>
                        <div class="line"> 
                            <div style="float:left; width:60px;">Attribute</div>
                            <input class="attribute"  list="attribute" style="float:left;"/>
                        </div>
                    </div>

                    <div class="template object_template" style="display:none;" name="object">   
                        <div class="line"> 
                            <div style="float:left; width:60px;">Object</div>
                            <input class="object1"   list="object"    style="float:left;"/>
                            <input class="part1"     list="part"      placeholder="Part (optional)" style="float:left;" />
                        </div>
                        <div style="clear:both"></div>
                    </div>

                    <div class="template process_template" style="display:none;" name="process">
                        <div class="line"> 
                            <div style="float:left; width:60px;">Object1</div>
                            <input class="object1"   list="object"    placeholder="Optional"  style="float:left;"/>
                            <input class="part1"     list="part"      placeholder="Part (optional)"  style="float:left;"/>
                        </div>
                        <div style="clear:both"></div>
                        <div class="line"> 
                            <div style="float:left; width:60px;">Process</div>
                            <input class="process"   list="process" />
                        </div>
                        <div style="clear:both"></div>
                        <div class="line"> 
                            <div style="float:left; width:60px;">Object2</div>
                            <input class="object2"   list="object"    placeholder="Optional"  style="float:left;"/>
                            <input class="part2"     list="part"      placeholder="Part (optional)"  style="float:left;"/>
                        </div>
                    </div>

                    <div class="template action_template" style="display:none;" name="action">
                        <div class="line"> 
                            <div style="float:left; width:60px;">Action</div>
                            <input class="action"    list="action"  style="float:left;"/>
                        </div>
                        <div style="clear:both"></div>
                        <div class="line"> 
                            <div style="float:left; width:60px;">Object1</div>
                            <input class="object1"   list="object"    placeholder="Optional"  style="float:left;"/>
                            <input class="part1"     list="part"      placeholder="Part (optional)"  style="float:left;"/>
                        </div>
                        <div style="clear:both"></div>
                        <div class="line"> 
                            <div style="float:left; width:60px;">Object2</div>
                            <input class="object2"   list="object"    placeholder="Optional"  style="float:left;"/>
                            <input class="part2"     list="part"      placeholder="Part (optional)"  style="float:left;"/>
                        </div>
                    </div>

                </div>   <!-- End of <div class="templates"> -->
            </div>    <!-- End of <div class="div_template_section" -->

            <div style="clear:both;"></div>

            <button class="button_accept" style="margin-top:12px; padding:4px;">Accept</button>

            <div style="clear:both;"></div>

        </div>   <!-- End of <div class="main1">  -->
        
        <div class="div_main2" style="margin-top:10px;">  <!-- The cloned copy of <div class="div_main1" goes here.  -->
        </div>

        <div class="div_conditions">   <!-- Any conditional option radio-button and templates go here.  -->
        </div>
    </div>       <!--End of <div class="div_main"> -->

    <div class="div_wordlist" style="float:right; width:150px; height:300px; margin-left:10px; border:solid 1px #606060; background:white;">
        <select class="listbox_wordlist" size="20" style="width:148px;height:298px;border:none;background:white;"></select>
    </div>

    <div style="clear:both;"></div>

    <button class="button_ok link_causes1way_dialog_ok" style="float:left;">OK</button>
    <button class="button_cancel link_causes1way_dialog_ok" style="float:left;">Cancel</button>
    <!--input  id="button_node_type_dialog_display" type="button" class="link_causes1way_dialog_ok" style="float:left;" value="Display">
    <input  id="button_node_type_dialog_cancel" type="button" class="link_causes1way_dialog_cancel" style="float:left;" value="Cancel"-->

</div>
`;

