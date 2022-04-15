const lastfmData = {
  baseURL:
    "https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=",
  user: "eyebr0w",
  api_key: "e5ac3c8a292c1e8c131d84b9acace9f1",
  additional: "&format=json&limit=1"
};

const getSetLastFM = function () {
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
      const recentTrack = resp.recenttracks.track[0];

      // Get track art
      $("img#track-art").attr("src", recentTrack.image[2]["#text"]);

      // Get timestamp
      if (recentTrack["@attr"]) {
        $("#track-time__date").html("Now Playing");
        $(".track-time__icon").addClass("playing");
      } else {
        let newDate = new Date(recentTrack.date["#text"]).addHours(8);
        $("#track-time__date").html(timeSince(newDate) + " ago");
        $(".track-time__icon").removeClass("playing");
      }
      // Get track title
      $("p#track-title").html(recentTrack.name);
      // Get track artist
      $("p#track-artist").html(recentTrack.artist["#text"]);
      // Add link
      $("#track")
        .attr("href", recentTrack.url)
        .attr("title", recentTrack.name + " by " + recentTrack.artist["#text"]);

      // Hide Loading
      $(".track-time__icon").removeClass("hide");
      $("#track .load").removeClass("load");
      $("#track .load--short").removeClass("load--short");
      $("#track .load--medium").removeClass("load--medium");
      $("#track .load--long").removeClass("load--long");
    },
    // Error
    error: function (resp) {
      $("img#track-art").attr("src", "https://lastfm.freetls.fastly.net/i/u/770x0/552af1ac0196834b7e283d70e23a8863.jpg#552af1ac0196834b7e283d70e23a8863")
        .attr("target", "_blank");
      $("img#track-time__icon").attr("src", "/assets/music-playing.svg");
      $("#track-time__date").html("BOYABOYABOYANOW");
      $("p#track-title").html("The Feels");
      $("p#track-artist").html("TWICE");
      $("#track")
        .attr("href", "https://open.spotify.com/track/308Ir17KlNdlrbVLHWhlLe?si=131db7e896074bc3")
        .attr("title", "The Feels by TWICE");

      // Hide Loading
      $(".track-time__icon").removeClass("hide");
      $("#track .load").removeClass("load");
      $("#track .load--short").removeClass("load--short");
      $("#track .load--medium").removeClass("load--medium");
      $("#track .load--long").removeClass("load--long");
    }
  });
};

getSetLastFM();
setInterval(getSetLastFM, 1000 * 10);

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

// Add hours
Date.prototype.addHours = function (h) {
  this.setHours(this.getHours() + h);
  return this;
}

const regex = /<img.*?src="(.*?)"/;

// Letterboxd 
fetch("https://jslbrss.herokuapp.com/")
  .then(res => res.json())
  .then(data => {
    latestFilm = data
    // console.log(latestFilm)
    let filmArt = regex.exec(latestFilm.content)[1];
    let newDate = new Date(latestFilm.pubDate);
    let filmTitle = latestFilm.filmTitle;
    let filmYear = latestFilm.filmYear;
    let memberRating = latestFilm.memberRating;
    let filmLink = latestFilm.link;

    $("#film-art").attr("src", filmArt);
    $("#film-time__icon").attr("src", "/assets/eye.svg");
    $("#film-time__date").html(timeSince(newDate) + " ago");
    $("#film-title").html(filmTitle);
    $("#film-year").html(filmYear);
    $("#film-rating").html(getStars(memberRating));
    $("#film")
      .attr("href", filmLink)
      .attr("title", filmTitle + " (" + filmYear + ")");

    $("#film-year").removeClass("hide");
    $("#film .load").removeClass("load");
    $("#film .load--short").removeClass("load--short");
    $("#film .load--medium").removeClass("load--medium");
    $("#film .load--long").removeClass("load--long");
  })
  .catch(error => {
    $("#film-art").attr("src", "https://a.ltrbxd.com/resized/film-poster/5/5/4/4/3/8/554438-happy-old-year-0-460-0-690-crop.jpg?k=dd60155386");
    $("#film-time__icon").attr("src", "/assets/eye.svg");
    $("#film-time__date").html("CRYING RN");
    $("#film-title").html("Happy Old Year");
    $("#film-year").html("2019");
    $("#film-rating").html(getStars(5.0));
    $("#film")
      .attr("href", "https://letterboxd.com/joshuasalazar/film/happy-old-year/")
      .attr("title", "Happy Old Year (2019)");

    $("#film-year").removeClass("hide");
    $("#film > .load, .load--short, .load--medium, .load--long").removeClass("load");
    $("#film .load--short").removeClass("load--short");
    $("#film .load--medium").removeClass("load--medium");
    $("#film .load--long").removeClass("load--long");
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
const tooltips = document.querySelectorAll('.tooltip span');

window.onmousemove = function (e) {
  let x = (e.clientX) + 'px',
    y = (e.clientY) + 'px';
  for (let i = 0; i < tooltips.length; i++) {
    tooltips[i].style.top = y;
    tooltips[i].style.left = x;
  }
};


// Modal 

const openWarning = document.querySelectorAll('.warning');
const dialog = document.querySelector('.dialog');
const cancelBtn = document.querySelector('.dialog__cancel');
const agreeBtn = document.querySelector('.dialog__agree');
const body = document.querySelector('body');
let previousActiveElement;


// Open Warning

function handleOpenWarning(event) {
  event.preventDefault();

  const button = event.currentTarget;
  // grab anchor link
  const link = button.closest('.warning');

  // change paragraph
  const dialogText = document.querySelector('.dialog p');
  dialogText.innerHTML = `The following film contains <span class="c-pink"><b>${link.dataset.warning}</b></span>. Do you wish to proceed?`

  agreeBtn.href = link.href;
  // open modal
  dialog.classList.add('open');
  body.style.overflow = "hidden";
  // change focus
  previousActiveElement = document.activeElement;
  cancelBtn.focus();
}

openWarning.forEach((button) => button.addEventListener('click', handleOpenWarning));

// Close Warning
function closeWarning() {
  dialog.classList.remove('open');
  body.style.overflow = "auto";
  previousActiveElement.focus();
}

dialog.addEventListener('click', (event) => {
  const isOutside = !event.target.closest('.dialog__inner');
  if (isOutside) {
    closeWarning();
  }
});

window.addEventListener('keydown', (event) => {
  const isOpen = dialog.classList.contains('open');
  if (event.key === 'Escape' && isOpen) {
    closeWarning();
  }
});

cancelBtn.addEventListener('click', closeWarning);
agreeBtn.addEventListener('click', closeWarning);

// Trap Focus on Modal
const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

function trapFocusModal(modal) {
  const focusableContent = modal.querySelectorAll(focusableElements);
  const firstFocusableElement = modal.querySelectorAll(focusableElements)[0];
  const lastFocusableElement = focusableContent[focusableContent.length - 1];

  document.addEventListener('keydown', function (e) {
    let isTabPressed = e.key === 'Tab' || e.keyCode === 9;

    if (!isTabPressed) {
      return;
    }

    if (e.shiftKey) { // if shift key pressed for shift + tab combination
      if (document.activeElement === firstFocusableElement) {
        lastFocusableElement.focus(); // add focus for the last focusable element
        e.preventDefault();
      }
    } else { // if tab key is pressed
      if (document.activeElement === lastFocusableElement) { // if focused has reached to last focusable element then focus first focusable element after pressing tab
        firstFocusableElement.focus(); // add focus for the first focusable element
        e.preventDefault();
      }
    }
  });
}

const trapFocus = document.querySelector(".trapfocus")
trapFocusModal(trapFocus);
