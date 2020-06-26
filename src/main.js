//import {Transform} from './transform'
import {Renderer} from './renderer';
import {Camera} from './camera';
import {Scene} from './scene';
import {Mesh} from './mesh';
import {CameraController} from './cameracontroller';
import {CubeMesh} from './cubemesh';

class App {
  constructor (){
    console.log('this is App constructor!');

    this.mainDiv = document.getElementById('mainDiv');
    this.canvas = document.getElementById('canvas');
    this.canvas.width = this.mainDiv.clientWidth;
    this.canvas.height = this.mainDiv.clientHeight;
    this.renderer = new Renderer(this.canvas);
    this.scene = new Scene();

    this.cameraFov = 60;
    this.nearPlane = 1;
    this.farPlane = 100;
    this.aspect = this.canvas.width / this.canvas.height;
    this.camera = new Camera(this.cameraFov, this.aspect, this.nearPlane, this.farPlane);


    this.vextexArray = [  //0,1,2   0,2,3
      new THREE.Vector4(-0.5, -0.5, 0, 1),
      new THREE.Vector4(-0.5, 0.5, 0, 1),
      new THREE.Vector4(0.5, 0.5, 0, 1),

      new THREE.Vector4(-0.5, -0.5, 0, 1),
      new THREE.Vector4(0.5, 0.5, 0, 1),
      new THREE.Vector4(0.5, -0.5, 0, 1),
    ];


    this.vextexColorArray = [
      new THREE.Vector3(255, 0, 0),  //0
      new THREE.Vector3(0, 255, 0),  //1
      new THREE.Vector3(0, 0, 255),  //2

      new THREE.Vector3(255, 0, 0), //3
      new THREE.Vector3(0, 0, 255),   //4
      new THREE.Vector3(0, 255, 0)    //5
    ];


    this.planePosition = new THREE.Vector3(0, 0, 0);
    this.planeQuaternion = new THREE.Quaternion();
    this.planeQuaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), 0);
    this.planeMesh = new Mesh(this.planePosition, this.planeQuaternion);
    
    // this.planeMesh.setVerticesList(this.vextexArray, this.vextexColorArray);
    // this.scene.add(this.planeMesh);

    this.cubeMesh = new CubeMesh(this.planePosition, this.planeQuaternion);
    this.scene.add(this.cubeMesh);

    console.log(this.cubeMesh);


    this.renderer.render(this.scene, this.camera);

    this.addEvent();
    this.rotValue = 0.0;

    this.stats = new Stats();
    this.stats.domElement.style.position = 'fixed';
    this.stats.domElement.style.top = '50px';
    document.body.appendChild(this.stats.domElement);

    this.controls = new CameraController(this.camera, this.canvas);

  }


  addEvent() {
    document.onkeydown = (event)=> {
      if(event.keyCode == 65) {
        const lightDir = this.scene.directionOri;
        lightDir.applyAxisAngle(new THREE.Vector3(1, 0, 0), 0.01);
      }
      if(event.keyCode == 66) {
        const lightDir = this.scene.directionOri;
        lightDir.applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.01);
      }
      if(event.keyCode == 67) {
        const lightDir = this.scene.directionOri;
        lightDir.applyAxisAngle(new THREE.Vector3(0, 0, 1), 0.01);
      }
    }
  }

  run() {
    this.stats.update();
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(()=>{
      this.run();
    });
  }
}

const app = new App();
app.run();