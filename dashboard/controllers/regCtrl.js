// Registration Page Controller
angular.module('proApp')
	.controller('regCtrl', function ($scope, $http, $location, $timeout, $rootScope) {
		$rootScope.checkAuth();
		$scope.createUser = function () {
			if ($scope.user.pass1 === $scope.user.pass2) {
				$('#button_load').button('loading');
				$scope.data = {};
				$scope.data.email = $scope.user.email;
				$scope.data.password = $scope.user.pass1;
				$http({
					method: 'POST',
					url: 'http://localhost:8080/api/users/register',
					data: $scope.data
				}).then(function (res) {
					if (res.data.status == true) {
						swal({
							title: 'Success',
							text: res.data.msg,
							type: 'success',
							showConfirmButton: true
						});
						$location.path('/login').replace();
					} else {
						swal({
							title: 'Failed',
							text: res.data.msg,
							type: 'error',
							showConfirmButton: true
						});
						$('#button_load').button('reset');
					}
				}, function (res) {
					swal("Fail", "Some error occurred, try again.", "error");
					$('#button_load').button('reset');
				});
			} else {
				swal("Fail", "Password's are not same, try again.", "error");
				$('#button_load').button('reset');
			}
		};
	});
