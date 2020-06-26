class CameraController {



  constructor(camere, canvas) {
    this.camera = camere;
    this.isMoving = false;
    this.canvasWidth = canvas.width;
    this.canvasHeight = canvas.height;
    this.mosueStartPos = new THREE.Vector2(0, 0);
    canvas.ontouchstart = canvas.onmousedown = (event)=> {
      this.isMoving = true;
      const cx = event.clientX || event.touches[0].clientX;
      const cy = event.clientY  || event.touches[0].clientY;
      this.mosueStartPos.set(cx, cy);
    }
    canvas.ontouchmove = canvas.onmousemove = (event)=> {
      if(this.isMoving) {
        const cx = event.clientX || event.touches[0].clientX;
        const cy = event.clientY  || event.touches[0].clientY;
        const offsetPos = new THREE.Vector2(cx - this.mosueStartPos.x,
           cy - this.mosueStartPos.y);
        this.rotateCamera(offsetPos.multiplyScalar(3));
        this.mosueStartPos.set(cx, cy);
      }
    }
    canvas.ontouchend = canvas.onmouseup = (event)=> {
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
    //console.log(this.camera.position);
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