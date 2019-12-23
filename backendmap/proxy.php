<?php

	echo(  file_get_contents("http://youthinthe.city/Prato/getLocationData.php?location=" . $_REQUEST["location"]  . "&keywords=" . $_REQUEST["keywords"] )  );

?>