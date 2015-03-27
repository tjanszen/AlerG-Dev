angular.module('alerG.services', [])

.factory('Scan', ['$http', function($http) {

  function scanning(upc){
    console.log('SERVICES.JS FACTORY CALLED FROM CONTROLELR.JS')
    console.log('UPC PASSED INTO SCANNING FUNCTION', upc);
    return $http.get('http://192.168.1.17:8080/scans/' + upc);
  }

  return {scanning:scanning};

}]);
