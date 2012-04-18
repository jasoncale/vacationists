var tracks = [];
var fadeInTimer;

$(document).ready(function() {
    $('body').addClass('js-enabled');

    $('.track').each(function() {
        if ($(this).attr('href')) {
            var player = jwplayer($(this).attr('id')).setup({
                players: [
                {
                    type: "flash",
                    src: "/media/player.swf"
                }
                ],
                playlist: "none",
                flashplayer: "/media/player.swf",
                duration: parseInt($(this).attr('data-duration')),
                file: $(this).attr('href'),
                provider: "sound",
                height: 24,
                width: 250,
                dock: false,
                controlbar: "bottom",
                "playlist.position": "none",
                backcolor: "ffffff",
                frontcolor: "333333",
                wmode: "transparent"
            }).onPlay(function() {
                var currentId = this.id;
                $(tracks).each(function() {
                    if (this.id != currentId && this.getState().match(/PLAYING|PAUSED|BUFFERING/)) {
                        this.stop();
                    };
                });
                $('a[data-track="' + this.id + '"]').siblings('em.state').text(" is playing");
            }).onComplete(function() {
                $('a[data-track="' + this.id + '"]').siblings('em.state').remove();
                var currentTrack = tracks.indexOf(player);
                if (currentTrack < (tracks.length - 1)) {
                    tracks[currentTrack + 1].play();
                };
            });
            tracks.push(player);
        }
    });

    $('.toggle-track').click(function() {
        var track = jwplayer($(this).attr('data-track'));
        track.play();
        var state = track.getState();

        $('.toggle-track, #content').removeClass('playing paused');
        $('.track-listing em.state').remove();

        $(this).after('<em class="state" />');

        if (state == "PLAYING" || state == "BUFFERING") {
            $(this).addClass('playing');
            $('#content').addClass('playing');
        } else if (state == "PAUSED") {
            $(this).addClass('paused');
            $('#content').addClass('paused');
            $(this).siblings('em.state').text(" is paused");
        }

        var trackClass = "track_" + (tracks.indexOf(track) + 1);

        if (!$('.images').hasClass(trackClass)) {
            $('.images').find('.image').fadeOut('slow', function () {
              $('.images').attr('class', 'images ' + trackClass);
              repositionImages();
              $('.images').find('.image').hide();

              clearTimeout(fadeInTimer);
              fadeInTimer = setTimeout(function() {
                $('.images').find('.image').fadeIn();
              },
              2000);
            });
        }

        return false;
    });

    $('a.moreinfo').click(function() {
        if (($(window).width() > 600)) {
            var _link = $(this);
            var target = $(_link.attr('href'));
            if (target && ($(window).width() > 600)) {
                if (target.hasClass('active')) {
                    var currTop = target.css('top');
                    target.css('z-index', '-1').animate({
                        left: '50%',
                        top: centerBehindPlayer(target)
                    },
                    function() {
                      _link.removeClass('active');
                      target.removeClass('active').hide().css({
                          top: currTop
                      });
                    });
                    $('.player').animate({
                        left: '50%'
                    });
                } else {
                    // close any active panels
                    $('a.moreinfo.active').removeClass('active');
                    $('.info.active').each(function() {
                        var _this = $(this);
                        var currTop = _this.css('top');
                        _this.css('z-index', '-1').animate({
                            left: '30%',
                            top: centerBehindPlayer(_this)
                        },
                        function() {
                            _this.removeClass('active').hide(function() {
                                _this.css({
                                    left: '50%',
                                    top: currTop
                                });
                            });
                        });
                    });

                    var currTop = target.css('top');
                    _link.addClass('active');
                    target.addClass('active').css({
                        top: centerBehindPlayer(target)
                    }).show();
                    target.animate({
                        left: '65%',
                        top: currTop
                    },
                    function() {
                        target.css('z-index', '10');
                    });
                    $('.player').animate({
                        left: '30%'
                    });
                }
            }

            return false;
        };
    }).each(function() {
        if ($(window).width() > 600) {
            $($(this).attr('href')).hide();
        }
    });

    function centerBehindPlayer(target) {
      var posBehindPlayer = (parseInt($('.player').css('top')) + ($('.player').outerHeight() / 2)) - (target.outerHeight() / 2) + "px";
      return posBehindPlayer;
    }

    var _afterResize = function() {
        $('.images div').height($(document).height());
        if ($(window).width() < 600) {
            $('a.moreinfo').each(function() {
                $($(this).attr('href')).show();
            });
        } else {
            $('a.moreinfo').each(function() {
                var target = $($(this).attr('href'));
                if (target.hasClass('active')) {
                    target.show();
                } else {
                    target.hide();
                }
            });
        }
        repositionImages();
    }

    var imagePositions = {};
    var bgImageWidth = 1556;

    function repositionImages() {
      var offset = $(window).width() - bgImageWidth;
      var moveBy = (offset > 0) ? offset : 0;

      $('body').animate({
          'background-position-x': moveBy
      });
      $('.images').each(function() {
        var track = $(this).attr('className').replace(/images/, '').trim();
        if (track.length > 0) {
          if (imagePositions[track] == undefined) {
            imagePositions[track] = {};
            $(this).find('.image').each(function () {
              if ($(this).attr('style')) {
                var styleWithoutBgPosition = $(this).attr('style').replace(/background-position-x:\s+\d+px;/, '').trim();
                $(this).attr('style', styleWithoutBgPosition);
              }
              imagePositions[track][$(this).attr('id')] = { left: $(this).css('background-position-x') };
            });
          }

          $(this).find('.image').each(function () {
            var originalPos = parseInt(imagePositions[track][$(this).attr('id')].left);
            if (originalPos) {
              $(this).animate({
                'background-position-x': originalPos + moveBy + 'px'
              });
            };
          });
        }
      });
    }

    var _resizingWait;
    var _resize_handler = function() {
        try {
            if (_resizingWait !== false)
            clearTimeout(_resizingWait);
            _resizingWait = setTimeout(_afterResize, 200);
        } catch(err) {
            //do nothing
            }
    };

    $(window).resize(_resize_handler);

    repositionImages();

    var grid = new hashgrid({
      numberOfGrids: 1
    });
});
