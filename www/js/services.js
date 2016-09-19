angular.module('starter.services', [])
    .service('SexyService', function ($http) {
        // //  常用用法
        //  $http({
        //      method: 'GET',
        //      url: urls.hello
        //     }).then(function successCallback(response) {
        //         callback(response);
        //     }, function errorCallback(response) {
        //         alert(response);
        //     });

        // // 快速用法
        // $http.get(urls.hello).then(function(response){
        //         callback(response);
        // }, function(err) {
        //         alert(response); 
        // });

        this.getMenus = function (callback) {
            $http.get("http://www.tngou.net/tnfs/api/classify").then(function (response) {
                callback(response)
            });
        }

        this.getList = function (url, callback) {
            $http.get(url).then(function (response) {
                callback(response)
            });
        }

        this.getDetails = function (url, callback) {
            $http.post(url).then(function (response) {
                callback(response);
            });
        }
    })