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
			"date": "30-Oct-2017"
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
			"date":"25-Nov-2017"
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
//function process and returns dividend data
function getDividendData(mfObj){
	
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
					console.log("realized",realized)
				}else{
					realized = (purchaseArr[j]["units"]*purchaseArr[j]["nav"])-redemptionAmt;
					console.log("realized",realized);
					redemptionAmt =0; // since it is already in realized, marking it to zero
				}
				
				unitsRedeemed = -(purchaseArr[j]["units"] - unitsRedeemed);
			}

		}
	}
	return {
		"totalUnits": totalUnits,
		"totalCostAmt": totalCostAmt,
		"realized": -(realized)
	}
}
//Determines the profit or loss realized
function realizedPL(mfObj){

}
avgCP(mfProfile["100033"]);