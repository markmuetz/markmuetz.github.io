(function ($) {

  /***********************************************************
   *         glossary widget
   ***********************************************************
   */
    $.widget('akt.glossary', {
        meta:{
            short_description: 'glossary',
            long_description: 'glossary',
            author: 'Robert Muetzelfeldt',
            last_modified: 'April 2021',
            visible: true,
            options: {
            }
        },

        options: {
            kb:AKT.state.current_kb,
            show_titlebar:true
        },

        evaluate: function(kb) {
            var results = evaluate(kb);
            display(this, results);
            return results;
        },

        widgetEventPrefix: 'glossary:',

        _create: function () {
            console.debug('\n### Creating instance of widget "akt.glossary".',
                '\nElement ID:',this.element[0].id,'  Widget UUID:',this.uuid,'  Options:',this.options);
            var self = this;
            this.element.addClass('glossary-1');

            var kb = self.options.kb;
            var results = evaluate(kb);
            display(self, results);

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('glossary-1');
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

    function evaluate(kbId) {
        console.debug('Starting akt.glossary: evaluate()...');
        var results = null;
        return results;
    }


    function display(widget, results) {
        console.debug('Starting akt.glossary: display()');
        console.debug(results);
        var kbId = AKT.state.current_kb;
        var kb = AKT.kbs[kbId];

        // Boilerplate code
        if (widget.options.show_titlebar) {
            var widgetTitlebar = $('<div class="titlebar">glossary<input type="button" value="X" class="dialog_close_button"/></div>');  
            $(widget.element).append(widgetTitlebar);
            $('.dialog_close_button').css({background:'yellow'});
            $('.dialog_close_button').on('click', function () {
                var id = $(this).parent().parent()[0].id;
                $('#'+id).css({display:"none"});
            });
        }
        var widgetContent = $('<div class="content" style="overflow:auto; padding:10px; padding-bottom:0px; top:0px; width:400px; height:500px;"></div>');
        $(widgetContent).resizable();
        $(widget.element).append(widgetContent);

        var displayHeading = $('<h3 class="widget_display_heading">Glossary of all the terms used in the '+kb+' knowledge base</h3>');
        $(widgetContent).append(displayHeading);
        var content = $('<div></div>');
        $(widgetContent).append(content);
        // End of boilerplate code

        
        var rowDiv = $('<div class="w3-row" style="height:400px;">');
        var menuDiv = $('<div class="w3-col w3-container" style="width:150px; height:100%; background:white;"></div>');
        var glossaryDiv = $('<div id="glossary_div" class="w3-rest w3-container" style="overflow:auto; height:100%;background:#f0f0f0;"></div>');
        var glossaryTable = $('<table id="glossary_table" class="sortable"></table>');
        $(content).append(rowDiv);
        $(rowDiv).append(menuDiv).append(glossaryDiv);
        //$(glossaryDiv).append(glossaryTable);
        //sorttable.makeSortable($('#glossary_table')[0]);
          
        var userOptions = ['action', 'attribute', 'object', 'part', 'process', 'value'];
        $.each(userOptions, function(i,option) {
            var optionP= $('<p id="glossary_option_'+option+'" class="glossary_option" style="color:black;" name="'+option+'">'+option+'</p>');
            $(menuDiv).append(optionP);

            $(optionP).on('click', function() {
                $('.glossary_option').css({background:'white'});
                $(this).css({background:'yellow'});
                $('#glossary_div').empty();

                var thisOption = $(this).attr('name');
                var glossaryTable = {id:'glossary', title:'Glossary for '+thisOption,headers:['word','count'], table:[]};
                $.each(resultArray[thisOption], function(i,term) {
                    var count = counts.sentence[thisOption][term];
                    glossaryTable.table.push([term,count]);
                });
                var tableHtml = AKTdisplays.tabulate(glossaryTable).html;
                $(glossaryDiv).append(tableHtml);
                sorttable.makeSortable($('#glossary_table')[0]);
            });
        });


        // This is the bit that does all the work.
        // It looks at each sentence in turn, checking recursively each "phrase" (what in 
        // AKT5 Prolog is a functor with some arguemnts, and in webAKT is an array whose first
        // argument is the functor).   The first "phrase" is always the complete sentence.
        // Sooner or later it finfs the leaf atoms, and adds then to the appropriate 
        // category (attribute, process etc).
        // At the same time, it counts up the number of sentences that contain each term
        // in its category.
        var resultObject = {
            action:new Set(),
            attribute:new Set(),
            object:new Set(),
            part:new Set(),
            process:new Set(),
            value:new Set()};

        var counts = {
            sentence:{
                action:{},
                attribute:{},
                attribute_value:{},
                object:{},
                object_part:{},
                part:{},
                process:{},
                value:{}
            }
        };
        var sentences = AKT.kbs[kb].sentences;

        $.each(sentences, function(i,sentence) {
            processOneSentence(sentence, resultObject, counts);
        });

        var resultArray = {};
        $.each(resultObject, function(i,group) {
            resultArray[i] = Array.from(group).sort();
        });
        console.debug(resultArray);

/*
        console.debug(resultObject);   
        $.each(resultObject, function(i,group) {
            console.debug(counts);
            console.debug('\n<datalist id="'+i+'">');
            var array = Array.from(group).sort();
            $.each(array, function(j,word) {
                console.debug('    <option value="'+word+'">');
            });
            console.debug('</datalist>');
        });
*/
    }

    function processOneSentence(sentence, resultObject, counts) {
        // Each thisSentence property is itself an object, consisting of the word with
        //  a value of true, indicating that the word has been found in this sentence.
        var thisSentence = {
            action:{},
            attribute:{},
            attribute_value:{},
            object:{},
            object_part:{},
            part:{},
            process:{},
            value:{}
        };

        var s = sentence.nested_list;
        checkPhrase(s);

        function checkPhrase(p) {
            var type = p[0];
            switch (type) {

                case 'action' :
                    if (p.length === 3) {
                        resultObject.action.add(p[1]);
                        increment(counts,thisSentence,'action',p[1]);
                        handleObject(p[2]);
                    } else if (p.length === 4) {
                        resultObject.action.add(p[1]);
                        increment(counts,thisSentence,'action',p[1]);
                        handleObject(p[2]);
                        handleObject(p[3]);
                    }
                    break;

                case 'and' :
                    checkPhrase(p[1]);
                    checkPhrase(p[2]);
                    break;

                case 'att_value' :
                    handleObject(p[1]);
                    resultObject.attribute.add(p[2]);
                    increment(counts,thisSentence,'attribute',p[2]);
                    handleValue(p[3]);
                    increment(counts,thisSentence,'value',p[3]);
                    break;

                case 'causes1way' :
                    checkPhrase(p[1]);
                    checkPhrase(p[2]);
                    break;

                case 'causes2way' :
                    checkPhrase(p[1]);
                    checkPhrase(p[2]);
                    break;

                case 'if' :
                    checkPhrase(p[1]);
                    checkPhrase(p[2]);
                    break;

                case 'not' :
                    handleObject(p[1]);
                    break;

                case 'or' :
                    checkPhrase(p[1]);
                    checkPhrase(p[2]);
                    break;

                case 'part' :
                    resultObject.object.add(p[1]);
                    increment(counts,thisSentence,'object',p[1]);
                    resultObject.part.add(p[2]);
                    increment(counts,thisSentence,'part',p[2]);
                    break;

                case 'process' :   // Syntax depends on number of arguments
                    if (p.length === 2) {           // process(Process_atom)
                        resultObject.process.add(p[1]);

                    } else if (p.length === 3) {
                        handleObject(p[1]);
                        resultObject.process.add(p[2]);
                        increment(counts,thisSentence,'process',p[2]);

                    } else if (p.length === 4) {    // 4
                        handleObject(p[1]);
                        resultObject.process.add(p[2]);
                        increment(counts,thisSentence,'process',p[2]);
                        handleObject(p[3]);
                    }
                    break;

                default :
                    console.debug('\n',JSON.stringify(s),'\nERROR: ',JSON.stringify(p));
            }
        }

        function handleObject(term) {
            if (typeof term === 'string') {
                resultObject.object.add(term);
                increment(counts,thisSentence,'object',term);
            } else if (Array.isArray(term)) {
                checkPhrase(term);
            }
        }

        function handleValue(term) {
            if (typeof term === 'string') {
                resultObject.value.add(term);
            } else if (Array.isArray(term)) {
                if (term[0] === 'range') {
                    resultObject.value.add(term[1]+'...'+term[2]);
                }
            }
        }

        function increment(counts,thisSentence,type, word) {
            if (!thisSentence[type][word]) {
                thisSentence[type][word] = true;
                if (!counts.sentence[type][word]) {
                    counts.sentence[type][word] = 1;
                } else {
                    counts.sentence[type][word] += 1;
                }
            }
        }
    }

})(jQuery);
