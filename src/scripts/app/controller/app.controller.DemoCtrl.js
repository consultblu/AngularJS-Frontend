app.controller("DemoCtrl", ["$scope", function($scope) {
    $scope.contentBlocks = [
        {
            content_block_type: 'standard_block',
            color: 'black',
            alignment: 'left',
            standard_block: {
                headline: "Selling On Weaver",
                body: "Join our creative community of designers, artists and buyers to explore the infinite possibilities of design. Inspire, Create and Design on Weaver, a creative community like no other!",
                link: {
                    url: "/search",
                    label: "Search me"
                }
            }
        }, {
            content_block_type: "call_to_action",
            call_to_action: [
                {
                    "url": "/boards/25",
                    "image_url": "assets/images/mock_data/cta/featured-designer.png"
                }, {
                    "url": "/search",
                    "image_url": "assets/images/mock_data/cta/most-loved.png"
                }, {
                    "url": "/how-it-works",
                    "image_url": "assets/images/mock_data/cta/newest-designs.png"
                }
            ]
        }, {
            content_block_type: 'banner',
            banner: {
                url: "/search",
                images: {
                    "xs": "assets/images/mock_data/banners/inspire/banner_320x220_mobile.jpg",
                    "sm": "assets/images/mock_data/banners/inspire/banner_480x320_mobile.jpg",
                    "md": "assets/images/mock_data/banners/inspire/banner_768x600.jpg",
                    "lg": "assets/images/mock_data/banners/inspire/banner_992x496.jpg",
                    "xl": "assets/images/mock_data/banners/inspire/banner_1400x580.jpg"
                }
            }
        }, {
            content_block_type: 'banner_carousel',
            banner_carousel: [
                {
                    url: '/search',
                    images: {
                        "xs": "assets/images/mock_data/banners/inspire/banner_320x220_mobile.jpg",
                        "sm": "assets/images/mock_data/banners/inspire/banner_480x320_mobile.jpg",
                        "md": "assets/images/mock_data/banners/inspire/banner_768x600.jpg",
                        "lg": "assets/images/mock_data/banners/inspire/banner_992x496.jpg",
                        "xl": "assets/images/mock_data/banners/inspire/banner_1400x580.jpg"
                    }
                }, {
                    url: '/search',
                    images: {
                        "xs": "assets/images/mock_data/banners/inspire/banner_320x220_mobile.jpg",
                        "sm": "assets/images/mock_data/banners/inspire/banner_480x320_mobile.jpg",
                        "md": "assets/images/mock_data/banners/inspire/banner_768x600.jpg",
                        "lg": "assets/images/mock_data/banners/inspire/banner_992x496.jpg",
                        "xl": "assets/images/mock_data/banners/inspire/banner_1400x580.jpg"
                    }
                }, {
                    url: '/search',
                    images: {
                        "xs": "assets/images/mock_data/banners/inspire/banner_320x220_mobile.jpg",
                        "sm": "assets/images/mock_data/banners/inspire/banner_480x320_mobile.jpg",
                        "md": "assets/images/mock_data/banners/inspire/banner_768x600.jpg",
                        "lg": "assets/images/mock_data/banners/inspire/banner_992x496.jpg",
                        "xl": "assets/images/mock_data/banners/inspire/banner_1400x580.jpg"
                    }
                }
            ]
        }, {
            content_block_type: 'standard_block',
            color: 'black',
            alignment: 'center',
            standard_block: {
                headline: "Selling On Weaver",
                body: "Join our creative community of designers, artists and buyers to explore the infinite possibilities of design. Inspire, Create and Design on Weaver, a creative community like no other!",
                button: {
                    url: "/how-it-works",
                    label: "CLICK",
                    style: "blue"
                }
            }
        }, {
            content_block_type: 'standard_block',
            alignment: 'right',
            standard_block: {
                headline: "Selling On Weaver",
                body: "Join our creative community of designers, artists and buyers to explore the infinite possibilities of design. Inspire, Create and Design on Weaver, a creative community like no other!"
            }
        }, {
            content_block_type: 'standard_block',
            standard_block: {
                headline: "Selling On Weaver",
                body: "Join our creative community of designers, artists and buyers to explore the infinite possibilities of design. Inspire, Create and Design on Weaver, a creative community like no other!"
            }
        }, {
            content_block_type: 'horizontal_rule'
        }, {
            content_block_type: 'standard_block',
            alignment: "center",
            standard_block: {
                headline: "Any Questions?"
            }
        }, {
            content_block_type: 'two_column',
            two_column: [
                {
                    headline: "Selling On Weaver",
                    body: "Join our creative community of designers, artists and buyers to explore the infinite possibilities of design. Inspire, Create and Design on Weaver, a creative community like no other!",
                    button: {
                        url: "/how-it-works",
                        label: "CLICK",
                        style: "blue"
                    }
                }, {
                    headline: "Selling On Weaver",
                    body: "Join our creative community of designers, artists and buyers to explore the infinite possibilities of design. Inspire, Create and Design on Weaver, a creative community like no other!",
                    link: {
                        url: "/how-it-works",
                        label: "click me"
                    }
                }, {
                    headline: "Selling On Weaver",
                    body: "Join our creative community of designers, artists and buyers to explore the infinite possibilities of design. Inspire, Create and Design on Weaver, a creative community like no other!"
                }
            ]
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