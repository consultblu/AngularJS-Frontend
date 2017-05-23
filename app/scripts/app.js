var apiUrl = 'http://192.168.77.233/json';

var app = angular.module('angularjs_frontend_cms', [
    'ngAnimate'
    ,'ngCookies'
    ,'ngRoute'
    ,'ngSanitize'
    ,'ngTouch'
    ,'btford.markdown'
    ,'ui.router'
    //,'youtube-embed'
    ,'ui.bootstrap'
    ,'ui.bootstrap.typeahead'
    ,'ui.select'
    ,'ui.slider'
    ,'picardy.fontawesome'
    ,'ngTagsInput'
    ,'duScroll'
    //'ngMap'    
    //'pippTimelineDirectives'
    //'Routing'
    //'ngResource',
    //'mm.foundation',
    //'ui-templates',
    //'app.filters',
    //'app.services',
    //'app.directives'
    //'wu.masonry'
    //'ui.utils'    
  ]);
  
(function() {
  app.factory('dataFactory', ['$http',function($http) {
    return {
      dataFactory: {
        getData: function(option) {
          console.log('apiUrl@getData = ' + apiUrl + option);
          return $http.get(apiUrl + option);
        }
      }
    };
  }]);
  
  app.factory('AuthenticationService',
    ['Base64', '$http', '$cookieStore', '$rootScope', '$timeout',
    function (Base64, $http, $cookieStore, $rootScope, $timeout) {
        var service = {};
  
        service.Login = function (username, password, callback) {
  
            /* Dummy authentication for testing, uses $timeout to simulate api call
             ----------------------------------------------*/
            $timeout(function(){
                var response = { success: username === 'test' && password === 'test' };
                if(!response.success) {
                    response.message = 'Username or password is incorrect';
                }
                callback(response);
            }, 1000);
  
  
            /* Use this for real authentication
             ----------------------------------------------*/
            //$http.post('/api/authenticate', { username: username, password: password })
            //    .success(function (response) {
            //        callback(response);
            //    });
  
        };
  
        service.SetCredentials = function (username, password) {
            var authdata = Base64.encode(username + ':' + password);
  
            $rootScope.globals = {
                currentUser: {
                    username: username,
                    authdata: authdata
                }
            };
  
            $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
            $cookieStore.put('globals', $rootScope.globals);
        };
  
        service.ClearCredentials = function () {
            $rootScope.globals = {};
            $cookieStore.remove('globals');
            $http.defaults.headers.common.Authorization = 'Basic ';
        };
  
        return service;
    }]);
  
  app.factory('Base64', function () {
      /* jshint ignore:start */
    
      var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    
      return {
          encode: function (input) {
              var output = "";
              var chr1, chr2, chr3 = "";
              var enc1, enc2, enc3, enc4 = "";
              var i = 0;
    
              do {
                  chr1 = input.charCodeAt(i++);
                  chr2 = input.charCodeAt(i++);
                  chr3 = input.charCodeAt(i++);
    
                  enc1 = chr1 >> 2;
                  enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                  enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                  enc4 = chr3 & 63;
    
                  if (isNaN(chr2)) {
                      enc3 = enc4 = 64;
                  } else if (isNaN(chr3)) {
                      enc4 = 64;
                  }
    
                  output = output +
                      keyStr.charAt(enc1) +
                      keyStr.charAt(enc2) +
                      keyStr.charAt(enc3) +
                      keyStr.charAt(enc4);
                  chr1 = chr2 = chr3 = "";
                  enc1 = enc2 = enc3 = enc4 = "";
              } while (i < input.length);
    
              return output;
          },
    
          decode: function (input) {
              var output = "";
              var chr1, chr2, chr3 = "";
              var enc1, enc2, enc3, enc4 = "";
              var i = 0;
    
              // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
              var base64test = /[^A-Za-z0-9\+\/\=]/g;
              if (base64test.exec(input)) {
                  window.alert("There were invalid base64 characters in the input text.\n" +
                      "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                      "Expect errors in decoding.");
              }
              input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    
              do {
                  enc1 = keyStr.indexOf(input.charAt(i++));
                  enc2 = keyStr.indexOf(input.charAt(i++));
                  enc3 = keyStr.indexOf(input.charAt(i++));
                  enc4 = keyStr.indexOf(input.charAt(i++));
    
                  chr1 = (enc1 << 2) | (enc2 >> 4);
                  chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                  chr3 = ((enc3 & 3) << 6) | enc4;
    
                  output = output + String.fromCharCode(chr1);
    
                  if (enc3 != 64) {
                      output = output + String.fromCharCode(chr2);
                  }
                  if (enc4 != 64) {
                      output = output + String.fromCharCode(chr3);
                  }
    
                  chr1 = chr2 = chr3 = "";
                  enc1 = enc2 = enc3 = enc4 = "";
    
              } while (i < input.length);
    
              return output;
          }
      };
    
      /* jshint ignore:end */
  });

  app.factory("UsersApi", function ($q, $http) {
    function _login (username, password) {
      var d = $q.defer();

      $http({
        url: 'views/login',
        method: "POST",
        data: { username: username, password: password },
        withCredentials: true,
        headers: {'Content-Type': 'application/json; charset=utf-8'}
      })
      .success(function (response) {
        //callback(response);
        //console.log('auth response',response);
      });
      
      return d.promise
    }
    return { login: _login };
  });

  app.service('loginModal', function ($modal, $rootScope) {
    function assignCurrentUser (user) {
      $rootScope.currentUser = user;
      return user;
    }
  
    return function() {
      var instance = $modal.open({
        templateUrl: 'views/login-form',
        controller: 'LoginModalCtrl',
        controllerAs: 'LoginModalCtrl'
      })
      return instance.result.then(assignCurrentUser);
    };
  });
}).call(this);

(function() {
  app.controller('LoginModalCtrl', function ($scope, UsersApi) {
  
    $scope.checking = " test";
    $scope.cancel = $scope.$dismiss;
  
    $scope.submit = function (username, password) {
      console.log('username', username);
      console.log('password', password);
      console.log('$scope.username', $scope.username);
      console.log('$scope.password', $scope.password);
      UsersApi.login(username, password).then(function (user) {
        $scope.$close(user);
      });
    };
  
  });
}).call(this);
 
(function() {
  app.run(function ($rootScope, $state, loginModal, $http) {
  
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
      var requireLogin = toState.data.requireLogin;
  
      if (requireLogin && typeof $rootScope.currentUser === 'undefined') {
        event.preventDefault();
        console.log('// get me a login modal!');
        /*loginModal()
          .then(function () {
            return $state.go(toState.name, toParams);
          })
          .catch(function () {
            return $state.go('welcome');
          });*/
      $http({
        url: 'views/login',
        method: "POST"
        })
      .success(function (response) {
        //callback(response);
        console.log('auth response',response);
      });
      }
    });
  
  });
}).call(this);
 
(function() {
  app.config(function ($httpProvider) {
  
    $httpProvider.interceptors.push(function ($timeout, $q, $injector) {
      var loginModal, $http, $state;
  
      // this trick must be done so that we don't receive
      // `Uncaught Error: [$injector:cdep] Circular dependency found`
      $timeout(function () {
        loginModal = $injector.get('loginModal');
        $http = $injector.get('$http');
        $state = $injector.get('$state');
      });
  
      return {
        responseError: function (rejection) {
          if (rejection.status !== 401) {
            return rejection;
          }
  
          var deferred = $q.defer();
  
          loginModal()
            .then(function () {
              console.log('app.config');
              deferred.resolve( $http(rejection.config) );
            })
            .catch(function () {
              $state.go('home');
              deferred.reject(rejection);
            });
  
          return deferred.promise;
        }
      };
    });
  
  });

}).call(this);
 
(function() {
  app.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
    $stateProvider.state("home", {
      url: "/",
      templateUrl: "app/landing_page/landing_page.html",
      controller: "LandingPagesCtrl",
      data:{requireLogin: false}
    }).state("login", {
      url: "/login",
      templateUrl: "app/landing_page/landing_page.html",
      controller: "LandingPagesCtrl",
      data:{requireLogin: false}
    }).state("demo", {
      url: "/demo",
      templateUrl: "app/demo/demo.html",
      controller: "DemoCtrl",
      data:{requireLogin: false}
    }).state("docs", {
      url: "/docs",
      templateUrl: "app/docs/docs.html",
      controller: "DocsCtrl"
    }).state("examples", {
      url: "/examples",
      templateUrl: "app/examples/examples.html",
      controller: "ExamplesCtrl",
      data:{requireLogin: false}
    }).state("design-library", {
      url: "/design-library",
      templateUrl: "app/views/design_library/index2.html",
      controller: "DesignLibraryCtrl",
      data:{requireLogin: false}
    }).state("design-library/:book", {
      url: "/design-library/:book",
      templateUrl: "app/views/design_library/index2.html",
      controller: "DesignLibraryCtrl",
      data:{requireLogin: false}
    }).state("design-library-page", {
      url: "/design-library/:book/:page",
      templateUrl: "app/views/design_library/index2.html",
      controller: "DesignLibraryCtrl",
      data:{requireLogin: false}
    }).state("fabric-collections", {
      url: "/fabric-collections",
      templateUrl: "app/views/grid.html",
      controller: "CollectionsCtrl",
      data:{requireLogin: false}
    }).state("lp", {
      url: "/lp/:page",
      templateUrl: "app/landing_page/landing_page.html",
      controller: "LandingPagesCtrl",
      data:{requireLogin: false}
    })/*.state("tencelplus", {
      url: "/lp/bedding/:page",
      templateUrl: "app/landing_page/landing_page.html",
      controller: "LandingPagesCtrl",
      data:{hideMenus: false}
    }).state("products", {
      url: "/lp/bedding/:page",
      templateUrl: "app/views/bedding/index.html",
      controller: "ProductsPagesCtrl",
      data:{hideMenus: false}
    }).state("media", {
      url: "/lp/:page",
      templateUrl: "app/landing_page/landing_page.html",
      controller: "LandingPagesCtrl",
      data:{requireLogin: false}
    })*/.state("meet-us", {
      url: "/lp/media/:page",
      templateUrl: "app/landing_page/landing_page.html",
      controller: "LandingPagesCtrl",
      data:{requireLogin: false}
    }).state("advertising", {
      url: "/advertising",
      templateUrl: "app/views/ads/ads.html",
      controller: "MediaAdsCtrl",
      data:{requireLogin: false}
    }).state("awards-recognition", {
      url: "/awards-recognition",
      templateUrl: "app/views/awards_recognition/awards_recognition.html",
      controller: "MediaAwardsRecognitionCtrl",
      data:{requireLogin: false}
    }).state("videos", {
      url: "/videos",
      templateUrl: "app/views/videos/videos.html",
      controller: "MediaVideosCtrl",
      data:{requireLogin: false}
    }).state("professionality", {
      url: "/professionality",
      templateUrl: "app/views/professionality/professionality.html",
      controller: "ProfessionalityCtrl",
      data:{requireLogin: false}
    }).state("product-detail", {
      url: "/product-detail/:id",
      templateUrl: "app/views/product-detail/product-detail.html",
      controller: "productDetailCtrl",
      data:{requireLogin: false}
    }).state("contact-us", {
      url: "/contact-us",
      templateUrl: "/views/contact-us",
      controller: "contactUsCtrl",
      data:{requireLogin: false}
    })
    .state("maintenance", {
      url: "/maintenance",
      templateUrl: "components/cms/content_blocks/maintenance/maintenance.html",
      data:{requireLogin: false, hideMenus: false}
    });
    //routerProvider.setCollectionUrl(apiUrl+'/menu');
    return $urlRouterProvider.otherwise('/');
  }]);

  app.factory('dataFactory', ['$http','$location',function($http, $location){
    dataFactory = {};
    var currentPath = $location.path();
    var results;

    dataFactory.getData = function(option) {
      //console.log('apiUrl@getData = ' + apiUrl + option);
      return $http.get(apiUrl + option);
    };
    //$log(this);
    return dataFactory;
  }]);

  app.service('anchorSmoothScroll', function(){
    
    this.scrollTo = function(eID, PreviouseID) {

        // This scrolling function 
        // is from http://www.itnewb.com/tutorial/Creating-the-Smooth-Scroll-Effect-with-JavaScript
        var startY = currentYPosition();
        var stopY = elmYPosition(eID);
        var distance = stopY > startY ? stopY - startY : startY - stopY;
        
        //console.log('distance', distance);
        //console.log('startY', startY);
        //console.log('stopY', stopY);
        
        if (distance < 100) {
            scrollTo(0, stopY); return;
        }
        var speed = Math.round(distance / 100);
        if (speed >= 20) speed = 20;
        var step = Math.round(distance / 25);
        var leapY = stopY > startY ? startY + step : startY - step;
        
        if ( PreviouseID != null) {
          var heightEiD = angular.element('#'+eID)[0].clientHeight;
          var heightPreviouseID = angular.element('#'+ PreviouseID)[0].clientHeight;
          ////console.log('eID', angular.element('#'+eID));
          //console.log('eID.clientHeight', heightEiD);
          ////console.log('PreviouseID', PreviouseID);
          //console.log('PreviouseID.clientHeight', heightPreviouseID);
          //console.log('pre adjust leap', leapY);
          leapY = leapY - (heightPreviouseID - heightEiD);
          //console.log('leapY',leapY);
        }
        
        var timer = 0;
        if (stopY > startY) {
            for ( var i=startY; i<stopY; i+=step ) {
                setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
                leapY += step; if (leapY > stopY) leapY = stopY; timer++;
            } return;
        }
        for ( var i=startY; i>stopY; i-=step ) {
            setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
            leapY -= step; if (leapY < stopY) leapY = stopY; timer++;
        }
        
        function currentYPosition() {
            // Firefox, Chrome, Opera, Safari
            if (self.pageYOffset) return self.pageYOffset;
            // Internet Explorer 6 - standards mode
            if (document.documentElement && document.documentElement.scrollTop)
                return document.documentElement.scrollTop;
            // Internet Explorer 6, 7 and 8
            if (document.body.scrollTop) return document.body.scrollTop;
            return 0;
        }
        
        function elmYPosition(eID) {
            var elm = document.getElementById(eID);
            var y = elm.offsetTop;
            var node = elm;
            while (node.offsetParent && node.offsetParent != document.body) {
                node = node.offsetParent;
                y += node.offsetTop;
            } return y;
        }
    };
    //console.log(this);
    
  });
}).call(this);


(function() {
  'use strict';
  app.directive("sticky", function($window) {
  return {
    link: function(scope, element, attrs) {

      var $win = angular.element($window);

      if (scope._stickyElements === undefined) {
        scope._stickyElements = [];

        $win.bind("scroll.sticky", function(e) {
          var pos = $win.scrollTop();
          for (var i=0; i<scope._stickyElements.length; i++) {

            var item = scope._stickyElements[i];

            if (!item.isStuck && pos > item.start) {
              item.element.addClass("stuck");
              item.element.parent().addClass("fixed_nav");
              item.isStuck = true;

              if (item.placeholder) {
                item.placeholder = angular.element("<div></div>")
                    .css({height: item.element.outerHeight() + "px"})
                    .insertBefore(item.element);
              }
            }
            else if (item.isStuck && pos < item.start) {
              item.element.removeClass("stuck");
              item.element.parent().removeClass("fixed_nav");
              item.isStuck = false;

              if (item.placeholder) {
                item.placeholder.remove();
                item.placeholder = true;
              }
            }
          }
        });

        var recheckPositions = function() {
          for (var i=0; i<scope._stickyElements.length; i++) {
            var item = scope._stickyElements[i];
            if (!item.isStuck) {
              item.start = item.element.offset().top;
            } else if (item.placeholder) {
              item.start = item.placeholder.offset().top;
            }
          }
        };
        $win.bind("load", recheckPositions);
        $win.bind("resize", recheckPositions);
      }

      var item = {
        element: element,
        isStuck: false,
        placeholder: attrs.usePlaceholder !== undefined,
        start: element.offset().top
      };

      scope._stickyElements.push(item);

    }
  };
});
}).call(this);

(function() {
  'use strict';
  app.directive('menuHeader', function(){
    return {
      templateUrl: 'components/menu_header/menu_header.html',
      restrict: 'E',
      replace: true,
      scope: {
        headerMenu: '@',
        opened: '@'
      },
      controller: ["$scope", function($scope) {
        //$scope.menus = {};
        $scope.opened = false;
         $scope.headerMenu = [
              /*{
                  "url": "/lp/home/",
                  "custom_url": "",
                  "label": "Home",
                  "icon": "home",
                  "channel": "lp",
                  "entry_id": "4332",
                  "parent": "0"
              },
              {
                  "url": "/design-library",
                  "custom_url": "",
                  "label": "Design Library",
                  "icon": "",
                  "channel": "lp",
                  "entry_id": "4324",
                  "parent": "0"
              },*/
              {
                  "url": "/fabric-collections",
                  "custom_url": "",
                  "label": "Fabric Collections",
                  "icon": "",
                  "channel": "lp",
                  "entry_id": "4323",
                  "parent": "0"
              },
              {
                  "url": "/lp/printed-fabrics",
                  "custom_url": "",
                  "label": "Printed Fabrics",
                  "icon": "",
                  "channel": "lp",
                  "entry_id": "4325",
                  "parent": "0"
              },
              {
                  "url": "/lp/roller-shades",
                  "custom_url": "",
                  "label": "Roller Shades",
                  "icon": "",
                  "channel": "lp",
                  "entry_id": "4326",
                  "parent": "0"
              },
              {
                  "url": "/lp/bedding",
                  "custom_url": "",
                  "label": "Bedding",
                  "icon": "",
                  "channel": "lp",
                  "entry_id": "4327",
                  "parent": "0"
              },
              {
                  "url": "/lp/sustainability",
                  "custom_url": "",
                  "label": "Sustainability",
                  "icon": "",
                  "channel": "lp",
                  "entry_id": "4328",
                  "parent": "0"
              },
              {
                  "url": "/lp/media",
                  "custom_url": "",
                  "label": "Media",
                  "icon": "",
                  "channel": "lp",
                  "entry_id": "4329",
                  "parent": "0",
                  "submenu": [
                    {
                        "url": "/lp/media/meet-us",
                        "custom_url": "",
                        "label": "Meet Us",
                        "icon": "",
                        "channel": "lp",
                        "entry_id": "4406",
                        "parent": "4329"
                    },
                    {
                        "url": "/awards-recognition",
                        "custom_url": "",
                        "label": "Awards & Recognition",
                        "icon": "",
                        "channel": "lp",
                        "entry_id": "4405",
                        "parent": "4329"
                    },
                    {
                        "url": "/advertising",
                        "custom_url": "",
                        "label": "Advertising",
                        "icon": "",
                        "channel": "lp",
                        "entry_id": "4408",
                        "parent": "4329"
                    },
                    {
                        "url": "/lp/media/videos",
                        "custom_url": "",
                        "label": "Online Videos",
                        "icon": "",
                        "channel": "lp",
                        "entry_id": "4408",
                        "parent": "4329"
                    }
                ]
              },
              {
                  "url": "/professionality",
                  "custom_url": "",
                  "label": "Professionality",
                  "icon": "",
                  "channel": "lp",
                  "entry_id": "4330",
                  "parent": "0"
              }
          ];
        ////console.log('scope.headerMenu');
        //console.log($scope.headerMenu);
        return $scope.headerMenu;
      }]
    };
  });
}).call(this);

(function() {
  'use strict';
  app.directive('wuCmsContentBlockTitleBar', function() {
    return {
      templateUrl: 'components/cms/content_blocks/title_bar/title_bar.html',
      restrict: 'E',
      replace: true
    };
  });

}).call(this);

(function() {
  'use strict';
  app.directive('wuCmsContentBlockStandardBlock', function() {
    return {
      templateUrl: 'components/cms/content_blocks/standard_block/standard_block.html',
      restrict: 'E',
      replace: true
    };
  });

}).call(this);

(function() {
  'use strict';
  app.directive('wuCmsContentBlockTwoColumn', function() {
    return {
      templateUrl: 'components/cms/content_blocks/two_column/two_column.html',
      restrict: 'E',
      replace: true
    };
  });

}).call(this);

(function() {
  'use strict';
  app.directive('wuCmsContentBlockThreeColumn', function() {
    return {
      templateUrl: 'components/cms/content_blocks/three_column/three_column.html',
      restrict: 'E',
      replace: true
    };
  });

}).call(this);

(function() {
  'use strict';
  app.directive('wuCmsContentBlockFourColumn', function() {
    return {
      templateUrl: 'components/cms/content_blocks/four_column/four_column.html',
      restrict: 'E',
      replace: true
    };
  });

}).call(this);

(function() {
  'use strict';
  app.directive('wuCmsContentBlockFiveColumn', function() {
    return {
      templateUrl: 'components/cms/content_blocks/five_column/five_column.html',
      restrict: 'E',
      replace: true
    };
  });

}).call(this);

(function() {
  'use strict';
  app.directive('wuCmsContentBlockHorizontalRule', function() {
    return {
      templateUrl: 'components/cms/content_blocks/horizontal_rule/horizontal_rule.html',
      restrict: 'E',
      replace: true
    };
  });

}).call(this);

(function() {
  'use strict';
  app.directive('wuCmsContentBlock', function() {
    return {
      templateUrl: 'components/cms/content_blocks/content_block/content_block.html',
      scope: {
        contentBlock: '='
      },
      restrict: 'E',
      replace: true,
      controller: ["$scope", "$element", "$attrs", function($scope, $element, $attrs) {
        $scope.getContentBlockClass = function() {
          var cssClasses;
          cssClasses = [];
          if ($scope.contentBlock.alignment === 'center') {
            cssClasses.push('wu-cms-content-block--center');
          }
          if ($scope.contentBlock.alignment === 'right') {
            cssClasses.push('wu-cms-content-block--right');
          }
          if ($scope.contentBlock.alignment === 'justified') {
            cssClasses.push('wu-cms-content-block--justified');
          }
          if ($scope.contentBlock.color === 'gray') {
            cssClasses.push('wu-cms-content-block--gray');
          }
          if ($scope.contentBlock.content_block_type === 'banner') {
            cssClasses.push('wu-cms-content-block--nopad');
          }
          return cssClasses;
        };
        return $scope.getButtonClass = function(style) {
          var buttonClass;
          if (!style) {
            return '';
          }
          buttonClass = '';
          switch (style) {
            case 'transparent-white':
              buttonClass = 'wu-btn--transparent-white';
              break;
            case 'transparent-black':
              buttonClass = 'wu-btn--transparent-black';
              break;
            case 'transparent-dark-gray':
              buttonClass = 'wu-btn--transparent-dark-gray';
              break;
            case 'transparent-blue':
              buttonClass = 'wu-btn--transparent-blue';
              break;
            case 'dark-gray':
              buttonClass = 'wu-btn--dark-gray';
              break;
            case 'blue':
              buttonClass = 'wu-btn--blue';
              break;
            case 'red':
              buttonClass = 'wu-btn--red';
          }
          return buttonClass;
        };
      }]
    };
  });

}).call(this);

(function() {
  'use strict';
  app.directive('wuCmsContentBlockBannerCarousel', function() {
    return {
      templateUrl: 'components/cms/content_blocks/banner_carousel/banner_carousel.html',
      restrict: 'E',
      replace: true,
      controller: ["$scope", "$element", "$attrs", function($scope, $element, $attrs) {
        $scope.owlOptions = {
          navText: '',
          nav: false,
          items: 1,
          responsive: {
            1168: {
              nav: true
            }
          }
        };
        return $scope.slides = _.map($scope.contentBlock.banner_carousel, function(banner) {
          return {
            banner: banner
          };
        });
      }]
    };
  });

}).call(this);

(function() {
  'use strict';
  app.directive('wuCmsContentBlockFluidGrid', function() {
    return {
      templateUrl: 'components/cms/content_blocks/fluid_grid/fluid_grid.html',
      restrict: 'E',
      replace: true
    };
  });

}).call(this);

(function() {
  'use strict';
  app.directive('wuCmsContentBlockCallToAction', function() {
    return {
      templateUrl: 'components/cms/content_blocks/call_to_action/call_to_action.html',
      restrict: 'E',
      replace: true
    };
  });

}).call(this);


(function() {
  'use strict';
  app.directive('wuCmsContentBlockBanner', function() {
    return {
      templateUrl: 'components/cms/content_blocks/banner/banner.html',
      restrict: 'E',
      replace: true,
      scope: {
        contentBlock: '='
      }
    };
  });

}).call(this);

(function() {
  'use strict';
  app.directive('wuCmsContentBlockTabs', function() {
    return {
      templateUrl: 'components/cms/content_blocks/tabs/tabs.html',
      scope: {
        contentBlock: '=',
        tabContentBlock: '='
      },
      restrict: 'E',
      replace: true,      controller: ["$scope", "$element", "$attrs", function($scope, $element, $attrs) {
        $scope.getTabContentBlockClass = function(tabContentBlock) { 
          //console.log(tabContentBlock);
          
          var cssClasses;
          cssClasses = [];
          if (tabContentBlock.alignment === 'center') {
            cssClasses.push('wu-cms-content-block--center');
          }
          if (tabContentBlock.alignment === 'right') {
            cssClasses.push('wu-cms-content-block--right');
          }
          if (tabContentBlock.alignment === 'justified') {
            cssClasses.push('wu-cms-content-block--justified');
          }
          if (tabContentBlock.color === 'gray') {
            cssClasses.push('wu-cms-content-block--gray');
          }
          if (tabContentBlock.content_block_type === 'banner') {
            cssClasses.push('wu-cms-content-block--nopad');
          }
          return cssClasses;
        };
        return $scope.getButtonClass = function(style) {
          var buttonClass;
          if (!style) {
            return '';
          }
          buttonClass = '';
          switch (style) {
            case 'transparent-white':
              buttonClass = 'wu-btn--transparent-white';
              break;
            case 'transparent-black':
              buttonClass = 'wu-btn--transparent-black';
              break;
            case 'transparent-dark-gray':
              buttonClass = 'wu-btn--transparent-dark-gray';
              break;
            case 'transparent-blue':
              buttonClass = 'wu-btn--transparent-blue';
              break;
            case 'dark-gray':
              buttonClass = 'wu-btn--dark-gray';
              break;
            case 'blue':
              buttonClass = 'wu-btn--blue';
              break;
            case 'red':
              buttonClass = 'wu-btn--red';
          }
          return buttonClass;
        };
      }]
    };
  });

}).call(this);

(function() {
  'use strict';
  app.directive('wuCmsContentBlockProducts', function() {
    return {
      templateUrl: 'components/cms/content_blocks/products/products.html',
      restrict: 'E',
      replace: true,
      scope: {
        contentBlock: '='
      }
    };
  });

}).call(this);


(function() {
  'use strict';
  app.directive('owlCarousel', function() {
    return {
      restrict: 'A',
      transclude: true,
      link: function(scope, element, attributes, controller, $transclude) {
        var options, owlCarousel, propertyName, setupPageControls;
        owlCarousel = null;
        propertyName = attributes.owlCarousel;
        options = JSON.parse(attributes.owlOptions);
        setupPageControls = function(ev) {
          var setupPageControl;
          setupPageControl = function(className) {
            var navElement;
            navElement = element.find('.' + className);
            if (ev.item.count > ev.page.size) {
              return navElement.addClass(className + '--shown');
            } else {
              return navElement.removeClass(className + '--shown');
            }
          };
          setupPageControl('owl-nav');
          return setupPageControl('owl-dots');
        };
        element.on('initialized.owl.carousel', setupPageControls);
        element.on('resized.owl.carousel', setupPageControls);
        return scope.$watchCollection(propertyName, function(newItems, oldItems) {
          var i, item, len;
          if (owlCarousel) {
            element.html('');
            owlCarousel.trigger('destroy.owl.carousel');
            element.off('initialized.owl.carousel');
            element.off('resized.owl.carousel');
          }
          element.on('initialized.owl.carousel', setupPageControls).on('resized.owl.carousel', setupPageControls);
          for (i = 0, len = newItems.length; i < len; i++) {
            item = newItems[i];
            $transclude(function(clone, scope) {
              scope.item = item;
              return element.append(clone[1]);
            });
          }
          return owlCarousel = element.owlCarousel(options);
        });
      }
    };
  });

}).call(this);

(function() {
  'use strict';
  app.directive('headerBar', function() {
    return {
      templateUrl: 'components/header/header.html',
      restrict: 'E',
      scope: {
        collapse: '='
      }
    };
  });

}).call(this);

(function() {
  'use strict';
  app.directive('footerBar', function() {
    return {
      templateUrl: 'components/footer/footer.html',
      restrict: 'E',
      scope: {
        collapse: '='
      }
    };
  });

}).call(this);

(function() {
  'use strict';
  app.directive('backgroundImage', function() {
    return {
      scope: {
        config: '='
      },
      link: function(scope, element, attrs) {
        attrs.$observe('backgroundImage', function(value) {
          var cssProps;
          if (!value) {
            return;
          }
          cssProps = {
            'background-size': 'cover',
            'background-image': 'url(' + value + ')'
          };
          return element.css(cssProps);
        });
        return scope.$watch('config', function(newValue, oldValue) {
          if (typeof newValue !== 'undefined') {
            if (!_.isEqual(newValue, oldValue)) {
              return element.css(newValue);
            }
          }
        });
      }
    };
  });

}).call(this);

(function() {
  'use strict';
  app.directive('toggleClass', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('click', function() {
                element.toggleClass(attrs.toggleClass);
            });
        }
    };
  });
}).call(this);

(function() {
  'use strict';
  app.directive('tabs', function() {
    return {
      restrict: 'E',
      transclude: true,
      scope: {},
      controller: [ "$scope", function($scope) {
        var panes = $scope.panes = [];
 
        $scope.select = function(pane) {
          angular.forEach(panes, function(pane) {
            pane.selected = false;
          });
          pane.selected = true;
        }
 
        this.addPane = function(pane) {
          if (panes.length == 0) $scope.select(pane);
          panes.push(pane);
        }
      }],
      template:
        '<div class="tabbable  col-xs-12 col-sm-12 col-md-12 col-lg-12">' +
          '<ul class="nav nav-tabs">' +
            '<li ng-repeat="pane in panes" ng-class="{active:pane.selected}">'+
              '<a href="" ng-click="select(pane)">{{pane.title}}</a>' +
            '</li>' +
          '</ul>' +
          '<div class="tab-content" ng-transclude></div>' +
        '</div>',
      replace: true
    };
  });
}).call(this);

(function() {
  'use strict';
  app.directive('pane', function() {
    return {
      require: '^tabs',
      restrict: 'E',
      transclude: true,
      scope: { title: '@' },
      link: function(scope, element, attrs, tabsCtrl) {
        tabsCtrl.addPane(scope);
      },
      template:
        '<div class="tab-pane" ng-class="{active: selected}" ng-transclude>' +
        '</div>',
      replace: true
    };
  });
}).call(this);



(function() {
  'use strict';
  app.directive('wuCmsContentBlockTimeline', function() {
    return {
      templateUrl: 'components/cms/content_blocks/timeline/timeline.html',
      restrict: 'E'
    };
  });
}).call(this);



(function() {
  'use strict';
  app.directive('unbindable', function(){
      return { scope: true };
  });
}).call(this);

(function() {
  'use strict';
  app.directive('sample',['$timeout', '$document','$state','anchorSmoothScroll',  function(timer, $document, $state) {
  return {
    restrict: "EA",
    replace   : true,
    controller: ['$scope','$rootScope', '$document', '$state','anchorSmoothScroll', function($scope, $rootScope, $document, $state, anchorSmoothScroll) {
      
      this.setPreviousSample = function(v) {
        
        $rootScope.previousSample =  v;
        $scope.$apply;
      }
      this.getPreviousSample = function() {
        return $scope.previousSample;
      }
      this.gotoElement = function (eID){
        // set the location.hash to the id of
        // the element you wish to scroll to.
        //$location.hash(eID);
        //console.log(anchorSmoothScroll);
        // call $anchorScroll()
        anchorSmoothScroll.scrollTo(eID, $scope.previousSample);
        
      };
      this.goToUrl = function(url){
          //console.log('goToUrl', url);
          //$location.path(url);
          $state.go(url);
        };
      
      
    }],
    link: function (scope, element, attributes, $scope, $rootScope, $location, anchorSmoothScroll) {     
      $document.bind('click', function(e) {
        e.stopPropagation();
        
      });
      //
      
      //element.bind('click', function (e, $location) {
      scope.showPreview = function(){
      
      //console.log(element);

        if (scope.opening == true || scope.destroying==true) {return false;}
        scope.currentSamplePreview = attributes.id;
        $scope.gotoElement(attributes.id);
        
        
        var destroyPreview = function(x, $location) {
          //console.log('x[0]',x[0]);
          //console.log('x',x);
          if(scope.destroying == true && scope.closingPreview == scope.openingPreview) {
            //console.log('already closing ' + scope.currentSamplePreview);
          }else{
            scope.destroying=true;
            scope.closingPreview = x[0].id;
            //console.log('closing preview for ' + x[0].id );
            timer(function(){ x.children('.og-expander').css("cssText","height:0px;") }, 0);
            x.addClass('not-og-expanded');
            x.removeClass('og-expanded');
            timer(function(){ x.children('.og-expander').remove(); scope.destroying=false; scope.closingPreview = null}, 800);
            //console.log(x[0].id + ' has been closed' );
            //$location.hash(element[0].id);
          }
        }
        
        var createPreview = function(x, $location) {
          //console.log('x[0]',x[0]);
          //console.log('x',x);
          if (scope.opening == true && scope.openingPreview == scope.currentSamplePreview) {
            //console.log('already closing ' + scope.currentSamplePreview);
          }else{
            scope.opening = true;
            scope.openingPreview = x[0].id;
            //console.log('opening preview for ' + x[0].id );
            element.addClass('og-expanded');
            element.removeClass('not-og-expanded');
            
            element.append(preview.$previewEl);
            timer(function(){element.children('.og-expander').css("cssText",""); scope.opening = false; scope.openingPreview= null}, 200);
            $scope.setPreviousSample(x[0].id);
            
          }
          //return false;
        }

        var preview = {};
        
        ////console.log(scope);
        //console.log(scope.item);
        //scope.gotoAnchor(scope.item.order)
        
        if (scope.$parent.collections) {
          preview.$image = $( '<div class="col-xs-12" style="background-image: url(' + attributes.largesrc + '); height: inherit; background-size: cover;"><img src="/assets/images/clear.png" /></div>');
          preview.$title = $( '<h1 class="hide-for-small">' + scope.item.title + '</h1>' );
          preview.$description = $( '<p>' + scope.item.summary + '</p>' );
          preview.$href = $( '<a href="' + '#/design-library/' + scope.item.book + '" class="wu-btn wu-btn--transparent-black" ng-click="goToUrl(\"' + scope.item.book + '\")" id="dlLink">' + attributes.button + '</a>' );
          preview.$more = $('');
        }
        if (scope.$parent.samples){
          preview.$image = $( '<div class="col-xs-12" style="background-image: url(' + attributes.largesrc + '); height: inherit; background-size: cover;"><img src="/assets/images/clear.png" /></div>');
          preview.$href = $( '<a href="#/design-library/" class="wu-btn wu-btn--transparent-black" unbindable  >' + attributes.button + '</a>' );
          preview.$title = $( '<h1 class="hide-for-small  col-xs-12">' + scope.item.name + '</h1>' );
          preview.$description = $( '<p>Pattern Name: ' + scope.item.pattern_name + '</p><p>Color: ' + scope.item.pattern_name_color + '</p><p>Content: ' + scope.item.content + '</p><p>In Stock: ' + scope.item.inventory + ' Yrds</p>' );
          
          preview.$alternativesInner = '';
          angular.forEach(scope.item.alternate, function(value){
            preview.$alternativesInner = preview.$alternativesInner + '<div class="alternative-item"><img src="http://www.valleyforge.com/images/made/uploads/skus/' + value + '_99_66_70.jpg" " alt="' + value + '" /></div>';
          });
          preview.$alternatives = $('<div class="og-alternatives col-lg-4 col-md-4 col-sm-4 col-xs-4"><h4>Available in-stock alternatives</h4></div>').append( preview.$alternativesInner );
          
          preview.$moreInner = '';
          angular.forEach(scope.item.more, function(value){
            preview.$moreInner = preview.$moreInner + '<div class="more-item"><img src="http://www.valleyforge.com/images/made/uploads/skus/' + value + '_99_66_70.jpg" " alt="' + value + '" /></div>';
          });
          preview.$more = $('<div class="og-more col-lg-8 col-md-8 col-sm-8 col-xs-8"><h4>Available Colors</h4></div>').append( preview.$moreInner );
        }
        if (scope.$parent.videos){
          preview.$image = $( '<div class="col-xs-12" style="background-image: url(http://img.youtube.com/vi/' + scope.item.id +  '/0.jpg); height: inherit; background-size: cover;"><youtube-video ng-bind="scope.item.id" video-id="' + scope.item.id + '"></youtube-video></div>');
          preview.$title = $( '<h1 class="hide-for-small">' + scope.item.name + '</h1>' );
          preview.$description = $( '<p>' + scope.item.summary + '</p>' );
          preview.$href = $( '<a href="' + '#/design-library/' + scope.item.book + '" class="wu-btn wu-btn--transparent-black" ng-click="goToUrl(\"' + scope.item.book + '\")" id="dlLink">' + attributes.button + '</a>' );
          preview.$more = $('');
        
        }
        
        
        preview.$detailsInner = $( '<div class="og-details_inner  col-xs-12"></div>' ).append( preview.$title, preview.$description, preview.$href);
        preview.$details = $( '<div class="og-details xlarge-4 col-lg-4 col-md-4 col-sm-4 columns"></div>' ).append( preview.$detailsInner );
        //preview.$image = $( '<div class="col-xs-12" style="background-image: url(' + attributes.largesrc + '); height: inherit; background-size: cover;"><img src="/assets/images/clear.png" /></div>');
        preview.$loading = $( '<div class="og-loading-"></div>' );
        preview.$fullimage = $( '<div class="og-fullimg xlarge-8 col-lg-8 col-md-8 col-sm-8"></div>' ).append( preview.$loading ).append(preview.$image);
        preview.$closePreview = $( '<span class="preview-close"></span>' );
        preview.$previewInner = $( '<div class="og-expander-inner preview-inner"></div>' ).append( preview.$closePreview, preview.$details, preview.$fullimage, preview.$alternatives, preview.$more );
        preview.$previewContainer = $( '<div class="container"></div>').append( preview.$previewInner ); 
        preview.$previewEl = $( '<div class="og-expander" style="height:0px;"></div>' ).append( preview.$previewContainer );

        
       /* console.log('currentSamplePreview', scope.currentSamplePreview);
        console.log('lastSamplePreview', scope.lastSamplePreview);*/
        //console.log('getPreviousSample()', $scope.getPreviousSample());
        //console.log(element);

        if (element.hasClass('og-expanded')) {
          scope.closingPreview = element[0].id;
          destroyPreview(element);
          return false
        }

        if (element.hasClass('not-og-expanded')) {
          if(scope.opening == true) {
            //console.log('scope.opening is true');
            return false;
          }else{
            //console.log('scope.opening is false');
          //console.log('currentSample [' + scope.currentSamplePreview + '] != lastSamplePreview [' + $scope.getPreviousSample() + ']');
            //console.log('open preview for ' + element[0].id);
            scope.openingPreview = scope.currentSamplePreview;
            if (element[0].id != $scope.getPreviousSample() && $scope.getPreviousSample() != null) {
              //console.log('abandonded preview [ ' + $scope.getPreviousSample() + ']');
              scope.closingPreview = $scope.getPreviousSample();
              destroyPreview(angular.element('#' + $scope.getPreviousSample()));
            }
            createPreview(element);
          }
        }
        
        //console.log('complete');
        //$scope.gotoElement(attributes.id);
      };
      //});

    }
  }
}]);
}).call(this);



(function() {
  app.controller("ExamplesCtrl", ["$scope", function($scope) {
    $scope.examples = [
      {
        "description": "Standard block",
        "content_block": {
          "content_block_type": "standard_block",
          "color": "black",
          "standard_block": {
            "headline": "You Dream It",
            "body": "90's mixtape retro kale chips. Messenger bag VHS pickled semiotics keytar, tofu Neutra hashtag American Apparel tousled kitsch. Beard heirloom kogi, gluten-free squid fixie sustainable health goth. Sartorial Portland Bushwick hashtag, distillery blog Shoreditch post-ironic PBR chia. Tote bag yr drinking vinegar cliche Odd Future pork belly. Williamsburg Brooklyn 8-bit migas. Chambray trust fund, American Apparel skateboard small batch cliche biodiesel fingerstache.",
            "link": {
              "label": "See More",
              "url": "/"
            }
          }
        }
      }, {
        "description": "Standard block -- centered with only a button",
        "content_block": {
          "content_block_type": "standard_block",
          "alignment": "center",
          "standard_block": {
            "button": {
              "label": "VIEW GUIDELINES",
              "url": "/",
              "style": "transparent-dark-gray"
            }
          }
        }
      }, {
        "description": "Standard block -- right-aligned",
        "content_block": {
          "content_block_type": "standard_block",
          "alignment": "right",
          "standard_block": {
            "headline": "You Dream It",
            "body": "90's mixtape retro kale chips. Messenger bag VHS pickled semiotics keytar, tofu Neutra hashtag American Apparel tousled kitsch. Beard heirloom kogi, gluten-free squid fixie sustainable health goth. Sartorial Portland Bushwick hashtag, distillery blog Shoreditch post-ironic PBR chia. Tote bag yr drinking vinegar cliche Odd Future pork belly. Williamsburg Brooklyn 8-bit migas. Chambray trust fund, American Apparel skateboard small batch cliche biodiesel fingerstache.",
            "button": {
              "label": "DONT CLICK ME",
              "url": "/",
              "style": "blue"
            }
          }
        }
      }, {
        "description": "Two-column block with gray color",
        "content_block": {
          "content_block_type": "two_column",
          "color": "gray",
          "two_column": [
            {
              "headline": "Messenger bags are cool",
              "body": "90's mixtape retro kale chips. Messenger bag VHS pickled semiotics keytar, tofu Neutra hashtag American Apparel tousled kitsch. Beard heirloom kogi, gluten-free squid fixie sustainable health goth. Sartorial Portland Bushwick hashtag, distillery blog Shoreditch post-ironic PBR chia. Tote bag yr drinking vinegar cliche Odd Future pork belly. Williamsburg Brooklyn 8-bit migas. Chambray trust fund, American Apparel skateboard small batch cliche biodiesel fingerstache."
            }, {
              "headline": "Sweet mix tape",
              "body": "90's mixtape retro kale chips. Messenger bag VHS pickled semiotics keytar, tofu Neutra hashtag American Apparel tousled kitsch. Beard heirloom kogi, gluten-free squid fixie sustainable health goth. Sartorial Portland Bushwick hashtag, distillery blog Shoreditch post-ironic PBR chia. Tote bag yr drinking vinegar cliche Odd Future pork belly. Williamsburg Brooklyn 8-bit migas. Chambray trust fund, American Apparel skateboard small batch cliche biodiesel fingerstache."
            }
          ]
        }
      }, {
        "description": "Two-column block with links and buttons",
        "content_block": {
          "content_block_type": "two_column",
          "two_column": [
            {
              "headline": "Messenger bags are cool",
              "body": "90's mixtape retro kale chips. Messenger bag VHS pickled semiotics keytar, tofu Neutra hashtag American Apparel tousled kitsch. Beard heirloom kogi, gluten-free squid fixie sustainable health goth. Sartorial Portland Bushwick hashtag, distillery blog Shoreditch post-ironic PBR chia. Tote bag yr drinking vinegar cliche Odd Future pork belly. Williamsburg Brooklyn 8-bit migas. Chambray trust fund, American Apparel skateboard small batch cliche biodiesel fingerstache.",
              "link": {
                "label": "See more",
                "url": "/"
              }
            }, {
              "headline": "Sweet mix tape",
              "body": "90's mixtape retro kale chips. Messenger bag VHS pickled semiotics keytar, tofu Neutra hashtag American Apparel tousled kitsch. Beard heirloom kogi, gluten-free squid fixie sustainable health goth. Sartorial Portland Bushwick hashtag, distillery blog Shoreditch post-ironic PBR chia. Tote bag yr drinking vinegar cliche Odd Future pork belly. Williamsburg Brooklyn 8-bit migas. Chambray trust fund, American Apparel skateboard small batch cliche biodiesel fingerstache.",
              "link": {
                "label": "MIX IT UP",
                "url": "/"
              }
            }, {
              "headline": "Best tofu",
              "body": "90's mixtape retro kale chips. Messenger bag VHS pickled semiotics keytar, tofu Neutra hashtag American Apparel tousled kitsch. Beard heirloom kogi, gluten-free squid fixie sustainable health goth. Sartorial Portland Bushwick hashtag, distillery blog Shoreditch post-ironic PBR chia. Tote bag yr drinking vinegar cliche Odd Future pork belly. Williamsburg Brooklyn 8-bit migas. Chambray trust fund, American Apparel skateboard small batch cliche biodiesel fingerstache.",
              "button": {
                "label": "I AM RED",
                "url": "/",
                "style": "red"
              }
            }, {
              "headline": "Best tofu",
              "body": "90's mixtape retro kale chips. Messenger bag VHS pickled semiotics keytar, tofu Neutra hashtag American Apparel tousled kitsch. Beard heirloom kogi, gluten-free squid fixie sustainable health goth. Sartorial Portland Bushwick hashtag, distillery blog Shoreditch post-ironic PBR chia. Tote bag yr drinking vinegar cliche Odd Future pork belly. Williamsburg Brooklyn 8-bit migas. Chambray trust fund, American Apparel skateboard small batch cliche biodiesel fingerstache.",
              "button": {
                "label": "Another button",
                "url": "/",
                "style": "transparent-blue"
              }
            }
          ]
        }
      }, {
        "description": "Three column layout",
        "content_block": {
          "content_block_type": "three_column",
          "three_column": [
            {
              "headline": "Messenger bags are cool",
              "body": "90's mixtape retro kale chips. Messenger bag VHS pickled semiotics keytar, tofu Neutra hashtag American Apparel tousled kitsch. Beard heirloom kogi, gluten-free squid fixie sustainable health goth. Sartorial Portland Bushwick hashtag, distillery blog Shoreditch post-ironic PBR chia. Tote bag yr drinking vinegar cliche Odd Future pork belly. Williamsburg Brooklyn 8-bit migas. Chambray trust fund, American Apparel skateboard small batch cliche biodiesel fingerstache.",
              "link": {
                "label": "See more",
                "url": "/"
              }
            }, {
              "headline": "Sweet mix tape",
              "body": "90's mixtape retro kale chips. Messenger bag VHS pickled semiotics keytar, tofu Neutra hashtag American Apparel tousled kitsch. Beard heirloom kogi, gluten-free squid fixie sustainable health goth. Sartorial Portland Bushwick hashtag, distillery blog Shoreditch post-ironic PBR chia. Tote bag yr drinking vinegar cliche Odd Future pork belly. Williamsburg Brooklyn 8-bit migas. Chambray trust fund, American Apparel skateboard small batch cliche biodiesel fingerstache.",
              "link": {
                "label": "MIX IT UP",
                "url": "/"
              }
            }, {
              "headline": "Best tofu",
              "body": "90's mixtape retro kale chips. Messenger bag VHS pickled semiotics keytar, tofu Neutra hashtag American Apparel tousled kitsch. Beard heirloom kogi, gluten-free squid fixie sustainable health goth. Sartorial Portland Bushwick hashtag, distillery blog Shoreditch post-ironic PBR chia. Tote bag yr drinking vinegar cliche Odd Future pork belly. Williamsburg Brooklyn 8-bit migas. Chambray trust fund, American Apparel skateboard small batch cliche biodiesel fingerstache.",
              "button": {
                "label": "I AM RED",
                "url": "/",
                "style": "red"
              }
            }
          ]
        }
      }, {
        "description": "Three column layout with super headline",
        "content_block": {
          "alignment": "center",
          "content_block_type": "three_column",
          "three_column": [
            {
              "super_headline": "1",
              "headline": "Messenger bags are cool"
            }, {
              "super_headline": "2",
              "headline": "Sweet mix tape"
            }, {
              "super_headline": "3",
              "headline": "Best tofu"
            }
          ]
        }
      }, {
        "description": "A horizontal rule",
        "content_block": {
          "content_block_type": "horizontal_rule"
        }
      }, {
        "description": "A banner w/ link",
        "content_block": {
          "content_block_type": "banner",
          "banner": {
            "url": "/docs",
            "images": {
              "xs": "assets/images/mock_data/banners/inspire/banner_320x220_mobile.jpg",
              "sm": "assets/images/mock_data/banners/inspire/banner_480x320_mobile.jpg",
              "md": "assets/images/mock_data/banners/inspire/banner_768x600.jpg",
              "lg": "assets/images/mock_data/banners/inspire/banner_992x496.jpg",
              "xl": "assets/images/mock_data/banners/inspire/banner_1400x580.jpg"
            }
          }
        }
      }, {
        "description": "A banner without a link",
        "content_block": {
          "content_block_type": "banner",
          "banner": {
            "images": {
              "xs": "assets/images/mock_data/banners/inspire/banner_320x220_mobile.jpg",
              "sm": "assets/images/mock_data/banners/inspire/banner_480x320_mobile.jpg",
              "md": "assets/images/mock_data/banners/inspire/banner_768x600.jpg",
              "lg": "assets/images/mock_data/banners/inspire/banner_992x496.jpg",
              "xl": "assets/images/mock_data/banners/inspire/banner_1400x580.jpg"
            }
          }
        }
      }, {
        "description": "A carousel",
        "content_block": {
          "content_block_type": "banner_carousel",
          "banner_carousel": [
            {
              "url": "/docs",
              "images": {
                "xs": "assets/images/banners/vff-home_banner-elephant_320x220_mobile.jpg",
                "sm": "assets/images/banners/vff-home_banner-elephant_480x320_mobile.jpg",
                "md": "assets/images/banners/vff-home_banner-elephant_768x600.jpg",
                "lg": "assets/images/banners/vff-home_banner-elephant_992x496.jpg",
                "xl": "assets/images/banners/vff-home_banner-elephant_1400x580.jpg"
              }
            }, {
              "url": "/docs",
              "images": {
                "xs": "assets/images/banners/vff-home_banner-fresh_320x220_mobile.jpg",
                "sm": "assets/images/banners/vff-home_banner-fresh_480x320_mobile.jpg",
                "md": "assets/images/banners/vff-home_banner-fresh_768x600.jpg",
                "lg": "assets/images/banners/vff-home_banner-fresh_992x496.jpg",
                "xl": "assets/images/banners/vff-home_banner-fresh_1400x580.jpg"
              }
            }, {
              "url": "/docs",
              "images": {
                "xs": "assets/images/banners/vff-home_banner-fresh_320x220_mobile.jpg",
                "sm": "assets/images/banners/vff-home_banner-fresh_480x320_mobile.jpg",
                "md": "assets/images/banners/vff-home_banner-fresh_768x600.jpg",
                "lg": "assets/images/banners/vff-home_banner-fresh_992x496.jpg",
                "xl": "assets/images/banners/vff-home_banner-fresh_1400x580.jpg"
              }
            }
          ]
        }
      }
    ];
    return $scope.getCodeBlock = function(obj) {
      return angular.toJson(obj, true);
    };
  }]);

}).call(this);

(function() {
  app.controller("DocsCtrl", ["$scope", function($scope) {}]);

}).call(this);

(function() {
  app.controller("LandingPagesCtrl", ["$scope", "$state", "$stateParams", "dataFactory", "$location", function($scope, $state, $stateParams, dataFactory,$location) {
    //console.log('$stateParams.page',$stateParams.page);
    //console.log('$location.absUrl()', $location.absUrl());
    
    if (!$stateParams.page) {
      $stateParams.page = 'home';
    }
    $stateParams.page
    dataFactory.getData('/lp/' + $stateParams.page)
    .success(function(data) {
      $scope.contentBlocks = data.content_blocks;
        console.log(data.content_blocks);
      //$scope.contentBlockString = angular.toJson($scope.contentBlocks, true);
      $scope.contentBlockString = $scope.contentBlocks;
      return $scope.$watch('contentBlockString', function(val) {
      var content, error;
      $scope.valid = true;
      content = {};
      try {
        content = angular.fromJson(val);
      } catch (_error) {
        error = _error;
        $scope.valid = false;
      }
      if ($scope.valid) {
        return $scope.contentBlocks = content;
      }
    });
    })
    .error(function (error) {
      //console.log('Unable to load menu data: ' + error.message);
      //$scope.status = 'Unable to load customer data: ' + error.message;
    });
    
}]);

}).call(this);


(function() {
  app.controller("DemoCtrl", ["$scope", "$state", "$stateParams", function($scope, $state, $stateParams) {
    $scope.contentBlocks = [
    {
      content_block_type: 'title_bar',
      title_bar: {
        image_url: 'http://c67bfc7c934596c5d2de-384a0fe271c727cec0e8a9b32788243a.r54.cf1.rackcdn.com/Title_Bars/54f1_sustainability-title_bar.jpg',
        headline:  $stateParams.page /*'Sustainability'*/,
        body:'This luxurious textured fabric is naturally elegant in earth tone colors, while saturated and sophisticated in the vibrant tones.'
      }
    },{
        content_block_type: 'standard_block',
        color: 'black',
        alignment: 'center',
        standard_block: {
          body: "Valley Forge Fabrics is the world’s leading supplier of decorative interior textiles for the Hospitality industry. As a part of our sustainability mission, Valley Forge is dedicated to living and working together harmoniously with our environment. Valley Forge uses its influence and size in the textile manufacturing industry to further the use of recycled fiber, fiber made from Eucalyptus and recyclable textiles. We have made preservation of our planet and its resources a priority since 2002 by including recycled product in our standard product line that is marketed around the world. Today that commitment has grown exponentially and FRESH® Fabrics now account for more than 50% of Valley Forge’s running line collections.",
        }
      },{
        content_block_type: 'tabs',
        style:'transparent-black',
        tabs: [
          {
            label: 'FRESH',
            url: 'fresh',
            tabContentBlocks: [
              {
                content_block_type: 'standard_block',
                color: 'black',
                alignment: 'center',
                standard_block: {
                  headline: 'FRESH',
                  body:'This luxurious textured fabric is naturally elegant in earth tone colors, while saturated and sophisticated in the vibrant tones.',
                  button: {
                    label:'Browse Our Collections',
                    url:'/fabric-collections',
                    style:'transparent-black'
                  }
                }
              }
            ]
          }, {
            label: 'Carbon Off-Setting',
            url: 'carbon-off-setting',
            tabContentBlocks: [
              {
                content_block_type: 'standard_block',
                color: 'black',
                alignment: 'center',
                standard_block: {
                  headline: 'Carbon Off-Setting'
                }
              },
              {
                content_block_type: 'banner_carousel',
                banner_carousel: [
                  {
                    url: '/search',
                    images: {
                      "xs": "assets/images/banner/vff-home_banner-elephant_320x220_mobile.jpg",
                      "sm": "assets/images/banner/vff-home_banner-elephant_480x320_mobile.jpg",
                      "md": "assets/images/banner/vff-home_banner-elephant_768x600.jpg",
                      "lg": "assets/images/banner/vff-home_banner-elephant_992x496.jpg",
                      "xl": "assets/images/banner/vff-home_banner-elephant_1400x580.jpg"
                    }
                  }, {
                    url: '/search',
                    images: {
                      "xs": "assets/images/banner/vff-home_banner-fresh_320x220_mobile.jpg",
                      "sm": "assets/images/banner/vff-home_banner-fresh_480x320_mobile.jpg",
                      "md": "assets/images/banner/vff-home_banner-fresh_768x600.jpg",
                      "lg": "assets/images/banner/vff-home_banner-fresh_992x496.jpg",
                      "xl": "assets/images/banner/vff-home_banner-fresh_1400x580.jpg"
                    }
                  }, {
                    url: '/search',
                    images: {
                      "xs": "assets/images/banner/vff-home_banner-dance_320x220_mobile.jpg",
                      "sm": "assets/images/banner/vff-home_banner-dance_480x320_mobile.jpg",
                      "md": "assets/images/banner/vff-home_banner-dance_768x600.jpg",
                      "lg": "assets/images/banner/vff-home_banner-dance_992x496.jpg",
                      "xl": "assets/images/banner/vff-home_banner-dance_1400x580.jpg"
                    }
                  }
                ]
              }
            ]
          }, {
            label: 'Preposition 65',
            url: 'preposition-65',
            tabContentBlocks: [
              {
                content_block_type: 'standard_block',
                color: 'black',
                alignment: 'center',
                standard_block: {
                  headline: 'Preposition 65'
                }
              }
            ]
          }, {
            label: 'Our Commitment',
            url: 'our-commitment',
            tabContentBlocks: [
              {
                content_block_type: 'standard_block',
                color: 'black',
                alignment: 'center',
                standard_block: {
                  headline: 'Our Commitment'
                }
              }
            ]
          }
        ]
    },{
        content_block_type: 'banner_carousel',
        banner_carousel: [
          {
            url: '/search',
            images: {
              "xs": "assets/images/banner/vff-home_banner-elephant_320x220_mobile.jpg",
              "sm": "assets/images/banner/vff-home_banner-elephant_480x320_mobile.jpg",
              "md": "assets/images/banner/vff-home_banner-elephant_768x600.jpg",
              "lg": "assets/images/banner/vff-home_banner-elephant_992x496.jpg",
              "xl": "assets/images/banner/vff-home_banner-elephant_1400x580.jpg"
            }
          }, {
            url: '/search',
            images: {
              "xs": "assets/images/banner/vff-home_banner-fresh_320x220_mobile.jpg",
              "sm": "assets/images/banner/vff-home_banner-fresh_480x320_mobile.jpg",
              "md": "assets/images/banner/vff-home_banner-fresh_768x600.jpg",
              "lg": "assets/images/banner/vff-home_banner-fresh_992x496.jpg",
              "xl": "assets/images/banner/vff-home_banner-fresh_1400x580.jpg"
            }
          }, {
            url: '/search',
            images: {
              "xs": "assets/images/banner/vff-home_banner-dance_320x220_mobile.jpg",
              "sm": "assets/images/banner/vff-home_banner-dance_480x320_mobile.jpg",
              "md": "assets/images/banner/vff-home_banner-dance_768x600.jpg",
              "lg": "assets/images/banner/vff-home_banner-dance_992x496.jpg",
              "xl": "assets/images/banner/vff-home_banner-dance_1400x580.jpg"
            }
          }
        ]
      },{
        content_block_type: 'standard_block',
        color: 'black',
        alignment: 'center',
        standard_block: {
          headline: "Create",
          body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean maximus, arcu ac varius egestas, urna elit dignissim ipsum, tincidunt condimentum sapien neque eget risus. Proin semper dictum lorem, id consequat est volutpat quis. Phasellus ut commodo diam, quis ornare massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.",
        }
      }, {
        content_block_type: 'fluid_grid',
        fluid_grid: [
          {
            'url': '/boards/25',
            'image_url': 'assets/images/home/home_page-grid-1-Talio.jpg',
            'columns': '6',
            'size':'full',
            'headline': 'Telaio',
            'body':'This luxurious textured fabric is naturally elegant in earth tone colors, while saturated and sophisticated in the vibrant tones.',
            'button': {
                'label':'Browse Our Collections',
                'url':'/fabric-collections',
                'style':'transparent-black'
              }
          }, {
            'url': '/search',
            'image_url': 'assets/images/home/home_page-grid-2-Shibori.jpg',
            'columns': '3',
            'size':'half',
            'headline': 'Shibori',
            'body':'Inspired by the ancient Japanese dyeing technique known by the same name',
            'button': {
                'label':'Browse Our Printed Collections',
                'url':'/custom-print',
                'style':'transparent-black'
              }
          }, {
            'url': '/how-it-works',
            'image_url': 'assets/images/home/home_page-grid-3.jpg',
            'columns': '3',
            'size':'half'
          }, {
            'url': '/how-it-works',
            'image_url': 'assets/images/home/home_page-grid-4.jpg',
            'columns': '6',
            'size':'half'
          }, {
            'url': '/how-it-works',
            'image_url': 'assets/images/home/home_page-grid-5.jpg',
            'columns': '6',
            'size':'half'
          }, {
            'url': '/how-it-works',
            'image_url': 'assets/images/home/home_page-grid-6.jpg',
            'columns': '3',
            'size':'half'
          }, {
            'url': '/how-it-works',
            'image_url': 'assets/images/home/home_page-grid-7.jpg',
            'columns': '3',
            'size':'half'
          }
        ]
      }, {
        content_block_type: 'standard_block',
        color: 'black',
        alignment: 'center',
        standard_block: {
          headline: "Sustainability",
          body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean maximus, arcu ac varius egestas, urna elit dignissim ipsum, tincidunt condimentum sapien neque eget risus. Proin semper dictum lorem, id consequat est volutpat quis. Phasellus ut commodo diam, quis ornare massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.",
        }
      }, {
        content_block_type: 'standard_block',
        alignment: 'center',
        standard_block: {
          headline: "Innovation",
          body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean maximus, arcu ac varius egestas, urna elit dignissim ipsum, tincidunt condimentum sapien neque eget risus. Proin semper dictum lorem, id consequat est volutpat quis. Phasellus ut commodo diam, quis ornare massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.",
        }
      }
    ];
    
    $scope.contentBlockString = angular.toJson($scope.contentBlocks, true);
    return $scope.$watch('contentBlockString', function(val) {
      var content, error;
      $scope.valid = true;
      content = {};
      try {
        content = angular.fromJson(val);
      } catch (_error) {
        error = _error;
        $scope.valid = false;
      }
      if ($scope.valid) {
        return $scope.contentBlocks = content;
      }
    });
  }]);
}).call(this);

(function() {
  app.controller("TimeLineCtrl", ["$scope", function($scope) {
  $scope.contentBlocks = [
    /*{
      content_block_type: 'timeline',
      data : {
        "timeline":
          {
            "headline":"The Main Timeline Headline Goes here",
            "type":"default",
            "text":"<p>Intro body text goes here, some HTML is ok</p>",
            "asset": {
              "media":"http://ab013ce2b92f3615388f-0f0b7efcd53c2ad1596a59274778cd30.r80.cf1.rackcdn.com/icon-facebook.png",
              "credit":"Credit Name Goes Here",
              "caption":"Caption text goes here"
            },
            "date": [
              {
                "startDate":"2011,12,10",
                "endDate":"2011,12,11",
                "headline":"Headline Goes Here",
                "text":"<p>Body text goes here, some HTML is OK</p>",
                "tag":"This is Optional",
                "classname":"optionaluniqueclassnamecanbeaddedhere",
                "asset": {
                  "media":"http://twitter.com/ArjunaSoriano/status/164181156147900416",
                  "thumbnail":"https://pbs.twimg.com/profile_images/471082633531650048/tHZdWKdw_400x400.jpeg",
                  "credit":"Credit Name Goes Here",
                  "caption":"Caption text goes here"
                }
              }
            ],
            "era": [
              {
                "startDate":"2011,12,10",
                "endDate":"2011,12,11",
                "headline":"Headline Goes Here",
                "text":"<p>Body text goes here, some HTML is OK</p>",
                "tag":"This is Optional"
              }
        
            ]
          }
      }
    }
  */];
}]);
}).call(this);


(function() {
  app.controller('productDetailCtrl', ['$scope', '$rootScope', '$filter', '$http','dataFactory','$stateParams','$timeout', function($scope, $rootScope, $filter, $http, dataFactory, $stateParams, $timeout, $modal) {

    $scope.productDetail = {};
    dataFactory.getData('/product-detail/'+ $stateParams.id)
    .success(function(data) {
      console.log(data);
      $scope.productDetail = data;
      //$scope.setCollectionsOrder('', false);
    });

  }]);
}).call(this);


(function() {
  app.controller('MediaAdsCtrl', ['$scope', '$rootScope', '$filter', '$http','dataFactory','$stateParams','$timeout', function($scope, $rootScope, $filter, $http, dataFactory, $stateParams, $timeout, $modal) {

    $scope.Ads = {};
    dataFactory.getData('/media_advertising')
    .success(function(data) {
      console.log(data);
      $scope.Ads = data;
      //$scope.setCollectionsOrder('', false);
    });

  }]);
}).call(this);

(function() {
  app.controller('MediaAwardsRecognitionCtrl', ['$scope', '$rootScope', '$filter', '$http','dataFactory','$stateParams','$timeout', function($scope, $rootScope, $filter, $http, dataFactory, $stateParams, $timeout, $modal) {

    $scope.Awards = {};
    dataFactory.getData('/media_awards')
    .success(function(data) {
      console.log(data);
      $scope.Awards = data;
      //$scope.setCollectionsOrder('', false);
    });

  }]);
}).call(this);

(function() {
  app.controller('MediaVideosCtrl', ['$scope', '$rootScope', '$filter', '$http','dataFactory','$stateParams','$timeout', function($scope, $rootScope, $filter, $http, dataFactory, $stateParams, $timeout, $modal) {

    $scope.Videos = {};
    dataFactory.getData('/media_videos')
    .success(function(data) {
      console.log(data);
      $scope.Videos = data;
      //$scope.setCollectionsOrder('', false);
    });

  }]);
}).call(this);

(function() {
  app.controller('contactUsCtrl', ['$scope', '$rootScope', '$filter', '$http','dataFactory','$stateParams','$timeout', function($scope, $rootScope, $filter, $http, dataFactory, $stateParams, $timeout, $modal) {

    $scope.videos = {};
    dataFactory.getData('/media_videos')
    .success(function(data) {
      console.log(data);
      $scope.Videos = data;
      //$scope.setCollectionsOrder('', false);
    });

  }]);
}).call(this);


(function() {
  app.controller('ProfessionalityCtrl', function($scope, $document){
    $scope.toTheTop = function() {
      $document.scrollTopAnimated(0, 5000).then(function() {
        console && console.log('You just scrolled to the top!');
      });
    }
    var section2 = angular.element(document.getElementById('section-2'));
    $scope.toSection2 = function() {
      $document.scrollToElementAnimated(section2);
    }
  }
).value('duScrollOffset', 30);

}).call(this);

(function() {
  app.controller('DesignLibraryCtrl', ['$scope', '$rootScope', '$filter', '$http','dataFactory','$stateParams','$timeout', '$window', function($scope, $rootScope, $filter, $http, dataFactory, $stateParams, $timeout, $modal, $window) {
  //console.log('Current Controller = DesignLibraryCtrl');

  window.location.href="http://www.valleyforge.com/library";
  
  var design_library_url = '/design-library';
  var book = '';
  var orderBy = $filter('orderBy');
  
  $scope.currentPage = 1;
  $scope.samples = {};
  $scope.totalDisplayed = 36;
  $scope.reverse = 'false';
  $scope.predicate = '';
  $rootScope.previousSample = null;
  $scope.currentPredicate = '';
  $scope.filters = {'uses' : [], 'types' : [], 'styles' : [], 'colors' : [], 'contents' : [], 'inventory' : []}
  
  $scope.filter = {'use' : '', 'type' : '', 'style' : '', 'color' : '', 'content' : '', 'inventory' : 0}
  $scope.tags = [];
  
  $scope.updateTags = function(tag) {
   var tagIndex;
   console.log('tag',tag);
   console.log('length of tags before push', $scope.tags.length);
   
   if ($scope.tags.length == undefined){tagIndex = 0}else{tagIndex = $scope.tags.length}
   console.log('index',tagIndex);
   $scope.tags.push = ("tag");
   $scope.apply;
   console.log('length of tags after push',$scope.tags.length);
   
   // use $scope.selectedItem.code and $scope.selectedItem.name here
   // for other stuff ...
  };
  
  $scope.multiple = {'uses' : [], 'types' : [], 'styles' : [], 'colors' : [], 'contents' : [], 'inventory' : []};
  
  // Slider options with event handlers
			$scope.slider = {
				'options': {
					start: function (event, ui) { $log.info('Event: Slider start - set with slider options', event); },
    				stop: function (event, ui) { $log.info('Event: Slider stop - set with slider options', event); }
				}
			}
    
			$scope.demoVals = {
        sliderExample1:     1,
				sliderExample3:     14,
				sliderExample4:     14,
				sliderExample5:     50,
				sliderExample8:     0.34,
				sliderExample9:     [-0.52, 0.54],
				sliderExample10:     -0.37
			};
      
  /*$scope.multiple.uses = [];
  $scope.multiple.types = [];
  $scope.multiple.styles = [];
  $scope.multiple.colors = [];
  $scope.multiple.contents = [];*/
  /*$scope.filter.type = '';
  $scope.filter.style = '';
  $scope.filter.color = '';
  $scope.filter.content = '';
  $scope.filter.inventorty = '';*/
  
  //$scope.reversed = 'false';
  /*$scope.sort = function(p) {

    if ($scope.reversed == 'true') {
      $scope.reverse = 'false';
      $scope.reversed = 'false';
    } else {
      $scope.reverse = 'true';
      $scope.reversed = 'true'
    }

    if ($scope.predicate === p) {
      console.log('predicate == ' + p);
      $scope.setOrder(p,$scope.reverse);
    } else {
      $scope.predicate = p;  
      console.log('predicate != ' + p);
      $scope.setOrder(p,$scope.reverse);
    }
 };*/
 
 
  if($stateParams.book) {
    book = $stateParams.book;
    design_library_url += '/'+ book;
  }
  if($stateParams.page) {
    book = $stateParams.page;
    design_library_url += '/'+ $stateParams.page;
  }
  //console.log(design_library_url); 
  
  $scope.order = 'false';
  
  $scope.$watch('search', function () {
		//$scope.setOrder();
    //console.log('current search is ' + $scope.search);
    $scope.getSamples($scope.search,'false');
	});  
  /*$scope.$watch('predicate', function () {
		//$scope.setOrder();
    console.log('current predicate is ' + $scope.predicate + ' [reverse = ' + $scope.reverse + ']');
    //$scope.setOrder();
    
	});*/
  
  $scope.setOrder = function(p){
    console.log('p = ' + p);
    if (p.length > 1) {
      $scope.predicate = p;
    }
    /*if ($scope.reverse == true) {
      
      $scope.reverse = false;
    } else {
      $scope.reverse = true;
    }*/

    if ($scope.currentPredicate.indexOf("-") > -1) {
      var pval = $scope.currentPredicate.split("-");
      //console.log('reverse is off for ' + pval[1]);
      $scope.currentPredicate = pval[1];
      
      //$scope.setOrder(p,$scope.reverse);
    } else {
      //console.log('reverse is on for ' + $scope.currentPredicate);
      $scope.currentPredicate = String.fromCharCode(45) + $scope.predicate;
      
    }
    
    $scope.predicate = $scope.currentPredicate;
    
    //console.log('currentPredicate = ' + $scope.currentPredicate);
    //console.log('predicate = ' + $scope.predicate);
    //console.log('sort ' + predicate + ' reverse is ' + $scope.reverse);
    $scope.samples = orderBy($scope.samples, $scope.predicate, true);
    //console.log($scope.samples);
    var i;
    for (i = 0; i < $scope.samples.length; i++) {
      $scope.samples[i].order = i;
    }
    //console.log('order function triggered for '+predicate+'.');
    //calcGridPosition();
    
  };
  
  
  function inArray(a, value) {
		for (var i = 0; i < a.length; i++) {
			if (a[i] === value) {
				return true;
			}
		}
		return false;
	}
  
  
  function calcGridPosition() {
    //$scope.samples = orderBy($scope.samples, $scope.predicate, $scope.reverse);
    for (var i = 0; i < $scope.samples.length; i++) {
      
      var sample = $scope.samples[i];
      console.log('hashKey['+sample.$$hashKey+'] / Order['+sample.order+']');
      
      // columns, left-to-right, top-to-bottom
      var columns = 5;
      sample.column = sample.order%columns;
      sample.row = Math.floor(sample.order/columns);
      
      // rows, top-to-bottom, left-to-right
      // var rows = 3;
      // item.column = Math.floor(item.order/rows);
      // item.row = item.order%rows;
    }
  }
  
  $scope.showPreview = function(i){
    //console.log('preview invoked for ' + i);
    var previewPosition = ((Math.round(i/3)+1)*3)+1;
    //console.log('we will insert the preview at position ' + previewPosition);
    //$scope.collections.splice(previewPosition,0,)
  };
  
  
  $scope.getSamples = function(query, loadMore){
    //console.log('searching for ' + query);
  var sample_url = design_library_url
    if(query){
       sample_url = design_library_url + '/'+ query;
    }
    //console.log(sample_url);
    if(loadMore == 'true'){
      $scope.currentPage++;
    }

    dataFactory.getData(sample_url+'/?page='+$scope.currentPage)
    .success(function(data) {
      //console.log('loadMore == ' + loadMore);
      if(loadMore == 'false'){
        $scope.samples = data;
        console.log(data);
      }
      if(loadMore == 'true'){
        $scope.totalDisplayed += 36;
        $scope.currentPage++;
        //console.log('currentPage = [' + $scope.currentPage + ']');
        for (var i = 0; i <= data.length -1; i++) {
          $scope.samples.push(data[i]);
          //console.log(data[i]);
        }
      }
      for (var f = 0; f <= $scope.samples.length -1; f++) {
        for (var u = 0; u <= 4; u++) {
          $scope.filter.name = $scope.samples[f].name;
          //console.log($scope.filter);
          if ($scope.filters.uses.indexOf($scope.samples[f].use[u]) == -1) {
            $scope.filters.uses.push($scope.samples[f].use[u]);
          }
          if ($scope.filters.types.indexOf($scope.samples[f].type[u]) == -1) {
            $scope.filters.types.push($scope.samples[f].type[u]);
          }
          if ($scope.filters.styles.indexOf($scope.samples[f].style[u]) == -1) {
            $scope.filters.styles.push($scope.samples[f].style[u]);
          }
          if ($scope.filters.colors.indexOf($scope.samples[f].color[u]) == -1) {
            $scope.filters.colors.push($scope.samples[f].color[u]);
          }
          if ($scope.filters.contents.indexOf($scope.samples[f].content[u]) == -1) {
            $scope.filters.contents.push($scope.samples[f].content[u]);
          }
       }
          //console.log(data[i]);
      }
      //console.log(data);
      //console.log($scope);
      //console.log("data.length = " + data.length);
      $scope.setOrder($scope.currentPredicate);
      angular.element('dl-grid li').addClass('close').removeClass('expand');
    })
    .error(function (error) {
      //console.log('Unable to load Design Library Sample data: ' + error.message);
      //$scope.status = 'Unable to load customer data: ' + error.message;
    });
  };
  
  
  this.totalDisplayed = $scope.totalDisplayed;
  
  $scope.apiSearch = function() {

        // Determine what service to use. Could look at the current url. Could set value on scope
        // every time a controller is hit to know what your current controller is. If you need
        // help with this part let me know.

        var service = designLibraryService.samples, eventName = 'design-library';
        if ($scope.currentController === 'DesignLibraryCtrl') {
            service = designLibraryService.samples;
            eventName = 'post';
        }

        // Make call to service, service is either PostService or VideoService, based on your logic above.
        // This is pseudo, i dont know what your call needs to look like.
        service.async({query: $scope.search.color}, function(resp) {

            // this is the callback you need to $broadcast the data to the child controllers
           $scope.$broadcast(eventName, resp);
        });
    };

  $scope.getFilterOption = function(){
    
  };
  
  //$scope.getSamples('','false');
  
  $scope.modalShown = false;
  $scope.toggleModal = function() {
    $scope.modalShown = !$scope.modalShown;
  };
  
}]);
}).call(this);

(function() {
  app.controller('CollectionsCtrl', function($scope, $filter, $location, $routeParams, dataFactory) {
    $scope.collections = {};
    
    var orderBy = $filter('orderBy');
    
    $scope.order = 'false';
    
    $scope.$watch('order', function () {
      $scope.setCollectionsOrder();
    });
    
    $scope.setCollectionsOrder = function(predicate, reverse){
      console.log('sort ' + predicate + ' reverse is ' + reverse);
      $scope.collections = orderBy($scope.collections, predicate, reverse);
      var i;
      
      if ($scope.order === 'random') {
          var t = [];
        for (i = 0; i < $scope.collections.length; i++) {
          var r = Math.floor(Math.random() * $scope.collections.length);
          while (inArray(t,r)) {
            r = Math.floor(Math.random() * $scope.collections.length);
          }
          t.push(r);
          $scope.collections[i].order = r;
        }
        } 
        else if ($scope.order === 'false') {
          for (i = 0; i < $scope.collections.length; i++) {
              $scope.collections[i].order = i;
            }
        }
        else {
          for (i = 0; i < $scope.collections.length; i++) {
              $scope.collections[i].order = ($scope.collections.length - 1 - i);
            }
        }
      console.log('order function triggered for '+predicate+'.');
      
      calcGridPosition();
    };
    
    
    function inArray(a, value) {
      for (var i = 0; i < a.length; i++) {
        if (a[i] === value) {
          return true;
        }
      }
      return false;
    }
    
    function calcGridPosition() {
      for (var i = 0; i < $scope.collections.length; i++) {
        var item = $scope.collections[i];
        
        // columns, left-to-right, top-to-bottom
        var columns = 5;
        item.column = item.order%columns;
        item.row = Math.floor(item.order/columns);
        
        // rows, top-to-bottom, left-to-right
        // var rows = 3;
        // item.column = Math.floor(item.order/rows);
        // item.row = item.order%rows;
      }
    }
    
    
    $scope.collections;
    dataFactory.getData('/channel/collections/')
    .success(function(collection_data) {
      console.log(collection_data);
      $scope.collections = collection_data;
      $scope.setCollectionsOrder('', false);
    });
    
    $scope.preview = function(i){
      console.log('preview invoked for ' + i);
      var previewPosition = ((Math.round(i/3)+1)*3)+1;
      console.log('we will insert the preview at position ' + previewPosition);
      //$scope.collections.splice(previewPosition,0,)
    };
  
  }); 
}).call(this);

!function(a,b,c,d){function e(b,c){this.settings=null,this.options=a.extend({},e.Defaults,c),this.$element=a(b),this.drag=a.extend({},m),this.state=a.extend({},n),this.e=a.extend({},o),this._plugins={},this._supress={},this._current=null,this._speed=null,this._coordinates=[],this._breakpoint=null,this._width=null,this._items=[],this._clones=[],this._mergers=[],this._invalidated={},this._pipe=[],a.each(e.Plugins,a.proxy(function(a,b){this._plugins[a[0].toLowerCase()+a.slice(1)]=new b(this)},this)),a.each(e.Pipe,a.proxy(function(b,c){this._pipe.push({filter:c.filter,run:a.proxy(c.run,this)})},this)),this.setup(),this.initialize()}function f(a){if(a.touches!==d)return{x:a.touches[0].pageX,y:a.touches[0].pageY};if(a.touches===d){if(a.pageX!==d)return{x:a.pageX,y:a.pageY};if(a.pageX===d)return{x:a.clientX,y:a.clientY}}}function g(a){var b,d,e=c.createElement("div"),f=a;for(b in f)if(d=f[b],"undefined"!=typeof e.style[d])return e=null,[d,b];return[!1]}function h(){return g(["transition","WebkitTransition","MozTransition","OTransition"])[1]}function i(){return g(["transform","WebkitTransform","MozTransform","OTransform","msTransform"])[0]}function j(){return g(["perspective","webkitPerspective","MozPerspective","OPerspective","MsPerspective"])[0]}function k(){return"ontouchstart"in b||!!navigator.msMaxTouchPoints}function l(){return b.navigator.msPointerEnabled}var m,n,o;m={start:0,startX:0,startY:0,current:0,currentX:0,currentY:0,offsetX:0,offsetY:0,distance:null,startTime:0,endTime:0,updatedX:0,targetEl:null},n={isTouch:!1,isScrolling:!1,isSwiping:!1,direction:!1,inMotion:!1},o={_onDragStart:null,_onDragMove:null,_onDragEnd:null,_transitionEnd:null,_resizer:null,_responsiveCall:null,_goToLoop:null,_checkVisibile:null},e.Defaults={items:3,/*loop:!1*/loop:1,center:!1,mouseDrag:!0,touchDrag:!0,pullDrag:!0,freeDrag:!1,margin:0,stagePadding:0,merge:!1,mergeFit:!0,autoWidth:!1,startPosition:0,rtl:!1,smartSpeed:250,fluidSpeed:!1,dragEndSpeed:!1,responsive:{},responsiveRefreshRate:200,responsiveBaseElement:b,responsiveClass:!1,fallbackEasing:"swing",info:!1,nestedItemSelector:!1,itemElement:"div",stageElement:"div",themeClass:"owl-theme",baseClass:"owl-carousel",itemClass:"owl-item",centerClass:"center",activeClass:"active"},e.Width={Default:"default",Inner:"inner",Outer:"outer"},e.Plugins={},e.Pipe=[{filter:["width","items","settings"],run:function(a){a.current=this._items&&this._items[this.relative(this._current)]}},{filter:["items","settings"],run:function(){var a=this._clones,b=this.$stage.children(".cloned");(b.length!==a.length||!this.settings.loop&&a.length>0)&&(this.$stage.children(".cloned").remove(),this._clones=[])}},{filter:["items","settings"],run:function(){var a,b,c=this._clones,d=this._items,e=this.settings.loop?c.length-Math.max(2*this.settings.items,4):0;for(a=0,b=Math.abs(e/2);b>a;a++)e>0?(this.$stage.children().eq(d.length+c.length-1).remove(),c.pop(),this.$stage.children().eq(0).remove(),c.pop()):(c.push(c.length/2),this.$stage.append(d[c[c.length-1]].clone().addClass("cloned")),c.push(d.length-1-(c.length-1)/2),this.$stage.prepend(d[c[c.length-1]].clone().addClass("cloned")))}},{filter:["width","items","settings"],run:function(){var a,b,c,d=this.settings.rtl?1:-1,e=(this.width()/this.settings.items).toFixed(3),f=0;for(this._coordinates=[],b=0,c=this._clones.length+this._items.length;c>b;b++)a=this._mergers[this.relative(b)],a=this.settings.mergeFit&&Math.min(a,this.settings.items)||a,f+=(this.settings.autoWidth?this._items[this.relative(b)].width()+this.settings.margin:e*a)*d,this._coordinates.push(f)}},{filter:["width","items","settings"],run:function(){var b,c,d=(this.width()/this.settings.items).toFixed(3),e={width:Math.abs(this._coordinates[this._coordinates.length-1])+2*this.settings.stagePadding,"padding-left":this.settings.stagePadding||"","padding-right":this.settings.stagePadding||""};if(this.$stage.css(e),e={width:this.settings.autoWidth?"auto":d-this.settings.margin},e[this.settings.rtl?"margin-left":"margin-right"]=this.settings.margin,!this.settings.autoWidth&&a.grep(this._mergers,function(a){return a>1}).length>0)for(b=0,c=this._coordinates.length;c>b;b++)e.width=Math.abs(this._coordinates[b])-Math.abs(this._coordinates[b-1]||0)-this.settings.margin,this.$stage.children().eq(b).css(e);else this.$stage.children().css(e)}},{filter:["width","items","settings"],run:function(a){a.current&&this.reset(this.$stage.children().index(a.current))}},{filter:["position"],run:function(){this.animate(this.coordinates(this._current))}},{filter:["width","position","items","settings"],run:function(){var a,b,c,d,e=this.settings.rtl?1:-1,f=2*this.settings.stagePadding,g=this.coordinates(this.current())+f,h=g+this.width()*e,i=[];for(c=0,d=this._coordinates.length;d>c;c++)a=this._coordinates[c-1]||0,b=Math.abs(this._coordinates[c])+f*e,(this.op(a,"<=",g)&&this.op(a,">",h)||this.op(b,"<",g)&&this.op(b,">",h))&&i.push(c);this.$stage.children("."+this.settings.activeClass).removeClass(this.settings.activeClass),this.$stage.children(":eq("+i.join("), :eq(")+")").addClass(this.settings.activeClass),this.settings.center&&(this.$stage.children("."+this.settings.centerClass).removeClass(this.settings.centerClass),this.$stage.children().eq(this.current()).addClass(this.settings.centerClass))}}],e.prototype.initialize=function(){if(this.trigger("initialize"),this.$element.addClass(this.settings.baseClass).addClass(this.settings.themeClass).toggleClass("owl-rtl",this.settings.rtl),this.browserSupport(),this.settings.autoWidth&&this.state.imagesLoaded!==!0){var b,c,e;if(b=this.$element.find("img"),c=this.settings.nestedItemSelector?"."+this.settings.nestedItemSelector:d,e=this.$element.children(c).width(),b.length&&0>=e)return this.preloadAutoWidthImages(b),!1}this.$element.addClass("owl-loading"),this.$stage=a("<"+this.settings.stageElement+' class="owl-stage"/>').wrap('<div class="owl-stage-outer">'),this.$element.append(this.$stage.parent()),this.replace(this.$element.children().not(this.$stage.parent())),this._width=this.$element.width(),this.refresh(),this.$element.removeClass("owl-loading").addClass("owl-loaded"),this.eventsCall(),this.internalEvents(),this.addTriggerableEvents(),this.trigger("initialized")},e.prototype.setup=function(){var b=this.viewport(),c=this.options.responsive,d=-1,e=null;c?(a.each(c,function(a){b>=a&&a>d&&(d=Number(a))}),e=a.extend({},this.options,c[d]),delete e.responsive,e.responsiveClass&&this.$element.attr("class",function(a,b){return b.replace(/\b owl-responsive-\S+/g,"")}).addClass("owl-responsive-"+d)):e=a.extend({},this.options),(null===this.settings||this._breakpoint!==d)&&(this.trigger("change",{property:{name:"settings",value:e}}),this._breakpoint=d,this.settings=e,this.invalidate("settings"),this.trigger("changed",{property:{name:"settings",value:this.settings}}))},e.prototype.optionsLogic=function(){this.$element.toggleClass("owl-center",this.settings.center),this.settings.loop&&this._items.length<this.settings.items&&(/*this.settings.loop=!1*/this.settings.loop=1),this.settings.autoWidth&&(this.settings.stagePadding=!1,this.settings.merge=!1)},e.prototype.prepare=function(b){var c=this.trigger("prepare",{content:b});return c.data||(c.data=a("<"+this.settings.itemElement+"/>").addClass(this.settings.itemClass).append(b)),this.trigger("prepared",{content:c.data}),c.data},e.prototype.update=function(){for(var b=0,c=this._pipe.length,d=a.proxy(function(a){return this[a]},this._invalidated),e={};c>b;)(this._invalidated.all||a.grep(this._pipe[b].filter,d).length>0)&&this._pipe[b].run(e),b++;this._invalidated={}},e.prototype.width=function(a){switch(a=a||e.Width.Default){case e.Width.Inner:case e.Width.Outer:return this._width;default:return this._width-2*this.settings.stagePadding+this.settings.margin}},e.prototype.refresh=function(){if(0===this._items.length)return!1;(new Date).getTime();this.trigger("refresh"),this.setup(),this.optionsLogic(),this.$stage.addClass("owl-refresh"),this.update(),this.$stage.removeClass("owl-refresh"),this.state.orientation=b.orientation,this.watchVisibility(),this.trigger("refreshed")},e.prototype.eventsCall=function(){this.e._onDragStart=a.proxy(function(a){this.onDragStart(a)},this),this.e._onDragMove=a.proxy(function(a){this.onDragMove(a)},this),this.e._onDragEnd=a.proxy(function(a){this.onDragEnd(a)},this),this.e._onResize=a.proxy(function(a){this.onResize(a)},this),this.e._transitionEnd=a.proxy(function(a){this.transitionEnd(a)},this),this.e._preventClick=a.proxy(function(a){this.preventClick(a)},this)},e.prototype.onThrottledResize=function(){b.clearTimeout(this.resizeTimer),this.resizeTimer=b.setTimeout(this.e._onResize,this.settings.responsiveRefreshRate)},e.prototype.onResize=function(){return this._items.length?this._width===this.$element.width()?!1:this.trigger("resize").isDefaultPrevented()?!1:(this._width=this.$element.width(),this.invalidate("width"),this.refresh(),void this.trigger("resized")):!1},e.prototype.eventsRouter=function(a){var b=a.type;"mousedown"===b||"touchstart"===b?this.onDragStart(a):"mousemove"===b||"touchmove"===b?this.onDragMove(a):"mouseup"===b||"touchend"===b?this.onDragEnd(a):"touchcancel"===b&&this.onDragEnd(a)},e.prototype.internalEvents=function(){var c=(k(),l());this.settings.mouseDrag?(this.$stage.on("mousedown",a.proxy(function(a){this.eventsRouter(a)},this)),this.$stage.on("dragstart",function(){return!1}),this.$stage.get(0).onselectstart=function(){return!1}):this.$element.addClass("owl-text-select-on"),this.settings.touchDrag&&!c&&this.$stage.on("touchstart touchcancel",a.proxy(function(a){this.eventsRouter(a)},this)),this.transitionEndVendor&&this.on(this.$stage.get(0),this.transitionEndVendor,this.e._transitionEnd,!1),this.settings.responsive!==!1&&this.on(b,"resize",a.proxy(this.onThrottledResize,this))},e.prototype.onDragStart=function(d){var e,g,h,i;if(e=d.originalEvent||d||b.event,3===e.which||this.state.isTouch)return!1;if("mousedown"===e.type&&this.$stage.addClass("owl-grab"),this.trigger("drag"),this.drag.startTime=(new Date).getTime(),this.speed(0),this.state.isTouch=!0,this.state.isScrolling=!1,this.state.isSwiping=!1,this.drag.distance=0,g=f(e).x,h=f(e).y,this.drag.offsetX=this.$stage.position().left,this.drag.offsetY=this.$stage.position().top,this.settings.rtl&&(this.drag.offsetX=this.$stage.position().left+this.$stage.width()-this.width()+this.settings.margin),this.state.inMotion&&this.support3d)i=this.getTransformProperty(),this.drag.offsetX=i,this.animate(i),this.state.inMotion=!0;else if(this.state.inMotion&&!this.support3d)return this.state.inMotion=!1,!1;this.drag.startX=g-this.drag.offsetX,this.drag.startY=h-this.drag.offsetY,this.drag.start=g-this.drag.startX,this.drag.targetEl=e.target||e.srcElement,this.drag.updatedX=this.drag.start,("IMG"===this.drag.targetEl.tagName||"A"===this.drag.targetEl.tagName)&&(this.drag.targetEl.draggable=!1),a(c).on("mousemove.owl.dragEvents mouseup.owl.dragEvents touchmove.owl.dragEvents touchend.owl.dragEvents",a.proxy(function(a){this.eventsRouter(a)},this))},e.prototype.onDragMove=function(a){var c,e,g,h,i,j;this.state.isTouch&&(this.state.isScrolling||(c=a.originalEvent||a||b.event,e=f(c).x,g=f(c).y,this.drag.currentX=e-this.drag.startX,this.drag.currentY=g-this.drag.startY,this.drag.distance=this.drag.currentX-this.drag.offsetX,this.drag.distance<0?this.state.direction=this.settings.rtl?"right":"left":this.drag.distance>0&&(this.state.direction=this.settings.rtl?"left":"right"),this.settings.loop?this.op(this.drag.currentX,">",this.coordinates(this.minimum()))&&"right"===this.state.direction?this.drag.currentX-=(this.settings.center&&this.coordinates(0))-this.coordinates(this._items.length):this.op(this.drag.currentX,"<",this.coordinates(this.maximum()))&&"left"===this.state.direction&&(this.drag.currentX+=(this.settings.center&&this.coordinates(0))-this.coordinates(this._items.length)):(h=this.coordinates(this.settings.rtl?this.maximum():this.minimum()),i=this.coordinates(this.settings.rtl?this.minimum():this.maximum()),j=this.settings.pullDrag?this.drag.distance/5:0,this.drag.currentX=Math.max(Math.min(this.drag.currentX,h+j),i+j)),(this.drag.distance>8||this.drag.distance<-8)&&(c.preventDefault!==d?c.preventDefault():c.returnValue=!1,this.state.isSwiping=!0),this.drag.updatedX=this.drag.currentX,(this.drag.currentY>16||this.drag.currentY<-16)&&this.state.isSwiping===!1&&(this.state.isScrolling=!0,this.drag.updatedX=this.drag.start),this.animate(this.drag.updatedX)))},e.prototype.onDragEnd=function(b){var d,e,f;if(this.state.isTouch){if("mouseup"===b.type&&this.$stage.removeClass("owl-grab"),this.trigger("dragged"),this.drag.targetEl.removeAttribute("draggable"),this.state.isTouch=!1,this.state.isScrolling=!1,this.state.isSwiping=!1,0===this.drag.distance&&this.state.inMotion!==!0)return this.state.inMotion=!1,!1;this.drag.endTime=(new Date).getTime(),d=this.drag.endTime-this.drag.startTime,e=Math.abs(this.drag.distance),(e>3||d>300)&&this.removeClick(this.drag.targetEl),f=this.closest(this.drag.updatedX),this.speed(this.settings.dragEndSpeed||this.settings.smartSpeed),this.current(f),this.invalidate("position"),this.update(),this.settings.pullDrag||this.drag.updatedX!==this.coordinates(f)||this.transitionEnd(),this.drag.distance=0,a(c).off(".owl.dragEvents")}},e.prototype.removeClick=function(c){this.drag.targetEl=c,a(c).on("click.preventClick",this.e._preventClick),b.setTimeout(function(){a(c).off("click.preventClick")},300)},e.prototype.preventClick=function(b){b.preventDefault?b.preventDefault():b.returnValue=!1,b.stopPropagation&&b.stopPropagation(),a(b.target).off("click.preventClick")},e.prototype.getTransformProperty=function(){var a,c;return a=b.getComputedStyle(this.$stage.get(0),null).getPropertyValue(this.vendorName+"transform"),a=a.replace(/matrix(3d)?\(|\)/g,"").split(","),c=16===a.length,c!==!0?a[4]:a[12]},e.prototype.closest=function(b){var c=-1,d=30,e=this.width(),f=this.coordinates();return this.settings.freeDrag||a.each(f,a.proxy(function(a,g){return b>g-d&&g+d>b?c=a:this.op(b,"<",g)&&this.op(b,">",f[a+1]||g-e)&&(c="left"===this.state.direction?a+1:a),-1===c},this)),this.settings.loop||(this.op(b,">",f[this.minimum()])?c=b=this.minimum():this.op(b,"<",f[this.maximum()])&&(c=b=this.maximum())),c},e.prototype.animate=function(b){this.trigger("translate"),this.state.inMotion=this.speed()>0,this.support3d?this.$stage.css({transform:"translate3d("+b+"px,0px, 0px)",transition:this.speed()/1e3+"s"}):this.state.isTouch?this.$stage.css({left:b+"px"}):this.$stage.animate({left:b},this.speed()/1e3,this.settings.fallbackEasing,a.proxy(function(){this.state.inMotion&&this.transitionEnd()},this))},e.prototype.current=function(a){if(a===d)return this._current;if(0===this._items.length)return d;if(a=this.normalize(a),this._current!==a){var b=this.trigger("change",{property:{name:"position",value:a}});b.data!==d&&(a=this.normalize(b.data)),this._current=a,this.invalidate("position"),this.trigger("changed",{property:{name:"position",value:this._current}})}return this._current},e.prototype.invalidate=function(a){this._invalidated[a]=!0},e.prototype.reset=function(a){a=this.normalize(a),a!==d&&(this._speed=0,this._current=a,this.suppress(["translate","translated"]),this.animate(this.coordinates(a)),this.release(["translate","translated"]))},e.prototype.normalize=function(b,c){var e=c?this._items.length:this._items.length+this._clones.length;return!a.isNumeric(b)||1>e?d:b=this._clones.length?(b%e+e)%e:Math.max(this.minimum(c),Math.min(this.maximum(c),b))},e.prototype.relative=function(a){return a=this.normalize(a),a-=this._clones.length/2,this.normalize(a,!0)},e.prototype.maximum=function(a){var b,c,d,e=0,f=this.settings;if(a)return this._items.length-1;if(!f.loop&&f.center)b=this._items.length-1;else if(f.loop||f.center)if(f.loop||f.center)b=this._items.length+f.items;else{if(!f.autoWidth&&!f.merge)throw"Can not detect maximum absolute position.";for(revert=f.rtl?1:-1,c=this.$stage.width()-this.$element.width();(d=this.coordinates(e))&&!(d*revert>=c);)b=++e}else b=this._items.length-f.items;return b},e.prototype.minimum=function(a){return a?0:this._clones.length/2},e.prototype.items=function(a){return a===d?this._items.slice():(a=this.normalize(a,!0),this._items[a])},e.prototype.mergers=function(a){return a===d?this._mergers.slice():(a=this.normalize(a,!0),this._mergers[a])},e.prototype.clones=function(b){var c=this._clones.length/2,e=c+this._items.length,f=function(a){return a%2===0?e+a/2:c-(a+1)/2};return b===d?a.map(this._clones,function(a,b){return f(b)}):a.map(this._clones,function(a,c){return a===b?f(c):null})},e.prototype.speed=function(a){return a!==d&&(this._speed=a),this._speed},e.prototype.coordinates=function(b){var c=null;return b===d?a.map(this._coordinates,a.proxy(function(a,b){return this.coordinates(b)},this)):(this.settings.center?(c=this._coordinates[b],c+=(this.width()-c+(this._coordinates[b-1]||0))/2*(this.settings.rtl?-1:1)):c=this._coordinates[b-1]||0,c)},e.prototype.duration=function(a,b,c){return Math.min(Math.max(Math.abs(b-a),1),6)*Math.abs(c||this.settings.smartSpeed)},e.prototype.to=function(c,d){if(this.settings.loop){var e=c-this.relative(this.current()),f=this.current(),g=this.current(),h=this.current()+e,i=0>g-h?!0:!1,j=this._clones.length+this._items.length;h<this.settings.items&&i===!1?(f=g+this._items.length,this.reset(f)):h>=j-this.settings.items&&i===!0&&(f=g-this._items.length,this.reset(f)),b.clearTimeout(this.e._goToLoop),this.e._goToLoop=b.setTimeout(a.proxy(function(){this.speed(this.duration(this.current(),f+e,d)),this.current(f+e),this.update()},this),30)}else this.speed(this.duration(this.current(),c,d)),this.current(c),this.update()},e.prototype.next=function(a){a=a||!1,this.to(this.relative(this.current())+1,a)},e.prototype.prev=function(a){a=a||!1,this.to(this.relative(this.current())-1,a)},e.prototype.transitionEnd=function(a){return a!==d&&(a.stopPropagation(),(a.target||a.srcElement||a.originalTarget)!==this.$stage.get(0))?!1:(this.state.inMotion=!1,void this.trigger("translated"))},e.prototype.viewport=function(){var d;if(this.options.responsiveBaseElement!==b)d=a(this.options.responsiveBaseElement).width();else if(b.innerWidth)d=b.innerWidth;else{if(!c.documentElement||!c.documentElement.clientWidth)throw"Can not detect viewport width.";d=c.documentElement.clientWidth}return d},e.prototype.replace=function(b){this.$stage.empty(),this._items=[],b&&(b=b instanceof jQuery?b:a(b)),this.settings.nestedItemSelector&&(b=b.find("."+this.settings.nestedItemSelector)),b.filter(function(){return 1===this.nodeType}).each(a.proxy(function(a,b){b=this.prepare(b),this.$stage.append(b),this._items.push(b),this._mergers.push(1*b.find("[data-merge]").andSelf("[data-merge]").attr("data-merge")||1)},this)),this.reset(a.isNumeric(this.settings.startPosition)?this.settings.startPosition:0),this.invalidate("items")},e.prototype.add=function(a,b){b=b===d?this._items.length:this.normalize(b,!0),this.trigger("add",{content:a,position:b}),0===this._items.length||b===this._items.length?(this.$stage.append(a),this._items.push(a),this._mergers.push(1*a.find("[data-merge]").andSelf("[data-merge]").attr("data-merge")||1)):(this._items[b].before(a),this._items.splice(b,0,a),this._mergers.splice(b,0,1*a.find("[data-merge]").andSelf("[data-merge]").attr("data-merge")||1)),this.invalidate("items"),this.trigger("added",{content:a,position:b})},e.prototype.remove=function(a){a=this.normalize(a,!0),a!==d&&(this.trigger("remove",{content:this._items[a],position:a}),this._items[a].remove(),this._items.splice(a,1),this._mergers.splice(a,1),this.invalidate("items"),this.trigger("removed",{content:null,position:a}))},e.prototype.addTriggerableEvents=function(){var b=a.proxy(function(b,c){return a.proxy(function(a){a.relatedTarget!==this&&(this.suppress([c]),b.apply(this,[].slice.call(arguments,1)),this.release([c]))},this)},this);a.each({next:this.next,prev:this.prev,to:this.to,destroy:this.destroy,refresh:this.refresh,replace:this.replace,add:this.add,remove:this.remove},a.proxy(function(a,c){this.$element.on(a+".owl.carousel",b(c,a+".owl.carousel"))},this))},e.prototype.watchVisibility=function(){function c(a){return a.offsetWidth>0&&a.offsetHeight>0}function d(){c(this.$element.get(0))&&(this.$element.removeClass("owl-hidden"),this.refresh(),b.clearInterval(this.e._checkVisibile))}c(this.$element.get(0))||(this.$element.addClass("owl-hidden"),b.clearInterval(this.e._checkVisibile),this.e._checkVisibile=b.setInterval(a.proxy(d,this),500))},e.prototype.preloadAutoWidthImages=function(b){var c,d,e,f;c=0,d=this,b.each(function(g,h){e=a(h),f=new Image,f.onload=function(){c++,e.attr("src",f.src),e.css("opacity",1),c>=b.length&&(d.state.imagesLoaded=!0,d.initialize())},f.src=e.attr("src")||e.attr("data-src")||e.attr("data-src-retina")})},e.prototype.destroy=function(){this.$element.hasClass(this.settings.themeClass)&&this.$element.removeClass(this.settings.themeClass),this.settings.responsive!==!1&&a(b).off("resize.owl.carousel"),this.transitionEndVendor&&this.off(this.$stage.get(0),this.transitionEndVendor,this.e._transitionEnd);for(var d in this._plugins)this._plugins[d].destroy();(this.settings.mouseDrag||this.settings.touchDrag)&&(this.$stage.off("mousedown touchstart touchcancel"),a(c).off(".owl.dragEvents"),this.$stage.get(0).onselectstart=function(){},this.$stage.off("dragstart",function(){return!1})),this.$element.off(".owl"),this.$stage.children(".cloned").remove(),this.e=null,this.$element.removeData("owlCarousel"),this.$stage.children().contents().unwrap(),this.$stage.children().unwrap(),this.$stage.unwrap()},e.prototype.op=function(a,b,c){var d=this.settings.rtl;switch(b){case"<":return d?a>c:c>a;case">":return d?c>a:a>c;case">=":return d?c>=a:a>=c;case"<=":return d?a>=c:c>=a}},e.prototype.on=function(a,b,c,d){a.addEventListener?a.addEventListener(b,c,d):a.attachEvent&&a.attachEvent("on"+b,c)},e.prototype.off=function(a,b,c,d){a.removeEventListener?a.removeEventListener(b,c,d):a.detachEvent&&a.detachEvent("on"+b,c)},e.prototype.trigger=function(b,c,d){var e={item:{count:this._items.length,index:this.current()}},f=a.camelCase(a.grep(["on",b,d],function(a){return a}).join("-").toLowerCase()),g=a.Event([b,"owl",d||"carousel"].join(".").toLowerCase(),a.extend({relatedTarget:this},e,c));return this._supress[b]||(a.each(this._plugins,function(a,b){b.onTrigger&&b.onTrigger(g)}),this.$element.trigger(g),this.settings&&"function"==typeof this.settings[f]&&this.settings[f].apply(this,g)),g},e.prototype.suppress=function(b){a.each(b,a.proxy(function(a,b){this._supress[b]=!0},this))},e.prototype.release=function(b){a.each(b,a.proxy(function(a,b){delete this._supress[b]},this))},e.prototype.browserSupport=function(){if(this.support3d=j(),this.support3d){this.transformVendor=i();var a=["transitionend","webkitTransitionEnd","transitionend","oTransitionEnd"];this.transitionEndVendor=a[h()],this.vendorName=this.transformVendor.replace(/Transform/i,""),this.vendorName=""!==this.vendorName?"-"+this.vendorName.toLowerCase()+"-":""}this.state.orientation=b.orientation},a.fn.owlCarousel=function(b){return this.each(function(){a(this).data("owlCarousel")||a(this).data("owlCarousel",new e(this,b))})},a.fn.owlCarousel.Constructor=e}(window.Zepto||window.jQuery,window,document),function(a,b){var c=function(b){this._core=b,this._loaded=[],this._handlers={"initialized.owl.carousel change.owl.carousel":a.proxy(function(b){if(b.namespace&&this._core.settings&&this._core.settings.lazyLoad&&(b.property&&"position"==b.property.name||"initialized"==b.type))for(var c=this._core.settings,d=c.center&&Math.ceil(c.items/2)||c.items,e=c.center&&-1*d||0,f=(b.property&&b.property.value||this._core.current())+e,g=this._core.clones().length,h=a.proxy(function(a,b){this.load(b)},this);e++<d;)this.load(g/2+this._core.relative(f)),g&&a.each(this._core.clones(this._core.relative(f++)),h)},this)},this._core.options=a.extend({},c.Defaults,this._core.options),this._core.$element.on(this._handlers)};c.Defaults={lazyLoad:!1},c.prototype.load=function(c){var d=this._core.$stage.children().eq(c),e=d&&d.find(".owl-lazy");!e||a.inArray(d.get(0),this._loaded)>-1||(e.each(a.proxy(function(c,d){var e,f=a(d),g=b.devicePixelRatio>1&&f.attr("data-src-retina")||f.attr("data-src");this._core.trigger("load",{element:f,url:g},"lazy"),f.is("img")?f.one("load.owl.lazy",a.proxy(function(){f.css("opacity",1),this._core.trigger("loaded",{element:f,url:g},"lazy")},this)).attr("src",g):(e=new Image,e.onload=a.proxy(function(){f.css({"background-image":"url("+g+")",opacity:"1"}),this._core.trigger("loaded",{element:f,url:g},"lazy")},this),e.src=g)},this)),this._loaded.push(d.get(0)))},c.prototype.destroy=function(){var a,b;for(a in this.handlers)this._core.$element.off(a,this.handlers[a]);for(b in Object.getOwnPropertyNames(this))"function"!=typeof this[b]&&(this[b]=null)},a.fn.owlCarousel.Constructor.Plugins.Lazy=c}(window.Zepto||window.jQuery,window,document),function(a){var b=function(c){this._core=c,this._handlers={"initialized.owl.carousel":a.proxy(function(){this._core.settings.autoHeight&&this.update()},this),"changed.owl.carousel":a.proxy(function(a){this._core.settings.autoHeight&&"position"==a.property.name&&this.update()},this),"loaded.owl.lazy":a.proxy(function(a){this._core.settings.autoHeight&&a.element.closest("."+this._core.settings.itemClass)===this._core.$stage.children().eq(this._core.current())&&this.update()},this)},this._core.options=a.extend({},b.Defaults,this._core.options),this._core.$element.on(this._handlers)};b.Defaults={autoHeight:!1,autoHeightClass:"owl-height"},b.prototype.update=function(){this._core.$stage.parent().height(this._core.$stage.children().eq(this._core.current()).height()).addClass(this._core.settings.autoHeightClass)},b.prototype.destroy=function(){var a,b;for(a in this._handlers)this._core.$element.off(a,this._handlers[a]);for(b in Object.getOwnPropertyNames(this))"function"!=typeof this[b]&&(this[b]=null)},a.fn.owlCarousel.Constructor.Plugins.AutoHeight=b}(window.Zepto||window.jQuery,window,document),function(a,b,c){var d=function(b){this._core=b,this._videos={},this._playing=null,this._fullscreen=!1,this._handlers={"resize.owl.carousel":a.proxy(function(a){this._core.settings.video&&!this.isInFullScreen()&&a.preventDefault()},this),"refresh.owl.carousel changed.owl.carousel":a.proxy(function(){this._playing&&this.stop()},this),"prepared.owl.carousel":a.proxy(function(b){var c=a(b.content).find(".owl-video");c.length&&(c.css("display","none"),this.fetch(c,a(b.content)))},this)},this._core.options=a.extend({},d.Defaults,this._core.options),this._core.$element.on(this._handlers),this._core.$element.on("click.owl.video",".owl-video-play-icon",a.proxy(function(a){this.play(a)},this))};d.Defaults={video:!1,videoHeight:!1,videoWidth:!1},d.prototype.fetch=function(a,b){var c=a.attr("data-vimeo-id")?"vimeo":"youtube",d=a.attr("data-vimeo-id")||a.attr("data-youtube-id"),e=a.attr("data-width")||this._core.settings.videoWidth,f=a.attr("data-height")||this._core.settings.videoHeight,g=a.attr("href");if(!g)throw new Error("Missing video URL.");if(d=g.match(/(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/),d[3].indexOf("youtu")>-1)c="youtube";else{if(!(d[3].indexOf("vimeo")>-1))throw new Error("Video URL not supported.");c="vimeo"}d=d[6],this._videos[g]={type:c,id:d,width:e,height:f},b.attr("data-video",g),this.thumbnail(a,this._videos[g])},d.prototype.thumbnail=function(b,c){var d,e,f,g=c.width&&c.height?'style="width:'+c.width+"px;height:"+c.height+'px;"':"",h=b.find("img"),i="src",j="",k=this._core.settings,l=function(a){e='<div class="owl-video-play-icon"></div>',d=k.lazyLoad?'<div class="owl-video-tn '+j+'" '+i+'="'+a+'"></div>':'<div class="owl-video-tn" style="opacity:1;background-image:url('+a+')"></div>',b.after(d),b.after(e)};return b.wrap('<div class="owl-video-wrapper"'+g+"></div>"),this._core.settings.lazyLoad&&(i="data-src",j="owl-lazy"),h.length?(l(h.attr(i)),h.remove(),!1):void("youtube"===c.type?(f="http://img.youtube.com/vi/"+c.id+"/hqdefault.jpg",l(f)):"vimeo"===c.type&&a.ajax({type:"GET",url:"http://vimeo.com/api/v2/video/"+c.id+".json",jsonp:"callback",dataType:"jsonp",success:function(a){f=a[0].thumbnail_large,l(f)}}))},d.prototype.stop=function(){this._core.trigger("stop",null,"video"),this._playing.find(".owl-video-frame").remove(),this._playing.removeClass("owl-video-playing"),this._playing=null},d.prototype.play=function(b){this._core.trigger("play",null,"video"),this._playing&&this.stop();var c,d,e=a(b.target||b.srcElement),f=e.closest("."+this._core.settings.itemClass),g=this._videos[f.attr("data-video")],h=g.width||"100%",i=g.height||this._core.$stage.height();"youtube"===g.type?c='<iframe width="'+h+'" height="'+i+'" src="http://www.youtube.com/embed/'+g.id+"?autoplay=1&v="+g.id+'" frameborder="0" allowfullscreen></iframe>':"vimeo"===g.type&&(c='<iframe src="http://player.vimeo.com/video/'+g.id+'?autoplay=1" width="'+h+'" height="'+i+'" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'),f.addClass("owl-video-playing"),this._playing=f,d=a('<div style="height:'+i+"px; width:"+h+'px" class="owl-video-frame">'+c+"</div>"),e.after(d)},d.prototype.isInFullScreen=function(){var d=c.fullscreenElement||c.mozFullScreenElement||c.webkitFullscreenElement;return d&&a(d).parent().hasClass("owl-video-frame")&&(this._core.speed(0),this._fullscreen=!0),d&&this._fullscreen&&this._playing?!1:this._fullscreen?(this._fullscreen=!1,!1):this._playing&&this._core.state.orientation!==b.orientation?(this._core.state.orientation=b.orientation,!1):!0},d.prototype.destroy=function(){var a,b;this._core.$element.off("click.owl.video");for(a in this._handlers)this._core.$element.off(a,this._handlers[a]);for(b in Object.getOwnPropertyNames(this))"function"!=typeof this[b]&&(this[b]=null)},a.fn.owlCarousel.Constructor.Plugins.Video=d}(window.Zepto||window.jQuery,window,document),function(a,b,c,d){var e=function(b){this.core=b,this.core.options=a.extend({},e.Defaults,this.core.options),this.swapping=!0,this.previous=d,this.next=d,this.handlers={"change.owl.carousel":a.proxy(function(a){"position"==a.property.name&&(this.previous=this.core.current(),this.next=a.property.value)},this),"drag.owl.carousel dragged.owl.carousel translated.owl.carousel":a.proxy(function(a){this.swapping="translated"==a.type},this),"translate.owl.carousel":a.proxy(function(){this.swapping&&(this.core.options.animateOut||this.core.options.animateIn)&&this.swap()},this)},this.core.$element.on(this.handlers)};e.Defaults={animateOut:!1,animateIn:!1},e.prototype.swap=function(){if(1===this.core.settings.items&&this.core.support3d){this.core.speed(0);var b,c=a.proxy(this.clear,this),d=this.core.$stage.children().eq(this.previous),e=this.core.$stage.children().eq(this.next),f=this.core.settings.animateIn,g=this.core.settings.animateOut;this.core.current()!==this.previous&&(g&&(b=this.core.coordinates(this.previous)-this.core.coordinates(this.next),d.css({left:b+"px"}).addClass("animated owl-animated-out").addClass(g).one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend",c)),f&&e.addClass("animated owl-animated-in").addClass(f).one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend",c))}},e.prototype.clear=function(b){a(b.target).css({left:""}).removeClass("animated owl-animated-out owl-animated-in").removeClass(this.core.settings.animateIn).removeClass(this.core.settings.animateOut),this.core.transitionEnd()},e.prototype.destroy=function(){var a,b;for(a in this.handlers)this.core.$element.off(a,this.handlers[a]);for(b in Object.getOwnPropertyNames(this))"function"!=typeof this[b]&&(this[b]=null)},a.fn.owlCarousel.Constructor.Plugins.Animate=e}(window.Zepto||window.jQuery,window,document),function(a,b,c){var d=function(b){this.core=b,this.core.options=a.extend({},d.Defaults,this.core.options),this.handlers={"translated.owl.carousel refreshed.owl.carousel":a.proxy(function(){this.autoplay()
},this),"play.owl.autoplay":a.proxy(function(a,b,c){this.play(b,c)},this),"stop.owl.autoplay":a.proxy(function(){this.stop()},this),"mouseover.owl.autoplay":a.proxy(function(){this.core.settings.autoplayHoverPause&&this.pause()},this),"mouseleave.owl.autoplay":a.proxy(function(){this.core.settings.autoplayHoverPause&&this.autoplay()},this)},this.core.$element.on(this.handlers)};d.Defaults={/*autoplay:!1,autoplayTimeout:5e3,autoplayHoverPause:!1,autoplaySpeed:!1*/autoplay:1,autoplayTimeout:5e3,autoplayHoverPause:1,autoplaySpeed:1},d.prototype.autoplay=function(){this.core.settings.autoplay&&!this.core.state.videoPlay?(b.clearInterval(this.interval),this.interval=b.setInterval(a.proxy(function(){this.play()},this),this.core.settings.autoplayTimeout)):b.clearInterval(this.interval)},d.prototype.play=function(){return c.hidden===!0||this.core.state.isTouch||this.core.state.isScrolling||this.core.state.isSwiping||this.core.state.inMotion?void 0:this.core.settings.autoplay===!1?void b.clearInterval(this.interval):void this.core.next(this.core.settings.autoplaySpeed)},d.prototype.stop=function(){b.clearInterval(this.interval)},d.prototype.pause=function(){b.clearInterval(this.interval)},d.prototype.destroy=function(){var a,c;b.clearInterval(this.interval);for(a in this.handlers)this.core.$element.off(a,this.handlers[a]);for(c in Object.getOwnPropertyNames(this))"function"!=typeof this[c]&&(this[c]=null)},a.fn.owlCarousel.Constructor.Plugins.autoplay=d}(window.Zepto||window.jQuery,window,document),function(a){"use strict";var b=function(c){this._core=c,this._initialized=!1,this._pages=[],this._controls={},this._templates=[],this.$element=this._core.$element,this._overrides={next:this._core.next,prev:this._core.prev,to:this._core.to},this._handlers={"prepared.owl.carousel":a.proxy(function(b){this._core.settings.dotsData&&this._templates.push(a(b.content).find("[data-dot]").andSelf("[data-dot]").attr("data-dot"))},this),"add.owl.carousel":a.proxy(function(b){this._core.settings.dotsData&&this._templates.splice(b.position,0,a(b.content).find("[data-dot]").andSelf("[data-dot]").attr("data-dot"))},this),"remove.owl.carousel prepared.owl.carousel":a.proxy(function(a){this._core.settings.dotsData&&this._templates.splice(a.position,1)},this),"change.owl.carousel":a.proxy(function(a){if("position"==a.property.name&&!this._core.state.revert&&!this._core.settings.loop&&this._core.settings.navRewind){var b=this._core.current(),c=this._core.maximum(),d=this._core.minimum();a.data=a.property.value>c?b>=c?d:c:a.property.value<d?c:a.property.value}},this),"changed.owl.carousel":a.proxy(function(a){"position"==a.property.name&&this.draw()},this),"refreshed.owl.carousel":a.proxy(function(){this._initialized||(this.initialize(),this._initialized=!0),this._core.trigger("refresh",null,"navigation"),this.update(),this.draw(),this._core.trigger("refreshed",null,"navigation")},this)},this._core.options=a.extend({},b.Defaults,this._core.options),this.$element.on(this._handlers)};b.Defaults={nav:!1,navRewind:!0,navText:["prev","next"],navSpeed:!1,navElement:"div",navContainer:!1,navContainerClass:"owl-nav",navClass:["owl-prev","owl-next"],slideBy:1,dotClass:"owl-dot",dotsClass:"owl-dots",dots:!0,dotsEach:!1,dotData:!1,dotsSpeed:!1,dotsContainer:!1,controlsClass:"owl-controls"},b.prototype.initialize=function(){var b,c,d=this._core.settings;d.dotsData||(this._templates=[a("<div>").addClass(d.dotClass).append(a("<span>")).prop("outerHTML")]),d.navContainer&&d.dotsContainer||(this._controls.$container=a("<div>").addClass(d.controlsClass).appendTo(this.$element)),this._controls.$indicators=d.dotsContainer?a(d.dotsContainer):a("<div>").hide().addClass(d.dotsClass).appendTo(this._controls.$container),this._controls.$indicators.on("click","div",a.proxy(function(b){var c=a(b.target).parent().is(this._controls.$indicators)?a(b.target).index():a(b.target).parent().index();b.preventDefault(),this.to(c,d.dotsSpeed)},this)),b=d.navContainer?a(d.navContainer):a("<div>").addClass(d.navContainerClass).prependTo(this._controls.$container),this._controls.$next=a("<"+d.navElement+">"),this._controls.$previous=this._controls.$next.clone(),this._controls.$previous.addClass(d.navClass[0]).html(d.navText[0]).hide().prependTo(b).on("click",a.proxy(function(){this.prev(d.navSpeed)},this)),this._controls.$next.addClass(d.navClass[1]).html(d.navText[1]).hide().appendTo(b).on("click",a.proxy(function(){this.next(d.navSpeed)},this));for(c in this._overrides)this._core[c]=a.proxy(this[c],this)},b.prototype.destroy=function(){var a,b,c,d;for(a in this._handlers)this.$element.off(a,this._handlers[a]);for(b in this._controls)this._controls[b].remove();for(d in this.overides)this._core[d]=this._overrides[d];for(c in Object.getOwnPropertyNames(this))"function"!=typeof this[c]&&(this[c]=null)},b.prototype.update=function(){var a,b,c,d=this._core.settings,e=this._core.clones().length/2,f=e+this._core.items().length,g=d.center||d.autoWidth||d.dotData?1:d.dotsEach||d.items;if("page"!==d.slideBy&&(d.slideBy=Math.min(d.slideBy,d.items)),d.dots||"page"==d.slideBy)for(this._pages=[],a=e,b=0,c=0;f>a;a++)(b>=g||0===b)&&(this._pages.push({start:a-e,end:a-e+g-1}),b=0,++c),b+=this._core.mergers(this._core.relative(a))},b.prototype.draw=function(){var b,c,d="",e=this._core.settings,f=(this._core.$stage.children(),this._core.relative(this._core.current()));if(!e.nav||e.loop||e.navRewind||(this._controls.$previous.toggleClass("disabled",0>=f),this._controls.$next.toggleClass("disabled",f>=this._core.maximum())),this._controls.$previous.toggle(e.nav),this._controls.$next.toggle(e.nav),e.dots){if(b=this._pages.length-this._controls.$indicators.children().length,e.dotData&&0!==b){for(c=0;c<this._controls.$indicators.children().length;c++)d+=this._templates[this._core.relative(c)];this._controls.$indicators.html(d)}else b>0?(d=new Array(b+1).join(this._templates[0]),this._controls.$indicators.append(d)):0>b&&this._controls.$indicators.children().slice(b).remove();this._controls.$indicators.find(".active").removeClass("active"),this._controls.$indicators.children().eq(a.inArray(this.current(),this._pages)).addClass("active")}this._controls.$indicators.toggle(e.dots)},b.prototype.onTrigger=function(b){var c=this._core.settings;b.page={index:a.inArray(this.current(),this._pages),count:this._pages.length,size:c&&(c.center||c.autoWidth||c.dotData?1:c.dotsEach||c.items)}},b.prototype.current=function(){var b=this._core.relative(this._core.current());return a.grep(this._pages,function(a){return a.start<=b&&a.end>=b}).pop()},b.prototype.getPosition=function(b){var c,d,e=this._core.settings;return"page"==e.slideBy?(c=a.inArray(this.current(),this._pages),d=this._pages.length,b?++c:--c,c=this._pages[(c%d+d)%d].start):(c=this._core.relative(this._core.current()),d=this._core.items().length,b?c+=e.slideBy:c-=e.slideBy),c},b.prototype.next=function(b){a.proxy(this._overrides.to,this._core)(this.getPosition(!0),b)},b.prototype.prev=function(b){a.proxy(this._overrides.to,this._core)(this.getPosition(!1),b)},b.prototype.to=function(b,c,d){var e;d?a.proxy(this._overrides.to,this._core)(b,c):(e=this._pages.length,a.proxy(this._overrides.to,this._core)(this._pages[(b%e+e)%e].start,c))},a.fn.owlCarousel.Constructor.Plugins.Navigation=b}(window.Zepto||window.jQuery,window,document),function(a,b){"use strict";var c=function(d){this._core=d,this._hashes={},this.$element=this._core.$element,this._handlers={"initialized.owl.carousel":a.proxy(function(){"URLHash"==this._core.settings.startPosition&&a(b).trigger("hashchange.owl.navigation")},this),"prepared.owl.carousel":a.proxy(function(b){var c=a(b.content).find("[data-hash]").andSelf("[data-hash]").attr("data-hash");this._hashes[c]=b.content},this)},this._core.options=a.extend({},c.Defaults,this._core.options),this.$element.on(this._handlers),a(b).on("hashchange.owl.navigation",a.proxy(function(){var a=b.location.hash.substring(1),c=this._core.$stage.children(),d=this._hashes[a]&&c.index(this._hashes[a])||0;return a?void this._core.to(d,!1,!0):!1},this))};c.Defaults={URLhashListener:!1},c.prototype.destroy=function(){var c,d;a(b).off("hashchange.owl.navigation");for(c in this._handlers)this._core.$element.off(c,this._handlers[c]);for(d in Object.getOwnPropertyNames(this))"function"!=typeof this[d]&&(this[d]=null)},a.fn.owlCarousel.Constructor.Plugins.Hash=c}(window.Zepto||window.jQuery,window,document);
app.run(["$templateCache", function($templateCache) {
$templateCache.put("app/demo/demo.html","<div class=\"container\">\n  <div class=\"row\">\n    <div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12\" style=\"display:none;\">\n      <h2 class=\"content\">Demo</h2>\n      <p>\n        The content below the horizontal line is dynamically generated. Jump to\n        the very bottom of page to edit the content on the page.\n      </p>\n    </div>\n  </div>\n</div>\n\n<div class=\"divider-bar\" />\n\n<wu-cms-content-block\n  content-block=\"contentBlock\"\n  ng-repeat=\"contentBlock in contentBlocks\">\n</wu-cms-content-block>\n\n<div class=\"divider-bar\" />\n\n<div class=\"container\">\n  <div class=\"row\">\n    <div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12\">\n      <h1 class=\"content\">\n        Try it out\n      </h1>\n      <p class=\"content\">\n        Edit the JSON below to change the content which is displayed above.\n      </p>\n      <div class=\"clearfix\">\n        <span class=\"pull-right label label-success\" ng-show=\"valid\">\n          Valid\n        </span>\n        <span class=\"pull-right label label-danger\" ng-show=\"!valid\">\n          Invalid\n        </span>\n      </div>\n      <br />\n      <textarea class=\"json-area\" ng-model=\"contentBlockString\" />\n    </div>\n  </div>\n</div>\n");
$templateCache.put("app/landing_page/landing_page.html","<wu-cms-content-block\n  content-block=\"contentBlock\"\n  ng-repeat=\"contentBlock in contentBlocks\">\n</wu-cms-content-block>\n\n<div class=\"divider-bar\" />\n");
$templateCache.put("app/examples/examples.html","<div class=\"container\">\n  <div class=\"row\">\n    <div class=\"col-xs-12 col-sm-12\">\n      <h1 class=\"content\">\n        Examples\n      </h1>\n    </div>\n  </div>\n</div>\n\n<div ng-repeat=\"example in examples\">\n  <div class=\"container\">\n    <div class=\"row\">\n      <div class=\"col-xs-12 col-sm-12\">\n        <h3 class=\"content\">\n          Example {{ $index + 1 }}: {{ example.description }}\n        </h3>\n        <pre ng-bind=getCodeBlock(example.content_block)></pre>\n      </div>\n    </div>\n  </div>\n  <wu-cms-content-block\n    content-block=\"example.content_block\">\n  </wu-cms-content-block>\n</div>\n");
$templateCache.put("app/docs/docs.html","<div class=\"container\">\n  <div class=\"row\">\n    <div class=\"col-xs-12 col-sm-12 content\">\n      <h1 class=\"content\">\n        Documentation\n      </h1>\n      <p>\n        See the <a href=\"#/examples\">Examples</a> page for examples.\n      </p>\n      <div btf-markdown ng-include=\"\'docs/DOCUMENTATION.md\'\">\n      </div>\n    </div>\n  </div>\n</div>\n");
$templateCache.put("components/menu_header/menu_header.html","<div id=\"cshero-header\" class=\"header\" ng-class=\"{ mobileArrowEffect : collapse }\">\n  <div class=\"notifier-bar\">\n    <div class=\"container\">\n      <div class=\"notifier-message\">\n</div>\n      <ul class=\"cart-nav pull-right\"></ul>\n    </div>\n  </div>\n    <div class=\"container\">\n      <div class=\"row logo-row\">\n        <div class=\"logo logo-line-height-nav col-xs-4 col-sm-4 col-md-2 col-lg-2\">\n          <a href=\"#/lp/home\"><img class=\"wu-logo\" src=\"http://c67bfc7c934596c5d2de-384a0fe271c727cec0e8a9b32788243a.r54.cf1.rackcdn.com/logo.svg\"></a>\n        </div>\n        <div id=\"menu\" class=\"main-menu-wrap  col-xs-8 col-sm-8 col-md-10 col-lg-10\">\n          <div class=\"cs-main-menu-wrap right clearfix\">\n<div class=\"cshero-header-content-widget cshero-hidden-sidebar right\" style=\"display:none;\">\n            <div class=\"cshero-hidden-sidebar-btn\">\n              <a href=\"#\"><span class=\"fa fa-sign-out cs_open\"></span></a>\n            </div>\n          </div>\n          <div class=\"cshero-header-content-widget cshero-menu-mobile hidden-lg hidden-md right\">\n            <div class=\"cshero-header-content-widget-inner current-menu-item\">\n              <a class=\"btn-navbar\" ng-class=\"{ collapsed : collapse }\" ng-click=\"collapse = !collapse\"  data-target=\"{#cshero-header},{#cshero-main-menu-mobile},{body}\" ><i class=\"\"></i></a>\n            </div>\n          </div>\n          <div class=\"cs_mega_menu main-menu-content cshero-menu-dropdown clearfix -cshero-mobile right\">\n            <ul class=\"cshero-dropdown main-menu menu-item menu-item-padding\" >\n              <li id=\"menu-item menu-item-4324\" class=\"menu-item menu-item menu-item-4324\"><a href=\"/library\">Design Library</a></li><li hMenu=\"headerMenu\" ng-repeat=\"item in headerMenu\" id=\"menu-item menu-item-{{item.entry_id}}\" class=\"menu-item menu-item menu-item-{{item.entry_id}}\" ng-class=\"{menu__item__has__children : item.submenu}\">\n                <a href=\"/#{{item.url}}\">{{item.label}}</a>\n          <ul ng-show=\"item.submenu.length\" class=\"standar-dropdown standard autodrop_submenu sub-menu\">\n             <li ng-repeat=\"submenu in item.submenu\" id=\"menu-item-{{item.entry_id}}\" class=\menu-item menu-item-type-post_type menu-item-object-page no_group menu-item-{{item.entry_id}}\"><a href=\"/#{{submenu.url}}\">{{submenu.label}}</a></li>\n</ul></a>\n              </li>\n            </ul>\n          </div>\n        </div>\n      </div>\n      <div id=\"cshero-main-menu-mobile\" class=\"collapse navbar-collapse cshero-mmenu\" ng-class=\"{in: collapse }\">\n        <ul class=\"cshero-dropdown cshero-mobile-menu\">\n          <li hMenu=\"headerMenu\" ng-repeat=\"item in headerMenu\" id=\"menu-item menu-item-{{item.entry_id}}\" class=\"menu-item\" ng-class=\"{ open : opened }\">\n            <a href=\"/#{{item.url}}\">{{item.label}}</a>\n          <ul ng-show=\"item.submenu.length\" class=\"standar-dropdown standard autodrop_submenu sub-menu\">\n             <li ng-repeat=\"submenu in item.submenu\" id=\"menu-item-{{item.entry_id}}\" class=\menu-item menu-item-type-post_type menu-item-object-page no_group menu-item-{{item.entry_id}}\"><a href=\"/#{{submenu.url}}\">{{submenu.label}}</a></li>\n</ul>\n          <span class=\"cs-menu-toggle\" ng-click=\"opened = !opened\" data-target=\"{#menu-item-{{item.entry_id}}}\"></span>\n            </li>\n        </ul>\n      </div>\n    </div>\n  </div>\n\n  <div class=\"divider-bar\"></div>\n</div>\n");
$templateCache.put("components/header/header.html","<div class=\"container\"><div class=\"nav__mobile-message\">\n  <div class=\"nav__mobile-message__inner clearfix\">\n    <span ios-weaveup-hide=\"\">\n      <a href=\"#/examples\">Examples</a>\n      <a href=\"#/docs\">Documentation</a>\n      Download our iOS app    </span>\n    <a href=\"#/cart\">\n      <ul class=\"nav__mobile-message__cart\">\n        <li class=\"fa fa-shopping-cart\"></li>\n        <li class=\"nav__mobile-message__cart__button\">CART</li>\n        <li class=\"nav__mobile-message__cart__count ng-binding ng-hide\" ng-bind=\"cartCount\" ng-show=\"cartCount\">0</li>\n      </ul>\n    </a>\n  </div>\n</div>\n<menu-header>\n</menu-header>\n</div>\n");
$templateCache.put("components/cms/content_blocks/title_bar/title_bar.html","<div class=\"wu-cms-content-block__title_bar__inner\" style=\"\">\n  <div class=\"container\">\n    <div id=\"\" class=\"row\">\n      <div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12\">\n        <div class=\"title_bar\">\n          <h1 class=\"page-title\">{{ contentBlock.title_bar.headline }}</h1>\n          </div>\n      </div>\n    </div>\n  </div>\n  <span class=\"wu-cms-content-block__title_bar__overlay \" style=\"background-color:rgba(0, 0, 0, 0.3); background-image: url( {{ contentBlock.title_bar.image_url }} ); opacity: 0.4 \"></span>\n  </div>\n");
$templateCache.put("components/cms/content_blocks/banner/banner.html","<div class=\"wu-cms-content-block__banner\">\n  <img class=\"wu-cms-content-block__banner__inner wu-cms-content-block__banner__inner--320\"\n    ng-src=\"{{ contentBlock.banner.images.xs }}\" />\n  <img class=\"wu-cms-content-block__banner__inner wu-cms-content-block__banner__inner--480\"\n    ng-src=\"{{ contentBlock.banner.images.sm }}\" />\n  <img class=\"wu-cms-content-block__banner__inner wu-cms-content-block__banner__inner--768\"\n    ng-src=\"{{ contentBlock.banner.images.md }}\" />\n  <img class=\"wu-cms-content-block__banner__inner wu-cms-content-block__banner__inner--992\"\n    ng-src=\"{{ contentBlock.banner.images.lg }}\" />\n  <div class=\"wu-cms-content-block__banner__inner wu-cms-content-block__banner__inner--1400\"\n    background-image=\"{{ contentBlock.banner.images.xl }}\">\n  </div>\n  <a ng-show=\"contentBlock.banner.url\"\n    ng-href=\"#{{ contentBlock.banner.url }}\"\n    class=\"wu-cms-content-block__banner__link\">\n  </a>\n</div>\n");
$templateCache.put("components/cms/content_blocks/banner_carousel/banner_carousel.html","<div class=\"wu-cms-content-block__carousel\">\n  <div class=\"wu-cms-content-block__carousel__inner owl-carousel\"\n    owl-carousel=\"slides\"\n    owl-options=\"{{ owlOptions }}\">\n    <wu-cms-content-block-banner\n      content-block=\"item\">\n    </wu-cms-content-block-banner>\n  </div>\n</div>\n");
$templateCache.put("components/cms/content_blocks/fluid_grid/fluid_grid.html","<div class=\"container\">\n  <div class=\"row home-grid\">\n    <div ng-repeat=\"block in contentBlock.fluid_grid\" class=\"col-xs-12 col-sm-{{ block.columns }} {{ block.size }} \" >\n      <div style=\"background:url({{ block.image_url }}) center center / cover no-repeat\" ng-mouseenter=\"caption = !caption\" ng-class=\"{ active: caption }\" ></div> <div class=\"grid-caption\"  ng-mouseleave=\"caption = false\"  ng-show=\"caption\">\n        <h1>{{  block.headline }}</h1>\n        <p>{{  block.body }}</p>\n        <p ng-if=\"block.link\">\n          <a ng-href=\"#{{ block.link.url }}\" class=\"wu-btn wu-btn--{{ block.link.style }}\">{{ block.link.label }}</a>\n        </p>\n      <p ng-if=\"block.button\">\n          <a ng-href=\"#{{ block.button.url }}\" class=\"wu-btn wu-btn--{{ block.button.style }}\">{{ block.button.label }}</a>\n        </p>\n      </div>\n    </div>\n  </div>\n</div>\n" );
$templateCache.put("components/cms/content_blocks/call_to_action/call_to_action.html","<div class=\"wu-cms-content-block__call-to-action\">\n  <div class=\"wu-cms-content-block__call-to-action__inner clearfix\">\n    <div ng-repeat=\"cta in contentBlock.call_to_action\"\n      class=\"wu-cms-content-block__call-to-action__item\">\n      <div class=\"wu-cms-content-block__call-to-action__item__inner\"\n        background-image=\"{{ cta.image_url }}\">\n        <a ng-href=\"#{{ cta.url }}\">\n        </a>\n      </div>\n    </div>\n  </div>\n</div>\n");
$templateCache.put("components/cms/content_blocks/content_block/content_block.html","<div class=\"wu-cms-content-block\"\n  ng-class=\"getContentBlockClass()\">\n  <div ng-switch on=\"contentBlock.content_block_type\">\n    <wu-cms-content-block-title_bar\n      content-block=\"contentBlock\"\n      ng-switch-when=\"title_bar\">\n    </wu-cms-content-block-title_bar>\n        <wu-cms-content-block-banner\n      content-block=\"contentBlock\"\n      ng-switch-when=\"banner\">\n    </wu-cms-content-block-banner>\n    <wu-cms-content-block-banner-carousel\n      ng-switch-when=\"banner_carousel\">\n    </wu-cms-content-block-banner-carousel>\n    <wu-cms-content-block-fluid-grid\n      ng-switch-when=\"fluid_grid\">\n    </wu-cms-content-block-fluid-grid>\n        <wu-cms-content-block-call-to-action\n      ng-switch-when=\"call_to_action\">\n    </wu-cms-content-block-call-to-action>\n    <wu-cms-content-block-horizontal-rule\n      ng-switch-when=\"horizontal_rule\">\n    </wu-cms-content-block-horizontal-rule>\n    <wu-cms-content-block-standard-block\n      ng-switch-when=\"standard_block\">\n    </wu-cms-content-block-standard-block>\n    <wu-cms-content-block-products\n     content-block=\"contentBlock\"  ng-switch-when=\"products\">\n    </wu-cms-content-block-products>\n     <wu-cms-content-block-two-column\n      ng-switch-when=\"two_column\">\n    </wu-cms-content-block-two-column>\n    <wu-cms-content-block-three-column\n      ng-switch-when=\"three_column\">\n    </wu-cms-content-block-three-column>\n    <wu-cms-content-block-four-column\n      ng-switch-when=\"four_column\">\n    </wu-cms-content-block-four-column>\n    <wu-cms-content-block-five-column\n      ng-switch-when=\"five_column\">\n    </wu-cms-content-block-five-column>\n    <wu-cms-content-block-tabs\n      content-block=\"contentBlock\"\n      ng-switch-when=\"tabs\">\n    </wu-cms-content-block-tabs>\n    <wu-cms-content-block-timeline\n   source=\"contentBlock.timeline\"\n  ng-switch-when=\"timeline\">\n    </wu-cms-content-block-timeline>\n            <div ng-switch-default ng-bind=\"contentBlock.content_block_type\">\n    </div>\n  </div>\n</div>\n");
$templateCache.put("components/cms/content_blocks/horizontal_rule/horizontal_rule.html","<div class=\"container\">\n  <div class=\"row\">\n    <div class=\"col-xs-12 col-sm-12\">\n      <div class=\"divider-bar\"></div>\n    </div>\n  </div>\n</div>\n");
$templateCache.put("components/cms/content_blocks/products/products.html","<div class=\"container\">\n  <div class=\"row\">\n    <div>\n      <div  class=\"wu-cms-content-block__products\" ng-repeat=\"product in contentBlock.products\">\n        <div class=\"col-xs-4\">\n          <img class=\"image\" ng-if=\"product.image\" ng-src=\"{{product.image}}\" />\n        </div>\n        <div class=\"info col-xs-8\">\n          <h5 ng-if=\"product.name\" ng-bind=\"product.name\"></h5>\n          <p  ng-if=\"product.summary\" ng-bind=\"product.summary\"></p>\n         <div class=\"button_container\"> <div> <a class=\"wu-btn wu-btn--inline wu-btn wu-btn--transparent-black\" ng-href=\"#/product-detail/{{product.id}}\">Read More</a>\n          </div> <div> <i class=\"product_icon sustainable_icon\"></i><a class=\"product_icon spec_icon\" ng-href=\"#{{product.spec}}\"></a>\n  </div>\n </div>\n </div>\n        </div>\n      </div>\n    </div>\n</div>\n");
$templateCache.put("components/cms/content_blocks/standard_block/standard_block.html","<div class=\"container\">\n  <div class=\"row\">\n    <div class=\"\">\n      <div class=\"wu-cms-content-block__standard_block\">\n        <h1 ng-bind=\"contentBlock.standard_block.headline\"\n          ng-if=\"contentBlock.standard_block.headline\">\n        </h1>\n        <h5 ng-bind=\"contentBlock.standard_block.sub_headline\"\n          ng-if=\"contentBlock.standard_block.sub_headline\">\n        </h5>\n        <youtube-video ng-if=\"contentBlock.standard_block.youtube\" video-id=\"{{contentBlock.standard_block.youtube}}\"></youtube-video>\n       <img class=\"-image\" ng-if=\"contentBlock.standard_block.image\" ng-src=\"{{contentBlock.standard_block.image}}\" />\n       <p ng-bind-html=\"contentBlock.standard_block.body\"\n          ng-if=\"contentBlock.standard_block.body\">\n        </p>\n        <p ng-if=\"contentBlock.standard_block.button\">\n          <a class=\"wu-btn wu-btn--inline\"\n            ng-class=\"getButtonClass(contentBlock.standard_block.button.style)\"\n            ng-href=\"#{{ contentBlock.standard_block.button.url }}\"\n            ng-bind=\"contentBlock.standard_block.button.label\">\n          </a>\n        </p>\n        <p ng-if=\"contentBlock.standard_block.link.url\">\n          <a ng-href=\"#{{ contentBlock.standard_block.link.url }}\"\n            ng-bind=\"contentBlock.standard_block.link.label\">\n          </a>\n        </p>\n      </div>\n    </div>\n  </div>\n</div>\n");
$templateCache.put("components/cms/content_blocks/two_column/two_column.html","\<div class=\"container\">\n  <div class=\"row\">\n    <div class=\"wu-cms-content-block__standard_block\">\n        <h1 ng-bind=\"contentBlock.two_column.headline\"\n          ng-if=\"contentBlock.two_column.headline\">\n        </h1>\n        <h5 ng-bind=\"contentBlock.two_column.sub_headline\"\n          ng-if=\"contentBlock.two_column.sub_headline\">\n        </h5>\n        <youtube-video ng-if=\"contentBlock.two_column.youtube\" video-id=\"{{contentBlock.two_column.youtube}}\"></youtube-video>\n        <img class=\"-image\" ng-if=\"contentBlock.two_column.image\" ng-src=\"{{contentBlock.two_column.image}}\" />\n        <p ng-bind-html=\"contentBlock.two_column.body\"\n          ng-if=\"contentBlock.two_column.body\">\n        </p>\n      </div>\n  <div class=\"wu-cms-content-block__two_column\">\n    <div class=\"col-sm-6 col-md-6 wu-cms-content-block__two-column\"\n ng-repeat=\"column in contentBlock.two_column.columns\">\n      <h1 class=\"wu-cms-content-block__two-column__headline\"\n        ng-bind=\"column.headline\" ng-if=\"column.headline\">\n      </h1>\n      <h5 class=\"wu-cms-content-block__two-column__sub_headline\"\n        ng-bind=\"column.sub_headline\" ng-if=\"column.sub_headline\">\n      </h5>\n      <youtube-video ng-if=\"column.youtube\" video-id=\"column.youtube\" class=\"wu-cms-content-block__two-column__youtube\"></youtube-video>\n       <img class=\"image\" ng-if=\"column.image\" ng-src=\"{{column.image}}\" />\n      <p class=\"wu-cms-content-block__two-column__body\"\n        ng-bind-html=\"column.body\" ng-if=\"column.body\">\n      </p>\n      <a ng-if=\"column.button\"\n        class=\"wu-btn wu-btn--inline\"\n        ng-class=\"getButtonClass(column.button.style)\"\n        ng-href=\"#{{ column.button.url }}\"\n        ng-bind=\"column.button.label\">\n            {{ column.button.label }}</a>\n      <p ng-if=\"column.link.url\">\n              <a ng-href=\"#{{ column.link.url }}\"\n          ng-bind=\"column.link.label\">\n              </a>\n            </p>\n    </div>\n  </div>\n</div>\n");
$templateCache.put("components/cms/content_blocks/three_column/three_column.html","\<div class=\"container\">\n  <div class=\"row\">\n    <div class=\"\">\n      <div class=\"wu-cms-content-block__standard_block\">\n        <h1 ng-bind=\"contentBlock.three_column.headline\"\n          ng-if=\"contentBlock.three_column.headline\">\n        </h1>\n        <h5 ng-bind=\"contentBlock.three_column.sub_headline\"\n          ng-if=\"contentBlock.three_column.sub_headline\">\n        </h5>\n        <youtube-video ng-if=\"contentBlock.three_column.youtube\" video-id=\"{{contentBlock.three_column.youtube}}\"></youtube-video>\n        <img class=\"-image\" ng-if=\"contentBlock.three_column.image\" ng-src=\"{{contentBlock.three_column.image}}\" />\n        <p ng-bind-html=\"contentBlock.three_column.body\"\n          ng-if=\"contentBlock.three_column.body\">\n        </p>\n      </div>\n  </div>\n  <div class=\"row\">\n    <div class=\"col-sm-6 col-md-6 wu-cms-content-block__three-column\"\n ng-repeat=\"column in contentBlock.three_column.columns\">\n      <h1 class=\"wu-cms-content-block__three-column__headline\"\n        ng-bind=\"column.headline\" ng-if=\"column.headline\">\n      </h1>\n      <h5 class=\"wu-cms-content-block__three-column__sub_headline\"\n        ng-bind=\"column.sub_headline\" ng-if=\"column.sub_headline\">\n      </h5>\n      <youtube-video ng-if=\"column.youtube\" video-id=\"column.youtube\" class=\"wu-cms-content-block__three-column__youtube\"></youtube-video>\n       <img class=\"image\" ng-if=\"column.image\" ng-src=\"{{column.image}}\" />\n      <p class=\"wu-cms-content-block__three-column__body\"\n        ng-bind-html=\"column.body\" ng-if=\"column.body\">\n      </p>\n      <a ng-if=\"column.button\"\n        class=\"wu-btn wu-btn--inline\"\n        ng-class=\"getButtonClass(column.button.style)\"\n        ng-href=\"#{{ column.button.url }}\"\n        ng-bind=\"column.button.label\">\n            {{ column.button.label }}</a>\n      <p ng-if=\"column.link.url\">\n              <a ng-href=\"#{{ column.link.url }}\"\n          ng-bind=\"column.link.label\">\n              </a>\n            </p>\n    </div>\n  </div>\n</div>\n");
$templateCache.put("components/cms/content_blocks/four_column/four_column.html","\<div class=\"container\">\n  <div class=\"row\">\n    <div class=\"\">\n      <div class=\"wu-cms-content-block__standard_block\">\n        <h1 ng-bind=\"contentBlock.four_column.headline\"\n          ng-if=\"contentBlock.four_column.headline\">\n        </h1>\n        <h5 ng-bind=\"contentBlock.four_column.sub_headline\"\n          ng-if=\"contentBlock.four_column.sub_headline\">\n        </h5>\n        <youtube-video ng-if=\"contentBlock.four_column.youtube\" video-id=\"{{contentBlock.four_column.youtube}}\"></youtube-video>\n        <img class=\"-image\" ng-if=\"contentBlock.four_column.image\" ng-src=\"{{contentBlock.four_column.image}}\" />\n        <p ng-bind-html=\"contentBlock.four_column.body\"\n          ng-if=\"contentBlock.four_column.body\">\n        </p>\n      </div>\n  </div>\n  <div class=\"row\">\n    <div class=\"col-sm-6 col-md-6 wu-cms-content-block__four-column\"\n ng-repeat=\"column in contentBlock.four_column.columns\">\n      <h1 class=\"wu-cms-content-block__four-column__headline\"\n        ng-bind=\"column.headline\" ng-if=\"column.headline\">\n      </h1>\n      <h5 class=\"wu-cms-content-block__four-column__sub_headline\"\n        ng-bind=\"column.sub_headline\" ng-if=\"column.sub_headline\">\n      </h5>\n      <youtube-video ng-if=\"column.youtube\" video-id=\"column.youtube\" class=\"wu-cms-content-block__four-column__youtube\"></youtube-video>\n       <img class=\"image\" ng-if=\"column.image\" ng-src=\"{{column.image}}\" />\n      <p class=\"wu-cms-content-block__four-column__body\"\n        ng-bind-html=\"column.body\" ng-if=\"column.body\">\n      </p>\n      <a ng-if=\"column.button\"\n        class=\"wu-btn wu-btn--inline\"\n        ng-class=\"getButtonClass(column.button.style)\"\n        ng-href=\"#{{ column.button.url }}\"\n        ng-bind=\"column.button.label\">\n            {{ column.button.label }}</a>\n      <p ng-if=\"column.link.url\">\n              <a ng-href=\"#{{ column.link.url }}\"\n          ng-bind=\"column.link.label\">\n              </a>\n            </p>\n    </div>\n  </div>\n</div>\n");
$templateCache.put("components/cms/content_blocks/five_column/five_column.html","<div class=\"container\">\n  <div class=\"row\">\n    <div class=\"\">\n      <div class=\"wu-cms-content-block__standard_block\">\n        <h1 ng-bind=\"contentBlock.five_column.headline\"\n          ng-if=\"contentBlock.five_column.headline\">\n        </h1>\n        <h5 ng-bind=\"contentBlock.five_column.sub_headline\"\n          ng-if=\"contentBlock.five_column.sub_headline\">\n        </h5>\n        <youtube-video ng-if=\"contentBlock.five_column.youtube\" video-id=\"{{contentBlock.five_column.youtube}}\"></youtube-video>\n        <img class=\"-image\" ng-if=\"contentBlock.five_column.image\" ng-src=\"{{contentBlock.five_column.image}}\" />\n        <p ng-bind-html=\"contentBlock.five_column.body\"\n          ng-if=\"contentBlock.five_column.body\">\n        </p>\n      </div>\n  </div>\n  <div class=\"row\">\n    <div class=\"col-xs-2_5 wu-cms-content-block__five-column\"\n ng-repeat=\"column in contentBlock.five_column.columns\">\n      <h1 class=\"wu-cms-content-block__five-column__headline\"\n        ng-bind=\"column.headline\" ng-if=\"column.headline\">\n      </h1>\n      <h5 class=\"wu-cms-content-block__five-column__sub_headline\"\n        ng-bind=\"column.sub_headline\" ng-if=\"column.sub_headline\">\n      </h5>\n      <youtube-video ng-if=\"column.youtube\" video-id=\"column.youtube\" class=\"wu-cms-content-block__five-column__youtube\"></youtube-video>\n      <img class=\"image\" ng-if=\"column.image\" ng-src=\"{{column.image}}\" />\n      <p class=\"wu-cms-content-block__five-column__body\"\n        ng-bind-html=\"column.body\" ng-if=\"column.body\">\n      </p>\n      <a ng-if=\"column.button\"\n class=\"wu-btn wu-btn--inline\" ng-class=\"getButtonClass(column.button.style)\" ng-href=\"#{{ column.button.url }}\" ng-bind=\"column.button.label\">\n{{ column.button.label }}</a>\n      <p ng-if=\"column.link.url\">\n      <a ng-href=\"#{{ column.link.url }}\" ng-bind=\"column.link.label\">\n</a>\n    </p>\n    </div>\n  </div>\n</div>\n");
$templateCache.put("components/cms/content_blocks/tabs/tabs.html","<div class=\"container\">\n  <div class=\"row \">\n  <tabs>\n    <pane ng-repeat=\"tab in contentBlock.tabs\"  title=\"{{ tab.label}}\">\n      <div ng-repeat=\"contentBlock in tab.tabContentBlocks\"  tab-content-block=\"contentBlock\" class=\"wu-cms-content-block\"\n ng-class=\"getTabContentBlockClass(contentBlock)\">\n        <div ng-switch on=\"contentBlock.content_block_type\" class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12\">\n          <wu-cms-content-block-banner\n      tab-content-block=\"tabContentBlock\"\n      ng-switch-when=\"banner\">\n    </wu-cms-content-block-banner>\n          <wu-cms-content-block-banner-carousel\n      ng-switch-when=\"banner_carousel\">\n    </wu-cms-content-block-banner-carousel>\n          <wu-cms-content-block-fluid-grid\n      ng-switch-when=\"fluid_grid\">\n    </wu-cms-content-block-fluid-grid>\n          <wu-cms-content-block-call-to-action\n      ng-switch-when=\"call_to_action\">\n    </wu-cms-content-block-call-to-action>\n          <wu-cms-content-block-horizontal-rule\n      ng-switch-when=\"horizontal_rule\">\n    </wu-cms-content-block-horizontal-rule>\n          <wu-cms-content-block-standard-block\n  tab-content-block=\"contentBlock\"     ng-switch-when=\"standard_block\">\n    </wu-cms-content-block-standard-block>\n          <wu-cms-content-block-two-column\n      ng-switch-when=\"two_column\">\n    </wu-cms-content-block-two-column>\n          <wu-cms-content-block-three-column\n      ng-switch-when=\"three_column\">\n    </wu-cms-content-block-three-column>\n          <wu-cms-content-block-four-column\n      ng-switch-when=\"four_column\">\n    </wu-cms-content-block-four-column>\n          <wu-cms-content-block-five-column\n      ng-switch-when=\"five_column\">\n    </wu-cms-content-block-five-column>\n    <wu-cms-content-block-products\n     content-block=\"contentBlock\"  ng-switch-when=\"products\">\n    </wu-cms-content-block-products>\n\n\n        </div>\n      </div>\n    </pane>\n  </tabs>\n  </div>\n</div>\n");
//$templateCache.put("components/cms/content_blocks/timeline/timeline.html","<pipp-timeline-j-s source=\"contentBlock.data\" height=\"600\" width=\"90%\" start-zoom-adjust=\"0\" start-at-end=\"false\" start-at-slide=\"0\" hash-bookmark=\"false\" font=\"VFF Helvetica Neue\" lang=\"en\" state=\"timelineValues\" debug=\"false\"></pipp-timeline-j-s>");
$templateCache.put("components/cms/content_blocks/timeline/timeline.html","<div id=\"timeline-embed\"></div> <script type=\"text/javascript\"> var timeline_config = \{width: '100%', height: '80%', source: 'json/timeline', embed_id: 'timeline-embed', start_at_end: false, start_at_slide: '0', start_zoom_adjust: '3', hash_bookmark: false, font: 'Bevan-PotanoSans', debug: true, lang: 'en',            maptype: 'watercolor', css: 'app/styles/timeline.css', js: 'app/scripts/timeline-min.js'\}    </script>    <script type=\"text/javascript\" src=\"app/scripts/storyjs-embed.js\"></script>");
$templateCache.put("components/cms/content_blocks/maintenance/maintenance.html","<div class=\"container\">\n  <div class=\"row\">\n    <div class=\"col-xs-12\">\n      <img src=\"http://www.valleyforge.com/assets/images/underconstructions.jpg\" style=\"width:100%\" />\n    </div>\n  </div>\n</div>\n");
$templateCache.put("components/footer/footer.html","<footer style=\"background-color: #222222;\">\n  <div class=\"wu-cms-content-block\" style=\"color: #fff\">\n    <div class=\"wu-cms-content-block__footer\">\n      <div class=\"container\">\n          <div id=\"\" class=\"row\">\n            <div class=\"col-sm-6\">\n              <div class=\"col-xs-12\">\n                <p> <a href=\"#/contact-us\"> Contact Us </a>  | Site Map | <a href=\"#/privacy-policy\"> Privacy Policy </a> </p>\n              </div>\n              <div class=\"col-xs-12\">\n                <p>Copyright 2012 Valley Forge Fabrics, Inc. All Rights Reserved <br/> 2981 Gateway Drive Pompano Beach, FL 33069 <br/> <p>954 971 1776 </p>\n              </div>\n            </div>\n            <div class=\"col-sm-6\">\n              <div></div>\n            </div>\n          </div>\n        </div>\n      </div>\n  </div>\n</footer>\n");

}]);
