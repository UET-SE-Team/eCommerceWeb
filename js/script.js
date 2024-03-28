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
  document.querySelector("#userBtn").addEventListener("click", function() {
      document.querySelector(".popup").classList.add("active");
  });
  document.querySelector(".popup .close-btn").addEventListener("click", function() {
      document.querySelector(".popup").classList.remove("active");
  });