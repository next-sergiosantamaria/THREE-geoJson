//Globals
var json, camera, scene, renderer, mesh, group, groupGeometry, mouse, controls
	//All zero or false height values will be ignored
	fast = false, 
	width = window.innerWidth, 
	height = window.innerHeight;

var lightpoints = [];	

var clock = new THREE.Clock();

var actualCity, actualAmount = 0.01;

var lightGroup = new THREE.Object3D();

var cameraPositionPan, cameraPositionSide, cameraTarget;

var shapeCount = 0, shapes = [], subset_size = 5000;

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

	actualAmount = 0;

	//Initiate THREE.js

	scene = new THREE.Scene();

	var boxgeometry = new THREE.BoxGeometry(5,5,5);
	var boxmaterial = new THREE.MeshLambertMaterial({color: 0x333333});
	var box = new THREE.Mesh( boxgeometry, boxmaterial );
	box.position.set(-200, 0, -30);
	scene.add(box);

	camera = new THREE.PerspectiveCamera( 50, (width/height), 0.1, 10000000 );
	//camera.position.set( -20, -14, 177 );

	if(actualCity == 'abudhabi') {
		cameraPositionPan = { 'x': 51, 'y': 184, 'z': -26 }; //camera.position.set( 51, 184, -26 );
		cameraPositionSide = { 'x': 210, 'y': 28, 'z': -71 };
		cameraTarget = { 'x': 35,'y': 0, 'z': -20};
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
	else{ 
		camera.position.set( 0, 0, 0 );

	}

	camera.position.set( cameraPositionPan.x, cameraPositionPan.y, cameraPositionPan.z );

	mouse = new THREE.Vector2();


	//Initiate Renderer

	renderer = new THREE.WebGLRenderer( { antialias: true, preserveDrawingBuffer: true, alpha: true } );
	renderer.setSize( width, height );
	renderer.shadowMapEnabled = true;
	renderer.shadowMapType = THREE.PCFSoftShadowMap;
	renderer.setViewport( 0,0,width, height );


	//This group will hold our objects for easier handling

	group = new THREE.Object3D();
	group.position.y = 50;
	group.position.z = 0;
	scene.add( group );


	//This group will hold all geometries 

	groupGeometry = new THREE.Geometry();

	
	log("initiation done");

	//Lets go and build the objects based on the geoJson data

	buildShape();

}


//Due to javascripts limitations we need to parse the data in subsets (5000)


function buildShape(){
	log("buildShape ("+shapeCount+"/"+json.features.length+")");
	if(shapeCount<json.features.length){
		var shapeSession = 0;
		var parseCoordinates = {"x": (json.features[0].geometry.coordinates[0][0][0]).toFixed(2), "y": (json.features[0].geometry.coordinates[0][0][1]).toFixed(2)};
			//console.log('coordenadas: ', parseCoordinates);
		for(var s = shapeCount; s < json.features.length && shapeSession < subset_size; s++){
			shapeSession++;
			shapeCount++;
			var good = true;
			var points = [];
			//Check if the geometry has at least two coordinates
			if(json.features[s].geometry.coordinates.length<1 || json.features[s].geometry.coordinates[0]<1){
				good = false;
				console.log('es false');
			}else{
				for(var i = 0; i<json.features[s].geometry.coordinates[0].length; i++){
					//Check for weird values
					//console.log('lo construye: ', json.features[s].geometry.coordinates[0][i][0]);
					if(json.features[s].geometry.coordinates[0][i][0] && json.features[s].geometry.coordinates[0][i][1] && json.features[s].geometry.coordinates[0][i][0]>0 && json.features[s].geometry.coordinates[0][i][1]>0){
						//console.log('lo construye', json.features[s].geometry.coordinates[0][i][0], json.features[s].geometry.coordinates[0][i][1]);
						points.push( new THREE.Vector2 ( translateLat(json.features[s].geometry.coordinates[0][i][0], parseCoordinates.x ), translateLng(json.features[s].geometry.coordinates[0][i][1], parseCoordinates.y )));
						if(i<3){
							//lightpoints.push( new THREE.Vector2 ( translateLat(json.features[s].geometry.coordinates[0][i][0], parseCoordinates.x ), translateLng(json.features[s].geometry.coordinates[0][i][1], parseCoordinates.y )));
							lightpoints.push( { 'x': json.features[s].geometry.coordinates[0][i][0], 'y': json.features[s].geometry.coordinates[0][i][1] });		
						} 
					}else{
						good = false;
						console.log('es false');
					}
				}
			}

			//If the geometry is safe, continue
			if(good){
				//Calculate the height of the current geometry for extrusion json.features[s].properties[heightAttr]
				//console.log('calculating current geometry');
				var h = heightFn(json.features[s].properties[heightAttr]);
				if(isNaN(parseFloat(json.features[s].properties[heightAttr]))){
					if(fast){
						good = false;
						console.log('es false');
					}
					h = 0;
				}
				
				if(!h || h < 0){
					if(fast){
						good = false;
						console.log('es false');
					}
					h = 0;
				}

				if(h>max){
					h = max;
				}

				//Remove all objects that have no height information for faster rendering
				if(h==0 && fast){
					good = false;
					console.log('es false');
				}
			}

			//If the geometry is still safe, continue
			if(good){
				//console.log('calculating third dimension for geometry');
				//Calculate the third dimension
				var z = ((h/max)*z_max);
				if(!z || z<1){z = 0;}
				
				//Calculate the color of the object
				//In this sample code we use a blue to red range to visualize the height of the object (blue short to red tall)
				var red = Math.round((h/max)*255.0);
				var blue = Math.round(255.0-(h/max)*255.0);
				var color = new THREE.Color("rgb("+red+",0,"+blue+")");
				//var color = new THREE.Color("rgb(0,0,255)");

				addShape( new THREE.Shape( points ), z*z_rel, color, 0, 50, 0, r, 0, 0, 1 );
			}
		   //console.log(points,h,z)
		}

		//If we have more geometries to add restart the whole loop
		setTimeout(function(){ buildShape(); }, 100);
	}else{

		//We are done building our geometry
		log("Geometry Done");
		
		//Initiate the shader
		
		var shaderMaterial = new THREE.ShaderMaterial({
			attributes: 	{},
			uniforms:		{},
			vertexShader:   THREETUT.Shaders.Lit.vertex,
		    fragmentShader: THREETUT.Shaders.Lit.fragment
		    ,side: THREE.FrontSide
		});

		
		//Initiate Material
		
		var materials = [
			new THREE.MeshLambertMaterial({vertexColors: THREE.VertexColors, color: "rgb(0.2,0.2,0.2)",ambient: "rgb(0.2,0.2,0.2)", shininess: 1, lights:true}),
			new THREE.MeshLambertMaterial({vertexColors: THREE.VertexColors, color: "rgb(0.5,0.5,0.5)",ambient: "rgb(0.5,0.5,0.5)", shininess: 1, lights:true})
		];

		var material = new THREE.MeshFaceMaterial(materials);

		
		//Create a mesh from the geometry

		mesh = new THREE.Mesh( groupGeometry, material );

		mesh.position.set( 0,0,0 );
		//mesh.rotation.set( r, 0, 0 );
		mesh.scale.set(scale_factor * scale_x,scale_factor * scale_y, actualAmount);
		mesh.castShadow = true;
		mesh.receiveShadow = true;

		mesh.material.materials[0].needsUpdate = true;

		mesh.name = 'meshing';

		//console.log(mesh);

		scene.add( mesh );


		mesh.rotation.x = Math.PI / 2;
		mesh.rotation.y = Math.PI;

		//Too make it a little more fancy, add a directional light

		var directionalLight = new THREE.DirectionalLight(0xeeeeee, 1);
		directionalLight.position.set(0, 180,150);
		directionalLight.target = mesh;
		directionalLight.castShadow = true;
		directionalLight.shadowDarkness = 0.5;
		scene.add( directionalLight );

		//console.log(cameraTarget);

		controls = new THREE.OrbitControls( camera, renderer.domElement );
		controls.enableDamping = true;
		controls.dampingFactor = 0.25;
		controls.enableZoom = true;
		controls.target.set( mesh.position.x+cameraTarget.x, cameraTarget.y, mesh.position.z+cameraTarget.z );
		

		//Now add the renderer to the DOM

		document.body.appendChild( renderer.domElement );


		//And start animating it
		log("animate");

		animate();

		setTimeout(hide,1000);
		setTimeout(remove,2000);


		//For rotating the 3D object we use the mouse movement

		//renderer.domElement.addEventListener( 'mousemove', onDocumentMouseMove, false );

	}
}


//Adding geometries to group

function addShape( shape, extrude, color, x, y, z, rx, ry, rz, s ) {

	//Extrusion settings
	var extrudeSettings = {
		amount			: extrude*20,
		steps			: 1,
		material		: 0,
		extrudeMaterial : 1,
		bevelEnabled	: false
	};

	//Create the geometry
	var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

	//Set the color for the object
	for(var f = 0; f<geometry.faces.length; f++){
		geometry.faces[f].color.setRGB(color.r, color.g, color.b);
	}

	//Have a big amount of geometries will slow down THREE.js 
	//Instead we merge all geometries into one geometry
	groupGeometry.merge( geometry, geometry.matrix );
}

function changeView(value){
	var timeElapsed = 1000;
	if(value == 'onFloor'){
		$('body').removeClass('whitekBack');
		$('body').addClass('blackBack');
		movement({ 'x': cameraPositionSide.x, 'y': cameraPositionSide.y, 'z': cameraPositionSide.z }, camera.position, 0, timeElapsed); //camera.position.set( -24, -164, 59 );
		console.log(mesh);
		movement( { 'x': scale_factor * scale_x, 'y': scale_factor * scale_y, 'z': 0.01 }, mesh.scale, 0, timeElapsed);
		//movement( { 'opacity': 0 }, mesh.material.materials[0], 0, timeElapsed);
		setTimeout(addSpritesImages,2000);	
	}
	else if(value == 'panoramic'){
		removeLights();
		$('body').removeClass('blackBack');
		$('body').addClass('whiteBack');
		movement( { 'x': cameraPositionPan.x, 'y': cameraPositionPan.y, 'z': cameraPositionPan.z }, camera.position, 0, timeElapsed); //camera.position.set( -20, -14, 177 );
		movement( { 'x': scale_factor * scale_x, 'y': scale_factor * scale_y, 'z': actualAmount }, mesh.scale, 0, timeElapsed);
		//mesh.scale.set(scale_factor * scale_x,scale_factor * scale_y,0.5);
		//camera.position.set(camera.position.x, camera.position.y+380, camera.position.z);
	}
}

function addSpritesImages(){

	var texturesArray = ['Smoke/Plume.png','Rays/laser1.png', 'Glows/Flare5.png', 'Glows/Flare4.png', 'Glows/glow.png']

	//console.log(lightpoints, lightpoints.length);
	lightGroup.name = 'luces';

	var len = mesh.geometry.vertices.length;

	for(var a = 0; a<len; a = a+20){
		/*var xpos = Math.floor((Math.random() * 100) + 1);
		var ypos = Math.floor((Math.random() * 100) + 1);*/
		//console.log(a, lightpoints[a].x, lightpoints[a].y );

		if(texturesArray[a%3] == 'Rays/laser1.png') var particleHigh = 3;
		else var particleHigh = 1;

		var particlesize = Math.floor((Math.random() * 5) + 1);
		var particleColor = Math.floor((Math.random() * 255) + 0);
		var particleOpacity = Math.random();

		var textureGlass = THREE.ImageUtils.loadTexture( "images/particles/Static/"+texturesArray[a%3] );
		var spriteMaterialGlass = new THREE.SpriteMaterial( 
	        { map: textureGlass, color: 'rgb(255,'+particleColor+', 0)', transparent : true, opacity: particleOpacity } );
	    var spriteGlass = new THREE.Sprite( spriteMaterialGlass );
	    	spriteGlass.scale.set((particlesize/2)*3,particlesize*particleHigh,particlesize);
	    	spriteGlass.position.set( mesh.geometry.vertices[a].x*20.5, mesh.geometry.vertices[a].y*35, (particlesize/2)*particleHigh );

	    lightGroup.add(spriteGlass);
	}

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

function changeAmount(value){
	if(value == 'age') actualAmount = 0.1;
	else if(value == 'incomes') actualAmount = 0.5;
	movement( { 'x':scale_factor * scale_x, 'y': scale_factor * scale_y, 'z': actualAmount }, mesh.scale, 0, 1000);
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


//Store the current mouse position in the mouse-object

function onDocumentMouseMove( event ) {

	/*event.preventDefault();

	mouse.x = ( event.clientX / window.innerWidth ) * Math.PI*4;
	mouse.y = ( event.clientY / window.innerHeight ) * Math.PI*4;*/
}


//Apply the mouse position on x/y rotation

function render(){
	renderer.render(scene,camera);
}

function animate() {
	//console.log(camera.position);

	//Animate at 30fs framerate

	/*setTimeout( function() {
		requestAnimationFrame( animate );
	}, 1000/30 );*/

	requestAnimationFrame( animate );

	//Animate and render the mesh

	//mesh.rotation.x = mouse.y;
	//mesh.rotation.y = mouse.x;

	//Animate the height of the objections

	/*if(animateHeight){
		heightScaler += 0.001;
	}*/

	//mesh.scale.set(scale_factor * scale_x,scale_factor * scale_y,heightScaler);


	//Render the scene
    
    TWEEN.update();

	render();
	update();

	if(controls) controls.update( clock.getDelta() );
}

function update(){

}


//This is an experimental feature that allows us to save the generated mesh in an JSON-file, so we can skip the parsing and directly load the mesh
//So far the loading is not really working as expected

function saveObj(){
	var j = JSON.stringify(mesh.toJSON());
	var fcount = 100;
	for(var f = 0; f<fcount; f++){
		var ff = f;
		if(f<10){ff = "0"+f;}
		$.ajax({
			type: "POST",
			url: "save.php",
			data: {content: j.substring((j.length/fcount)*f,(j.length/fcount)*(f+1)), name:"model_"+ff+".json"}
		});
	}
}