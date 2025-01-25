(function ($) {

    if (!AKT.tools) AKT.tools = {};
    AKT.tools.species_report = {
        short_description: 'Replicates the AKT5 "species_report" System Tool',
        long_description: 'Replicates the AKT5 "species_report" System Tool',
        author: 'Robert Muetzelfeldt',
        last_modified: 'August 2024'
    };

  /***********************************************************
   *         species_report widget
   ***********************************************************
   */
// 19 Aug 2024  this is the original species-report.js widget, intended as the exercise described below.
// It's been renamed species_report-akt5.js to reflect this.
// Now starting one with the original name, implemented in a conventional webAKT-style way.
// in species_report.js.

// Please note: This is an exercise on reproducing an AKT5 System Tool in JavaScript, 
// using code which is as close as possible (function names, variable names...) to
// the Tool's original Task Language.
// To make this as clear as possible, each webAKT function introduced is in the AKT5
// namespace.
// Sometimes this involves design choices which to my mind are not optimal.  For example,
// I retain AKT5's rather over-worked list/n macros.
// One reason for doing this is to make my life simpler: once I have implemented the
// core functions, I should be able to easily translate a variety of Tools.
// Another reason is to demonstrate the readability of the original Task Language is 
// retained in the JavaScript, because of the almost one-to-one correspondence between
// them, with only minor syntactic changes.
//
// The main changes are:
// 1. % for comment is repaced by //
// 2. the last argument for most predicates is the return value, so this is replaced
//    by a simple assignment to a function call, e.g.
//      list(select,All_terms,'Choose an item',Species);
//    becomes
//       var Species = AKT5.list(select,All_terms,'Choose an item');
// 3. I have changed 'Kb' to 'kbId' on the JavaScript version throughout, in keeping
//    with the convention used throughout webAKT, that the identifier for an object is
//    has a name ending in Id, whereas the object itself is held in a variable with the
//    same name as the object.  hence, kb (the object) vs kbId (its key/ID).
//    Ditto Species etc.

    $.widget('akt.species_report', {
        meta:{
            short_description: 'Replicates the AKT5 "species_report" System Tool',
            long_description: 'Replicates the AKT5 "species_report" System Tool',
            author: 'Robert Muetzelfeldt',
            last_modified: 'Feb 2021',
            visible: true,
            options: {
                kb:'current_kb'
            }
        },

        options: {
            kbId:AKT.state.current_kb,
            show_titlebar:true,
            speciesId:null    // Need to decide how to combine species as an option vs dialog input
        },

        evaluate: function(kbId) {
            var results = evaluate(this, kbId);
            display(this, results);
            return results;
        },

        widgetEventPrefix: 'species_report:',

        _create: function () {
            console.log('\n### Creating instance of widget "akt.species_report".');
            var self = this;
            this.element.addClass('species_report-1');

            var kbId = self.options.kbId;
            var results = evaluate(self, kbId);
            display(self, results);

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('species_report-1');
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


/*
Note that the AKT5 convention applies to the original Prolog, so Kb is a Prolog
variable holding the ID of the knowledge base.
AKT5.derived_statements(Kb,Hierarchy,Species)
AKT5.formal_term(Kb,?)
AKT5.formal_terms(Kb,Species)
AKT5.knowledge_base('select')
AKT5.list_concatenate(Array_of_strings) --> AKT5.list('concatenate',Array_of_strings)
AKT5.list_length(Array) --> AKT5.list('length',Array)
AKT5.list_not_empty(Array)
AKT5.list_select(Array,Message)
AKT5.list_sort(Array)
AKT5.show(A)
AKT5.show(A,B)
AKT5.statements_of_type(Kb,Type)
AKT5.statements_search(Kb,Species,_,object,Statements)  ?????
AKT5.statements_convert(translate,Kb,Derived_statement)

*/
    function evaluate(widget, kbId) {
        console.log('Starting akt.species_report: evaluate()');

        var nl = 'nl';
        var tab = 'tab';
        AKT.showText = "";
        // Choose a knowledge base if more than one loaded
        if (widget.options.kb) {
            var kbId = widget.options.kbId;
        } else {
            kbId = AKT5.knowledge_base('select');
        }
        
        // Choose a species
        var All_terms = AKT5.formal_terms(kbId,null);
        //var Species = AKT5.list_select(All_terms,'Choose an item');
        //widget.options.species = 'nyanya';
        if (widget.options.speciesId) {
            var speciesId = widget.options.speciesId;
        } else {
            speciesId = prompt("Please enter the name of a Species:\n\nTry each of: nyanya or cocoyam or esre","");
        }
        widget.options.speciesId = speciesId;

        if (!AKT5.formal_term(kbId,speciesId)) {
            alert("Incorrect name");
            return "xxx";
        }

        if (speciesId === "nyanya") {
            AKT5.show('<img style="float:right; margin:10px; width:200px; height:200px;" SRC="images/momordica_charantia.gif">');
        } else if (speciesId === "cocoyam") {
            AKT5.show('<img style="float:right; margin:10px; width:200px; height:200px;" SRC="images/Bakweri_cocoyam_farmer_from_Cameroon.jpg">');
        } else if (speciesId === "esre") {
            AKT5.show('<img style="float:right; margin:10px; width:200px; height:200px;" SRC="images/Panicum_maximum_reduced.jpg">');
        } else {
            AKT5.show('<img style="float:right; margin:10px; width:200px; height:200px; background:white;" SRC="no_image.gif">');
        }

        var Definition = AKT5.formal_term(kbId,speciesId)._definition;
        //if (Definition) {
            if (Definition !== '' ) {
		        AKT5.show('<b>Species definition for '); AKT5.show(speciesId); AKT5.show(nl);
                AKT5.show('</b>    '); AKT5.show(Definition); 
                AKT5.show(nl); AKT5.show(nl)
            }

            // TODO: replace second line with first (derived from the Prolog)
            //var Hierarchies = AKT5.formal_term(kbId,Species,'hierarchies');
            var Hierarchies = AKT5.getHierarchiesForObject(kbId,speciesId);
            if (AKT5.list_not_empty,Hierarchies) {
	            //AKT5.show('\'');
                AKT5.show("<b>"); AKT5.show(speciesId);
                AKT5.show(' is a member of the following hierarchies</b>'); AKT5.show(nl), 
                AKT5.show(tab); AKT5.show(Hierarchies); AKT5.show(nl)
            }

            var Synonyms = AKT5.formal_term(kbId,speciesId)._synonyms;
            if (AKT5.list_not_empty(Synonyms)) {
                //AKT5.show('\'');
                AKT5.show("<b>"); AKT5.show(speciesId);
                AKT5.show(' has the following synonyms</b>'); AKT5.show(nl);
                AKT5.show(tab); AKT5.show(Synonyms); AKT5.show(nl);
            }

            $.each(['attribute','causal','comparison','link','conditional'], function(i,Type) {
                var Statements = AKT5.statements_of_type(kbId,Type);
                var Found = AKT5.statements_search(kbId,speciesId,null,'object',Statements);

                // Nov 2021: Bypass the following two operations for the time being.
                // Note that AKT5.statements_search returns the English statement, not the statement object.
                //var Converted = AKT5.statements_convert(numbered,kbId,Found);
                //var Sorted =  AKT5.list_sort(Converted);
                //if (AKT5.list_not_empty(Sorted)) {

                if (AKT5.list_not_empty(Found)) {
                    var MsgType = AKT5.list('concatenate',['<b>',speciesId,' is used in the following ',Type,' statements :</b>']);
                    AKT5.show(MsgType); AKT5.show(nl); AKT5.show(tab); AKT5.show(Found); AKT5.show(nl);
                }
            });

/*
            var Hierarchies = AKT.getHierarchiesForObject(kbId,Species);
            var superObjectsList = {};
            for (var i=0; i<Hierarchies.length; i++) {
                var hierarchy = Hierarchies[i];
                var objectTree = AKT.makeTree(kbId,"subobjects");
                var superObjects = AKT.getAllAncestors(objectTree, Species);
                for (var j=0; j<superObjects.length; j++) {
                    var superObject = superObjects[j];
                    superObjectsList[superObject] = true;
                }
            }
            var kb = kbId;
            var count = 0;
            var statements = [];
            for (var superObject in superObjectsList) {
                for (var i=0; i<AKT.kbs[kb].sentences.length; i++) {
                    var statement = AKT.kbs[kb].sentences[i].english;
                    if (statement.indexOf(superObject) > -1) {
                        var re = new RegExp(superObject,"g");
                        statements[count] = statement.replace(re, '<span style="color:blue;" title="'+superObject+'">'+Species+'</span>');
                        count += 1;
                    }
                }
            }
            AKT5.show("<b>There are ");
            AKT5.show(count);
            AKT5.show(" derived statements in the ");
            AKT5.show("weeds");
            AKT5.show(" hierarchy for ");
            AKT5.show(Species);
            AKT5.show("</b>");
            AKT5.show(nl);
            for (var i=0; i<statements.length; i++) {
                AKT5.show(statements[i]);
                AKT5.show(nl);
            }
*/


            //  display the derived statements for the species for each hierarchy it belongs to.
            //Hierarchies = AKT.getHierarchies(AKT.kbs.XXXXX,"subobjects");
            $.each(Hierarchies, function(i,Hierarchy) {
                var DerivedStatements = AKT5.derived_statements(kbId,Hierarchy,speciesId);
                var N = AKT5.list('length',DerivedStatements);
	            if (N>0) {
                    var MsgDer = AKT5.list('concatenate',['<b>','There are ',N,' derived statements in the ',Hierarchy,' hierarchy for ',Species,'</b>']);
	                AKT5.show(MsgDer); AKT5.show(nl);
                    $.each(DerivedStatements, function(i,Derived_statement){
                        //var NLDer = AKT5.statements_convert(translate,Kb,Derived_statement);
                        AKT5.show(Derived_statement); AKT5.show(nl);
                    });
                    AKT5.show(nl);
                }
            });

             

        //} else {
        //    AKT5.show(message,'No such species in knowledge base.');
        //}
        return AKT.showText;
    }


    function display(widget, results) {
        console.log('Starting akt.species_report: display()');
        console.log(results);

        if (widget.options.show_titlebar) {
            var widgetTitlebar = $('<div class="titlebar"><div class="dialog_id">XXXXXXX</div>species_report for '+widget.options.species+'<input type="button" value="X" class="dialog_close_button"/></div>');  
            $(widget.element).append(widgetTitlebar);
            //$('.dialog_close_button').css({background:'yellow'});
            $('.dialog_close_button').on('click', function () {
                var id = $(this).parent().parent()[0].id;
                $('#'+id).css({display:"none"});
            });
        }
        var widgetContent = $('<div class="content" style="padding:10px;padding-bottom:0px;top:0px;width:600px;height:600px;"></div>');
        $(widgetContent).resizable();
        $(widget.element).append(widgetContent);
        var displayHeading = $('<h3 class="widget_display_heading">Species report for '+widget.options.speciesId+' in the '+widget.options.kb+' knowledge base</h3>');
        $(widgetContent).append(displayHeading);
        $(widgetContent).append('<div contenteditable="true" style="width:100%; background:#e0e0e0;"></div>');

        // TODO: Need to seriously consider an alternative to this hack, which is intended to
        // suppress the scrollbar when the output goes to a "montage" div, i.e. one without scrollbars.
        if (widget.options.display && widget.options.display === 'montage') {
            var content = $('<div>'+results+'</div>');
        } else {
            var content = $('<div style="height:500px; overflow-y:scroll;">'+results+'</div>');
        }
        $(widgetContent).append(content);
        $(widgetContent).append('<div contenteditable="true" style="width:100%; background:#e0e0e0;"></div>');
        //var imageLink = AKT.kbs.XXXXX.images[0].source;
        //$(widgetContent).append('<p>Image:</p><img src="'+imageLink+'" width="200px" height="150px"></img>');
    }

})(jQuery);

/* The original Task Language version...
% Choose a knowledge base if more than one loaded
knowledge_base(select,Kb),

% Choose a species
formal_terms(Kb,_,All_terms),
list(select,All_terms,'Choose an item',Species),

if  formal_term(Kb,Species,definition,Definition) then
    ( if Definition \= `` then
		( show('Species definition for : '), show(Species), show(nl),
              show('    '), show(Definition),
              show(nl), show(nl)
		),
	formal_term(Kb,Species,hierarchies,Hierarchies),
	if list(not_empty,Hierarchies) then
		(  show(''''), show(Species),
               show(''' is a member of the following hierarchies :'),show(nl),
               show(tab,Hierarchies), show(nl)
            ),

	formal_term(Kb,Species,synonyms, Synonyms),
	if  list(not_empty,Synonyms) then
             ( show(''''), show(Species),
               show(''' has the following synonyms : '),show(nl),
               show(tab,Synonyms),show(nl)
             ),

	foreach Type in [attribute,causal,comparison,link,conditional] do
         ( statements_of_type(Kb,Type,Statements),
	     statements_search(Kb,Species,_,object,Statements,Found),
           statements_convert(numbered,Kb,Found,Converted),
	     list(sort,Converted,Sorted),
           if list(not_empty,Sorted) then
               ( list(concatenate,['''',Species,''' is used in the following ',Type,' statements :
'],MsgType),
                 show(MsgType), show(tab,Sorted), show(nl)
               )
         ),

      % display the derived statements for the species for each hierarchy it belongs to.
	foreach Hierarchy in Hierarchies do
         ( 	derived_statements(Kb,Hierarchy,Species,DerivedStatements),
            list(length,DerivedStatements,N),
	      if N>0 then
                ( list(concatenate,['
There are ',N,' derived statements in the ''',Hierarchy,''' hierarchy for ',Species],MsgDer),
	            show(MsgDer),show(nl),
	            foreach Derived_statement in DerivedStatements do
                     ( statements_convert(translate,Kb,Derived_statement,NLDer),
                       show(tab,NLDer),show(nl)
                     )
                )
         )
    )
else show(message,'No such species in knowledge base.'). 
*/
