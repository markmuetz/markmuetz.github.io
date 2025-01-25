
AKT.tutorials.tour_metadata_and_statements = [
    {eventType:'highlight',selector:'#menu_kb > a'},
    {eventType:'menuclick',selector:'#menu_kb > a'},
    {eventType:'highlight',selector:'#menu_kb_metadata > a'},

    {eventType:'pause',    message:'1. METADATA\nWe begin by looking at the metadata for the Atwima knowledge base.'},
    {eventType:'menuleafclick',selector:'#menu_kb_metadata',tests:[
        {title:'Metadata: Title field',
         selector:'#metadata800',
         property:'text',
         comparison:'includes',
         value:'Atwima'},
        {title:'Metadata: Study Area field',
         selector:'#metadata805',
         property:'text',
         comparison:'equals',
         value:'Kyereyase and Gogoikrom, Atwima district, Ashanti region, Ghana.'}]},
    {eventType:'menuclick',selector:'#menu_maps > a'},
    {eventType:'highlight',selector:'#metadata_1 .dialog_close_button'},

    {eventType:'pause',    message:'2. STATEMENTS\nWe will now close the Metadata panel, and look at the statements in the knowledge base.'},
    {eventType:'click',    selector:'#metadata_1 .dialog_close_button'},
    {eventType:'highlight',selector:'#menu_kb'},
    {eventType:'menuclick',selector:'#menu_kb > a'},
    {eventType:'highlight',selector:'#menu_kb_statements > a'},
    {eventType:'menuleafclick',selector:'#menu_kb_statements'},
    {eventType:'menuclick',selector:'#menu_maps > a'},
    {eventType:'click',    selector:'#statements_1 .tr[data-key="s6"]'},
    {eventType:'highlight',selector:'#statements_1 .button_details'},

    {eventType:'pause',    message:'We select statement s6, and look at its details.'},
    {eventType:'click',    selector:'#statements_1 .button_details'},

    {eventType:'pause',    message:'We will now look at the filtering options at the top of the Statements panel.\nWe will begin by unchecking the causal and comparison checkboxes, leaving 31 att_value statements.'},
    {eventType:'click',    selector:'#statements_1 .checkbox_causal'},
    {eventType:'click',    selector:'#statements_1 .checkbox_comparison'},

    {eventType:'pause',    message:'We will now uncheck the non-conditional checkbox.  We can see that there are just 2 non-conditional att_value statements.'},
    {eventType:'click',    selector:'#statements_1 .checkbox_non_conditional'},

    {eventType:'pause',    message:'We will now re-check these 3 checkboxes, and uncheck the source checkbox.   This causes only the 26 statements whose source is Adam,_Y,_Gogoikrom_2000a to be displayed.'},
    {eventType:'click',    selector:'#statements_1 .checkbox_causal'},
    {eventType:'click',    selector:'#statements_1 .checkbox_comparison'},
    {eventType:'click',    selector:'#statements_1 .checkbox_non_conditional'},
    {eventType:'click',    selector:'#statements_1 .checkbox_source'},

    {eventType:'pause',    message:'This is the end of the first part of the tutorial parts 1 and 2.\nIn parts 3 and 4, we will look at Formal Terms and Object Hierarchies. '},
];


AKT.tutorials.tour_formal_terms = [
    {eventType:'pause',    message:'Part 3. FORMAL TERMS\nWe begin by selecting the Formal terms command in the KB menu.  This shows a list of all the formal terms in the knowledge base.'},
    {eventType:'highlight',selector:'#menu_kb'},
    {eventType:'menuclick',selector:'#menu_kb > a'},
    {eventType:'highlight',selector:'#menu_kb_formalterms > a'},
    {eventType:'menuleafclick',selector:'#menu_kb_formalterms'},
    {eventType:'menuclick',selector:'#menu_maps > a'},

    {eventType:'pause',    message:'We restrict the list to formal terms that describe objects, by selecting object from the Formal Term Type listbox.'},
    {eventType:'select',   selector:'#formal_terms_1 .listbox_formal_term_type option[value="object"]'},
    {eventType:'select',   selector:'#formal_terms_1 .select_formalterms option[value="esre"]'},
    //{selector:'#formal_terms_1 .select_formalterms', eventType:'listbox_select', value:'esre'},
    //{selector:'#formal_terms_1 .legend_formal_term_type', eventType:'click'},
    {eventType:'highlight',selector:'#formal_terms_1 .button_details'},
    {eventType:'click',    selector:'#formal_terms_1 .button_details'},
    {eventType:'highlight',selector:'#formal_term_details_1 .button_statements'},
    {eventType:'click',    selector:'#formal_term_details_1 .button_statements'},

    {eventType:'pause',    message:'We will now close all the windows, and move on to\nPart 4; OBJECT HIERARCHIES'},
    {eventType:'highlight',selector:'#formal_terms_1 .dialog_close_button'},
    {eventType:'click',    selector:'#formal_terms_1 .dialog_close_button'},
    {eventType:'highlight',selector:'#formal_term_details_1 .dialog_close_button'},
    {eventType:'click',    selector:'#formal_term_details_1 .dialog_close_button'},
    {eventType:'highlight',selector:'#statements_1 .dialog_close_button'},
    {eventType:'click',    selector:'#statements_1 .dialog_close_button'},
];


AKT.tutorials.tour_object_hierarchies = [
    {eventType:'pause',    message:'Part 4. OBJECT HIERARCHIES\n'},
    {eventType:'highlight',selector:'#menu_kb'},
    {eventType:'menuclick',selector:'#menu_kb > a'},
    {eventType:'highlight',selector:'#menu_kb_objecthierarchies > a'},
    {eventType:'menuleafclick',selector:'#menu_kb_objecthierarchies'},
    {eventType:'menuclick',selector:'#menu_maps > a'},

    {eventType:'click',    selector:'#hierarchy_tree_1 #weeds .jstree-icon'},
    {eventType:'click',    selector:'#hierarchy_tree_1 #weeds_nwura_bone .jstree-icon'},
    {eventType:'click',    selector:'#hierarchy_tree_1 #weeds_esre .jstree-anchor'},
    {eventType:'highlight',selector:'#hierarchy_tree_1 .button_details'},
    {eventType:'click',    selector:'#hierarchy_tree_1 .button_details'},
    {eventType:'highlight',selector:'#hierarchy_tree_1 .dialog_close_button'},
    {eventType:'click',    selector:'#hierarchy_tree_1 .dialog_close_button'},
    {eventType:'highlight',selector:'#formal_term_details_1 .dialog_close_button'},
    {eventType:'click',    selector:'#formal_term_details_1 .dialog_close_button'},

    {eventType:'highlight',selector:'#menu_kb'},
    {eventType:'menuclick',selector:'#menu_kb > a'},
    {eventType:'highlight',selector:'#menu_kb_formalterms > a'},
    {eventType:'menuleafclick',selector:'#menu_kb_formalterms'},
    {eventType:'menuclick',selector:'#menu_maps > a'},

    {eventType:'select',   selector:'#formal_terms_1 .listbox_formal_term_type option[value="object"]'},
    {eventType:'click',    selector:'#formal_terms_1 .legend_formal_term_type'},
    {eventType:'highlight',selector:'#formal_terms_1 .button_details'},
    {eventType:'click',    selector:'#formal_terms_1 .button_details'},
    {eventType:'highlight',selector:'#formal_term_details_2 .button_in_hierarchy'},
    {eventType:'click',    selector:'#formal_term_details_2 .button_in_hierarchy'},
];




AKT.tutorials.tour_topics = [
    {eventType:'highlight',selector:'#menu_kb'},
    {eventType:'menuclick',selector:'#menu_kb > a'},
    {eventType:'highlight',selector:'#menu_kb_topics > a'},
    {eventType:'menuleafclick',selector:'#menu_kb_topics'},
    {eventType:'menuclick',selector:'#menu_maps > a'},
    //{selector:'#topics_1 .listbox_topics', eventType:'listbox_select', value:'Management_actions'},
    {eventType:'select',   selector:'#topics_1 .listbox_topics option[value="Management_actions"]'},
    {eventType:'highlight',selector:'#topics_1 .button_details'},
    {eventType:'click',    selector:'#topics_1 .button_details'},
    {eventType:'click',    selector:'#topic_details_1 .button_statements'},
    {eventType:'highlight',selector:'#topic_details_1 .dialog_close_button'},
    {eventType:'click',    selector:'#topic_details_1 .dialog_close_button'},
    {eventType:'highlight',selector:'#statements_1 .dialog_close_button'},
    {eventType:'click',    selector:'#statements_1 .dialog_close_button'},
    {eventType:'select',   selector:'#topics_1 .listbox_topics option[value="Weed_control"]'},
    {eventType:'highlight',selector:'#topics_1 .button_details'},
    {eventType:'click',    selector:'#topics_1 .button_details'},
    {eventType:'click',    selector:'#topic_details_2 .button_statements'},
    {eventType:'pause',    message:'We will now close all the windows, and move on to\nPart 4; OBJECT HIERARCHIES'},
];




AKT.tutorials.tour_topic_hierarchies = [
    //{eventType:'pause',    message:'Part 6. TOPC HIERARCHIES\n'},
    {eventType:'highlight',selector:'#menu_kb'},
    {eventType:'menuclick',selector:'#menu_kb > a'},
    {eventType:'highlight',selector:'#menu_kb_topichierarchies > a'},
    {eventType:'menuleafclick',selector:'#menu_kb_topichierarchies'},
    {eventType:'menuclick',selector:'#menu_maps > a'},

    {eventType:'click',    selector:'#hierarchy_tree_1 #Soil_types .jstree-icon'},
    {eventType:'click',    selector:'#hierarchy_tree_1 #Soil_types_Red_soil .jstree-icon'},
    //{selector:'#hierarchy_tree_1 #Soil_types_Red_soil .jstree-anchor', eventType:'click'},
    //{selector:'#hierarchy_tree_1 #Soil_types_Red_soil', eventType:'click'},
    {eventType:'highlight',selector:'#hierarchy_tree_1 .button_details'},
    {eventType:'click',    selector:'#hierarchy_tree_1 .button_details'},

    {eventType:'highlight',selector:'#topic_details_1 .dialog_close_button'},
    {eventType:'click',    selector:'#topic_details_1 .dialog_close_button'},
    {eventType:'highlight',selector:'#hierarchy_tree_1 .dialog_close_button'},
    {eventType:'click',    selector:'#hierarchy_tree_1 .dialog_close_button'},

    {eventType:'highlight',selector:'#menu_kb'},
    {eventType:'menuclick',selector:'#menu_kb > a'},
    {eventType:'highlight',selector:'#menu_kb_topics > a'},
    {eventType:'menuleafclick',selector:'#menu_kb_topics'},
    {eventType:'menuclick',selector:'#menu_maps > a'},

    {eventType:'select',   selector:'#topics_1 .listbox_topics option[value="Red_soil"]'},
    {eventType:'highlight',selector:'#topics_1 .button_details'},
    {eventType:'click',    selector:'#topics_1 .button_details'},
    {eventType:'highlight',selector:'#topic_details_2 .button_in_hierarchy'},
    {eventType:'click',    selector:'#topic_details_2 .button_in_hierarchy'},

];



AKT.tutorials.tour_sources = [
    //{eventType:'pause',    message:'Part 6. TOPC HIERARCHIES\n'},
    {eventType:'highlight',selector:'#menu_kb'},
    {eventType:'menuclick',selector:'#menu_kb > a'},
    {eventType:'highlight',selector:'#menu_kb_sources > a'},
    {eventType:'menuleafclick',selector:'#menu_kb_sources'},
    {eventType:'menuclick',selector:'#menu_maps > a'},

    {eventType:'select',   selector:'#sources_1 .select_sources option[value="Antwi,_K_Kyereyase_2000a"]'},
    {eventType:'highlight',selector:'#sources_1 .button_details'},
    {eventType:'click',    selector:'#sources_1 .button_details'},
    {eventType:'click',    selector:'#source_details_1 .button_statements'},
];





AKT.tutorials.tour_boolean_search = [
    //{eventType:'pause',    message:'Part 6. TOPC HIERARCHIES\n'},
    {eventType:'highlight',selector:'#menu_kb'},
    {eventType:'menuclick',selector:'#menu_kb > a'},
    {eventType:'highlight',selector:'#menu_kb_booleansearch > a'},
    {eventType:'menuleafclick',selector:'#menu_kb_booleansearch'},
    {eventType:'menuclick',selector:'#menu_maps > a'},

    //{selector:'#boolean_search_1 .listbox_types option[value="object"]', eventType:'select'},
    //{selector:'#boolean_search_1 .listbox_types', eventType:'change', value:'object'},

    {eventType:'select',   selector:'#boolean_search_1 .listbox_formal_term_type option[value="object"]'},

    {eventType:'select',   selector:'#boolean_search_1 .listbox_type_values option[value="asase_tuntum"]'},
    {eventType:'highlight',selector:'#boolean_search_1 .button_select'},
    {eventType:'click',    selector:'#boolean_search_1 .button_select'},
    {eventType:'highlight',selector:'#boolean_search_1 .button_or'},
    {eventType:'click',    selector:'#boolean_search_1 .button_or'},
    {eventType:'select',   selector:'#boolean_search_1 .listbox_type_values option[value="asase_kokoo"]'},
    {eventType:'highlight',selector:'#boolean_search_1 .button_select'},
    {eventType:'click',    selector:'#boolean_search_1 .button_select'},
    {eventType:'highlight',selector:'#boolean_search_1 .button_search'},
    {eventType:'click',    selector:'#boolean_search_1 .button_search'},

    {eventType:'click',    selector:'#boolean_search_1 .button_clear'},

    {eventType:'select',   selector:'#boolean_search_1 .listbox_type_values option[value="asase_tuntum"]'},
    {eventType:'highlight',selector:'#boolean_search_1 .button_select'},
    {eventType:'click',    selector:'#boolean_search_1 .button_select'},
    {eventType:'highlight',selector:'#boolean_search_1 .button_and'},
    {eventType:'click',    selector:'#boolean_search_1 .button_and'},
    {eventType:'select',   selector:'#boolean_search_1 .listbox_type_values option[value="asase_kokoo"]'},
    {eventType:'highlight',selector:'#boolean_search_1 .button_select'},
    {eventType:'click',    selector:'#boolean_search_1 .button_select'},
    {eventType:'highlight',selector:'#boolean_search_1 .button_search'},
    {eventType:'click',    selector:'#boolean_search_1 .button_search'},
];

