app.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
    $stateProvider.state("demo", {
        url: "/demo",
        templateUrl: "app/demo/demo.html",
        controller: "DemoCtrl"
    }).state("docs", {
        url: "/",
        templateUrl: "app/docs/docs.html",
        controller: "DocsCtrl"
    }).state("examples", {
        url: "/examples",
        templateUrl: "app/examples/examples.html",
        controller: "ExamplesCtrl"
    });
    return $urlRouterProvider.otherwise('/');
}]);