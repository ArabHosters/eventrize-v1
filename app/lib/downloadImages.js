
 
function loadthenextFile(type)
{
	//console.log(downloadQueue[type]);
	
    if (xhrCount[type] > 0){
        downloadQueue[type][xhrCount - 1] == null;
    }
    
    if (xhrCount[type] < downloadQueue[type].length){
        var fileUrl = downloadQueue[type][xhrCount[type]];
 
        var fileName = fileUrl.substring(fileUrl.lastIndexOf('/') + 1);
        fileName = type + "_" + xhrCount[type] + "_" + fileName;
 
        retrieveData({type:type,URL: fileUrl, fileName: fileName, folderName: rootDir,index:xhrCount[type]});
 		
 	
        xhrCount[type]++;
    }else {
    	if(type == "sponsors")
			loadthenextFile("speakers");
		else if(type == "speakers")	
   			loadthenextFile("judges");
   		else if(type == "judges")	
   			loadthenextFile("coaches");
   		else if(type == "coaches")	
   			loadthenextFile("organizers");
   		else	
    		show_time();
    }
};
 
function retrieveData(params)
{
    var url = params.URL;
    var type = params.type;
 
    xhrRequest[type][xhrCount[type]]  =  Ti.Network.createHTTPClient();
 
    xhrRequest[type][xhrCount[type]].onerror  = function(){
    	error(e);
        xhrRequest[type][xhrCount[type]]  =  null; // need to null out the request on failure or success
    };
    xhrRequest[type][xhrCount[type]].onload  = function(){
 
        SaveFile(params.folderName, params.fileName, this.responseData,params.index,type);
 
        xhrRequest[type][xhrCount[type]]  =  null;
 
        loadthenextFile(type);
    };
 	
 	xhrRequest[type][xhrCount[type]].open('GET', url);
    xhrRequest[type][xhrCount[type]].send();
    
};
 
 
function SaveFile(foldername, filename, response,index,type){
 
    Ti.API.info(response.type);
    Ti.API.info(foldername + "/" + filename);
 	$.loading.setMessage(filename);
    if (response.type == 1){
        var f = Ti.Filesystem.getFile(response.nativePath);
        var dest = Ti.Filesystem.getFile(foldername,"images", type, filename);
 
        if (dest.exists()){
            dest.deleteFile();
        }
 
        f.move(dest.nativePath);
 
        f = null;
        dest = null;
    }else{
    	
		var g = Ti.Filesystem.getFile(foldername,"images",type);
		if (!g.exists()) {
			g.createDirectory();
		};

        var dest = Ti.Filesystem.getFile(foldername,"images", type, filename);
        dest.write(response);
 		//images[index]=
 		Alloy.Globals.jsonData[type][index].image=dest.nativePath;
        dest = null;
    }
}
