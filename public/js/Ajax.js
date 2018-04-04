$("#GetPage").click(function() {
		var domain = $("#dm").val();
		var ip = $("#o").val();
		CleanAndSend(domain, ip)
});

$("#GetCert").click(function() {
		var domain = $("#dm").val();
		var ip = $("#o").val();
		CleanAndSend(domain, ip)
		});
		
/* async function, wait more MyPromise and then send the stuffs*/		
async function CleanAndSend(D, O) {
	let CleanDomain = await RemoveProto(D)
		let data = {
				Domain: CleanDomain,
				Origin: O
				}
		var request = $.ajax({
			url: "Pass", 
			context: document.body,
			method: 'POST',
			data: data
		});

		request.done(function( data ) {
			if (data instanceof Object == false) {
			$("#ret").html( data );  //If its not an object
			} else {
			$("#ret").html( data.message );  //If it is an object
			}
			
			$("#ret").html( data );
			
			//console.log(data);			
		});		
}








/* Function to strip the protocol off the request if there is one, iPromise */
function RemoveProto(Domain) {	
	return new Promise(resolve => { 
		let TrimDomain = Domain.trim();
		let reg = /https?:\/\//g;
		let CleanedDomain = TrimDomain.replace(reg, "") 
		resolve(CleanedDomain);
	});			
}


/* 
Function to check if an error is beign returned and account for it 

For example if a 404 error is returned ill get an object back, Check for object

Output the peice of i need (The body)

*/






