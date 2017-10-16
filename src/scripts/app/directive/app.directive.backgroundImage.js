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