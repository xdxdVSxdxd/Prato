<?php

	echo(  file_get_contents("http://164.132.225.138/Prato/getLocationData.php?location=" . $_REQUEST["location"] )  );

?>