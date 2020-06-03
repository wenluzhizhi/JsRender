class Renderer {
  constructor (canvs) {
    this.canvas = canvs;
    this.ctx = this.canvas.getContext('2d');
    this.canvasWidth = this.canvas.width;
    this.canvasHeight = this.canvas.height;
    this.myImageData = this.ctx.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
    this.zBuffer = [];
    this.clearBackground();
    this.screenTrigles = [];

    var img = new Image();
    img.src = './2.jpg';
    img.onload = ()=> {
      this.imgCanvas = document.getElementById('imgCanvas');
      var contextImg = this.imgCanvas.getContext('2d');
      contextImg.drawImage(img, 0, 0, 300, 227);
      this.imageDataTexture = contextImg.getImageData(0, 0, 300, 227);
      console.log(this.imageDataTexture);

      this.textureWidth = 300;
      this.textureHeight = 227;
    }

   
  }

  clearBackground () {
    let count = this.canvasHeight * this.canvasWidth;
    for (let i = 0; i < count; i++) {
      this.myImageData.data[i*4+0] = 0;
      this.myImageData.data[i*4+1] = 0;
      this.myImageData.data[i*4+2] = 0;
      this.myImageData.data[i*4+3] = 255;
    }
  }

  transformObjectToScreen (scene, camera) {
    const list = scene.meshList;
    for (let mesh of list) {
      const vertList = mesh.vertexPointList;
      for( let p of vertList) {
        const v = p.position;

        // MVP变换
        const worldPos = v.clone().applyMatrix4(mesh.modelMatrix);
        const cameraPos = worldPos.applyMatrix4(camera.viewMatrix);
        const projectionPos = cameraPos.applyMatrix4(camera.projectionMatrix);

        // 透视除法 得到NDC空间坐标
        projectionPos.x = projectionPos.x / projectionPos.w;
        projectionPos.y = projectionPos.y / projectionPos.w;
        projectionPos.z = projectionPos.z / projectionPos.w;
        projectionPos.w = 1.0;
        //console.log(projectionPos);
        // if(Math.abs(projectionPos.x) >1 || Math.abs(projectionPos.y) > 1 || Math.abs(projectionPos.z) >1) {
        //   continue;
        // }

        // NDC 到 screenPos
        p.screenPos = new THREE.Vector3();
        // p.screenPos.x = parseInt((projectionPos.x + 1) / 2 * this.canvasWidth);
        // p.screenPos.y = parseInt((projectionPos.y + 1) / 2 * this.canvasHeight);
        p.screenPos.x = (projectionPos.x + 1) / 2 * this.canvasWidth - 0.5;
        p.screenPos.y = (projectionPos.y + 1) / 2 * this.canvasHeight - 0.5;
        p.screenPos.z = projectionPos.z;
      }
    }
   
  }

  render(scene, camera) {
    this.scene = scene;
    this.clearBackground(); 
    this.transformObjectToScreen(scene, camera);
    const list = scene.meshList;
    this.zBuffer.length = 0; 
    for (let mesh of list){
      let tringlesCount = mesh.vertIndices.length / 3;
      //tringlesCount = 2;
      for (let i= 0; i < tringlesCount; i++) {
        const dotA = mesh.vertexPointList[i * 3];
        const dotB = mesh.vertexPointList[i * 3 + 1];
        const dotC = mesh.vertexPointList[i * 3 + 2];
        if (this.faceCulling(dotA, dotB, dotC)) {
          this.drawCanvas (dotA, dotB, dotC);
        }
       
      }
    }
    this.ctx.putImageData(this.myImageData, 0, 0);
  }

  faceCulling(dotA, dotB, dotC) {
    const dir1 = dotB.screenPos.clone().sub(dotA.screenPos);
    const dir2 = dotC.screenPos.clone().sub(dotA.screenPos);
    dir1.cross(dir2);
    //NDC 坐标系下观察方向是0,0,0
    //return true;
    return dir1.dot(new THREE.Vector3(0, 0, 1)) > 0;
  }


  drawCanvas (dotA, dotB, dotC) {
    for (let i = 0; i < this.canvasWidth; i++){
      for (let j = 0; j < this.canvasHeight; j++){
          const checkPos = new THREE.Vector3(i, j, 0);
          let baryPos = new THREE.Vector3(0.0, 0.0, 0.0);
          if (this.checkoutOnePointInTriangle (dotA.screenPos, dotB.screenPos, dotC.screenPos, checkPos, baryPos)) {
            this.drawPoint(i, j, checkPos.z, dotA, dotB, dotC, baryPos);
          }
      }
    }
  }

  drawPoint(x, y, depth, dotA, dotB, dotC, baryPos) {
    const flipY = this.canvasHeight - y - 1;
    const zBufferIndex = flipY * this.canvasWidth + x;
    if(this.zBuffer[zBufferIndex] != undefined && this.zBuffer[zBufferIndex] < depth) {
      return;
    }
    else{
      this.zBuffer[zBufferIndex] = depth;
    }
    const redIndex = flipY * (this.canvasWidth * 4) + x * 4;
    const greedIndex = redIndex + 1;
    const blueIndex = greedIndex + 1;
    const alphaIndex = blueIndex + 1;
    this.myImageData.data[alphaIndex] = 255;
    
    const dotAColor = dotA.color;
    const dotBColor = dotB.color;
    const dotCColor = dotC.color;

    //法线插值
    //const normal = dotA.normal;
    const normal_1 = dotA.normal.clone().multiplyScalar(baryPos.x).normalize();

    const normal_2 = dotB.normal.clone().multiplyScalar(baryPos.y).normalize();

    const normla_3 = dotC.normal.clone().multiplyScalar(baryPos.z).normalize();
    normal_1.add(normal_2).add(normla_3).normalize();
    let s = normal_1.dot(this.scene.directionOri);
    if(s < 0.0) {
      s= 0.0;
    }

    // 外部光照的颜色 漫反射
    const diffuse = this.scene.directionColor.clone().multiplyScalar(s);
    // 环境光

    // 顶点本身的颜色
    const r = dotAColor.x * baryPos.x + dotBColor.x * baryPos.y + dotCColor.x * baryPos.z;
    const g =  dotAColor.y * baryPos.x + dotBColor.y * baryPos.y + dotCColor.y * baryPos.z;
    const b = dotAColor.z * baryPos.x + dotBColor.z * baryPos.y + dotCColor.z * baryPos.z;
    const vertexColor = new THREE.Vector3(r,g, b);

    //最终颜色：
    const color = this.scene.ambientColor.clone().multiplyScalar(0.2).
    add(diffuse.multiplyScalar(0.6)).add(vertexColor.multiplyScalar(0.2));

    // this.myImageData.data[redIndex] = color.x;
    // this.myImageData.data[greedIndex] =  color.y;
    // this.myImageData.data[blueIndex] =  color.z;
    

    //uv 插值

   
    
    // const uvx = dotA.uv.x * baryPos.x + dotB.uv.x * baryPos.y + baryPos.z * dotC.uv.x;
    // const uvy = dotA.uv.y * baryPos.x + dotB.uv.y * baryPos.y + baryPos.z * dotC.uv.y;
    // if (!this.imageDataTexture)
    //   return;
    // const result = this.tex2D(uvx, uvy);

    const uvx = dotA.uv.x * baryPos.x / dotA.screenPos.z +
     dotB.uv.x * baryPos.y / dotB.screenPos.z +
     baryPos.z * dotC.uv.x /dotC.screenPos.z;


    const uvy = dotA.uv.y * baryPos.x / dotA.screenPos.z
       + dotB.uv.y * baryPos.y / dotB.screenPos.z +
        baryPos.z * dotC.uv.y / dotC.screenPos.z;

    if (!this.imageDataTexture)
        return;
    const result = this.tex2D(uvx * depth, uvy * depth);
     
    this.myImageData.data[redIndex] =result[0];
    this.myImageData.data[greedIndex] =  result[1];
    this.myImageData.data[blueIndex] =  result[2];
    this.myImageData.data[alphaIndex] =  result[3];
    
  }


  tex2D(x, y){
    const w = Math.floor(x * this.textureWidth); 
    const h = Math.floor(y * this.textureHeight); 

    const redIndex = h * (this.textureWidth * 4) + w * 4;
    const greedIndex = redIndex + 1;
    const blueIndex = greedIndex + 1;
    const alphaIndex = blueIndex + 1;

    
    return [
      this.imageDataTexture.data[redIndex],
      this.imageDataTexture.data[greedIndex],
      this.imageDataTexture.data[blueIndex],
      this.imageDataTexture.data[alphaIndex],
    ];
    
  }

  checkoutOnePointInTriangle (dotA, dotB, dotC, dotP, baryPos) {
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

    if(m >= 0.0 && n >=0.0 && m+n <= 1.0) {
      baryPos.set(1.0- m - n, m, n);
      // 20200510 第一个版本的深度值采用的是投影后的NDC 坐标，现改为透视修正后的深度值
      //dotP.z = dotA.z * (1.0 - m - n) + dotB.z * m + dotC.z * n;
      const z = 1.0 / dotA.z * (1.0 - m - n) + 1.0 / dotB.z * m + 1.0 / dotC.z * n;
      dotP.z = 1.0 / z;


      return true;
    }
    else{
      return false;
    }
  }

}

export {Renderer}
