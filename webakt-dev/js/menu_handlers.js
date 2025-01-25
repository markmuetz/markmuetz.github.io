// This is one way of handling menu commands - separate function for each command...


// ================================================ MENU: File


AKT.menuHandler.menu_file_newkb = function(arg) {

    // This is special code for handling the built-in prompt() function for the event-recording
    // mechanism.
    // The alternative is to use a regular dialog window, and record its creation and OK-ing events,
    // and the name entered by the user.
    if (AKT.state.playing_events) {
        kbId = arg;
    } else {
        var kbId = prompt('New KB ID (just use letters, digits and underscores):','newkb');
        AKT.recordEvent({
            file:'menu_handlers.js',
            function:'AKT.menuHandler.menu_file_newkb()',
            event:'click',
            element:'null',
            finds:[],
            value: kbId,
            message:'Clicked on .button_save in statement_details.js.'
        });
    }
    var name = kbId;
    var title = kbId;

    var kb = new Kb({name:name});
	AKT.KBs[kbId] = kb;
    AKT.changeKb(kbId);
	AKT.saveKbInLocalStorage(kbId);
	
    //AKT.showDialog('metadata');
    //$('#metadata').draggable({containment:'#workspace',handle:".title-bar"});
    //$(this).find('a').css({background:'#d0d0d0',color:'black'});       
    //AKT.KBs[kbId].buildKbFromCsv(AKT.bulk.statements,AKT.bulk.sources);

    // Add to KB selectkb and recent menus
/*
    $('#menu_file_selectkb').find('ul').append(   // Note: kb_selectkb is legacy name.  Should change to file_selectkb
        '<li id="menu_file_selectkb_'+kbId+'" class="menus-dropdown submenu leaf live" style="background:rgb(212,208,200);">'+
            '<a href="#" style="background: rgb(212, 208, 200); color: rgb(0, 0, 0);">'+kbId+'</a>'+
        '</li>');

    $('#menu_file_openkbrecent').find('ul').prepend(
        '<li id="menu_kb_openkbrecent_'+kbId+'" class="menus-dropdown submenu leaf live openkbrecent" style="background:rgb(212,208,200);" data-kbid:"'+kbId+'">'+
            '<a href="#" style="background: rgb(212, 208, 200); color: rgb(0, 0, 0);">'+kbId+'</a>'+
        '</li>');
*/
/*
    AKT.menuHandler.menu_file_selectkb_newkb = function() {
        console.log('kb_selectkb_newkb',this,$(this),$(this).text());
        AKT.incrementZindex("menu_handlers.js: AKT.menuHandler.menu_file_selectkb()");
        //$('#select_kb').css({display:"block", float:"none", "z-index":AKT.state.zindex, zindex:AKT.state.zindex});
        $(this).find('a').css({background:'#d0d0d0',color:'black'});       
        AKT.state.current_kb = 'newkb';   
        $('#current_kb_title').text('newkb');
        alert('Current KB changed to newkb');
    };
*/
/*
    $('.openkbrecent').on('click', function(event) {
        var kbId = $(this).find('a').text();
	    AKT.loadKbFromLocalStorage(kbId);
    });
*/

/*
    $('#menu_file_selectkb_newkb > a').on('click',function(event){
        var menuItemId = $(this).parent().attr('id');
        console.log('MENU: Clicked on menu item: ',menuItemId,'\n',event);
        console.log($('#'+menuItemId).attr('class').split(/\s+/));
        //if ($(this).parent().hasClass('leaf')) {
        //    AKT.menuHandler[menuItemId]();
        //}

        if ($('#'+menuItemId).attr('class').split(/\s+/).includes('leaf')) {
            var step1 = {
                eventType:'highlight',
                selector:'#'+menuItemId+' > a'
            };
            var step2 = {
                eventType:'click',
                selector:'#'+menuItemId
            };
        } else {
            var step1 = {
                eventType:'highlight',
                selector:'#'+menuItemId+' > a'
            };
            var step2 = {
                eventType:'click',
                selector:'#'+menuItemId+' > a'
            };
        }
        AKT.eventRecord.push(step1);
        AKT.eventRecord.push(step2);


        if (AKT.menuHandler[menuItemId]) {
            AKT.menuHandler[menuItemId]();
            $('.submenu').hide();
        }
        event.preventDefault()
        $(this).parent().find('ul').first().toggle(100);
        $(this).css({background:'#000090',color:'#d4d0c8'});
        $(this).parent().siblings().find('ul').hide();
        AKT.state.currentMenuItem = $(this).parent().find('ul');

        //Hide menu when clicked outside
        $(this).parent().find('ul').mouseleave(function(){  
            var thisUI = $(this);
            $('html, .panel, button, select').click(function(){
                thisUI.hide();
                $('html').unbind('click');
                //$('li.menus-dropdown > a').css({background:'#d0d0d0',color:'#707070'});
                var elements = $('li.menus-dropdown > a');
                $.each(elements, function(i,element) {
                    var parent = $(this).parent();
                    if (parent.hasClass('inactive')) {
                        $(this).css({background:'#d4d0c8',color:'#707070'});
                    } else if (parent.hasClass('active')) {
                        $(this).css({background:'#d4d0c8',color:'black'});
                    } else if (parent.hasClass('live')) {
                        $(this).css({background:'#d4d0c8',color:'black'});
                    } else {
                        $(this).css({background:'#d4d0c8',color:'black'});
                    }
                });
            });
        });  
*/
/*
        {eventType:'highlight',selector:'#menu_kb'},
        {eventType:'menuclick',selector:'#menu_kb > a'},
        {eventType:'highlight',selector:'#menu_kb_statements > a'},
        {eventType:'menuleafclick',selector:'#menu_kb_statements'},
        {eventType:'menuclick',selector:'#menu_maps > a'},
*/
/*
        var step1 = {
            eventType:'highlight',
            selector:'#'+$(panelDiv).attr('id')+' .'+event.target.classList[0]
        };
        var step2 = {
            eventType:'click',
            selector:'#'+$(panelDiv).attr('id')+' .'+event.target.classList[0]
        };
        AKT.eventRecord.push(step1);
        AKT.eventRecord.push(step2);
*/
/*
    });
*/
    console.log('Added');

    $(this).find('a').css({background:'#d0d0d0',color:'black'});  
    //AKT.incrementZindex("menu_handlers.js: AKT.menuHandler.menu_kb_formalterms()");
    var eventShiftKey = event ? event.shiftKey : null;

    var panel = AKT.panelise({
        widget_name:'metadata',
        position:{left:'20px',top:'20px'},
        size:{width:'550px',height:'540px'},
        shift_key:eventShiftKey,
        options:{kbId:AKT.state.current_kb}
    });

};



AKT.menuHandler.menu_file_openkbrecent = function() {
    console.log('openkbrecent');
    var recentKbsString = localStorage.getItem('recent_kbs');
    $('#menu_file_openkbrecent').find('ul').empty();
    if (recentKbsString) {
        // It's easier and safer to regenerate the submenu of recent KB IDs than
        // to manipulate a previous submenu.
        var recentKbs = JSON.parse(localStorage.getItem('recent_kbs'));
        console.log(recentKbs);
        for (var i=0; i<recentKbs.length; i++) {
            var kbId = recentKbs[i];
            var kbrecentLi = $('<li id="menu_file_openkbrecent_'+kbId+'" class="menus-dropdown submenu leaf live openkbrecent" style="background:rgb(212,208,200);" data-kbid:"'+kbId+'">'+
                    '<a href="#" style="background: rgb(212, 208, 200); color: rgb(0, 0, 0);">'+kbId+'</a>'+
                '</li>');
            $('#menu_file_openkbrecent').find('ul').append(kbrecentLi);
            $(kbrecentLi).on('click',function() {
                var kbId = $(this).text();
                console.log(kbId);
                AKT.loadKbFromLocalStorage(kbId);
                console.log(AKT.KBs);
                $('.menus-dropdown').find('ul').hide();
            })
        }
    } else { 
        alert('No recent KBs available.');
    }
};

AKT.menuHandler.menu_file_selectkb = function() {
    console.log('selectkb');
    $('#menu_file_selectkb').find('ul').empty();
    if (Object.keys.length>0) {
        // It's easier and safer to regenerate the submenu of recent loaded KBs than
        // to manipulate a previous submenu.
        for (var kbId in AKT.KBs) {
            var kbLi = $('<li id="menu_file_selectkb_'+kbId+'" class="menus-dropdown submenu leaf live selectkb" style="background:rgb(212,208,200);" data-kbid:"'+kbId+'">'+
                    '<a href="#" style="background: rgb(212, 208, 200); color: rgb(0, 0, 0);">'+kbId+'</a>'+
                '</li>');
            $('#menu_file_selectkb').find('ul').append(kbLi);
            $(kbLi).on('click',function() {
                var kbId = $(this).text();
                AKT.changeKb(kbId);
                AKT.showMessage('Changed to KB '+kbId);
                $('.menus-dropdown').find('ul').hide();
            })
        }

    } else { 
        alert('No KBs available.');
    }
};


// The actual code for opening a file is in js/FileSystemAccessAPI.js,
// which is initialised with the function call
// 		AKT.processFileSystemAccessAPI();
// in js/webakt1.js
AKT.menuHandler.menu_file_openkb = function() {
    console.log('\n** Doing menu_file_openkb: state: ',AKT.state);
    var kbId = AKT.state.current_kb;
	AKT.changeKb(kbId);
    var kb = AKT.kbs[kbId];
    var source = 2;   // 1=current, 2=from file
    if (source === 1) {
        console.log(kbId);
        console.log(kb);
        //$('#current_kb_title').text(kbId);
        AKT.changeKb(kbId);

        AKT.dialogOpener.metadata(kbId);
        $(this).find('a').css({background:'#d0d0d0',color:'black'});       

    } else if (source === 2) {
        AKT.incrementZindex("menu_handlers.js: AKT.menuHandler.menu_kb_openkb()");
        //$('#open_kb').css({display:"block", float:"none", "z-index":AKT.state.zindex, zindex:AKT.state.zindex});
        //$('#div_file_open').css({display:"block", "z-index":AKT.state.zindex, zindex:AKT.state.zindex});
        $(this).find('a').css({background:'#d0d0d0',color:'black'});         
    }
};


AKT.menuHandler.menu_file_opensamplekbs = function() {
    var source = 2;   // 1=current, 2=from file
    if (source === 1) {
        console.log(kbId);
        console.log(kb);
        //$('#current_kb_title').text(kbId);
        AKT.changeKb(kbId);

        AKT.dialogOpener.metadata(kbId);
        $(this).find('a').css({background:'#d0d0d0',color:'black'});       

    } else if (source === 2) {
        AKT.incrementZindex("menu_handlers.js: AKT.menuHandler.menu_kb_openkb()");
        $(this).find('a').css({background:'#d0d0d0',color:'black'});   
      
        // Yes, I do realise that I can collapse the following duplicated code...
        // Ego
        var kbId ='ego';
        var kbFromFile = AKT.kbs[kbId];
        AKT.KBs[kbId] = new Kb({name:kbId,kb_from_file:kbFromFile});
        $('#menu_file_selectkb').find('ul').append(
            '<li id="menu_file_selectkb_'+kbId+'" class="menus-dropdown submenu leaf live" style="background:rgb(212,208,200);">'+
                '<a href="#" style="background: rgb(212, 208, 200); color: rgb(0, 0, 0);">'+kbId+'</a>'+
            '</li>');
        var kb = AKT.KBs[kbId];
        kb.extractFormalTerms();
		AKT.saveKbInLocalStorage(kbId);
      
        // Atwima
        kbId = 'atwima';
        var kbFromFile = AKT.kbs[kbId];
        AKT.KBs[kbId] = new Kb({name:kbId,kb_from_file:kbFromFile});
        $('#menu_file_selectkb').find('ul').append(
            '<li id="menu_file_selectkb_'+kbId+'" class="menus-dropdown submenu leaf live" style="background:rgb(212,208,200);">'+
                '<a href="#" style="background: rgb(212, 208, 200); color: rgb(0, 0, 0);">'+kbId+'</a>'+
            '</li>');
        AKT.changeKb(kbId);
        var kb = AKT.KBs[kbId];
        kb.extractFormalTerms();
		AKT.saveKbInLocalStorage(kbId);

        AKT.showMessage('Loaded Atwima and Ego knowledge bases: current is Atwima.');
    }
};

// The actual code for saving a file is in js/FileSystemAccessAPI.js,
// which is initialised with the function call
// 		AKT.processFileSystemAccessAPI();
// in js/webakt1.js

AKT.menuHandler.menu_file_savekb = function() {
    console.log('\n** Doing menu_file_savekb: state: ',AKT.state);
    //var kbId = AKT.state.current_kb;
    var kbId = AKT.state.current_kb;
    AKT.changeKb(kbId);
    var kb = AKT.kbs[kbId];
    var source = 2;   // 1=current, 2=from file
    if (source === 1) {
        console.log(kbId);
        console.log(kb);
        //$('#current_kb_title').text(kbId);
        AKT.changeKb(kbId);

        AKT.dialogOpener.metadata(kbId);
        $(this).find('a').css({background:'#d0d0d0',color:'black'});       

    } else if (source === 2) {
        AKT.incrementZindex("menu_handlers.js: AKT.menuHandler.menu_kb_savekb()");
        $(this).find('a').css({background:'#d0d0d0',color:'black'});         
    }
};


AKT.menuHandler.menu_file_copykb = function() {
    console.log('copykb');
    $('#menu_file_selectkb').find('ul').empty();

    var kbId = AKT.state.current_kb;
    var kb = AKT.KBs[kbId];
    var newKbId = prompt('Name for copy: ','');
    var newKbObject = kb.generateJsonFromKb();
    var newKb = new Kb({kb_from_file:newKbObject});
    AKT.KBs[newKbId] = newKb;
    console.log(AKT.KBs);
    AKT.saveKbInLocalStorage(newKbId);
};


AKT.menuHandler.menu_file_clearcache = function() {
    localStorage.removeItem('current_kb');
    AKT.showMessage('Cached copy of current_kb has been removed from Local Storage.');
};



AKT.menuHandler.menu_file_bulkimport = function() {
    console.log(AKT.state);
    var kbId = AKT.state.current_kb;
    var kb = AKT.kbs[kbId];

    AKT.incrementZindex("menu_handlers.js: AKT.menuHandler.menu_kb_openkb()");
    $('#open_kb').css({display:"block", float:"none", "z-index":AKT.state.zindex, zindex:AKT.state.zindex});
    $(this).find('a').css({background:'#d0d0d0',color:'black'});         
};



AKT.menuHandler.menu_file_playback = function() {
    console.log('menu_file_playback');
    AKT.timer = setInterval(AKT.singleStep,200);
};


AKT.menuHandler.menu_file_exitfromakt = function() {
    console.log('test');
    AKT.getAllWidgetInstances();
};

AKT.menuHandler.menu_file_pagesetup = function() {
    AKT.timer = setInterval(AKT.singleStep,1500);
};

AKT.menuHandler.menu_file_user = function() {
    var userName = prompt('My name: ');
    localStorage.setItem('user',userName);
};

AKT.menuHandler.menu_file_exitfromakt = function() {
    alert('To exit, please close this window in your browser.');
};


// ================================================================= MENU: KB

AKT.menuHandler.menu_file_selectkb_atwima = function() {
    console.log('kb_selectkb_atwima',this,$(this),$(this).text());
    AKT.incrementZindex("menu_handlers.js: AKT.menuHandler.menu_file_selectkb()");
    $(this).find('a').css({background:'#d0d0d0',color:'black'});    
    AKT.state.current_kb = 'atwima';   
    $('#current_kb_title').text('Atwima');
    alert('Current KB changed to Atwima');
};


AKT.menuHandler.menu_file_selectkb_ego = function() {
    console.log('kb_selectkb_ego',this,$(this),$(this).text());
    AKT.incrementZindex("menu_handlers.js: AKT.menuHandler.menu_file_selectkb()");
    $(this).find('a').css({background:'#d0d0d0',color:'black'});       
    AKT.state.current_kb = 'ego';   
    $('#current_kb_title').text('Ego');
    alert('Current KB changed to Ego');
};


AKT.menuHandler.menu_kb_filejson = function() {
    $(this).find('a').css({background:'#d0d0d0',color:'black'});   
    var eventShiftKey = event ? event.shiftKey : null;

    var panel = AKT.panelise({
        widget_name:'json_viewer',
        position:{left:'20px',top:'20px'},
        size:{width:'400px',height:'260px'},
        shift_key:eventShiftKey,
        options:{kbId:AKT.state.current_kb, source:'internal', kb_name:AKT.state.current_kb}
    });
};


AKT.menuHandler.menu_kb_internaljson = function() {
    $(this).find('a').css({background:'#d0d0d0',color:'black'});   
    var eventShiftKey = event ? event.shiftKey : null;

    var panel = AKT.panelise({
        widget_name:'json_viewer',
        position:{left:'20px',top:'20px'},
        size:{width:'400px',height:'260px'},
        shift_key:eventShiftKey,
        options:{kbId:AKT.state.current_kb, source:'file', kb_name:AKT.state.current_kb}
    });
};


AKT.menuHandler.menu_kb_images = function() {
    $(this).find('a').css({background:'#d0d0d0',color:'black'});   
    var eventShiftKey = event ? event.shiftKey : null;

    var panel = AKT.panelise({
        widget_name:'images',
        position:{left:'20px',top:'20px'},
        size:{width:'500px',height:'400px'},
        shift_key:eventShiftKey,
        options:{kbId:AKT.state.current_kb}
    });
};


AKT.menuHandler.menu_kb_summary = function(event) {
    $(this).find('a').css({background:'#d0d0d0',color:'black'});  
    var eventShiftKey = event ? event.shiftKey : null;

    var panel = AKT.panelise({
        widget_name:'summary',
        position:{left:'20px',top:'20px'},
        size:{width:'550px',height:'540px'},
        shift_key: eventShiftKey,
        options:{kbId:AKT.state.current_kb}
    });
};


AKT.menuHandler.menu_kb_metadata = function(event) {
    $(this).find('a').css({background:'#d0d0d0',color:'black'});  
    var eventShiftKey = event ? event.shiftKey : null;

    var panel = AKT.panelise({
        widget_name:'metadata',
        position:{left:'20px',top:'20px'},
        size:{width:'550px',height:'540px'},
        shift_key: eventShiftKey,
        options:{kbId:AKT.state.current_kb}
    });
};


AKT.menuHandler.menu_kb_memos = function() {
    AKT.incrementZindex("menu_handlers.js: AKT.menuHandler.menu_kb_formalterms()");
    $(this).find('a').css({background:'#d0d0d0',color:'black'});  
    var dialog = 'dialog_Memos';
    AKT.openDialog(dialog, event.shiftKey, {left:'20px',top:'20px',width:'500px',height:'500px'}, 
        {kbId:AKT.state.current_kb});
};


AKT.menuHandler.menu_kb_formaltermsxxx = function() {
    $(this).find('a').css({background:'#d0d0d0',color:'black'});  
    var eventShiftKey = event ? event.shiftKey : null;

    var panel = AKT.panelise({
        widget_name:'formal_terms',
        position:{left:'20px',top:'20px'},
        size:{width:'410px',height:'375px'},
        shift_key: eventShiftKey,
        options:{kbId:AKT.state.current_kb}
    });
};


AKT.menuHandler.menu_kb_formalterms = function() {
    $(this).find('a').css({background:'#d0d0d0',color:'black'});  
    var eventShiftKey = event ? event.shiftKey : null;

    var panel = AKT.panelise({
        widget_name:'collection',
        position:{left:'20px',top:'20px'},
        size:{width:'410px',height:'375px'},
        shift_key: eventShiftKey,
        options:{kbId:AKT.state.current_kb,item_type:'formal_term'}
    });
};


AKT.menuHandler.menu_kb_sources = function() {
    $(this).find('a').css({background:'#d0d0d0',color:'black'});    
    var eventShiftKey = event ? event.shiftKey : null;

    var panel = AKT.panelise({
        widget_name:'collection',
        position:{left:'20px',top:'20px'},
        size:{width:'470px',height:'390px'},
        shift_key: eventShiftKey,
        options:{kbId:AKT.state.current_kb,item_type:'source'}
    });
};


AKT.menuHandler.menu_kb_statementsxxx = function() {
    $(this).find('a').css({background:'#d0d0d0',color:'black'});   
    var eventShiftKey = event ? event.shiftKey : null;

    var panel = AKT.panelise({
        widget_name:'statements',
        position:{left:'20px',top:'20px'},
        size:{width:'550px',height:'540px'},
        shift_key: eventShiftKey,
        options:{kbId:AKT.state.current_kb}
    });
};


AKT.menuHandler.menu_kb_statements = function() {
    $(this).find('a').css({background:'#d0d0d0',color:'black'});   
    var eventShiftKey = event ? event.shiftKey : null;

    var panel = AKT.panelise({
        widget_name:'collection',
        position:{left:'20px',top:'20px'},
        size:{width:'550px',height:'540px'},
        shift_key: eventShiftKey,
        options:{kbId:AKT.state.current_kb,item_type:'statement'}
    });
};


AKT.menuHandler.menu_kb_derivations = function() {
    AKT.incrementZindex("menu_handlers.js: AKT.menuHandler.menu_kb_derivations()");
    $('#derivations').css({display:"block", float:"none", "z-index":AKT.state.zindex, zindex:AKT.state.zindex});
    $(this).find('a').css({background:'#d0d0d0',color:'black'});       
};


AKT.menuHandler.menu_kb_synonyms = function() {
    AKT.incrementZindex("menu_handlers.js: AKT.menuHandler.menu_kb_synonyms()");
    $(this).find('a').css({background:'#d0d0d0',color:'black'});     
    var dialog = 'dialog_Generic';
    AKT.openDialog(dialog, event.shiftKey, {left:'20px',top:'20px',width:'550px',height:'540px'}, {kbId:AKT.state.current_kb, widget_name:'synonyms'});

};


AKT.menuHandler.menu_kb_objecthierarchies = function() {
    $(this).find('a').css({background:'#d0d0d0',color:'black'});       
    var eventShiftKey = event ? event.shiftKey : null;

    var panel = AKT.panelise({
        widget_name:'collection',
        position:{left:'20px',top:'20px'},
        size:{width:'450px',height:'540px'},
        shift_key: eventShiftKey,
        options:{kbId:AKT.state.current_kb, tree_type:'object',item_type:'object_hierarchy'}
    });
};


AKT.menuHandler.menu_kb_topics = function() {
    AKT.incrementZindex("menu_handlers.js: AKT.menuHandler.menu_kb_topics()");
    var eventShiftKey = event ? event.shiftKey : null;

    var panel = AKT.panelise({
        widget_name:'collection',
        position:{left:'20px',top:'20px'},
        size:{width:'410px',height:'375px'},
        shift_key: eventShiftKey,
        options:{kbId:AKT.state.current_kb,item_type:'topic'}
    });
};


AKT.menuHandler.menu_kb_topichierarchies = function() {
    $(this).find('a').css({background:'#d0d0d0',color:'black'});       
    var eventShiftKey = event ? event.shiftKey : null;

    var panel = AKT.panelise({
        widget_name:'collection',
        position:{left:'20px',top:'20px'},
        size:{width:'410px',height:'375px'},
        shift_key: eventShiftKey,
        options:{kbId:AKT.state.current_kb, tree_type:'topic', item_type:'topic_hierarchy'}
    });
};


AKT.menuHandler.menu_kb_booleansearch = function() {
    $(this).find('a').css({background:'#d0d0d0',color:'black'});   
    var eventShiftKey = event ? event.shiftKey : null;

    console.log(9100,AKT.state.current_kb);
    var panel = AKT.panelise({
        widget_name:'boolean_search',
        position:{left:'20px',top:'20px'},
        size:{width:'500px',height:'400px'},
        shift_key: eventShiftKey,
        options:{kbId:AKT.state.current_kb}
    });
};


// ================================================= MENU: DIAGRAM


AKT.menuHandler.menu_diagram_diagrams = function() {
    $(this).find('a').css({background:'#d0d0d0',color:'black'});   
    var eventShiftKey = event ? event.shiftKey : null;

    var panel = AKT.panelise({
        widget_name:'collection',
        position:{left:'20px',top:'20px'},
        size:{width:'600px',height:'540px'},
        shift_key:eventShiftKey,
        options:{kbId:AKT.state.current_kb, item_type:'diagram'}
    });
};


AKT.menuHandler.menu_diagram_nodes = function() {
    $(this).find('a').css({background:'#d0d0d0',color:'black'});   
    var eventShiftKey = event ? event.shiftKey : null;

    var panel = AKT.panelise({
        widget_name:'collection',
        position:{left:'20px',top:'20px'},
        size:{width:'600px',height:'540px'},
        shift_key:eventShiftKey,
        options:{kbId:AKT.state.current_kb, item_type:'diagram'}
    });
};


AKT.menuHandler.menu_diagram_arcs = function() {
    $(this).find('a').css({background:'#d0d0d0',color:'black'});   
    var eventShiftKey = event ? event.shiftKey : null;

    var panel = AKT.panelise({
        widget_name:'collection',
        position:{left:'20px',top:'20px'},
        size:{width:'600px',height:'540px'},
        shift_key:eventShiftKey,
        options:{kbId:AKT.state.current_kb, item_type:'diagram'}
    });
};



AKT.menuHandler.menu_diagram_newdiagram = function() {
/*
    var widgetPanelId = AKT.createWidgetPanel(AKT.state.current_tool);
    $('#'+widgetPanelId).diagram({kb:AKT.state.current_kb});
    AKT.incrementZindex("menu_handlers.js: AKT.menuHandler.menu_diagram_showkbdiagrams");
    $('#'+widgetPanelId).css({"z-index":AKT.state.zindex});
*/
    $(this).find('a').css({background:'#d0d0d0',color:'black'});   
    //AKT.incrementZindex("menu_handlers.js: AKT.menuHandler.menu_kb_statements()");
    //AKT.openDialog('dialog_Generic', event.shiftKey, {left:'20px',top:'20px',width:'600px',height:'540px'},{kbId:AKT.state.current_kb, widget_name:'statements'});
    var eventShiftKey = event ? event.shiftKey : null;

    var panel = AKT.panelise({
        widget_name:'diagram',
        position:{left:'20px',top:'20px'},
        size:{width:'600px',height:'540px'},
        shift_key:eventShiftKey,
        options:{kbId:AKT.state.current_kb}
    });
};

AKT.menuHandler.menu_diagram_fromtopicxxx = function() {
/*
    var widgetPanelId = AKT.createWidgetPanel(AKT.state.current_tool);
    $('#'+widgetPanelId).diagram({kb:AKT.state.current_kb});
    AKT.incrementZindex("menu_handlers.js: AKT.menuHandler.menu_diagram_showkbdiagrams");
    $('#'+widgetPanelId).css({"z-index":AKT.state.zindex});
*/
    $(this).find('a').css({background:'#d0d0d0',color:'black'});   
    //AKT.incrementZindex("menu_handlers.js: AKT.menuHandler.menu_kb_statements()");
    //AKT.openDialog('dialog_Generic', event.shiftKey, {left:'20px',top:'20px',width:'600px',height:'540px'},{kbId:AKT.state.current_kb, widget_name:'statements'});
    var eventShiftKey = event ? event.shiftKey : null;

    var panel = AKT.panelise({
        widget_name:'diagram_from_topic',
        position:{left:'20px',top:'20px'},
        size:{width:'600px',height:'540px'},
        shift_key: eventShiftKey,
        options:{kbId:AKT.state.current_kb}
    });
};

// ================================================= MENU: TOOLS

// ********* TODO: 
// Use only Quick Tool until the tools at the end of the
// menu_tools_useatool_systemtools_knowledgeanalysis_singlekb... are handled
// correctly.   Personally, I think it's better *NOT* to have the individual 
// Tools listed as a menu, but just to take people directly to the macros dialog.

AKT.menuHandler.menu_tools_usetool_systemtools_knowledgeanalysis_singlekb_statementssummary = function() {
    AKT.incrementZindex("AKT.menuHandler.menu_tools_useatool_systemtools_knowledgeanalysis_singlekb_statementssummary()");
    $('#macros').css({display:"block", float:"none", "z-index":AKT.state.zindex, zindex:AKT.state.zindex});
    $('#macros400').empty();
    var tools = ['statements_summary','boolean_search','species_report','display_hierarchy','diagram'];
    for (var i=0; i<tools.length; i++) {
        var option = $('<option value="'+tools[i]+'">'+tools[i]+'</option>');
        $('#macros400').append(option);
    }
    $(this).find('a').css({background:'#d0d0d0',color:'black'});       
};

AKT.menuHandler.menu_tools_usetool_systemtools_knowledgeanalysis_singlekb_booleansearch = function() {
    AKT.incrementZindex("AKT.menuHandler.menu_tools_useatool_systemtools_knowledgeanalysis_singlekb_booleansearch()");
    $('#macros').css({display:"block", float:"none", "z-index":AKT.state.zindex, zindex:AKT.state.zindex});
    $('#macros400').empty();
    var tools = ['statements_summary','boolean_search','species_report','display_hierarchy','diagram'];
    for (var i=0; i<tools.length; i++) {
        var option = $('<option value="'+tools[i]+'">'+tools[i]+'</option>');
        $('#macros400').append(option);
    }
    $(this).find('a').css({background:'#d0d0d0',color:'black'});       
};

AKT.menuHandler.menu_tools_useatool_systemtools_knowledgeanalysis_singlekb_speciesreport = function() {
    AKT.incrementZindex("AKT.menuHandler.menu_tools_useatool_systemtools_knowledgeanalysis_singlekb_species_report()");
    $('#macros').css({display:"block", float:"none", "z-index":AKT.state.zindex, zindex:AKT.state.zindex});
    $('#macros400').empty();
    var tools = ['statements_summary','boolean_search','species_report','display_hierarchy','diagram'];
    for (var i=0; i<tools.length; i++) {
        var option = $('<option value="'+tools[i]+'">'+tools[i]+'</option>');
        $('#macros400').append(option);
    }
    $(this).find('a').css({background:'#d0d0d0',color:'black'});       
};


AKT.menuHandler.menu_tools_loadtool = function() {
    console.log('Load a tool - a webAKT widget - as a <script>');
    $(this).find('a').css({background:'#d0d0d0',color:'black'});       
    var eventShiftKey = event ? event.shiftKey : null;

    // Pre-filled to simpify testing.
    var url = prompt('Tool URL:','file:///home/robert/Projects/webakt/dev/tools/statements_summary.js');
    loadTool(url);
};

// This is called from both AKT.menuHandler.menu_tools_loadtool and 
// AKT.menuHandler.menu_tools_loadtoolbox, so needs to be at top level.
function loadTool(url) {
    var scriptElem = document.createElement('script');
    scriptElem.setAttribute('src',url);
    scriptElem.setAttribute('type','text/javascript');    
    scriptElem.setAttribute('async',true);

    document.body.appendChild(scriptElem);

    scriptElem.addEventListener('load', (ev) => {
        console.log('webAKT tool loaded successfully from\n'+url);
    });
    scriptElem.addEventListener('error', (ev) => {
        console.log('Error',ev);
        alert('Failed to load webAKT tool from\n'+url);
    });
}

AKT.menuHandler.menu_tools_loadtoolbox = function() {
    console.log('Load a toolbox - webAKT widgets - as <script>s');
    $(this).find('a').css({background:'#d0d0d0',color:'black'});       
    var eventShiftKey = event ? event.shiftKey : null;

    // Pre-filled to simplify testing.
    var url = prompt('Toolbox URL:','file:///home/robert/Projects/webakt/dev/tools/rm1.js');
    loadToolbox(url);

    function loadToolbox(url) {
        var scriptElem = document.createElement('script');
        scriptElem.setAttribute('src',url);
        scriptElem.setAttribute('type','text/javascript');    
        scriptElem.setAttribute('async',true);

        document.body.appendChild(scriptElem);

        // Note that this is recursive!   If a toolbox includes itself
        // as an entry, then you will get stuck in an infinite loop!
        // Needs to include a stopping test to prevent this.
        scriptElem.addEventListener('load', (ev) => {
            if (AKT.toolbox) {
                for (var entryId in AKT.toolbox) {
                    var entry = AKT.toolbox[entryId];  // Can be of type 'tool' or type 'toolbox'
                    if (entry.type === 'tool') {
                        if (entry.url) {
                            loadTool(entry.url);
                        } else {
                            alert('No url provided');
                        }
                    } else if (type === 'toolbox') {   // This is the recursive bit.
                        if (entry.url) {
                            loadToolbox(entry.url);
                        } else {
                            alert('No url provided');
                        }
                    }
                }
            };
        });
        scriptElem.addEventListener('error', (ev) => {
            console.log('Error',ev);
            alert('Failed to load webAKT toolbox from\n'+url);
        });
    }

};


AKT.menuHandler.menu_tools_usetool = function() {
    console.log('Use a tool, for tools widget');
    $(this).find('a').css({background:'#d0d0d0',color:'black'});       
    var eventShiftKey = event ? event.shiftKey : null;

    var panel = AKT.panelise({
        widget_name:'tools',
        position:{left:'20px',top:'20px'},
        size:{width:'450px',height:'540px'},
        shift_key:eventShiftKey,
        options:{kbId:AKT.state.current_kb}
    });

};


AKT.menuHandler.menu_tools_toolmontage = function() {
    console.log('quicktool');
    AKT.incrementZindex("AKT.menuHandler.menu_tools_toolmontage");
    $('#macros_montage').css({display:"block", float:"none", "z-index":AKT.state.zindex, zindex:AKT.state.zindex});
    $('#macros_montage400').empty();

    // Note how easy it is to get the widgets (*not* the widget instances).
    // It's picking it up from the .akt object, at the start of each widget's code:
    //     $.widget('akt.statements_summary', {...
    // If we wanted to, we could get e.g. a title or the widget description, from
    // widgets[widgetId].meta.
    // I prefer the actual name (e.g. "statements_summary"), rather than a prettified version of it
    // (e.g. Statements summary", or worse, "Summary of statements". since that would make it harder
    // to find its code etc.
    var widgets = window.jQuery.akt;
    for (var widgetId in widgets) {
        var option = $('<option value="'+widgetId+'">'+widgetId+'</option>');
        $('#macros_montage400').append(option);
    }
    $(this).find('a').css({background:'#d0d0d0',color:'blue'});    

    var widgetPanelId = AKT.createMontagePanel({});
    AKT.incrementZindex("webakt1:$(.macros_montage102).on(click)/montage");
    $('#'+widgetPanelId).css({"z-index":AKT.state.zindex});

    var widgetTitlebar = $('<div class="titlebar">montage<input type="button" value="X" class="dialog_close_button"/></div>');  
    $('#'+widgetPanelId).append(widgetTitlebar);

    var headerDiv = $('<div style="margin:10px;"></div>');
    $(headerDiv).append('<h1 class="montage_title">AKT Knowledge Base Report</h1>');
    $(headerDiv).append('<div class="montage_author">Author: '+localStorage.getItem('user')+'</div>');
    $(headerDiv).append('<div class="montage_date">Date: '+AKT.getDate()+'</div>');
    $(headerDiv).append('<br/><div class="montage_contents_heading"><b>Contents</b><br/><ul class="contents"></ul>');
    $('#'+widgetPanelId).append(headerDiv);

    $('.dialog_close_button').css({background:'yellow'});
    $('.dialog_close_button').on('click', function () {
        //var id = $(widget).parent()[0].id;
        $('#'+widgetPanelId).css({display:"none"});
    });
};

AKT.menuHandler.menu_maps_diagnostics = function() {
    console.log('\n===================================================');
    console.log('DIAGNOSTICS');

    console.log('Widget instances:');
    var widgetInstances = AKT.getAllWidgetInstances();
    $.each(widgetInstances, function( i, widgetInstance) {
        console.log(widgetInstance.uuid,widgetInstance);
    });
};



//================================================= MENU: Tech



AKT.menuHandler.menu_tech_widgetinstances = function() {

/*
    var allPanels = $('body').find('.panel');
    console.log(allPanels);
    $.each(allPanels,function(i,panel) {

        console.log('\n...................................\nA panel element and its widget instance...',i);
        console.log(panel);

        console.log($(panel).diagram_gojs("instance"));
        console.log($(panel).diagram_gojs("instance").options);
        console.log($(panel).diagram_gojs("instance").options.model.meta.name);
        console.log($(panel).diagram_gojs('option','model').meta.name);  // Same as previous line
        console.log($(panel).data());  // Useful: returns all widgets used for this element.
        console.log($(panel).data("systo-diagram_gojs"));
        console.log($(panel).data("systo-diagram_gojs").options);


        var widgets = $(panel).data();
        for (var widgetId in widgets) {   // detects the actual AKT widget.
            if (widgetId.substring(0,3) === "akt") {
                console.log('* ',$(panel).data(widgetId));
                var widg = $(panel).data(widgetId);
                console.log('***',widgetId,widg.uuid,widg.options.kbId,widg.options.widget_name,widg.element[0].id,widg.options);
            }
        }

    });
*/
    //var kbId = prompt('KB ID: ',AKT.state.current_kb);
    //var type = prompt('Widget type: ');
    console.log('\n\n===================================================');
    console.log('\nAll widgies:\n',AKT.getAllWidgies());
    //console.log('\nWidgies for kbID:atwima:\n',AKT.getWidgiesByKb(kbId));
    //console.log('\nWidgies of type:statements:\n',AKT.getWidgiesByType(type));
    //console.log('\nkbID:atwima; type:statements:\n',AKT.getWidgiesByKbAndType(kbId,type));
    console.log('================================================\n\n');
};

