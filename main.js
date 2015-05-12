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
    img.setAttribute('class', 'poster');
    docFragment.appendChild(img);

    var h1 = document.createElement('H1');
    h1.setAttribute('class', 'title');
    docFragment.appendChild(h1);
    var t = document.createTextNode(title);
    h1.appendChild(t);

    var h2 = document.createElement('H2');
    h2.setAttribute('class', 'year');
    docFragment.appendChild(h2);
    var y = document.createTextNode(year);
    h2.appendChild(y);

    var p_1 = document.createElement('P');
    p_1.setAttribute('class', 'rating');
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

// On click from the "+" button, takes the data stored from the
// movie (DON'T KNOW WHERE YET) and appends the following docFragment
// to the ".result-table-body".
function tableElement (poster, title, year, rating) {

  var docFragment = document.createDocumentFragment();

  var tr = document.createElement('TR');
  docFragment.appendChild(tr);

  var td = document.createElement('TD');
  tr.appendChild(td);
  var img = document.createElement('IMG');
  img.setAttribute('src', poster);
  td.appendChild(img);

  var td_0 = document.createElement('TD');
  tr.appendChild(td_0);
  var t = document.createTextNode(title);
  td_0.appendChild(t);

  var td_1 = document.createElement('TD');
  tr.appendChild(td_1);
  var y = document.createTextNode(year);
  td_1.appendChild(y);

  var td_2 = document.createElement('TD');
  tr.appendChild(td_2);
  var ra = document.createTextNode(rating);
  td_2.appendChild(ra);

  var td_3 = document.createElement('TD');
  tr.appendChild(td_3);
  var input = document.createElement('INPUT');
  input.setAttribute("type", "button");
  input.setAttribute("name", "delete");
  input.setAttribute("value", "x");
  td_3.appendChild(input);

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
})

// On click, adds the data for the current movie using a docFragment
// created by tableElement().
$('input[name="add"]').click(function () {
  debugger;
  event.preventDefault();

  $('.saved-result-table').css('visibility','visible');

  var poster = $(this).siblings('.poster')[0].src;
  var title = $(this).siblings('.title')[0].textContent;
  var year = $(this).siblings('.year')[0].textContent;
  var rating = $(this).siblings('.rating')[0].textContent;

  $('.result-table-body').append(tableElement(poster, title, year, rating));
});
