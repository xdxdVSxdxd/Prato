var parameters = null;
var theMap = null;
var whattoadd = "";
var mapclicklistener = null;
var lastlocationtoaddcontent = null;
var infowindow = null;

var elev = 20;
var year = 2018;

$( document ).ready(function() {


	$("#addstuff").click(function(){
		$("#addpanel").css("display","block");
		$("#clickonmap").css("display","none");
		$("#demoselector").css("display","none");
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

	$("#filterselect").change(function(){
		getLocation();
	});


	$("#demoselect").change(function(){
		updateStyles();
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

	getTags();

	getLocation();
}

function getTags(){

	$.getJSON("http://youthinthe.city/Prato/getTags.php?location=" + parameters.get("location"),function(data){
		console.log(data);

		var ht = "<option value='*'>ALL</option>";

		var tagsarray = new Array();
		for( var i = 0; i<data.length; i++){
			var ta = data[i];
			ta = ta.replace(/[\W_]+/g," ");
			ta = ta.toUpperCase();
			var parts = ta.split(" ");
			for(var j = 0; j<parts.length; j++){
				tagsarray.push(parts[j]);
			}
		}		

		var uniquetags = [];
		$.each(tagsarray, function(i, el){
		    if($.inArray(el, uniquetags) === -1) uniquetags.push(el);
		});

		uniquetags.sort();
		
		for( var i = 0; i<uniquetags.length; i++){
			if(uniquetags[i].trim()!="" && uniquetags[i].length>2){
                    ht = ht + "<option value='" + uniquetags[i] + "'>" + uniquetags[i] + "</option>";
            }
		}

		$("#filterselect").html(  ht  );
	});

}

function getParameters(){
	var url_string = window.location.href;
	var url = new URL(url_string);
	parameters = url.searchParams;
}



function getLocation(){

	$("#map").html("");

	var filter = $("#filterselect").val();
	if(!filter || filter==null){
		filter = "*";
	}
	
	$.getJSON("proxy.php?location=" + parameters.get("location") + "&keywords=" + filter  ,function(data){
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

		getDemoData();


		if(data.assets.length>0){
			for(var i = 0; i<data.assets.length; i++){

				if(data.assets[i].kml!="NULL"){

					var kmzLayer = new google.maps.KmlLayer( 
					{
						url: 'http://youthinthe.city/Prato/' + data.assets[i].kml,
						map: theMap,
						preserveViewport: true,
						suppressInfoWindows: false
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

						contentString = contentString + "<img src='http://youthinthe.city/Prato/" + data.assets[i].image + "' width='500' height='auto' border='0' /><br />";

					}

					if(data.assets[i].audio!="NULL"){
						
						 contentString = contentString + "<audio controls><source src='http://youthinthe.city/Prato/" + data.assets[i].audio + "' ></audio><br />";
						 
					}

					var testo = data.assets[i].text;

					if( validURL( testo ) ){
						contentString = contentString + "<a href='" + testo + "'>" + testo + "</a>"				
					} else {
						testo = testo.replace(/(?:\r\n|\r|\n)/g, '<br>');	
						contentString = contentString + "<span class='infowindowtext'>" + testo + "</span>"				
					}

					contentString = contentString + '</div>';

					createmarker(  data.assets[i].lat , data.assets[i].lng, icon, contentString );
				

				}
				

			}
		}

	});
	
}


// Normalizes the coords that tiles repeat across the x axis (horizontally)
      // like the standard Google map tiles.
      function getNormalizedCoord(coord, zoom) {
        var y = coord.y;
        var x = coord.x;

        // tile range in one direction range is dependent on zoom level
        // 0 = 1 tile, 1 = 2 tiles, 2 = 4 tiles, 3 = 8 tiles, etc
        var tileRange = 1 << zoom;

        // don't repeat across y-axis (vertically)
        if (y < 0 || y >= tileRange) {
          return null;
        }

        // repeat across x-axis
        if (x < 0 || x >= tileRange) {
          x = (x % tileRange + tileRange) % tileRange;
        }

        return {x: x, y: y};
      }


function validURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(str);
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


var currentProperty = 0;
var demodata;
var colorscale;

var properties = [

					{
						property: "eta_x_UMS_etam_Fita",
						label: "Età media, Femmine, Italiane",
						min: 999999,
						max: -999999
					}, 
					{
						property: "eta_x_UMS_etam_Fstra",
						label: "Età media, Femmine, Straniere",
						min: 999999,
						max: -999999
					},
					{
						property: "eta_x_UMS_etam_Ftot",
						label: "Età media, Femmine, totale",
						min: 999999,
						max: -999999
					},
					{
						property: "eta_x_UMS_etam_Mita",
						label: "Età media, Maschi, Italiani",
						min: 999999,
						max: -999999
					},
					{
						property: "eta_x_UMS_etam_Mstra",
						label: "Età media, Maschi, Stranieri",
						min: 999999,
						max: -999999
					},
					{
						property: "eta_x_UMS_etam_Mtot",
						label: "Età media, Maschi, totale",
						min: 999999,
						max: -999999
					}

				];

function getDemoData(){

	var selectStuff = "";
	for(var i = 0; i<properties.length; i++){
		selectStuff = selectStuff + "<option value='" + i + "'>" + properties[i].label + "</option>";
	}

	$("#demoselect").append(selectStuff);


	$.getJSON('http://youthinthe.city/Prato/demographics/' + year + '.json',function(data){
		demodata = data;

		for(var i = 0; i<properties.length; i++){
			for(var j = 0; j<demodata.features.length; j++){
				var val = demodata.features[j].properties[properties[i].property];
				if(val<properties[i].min){
					properties[i].min = val;
				}
				if(val>properties[i].max){
					properties[i].max = val;
				}
			}
		}

		console.log(demodata);

		theMap.data.addGeoJson( demodata );
		theMap.data.setStyle({});

		updateStyles();

			
	});

}



function updateStyles(){

	if($("#demoselect").val()==-1){
		currentProperty = -1;
		theMap.data.setStyle({visible: false});
	} else {
		currentProperty = $("#demoselect").val();
		theMap.data.setStyle({visible: true});
	}

	if(currentProperty==-1){
		theMap.data.setStyle({visible: false});
		$("#legendsvg").html("");
		$("#legenddiv").css("display","none");
	} else {
		colorscale = d3.scaleLinear().domain([ properties[currentProperty].min , properties[currentProperty].max ]).range(["white","green"]);
		theMap.data.setStyle(function(feature){
			var val = feature.getProperty(properties[currentProperty].property);
			var increment
			var ret = {
				fillColor: colorscale(val),
				fillOpacity: 0.5,
				strokeWeight: 0
			};

			return ret;
		});
		$("#legendsvg").html("");
		$("#legenddiv").css("display","block");
		var svg = d3.select("#legendsvg");
		svg.append("g")
		  .attr("class", "legendClass")
		  .attr("transform", "translate(20,20)");
		var legend = d3.legendColor()
						.scale(colorscale);
		svg.select(".legendClass")
  			.call(legend);
	}

		
}