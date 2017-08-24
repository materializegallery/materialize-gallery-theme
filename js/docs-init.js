(function($){
	$(function(){


    // Navbar
    $(".button-collapse").sideNav();
    var categories = $('nav .categories-container');
    if (categories.length) {
      categories.pushpin({ top: categories.offset().top });
      var $links = categories.find('li');
      $links.each(function() {
        var $link = $(this);
        $link.on('click', function() {
          $links.removeClass('active');
          $link.addClass('active');
          var hash = $link.find('a').first()[0].hash.substr(1);

          $('.gallery .gallery-expand')
            .addClass('gallery-filter')
            .stop()
            .fadeIn(100);
          if (hash !== 'all') {
            console.log($('.gallery .gallery-expand').not('.' + hash));
            $('.gallery .gallery-expand').not('.' + hash)
              .hide()
              .removeClass('gallery-filter');
          }

          // transition layout
          $masonry.masonry({
            transitionDuration: '.3s'
          });
          // only animate on layout
          $masonry.one( 'layoutComplete', function( event, items ) {
            $masonry.masonry({
              transitionDuration: 0
            });
          });
          $masonry.masonry('layout');
        });
      });
    }


	  // Home
	  $('.carousel').carousel({
      dist: 0,
      padding: 10
    });


    $('a.filter').click(function (e) {
      e.preventDefault();
    });



    // Contact Form Icon
    $("form .form-control").focus(function() {
      $(this).siblings("label").first().children("i").first().css({"color": "#aaa", "left": 0});
    });
    $("form .form-control").blur(function() {
      $(this).siblings("label").first().children("i").first().css({"color": "transparent", "left": "-20px"});
    });


    var onShow = function(el) {
      var carousel = el.find('.carousel.initialized');
      carousel.carousel({
        dist: 0,
        padding: 10
      });
    };
    $('.gallery-expand').galleryExpand({
      onShow: onShow
    });

    $('.blog .gallery-expand').galleryExpand({
      onShow: onShow,
      fillScreen: true
    });

    // Docs init
    $('.gallery-expand.fill-screen').galleryExpand({
      onShow: onShow,
      fillScreen: true
    });
    var toc = $('.table-of-contents');
    toc.pushpin({ top: toc.offset().top });
    $('.scrollspy').scrollSpy();

	}); // end of document ready
})(jQuery); // end of jQuery name space