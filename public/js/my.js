'use strict'

const app = angular.module('app', ['ngRoute']);
const socket = io.connect();


app.config(["$locationProvider", function
($locationProvider){
	$locationProvider.hashPrefix('');
	$locationProvider.html5Mode(true);
}]);

app.config(function ($routeProvider){
	$routeProvider
	.otherwise({
		redirectTo: "/"
	});
});

// Chat controller
app.controller('MyCtrl', function($scope) {
	$scope.name = "Anonim";
	this.setName = function () {
		$scope.name = this.newName;
		this.newName = "";
	}

	this.messages = [];
	this.sendMessage = function () {
		var message = {
			"text": this.newMessage,
			"author": $scope.name,
			"time": new Date(),
		}
        
        
socket.emit("sendMessage", message)
		this.newMessage = "";
   
	}
var chatMessages = this.messages;
    socket.on("message", function(data){
        chatMessages.push(data);
        $scope.$digest();
    })
    
    
    
//     $scope.gotoBottom = function() {
//      $("#Bottom").scrollIntoView();
//    };
//    
    
});

// Login controller
app.controller("LoginCtrl", function($scope){
		$scope.SignIn = function(){
		let obj = {
			login: $scope.login,
			password: $scope.password
		};
		
		socket.emit("sendSignIn", obj);
	}
	
	socket.on("userStatus", function(data){
		$scope.result = data;
		console.log(data);
		$scope.$digest();
	})
	});
	
