/* Robert Muetzelfeldt
Last modified: August 2021

Instructions
============
1. Go to the directory webakt_prolog_to_json.
2. Command: prolog
3. 


26 August.   Major re-factoring

Significant changes to data formats: Changed from wiring out JSON to building up a 
single Prolog term, then using write_term/3 to write it to file.
Far more elegant, and meant I could reduce the number of lines  of code by >200!
Exploits the fact that JSON syntax is also valid Prolog.

Changes to data format:
- Changed to pure JSON syntax.  This looks horrible, since every word is enclosed in 
  double-quotes (e.g. "location":"abc" instead of location:abc), but JSON is, like XML,
  and *unlike* the Prolog format used in AKT5, a universal format for marked-up data.   

  This means that anyone, working with *any*
  programming language, can immediately load and start processing a webAKT knowledge-
  base.   In most languages (including JavaScript), the JSON format corresponds to the
  internal format used for holding complex data structures.

  In the case of JavaScript, this means that a webAKT KB file in JSON format can be trivially
  converted into a JavaScript data object, simple by adding something like
    var kb = ....
  at the start of the file, where .... is the JSON KB itself.   Any HTML page can then access 
  the KB simply by having a <script> element at the top of the file.

- Memo class removed: memos now attached to individual instances of other classes
  (currently sentence and source_detail).  See email requesting to be allowed to do this.

- memo/general removed, replaced by a new class "metadata".

- 'source_details' renamed 'sources', to bring in line with other classes.

- Internal structure of a source changed, removing subobjects except for extras (custom properties).

- An atomic id is created for each source.   In AKT5, the ID for a source was in fact a 4-element list
  [Name,Location,Year,Year_suffix].   So [fred,farm1,1970,a] makes the id 'fred_farm1_1970a'.  This
  id is used both for the source item itself, and for referencing the source in each statement.

- I have kept these as separate items, but eack one is now a
  top-levelsource property (key:value pair), so [fred,farm1,1970,a] becomes name:fred,location:farm1,
  year:1970,suffix:a (ignoring quote marks).

*/


:- dynamic stream/1.


go:-
    write('starting go'),nl,
    open('../kbs/atwima.js',write,Stream),
    assert(stream(Stream)),
    last_modified(Name,_),
    %write(Stream,'AKT.kbs.'),write(Stream,Name),write(Stream,' = '),nl(Stream),
    write(Stream,'AKT.kbs.'),write(Stream,atwima),write(Stream,' = '),nl(Stream),

    write('starting formal_terms'),nl,
    setof(formal_term(Term,Type,Description,Synonyms),Kb^formal_term(Kb,Term,Type,Description,Synonyms),Formal_terms),
    process_formal_terms(Formal_terms,Formal_terms1),
    squares_curlies(Formal_terms1, Formal_terms2),

    write('starting metadata'),nl,
    memo(_,general,_,Metadata),
    process_metadata(Metadata,Metadata1),

    write('starting sentences'),nl,
    setof(sentence(Id,Formal,Source,Type),Kb^sentence(Id,Kb,Formal,Source,Type),Sentences),
    process_sentences(Sentences,Sentences1),
    squares_curlies(Sentences1, Sentences2),

    write('starting sources'),nl,
    setof(source_detail(Source,Method,X1,X2,Sex,Date,Extra),Kb^source_details(Kb,Source,Method,X1,X2,Sex,Date,Extra),Sources),
    process_sources(Sources,Sources1),
    squares_curlies(Sources1, Sources2),

    write('starting source_user_labels'),nl,
    sourceUserLabels(_,Source_user_labels1),  % No need to process.

    write('starting subobjects'),nl,
    setof(subobject(Hierarchy,Object,Subobject),Kb^subobject(Kb,Hierarchy,Object,Subobject),Subobjects),
    process_subobjects(Subobjects,Subobjects1),
    % squares_curlies(Subobjects1, Subobjects2),

    write('starting subtopics'),nl,
    setof(subtopic(Hierarchy,Topic,Subtopic),Kb^subtopic(Kb,Hierarchy,Topic,Subtopic),Subtopics),
    process_subtopics(Subtopics,Subtopics1),
    % squares_curlies(Subtopics1, Subtopics2),

    write('starting topics'),nl,
    setof(topic(Name1,Description,Concerns,Objects),Kb^topic(Kb,Name1,Description,Concerns,Objects),Topics),
    process_topics(Topics,Topics1),
    squares_curlies(Topics1, Topics2),


    write('finishing go'),nl,
    write_term(Stream,{
        formal_terms:Formal_terms2,
        metadata:Metadata1,
        sentences:Sentences2,
        sources:Sources2,
        source_user_labels:Source_user_labels1,
        subobjects:Subobjects1,
        subtopics:Subtopics1,
        topics:Topics2},
        [portrayed(true)]),
    write('closing Stream'),
    close(Stream).



%=======================================================================================================
% Processing rules
% You will notice that most of the process_XXX predicates have the same pattern: a plural form,
% which handles the list of items, and a singular form, for each individual item.
% The main reason for dong it this way is to ensure that the last item does not have a
% training comma, since (although this is acceptable in JavaScript) it is not valid JSON.


% ================ formal_terms
process_formal_terms([],[]).
process_formal_terms([formal_term(Term,Type,Description,Synonyms)|Rest],
    [Term:{term:Term,type:Type,description:Description,synonyms:Synonyms}|Rest1]):-
    process_formal_terms(Rest,Rest1).


% ================= metadata
process_metadata([Title,Description,Author,Acknowledgements,Purpose,Methods,Study_area,Timing,Extra,_],
       {title:Title,
        description:Description,
        author:Author,
        acknowledgements:Acknowledgements,
        purpose:Purpose,
        methods:Methods,
        study_area:Study_area,
        timing:Timing,
        extra:Extra}).
    

% ===================== sentences
process_sentences([],[]). 
%process_sentences([sentence(Id,formal(Statement,Keys),source(_,source(Sources)),Type)|Rest],
%        [Id:{id:Id,formal:Statement_atom,nested_list:Nested_list,source_ids:Source_ids,type:Type,memo:Memo}|Rest1]):-
process_sentences([sentence(Id,formal(Statement,Keys),source(_,source(Sources)),Type)|Rest],
        [Id1:{id:Id1,json:Json,source_ids:Source_ids,type:Type,memo:Memo}|Rest1]):-
    atom_concat(s,Id,Id1),
    instantiate_variables(Statement,Keys),
    term_to_atom(Statement,Statement_atom),
    list_compound(Json,Statement),
    make_list_of_source_ids(Sources,[],Source_ids),
    get_memo(statement,Id,Memo),
    process_sentences(Rest,Rest1).

make_list_of_source_ids([],Final1,Final):-
    reverse(Final1,Final).
make_list_of_source_ids([(Name,Location,Year,Suffix)|Rest],Sofar,Final):-
    source_id(Name,Location,Year,Suffix, Id),
    make_list_of_source_ids(Rest,[Id|Sofar],Final).


% ================= sources
% See note at very bottom of this file about sources in AKT5.

process_sources([],[]).
process_sources([source_detail(source(Name,Location,Year,Suffix),Method,Interviewer,Interviewee,Sex,date(Day,Month,_),Extras)|Rest],
        [Id:{id:Id,name:Name,location:Location,suffix:Suffix,method:Method,interviewer:Interviewer_atom,interviewee:Interviewee_atom,
        sex:Sex,day:Day,month:Month,year:Year,memo:Memo,extras:Label_extras}|Rest1]):-
    source_id(Name,Location,Year,Suffix, Id),
    term_to_atom(Interviewer,Interviewer_atom),
    term_to_atom(Interviewee,Interviewee_atom),
    get_memo(source,Id,Memo),
    sourceUserLabels(_,Labels),
    make_extras(Labels,Extras,[],Label_extras),
    process_sources(Rest,Rest1).

source_id(Name,Location,Year,Suffix, Id):-
    atom_string(Name_atom,Name),
    atom_replace(Name_atom,' ','_',Result),
    atomic_list_concat([Year,Suffix],Year1),
    atomic_list_concat([Result,Location,Year1],'_',Id).

atom_replace(Source, Old, New, Target) :-
    atomic_list_concat(X,Old,Source),
    atomic_list_concat(X,New,Target).

% Hacky, but easy!
make_extras([],_,[],{}).
make_extras([],_,[A],{A}).
make_extras([],_,[A,B],{A,B}).
make_extras([],_,[A,B,C],{A,B,C}).
make_extras([],_,[A,B,C,D],{A,B,C,D}).
make_extras([],_,[A,B,C,D,E],{A,B,C,D,E}).
make_extras([],_,[A,B,C,D,E,F],{A,B,C,D,E,F}).
make_extras([],_,[A,B,C,D,E,F,G],{A,B,C,D,E,F,G}).
make_extras([],_,[A,B,C,D,E,F,G,H],{A,B,C,D,E,F,G,H}).
    
make_extras([" "|Labels],[_|Extras],Sofar,Final):-
    make_extras(Labels,Extras,Sofar,Final).
make_extras([Label|Labels],[Extra|Extras],Sofar,Final):-
    make_extras(Labels,Extras,[Label:Extra|Sofar],Final).


% ================== source_user_labels
process_source_user_labels(List):-
    stream(Stream),
    write_quoted_list(Stream,List).



% ======================== subobjects

process_subobjects([],[]).     
process_subobjects([subobject(Hierarchy,Object,Subobject)|Rest],
        [{hierarchy:Hierarchy,item:Object,subitem:Subobject}|Rest1]):-
    process_subobjects(Rest,Rest1).



% ====================== subtopics

process_subtopics([],[]).      
process_subtopics([subtopic(Hierarchy,Topic,Subtopic)|Rest],
        [{hierarchy:Hierarchy,item:Topic,subitem:Subtopic}|Rest1]):-
    process_subtopics(Rest,Rest1).

% ======================= topics

process_topics([],[]).
process_topics([topic(Name,Description,Search_string,Objects)|Rest],
        [Name:{name:Name,description:Description,search_term:Search_string,nested_list:Nested_list,objects:Objects_atom}|Rest1]):-
    term_string(Search_term,Search_string),
    list_compound(Nested_list,Search_term),
    term_to_atom(Objects,Objects_atom),
    process_topics(Rest,Rest1).
    

% =================================================================================================

% Extra code for process_sentences, from AKT/test/kb_senteces_sample.pl,
% to collapse the key values into the sentences.

go1:-
    sentence(I,_,formal(S,Keys),_,_),
    instantiate_variables(I,S,Keys),
    list_compound2(L,S),
    write([I,S]),nl,write(L),nl,nl,
    fail.
go1.


get_memo(Type,Id,Memo):-
    memo(_,Type,Id,Memo),!.
get_memo(_,_,'none').



%=================================================================
% Replaces variables in formal sentence with their corresponding atoms.

% For original testing (go1/0 above)
instantiate_variables(_,_,[A:A]).
instantiate_variables(_,_,[A:A,B:B]).
instantiate_variables(_,_,[A:A,B:B,C:C]).

% For main conversion code (process_sentences/1 above)
instantiate_variables(_,[]).
instantiate_variables(_,[A:A]).
instantiate_variables(_,[A:A,B:B]).
instantiate_variables(_,[A:A,B:B,C:C]).
instantiate_variables(_,[A:A,B:B,C:C,D:D]).
instantiate_variables(_,[A:A,B:B,C:C,D:D,E:E]).
instantiate_variables(_,[A:A,B:B,C:C,D:D,E:E,F:F]).
instantiate_variables(_,[A:A,B:B,C:C,D:D,E:E,F:F,G:G]).
instantiate_variables(_,[A:A,B:B,C:C,D:D,E:E,F:F,G:G,H:H]).
instantiate_variables(_,[A:A,B:B,C:C,D:D,E:E,F:F,G:G,H:H,I:I]).
instantiate_variables(_,[A:A,B:B,C:C,D:D,E:E,F:F,G:G,H:H,I:I,J:J]).


% Converts a Prolog compound term with functors into a nested univ-style list.
% A great big thank you for first answer at 
% https://stackoverflow.com/questions/19917369/prolog-using-2-univ-in-a-recursive-way
% The successive chunks of code make it more readable (for me...)
/*
list_compound(L, T) :-
    (   var(T)
    ->  L = [F|Fs], maplist(list_compound, Fs, Ts), T =.. [F|Ts]
    ;   atomic(T)
    ->  L = T
    ;   L = [F|Fs], T =.. [F|Ts], maplist(list_compound, Fs, Ts)
    ),
    !.
list_compound(T, T).
*/

/*% First refactoring: remove conjunctions, use separate rules.
list_compound1(L, T) :-
    list_compound1a(L, T),!.
list_compound1(T, T).

list_compound1a(L, T):-
    var(T) ->  L = [F|Fs], maplist(list_compound1, Fs, Ts), T =.. [F|Ts].
list_compound1a(L, T):-
    atomic(T) ->  L = T.
list_compound1a(L, T):-
    L = [F|Fs], 
    T =.. [F|Ts],
    maplist(list_compound1, Fs, Ts).
*/

% Second refactoring: remove ->.
list_compound(L, T) :-
    list_compounda(L, T),!.
list_compound(T, T).

list_compounda(L, T):-
    var(T),
    L = [F|Fs], 
    maplist(list_compound, Fs, Ts), 
    T =.. [F|Ts].
list_compounda(L, T):-
    atomic(T),
    L = T.
list_compounda(L, T):-
    L = [F|Fs], 
    T =.. [F|Ts],
    maplist(list_compound, Fs, Ts).


% From Jasper, 8 Feb 2021
% Used for writing out sentences converted into nested lists so that it is a
% JavaScript object.
%?- write_term([a,b,[c,[d,e],f],g,h,[i,j]], [portrayed(true)]).
portray(P) :- atom(P), format("\"~a\"", [P]).


% my_normalize_space 
% Gets rid of leading and trailing spaces in the Key and Value parts of 
% all object properties.  This is needed given that such extraneous spaces exist
% in AKT5 KBs.
my_normalize_space([],Final,Final).
my_normalize_space([Key:Value|Rest],Sofar,Final):-
    atom_or_string(Value),!,
    normalize_space(atom(Key1),Key),
    normalize_space(atom(Value1),Value),
    my_normalize_space(Rest,[Key1:Value1|Sofar],Final).
my_normalize_space([Key:Value|Rest],Sofar,Final):-
    my_normalize_space(Rest,[Key:Value|Sofar],Final).

atom_or_string(X):-
    atom(X),!.
atom_or_string(X):-
    string(X).



% From Jasper, 15 Nov 2021
squares_curlies([], {}).

squares_curlies(Squares, Curlies) :-
    Curlies =.. [{}, CommaSep],
    squares_commas(Squares, CommaSep).

squares_commas([H, T | TS], (H, TC)) :- !,
    squares_commas([T | TS], TC).

squares_commas([A], A).


% ====================== obsolete source_details
/* August 2021
source_details is a mess.

First, it does not have a single (atomic) identifier.  Instead, the identifier is a compound
term, the 4 elements of which have their own significance.    So: I make an atomic identifier
by cobining these together, AND represent the 4 elements separately.

Second, the source person is the same person as the interviewee, but their name is
represented differenty!   I do not propose to do anything about this, since it's
a tough problem to resolve he two formats (unless I simply drop one or the other).
In any case, both interviewer and interviewee are simply text strings, sono need to
unpack their details.

Third, the Prolog syntax for interviewer and interviewee is bizarre.  The surname (or the 
first surname, in the case of interviewer isi made into a functor, with the arguments
being initials or firstnames and (for inteviewers) other surname and initials, or (for
interviewees) some aritrary number of arguments for abitrary information.
Again, I will not do anything about this.


From atwima.kb:
source_details(
    atwima,
    source('Adam, Y.','Gogoikrom',2000,a),
    interview,
    'Agbo,'('R.','Frost,','W.','Moss,','C.'),  % interviewer(s)  
    'Yakubu'('Adam,','32,','Gogoikrom'),       % interviewee  
    'M',
    date(23,jun,2000),
    ['<35','Northern','','']
).

From ego.kb:
source_details(
    ego,
    source('Mr Aboagye','Krofrom',2002,a),
    interview,
    'Wojtek'('Simon','Waliszewski',and,'Seth','Oppong'),
    'Mr'('Aboagye'),
    'M',
    date(27,jun,2002),
    ['Fante','Farmer','Own Land','']
).

*/    


