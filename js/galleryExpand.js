/*!
 * Gallery v1.0.2
 * Materialize theme
 * http://materializecss.com/themes.html
 * Personal Use License
 * by Alan Chang
 */

(function ($) {


  var methods = {

    init : function(options) {
      var defaults = {
        inDuration: 300, // ms
        outDuration: 200, // ms
        responsiveThreshold: 992, // breakpoint for full width style
        contentPadding: 40, // Padding for content in Custom Modal
        onShow: null, // callback
        defaultColor: '#444', // Fallback color for color thief.
        primaryColor: '', // Primary color that overrides color thief.
        secondaryColor: '', // Secondary color that overrides color thief.
        fillScreen: false, // Modal to full width background transition style.
        dynamicRouting: false, // Add hash id to URL to allow dynamic routing.
      };
      options = $.extend(defaults, options);

      var urlObjectId = window.location.hash.substring(1);

      return this.each(function(i) {
        var originClickable = true;
        var returnClickable = false;
        var overlayActive = false;
        var doneAnimating = true;
        var origin = $(this);
        var objectId = origin.attr('id') || i.toString();
        var $object = origin.find('.gallery-cover');
        var $header = origin.find('.gallery-header');
        var $curveWrapper = origin.find('.gallery-curve-wrapper');
        var $body = origin.find('.gallery-body');
        var $action = origin.find('.gallery-action');

        // Get attribute options.
        var inDuration = parseInt($(this).attr('data-in-duration')) || options.inDuration;
        var outDuration = parseInt($(this).attr('data-out-duration')) || options.outDuration;
        var responsiveThreshold = parseInt($(this).attr('data-responsive-threshold')) || options.responsiveThreshold;
        var originalContentPadding = parseInt($(this).attr('data-content-padding')) || options.contentPadding;
        var primaryColor = $(this).attr('data-primary-color') || options.primaryColor;
        var secondaryColor = $(this).attr('data-secondary-color') || options.secondaryColor;
        var fillScreen = !!$object.length && ($(this).attr('data-fill-screen') || options.fillScreen);
        var dynamicRouting = $(this).attr('data-dynamic-routing') || options.dynamicRouting;
        var isHorizontal = $(this).hasClass('gallery-horizontal');
        var fullWidth, objectSizeAdjusted = false;

        // Variables
        var placeholder;
        var origContainerWidth, origContainerHeight;
        var origHeaderRect, origHeaderWidth, origHeaderHeight, origHeaderOffsetTop;
        var origObjectWidth, origObjectHeight, origObjectRect;
        var origScrollTop;
        var adjustedObjectWidth, adjustedObjectHeight;
        var offsetTop, offsetLeft, contentOffsetTop;
        var navOffset = 64;
        var btnSelector = '.btn, .btn-large, .btn-floating';
        var colorThief, sampledColorPalette, primaryColor, secondaryColor;
        var cardPadding;
        var contentPadding = originalContentPadding;
        var bezierCurve = 'cubic-bezier(0.420, 0.000, 0.580, 1.000)';
        var modalResizer;
        var animationTimeout, animationEndState;
        var objectInlineStyles;
        var windowWidth = $(document).width();
        var windowHeight = window.innerHeight;
        var bodyScrolls = false;

        // Generate placeholder structure.
        placeholder = origin.children('.placeholder').first();
        if (!placeholder.length) {
          origin.wrapInner($('<div class="placeholder"></div>'));
          placeholder = origin.children('.placeholder').first();
        }
        if (!$header.length) {
          $header = $('<div class="gallery-header invisible"></div>');
          if ($object.length) {
            $object.after($header);
          } else {
            $curveWrapper.append($header);
          }
        }

        // Setup fillScreen.
        var gradient = $object.find('.gradient').first();
        if (fillScreen) {
          if (!gradient.length) {
            gradient = $('<div class="gradient"></div>');
            $object.append(gradient);
          }
          origin.attr('data-fillscreen', true);
        }

        var resetSelectors = function() {
          $object = origin.find('.gallery-cover');
          $header = origin.find('.gallery-header');
          $curveWrapper = origin.find('.gallery-curve-wrapper');
          $body = origin.find('.gallery-body');
          $action = origin.find('.gallery-action');
          placeholder = origin.find('.placeholder');
        };

        var setOrigDimensions = function() {
          origContainerRect = origin[0].getBoundingClientRect();
          origContainerWidth = origContainerRect.width;
          origContainerHeight = origin.height();
          origHeaderRect = $header[0].getBoundingClientRect();
          origHeaderWidth = origHeaderRect.width;
          origHeaderHeight = origHeaderRect.height || 1;
          origObjectWidth = $object.width();
          origObjectHeight = $object.height();
          origObjectRect = $object.length ? $object[0].getBoundingClientRect() : {top: origHeaderRect.top, left: 0};
          origScrollTop = $(window).scrollTop();
        };

        origin.off('click.galleryExpand').on('click.galleryExpand', function(e) {
          // If already modal, do nothing
          if (!originClickable) {
            return;
          }

          // If is child of ancestor that has attr data-stop-propagation, do nothing
          var target = $(e.target);
          if (target.attr('data-stop-propagation') ||
              target.closest('[data-stop-propagation="true"]').length) {
            return;
          }

          originClickable = false;

          // Cancel timeout.
          window.clearTimeout(animationTimeout);
          animationTimeout = null;

          setOrigDimensions();

          // Set URL param
          if (dynamicRouting) {
            window.location.hash = objectId;
          }

          // Card vars
          var headerOffsetTop, newCardWidth, newCardHeight,
              cardWidthRatio, cardHeightRatio;
          var recalculateVars = function() {
            windowWidth = $(document).width();
            windowHeight = window.innerHeight;

            // States
            fullWidth = windowWidth <= responsiveThreshold;
            objectSizeAdjusted = origObjectWidth > windowWidth / 2 || fillScreen;
            bodyScrolls = document.body.scrollHeight > document.body.clientHeight;
              // Get the computed style of the body element
              var bodyStyle = document.body.currentStyle||window.getComputedStyle(document.body, "");
              // Check the overflow and overflowY properties for "auto" and "visible" values
              bodyScrolls = bodyScrolls &&
                            (bodyStyle.overflow == "visible" ||
                             bodyStyle.overflowY == "visible" ||
                             bodyStyle.overflow == "auto" ||
                             bodyStyle.overflowY == "auto");

            // Dimensions
            navOffset = fullWidth ? 56 : 64;
            offsetTop = -origin[0].getBoundingClientRect().top;
            offsetLeft = offsetLeft === undefined ? -placeholder[0].getBoundingClientRect().left : offsetLeft + -placeholder[0].getBoundingClientRect().left;
            contentPadding = fullWidth ? 20 : originalContentPadding;
            contentOffsetTop = Math.round((origObjectHeight / 2) + contentPadding + navOffset);

            // Card vars
            headerOffsetTop = (origObjectHeight / 2) - contentPadding;
            newCardWidth = windowWidth * 0.7;
            newCardHeight = windowHeight - headerOffsetTop - navOffset;
            cardPadding = Math.max(((windowWidth - newCardWidth) / 2), contentPadding);

            // Recalculate some vars for small screen fullWidth styles.
            if (fullWidth) {
              newCardWidth = windowWidth;
              cardPadding = 0;
            }

            // Recalculate some vars if object needs to be resized.
            if (objectSizeAdjusted) {
              if (fillScreen) {
                var img = $object.children('img').first();
                var imgWidth = imgHeight = Infinity;
                if (img.length) {
                  var imgRect = img[0].getBoundingClientRect();
                  imgWidth = imgRect.width;
                  imgHeight = imgRect.height;
                }
                adjustedObjectWidth = Math.min(windowWidth, imgWidth);
                adjustedObjectHeight = Math.min(windowHeight - navOffset, imgHeight);

                if (fullWidth) {
                  contentOffsetTop = Math.round((windowHeight - navOffset) / 2);
                } else {
                  contentOffsetTop = Math.round(contentPadding * 3 + navOffset);
                }
                headerOffsetTop = adjustedObjectHeight - contentOffsetTop + navOffset;
                newCardHeight = windowHeight - contentOffsetTop;

              } else {
                var ratio = origContainerWidth / origContainerHeight;
                adjustedObjectWidth = windowWidth / 2;
                adjustedObjectHeight = adjustedObjectWidth / ratio;
                contentOffsetTop = Math.round(adjustedObjectHeight / 2) + contentPadding + navOffset;
                headerOffsetTop = (adjustedObjectHeight / 2) + contentPadding;
                newCardHeight = windowHeight - headerOffsetTop - navOffset;
              }
            }

            cardWidthRatio = newCardWidth / origHeaderWidth;
            cardHeightRatio = newCardHeight / origHeaderHeight;
          };

          // Recalculate
          recalculateVars();

          // INITIAL SETUP
          animationEndState = placeholder.clone(true);

          // Disable scrolling.
          $('body').css('overflowX', 'hidden');
          $('body').on('scroll.disable-scroll mousewheel.disable-scroll touchmove.disable-scroll', function(e) {
            e.preventDefault();
            e.stopPropagation();
            return false;
          });

          // Set wrapper dimensions.
          origin.css({
            height: origContainerHeight,
            width: origContainerWidth
          });

          // Set object dimensions.
          if ($object.length) {
            objectInlineStyles = $object.attr('style');
            var transformString = 'translate3d(';

            if (fillScreen) {
              transformString += (origObjectRect.left) + 'px, ' + contentPadding + 'px, 0)';
            } else {
              $object.css({
                left: cardPadding + contentPadding,
                top: contentPadding,
              });
              transformString += (origObjectRect.left - cardPadding - contentPadding) + 'px, 0, 0)';
            }

            // Shared properties.
            $object.css({
              height: origObjectHeight,
              width: origObjectWidth,
              // 'z-index': 1,
              transform: transformString
            });
          }

          var curveWrapperTop = origObjectRect.top - navOffset - contentPadding;
          $curveWrapper.css({
            // 'padding-top': navOffset,
            display: 'block',
            transform: 'translate3d(0, ' + curveWrapperTop + 'px, 0)'
          });

          // Set header dimensions.
          origHeaderOffsetTop = isHorizontal ? contentPadding - origHeaderHeight : contentPadding;
          $header.css({
            height: origHeaderHeight,
            width: origHeaderWidth,
            transform: 'translate3d(' + origHeaderRect.left + 'px,' + origHeaderOffsetTop + 'px,0)'
          });

          // Set positioning for placeholder
          placeholder.css({
            height: windowHeight,
            width: windowWidth,
            transform: 'translate3d(' + Math.round(offsetLeft) + 'px, ' + Math.round(offsetTop) + 'px, 0)',
          });

          // add active class
          origin.addClass('active');
          if (origin.css('position') !== 'absolute') {
            origin.css({
              position: 'relative'
            });
          }

          // Set states
          overlayActive = true;
          doneAnimating = false;

          // Add overlay
          var overlay = $('#placeholder-overlay');
          if (!overlay.length) {
            overlay = $('<div id="placeholder-overlay"></div>');
            placeholder.prepend(overlay);
          }
          overlay
            .off('click.galleryExpand')
            .on('click.galleryExpand', function() {
              returnToOriginal();
            })
          if (fillScreen) {
            overlay
              .off('mouseenter.galleryExpand')
              .off('mouseleave.galleryExpand')
              .on('mouseenter.galleryExpand', function() {
                $object.addClass('hover');
              })
              .on('mouseleave.galleryExpand', function() {
                $object.removeClass('hover');
              });
          }
          setTimeout(function() {
            overlay.addClass('visible');
          }, 0);

          // Add Navbar
          var navbar = $('<nav id="placeholder-navbar"></nav>');
          var navWrapper = $('<div class="nav-wrapper"></div>');
          var container = $('<div class="container"></div>');
          var backBtn = $('<button class="back-btn"><i class="material-icons">arrow_back</i><span>Back</span></button>');
          var originalNavColor = '';
          if ($('nav').length) {
            originalNavColor = $('nav').css('background-color');
            $('nav').addClass('fadeOut');
          }
          navbar.css({'background-color': originalNavColor});
          container.append(backBtn);
          navWrapper.append(container);
          navbar.append(navWrapper);
          placeholder.prepend(navbar);
          backBtn.click(function() {
            returnToOriginal();
          });

          // Color sample
          if (typeof ColorThief !== "undefined" && $object.length) {
            colorThief = new ColorThief();
            var img = new Image();
            img.onload = function () {
              colorThief.getColor(img);
            };
            img.crossOrigin = 'Anonymous';
            img.src = origin.find('img').attr('src');

            try {
              sampledColorPalette = colorThief.getPalette(origin.find('img')[0], 2);
              primaryColor = primaryColor || 'rgb(' + sampledColorPalette[0][0] + ',' +  sampledColorPalette[0][1] + ',' + sampledColorPalette[0][2] + ')';
              secondaryColor = secondaryColor || 'rgb(' + sampledColorPalette[1][0] + ',' +  sampledColorPalette[1][1] + ',' + sampledColorPalette[1][2] + ')';

              // Make navbar secondaryColor background
              navbar.css({
                backgroundColor: secondaryColor
              });
            } catch(e) {
              console.log("Cross Origin error. Falling back to defaultColor. Try using a locally hosted image", e);

              // Clean up canvas
              var tempCanvas = $('body').children('canvas:last-child');
              if (tempCanvas.length) {
                var imgWidth = imgHeight = 0;
                var img = $object.children('img').first();
                if (img.length) {
                  var imgRect = img[0].getBoundingClientRect();
                  imgWidth = Math.round(imgRect.width);
                  imgHeight = Math.round(imgRect.height);
                }
                if (tempCanvas[0].getContext('2d').canvas.width === imgWidth &&
                    tempCanvas[0].getContext('2d').canvas.height === imgHeight) {
                  tempCanvas.remove();
                }
              }
            }

          }

          // If color thief fails to set primaryColor
          primaryColor = primaryColor || options.defaultColor;

          // Style overlay and gradient
          overlay.css({
            backgroundColor: primaryColor
          });
          if (fillScreen && gradient.length) {
            gradient.css({
              background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, ' + primaryColor + ' 100%)'
            });
          }


          /*****************************************
           * Actual transformations and animations *
           *****************************************/

          // Animate object
          var objectCssObject = {};
          objectCssObject.transform = '';
          objectCssObject.transition = 'transform ' + (inDuration / 1000) + 's';
          objectCssObject['-webkit-transition'] = '-webkit-transform ' + (inDuration / 1000) + 's';

          if (objectSizeAdjusted) {
            // Resize Image
            if (fillScreen) {
              objectCssObject.width = adjustedObjectWidth;
              objectCssObject.height = adjustedObjectHeight;
              objectCssObject.transition = 'transform ' + (inDuration / 1000) + 's, width ' + (inDuration / 1000) + 's, height ' + (inDuration / 1000) + 's';
              objectCssObject['-webkit-transition'] = '-webkit-transform ' + (inDuration / 1000) + 's, width ' + (inDuration / 1000) + 's, height ' + (inDuration / 1000) + 's';
              var scaleRatio = adjustedObjectWidth < windowWidth ? windowWidth / adjustedObjectWidth : 1
              if (adjustedObjectWidth < windowWidth) {
                objectCssObject.transform = 'scale(' + (windowWidth / adjustedObjectWidth) + ')';
              }
            } else {
              objectCssObject.transform = 'scale(' + (adjustedObjectWidth / origObjectWidth) + ')';
            }
          }
          $object.css(objectCssObject);

          // Animate curveWrapper
          $curveWrapper.css({
            height: windowHeight,
            transition: 'transform ' + (inDuration / 1000) + 's ' + bezierCurve,
            '-webkit-transition': '-webkit-transform ' + (inDuration / 1000) + 's ' + bezierCurve,
            transform: ''
          });

          // Animate header into card
          $header.children().css('opacity', 0);
          var transformHeader = function() {
            var offsetLeft = cardPadding / cardWidthRatio;
            var offsetTop = -headerOffsetTop / cardHeightRatio;

            if (objectSizeAdjusted && !fillScreen) {
              offsetTop = (headerOffsetTop - origObjectHeight) / cardHeightRatio;
            }

            $header.css({
              transition: 'transform ' + (inDuration / 1000) + 's ' + bezierCurve,
              '-webkit-transition': '-webkit-transform ' + (inDuration / 1000) + 's ' + bezierCurve,
              transform: 'scale(' + cardWidthRatio + ',' + cardHeightRatio + ') translate3d(' + offsetLeft + 'px,' + offsetTop +'px,0)',
              transformOrigin: '0 0'
            });
          };
          transformHeader();


          // Position body and action in card
          if ($body.length) {
            $body.css({
              marginTop: contentOffsetTop,
              padding: contentPadding,
              minHeight: windowHeight - contentOffsetTop
            });

            if (!fillScreen && $object.length) {
              if (fullWidth) {
                $body.find('.title-wrapper').css({
                  marginTop: contentOffsetTop / 2
                });
              } else {
                $body.find('.title-wrapper').css({
                  marginLeft: origObjectWidth,
                  paddingLeft: contentPadding,
                  height: headerOffsetTop
                });
              }
            }
          }

          if ($action.length) {
            $action.css({
              top: contentOffsetTop
            });

            // Color buttons.
            $action.find(btnSelector).each(function() {
              $(this).css({
                backgroundColor: secondaryColor
              });
            });
          }

          // Set throttled window resize calculations.
          modalResizer = Materialize.throttle(function() {
            recalculateVars();
          }, 150);

          $(window).resize(modalResizer);

          animationTimeout = setTimeout(function() {

            // Show floating btns.
            if ($action.length) {
              $action.find(btnSelector).each(function() {
                $(this).addClass('active');
              });
            }

            var setStaticState = function() {
              // Save animationEndState
              animationEndState = placeholder.clone(true);

              // Static placeholder.
              placeholder.css({
                transform: '',
                position: 'fixed',
                width: '100%',
                height: '100%',
                top: 0,
                left: 0,
                overflow: 'auto'
              });

              // Swap scrollbars if needed
              if (bodyScrolls) {
                $('body').css('overflow', 'hidden');
                placeholder.css('overflowY', 'scroll');
              }

              // Enable scrolling
              $('body').off('scroll.disable-scroll mousewheel.disable-scroll touchmove.disable-scroll');

              // Static curveWrapper
              $curveWrapper.css({
                height: '100%',
              });

              // Static object.
              if (fillScreen) {
                $object.css({
                  width: '',
                  height: '',
                  transform: '',
                  transition: 'opacity .3s'
                });
              } else {
                $object.css({
                  left: contentPadding
                });
              }
              $object.addClass('static');


              // Static header.
              $header.hide();
            };

            if ($body.length) {
              $body.fadeIn(300, function() {
                setStaticState();
              });
            } else {
              setStaticState();
            }

            // Callback animation. Reveal content
            doneAnimating = true;
            returnClickable = true;

            // Execute callback
            if (typeof(options.onShow) === "function") {
              options.onShow.call(this, origin);
            }

          }, inDuration);

        });


        // Return on ESC
        $(document).keyup(function(e) {
          if (e.keyCode === 27) {   // ESC key
            if (overlayActive) {
              returnToOriginal();
            }
          }
        });


        // This function returns the modaled image to the original spot
        function returnToOriginal() {
          // Only Call Once
          if (!returnClickable) {
            return;
          }

          returnClickable = false;

          // Clear hash
          if (dynamicRouting) {
            window.location.hash = '!';
          }

          // Cancel timeout.
          var cancelledTimeout = !doneAnimating;
          window.clearTimeout(animationTimeout);
          animationTimeout = null;
          $body.stop();
          doneAnimating = true;
          offsetLeft = undefined;

          // Off events
          var overlay = $('#placeholder-overlay').first();
          overlay
            .off('click.galleryExpand')
            .off('mouseenter.galleryExpand')
            .off('mouseleave.galleryExpand');

          // Use animationEndState to reset to animationEndState.
          placeholder.scrollTop(0);
          placeholder.attr('style', animationEndState.attr('style'));
          $object
            .css('left', animationEndState.find('.gallery-cover').css('left'))
            .removeClass('static hover');
          resetSelectors();

          // Reset scrollbars
          $('body').css('overflow', '');
          placeholder.css('overflowY', '');

          // Set overlay pre animation state.
          overlay.css({
            transition: 'none',
            opacity: 0.9
          });

          // Show header.
          $header.show();

          setTimeout(function() {

            // Off resize event.
            $(window).off('resize', modalResizer);

            // Fade out child elements
            origin.find('.gallery-body').css('display', 'none');
            if ($action) {
              $action.find(btnSelector).removeClass('active');
            }

            // Reset navbar
            $('nav').removeClass('fadeOut');
            $('#placeholder-navbar').fadeOut(outDuration, 'easeInQuad', function(){
              $(this).remove();
            });

            // Remove Overlay
            overlayActive = false;

            overlay.fadeOut(outDuration, 'easeInQuad', function() {
              $(this).remove();
            });

            if (!cancelledTimeout) {
              // Resize
              origin.css({
                width: origContainerWidth,
                height: origContainerHeight,
                transform: 'translate3d(0,0,0)',
                transition: 'transform ' + (outDuration / 1000) + 's ' + bezierCurve,
                '-webkit-transition': '-webkit-transform ' + (outDuration / 1000) + 's ' + bezierCurve
              });

              // Return curveWrapper
              var curveWrapperTop = origObjectRect.top - navOffset - contentPadding;
              $curveWrapper.css({
                transform: 'translate3d(0, ' + curveWrapperTop + 'px, 0)',
                transition: 'transform ' + (outDuration / 1000) + 's',
                '-webkit-transition': '-webkit-transform ' + (outDuration / 1000) + 's'
              });

              // Return object
              var objectCssObject = {};
              if (objectSizeAdjusted && fillScreen) {
                objectCssObject.width = origObjectWidth;
                objectCssObject.height = origObjectHeight;
                objectCssObject.transform = 'translate3d(' + origObjectRect.left + 'px, ' + contentPadding + 'px, 0)';
                objectCssObject.transition = 'transform ' + (outDuration / 1000) + 's, width ' + (outDuration / 1000) + 's, height ' + (outDuration / 1000) + 's';
                objectCssObject['-webkit-transition'] = '-webkit-transform ' + (outDuration / 1000) + 's, width ' + (outDuration / 1000) + 's, height ' + (outDuration / 1000) + 's';

                // Reset gradient.
                gradient.css({ background: '' });

              } else {
                objectCssObject.transform = 'translate3d(' + (origObjectRect.left - cardPadding - contentPadding) + 'px, 0, 0)';
                objectCssObject.transition = 'transform ' + (outDuration / 1000) + 's ' + bezierCurve;
                objectCssObject['-webkit-transition'] = '-webkit-transform ' + (outDuration / 1000) + 's ' + bezierCurve;
              }
              $object.css(objectCssObject);

              // Return header
              $header.css({
                transform: 'translate3d(' + origHeaderRect.left + 'px,' + origHeaderOffsetTop + 'px,0)',
                transition: 'transform ' + (outDuration / 1000) + 's',
                '-webkit-transition': '-webkit-transform ' + (outDuration / 1000) + 's',
              });
            }

            animationTimeout = setTimeout(function() {
              placeholder.removeAttr('style');
              origin.css({
                width: '',
                height: '',
                overflow: '',
                'z-index': '',
                transform: '',
                transition: '',
                '-webkit-transition': ''
              });
              $object.removeAttr('style').attr('style', objectInlineStyles);
              $curveWrapper.removeAttr('style');
              $header.removeAttr('style');
              $header.children().removeAttr('style');
              $body.find('.title-wrapper').css({
                marginTop: '',
                marginLeft: '',
                paddingLeft: '',
                height: ''
              });

              // Remove active class
              origin.removeClass('active');

              // Enable origin to be clickable once return animation finishes.
              originClickable = true;

              // Layout masonry
              if (!!$('.gallery').data('masonry')) {
                $('.gallery').masonry('layout');
              }

            }, outDuration);

          }, 0);

        }


        // If correct URL param, open corresponding gallery
        if (dynamicRouting &&
            urlObjectId === objectId) {
          origin.trigger('click.galleryExpand');
        }
      });



    },
    // Custom methods.
    open : function() {
      $(this).trigger('click.galleryExpand');
    },
    close : function() {
      var overlay = $('#placeholder-overlay');
      if (overlay.length) {
        overlay.trigger('click.galleryExpand');
      }
    },
  };


    $.fn.galleryExpand = function(methodOrOptions) {
      if ( methods[methodOrOptions] ) {
        return methods[ methodOrOptions ].apply( this, Array.prototype.slice.call( arguments, 1 ));
      } else if ( typeof methodOrOptions === 'object' || ! methodOrOptions ) {
        // Default to "init"
        return methods.init.apply( this, arguments );
      } else {
        $.error( 'Method ' +  methodOrOptions + ' does not exist on jQuery.galleryExpand' );
      }
    }; // Plugin end
}( jQuery ));
