var tracks = [];
$(document).ready(function() {
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
        fuck();
        var currentTrack = tracks.indexOf(player);
        if (currentTrack < (tracks.length - 1)) {
          tracks[currentTrack + 1].play();
        };
      });
      tracks.push(player);
    }
  });

  $('.toggle-track').click(function () {
    jwplayer($(this).attr('data-track')).play();
    var state = jwplayer($(this).attr('data-track')).getState();

    $('.toggle-track, #content').removeClass('playing paused');
    $('#track-listing em.state').remove();

    $(this).after('<em class="state" />');

    if (state == "PLAYING" || state == "BUFFERING") {
      $(this).addClass('playing');
      $('#content').addClass('playing');
    } else if (state == "PAUSED") {
      $(this).addClass('paused');
      $('#content').addClass('paused');
      $(this).siblings('em.state').text(" is paused");
    }

    return false;
  });

});
