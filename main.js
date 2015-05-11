var API_URL = 'http://www.omdbapi.com/?t=TITLE&y=&plot=short&r=json';
var FIREBASE_URL = 'https://mymoviedatabase.firebaseio.com/movies.json';


// Takes data from the AJAX Request initialized on the click
// of the search button, sets it to local variables and
// transfers it to display().
function setDisplayValues (data) {
  if (data.Response === "False") { // checks for errors
    var errorMessage = data.Error;
  } else {
    var poster = data.Poster;
    var title = data.Title;
    var year = data.Year;
    var plot = data.Plot;
    var rating = data.imdbRating;

    $('.search-result').empty();
    $('.search-result').append(display(poster, title, year, plot, rating, errorMessage));
  }
}


// Takes stored data passed as arguments and creates an document
// fragment from it, which it then returns.
function display (poster, title, year, plot, rating, errorMessage) {

  var docFragment = document.createDocumentFragment();

  if (errorMessage) { // appends error message to docFragment

    var p = document.createElement('P');
    docFragment.appendChild(p);
    var errMes = document.createTextNode(errorMessage);
    p.appendChild(errMess);

  } else { // appends data to docFragment

    var img = document.createElement('IMG');
    img.setAttribute('src', poster);
    docFragment.appendChild(img);

    var h1 = document.createElement('H1');
    docFragment.appendChild(h1);
    var t = document.createTextNode(title);
    h1.appendChild(t);

    var h2 = document.createElement('H2');
    docFragment.appendChild(h2);
    var y = document.createTextNode(year);
    h2.appendChild(y);

    var p_1 = document.createElement('P');
    docFragment.appendChild(p_1);
    var ra = document.createTextNode(rating);
    p_1.appendChild(ra);

    var p_2 = document.createElement('P');
    docFragment.appendChild(p_2);
    var pl = document.createTextNode(plot);
    p_2.appendChild(pl);

    var input = document.createElement('INPUT');
    input.setAttribute("type", "button");
    input.setAttribute("name", "add");
    input.setAttribute("value", "+");
    docFragment.appendChild(input);

  }

  return docFragment;
}


// On click, takes the value of "title" entered by a user, appends
// it to the API_URL, and sends an AJAX request with callback function
// setDisplayValues().
$('input[name="search"]').click(function() {
  event.preventDefault();

  var URL = API_URL.replace('TITLE', function() {
    return $('input[name="title"]').val(); // title of the movie entered
  });

  $.get(URL, setDisplayValues);

  $('.saved-result-table').css('visibility','visible');
})

// On click, adds the data for the current movie
