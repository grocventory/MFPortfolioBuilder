var fs = require('fs');
var toJSON = require('plain-text-data-to-json');
var json2csv = require('json2csv');
 
//var doc = fs.readFileSync('mf_nav.txt', 'utf8');
//var doc2 = fs.readFileSync('nav.txt', 'utf8');
//var doc1 = fs.readFileSync("http://portal.amfiindia.com/spages/NAV0.txt",'utf8');
var mfUtility = (function() {
	var rawMFList;
	var cleanUpMFList = function(arrLines) {
		var len = arrLines.length;
		//console.log(Array.isArray(arrList));
		for (var k = 0; k < len; k++) {
			//console.log(arrList[k].search(/\;/i));
			if ((arrLines[k].search(/\;/i)) === -1) {
				var temp = arrLines.splice(k, 1);
				k = k - 1;
				len = arrLines.length;
			}
		}
		return arrLines;
	};
	var getStructuredJSON = function(mfFilePath) {
		//Read file
		var mfContent = fs.readFileSync(mfFilePath, 'utf8');
		var inLines = mfContent.split('\n'); // convert each line to Array
		var cleanUpMFArr = cleanUpMFList(inLines); // clean up unwanted data
		// convert back to string with line separator
		var cleanMFContent = cleanUpMFArr.join("\n");
		var rawJSON = toJSON(cleanMFContent); // convert to JSON
		//restructure JSON to format, which holds mfid as key and rest as JSONobj
		var restructJSON = {};
		var keysArr = rawJSON[rawJSON.length - 1].split(";");
		for (var i = 0; i < rawJSON.length - 1; i++) {
			var record = rawJSON[i].split(";");
			//restructJSON[record[]]
			restructJSON[record[0]] = new Object();
			for (var j = 1; j < keysArr.length; j++) {
				restructJSON[record[0]][keysArr[j]] = record[j];
			}
		}
		return restructJSON;
	};
	// returns array of MF objects (subscribed)
	getSubscribedMFList = function(subsMFList, mfFilePath) {
		var structJSON = getStructuredJSON(mfFilePath);
		var subsMFObjArr = [];
		if (subsMFList instanceof Array && subsMFList.length > 0) {
			subsMFList.sort();
			for (var k = 0; k < subsMFList.length; k++) {
				if (typeof structJSON[subsMFList[k]] !== "undefined")
					structJSON[subsMFList[k]]["Scheme Code"]=subsMFList[k];
					subsMFObjArr.push(structJSON[subsMFList[k]]);
			}
		}
		return subsMFObjArr;
	};
	getSelectiveCSV = function(objArr, fieldArr){
		var selectCSV= "";
		if(typeof objArr !== "undefined"){
			selectCSV = json2csv({ data: objArr, fields: fieldArr });
		}
		return selectCSV;
	}
	exportToCSV = function(mfFilePath, csvFilepath, subsMFList, fieldArr) {
			var subsMFArr = getSubscribedMFList(subsMFList, mfFilePath);
			var csvData = getSelectiveCSV(subsMFArr, fieldArr);
			fs.writeFile(csvFilepath, csvData, function(err) {
				if (err) throw err;
				console.log("file saved");
			});
	};
	return{
		getStructuredJSON:getStructuredJSON,
		getSubscribedMFList:getSubscribedMFList,
		getSelectiveCSV:getSelectiveCSV,
		exportToCSV:exportToCSV
	}

})()

var schemeList=[118191,112936,113134,124172,112342,118133,134545,112096,117957,111962,113070,111524,102205,101818,109445,103308,113545,102920,100080,101765,105758,102594,112090,103504,103360,118102,113177,140107,141545,112351];
//console.log(keys.split(";"));

var fields = ['Scheme Code','Scheme Name', 'Sale Price','Date'];
mfUtility.exportToCSV('./data/nav.txt','./reports/nav.csv',schemeList,fields);
