
import { Mesh } from './mesh'
import {Vertex} from './vertex'
class CubeMesh extends Mesh {
  constructor(position, quaternion, scale) {
    super(position, quaternion, scale);

    for(let i=0; i<36;i++) {
      this.vertIndices.push(i);
    }
    this.vertList = [

      //正面 //1,2,3 3,4,1
      new THREE.Vector4(-0.5, -0.5, 0.5, 1),
      new THREE.Vector4(-0.5, 0.5, 0.5, 1),
      new THREE.Vector4(0.5, 0.5, 0.5, 1),

      new THREE.Vector4(0.5, 0.5, 0.5, 1),
      new THREE.Vector4(0.5, -0.5, 0.5, 1),
      new THREE.Vector4(-0.5, -0.5, 0.5, 1),

      //反面
      new THREE.Vector4(-0.5, -0.5, -0.5, 1),
      new THREE.Vector4(-0.5, 0.5, -0.5, 1),
      new THREE.Vector4(0.5, 0.5, -0.5, 1),

      new THREE.Vector4(0.5, 0.5, -0.5, 1),
      new THREE.Vector4(0.5, -0.5, -0.5, 1),
      new THREE.Vector4(-0.5, -0.5, -0.5, 1),


      //右面
      new THREE.Vector4(0.5, -0.5, 0.5, 1),
      new THREE.Vector4(0.5, 0.5, 0.5, 1),
      new THREE.Vector4(0.5, 0.5, -0.5, 1),

      new THREE.Vector4(0.5, 0.5, -0.5, 1),
      new THREE.Vector4(0.5, -0.5, -0.5, 1),
      new THREE.Vector4(0.5, -0.5, 0.5, 1),

      //左面
      new THREE.Vector4(-0.5, -0.5, 0.5, 1),
      new THREE.Vector4(-0.5, 0.5, 0.5, 1),
      new THREE.Vector4(-0.5, 0.5, -0.5, 1),

      new THREE.Vector4(-0.5, 0.5, -0.5, 1),
      new THREE.Vector4(-0.5, -0.5, -0.5, 1),
      new THREE.Vector4(-0.5, -0.5, 0.5, 1),

      //上面
      new THREE.Vector4(-0.5, 0.5, -0.5, 1),
      new THREE.Vector4(-0.5, 0.5, 0.5, 1),
      new THREE.Vector4(0.5, 0.5, 0.5, 1),

      new THREE.Vector4(0.5, 0.5, 0.5, 1),
      new THREE.Vector4(0.5, 0.5, -0.5, 1),
      new THREE.Vector4(-0.5, 0.5, -0.5, 1),


       //下面
       new THREE.Vector4(-0.5, -0.5, -0.5, 1),
       new THREE.Vector4(-0.5, -0.5, 0.5, 1),
       new THREE.Vector4(0.5, -0.5, 0.5, 1),
 
       new THREE.Vector4(0.5, -0.5, 0.5, 1),
       new THREE.Vector4(0.5, -0.5, -0.5, 1),
       new THREE.Vector4(-0.5, -0.5, -0.5, 1),
 

    ];

    this.vertexColor = [
      //正面 //1,2,3 3,4,1
      new THREE.Vector3(255, 255, 255),  //0
      new THREE.Vector3(255, 255, 255),  //1
      new THREE.Vector3(255, 255, 255),  //2

      new THREE.Vector3(255, 0, 0), //3
      new THREE.Vector3(0, 0, 255),   //4
      new THREE.Vector3(0, 255, 0),    //5

      //反面
      new THREE.Vector3(255, 0, 0),  //0
      new THREE.Vector3(255, 0, 0),  //1
      new THREE.Vector3(255, 0, 0),  //2

      new THREE.Vector3(255, 0, 0), //3
      new THREE.Vector3(0, 0, 255),   //4
      new THREE.Vector3(0, 255, 0),    //5


       // 右面
       new THREE.Vector3(255, 255, 0),  //0
       new THREE.Vector3(255, 255, 0),  //1
       new THREE.Vector3(255, 255, 0),  //2
 
       new THREE.Vector3(255, 255, 0), //3
       new THREE.Vector3(255, 255, 0),  //4
       new THREE.Vector3(255, 255, 0),    //5


        // 左面
        new THREE.Vector3(0, 255, 255),  //0
        new THREE.Vector3(0, 255, 255),  //1
        new THREE.Vector3(0, 255, 255),  //2
  
        new THREE.Vector3(0, 255, 255), //3
        new THREE.Vector3(0, 255, 255),  //4
        new THREE.Vector3(0, 255, 255),   //5


         // 上面
         new THREE.Vector3(0, 255, 255),  //0
         new THREE.Vector3(0, 255, 100),  //1
         new THREE.Vector3(0, 255, 255),  //2
   
         new THREE.Vector3(0, 255, 255), //3
         new THREE.Vector3(0, 40, 255),  //4
         new THREE.Vector3(0, 255, 255), //5

         //下面
         new THREE.Vector3(0, 255, 255),  //0
         new THREE.Vector3(0, 80, 255),  //1
         new THREE.Vector3(0, 255, 30),  //2
   
         new THREE.Vector3(0, 255, 255), //3
         new THREE.Vector3(0, 90, 255),  //4
         new THREE.Vector3(0, 255, 40),   //5
 

    ];
    super.calculateNormals();
    super.generateMesh();
    console.log(this);
  }
}

export { CubeMesh }