//1//

//
// VARIABLES
// 
var myScene1,
myCamera1,
myRenderer1,
controls1,
myMesh1,
myLight1,
binary1,
myGeom1,
gl1; // to pass onto gpgpu
//
var myScene2,
myCamera2,
myRenderer2,
controls2,
myLight2,
myMesh2,
binary2;
var stlLoader = new THREE.STLLoader();

//
var fov =30;
// NProgress.configure({ showSpinner: false });
// NProgress.configure({ trickle: true });
NProgress.configure({ showBar: false });

var myVer1 = [];
var myVer2 = [];

// PROJECT
// var projector = new THREE.Projector();
var mouse = { x: 0, y: 0 };

//
//
//
var container1 = document.getElementById("container1");
var container2 = document.getElementById("container2");

var firstStl1 = true ; // WITHIN THE SAME CONTAINER
var firstStl2 = true ; // WITHIN THE SAME CONTAINER

//
// INITIATE THREEJS
//
initiateScene1();
initiateScene2();



//
// RENDER FUNC
//
function render(){
        myRenderer1.render(myScene1,myCamera1);
        controls1.update();
        myLight1.position.copy( myCamera1.position );
        myRenderer2.render(myScene2,myCamera2);
        controls2.update();
        myLight2.position.copy( myCamera2.position );
        requestAnimationFrame(render);
}



//
// LOAD STL FIRST TIME
//
function loadSTL(filePath, myContainer){

    var windowContainer = document.getElementById(myContainer);

    // OBJECT
    // load stl model
    if(myContainer == "container1"){

        console.log("it choose one");
        // RESIZE
        $(window).resize(function () {
            width=$("#" + myContainer).width();
            height=$("#" + myContainer).height();

            myCamera1.aspect = width/height;
            myCamera1.updateProjectionMatrix();

            myRenderer1.setSize( width, height );

        });


        stlLoader.load( filePath, createScene1 ); 
        firstStl1 = false; 
        myRenderer1.setSize( $("#" + myContainer).innerWidth() , $("#" + myContainer).innerHeight() );
        windowContainer.appendChild(myRenderer1.domElement);
        myRenderer1.setClearColor( 0xDDFDFDF , 1 );
        render();
    }
    else {

        console.log("it choose two");
        // RESIZE
        $(window).resize(function () {
            width=$("#" + myContainer).innerWidth();
            height=$("#" + myContainer).innerHeight();

            myCamera2.aspect = width/height;
            myCamera2.updateProjectionMatrix();

            myRenderer2.setSize( width, height );

        });

        stlLoader.load( filePath, createScene2);
        firstStl2 = false;
        myRenderer2.setSize( $("#" + myContainer).innerWidth() , $("#" + myContainer).innerHeight() );
        windowContainer.appendChild(myRenderer2.domElement);
        myRenderer2.setClearColor( 0xDDFDFDF , 1 );
        render();
    }
     


}

//
// LOAD STL SUBSEQUENT TIMES
//    
function loadAnotherSTL(filePath, myContainer){


    if(myContainer == "container1"){
        // REMOVE LAST MESH FROM SCENE
        myScene1.remove(myScene1.children[1]);
        // LOAD NEW MESH
        stlLoader.load( filePath, createScene1);
        render();
    }
    else {
        // REMOVE LAST MESH FROM SCENE
        myScene2.remove(myScene2.children[1]);
        // LOAD NEW MESH
        stlLoader.load( filePath, createScene2);
        render();
    }



}



function gotSTL(){

    if(myMesh1 != undefined && myMesh2  != undefined){
        console.log("both meshes loaded");
        // add prompt at container1
        $("#container1").css('cursor' , 'crosshair');
        document.getElementById('prompt1').innerHTML =  '<hr id="con1line1"> <p id = "prompt1text" > double click to pick 3 feature points </p> <hr id="con1line2">' ;
    }

}






/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



if (window.File && window.FileReader && window.FileList && window.Blob) {
  console.log("file api is supported");
} else {
  alert('The File APIs are not fully supported in this browser.');
}



// Setup the dnd listeners.
// CONTAINER 1
container1.addEventListener('dragover', handleDragOver, false);
container1.addEventListener('drop', handleFileSelect1, false);
// CONTAINER 2
container2.addEventListener('dragover', handleDragOver, false);
container2.addEventListener('drop', handleFileSelect2, false);


// BOTH

function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}

// CONTAINER 1


function updateProgress(evt){
    if(evt.lengthComputable){
        var value = evt.loaded / evt.total;
        NProgress.set(value);
        console.log(value);
    }
}


function handleFileSelect1(evt) {

    // remove the icon
    $('#con1Logo').remove();

    //CHANGE PROGRESS BAR
    NProgress.configure({ parent: '#container1' });
    NProgress.start();

    evt.stopPropagation();
    evt.preventDefault();

    var myFiles = evt.dataTransfer.files; // FileList object.

    var reader = new FileReader();
    
    reader.readAsDataURL(myFiles[0]);

    reader.onprogress = updateProgress;

    reader.onload = function(e) {
        // get file content
        binary1 = e.target.result;

        if (firstStl1){
            loadSTL(binary1, "container1");
            console.log("1 stl loaded"); 
        }
        else{
            loadAnotherSTL(binary1, "container1");
            console.log("1 another stl loaded"); 
        }


    }

    // LIST NAME
    document.getElementById('text1a').style.left = "-3px"; 
    document.getElementById('text1a').style.backgroundColor = "white";     
    document.getElementById('text1a').innerHTML = decodeURI( escape(myFiles[0].name) )  ;

}

// CONTAINER 2

function handleFileSelect2(evt) {

    // remove the icon
    $('#con2Logo').remove();

    //CHANGE PROGRESS BAR
    NProgress.configure({ parent: '#container2' });
    NProgress.start();

    evt.stopPropagation();
    evt.preventDefault();

    var myFiles = evt.dataTransfer.files; // FileList object.

    var reader = new FileReader();
    reader.readAsDataURL(myFiles[0]);

    reader.onprogress = updateProgress;

    reader.onload = function(e) {
        // get file content
        binary2 = e.target.result;

        if (firstStl2){
            loadSTL(binary2, "container2");
            console.log("2 stl loaded"); 
        }
        else{
            loadAnotherSTL(binary2, "container2");
            console.log("2 another stl loaded"); 
        }
    }

    // LIST NAME
    document.getElementById('text2a').style.left = "-3px"; 
    document.getElementById('text2a').style.backgroundColor = "white";   
    document.getElementById('text2a').innerHTML = decodeURI( escape(myFiles[0].name) )  ;


}

//////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//
// PREVENT FILES BEING DOWNLOADED
//
window.addEventListener("dragover",function(e){
  e = e || event;
  e.preventDefault();
},false);
window.addEventListener("drop",function(e){
  e = e || event;
  e.preventDefault();
},false);

//
// CREATE SCENE 1
//
function initiateScene1(){

    // SCENE
    myScene1 = new THREE.Scene();
    // CAMERA
    myCamera1 = new THREE.PerspectiveCamera(fov,window.innerWidth / window.innerHeight,1,10000);
    // RENDER
    myRenderer1 = new THREE.WebGLRenderer();
    gl1 = myRenderer1.context;
    // DUMMY POSITION
    myCamera1.target = new THREE.Vector3(0,0,0);
    myCamera1.position.set(-8.0, -30, 9);
    myScene1.add(myCamera1);
    // LIGHT
    var light = new THREE.AmbientLight( 0xFFFFFF, 0.3); // soft white light
    myScene1.add( light );

    // add directional 
    myLight1 = new THREE.DirectionalLight( 0xffffff, 0.5 );
    myScene1.add(myLight1);

    // CONTROL
    controls1 = new THREE.TrackballControls( myCamera1, container1);
    controls1.rotateSpeed = 1.0;
    controls1.zoomSpeed = 1.2;
    controls1.panSpeed = 0.8;
    controls1.noZoom = false;
    controls1.noPan = false;
    controls1.staticMoving = false;
    controls1.dynamicDampingFactor = 0.15;
    controls1.keys = [ 65, 83, 68 ];

}


//
// CREATE SCENE 1
//
function initiateScene2(){

    // SCENE
    myScene2 = new THREE.Scene();
    // CAMERA
    myCamera2 = new THREE.PerspectiveCamera(fov,window.innerWidth / window.innerHeight,1,10000);
    myRenderer2 = new THREE.WebGLRenderer();
    // DUMMY POSITION
    myCamera2.target = new THREE.Vector3(0,0,0);
    myCamera2.position.set(-8.0, -30, 9);
    myScene2.add(myCamera2);
    // LIGHT
    var light = new THREE.AmbientLight( 0xFFFFFF, 0.3); // soft white light
    myScene2.add( light );

    // add directional 
    myLight2 = new THREE.DirectionalLight( 0xffffff, 0.5 );
    myScene2.add(myLight2);

    // CONTROL
    controls2 = new THREE.TrackballControls( myCamera2 , container2);
    controls2.rotateSpeed = 1.0;
    controls2.zoomSpeed = 1.2;
    controls2.panSpeed = 0.8;
    controls2.noZoom = false;
    controls2.noPan = false;
    controls2.staticMoving = false;
    controls2.dynamicDampingFactor = 0.15;
    controls2.keys = [ 65, 83, 68 ];

}

//
// CREATE SCENE FUNC AND ADJUST CAMERA
//
function createScene1( geometry, materials ) {
    myGeom1 = geometry; 
    myMesh1 = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( {color: 0xcab590 } )  );  // //wireframe: true
    
    myScene1.add(myMesh1); 


    //
    // CREATE BOUNDING BOX
    myMesh1.geometry.computeBoundingBox();
    var boundingBox1 = myMesh1.geometry.boundingBox;

    // FIX CAMERA
    var myX1= (boundingBox1.max.x + boundingBox1.min.x) / 2
    var myY1= (boundingBox1.max.y + boundingBox1.min.y) / 2
    var myZ1= (boundingBox1.max.z + boundingBox1.min.z) / 2

    // FIX TARGET
    myCamera1.target = new THREE.Vector3(myX1,myY1,myZ1);

    // SET POSITION
    myCamera1.position.set(boundingBox1.max.x, boundingBox1.max.y, boundingBox1.max.z);

    // FIX ROTATION 
    myCamera1.updateProjectionMatrix();

    // FIX CONTROLS
    controls1.target.set( Math.round(myX1) , Math.round(myY1) , Math.round(myZ1) );



    //
    gotSTL();

    //change cursor
    $("#container1").css('cursor' , 'url("img/rotate32.png"), auto');

}

function createScene2( geometry, materials ) {
    myMesh2 = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( {color: 0x82a8a9 } )  );
    myScene2.add(myMesh2); 
    //
    // CREATE BOUNDING BOX
    myMesh2.geometry.computeBoundingBox();
    var boundingBox2 = myMesh2.geometry.boundingBox;
    // FIX CAMERA
    var myX2= (boundingBox2.max.x + boundingBox2.min.x) / 2
    var myY2= (boundingBox2.max.y + boundingBox2.min.y) / 2
    var myZ2= (boundingBox2.max.z + boundingBox2.min.z) / 2

    // FIX TARGET
    myCamera2.target = new THREE.Vector3(myX2,myY2,myZ2);

    // SET POSITION
    myCamera2.position.set(boundingBox2.max.x, boundingBox2.max.y, boundingBox2.max.z);

    // FIX ROTATION 
    myCamera2.updateProjectionMatrix();

    // FIX CONTROLS
    controls2.target.set( Math.round(myX2) , Math.round(myY2) , Math.round(myZ2) );

    //
    gotSTL();

    //change cursor
    $("#container2").css('cursor' , 'url("img/rotate32.png"), auto');
}



