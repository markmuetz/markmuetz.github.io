// This file(mainly) contains event handlers for dialog controls, ordered
// alphabetically.

// A note on the use of event.stopPropagation()...
// This is added to *every* event handler, on the grounds that the *only*
// thing we want to do with that event is the immediate task of actioning
// whatever control was interacted with (e.g. button clicked, listbox 
// selection made).   It is important to stop events bubbling up to the 
// level of the panel, because there is a general-purpose handler (for the 
// selector '.panel') which brings it to the top whenever the body of the 
// panel is clicked.  If we didn't intercept clicks on buttons etc, then 
// any such click would bring its panel to the top, which is what we do not
// want if the job of the click is to open up a new dialog panel.



$(document).ready(function() {

    //AKT.cola = cola;
    //console.log('webakt1: ',cola);

    //AKT.KBs['atwima'].generateCsv();
    
    //var termx = new Termx({term:'a1'});
    //console.log(termx);


    //console.log($('#my_iframe').contents().find("p").text());

    $('section').css({display:'none'});

    var a = 'a1';
    var ol = {a1:99};
    var ol1 = {[a]:98};

    var termx = new Termx({term_id:'a1'});
    termx.addTerm('b1');

    // Dialog windows
    $( "#dialog1" ).dialog({
        autoOpen:  false,
        closeText: ''
    });

/*
    var diagram = new Diagram('diagram1','systo',{meta:{},nodes:{},arcs:{}});
    diagram.convertCausalToSysto();
    console.log(diagram);
    diagram.graphLayoutCola();
    console.log(diagram);
    //diagram.graphLayoutSpringy();
*/
    //console.debug(JSON.stringify(AKT.kbs.atwima,null,4));
/*
    var allStatements = AKT.kbs[AKT.state.current_kb].sentences;
    var statements = AKT.booleanSearch(allStatements,'trees');
    var aktGraph = AKT.makeGraphFromStatements(statements);
    console.debug(aktGraph);
    var aktGraphLayouted = AKT.graphLayoutSpringy(aktGraph);
    console.debug(aktGraphLayouted);
    //var jointGraph = AKT.makeJointGraph(aktGraphLayouted);
    //console.debug(jointGraph);
*/

    // ===============================================================
    // Read a KB in from a local file
    // This is totally orthodox method.
    // Credits: https://stackoverflow.com/questions/4408707/jquery-read-text-file-from-file-system
    window.onload = function(event) {
        //document.getElementById('file_open').addEventListener('change', handleFileSelect, false);
    }

    // -----------------------------------------------------
    // Monitor all events (with a view to making an event-playback mechanism...)
    //$(document.body).on("click mousedown mouseup focus blur keydown change",function(e){
    //     console.log(e);
    //});

    // ------------------------------------------------------

    //$('#dialog_Metadata').dialog_Metadata();

/*
  // Writing a KB to file.
  // This is unorthodox, probably deprecated, and might not work in the future.
    // From http://jsfiddle.net/bntoejzh/
    var textFile = null;
    var makeTextFile = function (text) {
        var data = new Blob([text], {type: 'text/plain'});

        // If we are replacing a previously generated file we need to
        // manually revoke the object URL to avoid memory leaks.
        if (textFile !== null) {
            window.URL.revokeObjectURL(textFile);
        }

        textFile = window.URL.createObjectURL(data);
        return textFile;
      };

      var create = document.getElementById('create');
      //var textbox = document.getElementById('textbox');

      create.addEventListener('click', function () {
          var link = document.getElementById('downloadlink');
          //link.href = makeTextFile(textbox.value);

          // TODO: check this out.  Not sure why it is "atwima1" 
          // Get name from the textbox?
          // Make up a name, and tell the user?
          link.href = makeTextFile(JSON.stringify(AKT.kbs.atwima1));
          link.style.display = 'block';
      }, false);
*/

    $('#node_object_dialog').draggable();
    $('#node_attribute_dialog').draggable();
    $('#link_causes1way_dialog').draggable();

    //var kbId = AKT.state.current_kb;

    $('#welcome').css({display:"none"});
    $('#menus').css({display:"block"});

    //var formalTerms = AKT5.formal_terms(kbId,111);
    
    //var topicTree = AKT.makeTree(kbId,"subtopics");

    //var objectTree = AKT.makeTree(kbId,"subobjects");

    AKT.processMenus();
	AKT.processFileSystemAccessAPI(); 

/*
let el1 = document.getElementById('menu_file_openkb');
el1.addEventListener('click', async () => {
  // Destructure the one-element array.
  [fileHandle] = await window.showOpenFilePicker();
  // Do something with the file handle.
  const file = await fileHandle.getFile();
  const contents = await file.text();
  console.log(contents);
});
*/

/*  May 2023
    for (var kbId in AKT.kbs) {
        var kb = AKT.kbs[kbId];
        AKT.KBs[kbId] = new Kb({name:kbId,kb_from_file:kb});
        $('#menu_kb_selectkb').find('ul').append(
            '<li id="menu_kb_selectkb_'+kbId+'" class="menus-dropdown submenu leaf live" style="background:rgb(212,208,200);">'+
                '<a href="#" style="background: rgb(212, 208, 200); color: rgb(0, 0, 0);">'+kbId+'</a>'+
            '</li>');
    }
    AKT.changeKb('atwima');
    var kb = AKT.KBs['atwima'];
    kb.extractFormalTerms();

    //kb.crosscheckFormalTerms();

    var kbIds = [];
    for (kbId in AKT.kbs) {
        kbIds.push(kbId);
    }
*/

    // 'current_kb' is the last KB used, whatever its ID.
	AKT.loadKbFromLocalStorage('current_kb');


    //AKT.KBs.atwima.buildKbFromCsv(AKT.bulk.statements,AKT.bulk.sources);

    //AKT.loadSubmenus('menu_kb_selectkb',kbIds,false);

    //var filteredStatements = AKT.KBs.atwima.filter({type:'attribute'}).filter({conditional:'yes'});
    //var filteredStatements = AKT.KBs.atwima.filter({formal_term:'nyanya'});
    //console.log(AKT.KBs.atwima._filteredStatements);

    $('#zoom_in').on('click', function() {
        console.debug('zoom_in');
        $('#workspace').css({transform:'scale(1)'});
    });
    $('#zoom_out').on('click', function() {
        console.debug('zoom_out');
        $('#workspace').css({transform:'scale(0.6)','transform-origin': '0 0 0'});
    });

    // Miscellaneous event handlers for built-in dialog windows
    $('#button_file_new').on('click',function() {
        var a = $('#input_file_new').val();
        console.log('.button_file_new button clicked');
        alert('clicked '+a+'...'+b);
    });

/*
    var sentences = AKT.kbs[kbId].sentences;
    for (var i=0; i<sentences.length; i++) {
        var sentence = sentences[i];
        var json = AKT.convert_formal_to_json(sentence.formal);
        if (json) {
            var english = AKT.convert_json_to_english(json);
            if (english) {
                sentence.english = english.replace(/  /g," ");
            } else {
                sentence.english = 'ERROR json>english: '+sentence.formal;
                console.debug(sentence.english);
            }
        } else {
            sentence.english = 'ERROR formal>json: '+sentence.formal;
            console.debug(sentence.english);
        }           
    }
*/
    // Elements that respond to a click highlighted in yellow.
    $('#welcome60').css({background:'yellow'});
    $('.dialog_close_button').css({background:'yellow'});
    $('#boolean_search110').css({background:'yellow'});
    $('#boolean_search800').css({background:'yellow'});
    $('#general_memo101').css({background:'yellow'});
    $('#topicHierarchies400').css({background:'yellow'});
    $('#addtopic101').css({background:'yellow'});
    $('#macros102').css({background:'yellow'});
    $('#macros400').css({background:'yellow'});
    $('#macros_montage102').css({background:'yellow'});
    $('#macros_montage400').css({background:'yellow'});
    $('#statementdetails100').css({background:'yellow'});
    $('#statementdetails102').css({background:'yellow'});
    $('#statementdetails802').css({background:'yellow'});
    $('#topicHierarchies103').css({background:'yellow'});
    $('#topicHierarchies400').css({background:'yellow'});
    $('#topic_hierarchy402').css({background:'yellow'});
    $('#topic_hierarchy102').css({background:'yellow'});
    $('#topic_hierarchy104').css({background:'yellow'});
    $('#topic_hierarchy105').css({background:'yellow'});
    $('#topic_hierarchy107').css({background:'yellow'});
    $('#topic_hierarchy108').css({background:'yellow'});
    $('#viewallstatements102').css({background:'yellow'});
    $('#viewallstatements400').css({background:'yellow'});

    $('.panel').draggable({containment:'#workspace',handle:".title-bar"});

    AKT.menusClickHandler($('#menus'));

/*
    if (!AKT.kbs[kbId].extras) {
        AKT.kbs[kbId].extras = {};
    }
    var topicTree = AKT.makeTree(kbId, "subtopics");
    AKT.kbs[kbId].extras.topicTree = topicTree;
*/
    $('#div_node_template_dialog').css({display:'none'});


    // Actions
    AKT.action_list = new ActionList();

    $(document).on('keydown',function(event) {
        //console.log('--',event,'--');
        //console.log(AKT.state);
        //console.log('****');
        if (AKT.state.stepping_through_recording) {
            //var nextEventMessage = AKT.action_list._actions[AKT.state.stepCounter+1]._prompt;
            $('#message').html(nextEventMessage);
            var key = event.originalEvent.key;
            //if (key === 'a') {
                AKT.action_list.oneStep(AKT.action_list._actions);
            //}
        }
    });


    // For getting filename, see https://stackoverflow.com/questions/24245105/how-to-get-the-filename-from-the-javascript-filereader
    function handleFileSelect(event) {
        var mode = 'text';   // 'json'
        var fileReader = new FileReader();
        fileReader.fileName = document.getElementById('file_open').files[0].name;
        console.log('##1 ',fileReader.fileName);
        fileReader.onload = function(event) {
            var fileName = event.target.fileName;
            var fname = fileName.substring(0,fileName.lastIndexOf('.'));
            var kbId = fname;
            console.log('\n===', fname);
            var kbText = event.target.result;
            console.debug(kbText);
            if (mode === 'json') {
                var kbObject = JSON.parse(kbText);
                console.log(kbObject);
                //AKT.state.current_kb = kbId;
                AKT.changeKb(kbId);
                AKT.kbs[kbId] = kbObject;
            } else {    // text
                var lines = kbText.split('\n');
                for (var i=0; i<lines.length; i++) {
                    if (lines[i].charAt(0) !== '%' && lines[i].charAt(0) !== '') {
                        console.log('\n',lines[i]);
                        var bits = lines[i].split(':');
                        var sourceId = bits[0];
                        var formal = bits[1];
                        console.log('...'+formal+'...');
                        var json = AKT.convert_formal_to_json(formal);
                        console.log(json);
                        if (json) {
                            var english = AKT.translate(json);
                            //console.debug(english);
                        } else {
                            //alert('Error in the line "'+lines[i]);
                        }
                    }
                }
            }
            var li = '<li id="menu_kb_selectkb_'+fname+
                '" class="menus-dropdown submenu leaf live '+fname+'" style="background:white;" name="'+fname+'"><a href="#">'+fname+
                '</a></li>';
            $('#menu_kb_closekb > ul').append(li);
            $('#menu_kb_selectkb > ul').append(li);
            $('#menu_kb_freezeopenkb > ul').append(li);
        }
        var file = event.target.files[0];
        fileReader.readAsText(file);
        document.getElementById('file_open').value = null;
        $('#open_kb').css({display:'none'});
    }
	


});

