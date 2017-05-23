app.directive("sticky", function($window) {
  'use strict';
    return {
        link: function(scope, element, attrs) {
            var $win = angular.element($window);
            if (scope._stickyElements === undefined) {
                scope._stickyElements = [];
                $win.bind("scroll.sticky", function(e) {
                    var pos = $win.scrollTop();
                    for (var i = 0; i < scope._stickyElements.length; i++) {
                        var item = scope._stickyElements[i];
                        if (!item.isStuck && pos > item.start) {
                            item.element.addClass("stuck");
                            item.element.parent().addClass("fixed_nav");
                            item.isStuck = true;
                            if (item.placeholder) {
                                item.placeholder = angular.element("<div></div>").css({
                                    height: item.element.outerHeight() + "px"
                                }).insertBefore(item.element);
                            }
                        } else if (item.isStuck && pos < item.start) {
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
                    for (var i = 0; i < scope._stickyElements.length; i++) {
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

app.directive('mAppLoading', function($animate) {
  'use strict';
  return({
    templateUrl: 'components/cms/splash/splash.html',
    replace: true,
    //link: link,
    restrict: "E",
    controller: ["$scope", "$rootScope", "$window", "$element", "$attrs", "$state", "$location", "anchorSmoothScroll","dataFactory", function($scope, $rootScope, $window, $element, $attrs, $state, $location, anchorSmoothScroll, dataFactory) {
      var keys = {37: 1, 38: 1, 39: 1, 40: 1};
      function preventDefault(e) {
        e = e || window.event;
        if (e.preventDefault) {
					e.preventDefault();
				}
        e.returnValue = false;
      }
      function preventDefaultForScrollKeys(e) {
          if (keys[e.keyCode]) {
              preventDefault(e);
              return false;
          }
      }
      function disableScroll() {
        if (window.addEventListener) {// older FF
          window.addEventListener('DOMMouseScroll', preventDefault, false);
					window.onwheel = preventDefault; // modern standard
					window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
					window.ontouchmove  = preventDefault; // mobile
					document.onkeydown  = preventDefaultForScrollKeys;
					//angular.element('.scrollArea').
				}
      }
      function enableScroll() {
        if (window.removeEventListener) {
          window.removeEventListener('DOMMouseScroll', preventDefault, false);
          window.onmousewheel = document.onmousewheel = null;
          window.onwheel = null;
          window.ontouchmove = null;
          document.onkeydown = null;
				}
      }
      if($window.location.pathname !== "/lp/home"){
        $element.remove();
      } else {
        disableScroll();
				dataFactory.getData('/menu').success(function(data) {
					//console.log('headerMenu', data.header);
					$scope.splash = data.splash;
				});
//				var splashArray = $scope.splash;
				console.log($scope.splash);
      }
      //$element.bind("wheel", function() {
        //event.preventDefault($window);            
      //  console.log('Scrolling to MainContent');
      //});
      $scope.leave = function(){
        anchorSmoothScroll.scrollTo('maincontent', 'splash');
        setTimeout( 
          function(){
            $element.remove();
            enableScroll();                
          }, (2 * 900)
        );                        
        //$element.hide();
      };
      
    }]
  });
  function link(scope, element, attributes) {        
    $animate.leave(element.children().eq(1)).then(function() {          
      function cleanupAfterAnimation() {          
        console.log(element);
        console.log(scope);
        element.remove();
        scope = element = attributes = null;
      }
    });
  }
});

app.directive('menuUtility', function() {
  'use strict';
  return {
  templateUrl: 'components/menu_utility/menu_utility.html',
  restrict: 'E',
  replace: true,
  controller: ["$scope", "$rootScope", "dialogs", "$modal", "$http", "$state", "$mdDialog","dataFactory",  function($scope, $rootScope, dialogs, $modal, $http, $state,$mdDialog, dataFactory ) {
    $scope.collapse = false;
    //$scope.showSearch = true;
    $scope.$watch('collapse', function() {});
    var closeMenu = function() {
        console.log($scope.collapse);
    };
    console.log('$rootScope.currentUser', $rootScope.currentUser);
    $scope.username = $rootScope.currentUser;
    
    $scope.home_url = function(){
      if($rootScope.currentUser === 'procsupportgroup@marriott.com'){
        return "http://vffabrics.com/marriott/";
      }else{
        return "/#/lp/home";
      }
    };
    $rootScope.logIn = function() {
      console.log("Login function executed!!");
        $scope.dlg = dialogs.create('index_new.php/views/login-form/', 'LoginModalCtrl', {}, {
            key: true,
            back: 'static'
        });
        $scope.dlg.result.then(function(username) {
          console.log($rootScope.currentUser);
          //$scope.currentUser = username;
            
        }, function() {
            $scope.email = 'You decided not to enter in your name, that makes me sad.';
        });
    };
    $scope.logOut = function($scope) {
        var instance = $modal.open({
            templateUrl: 'index_new.php/views/logout-form',
            controller: function($scope) {
                $scope.Yes = function() {
                    $http({
                        url: 'index_new.php/account/logout',
                        method: "GET"
                    }).success(function(response) {
                        $scope.$close(undefined);
                        console.log('Bye bye');
                    });
                };
            },
            controllerAs: 'LoginModalCtrl'
        });
        instance.result.then(function(result) {
            $rootScope.currentUser = undefined;
            $state.go('home');
        });
    };
    $scope.resetPassword = function() {
        $scope.dlg = dialogs.create('/views/reset-password', '', {}, {
            key: false,
            back: 'static'
        });
        $scope.dlg.result.then(function(email) {
            $scope.name = email;
        }, function() {
            $scope.email = 'You decided not to enter in your name, that makes me sad.';
        });
    };
    $scope.submitResetPassword = function() {
        $scope.dlg.close();
        console.log(angular.element('#forgot_password_form').serialize());
        $.post('/views/reset-password', angular.element('#forgot_password_form').serialize()).done(function(response) {
            console.log('submitResetPassword', response);
        });
    };
    
    $scope.showAdvanced = function(ev) {
        $mdDialog.show({
          controller: DialogController,
          templateUrl: '/views/login-form/',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
          fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        })
        .then(function(answer) {
          $scope.status = 'You said the information was "' + answer + '".';
        }, function() {
          $scope.status = 'You cancelled the dialog.';
        });
      };
      $scope.showSearch = function(data) {
        $mdDialog.show({
          locals:{dataToPass: $scope.searchResults},
          controller: DialogController,
          templateUrl: 'components/cms/content_blocks/search_results.html',
          parent: angular.element(document.body),
          //targetEvent: ev,
          clickOutsideToClose:true,
          fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        })
        .then(function(answer) {
          $scope.status = 'You said the information was "' + answer + '".';
        }, function() {
          $scope.status = 'You cancelled the dialog.';
        });
      };         
  var timeoutPromise;
  var delayInMs = 2000;
  $scope.$watch('GoogleCSE', function(GoogleCSE) {
    console.log(GoogleCSE);
    if(GoogleCSE !== undefined){
    
      clearTimeout(timeoutPromise);  //does nothing, if timeout alrdy done
      timeoutPromise = setTimeout(function(){   //Set timeout
        dataFactory.getCseData(GoogleCSE).success(function(data) {
          console.log('results', data);
          $scope.searchResults = data;
          $scope.showSearch(data);
        });
      },delayInMs);
    }
  });
  
  function DialogController($scope, $mdDialog) {
    $scope.hide = function() {
      $mdDialog.hide();
    };
    $scope.cancel = function() {
      $mdDialog.cancel();
    };
    $scope.answer = function(answer) {
      $mdDialog.hide(answer);
    };
    console.log($scope);
   /* $scope.submitVffLogin = function() {
      //
      console.log(angular.element('#vff_login_form').serialize());
      $.post('/views/login-form', angular.element('#vff_login_form').serialize()).done(function(response, status) {
        if(status === 'success') {            
          //console.log('toState',$rootScope.destUrl.name );
         // console.log('$stateParams',$stateParams);
          $stateParams.book = $rootScope.destUrl.book;
          $stateParams.page = $rootScope.destUrl.page;
          $state.go($rootScope.destUrl.name, $stateParams);
          $scope.dlg.close();
        }else{
          console.log('something went wrong!');  
        }
      });
    };	      */
  }
  $scope.openProfileMenu = function(){
    angular.element('#user_menu').show(); 
  };
  $scope.closeProfileMenu = function(){
    angular.element('#user_menu').hide(); 
  };
    $scope.utilityMenu = [{
        "url": "/profile/",
        "custom_url": "",
        "label": "Profile",
        "icon": "",
        "channel": "lp",
        "parent": "0"
    }, {
        "url": "/cart/",
        "custom_url": "",
        "label": "Cart",
        "icon": "",
        "channel": "lp",
        "parent": "0"
    }, {
        "url": "/history/",
        "custom_url": "",
        "label": "Sample Request History",
        "icon": "",
        "channel": "lp",
        "parent": "0"
    }, {
        "url": "/favorites/",
        "custom_url": "",
        "label": "Favorites",
        "icon": "",
        "channel": "lp",
        "parent": "0"
    }];
    $scope.apply;
    return $scope;
  }]
  };
});
app.directive('menuHeader', function() {
    'use strict';
    return {
        templateUrl: 'components/menu_header/menu_header.html',
        restrict: 'E',
        replace: true,
        controller: ["$scope","dataFactory","$mdSidenav", "$filter", function($scope,dataFactory,$mdSidenav, $filter) {
            $scope.collapse = false;
            $scope.$watch('collapse', function() {});
            var closeMenu = function() {
                //console.log($scope.collapse);
            };
            $scope.opened = false;
            $scope.isSidenavOpen = false;   
            $scope.menuTitle = "Menu";     
            function buildToggler(componentId) {
              return function() {
                $mdSidenav(componentId).toggle();
                //console.log('sidenav is ' + ($scope.isSidenavOpen ? 'open' : 'closed'));
                angular.element(document).find('#nav-icon3').toggleClass('open');
                $scope.mainMenu ? true : false;
                $scope.submenu ? true : false;
                //angular.element('.mainmenu').toggleClass('ng-hide');
                $scope.nav('main');
              };
            }
            $scope.toggleLeft = buildToggler('left');
            $scope.toggleRight = buildToggler('right');
            dataFactory.getData('/menu').success(function(data) {
              //console.log('headerMenu', data.header);
              $scope.headerMenu = data.header;
							$scope.splash = data.splash;
            });
						//$scope.error(function(error) {});
            $scope.mainMenu = true;
            $scope.hassubmenu = false;
            $scope.donotshow = true;
            $scope.close = function() {
              $mdSidenav('right').close()
              .then(function(){
                $log.debug("close RIGHT is done");
              });
            };
            $scope.nav = function(obj, $event){
              $scope.donotshow = false;
              //console.log(obj);
              if (obj === 'main') {
                //console.log('Parent Found', obj.parent);
                $scope.menuTitle = "Menu";
                $scope.mainMenu = true;
                $scope.showsubmenu = false;
                $scope.donotshow = true;
              }
              if (obj.hassubmenu === true) {
                //console.log('HasSubmenu is True', obj.parent);
                //console.log(obj.submenu);
                $scope.menuTitle = obj.label;
                $scope.mainMenu = false;
                $scope.showsubmenu = true;
                $scope.submenu = obj.submenu;                    
              }
            };
            $scope.apply;
            return $scope;
        }]
    };
});
app.directive('wuCmsContentBlockTitleBar', function() {
    'use strict';
    return {
        templateUrl: 'components/cms/content_blocks/title_bar/title_bar.html',
        restrict: 'E',
        replace: true
    };
});
app.directive('wuCmsContentBlockStandardBlockVideo', function() {
    'use strict';
    return {
        templateUrl: 'components/cms/content_blocks/standard_block_video/standard_block_video.html',
        restrict: 'E',
        replace: true
    };
});
app.directive('wuCmsContentBlockStandardBlock', function() {
    'use strict';
    return {
        templateUrl: 'components/cms/content_blocks/standard_block/standard_block.html',
        restrict: 'E',
        replace: true
    };
});
app.directive('wuCmsContentBlockTwoColumn', function() {
    'use strict';
    return {
        templateUrl: 'components/cms/content_blocks/two_column/two_column.html',
        restrict: 'E',
        replace: true
    };
});
app.directive('wuCmsContentBlockThreeColumn', function() {
    'use strict';
    return {
        templateUrl: 'components/cms/content_blocks/three_column/three_column.html',
        restrict: 'E',
        replace: true
    };
});
app.directive('wuCmsContentBlockFourColumn', function() {
    'use strict';
    return {
        templateUrl: 'components/cms/content_blocks/four_column/four_column.html',
        restrict: 'E',
        replace: true
    };
});
app.directive('wuCmsContentBlockFiveColumn', function() {
    'use strict';
    return {
        templateUrl: 'components/cms/content_blocks/five_column/five_column.html',
        restrict: 'E',
        replace: true
    };
});
app.directive('wuCmsContentBlockHorizontalRule', function() {
    'use strict';
    return {
        templateUrl: 'components/cms/content_blocks/horizontal_rule/horizontal_rule.html',
        restrict: 'E',
        replace: true
    };
});
app.directive('wuCmsContentBlock', function() {
    'use strict';
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
                if ($scope.contentBlock.alignment === 'blog') {
                    cssClasses.push('wu-cms-content-block--center');
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
app.directive('wuCmsContentBlockBannerCarousel', function() {
    'use strict';
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
app.directive('wuCmsContentBlockBanner2', function() {
    'use strict';
    return {
        templateUrl: 'components/cms/content_blocks/banner2/banner2.html',
        restrict: 'E',
        replace: true,
        scope: {
            contentBlock: '='
        },
        link: function(scope, element, attributes, controller, $transclude) {
          element.addClass('rsBanner fullWidth');
        }
    };
});
app.directive('wuCmsContentBlockBannerCarousel2', function( $compile, $sce ) {
    'use strict';
    return {
      compile: function(tElem, tAttrs){
        return function(scope, iElem, iAttrs){
          // When trying to add the same markup here, Angular will no longer
          // process the "another-directive" directive since the compilation is
          // already done and we're merely linking with the scope here
          //iElem.append('<div another-directive></div>');
          var escapeHtml = function(value) {
            var trustAsHtml = function(value) {
               return $sce.trustAsHtml(value);
            };
            var htmlEntities = value.replace(/[\u00A0-\u9999<>\&\'\"]/gim, function(i) {
                  return '&#' + i.charCodeAt(0) + ';';
                });
            return htmlEntities;
          };
          var carousel = {};
          console.log(scope.contentBlock);
          angular.forEach(scope.contentBlock, function(value, key){
            if(value.background_video){
              carousel.$bannerBackground = '<video class=\"rsVideo\" name=\"media\" poster=\"' + value.background_image + '\" loop muted>        <source src=\"' + value.background_video + '\" type=\"video/mp4\" /></video>';
            } else {
              carousel.$bannerBackground = '<img class=\"rsImg\" src=\"' + value.background_image + '\" alt=\"\" />\n';
            }
            //carousel.$bannersubHeader = '<p>' + value.subhead_text + '</p>\n';
            //carousel.$bannerHeaderImage = '<img class=\"HeaderImg\" src=\"' + value.header_image + '\" />\n';
            carousel.$bannerHeader = '<div class=\"rsABlock\">\n<div class=\"container\">';
            if(value.alignment && value.alignment != " ") {
              carousel.$bannerHeader = carousel.$bannerHeader + '<div class=\"jumbotron jumbotron-' + value.alignment + '\">';
            } else {
              carousel.$bannerHeader = carousel.$bannerHeader + '<div class=\"jumbotron\">';
            }
            if(value.header_image) {
							carousel.$bannerHeader = carousel.$bannerHeader + '<img class=\"HeaderImg\" src=\"' + value.header_image + '\" />';
						}
            if(value.subhead_text) {
							carousel.$bannerHeader = carousel.$bannerHeader + '<p class=\"HeaderText\" ng-bind-html=\"value.subhead_text\">' + escapeHtml(value.subhead_text) + '</p>';
						}
            if(value.button_text || value.url) {
							carousel.$bannerHeader = carousel.$bannerHeader + '<p><a class="wu-btn wu-btn--inline ng-binding wu-btn--transparent-black" href="' + value.url + '">' + value.button_text + '</a></p>';
						}
            carousel.$bannerHeader = carousel.$bannerHeader + '</div>\n</div>\n</div>';
            carousel.$banner = '<div id="' + key + '">' + carousel.$bannerBackground + carousel.$bannerHeader + '</div>';
            carousel.$banners = carousel.$banners + carousel.$banner;
          });
          carousel.$container = $("<div id=\"full-width-slider\" class=\"royalSlider heroSlider rsMinW rsHor rsWithBullets\"></div>").append(carousel.$banners);
          carousel.$rSlider = $("<div class=\"sliderContainer fullWidth clearfix\"></div>").append(carousel.$container);
          iElem.append(carousel.$rSlider);
          iElem.append("<p ng-bind-html=\"contentBlock.subhead_text\"></p>");
          var callRS = function() {
            iElem.find('#full-width-slider').royalSlider({
              arrowsNav: true,
              loop: true,
              keyboardNavEnabled: true,
              controlsInside: false,
              imageScaleMode: 'fill',
              arrowsNavAutoHide: true,
              autoScaleSlider: true, 
              autoScaleSliderWidth: 992,     
              autoScaleSliderHeight: 300,
              controlNavigation: 'bullets',
              thumbsFitInViewport: false,
              navigateByClick: false,
              startSlideId: 0,
              autoPlay: {
                enabled: true,
                stopAtAction: true,
                pauseOnHover: true,
                delay: 3000
                },
              transitionType:'move',
              globalCaption: false,
              deeplinking: {
                enabled: true,
                change: false
              },
              // size of all images http://help.dimsemenov.com/kb/royalslider-jquery-plugin-faq/adding-width-and-height-properties-to-images 
              imgWidth: 1400,
              imgHeight: 680	
            });
            var slider = angular.element(".royalSlider").data('royalSlider'),
              prevSlideVideo,
              playSlideVideo = function() {
                if(prevSlideVideo) {
                  prevSlideVideo.pause();
                }
                var video = slider.currSlide.content.find('video');
                if(video.length) {
                  prevSlideVideo = video[0];
                  prevSlideVideo.play();
                } else {
                  prevSlideVideo = null;
                }
                
              };
            slider.ev.on('rsAfterSlideChange', playSlideVideo);
            playSlideVideo();
            slider.playVideo();
          };
          callRS();
        };
      },
        restrict: 'AE',
        scope: {
            contentBlock: '='
        },
        replace: true
    };
});
app.directive('wuCmsContentBlockFluidGrid', function() {
    'use strict';
    return {
        templateUrl: 'components/cms/content_blocks/fluid_grid/fluid_grid.html',
        restrict: 'E',
        replace: true
    };
});
app.directive('wuCmsContentBlockHomeGrid', function() {
    'use strict';
    return {
        templateUrl: 'components/cms/content_blocks/home_grid.html',
        restrict: 'E',
        replace: true,
        controller: ["$scope", function($scope) {
					var gridArray = $scope.$parent.contentBlock.home_grid;
          function formatDate(date) {
            var month = [ "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
            var day = date.getDate();
            var monthIndex = date.getMonth();
            var year = date.getFullYear();
            return month[monthIndex] + day + year;
          }
					gridArray.forEach(function(tile) {
						//console.log(grid.title);
						var gridImages = tile.image_matrix;
						if (tile.randomize === "Yes") {
							var rand = gridImages[Math.floor(Math.random() * gridImages.length)];
							tile.image = rand.image_url;
						} else {
              var tileImageSelected = false;
							gridImages.forEach(function(image) {
								
                if (tileImageSelected === false) {
                  var today = formatDate(new Date());
                  if (image.start_date <= today && image.end_date >= today) {
                    //console.log("Starts:",image.start_date);
                    //console.log("Today:",today);
                    //console.log("Ends:",image.end_date);                   
                    tile.image = image.image_url;
                    tileImageSelected = true;
                  } 
                }                
							});
              if (tileImageSelected === false) {
                  //console.log("No Date match for Grid => ", tile.title);                                        
                  tile.image = gridImages[0].image_url;
                  tileImageSelected = true; 
              }
						}
					});
        }]
    };
});
app.directive('wuCmsContentBlockCallToAction', function() {
    'use strict';
    return {
        templateUrl: 'components/cms/content_blocks/call_to_action/call_to_action.html',
        restrict: 'E',
        replace: true
    };
});
app.directive('wuCmsContentBlockBanner', function() {
    'use strict';
    return {
        templateUrl: 'components/cms/content_blocks/banner/banner.html',
        restrict: 'E',
        replace: true,
        scope: {
            contentBlock: '='
        }
    };
});
app.directive('wuCmsContentBlockTabs', function() {
    'use strict';
    return {
        templateUrl: 'components/cms/content_blocks/tabs/tabs.html',
        scope: {
            contentBlock: '=',
            tabContentBlock: '='
        },
        restrict: 'E',
        replace: true,
        controller: ["$scope", "$element", "$attrs", function($scope, $element, $attrs) {
            $scope.getTabContentBlockClass = function(tabContentBlock) {
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
app.directive('wuCmsContentBlockProducts', function() {
    'use strict';
    return {
        templateUrl: 'components/cms/content_blocks/products/products.html',
        restrict: 'E',
        replace: true,
        scope: {
            contentBlock: '='
        }
    };
});
app.directive('slide', function() {});
app.directive('owlCarousel', function() {
    'use strict';
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
app.directive('headerBar', function() {
    'use strict';
    return {
        templateUrl: 'components/header/header.html',
        restrict: 'E',
    };
});
app.directive('footerBar', function() {
    'use strict';
    return {
        templateUrl: 'components/footer/footer.html',
        restrict: 'E',
        scope: {
            collapse: '='
        }
    };
});
app.directive('backgroundImage', function() {
    'use strict';
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
app.directive('toggleClass', function() {
    'use strict';
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('click', function() {
                element.toggleClass(attrs.toggleClass);
            });
        }
    };
});
app.directive('tabs', function() {
    'use strict';
    return {
        restrict: 'E',
        transclude: true,
        scope: {},
        controller: ["$scope", function($scope) {
            var panes = $scope.panes = [];
            $scope.select = function(pane) {
                angular.forEach(panes, function(pane) {
                    pane.selected = false;
                });
                pane.selected = true;
            };
            this.addPane = function(pane) {
                if (panes.length == 0) $scope.select(pane);
                panes.push(pane);
            };
        }],
        template: '<div class="tabbable  col-xs-12 col-sm-12 col-md-12 col-lg-12">' + '<ul class="nav nav-tabs">' + '<li ng-repeat="pane in panes" ng-class="{active:pane.selected}">' + '<a href="" ng-click="select(pane)">{{pane.title}}</a>' + '</li>' + '</ul>' + '<div class="tab-content" ng-transclude></div>' + '</div>',
        replace: true
    };
});
app.directive('pane', function() {
    'use strict';
    return {
        require: '^tabs',
        restrict: 'E',
        transclude: true,
        scope: {
            title: '@'
        },
        link: function(scope, element, attrs, tabsCtrl) {
            tabsCtrl.addPane(scope);
        },
        template: '<div class="tab-pane" ng-class="{active: selected}" ng-transclude>' + '</div>',
        replace: true
    };
});
app.directive('wuCmsContentBlockTimeline', function()  {
    'use strict';
    return {
        templateUrl: 'components/cms/content_blocks/timeline/timeline.html',
        restrict: 'E'
    };
});
app.directive('wuCmsContentBlockBlog', function()  {
    'use strict';
    return {
        templateUrl: 'components/cms/content_blocks/blog/blog.html',
        restrict: 'E',
        replace: true
    };
});
app.directive('wuCmsContentBlockBlogPage', function()  {
    'use strict';
    return {
        templateUrl: 'components/cms/content_blocks/blog/blog_page.html',
        restrict: 'E',
        replace: true
    };
});
app.directive('wuCmsContentBlockBlogPost', function()  {
    'use strict';
    return {
        templateUrl: 'components/cms/content_blocks/blog/blog_post.html',
        restrict: 'E',
        replace: true
    };
});
app.directive('wuCmsContentBlockMediaAds', function()  {
    'use strict';
    return {
        templateUrl: 'components/cms/content_blocks/media/advertising.html',
        restrict: 'E',
        replace: true
    };
});
app.directive('wuCmsContentBlockMediaAwards', function()  {
    'use strict';
    return {
        templateUrl: 'components/cms/content_blocks/media/awards.html',
        restrict: 'E',
        replace: true
    };
});
app.directive('wuCmsContentBlockMediaOnlineVideo', function()  {
    'use strict';
    return {
        templateUrl: 'components/cms/content_blocks/media/videos.html',
        restrict: 'E',
        replace: true
    };
});
app.directive('wuCmsContentBlockFabricCollection', function()  {
    'use strict';
    return {
        templateUrl: 'components/cms/content_blocks/fabric_collection/fabric_collection.html',
        restrict: 'E',
        replace: true
    };
});
app.directive('wuCmsContentBlockBeddingSpecBook', function()  {
    'use strict';
    return {
        templateUrl: 'components/cms/content_blocks/online_library/bedding_spec_book.html',
        restrict: 'E',
        replace: true
    };
});
app.directive('wuCmsContentBlockGradientSpecBook', function()  {
    'use strict';
    return {
        templateUrl: 'components/cms/content_blocks/online_library/gradient_spec_book.html',
        restrict: 'E',
        replace: true
    };
});
app.directive('lightgallery', function()  {
    'use strict';
    return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      if (scope.$last) {
        // ng-repeat is completed
        element.parent().lightGallery();
      }
    }
  };
});
/*app.directive('wuCmsContentBlockMediaAds', function()  {
    'use strict';
    return {
        templateUrl: 'components/cms/content_blocks/media/ads.html',
        restrict: 'E',
        replace: true
    };
});
app.directive('wuCmsContentBlockMediaAwards', function()  {
    'use strict';
    return {
        templateUrl: 'components/cms/content_blocks/media/awards.html',
        restrict: 'E',
        replace: true
    };
});
app.directive('wuCmsContentBlockMediaOnlineVideos', function()  {
    'use strict';
    return {
        templateUrl: 'components/cms/content_blocks/media/videos.html',
        restrict: 'E',
        replace: true
    };
});*/
app.directive('unbindable', function()  {
    'use strict';
    return {
        scope: true
    };
});
app.directive('sample', ['$timeout', '$document', '$state', '$modal', 'dialogs', '$compile', 'anchorSmoothScroll', "$location", '$window', function(timer, $document, $state, $modal, dialogs, $compile, $location, $window)  {
    'use strict';
    return {
        restrict: "EA",
        replace: true,
        controller: ['$scope', '$rootScope', '$document', '$state', 'anchorSmoothScroll', "$location", '$window', function($scope, $rootScope, $document, $state, anchorSmoothScroll, $location, $window) {
            this.setPreviousSample = function(v) {
                $rootScope.previousSample = v;
                $scope.$apply;
            };
            this.getPreviousSample = function() {
                return $scope.previousSample;
            };
            this.gotoElement = function(eID) {
                $window.ga('send', 'pageview', {
                    page: $location.url() + '/' + $('#' + eID + ' a').attr('id')
                });
                anchorSmoothScroll.scrollTo(eID, $scope.previousSample);
            };
            this.selectedItem = function(v) {
                $rootScope.item = v;
                $scope.$apply;
            };
            $scope.updatePreview = function(index, name, content, pattern_repeat, pattern_name, pattern_name_color, inventory, large) {
                console.log('updatePreview was triggered for ', name);
                console.log('element', angular.element("." + $scope.currentSamplePreview));
                angular.element(".og-details_inner h1").empty().append(name);
                angular.element(".sample_pattern_name").empty().append(pattern_name);
                angular.element(".sample_color_name").empty().append(pattern_name_color);
                angular.element(".sample_content").empty().append(content);
                angular.element(".sample_repeat").empty().append(pattern_repeat);
                angular.element(".sample_inventory").empty().append(inventory + ' yrds');
                angular.element(".sample_image img").attr('src', large);
                //angular.element(".sample_image img").attr('src', '/images/made/uploads/skus/' + name + '_1200_800_70_assetsimagesvff-watermark.png.jpg');
                angular.element(".og-details_inner .wu-btn").remove();
            };
        }],
        link: function(scope, element, attributes, $scope, $rootScope, $location, anchorSmoothScroll) {
            $document.bind('click', function(e) {
                e.stopPropagation();
            });
            $scope.replaceStr = function(oldString, lookFor, replaceWith) {
               // get & replce the input value
               return oldString.replace(lookFor, replaceWith);
            };
            scope.submitSample = function() {
                $scope.selectedItem(scope.item);
                //window.ga('set', 'color', 'custom data');
                console.log('color', scope.item.color);
                window.ga('send', 'pageview', {
                    'page': $window.url() + '/sample_request/' + scope.item.name,
                    'color': scope.item.color
                });
                window.ga('ecommerce:addItem', {
                    'id': scope.item.name,
                    'name': scope.item.name,
                    'sku': scope.item.name,
                    'category': scope.item.book,
                    'price': '0',
                    'quantity': '1',
                    'color': scope.item.color
                });
                console.log('addItem ' + scope.item.name);
                $.post(apiIp + 'views/ajax/', angular.element('#add_to_cart_form_' + scope.item.name).serialize()).done(function(response) {
                    console.log(response);
                    dialogs.notify('Add to Request Basket', scope.item.name + ' is now in your basket.');
                    angular.element(".cart_count .count").load('views/cart_count');
                    angular.element(".cart_count").show();
                });
            };
            scope.showPreview = function() {
              console.log('showPreview scope', scope.$parent);
                if (scope.opening == true || scope.destroying == true) {
                    return false;
                }
                scope.currentSamplePreview = attributes.id;
                $scope.gotoElement(attributes.id);
                var destroyPreview = function(x, $location) {
                    if (scope.destroying == true && scope.closingPreview == scope.openingPreview) {} else {
                        if (angular.isUndefined(x[0])) {} else {
                            scope.destroying = true;
                            scope.closingPreview = x[0].id;
                            timer(function() {
                                x.children('.og-expander').css("cssText", "height: 0;");
                            }, 0);
                            x.addClass('not-og-expanded');
                            x.removeClass('og-expanded');
                            timer(function() {
                                x.children('.og-expander').remove();
                                scope.destroying = false;
                                scope.closingPreview = null;
                            }, 800);
                        }
                    }
                };
                var createPreview = function(x, $location) {
                    if (scope.opening == true && scope.openingPreview == scope.currentSamplePreview) {} else {
                        scope.opening = true;
                        scope.openingPreview = x[0].id;
                        element.addClass('og-expanded');
                        element.removeClass('not-og-expanded');
                        element.append($compile(preview.$previewEl)(scope));
                        timer(function() {
                            element.children('.og-expander').css("cssText", "");
                            scope.opening = false;
                            scope.openingPreview = null;
                        }, 200);
                        $scope.setPreviousSample(x[0].id);
                    }
                };
                var preview = {};
                if (scope.$parent.samples) {
                    var srHtml = $.ajax({
                        url: '/views/sr/' + scope.item.name,
                        type: 'get',
                        dataType: 'html',
                        async: false,
                        cache: false,
                        success: function(data) {
                            srHtml = data;
                        }
                    }).responseText;
                    preview.$image = $('<div class="sample_image col-xs-12" style="/*background-image: url(' + attributes.largesrc + ');*/ height: inherit; background-size: cover;" unbindable ><img src="' + attributes.largesrc + '" unbindable /></div>');
                    preview.$href = srHtml;
                    preview.$title = $('<h1 class="hide-for-small  col-xs-12">' + scope.item.name + '</h1>');
                    
                    //var testContent = $scope.replaceStr(scope.item.content, ",",", ");
                    //console.log('testContent', testContent);
                    var $isRailRoaded;
                    console.log('is rail_roaded?', scope.item.rail_roaded);
                    switch(scope.item.rail_roaded){
                      case 'y':
                        $isRailRoaded = 'SHOWN RAILROADED';
                        break;
                      case 'n':
                        $isRailRoaded = 'NO';
                        break;
                      default:
                        $isRailRoaded = 'NO';
                    }
                    preview.$description = $('<p class="col-xs-6 col-lg-4" style="font-weight:bold;">Pattern:</p><p class="sample_pattern_name col-xs-6 col-lg-8">' + scope.item.pattern_name + '</p><p class="col-xs-6 col-lg-4" style="font-weight:bold;">Color:</p><p class="sample_color_name col-xs-6 col-lg-8">' + scope.item.pattern_name_color + '</p><p class="col-xs-6 col-lg-4" style="font-weight:bold;">Content:</p><p class="sample_content col-xs-6 col-lg-8">' + scope.item.content + '</p><p class="col-xs-6 col-lg-4" style="font-weight:bold;">Repeat:</p><p class="sample_repeat col-xs-6 col-lg-8">' + scope.item.pattern_repeat + '</p><p class="col-xs-6 col-lg-4" style="clear: left; font-weight:bold;">Railroaded:</p><p class="sample_repeat col-xs-6 col-lg-8">' + $isRailRoaded + '</p><p class="col-xs-6 col-lg-4" style="clear: left; font-weight: bold;">In Stock:</p><p class="sample_inventory col-xs-6 col-lg-8">' + scope.item.inventory + ' yrds</p><p style="clear: both; display: block;"><a tooltip="Add to Favorites" data-toggle="modal" class="product_icon hide" data-target="#favorite-' + scope.item.name + '" ><i class="fa fa-star-o" style="font-size: 30px;"></i></a><a class="product_icon" tooltip="Print Specs" href="custom/specs/' + scope.item.name + '" target="_blank" class="js_window"><img ng-src="http://c67bfc7c934596c5d2de-384a0fe271c727cec0e8a9b32788243a.r54.cf1.rackcdn.com/icon-specsheet.png" style="margin-top: -13px;"/></a></p>');
                    preview.$alternativesInner = '';
                    /*if(scope.item.alternate){*/
                      angular.forEach(scope.item.alternate, function(value) {
                          preview.$alternativesInner = preview.$alternativesInner + '<div class="alternative-item  col-lg-2 col-xs-2"><img src="' + apiIp + 'images/made/uploads/skus/' + value.name + '_99_66_70.jpg" " alt="' + value.name + '" /></div>';
                      });
                    
                      preview.$alternatives = $('<div class="og-alternatives col-lg-4 col-md-4 col-sm-4 col-xs-12"><h4>Available in-stock alternatives</h4></div>').append(preview.$alternativesInner);
                    /*}*/
                    preview.$moreItems = '';
                    angular.forEach(scope.item.more, function(value, index) {
                        /*preview.$moreItems = preview.$moreItems + '<div class="more-item more-item- col-lg-2 col-xs-2"><a id="' + value.name + '" ng-click="updatePreview(\'' + index + '\', \'' + value.name + '\', \'' + value.content + '\', \'' + value.pattern_repeat + '\', \'' + value.pattern_name + '\', \'' + value.pattern_name_color + '\', \'' + value.inventory + '\', \'' + value.large + '\')" ><img src="' + apiIp + 'images/made/uploads/skus/' + value.name + '_99_66_70.jpg" " /><div class="more-item-text"><p>' + value.name + '</p></div></a></div>';
                    });*/
                      preview.$moreItems = preview.$moreItems + '<div class="more-item more-item- col-lg-2 col-xs-2"><a id="' + value.name + '" ng-click="updatePreview(\'' + index + '\', \'' + value.name + '\', \'' + value.content + '\', \'' + value.pattern_repeat + '\', \'' + value.pattern_name + '\', \'' + value.pattern_name_color + '\', \'' + value.inventory + '\', \'' + value.large + '\')" ><img src="' + apiIp + value.thumb + '" /><div class="more-item-text"><p>' + value.name + '</p></div></a></div>';
                    });
                    preview.$moreInner = $('<div style="height: 202px; overflow:scroll;" ></div>').append(preview.$moreItems);
                    preview.$more = $('<div class="og-more col-lg-8 col-md-8 col-sm-8 col-xs-12"><h4>Available Colors</h4></div>').append(preview.$moreInner);
                }
                var cb = scope.$parent.$parent.contentBlock; 
                if (typeof cb != "undefined"){
                  
                  if (cb.fabric_collection && scope.$parent.$parent.contentBlock.fabric_collection != "undefined") {
                      preview.$image = $('<div class="col-xs-12" style="/*background-image: url(' + attributes.largesrc + ');*/ height: inherit; background-size: cover;"><img src="' + attributes.largesrc + '" /></div>');
                      preview.$title = $('<h1 class="hide-for-small">' + scope.item.title + '</h1>');
                      preview.$description = $('<p>' + scope.item.summary + '</p>');
                      preview.$href = $('<a ng-href="' + '/#/design-library/' + scope.item.book + '" class="wu-btn wu-btn--transparent-black"  id="dlLink">' + attributes.button + '</a>');
                      preview.$more = $('');
                  }
                  if (cb.advertising && cb.advertising != "undefined") {
                      preview.$image = $('<div class="col-xs-12" style="background-image: url(' + attributes.largesrc + '); height: inherit;  background-size: 100%;  background-repeat: no-repeat"><img src="/app/images/clear.png" /></div>');
                      preview.$title = $('<h1 class="hide-for-small">' + scope.item.name + '</h1>');
                      preview.$description = $('<h5>' + scope.item.year + '</h5>');
                      preview.$href = $('');
                      preview.$more = $('');
                  }
                  if (cb.awards && cb.awards != "undefined") {
                      preview.$image = $('<div class="col-xs-12" style="background-image: url(' + attributes.largesrc + '); height: inherit; background-size: 100%;  background-repeat: no-repeat"><img src="/app/images/clear.png" /></div>');
                      preview.$title = $('<h1 class="hide-for-small">' + scope.item.name + '</h1>');
                      preview.$description = $('<h5>' + scope.item.year + '</h5><h5>' + scope.item.frm + '</h5>');
                      preview.$href = $('');
                      preview.$more = $('');
                  }
                  if (cb.videos && cb.videos != "undefined") {
                      preview.$image = $('<div class="col-xs-12" style="-background-image: url(' + attributes.largesrc + '); height: inherit; background-size: cover; background-position: 50% 50%; height: 433px;"><youtube-video video-id="\'' + attributes.videoid + '\'"></youtube-video></div>');
                      preview.$title = $('<h1 class="hide-for-small">' + scope.item.name + '</h1>');
                      preview.$description = $('<h5>' + scope.item.summary + '</h5>');
                      preview.$href = $('');
                      preview.$more = $('');
                  }
                  if (cb.bedding_spec_book && cb.bedding_spec_book != "undefined") {
                      preview.$image = $('<div class="col-xs-12" style="/*background-image: url(' + attributes.largesrc + ');*/ height: inherit; background-size: cover;"><img src="' + attributes.largesrc + '" /></div>');
                      preview.$title = $('<h1 class="hide-for-small">' + scope.item.title + '</h1>');
                      preview.$description = $('');
                      preview.$href = $('<div class="cLink"><a ng-href="' + attributes.largesrc + '" class="wu-btn wu-btn--transparent-black"  id="dlLink" target="_blank">Get Image</a></div><div  class="cLink"><a ng-href="' + scope.item.editable_spec + '" class="wu-btn wu-btn--transparent-black"  id="dlLink" target="_self">Get Editable Spec</a></div>');
                      preview.$more = $('');
                  }
                }
                preview.$detailsInner = $('<div class="og-details_inner  col-xs-12"></div>').append(preview.$title, preview.$description, preview.$href);
                preview.$details = $('<div class="og-details xlarge-4 col-lg-4 col-md-4 col-sm-4 col-xs-4 columns"></div>').append(preview.$detailsInner);
                preview.$loading = $('<div class="og-loading-"></div>');
                preview.$fullimage = $('<div class="og-fullimg xlarge-8 col-lg-8 col-md-8 col-sm-8 col-xs-8"></div>').append(preview.$loading).append(preview.$image);
                preview.$closePreview = $('<span class="preview-close"></span>');
                preview.$previewInner = $('<div class="og-expander-inner preview-inner"></div>').append(preview.$closePreview, preview.$details, preview.$fullimage, preview.$alternatives, preview.$more);
                preview.$previewContainer = $('<div class="container"></div>').append(preview.$previewInner);
                preview.$previewEl = $('<div class="og-expander" style="height:0px;"></div>').append(preview.$previewContainer);
                if (element.hasClass('og-expanded')) {
                    scope.closingPreview = element[0].id;
                    destroyPreview(element);
                    return false
                }
                if (element.hasClass('not-og-expanded')) {
                    if (scope.opening == true) {
                        return false;
                    } else {
                        scope.openingPreview = scope.currentSamplePreview;
                        if (element[0].id != $scope.getPreviousSample() && $scope.getPreviousSample() != null) {
                            scope.closingPreview = $scope.getPreviousSample();
                            destroyPreview(angular.element('#' + $scope.getPreviousSample()));
                        }
                        createPreview(element);
                    }
                }
            };
        }
    }
}]);
app.directive('socialFacebook', ['socialLinker', function(linker) {
    return {
        restrict: 'ACEM',
        scope: angular.extend({
            status: '@status',
            title: '@title'
        }, sharedScopeDefinition),
        link: linker(function(scope, url) {
            var shareUrl;
            shareUrl = ["https://facebook.com/sharer.php?"];
            shareUrl.push("u=" + (encodeURIComponent(url)));
            shareUrl.push("title=" + scope.title);
            return shareUrl.join('&');
        })
    };
}]);
app.directive('socialTwitter', ['socialLinker', function(linker) {
    return {
        restrict: 'ACEM',
        scope: angular.extend({
            status: '@status',
            title: '@title'
        }, sharedScopeDefinition),
        link: linker(function(scope, url) {
            scope.status || (scope.status = scope.title + " - " + url);
            return "https://twitter.com/intent/tweet?text=" + (encodeURIComponent(scope.status));
        })
    };
}]);
app.directive('socialGplus', ['socialLinker', function(linker) {
    return {
        restrict: 'ACEM',
        scope: sharedScopeDefinition,
        link: linker(function(scope, url) {
          var shareUrl;
            shareUrl = ["https://plus.google.com/share?"];
            shareUrl.push("url=" + (encodeURIComponent(url)));
            shareUrl.push("title=" + scope.title);
            shareUrl.push("media=" + (encodeURIComponent(scope.media)));
            return shareUrl.join('&');
        })
    };
}]);
app.directive('socialPinterest', ['socialLinker', function(linker) {
    return {
        restrict: 'ACEM',
        scope: angular.extend({
            media: '@media',
            description: '@description',
            title: '@title'                
        }, sharedScopeDefinition),
        link: linker(function(scope, url) {
          var shareUrl;
            shareUrl = ["http://pinterest.com/pin/create/button/?"];
            shareUrl.push("url=" + (encodeURIComponent(url)));
            shareUrl.push("title=" + scope.title);
            shareUrl.push("media=" + (encodeURIComponent(scope.media)));
            shareUrl.push("description=" + scope.title);
            return shareUrl.join('&');
        })
    };
}]);
app.directive('socialStumbleupon', ['socialLinker', function(linker) {
    return {
        restrict: 'ACEM',
        scope: sharedScopeDefinition,
        link: linker(function(scope, url) {
            return "https://stumbleupon.com/submit?url=" + (encodeURIComponent(url));
        })
    };
}]);
app.directive('socialLinkedin', ['socialLinker', function(linker) {
    return {
        restrict: 'ACEM',
        scope: angular.extend({
            title: '@title',
            media: '@media',
            description: '@description'
        }, sharedScopeDefinition),
        link: linker(function(scope, url) {
          var shareUrl;
            shareUrl = ["https://linkedin.com/shareArticle?"];
            shareUrl.push("url=" + (encodeURIComponent(url)));
            shareUrl.push("title=" + scope.title);
            shareUrl.push("summary=" + (encodeURIComponent(scope.description)));
            shareUrl.push("media=" + (encodeURIComponent(scope.media)));
            return shareUrl.join('&');
        })
    };
}]);
app.directive('socialReddit', ['socialLinker', function(linker) {
    return {
        restrict: 'ACEM',
        scope: sharedScopeDefinition,
        link: linker(function(scope, url) {
            return "https://www.reddit.com/submit?url=" + (encodeURIComponent(url));
        })
    };
}]);
app.directive('socialVk', ['socialLinker', function(linker) {
    return {
        restrict: 'ACEM',
        scope: sharedScopeDefinition,
        link: linker(function(scope, url) {
            return "http://vkontakte.ru/share.php?url=" + (encodeURIComponent(url));
        })
    };
}]);
app.directive('socialOk', ['socialLinker', function(linker) {
    return {
        restrict: 'ACEM',
        scope: sharedScopeDefinition,
        link: linker(function(scope, url) {
            return "http://www.odnoklassniki.ru/dk?st.cmd=addShare&st._surl=" + (encodeURIComponent(url));
        })
    };
}]);
app.directive('socialXing', ['socialLinker', function(linker) {
    return {
        restrict: 'ACEM',
        scope: sharedScopeDefinition,
        link: linker(function(scope, url) {
            return "https://www.xing.com/spi/shares/new?url=" + (encodeURIComponent(url));
        })
    };
}]);