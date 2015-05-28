var API_URL = 'http://www.omdbapi.com/?t=TITLE&y=&plot=short&r=json';
var FIREBASE_URL = 'https://mymoviedatabase.firebaseio.com';
var fb = new Firebase(FIREBASE_URL);
var movies;
var initLoad = true;

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
  }

    $('.search-result').empty();
    $('.search-result').append(display(poster, title, year, plot, rating, errorMessage));

}


// Takes stored data passed as arguments and creates an document
// fragment from it, which it then returns.
function display (poster, title, year, plot, rating, errorMessage) {

  var docFragment = document.createDocumentFragment();

  if (errorMessage) { // appends error message to docFragment

    var p = document.createElement('P');
    docFragment.appendChild(p);
    var errMes = document.createTextNode(errorMessage);
    p.appendChild(errMes);

  } else { // appends data to docFragment

    var img = document.createElement('IMG');
    img.setAttribute('src', poster);
    img.setAttribute('class', 'poster');
    img.setAttribute('class', 'col-sm-6');
    docFragment.appendChild(img);

    var div = document.createElement('DIV');
    div.setAttribute('class', 'col-sm-6');
    docFragment.appendChild(div);

    var h1 = document.createElement('H1');
    h1.setAttribute('class', 'title');
    div.appendChild(h1);
    var t = document.createTextNode(title);
    h1.appendChild(t);

    var h2 = document.createElement('H2');
    h2.setAttribute('class', 'year');
    div.appendChild(h2);
    var y = document.createTextNode(year);
    h2.appendChild(y);

    var p_1 = document.createElement('P');
    p_1.setAttribute('class', 'rating');
    div.appendChild(p_1);
    var ra = document.createTextNode(rating);
    p_1.appendChild(ra);

    var p_2 = document.createElement('P');
    div.appendChild(p_2);
    var pl = document.createTextNode(plot);
    p_2.appendChild(pl);

    var input = document.createElement('INPUT');
    input.setAttribute("type", "button");
    input.setAttribute("name", "add");
    input.setAttribute("value", "+");
    div.appendChild(input);

  }

  return docFragment;

}


// Retrieves a data item from the Firebase, grabs the data elements
// in the item and sends them to tableElement() to create a table row.
function retrieveTableValues (data, id) {

  $('.result-table-body')
    .append(tableElement(data.p, data.t, data.y, data.r, id));

}


// On click from the "+" button or from page load via retrieveTableValues(),
// takes the data and appends the following docFragment to the
// ".result-table-body".
function tableElement (poster, title, year, rating, id) {

  var docFragment = document.createDocumentFragment();

  var tr = document.createElement('TR');
  tr.setAttribute('data-id', id);
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


// On page load, adds the movies contained in the Firebase to
// ".saved-result-table" using retrieveTableValues().
$(window).load(function() {

  fb.onAuth(function(authData) {
    movies = fb.child(`users/${fb.getAuth().uid}/movies`);
    movies.on('child_added', function(snap) {
      retrieveTableValues(snap.val(), snap.key()); // movies[id], id
    }, function(err) {
      console.log(err.code);
    })
  })

});

// On click, takes the value of "title" entered by a user, appends
// it to the API_URL, and sends an AJAX request with callback function
// setDisplayValues().
$('input[name="search"]').click(function() {

  event.preventDefault();

  var URL = API_URL.replace('TITLE', function() {
    return $('input[name="title"]').val(); // title of the movie entered
  });

  // API request
  $.get(URL, setDisplayValues);

})


// On click, finds the button contained in ".search-result", ADDS it to
// the table using tableElement(), creates a data object and sends it to
// the Firebase.
$('.search-result').on('click', 'input[name="add"]', function () {

  event.preventDefault();

  var poster = $(this).parent().parent().children().first()[0].src;
  var title = $(this).siblings('.title')[0].textContent;
  var year = $(this).siblings('.year')[0].textContent;
  var rating = $(this).siblings('.rating')[0].textContent;

  var dataObject = {
    p : poster,
    t : title,
    y : year,
    r : rating
  };

  movies.push(dataObject);

});


// On click, finds the button contained in ".saved-result-table", grabs the movie
// represented by a table row, selects that movie's data-id and uses this to DELETE
// it from the Firebase and remove the movie from the table.
$('.saved-result-table').on('click', 'input[name="delete"]', function () {

  event.preventDefault();

  var $movie = $(this).closest('tr');
  var id = $movie.attr('data-id');

  movies.child(`${id}`).remove(function(err){
    if (err) {
      console.log(err);
    } else {
      $movie.remove();
    }
  });
});

// login handling

// On submit, logs a user into the page.
$('.on-login-page form').on('submit', function() {
  var email    = $('.on-login-page input[type="email"]').val();
  var password = $('.on-login-page input[type="password"]').val();

  doLogin(email, password, function() {
    window.location.reload();
  });
  event.preventDefault();
})

// Resets a user's password, sending them a new one in an email.
$('.do-reset-password').on('click', function(){
  var email = $('.on-login-page input[type="email"]').val();

  fb.resetPassword({
    email: email
  }, function (err) {
    if (err) {
      alert(err.toString());
    } else {
      alert('Check your email!')
    }
  })
})

// On click, registers a new user using the email and password entered.
$('.do-register').on('click', function () {
  var email    = $('.on-login-page input[type="email"]').val();
  var password = $('.on-login-page input[type="password"]').val();

  fb.createUser({
    email: email,
    password: password
  }, function(err, userData) {
    if (err) {
      alert(err.toString());
    } else {
      doLogin(email, password, function() {
        window.location.reload();
      });
    }
  })

  event.preventDefault();
})

// On click, changes the user's password from their old password to the new one.
$('.on-temp-password form').submit(function() {
  var email = fb.getAuth().password.email;
  var oldPw = $('input[name="old-password"]').val();
  var newPw = $('input[name="new-password"]').val();

  fb.changePassword({
    email: email,
    oldPassword: oldPw,
    newPassword: newPw
  }, function(err) {
    if (err) {
      alert(err.toString());
    } else {
      fb.unauth();
    }
  });

  event.preventDefault();
});

// Logs a user out of the page.
$('.do-logout').on('click', function(){
  fb.unauth(function() {
    window.location.reload();
  });
})

// Clears the form information
function clearLoginForm() {
  $('input[type="email"]').val('');
  $('input[type="password"]').val('');
}

// Puts the user in the data base.
function saveAuthData(authData) {
  fb.child(`users/${authData.uid}/profile`).set(authData);
}

// Logs a user in using their email and password and takes a
// callback function that can be run optionally.
function doLogin(email, password, cb) {
  fb.authWithPassword({
    email: email,
    password: password
  }, function(err, authData) {
    if(err) {
      alert(err.toString());
    } else {
      saveAuthData(authData);
      typeof cb === 'function' && cb(authData);
    }
  })
}

// Executes upon pageload. Changes the page based upon
// whether or not a user is logged in and what
// page is currently loaded.
fb.onAuth(function (authData) {
  if (initLoad) {
    if (authData && authData.password.isTemporaryPassword) {
      if (window.location.pathname !== '/password.html') {
        window.location = '/password.html';
      }
    } else if (authData) {
      if (window.location.pathname !== '/' && fb.getAuth()) {
        window.location = '/';
      }
    } else {
      if (window.location.pathname !== '/login.html' && !fb.getAuth()) {
        window.location = '/login.html';
      }
    }
  }
  initLoad = false;
})
