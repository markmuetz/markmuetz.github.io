// AKT Formal Grammar, in PEG.JS format.
// Derived from the AKT "Definite Clause Grammar" given in Table 4.1 of the AKT5 manual.
// This involved very little work.   I copied the text as-is, and pasted it into
// the online PEG.JS parser-generator, at https://pegjs.org/online.
// I then did the following changes until it worked!
// Changed from having one line for each sub-rule to multiple lines,
//     for each non-terminal, separated by / (i.e. "or").
// Added in a regular expression for text atoms: [a-zA-Z_ ]
// Added in a regular expression for numbers: [a-zA-Z_ ]
// Added in Statement1 (to avoid confusion between 'sentence' and 'statement'), and
//     added in FormalConditions1 (to avoid peg.js complaining about infinite loop).
// Corrected a mistake in Table 4.1 (Process_bit instead of ProcessBit).
// Changed ordering of sub-rules for 'object' (otherwise it failed on original first one,
// even though second one was valid).

// Best hint: If a rule with multiple parts doesn't work when you think it should,
// put more complicated part before simpler part.   See the Object rule for an example.

// Test statement that parses OK: 
// att_value(part(nyanya,leaf),presence,in_soil)
// att_value(part(nyanya,seed),presence,in_soil) causes1way att_value(nyanya,appearance,first) if action(clearing,nfofoa_kwae)


Statement = statementHead:StatementHead " if " conditions:Conditions { return ["if",statementHead,conditions] }
    / StatementHead
StatementHead = "not(" statementHead1:StatementHead1 ")" { return ['not',statementHead1] }
	/ StatementHead1
StatementHead1 = 
    cause:Cause _ causeType:("causes1way" / "causes2way") _ effect:Effect  { return [causeType,cause,effect] }
    / AttributeStatement
    / "link" "(" "influence" __ thing1:Thing __ thing2:Thing ")" { return ['link','influence',thing1,thing2] }
    / "link" "(" link:Link __ object1:Object __ object2:Object ")" { return ['link',link,object1,object2] }  //Surely redundant rule?
    / "link" "(" link:Link __ processBit1:ProcessBit __ processBit2:ProcessBit ")" { return ['link',link,processBit1,processBit2] }
    / "link" "(" link:Link __ processBit:ProcessBit __ object:Object ")" { return ['link',link,processBit,object] }
    / "comparison" "(" attribute:Attribute __ object1:Object __ comparison:Comparison __ object2:Object ")" { return ['comparison',attribute,object1,comparison,object2] }
    / Object
Conditions = condition1:Conditions1 " and " condition2:Conditions { return ['and',condition1,condition2] }
    / condition1:Conditions1 " or " condition2:Conditions { return ['or',condition1,condition2] }
    / Conditions1
Conditions1 = ActionBit
	/ StatementHead
    / ProcessBit
AttributeStatement = "att_value(" object:Object __ attribute:Attribute __ value:Value ")" {return ['att_value',object,attribute,value]}
	/ "att_value(" process:ProcessBit __ attribute:Attribute __ value:Value ")" {return ['att_value',process,attribute,value]}
    / "att_value(" action:ActionBit __ attribute:Attribute __ value:Value ")" {return [action,attribute,value] }
Cause = AttributeStatement
    / ProcessBit
    / ActionBit
    / Object
    / "not" "(" Cause ")" 
ActionBit = "action(" action:Action __ object1:Object __ object2:Object ")" { ['action',action,object1,object2] }
    /  "action(" action:Action __ object:Object ")" { return ['action',action,object] }
Effect = AttributeStatement
    / ProcessBit
    / ActionBit
    / "not(" effect:Effect ")" { return ['not',effect] }
ProcessBit = "process(" process:Process ")" { return ['process',process] }
    / "process(" object:Object __ process:Process ")" { return ['process',object,process] }
    / "process(" object1:Object __ process:Process __ object2:Object ")" { return ['process',object1,process,object2] }
Thing = Object
    /  ProcessBit
Attribute = attribute:Atom  {return attribute}
Process = Atom
Link = Atom
Object = "part(" object1:Object "," object2:Object ")" { return ["part",object1,object2]; }
    / Atom
Action = Atom
Comparison = ("greater_than" / "less_than"/ "same_as" / "different_from")
Value = ("increase" / "decrease" / "change" / "no_change")
    / "range(" value1:Value __ value2:Value ")"  { return ['range',value1,value2] }
//    / n:Number " " a:Atom { return n+'_'+a }
//    / n:Number a:Atom { return n+a }
//    / Atom
//    / Number
    / Alphanumeric
Alphanumeric = chars:[a-zA-Z0-9_ %<>.]* {return chars.join("") }
Atom = letters:[a-zA-Z_]* {return letters.join("")}
Number = [0-9]*

_  = [ \t\n\r]*  // Zero or more whitespace characters
__ = "," _      // A comma followed by zero or more whitespace characters

