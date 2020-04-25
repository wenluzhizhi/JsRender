//import {Transform} from './transform'
import {Renderer} from './renderer';
import {Camera} from './camera';
import {Scene} from './scene';
import {Mesh} from './mesh';
import {CameraController} from './cameracontroller'

class App {
  constructor (){
    console.log('this is App constructor!');
    this.canvas = document.getElementById('canvas');
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

    this.planePosition = new THREE.Vector3(0, 0, 0);
    this.planeQuaternion = new THREE.Quaternion();
    this.planeQuaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), 0);
    this.planeMesh = new Mesh(this.planePosition, this.planeQuaternion);
    
    this.planeMesh.setVerticesList(this.vextexArray);
    this.scene.add(this.planeMesh);

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
    document.ontouchstart =document.onmousedown = (event)=> {

    }
    document.ontouchmove =document.onmousemove = (event)=> {

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