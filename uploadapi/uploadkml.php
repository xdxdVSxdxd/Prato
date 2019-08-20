<?php

require_once("../db.php");
$res = array();


$uploaddir = '/var/www/Prato/uploadapi/kml/';
$uploadfile = uniqid();


if( 
		isset($_FILES["kmlfile"])   &&
		isset($_REQUEST["kmllatitude"])   &&
		isset($_REQUEST["kmllongitude"])   &&
		isset($_REQUEST["kmllabel"]) &&
		isset($_REQUEST["kmlidlocation"]) &&
		$_FILES['kmlfile']['error'] == UPLOAD_ERR_OK
){
	if (is_uploaded_file($_FILES['kmlfile']['tmp_name'])) {
	   // ok

		if(  $_FILES["kmlfile"]["type"]=="application/vnd.google-earth.kml+xml" || $_FILES["kmlfile"]["type"]=="application/vnd.google-earth.kmz"  ){
			// è un kml

			if( $_FILES["kmlfile"]["type"]=="application/vnd.google-earth.kml+xml" ){
				$uploadfile = $uploadfile . ".kml";
			} else if( $_FILES["kmlfile"]["type"]=="application/vnd.google-earth.kmz" ){
				$uploadfile = $uploadfile . ".kmz";
			}


			if (move_uploaded_file($_FILES['kmlfile']['tmp_name'], $uploaddir . $uploadfile)) {
			    
			    $lat = floatval($_REQUEST["kmllatitude"]);
			    $lng = floatval($_REQUEST["kmllongitude"]);
			    $label = $_REQUEST["kmllabel"];
			    $idlocation = $_REQUEST["kmlidlocation"];


			    $q1 = $conn->prepare( "INSERT INTO assets (idlocation,text,image,audio,lat,lng,kml) VALUES (:idlocation,:text,:image,:audio,:lat,:lng,:kml)" );
					$q1->execute(array(
						':idlocation' => $idlocation , 
						':text' => $label,
						':image' => "NULL",
						':audio' => "NULL",
						':lat' => $lat,
						':lng' => $lng,
						':kml' => "uploadapi/kml/" . $uploadfile

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