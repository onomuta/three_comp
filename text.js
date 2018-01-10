Math.degrees = function(radian){
  if(isNaN(radian)){
     return NaN;
  }
  return radian * 360/(2*Math.PI);
}

function init() {
  var scene = new THREE.Scene();
  var frame = 0;
  var canvasWidth = 1280;
  var canvasHeight = 720;
  var width  = canvasWidth;
  var height = canvasHeight;

  var time = 0;
  var duration = 100;

  var exportFlg = false;

  // GUI ===============================================================
    var ctrl = new function() {
      this.TEXT = "ELEMOG";   
      this.size = 1.5;
      this.posX = -82;
      this.color = "#ff0033";
      this.color2 = "#ffffff";
      this.duration = 180;

      this.export = function() { exportFlg = true};
    };

    var gui = new dat.GUI();

    var controllerTEXT = gui.add(ctrl, 'TEXT');
    gui.add(ctrl, 'posX', -100, 0);

    gui.add(ctrl, 'size', 0.5, 2);
    var controllerCOLOR1 = gui.addColor(ctrl, 'color');
    var controllerCOLOR2 = gui.addColor(ctrl, 'color2');
    // gui.add(ctrl, 'speed', 0, 2);
    gui.add(ctrl, 'duration', 10, 600);

    gui.add(ctrl, 'export');

    
    textMaterial1 = new THREE.MeshStandardMaterial( { color: ctrl.color } );
    textMaterial2 = new THREE.MeshStandardMaterial( { color: ctrl.color2 } );
    textMaterials = [textMaterial1,textMaterial2];

  // Renderer =========================================================
    var renderer = new THREE.WebGLRenderer({
      canvas:document.getElementById('myCanvas'),
      antialias: true
    });
    renderer.setClearColor(new THREE.Color(0x000000));
    renderer.setSize(canvasWidth, canvasHeight);
    renderer.shadowMap.enabled = true;
		renderer.domElement.id = 'three';
    // document.body.appendChild( renderer.domElement );
    

    var textMaterial1 = new THREE.MeshStandardMaterial( { color: ctrl.color } );
    var textMaterial2 = new THREE.MeshStandardMaterial( { color: ctrl.color2 } );
    textMaterial1.needsUpdate = true;
    textMaterial2.needsUpdate = true;
    var textMaterials = [textMaterial1,textMaterial2];
    textMaterials.needsUpdate = true;


  // TEXTLOAD =========================================================
    // テキストロードしてから開始
    var loader = new THREE.FontLoader();
    loader.load('fonts/Fugaz_One_Regular.json', function(font){
      mainFont = font;
      textGeometry = new THREE.TextGeometry(ctrl.TEXT, {
        font: font,
        size: 20,
        height: 0.2,
        curveSegments: 8,
        bevelThickness: 2,
        bevelSize: 1,
        bevelEnabled: true
      });
            
      textMesh = new THREE.Mesh(textGeometry, textMaterials);
      textMesh.position.x = ctrl.posX;
      scene.add(textMesh);
  
      render();
    });



  // Camera ===========================================================
    var fov    = 90;
    var aspect = width / height;
    var near   = 1;
    var far    = 4000;
    var camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
    camera.position.set( 0, 0, 100 );
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    
    scene.fog = new THREE.Fog(0x000000, 0.25, 250);

  // Light =============================================================
    var topLight = new THREE.DirectionalLight(0xffffff);
    topLight.position.set(30, 30, 100);
    scene.add( topLight ); 
    
    // 部屋全体を照らすライト
    var ambient = new THREE.AmbientLight(0xFFFFFF);
    scene.add(ambient);
	

  // SNOW ============================================================================
    // snow
    var snowGeometry = new THREE.Geometry();
    var snowNum = 1000;
    var snowPoints, snowMaterial;
    var snowS = [];
    // setup
    for (let i = 0; i < snowNum; i++) {
      var snow = new THREE.Vector3();
      snow.x = THREE.Math.randFloatSpread( 300 );
      snow.y = THREE.Math.randFloatSpread( 300 );
      snow.z = THREE.Math.randFloatSpread( 300 );
      snowS[i] = Math.random() * 0.05 + 0.01;
      snowGeometry.vertices.push( snow );
    }
    snowMaterial = new THREE.PointsMaterial({
      // map: new THREE.TextureLoader().load( "https://png.icons8.com/winter/win8/50/ffffff" ),
      map: new THREE.TextureLoader().load( "https://png.icons8.com/nolan/64/000000/plus.png" ),
      size: 10,
      transparent: true,
      depthTest : false,
      blending : THREE.AdditiveBlending
    });
    snowPoints = new THREE.Points(snowGeometry, snowMaterial);
    scene.add(snowPoints);

//  TEXT==========================================

  var textGeometry;
  var textMaterials;
  var textMesh;


  var mainFont;


  function updateTxt(){
    scene.remove( textMesh );
    textGeometry.dispose();

    textGeometry = new THREE.TextGeometry(ctrl.TEXT, {
      font: mainFont,
      size: 20,
      height: 0.2,
      curveSegments: 8,
      bevelThickness: 2,
      bevelSize: 1,
      bevelEnabled: true
    });

    textMaterials = [
      new THREE.MeshStandardMaterial( { color: ctrl.color } ),
      new THREE.MeshStandardMaterial( { color: ctrl.color2} )
    ];

    textMesh = new THREE.Mesh(textGeometry, textMaterials);
    textMesh.position.x = ctrl.posX;
    scene.add(textMesh);
  }
  controllerTEXT.onChange(function(value) {
    updateTxt();
  });

  controllerCOLOR1.onChange(function(value) {
    updateTxt();
  });
  controllerCOLOR2.onChange(function(value) {
    updateTxt();
  });




  // Object ____________________________________________________

  function anim(){
    duration = ctrl.duration-1;    
    
    textMesh.position.x = ctrl.posX;
    textMesh.scale.set(ctrl.size,ctrl.size,ctrl.size);
    textMesh.position.y = (ctrl.size * -10) +3;

    scene.rotation.y = Math.tween.Cubic.easeInOut(time,0,1,1) * ( Math.PI / 180 ) *360 ;    


    camera.position.x = Math.sin(time * 6.25)* 4;
    camera.position.y = Math.sin(time * 6.25)* 5;
  }


  var exportStart = false;

  // Run ________________________________________________________
  function render(){
    
    if(exportFlg == true){
      if(exportStart == false){
        frame = 0;
        exportStart = true;
      }
    }

    if(time >= 1){
      frame = 0;
      exportFlg = false;
      exportStart = false;
    }

    time = (frame / duration);  
    
    anim();    
    renderer.render(scene, camera);
    saveFrame();

    frame++;
    
    


    requestAnimationFrame(render);     
  };

  //保存処理 ______________________________________________________
  var renderA = document.createElement('a');
  // 生成する文字列に含める文字セット
  var c = "abcdefghijklmnopqrstuvwxyz";
  var cl = c.length;
  var r = "";
  for(var i=0; i<4; i++){
    r += c[Math.floor(Math.random()*cl)];
  }
  function saveFrame(){
    if(exportFlg == true){
      var canvas  = document.getElementById('three');
      renderA.href = canvas.toDataURL();
      renderA.download = r + '_' + ( '000' + frame ).slice( -4 ) + '.png';
      renderA.click();
    }
  }


  


}
window.onload = init();