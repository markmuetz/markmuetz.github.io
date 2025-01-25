(function ($) {

  /***********************************************************
   *         dialog_SourceDetails widget
   ***********************************************************
   */
    $.widget('akt.dialog_SourceDetails', {
        meta:{
            short_description: 'dialog_SourceDetails',
            long_description: 'dialog_SourceDetails',
            author: 'Robert Muetzelfeldt',
            last_modified: 'April 2021',
            visible: true,
            options: {
            }
        },

        options: {
            kbId:'atwima',
            show_titlebar:true
        },

        evaluate: function(kb) {
            var results = evaluate(kb);
            display(this, results);
            return results;
        },

        widgetEventPrefix: 'dialog_SourceDetails:',

        _create: function () {
            console.debug('\n### Creating instance of widget "akt.dialog_SourceDetails".',
                '\nElement ID:',this.element[0].id,'  Widget UUID:',this.uuid,'  Options:',this.options);
            var self = this;
            this.element.addClass('dialog_SourceDetails-1');

            var kb = self.options.kb;
            var results = evaluate(kb);
            display(self, results);

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('dialog_SourceDetails-1');
            this.element.empty();
            this._super();
        },
        _setOption: function (key, value) {
            var self = this;
            var prev = this.options[key];
            var fnMap = {
            };

            // base
            this._super(key, value);

            if (key in fnMap) {
                fnMap[key]();

                // Fire event
                this._triggerOptionChanged(key, prev, value);
            }
        },

        _triggerOptionChanged: function (optionKey, previousValue, currentValue) {
            this._trigger('setOption', {type: 'setOption'}, {
                option: optionKey,
                previous: previousValue,
                current: currentValue
            });
        }
    });

    function evaluate(kbId) {
        console.debug('Starting akt.dialog_SourceDetails: evaluate()...');
        var results = null;
        return results;
    }


    function display(widget, results) {
        console.debug('Starting akt.dialog_SourceDetails: display()');
        console.debug(results);

        var kbId = widget.options.kbId;
        var kb = AKT.kbs[kbId];

        var widgetContent = $(widget.element).find('.content');

        var sourceIndex = AKT.state.source_index;  // TODO - Don't do it this way...
        console.debug(AKT.state.source_index, sourceIndex);

        // See comments in AKT.makeWidgetTitlebar(): I can't see why
        // event handler can't go there.  It works for AKT.reprocess...
        if (widget.options.show_titlebar) {
            console.debug(widget.widgetName);
            var titlebarDiv = AKT.makeWidgetTitlebar(widget.widgetName,widget.element);
            $(widget.element).append(titlebarDiv);
            $(widget.element).find('.w3-right').on('click', function () {
                $(widget.element).css({display:"none"});
            });
        }

        var widgetContent = $(baseHtml());
        $(widget.element).append(widgetContent);

        // SETUP
        if (sourceIndex) {
            var sourceDetails = AKT.getSourceDetails(kbId,sourceIndex);  
            //$(widgetContent).find('.div_id').text(sourceDetails.id);
            $(widgetContent).find('.div_name').text(sourceDetails.name);
            $(widgetContent).find('.div_location').text(sourceDetails.location);
            $(widgetContent).find('.div_year').text(sourceDetails.year);
            $(widgetContent).find('.div_suffix').text(sourceDetails.suffix);
            $(widgetContent).find('.div_interviewer').text(sourceDetails.interviewer);
            $(widgetContent).find('.div_interviewee').text(sourceDetails.interviewee);
            $(widgetContent).find('.select_sex').val(sourceDetails.sex);
            $(widgetContent).find('.input_day').val(sourceDetails.day);
            $(widgetContent).find('.input_month').val(sourceDetails.month);

        } else {         //sourceIndex = null - i.e. it's a new sorce
            $(widgetContent).find('.div_name').text('');
            $(widgetContent).find('.div_location').text('');
            $(widgetContent).find('.div_year').text('');
            $(widgetContent).find('.div_suffix').text('');
            $(widgetContent).find('.div_interviewer').text('');
            $(widgetContent).find('.div_interviewee').text('');
            $(widgetContent).find('.input_day').val('');
            $(widgetContent).find('.input_month').val('');
        }

        // TODO: Doesn't show selected options! - i.e. values for current source
        $('#sourcedetails500').empty();
        $.each(kb.sourceUserLabels, function(labelId,possibleValues) {
            var label = $('<label style="display:inline-block;width:120px;margin-top:10px;">'+labelId+'</label>');
            var select = $('<select style="width:150px;background:white;"></select>');
            $.each(possibleValues, function(i,val) {
                var option = $('<option value="'+val+'">'+val+'</option>');
                $(select).append(option);
            });
            $('#sourcedetails500').append(label).append(select).append('<br/>');
        });

        // EVENT HANDLERS

        $(widget.element).draggable({containment:'#workspace',handle:".titlebar"});
        $(widget.element).css({display:'block'});
    }


    function baseHtml() {
        return `<div class="content" style="border:none;padding:15px;">
    <fieldset style="float:left;">
        <legend>SOURCE</legend>

        <div style="float:left;width:70px;">Name:</div>
        <div class="div_name" contenteditable style="float:left;overflow:hidden;height:18px;width:120px;background:white;border:solid 1px black;padding-left:5px;"></div><br/>

        <div style="float:left;width:70px;margin-top:7px;">Location::</div>
        <div class="div_location" contenteditable style="float:left;overflow:hidden;height:18px;width:120px;background:white;border:solid 1px black;padding-left:5px;margin-top:7px;"></div><br/>

        <div style="float:left;width:70px;margin-top:7px;">Year:</div>
        <div class="div_year" contenteditable style="float:left;overflow:hidden;height:18px;width:70px;background:white;border:solid 1px black;padding-left:5px;margin-top:7px;"></div><br/>

        <div style="float:left;width:70px;margin-top:7px;">Year suffix:</div>
        <div class="div_suffix" contenteditable style="float:left;overflow:hidden;height:18px;width:30px;background:white;border:solid 1px black;padding-left:5px;margin-top:7px;"></div><br/>
    </fieldset>

    <div style="float:left;margin-left:15px;padding:top:15px;">
        <button style="width:65px;height:25px;margin:5px;">Save</button><br/>
        <button style="width:65px;height:25px;margin:5px;">Memo</button>
    </div>

    <div style="float:left;clear:left;margin-top:9px;">
        <div style="float:left;display:inline-block;width:70px;">Interviewer</div>
        <div class="div_interviewer" contenteditable style="float:left;overflow:hidden;height:18px;width:200px;background:white;border:solid 1px black;padding-left:5px;"></div><br/>

        <div style="float:left;display:inline-block;width:70px;margin-top:7px;">Interviewee</div>
        <div class="div_interviewee" contenteditable style="float:left;overflow:hidden;height:18px;width:200px;background:white;border:solid 1px black;padding-left:5px;margin-top:7px;"></div>
    </div>

    <div style="float:left;margin-left:15px;margin-top:8px;">
        <label for="">Gender</label><br/>
        <select id="" style="background:white;">
            <option value="male">M</option>
            <option value="female">F</option>
            <option value="male">male</option>
            <option value="female">female</option>
            <option value="mixed">mixed</option>
            <option value="na">na</option>
        </select>
    </div>

    <!-- container for user labels -->
    <div id="sourcedetails500" style="float:left;margin-top:20px;"></div>
    
    <div style="clear:both;"></div>

    <fieldset style="float:left; margin-top:20px;">
        <legend>DATE</legend>

        <label style="display:inline-block;" for="">Day</label>
        <input class="input_day" style="width:20px;" for=""></input>

        <label style="display:inline-block;margin-left:10px;" for="">Month</label>
        <input class="input_month" style="width:60px;" for=""></input><br/>
    </fieldset>


</div>     <!-- End of content div -->
`;
    }

})(jQuery);


