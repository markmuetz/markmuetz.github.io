/*
2 Aug 2023
Robert Muetzelfeldt
node_template
This widget uses a "template" approach to enable a user to define webAKT diagram nodes.

The node_template widgette is closely related, and is essentally a subset of this one, but
restricted to diagram nodes.  The two could be merged, to avoid code duplication, but are kept
separate during development. 

21 Aug 2023
This version (node_template_x1.js) is archive copy, saved prior to resolving the issue arising
from the user specifying the type of node (attribute, object, process or action) in the diagram
panel, then again choosing one of these 4 options in the node_template panel.
*/


AKT.widgets.node_template = {};


AKT.widgets.node_template.setup = function (widget) {

    console.log(1501,widget.options);

    var kbId = AKT.state.current_kb;
    var kb = AKT.KBs[kbId];

    if (widget.options.show_titlebar) {
        var widgetTitlebar = $(
            '<div class="title-bar">'+
                '<div>node_template</div>'+
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

    $(widget.element).find('.button_ok').on('click', function() {
        AKT.recordEvent({
            element:widget.element,
            finds:['#button_node_type_dialog_display'],
            event:'click',
            message:'Clicked the OK button in the node_template widget'});
        // The filter operation removes empty elements.
        var rawJson = processTemplate();
        var json = rawJson.filter(function(n){return n}); 
        console.log(50001,rawJson,json);
        // Very clumsy, but works...
        var array = json.flat(9);
        var id = '';
        for (var i=0;i<array.length;i++) {
            var a = array[i];
            if (a!=='att_value' && a!=='part' && a!=='process' && a!=='action') {
                if (id==='') {
                    id += a;
                } else {
                    id += '_'+a;
                }
            }
        }

        console.log(json,array,id);
        $('.div_node_json').text(id);
        //var node = new Node({id:'temp',json:json});
    });   


    function processTemplate() {            
        var mode = widget.options.mode;

        // To save duplication, we try to pick up all possible fields here,
        // even if they are not present in some of the dialogs.
        // We do it twice, for main1 and main2.
        var mainJson = [];
        var mainClass = '.div_main1';

        var nodeType = $(widget.element).find(mainClass).find("input[name='node_types1"+"']:checked").val();
        if (!nodeType) {
            nodeType = 'attval';
        }
        var attvalType = $(widget.element).find(mainClass).find("input[name='attval_types1"+"']:checked").val();
        console.log(nodeType,attvalType);

        if (nodeType === 'attval') {
            var templateClass = '.'+attvalType+'_template';
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

        var fullObject1 = getFullObject(object1,part1);
        var fullObject2 = getFullObject(object2,part2);

        console.log(mainClass,1,fullObject1,2,fullObject2,3,process,4,action,5,attribute);

        // attribute-object
        if (nodeType === 'attval') {
            if (attvalType === 'attval_object') {
                var json = ['att_value',fullObject1,attribute];

            // attribute-process
            } else if (attvalType === 'attval_process') {
                if (fullObject1) {
                    if (fullObject2) {
                        var json = ['att_value',['process',fullObject1,process,fullObject2],attribute];
                    } else {
                        json = ['att_value',['process',fullObject1,process],attribute];
                    }
                } else {
                    json = ['att_value',['process',process],attribute];
                }

            // attribute-action
            } else if (attvalType === 'attval_action') {
                if (fullObject1) {
                    if (fullObject2) {
                        var json = ['att_value',['action',action,fullObject1,fullObject2],attribute];
                    } else {
                        json = ['att_value',['action',action,fullObject1],attribute];
                    }
                } else {
                    json = ['att_value',['action',action],attribute];
                }
            }

        // object
        } else if (nodeType === 'object') {
            var json = fullObject1;

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


// ===================================================================================
// Here we handle the radio buttons, for the different types of node
// They are in two groups.
// The first group is for the 4 top-level categories (attval, object, process or action).
// If the user choses attval, then the second group is enabled, for attval, process or action.

    // One of the attval radiobuttons (object, process or action) is selected.
    $(widget.element).find('.node_type_options input').on('change',function(event) {
        console.log('*** .node_type_options');
        AKT.recordEvent({
            element: widget.element,
            finds:   ['.node_type_options input'],
            qualifier: "[value='"+event.target.value+"']",
            event:   'change',
            value:   event.target.value,
            message: 'Clicked a node_type radiobutton in the node_template widget'});
        $(this).attr('checked',true);
        var nodeType = event.target.value;
    });


    function displayAttvalOptions() {
        console.log('displayAttvalOptions');
        $(widget.element).find('.attval_only').css({display:'block'});
        $(widget.element).find('.div_main1').css({display:'block'});
        $(widget.element).find('.nodetype_options').css({display:'block'});
        $(widget.element).find('.attval_options > input').attr('disabled',false);
        $(widget.element).find('.attval_options > label').css({color:'black'});
        $(widget.element).find('.attval').css({display:"block"});
    }



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
            message: 'Clicked a nodetype_options radiobutton in the node_template widget'});
        $(this).attr('checked',true);
        if (!type) type = event.target.value;
        $(parentElement).find('.template').css({display:'none'});
        
        if (type === 'attval') {
            $(parentElement).find('.attval_options > input').attr('disabled',false);
            $(parentElement).find('.attval_options > label').css({color:'black'});
            $('.attval').css({display:"block"});

        // object, process or action radio button selected
        } else {
            $(parentElement).find('.attval_options > input').attr('disabled',true);
            $(parentElement).find('.attval_options > label').css({color:'#808080'});
            $(parentElement).find('.template').css({display:'none'});
            var templateClass = '.'+type+'_template';
            $(parentElement).find(templateClass).css({display:'block'});
        }
    });


    // One of the attval radiobuttons (object, process or action) is selected.
    $(widget.element).find('.attval_options input').on('change',function(event,attvalType) {
        console.log('*** .attval_options');
        var parentElement = $(this).parent().parent().parent();
        AKT.recordEvent({
            element: widget.element,
            finds:   ['.'+parentElement[0].className,'.attval_options input'],
            qualifier: "[value='"+event.target.value+"']",
            event:   'change',
            value:   event.target.value,
            message: 'Clicked an attval_options radiobutton in the node_template widget'});
        $(this).attr('checked',true);
        if (!attvalType) attvalType = event.target.value;
        //if (!attvalType) attvalType = event.target.value;  TODO check if needed (shouldn't be)
        $(parentElement).find('.template').css({display:'none'});
        var templateClass = '.'+attvalType+'_template';
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
            message: 'Clicked on the wordlist listbox (select element) in the node_template widget'});
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
            message: 'Clicked on '+event.target.value+' input field in the node_template widget'});

        handleInputEvent(this, event, 'mousedown', arg);
    });

    $(widget.element).find(".attribute").find('input').on('keyup',function(event, arg) {
        console.log('* 3002');
        handleInputEvent(this, event, 'keyup', arg);
    });


    // --------------------------------------------------- End of event handlers
}   // End of createEmptyWidget()



AKT.widgets.node_template.display = function (widget) {

    console.log('display...',widget.options);

        $(widget.element).find('.div_main1').css({display:'block'});
        $(widget.element).find('.div_main2').css({display:'none'});
        

        // Customise radiobuttons for the widget's "mode" option.

        $(widget.element).find('.node_only').css({display:'block'});
        $(widget.element).find('.div_main2').css({display:'none'});
        $(widget.element).find('.line_value').css({display:'none'});
        $(widget.element).find('.attval_options > input').attr('disabled',true);
        $(widget.element).find('.attval_options > label').css({color:'#808080'});
        $(widget.element).find('.attval').css({display:"block"});
        $(widget.element).find('.line > ').css({'margin-bottom':'3px'});
    }




AKT.widgets.node_template.html = `
<div id="div_node_template_dialog" class="content" style="padding-left:10px;padding-right:10px;padding-top:0px;padding-bottom:5px;">

    <div>Enter a node clause using AKT's formal notation:</div>
    <div class="div_main" style="float:left;">  <!-- The container for BOTH sets of radio-buttons and templates -->


        <div>
            <div style="float:left;">Formal</div>
            <div class="div_formal" contenteditable style="float:left; height:16px; width:100px; border:solid 1px black; background:white; margin:3px;"></div>
        </div>
            
        <div style="clear:both"></div>

        <hr style="width:100%; height:0px; border:solid #a0a0a0 3px; margin-top:4px; margin-bottom:4px;" />

        <div><b>OR:</b> Use the template to build up the clause:</div>

        <div class="div_main1" style="margin-top:5px;">   

            <div class="div_options" style="float:left;">
                <!-- nodetype options -->
                <div class="nodetype_options" style="float:left; margin-left:10px;">
                    <input type="radio" class="attval_option" name="node_types1" value="attval">
                    <label>an attribute of:</label><br>
                    <input type="radio" class="object_option" name="node_types1" value="object">
                    <label>an object</label><br>
                    <input type="radio" class="process_option" name="node_types1" value="process">
                    <label>a process</label><br>
                    <input type="radio" class="action_option" name="node_types1" value="action">
                    <label>an action</label><br>
                </div>

                <div class="attval_options" style="float:left; margin-left:6px;">
                    <input type="radio" class="attval_option attval_object_option" name="attval_types1" value="attval_object">
                    <label>an object</label><br>
                    <input type="radio" class="attval_option attval_process_option" name="attval_types1" value="attval_process">
                    <label>a process</label><br>
                    <input type="radio" class="attval_option attval_action_option" name="attval_types1" value="attval_action">
                    <label>an action</label><br>
                </div>

                <div style="clear:both;"></div>
            </div>   <!-- End of <div class="div_options"> -->


            <!-- ------------------------------------------------------------------------------------ -->
            <div class="div_templates" style="float:left;margin-left:10px;margin-top:7px;padding:4px;border:solid 1px black;">

                <div class="template attval_object_template" style="display:none;" name="attval_object">
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
                    <div style="clear:both"></div>
                    <div class="line line_value"> 
                        <div style="float:left; width:60px;">Value</div>
                        <input class="value" list="value" />
                    </div>
                </div>

                <div class="template attval_process_template" style="display:none;" data-myclass="attval_process_template" name="attval_process">
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
                    <div style="clear:both"></div>
                    <div class="line line_value"> 
                        <div style="float:left; width:60px;">Value</div>
                        <input class="value" list="value" />
                    </div>
                </div>

                <div class="template attval_action_template" style="display:none;" name="attval_action">
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
                    <div style="clear:both"></div>
                    <div class="line line_value"> 
                        <div style="float:left; width:60px;">Value</div>
                        <input class="value" list="value" />
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

            <div style="clear:both;"></div>

            <button class="button_accept">Accept</button>
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

    <div class="div_statement_displays">
        <div class="div_statement_json"></div>
        <div class="div_statement_formal"></div>
        <div class="div_statement_english"></div>
    </div>

    <button class="button_ok link_causes1way_dialog_ok" style="float:right;">OK*</button>
    <input  id="button_node_type_dialog_display" type="button" class="link_causes1way_dialog_ok" style="float:right;" value="Display">
    <input  id="button_node_type_dialog_cancel" type="button" class="link_causes1way_dialog_cancel" style="float:right;" value="Cancel">

</div>
`;

