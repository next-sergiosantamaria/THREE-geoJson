//Globals
var json, camera, scene, renderer, mesh, group, groupGeometry, mouse, gometryLenth, controls, box, sumVertices, countForShapes, 
	fast = false, 
	width = window.innerWidth, 
	height = window.innerHeight;

var lightpoints = [];	
var centers = [];

var clock = new THREE.Clock();

var actualCity, actualAmount = 1;

var reScaleGroup = 1;

var lightGroup = new THREE.Object3D();
var lineRedGroup = new THREE.Object3D();
var lineBlueGroup = new THREE.Object3D();
var centersGroup = new THREE.Object3D();

var cameraPositionPan, cameraPositionSide, cameraTarget;

var shapeCount = 0, shapes = [], subset_size = 5000, ctrlCount = 0;

var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2(),
	offset = new THREE.Vector3(),
	INTERSECTED, SELECTED, plane, prevColorIntersected;

var ctrlPressed = false;
$(window).keydown(function(evt) {
  if (evt.which == 17) { // ctrl
    ctrlPressed = true;
  }
}).keyup(function(evt) {
  if (evt.which == 17) { // ctrl
    ctrlPressed = false;
  }
});	

 var container = document.getElementById('containerMap');	



document.getElementById("amountAge").disabled = true;
document.getElementById("amountIncomes").disabled = true;
document.getElementById("colorAge").disabled = true;
document.getElementById("colorIncome").disabled = true;
document.getElementById("panoramic").disabled = true;
document.getElementById("onfloor").disabled = true;
document.getElementById("backW").disabled = true;
document.getElementById("backD").disabled = true;

$('#selectAmount').addClass('transparetBack');
$('#selectColor').addClass('transparetBack');
$('#selectView').addClass('transparetBack');
$('#selectBackColor').addClass('transparetBack');

//generateMap();	

function generateMap(value){
	console.log('enpieza la marcha', value);
	$(document).ready(function() {
		log("start loading");
		$.getJSON( jsonFile, function( data ) {
			log("loading complete");
			json = data;
			shapeCount = 0, shapes = [], subset_size = 5000;
			actualCity = value;	
			init();
		});
	});
}

function log(m){
	if(log){
		console.log(m);
	}
}

function init() {

	actualAmount = 1;

	scene = new THREE.Scene();

	/*var boxgeometry = new THREE.BoxGeometry(5,5,5);
	var boxmaterial = new THREE.MeshLambertMaterial({color: 0x333333});
	var box = new THREE.Mesh( boxgeometry, boxmaterial );
	box.position.set( 100, 0, 4);
	scene.add(box);*/

	camera = new THREE.PerspectiveCamera( 50, (width/height), 0.1, 10000000 );
	//camera.position.set( -20, -14, 177 );

	if(actualCity == 'abudhabi') {
		cameraPositionPan = { 'x': 78, 'y': 195, 'z': 71 }; //camera.position.set( 51, 184, -26 );
		cameraPositionSide = { 'x': 664, 'y': 797, 'z': -7735 };
		cameraTarget = { 'x': 70,'y': 0, 'z': -20};
	}
	else if(actualCity == 'berlin') {
		cameraPositionPan = { 'x': 199, 'y': 634, 'z': 80 }; //camera.position.set( 205, 669, -46 );
		cameraPositionSide = { 'x': -212, 'y': 87, 'z': 217 };
		cameraTarget = { 'x': 200,'y': 0, 'z': 80};
	}
	else if(actualCity == 'viena') {
		cameraPositionPan = { 'x': -172, 'y': 514, 'z': -135 }; //camera.position.set( -175, 489, -76 );
		cameraPositionSide = { 'x': -265, 'y': 58, 'z': -547 };
		cameraTarget = { 'x': -200,'y': 0, 'z': -30};
	}
	else if(actualCity == 'bruselas') {
		cameraPositionPan = { 'x': -57, 'y': 494, 'z': -200 }; //camera.position.set( 147, -254, 506 );
		cameraPositionSide = { 'x': 159, 'y': 44, 'z': 115 };
		cameraTarget = { 'x': -50,'y': 0, 'z': -200};
	}
	else if(actualCity == 'madrid') {
		cameraPositionPan = { 'x': 50, 'y': 392, 'z': -20 }; //camera.position.set( 50, 392, -20 );
		cameraPositionSide = { 'x': 14, 'y': 53, 'z': 366 };
		cameraTarget = { 'x': 50,'y': 0, 'z': -20};
	}
	else if(actualCity == 'praga') {
		cameraPositionPan = { 'x': -119, 'y': 584, 'z': -79 }; //camera.position.set( 142, 0, 422 );
		cameraPositionSide = { 'x': 326, 'y': 58, 'z': 16 };
		cameraTarget = { 'x': -120,'y': 0, 'z': -80};
	}

	else if(actualCity == 'world') {
		cameraPositionPan = { 'x': 90, 'y': 730, 'z': -277 }; //camera.position.set( 142, 0, 422 );
		cameraPositionSide = { 'x': 582419, 'y': 2617832, 'z': -25150273  };
		cameraTarget = { 'x': 100,'y': 0, 'z': 4};
	}
	else if(actualCity == 'europe') {
		cameraPositionPan = { 'x': 0, 'y': 467, 'z': -191 }; //camera.position.set( 142, 0, 422 );
		cameraPositionSide = { 'x': 61839393, 'y': 205306819, 'z': -1184842018  };
		cameraTarget = { 'x': -10,'y': 0, 'z': -50};
	}
	else if(actualCity == 'spain') {
		cameraPositionPan = { 'x': 170, 'y': 494, 'z': -182 }; //camera.position.set( 142, 0, 422 );
		cameraPositionSide = { 'x': 44648199, 'y': 120549732, 'z': -1209962084  };
		cameraTarget = { 'x': 150,'y': 0, 'z': 50};
	}
	else{ 
		cameraPositionPan = { 'x': -119, 'y': 584, 'z': -79 }; //camera.position.set( 142, 0, 422 );
		cameraPositionSide = { 'x': 326, 'y': 58, 'z': 16 };
		cameraTarget = { 'x': -120,'y': 0, 'z': -80};
	}

	camera.position.set( cameraPositionPan.x, cameraPositionPan.y, cameraPositionPan.z );

	mouse = new THREE.Vector2();

	document.body.appendChild(container);

	renderer = new THREE.WebGLRenderer( { antialias: true, preserveDrawingBuffer: true, alpha: true } );
	renderer.setSize( width, height );
	renderer.shadowMapEnabled = true;
	renderer.shadowMapType = THREE.PCFSoftShadowMap;
	renderer.setViewport( 0,0,width, height );

	group = new THREE.Object3D();
	//group.position.y = 50;
	//group.position.z = 0;
	scene.add( group );
	groupGeometry = new THREE.Geometry();
	
	log("initiation done");

	plane = new THREE.Mesh(
		new THREE.PlaneBufferGeometry( 2000, 2000, 8, 8 ),
		new THREE.MeshBasicMaterial( { visible: false } )
	);

	plane.rotation.x = Math.PI / 2;
	plane.rotation.y = Math.PI;
	plane.name = 'plano';

	scene.add( plane );

	buildShape();

	renderer.domElement.addEventListener( 'mousemove', onDocumentMouseMove, false );
	renderer.domElement.addEventListener( 'mousedown', onDocumentMouseDown, false );
	renderer.domElement.addEventListener( 'mouseup', onDocumentMouseUp, false );
	renderer.domElement.addEventListener('dblclick', onDocumentDBClick, false);

	//
	window.addEventListener( 'resize', onWindowResize, false );

}

function buildShape(){
	countForShapes = 0;
	log("buildShape ("+shapeCount+"/"+json.features.length+") "+actualCity);
	if(actualCity != 'abudhabi') var numberOfParticles = 10;
	else var numberOfParticles = 3;
	if(shapeCount<json.features.length){
		var shapeSession = 0;
		if(actualCity == 'spain' || actualCity == 'europe') var parseCoordinates = {"x": (json.features[0].geometry.coordinates[0][0][0][0]).toFixed(2), "y": (json.features[0].geometry.coordinates[0][0][0][1]).toFixed(2)};
		else var parseCoordinates = {"x": (json.features[0].geometry.coordinates[0][0][0]).toFixed(2), "y": (json.features[0].geometry.coordinates[0][0][1]).toFixed(2)};

		for(var s = shapeCount; s < json.features.length && shapeSession < subset_size; s++){
			shapeSession++;
			shapeCount++;
			var good = true;
			var points = [];
			gometryLenth = json.features[s].geometry.coordinates[0].length;
			if(json.features[s].geometry.coordinates.length<1 || json.features[s].geometry.coordinates[0]<1){
				good = false;
				console.log('wrong coordinates: '+json.features[s].properties.name);
			}else{
				if(json.features[s].geometry.type == 'Polygon'){
					for(var i = 0; i<gometryLenth; i++){
						if(json.features[s].geometry.coordinates[0][i][0] && json.features[s].geometry.coordinates[0][i][1]){
						//if(json.features[s].geometry.coordinates[0][i][0] && json.features[s].geometry.coordinates[0][i][1] && json.features[s].geometry.coordinates[0][i][0]>0 && json.features[s].geometry.coordinates[0][i][1]>0){
							points.push( new THREE.Vector2 ( translateLat(json.features[s].geometry.coordinates[0][i][0], parseCoordinates.x ), translateLng(json.features[s].geometry.coordinates[0][i][1], parseCoordinates.y )));
							if(i<numberOfParticles){
								lightpoints.push( { 'x': json.features[s].geometry.coordinates[0][i][0], 'y': json.features[s].geometry.coordinates[0][i][1] });		
							} 
						}else{
							good = false;
							console.log('wrong coordinates: '+json.features[s].properties.name);
						}
					}
					if(good){
						var h = heightFn(0.1);
						var z = ((h/max)*z_max);
						if(!z || z<1){z = 0;}
						var red = Math.round((h/max)*255.0);
						var blue = Math.round(255.0-(h/max)*255.0);
						//var color = new THREE.Color("rgb("+red+",0,"+blue+")");
						var color = new THREE.Color("rgb(255,255,255)");
						addShape( new THREE.Shape( points ), z*z_rel, color, 0, 50, 0, r, 0, 0, 1, json.features[s].properties.name );
					}	
				}
				else if(json.features[s].geometry.type == 'MultiPolygon'){
					for(var d = 0; d < json.features[s].geometry.coordinates.length; d++){
						for(var r = 0; r < json.features[s].geometry.coordinates[d].length; r++){
								var points = [];
								for(var t = 0; t < json.features[s].geometry.coordinates[d][r].length; t++){
										if(json.features[s].geometry.coordinates[d][r][t][0] && json.features[s].geometry.coordinates[d][r][t][1]){
										//if(json.features[s].geometry.coordinates[0][i][0] && json.features[s].geometry.coordinates[0][i][1] && json.features[s].geometry.coordinates[0][i][0]>0 && json.features[s].geometry.coordinates[0][i][1]>0){
											points.push( new THREE.Vector2 ( translateLat(json.features[s].geometry.coordinates[d][r][t][0], parseCoordinates.x ), translateLng(json.features[s].geometry.coordinates[d][r][t][1], parseCoordinates.y )));
											if(t<numberOfParticles){
												lightpoints.push( { 'x': json.features[s].geometry.coordinates[d][r][t][0], 'y': json.features[s].geometry.coordinates[d][r][t][1] });		
											} 
										}else{
											good = false;
											console.log('wrong coordinates: '+json.features[s].properties.name);
										}
								}
								if(good){	
									var h = heightFn(0.1);
									var z = ((h/max)*z_max);
									if(!z || z<1){z = 0;}
									var red = Math.round((h/max)*255.0);
									var blue = Math.round(255.0-(h/max)*255.0);
									//var color = new THREE.Color("rgb("+red+",0,"+blue+")");
									var color = new THREE.Color("rgb(255,255,255)");
									addShape( new THREE.Shape( points ), z*z_rel, color, 0, 50, 0, r, 0, 0, 1, json.features[s].properties.name );
								}
							}
					}	
				}
			}
		}
		setTimeout(function(){ buildShape(); }, 100);

	}else{

		/*for(var t = 0; t<spaincenters.length; t++){
			var boxgeometry = new THREE.BoxGeometry(5,5,5);
			var boxmaterial = new THREE.MeshLambertMaterial({color: 0x333333});
			box = new THREE.Mesh( boxgeometry, boxmaterial );
			box.position.set( spaincenters[t].x ,spaincenters[t].y ,5  );
			group.add(box);
		}*/

		calculateCenters();

		scene.add(group);
		
		var directionalLight = new THREE.DirectionalLight(0xeeeeee, 1);
		directionalLight.position.set(0, 150,-250);
		directionalLight.target = mesh;
		directionalLight.castShadow = true;
		directionalLight.shadowDarkness = 0.5;
		directionalLight.name = 'luzDireccional'
		scene.add( directionalLight );

		console.log(cameraTarget);

		controls = new THREE.OrbitControls( camera, renderer.domElement );
		controls.enableDamping = true;
		controls.dampingFactor = 0.25;
		controls.enableZoom = true;
		controls.target.set( group.position.x+cameraTarget.x, cameraTarget.y, group.position.z+cameraTarget.z );

		container.appendChild(renderer.domElement);

		log("animate");

		animate();

		document.getElementById("amountAge").disabled = false;
		document.getElementById("amountIncomes").disabled = false;
		document.getElementById("colorAge").disabled = false;
		document.getElementById("colorIncome").disabled = false;
		document.getElementById("panoramic").disabled = false;
		document.getElementById("onfloor").disabled = false;
		document.getElementById("backW").disabled = false;
		document.getElementById("backD").disabled = false;

		document.getElementById("panoramic").checked = true;
		document.getElementById("backW").checked = true;
		document.getElementById("colorNone").checked = true;
		document.getElementById("amountNone").checked = true;

		$('#selectAmount').removeClass('transparetBack');
		$('#selectColor').removeClass('transparetBack');
		$('#selectView').removeClass('transparetBack');
		$('#selectBackColor').removeClass('transparetBack');

		setTimeout(hide,1000);
		setTimeout(remove,2000);

	}
}

function addShape( shape, extrude, color, x, y, z, rx, ry, rz, s, name ) {

	var extrudeSettings = {
		amount			: extrude*20,
		steps			: 1,
		material		: 0,
		extrudeMaterial : 1,
		bevelEnabled	: false
	};

	if(actualCity == 'europe' || actualCity == 'spain') { reScaleGroup = 100000;  }
	else if(actualCity == 'world') { reScaleGroup = 1000;  }
	else reScaleGroup = 1;

	var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

	for(var f = 0; f<geometry.faces.length; f++){
		geometry.faces[f].color.setRGB(color.r, color.g, color.b);
	}

	log("Geometry Done");
		
	var shaderMaterial = new THREE.ShaderMaterial({
			attributes: 	{},
			uniforms:		{},
			vertexShader:   THREETUT.Shaders.Lit.vertex,
		    fragmentShader: THREETUT.Shaders.Lit.fragment
		    ,side: THREE.FrontSide
	});
		
	var materials = [
			new THREE.MeshLambertMaterial({vertexColors: THREE.VertexColors, color: "rgb(0.2,0.2,0.2)",ambient: "rgb(0.2,0.2,0.2)", shininess: 1, lights:true}),
			new THREE.MeshLambertMaterial({vertexColors: THREE.VertexColors, color: "rgb(0.5,0.5,0.5)",ambient: "rgb(0.5,0.5,0.5)", shininess: 1, lights:true})
	];

	var material = new THREE.MeshFaceMaterial(materials);

	mesh = new THREE.Mesh( geometry, material );
	mesh.position.set( 0,0,0 );
	//mesh.rotation.set( r, 0, 0 );
	mesh.scale.set((scale_factor * scale_x)/reScaleGroup,(scale_factor * scale_y)/reScaleGroup, actualAmount);
	mesh.castShadow = true;
	mesh.receiveShadow = true;

	mesh.name = name;
	mesh.number = countForShapes;
	mesh.originalColor = { 'r': 1, 'g': 1, 'b': 1 };
	mesh.active = false;

	//console.log(mesh);

	group.add( mesh );

	group.name = 'structure';


	group.rotation.x = Math.PI / 2;
	group.rotation.y = Math.PI;

	countForShapes = countForShapes + 1;

	//groupGeometry.merge( geometry, geometry.matrix );
}


function changeView(value){
	var timeElapsed = 1000;
	if(value == 'onFloor'){//transparetBack
		document.getElementById("amountAge").disabled = true;
		document.getElementById("amountIncomes").disabled = true;
		document.getElementById("colorAge").disabled = true;
		document.getElementById("colorIncome").disabled = true;

		document.getElementById("backW").checked = false;
		document.getElementById("backD").checked = true;

		$('#selectAmount').addClass('transparetBack');
		$('#selectColor').addClass('transparetBack');

		$('#loading').removeClass('whiteBack');
		$('#loading').addClass('transparetBack');

		$('body').removeClass('whiteBack');
		$('body').addClass('blackBack');

		if(actualCity == 'abudhabi') document.getElementById("frontiers").innerHTML = 'Specific locals comerce Activity';
		else document.getElementById("frontiers").innerHTML = 'Frontiers activity';

		$('#frontiers').removeClass('hideLeft');

		controls.target.set( group.position.x+cameraTarget.x, cameraTarget.y, group.position.z+cameraTarget.z );
		changeColor('blue', true);
		//changeOpacity('white');
		movement({ 'x': cameraPositionSide.x, 'y': cameraPositionSide.y, 'z': cameraPositionSide.z }, camera.position, 0, timeElapsed*2); //camera.position.set( -24, -164, 59 );
		//console.log(mesh);
		movement( { 'x': scale_factor * scale_x*reScaleGroup, 'y': scale_factor * scale_y*reScaleGroup, 'z': 0.1 }, group.scale, 0, timeElapsed);
		//movement( { 'opacity': 0 }, mesh.material.materials[0], 0, timeElapsed);
		setTimeout(addSpritesImages,2000);	
	}
	else if(value == 'panoramic'){
		document.getElementById("amountAge").disabled = false;
		document.getElementById("amountIncomes").disabled = false;
		document.getElementById("colorAge").disabled = false;
		document.getElementById("colorIncome").disabled = false;

		document.getElementById("backW").checked = true;
		document.getElementById("backD").checked = false;

		$('#selectAmount').removeClass('transparetBack');
		$('#selectColor').removeClass('transparetBack');

		$('#frontiers').addClass('hideLeft');

		removeLights();
		changeColor('white', true);
		controls.target.set( group.position.x+cameraTarget.x, cameraTarget.y, group.position.z+cameraTarget.z );
		$('body').removeClass('blackBack');
		$('body').addClass('whiteBack');
		movement( { 'x': cameraPositionPan.x, 'y': cameraPositionPan.y, 'z': cameraPositionPan.z }, camera.position, 0, timeElapsed); //camera.position.set( -20, -14, 177 );
		movement( { 'x': 1, 'y': 1, 'z': 1 }, group.scale, 0, timeElapsed);
		//mesh.scale.set(scale_factor * scale_x,scale_factor * scale_y,0.5);
		//camera.position.set(camera.position.x, camera.position.y+380, camera.position.z);
	}
}

function addSpritesImages(){

	show();
	Unremove();

	var sizepotenciator = 1;

	var texturesArray = ['Smoke/Plume.png','Rays/laser1.png', 'Glows/Flare5.png', 'Glows/Flare4.png', 'Glows/glow.png']
	//console.log(lightpoints, lightpoints.length);
	lightGroup.name = 'luces';

	var len = group.children.length;

	if(actualCity == 'europe' || actualCity == 'spain' ) { particleHigh = particleHigh * 200000; sizepotenciator = 200000; console.log('actual city is: '+actualCity);}
	else if(actualCity == 'world') { particleHigh = particleHigh * 5000; sizepotenciator = 5000; console.log('actual city is: '+actualCity);}

	//console.log(group.children.length);

	for(var a = 0; a<len; a++){
		for(var e = 0; e<group.children[a].geometry.vertices.length; e = e+5){

			if(texturesArray[a%3] == 'Rays/laser1.png') var particleHigh = 4;
			else var particleHigh = 1;

			//var particleHigh = 1;

			var particlesize = Math.floor((Math.random() * 80) + 20);
			var particleColor = Math.floor((Math.random() * 255) + 0);
			var particleOpacity = Math.random();

			var textureGlass = THREE.ImageUtils.loadTexture( "images/particles/Static/"+texturesArray[a%3] );
			//var textureGlass = THREE.ImageUtils.loadTexture( "../images/particles/Static/Smoke/Plume.png" );
			var spriteMaterialGlass = new THREE.SpriteMaterial( 
		        { map: textureGlass, color: 'rgb(255,'+particleColor+', 0)', transparent : true, opacity: particleOpacity } );
		    var spriteGlass = new THREE.Sprite( spriteMaterialGlass );
	  			spriteGlass.scale.set((particlesize/2)*3*sizepotenciator,particlesize*particleHigh*sizepotenciator,particlesize*sizepotenciator);
		    	spriteGlass.position.set( group.children[a].geometry.vertices[e].x*1220, group.children[a].geometry.vertices[e].y*1220, (particlesize/2)*particleHigh*sizepotenciator );
				
		    lightGroup.add(spriteGlass);

		}
	}
	
	setTimeout(hide,1000);
	setTimeout(remove,2000);

	lightGroup.rotation.x = Math.PI / 2;
	lightGroup.rotation.y = Math.PI;

    scene.add(lightGroup);

}

function removeLights(){

	for( var i = lightGroup.children.length - 1; i >= 0; i--) { 
		lightGroup.remove(lightGroup.children[i]);
	}

	scene.remove(lightGroup);
}
function calculateCenters(){

	centers = [];

	if(actualCity == 'europe' || actualCity == 'spain') { reScaleGroup = 100000;  }
	else if(actualCity == 'world') { reScaleGroup = 1000;  }
	else reScaleGroup = 1;

	var lenCicle = group.children.length;

	for(var a = 0; a<lenCicle; a++){

		sumVertices = { 'x': 0, 'y': 0 };

		var lenVertices = group.children[a].geometry.vertices.length;
		for( var e = 0; e< lenVertices; e++){
			sumVertices.x = sumVertices.x + group.children[a].geometry.vertices[e].x;
			sumVertices.y = sumVertices.y + group.children[a].geometry.vertices[e].y;
		}
		sumVertices.x = sumVertices.x/lenVertices;
		sumVertices.y = sumVertices.y/lenVertices;

		/*var boxgeometry = new THREE.BoxGeometry(50,50,5);
			var boxmaterial = new THREE.MeshLambertMaterial({color: 0x333333});
			box = new THREE.Mesh( boxgeometry, boxmaterial );
			box.position.set( sumVertices.x ,sumVertices.y ,5  );
			centersGroup.add(box);*/

		centers.push(sumVertices);	
	}

	/*centersGroup.scale.set((scale_factor * scale_x)/reScaleGroup,(scale_factor * scale_y)/reScaleGroup, actualAmount);

	centersGroup.rotation.x = Math.PI / 2;
	centersGroup.rotation.y = Math.PI;

	scene.add(centersGroup);*/
}

function changeAmount(value){
	removeLines()
	if(value == 'age') actualAmount = 0.3;
	else if(value == 'incomes') actualAmount = 0.5;
	else if(value == 'none') actualAmount = 1;
	var len = group.children.length;
	for(var a = 0; a<len; a++){
		if(value == 'none') var altura = 1;
		else var altura = Math.floor((Math.random() * 40) + 1);
		//if(actualCity == 'europe' ) altura = altura * 300;
		movement( { 'x':group.children[a].scale.x, 'y': group.children[a].scale.y, 'z': altura*actualAmount }, group.children[a].scale, 0, 1000);
	}
	//movement( { 'x':scale_factor * scale_x, 'y': scale_factor * scale_y, 'z': actualAmount }, mesh.scale, 0, 1000);
}

function changeOpacity(value){
	if(value == 'white') var actualOpacity = 0.3;
	else var actualOpacity = 1;
	var len = group.children.length;
	for(var a = 0; a<len; a++){
		movement( actualOpacity , group.children[a].material.materials[0].opacity, 0, 1000);
		movement( actualOpacity , group.children[a].material.materials[1].opacity, 0, 1000);
		group.children[a].material.materials[0].needsUpdate = true;
	}
	//movement( { 'x':scale_factor * scale_x, 'y': scale_factor * scale_y, 'z': actualAmount }, mesh.scale, 0, 1000);
}

function changeBack(value){
	if(value == 'white'){
		$('body').removeClass('blackBack');
		$('body').addClass('whiteBack');
	}
	else {
		$('body').removeClass('whiteBack');
		$('body').addClass('blackBack');
	}
}

function hide(){
	console.log('ocultando capa');
	$('#loading').addClass('hideScreen');
}
function show(){
	console.log('mostrando capa');
	$('#loading').removeClass('hideScreen');
}
function remove(){
	$('#loading').addClass('removeScreen');
}
function Unremove(){
	$('#loading').removeClass('removeScreen');
}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );

}

function onDocumentMouseMove( event ) {

	event.preventDefault();
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

	raycaster.setFromCamera( mouse, camera );

	//

	if(actualCity != 'abudhabi'){

		var intersects = raycaster.intersectObjects( group.children );

		if ( intersects.length > 0 ) {

				container.style.cursor = 'pointer';

			if ( INTERSECTED != intersects[ 0 ].object ) {

					if(INTERSECTED != undefined && !INTERSECTED.active){
						//INTERSECTED.material.materials[0].color.setRGB( INTERSECTED.originalColor.r, INTERSECTED.originalColor.g, INTERSECTED.originalColor.b );
						movement( { 'r': INTERSECTED.originalColor.r, 'g': INTERSECTED.originalColor.g, 'b': INTERSECTED.originalColor.b }, INTERSECTED.material.materials[0].color, 0, 1000);	
					}

					INTERSECTED = intersects[ 0 ].object;

					prevColorIntersected = intersects[ 0 ].object.material.materials[0].color;

					if(!INTERSECTED.active) INTERSECTED.material.materials[0].color.setRGB(1,0.5,0.5); //movement( { 'r': 1, 'g': 0.5, 'b': 0.5 }, INTERSECTED.material.materials[0].color, 0, 200); 
					document.getElementById("infoPanel").innerHTML = INTERSECTED.name;
					$('#infoPanel').removeClass('hideLeft');
				}

			} else {
				container.style.cursor = 'default';
				if( INTERSECTED != undefined && !INTERSECTED.active ) INTERSECTED.material.materials[0].color.setRGB( INTERSECTED.originalColor.r, INTERSECTED.originalColor.g, INTERSECTED.originalColor.b );
				INTERSECTED = undefined;
				document.getElementById("infoPanel").innerHTML = '';
				$('#infoPanel').addClass('hideLeft');
			}	
	}
}

function onDocumentMouseDown( event ) {

	console.log(actualCity);

	if(actualCity != 'abudhabi'){

		event.preventDefault();

		raycaster.setFromCamera( mouse, camera );

		var intersects = raycaster.intersectObjects( group.children );

		if ( intersects.length > 0 && ctrlCount<3 ) {

			if(ctrlPressed)ctrlCount = ctrlCount + 1;

			if( SELECTED != undefined && !ctrlPressed ) { SELECTED.material.materials[0].color.setRGB(SELECTED.originalColor.r, SELECTED.originalColor.g, SELECTED.originalColor.b); SELECTED.active = false; }

			controls.enabled = false;

			SELECTED = intersects[ 0 ].object;

			console.log(SELECTED);

			var intersects = raycaster.intersectObject( plane );

			if(!ctrlPressed) removeLines();

			var numberOfLines = Math.floor((Math.random() * 30) + 5);
			var maxLines = group.children.length;

			for(var a = 0; a<numberOfLines; a++){
				addLinesRed(SELECTED.number, Math.floor((Math.random() * maxLines) + 0));
				addLinesBlue(SELECTED.number, Math.floor((Math.random() * maxLines) + 0));
			}

			SELECTED.material.materials[0].color.setRGB(0.5,1,0.5);
			SELECTED.active = true;

			var selectLabel = "infoPanelSelected"+ctrlCount.toString();

			document.getElementById(selectLabel).innerHTML = SELECTED.name;
			$('#'+selectLabel).removeClass('noneDisplay');
			$('#infoPanelSelectedGroup').removeClass('hideLeft');
				
			//SELECTED.position.set(mouse.x, mouse.y, 0.1)
			//offset.copy( intersects[ 0 ].point ).sub( plane.position );
			//group.children[46].position.set(0-mouse.x, 0, 0)
			//console.log(group.children[46], group.children[46].position);
		}
		else {
		}
	}
}

function onDocumentDBClick( event ) {
	event.preventDefault();

	raycaster.setFromCamera( mouse, camera );

	var intersects = raycaster.intersectObjects( group.children );

	if ( intersects.length > 0 ) {
	}
	else {
		ctrlCount = 0;
		if(SELECTED != undefined) { SELECTED.material.materials[0].color.setRGB(SELECTED.originalColor.r, SELECTED.originalColor.g, SELECTED.originalColor.b); SELECTED.active = false; }
		changeColor('white', true);
		removeLines();
		$('body').removeClass('blackBack');
		$('body').addClass('whiteBack');

		document.getElementById("backW").checked = true;
		document.getElementById("backD").checked = false;

		document.getElementById("infoPanelSelected0").innerHTML = '';
		document.getElementById("infoPanelSelected1").innerHTML = '';
		document.getElementById("infoPanelSelected2").innerHTML = '';
		document.getElementById("infoPanelSelected3").innerHTML = '';
		$('#infoPanelSelected1').addClass('noneDisplay');
		$('#infoPanelSelected2').addClass('noneDisplay');
		$('#infoPanelSelected3').addClass('noneDisplay');

		$('#infoPanelSelectedGroup').addClass('hideLeft');
	}

}

function onDocumentMouseUp( event ) {

	event.preventDefault();

	controls.enabled = true;

	if ( INTERSECTED ) {
		//console.log('posicion seleccionada: ', SELECTED, SELECTED.position);
		//plane.position.copy( INTERSECTED.position );
		//SELECTED = null;
	}
}

function changeColor(value, activaChangePermission){

	console.log(activaChangePermission);
	var len = group.children.length;
	for(var a = 0; a<len; a++){
		if(value == 'blue') {
			var red = 0.5;
			var blue = 0.7;
			var green = 0.5;
		}
		else if(value == 'white'){
			var red = 1;
			var blue = 1;
			var green = 1;
		}
		else{
			var colorHex = Math.random();
			var red = colorHex;
			var blue = 1-colorHex;
			var green = colorHex;
		}
		group.children[a].originalColor = { 'r': red, 'g': green, 'b': blue };
		if(!group.children[a].active || activaChangePermission) movement( { 'r': red, 'g': green, 'b': blue }, group.children[a].material.materials[0].color, 0, 1000);
		movement( { 'r': red, 'g': green, 'b': blue }, group.children[a].material.materials[1].color, 0, 1000);
		group.children[a].material.materials[0].needsUpdate = true;
	}
	//movement( { 'x':scale_factor * scale_x, 'y': scale_factor * scale_y, 'z': actualAmount }, mesh.scale, 0, 1000);
}

function addLinesRed(value1, value2){

	$('body').removeClass('whiteBack');
	$('body').addClass('blackBack');

	document.getElementById("backW").checked = false;
	document.getElementById("backD").checked = true;

	if(actualCity == 'europe' || actualCity == 'spain') { reScaleGroup = 100000;  }
	else if(actualCity == 'world') { reScaleGroup = 1000;  }
	else reScaleGroup = 1;

	var firstPoint = centers[value1];
	var endPoint = centers[value2];
	var count = 0;

	var numPoints = 200;

	var spline = new THREE.SplineCurve3([
				   new THREE.Vector3(firstPoint.x ,firstPoint.y ,2 ),
				   new THREE.Vector3(((firstPoint.x+endPoint.x)/2), (firstPoint.y+endPoint.y)/2, 30 ),
				   new THREE.Vector3(endPoint.x ,endPoint.y ,2 )
				]);

	var geometry3 = new THREE.Geometry();

	var material3 = new THREE.LineBasicMaterial({
		    color: 0xff5500,
		    transparent:true,
			opacity: 0.8,
		    //linewidth: Math.floor((Math.random() * 30) + 1)*10*e,
            linewidth: 1,
			sizeAttenuation: false,
			visible: true
		});

	var splinePoints = spline.getPoints(numPoints);

	for(var o = 0; o < splinePoints.length; o++){
		    geometry3.vertices.push(splinePoints[o]);  
		}	

	var line2 = new THREE.Line(geometry3, material3);

	//PARTICULAS -----------------------
	var particlesize = Math.floor((Math.random() * 700) + 200);
	var particleColor = Math.floor((Math.random() * 255) + 0);
	var particleVelocity = Math.floor((Math.random() * 30) + 1);
	var particleOpacity = Math.random();

	if(actualCity == 'europe' || actualCity == 'spain') particlesize = particlesize * 55;

	var textureGlass = THREE.ImageUtils.loadTexture( "images/particles/Static/Glows/Flare4.png" );
	//var textureGlass = THREE.ImageUtils.loadTexture( "../images/particles/Static/Smoke/Plume.png" );
	var spriteMaterialGlass = new THREE.SpriteMaterial( 
	    { 	
	    	map: textureGlass, 
	    	//color: 'rgb(255,'+particleColor+', 0)', 
	    	color: 'rgb(255, 255, 0)', 
	    	transparent : true, opacity: 0.7 
	    } );
	var spriteGlass = new THREE.Sprite( spriteMaterialGlass );
		spriteGlass.scale.set(particlesize,particlesize,particlesize);
	   	spriteGlass.position.set( geometry3.vertices[0].x,  geometry3.vertices[0].y, geometry3.vertices[0].z);

	setInterval(function(){ 
			spriteGlass.position.set( geometry3.vertices[count].x,  geometry3.vertices[count].y, geometry3.vertices[count].z);
			count = count + 1;
			if(count >= geometry3.vertices.length ) count = 0;

	 }, particleVelocity);   	
				
	lineRedGroup.add(spriteGlass);

	lineRedGroup.name = 'exportsLines';

	//----------------------------------------

	lineRedGroup.add(line2);

	lineRedGroup.scale.set((scale_factor * scale_x)/reScaleGroup,(scale_factor * scale_y)/reScaleGroup, actualAmount);	

	lineRedGroup.rotation.x = Math.PI / 2;
	lineRedGroup.rotation.y = Math.PI;

	scene.add(lineRedGroup);
}

function addLinesBlue(value1, value2){

	$('body').removeClass('whiteBack');
	$('body').addClass('blackBack');

	if(actualCity == 'europe' || actualCity == 'spain') { reScaleGroup = 100000;  }
	else if(actualCity == 'world') { reScaleGroup = 1000;  }
	else reScaleGroup = 1;

	var firstPoint = centers[value1];
	var endPoint = centers[value2];

	var numPoints = 200;

	var spline = new THREE.SplineCurve3([
				   new THREE.Vector3(firstPoint.x ,firstPoint.y ,2 ),
				   new THREE.Vector3(((firstPoint.x+endPoint.x)/2), (firstPoint.y+endPoint.y)/2, 30 ),
				   new THREE.Vector3(endPoint.x ,endPoint.y ,2 )
				]);

	var geometry3 = new THREE.Geometry();

	var material3 = new THREE.LineBasicMaterial({
		    color: 0x5555FF,
		    transparent:true,
			opacity: 0.8,
		    //linewidth: Math.floor((Math.random() * 30) + 1)*10*e,
            linewidth: 1,
			sizeAttenuation: false,
			visible: true
		});

	var splinePoints = spline.getPoints(numPoints);

	for(var o = 0; o < splinePoints.length; o++){
		    geometry3.vertices.push(splinePoints[o]);  
		}	

	var line2 = new THREE.Line(geometry3, material3);

	var count = 200;

	//PARTICULAS -----------------------
	var particlesize = Math.floor((Math.random() * 700) + 200);
	var particleColor = Math.floor((Math.random() * 255) + 0);
	var particleVelocity = Math.floor((Math.random() * 30) + 1);
	var particleOpacity = Math.random();

	if(actualCity == 'europe' || actualCity == 'spain') particlesize = particlesize * 55;

	var textureGlass = THREE.ImageUtils.loadTexture( "images/particles/Static/Glows/glow.png" );
	//var textureGlass = THREE.ImageUtils.loadTexture( "../images/particles/Static/Smoke/Plume.png" );
	var spriteMaterialGlass = new THREE.SpriteMaterial( 
	    { 	
	    	map: textureGlass, 
	    	color: 'rgb('+particleColor+', '+particleColor+', 255)', 
	    	//color: 'rgb(255, 255, 0)', 
	    	transparent : true, opacity: 0.7 
	    } );

	var spriteGlass = new THREE.Sprite( spriteMaterialGlass );
		spriteGlass.scale.set(particlesize,particlesize,particlesize);
	   	spriteGlass.position.set( geometry3.vertices[count].x,  geometry3.vertices[count].y, geometry3.vertices[count].z);

	setInterval(function(){ 
			spriteGlass.position.set( geometry3.vertices[count].x,  geometry3.vertices[count].y, geometry3.vertices[count].z);
			count = count - 1;
			if(count <= 0 ) count = 200;

	 }, particleVelocity);   	
				
	lineBlueGroup.add(spriteGlass);

	//----------------------------------------

	lineBlueGroup.add(line2);

	lineBlueGroup.name = 'importsLines';

	lineBlueGroup.scale.set((scale_factor * scale_x)/reScaleGroup,(scale_factor * scale_y)/reScaleGroup, actualAmount);	

	lineBlueGroup.rotation.x = Math.PI / 2;
	lineBlueGroup.rotation.y = Math.PI;

	scene.add(lineBlueGroup);
}

function removeLines(){
	if(lineBlueGroup.children.length > 0){
		for( var i = lineBlueGroup.children.length - 1; i >= 0; i--) { 
			lineBlueGroup.remove(lineBlueGroup.children[i]);
		}
		scene.remove(lineBlueGroup);
	}
	if(lineRedGroup.children.length > 0){
		for( var i = lineRedGroup.children.length - 1; i >= 0; i--) { 
			lineRedGroup.remove(lineRedGroup.children[i]);
		}
		scene.remove(lineRedGroup);
	}
}

function dataFlowVisbility(type, status) {
	console.log(type, status, ctrlPressed);
	if(type == 'red') lineRedGroup.visible = status;
	else if( type == 'blue' ) lineBlueGroup.visible = status;
}


function movement(value, object, delay, duration){
          var tween = new TWEEN.Tween(object).to(
          	value
          	,duration).easing(TWEEN.Easing.Quadratic.Out).onUpdate(function () {
          	/*camera.position.x = valueX;
          	camera.position.y = valueY;
          	camera.position.z = valueZ;*/
          }).delay(delay).start();
}

function render(){
	renderer.render(scene,camera);
}

function animate() {
	//console.log(camera.position);
	//console.log(group.children[46], group.children[46].position);

	setTimeout( function() {
		requestAnimationFrame( animate );
	}, 1000/30 );

	//requestAnimationFrame( animate );

	//mesh.rotation.x = mouse.y;
	//mesh.rotation.y = mouse.x;

	/*if(animateHeight){
		heightScaler += 0.001;
	}*/

	//mesh.scale.set(scale_factor * scale_x,scale_factor * scale_y,heightScaler);
    
    TWEEN.update();

	render();
	update();

	if(controls) controls.update( clock.getDelta() );
}

function update(){

}
