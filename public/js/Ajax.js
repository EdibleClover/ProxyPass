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
	let Clean1 = await RemoveProto(D) //Remove the proto
	let CleanDomain = await AddSlash(Clean1) // Add a trailing slash if there isn't one
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
	request.done(function(data) {
		if (data instanceof Object == false) {
			$("#ret").html(data); //If its not an object
		} else {
			$("#ret").html(data.message); //If it is an object
		}
		$("#ret").html(data);
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
/* Adding a function to add a / to the trailing end fo the domain if no path is tacked onto it
 *	For example if user submits example.com it will update to example.com/ so that my node function 
 *   doesn't remove the last character of the TLD
 *
 */
function AddSlash(Domain) {
	return new Promise(resolve => {
		if (Domain.includes('/')) {
			resolve(Domain) //Do nothing its got a slash at the end(or has a path)
		} else {
			resolve(Domain.concat('/')) //Concat a slash to end of it so backend takes it okay
		}
	});
}