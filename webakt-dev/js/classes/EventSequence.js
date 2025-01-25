class EventSequence {

    constructor (spec) {
        this._events = spec.events;
    }

    // Runs through all the events, without using a timer to pause at each this.
    // Used for UI testing.
    runThrough = function () {

        // This is crucial.   Without it, calling an event will generate a new event event!
        AKT.state.playing_events = true;

        var events = this._events;

        for (var i=0; i<events.length; i++) {
            var event = events[i];   // an individual Event object

        }
        AKT.state.playingEvents = false;

    }
}


class Event {
    constructor (spec) {
        this._element = spec.element;
        this._funds = spec.finds;
        this.type = type;
        this._message = spec.message;
        this._value = spec.value
    }

    doEvent = function () {
        switch (this._type) {
            case 'click':
                $(this.selector).trigger('click');
                break;

            case 'mousedown':
                $(this.selector).trigger('mousedown');
                break;

            case 'change':
                console.log('5000','change',this.selector,this.value);
                //$(this.selector).trigger('change',[this.value]);
                $(this.selector).trigger('change',[this.value]);
                break;

            case 'select':
                console.log('5000','change',this.selector,this.value);
                //$(this.selector).trigger('change',[this.value]);
                $(this.selector).val(this.value).trigger('change');
                break;
      
            case 'menuclick':
                $(this.selector).trigger('click');
                break;

            case 'menuleafclick':
                AKT.menuHandler[this.selector.substring(1)]();
                break;
        }
    }
}

