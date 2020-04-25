//import {Transform} from './transform'
import {Renderer} from './renderer';
import {Camera} from './camera';
import {Scene} from './scene';
import {Mesh} from './mesh';

class App {
  constructor (){
    console.log('this is App constructor!');
    console.log(Renderer)
    this.canvas = document.getElementById('canvas');
    this.renderer = new Renderer(this.canvas);
    this.scene = new Scene();

    this.cameraFov = 60;
    this.nearPlane = 1;
    this.farPlane = 100;
    this.aspect = 1;
    this.camera = new Camera(this.cameraFov, this.aspect, this.nearPlane, this.farPlane);
    this.vextexArray = [  //0,1,2   0,2,3
      new THREE.Vector4(-0.5, -0.5, 0, 1),
      new THREE.Vector4(-0.5, 0.5, 0, 1),
      new THREE.Vector4(0.5, 0.5, 0, 1),

      new THREE.Vector4(-0.5, -0.5, 0, 1),
      new THREE.Vector4(0.5, 0.5, 0, 1),
      new THREE.Vector4(0.5, -0.5, 0, 1),
    ];


    const planeMesh = new Mesh();
    planeMesh.setVerticesList(this.vextexArray);
    this.scene.add(planeMesh);

    this.renderer.render(this.scene, this.camera);

   
  }

  run() {
   
  }

  
}

const app = new App();
app.run();