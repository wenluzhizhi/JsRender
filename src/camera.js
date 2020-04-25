class Camera {


  constructor(fov, aspect, nearPlane, farPlane) {
    this.position = new THREE.Vector3(0, 0,   0.6);
    this.quaternion = new THREE.Quaternion();
    this.quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0.0);
    this.fov = fov;
    this.nearPlane = nearPlane;
    this.farPlane = farPlane;
    this.aspect = aspect;
    this.udpateViewMatrix();
    this.updateProjectMatrix();
  }

  udpateViewMatrix() {
    this.cameraMatrix = new THREE.Matrix4();
    this.cameraMatrix.compose(this.position, this.quaternion, new THREE.Vector3(1, 1, 1));
    this.viewMatrix = new THREE.Matrix4();
    this.viewMatrix.getInverse(this.cameraMatrix);
  }


  setCameraMatrix(newCameraMatrix) {
    this.cameraMatrix.copy(newCameraMatrix);
    let newScale = new THREE.Vector3(1, 1, 1);
    this.cameraMatrix.decompose(this.position, this.quaternion, newScale);
    this.udpateViewMatrix();
  }


  updateProjectMatrix() {
    this.projectionMatrix = new THREE.Matrix4();
    this.projectionMatrix2 = new THREE.Matrix4();
    const fovRad = THREE.Math.degToRad(this.fov);
    const cotFov = -1.0 / Math.tan(fovRad / 2.0);
    const p = (this.nearPlane + this.farPlane) / (this.nearPlane - this.farPlane);
    const q = (this.farPlane + p * this.farPlane) * -1;
    this.projectionMatrix2.set( // 行优先
      -cotFov / this.aspect, 0, 0, 0,
      0, -cotFov, 0, 0,
      0, 0, p, q,
      0, 0, 1, 0,
    );
    console.log(this.projectionMatrix2);
    // return;
    const camera = new THREE.PerspectiveCamera(this.fov, this.aspect, this.nearPlane, this.farPlane);
    this.projectionMatrix  = camera.projectionMatrix.clone();
    console.log(this.projectionMatrix);
    
  }

}

export { Camera };