/*
 * Image Grid Animator 1.0
 * © The Webmen 2013
 */

(function($){
    $.fn.imageGridify = function(options) {
     
        var defaults = {
            width: 185,
            height: 210,
            border: 10,
            easing: 'swing'
        };
     
        var options = $.extend(defaults, options);
        var totalWidth = 0;
        var isAnimating = false;
        var zIndex = 110;
        
        var thumbHeight = function(blocks) {
            return blocks*options.height+(blocks-1)*options.border;
        }

        var thumbWidth = function(blocks) {
            return blocks*options.width+(blocks-1)*options.border;
        }

        var expandedHeight = function(initial, blocks) {
            return initial+options.border+(blocks*options.height+(blocks-1)*options.border);
        }

        var expandedWidth = function(initial, blocks) {
            return initial+options.border+(blocks*options.width+(blocks-1)*options.border);
        }

        var centerGrid = function(element) {
            $(element).find('.inner-image-grid').css('margin-left', -1*((totalWidth-$(window).width())/2) + 'px');
        }

        var calculateGrid = function(element) {
            totalWidth = 0;
            $(element).find('.full-block').each(function() {
                totalWidth += $(this).outerWidth();
            });
            $(element).find('.inner-image-grid').width(totalWidth);
        }

        var isDefined = function(obj) {
            return typeof obj !== "undefined"
        }
        
        var createGrid = function(element) {
            if (element.prop('tagName') != 'UL') return;
            element.hide();
            
            var imageGridContainer = $('<div></div>').addClass('image-grid');
            var imageGrid = $('<div></div>').addClass('inner-image-grid');
            var _fullBlock = $('<div></div>').addClass('grid-block full-block');
            var _topBlock = $('<div></div>').addClass('grid-block top-block');
            var _bottomBlock = $('<div></div>').addClass('grid-block bottom-block');
            var _partialBlock = $('<div></div>').addClass('grid-block partial-block');
            
            $(element).children('li').each(function() {                
                var fullBlock = _fullBlock.clone();
                if (!$(this).children('ul').length) {
                    fullBlock.append($(this).html()).data($(this).data());
                } else {
                    $(this).children('ul').each(function(i, e) {
                        var block;
                        if (i == 0) {
                            block = _topBlock.clone();
                        } else {
                            block = _bottomBlock.clone();
                        }

                        $(this).children('li').each(function() {
                            var partialBlock = _partialBlock.clone();
                            partialBlock.append($(this).html()).data($(this).data());
                            if ($(this).data('up') > 0 || $(this).data('right') > 0 ||
                                $(this).data('down') > 0 || $(this).data('left') > 0) {
                                partialBlock.addClass('expand');
                            }
                            block.append(partialBlock);
                        });

                        fullBlock.append(block);
                    });
                }
                if ($(this).data('up') > 0 || $(this).data('right') > 0 ||
                    $(this).data('down') > 0 || $(this).data('left') > 0) {
                    fullBlock.addClass('expand');
                }
                imageGrid.append(fullBlock);
            });
            imageGrid.find('.partial-block:first-child').addClass('first-block');
            imageGrid.find('.partial-block:last-child').addClass('last-block');
            imageGridContainer.append(imageGrid);
            element.after(imageGridContainer);
            return imageGridContainer;
        }
        
        var setSize = function(element) {
            $(element).find('.expand').each(function() {
                var height;
                var width;

                var heightBlocks = $(this).data('height') ? $(this).data('height') : 1
                var widthBlocks = $(this).data('width') ? $(this).data('width') : 1;

                height = thumbHeight(heightBlocks);
                width = thumbWidth(widthBlocks);

                var img = $(this).find('img');

                if (isDefined($(this).data('up'))) {
                    img.css('bottom', '0px');
                }

                if (isDefined($(this).data('down'))) {
                    img.css('top', '0px');
                }

                if (isDefined($(this).data('left'))) {
                    img.css('right', '0px');
                }

                if (isDefined($(this).data('right'))) {
                    img.css('left', '0px');
                }

                $(this).height(height);
                $(this).width(width);
            });
        }
            
        var animateGrid = function(element) {
            $(element).find('.expand').hover(function() {
                if (isAnimating) return;
                var img = $(this).children('img');     

                var height = expandedHeight($(this).height(), $(this).data('up') ? $(this).data('up') : $(this).data('down'));
                var width = expandedWidth($(this).width(), $(this).data('right') ? $(this).data('right') : $(this).data('left'));

                var top = img.css('top') == '0px' ? -1*options.border + 'px' : '';
                var right = img.css('right') == '0px' ? -1*options.border + 'px' : '';
                var bottom = img.css('bottom') == '0px' ? -1*options.border + 'px' : '';
                var left = img.css('left') == '0px' ? -1*options.border + 'px' : '';

                if ($(this).find('.revealed').length) {
                    clone = $(this).find('.revealed').stop(true, true);
                } else {
                    var clone = $(this).clone();
                }

                clone.css({
                    'position': 'absolute',
                    'z-index': zIndex,
                    'top': top,
                    'right': right,
                    'bottom': bottom,
                    'left': left
                });
                clone.addClass('revealed');
                img.hide();
                $(this).css('overflow', 'visible');

                if (!$(this).find('.revealed').length) {
                    $(this).append(clone);
                }

                isAnimating = true;
                clone.animate({
                    'height': height,
                    'width': width
                }, 200, options.easing, function() {
                    isAnimating = false;
                });

                $(this).css('z-index', zIndex);
                zIndex++;

                $(this).addClass('expanded');
            }, function() {

                if ($(this).hasClass('expanded')) {
                    var heightBlocks = $(this).data('height') ? $(this).data('height') : 1
                    var widthBlocks = $(this).data('width') ? $(this).data('width') : 1;

                    var height = thumbHeight(heightBlocks);
                    var width = thumbWidth(widthBlocks);

                    var revealed = $(this).find('.revealed');
                    revealed.animate({
                        'width': width,
                        'height': height
                    }, 200, options.easing, function() {
                        var expanded = $(this).parent();
                        expanded.css('z-index', 100).css('overflow', 'hidden');
                        expanded.height(height).width(width);
                        $(this).remove();
                        expanded.find('img').show();
                        expanded.removeClass('expanded');
                    });
                }
            });
        }

        return this.each(function() {
            var imageGrid = createGrid($(this));
            setSize(imageGrid);
            animateGrid(imageGrid);
            
            $(window).load(function() {
                calculateGrid(imageGrid);
                centerGrid(imageGrid);
            });
            $(window).resize(function() { centerGrid(imageGrid); });
        });
    };
})(jQuery);
