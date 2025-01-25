(function ($) {

  /***********************************************************
   *         dialog_BooleanSearch widget
   ***********************************************************
   */
    $.widget('akt.dialog_BooleanSearch', {
        meta:{
            short_description: 'Boolean search',
            long_description: 'Finds all statements that satisfy the search term provided.',
            author: 'Robert Muetzelfeldt',
            last_modified: 'July 2021',
            visible: true,
            options: {
            }
        },

        options: {
            kb:AKT.state.current_kb,
            search_term:'tree',
            show_titlebar:true
        },

        evaluate: function(kb,searchTerm) {
            var results = evaluate(kb,searchTerm);
            display(this, results);
            return results;
        },

        widgetEventPrefix: 'dialog_BooleanSearch:',

        _create: function () {
            console.debug('\n### Creating instance of widget "akt.dialog_BooleanSearch".',
                '\nElement ID:',this.element[0].id,'  Widget UUID:',this.uuid,'  Options:',this.options);
            var self = this;
            this.element.addClass('dialog_BooleanSearch-1');

            var kb = self.options.kb;
            var searchTerm = self.options.search_term;

            createEmptyWidget(self);
            var results = evaluate(kb,searchTerm);
            display(self, results);

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('dialog_BooleanSearch-1');
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


// ==================================================================================

    function createEmptyWidget(widget) {

        // See comments in AKT.makeWidgetTitlebar(): I can't see why
        // event handler can't go there.  It works for AKT.reprocess...
        if (widget.options.show_titlebar) {
            console.debug(widget.widgetName);
            var titlebarDiv = AKT.makeWidgetTitlebar(widget.widgetName,widget.element);
            $(widget.element).append(titlebarDiv);
            $(widget.element).find('.w3-right').on('click', function () {
                $(widget.element).css({display:"none"});
            });
        }

        var widgetSettings = $('<div></div>');
        $(widget.element).append(widgetSettings);

        var kbSelectElement = AKT.makeReprocessSelector(widget.element, widget.widgetName,
            'Knowledge base', AKT.getKbIds(), AKT.state.current_kb, 'kbId');
        $(widgetSettings).append(kbSelectElement);

        var widgetContent = $(baseHtml());
        $(widget.element).append(widgetContent);

        $(widget.element).css({display:'block'});
        $(widget.element).draggable();
    }


    function evaluate(kb,searchExpression) {
        console.debug('Starting akt.dialog_BooleanSearch: evaluate()');

        var statements = AKT.kbs[kb].sentences;

/*
        var hits1 = [];
        var hits2 = [];
        for (var i=0;i<sentences.length;i++) {
            var formal = sentences[i].formal;
            if (formal.indexOf('trees') !== -1) {hits1.push(i);}
            if (formal.indexOf('soil') !== -1) {hits2.push(i);}
        }
        var set1 = new Set(hits1);
        var set2 = new Set(hits2);
        var union = new Set([...set1, ...set2]);
        var intersection = new Set([...set1].filter(x => set2.has(x)));
*/

        // Alternative method...
        //searchExpression = "trees and ( soil or water )";
/*
        var searcha = searchExpression.replace(/\(/g, ' ( ');
        var searchb = searcha.replace(/\)/g, ' ) ');
        var searchc = searchb.replace(/  /g, ' ');
        var searchd = searchc.replace(/  /g, ' ');
        var search1 = searchd.split(" ");
        console.debug(searchExpression,searcha,searchb,searchc,searchd,search1);
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
        console.debug(search2);

        function contains(searchTerm) {
            if (sentence.formal.indexOf(searchTerm) === -1) {
                return false;
            } else {
                return true;
            }
        }

        var results = [];
        for (var i=0;i<sentences.length;i++) {
            var sentence = sentences[i];
            var result = eval(search2);
            if (result) {
                results.push(sentence);
            }
        }
        return results;
*/
        //var results = AKT.booleanSearch(statements, searchExpression);
        var results = 123;
        return results;
    }


    function display(widget, results) {
        console.debug('Starting akt.dialog_BooleanSearch: display()');

        var kbId = AKT.state.current_kb;
        var kb = AKT.kbs[kbId];

        var widgetContent = $(baseHtml());
        $(widget.element).append(widgetContent);

        var zindex = AKT.incrementZindex("dialog_BooleanSearchy");
        $(widget.element).css({display:'block','z-index':zindex});


        // SETUP


        // EVENT HANDLERS
        $('#boolean_search110').on('click', function(event) {    // Search button
            event.stopPropagation();
            console.debug('BUTTON: Clicked on boolean_search Search button');
            var searchExpression = $('#boolean_search800').val();
            //var widgetPanelId = AKT.createWidgetPanel("boolean_search");
            //var kbId = AKT.state.current_kb;
            //$('#'+widgetPanelId).boolean_search({kb:kbId, search_term:searchExpression});
            console.debug(searchExpression);
        });

        // .........
/*
        var searchTerms = getSearchTerms(widget.options.search_term);
       
        var widgetContent = $('<div class="content" style="font-size:11px"></div>');
        var searchExpressionDiv = $('<div style="font-size:14px; font-weight:bold;">Search expression: '+widget.options.search_term+'</div>');
        $(widgetContent).append(searchExpressionDiv);
        var ol = $('<ol></ol>');
        $(widgetContent).append(ol);
        $(widget.element).append(widgetContent);
        for (var i=0; i<results.length; i++) {
            var statement = results[i].formal;
            for (var j=0; j<searchTerms.length; j++) {
                statement = statement.replaceAll(searchTerms[j], '<span style="font-weight:bold;">'+searchTerms[j]+'</span>');
            }
            $(ol).append('<li>'+statement+'</li>');
        }
*/
    }


    function getSearchTerms(searchExpression) {
        var symbols = searchExpression.split(' ');
        var searchTerms = [];
        for (var i=0; i<symbols.length; i++) {
            var symbol = symbols[i];
            if (symbol === 'and' || symbol==='or' || symbol==='(' || symbol===')') continue;
            searchTerms.push(symbol);
        }
        return searchTerms;
    }

    function baseHtml() {
        return `<div class="content" style="border:none; padding:10px;">
    <fieldset style="float:left;">
        <legend>Display knowledge base terms of the type:...</legend>
        <select id="boolean_search500" style="width:250px;height:20px;"></select>
    </fieldset>

    <fieldset style="float:left;">
        <legend>Create a topic from Boolean search string</legend>
        <button id="boolean_search109" style="width:80px;height:30px;">Create topic</button>
    </fieldset>

    <fieldset style="float:left; width:200px;">
        <legend>Knowledge base terms of the specified type: </legend>
        <select id="boolean_search400" size=20 style="width:180px; background:white"></select>
    </fieldset>

    <div style="float:left;text-align:center;">
        <button id="boolean_search102" style="width:70px;height:35px;">Details</button>
        <fieldset style="text-align:center;">
            <legend>Boolean options</legend>
            <button id="boolean_search106" style="width:60px;height:20px;">Select</button><br/>
            <button id="boolean_search107" style="width:35px;height:20px;">AND</button>
            <button id="boolean_search108" style="width:35px;height:20px;">OR</button><br/>
            <button id="boolean_search120" style="width:35px;height:20px;">NOT</button><br/>
            <button id="boolean_search115" style="width:60px;height:20px;">( ... )</button><br/>
            <button id="boolean_search116" style="width:60px;height:20px;">Clear</button>
        </fieldset>
        <button id="boolean_search110" style="width:70px;height:35px;">Search</button>
    </div>

    <fieldset style="float:left; width:200px;">
        <legend>Search options</legend>

        <input id="boolean_search200" class="radio" type="radio">
        <label for="boolean_search200">object</label><br/>

        <input id="boolean_search201" class="radio" type="radio">
        <label for="boolean_search201">subobjects</label><br/>

        <input id="boolean_search202" class="radio" type="radio">
        <label for="boolean_search202">superobjects</label><br/>

        <input id="boolean_search203" class="radio" type="radio">
        <label for="boolean_search203">fuzzy</label><br/></br>


        <input id="boolean_search121" class="checkbox" type="checkbox">
        <label for="boolean_search121">Search the statement's formal terms</label><br/>

        <input id="boolean_search118" class="checkbox" type="checkbox">
        <label for="boolean_search118">Search the statement's Conditions</label><br/>

        <input id="boolean_search117" class="checkbox" type="checkbox">
        <label for="boolean_search117">Search the statement's Sources</label><br/>

        <input id="boolean_search122" class="checkbox" type="checkbox">
        <label for="boolean_search122">Search the knowledge categories</label><br/>


        <input id="boolean_search119" class="checkbox" type="checkbox">
        <label for="boolean_search119">Allow 'user value' matches within any of a statement's sources.</label><br/>

        <input id="boolean_search807" class="checkbox" type="text" style="width:25px;"> <!-- NOTE: This was a textarea! -->
        <label for="boolean_search807">Search statements with a minimum of 'N' sources.</label><br/>
    </fieldset>

    <fieldset style="float:left;width:95%;">
        <legend>Boolean Search String</legend>
        <div>"or" binds more strongly than "and".    Use parentheses ( )</div>
        <textarea id="boolean_search800" style="width:100%;height:45px;" title="Try entering: &#10&nbsp;&nbsp;trees&#10or &#10&nbsp;&nbsp;trees and (water or moisture)"></textarea>
    </fieldset>

</div>     <!-- End of content div -->
`;
    }

/*
const a = new Set([1,2,3]);
const b = new Set([4,3,2]);
// Use spreading to concatenate two iterables
const union = new Set([...a, ...b]);
//assert.deepEqual([...union], [1, 2, 3, 4]);

//35.4.2 Intersection (a ∩ b) 
//Computing the intersection of two Sets a and b means creating a Set that contains those elements of a that are also in b.

//const a = new Set([1,2,3]);
//const b = new Set([4,3,2]);
const intersection = new Set(
  [...a].filter(x => b.has(x)));
//assert.deepEqual([...intersection], [2, 3]);
*/
})(jQuery);
