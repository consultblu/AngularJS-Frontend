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