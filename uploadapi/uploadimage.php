<?php

require_once("../db.php");
$res = array();


$uploaddir = '/var/www/Prato/uploadapi/images/';
$uploadfile = uniqid();


if( 
		isset($_FILES["imagefile"])   &&
		isset($_REQUEST["imagelatitude"])   &&
		isset($_REQUEST["imagelongitude"])   &&
		isset($_REQUEST["imagelabel"]) &&
		isset($_REQUEST["imageidlocation"]) &&
		$_FILES['imagefile']['error'] == UPLOAD_ERR_OK
){
	if (is_uploaded_file($_FILES['imagefile']['tmp_name'])) {
	   // ok

		if(  $_FILES["imagefile"]["type"]=="image/png" || $_FILES["imagefile"]["type"]=="image/jpg"  || $_FILES["imagefile"]["type"]=="image/jpeg"  ){
			// è una immagine

			if( $_FILES["imagefile"]["type"]=="image/png" ){
				$uploadfile = $uploadfile . ".png";
			} else if( $_FILES["imagefile"]["type"]=="image/jpg"  ||  $_FILES["imagefile"]["type"]=="image/jpeg" ){
				$uploadfile = $uploadfile . ".jpg";
			}


			if (move_uploaded_file($_FILES['imagefile']['tmp_name'], $uploaddir . $uploadfile)) {
			    
			    $lat = floatval($_REQUEST["imagelatitude"]);
			    $lng = floatval($_REQUEST["imagelongitude"]);
			    $label = $_REQUEST["imagelabel"];
			    $idlocation = $_REQUEST["imageidlocation"];


			    $q1 = $conn->prepare( "INSERT INTO assets (idlocation,text,image,audio,lat,lng,kml) VALUES (:idlocation,:text,:image,:audio,:lat,:lng,:kml)" );
					$q1->execute(array(
						':idlocation' => $idlocation , 
						':text' => $label,
						':image' => "uploadapi/images/" . $uploadfile,
						':audio' => "NULL",
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