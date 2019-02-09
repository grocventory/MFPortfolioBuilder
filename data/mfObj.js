var mfProfile = {
	"100033": {
		"name": "Aditya Birla Sun Life Advantage Fund - Regular Growth",
		"purchase": [{
			"units": 10,
			"nav": 95,
			"date": "27-Oct-2017"
		}, {
			"units": 10,
			"nav": 90,
			"date": "27-Nov-2017"
		}, {
			"units": 25,
			"nav": 92,
			"date": "28-Nov-2017"
		}],
		"redemption": [{
			"units": 20,
			"nav": 90,
			"date": "28-Nov-2017"
		}, {
			"units": 10,
			"nav": 90,
			"date": "30-Nov-2017"
		}],
		"dividend":[{
			"rate":2.5,
			"date":"20-Nov-2017"
		},{
			"rate":0.5,
			"date":"28-Nov-2017"
		}]
	}

}
//Determines Avg Cost price of the Investments made at different intervals
function avgCP(mfObj) {
	console.log("Average cost price of MF ", mfObj["name"]);
	/*var unitsRedeemed = 0;	
	if (typeof mfObj !== "undefined") {
		if ((mfObj["redemption"] !== "undefined") && (mfObj["redemption"].length > 0)) {
			var redemptArr = mfObj["redemption"];
			for (var i = 0; i < redemptArr.length; i++) {
				unitsRedeemed = redemptArr[i]["units"] + unitsRedeemed;
			}
		}
		console.log("Total Units Redeemed:", unitsRedeemed);
	*/
		var avgCPObj = processRedemption(mfObj);
		console.log("Balance Units: "+avgCPObj["totalUnits"]);
		console.log("Amount Costed: "+avgCPObj["totalCostAmt"]);
		console.log("Amount Realized: "+avgCPObj["realized"]);
		console.log("Dividends Amount: "+avgCPObj["dividend"]);
		console.log(getPLData(mfObj));
		//getDividendData(mfObj);
	}

// function process and returns the redemption details
function getRedemptionData(mfObj){
	var unitsRedeemed = 0;
	var redemptionAmt = 0;
	if (typeof mfObj !== "undefined") {
		if ((mfObj["redemption"] !== "undefined") && (mfObj["redemption"].length > 0)) {
			var redemptArr = mfObj["redemption"];
			for (var i = 0; i < redemptArr.length; i++) {
				unitsRedeemed = redemptArr[i]["units"] + unitsRedeemed;
				redemptionAmt = (redemptArr[i]["units"]*redemptArr[i]["nav"])+redemptionAmt;
			}
		}
	}
	return{
		"unitsRedeemed":unitsRedeemed,
		"redemptionAmt":redemptionAmt
	}
}
// function process and returns the purchase details
function getPurchaseData(mfObj){
	var unitsPurchased = 0;
	var purchasedAmt = 0;
	if (typeof mfObj !== "undefined") {
		if ((mfObj["purchase"] !== "undefined") && (mfObj["purchase"].length > 0)) {
			var purchaseArr = mfObj["purchase"];
			for (var i = 0; i < purchaseArr.length; i++) {
				unitsPurchased = purchaseArr[i]["units"] + unitsPurchased;
				purchasedAmt = (purchaseArr[i]["units"]*purchaseArr[i]["nav"])+purchasedAmt;
			}
		}
	}
	return{
		"unitsPurchased":unitsPurchased,
		"purchasedAmt":purchasedAmt
	}
}
//function process and returns dividend data
function getDividendData(mfObj){
	console.log("calculating Dividen Data");
	var dividendRealized = 0
	if (typeof mfObj !== "undefined") {
		if ((mfObj["dividend"] !== "undefined") && (mfObj["dividend"].length > 0)) {
			var dividendArr = mfObj["dividend"];			
			for (var i = 0; i < dividendArr.length; i++) {
				var unitsObj = getAvailableUnits(mfObj,dividendArr[i]["date"]);
				//console.log(unitsObj);
				dividendRealized = dividendRealized+((unitsObj["p"]-unitsObj["r"])*dividendArr[i]["rate"]);
				//console.log(dividendRealized);
			}
		}
	}
	return dividendRealized;	
}
// Utility function, that returns availble units for a given date
function getAvailableUnits(mfObj, date) {
	var unitsObj = {
		"p":0,
		"r":0
	};
	if (typeof mfObj !== "undefined" && typeof date !== "undefined") {
		// collect purchased units
		if ((mfObj["purchase"] !== "undefined") && (mfObj["purchase"].length > 0)) {
			var purchaseArr = mfObj["purchase"];
			for (var j = 0; j < purchaseArr.length; j++) {
				if(Date.parse(date)>=Date.parse(purchaseArr[j]["date"])){
					unitsObj["p"] = unitsObj["p"]+purchaseArr[j]["units"];
				}
			}
		}
		// collect Redeemed units
		if ((mfObj["redemption"] !== "undefined") && (mfObj["redemption"].length > 0)) {
			var redemptArr = mfObj["redemption"];
			for (var i = 0; i < redemptArr.length; i++) {
				if(Date.parse(date)>=Date.parse(redemptArr[i]["date"])){
					unitsObj["r"] = unitsObj["r"]+redemptArr[i]["units"];
				}
			}
		}
	}
	return unitsObj;
}
//Determines the profit or loss realized
function getPLData(mfObj) {

	function constructPLObj(units,rNav,pNav,pDate,rDate) {
		var tempObj = new Object();
		tempObj["units"] = units;
		tempObj["rNav"] = rNav;
		tempObj["pNav"] = pNav;
		tempObj["pDate"] = pDate;
		tempObj["rDate"] = rDate;
		return tempObj;
	}

	function constructCFObj(units, nav, date) {
		var tempObj = new Object();
		tempObj["units"] = units;
		tempObj["nav"] = nav;
		tempObj["date"] = date;
		return tempObj;
	}
	
	if ((typeof mfObj !== "undefined") && (mfObj["purchase"] !== "undefined") && (mfObj["purchase"].length > 0)) {
		var purchaseArr = mfObj["purchase"];
		if ((mfObj["redemption"] !== "undefined") && (mfObj["redemption"].length > 0)) {
			var redemptArr = mfObj["redemption"];
			var pLArray = [];
			var rCfObj = null;
			var pCfObj = null;
			var pLObj;
			while (redemptArr.length > 0) {
				var redemObj = (rCfObj === null) ? (redemptArr.splice(0, 1))[0] : rCfObj;
				//console.log("in while redemObj",redemObj);
				var purchaseObj = (pCfObj === null) ? (purchaseArr.splice(0, 1))[0] : pCfObj;				
				//scenario 1 r=20 p=10
				if (redemObj["units"] > purchaseObj["units"]) {
					//console.log("in UC1");
					pLObj = constructPLObj(purchaseObj["units"], redemObj["nav"],purchaseObj["nav"], purchaseObj["date"], redemObj["date"]);
					//console.log(pLObj);
					pLArray.push(pLObj);
					// carry forward the balance redeemed units
					rCfObj = constructCFObj(redemObj["units"] - purchaseObj["units"], redemObj["nav"], redemObj["date"]);
					pCfObj = null;
					//Scenario 2 r=10 p=20
				} else if (redemObj["units"] < purchaseObj["units"]) {
					pLObj = constructPLObj(redemObj["units"], redemObj["nav"],purchaseObj["nav"], purchaseObj["date"], redemObj["date"]);
					pLArray.push(pLObj);
					// carry forward the balance purchase units
					pCfObj = constructCFObj(purchaseObj["units"] - redemObj["units"], purchaseObj["nav"], purchaseObj["date"]);
					rCfObj = null;
					//Scenario 3 r=10 p=10	
				} else if (redemObj["units"] == purchaseObj["units"]) {
					pLObj = constructPLObj(redemObj["units"], redemObj["nav"],purchaseObj["nav"], purchaseObj["date"], redemObj["date"]);
					pLArray.push(pLObj);
					pCfObj = null;
					rCfObj = null;
				}
			}
		}

	}

	return {
		"pLArray": pLArray
	}
}
function getSummaryData(mfObj){

}
function processRedemption(mfObj) {
	var redempDataObj = getRedemptionData(mfObj);	
	var unitsRedeemed = redempDataObj["unitsRedeemed"];
	var redemptionAmt = redempDataObj["redemptionAmt"];
	console.log("unitsRedeemed: "+unitsRedeemed+" RedemptionAmount: "+redemptionAmt);

	if ((mfObj["purchase"] !== "undefined") && (mfObj["purchase"].length > 0)) {
		var purchaseArr = mfObj["purchase"];
		var totalUnits = 0;
		var totalCostAmt = 0;
		var realized = 0;
		for (var j = 0; j < purchaseArr.length; j++) {
			if (unitsRedeemed == 0) {
				totalUnits = totalUnits + purchaseArr[j]["units"];
				totalCostAmt = totalCostAmt + (purchaseArr[j]["units"] * purchaseArr[j]["nav"]);
			} else if ((purchaseArr[j]["units"] - unitsRedeemed) >= 0) {
				if(redemptionAmt === 0){
					realized = (unitsRedeemed*purchaseArr[j]["nav"])+realized;					
				}else{
					realized = (unitsRedeemed*purchaseArr[j]["nav"])-redemptionAmt;
				}				
				var balanceUnits = purchaseArr[j]["units"] - unitsRedeemed;
				totalUnits = totalUnits + balanceUnits;
				totalCostAmt = totalCostAmt + (balanceUnits * purchaseArr[j]["nav"]);
				unitsRedeemed = 0;
			} else if ((purchaseArr[j]["units"] - unitsRedeemed) < 0) {
				if(realized<0 || realized>0){
					realized = (purchaseArr[j]["units"]*purchaseArr[j]["nav"])+realized;
					//console.log("realized",realized)
				}else{
					realized = (purchaseArr[j]["units"]*purchaseArr[j]["nav"])-redemptionAmt;
					//console.log("realized",realized);
					redemptionAmt =0; // since it is already in realized, marking it to zero
				}
				
				unitsRedeemed = -(purchaseArr[j]["units"] - unitsRedeemed);
			}

		}
	}
	return {
		"totalUnits": totalUnits,
		"totalCostAmt": totalCostAmt,
		"realized": realized,
		"dividend": getDividendData(mfObj)
	}
}

avgCP(mfProfile["100033"]);