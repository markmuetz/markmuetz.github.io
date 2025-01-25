class EventRecords {

    constructor() {   
        this.event_records = [];  
    }

    add = function (eventRecord) {
        this.event_records.push(eventRecord);
    }
}


class EventRecord {

    constructor() {
        }

}



AKT.recordEvent = function (eventRecord) {
    if (AKT.state.playing_events) return;

    var element = eventRecord.element;

    if (!AKT.event_records) {
        AKT.event_records = [];
    }
    eventRecord.element_id = eventRecord.element[0].id;
    console.log(eventRecord);
    var selector = '#'+eventRecord.element[0].id;
    for (var j=0; j<eventRecord.finds.length; j++) {
        selector += ' '+ eventRecord.finds[j];
    }
    if (eventRecord.qualifier) {
        selector += eventRecord.qualifier;
    }
    AKT.event_records.push({selector:selector, eventType:eventRecord.event, message:eventRecord.message, value:eventRecord.value});
    AKT.setEventRecords('event_records', AKT.event_records);
};


AKT.setEventRecords = function () {
    localStorage.setItem('event_records',JSON.stringify(AKT.event_records));
};

AKT.getEventRecords = function () {
    AKT.event_records = JSON.parse(localStorage.getItem('event_records'));
};


AKT.playEvents = function () {
    AKT.state.playing_events = true;

    var eventRecords = AKT.event_records;
    console.log(JSON.stringify(eventRecords,null,4));
    for (var i=0; i<eventRecords.length; i++) {
        var eventRecord = eventRecords[i];
        var eventType = eventRecord.eventType;
        console.log('\n\n######################################\n',JSON.stringify(eventRecord,null,4));

        if (eventType === 'click'){
            $(eventRecord.selector).trigger('click');

        } else if (eventType === 'mousedown'){
            $(eventRecord.selector).trigger('mousedown');

        } else if (eventType === 'change') {
            console.log('5000','change',eventRecord.selector,eventRecord.value);
            //$(eventRecord.selector).trigger('change',[eventRecord.value]);
            $(eventRecord.selector).trigger('change',[eventRecord.value]);

        } else if (eventType === 'select') {
            console.log('5000','change',eventRecord.selector,eventRecord.value);
            //$(eventRecord.selector).trigger('change',[eventRecord.value]);
            $(eventRecord.selector).val(eventRecord.value).trigger('change');
      
        } else if (eventType === 'menuclick') {
            $(eventRecord.selector).trigger('click');

        } else if (eventType === 'menuleafclick') {
            AKT.menuHandler[step.selector.substring(1)]();
        }
    }
    AKT.state.playingEvents = false;
}

