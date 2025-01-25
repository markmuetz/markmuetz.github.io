macro = {};
macro["checkForLoops/1"] = {
applies_to: `General`,
description: `Checks if there are any causal or linked statements in the knowledge base that form a closed loop.
If there are any loops, then tool will output a list of sentence identifiers that form the loop(s) and also draw a diagram of the loop(s).`,
head: `checkForLoops(Kb)`,
body: `find_all_solutions(Id,(sentence(Id,Kb,_,_,Type),(Type=causal;Type=link)),NodeSet),
findLoop(Kb,NodeSet,LinkedNodes),
( LinkedNodes = [],
  show('There is no loop present in the Kb'), show(nl);
  draw_diagram(Kb,Diagram,LinkedNodes),
  convert(string,'Diagram of Loop.',Title),
  show('The following Kb statements are members of a loop(s).'), show(nl),
  show(LinkedNodes),
  akt_wtext((akt,60),Title)
). `};

macro["check_for_duplicate_statements/1"] = {
applies_to: `Single KB`,
description: `The tool initially checks to see if there are any duplicate statements in the Kb.

If there are any, it asks the user whether they would like to remove the duplicate statements.
If they answer 'no' then the tool will just list the duplication.
If they answer 'yes' then the tool will give details of all the statement duplication and a list of the statements that have been removed.

The tool will automatically remove any statement with identical formal terms and sources to another statement.

The tool will also automatically remove any statement with identical formal terms to another statement, when it comes from a different source.
In these cases it will add the source(s) of the duplicate statement to that of the original statement.

There may be instances of two statements being identical except for their conditions.
In this case the tool will display the duplication but will leave it to the user to decide whether to delete one of them.

Note. It is worth displaying a list of the Kb statements (KB/Statements) prior to running the tool.`,
head: `check_for_duplicate_statements(Kb)`,
body: `knowledge_base(duplicates,Kb,Duplication),
  ( test(equal,Duplication,[]),
    list(concatenate,[Kb,' does not contain any duplicate statements.'],Msg1),
    show(nl), show(Msg1),show(nl);
    show(nl),show('Duplicated statements ...'),show(nl),show(nl),
    show(Duplication),
    Msg2= 'The knowledge base contains duplicate statements; do you wish to remove them ?',
    list(select,[no,yes],Msg2,Ans),
    if Ans=yes then ( findall(Id,(sentence(Id,Kb,_,_,Type),Type \= inferred),Ids),
			    remove_duplicate_statements(Kb,Ids,Filtered),
			    find_all_solutions(Id,(member(Id, Ids),
							   \= member(Id,Filtered)
							  ), Removed),
			    length(Removed,N),
			    list(concatenate,['The following ',N,' statements have been removed'],Msg3),
			    show(nl),show(Msg3),show(nl),
			    show(Removed), show(nl)
			 )
  ),!. `};

macro["common_knowledge/0"] = {
applies_to: `Single Kb`,
description: `This tool enables the user to determine which information in the knowledge base has come from the widest range of sources. `,
head: `common_knowledge`,
body: `
%%% Choose KB %%%
knowledge_base(select,Kb),

%%% Choose number of sources for a statement to qualify %%%
Message = 'Select both the arithmetic operator AND the number of sources that are of interest',
list(multiple_select,[equal,'greater than','less than',1,2,3,4,5,6,7,8,9,10],Message,Choice),
if  ( Choice = [Op,N],
	member(Op,[equal,'greater than','less than'],Position),
	member(N,[1,2,3,4,5,6,7,8,9,10])
    )
then ( %%% Find the statements with required number of sources %%%
	 member(Operator,['=','>','<'],Position),
	 member(English,['',' greater than',' less than'],Position),
       find_all_solutions(Statement,
           ( sentence(Id,Kb,_,source(Kb,source(Sources)),Type),
	       Type \= inferred,
	       list(length,Sources,Length),
	       Operator(Length,N),
		 statements_convert(numbered,Kb,Id,Statement)
            ), Statements),
	 length(Statements,Ls),
	 nl, show('There are '), show(Ls),
       show(' statements which have'),
	 show(English), show(' '), show(N), show(' sources'),nl,
	 nl, show(Statements),nl
      )
else ( message('Select BOTH an operator and an integer')). `};

macro["derived_statements_summary/1"] = {
applies_to: `Single Kb`,
description: `Produces a table summarising the number of derived statements that exist for each object hierarchy in the specified knowledge base. 

This will give an indication of the amount of abstraction of information about individual objects to a more general object term.

The tool is intended to give the knowledge base user an idea of how many possible statements about lower level hierarchy objects have been abstracted to a higher (more complex) level of the hierarchy, resulting in fewer statements needed to represent the knowledge contained in the hierarchy.

Each of the statements about a parent object in a hierarchy is also true for any of the parent’s descendants, but by having the inheritance property of the hierarchy we don’t have to define them all individually.  The ‘Number of derived statements’ shown in the tool’s output is a measure of how many individual statements would be needed to represent all the knowledge without using inheritance.

( see also the 'System Tools'/'Knowledge Consistency'/'Single Kb'/statement_induction_up_a_hierarchy tool which derives more general statements about the ancestors of hierarchic objects from statements made about their descendants)
`,
head: `derived_statements_summary(Kb)`,
body: `
% select KB if Kb parameter is uninstantiated
if var(Kb) then kb_function(select,Kb),

%%% Make list of all the Object Hierarchies in the knowledge base %%%

knowledge_base(hierarchies, Kb, Hierarchies),

%%% Find all the derived statements in the knowledge base %%%

% Make list of number of derived statements for each hierarchy
find_all_solutions( No_in_hierarchy,
    (	list(member,Hierarchies,Hierarchy),
       hierarchy_objects(Kb,Hierarchy,derived,_,No_in_hierarchy)
    ), List_of_number_in_each_hierarchy),

%%% Construct title and column headings. %%%

list(concatenate,['Number of derived statements for each object hierarchy in the ''',Kb,''' knowledge base.'],Title),
Headings = ['Hierarchy','Number of derived statements'],

%%% Display the table %%%

if List_of_number_in_each_hierarchy = []
   then show('There are no derived statements in the knowledge base')
   else tabulate_data(Title,_,[25|_],Headings,[Hierarchies,List_of_number_in_each_hierarchy]),
show(nl). `};

macro["diagram_report/1"] = {
applies_to: `General`,
description: `Tool determines how many drawable statements there are in the knowledge base and checks that they can all be drawn.
A diagram is drawn containing all the drawable statements and this is compared with a list of all the causal and link statements to ascertain whether they were all drawn successfully.
A report is then generated summarising the result.`,
head: `diagram_report(Kb)`,
body: `
  knowledge_base(list,KBs),
  member(Kb,KBs),!,
  /* find how many statements are in the Kb */
  find_all_solutions(Id,(sentence(Id,Kb,_,_,Type),Type\=inferred),Ids),
  length(Ids,Total),

  /* find how many drawable statements are in the Kb without drawing a diagram */
  find_all_solutions(Id,(sentence(Id,Kb,formal(Formal,Objects),_,Type),(Type=causal;Type=link)),Ids1),
  length(Ids1,Drawable),

  /* construct a diagram */
  cat_to_atom_or_string([Drawable,' drawable statements'],_,Title),
  draw_diagram(Kb,Diagram,Title,Ids1),

  /* find all statements represented in the diagram */
  find_all_solutions(Id,link(Kb,Diagram,_,_,_,Id,_,_),Ids2),
  length(Ids2,Drawn),

  /* find all statements that are not drawn */
  find_all_solutions(Id,(member(Id,Ids1),\= member(Id,Ids2)),Ids3),
  length(Ids3,NotDrawn),

  /* checks */
  if Drawable=Drawn
  then show('All possible drawable statements were produced on the diagram.')
  else ( cat(['There are ',Total,' statements in the Kb of which ',Drawable,' are drawable ',' but only ',Drawn,' have been drawn.'],Msg1),
         cat(['~M~JThe ',NotDrawn,' statements that have not been drawn are :'],Msg2),
         show(Msg1), show(Msg2), show(Ids3)
       ),
  show(nl). `};

macro["get_components/3"] = {
applies_to: `Single Kb`,
description: ` 
[ This tool has been produced as part of the CAFNET projects (Europe Aid 
ENV/2006/114-382/TPS) with the financial assistance of the European 
Union and the coordination of CIRAD. The contents of this tool are the 
sole responsibility of UWB and can under no circumstances be regarded as 
reflecting the position of the European Union. ]

The tool get_components/3 is used by the tool 'interactions_amongst_formal_terms'
to construct a list of knowledge base objects that are of interest to the user.
The user has the option to include synonyms for each object.

1. Get the list of objects.

2. Ask user if synonyms are to be included.

3. Get the synonyms.
`,
head: `get_components(Kb,Objects,Synonyms)`,
body: `
%%% Get objects %%%
get_objects(Kb,Objects),

%%% Ask user if synonyms are required for the objects %%%
list(select,[yes,no],'Do you want to get synonyms for the objects ?',Response),

%%% Get synonyms %%%
if Response = yes
    then get_synonyms(Kb,Objects,Synonyms)
    else ( % ensure a blank synonym entry for each object
           list(length,Objects,Length),
           list(length,List,Length),
           find_all_solutions(Synonym,
               ( list(member,List,Synonym),
                 Synonym = ''
               ),Synonyms)
          ).	`};

macro["get_interactions/4"] = {
applies_to: `Single Kb`,
description: `
[ This tool has been produced as part of the CAFNET projects (Europe Aid 
ENV/2006/114-382/TPS) with the financial assistance of the European 
Union and the coordination of CIRAD. The contents of this tool are the 
sole responsibility of UWB and can under no circumstances be regarded as 
reflecting the position of the European Union. ]

The tool get_interactions/4 is used by the tool 'interactions_amongst_formal_terms'
to determine what relationships exist in the knowledge base between pairs of objects.
A search of the knowledge base statements is carried out for every combination of
object pairs in the supplied list. If there are a large number of objects then the tool
may take a few minutes to run.
`,
head: `get_interactions(Kb,Column,Row,Interactions)`,
body: `
%%% Tell user where we are in the tool %%%
Message = 'About to find interactions; it will take a few minutes if you have chosen many objects',
message(Message),

%%% Find the relationships between the objects %%%
find_all_solutions( Row_interactions, 
     ( % select each column object in turn
       list(member,Column,Y),
       find_all_solutions( (Y,X,IDs,N),
	     ( % compare all the row objects with selected column object
              list(member,Row,X),
              statements_search(Kb,(X and Y),_,object,all,IDs),
              length(IDs,N)
            ),Row_interactions)
     ),Interactions). `};

macro["get_objects/2"] = {
applies_to: `Single Kb`,
description: `
[ This tool has been produced as part of the CAFNET projects (Europe Aid 
ENV/2006/114-382/TPS) with the financial assistance of the European 
Union and the coordination of CIRAD. The contents of this tool are the 
sole responsibility of UWB and can under no circumstances be regarded as 
reflecting the position of the European Union. ]

The tool get_objects/2 is used by the tool get_components/3
to construct a list of knowledge base objects that are of
interest to the user. The objects can be restricted to particular
hierarchies, can include subobjects and/or non-hierarchical objects.

1. Make list of all the object hierarchies in the Kb

2. Select the object hierarchies that are of interest

3. Get list of hierarchies that will have subobjects included

4. Insert subobjects in list immediately after their superobject

5. Select any non-hierarchical objects to be included

6. Produce final list of objects
`,
head: `get_objects(Kb,Objects)`,
body: `
%%% Make list of all the object hierarchies in this Kb %%%
knowledge_base(hierarchies,Kb,Kb_Hierarchies),

%%% Select the object hierarchies that are of interest %%%
list(options,[all,none|Kb_Hierarchies],'Choose hierarchies of interest',Choice_1),
if list(member,Choice_1,all)            then Selected_hierarchies = Kb_Hierarchies,
if list(member,Choice_1,none)           then Selected_hierarchies = [],
if list(not_member,[all,none],Choice_1) then Selected_hierarchies = Choice_1,

%%% Get list of hierarchies that will have subobjects included %%%
if Selected_hierarchies \= []
   then ( list(select,[yes,no],'Do you want to include subobjects ?',Response1),
          if Response1 = yes
             then % Select hierarchies which will have their subobjects included
                  ( if Selected_hierarchies = [_]    % single item in list
                       then Hierachies_with_subobjects = Selected_hierarchies
                       else ( ListH = [all|Selected_hierarchies],
                              list(options,ListH ,'Choose hierarchies that will have their subobjects included',Choice_2),
                              if list(member,Choice_2,all)
                                  then Hierachies_with_subobjects = Selected_hierarchies
                                  else Hierachies_with_subobjects = Choice_2
                            )
                  )
             else Hierachies_with_subobjects = []  % empty list
        )
   else Hierachies_with_subobjects = [],

%%% Insert subobjects in list immediately after their superobject %%%
find_all_solutions(Objs,
   ( list(member,Selected_hierarchies,Hierarchy),
     if list(member,Hierachies_with_subobjects,Hierarchy)
        then ( hierarchy_objects(Kb,Hierarchy,descendants,Hierarchy,Subobjects),
               Objs=[Hierarchy|Subobjects]
             )
        else Objs=[Hierarchy]
   ),List_of_Objs),

list(flatten,List_of_Objs,Hierarchical_objects),

%%% Select any non-hierarchical objects to be included %%%
list(select,[yes,no],'Are any non-hierarchical objects to be included ?',Response2),
if Response2 = yes
    then ( % choose objects not already included in hierarchical object list
           formal_terms(Kb,object,Object_formal_terms),
           list(multiple_select,[all|Object_formal_terms],Choice_selected),
           if list(member,Choice_selected,all)
              then Non_hierarchy_objects = Object_formal_terms
              else Non_hierarchy_objects = Choice_selected
         )
    else Non_hierarchy_objects = [],

%%% Produce final list of objects %%%
list(append,Hierarchical_objects,Non_hierarchy_objects,Objects). `};

macro["get_synonyms/3"] = {
applies_to: `Single Kb`,
description: `
[ This tool has been produced as part of the CAFNET projects (Europe Aid 
ENV/2006/114-382/TPS) with the financial assistance of the European 
Union and the coordination of CIRAD. The contents of this tool are the 
sole responsibility of UWB and can under no circumstances be regarded as 
reflecting the position of the European Union. ]

The tool get_synonyms/3 is used by the tool get_components/3 to supplement a
list of objects with their synonyms. All of the objects synonyms can be
included or they can be restricted to a particular synonym position.
(see formal term definitions)
`,
head: `get_synonyms(Kb,Objects,Synonyms)`,
body: `
%%% Ask which synonyms are required %%%
list(select,[all,numbered_positions],'Choose synonyms required',Response),
if Response = all
    then find_all_solutions( Entry,
            ( list(member,Objects,Object),
              formal_term(Kb,Object,synonyms,Syns),
              if Syns=[] then Entry = ''
                         else list(symbol,Syns,',',Entry)
            ),Synonyms)
    else ( % Ask for synonym position %%%
           ask('Input synonym position as an integer',Integer),
           find_all_solutions( Synonym,
              ( list(member,Objects,Object),
                formal_term(Kb,Object,synonyms,All_syns),
                % Synonym = '' if none in specified position
                if list(position,All_syns,Integer,Syn)
                   then Synonym = Syn
                   else Synonym =''
              ),Synonyms)
         ). `};

macro["hierarchic_objects_usage/0"] = {
applies_to: `Single Kb`,
description: `
[ This tool has been produced as part of the CAFNET projects (Europe Aid 
ENV/2006/114-382/TPS) with the financial assistance of the European 
Union and the coordination of CIRAD. The contents of this tool are the 
sole responsibility of UWB and can under no circumstances be regarded as 
reflecting the position of the European Union. ]

Allows user to see what hierarchical objects are shared between hierarchies.
`,
head: `hierarchic_objects_usage`,
body: `
%%% Choose KB %%%
knowledge_base(select,Kb),

%%% Make list of all the object hierarchies in this Kb %%%
knowledge_base(hierarchies,Kb,Kb_Hierarchies),

%%% Select the object hierarchies to be examined %%%
list(options,[all|Kb_Hierarchies],'HIERARCHIES',Choice),
if list(member,Choice,all)
   then Selected_hierarchies = Kb_Hierarchies
   else Selected_hierarchies = Choice,

%%% Make a list of all the objects in the selected hierarchies %%%
find_all_solutions(H_Objs,
     (  list(member,Selected_hierarchies,Hierarchy),
        hierarchy_objects(Kb,Hierarchy,objects,_,H_Objs)
     ), Solutions),
list(flatten&sort,Solutions,All_objects),

%%% Make a column for each hierarchy with an 'x' where the hierarchy   %%%
%%% contains an object in the list 'All_objects' and a blank otherwise %%%
find_all_solutions(Column,
   (  % choose each hierarchy in turn
      list(member,Selected_hierarchies,Hierarchy),
      % make a column of entries for this hierarchy
      find_all_solutions(Entry,
         (  % make a list of its objects
            hierarchy_objects(Kb,Hierarchy,objects,_,Hierarchy_objects),
            % choose each hierarchical object in turn
            list(member,All_objects,Object),
            % check if object exists in current hierarchy
            if list(member,Hierarchy_objects,Object) then Entry = 'x' else Entry = ''
          ), Column)
    ),Columns),
             
%%% Collate information for the table %%%
Title = 'Multiple usage of the same object within different hierarchies.',
Header      = ['OBJECTS' | Selected_hierarchies],
All_columns = [All_objects | Columns],

%%% Display the table %%%
tabulate_data(Title,_,_,Header,All_columns). `};

macro["hierarchical_actions_and_processes/0"] = {
applies_to: `Single Kb`,
description: `
[ This tool has been produced as part of the CAFNET projects (Europe Aid 
ENV/2006/114-382/TPS) with the financial assistance of the European 
Union and the coordination of CIRAD. The contents of this tool are the 
sole responsibility of UWB and can under no circumstances be regarded as 
reflecting the position of the European Union. ]

Tool allows you to evaluate the actions and processes that are associated with the objects within an object hierarchy.
The user is asked to select an object hierarchy from the chosen knowledge base.
`,
head: `hierarchical_actions_and_processes`,
body: `
%%% Choose KB %%%
knowledge_base(select,Kb),

%%% Make list of all the object hierarchies in this Kb %%%
knowledge_base(hierarchies,Kb,Kb_Hierarchies),

%%% Select the object hierarchy to be evaluated %%%
list(select,Kb_Hierarchies,'Choose hierarchy',Selected_hierarchy),

%%% Make complete list of the objects in the selected hierarchy %%%
hierarchy_objects(Kb,Selected_hierarchy, objects,_,Hierarchy_objects),

%%% Choose actions or processes for association with the objects %%%
list(select,[action,process],'Select actions or processes',Choice),

%%%  Make list of the objects and their associated actions or processes. %%%
find_all_solutions((Object,AorPs),
     ( list(member,Hierarchy_objects,Object),
       formal_term(Kb,Object,Choice,AorPs)
     ),OAPs),
list(sort,OAPs,Associations),

%%%  Make complete list of the actions or processes used in the hierarchy %%%
find_all_solutions(APs,list(member,Associations,(_,APs)),All_APs),
list(flatten&sort,All_APs,Actions_or_processes),

%%% Make a column for each action or process. Indicate with an 'x' %%%
%%% where it is associated with an object or a blank otherwise.    %%%
find_all_solutions(Column,
   (  % choose each action or process in turn
      list(member,Actions_or_processes,Item),
      % make a column of entries for this item
      find_all_solutions(Entry,
         ( list(member,Hierarchy_objects,Object),
           list(member,Associations,(Object,Items)),
           if list(member,Items,Item) then Entry = 'x' else Entry = ''
         ), Column)
   ),Columns),
             
 %%% Collate information for the table %%%
if Choice=action then Prefix='Actions ' else Prefix='Processes ',
list(concatenate,[Prefix,'associated with the objects in the hierarchy ''',Selected_hierarchy,''''],Title),
Header      = ['OBJECTS' | Actions_or_processes],
All_columns = [Hierarchy_objects | Columns],

%%% Display the table %%%
if Actions_or_processes = []
then ( show('No '), show(Prefix), show('in the hierarchy.'),show(nl))
else tabulate_data(Title,_,_,Header,All_columns). `};

macro["hierarchical_objects_diagram/0"] = {
applies_to: `Single Kb`,
description: `
This tool is designed to display information about hierarchical objects in the form of a diagram.
Diagrams for hierarchical objects from different hierarchies and knowledge bases can be created and grouped together for comparison purposes.

The user is asked to choose a knowledge base, one or more hierarchies in that knowledge base and an object for investigation.
The tool finds all the statements directly about the object plus all the statements that the object can inherit from its ancestors within the hierarchie(s).
Because inherited statements are 'virtual statements' that are deduced from more general knowledge base statements, they cannot be displayed directly using the normal diagram mechanism.
This tool dynamically creates a special knowledge base called 'hierarchic_diagrams.kb' and populates it with sufficient information about the object and its ancestors so that an accurate hierarchic representation can be made.
In the diagram nodes the name of the hierarchic object is substituted for that of its ancestor objects.
Once the diagram is drawn a reduced number of the diagram buttons are enabled for manipulating the diagram.

The tool allows the user to build up a number of diagrams for different objects if required.
However the user is first asked if they wish to delete the existing 'hierarchic_diagrams.kb' and create a new 'hierarchic_diagrams.kb' before adding any more diagrams.

NOTE. A copy of all the diagrams created within the special knowledge base 'hierarchic_diagrams.kb' can be preserved by saving the knowledge base and later re-loading it.
However it is important to remember that only sufficient information is saved for drawing the diagrams, there is no information about the sources, formal terms, synonyms etc.

NOTE. After finishing with the 'hierarchical_objects_diagram' tool, the current knowledge base will still be 'hierarchic_diagrams.kb'.
The user has the choice of 
 - Saving 'hierarchic_diagrams.kb' 
 - Deleting 'hierarchic_diagrams.kb'
 - Switching to another knowledge base. `,
head: `hierarchical_objects_diagram`,
body: `
%%% Select the knowledge base %%%

knowledge_base(list,All_KBs),
list(remove,All_KBs,hierarchic_diagrams,Left),
list(select,Left,'Please choose a knowledge base',Kb),

%%% Choose one or more hierarchies in selected Kb %%%

knowledge_base(hierarchies,Kb,Kb_Hierarchies),	
list(multiple_select,[all|Kb_Hierarchies],'Please choose one or more hierarchies',Response),
if Response=[all] then Hierarchies=Kb_Hierarchies else Hierarchies=Response,

%%% Choose a hierarchic object %%%

find_all_solutions(List_of_objects,
     (  list(member,Hierarchies,Hierarchy),
        hierarchy_objects(Kb,Hierarchy,objects,_,List_of_objects)
     ), All_Objects ),
list(flatten&sort,All_Objects,Objects),
list(select,Objects,'Please choose an object',Object),

%%% Check if the 'hierarchic_diagrams' knowledge base is already open %%%

knowledge_base(list,KBs),
Question='Add a new diagram to existing hierarchical diagrams OR delete the old diagrams first ?',
if list(member,KBs,hierarchic_diagrams)
  then ( list(select,[add,clear],Question,Answer),
         if Answer=clear  then ( knowledge_base(close,hierarchic_diagrams),
                                 knowledge_base(new,hierarchic_diagrams)
                               ),
         if Answer=add then knowledge_base(select,hierarchic_diagrams)
	 )
  else knowledge_base(new,hierarchic_diagrams),

%%% Get object and derived statements from chosen Hierarchies %%%

find_all_solutions([Formal,Derived],
     (  list(member,Hierarchies,Hierarchy),
	  % object statements
	  statements_search(Kb,Object,Hierarchy,object,all,Ids),
	  statements_convert(formal,Kb,Ids,Formal),
	  % derived statements
	  derived_statements(Kb,Hierarchy,Object,Derived)
     ),All_Statements),
list(flatten&sort,All_Statements,Formal_statements),

%%% create Kb statement for each formal statement unless already exists %%%

create_hierarchical_statements(Formal_statements,Ids),
list(length,Ids,Total),

%%% draw the diagram %%%

show(diagram,Ids,Drawn),

%%% display relevant information %%%

list(concatenate,['Selected object      = ',Object,''''],Message1),
show(Message1), show(nl), show(nl),

show('Selected hierarchies ='), show(nl),
show(tab,Hierarchies),          show(nl),

list(concatenate,['There are ',Total,' hierarchical statements about ''',Object,''''],Message2),
show(Message2), show(nl), show(nl),

if Total \= Drawn
then ( list(concatenate,[Drawn,' of the ',Total,' hierarchic statements have been drawn on the diagram.'],Message3),
       show(Message3), show(nl),
       show('The remainder can be seen by selecting KB/Statements'), show(nl)
     ). `};

macro["inconsistent_attribute_statements/0"] = {
applies_to: `Single Kb`,
description: `Tests whether attribute and value information about objects related to one another in an object hierarchy are contradictory.
eg:	If within an object hierarchy oak is a sub object of tree then the following statements
would be inconsistent :	att_value(tree,leaf_colour,green)
			att_value(oak, leaf_colour,yellow)`,
head: `inconsistent_attribute_statements`,
body: `
% Select the knowledge base
knowledge_base(select,Kb),
list(concatenate,['Kb =  ',Kb,'~M~J~M~J'],Msg),
show(Msg),

% get all the attribute statements
statements_of_type(Kb,attribute,AttributeStatements),

find_all_solutions( (att_value(Object1,A,Value1),att_value(Object2,A,Value2)),
    (	% extract a pair of statements with identical attributes
	list(pair,AttributeStatements,(att_value(Object1,A,Value1),att_value(Object2,A,Value2))),

	% Their values are different
	test(not_equal,Value1,Value2),

      (   % identical objects and attributes but different values
	    test(equal,Object1,Object2) ; 

          % different objects from the same hierarchy
	    hierarchy_objects(Kb,Hierarchy,objects,_,Objects),
	    list(member,Objects,Object1),
	    list(member,Objects,Object2),

	    % if either object is a descendant of the other then there is a potential contradiction
	    (  hierarchy_objects(Kb,Hierarchy,descendants,Object1,Descendants1),
             list(member,Descendants1,Object2)
	       ;
	       hierarchy_objects(Kb,Hierarchy,descendants,Object2,Descendants2),
             list(member,Descendants2,Object1)
  	    )
       )
    ),Solutions),
list(sort,Solutions,Statements),

if Statements=[]
then ( show('No inconsistent attribute statements detected'))
else ( show('Pairs of attribute statements that are inconsistent'),
       foreach (S1,S2) in Statements do
	    ( statements_convert(numbered,Kb,S1,C1),
	      statements_convert(numbered,Kb,S2,C2),
	      show(C1), nl, show(C2), nl, nl
	    )
     ). `};

macro["inconsistent_causal_statements/1"] = {
applies_to: `Single Kb`,
description: `Identifies possible contradictory causal statements in the knowledge base.
ie: two statements having a common Cause but their Effects are inconsistent.

Possible valid reasons for inconsistency could be
 * Conditions associated with the statements
 * User has used different values with a similar meaning
 * User has used values with a slightly different spelling.
 * Different type of causal statement (causes1way or causes2way)`,
head: `inconsistent_causal_statements(Kb)`,
body: `statements_of_type(Kb,causal,CausalStatements),
find_all_solutions( (Stt1,Stt2),
       (	
	% get pair of NON identical statements
	list(pair,CausalStatements,(Stt1,Stt2)),
	Stt1 \= Stt2,

	% have both statements identical causes ?
	statements_components(Stt1,cause,Cause),
	statements_components(Stt2,cause,Cause),

	% uninitialise Value in second statement
	statements_of_type([Stt2],no_values,[Stt2NoValue]),

	% get first statement's effect
	statements_components(Stt1,effect,Effect),

	% has second statement same effect but with different value ?
	statements_components(Stt2NoValue,effect,Effect)

       ), Stts),

% print results
if test(not_equal,Stts,[])
then	foreach (Stt1,Stt2) in Stts
	do  (	show(nl),
		statements_convert(numbered,Kb,Stt1,Tr1),
		statements_convert(numbered,Kb,Stt2,Tr2),
		show('The statement '), show(Tr1),
		show(' may be inconsistent with the statement '),
		show(nl),show('              '),show(Tr2),show(nl)
	    )
else ( show(nl),show('No inconsistent causal statements in the Kb.'),show(nl)). `};

macro["interactions_amongst_formal_terms/0"] = {
applies_to: `Single Kb`,
description: `
[ This tool has been produced as part of the CAFNET projects (Europe Aid 
ENV/2006/114-382/TPS) with the financial assistance of the European 
Union and the coordination of CIRAD. The contents of this tool are the 
sole responsibility of UWB and can under no circumstances be regarded as 
reflecting the position of the European Union. ]
`,
head: `interactions_amongst_formal_terms`,
body: `
%%% Choose KB %%%
knowledge_base(select,Kb),

%%% Tell user where we are in the tool %%%
Message_1 = 'About to input object/synonym information for the COLUMNS',
message(Message_1),

%%% Get objects/synonyms for the first/second columns of the table %%%
get_components(Kb,Y_Objects,Y_Synonyms),

%%% Tell user where we are in the tool %%%
Message_2 = 'About to input object/synonym information for the ROWS',
message(Message_2),

%%% Get objects/synonyms for the first/second rows of the table %%%
get_components(Kb,X_Objects,X_Synonyms),

%%% Find all the interactions between the objects %%%
%%% Each interaction=(Yobject,Xobject,Statements,No.of statements) %%%
get_interactions(Kb,Y_Objects,X_Objects,Interactions),

%%% Filter out the number of interactions between object pairs %%%
find_all_solutions(Ns,
    ( list(member,Interactions,Entry),
      find_all_solutions(N,
          ( list(member,Entry,(_,_,_,N))
          ),Ns)
    ),All_Rows),

%%% Produce the tabular output %%%
convert_columns_to_rows(All_Rows,Columns),
list(append,[Y_Objects,Y_Synonyms],Columns,Data),

Title  = 'Interactions between objects.',
Header1 = ['COMPONENTS','OBJECTS'|X_Objects],
Header2 = ['OBJECTS','SYNONYMS'|X_Synonyms],

tabulate_data(Title,_,[12,12|_],Header1,[]),
tabulate_data('',_,   [12,12|_],Header2,[]),
tabulate_data('',_,   [12,12|_],_,Data),

%%% Filter out the statements for interactions between %%%
%%% object pairs and list them in the tool output.     %%%
find_all_solutions(_,
    ( list(member,Interactions,Interaction),
      find_all_solutions(_,
          ( list(member,Interaction,(Y,X,IDs,_)),
		% don't print statements about identical objects
		X \= Y,
            % ignore objects without interactions
            IDs \= [],
            list(concatenate,['Statements in which ',Y,' interact with ',X],Message_3),
            show(nl),show(Message_3),show(nl),
            statements_convert(formal,Kb,IDs,Formal),
            statements_convert(numbered,Kb,Formal,Statements),
            find_all_solutions(_,
                ( list(member,Statements,Statement),
                  show(Statement), show(nl)
                ),_)
          ),_)
    ),_). `};

macro["isolated_attribute_statements/0"] = {
applies_to: `Single Kb`,
description: `This tool finds any attribute statements that are not related to the causal statements.
(ie: attribute statements whose object/attribute pairs do not occur in the causal statements)
This may indicate that these attribute statements are not particularly useful.

If any of the attribute statements have objects whose hierarchic ancestors are used with the same attribute within the causal statements, then they are considered to be related to the causal statement.
NOTE.  Attribute statements whose object term has one of the forms
process(Object,Process) or action(Action,Object) are included in the analysis.
Any other forms of the object term are not included.  eg: part(Object,Part) or process(Object1,Process,Objectj2)`,
head: `isolated_attribute_statements`,
body: `
%%% Select the knowledge base %%%

Message1 = 'Please select the knowledge base to be analysed',
knowledge_base(list,KBs),
list(select,KBs,Message1,Kb),
list(concatenate,['Selected knowledge base : ''',Kb,''''],Selected),
show(Selected),show(nl),show(nl),

%%% Find all the attribute statements in the knowledge base %%%

statements_of_type(Kb,attribute,Attribute_statements),

%%% Find all the object/attribute pairs in the causal statements %%%

get_nodes(Kb,causal,Causal_nodes),
formal_terms(Causal_nodes,object/attribute,All_causal_pairs),

%%% Get attribute statements whose object/attribute pairs %%%
%%% are not used directly in the Causal statements        %%%

find_all_solutions(Statement,
     ( list(member, Attribute_statements,Statement),
       ( Statement=att_value(O,A,_) or Statement=if(att_value(O,A,_),C) ),
       formal_terms(att_value(O,A,_),object/attribute,[Object/Attribute]),
       list(member,All_causal_pairs,Object/Attribute)
     ), Used),
list_comparison(disjoint,[Attribute_statements,Used],[Unused_attribute_statements,_]),

%%% Determine which of the remaining attribute statements have objects whose hierarchic %%%
%%% ancestors possess the same attribute and are used in the causal statements.         %%%

find_all_solutions( Statement,
     ( list(member,Unused_attribute_statements,Statement),
       ( Statement=att_value(O,A,_) or Statement=if(att_value(O,A,_),C) ),
       formal_terms(att_value(O,A,_),object/attribute,[Object/Attribute]),
       hierarchy_objects(Kb,_,ancestors,Object,Ancestors),
	 list(member,Ancestors,Ancestor),
	 list(member,All_causal_pairs,Ancestor/Attribute)
     ), Ancestor_statements ),
list_comparison(disjoint,[Unused_attribute_statements,Ancestor_statements],[Non_ancestor_statements,_]),

%%% Produce list of numerically ordered natural language statements %%%

statements_convert(numbered,Kb,Non_ancestor_statements,Numbered),

%%% Display results %%%

MsgA = 'All attribute statement object/attribute pairs are used in the causal statements.',
MsgB = 'Attribute statements with object/attribute pairs not used in the causal statements.',

if test(equal,Numbered,[]) then show(MsgA) else (show(MsgB), show(nl), show(tab,Numbered)),
show(nl). `};

macro["isolated_causal_statements/1"] = {
applies_to: `Single Kb`,
description: `Finds those causal statements that are not connected either through their cause or effect to any other causal statements;   they are, therefore, of limited value .`,
head: `isolated_causal_statements(Kb)`,
body: `
% find all the nodes without a Cause
get_nodes(Kb,starts,Starts),

% find all the nodes without an Effect
get_nodes(Kb,ends,Ends),

% find all statements with their Cause/Effect nodes members of Starts/Ends
find_all_solutions((Id,Cause,Effect),
	( sentence(Id,Kb,formal(F(A,B),Objects),_,causal),
	  instantiate(Objects),
	  (   F = if,         A = Causal(Cause ,Effect) ;
	      F = causes1way, A = Cause, B = Effect ;
	      F = causes2way, A = Cause, B = Effect 
	  ),
	  list(member,Starts,Cause), list(member,Ends,Effect)
	),Ids),
list(sort,Ids,Sorted_nodes),

% find statements whose Cause/Effect nodes are unique
find_all_solutions(Id,
	( list(member,Sorted_nodes,(Id,Cause,Effect)),
	  list(remove,Sorted_nodes,(Id,Cause,Effect),Left),
	  findall([C,E],list(member,Left,(_,C,E)),Remaining),
	  list(flatten&sort,Remaining,Nodes),
	  findall(NodeS,(list(member,Nodes,Node),strip_value(Node,NodeS)),Stripped),
	  list(not_member,Stripped,Cause),list(not_member,Stripped,Effect)
   ),IsolatedStatements),

list(length,IsolatedStatements,N),
list(concatenate,['There are ',N,' isolated causal statements in the Kb.'],Msg),

% display a diagram showing isolated statements if requested.
if N > 0 then list(select,[yes,no],'Do you want a diagram showing isolated statements ?',Ans),
if Ans = yes then show(diagram,IsolatedStatements,Drawn),

statements_convert(numbered,Kb,IsolatedStatements,Numbered),
show(Msg), show(nl), show(Numbered). `};

macro["knowledge_base_report/0"] = {
applies_to: `Single Kb`,
description: `Produce a report outlining the major characteristics of a knowledge base.

Tables are produced summarising :

 - Number of statements of each statement type 

 - Number and types of formal terms

 - Number of synonyms in the knowledge base

There are a number of user selectable options which can be included in the report :

 - The object hierarchies defined in the knowledge base and the
   number of statements about objects contained in each hierarchy

 - Information about the number of statements that exist for each knowledge base topic

 - A table summarising the number of statements that are about the topics defined in a topic hierarchy.
   ( NOTE : this option will take a few minutes longer to run;  time depends on
     the number of topic hierarchies and the number of topics within each hierarchy )

 - Information about the number of statements attributed to each knowledge base source

 - A table summarising the number of derived statements that
   can be deduced using the inheritance properties of an object hierarchy
   ( NOTE : this option will take a few minutes longer to run;  time depends on
     the number of hierarchies and the number of objects within each hierarchy )
`,
head: `knowledge_base_report`,
body: `
%%% Select the knowledge base %%%

knowledge_base(list,KBs),
list(select,KBs,'Please select a knowledge base',Kb),

%%%%%%%%%%%%%%% Choose options %%%%%%%%%%%%%%%

Options = [derived_statements, derivations, object_hierarchies,
	     knowledge_categories,sources, topic_hierarchies, topic_statements],
ChoiceMessage = 'Choose optional items: some may take a few minutes to run with larger knowledge bases',
list(options,Options,ChoiceMessage,Choices),

%----- Run the statements_summary knowledge evaluation tool -----

statements_summary(Kb),

%----- Find the node with most causal links to other nodes -----

get_nodes(Kb,most,Information),

if Information = Node/Number
then ( list(concatenate,['Node with most causal links in the ''',Kb,''' knowledge base is~M~J''',Node,''' with ',Number,' occurrences.~M~J'],Msg),
       show(Msg)
     ),
show(nl),

%----- Formal terms ----- 

FT_types = [all,action,attribute,comparison,link,object,process,value],
find_all_solutions(N,( list(member,FT_types,Type),
                       formal_terms(Kb,Type,Terms),
                       list(length,Terms,N)
                     ), FT_numbers),

% display the formal terms table
list(concatenate,['Formal term usage within the ''',Kb,''' knowledge base.'],FT_title),
FT_headings     = ['Type','Number of formal terms'],
FT_tabular_data = [FT_types|[FT_numbers]],
tabulate_data(FT_title,_,_,FT_headings,FT_tabular_data),

%----- Synonym information  -----

knowledge_base(synonyms,Kb,Synonyms),
list(length,Synonyms,No_of_synonyms),
list(concatenate,['%%%%% ', No_of_synonyms,' synonyms are used in the ''',Kb,''' knowledge base %%%%%~M~J'],MsgS),
show(MsgS),show(nl),

%%%%%%%%%% display number of statements about each object hierarchy %%%%%%%%%%

if list(member,Choices,object_hierarchies) then object_hierarchy_report(Kb),

%%%%%%%%%% display topic statements information %%%%%%%%%% 

if list(member,Choices,topic_statements) then 
(  knowledge_base(topics,Kb,Topics),
   % find the number of statements and search string for each topic
   find_all_solutions( N/Searchstring,
        ( list(member,Topics,Topic),
          topic_statements(Kb,Topic,Statements),
          list(length,Statements,N),
          topic(Kb,Topic,_,Searchstring,_)
        ), Topics_Info),
   find_all_solutions(N,list(member,Topics_Info,N/_),Topic_statements_count),
   find_all_solutions(String,list(member,Topics_Info,_/String),Topic_search_strings),

   % display topics information
   if Topics = []
      then ( list(concatenate,['There are no topics in the ''',Kb,''' knowledge base~M~J'],MsgT),
             show(MsgT), show(nl)
           )
      else ( list(concatenate,['Topic statements in the ''',Kb,''' knowledge base.'],Topics_title),
             Topics_headings     = ['Topic','Statements','Topic search string'],
             Topics_tabular_data = [Topics,Topic_statements_count,Topic_search_strings],
             tabulate_data(Topics_title,_,[25,10,_],Topics_headings,Topics_tabular_data)
           )
),

%%%%%%%%%% Display knowledge categories information %%%%%%%%%%

if list(member,Choices,knowledge_categories) then 
(  knowledgeCategories(Kb,Categories),
   if Categories=[]
      then ( list(concatenate,['No knowledge categories in ',Kb,' knowledge base'],Categories_msg),
             show(Categories_msg), show(nl)
           )
      else ( find_all_solutions(StatementsString,
			( member(Category,Categories),
			  topic(Kb,Category,_,StatementsString,_)
                 ), KC_statements),
             list(concatenate,['Knowledge Category statements in ''',Kb,''' knowledge base'],KC_title),
             KC_tabular_data = [Categories,KC_statements],
             KC_headings     = ['Knowledge Category','Statements'],
             tabulate_data(KC_title,_,_,KC_headings,KC_tabular_data)
           )
),

%%%%%%%%%% display topic hierarchy information %%%%%%%%%% 

if list(member,Choices,topic_hierarchies) then 
(  knowledge_base(topic_hierarchies,Kb,Topic_hierarchies),
   if Topic_hierarchies = []
      then ( list(concatenate,['There are no topic hierarchies in the ''',Kb,''' knowledge base~M~J'],MsgTH),
             show(MsgTH), show(nl)
           )
      else ( find_all_solutions( N,
                (   list(member,Topic_hierarchies,Hierarchy),
                    topic_hierarchy_statements(Kb,Hierarchy,Statement_Ids),
		        list(length,Statement_Ids,N)
                 ), Topic_H_counts ),
             list(concatenate,['Topic hierarchy statements in the ''',Kb,''' knowledge base.'],Topics_H_title),
             Topics_H_headings     = ['Topic Hierarchy','Number of statements'],
             Topics_H_tabular_data = [Topic_hierarchies,Topic_H_counts],
             tabulate_data(Topics_H_title,_,_,Topics_H_headings,Topics_H_tabular_data)
           )
),

%%%%%%%%%% display source information %%%%%%%%%% 

if list(member,Choices,sources) then 
(  source_list(Kb,all,Sources),
   find_all_solutions( Type/N,
        ( list(member,Sources,Source),
          source_details(Kb,Source,type,[Type]),
	    convert(source,Source,String),
	    statements_search(Kb,String,_,object,all,Statements),
	    list(length,Statements,N)
        ), Sources_Info),
   find_all_solutions(Type,list(member,Sources_Info,Type/_),Source_types),
   find_all_solutions(N,   list(member,Sources_Info,_/N),Source_statements_count),

   % display the sources table

   list(concatenate,['Sources and associated statements in the ''',Kb,''' knowledge base.'],Sources_title),
   Sources_headings     = ['Source', 'Type', 'Statements'],
   Sources_tabular_data = [Sources,Source_types,Source_statements_count],
   tabulate_data(Sources_title,_,[_,12,12],Sources_headings,Sources_tabular_data)
),

%%%%%%%%%% display derived_statements information %%%%%%%%%% 

if list(member,Choices,derived_statements) then derived_statements_summary(Kb),

%%%%%%%%%% display derivation information %%%%%%%%%% 

if list(member,Choices,derivations) then 
   (  derivations_in_Kb(Kb,Derivations),
      find_all_solutions([Deriv,Length,Ids],
          ( list(member,Derivations,Deriv),
     	      find_all_solutions(Id,
                ( sentence(Id,Kb,_,_(Kb,_(St_sources)),_),
		      list(member,St_sources,_/Deriv)
		    ),List),
	      list(sort,List,Ids),
	      list(length,Ids,Length)
          ),Rows),
      convert_columns_to_rows(Rows,Columns),
      list(concatenate,['List of ''derivation'' usage in the ''',Kb,''' knowledge base.'],Derivations_title),
      Derivations_header = ['DERIVATION','USAGE','STATEMENTS'],
      tabulate_data(Derivations_title,_,[12,8|_],Derivations_header,Columns)
   ),

%%% Find and delete any duplicate formal term definitions %%%

formal_terms(Kb,_,ATerms),
findall( formal_term(Kb,FTerm,FType,FDef,FSyns),
	( member(FTerm,ATerms),
	  formal_term(Kb,FTerm,FType,FDef,FSyns),
	  clause(formal_term(Kb,FTerm,FType,_,_),true,P1),
	  clause(formal_term(Kb,FTerm,FType,_,_),true,P2),
	  P1 \= P2
      ),FTermDefinitions),
list(sort,FTermDefinitions,SortedFTermDefinitions),

find_all_solutions(FTerm,
	( member(formal_term(Kb,FTerm,FType,FDef,FSyns),SortedFTermDefinitions),
	  retractall(formal_term(Kb,FTerm,FType,_,_)),
	  assert(formal_term(Kb,FTerm,FType,FDef,FSyns))
      ),UpdatedFTerms),
list(sort,UpdatedFTerms,SortedUpdatedFTerms),

if SortedUpdatedFTerms\= []
then ( show('The following formal terms had duplicate definitions'),
       show(nl), show(SortedUpdatedFTerms),
	 show('The duplicates have been deleted; please save your knowledge base.'), show(nl)
     ),

%%% Find and delete any duplicate subobject definitions %%%

formal_terms(Kb,object,AObjects),
findall(subobject(Kb,Hierarchy,Super,SObject),
	( member(SObject,AObjects),
	  subobject(Kb,Hierarchy,Super,SObject),
	  clauses(subobject(Kb,Hierarchy,Super,SObject),Facts),
	  length(Facts,N),
        N > 1
      ),SubDefinitions),
list(sort,SubDefinitions,SortedDefinitions),
find_all_solutions(SObject,
	( member(subobject(Kb,Hierarchy,Super,SObject),SortedDefinitions),
	  retractall(subobject(Kb,Hierarchy,Super,SObject)),
	  assert(subobject(Kb,Hierarchy,Super,SObject))
      ),Updated),
list(sort,Updated,UpdatedObjects),

if UpdatedObjects \= []
then ( show('The following terms had duplicate subobject definitions'),
       show(nl), show(UpdatedObjects),
	 show('The duplicates have been deleted; please save your knowledge base.'), show(nl)
     ). `};

macro["merge_knowledge_bases/0"] = {
applies_to: `General`,
description: `Merge TWO or more knowledge bases into ONE knowledge base.
The knowledge bases to be merged should already be loaded into AKT5.

AKT5 will ask for the name of the knowledge base into which you wish to merge the terms.
You can chose an existing knowledge base (that is already loaded) or ask AKT5 to create a new knowledge base for you; the chosen Kb will become the current knowledge base. 
If you select an existing knowledge base then choosing options such as 'object hierarchies' and 'topics' will merge these items and append them to the selected knowledge base.

AKT5 will now ask you to choose one or more merging options.
Choose option 'default' to transfer formal terms, statements, sources and memos.
Choose option 'formal terms only' if you are only interested in the formal terms.
Choose option 'object hierarchies' to transfer any unique object hierarchies;
               ie: only hierarchies that contain objects unique to one knowledge base.
              [ The majority of hierarchies will not be merged. This is because it is
                likely that the KBs to be merged will contain knowledge on related items.
                The same object name may well have been used in two or more KBs,
                but there is no guarantee that the knowledge base compiler was using
                the name to describe objects with identical properties.
              ]
Choose option 'topics' to transfer any unique topics; ie: topic names that exist in only one Kb.
              [ A topic represents a boolean search string which may include objects
                within it's search string. The topic definition specifies how an object
                is treated during a search, ie: whether it's subobjects and/or superobjects
                are included in the search. If either a 'subobject' or 'superobject' is
                included in the topic definition then the topic may be dependant on
                one or more object hiearchies for a complete listing of its related
                statements. It is recommended that the user merges any 'object hierarchies'
                BEFORE merging any topics.
              ]

NOTE: The new (merged) file can subsequently be used as an input file and merged with further knowledge bases to build up a more comprehensive body of knowledge.

It is recommended that the user saves a copy of a newly merged file immediately after running the tool`,
head: `merge_knowledge_bases`,
body: `
Message1 = 'Are all the knowledge bases to be merged already loaded ?',
message_box(yesno,Message1,yes),

% Choose the Kbs to be merged
loaded_kbs(Loaded), length(Loaded,N), N > 1,
if N=2 then ToBeMerged = Loaded
	 else list(options,Loaded,'Choose KBs to be merged (two or more)',ToBeMerged),

% Choose a Kb for the merger output
findall(Kb,(member(Kb,Loaded), \= member(Kb,ToBeMerged)),Left),
if Left = []
then   new_kb
else ( Message2 = 'Create a new Kb or use a loaded Kb for merger results',
	 list(select,['Create_new Kb'|Left],Message2,Reply),
	 if Reply='Create_new Kb' then new_kb else selectKb(Reply)
	),

% Select options
list(options,['default','formal terms only','object hierarchies',topics],'Choose one or more merging options',Options),

% merge the Kbs
currently_selected_kb(Merged_Kb),
merge_options(ToBeMerged,Merged_Kb,Options),

% update memos menu status
update_memo_menu_items(Merged_Kb),

message_box(ok,'Knowledge Bases merged.',_). `};

macro["object_attribute_analysis/0"] = {
applies_to: `Single Kb`,
description: `This tool will display comprehensive information about the attributes and values
of knowledge base objects.

The user is first asked to choose one or more knowledge base objects.

Then the user is asked to choose from a number of options :

   - 'Include Causal statements.'
      Allows the user to restrict the search to attribute statements
      or extend the search to include causal statements.

   - 'Include inherited attributes.'
      Will extend the search to include attributes inherited by the
      selected objects from their superobjects within any of the
      object hierarchies.

   - 'Include other objects which share attributes with selected objects.'
      It is useful to know if there are any unrelated objects within
      a knowledge base that have the same attributes as the selected objects.

   - 'Show attribute definitions and statements using them.'
      This option extends the table to show the complete Object/Attribute/Value
      definitions from which the attribute is extracted. A further column
      lists all the statements that contain the definition.

There can be a lot of duplication of information within a table so the tool
allows the user to restrict the output as follows.

   - Unless the user chooses the option
     'Show attribute definitions and statements using them.'
     the tool will automatically remove any duplication of information
     and will compact the rows as far as possible.

   - The tool will list all the values that can appear in the table and
     then ask the user if any should be excluded from the table.
     Quite often values such as 'increase' or 'decrease' are not particularly
     useful in a table.

The tool will display a list of the selected objects above the table.

If the 'superobjects option' is chosen it will display, below the table, 
the structure of all the object hierarchies that contain an instance of
one of the selected objects.

The tabular output is best displayed by using the option to send the output
to Microsoft Excel.
`,
head: `object_attribute_analysis`,
body: `
% select Kb
kb_function(select,Kb),

% Choose from a list of the knowledge base objects.
formal_terms(Kb,object,All_objects),
list(multiple_select,All_objects,'Choose one or more objects',Objects),

% Get any SUPEROBJECTS of selected objects.
find_all_solutions( Ancestors,
	( list(member,Objects,Object),
	  hierarchy_objects(Kb,_,ancestors,Object,Ancestors),
	  Ancestors \= []
	), Supers),
list(flatten&sort,Supers,Superobjects),

% Choose options for displaying attribute table
Button1 = 'Include Causal statements.',
Button2 = 'Include inherited attributes.',
Button3 = 'Include other objects which share attributes with selected objects.',
Button4 = 'Show attribute definitions and statements using them.',
if Superobjects = []
   then Questions = [Button1,Button3,Button4]
   else Questions = [Button1,Button2,Button3,Button4],
Prompt = 'Select options to be included in Object - Attribute table.',
options(Prompt,Questions,Choices),

% Check if causal statements are to be included
if member('Include Causal statements.',Choices)
then ( TypeA = all_attributes,       TypeDAV = all_OAVs )
else ( TypeA = attribute_attributes, TypeDAV = attribute_OAVs ),

%  Get attributes for selected objects plus any inherited attributes
%""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

% Make a list of attributes for selected objects
find_all_solutions(Atts,
	( list(member,Objects,Object),
	  formal_term(Kb,Object,TypeA,Atts)
	),Atts1),
list(flatten&sort,[Atts1],Attributes1),

% Make a list of attributes for any of their superobjects
if member('Include inherited attributes.',Choices)
then ( find_all_solutions(Atts,
          ( list(member,Superobjects,Object),
	      formal_term(Kb,Object,TypeA,Atts)
          ),Atts_list),
	 list(flatten&sort,[Atts_list],Attributes2)
	)
else Attributes2 = [],

% Complete list of attributes
list(flatten&sort,[Attributes1,Attributes2],Attributes3),

if Attributes3=[] then ( message_box(ok,'There are no attributes available for selected object(s)',_),!,fail),

% Choose which attributes are to be included in the table
if Attributes3 = [_]
then Attributes = Attributes3
else ( list(multiple_select,['All'|Attributes3],'Choose one, more or all attributes',Selected_attributes),
	 ( if list(member,Selected_attributes,'All')
	   then Attributes = Attributes3 else Attributes = Selected_attributes
	 )
     ),

%   Get the O/A/V/D/S structures for relevant objects
%"""""""""""""""""""""""""""""""""""""""""""""""""""""

% List of structures for selected objects (Ob/Att/Val/Def/Stt)
find_object_structures(Kb,TypeDAV,Objects,Attributes,Selected_structures),

% List of structures for superobjects (names changed to subobject)
find_superobject_structures(Kb,TypeDAV,Objects,Attributes,SuperStructures),

if member('Include other objects which share attributes with selected objects.',Choices)
then ( % Find any other Kb objects that share these attributes.
	   append(Objects,Superobjects,Ios), sort(Ios,Exclude),
	   objects_with_same_attribute(Kb,Attributes,TypeA,Exclude,Discovered),
	 % Get structures for discovered objects
	   find_object_structures(Kb,TypeDAV,Discovered,Attributes,Discovered_structures)
     )
else   Discovered_structures = [],
list(flatten&sort,[Selected_structures,SuperStructures,Discovered_structures],All_Structures),

% Exclude unwanted 'Values'
exclude_values(All_Structures,Structures),

% Prefix attribute names if more than one object shares an attribute
%""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

% Add 'object name' prefix to an attribute if shared by more than one selected object.
prefixed_attributes(Attributes,Structures,Prefixed),

% Update 'Structures' list with prefixed attribute names
update_attribute_names(Structures,Updated_structures,Prefixed),

% Collect all the rows of attribute information in a form for tabulation
append(['Object'|Prefixed],['Definition','Statements'],Column_names),
make_attribute_columns(Objects,Updated_structures,Column_names,Unfiltered_columns),

% Include Definitions and Statement lists
if member('Show attribute definitions and statements using them.',Choices)
then ( append(['Object'|Prefixed],['Definitions','Statements'],Headings),
	 Columns = Unfiltered_columns
     )
else ( reduce_number_of_rows_to_a_minimum(Objects,Unfiltered_columns,Filtered_columns),
	 Headings = ['Object'|Prefixed], append(Columns,[_,_],Filtered_columns)
     ),

if member('Include Causal statements.',Choices)
then Title ='Attribute/Value table (attribute and causal statements)'
else Title ='Attribute/Value table (attribute statements)',

% Display list of selected objects.
show('SELECTED OBJECTS :'), show(nl), show(Objects),show(nl),

% Display the selected objects table
if Attributes3 = []
then show('There are no attribute definitions for the selected object(s)~M~J')
else tabulate_data(Title,_,_,Headings,Columns),

% Display any 'Superobjects' or 'Subobjects' of chosen objects
%""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""""

% Display any Object hierarchies that contain the selected objects
find_all_solutions(Hs,
	( list(member,Objects,Object),
	  find_all_solutions(H,(subobject(Kb,H,Object,_);subobject(Kb,H,_,Object)),Hs)
	),HList), list(flatten&sort,HList,Hierarchies),

% display structure of relevant object hierarchies.
find_all_solutions(Hs,
	( list(member,Objects,Object),
	  find_all_solutions(H,(subobject(Kb,H,Object,_);subobject(Kb,H,_,Object)),Hs)
	),HList), list(flatten&sort,HList,Hierarchies),
if Hierarchies \= []
then ( show('OBJECT HIERARCHIES that contain an instance of a selected object.'),
       print_object_hierarchies_layout(Kb,Hierarchies),
       show(nl)
     ).
`};

macro["object_hierarchy_report/1"] = {
applies_to: `Single Kb`,
description: `Enables the user to choose an object hierarchy and produce a table which displays~M~Jhow many statements there are about the objects in the hierarchy.`,
head: `object_hierarchy_report(Kb)`,
body: `
%%% Find all the object hierarchies in knowledge base %%%
knowledge_base(hierarchies,Kb,Hierarchies),

% Select hierarchy
list(select,[all|Hierarchies],'Choose a hierachy',Selected),

% Assemble data
if Selected = all then
     ( % get number of statements for each hierarchy
       find_all_solutions([Hierarchy,N],
	      ( list(member,Hierarchies,Hierarchy),
  	        hierarchy_information(statements,Kb,Hierarchy,_,Statements),
  	        list(length,Statements,N)
            ), Rows ),
       Headings = ['Object hierarchy','Number of statements'],
       Title    = 'Number of statements about all the objects within each hierarchy.'
     )
else ( % get list of objects within the hierarchy
	 hierarchy_objects(Kb,Selected,ordered, _,Objects),
	 % get number of statements for each object and its subobjects
       find_all_solutions([Object,N1,N2],
	      ( list(member,Objects,Object),
              statements_search(Kb,Object,_,object,all,ObS),
  	        list(length,ObS,N1),
              statements_search(Kb,Object,_,subobjects,all,SubObs),
  	        list(length,SubObs,N2)
            ), Rows ),
       Headings = ['Object','Object statements','Subobjects statements'],
	 list(concatenate,['Number of statements about the objects within the ''',Selected,''' hierarchy.'],Title)
     ),
convert_columns_to_rows(Rows,Columns),

%%% Display the table %%%
if test(not_equal,Hierarchies,[])
 then tabulate_data(Title,_,_,Headings,Columns)
 else show('There are no object hierarchies in the selected knowledge bases.'). `};

macro["objects_and_parts_information/0"] = {
applies_to: `Single Kb`,
description: `Supplies details of the objects and statements in a selected knowledge base that contain the expression 'part(Object,Part)'`,
head: `objects_and_parts_information`,
body: `
% Choose a knowledge base if more than one loaded
knowledge_base(select,Kb),

% find all the objects that contain parts
objects_with_parts(Kb,Objects_with_Parts),
list(length,Objects_with_Parts,N1),

% Find the parts for each object
find_all_solutions(Parts,
      ( list(member,Objects_with_Parts,Object),
        object_parts(Kb,Object,Parts)
      ), Objects_Parts ),

%%% display a table of objects and parts %%%
list(concatenate,['Formal term objects (',N1,') and their parts.'],Title),
Headings = ['Object', 'Parts'],
tabulate_data(Title,90,[20,_],Headings,[Objects_with_Parts,Objects_Parts]),

% find all the statements that use part(_,_) 
statements_with_parts(Kb,_,_,Statements),
list(length,Statements,N2),

% find all the part expressions for these statements
find_all_solutions(Parts,
      ( list(member,Statements,Id),
        statements_convert(formal,Kb,Id,Statement),
        statements_components(Statement,parts,Parts)
      ), All_Parts ),

%%% display a table of statements and their parts %%%
list(concatenate,['Knowledge base statements (',N2,') containing the ''part(Object,Part)'' expression.'],Title1),
Headings1 = ['Statement', '''object/part'' expressions used by statement'],
tabulate_data(Title1,90,[11,_],Headings1,[Statements,All_Parts]). `};

macro["objects_and_their_attributes/0"] = {
applies_to: `Single Kb`,
description: `The tool displays information about attributes and values of knowledge base objects.

The user is first asked to choose one or more knowledge base objects.

Then the user is asked to choose from a number of options :

   - no
      Restrict table to selected objects.

   - 'subobjects'
      This option will be available if any of the selected objects have subobjects.
	Table will show if any subobject has values for an attribute of a selected object. 

   - 'superobjects'
      This option will be available if any of the selected objects have superobjects.
	The inherited attribute/values will be displayed in the table as if they applied
      directly to a selected object. 

   - 'unrelated objects'
      This option extends the table to show attribute/values for any unrelated knowledge
      base objects that also have information about attributes possessed by a selected object.

There can be a lot of duplication of information within a table so the tool
allows the user to restrict the output as follows.

   - The tool will automatically remove any duplication of information
     and will compact the rows as far as possible.

   - The tool will list all the values that can appear in the table and
     then ask the user if any should be excluded from the table.
     Quite often values such as 'increase' or 'decrease' are not particularly
     useful in a table.

The tool will display a list of the selected objects above the table.
If the relevant option is chosen it will also display lists of subobjects, superobjects
and unrelated objects above the table.

If the 'superobjects option' is chosen it will display, below the table, 
the structure of all the object hierarchies that contain an instance of
one of the selected objects.

The tabular output is best displayed by using the option to send the output
to Microsoft Excel.
`,
head: `objects_and_their_attributes`,
body: `
% select Kb
kb_function(select,Kb),

% CHOOSE objects.
formal_terms(Kb,object,All_objects),
list(multiple_select,All_objects,'Choose one or more objects',Selected),

% IDENTIFY any of the selected objects that have superobjects or subobjects
objects_with_superobjects(Kb,Selected,Superobjects,Objects_with_superobjects),
objects_with_subobjects(Kb,Selected,Subobjects,Objects_with_subobjects),

% DETERMINE what options are available with selected objects and prompt for choice.
choose_object_options(Superobjects,Subobjects,Choices),

% ARE CAUSAL statements to be included
include_causal_statements(YesNo,TypeA,TypeDAV),

% CHOOSE objects that will have their subobjects/superobjects included in the table
if list(member,Choices,no)
then	( Objects_with_subobjects_choice   = [],
	  Objects_with_superobjects_choice = [],
	  Choice_objects_with_subobjects = [],
	  Objects_with_superobjects_choice = [],
	  Discovered_structures = [],
	  Discovered = []
	)
else  ( % Choose which objects will have their subobjects included in the table.
	  if list(member,Choices,subobjects)
	  then ( Question2 = 'Choose which objects will have their subobjects included in the table',
		   list(multiple_select,Objects_with_subobjects,Question2 ,Choice_objects_with_subobjects),
		   find_all_solutions(Ob/Subs,
			 ( list(member,Choice_objects_with_subobjects,Ob),
			   hierarchy_objects(Kb,_,descendants,Ob,Subs),
			   list(not_empty,Subs)
			 ), Objects_with_subobjects_choice)
	 	  )
	   else Objects_with_subobjects_choice = [],

	   % Choose which objects will have their superobjects included in the table.
	   if list(member,Choices,superobjects)
	   then ( Question3 = 'Choose which objects will inherit attributes from their ancestors',
 		   list(multiple_select,Objects_with_superobjects,Question3,Objects_with_superobjects_choice)
		 )
	   else Objects_with_superobjects_choice = []
      ),

% MERGE a list of objects with their subobjects and remove any duplicates.
merge_objects_and_subobjects(Selected,Objects_with_subobjects_choice,Merged),
list(remove,Merged,Merged_objects_and_subobjects),

% LIST of attributes for objects and any subobjects
find_all_solutions(A,( list(member,Merged_objects_and_subobjects,Ob),
			     formal_term(Kb,Ob,TypeA,A)
                     ),Aos),

% LIST of of attributes for any superobjects
find_all_solutions(Ats,( list(member,Objects_with_superobjects_choice,Ob),
				 hierarchy_objects(Kb,_,ancestors,Ob,Anc),
			       list(member,Anc,A),
			       formal_term(Kb,A,TypeA,Ats)
                       ),Ai),
list(flatten&sort,[Aos,Ai],All_attributes),

% CHOOSE which attributes are to be included in table
if All_attributes=[_]
	then Attributes = All_attributes
	else ( list(multiple_select,['All'|All_attributes],'Choose one, multiple or all attributes',Selected_attributes),
		 if list(member,Selected_attributes,'All') then Attributes = All_attributes else Attributes = Selected_attributes
		),

% MAKE LIST of structures for OBJECTS, SUBOBJECTS and SUPEROBJECTS.
find_all_solutions(Sel_DAVs,
	( member(Object,Merged_objects_and_subobjects),
	  if  member(Object,Objects_with_superobjects_choice)
	  then  % include inherited attribute/values
		  make_structures(Kb,TypeDAV,Object,yes,Attributes,Sel_DAVs)
        else  % object and subobject attribute/values
		  make_structures(Kb,TypeDAV,Object,no,Attributes,Sel_DAVs)   
	), All_DAVs),
list(flatten, All_DAVs, Flattened),
list(remove,Flattened,OAVDSs),

% MAKE LIST of structures for UNRELATED OBJECTS that share some attribute value
if list(member,Choices,'unrelated objects')
	then ( list(flatten&sort,[Selected,Superobjects,Subobjects],Excluded),
		 make_structures(Kb,TypeA,TypeDAV,Excluded,unrelated,Attributes,Discovered_structures)
	     )
	else (  Discovered_structures = [],
		  Discovered = []
           ),

% CONSOLIDATE all structures into one list
append(OAVDSs,Discovered_structures,ALL_structures),

% ASK user to exclude any unwanted 'Values'
exclude_values(ALL_structures,Filtered_structures),

% COLLECT all the attribute definitions in a form for tabulation
make_attribute_columns(Selected,Attributes,Filtered_structures,All_columns),

% DETAILED object definitions
list(select,[yes,no],'Do you want detailed object definitions ?',Detailed),

% Display list of selected objects.
show('SELECTED OBJECTS :'), show(nl), show(Selected),show(nl),

% Display list of subobjects.
if list(member,Choices,subobjects) then (show('SUB OBJECTS :~M~J'), show(Subobjects), show(nl)),

% Display list of inherited objects.
if list(member,Choices,superobjects) then (show('SUPER OBJECTS :~M~J'), show(Superobjects), show(nl)),

% Display list of unrelated objects.
if list(member,Choices,'unrelated objects')
then ( show('UNRELATED OBJECTS (that share attributes) :~M~J'),
	 show(Discovered), show(nl)
     ),

% SHOW TABLE if selected objects have attributes.
if Attributes=[]
then ( show('The selected object(s) have no attributes'),show(nl),show(nl))
else ( % Display table of results
	 if YesNo=yes then Title='Attributes and their values for all selected objects (Causal and attribute statements).'
	 		  else Title='Attributes and their values for all selected objects (Attribute statements only).',
	 if Detailed=yes
	 then ( append(['Object'|Attributes],['Object definition','Statements'],Headings),
		  Columns = All_columns
		)
	 else ( Headings = ['Object'|Attributes],
		  reduce_number_of_rows_to_a_minimum(Selected,All_columns,Filtered_columns),	  
		  append(Columns,[_,_],Filtered_columns)
		),
       tabulate_data(Title,_,_,Headings,Columns)
     ),

% SHOW object hierarchies unless user only interested in selected objects
if \= member(no,Choices)
then  % display structure of relevant object hierarchies.
	( find_all_solutions(HList,
		( list(member,Selected,Object),
	  	  find_all_solutions(H,(subobject(Kb,H,Object,_) ; subobject(Kb,H,_,Object)),HList)
	      ),All_HList),
	  list(flatten&sort,All_HList,Hierarchies),
	  if Hierarchies \= [] then
		( show('STRUCTURE of relevant hierarchies :'),
              print_object_hierarchies_layout(Kb,Hierarchies,Hierarchies),
              show(nl)
             )
	). `};

macro["objects_attributes_table/0"] = {
applies_to: `Single Kb`,
description: `
The tool displays information about attributes and values of knowledge base objects.

The user is asked initially whether the analysis should begin by selecting attributes or objects.

If 'attributes' are selected, the tool will initially display a list of all the attribute formal
terms found in the knowledge base and the user will be asked to choose the attributes they want to
investigate. The tool will then find all the knowledge base objects that possess at least one of
the chosen attributes. The objects will be displayed in a table showing all the attribute values
for the objects.

If 'objects' are selected, the tool will initially display a list of all the object formal
terms found in the knowledge base and the user will be asked to choose the objects they want to
investigate. The tool will then find all the attributes possessed by the chosen objects and 
the user will be asked to select the attributes of interest. The objects will then be displayed
in a table showing all the attribute values for the objects.

During the running of the tool, the user will be asked to make choices that will affect the amount
and content of information displayed in the table. The options will vary depending on whether
the user initially chose 'attributes' or 'objects' as their starting point.

If 'objects' were initially selected then the following choices will be available :
   - no
      Restrict table to selected objects.

   - 'subobjects'
      This option will be available if any of the selected objects have subobjects.
	Table will show if any subobject has values for an attribute of a selected object. 

   - 'superobjects'
      This option will be available if any of the selected objects have superobjects.
	The inherited attribute/values will be displayed in the table as if they applied
      directly to a selected object. 

   - 'unrelated objects'
      This option extends the table to show attribute/values for any unrelated knowledge
      base objects that also have information about attributes possessed by a selected object.

The tool can be restricted to display attribute/value information derived from 'attribute statements'
or can be extended to include information derived from 'causal statements' as well.

There can be a lot of duplication of information within a table so the tool
allows the user to restrict the output as follows.

   - The tool will automatically remove any duplication of information
     and will compact the rows as far as possible.

   - The tool will list all the values that can appear in the table and
     then ask the user if any should be excluded from the table.
     Quite often values such as 'increase' or 'decrease' are not particularly
     useful in a table.

The tabular output is best displayed by using the option to send the output
to Microsoft Excel.
`,
head: `objects_attributes_table`,
body: `
% select Kb
kb_function(select,Kb),

Question = 'Do you wish to start your analysis by choosing objects or attributes ?',
list(select,[attributes,objects],Question,Start),

% ARE CAUSAL statements to be included
include_causal_statements(YesNo,TypeA,TypeDAV),

if Start = objects
then  % CHOOSE objects.
    (	formal_terms(Kb,object,All_objects),
	list(multiple_select,All_objects,'Choose one or more objects',Selected),

	% IDENTIFY any of the selected objects that have superobjects or subobjects
	objects_with_superobjects(Kb,Selected,Superobjects,Objects_with_superobjects),
	objects_with_subobjects(Kb,Selected,Subobjects,Objects_with_subobjects),

	% DETERMINE what options are available with selected objects and prompt for choice.
	choose_object_options(Superobjects,Subobjects,Choices),

	% CHOOSE objects that will have their subobjects/superobjects included in the table
	if list(member,Choices,no)
	then (Objects_with_subobjects_choice   = [],
		Objects_with_superobjects_choice = [],
		Choice_objects_with_subobjects = [],
		Objects_with_superobjects_choice = [],
		Discovered_structures = [],
		Discovered = []
	     )
	else ( % Choose which objects will have their subobjects included in the table.
		if list(member,Choices,subobjects)
		then ( Question2 = 'Choose which objects will have their subobjects included in the table',
			list(multiple_select,Objects_with_subobjects,Question2 ,Choice_objects_with_subobjects),
			find_all_solutions(Ob/Subs,
		  	    (	list(member,Choice_objects_with_subobjects,Ob),
				hierarchy_objects(Kb,_,descendants,Ob,Subs),
				list(not_empty,Subs)
			    ), Objects_with_subobjects_choice)
			)
		else Objects_with_subobjects_choice = [],

		% Choose which objects will have their superobjects included in the table.
		if list(member,Choices,superobjects)
		then ( Question3 = 'Choose which objects will inherit attributes from their ancestors',
			list(multiple_select,Objects_with_superobjects,Question3,Objects_with_superobjects_choice)
		     )
		else Objects_with_superobjects_choice = []
		),

	% MERGE a list of objects with their subobjects and remove any duplicates.
	merge_objects_and_subobjects(Selected,Objects_with_subobjects_choice,Merged),
	list(remove,Merged,Merged_objects_and_subobjects),

	% LIST of attributes for objects and any subobjects
	find_all_solutions(A,
	    (	list(member,Merged_objects_and_subobjects,Ob),
		formal_term(Kb,Ob,TypeA,A)
          ),Aos),

	% LIST of of attributes for any superobjects
	find_all_solutions(Ats,
	    (	list(member,Objects_with_superobjects_choice,Ob),
		hierarchy_objects(Kb,_,ancestors,Ob,Anc),
		list(member,Anc,A),
		formal_term(Kb,A,TypeA,Ats)
	    ),Ai),
	list(flatten&sort,[Aos,Ai],All_attributes)
    ),

% CHOOSE attributes to be included in table
if Start = attributes then formal_terms(Kb,attribute,All_attributes),	 
if All_attributes=[_]
	then Attributes = All_attributes
	else ( list(multiple_select,['All'|All_attributes],'Choose one, multiple or all attributes',Selected_attributes),
		 if list(member,Selected_attributes,'All') then Attributes = All_attributes else Attributes = Selected_attributes
		),

if Start = attributes
then (% Find objects with at least one of selected attributes
	formal_terms(Kb,object,Objects),
	findall(O,(	member(O,Objects),
			formal_term(Kb,O,all_attributes,Obj_Atts),
			member(A,Attributes),
			member(A,Obj_Atts)
		    ), Os),
	sort(Os,Selected),
	% for compatibilty with later code
	Merged_objects_and_subobjects = Selected,
	Objects_with_superobjects_choice = [],
	Choices = []
     ),

% MAKE LIST of structures for OBJECTS, SUBOBJECTS and SUPEROBJECTS.
find_all_solutions(Sel_DAVs,
	( member(Object,Merged_objects_and_subobjects),
	  if  member(Object,Objects_with_superobjects_choice)
	  then  % include inherited attribute/values
		  make_structures(Kb,TypeDAV,Object,yes,Attributes,Sel_DAVs)
        else  % object and subobject attribute/values
		  make_structures(Kb,TypeDAV,Object,no,Attributes,Sel_DAVs)   
	), All_DAVs),
list(flatten, All_DAVs, Flattened),
list(remove,Flattened,OAVDSs),

% MAKE LIST of structures for UNRELATED OBJECTS that share some attribute value
if list(member,Choices,'unrelated objects')
	then ( list(flatten&sort,[Selected,Superobjects,Subobjects],Excluded),
		 make_structures(Kb,TypeA,TypeDAV,Excluded,unrelated,Attributes,Discovered_structures)
	     )
	else (  Discovered_structures = [],
		  Discovered = []
           ),

% CONSOLIDATE all structures into one list
append(OAVDSs,Discovered_structures,ALL_structures),

% ASK user to exclude any unwanted 'Values'
exclude_values(ALL_structures,Filtered_structures),

% COLLECT all the attribute definitions in a form for tabulation
make_attribute_columns(Selected,Attributes,Filtered_structures,All_columns),

% DETAILED object definitions
list(select,[yes,no],'Do you want detailed object definitions ?',Detailed),

if Start = objects
then (  % Display list of selected objects.
	  show('SELECTED OBJECTS :'), show(nl), show(Selected), show(nl),
	  % Display list of subobjects.
	  if list(member,Choices,subobjects) then ( show('SUB OBJECTS :~M~J'),show(Subobjects),show(nl) ),
	  % Display list of inherited objects.
	  if list(member,Choices,superobjects) then ( show('SUPER OBJECTS :~M~J'), show(Superobjects), show(nl) ),
	  % Display list of unrelated objects.
	  if list(member,Choices,'unrelated objects') then ( show('UNRELATED OBJECTS (that share attributes) :~M~J'),
	                                                    show(Discovered), show(nl) )
      ),

% SHOW TABLE if selected objects have attributes.
if Attributes=[]
then ( show('The selected object(s) have no attributes'),show(nl),show(nl))
else ( % Display table of results
	 if YesNo=yes then Title='Attributes and their values for all selected objects (Causal and attribute statements).'
	 		  else Title='Attributes and their values for all selected objects (Attribute statements only).',
	 if Detailed=yes
	 then ( append(['Object'|Attributes],['Object definition','Statements'],Headings),
		  Columns = All_columns
		)
	 else ( Headings = ['Object'|Attributes],
		  reduce_number_of_rows_to_a_minimum(Selected,All_columns,Filtered_columns),	  
		  append(Columns,[_,_],Filtered_columns)
		),
       tabulate_data(Title,_,_,Headings,Columns)
     ),

% SHOW object hierarchies unless user only interested in selected objects
if ( \= member(no,Choices), Start=objects )
then  % display structure of relevant object hierarchies.
	( find_all_solutions(HList,
		( list(member,Selected,Object),
	  	  find_all_solutions(H,(subobject(Kb,H,Object,_) ; subobject(Kb,H,_,Object)),HList)
	      ),All_HList),
	  list(flatten&sort,All_HList,Hierarchies),
	  if Hierarchies \= [] then
		( show('STRUCTURE of relevant hierarchies :'),
              print_object_hierarchies_layout(Kb,Hierarchies,Hierarchies),
              show(nl)
             )
	). `};

macro["redundancy_summary/0"] = {
applies_to: `Single Kb`,
description: `
Tool produces a summary of any redundant formal terms, sources or statements.
Will take a few minutes to run with the larger knowledge bases.

`,
head: `redundancy_summary`,
body: `
% Choose a knowledge base if more than one loaded
knowledge_base(select,Kb),
list(concatenate,['Kb =  ',Kb,'~M~J~M~J'],Msg),
show(Msg),

% Find any redundant formal terms
redundant_formal_terms(Kb,all,Formal_terms),

% Find any redundant statements
redundant_statements(Kb,attribute,Attribute_statements),
redundant_statements(Kb,causal,   Causal_statements),
list(flatten,[Attribute_statements,Causal_statements],Statements),

% Find any redundant sources
redundant_sources(Kb,Sources),

%%%%% DISPLAY results %%%%%

% Formal terms
if list(empty,Formal_terms)
   then show('There are no redundant formal terms.~M~J')
   else ( show('The following redundant formal terms were found in the knowledge base :~M~J'),
          show(tab,Formal_terms), show(nl)
        ),

% Statements
if list(not_empty,Statements)
  then foreach Statement in Statements
	do  (	show(nl),
		statements_convert(translate,Kb,Statement,Tr),
		show('The statement '''), show(Tr),
		show('''~M~Jmay be redundant because another causal path reaches the same conclusion.'),show(nl)
	    )
  else ( show(nl),show('There does not appear to be any redundant statements in the knowledge base.'),show(nl)),

% Sources
show(nl),
if list(empty,Sources)
   then show('There are no redundant sources.~M~J')
   else ( show('The following redundant sources were found in the knowledge base :~M~J'),
          show(tab,Sources), show(nl)
        ). `};

macro["redundant_formal_terms/3"] = {
applies_to: `Single Kb`,
description: `Make a list of knowledge base terms of the specified type which are not used by any statement.

'Type' can be one of [ all, action, attribute, comparison, link, object, process, value ]

An additional check is made for 'object' formal terms to ensure the object does not exist in an object hierarchy.
If an 'object' is used in an object hierarchy then it is not redundant.

Any reserved formal terms of the form calendar(Start,Duration) cannot be deleted.`,
head: `redundant_formal_terms(Kb,Type,RedundantTerms)`,
body: `
% ensure valid Kb
knowledge_base(list,KBs),
list(member,KBs,Kb),

% Get terms of specified type
formal_terms(Kb,Type,Terms),

% Get hierarchical objects in case Type = object OR all
hierarchy_objects(Kb,_,objects,_,Objects),

% Find all the redundant terms
find_all_solutions(Term,
      ( list(member,Terms,Term),
	  % Term not used in statements if list is empty
	  statements_search(Kb,Term,_,object,_,[]),
	  % check Term is not used in an object hierarchy (in case Term is an object)
        list(not_member,Objects,Term)
      ), RedundantTerms),

if RedundantTerms = []
then ( list(concatenate,['There are no redundant ''',Type,''' formal terms in the knowledge base.'],Msg),
       show(Msg), show(nl)
     )
else ( list(concatenate,['The following formal terms are redundant~M~J',
                         RedundantTerms, '~M~J',
                         'Do you want to delete the redundant formal terms ?'],Message),
       ask_yesno(Message,Response),
	 if Response=yes
	 then foreach Item in RedundantTerms do
		   ( if formal_term(Kb,Item,delete,_)
	   	     then ( show(' Formal term '), show(Item),
                        show(' deleted.'), show(nl)
                      )
		     else ( show(' Unable to delete the formal term '),
                        show(Item), show(nl)
                      )
               )
     ). `};

macro["redundant_sources/2"] = {
applies_to: `Single Kb`,
description: `Find any knowledge base sources which are not attached to a statement.`,
head: `redundant_sources(Kb,Redundant_sources)`,
body: `
% Get all Kb sources
source_list(Kb,all,Source_list),

% Get all sources used by Kb statements
statements_sources(Kb,all,Statements_sources),

% Find any sources not used in statements
find_all_solutions(Source,
     ( list(member,Source_list,Source),
       list(not_member,Statements_sources,Source)
     ), Redundant_sources). `};

macro["redundant_statements/3"] = {
applies_to: `Single Kb`,
description: `Identifies potentially redundant knowledge base statements.

If 'Type' = attribute then statements that duplicate information about an object's ancestors in a hierarchy are redundant.
eg:	att_value(terrier,noise,bark) would be redundant if terrier is a descendant of the object dog and there already exists a statement att_value(dog,noise,bark)

If 'Type' = causal then causal statements that can already be represented by an existing causal statement path are redundant.

'Type' = all is not a valid choice.

`,
head: `redundant_statements(Kb,Type,Redundant_statements)`,
body: `
% Get list of valid statements
list(member,[attribute,causal],Type),
statements_of_type(Kb,Type,Statements),

if Type = attribute then
    ( % find all the hierarchy objects in knowledge base
      hierarchy_objects(Kb,_,objects,_,Objects),

      find_all_solutions( att_value(Object,A,V),
         ( % find all the statements that are about a hierarchical object
           list(member,Statements,att_value(Object,A,_)),
           list(member,Objects,Object),

           % derive any statements from object's ancestors
           derived_statements(Kb,_,Object,DerivedStatements),

           % check if any derived statements are same as existing attribute statement
           list(member,DerivedStatements,att_value(Object,A,V))

         ), Redundancies),

	 statements_convert(numbered,Kb,Redundancies,Converted),
       list(sort,Converted,Redundant_statements)
    ),

if Type = causal then
    ( % find all the start nodes of paths
      get_nodes(Kb,starts,Starts),
      find_all_solutions( Conclusion,
         ( % get a causal path beginning with one of start nodes.
           list(member,Starts,Cause),
	     causal_paths(Kb,Cause,_,Paths),
	     list(member,Paths,Path),

	     % ensure path has at least three elements.
	     list(length,Path,Length),
	     test(greater,Length,2),

	     % get end node
	     list(reverse,Path,[Effect|_]),

	     % construct a conclusion that can be deduced from the Path
	     list(member,[causes1way,causes2way],Causes),
	     Conclusion=Causes(Cause,Effect),

	     % does this conclusion match any existing causal statement
	     list(member,Statements,Conclusion)

        ), Redundancies),

	 statements_convert(numbered,Kb,Redundancies,Converted),
       list(sort,Converted,Redundant_statements)
    ). `};

macro["restore_original_formal_terms/1"] = {
applies_to: `General`,
description: `Restores the original formal terms that were used when creating the statements.
Used in partnership with the tool - transpose_formal_terms_and_synonyms/2.
   (May take a few minutes to run, if knowledge base has a large number of formal terms and synonyms)`,
head: `restore_original_formal_terms(Kb)`,
body: `restore_formal_terms(Kb). `};

macro["sources_summary/0"] = {
applies_to: `Single Kb`,
description: `Display in the form of a table(s)

(a) List of knowledge base sources
(b) Number of statements associated with each source
(c) Number of sources for each statement containing a selected term

The tool allows the user to choose the knowledge base and a formal term.
`,
head: `sources_summary`,
body: `
% Choose a knowledge base if more than one loaded
knowledge_base(select,Kb),

% Get all Kb sources
source_list(Kb,all,Sources),
list(length,Sources,No_of_Sources),

% Make a list of strings for table
findall(S,(member(Source,Sources),convert(source,Source,S)),T_sources),

MessageA = 'Do you want to restrict statements to those containing a selected formal term ?',
list(select,[no,yes],MessageA,Ans),

if Ans=no  then 
   ( Statements=all,
     Title='Summary of statements associated with each source.'
   ),

if Ans=yes then
   ( % Get all Kb formal terms
     formal_terms(Kb,all,Formal_terms),

     % choose the term
     MessageB = 'Please choose a formal term',
     list(select,Formal_terms,MessageB,Term),

     % statements containing the selected formal term 
     statements_search(Kb,Term,_,object,all,Statements),

     list(concatenate,['Number of statements associated with a source and containing the term ''',Term,''''],Title)
   ),

% Get the number of statements associated with each source and term.
find_all_solutions(N,
     ( list(member,Sources,Source),
       convert(source,Source,String),
       statements_search(Kb,String,_,object,Statements,Source_statements),
       list(length,Source_statements,N)
     ), Statement_counts),

%%% display the table %%%
list(concatenate,['Sources (',No_of_Sources,')'],HeadingA),
Headings1 = [HeadingA, 'Number of statements'],
tabulate_data(Title,90,[60,_],Headings1,[T_sources,Statement_counts]),

% If a formal term is used then include information on the number of sources for each statement
if Ans=yes then
   ( % find no. of sources for each statement
     find_all_solutions(N,
          ( list(member,Statements,Statement),
            statements_sources(Kb,Statement,Statement_sources),
            list(length,Statement_sources,N)
          ), Source_counts),

     %%% display the table %%%
     list(length,Statements,No_of_Statements),
     list(concatenate,['Statements (',No_of_Statements,')'],HeadingB),
     Title2 = 'Number of sources associated with each statement.',
     Headings2 = [HeadingB, 'Number of sources'],
     tabulate_data(Title2,90,_,Headings2,[Statements,Source_counts])
   ),

%%% Statements associated with Source Locations %%%
source_details(Kb,all,location,Locations),
find_all_solutions([Location,N],
    ( list(member,Locations,Location),
	statements_search(Kb,Location,_,object,all,Ids),
      list(length,Ids,N)
    ), Location_rows),
convert_columns_to_rows(Location_rows,Location_columns),
% display the table
Locations_title = 'Summary of statements associated with each source location.',
Location_headings = ['Locations', 'Number of statements'],
tabulate_data(Locations_title,_,_,Location_headings,Location_columns),

%%% Statements associated with User Defined Labels %%%
source_details(Kb,all,'user labels',Labels),

find_all_solutions(_,
	( list(member,Labels,Label),
        sourceDetails(Kb,all,Label,Vs),
	  removeall('',Vs,Values),
	  find_all_solutions([Value,N],
		( list(member,Values,Value),
		  statements_search(Kb,Value,_,object,all,Ids),
		  list(length,Ids,N)
		), Values_rows),
        convert_columns_to_rows(Values_rows,Values_columns),
	  % display the table
        list(concatenate,['Summary of statements associated with values of the user defined label ''',Label,''''],Labels_title),
	  Labels_heading = ['Value of Label', 'Number of statements'],
	  tabulate_data(Labels_title,_,_,Labels_heading,Values_columns)
      ),_),

%%% Statements associated with genders %%%
source_details(Kb,all,gender,Genders),
find_all_solutions([Gender,Total],
    ( list(member,Genders,Gender),
	% get list of statements for each source of selected gender
	find_all_solutions(Ids,
		( % Find all sources of that gender
		  search_sources(Kb,all,gender,Gender,GSources),
		  list(member,GSources,GSource),
		  format_source(GSource,GSourceString),
		  % Find all statements from this source
		  statements_search(Kb,GSourceString,_,object,all,Ids)
    		), All_Ids),
      list(flatten&sort,All_Ids,Gstatements),
	list(length,Gstatements,Total)
    ),Gender_rows),
convert_columns_to_rows(Gender_rows,Gender_columns),
% display the table
Genders_title = 'Summary of statements associated with each gender.',
Gender_headings = ['Genders', 'Number of statements'],
tabulate_data(Genders_title,_,_,Gender_headings,Gender_columns). `};

macro["sources_table/0"] = {
applies_to: `Single Kb`,
description: `Display three tables to display all the information for each source

Table 1
(a) Source name.
(b) Source location.
(c) Date / Suffix.
(d) Number of statements associated with the source

Table 2
(a) Source name.
(b) Source gender.
(c) Source interviewer
(d) Source interviewee

Table 3
(a) Source name.
(b) Value of source label 1
(c) Value of source label 2
(d) Value of source label 3
(e) Value of source label 4

`,
head: `sources_table`,
body: ` %%% Select the knowledge base %%%
knowledge_base(select,Kb),

%%% Gather all the source data for the tables %%%
find_all_solutions( [Name,Location,Date,Interviewer,Interviewee,
				Gender,Value1,Value2,Value3,Value4,NStatements],
   (  source_details(Kb,
            source(Name,Location,Year,Suffix),
            interview, Interviewer, Interviewee,
            Gender, date(Day,Month,Year2),
            [Value1,Value2,Value3,Value4]),
	sourceToString(source(Name,Location,Year,Suffix),String),
    	sentencesContainingAStringItem(Kb,String,_,object,no,all,Statements,no),
	length(Statements,NStatements),
	cat_to_atom_or_string([Day,'-',Month,'-',Year2,' / ',Suffix],Date,_)	
   ), SourceData),

%%% Display TABLE 1 %%% 
find_all_solutions([Name,Location,Date,NStatements],
		member([Name,Location,Date,_,_,_,_,_,_,_,NStatements],SourceData),
	      List1),
sort(List1,Rows_Table1),
convert_columns_to_rows(Rows_Table1,Columns_Table1),

% construct title and column headings.
Headings1 = ['Name','Location','Date/Suffix','Statements'],

% display the table.
tabulate_data('',80,[20,33,17,10],Headings1 ,Columns_Table1),

%%% Display TABLE 2 %%% 
find_all_solutions([Name,Gender,Interviewer,Interviewee],
		member([Name,_,_,Interviewer,Interviewee,Gender,_,_,_,_,_],SourceData),
	      List2),
sort(List2,Rows_Table2),
convert_columns_to_rows(Rows_Table2,Columns_Table2),

% construct title and column headings.
Headings2 = ['Name','Gender','Interviewer','Interviewee'],

% display the table.
tabulate_data('',80,[20,8,26,26],Headings2 ,Columns_Table2),

%%% Display TABLE 3 %%% 
find_all_solutions([Name,Value1,Value2,Value3,Value4],
		member([Name,_,_,_,_,_,Value1,Value2,Value3,Value4,_],SourceData),
	      List3),
sort(List3,Rows_Table3),
convert_columns_to_rows(Rows_Table3,Columns_Table3),

%%% Get the user selected source labels %%% 
sourceUserLabels(Kb,[L1/_,L2/_,L3/_,L4/_]),

% construct title and column headings.
Headings3 = ['Name',L1,L2,L3,L4],

% display the table.
tabulate_data('',80,[20,15,15,15,15],Headings3 ,Columns_Table3). `};

macro["species_report/0"] = {
applies_to: `Single Kb`,
description: `Produce a report showing any information in the knowledge base about a specified species.`,
head: `species_report`,
body: `
% Choose a knowledge base if more than one loaded
knowledge_base(select,Kb),

% Choose a species
formal_terms(Kb,_,All_terms),
list(select,All_terms,'Choose an item',Species),

if  formal_term(Kb,Species,definition,Definition) then
    ( if Definition \= '' then
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
               ( list(concatenate,['''',Species,''' is used in the following ',Type,' statements :~M~J'],MsgType),
                 show(MsgType), show(tab,Sorted), show(nl)
               )
         ),

      % display the derived statements for the species for each hierarchy it belongs to.
	foreach Hierarchy in Hierarchies do
         ( 	derived_statements(Kb,Hierarchy,Species,DerivedStatements),
            list(length,DerivedStatements,N),
	      if N>0 then
                ( list(concatenate,['~M~JThere are ',N,' derived statements in the ''',Hierarchy,''' hierarchy for ',Species],MsgDer),
	            show(MsgDer),show(nl),
	            foreach Derived_statement in DerivedStatements do
                     ( statements_convert(translate,Kb,Derived_statement,NLDer),
                       show(tab,NLDer),show(nl)
                     )
                )
         )
    )
else show(message,'No such species in knowledge base.'). `};

macro["statement_inconsistency/1"] = {
applies_to: `Single Kb`,
description: `Identify any causal statements in a knowledge base that are inconsistent with the conclusion deduced from a causal path.`,
head: `statement_inconsistency(Kb)`,
body: `% make a list of all the causal statements in Kb
statements_of_type(Kb,causal,CausalStatements),

% find all the start nodes of paths
get_nodes(Kb,starts,Starts),

% Make a list of possible inconsistent conclusions
find_all_solutions((ConclusionLessValues,Conclusion),
   (
	% get a Path beginning with one of the start nodes.
	list(member,Starts,Cause),
	causal_paths(Kb,Cause,_,Paths),
	list(member,Paths,Path),

	% ensure path has at least three elements.
	list(length,Path,Length),
	test(greater,Length,2),

	% find its end node.
	list(reverse,Path,[Effect|_]),

	% construct the conclusion that can be deduced from the Path stripped of its values
	list(member,[causes1way,causes2way],Causes),
	Conclusion=Causes(Cause,Effect),
	statements_of_type([Conclusion],no_values,[ConclusionLessValues]),

	% does this conclusion (stripped  of its values) match any existing causal statement
	list(member,CausalStatements,ConclusionLessValues),

	% check matching causal statement is different from Conclusion (including values)
	test(not_equal,Conclusion,ConclusionLessValues)

   ), Solutions),
list(sort,Solutions,Sorted),

% print results
if test(not_equal,Sorted,[])
then	foreach (Statement,Conclusion) in Sorted
	do  (	show(nl),
		statements_convert(translate,Kb,Statement,Tr1),
		statements_convert(translate,Kb,Conclusion,Tr2),
		show('The statement '), show(Tr1),
		show(' may be inconsistent with the conclusion '),
		show(nl),show('              '),show(Tr2),show(nl)
	    )
else ( show(nl),show('No conclusions inferred from the causal paths are inconsistent with the Kb statements.'),show(nl)). `};

macro["statement_induction_up_a_hierarchy/0"] = {
applies_to: `Single Kb`,
description: `This tool suggests more general statements that might be inferred about a parent object from
consideration of statements about its children.  If all the children of a parent object each have a
similar statement about them, then it is possible to induct those statements up to the parent object and make a more general statement about the parent.
The equivalent statements about the children now become redundant and are replaced by one statement about the parent.

eg:	statement_induction_up_a_hierarchy(treefodd,'Plant_pest',InductedStatements)

In this case the six statements about crop_pest have been inducted up to its parent 'Plant_pest' and one statement about hairy_catapillar inducted up to its parent catapillar.

( see the 'System Tools'/'Knowledge Analysis'/'Single Kb'/derived_statements_summary tool which produces a table summarising the number of derived statements that can exist for each object hierarchy in the specified knowledge base.)`,
head: `statement_induction_up_a_hierarchy`,
body: `% Select the knowledge base
knowledge_base(select,Kb),
list(concatenate,['Kb =  ',Kb,'~M~J~M~J'],Msg),
show(Msg),


%%% Select the object hierarchy %%%
knowledge_base(hierarchies,Kb,Hierarchies),
list(select,Hierarchies,'Choose a hierachy',Hierarchy),

% get all objects with children
hierarchy_objects(Kb,Hierarchy,parents,_,Parents),


find_all_solutions(Parent/Inducted,
	( list(member,Parents,Parent),

	  % get the children
	  hierarchy_objects(Kb,Hierarchy,children,Parent,Children),

	  % find all the statements about the children and substitute Parent for Child
	  find_all_solutions(Translated,
	       ( list(member,Children,Child),	
		   statements_search(Kb,Child,Hierarchy,object,all,ChildStatements),
		   statements_convert(formal,Kb,ChildStatements,Converted),
		   statements_substitute(Converted,Child,Parent,Sub),
		   statements_convert(translate,Kb,Sub,Translated)
	       ), Substituted ),

	  % find statements that are common to each set of substituted statements
	  list_comparison(common,Substituted,Inducted),
	  Inducted \= []
	), Inductions),
 
if Inductions = []
then ( show('No general statements can be inferred from the objects in the '''),
	 show(Hierarchy), show(''' hierarchy.'), show(nl)
	)
else  foreach Object/Statements in Inductions do
          ( list(length,Statements,N),
		show('The following '), show(N), show(' statements can be inferred for the object '''),
	      show(Object), show(''' from its children.'), show(nl), show(nl),
	      show(Statements), show(nl)
          ). `};

macro["statement_query/0"] = {
applies_to: `Query`,
description: `Tool that allows the user to analyse the knowledge base by submitting a query of arbitary
complexity. The query is in the form of a formal statement that conforms to the AKT grammar.
eg:	att_value(Object,Attribute,Value) causes2way att_value(soil,fertility,increase)
	would allow the user to find all the attribute statements that influence soil fertility
	Remember an identifier starting with an Upper Case character is a variable and can
	match all instances.`,
head: `statement_query`,
body: `query. `};

macro["statements_summary/1"] = {
applies_to: `Single Kb`,
description: `Produces a table summarising the number of statements of each type that exist in the knowledge base.
It also shows how many statements of each type have conditions attached to them.`,
head: `statements_summary(Kb)`,
body: `
%%% Make list of all the conditional statements in a knowledge base %%%

statements_of_type(Kb, conditional, Formal_statements),
statements_convert(identifier, Kb, Formal_statements, All_conditionals),

%%% Find statements of each type and any conditions %%%

Types = [all, attribute, causal, comparison, link],

find_all_solutions( (Ns,Nc),
     ( list(member,Types,Type),
       statements_of_type(Kb,Type,Statements_of_type),
	 list(length, Statements_of_type, Ns),
	 statements_convert(identifier,Kb,Statements_of_type,Converted),
	 % see how many have conditions
	 list_comparison(common,[Converted,All_conditionals],Common),
	 list(length, Common, Nc)
     ), Totals ),

%%% Construct title and column headings. %%%

list(concatenate,['Number of statements of each type used in the ''',Kb,''' knowledge base.'],Title),
Headings = ['TYPE','Number of statements','Conditions attached'],

%%% Construct table %%%

% make list of number of statements of each type
find_all_solutions(Ns, list(member,Totals,(Ns,_)), Statements),

% make list of number of conditionals of each type
find_all_solutions(Nc, list(member,Totals,(_,Nc)), Conditionals),

%%% Display the table %%%

tabulate_data(Title,_,[20|_],Headings,[Types,Statements,Conditionals]). `};

macro["switch_synonyms/3"] = {
applies_to: `General`,
description: `Utility that allows the user to quickly reposition all the formal_term synonyms throughout the knowledge base.
i.e. If synonym position 1 gave a formal term's latin name and synonym position 2 gave a formal term's local name, then their positions could be swapped using this tool.`,
head: `switch_synonyms(Kb,Position1,Position2)`,
body: `% ensure lowest element position is first
	sort([Position1,Position2],[P1,P2]),
% tidy up formal term synonym list definitions
tidysynonymlist(Kb),
switchSynonyms(Kb,P1,P2). `};

macro["transpose_formal_terms_and_synonyms/2"] = {
applies_to: `General`,
description: `Allows the user to display an alternative name for the formal terms by using any of its synonyms instead.  For example :
 - Substitution of Latin names for local names in the statements
 - Translation of a statement's English terms to another lamguage,
Position is an integer specifying which synonym to use. (starts with 1 for the leading synonym in a formal term's list of synonyms.)
If a formal term has no synonyms or a blank synonym then the name displayed is unchanged.
   (May take a few minutes to run, if knowledge base has a large number of formal terms and synonyms). `,
head: `transpose_formal_terms_and_synonyms(Kb,Position)`,
body: `'Substitute synonyms for formal terms'(Kb,Position). `};

