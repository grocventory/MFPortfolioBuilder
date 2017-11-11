var mfProfile = {
	"100033": {
		"name": "Aditya Birla Sun Life Advantage Fund - Regular Growth",
		"purchase": [{
			"units": 10.06,
			"nav": 95.55,
			"date": "27-Oct-2017"
		}, {
			"units": 10.15,
			"nav": 90.25,
			"date": "27-Nov-2017"
		}, {
			"units": 25.86,
			"nav": 92.15,
			"date": "28-Nov-2017"
		}],
		"redemption": [{
			"units": 3.15,
			"nav": 98.07,
			"date": "30-Oct-2017"
		}, {
			"units": 10.97,
			"nav": 90.85,
			"date": "30-Nov-2017"
		}]
	}

}
//Determines Avg Cost price of the Investments made at different intervals
function avgCP(mfObj) {
	console.log("Average cost price of MF ", mfObj["name"]);
	var unitsRedeemed = 0;
	if (typeof mfObj !== "undefined") {
		if ((mfObj["redemption"] !== "undefined") && (mfObj["redemption"].length > 0)) {
			var redemptArr = mfObj["redemption"];
			for (var i = 0; i < redemptArr.length; i++) {
				unitsRedeemed = redemptArr[i]["units"] + unitsRedeemed;
			}
		}
		console.log("Total Units Redeemed:", unitsRedeemed);
		var avgCPObj = processRedemption(mfObj,unitsRedeemed);
		console.log("Balance Units: "+avgCPObj["totalUnits"]);
		console.log("Amount Costed: "+avgCPObj["totalCostAmt"]);
	}
}
function processRedemption(mfObj, unitsRedeemed) {
	if ((mfObj["purchase"] !== "undefined") && (mfObj["purchase"].length > 0)) {
		var purchaseArr = mfObj["purchase"];
		var totalUnits = 0;
		var totalCostAmt = 0;
		for (var j = 0; j < purchaseArr.length; j++) {
			if (unitsRedeemed == 0) {
				totalUnits = totalUnits + purchaseArr[j]["units"];
				totalCostAmt = totalCostAmt + (purchaseArr[j]["units"] * purchaseArr[j]["nav"]);
			} else if ((purchaseArr[j]["units"] - unitsRedeemed) > 0) {
				var balanceUnits = purchaseArr[j]["units"] - unitsRedeemed;
				totalUnits = totalUnits + balanceUnits;
				totalCostAmt = totalCostAmt + (balanceUnits * purchaseArr[j]["nav"]);
				unitsRedeemed = 0;
			} else if ((purchaseArr[j]["units"] - unitsRedeemed) < 0) {
				unitsRedeemed = -(purchaseArr[j]["units"] - unitsRedeemed);
			}

		}
	}
	return {
		"totalUnits": totalUnits,
		"totalCostAmt": totalCostAmt
	}
}
//Determines the profit or loss realized
function realizedPL(mfObj){

}
avgCP(mfProfile["100033"]);