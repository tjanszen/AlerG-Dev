angular.module('alerG.controllers', [])
  .controller('SignUpCtrl', ['$scope', '$rootScope', '$firebaseAuth', '$window', function ($scope, $rootScope, $firebaseAuth, $window) {
      $scope.user = {
        email: "",
        password: ""
      };
      $scope.createUser = function () {
        console.log('made it to the creator!!!')

        var email = this.user.email;
        var password = this.user.password;

        if (!email || !password) {
          $rootScope.notify("Please enter valid credentials");
          return false;
        }

        $rootScope.show('Please wait.. Registering');
        $rootScope.auth.$createUser(email, password, function (error, user) {
          if (!error) {
            $rootScope.hide();
            $rootScope.userEmail = user.email;
            localStorage.setItem('userEmail', user.email);
            $window.location.href = ('#/dashboard/scan');
          }
          else {
            $rootScope.hide();
            if (error.code == 'INVALID_EMAIL') {
              $rootScope.notify('Invalid Email Address');
            }
            else if (error.code == 'EMAIL_TAKEN') {
              $rootScope.notify('Email Address already taken');
            }
            else {
              $rootScope.notify('Oops something went wrong. Please try again later');
            }
          }
        });
      }
    }
  ])
  .controller('SignInCtrl', ['$scope', '$rootScope', '$firebaseAuth', '$window', function ($scope, $rootScope, $firebaseAuth, $window) {
     // check session
     $rootScope.checkoutSession();
     $scope.user = {
        email: "",
        password: ""
     };
     $scope.validateUser = function () {
        $rootScope.show('Please wait.. Authenticating');
        var email = this.user.email;
        var password = this.user.password;
        if (!email || !password) {
           $rootScope.notify("Please enter valid credentials");
           return false;
        }
        $rootScope.auth.$login('password', {
           email: email,
           password: password
        })
        .then(function (user) {
          $rootScope.hide();
          $rootScope.userEmail = user.email;
          localStorage.setItem('userEmail', user.email);
          $window.location.href = ('#/dashboard/scan');
        }, function (error) {
          $rootScope.hide();
          if (error.code == 'INVALID_EMAIL') {
            $rootScope.notify('Invalid Email Address');
          }
          else if (error.code == 'INVALID_PASSWORD') {
            $rootScope.notify('Invalid Password');
          }
          else if (error.code == 'INVALID_USER') {
            $rootScope.notify('Invalid User');
          }
          else {
            $rootScope.notify('Oops something went wrong. Please try again later');
          }
        });
     }
  }
])

.controller('DashScanCtrl', ['$rootScope', '$scope', '$window', '$ionicModal', '$firebase', '$ionicPlatform', '$cordovaBarcodeScanner', 'Scan', '$cordovaSocialSharing', function($rootScope, $scope, $window, $ionicModal, $firebase, $ionicPlatform, $cordovaBarcodeScanner, Scan, $cordovaSocialSharing) {
  $scope.testingScan = function(){
    console.log('MADE IT TO THE !!TESTING!! BARCODE SCANNER FUNCTION IN CONTROLLER.JS')
    Scan.scanning('024100788842')
    .then(function(response){
      console.log('RESPONSE FROM THE SERVER', response);
      $scope.productUPC = '024100788842';
      if($scope.productUPC === "024100788843"){
        $scope.glutenFree = true;
      } else{
        $scope.glutenFree = false;
      }
      $scope.productBrand = response.data[0].brand;
      $scope.productName = response.data[0].product_name;
      $scope.productImage = response.data[0].image_urls[0];
      $scope.display = true
    })

  }

  $scope.barcodeScan = function(){
    console.log('MADE IT TO THE BARCODE SCANNER FUNCTION IN CONTROLLER.JS')
    $ionicPlatform.ready(function() {
      $cordovaBarcodeScanner
      .scan()
      .then(function(barcodeData) {
        // Success! Barcode data is here
        $scope.productUPC = barcodeData.text;
        if(barcodeData === "024100788842"){
          $scope.glutenFree = true;
        } else{
          $scope.glutenFree = false;
        }
        $rootScope.data = barcodeData.text;
        //Call the Scan function from the services.js factory
        Scan.scanning($rootScope.data)
        .then(function(response){
          $scope.productUPC = $scope.productUPC;
          $scope.productBrand = response.data[0].brand;
          $scope.productName = response.data[0].product_name;
          $scope.productImage = response.data[0].image_urls[0];
          $scope.display = true
        })

      }, function(error) {
        // An error occurred
      })
    });
  }

  var URL = 'https://alerg.firebaseio.com/'
  var userEmail = localStorage.userEmail;
  userEmail = userEmail.replace(".", ",");

  $rootScope.products = $firebase(new Firebase(URL + userEmail));

  $scope.saveProduct = function(){
    console.log('MADE IT TO THE SAVEPRODUCT FUNCTION');
    $rootScope.products.$add({
      upc: $scope.productUPC,
      brand: $scope.productBrand,
      name: $scope.productName,
      image: $scope.productImage,
      gFree: $scope.glutenFree
    });
  }

  $scope.sendTweet = function(){
    console.log('MADE IT TO THE SENT TWEET FUNCTION');
    $ionicPlatform.ready(function() {
      $cordovaSocialSharing.shareViaTwitter('THIS IS THE MESSAGE');
    });
  }

  $scope.sendFacebook = function(){
    $ionicPlatform.ready(function() {
      $cordovaSocialSharing
      .shareViaFacebook('this is a message')
      .then(function(result) {
        // Success!
      }, function(err) {
        // An error occurred. Show a message to the user
      });
    });
  }

}])

.controller('DashResutsCtrl', function($rootScope, $scope, $window, $firebase) {

});
