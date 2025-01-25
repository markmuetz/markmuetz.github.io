AKT.collection_settings = {
    formal_terms:{
        width:'400px',
        height:'260px',
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
    }
};

