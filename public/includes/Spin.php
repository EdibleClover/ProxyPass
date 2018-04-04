<?php
/*  
Get Form Data
Setup a curl request based on whats given
Grab the page DOM from curl

*/

/*  Get Post Data     */
$Domain = htmlspecialchars($_POST['Domain']);
$Origin = htmlspecialchars($_POST['Origin']);
/*  Set a Custom Header     */
$HostHeader = ['HOST:' . $Domain];
/*  Start Curl     */
/* Account for fields being empty */
if (strlen($Origin) === 0){
	$ch = curl_init($Domain); 
}
else {
	$ch = curl_init($Origin);
	curl_setopt($ch, CURLOPT_HTTPHEADER, $HostHeader); 
}


	/*  Set Options    */
	/*	Host header for Domain */
	curl_setopt($ch, CURLOPT_HTTPHEADER, $HostHeader); 
	/* Return Data */
	curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
	/*	Redirects, Reefer	*/			
	curl_setopt($ch, CURLOPT_AUTOREFERER, 1); 
	curl_setopt($ch, CURLOPT_MAXREDIRS, 4); 
	curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
	/* not sure SSL STUFF */

/* Fetch */
$data = curl_exec($ch);
/* Response Code */
echo curl_getinfo($ch, CURLINFO_HTTP_CODE);
/* Close */
curl_close($ch);
echo $data;


?>