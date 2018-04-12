const express = require('express')
const cheerio = require('cheerio')
const bodyParser = require('body-parser')
/* 
	Interesting module that overides the core node function for resolving DNS
*/
const evilDns = require('evil-dns');

/* Routing */
const app = express()
const public = __dirname + '/public/'
app.use(express.static('public'))  //server static files
app.use(bodyParser.urlencoded({ extended: false }))  //post data

app.get('/', function(req, res) {
	res.sendFile(public + '/v3.html')
});
app.listen(80, function() {  //For Some reason this sometimes gives me trouble
	console.log("Running Port 80")
});
/* End */

/* Modules */
const MyModules = require('./modules/Requests.js')
const Req = MyModules.Req
const GetCSS = MyModules.GetCSS
const GetJS = MyModules.GetJS
const StripProto = MyModules.StripProto
const WrapCSS = MyModules.WrapCSS
const WrapJS = MyModules.WrapJS
const AppendDom = MyModules.AppendDom
const StripPath = MyModules.StripPath
/* End */

/*
*		Some Test data:
*			mywebsitegothacked.com	
*       192.185.46.31
*
*		Some TODO
*			Need to strip the broken links out of the dom so the browser isn't making tons of broke requests
*			Need to bubble up errors to the user
*			Need to SANDBOX the response into an iFrame
*				Pretty sure I can just set an event listener to start listening on a different port/ page, then source from that 
*		
*		TODO DOM HUSSEIN
*		Need to split the path from the domain for adding to EvilDNS, Will come to me with 		domain.com/sdfsdf/sdfsdf/sdfsdf, I've already stripped the path
*		
*/

app.post('/Pass', async function(req, res) {
	/* Post Params */
	const Origin = req.body.Origin;   
	const Domain = req.body.Domain;   
	console.log("Origin Ip: " + req.body.Origin)
	console.log("Domain: " + req.body.Domain + "\n\n\n*********************")
	/* End */
	/*
	Modify Nodes DNS resolver 
	Come to find out this is the most reliable way to get around proxys&firewalls
	*/
	
	
	/*Try to set my custom host */
	try {
		await SetHost(await StripPath(Domain), Origin)
		let Body = await Req(Domain); //Get The Body
		let CSS = await GetCSSContent(Body) //Get CSS Stuff
		let JS = await GetJSContent(Body) 
		let CleanCSS = WrapCSS(CSS) //Wrap them in TAGS
		let CleanJS = WrapJS(JS)
		await CleanHost(await StripPath(Domain), Origin)
		/* Send the stuffs, Tried iFrames but its wayyyy to fuckin slow, 
		Would be Excellent to find a way to SandBox */
		//await evilDns.Remove(Domain, Origin)
		res.send(Body + CleanCSS + CleanJS)
		
		
	}
	catch(err) {
		console.log(err)
		/* Need to improve Error Reporting */
		res.send(
		"'<div class='alert alert-danger' role='alert'>" +
		"<h3>Looks like there was some kind of problem with your information!<br>" +
		"This isn't working for me!<br>" +
		"Perhaps Something went wrong with your Origin?<h3></div>"
		)
	}
})



/*
Functions that get the CSS and JS content from the page
*/

/*Get Some CSS Content*/
async function GetCSSContent(Dom) {
	let Links = await GetCSS(Dom)   //Rip Out some CSS
	console.log("\n\n###CSS LINKS###\n" + Links + "\n\n")
	let pStripped = await Links.map( x => StripProto(x) ) //Promises of all the urls without protocol
	let Stripped = await Promise.all(pStripped)  //Resolve them all
	let pContent = Stripped.map( x => Req(x) )
	let Content = await Promise.all(pContent)  
	//console.log(Content);  //Ouch this Throws sooo much shit
	return Content
}
/* Same as above, I could have thrown this all into an object I suppose but it was conceptually easier to just split the data into two functions */
async function GetJSContent(Dom) {
	let Links = await GetJS(Dom)   //Rip Out some CSS
	console.log("\n\n###CSS LINKS###\n" + Links + "\n\n")
	let pStripped = await Links.map( x => StripProto(x) ) //Promises of all the urls without protocol
	let Stripped = await Promise.all(pStripped)  //Resolve them all
	let pContent = Stripped.map( x => Req(x) )
	let Content = await Promise.all(pContent)  
	//console.log(Content);  //Ouch this Throws sooo much shit
	return Content
}


//Need to add a trialing slash in frontend javascript for this to work properly. Without the slash I cut off the end fo the TLD using the string position
async function SetHost(Domain, Origin) {
	return new Promise(resolve => {
		evilDns.add(Domain, Origin)
		console.log("Added" + Domain + "Origin:" + Origin)
		resolve(console.log("\n We Got Added \n"))
	})
}
	
function CleanHost(Domain, Origin) {
	return new Promise(resolve => {
	evilDns.remove(Domain, Origin)
	resolve(console.log("\n\nHost has been removed!"))
	});
}




