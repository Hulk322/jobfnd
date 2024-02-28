jQuery(document).ready(function($) {
	
	
	$('.container-bg img').each(function() {
	  var imgSrc = $(this).attr('src');
	  $(this).parent().css({'background-image': 'url('+imgSrc+')'});
	  $(this).remove();
	});

	$('.container-bg.bg-2 img').each(function() {
	  var imgSrc = $(this).attr('src');
	  $(this).parent().css({'background-image': 'url('+imgSrc+')'});
	  $(this).remove();
	});


	$('.green-bg img').each(function() {
	  var imgSrc = $(this).attr('src');
	  $(this).parent().css({'background-image': 'url('+imgSrc+')'});
	  $(this).remove();
	});


	$('.magenta-bg img').each(function() {
	  var imgSrc = $(this).attr('src');
	  $(this).parent().css({'background-image': 'url('+imgSrc+')'});
	  $(this).remove();
	});


	$('.first-row .col6-image img').each(function() {
	  var imgSrc = $(this).attr('src');
	  $(this).parent().css({'background-image': 'url('+imgSrc+')'});
	  $(this).remove();
	});


	$('.second-row .kids-bg img').each(function() {
	  var imgSrc = $(this).attr('src');
	  $(this).parent().css({'background-image': 'url('+imgSrc+')'});
	  $(this).remove();
	});



	$('.second-row .kids-bg-image img').each(function() {
	  var imgSrc = $(this).attr('src');
	  $(this).parent().css({'background-image': 'url('+imgSrc+')'});
	  $(this).remove();
	});


	$('.third-row .kids-bg-image img').each(function() {
	  var imgSrc = $(this).attr('src');
	  $(this).parent().css({'background-image': 'url('+imgSrc+')'});
	  $(this).remove();
	});


	$('.third-row .col6-image img').each(function() {
	  var imgSrc = $(this).attr('src');
	  $(this).parent().css({'background-image': 'url('+imgSrc+')'});
	  $(this).remove();
	});

	

  /*var clicked = true; 

  $('[show-password]').click(function() {
    
    if (clicked) {
      $('[show-password]').removeClass('fa-eye');
      $('[show-password]').addClass('fa-eye-slash');
      $('#password').attr('type','text');
      clicked = false; 
    }
    else {

      $('[show-password]').removeClass('fa-eye-slash');
      $('[show-password]').addClass('fa-eye');
      $('#password').attr('type','password');
      clicked = true; ; 
    };

  });*/
  


	
});//on laod


 var style = 'src/assets/css/style.css?'+Math.random();
 document.write('<link type="text/css" href="'+style+'" >');
