require('events').EventEmitter.defaultMaxListeners = 0;
const lineNotify = require('line-notify-nodejs')('YOUR API TOKEN');
const axios = require("axios");
const fs = require('fs');
var FormData = require('form-data');
var data = new FormData();
var cron = require('node-cron');


cron.schedule('*/1 * * * *', () => {
	
	mainloop()
	
}); 	


function mainloop() {

	var rawdata = fs.readFileSync('Confirmed.json');
	var jsondata = JSON.parse(rawdata);
	var jsonlock = jsondata.Confirmed 

	var config = {
		method: 'get',
		url: 'https://covid19.th-stat.com/api/open/today',
		headers: { 
			...data.getHeaders()
		},
	};


	axios(config) 

	.then(function (response) {

		var responses = response.data
		var Confirmed = responses.Confirmed
		var Recovered = responses.Recovered
		var Hospitalized = responses.Hospitalized
		var Deaths = responses.Deaths
		var NewConfirmed = responses.NewConfirmed
		var NewDeaths = responses.NewDeaths
		var UpdateDate = responses.UpdateDate


		if (Confirmed == jsonlock) {
			console.log("non-update")

		} else if (Confirmed == undefined) {

			console.log("non-update-undefined")

		} else {

			let Confirmedsa = { 
				Confirmed: Confirmed, 
			};

			let Confirmeds = JSON.stringify(Confirmedsa);
			fs.writeFileSync('Confirmed.json', Confirmeds);


			var input = "\n" +
			"รายงานติดเชื่อสะสม " + Confirmed + " คน\n" + 
			"รักษาหายแล้ว " + Confirmed + " คน\n" + 
			"กำลังรักษา " + Hospitalized + " คน\n" +
			"เสียชีวิตเเล้ว " + Deaths + " คน\n\n" +
			"วันนี้ติดเพิ่ม " + NewConfirmed + " คน\n" + 
			"วันนี้เสียชีวิต " + NewDeaths + " คน\n\n" +
			"ประจำวันที่ " + UpdateDate 

			apitodiscord(input)

		}

	})

	.catch(function (error) {
		console.log(error);
	});

}


async function apitodiscord(input){
	await lineNotify.notify({

		message:input,

	}).then(() => {
		console.log('send completed!');
	});
}