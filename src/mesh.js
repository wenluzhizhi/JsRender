class Mesh {
   constructor(position, quaternion, scale) {
    this.position = position;
    this.quaternion = quaternion;
    this.vertexColor = [];
    this.vertIndices = [];
    this.normalList = [];
    this.modelMatrix = new THREE.Matrix4();
    this.updateModelMatrix();
   }

   setVerticesList(list, colorList) {
     this.vertList = list;
     this.vertexColor = colorList;
    
   }

   updateModelMatrix () {
    this.modelMatrix.compose(this.position, this.quaternion, new THREE.Vector3(1, 1, 1));
  }

  calculateNormals() {
    const count = this.vertIndices.length;
    for(let i = 0; i < count; i+=3) {
       const d1 = this.vertList[this.vertIndices[i]];
       const d2 = this.vertList[this.vertIndices[i+1]];
       const d3 = this.vertList[this.vertIndices[i+2]];
       
       const dot1 = new THREE.Vector3(d1.x, d1.y, d1.z);
       const dot2 = new THREE.Vector3(d2.x ,d2.y ,d2.z);
       const dot3 = new THREE.Vector3(d3.x, d3.y, d3.z);



       const normalDot1 = dot2.clone().sub(dot1).cross(dot3.clone().sub(dot1));
       const normalDot2 = dot1.clone().sub(dot2).cross(dot3.clone().sub(dot2));
       const normalDot3 = dot1.clone().sub(dot3).cross(dot2.clone().sub(dot3));
       this.normalList.push(normalDot1);
       this.normalList.push(normalDot2);
       this.normalList.push(normalDot3);
    }
  }
}
export {Mesh}