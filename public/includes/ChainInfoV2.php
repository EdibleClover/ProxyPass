<?php

/*
File purpose:
Grab Ip Address and Domain host
Give cert data based on info given
/*



/* Grab Data */
$Domain = htmlspecialchars($_POST['Domain']);
$Origin = htmlspecialchars($_POST['Origin']);


/* 
Check if an origin IP is set in the form field, If so check with SNI using the Origin IP 
*note a header is not sent since the handshake is performed prior to any gets (Why not send a header)
*/
if (strlen($Origin) === 0){
$ChainOutput = shell_exec("openssl s_client -host ".$Domain." -port 443 -showcerts");
}
else{
$ChainOutput = shell_exec("openssl s_client -connect " . $Origin . ":443 -servername " . $Domain . " -showcerts");
}

CleanCert($ChainOutput);

/*
Function to clean cert data into better form
Ended up doin this in PHP
REGEX to find everything between cert start and end
Preg Match to grab the certs
For each loop of mathces[0] since its a multidimensional
*/

function CleanCert($cert) {	
	preg_match_all("/-----BEGIN CERTIFICATE-----.*?-----END CERTIFICATE-----/s", $cert, $matches);

foreach ($matches[0] as $value) {
	echo "<div class='col-sm-4'>" . $value . "</div>";
}
}


/*Notes
* This should give me what I need, Providing servername and connect will do SNI for me and allow me to bypass the WAF
* Need to get more things to test this on 
$ openssl s_client -connect rackerhacker.com:443 -servername rackerhacker.com  //Include servername flag for SNI
$ openssl s_client -host amazon.com -port 443 -showcerts");  ///Just hit a domain
*/
?>