    app.factory('dataFactory', ['$http', '$location', function($http, $location) {
        var dataFactory = {};
        var currentPath = $location.path();
        var results;
        var blogUrlBase = 'http://www.valleyforge.com/vffblog/?json=';
        var CseUrl = 'http://67.43.2.193/~searchpreprodvff/search.php?type=and&results=50&search=1&query=';
        dataFactory.getData = function(option) {
            console.log('apiUrl@getData = ' + apiUrl + option);
            return $http.get(apiUrl + option);
        };
        dataFactory.getBlogData = function(option, page) {
          page = "&page="+page;
            console.log('apiUrl@getBlogData = ' + blogUrlBase + option + page);
            return $http.get(blogUrlBase + option + page);
        };
        dataFactory.getCseData = function(option) {
            console.log('Google_CSEAPI@getData = ' + CseUrl + option);
            return $http.get(CseUrl + option);
        };
        return dataFactory;
    }]);
      
    app.factory('AuthenticationService', ['Base64', '$http', '$cookieStore', '$rootScope', '$timeout', function(Base64, $http, $cookieStore, $rootScope, $timeout) {
        var service = {};
        service.Login = function(username, password, callback) {
            $timeout(function() {
                var response = {
                    success: username === 'test' && password === 'test'
                };
                if (!response.success) {
                    response.message = 'Username or password is incorrect';
                }
                callback(response);
            }, 1000);
        };
        service.SetCredentials = function(username, password) {
            var authdata = Base64.encode(username + ':' + password);
            $rootScope.globals = {
                currentUser: {
                    username: username,
                    authdata: authdata
                }
            };
            $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata;
            $cookieStore.put('globals', $rootScope.globals);
        };
        service.ClearCredentials = function() {
            $rootScope.globals = {};
            $cookieStore.remove('globals');
            $http.defaults.headers.common.Authorization = 'Basic ';
        };
        return service;
    }]);
       
    app.factory('Base64', function() {
        var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        return {
            encode: function(input) {
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
                    output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) + keyStr.charAt(enc3) + keyStr.charAt(enc4);
                    chr1 = chr2 = chr3 = "";
                    enc1 = enc2 = enc3 = enc4 = "";
                } while (i < input.length);
                return output;
            },
            decode: function(input) {
                var output = "";
                var chr1, chr2, chr3 = "";
                var enc1, enc2, enc3, enc4 = "";
                var i = 0;
                var base64test = /[^A-Za-z0-9\+\/\=]/g;
                if (base64test.exec(input)) {
                    window.alert("There were invalid base64 characters in the input text.\n" + "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" + "Expect errors in decoding.");
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
    });
    
    app.factory("UsersApi", function($q, $http) {
        function _login(username, password) {
            var d = $q.defer();
            $http({
                url: 'views/login',
                method: "POST",
                data: {
                    username: username,
                    password: password
                },
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            }).success(function(response) {
                console.log('auth response', response);
            });
            return d.promise
        }
        return {
            login: _login
        };
    });

    app.factory('socialLinker', ['$window', '$location', function($window, $location) {
        return function(urlFactory) {
            return function(scope, element, attrs) {
                var getCurrentUrl, handler, popupWinAttrs;
                popupWinAttrs = "status=no, width=" + (scope.socialWidth || 640) + ", height=" + (scope.socialHeight || 480) + ", resizable=yes, toolbar=no, menubar=no, scrollbars=no, location=no, directories=no";
                getCurrentUrl = function() {
                    return attrs.customUrl || $location.absUrl();
                };
                attrs.$observe('customUrl', function() {
                    var url;
                    url = urlFactory(scope, getCurrentUrl());
                    if (element[0].nodeName === 'A' && ((attrs.href == null) || attrs.href === '')) {
                        return element.attr('href', url);
                    }
                });
                element.attr('rel', 'nofollow');
                handler = function(e) {
                    var url, win;
                    e.preventDefault();
                    url = urlFactory(scope, getCurrentUrl());
                    return win = $window.open(url, 'popupwindow', popupWinAttrs).focus();
                };
                if (attrs.customHandler != null) {
                    element.on('click', handler = function(event) {
                        var url;
                        url = urlFactory(scope, getCurrentUrl());
                        element.attr('href', url);
                        return scope.handler({
                            $event: event,
                            $url: url
                        });
                    });
                } else {
                    element.on('click', handler);
                }
                return scope.$on('$destroy', function() {
                    return element.off('click', handler);
                });
            };
        };
    }]);

    app.factory("transformRequestAsFormPost", function() {
        function transformRequest(data, getHeaders) {
            console.log('transformRequest triggered');
            var headers = getHeaders();
            headers["Content-type"] = "application/x-www-form-urlencoded; charset=utf-8";
            return (serializeData(data));
        }
        return (transformRequest);

        function serializeData(data) {
            if (!angular.isObject(data)) {
                return ((data == null) ? "" : data.toString());
            }
            var buffer = [];
            for (var name in data) {
                if (!data.hasOwnProperty(name)) {
                    continue;
                }
                var value = data[name];
                buffer.push(encodeURIComponent(name) + "=" + encodeURIComponent((value == null) ? "" : value));
            }
            var source = buffer.join("&").replace(/%20/g, "+");
            console.log('buffer', source);
            return (source);
        }
    });
    
    app.value("$sanitize", function(html) {
        console.log('santize triggered');
        return (html);
    });