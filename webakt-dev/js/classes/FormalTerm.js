class FormalTerm {

    constructor(spec) {
    console.log('\n*** Class FormalTerm: constructor');
        if (spec) {
            this._id = spec.id;
            if (spec.from_file){
                var s = spec.from_file;
                this._kb = spec.kb;
                this._definition = s.definition;
                this._formal = s.formal;
                this._images = s.images;
                this._memo = s.memo;
                this._synonyms = s.synonyms;
                this._type = s.type;
                this._language = s.language;
                this._key = s.key;    // The synonym key for this formal term;
            } else {
                this._kb = spec.kb;
                this._definition = spec.definition;
                this._formal = spec.formal;
                this._images = spec.images;
                this._memo = spec.memo;
                this._synonyms = spec.synonyms;
                this._language = spec.language;
                this._type = spec.type;
                this._key = spec.key;    // The synonym key for this formal term;
            }
        } else {
            this._kb = AKT.state.current_kb;
            this._definition = '';
            this._formal = '';
            this._memo = '';
            this._synonyms = [];
            this._type = 'object';
            this._key = null;
        }
    }


    // GETTERS
    get id() {
        if (this._id) {
            return this._id;
        } else {
            return null;
        }
    }

    get definition() {
        if (this._descripion) {
            return this._definition;
        } else {
            return null;
        }
    }

    get formal() {
        if (this._formal) {
            return this._formal;
        } else {
            return null;
        }
    }

    get memo() {
        if (this._memo) {
            return this._memo;
        } else {
            return null;
        }
    }

    get synonyms() {
        if (this._synonyms) {
            return this._synonyms;
        } else {
            return null;
        }
    }

    get typexxx() {
        if (this._type) {
            return this._type;
        } else {
            return null;
        }
    }


    makeSpec = function () {
        var formalTermSpec = {
            id: this._id,
            term: this._term,
            type: this._type,
            language: this._language,
            definition:this._definition,
            images: this._images,
            synonyms:this._synonyms,
            memo: this._memo
        }
        return formalTermSpec;
    }



    addSynonym (newSynonym) {
        this._synonyms.push(newSynonym);
    }


    findHierarchies () {
        var allHierarchies = this._kb._objectHierarchies;
        var myHierarchies = [];
        for (var hierarchyId in allHierarchies) {
            var hierarchy = allHierarchies[hierarchyId];
            if (hierarchy._tree_up[this._id]) {
                myHierarchies.push(hierarchy);
                console.log('\nHIERARCHY\n',hierarchyId,hierarchy);
            }
        }
        return myHierarchies;
    }


    // This method allows for the property value to be computed, rather than simply being
    // a native one for this Class.   See the same method in Statement.js.
    // So, in principle every reference to Collection._PropertyId should be changed to
    // Collection.getPropertyValue(PropertyId).
    getPropertyValue = function (propertyId) {
        if (this['_'+propertyId]) {
            return this['_'+propertyId];

        } else {
            return null;
        }
    }

/*
    passFilters = function(filters) {
        
        if (filters && filters.term_type) {
            if (filters.term_type === 'all') {
            } else if (this._type === filters.term_type) {
            } else {
                return false;
            }
        }
        if (filters && filters.language) {
            if (filters.language === 'all') {
            } else if (this._language === filters.language) {
            } else {
                return false;
            }
        }
        return true;
    }
*/
/* Left unfinished.   Checks for use of the formal term in main part or condition
   of at least one sentence.  Can't see much point to this.
        if (filters && filters.use) {
            if (filters.term_type === 'all') {
            } else if (filters.use==='main' && ) {
            } else {
                return false;
            }
        }
*/



    // This filtering system is closely based on the one used for statements.
    // Note that we have two filtering functions: passFilters() and passFilters1().
    // passFilter() is the original one for formal terms, and checks for type and language.
    // passFilter1() is the one added March 2024, to allow the user to have a lot more 
    // control over which formal terms are displayed in the formal_terms Listbox.
    // Here, I currently allow only for "Included..." formal terms.

    /* The possible properties for the 'filters' object:
        has_memo: true/false
        no_memo: true/false
        has_definition: true/false
        no_definition: true/false
        has_images: true/false
        no_images: true/false
        has_synonyms: true/false
        no_synonyms: true/false
        used: true/false
        not_used: true/false
    */
/*
    passFilters1xxx = function (filters) {

        var kbId = AKT.state.current_kb;
        var kb = AKT.KBs[kbId];

        //var ok = {all:true,conditional:true,non_conditional:true,att_value:true,causal:true,formal_term:true,source:true};
        
        if (filters) {

            if (this._memo) {
                if (this._memo.length>0) {
                    if (filters.hasOwnProperty('has_memo') && filters.has_memo === false) {
                        return false;
                    }
                } else {
                    if (filters.hasOwnProperty('no_memo') && filters.no_memo === false) {
                        return false;
                        }
                } 
            } else {
                if (filters.hasOwnProperty('no_memo') && filters.no_memo === false) {
                    return false;
                }
            }


            if (this._definition) {
                if (this._definition.length>0) {
                    if (filters.hasOwnProperty('has_definition') && filters.has_definition === false) {
                        return false;
                    }
                } else {
                    if (filters.hasOwnProperty('no_definition') && filters.no_definition === false) {
                        return false;
                    }
                } 
            } else {
                if (filters.hasOwnProperty('no_definition') && filters.no_definition === false) {
                    return false;
                }
            }


            if (this._images) {
                if (Object.keys(this._images).length>0) {   // this._images is an object (aka hash, dict, map...)
                    if (filters.hasOwnProperty('has_images') && filters.has_images === false) {
                        return false;
                    }
                } else {
                    if (filters.hasOwnProperty('no_images') && filters.no_images === false) {
                        return false;
                        }
                } 
            } else {
                if (filters.hasOwnProperty('no_images') && filters.no_images === false) {
                    return false;
                }
            }


            if (this._synonyms) {
                if (this._synonyms.length>0) {   // this._synonyms is an array
                    if (filters.hasOwnProperty('has_synonyms') && filters.has_synonyms === false) {
                        return false;
                    }
                } else {
                    if (filters.hasOwnProperty('no_synonyms') && filters.no_synonyms === false) {
                        return false;
                        }
                } 
            } else {
                if (filters.hasOwnProperty('no_synonyms') && filters.no_synonyms === false) {
                    return false;
                }
            }

            if (this.is_used(kb)) {
                if (filters.hasOwnProperty('used')) {
                    if (filters.used === false) {
                        return false;
                    }
                }
            } else {
                if (filters.hasOwnProperty('not_used')) {
                    if (filters.not_used === false) {
                        return false;
                    }
                }
            } 

        }

        return true;
    }
*/


    // New approach, March/April 2024
    // This is based on a category/option model, similar to that used in online stores.
    // Categories are AND-ed together, while options within a category are OR-edit  
    // together.
    // Categories with no options selected are ignored.
    // Can be simpified, removing boilerplate code for each category, and placing
    // this inside a loop over all categories, but this requires a function for each
    // category, which is hardly much of a saving.   

    passFilters1 = function (filters) {
        var kbId = AKT.state.current_kb;
        var kb = AKT.KBs[kbId];

        var result = false;
        if (filters.hasOwnProperty('termtype')) {
            var filter = filters.termtype;
            for (var option in filter) {
                if (filter[option]) {
                    if (this._type === option) {
                        result = true;
                    }
                }
            }
        } else {
            result = true;
        }

        if (!result) return false;
        result = false;   // Note that we have to set result=false for each category,
                          // since the categories are AND-ed together.

        if (filters.hasOwnProperty('language')) {
            var filter = filters.language;
            for (var option in filter) {
                if (filter[option]) {
                    if (this._language === option) {
                        result = true;
                    }
                }
            }
        } else {
            result = true;
        }

        if (!result) return false;
        result = false;

        var result = false;
        if (filters.hasOwnProperty('has_memo')) {
            var filter = filters.has_memo;
            if (filter.yes) {
                if (this._memo && this._memo.length>0) {
                    result = true;
                }
            }
            if (filter.no) {
                if (!this._memo || this._memo.length <= 0) {
                    result = true;
                }
            }
        } else {
            result = true;
        }

        if (!result) return false;
        result = false;

        if (filters.hasOwnProperty('has_definition')) {
            var filter = filters.has_definition;
            if (filter.yes) {
                if (this._definition && this._definition.length>0) {
                    result = true;
                }
            }
            if (filter.no) {
                if (!this._definition || this._definition.length <= 0) {
                    result = true;
                }
            }
        } else {
            result = true;
        }

        if (!result) return false;
        result = false;

        if (filters.hasOwnProperty('has_synonyms')) {
            var filter = filters.has_synonyms;
            if (filter.yes) {
                if (this._synonyms && this._synonyms.length>0) {
                    result = true;
                }
            }
            if (filter.no) {
                if (!this._synonyms || this._synonyms.length <= 0) {
                    result = true;
                }
            }
        } else {
            result = true;
        }

        if (!result) return false;
        result = false;

        if (filters.hasOwnProperty('has_images')) {
            var filter = filters.has_images;
            if (filter.yes) {
                if (this._images && Object.keys(this._images).length>0) {
                    result = true;
                }
            }
            if (filter.no) {
                if (!this._images || Object.keys(this._images).length <= 0) {
                    result = true;
                }
            }
        } else {
            result = true;
        }

        if (!result) return false;
        result = false;

        if (filters.hasOwnProperty('in_statements')) {
            var filter = filters.in_statements;
            if (filter.yes) {
                if (this.is_used(kb)) {
                    result = true;
                }
            }
            if (filter.no) {
                if (!this.is_used(kb)) {
                    result = true;
                }
            }
        } else {
            result = true;
        }

        return result;
    }

    is_used = function (kb) {
        var formaltermId = this._id;
        var cached = kb._cache[formaltermId];
        if (cached) {
            return true;
        } else {
            var statements = kb._statements;
            for (var statementId in statements) {
                var statement = statements[statementId];
                if (statement.containsFormalTerm(formaltermId)) {
                    kb._cache[formaltermId] = true;
                    return true;
                }
            }
            return false;
        }
    }


}
