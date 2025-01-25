//$(document).ready(function(){
    var AKT = {};
    var akt = {};
    AKT.cola;
    AKT.state = {
        current_kb: null,
        current_listener: {uuid:null,type:null},
        event_recording: true,
        events: {counter:0},
        zindex: 1000,
        message_counter:0, 
        counter: {all_tools:0},
        diagram_counter: 0,
        listeners: [],   // This is an array of current listeners for an item_selection event.
        panel_last_of_type: {},
        panel_counter: {},   // One counter for each panel type.
        panels_counter:{total:0,left:0,right:0}, // The total number of panels that have been created.
        stepCounter: 0
    };
    AKT.tools = {};
    AKT.diagrams ={};  // Temporary measure, to hold the JSON for diagrams (currently just acheampong).
    AKT.options = {
        show_zindex_incrementing: true,
        layout_max_number_of_nodes: 300
    };
    AKT.event_records = [];

    AKT.kbs = {};
    AKT.KBs = {};
    AKT.bulk = {};
    AKT.widgets = {};
    AKT.tutorials = {};
    AKT.eventRecord = [];   // A record of events, captured in Panel and elsewhere,
                            // which can be used to build a tutorial or UI test.

    AKT.menuHandler = {};   // Functions that respond to a menu command
    AKT.dialogOpener = {};  // Functions that open a dialog with function-specific parameters

    // TODO: Need to replace with name of the current KB, when it's loaded!
    AKT.titlebar = `     
    <div class="title-bar">
        <div>Welcome to this AKTknowledge base.</div>
        <input type="button" value="X" class="dialog_close_button"/>
    </div>`;


AKT.processQueryString = function () {
    var url = window.location.href;
    var parts = url.split('?');
    //.substring(window.location.href.indexOf('?') + 1);
    if (parts.length ===2 && parts[1].length > 0) {
        var queryString = parts[1];
        var objectArray = [];
        var objectStringArray = queryString.split('&');
        for (var i=0; i<objectStringArray.length; i++) {
            var propertyStringArray = objectStringArray[i].split('+');
            var object = {};
            for (var j=0; j<propertyStringArray.length; j++) {
                var propertyArray = propertyStringArray[j].split('=');   // Always [property,value]
                object[propertyArray[0]] = propertyArray[1];
            }
            objectArray.push(object);
        }
        return objectArray;
    } else {
        return [];
    }
};



    AKT.makeWidgetTitlebar = function (widgetName,widgetElement,widgetOptions) {
        var titlebarDiv = $('<div class="w3-row titlebar" style="padding:4px;border-bottom:solid 1px black;font-size:12px;"></div>');
        var closeButtonDiv = ('<div class="w3-right dialog_close_button" style="margin-right:5px;">Y</div>');
        if (widgetOptions.tree_type) {
            var titleDiv = $('<div class="w3-rest" style="text-align:center;">'+widgetName+' ('+widgetOptions.tree_type+')</div>');
        } else {
            var titleDiv = $('<div class="w3-rest" style="text-align:center;">'+widgetName+'</div>');
        }
        $(titlebarDiv).append(closeButtonDiv).append(titleDiv);
/* Why doesn't this work?   Doesn't respond to mouse click
        $(widgetElement).append(titlebarDiv);
        $(closeButtonDiv).on('click', function () {
            console.log('click');
            $(widgetElement).css({display:"none"});
        });
*/
        return titlebarDiv;
    };

    // Note that I am sticking to the AKT5 pattern (the label for a <select> or other input field is
    // the legend for a fieldset which encloses it
    AKT.makeReprocessSelector = function  (widgetElement, widgetName, legend, optionArray, selectedOption,optionId,className,containerClass) {

        var divElement = $('<div style="float:left; font-family:sans; margin:2px;margin-left:15px;"></div>');
        var legendElement =  $('<legend class="legend_'+className+'" style="float:left; font-size:11px;text-align:right;width:120px;">'+legend+'</legend>');
        var selectElement = $('<select class="listbox_'+className+'" style="float:left; margin-left:5px;border:none;background:white;font-size:11px;width:120px;"></select>');
        $(divElement).append(legendElement).append(selectElement).append('<div style="clear:both;"></div>');

        $.each(optionArray, function(i,option) {
            if (option === selectedOption) {
                var optionElement = $('<option selected value="'+option+'">'+option+'</option>');
            } else {
                var optionElement = $('<option value="'+option+'">'+option+'</option>');
            }
            $(selectElement).append(optionElement);
        });

        $(selectElement).on('change', function () {
            console.log('\n***on_change\nwidgetName: ',widgetName, '\noptionId: ',optionId, '\n$(this).val(): ',$(this).val());
            $(widgetElement)[widgetName]('option', optionId, $(this).val());
            $(widgetElement).blur();
        });

        return divElement;
    };


    AKT.showDialog = function (dialogId) {
        console.log('\nDIALOG: Opening dialog: ',dialogId);
        var zindex = AKT.incrementZindex("AKT.showDialog = function ("+dialogId+")");
        $('#'+dialogId).css({display:"block", float:"none", "z-index":zindex});
    };


    // This should now rightly be called something like "makeNewHighestZindex(),
    // since it is designed to cope with rogue situations where someone
    // gives a panel a high z-index but does not update AKT.state.zindex.
    AKT.incrementZindex = function (calledFrom) {
        console.log('\n*** Function AKT.incrementZindex: calledFrom: ',calledFrom);
        var index_highest = 0;   
        $('.panel').each(function() {
            // always use a radix (10) when using parseInt
            var index_current = parseInt($(this).css("z-index"), 10);
            if(index_current > index_highest) {
                index_highest = index_current;
            }
        });
        AKT.state.zindex = index_highest+1;
        if (AKT.options.show_zindex_incrementing) {
            //console.log('ZINDEX: ',index_highest, '>',AKT.state.zindex,calledFrom);
        }
        return AKT.state.zindex;
    };


    AKT.changeKb = function (kbId) {
        AKT.state.current_kb = kbId;
        $('#current_kb_title').text(kbId);
        console.log('\n*** Change to knowledge base: '+kbId);
    };


    // =================================================================
    // This function is used to generate random artificial statements for
    // testing the new-statement panel, to save having to type in lots of 
    // test statements manually.
    // The nested functions generate separate parts of each statement.

    AKT.makeStatement = function () {
        switch(randomInteger(2)) {
          case 1: return makeMain();
          case 2: return ['if',makeMain(),makeCondition()];
        }

        function makeMain() {
            switch(randomInteger(2)) {
              case 1: return makeAttValue();
              case 2: return ['causes1way',makeAttValue(),makeAttValue()];
            }
        }

        function makeCondition() {
            switch(randomInteger(1)) {
              case 1: return makeAttValue();
            }
        }

        function makeAttValue() {
            switch(randomInteger(2)) {
              case 1: return ['att_value',makeObject(),makeAttribute(),makeValue()];
              case 2: return ['att_value',['part',makeObject(),makeObject()],makeAttribute(),makeValue()];
            }
        }

        function makeObject() {
            return 'object'+randomInteger(30);
        }

        function makeAttribute() {
            return 'attribute'+randomInteger(10);
        }

        function makeValue() {
            return 'value'+randomInteger(10);
        }

        function randomInteger(n) {
            return Math.floor(n*Math.random()+1);
        }
    };

// =========================================================================
/* This is a quick test of method chaining.
console.log('TEST');
class Adder {
  constructor(initialNumber) {
    this.result = initialNumber;
}
  add(number) {
    var b = new Adder(this.result);
    b.result += number;
    return b;
  }
}

const value = new TestObject(7)
    .add(2)
    .add(3);

var a = new Adder(7);
var value = a.add(2).add(3);
console.log('TEST value:',value);
console.log('TEST a: ',a);
*/

// ================================================================================================


// Feb 2022: Superceded by AKT.loadSelectOptions() (below), but still used in some places.
AKT.loadOptions = function (widgetContent, selectElementClass, options, useIndex) {
    var selectElement = $(widgetContent).find('.'+selectElementClass);
    $(selectElement).empty();
    if (!options) return;
    if (Array.isArray(options)) {
        for (var i=0; i<options.length; i++) {
            if(useIndex) {   // Note!! The value attribute can either be the index or the option itself!!!
                var v = i;
            } else {
                v = options[i];
            }
            if (i === 0) {
                $(selectElement).append('<option selected value="'+v+'">'+options[i]+'</option>');
            } else {
                $(selectElement).append('<option value="'+v+'">'+options[i]+'</option>');
            }
        }
    } else {
        var i = 0;
        for (var optionId in options) {
            $(selectElement).append('<option value="'+optionId+'">'+optionId+'</option>');
            i += 1;
        }
    }
};

// Feb 2022: An analog of AKT.loadSelectOptions(), but builds up a single-column table
// Note added 24 April 2022: Seems to duplicate to AKT.loadMySelectOptions(), below.  Only
// Used in formal_term_details widgette.
// TODO: change use in formal_term_details to AKT.loadMySelectOptions()
AKT.loadTable = function (widgetContent, tableElementClass, options, useIndex) {
    var tableElement = $(widgetContent).find('.'+tableElementClass);
    $(tableElement).empty();
    if (!options) return;
    if (Array.isArray(options)) {
        for (var i=0; i<options.length; i++) {
            if(useIndex) {   // Note!! The value attribute can either be the index or the option itself!!!
                var v = i;
            } else {
                v = options[i];
            }
            if (i === 0) {
                $(tableElement).append('<tr><td>'+options[i]+'</td></tr>');   // 'selected' option not yet
                       // identifed!  See equivalent bit in AKT.loadOptions()
            } else {
                $(tableElement).append('<tr><td>'+options[i]+'</td></tr>');
            }
        }
    } else {
        var i = 0;
        for (var optionId in options) {
            $(tableElement).append('<tr><td>'+optionId+'</td></tr>');
        }
    }
    $(tableElement).find('tr').css({'line-height':'16px','min-height':'16px'});
    $(tableElement).find('td').css({'text-align':'left','vertical-align':'top','line-height':'16px','min-height':'16px'});

};


// Oct 2021 New version.  Specific for a collection of objects
// The 'selector' argument is a two-element array, specifying the property to use for 
// the 'value' attribute of the <option> tag, and the property to be used for the 
// displayed text for the <option> tag, respectively.   
// Allowed settngs for the "options" argument:
// - includeKey: text for the listbox entry includes the key (mainly used for statements);
// - title:      each entry in the listbox has an HTML "title" attribute.

// TODO: Allow '*' for the first one, to use the object's key itself.
AKT.loadSelectOptions = function (widgetContent, selectElementClass, objects, selector,options) {
    var selectElement = $(widgetContent).find('.'+selectElementClass);
    $(selectElement).empty();
    if (!objects) return;
    if (options && options.includeKey) {
        $.each(objects, function(key,object) {
            $(selectElement).append('<option value="'+key+'">'+key+': '+object[selector[1]]+'</option>');
        });
    } else if (options && options.title) {
        $.each(objects, function(key,object) {
            $(selectElement).append('<option value="'+key+'" style="height:14px" title="'+object[options.title]+'">'+object[selector[1]]+'</option>');
        });
    } else {
        $.each(objects, function(key,object) {
            $(selectElement).append('<option value="'+key+'">'+object[selector[1]]+'</option>');
        });
    }

/* This is neat, since save having to do it for ever <select> listbox, but curently disabled
   since that's just what I do do.  TODO: investigate this.
    $(selectElement).on('change', function () {
        console.log('selected!',selectElementClass,selector,$(this).find(':selected').val());

        AKT.recordEvent({
            file:'webakt.js',
            function:'AKT.loadSelectOptions)',
            element:widgetContent,
            finds:['.'+selectElementClass],
            event:'change',
            value: $(this).find(':selected').val(),
            message:'Selected option '+$(this).find(':selected').val()+' in the '+selectElementClass+' <select> listbox.'
        });
    });
*/
};


/* Sept 2022 
   Obsolete, replaced by AKT.myListbox ();
// Jan 2022.  This is my attempt at making a very basic alternative listbox, an alternative to the 
// <select> element with the size attribute set at (say) 15,
// since it seems that it's behaviour is browser-dependent.  Crucially, in browsers other than
// Chrome, it displays just one line until it is opened up by clicking on it!
// There may be a way of handling this, but I've been thinking for a while that it would be nice
// to have columns (ideally, sortable) in the listbox.  A simple way of doing this is to use
// the <table> element, so that's what I'm trying here.   
// Note that the function call for it is unchanged, but the second argument now refers to a 
// <div> element rather than a <select> element in the widget's HTML.
AKT.loadMySelectOptions = function (widgetContent, divElementClass, objects, selector,options) {
    var divElement = $(widgetContent).find('.'+divElementClass);
    $(divElement).empty();
    if (!objects) return;
    var tableElement = $('<table style="margin:3px;"></table>');

    if (options && options.includeKey) {   
        $.each(objects, function(key,object) {
            var trElement = $('<tr class="tr" data-key="'+key+'"></tr>');
            var tdKeyElement = $('<td style="text-align:left;vertical-align:top;">'+key+'</td>');
            var tdHtmlElement = $('<td>'+object[selector[1]]+'</td>');
            var tdTextElement = $('<td style="text-align:left;"></td>').text($(tdHtmlElement).text());   // Gets rid of <span>s with word colouring.
            $(trElement).append(tdKeyElement).append(tdTextElement);
            $(tableElement).append(trElement);
            //$(tableElement).append('<tr><td style="text-align:left;">'+key+': '+object[selector[1]]+'</td></tr>');
        });
    } else {
        $.each(objects, function(key,object) {
            $(tableElement).append('<tr><td style="text-align:left;">'+object[selector[1]]+'</td></tr>');
        });
    }
    $(divElement).append(tableElement);
};
*/

// Sept 2022
// My revised version of a custom listbox, based on a <table> element, to replace
// the standard <select> element.
// args is an object with the following properties:
// - widget_element: the widget's element!
// - div_element_class (string, no leading .): the CSS class for the div that contains the listbox;
// - include_key (Boolean): whether to include each objects key at the start of each listbox row;
// - objects (object): an object containing the set of objects (as key:value pairs).  These are
//   (currently) webAKT objects such as Statements, Sources, Formal terms...
// - property_names (string array): the names of each object's properties which will be displayed
//   in the listbox.
//
// Here is a typical cal:
//    AKT.myListbox({
//        widget_element:    widget.element,
//        div_element_class: 'mylistbox_statements',
//        items:             statements,
//        property_names:    ['_id', '_formal', '_json'],
//        include_key:       false
//    });

AKT.myListbox = function (args) {
    //console.log(args);
    if (!args.items) {
        alert('ERROR! Not your fault.  AKT.myListox() called with no args.items');
        return;
    }

    console.log(8010,args);
    var divElement = $(args.widget_element).find('.'+args.div_element_class);
    $(divElement).empty();

    var tableElement = $('<table style="margin:3px;"></table>');

    $.each(args.items, function(key,item) {
        //console.log(8011,key,item);
        var trElement = $('<tr class="tr_listbox '+key+'" data-key="'+key+'"></tr>');
        if (args.include_key) {   // Include the item's key if wanted.
            $(trElement).append('<td style="text-align:left;vertical-align:top;">'+key+'</td>');
        }

        $(trElement).append('<td style="text-align:left; vertical-align:top; max-width:500px;"><input type="checkbox"></input></td>');   

        $.each(args.property_names, function(i, propertyName) {
            var property = item[propertyName];
            if (typeof property === 'object') {
                var propertyString = JSON.stringify(property);
            } else {
                propertyString = property;
            }
            //console.log(8012,i,propertyName,property,propertyString);
            if (typeof property === 'string') {
                // In order to get rid of text colouring (i.e. text that includes <span> elements to
                // set the colour of individual words), I first put the string into a dummy HTML element,
                // then extract the plain text from that element.  This strips out all the markup inside
                // the HTML.   I guess there's a neater way, but this does the job.
                var tdHtmlElement = $('<span>'+propertyString+'</span>');
                var text = $(tdHtmlElement).text();

                text = propertyString;
                // This is to enable neat word-wrapping for the "formal" version of statements.
                // Maybe try using CSS word-wrapping, which would not involve changing the text.
                text = text.replaceAll(',',', ');

                // Hack for showing possibilities to Tim, Sept 2022.  Disabled Nov 2022.
			    /*
                if (propertyName === '_formalxxx') {
                    $(trElement).append('<td style="text-align:left;vertical-align:top;background:#ffc0c0;">'+text+'</td>');   
                } else if (propertyName === '_name') {
                    $(trElement).append('<td style="text-align:left;vertical-align:top;background:#c0ffc0;">'+text+'</td>');   
                } else {
                    $(trElement).append('<td style="text-align:left;vertical-align:top;max-width:500px;                                                                                                                     ">'+text+'</td>');   
                }
			    */
                $(trElement).append('<td style="text-align:left; vertical-align:top; max-width:500px;">'+text+'</td>');   
            }
        });
        $(tableElement).append(trElement);
    });
    $(tableElement).find('tr:even').css({background:'white'});
    $(tableElement).find('tr:odd').css({background:'#e8e8e8'});
    $(divElement).append(tableElement);

    // Code to enable automatic vertical resizing when the containing Panel is resized.
    var panelHeight = $(args.widget_element).height();   // This returns a pure number
    var currentMylistboxHeight = Math.max(200,$(divElement).height());
    var restHeight = panelHeight - currentMylistboxHeight;
    //var h = $(args.widget_element).height()-145;   // TODO: This is for the statements() widgette!!
        // The 145 needs to be calcuated by subtracting the current table height from the
        // current Panel height.  Or something like that...
    //$(args.widget_element).find('.mylistbox').css('height',h+'px');
    $(args.widget_element).on( "resize", function( event, ui ) {
        var h = $(args.widget_element).height() - restHeight;   // TODO: Ditto!!!
        $(args.widget_element).find('.mylistbox').css('height',h+'px');
    });


    $(divElement).find('input[type=checkbox]').on('click', function (event, value) {
        var key = $(this).parent().parent().attr('data-key');
        console.log(3300,key);
        console.log('\n');
        var xs = $(divElement).find('input:checked');
        for (var i=0;i<xs.length;i++) {
            var x = xs[i];
            var y = $(x).parent().parent().attr('data-key');
            console.log(3303,y);
        }
        console.log('\n');
    });


    $(divElement).find('.tr_listbox').on('click', function (event, value) {
        event.stopPropagation();
        // Needed this, since this.value is blank when triggered (in AKT.singleStep).
        //if (this.value === '') {
        //    var optionValue = value;
        //} else {
        //    optionValue = this.value;
        //}
        
        var key = $(this).attr('data-key');
        console.log(3301,key);
        if (!value || key === value) {
            $(tableElement).find('tr:even').css({background:'white'});
            $(tableElement).find('tr:odd').css({background:'#e8e8e8'});
            $(divElement).find('.tr_listbox').removeAttr('data-selected');
            $(this).css({background:'yellow'});
            $(this).attr('data-selected','yes');
            AKT.trigger('item_selected_event',{
				item_type:args.item_type,
				item_id:key});

/*
            AKT.recordEvent({
                file:'webakt.js',
                function:'AKT.myListbox',
                element:args.widget_element,
                finds:['.tr_listbox'],
                event:'click',
                message:'Clicked on a myListbox table row in '+args.widget_element[0].id,
                value:key
            });
*/
            var action = new Action({
                element_id: args.widget_element[0].id,
                selector:   '.tr_listbox',
                type:      'click',
                message:    'webakt.js, function AKT.myListBox(): Clicked on a myListBox table row in '+args.widget_element[0].id,
                prompt:     'Click on the <b>'+$(this)[0].dataset.key+'</b> item in the listbox',
                value:      key
            });
            console.log('action: ',action);
            AKT.action_list.add(action);
            AKT.event_records.push(action._event);
            AKT.setEventRecords('event_records', AKT.event_records);
        }
    });

};



// UI "unit testing" - i.e. testing a particular sequence of operations.
AKT.runTestxxx = function () {
    AKT.state.stepCounter = 0;
    AKT.html = '<table>';
    AKT.html += '<tr><th>Title</th><th>Selector</th><th>Actual value</th><th>Test</th><th>Test value</th><th>Result</th></tr>';
    for (var i=0; i<AKT.steps.length; i++) {
        AKT.singleStep();
    }
    AKT.html += '</table>';
    console.log(AKT.html);
};

AKT.runTest = function () {
    AKT.event_records = JSON.parse(localStorage.getItem('event_records'));
    AKT.playEvents();
};


// One step in interactive tutorial
AKT.singleStep = function () {
    var step = AKT.steps[AKT.state.stepCounter];

    if (AKT.remember) {
        $(AKT.remember.selector).css({background:AKT.remember.background});
        AKT.remember = null;
    }
    if (step.eventType === 'highlight') {
        AKT.remember = {selector:step.selector, background:$(step.selector).css('background')};
        $(step.selector).css({background:'yellow'});

    } else if (step.eventType === 'menuleafclick') {
        AKT.speak('Clicked on menu command '+step.selector);
        AKT.menuHandler[step.selector.substring(1)]();

    } else if (step.eventType === 'menuclick') {
        AKT.speak('Clicked on menu item '+step.selector.substring(1));
        $(step.selector).trigger('click');

    } else if (step.eventType === 'change') {
        AKT.speak('Clicked on option '+step.selector);
        $(step.selector).trigger('change',[step.value]);

    } else if (step.eventType === 'select') {
        AKT.speak('Clicked on option '+step.selector);
        $(step.selector).prop('selected',true);

    } else if (step.eventType === 'listbox_select') {
        AKT.speak('Clicked on option '+step.selector);
        console.log('::: ',step);
        $(step.selector).find('option[value="'+step.value+'"]').attr('selected',true);

    } else if (step.eventType === 'pause') {
        if (confirm(step.message) === false) {
            clearInterval(AKT.timer);
            alert('You have stopped this tutorial.');
        }

    } else {      // step.eventType === 'click'
        AKT.speak('Clicked on button '+step.selector);
        $(step.selector).trigger(step.eventType);
    }

    if (step.tests) {
        if (Array.isArray(step.tests)) {
            for (var i=0; i<step.tests.length; i++) {
                var test = step.tests[i];
                var element = $(test.selector);
                var elementType = element[0].localName;
                if (elementType === 'textarea') {
                    var actualValue = element.val();
                } else {
                    actualValue = element.text();
                }

                if (test.comparison === 'equals') {
                    var result = actualValue===test.value ? '<span class="pass">PASS</span>' : '<span class="fail">FAIL</span>';

                } else if (test.comparison === 'includes') {
                    result = actualValue.includes(test.value) ? '<span class="pass">PASS</span>' : '<span class="fail">FAIL</span>';
                }

                //console.log(test.title, test.selector, actualValue, test.comparison, test.value, result);
                AKT.html += '<tr><td>'+test.title+'</td><td>'+test.selector+'</td><td>'+actualValue+'</td><td>'+ test.comparison+'</td><td>'+test.value+'</td><td>'+result+'</td></tr>';
            }
        }
    }

    AKT.state.stepCounter += 1;
    if (AKT.state.stepCounter >= AKT.steps.length) {
        clearInterval(AKT.timer);
        //window.location.reload();
    }
};

    AKT.speak = function (text) {
        // not yet implemented...
    };


// ===================================================================================


// Only works for att_value(_, _, _) !!!
// Only used in dialog_handlers.js, so remove this function when that file is 
// totally eliminated (as it should be).
AKT.makeNestedlist = function (formal) {
    var splitted1 = formal.split('(');
    var splitted2 = splitted1[1].split(',');
    splitted2[2] = splitted2[2].substring(0,splitted2[2].length-1);
    var nestedlistString = '["'+splitted1[0]+'","'+splitted2[0]+'","'+splitted2[1]+'","'+splitted2[2]+'"]';
    console.log(nestedlistString);
    var nestedlist = JSON.parse(nestedlistString);
    return nestedlist;
};



// ===================================================================================
//                                  Tool/widget handling

// Note 24 April 2022.
// TODO: Check whether this is needed.  Surely role is replaced by "new Panel()"
// It's currently invoked in c.7 places outside this file.
AKT.createWidgetPanel = function(toolId, options) {
    console.log('*** *** *** AKT.createWidgetPanel');
    if (options && options.containerId) {
        var containerId = options.containerId;
    } else {
        containerId = 'workspace';
        options && options.left ? left = options.left : left = 30+15*AKT.state.counter.all_tools;
        options && options.top ? top = options.top : top = 40+30*AKT.state.counter.all_tools;
    }
    options && options.kb ? kb = options.kb : kb = AKT.state.current_kb;
    if (!AKT.state.counter[toolId]) {
        AKT.state.counter[toolId] = 0;
    }
    AKT.state.counter[toolId] += 1;
    AKT.state.counter.all_tools += 1;
    AKT.incrementZindex("webakt.js: AKT.createWidgetPanel()");
    var kb, left, top;
    console.log(options,kb,left,top);
    var widgetDivId = toolId + '_' + AKT.state.counter[toolId];
    if (options && options.containerId) {   // Tool montage
        var hr = $('<p class="horizontal_rule" style="height:3px;background-color:blue;width:95%;border:none"></p>');
        $('#'+containerId).append(hr);
        var widgetDiv = $('<div id="'+widgetDivId+'" class="panel widget"></div>');
        $(widgetDiv).append('<div>'+widgetDivId+'</div>');
        $(widgetDiv).css({position:'static',border:'none',background:'none'});
        $(widgetDiv).find('.titlebar').css({display:'none'});
    } else {                                // Normal panels
        var widgetDiv = $('<div id="'+widgetDivId+'" class="panel widget" style="position:absolute; left:'+
            left+'px; top:'+top+'px;border:solid 1px blue;"></div>');
        $(widgetDiv).draggable({handle:".titlebar",containment:'#workspace'});
        $(widgetDiv).on('click', function (event) {
            event.stopPropagation();
            AKT.incrementZindex("webakt.js: AKT.createWidgetPanel(toolId)/1");
            $(this).css({"z-index":AKT.state.zindex});
        });
        $(widgetDiv).on('drag', function () {
            AKT.incrementZindex("webakt.js: AKT.createWidgetPanel(toolId)/2");
            $(this).css({"z-index":AKT.state.zindex});
        });
        $(widgetDiv).on('start', function () {
            AKT.incrementZindex("webakt.js: AKT.createWidgetPanel(toolId)/3");
            $(this).css({"z-index":AKT.state.zindex});
        });
    }
    $('#'+containerId).append(widgetDiv);
    $(widgetDiv).css({display:"block", "z-index":AKT.state.zindex});
    //$(widgetDiv).resizable({handles:"all"});
    $(widgetDiv).trigger("click");
    return widgetDivId;
};


// Ditto
AKT.createMontagePanel = function(options) {
    var id = 'montage';
    if (!AKT.state.counter[id]) {
        AKT.state.counter[id] = 0;
    }
    AKT.state.counter[id] += 1;
    AKT.state.counter.all_tools += 1;
    AKT.incrementZindex("webakt.js: AKT.createWidgetPanel()");
    var kb, left, top;
    options && options.kb ? kb = options.kb : kb = AKT.state.current_kb;
    options && options.left ? left = options.left : left = 30+15*AKT.state.counter.all_tools;
    options && options.top ? top = options.top : top = 40+30*AKT.state.counter.all_tools;
    console.log(options,kb,left,top);
    var widgetDivId = id + '_' + AKT.state.counter[id];
    var widgetDiv = $('<div id="'+widgetDivId+'" class="panel widget" style="position:absolute; left:'+left+'px; top:'+top+'px; width:600px; height:500px; overflow:auto; background:white; border:solid 1px blue;"></div>');
    $('#workspace').append(widgetDiv);
    $(widgetDiv).css({display:"block"});
    $(widgetDiv).css({display:"block", "z-index":AKT.state.zindex});
    $(widgetDiv).draggable({handle:".titlebar",containment:"#workspace"});
    $(widgetDiv).on('click', function (event) {
        event.stopPropagation();
        AKT.incrementZindex("webakt.js: AKT.createWidgetPanel(id)/1");
        $(this).css({"z-index":AKT.state.zindex});
    });
    $(widgetDiv).on('dragstart', function () {
        AKT.incrementZindex("webakt.js: AKT.createWidgetPanel(id)/2");
        $(this).css({"z-index":AKT.state.zindex});
    });
    $(widgetDiv).trigger("click");
    return widgetDivId;
};


// TODO: Put into utility.js
AKT.getDate = function () {
    var date = new Date().toString();
    var array = date.split(' ');
    var newDate = [array[0],', ',array[2],' ',array[1],' ',array[3]].join('');
    return newDate;
};



// ====================================================================================

// This is independent of graphics library.
// It should beb in Class Kb(), as another method for handling
// a collection of items.
// But I'm moving to the idea that we should have A Class for each collection,
// e.g. Class Statements, Class Sources, etc, to avoid pollting the Kb Class with
// lots of code specific to particular types of item.  If so, this should
// obviously go into Class Statements.
AKT.makeGraphFromStatements = function (statements) {

    var aktGraph = {meta:{},nodes:[],arcs:[]};
    if (!AKT.kbs[AKT.state.current_kb].graphs) {
        AKT.kbs[AKT.state.current_kb].graphs = {main:aktGraph};
    }


    var nodeCheckList = {};
    var nodeCount = 0;
    //$.each(statements, function(i,statement) {
    //for (var i=0; i<statements.length; i++) {
    var n = statements.length;
    console.log('\nAKT.makeGraphFromStatements');
    console.log(n, ' statements being considered');
    for (var i=0; i<n; i++) {
        var statement = statements[i];
        var aktId = statement.id;
        var nestedList = statement.nested_list;
        if (nestedList[0] === 'causes1way' || nestedList[0] === 'causes2way') {
            nodeCount += 1;
            var result1 = getNodeLabel(nestedList[1]);
            var result2 = getNodeLabel(nestedList[2]);
            if (nodeCheckList[result1.label]) {
                var node1 =  nodeCheckList[result1.label];
                var nodeId1 = node1.id;
            } else {
                var nodeId1 = AKT.getNewNodeId(AKT.state.current_kb);
                var node1 = {id:nodeId1, type:result1.type, label:result1.label, nested_list:nestedList[1], source_for_arcs:[], target_for_arcs:[]};
                nodeCheckList[result1.label] = node1;
                aktGraph.nodes.push(node1);
            }
            if (nodeCheckList[result2.label]) {
                var node2 =  nodeCheckList[result2.label];
                var nodeId2 = node2.id;
            } else {
                var nodeId2 = AKT.getNewNodeId(AKT.state.current_kb);
                var node2 = {id:nodeId2, type:result2.type, label:result2.label, nested_list:nestedList[2], source_for_arcs:[], target_for_arcs:[]};
                nodeCheckList[result2.label] = node2;
                aktGraph.nodes.push(node2);
            }
            var arcId = AKT.getNewArcId(AKT.state.current_kb);
            var arc = {id:arcId, akt_id:aktId, type:'causes1way', sourceId:nodeId1, targetId:nodeId2, source:node1, target:node2, statementId:i, nested_list:nestedList};
            node1.source_for_arcs.push(arc);
            node2.target_for_arcs.push(arc);
            aktGraph.arcs.push(arc);
            if (nodeCount>=AKT.options.layout_max_number_of_nodes) {
                console.log('Number of nodes has reached number specified in AKT.options.layout_max_number_of_nodes (',
                    AKT.options.layout_max_number_of_nodes,') at statement ',i,'.');
                break;
            }
        }
    }
    return aktGraph;

    // 24 Aprill 2022.
    // This duplicates more recent code in diagram.js widgette.    Need to decide where to
    // put it.
    function getNodeLabel(struct) {
        if (typeof struct === 'string') {
            return {label:struct,type:'object'};
        } else if (Array.isArray(struct)) {
            var type = '';
            var flattened = struct.flat(99);
            var condensed = [];
            for (var i=0; i<flattened.length; i++) {
               var item = flattened[i];
                if (item==='att_value' || item==='process' || item==='part' || item==='action') {
                    if (type === '') {
                        type = item;
                    } else {
                        type += '_'+item;
                    }
                } else {
                    condensed.push(item);
                }
            }
            var label = condensed[0];
            for (var i=1; i<condensed.length-1; i++) {     // Leave out the last item (the actual value)
                label += '_'+condensed[i];
            }
            return {label:label, type:type};
        } else {
            return 'xxxx';
        }
    }
};


// Put into diagram.js?
AKT.getNewNodeId = function(kbId) {
    if (!AKT.kbs[kbId].graphs) AKT.kbs[kbId].graphs = {main:{meta:{},nodes:[],arcs:[]}};  // Insurance policy
    var nodeArray = AKT.kbs[kbId].graphs.main.nodes;
    var imax = 0;
    $.each(nodeArray, function(i, node) {
        var index = parseInt(node.id.substr(4));    // i.e. after 'node'
        if (index> imax) imax = index;
    });
    inew = imax+1;
    return 'node'+inew;
}


// Ditto?
AKT.getNewArcId = function(kbId) {
    if (!AKT.kbs[kbId].graphs) AKT.kbs[kbId].graphs = {main:{meta:{},nodes:[],arcs:[]}};  // Insurance policy
    var arcArray = AKT.kbs[kbId].graphs.main.arcs;
    var imax = 0;
    $.each(arcArray, function(i, arc) {
        var index = parseInt(arc.id.substr(3));    // i.e. after 'arc'
        if (index> imax) imax = index;
    });
    inew = imax+1;
    return 'arc'+inew;
}



// ==================================================== BOOLEAN SEARCH
// 24 April 2022.   Put into boolean_search.js widgette, but make it into a method so
// that it can be invoked from elsewhere.
AKT.booleanSearch = function(statements, searchExpression, options) {

    var kbId = AKT.state.current_kb;
    var kb = AKT.kbs[kbId];

    //searchExpression = "trees and ( soil or water )";
    var searcha = searchExpression.replace(/\(/g, ' ( ');   // To easily tokenise "("
    var searchb = searcha.replace(/\)/g, ' ) ');            // To easily tokenise ")"
    var searchc = searchb.replace(/  /g, ' ');              // Get rid of extraneous spaces
    var searchd = searchc.replace(/  /g, ' ');              // ... and again!
    var search1 = searchd.split(" ");                       // Tokenise using space as the separator
    //console.log(searchExpression,searcha,searchb,searchc,searchd,search1);
    search2 = '';
    var regex = {};
    for (var i=0; i<search1.length; i++) {
        var symbol = search1[i];
        if (symbol === ' ' || symbol === '') {
            continue;
        } else if (symbol === '(' || symbol === ')') {
            search2 += symbol;
        } else if (symbol === 'and') {
            search2 += ' && ';
        } else if (symbol === 'or') {
            search2 += ' || ';
        } else {
            search2 += 'contains("'+symbol+'")';
            regex[symbol] = [new RegExp('\\b'+symbol+'\\b')];
            var descendants = AKT.getAllDescendants(kb.object_tree, symbol);
            console.log('--- ',symbol, descendants);
            for (var j=0; j<descendants.length; j++) {
                regex[symbol].push(new RegExp('\\b'+descendants[j]+'\\b'));
            }
        }
    }
    console.log(search2);

    var results = [];
    console.log('\n',searchExpression);
    for (var i=0;i<statements.length;i++) {
        if (options && !options.include_conditions) {
            var target = statements[i].formal.split(/\)if\s/)[0]; 
        } else {
            target = statements[i].formal;
        }
        var result = null;
        try {
            var result = eval(search2);
        }
        catch(err) {
          console.log('\n*** ERROR: \n',searchExpression,'\n',search2);
        }
        if (result) {
            results.push(statements[i]);
        }
    }
    return results;

    function contains(searchTerm) {

        // object+subobjects
        if (options && options.include_subobjects === 'object+subobjects') {
            for (var i=0; i<regex[searchTerm].length; i++) {
                if (target.search(regex[searchTerm][i]) !== -1) {
                    return true;
                }
            }
            return false;

        // Just subobjects (yes, there are a couple of cases of this)
        } else if (options && options.include_subobjects === 'subobjects') {
            for (var i=1; i<regex[searchTerm].length; i++) {
                if (target.search(regex[searchTerm][i]) !== -1) {
                    return true;
                }
            }
            return false;

        // Just objects (the fallback if not specified, since most common)
        } else {
            if (target.search(regex[searchTerm][0]) !== -1) {
                return true;
            } else {
                return false;
            }
        }
    }
};


// Ditto, since boolean_search.js widgette is only place it's called from in any case.
AKT.convertSearchExpressionToJavascript = function(searchExpression) {

    var kbId = AKT.state.current_kb;
    var kb = AKT.kbs[kbId];

    //searchExpression = "trees and ( soil or water )";
    var searcha = searchExpression.replace(/\(/g, ' ( ');   // To easily tokenise "("
    var searchb = searcha.replace(/\)/g, ' ) ');            // To easily tokenise ")"
    var searchc = searchb.replace(/  /g, ' ');              // Get rid of extraneous spaces
    var searchd = searchc.replace(/  /g, ' ');              // ... and again!
    var search1 = searchd.split(" ");                       // Tokenise using space as the separator
    //console.log(searchExpression,searcha,searchb,searchc,searchd,search1);
    search2 = '';
    for (var i=0; i<search1.length; i++) {
        var symbol = search1[i];
        if (symbol === ' ' || symbol === '') {
            continue;
        } else if (symbol === '(' || symbol === ')') {
            search2 += symbol;
        } else if (symbol === 'and') {
            search2 += ' && ';
        } else if (symbol === 'or') {
            search2 += ' || ';
        } else {
            search2 += 'contains("'+symbol+'")';
        }
    }
    console.log(search2);
    return search2;
};


// ==========================================================

AKT.getTopicInfo = function (topicId) {
    var kbId = AKT.state.current_kb;
    var kb = AKT.kbs[kb];
    var topics = kb.topics;
    for (var i=0; i<topics.length; i++) {
        if (topics[i].name === topicId) {
            return topics[i];
        }
    }
};


// 24 April 2022.  This *must* go - into diagram.js?  TODO

AKT.makeJointGraph = function (aktGraph) {

    var jointGraph = {nodes:[], links:[]};
    for (var i=0; i<aktGraph.nodes.length; i++) {
        jointGraph.nodes[i] = {
            "type":"standard.Rectangle",
            "attrs":{
                "body":{
                    "refWidth":"100%",
                    "refHeight":"100%",
                    "strokeWidth":2,
                    "stroke":"brown",
                    "fill":"#FFFFFF"},
                "label":{
                    "textVerticalAnchor":"top",
                    "textAnchor":"left",
                    "refX":4,"refY":3,
                    "fontSize":10,
                    "fill":"#333333",
                    "text":"acheampong\ngrowth\nrate",
                    "style":{"stroke":"black","strokeWidth":0.3}},
                "text":{}},
            "size":{"width":76,"height":48},
            "angle":0,
            "z":1};
        jointGraph.nodes[i].id = aktGraph.nodes[i].id;
        jointGraph.nodes[i].position = aktGraph.nodes[i].position;
        //jointGraph.nodes[i].attrs.label.text = aktGraph.nodes[i].label;
        var result = AKT.mywrap(aktGraph.nodes[i].label,10);
        console.log(result);
        jointGraph.nodes[i].attrs.label.text = result.wrappedString;
        jointGraph.nodes[i].size = {width:Math.max(60,4+7.2*result.nchars), height:Math.max(40,4+11*result.nlines)};
    }
    for (var i=0; i<aktGraph.arcs.length; i++) {
        jointGraph.links[i] = {
            "type":"causes1way",
            "attrs":{
                "line":{
                    "connection":true,
                    "stroke":"#dd0000",
                    "strokeWidth":2,
                    "strokeLinejoin":"round",
                    "targetMarker":{"type":"path","d":"M 12 -6 0 0 12 6 Z","fill":"#dd0000","stroke":"none"}},
                "wrapper":{"connection":true,"strokeWidth":10,"strokeLinejoin":"round"}},
            "along":0.5,
            "smooth":true,
            "z":-1,
            "mytype":"causes1way"};
            //"vertices":[{"x":352.52220372083383,"y":344.6674067906945}]};
        jointGraph.links[i].id = aktGraph.arcs[i].id;
        jointGraph.links[i].akt_id = aktGraph.arcs[i].akt_id;
        jointGraph.links[i].source = {id:aktGraph.arcs[i].source.id};
        jointGraph.links[i].target = {id:aktGraph.arcs[i].target.id};
    }
    console.log('jointGraph: ',jointGraph);
    return jointGraph;
};



// This has been introduced to allow a richer messaging facility to be developed.
AKT.showMessage = function (message,extras) {
    AKT.state.message_counter += 1;
    $('#message').prepend('<div>'+AKT.state.message_counter+': '+message+'</div>');
    $('#message').scrollTop(0);
    $('#message').on('click', function() {
        $('#message').css({height:'100px'});
    });
};


// =====================================================================


AKT.saveKbInLocalStorage = function (kbId) {
    var kb = AKT.KBs[kbId];
	var kbObjectToSave = kb.generateJsonFromKb();
    console.log(9010,kbObjectToSave);
	kbObjectToSave.metadata.id = kbId;
	var kbStringToSave = JSON.stringify(kbObjectToSave,null,1);
    // Note that we save it twice: once, as the current KB, so that it can be
    // automatically loaded next time we use webAKT; and once under the name
    // that we have given to the KB.   The latter is to provide a way of 
    // accessing one of a set of KBs which is easier than using file Save/Open.
    var recentKbsString = localStorage.getItem('recent_kbs');
    if (!recentKbsString) {
        var recentKbs = [];
    } else { 
        recentKbs = JSON.parse(localStorage.getItem('recent_kbs'));
    }

    // Remove kbId element from the recentKbs array if it's already in the array,
    // so that it's not there twice.
    recentKbs = removeFromArray(recentKbs,kbId);

    // Adds kbId element at *start* of the array.
    if (kbId) {   // To ignore case where kbId is null.
        recentKbs.unshift(kbId); 
    }  
    if (recentKbs.length>20) {
        recentKbs.pop();   // Removes last element;
    }
    console.log(recentKbs);
    if (kbStringToSave) {    // To ignore case where kbStringToSave is null.
        localStorage.setItem('recent_kbs',JSON.stringify(recentKbs));
	    localStorage.setItem('current_kb',kbStringToSave);
	    localStorage.setItem(kbId,kbStringToSave);
    }

    function removeFromArray(array,item) {
        var index = array.indexOf(item);
        if (index > -1) {
            array.splice(index,1);
        }
        return array;
    }
}

	
// We say kbKey rather than kbId, since it could be 'current_kb', which is not an ID.
AKT.loadKbFromLocalStorage = function (kbKey) {
	var kbSpec = localStorage.getItem(kbKey);
    //console.log(3401,kbSpec);
    if (kbSpec) {
        try {
	        var kbJson = JSON.parse(kbSpec);
	        if (kbJson.metadata.id) {
		        var kbId = kbJson.metadata.id;
	        } else {
		        kbId = 'noname1';
	        }
	        var kb = new Kb({name:kbId,from_local_storage:true,kb_from_file:kbJson});
	        AKT.KBs[kbId] = kb;
	        AKT.changeKb(kbId);
        }
        catch(err) {
            console.log('ERROR while loading cached KB from localStorage');
            console.log(err);
		    //kbId = 'noname1';
	        //var kb = new Kb({name:kbId});
	        //AKT.KBs[kbId] = kb;
	        //AKT.changeKb(kbId);
        }
    } else {
		kbId = 'noname1';
	    var kb = new Kb({name:kbId});
	    AKT.KBs[kbId] = kb;
	    AKT.changeKb(kbId);
    }
}




AKT.saveDiagramToLocalStorage = function (jointGraph, title) {
    var jointGraphString = JSON.stringify(jointGraph);
    localStorage.setItem(title, jointGraphString);
};


// =====================================================================
// Text-wrapping functions.  TODO: Check them out, and choose one.
AKT.wrapText = function (sentence, lineSize, maxSize) {
    var descriptionTrim = "";
    if (sentence.length + 3 > maxSize) {
        descriptionTrim = sentence.substring(0, maxSize - 3);
        descriptionTrim = descriptionTrim + '...';
    }
    else {
        descriptionTrim = sentence
    }

    var splitSentence = descriptionTrim.match(new RegExp('.{1,' + lineSize + '}', 'g'));
    var sentenceWrapped = "";
    for (i = 0; i < splitSentence.length; i++)
    {
        sentenceWrapped = sentenceWrapped + splitSentence[i] + '\n';
    }
    return sentenceWrapped;
}


// ==========================================================================
AKT.makeBold = function (text) {
    toUnicodeVariant(text,'bold sans');
};




// Quick-and-dirty string-wrap utility.
AKT.mywrap = function (string, width) {
    var array = string.split(/[_.,\/ -]/);
    var returnString = '';
    var nchars = 0;
    for (var i=0; i<array.length-1; i++) {
        if (array[i] === '') continue;
        if (array[i].length > nchars) nchars = array[i].length;
        returnString += array[i]+'\n';
    }
    var last = array.length-1;
    if (array[last].length > nchars) nchars = array[last].length;
    returnString += array[last];
    return {wrappedString:returnString, nlines:array.length, nchars:nchars};
};



AKT.nKbs = function () {
    var n = 0;
    for (var kb in AKT.kbs) {
        n += 1;
    }
    return n;
};
        

// Utilities returning a useful list (an arrays or objects) of strings or objects for e.g. 
// populating <select> elements.

AKT.getKbIds = function () {

    var kbIds = [];
    for (var kbId in AKT.KBs) {
        kbIds.push(kbId);
    }
    return kbIds;
};




AKT.getImageIds = function (kbId) {

    var kb = AKT.kbs[kbId];
    var result = [];

    for (var i=0; i<kb.images.length; i++) {
        result.push(kb.images[i].name);
    }

    return result;
};



AKT.getImage = function (kbId, identifier) {
    var kb = AKT.kbs[kbId];
    for (var i=0; i<kb.images.length; i++) {
        if (kb.images[i].name === identifier) {
            return kb.images[i].url;
        }
    }
    return 'No memo';
};


AKT.getMemos = function (kbId, category) {

    var kb = AKT.kbs[kbId];
    var result = [];

    for (var i=0; i<kb.memos.length; i++) {
        console.log(kbId,category,kb.memos[i]);
        if (kb.memos[i].context === category) {
            console.log(kb.memos[i].idenifier);
            result.push(kb.memos[i].identifier);
        }
    }

    return result;
};



AKT.getMemo = function (kbId, identifier) {
    var kb = AKT.kbs[kbId];
    for (var i=0; i<kb.memos.length; i++) {
        if (kb.memos[i].identifier === identifier) {
            return kb.memos[i].content;
        }
    }
    return 'No memo';
};


AKT.getFormalTerms = function (kbId, term_type, use) {

    var kb = AKT.kbs[kbId];
    var result1 = [];
    var result2 = [];

    // First, select formal terms of the required type (or 'all')
    if (term_type === 'all') {
        for (var i=0; i<kb.formal_terms.length; i++) {
            result1.push(kb.formal_terms[i].term);
        }
    } else {
        for (var i=0; i<kb.formal_terms.length; i++) {
            if (kb.formal_terms[i].type === term_type) {
               result1.push(kb.formal_terms[i].term);
            }
        }
    }

    // Now, select those that have the required 'use'
    if (use === 'all') {
        var result2 = result1;

    } else if (use === 'Object Hierarchies') {
        result2 = [];
        for (var i=0; i<result1.length; i++) {
            for (var j=0; j<kb.subobjects.length; j++) {
                if (result1[i] === kb.subobjects[j][1] || result1[i] === kb.subobjects[j][2]) {
                    result2.push(result1[i]);
                    break;
                }
            }
        }

    } else if (use === 'Formal Statements') {
        for (var i=0; i<result1.length; i++) {
            for (var j=0; j<kb.sentences.length; j++) {
                var nestedList = kb.sentences[j].nested_list;
                if (nestedList[0] === 'if') {   // It's a conditional sentence
                    // [1] is the statement part of the sentence
                    if (nestedList[1].flat(99).includes(result1[i])) {
                        result2.push(result1[i]);
                        break;
                    }
                } else {   // It's not a conditional sentence
                    if (nestedList.flat(99).includes(result1[i])) {
                        result2.push(result1[i]);
                        break;
                    }
                }
            }
        }


    } else if (use === 'Formal Conditions') {
        for (var i=0; i<result1.length; i++) {
            for (var j=0; j<kb.sentences.length; j++) {
                var nestedList = kb.sentences[j].nested_list;
                if (nestedList[0] === 'if') {   // It's a conditional sentence
                    // [2] is the conditional part of the sentence.
                    if (nestedList[2].flat(99).includes(result1[i])) {
                        result2.push(result1[i]);
                        break;
                    }
                }
            }
        }
    }

    return result2;
};



AKT.getSourceDetails = function (kbId, sourceIndex) {
    var kb = AKT.kbs[kbId];
    if (kb.sources[sourceIndex]) {
        return kb.sources[sourceIndex];
    } else {
        return null;
    }
};


AKT.getTopics = function (kbId) {
    return AKT.kbs[kbId].topics;
};


/*
This was for BEFORE I introduced dialog_Generic.
AKT.openDialog = function (dialogId, shiftKey, size, options) {
    console.log('\n\n*** AKT.openDialog',dialogId, shiftKey, options);

    if (!AKT.state.panel_counter[dialogId]) {
        console.log(1, 'First time');
        AKT.state.panel_counter[dialogId] = 1;
        var panelId = dialogId + '_1';
        $('#workspace').append('<div id="'+panelId+'" class="panel dialog" style="position:absolute;display:block;left:'+size.left+';top:'+size.top+';width:'+size.width+';height:'+size.height+';"></div>');
        //$('#'+panelId)[dialogId]({visible:true, kbId:AKT.state.current_kb});
        $('#'+panelId)[dialogId](options);

    } else if (shiftKey) {
        console.log(2,'Shift key');
        AKT.state.panel_counter[dialogId] += 1;
        panelId = dialogId + '_' + AKT.state.panel_counter[dialogId];
        $('#workspace').append('<div id="'+panelId+'" class="panel dialog" style="position:absolute;display:block;left:75px;top:70px;width:580px;height:580px;"></div>');
        $('#'+panelId)[dialogId]({visible:true, kbId:AKT.state.current_kb});

    } else {
        panelId = dialogId + '_' + AKT.state.panel_counter[dialogId];  // Use the latest panel
        console.log(3,'Not Shift key',dialogId,AKT.state.panel_counter[dialogId],panelId);
        //$('#'+panelId)[dialogId]('reprocess',AKT.state.current_kb);
        $('#'+panelId).dialog_Metadata('reprocess',AKT.state.current_kb);
    }
*/
AKT.openDialog = function (dialogId, shiftKey, size, options) {
    console.log('*** AKT.openDialog',dialogId, shiftKey, options);

    var subname = options.widget_name;
    //var settings = AKT.widgets[options.widget_name].settings;

    if (!AKT.state.panel_counter[subname]) {
        AKT.state.panel_counter[subname] = 1;
        var panelId = subname + '_1';

        // Use this one if attempt (below) to autofit the panel's <div> around its elements fails.
        //$('#workspace').append('<div id="'+panelId+'" class="panel dialog" style="position:absolute;display:block;left:'+size.left+';top:'+size.top+';width:'+settings.width+';height:'+settings.height+';"></div>');

        $('#workspace').append('<div id="'+panelId+'" class="panel dialog" style="position:absolute;display:block;left:'+size.left+';top:'+size.top+';"></div>');

        //$('#'+panelId)[dialogId]({visible:true, kbId:AKT.state.current_kb});
        $('#'+panelId)[dialogId](options);

    } else {
        AKT.state.panel_counter[subname] += 1;
        panelId = subname + '_' + AKT.state.panel_counter[subname];
        console.log('panelId: ',panelId);
        //$('#workspace').append('<div id="'+panelId+'" class="panel dialog" style="position:absolute;display:block;left:75px;top:70px;width:580px;height:580px;"></div>');

        // Use this one if attempt (below) to autofit the panel's <div> around its elements fails.
        //$('#workspace').append('<div id="'+panelId+'" class="panel dialog" style="position:absolute;display:block;left:'+size.left+';top:'+size.top+';width:'+settings.width+';height:'+settings.height+';"></div>');

        $('#workspace').append('<div id="'+panelId+'" class="panel dialog" style="position:absolute;display:block;left:'+size.left+';top:'+size.top+';"></div>');
        $('#'+panelId)[dialogId](options);
    }


};



AKT.getWidgetTypes = function () {
};


// This depends on having assigned the same CSS class to all the widgets'
// container element.
// Currently (July 2021) all widget container elements should have the CSS class 
// 'panel', and most (if not all) also have the CSS class 'dialog'.
AKT.getAllWidgetInstances = function () {
    var allPanels = $('#workspace').find('.panel'); 
    var result = {};
    $.each(allPanels,function(i,panel) {    
        var widgets = $(panel).data();    // Can there be more than 1?
        for (var widgetName in widgets) {   
            if (widgetName !== 'uiDraggable') {
                var widget = widgets[widgetName];
                //console.log('widget ID, UUID ,options:', widgetId, 
                //    widget.uuid, JSON.stringify(widget.options));
                result[widget.uuid] = {
                    name:    widgetName,
                    element: widget.element[0].id,
                    options: widget.options,
                    panel:   panel,
                    subname: widget.options.widget_name,
                    uuid:    widget.uuid,
                    widget:  widget};
            }
        }
    });
    return result;
};




AKT.process_bulk_import = function () {
    if (AKT.bulk_import) {
        if (confirm('Are you sure you want to import the sentences in bulk_import.js?')) {
            var lines = AKT.bulk_import.split('\n');

            for (var i=0; i<lines.length; i++) {
                if (lines[i].charAt(0) !== '%' && lines[i].charAt(0) !== '') {
                    console.log('\n',lines[i]);
                    var bits = lines[i].split(':');
                    var sourceId = bits[0];
                    var formal = bits[1];
                    var json = AKT.convert_formal_to_json(formal);
                    console.log(json);
                    if (json) {
                        var english = AKT.translate(json);
                        console.log(english);
                    } else {
                        alert('Error in the line "'+lines[i]+'"');
                    }
                }
            }
        }
    }
}


// Credit: https://sumn2u.medium.com/string-similarity-comparision-in-js-with-examples-4bae35f13968
AKT.levenshteinDistance =  function(a, b){
    if(a.length == 0) return b.length; 
    if(b.length == 0) return a.length; 

    var matrix = [];

    // increment along the first column of each row
    var i;
    for(i = 0; i <= b.length; i++){
        matrix[i] = [i];
    }

    // increment each column in the first row
    var j;
    for(j = 0; j <= a.length; j++){
        matrix[0][j] = j;
    }

    // Fill in the rest of the matrix
    for(i = 1; i <= b.length; i++){
        for(j = 1; j <= a.length; j++){
        if(b.charAt(i-1) == a.charAt(j-1)){
            matrix[i][j] = matrix[i-1][j-1];
        } else {
            matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, // substitution
                                    Math.min(matrix[i][j-1] + 1, // insertion
                                            matrix[i-1][j] + 1)); // deletion
        }
        }
    }

    return matrix[b.length][a.length];
};


// Utility: Find all terms (words) of a given category beginning with given letter(s).
// E.g. AKT.findWords('object','co');

AKT.findWords = function (category,letters) {

    var kbId = AKT.state.current_kb;
    var kb = AKT.KBs[kbId];

    switch(category) {
        case 'action':
            var array = kb.findFormalTermIds({term_type:'action'});
            return array;
            break;

        case 'attribute':
            break;

        case 'object':
            var array = kb.findFormalTermIds({term_type:'object'});
            let array1 = array.filter(function (obj) {
                return obj.startsWith('co');
            });
            return array1;
            break;

        case 'process':
            break;

        case 'value':
            break;
    }
};
    

// This is a generic function for creating a new, or re-using an existing, panel.
// To date (May 2022) any command (menu command or button click), that needs to display
// something in a panel, calls "new Panel()".   I.e. it always creates a new panel.
// Although this is useful behaviour in many circumstances (for example, you want to 
// see a sentence_details panel for several separate sentences), the user may not always
// want this (and, indeed, AKT5 never worked like that - it always re-used a panel).
// Also, there will be times when it is definitely the wrong thing to do, e.g. when
// opening up a sentence template panel from a statement_details panel, then OK'ing
// the template panel.
// So, this function means that we have only one call in order to allow for these 
// different modes.

// If a panel for a certain type of widget does not exist, it creates a new one.
// If the widget exists, but the user wants a new panel, it creates one.
// If the widget exists, and the user does NOT want a new one, it re-uses an
// existing one.  What is meant by "an existing one" needs to be worked out in full, 
// but should probably simply be "the last one created" for that widget type.

// Aug 2024 Modified with the 'conventional' test, to enable it to handle regular
// widgets, not widgettes.  If there is no args.conventional, then it is a widgette.

AKT.panelise = function (args) {
    args.options.widget_name = args.widget_name;   // Note: Panel has widget_name as one of its options...

    if (args.conventional) {   // "conventional" is a conventional jQuery widget, i.e.
        // not a "widgette".
        var panel = new Panel(
            args.widget_name,
            args.shift_key,
            {left:args.position.left, top:args.position.top, width:args.size.width, height:args.size.height}, // all with 'px'
            args.options,
            true   // Signals that new Panel() is being called from AKT.panelise();
        );


    } else {
        if (!args.shift_key || !AKT.state.panel_last_of_type[args.widget_name]) {
            var panel = new Panel('dialog_Generic', 
                args.shift_key,
                {left:args.position.left, top:args.position.top, width:args.size.width, height:args.size.height}, // all with 'px'
                args.options,
                true   // Signals that new Panel() is being called from AKT.panelise();
            );
        } else {
            var panel = AKT.state.panel_last_of_type[args.widget_name];
            $('#'+panel._id).dialog_Generic('option', 'filters', args.options);
        }
    }

    return panel;
/*
    console.log('++++');

    var allPanels = $('body').find('.panel');
    console.log(allPanels);
    $.each(allPanels,function(i,panel) {
        var widgets = $(panel).data();
        for (var widgetId in widgets) {   
            var widget = widgets[widgetId];
            console.log('\nwidget ID, UUID ,options:', widgetId, 
                widget.uuid, widget.options);
            console.log(widget);
        }
    });
   $.each(allPanels,function(i,panel) {
        console.log('\nA panel element and its widget instance...',i, panel);
        //console.log($(panel).diagram_gojs("instance"));
        //console.log($(panel).diagram_gojs("instance").options);
        //console.log($(panel).diagram_gojs("instance").options.model.meta.name);
        //console.log($(panel).diagram_gojs('option','model').meta.name);  // Same as previous line
        console.log($(panel).data());  // Useful: returns all widgets used for this element.
        console.log($(panel).data("systo-diagram_gojs"));
        //console.log($(panel).data("systo-diagram_gojs").options);
        //var widgets = $(panel).data();
        //for (var widgetId in widgets) {   // detects the actual Systo widget.
        //    if (widgetId.substring(0,5) === "systo-") {
        //        console.log($(panel).data(widgetId).options);
        //    }
        //}
    });
    //var allDiags = $(':systo-diagram_gojs');
    //console.log(allDiags);
    //$.each(allDiags, function(i,diag) {
        //console.log(i, diag);     
        //console.log($(diag).options);
    //});
    //console.log($.widget("systo.diagram_gojs", {}).widgetName);

    return panel;
*/
}


/*
       $.each(allPanels,function(i,panel) {
            console.log('\nA panel element and its widget instance...',i, panel);
            console.log($(panel).diagram_gojs("instance"));
            console.log($(panel).diagram_gojs("instance").options);
            console.log($(panel).diagram_gojs("instance").options.model.meta.name);
            console.log($(panel).diagram_gojs('option','model').meta.name);  // Same as previous line
            console.log($(panel).data());  // Useful: returns all widgets used for this element.
            console.log($(panel).data("systo-diagram_gojs"));
            console.log($(panel).data("systo-diagram_gojs").options);
            var widgets = $(panel).data();
            for (var widgetId in widgets) {   // detects the actual Systo widget.
                if (widgetId.substring(0,5) === "systo-") {
                    console.log($(panel).data(widgetId).options);
                }
            }
        });
        var allDiags = $(':systo-diagram_gojs');
        //console.log(allDiags);
        $.each(allDiags, function(i,diag) {
            //console.log(i, diag);     
            //console.log($(diag).options);
        });
        //console.log($.widget("systo.diagram_gojs", {}).widgetName);
    }
... and here's some more sample code:
// Sample code for processing all widgets.
var allPanels = $(div).find('.simile_helper'); 
$.each(allPanels,function(i,panel) {
    var widgets = $(panel).data();
    for (var widgetId in widgets) {   
        var widget = widgets[widgetId];
        console.log('widget ID, UUID ,options:', widgetId, 
            widget.uuid, JSON.stringify(widget.options));
    }
});
*/


// AKT.trigger(event_type:string, args:object) - triggers a custom event.
// Taken from Systo.    Main difference is that it now has two arguments,
// with event_type being the first argument (rather than just another property of args).
// args can have the following properties:
// - file: the file in which the triggering call is made (string, optional)
// - action: the action (typically, a function name) which triggers the custom event (string, optional);
// - parameters: the custom-event-type-specific set of parameters (object, optional but usual)
//               Whether this argument is required is dependent on the custom event.

// As I reduce the Systo code down to its essentials, I realise that the only reason for having
// this as an intermediate function (rather than calling $(document).trigger() directly) is
// to intercept the triggering, for logging or some other purpose.
AKT.trigger = function (event_type, args) {
    console.log('\n*** AKT.trigger(): event_type=',event_type,'; args=',args);
    $(document).trigger(event_type, args);
};



// Use this function to get the line number of any line.
// Useful for a roll-your-own version of console.log(), e.g. with global switching on or off
// individua types of message, making log printable etc.
// Thanks to http://www.favkb.com/en/article/javascript-line-number#
function getLineNumber() {
    let e = new Error();
    e = e.stack.split("\n")[2].split(":");
    e.pop();
    return e.pop();
}



// Widget handling
// see the code in menuHandler.js for the 'Tech menu.
// "widgie" is an instance of a widget!

// The approach used here is based on the assumption that all widgies are displayed in
// a panel, so we begin by looping over all panels.
// The alternatve is probably to find all widgets, and then look for all instances of
// each widget (remembering that "widget" is a type of thing, and "widgie" is the
// instance: "statement_details" is a widget (actually widgette...), and 
// statement_details_2 is a widgie).   

AKT.getAllWidgies = function () {
    var foundWidgies = [];
    var allPanels = $('body').find('.panel');
    $.each(allPanels,function(i,panel) {
        var widgies = $(panel).data();
        for (var widgieId in widgies) {   
            if (widgieId.substring(0,3) === "akt") { // Detects the actual AKT widget instance.
                var widgie = $(panel).data(widgieId);
                foundWidgies.push(widgie);
                console.log(widgie);
                console.log($(widgie.element).find('.content').html());
            }
        }

    });
    return foundWidgies;
}


AKT.getWidgiesByKb = function (kbId) {
    var foundWidgies = [];
    var allPanels = $('body').find('.panel');
    $.each(allPanels,function(i,panel) {
        var widgies = $(panel).data();
        for (var widgieId in widgies) {   
            if (widgieId.substring(0,3) === "akt") { // Detects the actual AKT widget instance.
                var widgie = $(panel).data(widgieId);
                if (widgie.options.kbId===kbId) {
                    foundWidgies.push(widgie);
                }
            }
        }

    });
    return foundWidgies;
}


AKT.getWidgiesByType = function (type) {
    var foundWidgies = [];
    var allPanels = $('body').find('.panel');
    $.each(allPanels,function(i,panel) {
        var widgies = $(panel).data();
        for (var widgieId in widgies) {   
            if (widgieId.substring(0,3) === "akt") { // Detects the actual AKT widget instance.
                var widgie = $(panel).data(widgieId);
                if (widgie.options.widget_name===type) {
                    foundWidgies.push(widgie);
                }
            }
        }

    });
    return foundWidgies;
}

AKT.getWidgiesByKbAndType = function (kbId,type) {
    var foundWidgies = [];
    var allPanels = $('body').find('.panel');
    //console.log(9001,allPanels);
    $.each(allPanels,function(i,panel) {
        var widgies = $(panel).data();
        //console.log(9002,widgies);
        for (var widgieId in widgies) {   
            //console.log(9003,widgieId);
            if (widgieId.substring(0,3) === "akt") { // Detects the actual AKT widget instance.
                var widgie = $(panel).data(widgieId);
                //console.log(9004,widgie);
                if (widgie.options.kbId===kbId && widgie.options.widget_name===type) {
                    foundWidgies.push(widgie);
                }
            }
        }

    });
    return foundWidgies;
}


AKT.makeFilterDiv = function (args) {
    var widget = args.widget;
    var category = args.category;
    var options = args.options;  // An array

    if (args.control_type === 'checkboxes') {
        var filterDiv = $('<div class="div_'+category+'"><span style="display:inline-block;font-weight:bold;width:90px;">'+category+': </span></div>');
        for (var i=0; i<options.length; i++) {
            var option = options[i];
            var item = category+'_'+option;
            var itemSpan = $(`
                <span style="margin-right:10px;">
                    <span>`+option+`</span>
                    <input type="checkbox" class="checkbox_included" data-category="`+category+
                        `" data-option="`+option+`"></input>
                </span>`);
            $(filterDiv).append(itemSpan);
        }
    } else if (args.control_type === 'dropdown') {
        var filterDiv = $('<div class="div_'+category+'"><span style="display:inline-block;font-weight:bold;width:90px;">'+category+': </span><select></select></div>');
        for (var i=0; i<options.length; i++) {
            var option = $('<option>'+options[i]+'</option>');
            $(filterDiv).find('select').append(option);
        }
    } else {
        console.log('*** INTERNAL ERROR ***\nfilter control_type '+args.control_type+' not recognised.');
    }

    return filterDiv;
}

AKT.slidersCss = function(widget) {
    console.log('widget:',widget);
    $(widget.element).find('.slider-wrapper').css({
        //margin: '1rem',
        position: 'relative',
        overflow: 'hidden'
    });
    $(widget.element).find('.slides-container').css({
        height: '100%',
        width: '100%',
        display: 'flex',
        'list-style': 'none',
        margin: '0',
        overflow: 'scroll',
        'scroll-behavior': 'smooth'
    });
    $(widget.element).find('.slide').css({
        width: '100%',
        height: '100%',
        flex: '1 0 100%'
    });
    $(widget.element).find('.slides-container').css({
        'scrollbar-width': 0, // Firefox 
        '-ms-overflow-style': 'none'  // Internet Explorer 10+ 
    });
    // WebKit 
    $('::-webkit-scrollbar').css({ 
        width: 0,
        height: 0,
    });
    $(widget.element).find('.slide-arrow').css({
        position: 'absolute',
        display: 'flex',
        top: '0',
        bottom: '0',
        margin: 'auto',
        height: '4rem',
        'background-color': 'white',
        border: 'none',
        width: '2rem',
        'font-size': '3rem',
        padding: '0',
        cursor: 'pointer',
        opacity: '0.5',
        transition: 'opacity 100ms'
    });
    $(widget.element).find('.slide-arrow:hover').css({
        opacity: '1'
    });
    $(widget.element).find('.slide-arrow:focus').css({
        opacity: '1'
    });
    $(widget.element).find('#slide-arrow-prev').css({
        left: '0',
        'padding-left': '0.25rem',
        'border-radius': '0 2rem 2rem 0'
    });
    $(widget.element).find('#slide-arrow-next').css({
        right: '0',
        //'padding-left': '0.75rem',
        'border-radius': '2rem 0 0 2rem'
    });

    // See bottom of file for original code.
    const slidesContainer = document.getElementById("slides-container");
    const slide = document.querySelector(".slide");
    const prevButton = document.getElementById("slide-arrow-prev");
    const nextButton = document.getElementById("slide-arrow-next");
    nextButton.addEventListener("click", () => {
      const slideWidth = slide.clientWidth;
      slidesContainer.scrollLeft += slideWidth;
    });
    prevButton.addEventListener("click", () => {
      const slideWidth = slide.clientWidth;
      slidesContainer.scrollLeft -= slideWidth;
    });
};


