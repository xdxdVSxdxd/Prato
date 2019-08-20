var parameters = null;
var theMap = null;
var whattoadd = "";
var mapclicklistener = null;
var lastlocationtoaddcontent = null;
var infowindow = null;

$( document ).ready(function() {


	$("#addstuff").click(function(){
		$("#addpanel").css("display","block");
		$("#clickonmap").css("display","none");
		if(mapclicklistener!=null){
			google.maps.event.removeListener(mapclicklistener);
			mapclicklistener = null;
		}
	});


	$("#addtext").click(function(){
		whattoadd = "text";
		getCoordinate();
	});

	$("#addimage").click(function(){
		whattoadd = "image";
		getCoordinate();
	});

	$("#addkml").click(function(){
		whattoadd = "kml";
		getCoordinate();
	});

	$("#addsound").click(function(){
		whattoadd = "sound";
		getCoordinate();
	});


	//initMap();
	
    
	
});


function getCoordinate(){
	$("#addpanel").css("display","none");
	$("#clickonmap").css("display","block");
	// prendere il click sulla mappa
	mapclicklistener = theMap.addListener('click',function(event){
		lastlocationtoaddcontent = {
			lat: event.latLng.lat(),
			lng: event.latLng.lng()
		};
		google.maps.event.removeListener(mapclicklistener);
		mapclicklistener = null;
		$("#clickonmap").css("display","none");
		getContent();
	});
}


function initMap(){
	getParameters();

	getLocation();
}

function getParameters(){
	var url_string = window.location.href;
	var url = new URL(url_string);
	parameters = url.searchParams;
}



function getLocation(){
	
	$.getJSON("proxy.php?location=" + parameters.get("location"),function(data){
		// console.log(data);

		var mapstyle = JSON.parse( data.style );

		theMap = new google.maps.Map(document.getElementById('map'), {
		  center: {lat: parseFloat(data.lat), lng: parseFloat(data.lng) },
		  zoom: parseInt( data.initialzoom ),
		  clickableIcons: false,
		  disableDefaultUI: true,
		  disableDoubleClickZoom: true,
		  mapTypeControl: false,
		  panControl: false,
		  rotateControl: false,
		  scaleControl: false,
		  styles: mapstyle
		});


		if(data.assets.length>0){
			for(var i = 0; i<data.assets.length; i++){

				if(data.assets[i].kml!="NULL"){

					var kmzLayer = new google.maps.KmlLayer( 
					{
						url: 'http://164.132.225.138/Prato/' + data.assets[i].kml,
						map: theMap 
					});
					
				} else {

					var icon = {
					    path: "M -10 -10 L 10 -10 L 10 10 L -10 10 L -10 -10",
					    fillColor: data.fillcolor,
					    fillOpacity: .6,
					    anchor: new google.maps.Point(0,0),
					    strokeWeight: 0,
					    scale: 1
					}

					var contentString = '<div class="infowindow">';

					if(data.assets[i].image!="NULL"){

						contentString = contentString + "<img src='http://164.132.225.138/Prato/" + data.assets[i].image + "' width='500' height='auto' border='0' /><br />";

					}

					if(data.assets[i].audio!="NULL"){
						
						 contentString = contentString + "<audio controls><source src='http://164.132.225.138/Prato/" + data.assets[i].audio + "' ></audio><br />";
						 
					}

					var testo = data.assets[i].text;
					testo = testo.replace(/(?:\r\n|\r|\n)/g, '<br>');

					contentString = contentString + "<span class='infowindowtext'>" + testo + "</span>"				

					contentString = contentString + '</div>';

					createmarker(  data.assets[i].lat , data.assets[i].lng, icon, contentString );
				

				}
				

			}
		}

	});
	
}

function createmarker(lat,lng,icon,content){
	var marker = new google.maps.Marker({
				    position: new google.maps.LatLng(lat , lng),
				    map: theMap,
				    draggable: false,
				    icon: icon
				});
				marker.mapcontent = content;
				marker.addListener('click', function() {
					if(infowindow!=null){
						infowindow.close();
						infowindow = null;
					}
					infowindow = new google.maps.InfoWindow({
						content: this.mapcontent
					});
					infowindow.open(theMap, marker);
				});
}


function getContent(){
	$("#getcontentpanel").css("display","block");

	$("#imagelatitude").val( lastlocationtoaddcontent.lat );
	$("#imagelongitude").val( lastlocationtoaddcontent.lng );
	$("#imageidlocation").val( parameters.get("location") );


	$("#kmllatitude").val( lastlocationtoaddcontent.lat );
	$("#kmllongitude").val( lastlocationtoaddcontent.lng );
	$("#kmlidlocation").val( parameters.get("location") );

	$("#audiolatitude").val( lastlocationtoaddcontent.lat );
	$("#audiolongitude").val( lastlocationtoaddcontent.lng );
	$("#audioidlocation").val( parameters.get("location") );

	$("#textlatitude").val( lastlocationtoaddcontent.lat );
	$("#textlongitude").val( lastlocationtoaddcontent.lng );
	$("#textidlocation").val( parameters.get("location") );
	
	if(whattoadd=="text"){
		$("#formtext").css("display","block");
		$("#formimage").css("display","none");
		$("#formaudio").css("display","none");
		$("#formkml").css("display","none");
	} else if(whattoadd=="image"){
		$("#formtext").css("display","none");
		$("#formimage").css("display","block");
		$("#formaudio").css("display","none");
		$("#formkml").css("display","none");
	} else if(whattoadd=="sound"){
		$("#formtext").css("display","none");
		$("#formimage").css("display","none");
		$("#formaudio").css("display","block");
		$("#formkml").css("display","none");
	} else if(whattoadd=="kml"){
		$("#formtext").css("display","none");
		$("#formimage").css("display","none");
		$("#formaudio").css("display","none");
		$("#formkml").css("display","block");
	}
}