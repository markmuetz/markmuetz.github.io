class Action {

    constructor(spec) {

        AKT.state.events.counter += 1;

        this._counter =    AKT.state.events.counter;
        this._element_id = spec.element_id;
        this._selector =   spec.selector;
        this._type =       spec.type;
        this._message =    spec.message; 
        this._prompt =     spec.prompt;
        this._value =      spec.value;
    }


    makeActionSpec = function () {
        var actionSpec = {
            element_id: this._element_id,
            selector: this._selector,
            type: this._type,
            message:this._message,
            prompt:this._prompt,
            value: this._value
        }
        return actionSpec;
    }


    triggerEvent = function (actions) {
        var eventType = this._type;

        //var iStep = AKT.state.stepCounter;
        //var nextEventMessage = actions[iStep+1]._message;
        //$('#message').html(nextEventMessage);

        if (eventType === 'click'){

            if (this._value && typeof this._value === 'string') {
                this._selector += '.'+this._value;
                var values = null;
                //var values = this._value;    // TODO Check: Not sure about this...
                
            } else if (this._values && Array.isArray(this._values)) {
                values = this._values;       // TODO Check: Not sure about this...
                for (var j=0; j<this._values.length; j++) {
                    var valueObject = this._values[j];   // {find:selector, text:text}
                    var selector = valueObject.find;
                    var value = valueObject.value;
                    if (valueObject.type === 'div') {
                        $('#'+this._element_id).find(selector).text(value);
                    } else if (valueObject.type === 'input') {
                        $('#'+this._element_id).find(selector).val(value);
                    } else if (valueObject.type === 'textarea') {
                        $('#'+this._element_id).find(selector).val(value);
                    } else {
                        alert('Software bug: text field of type '+valueObject.type+' not currently handled in AKT.playRecording.  Current record is '+JSON.stringify(action));
                    }
                }
            }

            var fullSelector = '#'+this._element_id+' '+this._selector;
            $(fullSelector).trigger('click',[values]);
            //if ($(eventRecord.selector)[0].localName === 'button') {
            //    $(eventRecord.selector).css('background','yellow');
            //}

        } else if (eventType === 'mousedown'){
            $(this._selector).trigger('mousedown');
/*
        } else if (eventType === 'change') {
            console.log(99,'change');
            if (this._value) {
                $(this._selector).trigger('change','checked');
            } else {
                $(this._selector).trigger('change','unchecked');
            }
*/
        } else if (eventType === 'change') {
            $(this._selector).trigger('change',this._value);

        } else if (eventType === 'select') {
            $(this._selector).val(this._value).trigger('change');

        } else if (eventType === 'checkbox') {
            $(this._selector).prop('checked',this._value).trigger('change');
      
        } else if (eventType === 'menuclick') {
            $(this._selector).trigger('click');

        } else if (eventType === 'menuleafclick') {
            AKT.menuHandler[step.selector.substring(1)]();
        }
    }
}

