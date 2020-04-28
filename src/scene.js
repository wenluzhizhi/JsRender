class Scene {
  constructor() {
    this.meshList = [];
    this.ambientColor = new THREE.Vector3(255, 255, 255);
    this.ambientatend = 0.2;
    this.directionColor = new THREE.Vector3(255,0, 0);
    this.directionOri = new THREE.Vector3(0.2, 1, 0);
    this.directionOri.normalize();
  }

  add (mesh) {
   this.meshList.push(mesh);
  }
}

export {Scene};