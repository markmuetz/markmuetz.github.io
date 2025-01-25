AKT.openRecording = function () {
    var id = prompt('Recording_name:','');
    //AKT.event_records = JSON.parse(localStorage.getItem('webakt_recording_'+id));
    AKT.playRecording(id);
    console.log(AKT.event_records);
};

AKT.saveRecording = function () {
    var id = prompt('Recording name:','');
    localStorage.setItem('webakt_recording_'+id,JSON.stringify(AKT.event_records));
};

AKT.stopRecording = function () {
    AKT.state.event_recording = false;
    console.log('event_recording:',AKT.state.event_recording);
};

AKT.showRecording = function () {
    var records = AKT.getEventRecords();
    console.log('\nEvent recording:\n',JSON.stringify(records,null,4));
};

AKT.recordEvent = function (eventRecord) {
    if (!AKT.state.event_recording) return;
    if (AKT.state.playing_events) return;

    var element = eventRecord.element;

    console.log(111,eventRecord);
    AKT.state.events.counter += 1;

    eventRecord.element_id = eventRecord.element[0].id;
    //console.log('\nevent:',AKT.recordEvent.caller);
    console.log('\n******* event:',eventRecord,'\n');
    var selector = '#'+eventRecord.element[0].id;
    for (var j=0; j<eventRecord.finds.length; j++) {
        selector += ' '+ eventRecord.finds[j];
    }
    if (eventRecord.qualifier) {
        selector += eventRecord.qualifier;
    }

    var event = {
        counter:   AKT.state.events.counter,
        element_id:eventRecord.element_id,
        selector:  selector,
        eventType: eventRecord.event, 
        message:   eventRecord.message, 
        value:     eventRecord.value,
        values:    eventRecord.values
    };
    console.log('event:',event);
    AKT.event_records.push(event);
    AKT.setEventRecords('event_records', AKT.event_records);
};


AKT.setEventRecords = function () {
    localStorage.setItem('webakt_recording_latest',JSON.stringify(AKT.event_records));
};

AKT.getEventRecords = function () {
    AKT.event_records = JSON.parse(localStorage.getItem('webakt_recording_latest'));
    return AKT.event_records;
};

AKT.showEventRecords = function () {
    console.log(JSON.stringify(AKT.event_records));
};


/*
IMPORTANT NOTE, Dec 2022
There are two ways of playback-ing an event recording:

1. AKT.playRecording()
This inserts a delay after each step.  The user can see all intermediate steps, even
when a panel is closed down and so no longer visible.
It uses the timing mechanism based on the built-in setInterval() function.  This 
*repeatdely* calls the same function, so *no looping over the individual records* is 
used. Instead, it accesses a counter, held in AKT.state.stepCounter, which keeps 
track of the step number, and increments each time the function is called by the
setInterval() mechanism.  The version of setInterval I use has two arguments:
- the function (AKT.oneStep() ) to call each step, for processig that step's record; and
- the delay (i millisecs) to insert after the function has been executed.
Note that, in order to stop setInterval() repeating forever, we stop it when it gets to
the end of the recording with the following lines (at the end of AKT.oneStep():
    if (AKT.state.stepCounter >= nSteps) {
        clearInterval(AKT.timer);
    }
where nSteps is the number of steps (events) in the recording.

2. AKT.playRecordingNoPause()
The original mechanism: this has a regular for-loop to loop over the steps.   Note that
all you see is the final state, so, unlike AKT.playRecording(), you *do not* see any 
panels which are opened then closed.
*/



AKT.stepThroughRecording = function (id) {
    console.log('\nStep button clicked');
    AKT.state.event_recording = false;
    AKT.state.playing_events = true;
    if (AKT.state.stepping_through_recording) {
        console.log('on-to-off');
        AKT.state.stepping_through_recording = false;
    } else {
        console.log('off-to-on');
        AKT.state.stepping_through_recording = true;
    }

    if (!id) {
        AKT.event_records = JSON.parse(localStorage.getItem('webakt_recording_latest'));
    } else {
        AKT.event_records = JSON.parse(localStorage.getItem('webakt_recording_'+id));
    }
    AKT.state.stepCounter = 0;
}


AKT.playRecording = function (id) {
    AKT.state.event_recording = false;
    AKT.state.playing_events = true;
    if (!id) {
        AKT.event_records = JSON.parse(localStorage.getItem('webakt_recording_latest'));
    } else {
        AKT.event_records = JSON.parse(localStorage.getItem('webakt_recording_'+id));
    }
    AKT.state.stepCounter = 0;
    AKT.timer = setInterval(AKT.oneStep,1000);
    AKT.state.playingEvents = false;
}


AKT.playRecordingNoPause = function (id) {
    AKT.state.event_recording = false;
    AKT.state.playing_events = true;
    if (!id) {
        AKT.event_records = JSON.parse(localStorage.getItem('webakt_recording_latest'));
    } else {
        AKT.event_records = JSON.parse(localStorage.getItem('webakt_recording_'+id));
    }
    AKT.state.stepCounter = 0;
    //AKT.timer = setInterval(AKT.oneStep,500);

    var eventRecords = AKT.event_records;
    console.log(JSON.stringify(eventRecords,null,4));
    for (var i=0; i<eventRecords.length; i++) {
        var eventRecord = eventRecords[i];
        console.log('\n## ',eventRecord);
        AKT.oneStep()
        AKT.state.stepCounter += 1;
    }
    AKT.state.playingEvents = false;
}




AKT.oneStep = function () {
    console.log('::',event);
    $('button').css('background','#d0d0d0');
    var iStep = AKT.state.stepCounter;
    AKT.state.stepCounter += 1;
    var nSteps = AKT.event_records.length;
    var eventRecord = AKT.event_records[iStep];
    var eventType = eventRecord.eventType;
    var nextEventMessage = AKT.event_records[iStep+1].message;
    $('#recording_message').html(nextEventMessage);
    console.log('\n\n\n=== oneStep ==================================================\n',iStep,nSteps,eventType,eventRecord.selector,' : ',eventRecord.value,'\n',eventRecord.message,'\n');

    if (eventType === 'click'){

        if (eventRecord.value && typeof eventRecord.value === 'string') {
            eventRecord.selector += '.'+eventRecord.value;
            var values = null;
            //var values = eventRecord.value;    // TODO Check: Not sure about this...
            
        } else if (eventRecord.values && Array.isArray(eventRecord.values)) {
            values = eventRecord.values;       // TODO Check: Not sure about this...
            for (var j=0; j<eventRecord.values.length; j++) {
                var valueObject = eventRecord.values[j];   // {find:selector, text:text}
                console.log(valueObject);
                var selector = valueObject.find;
                var value = valueObject.value;
                console.log(selector,value);
                if (valueObject.type === 'div') {
                    $('#'+eventRecord.element_id).find(selector).text(value);
                } else if (valueObject.type === 'input') {
                    $('#'+eventRecord.element_id).find(selector).val(value);
                } else if (valueObject.type === 'textarea') {
                    $('#'+eventRecord.element_id).find(selector).val(value);
                } else {
                    alert('Software bug: text field of type '+valueObject.type+' not currently handled in AKT.playRecording.  Current record is '+JSON.stringify(eventRecord));
                }
            }
        }

        console.log('=++=',eventRecord.selector,$(eventRecord.selector),[values]);
        $(eventRecord.selector).trigger('click',[values]);
        //if ($(eventRecord.selector)[0].localName === 'button') {
        //    $(eventRecord.selector).css('background','yellow');
        //}

    } else if (eventType === 'mousedown'){
        $(eventRecord.selector).trigger('mousedown');

    } else if (eventType === 'change') {
        console.log('5001','change',eventRecord.selector,eventRecord.value);
        //$(eventRecord.selector).trigger('change',[eventRecord.value]);
        $(eventRecord.selector).trigger('change',[eventRecord.value]);

    } else if (eventType === 'select') {
        console.log('5002','change',eventRecord.selector,eventRecord.value);
        $(eventRecord.selector).val(eventRecord.value).trigger('change');

    } else if (eventType === 'checkbox') {
        console.log('5003','change',eventRecord.selector,eventRecord.value);
        $(eventRecord.selector).prop('checked',eventRecord.value).trigger('change');
  
    } else if (eventType === 'menuclick') {
        $(eventRecord.selector).trigger('click');

    } else if (eventType === 'menuleafclick') {
        AKT.menuHandler[step.selector.substring(1)]();
    }

    if (AKT.state.stepCounter >= nSteps) {
        clearInterval(AKT.timer);
        AKT.state.stepping_through_recording = false;
    }
}

