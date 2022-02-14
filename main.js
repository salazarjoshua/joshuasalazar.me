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

      var trackImg = recentTrack.image[2]["#text"];
      var trackTimestamp = recentTrack.date["#text"];
      var trackTitle = recentTrack.name;
      var trackArtist = recentTrack.artist["#text"];
      var trackLink = "recentTrack.url"

      $("img#track-art").attr("src", trackImg);
      $("img#track-time__icon").attr("src", "/assets/music-playing.svg");
      if (recentTrack["@attr"]) {
        $("time#track-time__date").html("Now Playing");
      } else {
        let newDate = new Date(trackTimestamp);
        newDate.addHours(8);
        $("time#track-time__date").html(timeSince(newDate) + " ago");
      }
      $("p#track-title").html(trackTitle);
      $("p#track-artist").html(trackArtist);
      $("#track")
        .attr("href", trackLink)
        .attr("target", "_blank")
        .attr("title", trackTitle + " by " + trackArtist);
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
fetch("https://jslbrss.herokuapp.com/")
  .then(res => res.json())
  .then(data => {
    latestFilm = data
    // console.log(latestFilm)
    var filmArt = regex.exec(latestFilm.content)[1]
    let newDate = new Date(latestFilm.pubDate);
    var filmTitle = latestFilm.filmTitle;
    var filmYear = latestFilm.filmYear;
    var memberRating = latestFilm.memberRating;
    var filmLink = latestFilm.link;

    $("img#film-art").attr("src", filmArt);
    $("img#film-time__icon").attr("src", "/assets/eye.svg");
    $("time#film-time__date").html(timeSince(newDate) + " ago");
    $("p#film-title").html(filmTitle);
    $("span#film-year").html(filmYear);
    $("span#film-rating").html(getStars(memberRating));
    $("#film")
      .attr("href", filmLink)
      .attr("target", "_blank")
      .attr("title", filmTitle + " (" + filmYear + ")");
  })
  .catch(error => {
    $("img#film-art").attr("src", "https://a.ltrbxd.com/resized/film-poster/5/5/4/4/3/8/554438-happy-old-year-0-460-0-690-crop.jpg?k=dd60155386");
    $("img#film-time__icon").attr("src", "/assets/eye.svg");
    $("time#film-time__date").html("CRYING RN");
    $("p#film-title").html("Happy Old Year");
    $("span#film-year").html("2019");
    $("span#film-rating").html(getStars(5.0));
    $("#film")
          .attr("href", "https://letterboxd.com/joshuasalazar/film/happy-old-year/")
          .attr("target", "_blank")
          .attr("title", "Happy Old Year (2019)");
  })


/** Film Rating */
function getStars(rating) {
  // Round to nearest half
  rating = Math.round(rating * 2) / 2;
  let output = [];

  // Append all the filled whole stars
  for (var i = rating; i >= 1; i--)
    output.push('<i class="star star-fill" aria-hidden="true"></i>');

  // If there is a half a star, append it
  if (i == .5) output.push('<i class="star star-half" aria-hidden="true"></i>');

  // Fill the empty stars
  for (let i = (5 - rating); i >= 1; i--)
    output.push('<i class="star star-blank" aria-hidden="true"></i>');

  return output.join('');
}

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






