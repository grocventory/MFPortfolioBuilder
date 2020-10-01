var fs = require('fs'); 
//var doc = fs.readFileSync('mf_nav.txt', 'utf8');
//var doc2 = fs.readFileSync('nav.txt', 'utf8');
//var doc1 = fs.readFileSync("https://www.amfiindia.com/spages/NAVAll.txt?t=25072018105321",'utf8');
//for NPS https://www.npscra.nsdl.co.in/nav-search.php
var npsUtility = (function() {
	var cleanUpNPSList = function(arrLines) {
		//console.log(Array.isArray(arrList));
        var regExId =  /SM/gi;
         var regExDate =  /\\\r/gi;
		for (var k = 0; k < arrLines.length; k++) {
			//console.log(arrList[k].search(/\;/i));
			//console.log(arrLines[k]);
            var rec = arrLines[k].split(',');
             var rmCol = rec.splice(1,2);
             //console.log(rec);
             //console.log(line);
             //line[1] = line[1].replace(regEx,'');
             rec[1] =(typeof rec[1]!=="undefined")?rec[1].replace(regExId,''):"";
             rec[3] =(typeof rec[3]!=="undefined")?rec[3].replace(/\r\n|\n|\r/gm, ""):"";
             //console.log(rec);
             //swapping cloumns in order 
             var nav= rec[3];
             var date= rec[0];
             var scheme = rec[2];
             var id = rec[1];
             rec[0] = id;
             rec[1] = scheme;
             rec[2] = nav;
             rec[3] = date;
             //console.log(rec[1]);
             arrLines[k] = rec.join(",");
			
		}
		return arrLines;
	};
    var normalizeNPSList = function(filePath){
        var npsContent = fs.readFileSync(filePath, 'utf8');
		var inLines = npsContent.split('\n'); // convert each line to Array
		var cleanUpNPSArr = cleanUpNPSList(inLines); // clean up unwanted data
        return cleanUpNPSArr;
		
    };
	// returns array of MF objects (subscribed)
	getSubscribedNPSList = function(subsMFList, filePath) {
		//var structJSON = getStructuredJSON(mfFilePath);
        var npsList = normalizeNPSList(filePath);
		/*var subsMFObjArr = [];
		if (subsMFList instanceof Array && subsMFList.length > 0) {
			subsMFList.sort();
			for (var k = 0; k < subsMFList.length; k++) {
				if (typeof structJSON[subsMFList[k]] !== "undefined")
					structJSON[subsMFList[k]]["Scheme Code"]=subsMFList[k];
					subsMFObjArr.push(structJSON[subsMFList[k]]);
			}
		}*/
		return npsList.join('\n');
	};
	getSelectiveCSV = function(objArr, fieldArr){
		var selectCSV= "";
		if(typeof objArr !== "undefined"){
			selectCSV = json2csv({ data: objArr, fields: fieldArr });
		}
		return selectCSV;
	}
	exportToCSV = function(filePath, csvFilepath, subsNPSList, fieldArr) {
			//var subsMFArr = getSubscribedMFList(subsMFList, mfFilePath);
			//var csvData = getSelectiveCSV(subsMFArr, fieldArr);
            var csvData = getSubscribedNPSList(subsNPSList, filePath);
			fs.writeFile(csvFilepath, csvData, function(err) {
				if (err) throw err;
				console.log("file saved");
			});
	};
	return{
		getSelectiveCSV:getSelectiveCSV,
        cleanUpNPSList:cleanUpNPSList,
		exportToCSV:exportToCSV
	}

})()

var schemeList=[118191,112936,113134,124172,112342,118133,134545,112096,117957,111962,113070,111524,102205,101818,109445,103308,113545,102920,100080,101765,105758,102594,112090,103504,103360,118102,113177,140107,141545,112351,100120,112937,100355,141957];
//console.log(keys.split(";"));

var fields = ['Scheme Code','Scheme Name', 'Net Asset Value','Date'];
npsUtility.exportToCSV('../data/navall(nps).out','../reports/npsnav.csv',schemeList,fields);
