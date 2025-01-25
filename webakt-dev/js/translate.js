$(document).ready(function() {

// "phrase" is used here in the sense of a part of a sentence.
// It can be a single word, or an array of phrases, nested to
// any depth.
// Note that it uses sentences encoded using webAKT's array notation, where
// the first element is AKT5's functor, and Prolog atoms become quoted strings.
// So:
// att_value(a,b,c)
// becomes
// ["att_value","a","b","c"]
AKT.translate = function(phrase) {

    if (typeof phrase === "string") {
            return phrase;
    } else {
        switch (phrase[0]) {   // Uses the first array element
            case "action":

            case "and":
                return phrase[1] + " and " + phrase[2];

            case "att_value":
                return "the " + translate(phrase[2]) + " of " + translate(phrase[1]) + " is " + translate(phrase[3]);

            case "causes1way":
                return translate(phrase[1]) + " causes " + translate(phrase[2]);

            case "causes2way":
                return translate(phrase[1]) + " causes " + translate(phrase[2]);

            case "different_from":
                return phrase[1] + " is different from " + phrase[2];

            case "greater_than":
                return phrase[1] + " is greater than " + phrase[2];

            case "if":
                return translate(phrase[1]) + " if " + translate(phrase[2]);

            case "less_than":
                return phrase[1] + " is less than " + phrase[2];;

            case "linkxxx":
                return XXX;

            case "notxxx":
                return XXX;

            case "or":
                return phrase[1] + " or " + phrase[2];

            case "partxxx":
                return XXX;

            case "process":
                if (phrase.length === 2) {
                    return phrase[1];
                } else if (phrase.length === 3) {
                    return phrase[1] + " " + phrase[2];
                } else {
                    return phrase[1] + " " + phrase[2] + " " + phrase[3];
                }

            case "range":
                return XXX;

            case "same_as":
                return phrase[1] + " is the same as " + phrase[2];

            default:
                return JSON.stringify(phrase);
        }
    }
};

//var result1 = translate(["causes1way",["att_value","cat","appearance","now"],["att_value","dog","barking","high"]]);
//var result2 = translate(["if",["causes1way",["att_value","cat","appearance","now"],["att_value","dog","barking","high"]],["att_value","air","temperature","high"]]);


});

