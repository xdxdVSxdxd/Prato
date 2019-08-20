<?php

require_once("../db.php");
$res = array();


$uploaddir = '/var/www/Prato/uploadapi/audio/';
$uploadfile = uniqid();


if( 
		isset($_FILES["audiofile"])   &&
		isset($_REQUEST["audiolatitude"])   &&
		isset($_REQUEST["audiolongitude"])   &&
		isset($_REQUEST["audiolabel"]) &&
		isset($_REQUEST["audioidlocation"]) &&
		$_FILES['audiofile']['error'] == UPLOAD_ERR_OK
){
	if (is_uploaded_file($_FILES['audiofile']['tmp_name'])) {
	   // ok

		if(  $_FILES["audiofile"]["type"]=="audio/mpeg" || $_FILES["audiofile"]["type"]=="audio/mpeg3"  || $_FILES["audiofile"]["type"]=="audio/x-mpeg-3"    || $_FILES["audiofile"]["type"]=="audio/wav"   || $_FILES["audiofile"]["type"]=="audio/x-wav"   || $_FILES["audiofile"]["type"]=="audio/wave"   || $_FILES["audiofile"]["type"]=="audio/x-pn-wav"  || $_FILES["audiofile"]["type"]=="audio/ogg" ){
			// è una immagine

			if( $_FILES["audiofile"]["type"]=="audio/mpeg" || $_FILES["audiofile"]["type"]=="audio/mpeg3"  || $_FILES["audiofile"]["type"]=="audio/x-mpeg-3" ){
				$uploadfile = $uploadfile . ".mp3";
			} else if( $_FILES["audiofile"]["type"]=="audio/wav"   || $_FILES["audiofile"]["type"]=="audio/x-wav"   || $_FILES["audiofile"]["type"]=="audio/wave"   || $_FILES["audiofile"]["type"]=="audio/x-pn-wav" ){
				$uploadfile = $uploadfile . ".wav";
			} else if( $_FILES["audiofile"]["type"]=="audio/ogg" ){
				$uploadfile = $uploadfile . ".ogg";
			}


			if (move_uploaded_file($_FILES['audiofile']['tmp_name'], $uploaddir . $uploadfile)) {
			    
			    $lat = floatval($_REQUEST["audiolatitude"]);
			    $lng = floatval($_REQUEST["audiolongitude"]);
			    $label = $_REQUEST["audiolabel"];
			    $idlocation = $_REQUEST["audioidlocation"];


			    $q1 = $conn->prepare( "INSERT INTO assets (idlocation,text,image,audio,lat,lng,kml) VALUES (:idlocation,:text,:image,:audio,:lat,:lng,:kml)" );
					$q1->execute(array(
						':idlocation' => $idlocation , 
						':text' => $label,
						':image' => "NULL",
						':audio' => "uploadapi/audio/" . $uploadfile,
						':lat' => $lat,
						':lng' => $lng,
						':kml' => "NULL"

					) );

				?>
				<script>document.location = "<?php echo($_SERVER['HTTP_REFERER']); ?>";</script>
				<?php
				// header("Location: " . $_SERVER['HTTP_REFERER']); 
				exit();

			} else {
			    // non riuscito a fare l'upload
			    echo("[2]");
			}
 
		} else {
			echo("[3]");
		}


	} else {
	   	// possible attack!
		echo("[1]");
	}	
} else {
	echo("[4]");
}





?>