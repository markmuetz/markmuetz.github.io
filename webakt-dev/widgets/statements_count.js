(function ($) {

    if (!AKT.tools) AKT.tools = {};
    AKT.tools.statements_count = {
        short_description: 'Displays the number of statements',
        long_description: 'Calculates the number of statements in the knowledge base.',
        author: 'Robert Muetzelfeldt',
        last_modified: 'August 2024'
    };

    $.widget('akt.statements_count', {

        options: {
            kbId:AKT.state.current_kb,
            show_titlebar:true
       },

        _create: function () {
            var kbId = this.options.kbId;
            go(this,kbId);
        },
    });

    function go(widget,kbId) {
        // Do the computations.
        var count = 0;
        var statements = AKT.KBs[kbId]._statements;
        for (var id in statements) {
            count += 1;
        }

        // Display the results
        var mainDiv = $('<div></div>');
        $(mainDiv).append('<span>Number of statements=</span>');
        $(mainDiv).append('<span>'+count+'</span');
        $(widget.element).append(mainDiv);
    }

})(jQuery);
