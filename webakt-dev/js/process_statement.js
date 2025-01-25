AKT.convert_json_to_formal = function (json) {
    var formal = AKT.translate1(json);
    console.debug(json,formal);
    return formal;
};

AKT.translate1 = function (phrase) {

    var context = 'xxx';

    if (typeof phrase === "string") {   // It's an error message...
            return phrase;
    } else {
        switch (phrase[0]) {   // Uses the first array element
            case "action":
                return;

            case "and":
                return AKT.translate1(phrase[1]) + " and " + AKT.translate1(phrase[2]);

            case "att_value":
                return "att_value(" + AKT.translate1(phrase[1]) + "," + AKT.translate1(phrase[2]) + "," + AKT.translate1(phrase[3]) +')';

            case "causes1way":
                return AKT.translate1(phrase[1]) + " causes1way " + AKT.translate1(phrase[2]);

            case "causes2way":
                return AKT.translate1(phrase[1]) + " causes2way " + AKT.translate1(phrase[2]);

            case "comparison":
                return " the " + AKT.translate1(phrase[1]) + " of " + AKT.translate1(phrase[2]) + " is " + AKT.translate1(phrase[3]) + AKT.translate1(phrase[4]);

            case "if":
                return AKT.translate1(phrase[1]) + " if " + AKT.translate1(phrase[2]);

            case "linkxxx":
                return "XXX";

            case "not":
                return "not " + AKT.translate1(phrase[1]);

            case "or":
                return AKT.translate1(phrase[1]) + " or " + AKT.translate1(phrase[2]);

            case "part":
                return "part(" + AKT.translate1(phrase[1]) + "," + AKT.translate1(phrase[2]) + ")";

            case "process":
                if (phrase.length === 2) {
                    return "process(" + AKT.translate1(phrase[1]) + ")";
                } else if (phrase.length === 3) {
                    return "process(" + AKT.translate1(phrase[1]) + "," + AKT.translate1(phrase[2]) + ")";
                } else {
                    return "process(" + AKT.translate1(phrase[1]) + "," + AKT.translate1(phrase[2]) + "," + AKT.translate1(phrase[3]) + ")";
                }

            case "rangexxx":
                return "XXX";

            default:
                return JSON.stringify(phrase);
        }
    }
};


// For an individual sentence, new or being loaded.
AKT.convert_formal_to_json = function(formal) {

    let formal1 = AKT.tidyFormal(formal);

    // First, we split the formal statement using ') if ', if it occurs.
    if (formal1.includes(') if ')) {
        var sif = formal1.split(') if ');
        var main = sif[0]+')';
        var condition = sif[1];
    } else {
        main = formal1;
        condition = null;
    }

    // Then, we check for the presence of a causes keyword, and move it to the
    // front.  (In Prolog terms, we change it from an infix operator to a functor.)
    if (main.includes(') causes1way')) {
        var scause = main.split(') causes1way ');
        main1 = 'causes1way('+scause[0]+'),'+scause[1]+')';
    } else if (main.includes(') causes2way')) {
        var scause = main.split(') causes2way ');
        main1 = 'causes2way('+scause[0]+'),'+scause[1]+')';
    } else if (main.includes(' causes1way')) {
        var scause = main.split(' causes1way ');
        main1 = 'causes1way('+scause[0]+','+scause[1]+')';
    } else if (main.includes(' causes2way')) {
        var scause = main.split(' causes2way ');
        main1 = 'causes2way('+scause[0]+','+scause[1]+')';
    } else {
        main1 = main;
    }

    // We now attach the 'if' as a functor, if it occurs.
    if (condition) {
        formal1 = 'if('+main1+','+condition+')';
    } else {
        formal1 = main1;
    }

    // We now change from a functor-style for various keywords to a list, with the 
    // functor now the first element of the list.  In Prolog terms, this is
    // euivalent to using univ ( =.. ), e.g. a(b,c) =.. [a,b,c].
    var formal2 = formal1;
    //var sa = formal1.replace(/\(/g,',[');
    formal2 = formal2.replace(/att_value\(/g,'[att_value,');
    formal2 = formal2.replace(/if\(/g,'[if,');
    formal2 = formal2.replace(/causes1way\(/g,'[causes1way,');
    formal2 = formal2.replace(/causes2way\(/g,'[causes2way,');
    formal2 = formal2.replace(/process\(/g,'[process,');
    formal2 = formal2.replace(/action\(/g,'[action,');
    formal2 = formal2.replace(/part\(/g,'[part,');
    formal2 = formal2.replace(/range\(/g,'[range,');
    formal2 = formal2.replace(/comparison\(/g,'[comparison,');
    formal2 = formal2.replace(/\(not /g,'[not,');

    // We now enclose all words in double-quotes (for JSON).
    var formal3 = formal2.replace(/([a-zA-Z0-9_]+)/g, "\"$1\"");

    // Finally, we replace all closing round brackets with closing square brackets...
    var jsonString = formal3.replace(/\)/g,']');
    //console.debug('\n',formal);
    //console.debug(formal1);
    //console.debug(formal2);
    //console.debug(formal3);
    //console.debug(nested_list);

    // ... and try to parse the result, to check that it's valid JSON.
    // Currently (Sept 2021), 3 statements fail two for 'not' that is not preceded by
    // opening bracket; one for 'or' in condition.  These are excluded from further use.
    // TODO: fix these two issues.
    try { // statements to try
        var jsonObject = JSON.parse(jsonString);
        return jsonObject;
    }
    catch (err) {
        AKT.state.error_count += 1;
        var f = ' '+err;
        var bits = f.split(' ');
        var positionText = bits[bits.length-1];
        var position = parseInt(positionText,10)+1;
        var cleanJsonString = '';
        for (var i=0; i<jsonString.length; i++) {
            var c = jsonString.charAt(i);
            if (c !== '"') {
                cleanJsonString += c;
            }
            if (i === position) {
                cleanJsonString += '***';
            }
        }
         
        var before = jsonString.substring(0,position);
        var after = jsonString.substring(position+1,999);
        //var markedString = before+'<here>'+after;
        return err+'...'+'\nThe JSON version shows the approximate position of the error, marked with ***\n\nFormal version: \n'+formal+'\n\nJSON version:\n'+cleanJsonString;
    }
};



// Note that some older code calls AKT.translate() directly.
// TODO: Change all calls to AKT.translate() to AKT.convert_json_to_english().
AKT.convert_json_to_english = function(phrase, context) {
    //console.debug(phrase);
    var english = AKT.translate(phrase,context);
    return english;
};


AKT.translate = function(phrase,context) {

    if (typeof phrase === "string") {  
            return " " + phrase + " ";
    } else {
        switch (phrase[0]) {   // Uses the first array element
            case "action":

            case "and":
                return AKT.translate(phrase[1]) + " and " + AKT.translate(phrase[2]);

            case "att_value":
                if (context && context === "cause" || context === "caused") {
                    if (phrase[3] === "increase") {
                        return "an increase in the " + AKT.translate(phrase[2]) + " of " + AKT.translate(phrase[1]);
                    } else if (phrase[3] === "decrease") {
                        return "a decrease in the " + AKT.translate(phrase[2]) + " of " + AKT.translate(phrase[1]);
                    } else if (context === "cause") {
                        return "the " + AKT.translate(phrase[2]) + " of " + AKT.translate(phrase[1]) + " being " + AKT.translate(phrase[3]);
                    } else if (context === "caused") {
                        return "the " + AKT.translate(phrase[2]) + " of " + AKT.translate(phrase[1]) + " to be " + AKT.translate(phrase[3]);
                    } else {
                        return "the " + AKT.translate(phrase[2]) + " of " + AKT.translate(phrase[1]) + " is " + AKT.translate(phrase[3]);
                    }
                } else {
                    return "the " + AKT.translate(phrase[2]) + " of " + AKT.translate(phrase[1]) + " is " + AKT.translate(phrase[3]);
                }

            case "causes1way":
                return AKT.translate(phrase[1], "cause") + " causes " + AKT.translate(phrase[2], "caused");

            case "causes2way":
                return AKT.translate(phrase[1], "cause") + " causes " + AKT.translate(phrase[2], "caused");

            case "comparison":
                return " the " + AKT.translate(phrase[1]) + " of " + AKT.translate(phrase[2]) + " is " + AKT.translate(phrase[3]) + AKT.translate(phrase[4]);

            case "if":
                return AKT.translate(phrase[1]) + " if " + AKT.translate(phrase[2]);

            case "linkxxx":
                return "XXX";

            case "not":
                return " it is not true that " + AKT.translate(phrase[1]);

            case "or":
                return AKT.translate(phrase[1]) + " or " + AKT.translate(phrase[2]);

            case "part":
                return AKT.translate(phrase[1]) + " " + AKT.translate(phrase[2]);

            case "process":
                if (phrase.length === 2) {
                    return AKT.translate(phrase[1]);
                } else if (phrase.length === 3) {
                    return AKT.translate(phrase[1]) + " " + AKT.translate(phrase[2]);
                } else {
                    return AKT.translate(phrase[1]) + " " + AKT.translate(phrase[2]) + " " + AKT.translate(phrase[3]);
                }

            case "rangexxx":
                return "XXX";

            default:
                return JSON.stringify(phrase);
        }
    }
};


AKT.tidyFormal = function (formal) {

    let formal1 = formal.replace(/\)if /g,') if ');

    formal1 = formal1.replace(/\)causes/g,') causes');
    formal1 = formal1.replace(/\)and /g,') and ');
    formal1 = formal1.replace(/\)or /g,') or ');

    return formal1;
};



AKT.analyseJson = function (json) {
    var kbId = 'output';
    var analysis = AKT.analyse(json);
    var analysisFlattened = analysis.flat(999);
    console.debug('~~~',analysisFlattened);
    for (var i=0;i<analysisFlattened.length; i++) {
        var word = analysisFlattened[i].word;
        var type = analysisFlattened[i].type;
        for (var j=0; j<AKT.kbs[kbId].formal_terms.length; j++) {
            var formal_term = AKT.kbs[kbId].formal_terms[j];
            if (type === formal_term.type) {
                var distance = AKT.levenshteinDistance(word,formal_term.term);
                if (distance<=2) {
                    console.debug('!!!',distance,type,word,formal_term.term);
                }
            }
        }
    }
}


// Looks at a statement (in JSON format), and analyses it with respect to the
// grammatical type of each of its atomic terms.   I *think* this can be done
// pure;y by the term's position in the structure (e.g. in 
// ....["att_value","tree","height","5m"]...
// "tree" must be an object), but this needs tobe checked.   If I'm wrong, there
// is a limit to whatthis automatic analysis can do.

// Thisi analysis serves two purposes:
// 1. to identify not yet identified as formal terms, and determine their type;
// 2. to check that the right type of existing formal terms is used in the right
// place in a statement.

// Note that I use 'part instead of 'phrase' here, and 'analyse' instead of 'translate',
// but the structure of this function is basically the same as for AKT.translate().

AKT.analyse = function (part, typeIfAtom) {

    var context = 'xxx';

    if (typeof part === "string") {  
        console.debug('===',part,'is',typeIfAtom);
        return {word:part,type:typeIfAtom};
    } else {
        switch (part[0]) {   // Uses the first array element
            case "action":
                break;

            case "and":
                AKT.analyse(part[1],'xxx');
                AKT.analyse(part[2],'xxx');
                break;

            case "att_value":
                 return [
                    AKT.analyse(part[1],'object'),
                    AKT.analyse(part[2],'attribute'),
                    AKT.analyse(part[3],'value')];


            case "causes1way":
                return AKT.analyse(part[1]) + " causes1way " + AKT.analyse(part[2]);

            case "causes2way":
                return AKT.analyse(part[1]) + " causes2way " + AKT.analyse(part[2]);

            case "comparison":
                return " the " + AKT.analyse(part[1]) + " of " + AKT.analyse(part[2]) + " is " + AKT.analyse(part[3]) + AKT.analyse(part[4]);

            case "if":
                return AKT.analyse(part[1]) + " if " + AKT.analyse(part[2]);

            case "linkxxx":
                return "XXX";

            case "not":
                return "not " + AKT.analyse(part[1]);

            case "or":
                return AKT.analyse(part[1]) + " or " + AKT.analyse(part[2]);

            case "part":
                return [
                    AKT.analyse(part[1],'object'),
                    AKT.analyse(part[2],'object')];

            case "process":
                if (part.length === 2) {
                        return [AKT.analyse(part[1],'object')
                    ];
                } else if (part.length === 3) {
                    return [
                        AKT.analyse(part[1],'object'),
                        AKT.analyse(part[2],'process')]
                } else {
                    return [
                        AKT.analyse(part[1],'object'),
                        AKT.analyse(part[2],'process'),
                        AKT.analyse(part[3],'object')]
                }
                break;

            case "rangexxx":
                return "XXX";

            default:
                return JSON.stringify(part);
        }
    }
};



// The following is an experiment in processing the JSON without having specific sections for each
// of the AKT predicates (att_value, if, etc).
// I think it's probably of limited use, sonce we often want to treat each predicate separately
// (e.g. when we generate English, etc).  But it might be useful for generic things loke
// colouring different formal-term types (object, prpocess etc).
AKT.walkThruJson = function (json) {
    console.debug('\n+',json);
    var result = AKT.walk('top',0,json);
    console.debug(JSON.stringify(result));
};

AKT.walk = function (predicate, position, part) {
    console.debug('+++ ',predicate,position,part);
    if (part.length === 2 && typeof part[0] === "string" && typeof part[1] === "string") {  
        console.debug('===',part);
        var part1 = [predicate,position,part[0],part[1]];
        return part1;
    } else {
        var result = [];
        for (var i=1; i<part.length; i++) {
            result.push(AKT.walk(part[0],i,part[i]));
        }
        return result;
    }
};


// Here, the above pattern is used for converting from JSON to formal.   Note
// however that we still need some task-specific bits in it.


AKT.convert_json_to_formal1 = function (json) {
    console.debug('\n+',json);
    var formal = AKT.walk1(json)
    console.debug(formal);
};

AKT.walk1 = function (part) {
    console.debug('+++ ',part);
    if (typeof part === "string") {  
        console.debug('===',part);
        return part;
    } else {
        var result = part[0]+'(';
        for (var i=1; i<part.length; i++) {
            var comma = i<part.length-1?',':'';
            result += AKT.walk1(part[i])+comma;
        }
        result += ')';
        return result;
    }
};


