class Mesh{
   constructor(position, quaternion, scale) {
    this.position = new THREE.Vector3(0, 0, 0);
    this.quaternion = new THREE.Quaternion();
    this.quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), 0);
    this.modelMatrix = new THREE.Matrix4();
    this.updateModelMatrix();
   }

   setVerticesList(list) {
     this.vertList = list;
   }

   updateModelMatrix () {
    this.modelMatrix.compose(this.position, this.quaternion, new THREE.Vector3(1, 1, 1));
  }
}
export {Mesh}