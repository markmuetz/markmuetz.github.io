(function ($) {

  /***********************************************************
   *         dialog_FormalTermDetails widget
   ***********************************************************
   */
    $.widget('akt.dialog_FormalTermDetails', {
        meta:{
            short_description: 'dialog_FormalTermDetails',
            long_description: 'dialog_FormalTermDetails',
            author: 'Robert Muetzelfeldt',
            last_modified: 'April 2021',
            visible: true,
            options: {
            }
        },

        options: {
            kb:null,
            show_titlebar:true
        },

        evaluate: function(kb) {
            var results = evaluate(kb);
            display(this, results);
            return results;
        },

        widgetEventPrefix: 'dialog_FormalTermDetails:',

        _create: function () {
            console.debug('\n### Creating instance of widget "akt.dialog_FormalTermDetails".',
                '\nElement ID:',this.element[0].id,'  Widget UUID:',this.uuid,'  Options:',this.options);
            var self = this;
            this.element.addClass('dialog_FormalTermDetails-1');

            var kb = self.options.kb;
            var results = evaluate(kb);
            display(self, results);

            this._setOptions({
            });
        },

        _destroy: function () {
            this.element.removeClass('dialog_FormalTermDetails-1');
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
        console.debug('Starting akt.dialog_FormalTermDetails: evaluate()...');
        var results = null;
        return results;
    }


    function display(widget, results) {
        console.debug('Starting akt.dialog_FormalTermDetails: display()');
        console.debug(results);
        var kbId = AKT.state.current_kb;
        var kb = AKT.kbs[kbId];

        if (widget.options.show_titlebar) {
            var widgetTitlebar = $('<div class="titlebar">dialog_FormalTermDetails<input type="button" value="X" class="dialog_close_button"/></div>');  
            $(widget.element).append(widgetTitlebar);
            $('.dialog_close_button').css({background:'yellow'});
            $('.dialog_close_button').on('click', function () {
                var id = $(this).parent().parent()[0].id;
                $('#'+id).css({display:"none"});
            });
        }
        var widgetContent = $(baseHtml());
        $(widget.element).append(widgetContent);

        // SETUP
        $('#formaltermdetails801').text(AKT.state.formal_term_id);   // TODO - fix this hack - pass in as option

        // EVENT HANDLERS

        $(widget.element).draggable({containment:'#workspace',handle:".titlebar"});
        $(widget.element).css({display:'block'});
    }


    function baseHtml() {
        return `<div class="content" style="border:none; padding:15px;">

    <div>
        <div style="float:left;width:80px;height:20px;">Formal Term :</div>
        <textarea id="formaltermdetails801" style="float:left;width:170px;height:20px;"></textarea>

        <div style="float:left;width:40px;height:20px;margin-left:20px;">Type:</div>
        <textarea id="formaltermdetails500" style="float:left;width:80px;height:20px;"></textarea><br/>

        <div style="clear:both;"></div>
    </div>

    <div style="margin-top:15px;">

        <div style="float:left;width:45px;height:20px;">Part of :</div>
        <select id="formaltermdetails806" size=3 style="float:left;width:110px; background:white"></select>

        <div style="float:left;width:35px;height:20px;margin-left:15px;">Parts:</div>
        <select id="formaltermdetails805" size=3 style="float:left;width:110px; background:white"></select>

        <button id="formaltermdetails102" style="float:left;width:55px;height:35px;margin-left:20px;">Save</button>

        <div style="clear:both;"></div>
    </div>

    <div style="margin-top:15px;">
        <div style="clear:left;float:left;width:60px;height:20px;">Definition: </div>
        <textarea id="formaltermdetails800" style="float:left;width:240px;height:65px;"></textarea>

        <div style="clear:both;"></div>
    </div>

    <div style="margin-top:10px;">
        <div style="clear:both;width:70px;height:20px;margin-left:100px;">Synonym(s):</div>
        <div style="float:left;">
            <button id="formaltermdetails107" style="width:50px;height:30px;">up</button><br/>
            <button id="formaltermdetails108" style="width:50px;height:30px;">down</button>
        </div>

        <div style="float:left;">
            <select id="formaltermdetails802" size=4 style="float:left;width:200px;margin-left:10px;margin-right:10px;background:white">[]</select>
        </div>

        <div style="float:left;">
            <button id="formaltermdetails109" style="width:50px;height:30px;">add</button><br/>
            <button id="formaltermdetails110" style="width:50px;height:30px;">Delete</button>
        </div>

        <div style="clear:both;"></div>
    </div>

    <div style="margin-top:15px;">
        <button id="formaltermdetails105" style="width:150px;height:40px;">Show use in statements</button>
        <button id="formaltermdetails106" style="width:150px;height:40px;">Show use in hierarchies</button>
    </div>

</div>     <!-- End of content div -->
`;
    }

})(jQuery);


