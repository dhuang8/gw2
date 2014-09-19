
var professions=[["Unknown", "http://wiki.guildwars2.com/images/e/eb/Any_tango_icon_200px.png"],
	["Guardian", "http://wiki.guildwars2.com/images/6/6c/Guardian_tango_icon_200px.png"],
	["Warrior", "http://wiki.guildwars2.com/images/d/db/Warrior_tango_icon_200px.png"],
	["Engineer", "http://wiki.guildwars2.com/images/2/2f/Engineer_tango_icon_200px.png"],
	["Ranger", "http://wiki.guildwars2.com/images/5/51/Ranger_tango_icon_200px.png"],
	["Thief", "http://wiki.guildwars2.com/images/1/19/Thief_tango_icon_200px.png"],
	["Elementalist", "http://wiki.guildwars2.com/images/a/a0/Elementalist_tango_icon_200px.png"],
	["Mesmer", "http://wiki.guildwars2.com/images/7/73/Mesmer_tango_icon_200px.png"],
	["Necromancer", "http://wiki.guildwars2.com/images/c/cd/Necromancer_tango_icon_200px.png"]]

var map;

var vistas = L.layerGroup();
var pois = L.layerGroup();
var tasks = L.layerGroup();
var challenges = L.layerGroup();
var waypoints = L.layerGroup();
var unknown = L.layerGroup();
var playerGroup = L.layerGroup();
var guildBounty = L.featureGroup();
var groups = [vistas, pois, tasks, challenges, waypoints, unknown, playerGroup];
var markers = new Array();
var players = new Array();
var regionMarkers = new Array();


function unproject(coord) {
	coord[0]=coord[0];
	coord[1]=coord[1];
    return map.unproject(coord, map.getMaxZoom());
}

function project(coord) {
	coord=map.project(coord, map.getMaxZoom());
	coord[0]=coord[0];
	coord[1]=coord[1];
    return coord;
}

function onMapClick(e) {
    console.log("You clicked the map at " + project(e.latlng));
}

function onLeftClick(e) {
	c=project(e.latlng, e.latlng.lng);
    console.log("["+ c.x + "," + c.y + "]");
    polyline.addLatLng(e.latlng);
}


function link(i){
	return "[&" + btoa(String.fromCharCode(4, i% 256,Math.floor(i/ 256)) + String.fromCharCode(0) + String.fromCharCode(0)) + "]";
}

//$(function () {
    "use strict";

    var southWest, northEast;

    map = L.map("map", {
        minZoom: 3,
        maxZoom: 7,
        crs: L.CRS.Simple,
        fullscreenControl: true
 //       markerZoomAnimation: false
    });
 /*   
    var MyControl = L.Control.extend({
        options: {
            position: 'topright',
            collapsed: true
        },

        onAdd: function (map) {var className = 'leaflet-control-layers',
        	 container = this._container = L.DomUtil.create('div', className);

		// makes this work on IE touch devices by stopping it from firing a mouseout event when the touch is released
		 container.setAttribute('aria-haspopup', true);

		if (!L.Browser.touch) {
			L.DomEvent
				.disableClickPropagation(container)
				.disableScrollPropagation(container);
		} else {
			L.DomEvent.on(container, 'click', L.DomEvent.stopPropagation);
		}

		var form = this._form = L.DomUtil.create('form', className + '-list');

		if (this.options.collapsed) {
        	console.log("true");
			if (!L.Browser.android) {
	        	console.log("not android");
				L.DomEvent.on(container, {
					mouseenter: L.DomUtil.addClass(this._container, 'leaflet-control-layers-expanded'),
					mouseleave: this._collapse
				}, this);
			}

			var link = this._layersLink = L.DomUtil.create('a', className + '-toggle', container);
			link.href = '#';
			link.title = 'Layers';

			if (L.Browser.touch) {
	        	console.log("touch");
				L.DomEvent
				    .on(link, 'click', L.DomEvent.stop)
				    .on(link, 'click', this._expand, this);
			} else {
				L.DomEvent.on(link, 'focus', this._expand, this);
			}

			// work around for Firefox Android issue https://github.com/Leaflet/Leaflet/issues/2033
			L.DomEvent.on(form, 'click', function () {
				setTimeout(L.bind(this._onInputClick, this), 0);
			}, this);

			this._map.on('click', this._collapse, this);
			// TODO keyboard accessibility
		} else {
			L.DomUtil.addClass(this._container, 'leaflet-control-layers-expanded');
		}

		this._baseLayersList = L.DomUtil.create('div', className + '-base', form);
		this._separator = L.DomUtil.create('div', className + '-separator', form);
		this._overlaysList = L.DomUtil.create('div', className + '-overlays', form);

		container.appendChild(form);
            return container;
        },
        
        _expand: function () {
        	console.log("expand");
    		L.DomUtil.addClass(this._container, 'leaflet-control-layers-expanded');
    	},

    	_collapse: function () {
        	console.log("collapse");
    		L.DomUtil.removeClass(this._container, 'leaflet-control-layers-expanded');
    	}
    });
    map.addControl(new MyControl());
*/
    <!--{if not isset($zone)}-->
    map.setView([-145, 133],0);
    <!--{/if}-->

    southWest = unproject([1, 32768-1]);
    northEast = unproject([32768-1, 1]);
	var bound = new L.LatLngBounds(southWest, northEast)
    map.setMaxBounds(bound);

    var wpIcon = L.icon({
        iconUrl: 'http://wiki.guildwars2.com/images/d/d2/Waypoint_%28map_icon%29.png',
        iconSize: [20, 20], // size of the icon
        iconAnchor: [10, 10], // point of the icon which will correspond to marker's location
        popupAnchor: [0, -10] // point from which the popup should open relative to the iconAnchor
    });

    var poiIcon = L.icon({
        iconUrl: 'http://wiki.guildwars2.com/images/f/fb/Point_of_interest.png',
        iconSize: [20, 20], // size of the icon
        iconAnchor: [10, 10], // point of the icon which will correspond to marker's location
        popupAnchor: [0, -10] // point from which the popup should open relative to the iconAnchor
    });
    
    var playerIcon = L.icon({
        iconUrl: 'http://mshelley.net/gw2/images/player.png',
        iconSize: [30, 30], // size of the icon
        iconAnchor: [15, 15], // point of the icon which will correspond to marker's location
        popupAnchor: [0, 0], // point from which the popup should open relative to the iconAnchor
        labelAnchor: [-10, -25]
    });

    var vistaIcon = L.icon({
        iconUrl: 'http://wiki.guildwars2.com/images/d/d9/Vista.png',
        iconSize: [20, 20], // size of the icon
        iconAnchor: [10, 10], // point of the icon which will correspond to marker's location
        popupAnchor: [0, -10] // point from which the popup should open relative to the iconAnchor
    });

    var taskIcon = L.icon({
        iconUrl: 'http://wiki.guildwars2.com/images/f/f8/Complete_heart_%28map_icon%29.png',
        iconSize: [20, 20], // size of the icon
        iconAnchor: [10, 10], // point of the icon which will correspond to marker's location
        popupAnchor: [0, -10] // point from which the popup should open relative to the iconAnchor
    });

    var challengeIcon = L.icon({
        iconUrl: 'http://wiki.guildwars2.com/images/8/84/Skill_point.png',
        iconSize: [20, 20], // size of the icon
        iconAnchor: [10, 10], // point of the icon which will correspond to marker's location
        popupAnchor: [0, -10] // point from which the popup should open relative to the iconAnchor
    });
    
    var tile1=L.tileLayer("https://tiles.guildwars2.com/1/1/{z}/{x}/{y}.jpg", {
        minZoom: 6,
        maxZoom: 7,
        maxNativeZoom: 7,
        continuousWorld: true,
        tileSize: 128,
        bounds: bound,
        zoomOffset: 1,
        noWrap: true
    })
    
    tile1.addTo(map);

    var tile2=L.tileLayer("https://tiles.guildwars2.com/1/1/{z}/{x}/{y}.jpg", {
        minZoom: 3,
        maxZoom: 5,
        continuousWorld: true,
        tileSize: 256,
        bounds: bound,
        noWrap: true
    });
    tile2.addTo(map);

    map.on("click", onMapClick);

    map.on("contextmenu", onLeftClick);
    
    $.getJSON("https://api.guildwars2.com/v1/map_floor.json?continent_id=1&floor=1", function (data) {
        var region, gameMap, i, il, poi, task, challenge;
        var marker, wikilink, popupText;

        for (region in data.regions) {
            region = data.regions[region];

            for (gameMap in region.maps) {
                gameMap = region.maps[gameMap];

                <!--{if isset($zone)}-->
                if (gameMap.name != "") {                    
                    regionMarkers[gameMap]= new Array();
//                    var rect = gameMap.continent_rect;

//                    var centerX = (rect[0][0] + rect[1][0]) / 2;
 //                   var centerY = (rect[0][1] + rect[1][1]) / 2;

                    //map.setView(unproject([centerX, centerY]), 4);
                <!--{/if}-->

                for (i = 0, il = gameMap.tasks.length; i < il; i++) {
                    task = gameMap.tasks[i];
                    marker = L.marker(unproject(task.coord), {
                        title: task.objective,
                        icon: taskIcon
                    });
                    wikilink = 'http://wiki.guildwars2.com/wiki/' + encodeURIComponent(task.objective.replace(/\.$/, ''));
                    popupText = '<a href="'+wikilink+'" target="_blank">'+task.objective+'</a> (' + task.level + ')';
                    marker.bindPopup(popupText);
                    tasks.addLayer(marker);
                    markers.push(marker);
                    
                    regionMarkers[gameMap].push(marker);
                }
                for (i = 0, il = gameMap.skill_challenges.length; i < il; i++) {
                    challenge = gameMap.skill_challenges[i];
                    marker = L.marker(unproject(challenge.coord), {
                        icon: challengeIcon
                    });
                    challenges.addLayer(marker);
                    markers.push(marker);
                    regionMarkers[gameMap].push(marker);
                }

                for (i = 0, il = gameMap.points_of_interest.length; i < il; i++) {
                    poi = gameMap.points_of_interest[i];

                    if (poi.type == "waypoint") {
                        marker = L.marker(unproject(poi.coord), {
                            title: poi.name,
                            icon: wpIcon
                        });
                        marker.bindPopup(poi.name+'<br><span class="mapId">'+link(poi.poi_id)+'</span>');
                        waypoints.addLayer(marker);
                        markers.push(marker);
                        regionMarkers[gameMap].push(marker);
                    }
                    //waypoints.addTo(map);
                    else if (poi.type == "landmark") {
                        marker = L.marker(unproject(poi.coord), {
                            title: poi.name,
                            icon: poiIcon
                        });
                        wikilink = 'http://wiki.guildwars2.com/wiki/' + encodeURIComponent(poi.name);
                        popupText = '<a href="' + wikilink + '" target="_blank">' + poi.name + '</a>'
                                    +'<br><span class="mapId">'+link(poi.poi_id)+'</span>';
                        marker.bindPopup(popupText);
                        pois.addLayer(marker);
                        markers.push(marker);
                        regionMarkers[gameMap].push(marker);
                    }
                    else if (poi.type == "vista") {
                        marker = L.marker(unproject(poi.coord), {
                            icon: vistaIcon
                        });
                        popupText = '<span class="mapId">'+link(poi.poi_id)+'</span>';
                        marker.bindPopup(popupText);
                        vistas.addLayer(marker);
                        markers.push(marker);
                        regionMarkers[gameMap].push(marker);
                    }
                    else {
                    	marker = L.marker(unproject(poi.coord));
                    	popupText = poi.name +'<br><span class="mapId">'+link(poi.poi_id)+'</span>';
                    	marker.bindPopup(popupText);
                    	unknown.addLayer(marker);
                        markers.push(marker);
                        regionMarkers[gameMap].push(marker);
                    }
                }
                <!--{if isset($zone)}-->
                }
                <!--{/if}-->
                waypoints.addTo(map);
                //pois.addTo(map);
                //vistas.addTo(map);
                //tasks.addTo(map);
                //challenges.addTo(map);
                //unknown.addTo(map);
                playerGroup.addTo(map);
                //playerGroup.bringToFront();
                guildBounty.addTo(map);
            }
        }
    });
    var overlayMaps = {
        "Vistas": vistas,
        "Waypoints": waypoints,
        "Points of Interest": pois,
        "Tasks": tasks,
        "Skill Challenges": challenges,
        "Unknown": unknown,
        "Players": playerGroup
    };
    L.control.layers(null, overlayMaps).addTo(map);
    
    map.on('moveend', placeMarkersInBounds);
    
    map.on('zoomend', function(){
    	if (map.getZoom()>5) 
    		tile1.bringToFront();
    	else if (map.getZoom()<6)
    		tile2.bringToFront();
    		//tile2._clearBgBuffer();
    })
    

    placeMarkersInBounds();

    function placeMarkersInBounds() {
    	var mapBounds = map.getBounds();
    	for (var i = 0; i<markers.length;i++){
    		var m = markers[i];
            var shouldBeVisible = mapBounds.contains(m.getLatLng());
            if (m._icon && !shouldBeVisible) {
                //map.removeLayer(m);
                m._icon.style.display = 'none';
            } else if (m._icon && shouldBeVisible) {
                //map.addLayer(m);
                m._icon.style.display = 'block';
            }
    	}
   	}
    
//	  var polyline = L.polyline([], {color: "red"})//.addTo(map);
	  
	  var centerOnPlayer=false;
	  
	  function update(){
		  if (centerOnPlayer) {
			  for(var key in players){
				  map.setView((players[key].getLatLng()));
				  return;
			  }
		  }
	  }
    

	setInterval(function(){
/*		 $.ajax({
		    	url: "gw2location.php",
		    	type: 'post',
		    	data: {get: "playerdata", key: "5377f790adf05c172ecef9e7b18d22a2c628276a", continent: 1},
		    	success: function(request){
		    		$data=request['2fa2281ddef72ba434bb05ceda80bd21079be97c'];
		    		$players['2fa2281ddef72ba434bb05ceda80bd21079be97c'] = L.marker(unproject([$data['pos'][0],$data['pos'][1]]), {
		                title: $data['charname']
		    			icon: playerIcon
		            });
		            marker.bindPopup($data['charname']);
		            unknown.addLayer($players['2fa2281ddef72ba434bb05ceda80bd21079be97c']);
		            //markers.push(marker);
		    	}
		    });*/
		$.ajax({
	    	url: "http://bobdole0.byethost16.com/gw2/examples/gw2location.php",
	    	type: 'get',
	        dataType: 'jsonp',
	    	data: {get: "playerdata", continent: 1},
	    	success: function(request){
	    		//console.log($.isArray(request));
	    		//console.log(request);
	    		if (true){
	    		for(var key in request){
	    			var data=request[key];
		    		if (key in players){
//		    			players[key]._icon.title=data['charname'];
                        popupText = '<img src="'+professions[data['profession']][1] + '" width="15" height="15">'+data['charname'];                                    
                        players[key].updateLabelContent(popupText);
                        //console.log(key);
                        //players[key]._popup.setContent(popupText);
		    			players[key].setLatLng(unproject([data['pos'][0],data['pos'][1]])).update();
		    			players[key].setIconAngle(data['angle']+180);
		    		}
		    		else{
			    		players[key] = L.marker(unproject([data['pos'][0],data['pos'][1]]), {
		                //title: data['charname'],
	    				icon: playerIcon
		            });
	    			players[key].setIconAngle(data['angle']+180);
	    			popupText = '<img src="'+professions[data['profession']][1] + '" width="15" height="15">'+data['charname'];                                     
		    		players[key].bindLabel(popupText, {noHide:true, direction: 'left'});
		            playerGroup.addLayer(players[key]);
		    		}
	    		}}
	    		for (var key in players){
	    			//console.log(key);
	    			//console.log((!(key in request)));
	    			if (!(key in request)){
	    				map.removeLayer(players[key]);
	    				delete players[key];
	    			}
	    		}
	    		update();
	            //markers.push(marker);
	    	}
	    });
	}, 2000);
   
//});