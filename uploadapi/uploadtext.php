<?php

require_once("../db.php");
$res = array();



if( 
		isset($_REQUEST["textlatitude"])   &&
		isset($_REQUEST["textlongitude"])   &&
		isset($_REQUEST["textlabel"]) &&
		isset($_REQUEST["textidlocation"])
){
	
		
		
			
			    
			    $lat = floatval($_REQUEST["textlatitude"]);
			    $lng = floatval($_REQUEST["textlongitude"]);
			    $label = $_REQUEST["textlabel"];
			    $idlocation = $_REQUEST["textidlocation"];


			    $q1 = $conn->prepare( "INSERT INTO assets (idlocation,text,image,audio,lat,lng,kml) VALUES (:idlocation,:text,:image,:audio,:lat,:lng,:kml)" );
					$q1->execute(array(
						':idlocation' => $idlocation , 
						':text' => $label,
						':image' => "NULL",
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
	echo("[4]");
}





?>