angular.module('alerG.controllers', [])
  .controller('HomeCtrl', ['$rootScope', '$scope', '$state', '$window', '$ionicModal', '$firebase', '$ionicPlatform', '$cordovaBarcodeScanner', 'Scan', '$cordovaSocialSharing', '$ionicModal', function($rootScope, $scope, $state, $window, $ionicModal, $firebase, $ionicPlatform, $cordovaBarcodeScanner, Scan, $cordovaSocialSharing, $ionicModal) {

    //Popup modal for FAQ
    $ionicModal.fromTemplateUrl('templates/faq.html', function($ionicModal) {
       $scope.faq = $ionicModal;
     }, {
       // Use our scope for the scope of the modal to keep it simple
       scope: $scope,
       // The animation we want to use for the modal entrance
       animation: 'slide-in-up'

     });

    //Popup modal for FAQ
    $ionicModal.fromTemplateUrl('templates/modal.html', function($ionicModal) {
       $scope.modal = $ionicModal;
     }, {
       // Use our scope for the scope of the modal to keep it simple
       scope: $scope,
       // The animation we want to use for the modal entrance
       animation: 'slide-in-up'

     });

    $rootScope.ref = new Firebase("https://alerg.firebaseio.com/products");
    $rootScope.fb = $firebase($rootScope.ref);


    $scope.testingScan = function(){
      // Scan.scanning('030100102335')
      // Scan.scanning('041196891492')
      Scan.scanning('044000027964')
      .then(function(response){
        $rootScope.productBrand = response.data[0].brand;
        $rootScope.productName = response.data[0].product_name;

        if(response.data[0].image_urls){
          $rootScope.productImage = response.data[0].image_urls[0];
        }
        $rootScope.productUPC = '044000027964';
        //grab all of the products from the database
        $rootScope.ref.on("value", function(snapshot) {
          snapshot.forEach(function(data){
            //check to see if the UPC is in the database
            if('044000027964' === data.val().upc){
              // console.log('does 024100788843 === ' + data.val().upc)
              console.log('the upc codes do match')
              //check to see if the item has been reviewed and approved for Gluten Free Status
              if(data.val().checked){
                // go to the state to display the Gluten Free Status
                console.log('the value of CHECKED IS ', data.val().checked);
                $rootScope.productGF = data.val().gFree
                $state.go('match');
                return true;
              } else{
                //let the user know this item is bring reviewed
                console.log('this item is being reviewed');
                console.log('the value of CHECKED IS ', data.val().checked);
                $state.go('review');
                return true;
              };
            } else{
              console.log('the item is not in the database')
              console.log('does 044000027964 === ' + data.val().upc)
              $state.go('check');
            }


          })
        }, function(errorObject){
          console.log(errorObject.code);
        })
      })

    }

    $scope.barcodeScan = function(){
      console.log('MADE IT TO THE BARCODE SCANNER FUNCTION IN CONTROLLER.JS')
      $ionicPlatform.ready(function() {
        $cordovaBarcodeScanner
        .scan()
        .then(function(barcodeData) {
          // Success! Barcode data is here
          $rootScope.productUPC = barcodeData.text;
          //Call the Scan function from the services.js factory
          Scan.scanning($rootScope.productUPC)
          .then(function(response){
            $rootScope.productBrand = response.data[0].brand;
            $rootScope.productName = response.data[0].product_name;
            $rootScope.productImage = response.data[0].image_urls[0];
            //grab all of the products from the database
            $rootScope.ref.on("value", function(snapshot){
              snapshot.forEach(function(data){
                if($rootScope.productUPC === data.val().upc){
                  // console.log('does 024100788843 === ' + data.val().upc)
                  // console.log('the upc codes do match')
                  //check to see if the item has been reviewed and approved for Gluten Free Status
                  if(data.val().checked){
                    //go to the state to display the Gluten Free Status
                    // console.log('the value of CHECKED IS ', data.val().checked);
                    $rootScope.productGF = data.val().gFree
                    $state.go('match');
                    return true;
                  } else{
                    //let the user know this item is bring reviewed
                    // console.log('this item is being reviewed');
                    // console.log('the value of CHECKED IS ', data.val().checked);
                    $state.go('review');
                    return true;
                  };
                } else{
                  console.log('the item is not in the database')
                  // console.log('does 024100788843 === ' + data.val().upc)
                  $state.go('check');
                }
              })
            }, function(errorObject){
              console.log(errorObject)
            })
          })
        }, function(error) {
          // An error occurred
        })
      });
    }

    $scope.isGlutenFree = function() {

    }

    $scope.sendTweet = function(){
      console.log('MADE IT TO THE SENT TWEET FUNCTION');
      $ionicPlatform.ready(function() {
        $cordovaSocialSharing.shareViaTwitter('Checkout ' + $rootScope.productName + ' from ' + $rootScope.productBrand + '. It is Gluten Free! #Aler-G', $rootScope.productImage);
      });
    }

    $scope.sendFacebook = function(){
      $ionicPlatform.ready(function() {
        $cordovaSocialSharing
        .shareViaFacebook('Checkout ' + $rootScope.productName + ' from ' + $rootScope.productBrand + '. It is Gluten Free! #Aler-G', $rootScope.productImage)
        .then(function(result) {
          // Success!
        }, function(err) {
          // An error occurred. Show a message to the user
        });
      });
    }

    $scope.goToFavorites = function() {
      $state.go('results')
    }
  }])

  .controller('SignUpCtrl', ['$scope', '$rootScope', '$firebaseAuth', '$window', '$ionicModal', function ($scope, $rootScope, $firebaseAuth, $window, $ionicModal) {

    //Popup modal for terms and conditions
    $ionicModal.fromTemplateUrl('templates/modal.html', function($ionicModal) {
       $scope.modal = $ionicModal;
     }, {
       // Use our scope for the scope of the modal to keep it simple
       scope: $scope,
       // The animation we want to use for the modal entrance
       animation: 'slide-in-up'

     });

      $scope.user = {
        email: "",
        password: ""
      };
      $scope.createUser = function () {
        console.log('CreateUser was called')

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
            $window.location.href = ('#/home');
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
  .controller('SignInCtrl', ['$scope', '$rootScope', '$firebaseAuth', '$window', '$ionicModal', function ($scope, $rootScope, $firebaseAuth, $window, $ionicModal) {

    //Popup modal for terms and conditions
    $ionicModal.fromTemplateUrl('templates/modal.html', function($ionicModal) {
       $scope.modal = $ionicModal;
     }, {
       // Use our scope for the scope of the modal to keep it simple
       scope: $scope,
       // The animation we want to use for the modal entrance
       animation: 'slide-in-up'

     });

    // check session
    //  console.log('in the SignIn Controller')
    //  $rootScope.checkoutSession();
     $scope.user = {
        email: "",
        password: ""
     };

     $scope.validateUser = function () {
       console.log('validateUser was called')
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
          $window.location.href = ('#/home');
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

.controller('ResultsCtrl', function($rootScope, $scope, $state, $window, $firebase) {

  $scope.returnHome = function(){
    $state.go('home');
  }

})

.controller('CheckCtrl', function($rootScope, $scope, $state, $window, $firebase, $ionicPlatform, $ionicPopup, $timeout, $ionicModal) {

  $ionicModal.fromTemplateUrl('templates/how.html', function($ionicModal) {
     $scope.how = $ionicModal;
   }, {
     // Use our scope for the scope of the modal to keep it simple
     scope: $scope,
     // The animation we want to use for the modal entrance
     animation: 'slide-in-up'

   });

  $scope.confirmProduct = function(value){
    $rootScope.productGF = value;
    $rootScope.fb.$add({
      upc: $rootScope.productUPC,
      brand: $rootScope.productBrand,
      name: $rootScope.productName,
      image: $rootScope.productImage,
      gFree: $rootScope.productGF,
      checked: false
    });
    $state.go('confirm')
  }

  $scope.returnHome = function(){
    $state.go('home')
  }


})

.controller('ConfirmCtrl', function($rootScope, $scope, $state, $window, $firebase, $ionicModal) {

  $scope.returnHome = function(){
    $state.go('home')
  }
})

.controller('MatchCtrl', function($rootScope, $scope, $state, $window, $firebase, $ionicPlatform, $cordovaSocialSharing) {

  var URL = 'https://alerg.firebaseio.com/'
  var userEmail = localStorage.userEmail;
  userEmail = userEmail.replace(".", ",");

  $rootScope.products = $firebase(new Firebase(URL + userEmail));

  $scope.saveProduct = function(){
    console.log('MADE IT TO THE SAVEPRODUCT FUNCTION');
    console.log('the upc code is', $rootScope.productUPC);
    $rootScope.products.$add({
      upc: $rootScope.productUPC,
      brand: $rootScope.productBrand,
      name: $rootScope.productName,
      image: $rootScope.productImage,
      gFree: $rootScope.productGF
    });
    $state.go('results');
  }

  $scope.returnHome = function(){
    $state.go('home');
  }

  $scope.sendTweet = function(){
    console.log('MADE IT TO THE SENT TWEET FUNCTION');
    $ionicPlatform.ready(function() {
      $cordovaSocialSharing.shareViaTwitter('Checkout ' + $rootScope.productName + ' from ' + $rootScope.productBrand + '. It is Gluten Free! #Aler-G', $rootScope.productImage);
    });
  }

  $scope.sendFacebook = function(){
    $ionicPlatform.ready(function() {
      $cordovaSocialSharing
      .shareViaFacebook('Checkout ' + $rootScope.productName + ' from ' + $rootScope.productBrand + '. It is Gluten Free! #Aler-G', $rootScope.productImage)
      .then(function(result) {
        // Success!
      }, function(err) {
        // An error occurred. Show a message to the user
      });
    });
  }


})

.controller('ReviewCtrl', function($rootScope, $scope, $state, $window, $firebase) {
 $scope.returnHome = function(){
   $state.go('home')
 }
});
