class Image {

    constructor(id,spec) {
        this._id = id;

        if (spec.label) {
            this._label = spec.label;
        } else {
            this._label = '';
        }
        if (spec.url) {
            this._url = spec.url;
        } else {
            this._url = '';
        }
        if (spec.caption) {
            this._caption = spec.caption;
        } else {
            this._caption = '';
        }
        if (spec.memo) {
            this._memo = spec.memo;
        } else {
            this._memo = '';
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


    get description() {
        if (this._descripion) {
            return this._description;
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



}
