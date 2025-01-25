AKT.menus = [
    {id:'file', caption:'File', status:'live', submenu:[
        {id:'file_newkb', caption:'New', status:'live'},
        {id:'file_openkbrecent', caption:'Open recent >', status:'active', submenu:[]},
        {id:'file_openkb', caption:'Open from file', status:'file'},
        {id:'file_opensamplekbs', caption:'Open sample KBs', status:'live'},
        {id:'file_savekb', caption:'Save as', status:'file'},
        {id:'file_closekb', caption:'Close', status:'live'},
        //{id:'kb_dummy', caption:'', status:'inactive',
        //    comment:'For some weird reason, this is needed to get the submenus for kb_selectkb to open up!'},
        {id:'file_selectkb', caption:'Select KB >', status:'active', submenu:[
            {id:'file_selectkb_atwima', caption:'Atwima', status:'live'},
            {id:'file_selectkb_ego', caption:'Ego', status:'live'}]},
        {id:'file_clearcache', caption:'Clear cache', status:'live'},
        {id:'file_copykb', caption:'Copy KB', status:'live'}]},

    {id:'kb', caption:'KB', status:'live', submenu:[
        {id:'kb_summary', caption:'Summary', status:'live'},
        {id:'kb_metadata', caption:'Metadata', status:'live'},
        {id:'kb_statements', caption:'Statements', status:'live'},
        {id:'kb_sources', caption:'Sources', status:'live'},
        {id:'kb_formalterms', caption:'Formal terms', status:'live'},
        {id:'kb_objecthierarchies', caption:'Object hierarchies', status:'live'},
        {id:'kb_topics', caption:'Topics', status:'live'},
        {id:'kb_topichierarchies', caption:'Topic hierarchies', status:'live'},
        {id:'kb_images', caption:'Images', status:'live'},
        {id:'kb_separator2', caption:'==============', status:'inactive'},
        {id:'kb_booleansearch', caption:'Boolean Search', status:'live'},
        {id:'kb_separator1', caption:'==============', status:'inactive'},
        {id:'kb_filejson', caption:'View JSON', status:'live'}
    ]},

    {id:'diagram', caption:'Diagram', status:'live', submenu:[
        {id:'diagram_diagrams', caption:'Diagrams', status:'live'},
        {id:'diagram_nodes', caption:'Nodes', status:'live'},
        {id:'diagram_arcs', caption:'Arcs', status:'live'}]},

    {id:'tools', caption:'Tools', status:'live', submenu:[
        {id:'tools_loadtool', caption:'Load tool', status:'live'},
        {id:'tools_loadtoolbox', caption:'Load toolbox', status:'live'},
        {id:'tools_usetool', caption:'Use tool', status:'live'}]},
        //{id:'tools_toolmontage', caption:'Tool Montage', status:'inactive'},
        //'-----',
        //{id:'tools_selecttooloutputmode', caption:'Select Tool Output Mode', status:'inactive'},
        //'-----',
        //{id:'tools_toollist', caption:'Tool List', status:'inactive'},
        //'-----',
        //{id:'tools_fonts', caption:'Fonts', status:'inactive'}]},

    //{id:'maps', caption:'Map', status:'active', submenu:[]},

    //{id:'file', caption:'Tech', status:'live', submenu:[
    //    {id:'tech_widgettypes', caption:'Widget types', status:'live'},
    //    {id:'tech_widgetinstances', caption:'Widget instances', status:'live'}]},

    {id:'help', caption:'Help', status:'active', submenu:[
        {id:'help_help', caption:'Help', status:'inactive'},
        {id:'help_aide', caption:'Aide', status:'inactive'},
        {id:'help_ayuda', caption:'Ayuda', status:'inactive'},
        '-----',
        {id:'help_aktwebsite', caption:'AKT web site', status:'inactive'},
        '-----',
        {id:'help_aboutakt', caption:'About AKT...', status:'inactive'}]}];







