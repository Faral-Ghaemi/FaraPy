var api;
$(document).ready(function() {
    api = $("#slidingtabs").slidingTabs({
        tabActive:1,
        useWebKit:true,
        ajaxCache:true,
        ajaxSpinner:true,
        ajaxError:"Failed to load content",
        autoplayInterval:5000,
        tabsAlignment:"align_top",
        tabsToSlide:1,
        tabsAnimSpeed:100,
        buttonsFunction:"slide",
        tabsEasing:"",
        tabsLoop:true,
        contentAnimSpeed:600,
        contentAnim:"slideH",
        autoHeight:true,
        autoHeightSpeed:0,
        textConversion:false,
        contentEasing:"easeInOutExpo",
        externalLinking:true,
        autoplay:false,
        orientation:"horizontal",
        tabsScroll:true,
        touchSupport:true
    });

    //API FUNCTIONS
    $("#st_ext_prev").click(function() {
        api.goToPrev();
        return false;
    });
    $("#st_ext_next").click(function() {
        api.goToNext();
        return false;
    });
});