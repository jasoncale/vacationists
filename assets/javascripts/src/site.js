var Vacationists = {};

Vacationists.Player = (function () {
  // private attributes
  var tracks = [];
  var broadcast = new LoudMouth('player');
  var playerDefaults = {
    sel: '.track',
    player: {
      players: [{ type: "flash", src: "/media/player.swf" }],
      playlist: "none",
      flashplayer: "/media/player.swf",
      provider: "sound",
      height: 24,
      width: 250,
      dock: false,
      controlbar: "bottom",
      "playlist.position": "none",
      backcolor: "ffffff",
      frontcolor: "333333",
      wmode: "transparent"
    }
  };
  var settings = {}
  var currentTrack = 0;

  // private methods
  var init = function (options) {
    settings = $.extend(playerDefaults, options);
    initTracks(settings.sel);
  }

  var initTracks = function (trackSel) {
    $(trackSel).each(function () {
      if ($(this).attr('href')) {
        var playerOpts = $.extend(
          {
            duration: parseInt($(this).attr('data-duration')),
            file: $(this).attr('href')
          }, settings.player
        );

        var player = jwplayer($(this).attr('id')).setup(playerOpts).onPlay(function() {
          broadcast.fireEvent('trackPlay', this)
        }).onPause(function () {
          broadcast.fireEvent('trackPause', this)
        }).onIdle(function () {
          broadcast.fireEvent('trackStop', this)
        }).onComplete(function() {
          broadcast.fireEvent('trackComplete', this)
        });

        player.setVolume(100);

        tracks.push(player);
      }
    });
  }

  var stopAllTracks = function (exclude) {
    $(tracks).each(function() {
      if (this.id != exclude.id && this.getState().match(/PLAYING|PAUSED|BUFFERING/)) {
        this.stop();
      };
    });
  }

  var playNextTrack = function (current) {
    var currentTrackPos = tracks.indexOf(current);
    if (currentTrackPos < (tracks.length - 1)) {
        tracks[currentTrackPos + 1].play();
    };
  }

  broadcast.registerCallback('trackPlay', function (track) { currentTrack = track; stopAllTracks(track); });
  broadcast.registerCallback('trackComplete', function (track) { playNextTrack(track); });

  var _registerCallback = function(name, callback) { broadcast.registerCallback(name, callback); }
  var _playTrackId = function (trackId) { jwplayer(trackId).play(); }
  var _currentTrackNumber = function () { return tracks.indexOf(currentTrack) + 1; }

  return {
    // public methods
    setup: init,
    registerCallback: _registerCallback,
    playTrackId: _playTrackId,
    currentTrackNumber: _currentTrackNumber
  }

})();

Vacationists.Layout = (function () {
  var imagePositions = {};
  var bgImageWidth = 1556;
  var resizingWait;
  var fadeInTimer;

  var init = function () {
    setupPanelLinks();
    initToggleLinks('.toggle-track');
    $(window).resize(resizeHandler);
    repositionImages();
  }

  var initToggleLinks = function (sel) {
    $(sel).click(function() {
      Vacationists.Player.playTrackId($(this).attr('data-track'));
      return false;
    });
  }

  var showTrackPictures = function (track) {
    var trackClass = "track_" + Vacationists.Player.currentTrackNumber();

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
  }

  var updateTrackStatus = function (track) {
    var state = track.getState();
    var trackEl = $('a[data-track="' + track.id + '"]');
    var stateEl = trackEl.siblings('em.state');

    if (!stateEl.length) {
      trackEl.after('<em class="state" />');
      stateEl = trackEl.siblings('em.state');
    };

    trackEl.removeClass('paused playing');

    switch(state)
    {
    case "PLAYING":
      stateEl.text(" is playing");
      trackEl.addClass('playing');
      showTrackPictures(track);
      break;
    case "PAUSED":
      stateEl.text(" is paused");
      trackEl.addClass('paused');
      break;
    default:
      stateEl.text("");
    }
  }

  var setupPanelLinks = function () {
    $('a.moreinfo').click(function() {
      if ($(window).width() > 600) {
          var _link = $(this);
          var target = $(_link.attr('href'));
          if (target) {
              if (target.hasClass('active')) {
                  closePanel(target);
              } else {
                  openPanel(target);
              }
          }

          return false;
      };
    }).each(function() {
      if ($(window).width() > 600) {
        $($(this).attr('href')).hide();
      }
    });
  }

  var closeActivePanels = function () {
    $('a.moreinfo.active').removeClass('active');
    $('.info.active').each(function() {
      var _this = $(this);
      var currTop = _this.css('top');
      _this.css('z-index', '-1').animate(
        {
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
        }
      );
    });
  }

  var closePanel = function (target) {
    var links = $('a[href="#' + target.attr('id') + '"]');
    var currTop = target.css('top');

    target.css('z-index', '-1').animate(
      {
        left: '50%',
        top: centerBehindPlayer(target)
      },
      function() {
        links.removeClass('active');
        target.removeClass('active').hide().css({
          top: currTop
        });
      }
    );

    $('.player').animate({
        left: '50%'
    });
  }

  var openPanel = function (target) {
    closeActivePanels();

    var links = $('a[href="#' + target.attr('id') + '"]');
    var currTop = target.css('top');

    links.addClass('active');

    target.addClass('active').css({
      top: centerBehindPlayer(target)
    }).show();

    target.animate(
      {
        left: '65%',
        top: currTop
      }, function() {
        target.css('z-index', '10');
      }
    );

    $('.player').animate({
        left: '30%'
    });
  }

  var centerBehindPlayer = function (target) {
    var posBehindPlayer = (parseInt($('.player').css('top')) + ($('.player').outerHeight() / 2)) - (target.outerHeight() / 2) + "px";
    return posBehindPlayer;
  }

  var afterResize = function() {
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

  var repositionImages = function() {
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

  var resizeHandler = function() {
    try {
      if (resizingWait !== false)
      clearTimeout(resizingWait);
      resizingWait = setTimeout(afterResize, 200);
    } catch(err) {
      //do nothing
    }
  };

  Vacationists.Player.registerCallback('trackPlay', function (track) { updateTrackStatus(track); });
  Vacationists.Player.registerCallback('trackPause', function (track) { updateTrackStatus(track); });
  Vacationists.Player.registerCallback('trackComplete', function (track) { updateTrackStatus(track); });
  Vacationists.Player.registerCallback('trackStop', function (track) { updateTrackStatus(track); });

  return {
    // public methods
    setup: init
  }

})();


$(document).ready(function() {
  $('html').removeClass('no-js').addClass('has-js');

  Vacationists.Player.setup();
  Vacationists.Layout.setup();

  // var grid = new hashgrid({
  //   numberOfGrids: 1
  // });
});
