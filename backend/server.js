var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var ip = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var express = require('express');
var app = express();
var morgan = require('morgan');
var cors = require('cors');
var mongoose = require('mongoose');
var request = require('request'),
	username = "DPLYYWV1GT9",
	password = "57f7e323-9b47-4e58-ab87-4b63ac0f89e7",
	auth = "Basic " + new Buffer(username + ":" + password).toString("base64");
var users = require('./routes/users');
var cron = require('node-schedule');
var Data = require('./models/bigMach');
var User = require('./models/users');


mongoose.Promise = global.Promise;
var connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
	process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
	process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
	process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
	process.env.OPENSHIFT_APP_NAME;
mongoose.connect('mongodb://' + connection_string)
	.then(function () {
		console.log('Connected to MONGOD !!');
	}).catch(function (err) {
		console.log('Failed to establish connection with MONGOD !!');
		console.log(err.message);
	});


app.use(morgan('dev'));
app.use(cors());
app.use('/api/users', users);

global.qq = [77326, 75326, 76326, 78326];
global.ja = 0;
cron.scheduleJob('*/1 * * * *', function () {
	Data.findOne({})
		.then(function (data) {
			console.log('qq');
			var q = 0;
			var x = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
			for (i = 0; i < 3; i++)
				for (j = 0; j < 3; j++) {
					x[i][j] = data.x[q] / data.total;
					q++;
				}
			var y = [0, 0, 0],
				re = [0, 0, 0];
			for (i = 0; i < 3; i++)
				y[i] = x[data.inf][i];
			re[0] = y[0] * (x[0][0] + x[1][0] + x[2][0]);
			re[1] = y[1] * (x[0][1] + x[1][1] + x[2][1]);
			re[2] = y[2] * (x[0][2] + x[1][2] + x[2][2]);
			request({
				url: 'http://api.coindesk.com/v1/bpi/currentprice/USD.json',
				method: "GET",
				json: true
			}, function (error, response, body) {
				var c = body.bpi.USD.rate_float;
				request({
					url: 'http://api.fixer.io/latest?base=USD',
					method: "GET",
					json: true
				}, function (error, response, body) {
					c = c * body.rates.INR;
					if (global.ja < 4)
						c = global.qq[global.ja];
					console.log(c);
					if (c - global.p > 0) {
						User.find({})
							.then(function (users) {
								if (users) {
									for (i = 0; i < users.length; i++) {
										var s = 0;
										for (j = 0; j < users[i].logs.length; j++) {
											s += (users[i].logs[j].btc * users[i].logs[j].inr);
											if (j == users[i].logs.length - 1) {
												if ((c * users[i].bih - (c * users[i].bih / 100)) > s) {
													if ((re[2] + re[2] * 0.10) < re[0]) {
														console.log(1);
														users[i].amount = users[i].bih * c;
														users[i].bih = 0;
														users[i].flag = true;
														users[i].save();
													}
												}
											}
										}
									}
								}
							});
					} else if (c - global.p < 0) {
						User.find({})
							.then(function (users) {
								if (users) {
									for (i = 0; i < users.length; i++) {
										if (users[i].flag == true) {
											var s = 0;
											for (j = 0; j < users[i].logs.length; j++) {
												s += (users[i].logs[j].btc * users[i].logs[j].inr);
												if (j == users[i].logs.length - 1) {
													if ((c * users[i].investment - (users[i].amount / (c * 100))) < s) {
														console.log(2);
														users[i].bih = users[i].amount / c;
														users[i].amount = 0;
													}
												}
											}
										}
									}
								}
							});
					}
				});
			});
		});
});
global.p = 0;
cron.scheduleJob('*/1 * * * *', function () {
	//	var data = new Data();
	//	data.p = 76320.721;
	//	data.inf = 0;
	//
	//	data.total = 1153,
	//		data.x = [
	//        304,
	//        22,
	//        239,
	//        21,
	//        1,
	//        16,
	//        240,
	//        14,
	//        291
	//    ];
	//	data.save();
	Data.findOne({})
		.then(function (data) {
			request({
				url: 'http://api.coindesk.com/v1/bpi/currentprice/USD.json',
				method: "GET",
				json: true
			}, function (error, response, body) {
				var inr = body.bpi.USD.rate_float;
				request({
					url: 'http://api.fixer.io/latest?base=USD',
					method: "GET",
					json: true
				}, function (error, response, body) {
					inr = inr * body.rates.INR;
					global.p = inr;
					var q = 0;
					var x = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
					for (i = 0; i < 3; i++)
						for (j = 0; j < 3; j++) {
							x[i][j] = data.x[q];
							q++;
						}
					data.total++;
					var f = 0;
					if (data.p == inr)
						f = 1;
					else if (data.p < inr)
						f = 0;
					else
						f = 2;
					x[data.inf][f]++;
					data.inf = f;
					data.p = inr;
					q = 0;
					for (i = 0; i < 3; i++)
						for (j = 0; j < 3; j++) {
							data.x[q] = x[i][j];
							q++;
							if (q == 8)
								data.save();
						}
				});
			});
		});
});


app.get('/', function (req, res) {
	res.json('hi');
});


global.unocoinAuthentication = function (cb) {
	request({
		url: 'https://sandbox.unocoin.co/oauth/token',
		method: "POST",
		json: true,
		headers: {
			'Authorization': auth,
			'content-type': 'application/json',
		},
		body: {
			grant_type: 'client_credentials',
			access_lifetime: '864000'
		}
	}, function (error, response, body) {
		global.MAIN_ACCESS = body;
		cb(MAIN_ACCESS);
	});
};
unocoinAuthentication(function (body) {
	console.log(MAIN_ACCESS);
});

app.listen(port, ip);
console.log('Server running on IP: ' + ip + ' PORT: ' + port);
