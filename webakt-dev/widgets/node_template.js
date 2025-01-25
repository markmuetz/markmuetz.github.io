/*
30 April 2022
Robert Muetzelfeldt
This widget uses a "template" approach for two quite separate jobs:
1. To enable a user to formulate a name for a node in a diagram in terms of objects,
   processes, actions and attributes;
2. To enable a user to enter any legal AKT statement without having to use AKT's
   Prolog syntax.
*/



(function ($) {

  /***********************************************************
   *         node_template widget
   ***********************************************************
   */
    $.widget('akt.node_template', {
        meta:{
            short_description: 'node_template',
            long_description: 'node_template',
            author: 'Robert Muetzelfeldt',
            last_modified: 'April 2022',
            visible: false,
            options: {
                mode: null  // One of node, attval, causal
            }
        },

        options: {
            kbId: null,
            show_titlebar: true,
            mode: 'node'
        },

        widgetEventPrefix: 'node_template:',

        _create: function () {
            //console.log('\n### Creating instance of widget "akt.node_template".',
            //    '\nElement ID:',this.element[0].id,'  Widget UUID:',this.uuid,'  Options:',this.options);
            var self = this;
            this.element.addClass('node_template-1');

            createEmptyWidget(self);

            //display(self, self.options);

            //this._setOptions({
            //});
        },

        _destroy: function () {
            this.element.removeClass('node_template-1');
            this.element.empty();
            this._super();
        },

        _setOptions: function( options ) {
            var self = this;
         
            $.each( options, function( key, value ) {
                self._setOption( key, value );
            });
            console.log(100,'_setOptions:',self.options);
            console.log(self);
            display(self, self.options, null);
        },

        _setOption: function (key, value) {
            //var fnMap = {
            //};

            // base
            this._super(key, value);

            //if (key in fnMap) {
            //    fnMap[key]();

                // Fire event
            //    this._triggerOptionChanged(key, prev, value);
            //}
        },

        _triggerOptionChanged: function (optionKey, previousValue, currentValue) {
            this._trigger('setOption', {type: 'setOption'}, {
                option: optionKey,
                previous: previousValue,
                current: currentValue
            });
        }
    });

    // ================================= Functions

    function createEmptyWidget(widget) {
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

        // TODO Including the creation of the suggested-word lists here is a temporary hack.
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

        $(widget.element).append($(baseHtml()));

        $(widget.element).find('.letters').find('div').css({float:'left','font-family':'courier','font-size':'18px'});

        $(widget.element).css({display:'block'});
        $(widget.element).draggable();

        var divMain2 = $(widget.element).find('.div_main1 > div').clone().appendTo('.div_main2');
        $(divMain2).find('.causal_only').text('Effect');
        // We have to provide a separate name for the two radiobutton groups, to 
        // ensure that they behave as a group and don't interfere with the other
        // group.
        $(divMain2).find('.nodetype_options > input').attr('name','node_types2');
        $(divMain2).find('.attval_options > input').attr('name','attval_types2');

  // -------------------------------------------------------------------------
        // BUTTONS
        $('#button_node_type_dialog_ok').on('click', function() {
            var json = processTemplate();
            var id = 's2001';
            var statement = new Statement({id:id,json:json});
            var kbId = AKT.state.current_kb;
            var kb = AKT.KBs[kbId];
            kb._statements[id] = statement;
            var formal = statement.generateFormal();
            var english = statement.generateEnglish();

            var currentWidget = AKT.state.current_widget;
            $(currentWidget.element).dialog_Generic('option', 'statement', statement);

            var id = $(this).parent().parent()[0].id;
            $('#'+id).css({display:"none"});
        });   

        $('#button_node_type_dialog_display').on('click', function() {
            AKT.recordEvent({
                element:widget.element,
                finds:['#button_node_type_dialog_display'],
                event:'click',
                message:'Clicked the Display button in the node_template widget'});
            var json = processTemplate();
            console.log(json);
            $('.div_statement_json').text(JSON.stringify(json));
            var statement = new Statement({id:'temp',json:json});
            var formal = statement.generateFormal();
            $('.div_statement_formal').text(formal);
            var english = statement.generateEnglish();
            $('.div_statement_english').html(english);
        });   


        function processTemplate() {            
            var mode = widget.options.mode;

            // To save duplication, we try to pick up all possible fields here,
            // even if they are not present in some of the dialogs.
            // We do it twice, for main1 and main2.
            var mainJson = [];
            for (var i=1; i<=2; i++) {
                if (widget.statement_type === 'attval' && i === 2) continue;

                var mainClass = '.div_main'+i;
                console.log('\n\nMAINCLASS = ',mainClass);

                var nodeType = $(widget.element).find(mainClass).find("input[name='node_types"+i+"']:checked").val();
                if (!nodeType) {
                    nodeType = 'attval';
                }
                var attvalType = $(widget.element).find(mainClass).find("input[name='attval_types"+i+"']:checked").val();
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
                var value = $(templateElement).find('.value').val();

                var fullObject1 = getFullObject(object1,part1);
                var fullObject2 = getFullObject(object2,part2);

                console.log(mainClass,1,fullObject1,2,fullObject2,3,process,4,action,5,attribute,6,value);
    
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
                    // This is a neat way of handling the fact that the JSON for a node does NOT
                    // include the att_value 'value' argument, whereas it does for an att_value statement.
                    if (mode === 'statement') {
                        console.log('#####',json,value);
                        json.push(value);
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
                mainJson[i] = json;
                
            }   // End of loop over i for main1 and main2.

            console.log(mainJson);
            if (widget.statement_type === 'attval') {
                mainJson = mainJson[1];
            } else {
                mainJson[0] = 'causes1way';
            }
            console.log(mainJson);
            return mainJson;

            // I do not like having to work with the JointJs element (i.e. the node) here.
            // I would much prefer something based on the JavaScript prompt(Message) pattern,
            // i.e. var json = ~~~~.node_template();
            // when you click on the OK button,
            // but that does not seem possible for dialogs.  Note that the JointJs methods used
            // here are defined in the diagram.js widget.

            /*
            var jointNode = AKT.state.currentElement;
            jointNode.json = json;
            jointNode.label = jointNode.makeNodeName(json);
            jointNode.myLabel = jointNode.makeNodeLabelWrapped(json);
            jointNode.attr('label/text',jointNode.myLabel.wrappedString)
            jointNode.makeNodeFormal(json);
            jointNode.status = 'named';

            jointNode.attr('body/fill','white');

            $('.template').find('.input').val('');
            */

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
        $(widget.element).find('.statement_type_options input').on('change',function(event) {
            console.log('*** .statement_type_options');
            AKT.recordEvent({
                element: widget.element,
                finds:   ['.statement_type_options input'],
                qualifier: "[value='"+event.target.value+"']",
                event:   'change',
                value:   event.target.value,
                message: 'Clicked a statement_type radiobutton in the node_template widget'});
            $(this).attr('checked',true);
            var statementType = event.target.value;
            if (statementType === 'attval') {
                widget.statement_type = 'attval';
                displayAttvalOptions();
            } else {
                widget.statement_type = 'causal'
                displayCausalOptions();
            }
        });


        function displayAttvalOptions() {
            $(widget.element).find('.causal_only').css({display:'none'});
            $(widget.element).find('.attval_only').css({display:'block'});
            $(widget.element).find('.div_main2').css({display:'none'});
            $(widget.element).find('.nodetype_options').css({display:'none'});
            $(widget.element).find('.attval_options > input').attr('disabled',false);
            $(widget.element).find('.attval_options > label').css({color:'black'});
            $(widget.element).find('.attval').css({display:"block"});
        }


        function displayCausalOptions() {
            $(widget.element).find('.attval_only').css({display:'none'});
            $(widget.element).find('.causal_only').css({display:'block'});
            $(widget.element).find('.div_main1').css({display:'block'});
            $(widget.element).find('.div_main2').css({display:'block'});
            $(widget.element).find('.nodetype_options').css({display:'block'});
            $(widget.element).find('.attval_options').css({display:'block'});
            $(widget.element).find('.attval_options > input').attr('disabled',true);
            $(widget.element).find('.attval_options > label').css({color:'#808080'});
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



    // ################################################################ DISPLAY
    function display(widget) {
        //var kbId = widget.options.kbId;
        //var kb = AKT.KBs[kbId];

        console.log(201, widget.wordLists);

        var mode = widget.options.mode;  // mode = 'node' or 'statement''

        $(widget.element).find('.div_main1').css({display:'none'});
        $(widget.element).find('.div_main2').css({display:'none'});
        

        // Customise radiobuttons for the widget's "mode" option.

        // This section is solely concerned with selecting the radio buttons that the user
        // can select for specifying which templates to display, according to AKT5's grammar.
        // The basic idea is that the full set of radio buttons exist in the HTML, but some
        // are not displayed (CSS display:none) if not relevant for the chosen mode.

        // First, turn off labels for all 3 types of display.
        $(widget.element).find('.attval_only').css({display:'none'});
        $(widget.element).find('.causal_only').css({display:'none'});
        $(widget.element).find('.node_only').css({display:'none'});

        // Then, turn on label for the required type of display, and make other required changes.
        if (mode === 'attval') {   // attribute-value statement
            $(widget.element).find('.attval_only').css({display:'block'});
            $(widget.element).find('.div_main2').css({display:'none'});
            $(widget.element).find('.nodetype_options').css({display:'none'});
            $(widget.element).find('.attval_options > input').attr('disabled',false);
            $(widget.element).find('.attval_options > label').css({color:'black'});
            $(widget.element).find('.attval').css({display:"block"});

        } else if (mode === 'causal') { // causal statement
            $(widget.element).find('.causal_only').css({display:'block'});
            $(widget.element).find('.attval_options > input').attr('disabled',true);
            $(widget.element).find('.attval_options > label').css({color:'#808080'});

        } else if (mode === 'node') { // label for diagram node
            $(widget.element).find('.node_only').css({display:'block'});
            $(widget.element).find('.div_main2').css({display:'none'});
            $(widget.element).find('.line_value').css({display:'none'});
            $(widget.element).find('.attval_options > input').attr('disabled',true);
            $(widget.element).find('.attval_options > label').css({color:'#808080'});
            $(widget.element).find('.attval').css({display:"block"});
        }
        $(widget.element).find('.line > ').css({'margin-bottom':'3px'});
    }


    // ################################################################ BASEHTML
    function baseHtml() {
    return `
<div id="div_node_template_dialog" class="content" style="padding-left:10px;padding-right:10px;padding-top:0px;padding-bottom:5px;">

    <div class="div_main" style="float:left;">  <!-- The container for BOTH sets of radio-buttons and templates -->

        <div class="statement_type_options">   
            <div style="font-weight:bold;">Statement type</div>
            <input type="radio" class="statement_type_option" name="statement_type" value="attval">
            <label>Attribute_value</label><br>
            <input type="radio" class="statement_type_option" name="statement_type" value="causal">
            <label>Causal</label><br>
        </div>
            
        <div class="div_main1" style="margin-top:5px;">   
        <!-- The container for ONE set of option radio buttons and templates.
             For nodes and att_value statements, this is all we use.
             For causal statements, this is used for the 'cause' part, 
             and is cloned for the 'effect' part. -->

            <div class="div_options" style="float:left;">
                <div class="attval_only" style="font-weight:bold;">Attribute-value</div>
                <div class="causal_only" style="font-weight:bold;">Cause</div>
                <div class="node_only" style="font-weight:bold;">Node label</div>

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

    <input  id="button_node_type_dialog_ok" type="button" class="link_causes1way_dialog_ok" style="float:right;" value="OK">
    <input  id="button_node_type_dialog_display" type="button" class="link_causes1way_dialog_ok" style="float:right;" value="Display">
    <input  id="button_node_type_dialog_cancel" type="button" class="link_causes1way_dialog_cancel" style="float:right;" value="Cancel">

</div>
`;
    }

})(jQuery);
