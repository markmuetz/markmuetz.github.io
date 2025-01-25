(function ($) {

  /***********************************************************
   *         boolean_search widget
   ***********************************************************
   */
    $.widget('akt.boolean_search', {
        meta:{
            short_description: 'Boolean search',
            long_description: 'Finds all statements that satisfy the search term provided.',
            author: 'Robert Muetzelfeldt',
            last_modified: 'February 2021',
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

        widgetEventPrefix: 'boolean_search:',

        _create: function () {
            console.debug('\n### Creating instance of widget "akt.boolean_search".',
                '\nElement ID:',this.element[0].id,'  Widget UUID:',this.uuid,'  Options:',this.options);
            var self = this;
            this.element.addClass('boolean_search-1');

            var kb = self.options.kb;
            var searchTerm = self.options.search_term;
            var results = evaluate(kb,searchTerm);
            display(self, results);

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('boolean_search-1');
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

    function evaluate(kb,searchExpression) {
        console.debug('Starting akt.boolean_search: evaluate()');

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
        var results = AKT.booleanSearch(statements, searchExpression);
        return results;
    }


    function display(widget, results) {
        console.debug('Starting akt.boolean_search: display()');

        if (widget.options.show_titlebar) {
            var widgetTitlebar = $('<div class="titlebar"><div class="dialog_id">XXXXXXX</div>boolean_search<input type="button" value="X" class="dialog_close_button"/></div>');  
            $(widget.element).append(widgetTitlebar);
            $('.dialog_close_button').css({background:'yellow'});
            $('.dialog_close_button').on('click', function () {
                var id = $(this).parent().parent()[0].id;
                $('#'+id).css({display:"none"});
            });
        }

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
