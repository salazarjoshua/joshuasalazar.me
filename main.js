var regex = /<img.*?src="(.*?)"/;

var lastfmData = {
  baseURL:
    "https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=",
  user: "eyebr0w",
  api_key: "e5ac3c8a292c1e8c131d84b9acace9f1",
  additional: "&format=json&limit=1"
};

var getSetLastFM = function () {
  $.ajax({
    type: "GET",
    url:
      lastfmData.baseURL +
      lastfmData.user +
      "&api_key=" +
      lastfmData.api_key +
      lastfmData.additional,
    dataType: "json",
    success: function (resp) {
      var recentTrack = resp.recenttracks.track[0];

      // Get track art
      $("img#track-art").attr("src", recentTrack.image[2]["#text"]);
      // Get Icon
      $("img#track-time__icon").attr("src", "/assets/music-playing.svg");
      // Get timestamp
      if (recentTrack["@attr"]) {
        $("time#track-time__date").html("Now Playing");
      } else {
        let newDate = new Date(recentTrack.date["#text"]);
        newDate.addHours(8);
        $("time#track-time__date").html(timeSince(newDate) + " ago");
      }
      // Get track title
      $("p#track-title").html(recentTrack.name);
      // Get track artist
      $("p#track-artist").html(recentTrack.artist["#text"]);
      // Add link
      $("#track")
        .attr("href", recentTrack.url)
        .attr("target", "_blank")
        .attr("title", recentTrack.name + " by " + recentTrack.artist["#text"]);
    },
    // Error
    error: function (resp) {
      $("img#track-art").attr("src", "https://lastfm.freetls.fastly.net/i/u/770x0/552af1ac0196834b7e283d70e23a8863.jpg#552af1ac0196834b7e283d70e23a8863")
        .attr("target", "_blank");
      $("img#track-time__icon").attr("src", "/assets/music-playing.svg");
      $("time#track-time__date").html("BOYABOYABOYANOW");
      $("p#track-title").html("The Feels");
      $("p#track-artist").html("TWICE");
      $("#track")
        .attr("href", "https://open.spotify.com/track/308Ir17KlNdlrbVLHWhlLe?si=131db7e896074bc3")
        .attr("target", "_blank")
        .attr("title", "The Feels by TWICE");
    }
  });
};

getSetLastFM();
setInterval(getSetLastFM, 1000 * 1000);

// Convert time to minutes/hours/days ago
var timeSince = function (date) {
  if (typeof date !== 'object') {
    date = new Date(date);
  }

  var seconds = Math.floor((new Date() - date) / 1000);
  var intervalType;

  var interval = Math.floor(seconds / 31536000);
  if (interval >= 1) {
    intervalType = 'year';
  } else {
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
      intervalType = 'month';
    } else {
      interval = Math.floor(seconds / 86400);
      if (interval >= 1) {
        intervalType = 'day';
      } else {
        interval = Math.floor(seconds / 3600);
        if (interval >= 1) {
          intervalType = "hour";
        } else {
          interval = Math.floor(seconds / 60);
          if (interval >= 1) {
            intervalType = "minute";
          } else {
            interval = seconds;
            intervalType = "second";
          }
        }
      }
    }
  }

  if (interval > 1 || interval === 0) {
    intervalType += 's';
  }

  return interval + ' ' + intervalType;
};

// Convert to GMT+8
Date.prototype.addHours = function (h) {
  this.setHours(this.getHours() + h);
  return this;
}

// Letterboxd 
const RSS_URL = "https://letterboxd.com/joshuasalazar/rss/";

$.ajax(RSS_URL, {
  accepts: {
    xml: "application/rss+xml"
  },

  dataType: "xml",

  success: function (data) {
    $(data)
      .find("item")
      .first()
      .each(function () {
        const el = $(this);

        // Get film art
        $("img#film-art").attr("src", regex.exec(el.find("description").text())[1]);
        // Get Icon
        $("img#film-time__icon").attr("src", "/assets/eye.svg");
        // Get timestamp
        let newDate = new Date(el.find("pubDate").text());
        $("time#film-time__date").html(timeSince(newDate) + " ago");
        // Get film title
        var filmTitle = el.find("letterboxd\\:filmTitle").text();
        $("p#film-title").html(filmTitle);
        // Get film year
        $("span#film-year").html(el.find("letterboxd\\:filmYear").text());
        // Get film rating
        $("p#film-rating").html(el.find("letterboxd\\:memberRating").text());
        // Add link
        $("#film")
          .attr("href", el.find("link").text())
          .attr("target", "_blank")
          .attr("title", filmTitle + " (" + filmYear + ")");
      });
  },
  // Error
  error: function (resp) {
    $("img#film-art").attr("src", "https://a.ltrbxd.com/resized/film-poster/5/5/4/4/3/8/554438-happy-old-year-0-460-0-690-crop.jpg?k=dd60155386");

    $("img#film-time__icon").attr("src", "/assets/eye.svg");

    $("time#film-time__date").html("Rewatching");

    $("p#film-title").html("Happy Old Year");

    $("span#film-year").html("2019");

    $("p#film-rating").html("5.0");

    $("#film")
          .attr("href", "https://letterboxd.com/joshuasalazar/film/happy-old-year/")
          .attr("target", "_blank")
          .attr("title", "Happy Old Year (2019)");
    
  }
});

/** Tooltip *****/
var tooltips = document.querySelectorAll('.tooltip span');

window.onmousemove = function (e) {
    var x = (e.clientX) + 'px',
        y = (e.clientY) + 'px';
    for (var i = 0; i < tooltips.length; i++) {
        tooltips[i].style.top = y;
        tooltips[i].style.left = x;
    }
};