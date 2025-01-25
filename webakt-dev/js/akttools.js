$(document).ready(function() {

AKTtools = {};
AKTdisplays= {};

AKTtools.statements_summary = function (kbId) {
    var counts = {all:0, attribute:0, causal:0, comparison:0, link:0};
    var countsIf = {all:0, attribute:0, causal:0, comparison:0, link:0};
    
    var sentences = AKT.KBs[kbId]._statements;
    console.log(kbId,sentences);
    $.each(sentences, function(i, sentence) {
        counts['all'] += 1;
        counts[sentence.type] += 1;
        if (sentence.formal.includes(' if ')) {
            countsIf['all'] += 1;
            countsIf[sentence.type] += 1;
        }
    });

    var table = [];
    $.each(['all','attribute','causal','comparison','link'], function(i,type) {
        table[i] = [type,counts[type],countsIf[type]];
    });

    return {title:'statements_summary',headers:['TYPE','STATEMENTS','CONDITIONAL'],table:table,options:{}};
};


/* Obsolete - made prior to table utility.
AKTdisplays.statements_summary = function (results) {
    var counts = results.sentences;
    var countsIf = results.conditionals;

    var widgetContent = $('<div class="content"></div>');
    var heading = $('<div class="tool_results_heading">Number of statements of each type used in the '+results.kb+
        ' knowledge base...</div>');
    var table = $('<table id="statements_summary_table" class="sortable"></table>');
    $(table).append('<thead><tr><th>Type</th><th>Number of statements</th><th>Conditions attached</th></tr></thead>');
    var types = ['all', 'attribute', 'causal', 'comparison', 'link'];
    var tbody = $('<tbody></tbody>');
    $(table).append(tbody);
    $.each(types, function(i, type) {
        $(tbody).append('<tr><td>'+type+'</td><td>'+counts[type]+'</td><td>'+countsIf[type]+'</td></tr>');
    });
    $(widgetContent).append(heading).append(table);
    return {jqueryObject:widgetContent, html:widgetContent[0].innerHTML};
};
*/
AKTdisplays.statements_summary = function (results) {
    var widgetContent = AKTdisplays.tabulate(results).jqueryObject;
    return {jqueryObject:widgetContent, html:widgetContent[0].innerHTML};
};


// =======================================================================================
// Number of formal_terms of each type
AKTtools.formal_terms_usage = function (kbId) {
    var counts = {all:0, action:0, attribute:0, comparison:0, link:0, object:0, process:0, value:0};
    var formalTerms = AKT.kbs.kbId.formal_terms;
    $.each(formalTerms, function(i,formalTerm) {
        counts.all += 1;
        counts[formalTerms.type] += 1;
    });
    return {kb:kbId, formal_terms:counts};
}; 



AKTdisplays.formal_terms_usage = function (results) {
    var counts = results.formal_terms;

    var widgetContent = $('<div class="content"></div>');
    var heading = $('<div class="Formal terms usage within the '+results.kb+
        ' knowledge base</div>');
    var table = $('<table></table>');
    $(table).append('<tr><td>Type</td><td>Number of formal terms</td><</tr>');
    var types = {all, action, attribute, comparison, link, object, process, value};
    $.each(types, function(i, type) {
        $(table).append('<tr><td>'+type+'</td><td>'+counts[type]+'</td></tr>');
    });
    $(widgetContent).append(heading).append(table);

    return {jqueryObject:widgetContent, html:widgetContent[0].innerHTML};
};



// =======================================================================
AKTtools.knowledge_base_report = function (kbId) {


};


// =======================================================================
AKTtools.number_of_synonyms = function (kbId) {
    var count = 0;
    $.each(formalTerms, function(i,formalTerm) {
        var synonyms = formalTerm.synonyms;
        count += synonyms.length;
    });

    return {kb:kbId, count:count};   // Need to standardise return keys
};

AKTdisplays.number_of_synonyms = function (results) {
    var widgetContent = $('<div class="content"></div>');
    var div = $('<div>'+results.count+' synonyms are used in the '+results.kb+' kowledge base</div>');
    $(widgetContent).append(div);
    return {jqueryObject:widgetContent, html:widgetContent[0].innerHTML};
};


// =======================================================================
AKTtools.number_of_statements_about_objects = function (kbId) {
    var counts = {all:0, action:0, attribute:0, comparison:0, link:0, object:0, process:0, value:0};
    var formalTerms = AKT.kbs.kbId.formal_terms;
    $.each(formalTerms, function(i,formalTerm) {
        counts.all += 1;
        counts[formalTerms.type] += 1;
    });
    return {kb:kbId, formal_terms:counts};
}; 



AKTdisplays.formal_terms_usage = function (results) {
    var counts = results.formal_terms;

    var widgetContent = $('<div class="content"></div>');
    var heading = $('<div class="Formal terms usage within the '+results.kb+
        ' knowledge base</div>');
    var table = $('<table></table>');
    $(table).append('<tr><td>Type</td><td>Number of formal terms</td><</tr>');
    var types = {all, action, attribute, comparison, link, object, process, value};
    $.each(types, function(i, type) {
        $(table).append('<tr><td>'+type+'</td><td>'+counts[type]+'</td></tr>');
    });
    $(widgetContent).append(heading).append(table);

    return {jqueryObject:widgetContent, html:widgetContent[0].innerHTML};
};





// =======================================================================

AKTdisplays.widgetTitlebar = function (widget, toolId) {
    console.debug(widget);
    var widgetTitlebar = $('<div class="titlebar">'+toolId+'<input type="button" value="X" class="dialog_close_button"/></div>');  
    $(widget.element).append(widgetTitlebar);
    $('.dialog_close_button').css({background:'yellow'});
    $('.dialog_close_button').on('click', function () {
        //var id = $(widget).parent()[0].id;
        var id = widget.element[0].id;
        $('#'+id).css({display:"none"});
    });
    return widgetTitlebar;
};



// Generic utility for generating the HTML for a table.
// The input argument has the structure:
// var table = {
//      title:String, 
//      headers:StringArray, 
//      table:ArrayOfStringArrays};
// Note that the table values are organised by row, then columns within each row.
// This is because that's how (in general) the table is built up (row-by-row),
// and also how HTML tables are organised (also row-by-row), thus making for 
// neater code in both places.
AKTdisplays.tabulate = function (tableObject) {
    
    var widgetContent = $('<div class="content"></div>');

    //$(widgetContent).append('<div class="akt_table_title">'+results.title+'</div>');

    var tableElement = $('<table id="'+tableObject.id+'_table" class="sortable akt_table"></table>');

    var thead = $('<thead class="akt_table_headers"></thead>');
    var tr = $('<tr></tr>');
    $(thead).append(tr);
    $.each(tableObject.headers, function(i,header) {
        $(tr).append('<th class="akt_table_header">'+header+'</th>');
    });
    $(tableElement).append(thead);

    var tbody = $('<tbody class="akt_table_tbody"></tbody>');
        
    $.each(tableObject.table, function(i,value) {
        var tableRow = $(('<tr class="akt_table_row"></tr>'));
        $.each(tableObject.table[i], function(j, value) {
            $(tableRow).append('<td>'+value+'</td>');
        });
        $(tbody).append(tableRow);
    });
    $(tableElement).append(tbody);

    $(widgetContent).append(tableElement);

    return {jqueryObject:widgetContent, html:widgetContent[0].innerHTML};
}

});
