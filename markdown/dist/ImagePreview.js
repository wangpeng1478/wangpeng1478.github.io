/*
PhotoSwipe - v4.1.3 - 2019-01-08
http://photoswipe.com
https://photoswipe.com/documentation/getting-started.html

<link href="https://cdn.bootcdn.net/ajax/libs/photoswipe/4.1.3/photoswipe.min.css" rel="stylesheet">
<link href="https://cdn.bootcdn.net/ajax/libs/photoswipe/4.1.3/default-skin/default-skin.min.css" rel="stylesheet"></link>
<script src="https://cdn.bootcdn.net/ajax/libs/photoswipe/4.1.3/photoswipe.min.js"></script>
<script src="https://cdn.bootcdn.net/ajax/libs/photoswipe/4.1.3/photoswipe-ui-default.min.js"></script>
*/
(function() {
    function ImagePreview(options,complete) {
        if (options && typeof options.images === "object" && options.images.length > 0) {
            var pswpElement = document.querySelector('#pswp');
            if (pswpElement) {
                openPhotoSwipe(options,complete);
            } else {
                document.body.insertAdjacentHTML('beforeEnd', '<div id=pswp class=pswp aria-hidden=true role=dialog tabindex=-1><div class=pswp__bg></div><div class=pswp__scroll-wrap><div class=pswp__container><div class=pswp__item></div><div class=pswp__item></div><div class=pswp__item></div></div><div class="pswp__ui pswp__ui--hidden"><div class=pswp__top-bar><div class=pswp__counter></div><button class="pswp__button pswp__button--close"title="Close (Esc)"></button> <button class="pswp__button pswp__button--share"title=Share></button> <button class="pswp__button pswp__button--fs"title="Toggle fullscreen"></button> <button class="pswp__button pswp__button--zoom"title="Zoom in/out"></button><div class=pswp__preloader><div class=pswp__preloader__icn><div class=pswp__preloader__cut><div class=pswp__preloader__donut></div></div></div></div></div><div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap"><div class=pswp__share-tooltip></div></div><button class="pswp__button pswp__button--arrow--left"title="Previous (arrow left)"></button> <button class="pswp__button pswp__button--arrow--right"title="Next (arrow right)"></button><div class=pswp__caption><div class=pswp__caption__center></div></div></div></div></div>');
                openPhotoSwipe(options,complete);
            }
        } else {
            console.error('参数错误', options)
        };
    };

    function openPhotoSwipe(e,complete) {
        var pswpElement = document.querySelector('#pswp');
        var images = e.images;
        var options = {
            barsSize: {top:44, bottom:'auto'}, 
            // Adds class pswp__ui--idle to pswp__ui element when mouse isn't moving for 4000ms
            timeToIdle: 4000,
            // Same as above, but this timer applies when mouse leaves the window
            timeToIdleOutside: 1000,
            // Delay until loading indicator is displayed
            loadingIndicatorDelay: 1000,
            shareEl: false,
            index:e.showIndex||0,
            clickToCloseNonZoomable: true,
            zoomEl: true,
            timeToIdle: 4000,
            bgOpacity:1,
            history: false,
            // showHideOpacity:true,
            // showAnimationDuration:true,
            getThumbBoundsFn: function(index) {
                try {
                    // find thumbnail element
                    var thumbnail = $('.markdown-body img[src="'+images[index].src+'"]')[0];
                    // get window scroll Y
                    var pageYScroll = window.pageYOffset || document.documentElement.scrollTop; 
                    // optionally get horizontal scroll
                    // get position of element relative to viewport
                    var rect = thumbnail.getBoundingClientRect(); 
                    // w = width
                    return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
                } catch (error) {
                    
                }
                
            }
        };
        var pswp = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, images, options);
            pswp.init();
            pswp.listen('shareLinkClick', function(e, target) { 
                alert(JSON.stringify(e))
            });
    };
    window['ImagePreview'] = ImagePreview;
}())