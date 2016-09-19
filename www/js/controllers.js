angular.module('starter.controllers', [])

  .controller('AppCtrl', function ($scope, $timeout, $ionicModal, $rootScope, SexyService) {
    // $rootScope.size = "_120x120"
    $rootScope.size = ""
    var menus = window.localStorage['menus'];
    if (menus == undefined) {
      SexyService.getMenus(function (response) {
        console.log(response);
        menus = response.data.tngou;
        $scope.menus = menus;
        window.localStorage['menus'] = angular.toJson(menus);
      })
    } else {
      $scope.menus = angular.fromJson(menus);
    }

    $ionicModal.fromTemplateUrl('templates/TongeBlog.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function (modal) {
      $scope.modal = modal;
    });

    $scope.openModal = function () {
      $scope.modal.show();
    };
    $scope.closeModal = function () {
      $scope.modal.hide();
    };

    $timeout(function () {
      $scope.modal.show();
    }, 3000)

  })
  .controller('TbCtrl', function ($scope) {

  })
  .controller('GalleriesCtrl', function ($scope, $http, $ionicLoading, $stateParams, SexyService) {
    // // Setup the loader
    $ionicLoading.show({
      content: 'Loading',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 0
    });

    var id = $stateParams.id;
    if (id == undefined) {
      url = "http://www.tngou.net/tnfs/api/news";
      $scope.title = "最新"
    } else {
      url = "http://www.tngou.net/tnfs/api/list?id=" + id
      $scope.title = $stateParams.name
    }

    if (window.localStorage[url] == undefined) {
      SexyService.getList(url, function (response) {
        console.log("url:" + response.config.url + ",status:" + response.status);
        $scope.galleries = response.data.tngou;
        window.localStorage[url] = angular.toJson($scope.galleries);
        $ionicLoading.hide();
      })
    } else {
      $scope.galleries = angular.fromJson(window.localStorage[url]);
      $ionicLoading.hide();
    }
  })

  .controller('GalleryCtrl', function ($scope, $ionicPopup, $stateParams, $ionicActionSheet, $ionicSlideBoxDelegate, $cordovaFile, $cordovaFileTransfer, SexyService) {

    var url = "http://www.tngou.net/tnfs/api/show?id=" + $stateParams.id
    $scope.title = $stateParams.title;
    $scope.images = []
    $scope.slideIndex = 0
    $scope.width = window.screen.width;
    $scope.height = window.screen.height;

    SexyService.getDetails(url, function (response) {
      $scope.images = response.data.list;
      $scope.total = response.data.size;
      // angular.forEach(list, function(image){
      //   images.push("http://tnfs.tngou.net/image"+image.src);
      // }); 
      $ionicSlideBoxDelegate.update();
    })

    $scope.slideChanged = function (index) {
      $scope.slideIndex = index;
    };
    $scope.next = function () {
      $ionicSlideBoxDelegate.next();
    }
    $scope.previous = function () {
      $ionicSlideBoxDelegate.previous();
    }




    $scope.openLinkInBrowser = function (url) {
      // Show the action sheet
      var hideSheet = $ionicActionSheet.show({
        buttons: [
          { text: '<center>保存</center>' }
        ],
        // destructiveText: 'Delete',
        titleText: '<center>保存图片？</center>',
        cancelText: '<center>Cancel</center>',
        cancel: function () {
          // add cancel code..
        },
        buttonClicked: function (index) {
          var filename = url.split("/").pop();
          var targetPath = cordova.file.externalRootDirectory + "DCIM/" + filename;
          $cordovaFileTransfer.download(encodeURI(url), targetPath, {}, true)
            .then(function (result) {
              $ionicPopup.alert({
                title: '<b>图片保存成功</b>',
                subTitle: '<img src="img/hh.png">',
                buttons: [{
                  text: '嗯',
                  type: 'button-positive',
                  onTap: function (e) {

                  }
                }]
              })
            }, function (err) {
              alert(angular.toJson(err));
            }, function (progress) {
              $timeout(function () {
                $scope.downloadProgress = (progress.loaded / progress.total) * 100;
              });
            });
          return true;
        }
      });

    }

  }) 