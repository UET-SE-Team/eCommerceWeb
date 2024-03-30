// init Isotope
var $grid = $('.collection-list').isotope({
  // options
});
// filter items on button click
$('.filter-button-group').on( 'click', 'button', function() {
  var filterValue = $(this).attr('data-filter');
  resetFilterBtns();
  $(this).addClass('active-filter-btn');
  $grid.isotope({ filter: filterValue });
});

var filterBtns = $('.filter-button-group').find('button');
function resetFilterBtns() {
  filterBtns.each(function() {
      $(this).removeClass('active-filter-btn');
  });
}

// switch signup/login
const container = document.getElementById('user-box');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

// clicking login to popup the box login/sign-up
const popup = document.querySelector(".popup");
const userBtn = document.querySelector("#userBtn");
const closeBtn = document.querySelector(".popup .close-btn");
const overlayer = document.querySelector(".overlayer");

userBtn.addEventListener("click", function() {
    popup.classList.add("active");

    // blur the background when logging in/signing up
    overlayer.classList.add("pop");
});
closeBtn.addEventListener("click", function() {
    popup.classList.remove("active");
    overlayer.classList.remove("pop");
});