/*!
 * ImgMason 0.1.5
 * A light-weight masonry layout library
 * https://github.com/Strobotti/img-mason
 * by Juha Jantunen
 */
( function (factory) {
    if (typeof module === 'object' && module.exports) {
        // CommonJS
        module.exports = factory();
    } else {
        // browser global
        window.ImgMason = factory();
    }
})( function factory() {
    'use strict';

    return function (selector, options) {
        const extend = function ( defaults, options ) {
            var extended = {};
            var prop;
            for (prop in defaults) {
                if (Object.prototype.hasOwnProperty.call(defaults, prop)) {
                    extended[prop] = defaults[prop];
                }
            }
            for (prop in options) {
                if (Object.prototype.hasOwnProperty.call(options, prop)) {
                    extended[prop] = options[prop];
                }
            }
            return extended;
        };

        const getImgWidth = function(img) {
            return parseInt(img.getAttribute('width'));
        };

        const getImgHeight = function(img) {
            return parseInt(img.getAttribute('height'));
        };

        function getImgAspectRatio(img) {
            return getImgWidth(img) / getImgHeight(img);
        }

        const settings = extend({startOffset: 0, rowMinAspectRatio: 3.5}, options);

        var container = document.querySelector(selector);

        if (!container) {
            return;
        }

        var imgs = container.getElementsByTagName('img');

        var index = settings.startOffset;
        for (; index < imgs.length; index++) {
            // determine how many images should be put in a row
            var rowRealWidth = 0;
            var rowRealHeight = 0;
            var subIndex = index - 1;
            var imagesInRow = 1;

            // add images to row until the aspect ratio reaches (or exceeds) the given setting
            do {
                subIndex++;
                rowRealWidth += getImgWidth(imgs[subIndex]);
                rowRealHeight = Math.max(rowRealHeight, getImgHeight(imgs[subIndex]));

                imagesInRow = Math.max(imagesInRow, subIndex - index);
            } while (rowRealWidth / rowRealHeight < settings.rowMinAspectRatio && subIndex + 1 < imgs.length);

            if (imgs.length - (imagesInRow + index) === 1) {
                // don't leave an image alone
                if (imagesInRow > 2) {
                    imagesInRow--;
                } else {
                    imagesInRow++;
                }
            }

            var sumAspectRatios = 0;

            for (var i = 0; i < imagesInRow; i++) {
                sumAspectRatios+= getImgAspectRatio(imgs[index + i]);
            }

            imgs[index].style.clear = 'left';

            for (i = 0; i < imagesInRow; i++) {
                var width = (getImgAspectRatio(imgs[index + i]) / sumAspectRatios) * 100;

                // inline-block instead of block to prevent unwanted wrapping
                imgs[index + i].style.width = width + '%';
                imgs[index + i].style.height = 'auto';
                imgs[index + i].style.float = 'left';
                imgs[index + i].style.display = 'block';

                if (i > 0) imgs[index + i].style.clear = '';
            }

            index+= (imagesInRow - 1);
        }
    };
});
