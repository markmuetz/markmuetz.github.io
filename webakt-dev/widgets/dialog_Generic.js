(function ($) {

  /***********************************************************
   *         dialog_Generic widget
   ***********************************************************
   */
    $.widget('akt.dialog_Generic', {
        meta:{
            short_description: 'dialog_Generic',
            long_description: 'dialog_Generic',
            author: 'Robert Muetzelfeldt',
            last_modified: 'July 2021; April 2023;',
            visible: true,
            options: {
            }
        },

        options: {
            kb:null,
            show_titlebar:true,
            widget_name: null
        },

        evaluate: function(kb) {
            var results = evaluate(kb);
            display(this, results);
            return results;
        },

        widgetEventPrefix: 'dialog_Generic:',

        _create: function () {
            console.log('\n*** Widget _create() method for  "dialog_Generic":',
                'Element ID:',this.element[0].id,'; Widget UUID:',this.uuid,'; Options:',this.options);
            var self = this;
            this.element.addClass('dialog_Generic-1');

            var kb = self.options.kb;

            createEmptyWidget(self);
            var results = evaluate(self);
            display(self, results);  // TODO - check that this works for diagramming -
            // I commented it out when working on it.

            //this._setOptions({
            //});
        },

        _destroy: function () {
            this.element.removeClass('dialog_Generic-1');
            this.element.empty();
            this._super();
        },
        _setOption: function (key, value) {
            console.log('\n** dialog_Generic: setOption: ',key,' = ',value);
            //console.log(arguments.callee.caller.toString());
            var self = this;
            var prev = this.options[key];
            if (key === 'visible' && value) {
                $(self.element).css({display:'block'});
                display(self, null);   // TODO: check this
            } else {
                if (key !== 'nodisplay' || (key === 'nodisplay' && !value)) {
                    console.debug('### ',key,value);
                    self.options[key] = value;
                    display(self, null);
                }
            }
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

// ================================================================================


    function createEmptyWidget(widget) {

/*  This should be replaced by a generic button-click event handler,
    applicable to ALL buttons.

        if (widget.options.show_titlebar) {
            $(widget.element).find('.w3-right').on('click', function () {
                AKT.recordEvent({
                    file:'dialog_Generic.js',
                    function:'createEmptyWidget()',
                    event:'click',
                    element:widget.element,
                    finds:['.dialog_close_button'],
                    message:'Clicked on the generic widgette close button'
                });
                $(widget.element).css({display:"none"});
            });
        }
        console.log('\n&&& ',widget.options);
        console.log(AKT.widgets);
*/
        if (AKT.widgets[widget.options.widget_name].html) {
            var widgetContent = $(AKT.widgets[widget.options.widget_name].html);
        }
        $(widget.element).append(widgetContent);

        $(widget.element).css({display:'block'});
        //$(widget.element).draggable();
        //$(widget.element).draggable({handle:".titlebar",containment:"#workspace"});

        AKT.widgets[widget.options.widget_name].setup(widget);
    }



    function evaluate(widget) {
        console.debug('Starting akt.dialog_Generic: evaluate()...');
        var results = null;
        return results;
    }


    function display(widget, results) {
        AKT.widgets[widget.options.widget_name].display(widget);

        var zindex = AKT.incrementZindex("dialog_Generic");
        $(widget.element).css({display:'block','z-index':zindex});
    }

})(jQuery);


