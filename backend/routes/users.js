var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var hat = require('hat');
var bcrypt = require('bcryptjs');
var User = require('../models/users');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.get('/', function (req, res) {
	if (req.query.authKey) {
		User.findOne({
				authKey: req.query.authKey
			})
			.then(function (user) {
				if (user) {
					if (user.flag == true)
						res.json({
							status: true,
							data: {
								email: user.email,
								wallet: user.wallet,
								bih: user.investment,
								profit: 0,
								logs: user.logs
							}
						});
					else
						res.json({
							status: true,
							data: {
								email: user.email,
								wallet: user.wallet,
								bih: user.bih,
								profit: user.bih - user.investment,
								logs: user.logs
							}
						});
				} else {
					res.json({
						status: false,
						msg: 'User associated with the email not found !!'
					});
				}
			})
			.catch(function (err) {
				console.log(err);
				res.json({
					status: false,
					msg: 'Server not responding!!'
				});
			});
	} else {
		res.json({
			status: false,
			msg: 'Empty Fields'
		});
	}
});

app.post('/register', function (req, res) {
	if (req.body.email && req.body.password) {
		User.findOne({
				email: req.body.email
			})
			.then(function (user) {
				if (!user) {
					bcrypt.hash(req.body.password, 10, function (err, hash) {
						var user = new User();
						user.email = req.body.email;
						user.password = hash;
						user.save()
							.then(function (user) {
								res.json({
									status: true,
									msg: 'Successfully Registered !!'
								});
							});
					});
				} else {
					res.json({
						status: false,
						msg: 'Email is already registered !!'
					});
				}
			})
			.catch(function (err) {
				console.log(err);
				res.json({
					status: false,
					msg: 'Server not responding!!'
				});
			});
	} else {
		res.json({
			status: false,
			msg: 'Empty Fields'
		});
	}
});

app.post('/login', function (req, res) {
	if (req.body.email && req.body.password) {
		User.findOne({
				email: req.body.email
			})
			.then(function (user) {
				if (user) {
					bcrypt.compare(req.body.password, user.password, function (err, response) {
						if (response == true) {
							user.authKey = hat();
							user.save();
							res.json({
								status: true,
								authKey: user.authKey,
								msg: 'Successfully signed in !!'
							});
						} else {
							res.json({
								status: false,
								msg: 'Password Wrong'
							});
						}
					});
				} else {
					res.json({
						status: false,
						msg: 'User associated with the email not found !!'
					});
				}
			})
			.catch(function (err) {
				console.log(err);
				res.json({
					status: false,
					msg: 'Server not responding!!'
				});
			});
	} else {
		res.json({
			status: false,
			msg: 'Empty Fields'
		});
	}
});

app.post('/addInvest', function (req, res) {
	if (req.body.authKey && req.body.amount && req.body.inr) {
		User.findOne({
				authKey: req.body.authKey
			})
			.then(function (user) {
				if (user) {
					user.wallet -= req.body.amount;
					user.investment += req.body.amount;
					user.bih += req.body.amount;
					user.logs.push({
						inv_with: 0,
						btc: req.body.amount,
						inr: req.body.inr
					});
					user.save();
					res.json({
						status: true,
						msg: 'Successfully Invested'
					});
				} else {
					res.json({
						status: false,
						msg: 'User associated with the email not found !!'
					});
				}
			})
			.catch(function (err) {
				console.log(err);
				res.json({
					status: false,
					msg: 'Server not responding!!'
				});
			});
	} else {
		res.json({
			status: false,
			msg: 'Empty Fields'
		});
	}
});

app.post('/addWithdraw', function (req, res) {
	if (req.body.authKey && req.body.amount && req.body.inr) {
		User.findOne({
				authKey: req.body.authKey
			})
			.then(function (user) {
				if (user) {
					user.btc -= req.body.amount;
					user.logs.push({
						inv_with: 1,
						btc: req.body.amount,
						inr: req.body.inr
					});
					user.save();
					res.json({
						status: true,
						msg: 'Successfully Withdrawn'
					});
				} else {
					res.json({
						status: false,
						msg: 'User associated with the email not found !!'
					});
				}
			})
			.catch(function (err) {
				console.log(err);
				res.json({
					status: false,
					msg: 'Server not responding!!'
				});
			});
	} else {
		res.json({
			status: false,
			msg: 'Empty Fields'
		});
	}
});


module.exports = app;
