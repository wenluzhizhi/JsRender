class Mesh {
   constructor(position, quaternion, scale) {
    this.position = position;
    this.quaternion = quaternion;
    this.vertexColor = [];
    this.modelMatrix = new THREE.Matrix4();
    this.updateModelMatrix();
   }

   setVerticesList(list, colorList) {
     this.vertList = list;
     this.vertexColor = colorList;
     this.vertIndices = [];
   }

   updateModelMatrix () {
    this.modelMatrix.compose(this.position, this.quaternion, new THREE.Vector3(1, 1, 1));
  }
}
export {Mesh}