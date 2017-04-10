angular.module('proApp', ['ngRoute', 'angular-clipboard', 'angular-country-timezone-picker', 'angularUtils.directives.dirPagination'])
	.config(function ($routeProvider) {
		$routeProvider
			.when('/', {
				redirectTo: '/home'
			})
			.when('/login', {
				templateUrl: 'pages/login.html',
				controller: 'loginCtrl'
			})
			.when('/register', {
				templateUrl: 'pages/register.html',
				controller: 'regCtrl'
			})
			.when('/home', {
				templateUrl: 'pages/home.html',
				controller: 'homeCtrl'
			})
			.when('/error', {
				templateUrl: 'pages/error.html'
			})
			.otherwise({
				redirectTo: '/error'
			});
	});


// Global Controller
angular.module('proApp')
	.controller('globalCtrl', function ($rootScope, $location, $http, $routeParams) {
		$rootScope.userData = {};
		$rootScope.userData.info = {};
		$rootScope.getUserData = function () {
			if ($rootScope.userData.status != true) {
				$http({
					method: 'GET',
					url: 'http://localhost:8080/api/users',
					params: {
						authKey: $rootScope.authKey
					}
				}).then(function (res) {
					$rootScope.userData = res.data.data;
				}).catch(function () {
					swal({
						title: 'Some error occurred',
						type: 'error'
					});
				});
				$http({
					method: 'GET',
					url: 'http://api.coindesk.com/v1/bpi/currentprice/USD.json'
				}).then(function (res) {
					$rootScope.inr = res.data.bpi.USD.rate_float;
					$http({
						method: 'GET',
						url: 'http://api.fixer.io/latest?base=USD'
					}).then(function (res) {
						$rootScope.inr = Math.round($rootScope.inr*res.data.rates.INR);
					}).catch(function () {
						swal({
							title: 'Some error occurred',
							type: 'error'
						});
					});
				}).catch(function () {
					swal({
						title: 'Some error occurred',
						type: 'error'
					});
				});
			}
		};
		$rootScope.checkAuth = function () {
			if (Cookies.get('authKey')) {
				$rootScope.authKey = Cookies.get('authKey');
				var path = $location.path();
				if (path != '/home' && path != '/profile' && path != '/logs')
					$location.path('/home').replace();
				$rootScope.signStatus = true;
				if (path != '/logs')
					$rootScope.getUserData();
			} else {
				$rootScope.authKey = '';
				$rootScope.signStatus = false;
				var path = $location.path();
				if (path == '/home' || path == '/profile' || path == '/logs')
					$location.path('/login').replace();
			}
		};
	});
