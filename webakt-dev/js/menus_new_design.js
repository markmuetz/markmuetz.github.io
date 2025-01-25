AKT.menus = [
    {id:'file', caption:'File', status:'live', submenu:[
        {id:'kb_newkb', caption:'New Kb...', status:'live'},
        {id:'kb_openkb', caption:'Open Kb...', status:'live'},
        {id:'kb_savekb', caption:'Save Kb...', status:'live'},
        {id:'kb_savekbas', caption:'Save Kb As...', status:'live'},
        {id:'kb_savetopicaskb', caption:'Save Topic As Kb...', status:'inactive'},
        {id:'kb_closekb', caption:'Close Kb >', status:'live', submenu:[]},
        {id:'kb_selectkb', caption:'Select Kb >', status:'live', submenu:[]},
        {id:'kb_freezeopenkb', caption:'Freeze Open Kb >', status:'live', submenu:[]},
        '-----',
        {id:'kb_calendar', caption:'Calendar...', status:'inactive'},
        '-----',
        {id:'kb_booleansearch', caption:'Boolean Search...', status:'live'},
        {id:'kb_print', caption:'Print', status:'live'},
        '-----',
        {id:'file_user', caption:'User name', status:'live'}]},

    {id:'kb', caption:'View/Edit', status:'live', submenu:[
        {id:'kb_kbmetadata', caption:'KB Metadata...', status:'live'},
        {id:'kb_sources', caption:'Sources...', status:'live'},
        {id:'kb_formlterms', caption:'Formal terms...', status:'live'},
        {id:'kb_statements', caption:'Statements...', status:'live'},
        {id:'kb_derivations', caption:'Derivations', status:'live'},
        {id:'kb_synonyms', caption:'Synonyms', status:'live'},
        {id:'kb_objecthierarchies', caption:'Object Hierarchies', status:'live'},
        {id:'kb_objects', caption:'Objects', status:'live'},
        {id:'kb_topichierarchies', caption:'Topic Hierarchies...', status:'live'},
        {id:'kb_topics', caption:'Topics...', status:'live'},
        {id:'kb_knowledgecategories', caption:'Knowledge Categories...', status:'inactive'}]},

    {id:'diagram', caption:'Diagram', status:'live', submenu:[
        {id:'diagram_showkbdiagrams', caption:'Show Kb Diagrams', status:'live'},
        {id:'diagram_hidediagram', caption:'Hide Diagrams', status:'inactive'},
        '-----',
        {id:'diagram_copydiagram', caption:'Copy Diagram', status:'inactive'},
        '-----',
        {id:'diagram_savediagramasnewkb', caption:'Save diagram as new KB', status:'inactive'},
        '-----',
        {id:'diagram_deletediagram', caption:'Delete Diagram', status:'inactive'},
        {id:'diagram_delete_all_diagrams', caption:'Delete All Diagrams', status:'inactive'},
        '-----',
        {id:'diagram_fonts', caption:'Fonts', status:'inactive'}]},

    {id:'tools', caption:'Tools', status:'live', submenu:[
        {id:'tools_useatool', caption:'Use a Tool >', status:'live', submenu:[
            {id:'tools_useatool_toolsforthiskb', caption:'Tools for this KB', status:'inactive'},
            {id:'tools_useatool_systemtools', caption:'System Tools >', status:'live', submenu:[
                {id:'tools_useatool_systemtools_general', caption:'General', status:'inactive'},
                {id:'tools_useatool_systemtools_knowledgeanalysis', caption:'Knowledge Analysis', status:'live', submenu:[
                    {id:'tools_useatool_systemtools_knowledgeanalysis_singlekb', caption:'Single Kb', status:'live', submenu:[
                        {id:'tools_useatool_systemtools_knowledgeanalysis_singlekb_statementssummary', caption:'statements_summary', status:'live'},
                        {id:'tools_useatool_systemtools_knowledgeanalysis_singlekb_booleansearch', caption:'boolean_search', status:'live'},
                        {id:'tools_useatool_systemtools_knowledgeanalysis_singlekb_speciesreport', caption:'species_report', status:'live'}]},
                    {id:'tools_useatool_systemtools_knowledgeanalysis_multiplekbs', caption:'Multiple Kbs', status:'inactive', submenu:[]}]},
                {id:'tools_useatool_systemtools_knowledgeconsistency', caption:'Knowledge Consistency', status:'active', submenu:[
                    {id:'tools_useatool_systemtools_knowledgeconsistency_singlekb', caption:'Single Kb', status:'inactive', submenu:[]},
                    {id:'tools_useatool_systemtools_knowledgeconsistency_multiplekbs', caption:'Multiple Kbs', status:'inactive', submenu:[]}]},
                {id:'tools_useatool_systemtools_query', caption:'Query', status:'inactive'}]},
            {id:'tools_useatool_otherusertools', caption:'Other User tools >', status:'inactive', submenu:[]},
            {id:'tools_useatool_controlstructures', caption:'Control Structures >', status:'inactive', submenu:[]},
            {id:'tools_useatool_primitives', caption:'Primitives', status:'active', submenu:[
                {id:'tools_useatool_primitives_causeandeffect', caption:'Cause and Effect', status:'inactive', submenu:[]},
                {id:'tools_useatool_primitives_database', caption:'Database', status:'inactive', submenu:[]},
                {id:'tools_useatool_primitives_display', caption:'Display', status:'inactive', submenu:[]},
                {id:'tools_useatool_primitives_formalterm', caption:'Formal Term', status:'inactive', submenu:[]},
                {id:'tools_useatool_primitives_hierarchies', caption:'Hierarchies', status:'inactive', submenu:[]},
                {id:'tools_useatool_primitives_list', caption:'List', status:'inactive', submenu:[]},
                {id:'tools_useatool_primitives_miscellaneous', caption:'Miscellaneous', status:'inactive', submenu:[]},
                {id:'tools_useatool_primitives_sources', caption:'Sources', status:'inactive', submenu:[]},
                {id:'tools_useatool_primitives_statement', caption:'Statement', status:'inactive', submenu:[]},
                {id:'tools_useatool_primitives_test', caption:'Test', status:'inactive', submenu:[]},
                {id:'tools_useatool_primitives_topics', caption:'Topics', status:'inactive'}]}]},
        {id:'tools_quicktool', caption:'Quick Tool ...', status:'live'},
        {id:'tools_toolmontage', caption:'Tool Montage ...', status:'live'},
        {id:'tools_loadtoolfile', caption:'Load Tool File', status:'inactive'},
        {id:'tools_makeatool', caption:'Make a Tool >', status:'active', submenu:[
            {id:'tools_makeatool_newtoolfile', caption:'New Tool File...', status:'inactive'},
            {id:'tools_makeatool_opentoolfile', caption:'Open Tool File... >', status:'inactive'}]},
        {id:'tools_closetoolfile', caption:'Close Tool File...', status:'inactive'},
        '-----',
        {id:'tools_selecttooloutputmode', caption:'Select Tool Output Mode', status:'inactive'},
        '-----',
        {id:'tools_toollist', caption:'Tool List', status:'inactive'},
        '-----',
        {id:'tools_fonts', caption:'Fonts', status:'inactive'}]},

    {id:'maps', caption:'Map', status:'active', submenu:[
        {id:'maps_addamap', caption:'Add a map', status:'inactive'},
        {id:'maps_openamap', caption:'Open a map', status:'inactive'},
        {id:'maps_removeamap', caption:'Remove a map', status:'inactive'},
        {id:'maps_refresh', caption:'Refresh', status:'inactive'}]},

    {id:'help', caption:'Help', status:'active', submenu:[
        {id:'help_help', caption:'Help', status:'inactive'},
        {id:'help_aide', caption:'Aide', status:'inactive'},
        {id:'help_ayuda', caption:'Ayuda', status:'inactive'},
        '-----',
        {id:'help_aktwebsite', caption:'AKT web site', status:'inactive'},
        '-----',
        {id:'help_aboutakt', caption:'About AKT...', status:'inactive'}]}];







