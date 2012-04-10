var tracks = [];
$(document).ready(function() {
  $('body').addClass('js-enabled');

  $('.track').each(function () {
    if ($(this).attr('href')) {
      var player = jwplayer($(this).attr('id')).setup({
        players: [
              {type: "flash", src: "/media/player.swf"}
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
        "playlist.position" : "none",
        backcolor: "ffffff",
        frontcolor: "333333",
        wmode: "transparent"
      }).onPlay(function () {
        var currentId = this.id;
        $(tracks).each(function () {
          if (this.id != currentId && this.getState().match(/PLAYING|PAUSED|BUFFERING/)) {
            this.stop();
          };
        });
        $('a[data-track="'+this.id+'"]').siblings('em.state').text(" is playing");
      }).onComplete(function () {
        $('a[data-track="'+this.id+'"]').siblings('em.state').remove();
        var currentTrack = tracks.indexOf(player);
        if (currentTrack < (tracks.length - 1)) {
          tracks[currentTrack + 1].play();
        };
      });
      tracks.push(player);
    }
  });

  $('.toggle-track').click(function () {
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

    var trackClass = "track_" + (tracks.indexOf(track)+1);

    if (!$('.images').hasClass(trackClass)) {
      $('.images').attr('class', 'images '+trackClass).fadeIn('slow');
    }

    return false;
  });

  $('a.moreinfo').click(function () {
    var target = $($(this).attr('href'));
    if (target) {
      if (target.hasClass('active')) {
        target.css('z-index', '-1').animate({ left: '50%' }, function () {
          target.removeClass('active').hide();
        });
        $('.player').animate({ left: '50%' });
      } else {
        // close any active panels
        $('.info.active').each(function () {
          var _this = $(this);
          _this.css('z-index', '-1').animate({ left: '30%' }, function () {
            _this.removeClass('active').hide(function () {
              _this.css('left', '50%');
            });
          });
        });

        target.addClass('active').show();
        target.animate({left: '65%', opacity: 1}, function () {
          target.css('z-index', '10');
        });
        $('.player').animate({ left: '30%' });
      }
    }

    return false;
  }).each(function () {
    $($(this).attr('href')).hide();
  });

  $(window).resize(function () {
    $('.images div').height($(document).height());
  });

   // var grid = new hashgrid({
   //   numberOfGrids: 1
   // });
});
