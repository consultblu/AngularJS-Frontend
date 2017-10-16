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
                            "xs": "assets/images/mock_data/banners/inspire/banner_320x220_mobile.jpg",
                            "sm": "assets/images/mock_data/banners/inspire/banner_480x320_mobile.jpg",
                            "md": "assets/images/mock_data/banners/inspire/banner_768x600.jpg",
                            "lg": "assets/images/mock_data/banners/inspire/banner_992x496.jpg",
                            "xl": "assets/images/mock_data/banners/inspire/banner_1400x580.jpg"
                        }
                    }, {
                        "url": "/docs",
                        "images": {
                            "xs": "assets/images/mock_data/banners/inspire/banner_320x220_mobile.jpg",
                            "sm": "assets/images/mock_data/banners/inspire/banner_480x320_mobile.jpg",
                            "md": "assets/images/mock_data/banners/inspire/banner_768x600.jpg",
                            "lg": "assets/images/mock_data/banners/inspire/banner_992x496.jpg",
                            "xl": "assets/images/mock_data/banners/inspire/banner_1400x580.jpg"
                        }
                    }, {
                        "url": "/docs",
                        "images": {
                            "xs": "assets/images/mock_data/banners/inspire/banner_320x220_mobile.jpg",
                            "sm": "assets/images/mock_data/banners/inspire/banner_480x320_mobile.jpg",
                            "md": "assets/images/mock_data/banners/inspire/banner_768x600.jpg",
                            "lg": "assets/images/mock_data/banners/inspire/banner_992x496.jpg",
                            "xl": "assets/images/mock_data/banners/inspire/banner_1400x580.jpg"
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