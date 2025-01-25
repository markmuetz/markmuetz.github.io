// Big thanks to Jason Makudera
// https://www.cssscript.com/minimal-json-data-formatter-jsonviewer/

AKT.widgets.json_viewer = {};


AKT.widgets.json_viewer.setup = function (widget) {

};


AKT.widgets.json_viewer.display = function (widget) {
        var kbId = AKT.state.current_kb;
        var kb = AKT.KBs[kbId];
        var jsonObj = kb.generateJsonFromKb();
		var jsonViewer = new JSONViewer();
		document.querySelector(".div_json").appendChild(jsonViewer.getContainer());
		jsonViewer.showJSON(jsonObj,null,1);

        var button_expand1 = $(widget.element).find('.expand1');
        var button_expand2 = $(widget.element).find('.expand2');
        var button_expand3 = $(widget.element).find('.expand3');
        var button_expand_all = $(widget.element).find('.expand_all');
    
        $(button_expand1).on('click', function() {
			jsonViewer.showJSON(jsonObj, null, 1);
        });
        $(button_expand2).on('click', function() {
			jsonViewer.showJSON(jsonObj, null, 2);
        });
        $(button_expand3).on('click', function() {
			jsonViewer.showJSON(jsonObj, null, 3);
        });
        $(button_expand_all).on('click', function() {
			jsonViewer.showJSON(jsonObj, null, 99);
        });

};


AKT.widgets.json_viewer.html = `
    <div class="content" style="padding:12px;border:none;">
        <div id="div_json" class="div_json" style="width:700px;height:420px;border:solid 1px black;overflow-y:auto; text-wrap:wrap;">
        </div>
	    <div>
		    <!--button type="button" class="load-json">Load JSON</button-->
		    <button type="button" class="expand1" style="margin:4px;padding:4px;">Level 1</button>
		    <button type="button" class="expand2" style="margin:4px;padding:4px;">Level 2</button>
		    <button type="button" class="expand3" style="margin:4px;padding:4px;">Level 3</button>
		    <button type="button" class="expand_all" style="margin:4px;padding:4px;">All levels</button>
	    </div>
    </div>  

`;



