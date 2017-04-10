// Login Page Controller
angular.module('proApp')
	.controller('loginCtrl', function ($scope, $http, $location, $rootScope) {
		$rootScope.checkAuth();
		$scope.user = {};
		$scope.loginUser = function () {
			$('#button_load').button('loading');
			$http({
				method: 'POST',
				url: 'http://localhost:8080/api/users/login',
				data: $scope.user
			}).then(function (res) {
				if (res.data.status == true) {
					var authKey = res.data.authKey;
					Cookies.set('authKey', authKey);
					$location.path('/home').replace();
					swal({
						title: 'Success',
						text: 'You have successfully Signed In !!',
						type: 'success',
						showConfirmButton: true
					});
				} else {
					swal({
						title: 'Failed',
						text: res.data.msg,
						type: 'error',
						timer: 2000,
						showConfirmButton: true
					});
					$('#button_load').button('reset');
				}
			}, function (res) {
				swal("Fail", "Some error occurred, try again.", "error");
				$('#button_load').button('reset');
			});
		};
	});
