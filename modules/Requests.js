const rp = require('request-promise')
const cheerio = require('cheerio')
		
module.exports = {
	Req: 
	function Req(Domain) {
		return new Promise(resolve => { 
			var options = 
				{
				uri: 'http://' + Domain,
				simple: false,  //Should shoot http errors rather than rejecting the promise
				followAllRedirects:true,
				resolveWithFullResponse: true,
				timeout: 5000,  //SET TIMEOUT
				headers: {
					UserAgent: "Proxy-Pass"
				}
			};
			console.log("REQUEST OPTIONS:\n" + options.uri)
			rp(options).then(function(response) {  
				resolve(response.body);  
				//console.log(response.headers)
			}).catch(function(err) {
				/*### ERROR REPORTING ###*/
				console.log("REQUEST ERROR: " + err);
				resolve(
					"'<div class='alert alert-danger' role='alert'><h3>" + 
					err + 
					"<h3></div>"
				)
			});
		});
	},
	GetCSS: 
		function GetCSS(Dom) {
			return new Promise(resolve => { 
				//Pass the results of previous function with async
				const $ = cheerio.load(Dom);
				/*Get The CSS Links on the page*/
				let Css_Array = $('link').map(function() {  //Jquery
					let href = $(this).attr('rel')
					if(href == 'stylesheet') { // Get Style sheets
						return $(this).attr('href');
					}
				}).get()
				resolve(Css_Array)
			});
		},
	GetJS:
		function GetJS(Dom) {
			return new Promise(resolve => { 
				const $ = cheerio.load(Dom);
				let Js_Array = $('script').map(function() {
					return $(this).attr('src');  //Creating an object
				}).get()
				resolve(Js_Array)
			});
		},	
	StripProto:
		function StripProto(url) {		
			return new Promise(resolve => { 
				let regex = /https?:\/\//g;
				let cleaned = url.replace(regex, "") 
				resolve(cleaned);
			});
		},
	StripDom:
		function StripDom(Dom) {  //TOOOOOOOOOOOOOOOOOOOOOOOOOOOO DOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
			const $ = cheerio.load(Dom);	
		},
	WrapCSS:
		function WrapCSS(Content) {
			let Wrapped = "<style>" + Content + "</style>"
			return Wrapped
		},
	WrapJS:
		function WrapJS(Content) {
			let Wrapped = "<script>" + Content + "</script>"
			return Wrapped
		},
	StripPath:
		function StripPath(Domain) {
			return new Promise(resolve => { 
				let i = Domain.indexOf('/')
				let d = Domain.slice(0, i)
				resolve(d)
			});
		}
}
	