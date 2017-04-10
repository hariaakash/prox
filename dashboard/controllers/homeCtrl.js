// Home Page Controller
angular.module('proApp')
	.controller('homeCtrl', function ($scope, $http, $rootScope) {
		$rootScope.checkAuth();
		$rootScope.signOut = function () {
			Cookies.remove('authKey');
			swal({
				title: 'Success',
				text: 'You have successfully Signed Out !!',
				type: 'success',
				timer: 2000,
				showConfirmButton: true
			}).then(function () {}, function (dismiss) {
				if (dismiss == 'timer')
					location.reload();
			});
		};
		$scope.openInvestModal = function () {
			$('#investModal').modal('show');
		};
		$scope.investAmount = function () {
			$('#button_load').button('loading');
			$('#investModal').modal('hide');
			$http({
				method: 'POST',
				url: 'http://localhost:8080/api/users/addInvest',
				data: {
					authKey: $rootScope.authKey,
					amount: $scope.amount,
					inr: $rootScope.inr
				}
			}).then(function (res) {
				if (res.data.status == true) {
					$('#investModal').modal('hide');
					swal({
						title: 'LOADING',
						text: 'Invested Successfully!!',
						type: 'success',
						timer: 2000,
						showConfirmButton: false
					}).then(function () {}, function (dismiss) {
						if (dismiss == 'timer')
							location.reload();
					});
				} else {
					$('#investModal').modal('show');
					$('#createBoxModal').modal('hide');
					swal({
						title: 'Failed',
						text: res.data.msg,
						type: 'error',
						showConfirmButton: true
					});
					$('#button_load').button('reset');
				}
			}, function (res) {
				$('#investModal').modal('show');
				swal("Fail", "Some error occurred, try again.", "error");
				$('#button_load').button('reset');
			});
		};
		$scope.openWithdrawModal = function () {
			$('#withdrawModal').modal('show');
		};
		$scope.withdrawAmount = function () {
			$('#button_load').button('loading');
			$('#withdrawModal').modal('hide');
			$http({
				method: 'POST',
				url: 'http://localhost:8080/api/users/addWithdraw',
				data: {
					authKey: $rootScope.authKey,
					amount: $scope.amount,
					inr: $rootScope.inr
				}
			}).then(function (res) {
				if (res.data.status == true) {
					$('#withdrawModal').modal('hide');
					swal({
						title: 'LOADING',
						text: 'Withdraw Successfully!!',
						type: 'success',
						timer: 2000,
						showConfirmButton: false
					}).then(function () {}, function (dismiss) {
						if (dismiss == 'timer')
							location.reload();
					});
				} else {
					$('#withdrawModal').modal('hide');
					swal({
						title: 'Failed',
						text: res.data.msg,
						type: 'error',
						showConfirmButton: true
					});
					$('#button_load').button('reset');
				}
			}, function (res) {
				$('#withdrawModal').modal('show');
				swal("Fail", "Some error occurred, try again.", "error");
				$('#button_load').button('reset');
			});
		};
	});
