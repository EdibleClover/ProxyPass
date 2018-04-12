

$("#GetCert").click(function() {
		
	$("#nav").toggleClass( 'col-lg-2');
	$("#nav").toggleClass( 'col-lg-3');

});



$("#GetCert").click(function() {
	$("#ret").toggleClass( 'col-lg-10');
	$("#ret").toggleClass( 'col-lg-9');
});



$('#sidebarCollapse').on('click', function () {
	$('#sidebar').toggleClass('active');
});
	
	
/*This is all shit above^^^*/

$("#ret").html("<svg width="100" height="100"><polygon class='hex' points='300,150 225,280 75,280 0,150 75,20 225,20'></polygon></svg>");