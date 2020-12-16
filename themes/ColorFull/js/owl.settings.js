(function($) {
    "use strict";

    $(document).ready(function() {
        $('#home-slider .owl-carousel').owlCarousel({
            loop:true,
            rtl: false,
            margin:0,
            responsiveClass:true,
            dots: false,
            singleItem: true,
            autoHeight: true,
            autoplay: false,
            autoplayTimeout: 5000,
            slideBy: 1,
            smartSpeed: 500,
            autoplayHoverPause: true,
            nav: true,
            navText: ['<i class="icon-left"></i>','<i class="icon-right"></i>'], //Note, if you are not using Font Awesome in your theme, you can change this to Previous & Next
            responsive:{
                0:{
                    items:1,
                }
            }
        });
        $('#latest-projects .owl-carousel').owlCarousel({
            loop:true,
            rtl:false,
            margin:15,
            responsiveClass:true,
            dots: false,
            autoplay: true,
            autoplayTimeout: 5000,
            slideBy: 1,
            smartSpeed: 500,
            autoplayHoverPause: true,
            nav: true,
            navText: ['<i class="icon-left"></i>','<i class="icon-right"></i>'], //Note, if you are not using Font Awesome in your theme, you can change this to Previous & Next
            responsive:{
                0:{
                    items:2,
                },
                600:{
                    items:4,
                }
            }
        });
        $('#charkhofalak2 .owl-carousel').owlCarousel({
            loop:true,
            rtl:true,
            margin:15,
            responsiveClass:true,
            dots: false,
            autoplay: true,
            autoplayTimeout: 5000,
            slideBy: 1,
            smartSpeed: 500,
            autoplayHoverPause: true,
            nav: true,
            navText: ['<i class="c-right"></i>','<i class="c-left"></i>'], //Note, if you are not using Font Awesome in your theme, you can change this to Previous & Next
            responsive:{
                0:{
                    items:3,
                },
                600:{
                    items:7,
                }
            }
        });
        $('#related .owl-carousel').owlCarousel({
            loop:true,
            rtl:true,
            margin:10,
            responsiveClass:true,
            dots: false,
            autoplay: false,
            autoplayTimeout: 5000,
            slideBy: 1,
            smartSpeed: 500,
            autoplayHoverPause: true,
            nav: true,
            navText: ['<i class="cm-right"></i>','<i class="cm-left"></i>'], //Note, if you are not using Font Awesome in your theme, you can change this to Previous & Next
            responsive:{
                0:{
                    items:4,
                }
            }
        });
    })
})(jQuery);