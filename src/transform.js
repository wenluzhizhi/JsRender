/**
 * 将一组顶点（局部坐标）根据传入的摄像机参数映射到屏幕上
 */
class Transform {

  constructor() {
    // 正方形片顶点数组
    this.vextexArray = [
      new THREE.Vector4(-0.5, -0.5, 0, 1),
      new THREE.Vector4(-0.5, 0.5, 0, 1),
      new THREE.Vector4(0.5, 0.5, 0, 1),
      new THREE.Vector4(0.5, -0.5, 0, 1)
    ];
    // 正方形片的世界坐标
    this.planePos = new THREE.Vector3(0, 0, 0);
    this.planeQua = new THREE.Quaternion();
    this.planeQua.setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI /4);

    //摄像机的位置和旋转
    this.cameraPos = new THREE.Vector3(0, 0, 1.5);
    this.cameraQua = new THREE.Quaternion();
    this.cameraQua.setFromAxisAngle(new THREE.Vector3(0, 1, 0), 0.0);

    //构建投影矩阵需要的参数
    this.cameraFov = 60;
    this.nearPlane = 1;
    this.farPlane = 100;
    this.aspect = 1;

  }


  transform(myImageData, width, height) {
    console.log(width*height*4);
    //构建局部到世界的变换矩阵
    let modelMatrix = new THREE.Matrix4();
    modelMatrix.compose(this.planePos, this.planeQua, new THREE.Vector3(1, 1, 1));

    //构建世界坐标到摄像机坐标的变换
    let cameraMatrix = new THREE.Matrix4();
    cameraMatrix.compose(this.cameraPos, this.cameraQua, new THREE.Vector3(1, 1, 1));
    let viewMatrix = new THREE.Matrix4();
    viewMatrix.getInverse(cameraMatrix);

    //构建投影矩阵
    this.aspect = width / height;
    console.log(this.aspect);
    let projectionMatrix = this.createProjectMatrix();
    

    for (let p of this.vextexArray) {
      const worldPos = p.clone().applyMatrix4(modelMatrix);
      const cameraPos = worldPos.applyMatrix4(viewMatrix);
      const projectionPos = cameraPos.applyMatrix4(projectionMatrix);
      

      //将投影变换后的坐标变换到到NDC空间
      projectionPos.x = projectionPos.x / projectionPos.w;
      projectionPos.y = projectionPos.y / projectionPos.w;
      projectionPos.z = projectionPos.z / projectionPos.w;
      projectionPos.w = 1.0;
      
      const screenPos = new THREE.Vector3();
      screenPos.x = parseInt((projectionPos.x + 1) / 2 * width);
      screenPos.y = parseInt((projectionPos.y + 1) / 2 * height);
      screenPos.z = parseInt((projectionPos.z + 1) / 2);
      console.log(screenPos.x, screenPos.y);
      const dotWidth = 6 /2;
      //this.drawPoint(myImageData,screenPos.x, screenPos.y, width);
      for(let i= -dotWidth; i< dotWidth; i++) {
        for(let j=-dotWidth;j<dotWidth;j++) {
          this.drawPoint(myImageData,screenPos.x+i, screenPos.y+j, width);
        }
      }
    }
   
    

  }

  drawPoint(myImageData,x, y, width) {
    const redIndex = y * (width * 4) + x * 4;
    const greedIndex = redIndex + 1;
    const blueIndex = greedIndex + 1;
    const alphaIndex = blueIndex + 1;
    myImageData.data[alphaIndex] = 255;
    myImageData.data[redIndex] = 255;
  }

  createProjectMatrix() {
    let customProjectionMatrix = new THREE.Matrix4();
    const fovRad = THREE.Math.degToRad(this.cameraFov);
    const cotFov = -1.0 / Math.tan(fovRad / 2.0);
    console.log('----fovRad----')
    console.log(cotFov);
    const p = (this.nearPlane + this.farPlane) / (this.nearPlane - this.farPlane);
    const q = (this.farPlane + p * this.farPlane) * -1;
    console.log(p);
    console.log(q);
    customProjectionMatrix.set( // 行优先
      cotFov / this.aspect, 0, 0, 0,
      0, cotFov, 0, 0,
      0, 0, p, q,
      0, 0, 1, 0,
    );
    //console.log(customProjectionMatrix);
    return customProjectionMatrix;
    const camera = new THREE.PerspectiveCamera(this.cameraFov, this.aspect, this.nearPlane, this.farPlane);
    let matrix = camera.projectionMatrix.clone();
    //console.log(matrix);
    return matrix;
  }

  checkoutOnePointInTriangle (dotA, dotB, dotC, dotP) {
    const PA = dotP.clone().sub(dotA);
    const BA = dotB.clone().sub(dotA);
    const CA = dotC.clone().sub(dotA);

    const dotPABA = PA.dot(BA);
    const dotBABA = BA.dot(BA);
    const dotCABA = CA.dot(BA);
    const dotPACA = PA.dot(CA);
    const dotBACA = BA.dot(CA);
    const dotCACA = CA.dot(CA);

    const sd = dotBABA * dotCACA - dotCABA * dotBACA;

    const sm = dotPABA * dotCACA - dotCABA * dotPACA;

    const sn =   dotBABA * dotPACA - dotPABA * dotBACA;

    const m = sm / sd;
    const n = sn / sd;

    console.log(m, n);
  }


}

export { Transform };