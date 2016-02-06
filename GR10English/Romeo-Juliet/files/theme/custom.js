jQuery(function($) {

    // Fixed nav
    $.fn.checkHeaderPositioning = function(scrollEl, scrollClass) {
        var $me = $(this);
        if($(scrollEl).scrollTop() > 0) {
            $me.addClass(scrollClass);
        } else if($(scrollEl).scrollTop() === 0) {
            $me.removeClass(scrollClass);
        }
    };

    // Mobile sidebars
    $.fn.expandableSidebar = function(expandedClass) {
        var $me = this;

        $me.on('click', function() {
            if(!$me.hasClass(expandedClass)) {
                $me.addClass(expandedClass);
            } else {
                $me.removeClass(expandedClass);
            }
        });
    };

    // Interval loop
    $.fn.intervalLoop = function(condition, action, duration, limit) {
        var counter = 0;
        var looper = setInterval(function(){
            if (counter >= limit || $.fn.checkIfElementExists(condition)) {
                clearInterval(looper);
            } else {
                action();
                counter++;
            }
        }, duration);
    };

    // Check if element exists
    $.fn.checkIfElementExists = function(selector) {
        return $(selector).length;
    };

    // Slide fade toggle function
    $.fn.slideFadeToggle  = function(speed, callback) {
        return this.animate({
           opacity: 'toggle', 
           height: 'toggle'
        }, speed, callback);
    }; 

    var slickController = {

        menuOpen: false,
        searchOpen: false,
        miniCartOpen: false,

        init: function() {
            var base = this;

            base._affixNav();
            base._buildSubMenu();
            base._buildBlog();
            base._buildStore();
            base._addFormPlaceholders();
            base._fullWidthMobileImages();

            setTimeout(function(){
                base._moveLogin();
                  base._moveMiniCart();
                  base._moveSearch();
                    base._topbarToggles();
                  base._initCarousel();
            }, 500);

       setTimeout(function(){
        base._attachEvents();
      }, 1000);
      },

      _affixNav: function() {
          // Check content positioning
            $('body:not(.wsite-native-mobile-editor)').checkHeaderPositioning(window, 'affix');

          // Fixed header
      $(window).on('scroll', function() {
          var $me = $(this);
          $('body:not(.wsite-native-mobile-editor)').checkHeaderPositioning($me, 'affix');
      });

      // Splash page fixed header
      if($('.splash-page').length > 0) {
          $('.main-wrap').on('scroll', function() {
              var $me = $(this);
              $('body:not(.wsite-native-mobile-editor)').checkHeaderPositioning($me, 'affix');
          });
      }
      },

    _buildSubMenu: function() {
        // Add class to nav items with subnav
      $('.wsite-menu-default').find('li.wsite-menu-item-wrap').each(function(){
        var $me = $(this);

        if($me.children('.wsite-menu-wrap').length > 0) {

          $me.addClass('has-submenu');
          $('<span class="icon-caret"></span>').insertAfter($me.children('a.wsite-menu-item'));
        }
      });

      // Add class to subnav items with subnav
      $('.wsite-menu').find('li.wsite-menu-subitem-wrap').each(function(){
        var $me = $(this);

        if($me.children('.wsite-menu-wrap').length > 0) {

          $me.addClass('has-submenu');
          $('<span class="icon-caret"></span>').insertAfter($me.children('a.wsite-menu-subitem'));
        }
      });

        // Keep subnav open if submenu item is active
        $('li.wsite-menu-subitem-wrap.wsite-nav-current').parents('.wsite-menu-wrap').addClass('open');

        // Subnav toggle
        $('li.has-submenu span.icon-caret').on('click', function() {
            var $me = $(this);

            if($me.siblings('.wsite-menu-wrap').hasClass('open')) {
                $me.siblings('.wsite-menu-wrap').removeClass('open');
            } else {
                $me.siblings('.wsite-menu-wrap').addClass('open');
            }
        });
    },


    // Wrap blog sidebar list items with LI's
    // NOTE :: This needs to be fixed platform side
    _buildBlog: function() {    
          var $listItemSet = $('ul.columnlist-blog').children();

            for (var i=0, len = $listItemSet.length; i < len; i+=2) {
              $listItemSet.slice(i, i+2).wrapAll('<li class="blog-sidebar-section" />');
            }

            // Individual blog post toggle 
          $('.read-now-toggle').each(function(){
              var $me = $(this);
              var blogLink = $me.siblings('.blog-title').children('a').attr('href');

              $me.attr('href', blogLink);
          });

        // Collapsable blog sidebar
        $('a.blog-sidebar-toggle').on('click', function(e) {
            var $me = $(this);
            $me.toggleClass('open');
            $me.siblings('.column-blog').slideFadeToggle(250);
            e.preventDefault();
        });

      // Collapsable blog sidebar
        $('.blog-share').on('click', function(e) {
            $(this).siblings('.blog-social').slideFadeToggle(250);
            e.preventDefault();
      });

      },

    _buildStore: function() {
        
        // Collapsable product description
        if(!$('#icontent').length > 0) {
            var $collapseIcon = $('.wsite-com-short-description-wrap').children('.icon-collapse');
            $collapseIcon.on('click', function(e) {
                $(this).siblings('#wsite-com-product-short-description').slideFadeToggle(250);
                $(this).parent('.wsite-com-short-description-wrap').toggleClass('open');
                e.preventDefault();
            });
        }

        // Hide product description if it doesn't exist
        if (!$('#wsite-com-product-short-description').length > 0) {
            $('.wsite-com-short-description-wrap').hide();
        }

        // Store category dropdown toggle
        $('.wsite-com-sidebar').expandableSidebar('sidebar-expanded');
    },

    _addFormPlaceholders: function() {
        // Add placeholder text to inputs
        $('.wsite-form-sublabel').each(function(){
            var sublabel = $(this).text();
            $(this).prev('.wsite-input').attr('placeholder', sublabel);
        });
    },

    _fullWidthMobileImages: function() {
        // Add fullwidth class to gallery thumbs if less than 6
        $('.imageGallery').each(function(){
            if ($(this).children('div').length <= 6) {
                $(this).children('div').addClass('fullwidth-mobile');
            }
        });
    },

    _moveMiniCart: function() {
        var base = this;

        // Move cart to header, otherwise hide the cart
        if($('#wsite-mini-cart').length > 0) {
            $('#topBar').append('<div id="miniCart" class="mini-cart-wrap"><span id="miniCartIcon" class="mini-cart-icon"></span></div>')
            $('#wsite-mini-cart').detach().appendTo('#miniCart');
        
            setTimeout(function(){
               base._checkCartItems();
            }, 500);
        }
    },

    _moveSearch: function() {
        if(!$('#icontent').length > 0) {
            if ($('#topBar .wsite-search').length > 0) {
                var search = $('#topBar .wsite-search').detach();
                $('#topBar .logo').after('<div class="search-icon-wrap"><span class="search-icon"></span></div>');
                $('#topBar').after(search);
                $('.header-wrap').find('.wsite-search').wrap('<div class="search-bar-wrap"></div>');
            }
        }
    },

    _detachLogin: function() {
        var loginDetach = $('#member-login').detach();
        $('.mobile-nav .wsite-menu-default > li:last-child').after(loginDetach);
    },

    _moveLogin: function() {
        var base = this;

        // Move cart + login
        if ($(window).width() <= 992) {
            $.fn.intervalLoop('.mobile-nav #member-login', base._detachLogin, 800, 5);
        }
    },

    _topbarToggles: function() {
        $('label.hamburger').on('click', function() {
            if (!$('body').hasClass('nav-open')) {
                $('body').addClass('nav-open');
                $('body').removeClass('search-open mini-cart-open');
            } else {
                $('body').removeClass('nav-open');
            }
        });

        $('.search-icon-wrap').on('click', function() {
            $('body').toggleClass('search-open');
            $('body').removeClass('mini-cart-open nav-open');
            //$('input#navTrigger').attr('checked', false);
        });


        $('.mini-cart-wrap').on('click', function() {
            $('body').toggleClass('mini-cart-open');
            $('body').removeClass('search-open nav-open');
            //$('input#navTrigger').attr('checked', false);
        });
    },

     _checkCartItems: function() {      
      if($('#wsite-mini-cart').find('li.wsite-product-item').length > 0) {
        $('body').addClass('cart-full');
      } else {
        $('body').removeClass('cart-full');
      }
    },

    _attachEvents: function() {
      var base = this;

      // Click down arrow for landing page
      $('#arrowDown').on('click', function(){
        $('html, body').animate({
          scrollTop: $('.main-wrap').offset().top - 50
        }, 400);
      });

      // Search filters dropdown toggle
      $('#wsite-search-sidebar').expandableSidebar('sidebar-expanded');

        // Init fancybox swipe on mobile
        if('ontouchstart' in window) {
            $('body').on('click', 'a.w-fancybox', function() {
                base._initSwipeGallery();
            });
        }

        $('.wsite-product-button').on('click', function(){
            base._checkCartItems();
        });
    },

    _initCarousel: function() {
        var indexPos = 0;
        var resizeCarouselImages = function(){
            var maxHeight = 0;
       
            $('#wsite-com-product-images .item').each(function() {
              maxHeight = maxHeight > $(this).height() ? maxHeight : $(this).height();
            }); 
            $("#wsite-com-product-images .imageGallery").height(maxHeight);
        };

      if($('#product-carousel').length > 0) {
          resizeCarouselImages();

          // Adjust if resized
          var resizeCarouselImagesInit = _.debounce(function(e) {
            resizeCarouselImages();
          }, 500);

          // Add event listener for resize
          window.addEventListener('resize', resizeCarouselImagesInit, false);
          
          // Add loaded class to carousel when loaded 
          $('.carousel').addClass('carousel-loaded');

          $('#product-carousel .carousel-inner .item:first-child, #product-carousel .carousel-indicators li:first-child').addClass('active');
          
          $('#product-carousel .carousel-indicators li').each(function(){
            $(this).attr('data-slide-to', indexPos);
            indexPos++;
          });
      }
    },

    _initSwipeGallery: function() {
      var base = this;

      setTimeout(function(){
        var touchGallery = document.getElementsByClassName('fancybox-wrap')[0];
        var mc = new Hammer(touchGallery);
        mc.on("panleft panright", function(ev) {
          if (ev.type == "panleft") {
            $("a.fancybox-next").trigger("click");
          } else if (ev.type == "panright") {
            $("a.fancybox-prev").trigger("click");
          }
          base._initSwipeGallery();
        });
      }, 500);
    }
    };


    $(document).ready(function(){
      slickController.init();
    });
});