angular.module('alerG.controllers', [])
  .controller('SignUpCtrl', ['$scope', '$rootScope', '$firebaseAuth', '$window', function ($scope, $rootScope, $firebaseAuth, $window) {
      $scope.user = {
        email: "",
        password: ""
      };
      $scope.createUser = function () {
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

.controller('DashScanCtrl', ['$rootScope', '$scope', '$window', '$ionicModal', '$firebase', '$ionicPlatform', '$cordovaBarcodeScanner', 'Scan', function($rootScope, $scope, $window, $ionicModal, $firebase, $ionicPlatform, $cordovaBarcodeScanner, Scan) {
  $scope.testingScan = function(){
    console.log('MADE IT TO THE !!TESTING!! BARCODE SCANNER FUNCTION IN CONTROLLER.JS')
    Scan.scanning('024100788842')
    .then(function(response){
      console.log('RESPONSE FROM THE SERVER', response);
      $scope.productUPC = '024100788842';
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
        $rootScope.data = barcodeData.text;
        //Call the Scan function from the services.js factory
        Scan.scanning($rootScope.data)
        .then(function(response){
          $scope.productBrand = response.data[0].brand;
          $scope.productName = response.data[0].product_name;
          $scope.productImage = response.data[0].image_urls[0];
        })

      }, function(error) {
        // An error occurred
      })
    });
  }

  var URL = 'https://alerg.firebaseio.com';
  $scope.products = $firebase(new Firebase(URL + '/products'));

  $scope.saveProduct = function(){
    console.log('MADE IT TO THE SAVEPRODUCT FUNCTION');
    $scope.products.$add({
      email: $rootScope.auth.user.email,
      upc: $scope.productUPC,
      brand: $scope.productBrand,
      name: $scope.productName,
      image: $scope.productImage
    });
  }

}])

.controller('DashResutsCtrl', function($rootScope, $scope, $window, $firebase) {
  var url = 'https://alerg.firebaseio.com/products'
 $scope.products = $firebase(new Firebase(url));



});
