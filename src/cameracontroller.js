class CameraController {



  constructor(camere, canvas) {
    this.camera = camere;
    this.isMoving = false;
    this.canvasWidth = canvas.width;
    this.canvasHeight = canvas.height;
    this.mosueStartPos = new THREE.Vector2(0, 0);
    canvas.ontouchstart =document.onmousedown = (event)=> {
      this.isMoving = true;
      this.mosueStartPos.set(event.touches[0].clientX, event.touches[0].clientY);
    }
    canvas.ontouchmove =document.onmousemove = (event)=> {
      if(this.isMoving) {
        const offsetPos = new THREE.Vector2(event.touches[0].clientX - this.mosueStartPos.x,
           event.touches[0].clientY - this.mosueStartPos.y);
        this.rotateCamera(offsetPos);
        this.mosueStartPos.set(event.touches[0].clientX, event.touches[0].clientY);
      }
    }
    canvas.ontouchend =document.onmouseup = (event)=> {
      this.isMoving = false;
    }
    
    canvas.onmousewheel = canvas.onmousewheel = (e)=>{
      const delta = e.wheelDelta || e.detail;
      this.moveCamera(delta);
    };

  }
  
  moveCamera(delta) {
    let moveMatrix = new THREE.Matrix4();
    moveMatrix.makeTranslation(0, 0, delta * 0.001);
    const cameraMatrix = this.camera.cameraMatrix.clone();
    cameraMatrix.multiply(moveMatrix);
    this.camera.setCameraMatrix(cameraMatrix);
  }

  rotateCamera(offsetPos) {
   
    const rotx = offsetPos.x / this.canvasWidth;
    const roty = offsetPos.y / this.canvasHeight;


    const cameraMatrix = this.camera.cameraMatrix;

    const up = new THREE.Vector3(cameraMatrix.elements[4], cameraMatrix.elements[5], cameraMatrix.elements[6]);
    const left = new THREE.Vector3(cameraMatrix.elements[0], cameraMatrix.elements[1], cameraMatrix.elements[2]);



    let rotxMatrix = new THREE.Matrix4();
    let rotxMatriy = new THREE.Matrix4();
    rotxMatriy.makeRotationAxis(left, -roty);
    rotxMatrix.makeRotationAxis(up, -rotx);
    rotxMatriy.multiply(rotxMatrix.multiply(cameraMatrix));
    this.camera.setCameraMatrix(rotxMatriy);
  }

  
}

export {CameraController}