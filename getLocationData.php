<?php
	require_once("db.php");
	$res = array();

	$q1 = $conn->prepare( "SELECT id,name,lat,lng,initialzoom,style,northbound,southbound,eastbound,westbound,fillcolor FROM locations WHERE id = :id LIMIT 1" );
	$q1->execute(array(':id' => $_REQUEST["location"]) );
	$result = $q1->fetch();
	$res["id"] = $result["id"];
	$res["name"] = $result["name"];
	$res["lat"] = $result["lat"];
	$res["lng"] = $result["lng"];
	$res["initialzoom"] = $result["initialzoom"];
	$res["style"] = $result["style"];
	$res["northbound"] = $result["northbound"];
	$res["southbound"] = $result["southbound"];
	$res["eastbound"] = $result["eastbound"];
	$res["westbound"] = $result["westbound"];
	$res["fillcolor"] = $result["fillcolor"];

	$res["assets"] = array();

	$queryb = "SELECT id,t,text,image,audio,lat,lng, kml,keywords FROM assets WHERE idlocation = :id";
	if(isset($_REQUEST["keywords"]) && $_REQUEST["keywords"]!="*" ){
		$keywords = trim( strtoupper( $_REQUEST["keywords"] ) );
		$queryb = $queryb . " AND keywords LIKE '%" . str_replace("'", "", $_REQUEST["keywords"]) . "%'";
	}
	$q2 = $conn->prepare( $queryb );
	$q2->execute(array(':id' => $_REQUEST["location"]) );
	while ($row = $q2->fetch()){
		$o = new stdClass();
		$o->id = intval($row["id"]);
		$o->t = $row["t"];
		$o->text = $row["text"];
		$o->image = $row["image"];
		$o->audio = $row["audio"];
		$o->kml = $row["kml"];
		$o->lat = floatval($row["lat"]);
		$o->lng = floatval($row["lng"]);
		$o->keywords = $row["keywords"];
		$res["assets"][] = $o;
	}


	echo(json_encode( $res  ));
?>