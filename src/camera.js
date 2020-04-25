class Camera {


  constructor(fov, aspect, nearPlane, farPlane) {
    this.position = new THREE.Vector3(0, 0, 1.5);
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


  updateProjectMatrix() {
    this.projectionMatrix = new THREE.Matrix4();
    const fovRad = THREE.Math.degToRad(this.fov);
    const cotFov = -1.0 / Math.tan(fovRad / 2.0);
    console.log('----fovRad----')
    console.log(cotFov);
    const p = (this.nearPlane + this.farPlane) / (this.nearPlane - this.farPlane);
    const q = (this.farPlane + p * this.farPlane) * -1;
    console.log(p);
    console.log(q);
    this.projectionMatrix.set( // 行优先
      cotFov / this.aspect, 0, 0, 0,
      0, cotFov, 0, 0,
      0, 0, p, q,
      0, 0, 1, 0,
    );
    //console.log(rojectionMatrix);
    return;
    const camera = new THREE.PerspectiveCamera(this.cameraFov, this.aspect, this.nearPlane, this.farPlane);
    let matrix = camera.projectionMatrix.clone();
    //console.log(matrix);
    return matrix;
  }

}

export { Camera };