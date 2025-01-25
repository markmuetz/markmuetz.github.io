


AKT.collection_specs = {

    diagram:{
        width:'400px',
        height:'260px',
        name_for_kb_get_function:'getDiagrams',
        name_for_property_value_get_function:null,
        plural:'diagrams',
        properties:{
            id:{listbox:true},
        },
        filters:{
        }
    },

    diagram_node:{
        width:'400px',
        height:'260px',
        name_for_kb_get_function:'getDiagramNodes',
        name_for_property_value_get_function:null,
        plural:'diagram_nodes',
        properties:{
            id:{listbox:true},
        },
        filters:{
        }
    },

    diagram_arc:{
        width:'400px',
        height:'260px',
        name_for_kb_get_function:'getDiagramArcs',
        name_for_property_value_get_function:null,
        plural:'diagram_arcs',
        properties:{
            id:{listbox:true},
        },
        filters:{
        }
    },

    formal_term:{
        width:'400px',
        height:'260px',
        name_for_kb_get_function:'getFormalTerms',
        name_for_property_value_get_function:null,
        plural:'formalTerms',
        properties:{
            id:{listbox:true},
            defintion:{},
            memo:{},
            images:{},
            synonyms:{},
            type:{listbox:true},
            language:{}
        },
        filters:{
            termtype:{
                control_type:'dropdown',
                options:['','action','attribute','comparison','link','object','process','value']
            },
            language:{
                control_type:'checkboxes',
                options:['english','french','latin','local']
            },
            has_memo:{
                control_type:'checkboxes',
                options: ['yes','no']
            },
            has_definition:{
                control_type:'checkboxes',
                options: ['yes','no']
            },
            has_images:{
                control_type:'checkboxes',
                options: ['yes','no']
            },
            has_synonyms:{
                control_type:'checkboxes',
                options: ['yes','no']
            },
            has_statements:{
                control_type:'checkboxes',
                options: ['yes','no'],
            }
        }
    },

    image:{
        width:'400px',
        height:'260px',
        name_for_kb_get_function:'getImages',
        name_for_property_value_get_function:null,
        plural:'images',
        properties:{
            id:{listbox:true},
        },
        filters:{
        }
    },

    object_hierarchy:{
        width:'400px',
        height:'260px',
        name_for_kb_get_function:'getObjectHierarchies',
        name_for_property_value_get_function:null,
        plural:'objectHierarchies',
        properties:{
            id:{listbox:true},
        },
        filters:{
        }
    },

    source:{
        width:'400px',
        height:'260px',
        name_for_kb_get_function:'getSources',
        name_for_property_value_get_function:null,
        plural:'sources',
        properties:{
            id:{listbox:true},
            type:{listbox:true},
            name:{listbox:true},
            year:{listbox:true},
            location:{}
        },
        filters:{
            type:{
                control_type:'checkboxes',
                options:['person','reference']
            },
            location:{
                control_type:'dropdown',
                options: ['']
            },
            year:{
                control_type:'dropdown',
                options:['']
            }
        }
    },

    statement:{
        width:'400px',
        height:'260px',
        name_for_kb_get_function:'getStatements',
        name_for_property_value_get_function:'getPropertyValue',
        plural:'statements',
        properties:{
            id:{listbox:true},
            formal:{listbox:true},
            json:{},
            english:{listbox:true},
            sources:{},
            type:{}
        },
        filters:{
            type:{
                control_type:'checkboxes',
                options:['att_value','causal','comparison']
            },
            conditional:{
                control_type:'checkboxes',
                options: ['yes','no']
            },
            formal_term:{
                control_type:'dropdown',
                options: null,
                kb_collection:'formalTerms'
            },
            source:{
                control_type:'dropdown',
                options: null,
                kb_collection:'sources'
            },
            topic:{
                control_type:'dropdown',
                options: null,
                kb_collection:'topics'
            }
        }
    },

    topic:{
        width:'400px',
        height:'260px',
        name_for_kb_get_function:'getTopics',
        name_for_property_value_get_function:null,
        plural:'topics',
        properties:{
            id:{listbox:true},
        },
        filters:{
        }
    },

    topic_hierarchy:{
        width:'400px',
        height:'260px',
        name_for_kb_get_function:'getTopicHierarchies',
        name_for_property_value_get_function:null,
        plural:'topicHierarchies',
        properties:{
            id:{listbox:true},
        },
        filters:{
        }
    }
};

