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
// 19 aug 2024 Ignore text that follows!   Now reverting to conventional webAkT widget style.

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

        if (widget.options.kb) {
            var kbId = widget.options.kbId;
        } else {
            kbId = AKT.state.current_kb;
        }
        var kb = AKT.KBs[kbId];
        
        // Choose a species
        var All_terms = AKT5.formal_terms(kbId,null);
        if (widget.options.speciesId) {
            var speciesId = widget.options.speciesId;
        } else {
            speciesId = prompt("Please enter the name of a Species:\n\nTry each of: nyanya or cocoyam or esre","nyanya");
        }
        widget.options.speciesId = speciesId;

        var formalTerm = kb._formalTerms[speciesId];
        console.log('formalTerm:',formalTerm);

        // The main content div.
/*      Alternative, to allow for montage.
        if (widget.options.display && widget.options.display === 'montage') {
            var divContent = $('<div>'+results+'</div>');
        } else {
            divContent = $('<div style="height:500px; overflow-y:scroll;"></div>');
        }
*/
        var divContent = $('<div class="content" style="padding:10px;padding-bottom:0px;top:0px;width:600px;height:500px;overflow-y:auto;"></div>');
        //$(widgetContent).resizable();
        $(widget.element).append(divContent);

        var h3DisplayHeading = $('<h3 class="widget_display_heading">Species report for <span style="color:#900000">'+widget.options.speciesId+'</span> in the  <span style="color:#900000">'+AKT.state.current_kb+'</span> knowledge base</h3>');
        $(divContent).append(h3DisplayHeading);


        // Definition
        var definition = formalTerm._definition;
        var sectionDiv = $('<div class="div_section"></div>');
        $(sectionDiv).append('<div class="div_section_heading">Species definition for '+speciesId+'</div>');
        var itemDiv = $('<div class="div_item">'+definition+'</div>');
        $(sectionDiv).append(itemDiv);
        $(divContent).append(sectionDiv);

        // Hierarchies
        var hierarchies = formalTerm.findHierarchies();
        var sectionDiv = $('<div class="div_section"></div>');
        $(sectionDiv).append('<div class="div_section_heading">'+speciesId+' is a member of the following object hierarchies:</div>');

        $.each(hierarchies, function(i,hierarchy) {
            var subsectionDiv = $('<div class="div_subsection"></div>');
            $(subsectionDiv).append('<div class="div_subsection_heading">'+hierarchy._id+'</div>');

            var speciesId = formalTerm._id;
            var parentId = hierarchy._tree_up[speciesId];
            console.log(speciesId,parentId,hierarchy);
            if (parentId) {
                var parentString = parentId;
                var siblingsIds = removeItemOnce(hierarchy._tree_down[parentId],speciesId); 
                if (siblingsIds.length === 0) {
                    var siblingsString = 'No sibling species';
                } else {
                    siblingsString = siblingsIds.join(', '); 
                }
            } else {
                parentString = 'No parent species';
                var siblingsString = 'No sibling species';
            }

            var childrenIds = hierarchy._tree_down[speciesId];
            if (childrenIds) {
               childrenString = JSON.stringify(childrenIds);
            } else {
                childrenString = 'No child species';
            }

            $(subsectionDiv).append('<div class="item"><div class="div_item_heading">Parent:</div><div class="div_item_content">'+parentString+'</div></div>');
            $(subsectionDiv).append('<div class="item"><div class="div_item_heading">Siblings:</div><div class="div_item_content">'+siblingsString+'</div></div>');
            $(subsectionDiv).append('<div class="item"><div class="div_item_heading">Children:</div><div class="div_item_content">'+childrenString+'</div></div>');

            $(sectionDiv).append(subsectionDiv);
        });

        $(divContent).append(sectionDiv);

        // Synonyms
        var synonyms = formalTerm._synonyms;
        var sectionDiv = $('<div class="div_section"></div>');
        $(sectionDiv).append('<div class="div_section_heading">'+speciesId+' has the following synonyms:</div>');
        
        console.log(synonyms);
        console.log(synonyms.length);
        if (synonyms.length===0 || synonyms[0] === '') {
            $(sectionDiv).append('No synonyms');
        } else {
            $.each(synonyms, function(i,synonymId) {
                var itemDiv = $('<div class="div_item">'+synonymId+'</div>');
                $(sectionDiv).append(itemDiv);
            });
        }
        $(divContent).append(sectionDiv);

        // Statements
        var sectionDiv = $('<div class="div_section"></div>');
        $(sectionDiv).append('<div class="div_section_heading">'+speciesId+' is used in the following statements:</div>');
        $.each(['att_value','causal','comparison'], function(i,type) {
            var subsectionDiv = $('<div class="div_subsection"></div>');
            $(subsectionDiv).append('<div class="div_subsection_heading">'+type+' statements</div>');
            var statements = kb.getStatements({type:{[type]:true},formal_term:{[speciesId]:true}});
            if (Object.keys(statements).length>0) {
                for (var id in statements) {
                    var statement = statements[id];
                    var itemDiv = $('<div class="div_item">'+id+': '+statement._formal+'</div>');
                    $(subsectionDiv).append(itemDiv);
                }
            } else {
                $(subsectionDiv).append('<div>No statements</div>');
            }
            $(sectionDiv).append(subsectionDiv);
            console.log(type,statements);
        });
        $(divContent).append(sectionDiv);

        $('.div_section_heading').css({'font-weight':'bold','font-size':'12px','padding-top':'7px'});
        $('.div_subsection_heading').css({'font-weight':'bold'});

        // Derived statements
        var sectionDiv = $('<div class="div_section"></div>');
        $(sectionDiv).append('<div class="div_section_heading">Derived statements for '+speciesId+'</div>');
        $(sectionDiv).append('<div>These statements, if any, are derived from any hierarchies that '+speciesId+' occurs in</div>');
        if (Object.keys(hierarchies).length>0) {
            $.each(hierarchies, function(i,hierarchy) {
                var subsectionDiv = $('<div class="div_subsection"></div>');
                $(subsectionDiv).append('<div class="div_subsection_heading">'+hierarchy._id+'</div>');

                var speciesId = formalTerm._id;
                var parentId = hierarchy._tree_up[speciesId];
                console.log(speciesId,parentId,hierarchy);
                if (parentId) {
                    var statements = kb.getStatements({formal_term:{[parentId]:true}});
                    var nStatements = Object.keys(statements).length;
                    $(subsectionDiv).append('<div>There are '+nStatements+' derived statements from the '+hierarchy._id+' hierarchy</div>');
                    if (nStatements>0) {
                        for (var id in statements) {
                            var statement = statements[id];
                            var type = statement._type;
                            var itemDiv = $('<div class="div_item">'+id+'('+type+'): '+statement._formal+'</div>');
                            $(subsectionDiv).append(itemDiv);
                        }
                    }
                } else {
                    $(subsectionDiv).append('<div>No parentId</div>');
                }
                $(sectionDiv).append(subsectionDiv);
            });
        } else {
            $(sectionDiv).append('<div>No hierarchies contain '+speciesId+', so no derived statements</div>');
        }
        $(divContent).append(sectionDiv);


        var sectionDiv = $('<div class="div_section"></div>');
        $(sectionDiv).append('<div class="div_section_heading">The following images are associated with '+speciesId+'</div>');
        var subsectionDiv = $('<div class="div_subsection"></div>');
        var images = formalTerm._images;
        for (var imageId in images) {
            var image = images[imageId];
            $(subsectionDiv).append('<div style="float:left;width:200px;height:300px;border:solid 1px black;margin:10px;">'+
                        '<img src="'+image._url+'" style="width:200px;height:200px;"></img>'+
                        '<div>'+image._caption+'</div>'+
                        '<div class="div_image_id">'+imageId+'</div>'+
                    '</div>');
        }
        $(subsectionDiv).append('<div style="clear:both;"></div>');
        $(sectionDiv).append(subsectionDiv);
        $(divContent).append(sectionDiv);

/*
        $(widget.element).append(`
        <!-- IMAGE -->
        <!-- Thanks to https://webdesign.tutsplus.com/how-to-build-a-simple-carousel-with-vanilla-javascript--cms-41734t -->
        <!-- Orginal HTML first, then my adapted version.   Eventually all code will be packaged in a single function -->
        <div class="div_image" style="float:left;width:252px;height:252px;margin:7px;margin-top:30px;background:white;border:solid 1px black;">
            <section class="slider-wrapper">
                <button class="slide-arrow" id="slide-arrow-prev">&#8249;</button>
                <button class="slide-arrow" id="slide-arrow-next">&#8250;</button>
              
                <ul class="slides-container" id="slides-container" style="padding-inline-start:0px;">
              </ul>
            </section>
        </div>

        <div style="clear:both;"></div>
        `);
        var images = formalTerm._images;
        for (var imageId in images) {
            var image = images[imageId];
            $(widget.element).find('.slides-container').append(`
                <li class="slide">
                    <div style="width:100%;height:100%;">
                        <img src="`+image._url+`" style="width:100%;height:90%;"></img>
                        <div>`+image._caption+`</div>
                        <div class="div_image_id">`+imageId+`</div>
                    </div>
                </li>
            `);
            AKT.slidersCss(widget);
        }
*/


        // CSS
        $('.div_section_heading').css({clear:'both','font-weight':'bold','font-size':'13px','padding-top':'12px'});
        $('.div_subsection_heading').css({clear:'both','font-weight':'bold','padding-top':'7px'});
        $('.div_item').css({clear:'left'});
        $('.div_item_heading').css({clear:'left',float:'left'});
        $('.div_item_content').css({float:'left'});


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
/*
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
*/
             

        //} else {
        //    AKT5.show(message,'No such species in knowledge base.');
        //}
        return AKT.showText;

        function removeItemOnce(arr, value) {
          var index = arr.indexOf(value);
          if (index > -1) {
            arr.splice(index, 1);
          }
          return arr;
        }
        
    }


    function display(widget, results) {
        console.log('Starting akt.species_report: display()');
        console.log(results);

/*        if (widget.options.show_titlebar) {
            var widgetTitlebar = $('<div class="titlebar"><div class="dialog_id">XXXXXXX</div>species_report for '+widget.options.species+'<input type="button" value="X" class="dialog_close_button"/></div>');  
            //$(widget.element).append(widgetTitlebar);
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
*/
        // TODO: Need to seriously consider an alternative to this hack, which is intended to
        // suppress the scrollbar when the output goes to a "montage" div, i.e. one without scrollbars.
/*
        if (widget.options.display && widget.options.display === 'montage') {
            var content = $('<div>'+results+'</div>');
        } else {
            var content = $('<div style="height:500px; overflow-y:scroll;">'+results+'</div>');
        }
        $(widgetContent).append(content);
        $(widgetContent).append('<div contenteditable="true" style="width:100%; background:#e0e0e0;"></div>');
*/
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
