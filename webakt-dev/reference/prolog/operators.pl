:- op(1200,xfx,'==>').
:- op(300,xfy,causes).
:- op(300,xfy,causes1way).
:- op(300,xfy,causes2way).
:- op(920,fx,if).
:- op(920,xfy,if).
:- op(915,xfx,then).
:- op(917,xfx,else).
:- op(870,xfx,until).
:- op(880,fx,repeattask).
:- op(870,fx,foreach).
:- op(860,xfx,do).
:- op(850,xfx,in).
:- op(870,fx,testeach).
:- op(860,xfx,for).
:- op(920,xfx,giving).
:- op(850,yfx,~>>).
:- op(850,xfy,&).
:- op(905,xfy,or).
:- op(910,xfy,and).

%:- op(900,xfy,'+').   % ... to load a KB, for last argumemnt of topic/5, e.g. topic(..., object + subobjects).

:- op(850,yfx,~>).
:- op(850,yfx,<~).  % Note: this is a WinProlog operator.   See reference manual for definition, which is...
                    % seeing( X ), see( 'foo.pl' ), read( T ), see( X ).   (X = user)
:- op(850,yfx,\).

:- op(902,fx,not).    % RM CHECK!

not X :- \+X.

% ------------ X and Y ------------

X and Y  :- X, Y.

% ------------ X or Y ------------

X or Y  :- X ; Y.

% ------------ if X then Y else Z ------------

if X then Y else Z :-
	if_then_else(X,Y,Z).

% ------------ if X then Y ------------
if X then Y  :-
	if_then(X,Y).

% ------------ foreach X in Y do Z ------------
foreach X in Y do Z  :-
	foreach_in_do(X,Y,Z).

% ------------ repeat_task X until Y ------------
repeattask X until Y  :-
	repeat_until(X,Y).

% ------------ testeach X in Y for Z giving U and V-------------

testeach X in Y for Z giving U and V  :-
	test_each_in_list_for(X,Y,Z,U,V).

