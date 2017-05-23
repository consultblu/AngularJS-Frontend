 
    app.config(function($sceDelegateProvider) {
        $sceDelegateProvider.resourceUrlWhitelist(['self', 'https://4252805dae76ab552633-0bff195b1e52c63f8fae47f6b90459f3.ssl.cf1.rackcdn.com/**', 'http://c67bfc7c934596c5d2de-384a0fe271c727cec0e8a9b32788243a.r54.cf1.rackcdn.com/**','http://www.youtube.com/**','https://www.youtube.com/**', 'http://74c749ed3f1bace98461-2c2004dcc2fff845ee2077a362d57d4f.r23.cf1.rackcdn.com/**']);
        $sceDelegateProvider.resourceUrlBlacklist(['http://myapp.example.com/clickThru**']);
    });

    app.config(function($httpProvider) {
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
        var param = function(obj) {
            var query = '',
                name, value, fullSubName, subName, subValue, innerObj, i;
            for (name in obj) {
                value = obj[name];
                if (value instanceof Array) {
                    for (i = 0; i < value.length; ++i) {
                        subValue = value[i];
                        fullSubName = name + '[' + i + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                } else if (value instanceof Object) {
                    for (subName in value) {
                        subValue = value[subName];
                        fullSubName = name + '[' + subName + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                } else if (value !== undefined && value !== null) query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
            }
            return query.length ? query.substr(0, query.length - 1) : query;
        };
        $httpProvider.defaults.transformRequest = [function(data) {
            return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
        }];
        $httpProvider.interceptors.push(function($timeout, $q, $injector) {
            var loginModal, $http, $state;
            $timeout(function() {
                loginModal = $injector.get('loginModal');
                $http = $injector.get('$http');
                $state = $injector.get('$state');
			 //console.log('$injector.get($state)', $injector.get('$state'));
            });
            return {
                responseError: function(rejection) {
                    if (rejection.status !== 401) {
                        return rejection;
                    }
                    var deferred = $q.defer();
                        loginModal().then(function() {
                        console.log('app.config');
                        deferred.resolve($http(rejection.config));
                    }).catch(function() {
                        $state.go('home');
                        deferred.reject(rejection);
                    });
                    return deferred.promise;
                }
            };
        });
    });

    app.config(function($httpProvider) {
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
        var param = function(obj) {
            var query = '',
                name, value, fullSubName, subName, subValue, innerObj, i;
            for (name in obj) {
                value = obj[name];
                if (value instanceof Array) {
                    for (i = 0; i < value.length; ++i) {
                        subValue = value[i];
                        fullSubName = name + '[' + i + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                } else if (value instanceof Object) {
                    for (subName in value) {
                        subValue = value[subName];
                        fullSubName = name + '[' + subName + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                } else if (value !== undefined && value !== null) query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
            }
            return query.length ? query.substr(0, query.length - 1) : query;
        };
        $httpProvider.defaults.transformRequest = [function(data) {
            return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
        }];
        $httpProvider.interceptors.push(function($timeout, $q, $injector) {
            var loginModal, $http, $state;
            $timeout(function() {
                loginModal = $injector.get('loginModal');
                $http = $injector.get('$http');
                $state = $injector.get('$state');
			 //console.log('$injector.get($state)', $injector.get('$state'));
            });
            return {
                responseError: function(rejection) {
                    if (rejection.status !== 401) {
                        return rejection;
                    }
                    var deferred = $q.defer();
                        loginModal().then(function() {
                        console.log('app.config');
                        deferred.resolve($http(rejection.config));
                    }).catch(function() {
                        $state.go('home');
                        deferred.reject(rejection);
                    });
                    return deferred.promise;
                }
            };
        });
    });

