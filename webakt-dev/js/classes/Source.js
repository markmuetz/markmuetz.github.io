class Source {

    constructor(spec) {

        // Legacy use of both spec.from_file and simple spec.
        // 'prop' refers to the property of a source.
        if (spec) {
            if (spec.from_file){
                for (var propId in spec.from_file) {
                    this['_'+propId] = spec.from_file[propId];
                }
            } else {
                for (var propId in spec) {
                    this['_'+propId] = spec[propId];
                }
            }
        }
    }


    // GETTERS
    get day() {
        if (this._day) {
            return this._day;
        } else {
            return null;
        }
    }

    get id() {
        if (this._id) {
            return this._id;
        } else {
            return null;
        }
    }

    get extras() {
        if (this._extras) {
            return this._extras;
        } else {
            return null;
        }
    }

    get interviewee() {
        if (this._interviewee) {
            return this._interviewee;
        } else {
            return null;
        }
    }

    get interviewer() {
        if (this._interviewer) {
            return this._interviewer;
        } else {
            return null;
        }
    }

    get location() {
        if (this._location) {
            return this._location;
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

    get method() {
        if (this._method) {
            return this._method;
        } else {
            return null;
        }
    }

    get month() {
        if (this._month) {
            return this._month;
        } else {
            return null;
        }
    }

    get id() {
        if (this._id) {
            return this._id;
        } else {
            return null;
        }
    }

    get sex() {
        if (this._sex) {
            return this._sex;
        } else {
            return null;
        }
    }

    get suffix() {
        if (this._suffix) {
            return this._suffix;
        } else {
            return null;
        }
    }

    get year() {
        if (this._year) {
            return this._year;
        } else {
            return null;
        }
    }


    // SETTERS
    set day(da) {
        this._day = da;
    }

    set extras(ext) {
        this._extras = ext;
    }

    set id(id) {
        this._id = id;
    }

    set interviewee(int) {
        this._interviewee = int;
    }

    set interviewer(int) {
        this._interviewer = int;
    }

    set location(loc) {
        this._location = loc;
    }

    set memo(mem) {
        this._memo = mem;
    }

    set method(met) {
        this._method = met;
    }

    set month(mon) {
        this._month = mon;
    }

    set id(id) {
        this._id = id;
    }

    set sex(sx) {
        this._sex = sx;
    }

    set suffix(suf) {
        this._suffix = suf;
    }

    set year(y) {
        this._year = y;
    }


    // This method allows for the property value to be computed rather than be a native
    // one for this Class.   See the same method in Statement.js
    getPropertyValue = function (propertyId) {
        if (this['_'+propertyId]) {
            return this['_'+propertyId];

        } else {
            return null;
        }
    }


    makeSpec = function() {
        var sourceSpec = {
            id: this._id,
            type: this._type,
            name: this._name,
            location: this._location,
            suffix: this._suffix,
            method: this._method,
            interviewer: this._interviewer,
            interviewee: this._interviewee,
            sex: this._sex,
            day: this._day,
            month: this._month,
            year: this._year,
            memo: this._memo,
            extras: this._extras,

            authors: this._authors,
            title: this._title,
            volume: this._volume,
            number: this._number,
            pages: this._pages,
            publication: this._publication
        }
        return sourceSpec;
    }

}            
