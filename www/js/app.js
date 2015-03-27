// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('alerG', ['ionic', 'ngCordova', 'firebase', 'alerG.controllers', 'alerG.services'])

.run(function($ionicPlatform, $rootScope, $firebaseAuth, $firebase,  $window, $ionicLoading) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

    $rootScope.userEmail = null;
    $rootScope.baseUrl = 'https://alerg.firebaseio.com/';
    var authRef = new Firebase($rootScope.baseUrl);
    $rootScope.auth = $firebaseAuth(authRef);

    $rootScope.show = function(text) {
      $rootScope.loading = $ionicLoading.show({
        content: text ? text : 'Loading..',
        animation: 'fade-in',
        showBackdrop: true,
        maxWidth: 200,
        showDelay: 0
      });
    };

    $rootScope.hide = function(){
      $ionicLoading.hide();
    }

    $rootScope.notify = function(text){
      $rootScope.show(text);
      $window.setTimeout(function() {
        $rootScope.hide();
      }, 1999);
    };

    $rootScope.logout = function(){
      $rootScope.auth.$logout();
      $rootScope.checkoutSession();
    };

    $rootScope.checkoutSession = function() {
     var auth = new FirebaseSimpleLogin(authRef, function(error, user) {
       if (error) {
         // no action yet.. redirect to default route
         $rootScope.userEmail = null;
         localStorage.setItem('userEmail', null);
         $window.location.href = '#/auth/signin';
       } else if (user) {
         // user authenticated with Firebase
         $rootScope.userEmail = user.email;
         $window.location.href = ('#/dashboard/scan');
       } else {
         // user is logged out
         $rootScope.userEmail = null;
         $window.location.href = '#/auth/signin';
         localStorage.setItem('userEmail', null);
       }
     });
   }

   var URL = 'https://alerg.firebaseio.com/'
   var userEmail = localStorage.userEmail;
   userEmail = userEmail.replace(".", ",");

   $rootScope.products = $firebase(new Firebase(URL + userEmail));

  });
})


.config(function($stateProvider, $urlRouterProvider){
  $stateProvider
    .state('auth', {url: "/auth", abstract: true, templateUrl: "templates/auth.html"})
    .state('auth.signin', {url: '/signin', views: {'auth-signin': {templateUrl: 'templates/auth-signin.html', controller: 'SignInCtrl'}}})
    .state('auth.signup', {url: '/signup',views: {'auth-signup': {templateUrl: 'templates/auth-signup.html', controller: 'SignUpCtrl'}}})
    .state('dashboard', {url: "/dashboard", abstract: true, templateUrl: "templates/dashboard.html"})
    .state('dashboard.scan', {url: '/scan', views: {'dashboard-scan': {templateUrl: 'templates/dashboard-scan.html', controller: 'DashScanCtrl'}}})
    .state('dashboard.check', {url: '/check', views: {'dashboard-scan': {templateUrl: 'templates/dashboard-check.html', controller: 'DashCheckCtrl'}}})
    .state('dashboard.match', {url: '/match', views: {'dashboard-scan': {templateUrl: 'templates/dashboard-match.html', controller: 'DashMatchCtrl'}}})
    .state('dashboard.review', {url: '/review', views: {'dashboard-scan': {templateUrl: 'templates/dashboard-review.html', controller: 'DashReviewCtrl'}}})
    .state('dashboard.confirm', {url: '/confirm', views: {'dashboard-scan': {templateUrl: 'templates/dashboard-confirm.html', controller: 'DashConfirmCtrl'}}})

    .state('dashboard.results', {url: '/results', views: {'dashboard-results': {templateUrl: 'templates/dashboard-results.html', controller: 'DashResutsCtrl'}}})

    $urlRouterProvider.otherwise('/auth/signin');
});
