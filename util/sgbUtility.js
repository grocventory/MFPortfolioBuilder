var fs = require('fs');
var toJSON = require('plain-text-data-to-json');
var json2csv = require('json2csv');
 
//var doc = fs.readFileSync('mf_nav.txt', 'utf8');
//var doc2 = fs.readFileSync('nav.txt', 'utf8');
//var doc1 = fs.readFileSync("https://www.amfiindia.com/spages/NAVAll.txt?t=25072018105321",'utf8');
//https://www.nseindia.com/live_market/dynaContent/live_watch/equities_stock_watch.htm?cat=SGB
//For Gold Bonds: https://www.nseindia.com/live_market/dynaContent/live_watch/stock_watch/sovGoldStockWatch.json
//for Tax Free Bonds: https://www.nseindia.com/live_market/dynaContent/live_watch/stock_watch/cbmSecListStockWatch.json
var sgbUtility = (function() {
	var getStructuredJSON = function(sgbFilePath) {
		//Read file
		var sgbContent = fs.readFileSync(sgbFilePath, 'utf8');
		var rawJSON = JSON.parse(sgbContent); // convert to JSON
		//restructure JSON to format, which holds mfid as key and rest as JSONobj
		var sgbJSONArr = rawJSON.data;
		var currDate = rawJSON.time;
		sgbJSONArr.forEach(function(obj){
				obj["date"] = currDate;
				if(obj["series"]){obj["symbol"]=obj["symbol"]+"-"+obj["series"]}
		});
		//console.log(sgbJSONArr);		
		return sgbJSONArr;
	};
	
	getSelectiveCSV = function(objArr, fieldArr){
		var selectCSV= "";
		if(typeof objArr !== "undefined"){
			selectCSV = json2csv({ data: objArr, fields: fieldArr });
		}
		return selectCSV;
	}
	exportToCSV = function(sgbFilePath, csvFilepath, fieldArr) {
			var sgbArr = getStructuredJSON(sgbFilePath);
			var csvData = getSelectiveCSV(sgbArr, fieldArr);
			fs.writeFile(csvFilepath, csvData, function(err) {
				if (err) throw err;
				console.log("file saved");
			});
	};
	return{
		getStructuredJSON:getStructuredJSON,
		getSelectiveCSV:getSelectiveCSV,
		exportToCSV:exportToCSV
	}

})()

//var schemeList=[118191,112936,113134,124172,112342,118133,134545,112096,117957,111962,113070,111524,102205,101818,109445,103308,113545,102920,100080,101765,105758,102594,112090,103504,103360,118102,113177,140107,141545,112351,100120,112937,100355,141957];
//console.log(keys.split(";"));

var sgbFields = ['symbol','issue_price', 'ltP','date'];
sgbUtility.exportToCSV('../data/sovGoldStockWatch.json','../reports/nav(sgb).csv',sgbFields);
var bondFields =["symbol","series","bond_type","coupr","face_value","maturity_date","ltP","bYield","date"];
sgbUtility.exportToCSV('../data/cbmSecListStockWatch.json','../reports/nav(taxfree).csv',bondFields);
