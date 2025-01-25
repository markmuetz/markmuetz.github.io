
/*  August 2022
     FILE SYSTEM ACCESS API
    https://web.dev/file-system-access/#deleting-files-and-folders-in-a-directory 
    Private: Steiner.Thomas [AT] gmail [DOT] com
    Work: tomac [AT] google [DOT] com 
    I emailed him and got a great response 11 Aug 2022
    See also: https://fjolt.com/article/javascript-new-file-system-api
    (though he mistakingly calls it the "File Access API")
    See also: https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API
    See also:https://css-tricks.com/getting-started-with-the-file-system-access-api/
*/

AKT.processFileSystemAccessAPI = function () {
	
	// LOADING A FILE
    // This handles the loading of a KB from a local file, using the File System Access API.
    let el1 = document.getElementById('menu_file_openkb');
    el1.addEventListener('click', async () => {
		
		
      const options = {
        types: [
          {
            description: 'AKT KB files',
            accept: {
              'text/json': ['.kb'],
            },
          },
        ],
      };
      [fileHandle] = await window.showOpenFilePicker(options);
      const file = await fileHandle.getFile();
      const contents = await file.text();

      var kbId = fileHandle.name;
      var kb = new Kb({name:kbId,kb_from_file:JSON.parse(contents)});
      kb._metadata.file = fileHandle.name;  // Same as kbId! - but could be different in future, perhaps.
      AKT.KBs[kbId] = kb;

      $('#menu_kb_selectkb').find('ul').append(
          '<li id="menu_kb_selectkb_'+kbId+'" class="menus-dropdown submenu leaf live" style="background:rgb(212,208,200);">'+
              '<a href="#" style="background: rgb(212, 208, 200); color: rgb(0, 0, 0);">'+kbId+'</a>'+
          '</li>');
      AKT.changeKb(kbId);

    });


	// SAVING A FILE
    // This handles the saving of a KB to local file, using the File System Access API.
    let el2 = document.getElementById('menu_file_savekb');
    el2.addEventListener('click', async () => {

      var kbId = AKT.state.current_kb;
      var kb = AKT.KBs[kbId];
      if (!kb) return;
	  
      var kbObjectToSave = kb.generateJsonFromKb();
      console.log(kbObjectToSave);
      var kbStringToSave = JSON.stringify(kbObjectToSave,null,4);

      const options = {
        suggestedName: 'untitled.kb',
        types: [
          {
            description: 'AKT KB files',
            accept: {
              'text/json': ['.kb'],
            },
          },
        ],
      };
      const fileHandle = await window.showSaveFilePicker(options);
      console.log('save filename:',fileHandle.name);
      // Do something with the file handle.
      const file = await fileHandle.getFile();
      // fileHandle is an instance of FileSystemFileHandle..
      // Create a FileSystemWritableFileStream to write to.
      const writable = await fileHandle.createWritable();
      // Write the contents of the file to the stream.
      const stringToSave = JSON.stringify(kbObjectToSave,null,4);
      await writable.write(stringToSave);
      // Close the file and write the contents to disk.
      await writable.close();
    });
};


