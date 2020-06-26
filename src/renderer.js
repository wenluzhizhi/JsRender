import {Shader} from './shader';
import {SutherlandHodgeman, allVertexInSide, SutherlandHodgemanPlane} from './clip';

class Renderer {
  constructor (canvs) {
    this.canvas = canvs;
    this.ctx = this.canvas.getContext('2d');
    
    this.canvasWidth = this.canvas.width;
    this.canvasHeight = this.canvas.height;
    console.log('this.canvasWidth:' + this.canvasWidth);
    console.log('this.canvasHeight:' + this.canvasHeight);
    this.myImageData = this.ctx.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
    this.zBuffer = [];
    this.clearBackground();
    this.screenTrigles = [];

    var img = new Image();
    img.src = './1.jpg';
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


  transformObjectToScreen(scene, camera) {
    const list = scene.meshList;
    for (let mesh of list) {
      const vertexPointList = mesh.vertexPointList;
      const tringlesCount = mesh.vertIndices.length / 3;
      //const tringlesCount = 1;
      for (let i= 0; i < tringlesCount; i++) {
         const p1 = mesh.vertexPointList[3*i];
         const p2 = mesh.vertexPointList[3* i + 1];
         const p3 = mesh.vertexPointList[3* i + 2];

         p1.clipPos = Shader.vertexShader(mesh.modelMatrix, 
          camera.viewMatrix, camera.projectionMatrix, p1.position.clone());
         p2.clipPos = Shader.vertexShader(mesh.modelMatrix, 
            camera.viewMatrix, camera.projectionMatrix, p2.position.clone());
         p3.clipPos = Shader.vertexShader(mesh.modelMatrix, 
              camera.viewMatrix, camera.projectionMatrix, p3.position.clone());  
        
         Shader.prespectiveDivide(p1);
         Shader.prespectiveDivide(p2);
         Shader.prespectiveDivide(p3);


     
        const new_list = SutherlandHodgemanPlane(p1, p2, p3);
        const loopCount = new_list.length - 2;
        for(let k = 0; k < loopCount; k++) {
 
          const p1_1 = new_list[0];
          const p2_1 = new_list[k + 1];
          const p3_1 = new_list[k + 2];
 
          // p1_1.clipPos = Shader.vertexShader(mesh.modelMatrix, 
          //  camera.viewMatrix, camera.projectionMatrix, p1_1.position.clone());
          // p2_1.clipPos = Shader.vertexShader(mesh.modelMatrix, 
          //    camera.viewMatrix, camera.projectionMatrix, p2_1.position.clone());
          // p3_1.clipPos = Shader.vertexShader(mesh.modelMatrix, 
          //      camera.viewMatrix, camera.projectionMatrix, p3_1.position.clone());  
         
          // Shader.prespectiveDivide(p1_1);
          // Shader.prespectiveDivide(p2_1);
          // Shader.prespectiveDivide(p3_1);


          Shader.ndcToScreen(p1_1, this.canvasWidth, this.canvasHeight);
          Shader.ndcToScreen(p2_1, this.canvasWidth, this.canvasHeight);
          Shader.ndcToScreen(p3_1, this.canvasWidth, this.canvasHeight);
 
          this.drawTriangle(p1_1, p2_1, p3_1);


        } 

        //  Shader.ndcToScreen(p1, this.canvasWidth, this.canvasHeight);
        //  Shader.ndcToScreen(p2, this.canvasWidth, this.canvasHeight);
        //  Shader.ndcToScreen(p3, this.canvasWidth, this.canvasHeight);

        //  this.drawTriangle(p1, p2, p3);

      }
    }
  }

  render(scene, camera) {
    this.scene = scene;
    this.clearBackground(); 
    this.zBuffer.length = 0; 
    this.transformObjectToScreen(scene, camera);
    this.ctx.putImageData(this.myImageData, 0, 0);
  }

  faceCulling(dotA, dotB, dotC) {
    const dir1_v4 = dotB.screenPos.clone().sub(dotA.screenPos);
    const dir2_v4 = dotC.screenPos.clone().sub(dotA.screenPos);
    const dir1 = new THREE.Vector3(dir1_v4.x, dir1_v4.y, dir1_v4.z);
    const dir2 = new THREE.Vector3(dir2_v4.x, dir2_v4.y, dir2_v4.z);

    dir1.cross(dir2);
    //NDC 坐标系下观察方向是0,0,0
    //return true;
    return dir1.dot(new THREE.Vector3(0, 0, 1)) < 0;
  }


  drawTriangle (dotA, dotB, dotC) {

    const minX = Math.min(Math.floor(dotA.screenPos.x),
     Math.min(Math.floor(dotB.screenPos.x), Math.floor(dotC.screenPos.x)));
    const maxX = Math.max(Math.ceil(dotA.screenPos.x), Math.max(Math.ceil(dotB.screenPos.x), Math.ceil(dotC.screenPos.x)));

    const minY = Math.min(Math.floor(dotA.screenPos.y),
     Math.min(Math.floor(dotB.screenPos.y), Math.floor(dotC.screenPos.y)));
    const maxY = Math.max(Math.ceil(dotA.screenPos.y),
     Math.max(Math.ceil(dotB.screenPos.y), Math.ceil(dotC.screenPos.y)));

  
    for (let i = minX; i < maxX; i++){
      for (let j = minY; j < maxY; j++){
          const checkPos = new THREE.Vector2(i, j);
          let baryPos = new THREE.Vector3(0.0, 0.0, 0.0);
          if (this.checkoutOnePointInTriangle (dotA, dotB, dotC, checkPos, baryPos)) {
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
    // return;
    

    

    // 正确的UV插值算法
    const ow = baryPos.x / dotA.ndcPos.w + baryPos.y / dotB.ndcPos.w +  baryPos.z / dotC.ndcPos.w;
    const uvx = dotA.uv.x * baryPos.x / dotA.ndcPos.w +
     dotB.uv.x * baryPos.y / dotB.ndcPos.w +
     baryPos.z * dotC.uv.x /dotC.ndcPos.w;

    const uvy = dotA.uv.y * baryPos.x / dotA.ndcPos.w
       + dotB.uv.y * baryPos.y / dotB.ndcPos.w +
        baryPos.z * dotC.uv.y / dotC.ndcPos.w;

    if (!this.imageDataTexture)
        return;
    const result = this.tex2D(uvx / ow, uvy / ow);
    this.myImageData.data[redIndex] = result[0];
    this.myImageData.data[greedIndex] =  result[1];
    this.myImageData.data[blueIndex] =  result[2];
    this.myImageData.data[alphaIndex] =  result[3];
    
  }


  tex2D(x, y){
    x = Math.abs(x % 1) ;
    y =  Math.abs(y % 1);
    const w = parseInt(x * this.textureWidth); 
    const h = parseInt(y * this.textureHeight); 


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
    const PA = dotP.clone().sub(dotA.screenPos);
    const BA = dotB.screenPos.clone().sub(dotA.screenPos);
    const CA = dotC.screenPos.clone().sub(dotA.screenPos);

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
      dotP.z = dotA.clipPos.z * (1.0 - m - n) + dotB.clipPos.z * m + dotC.clipPos.z * n;
      //const z = 1.0 / dotA.ndcPos.z * (1.0 - m - n) + 1.0 / dotB.ndcPos.z * m + 1.0 / dotC.ndcPos.z * n;
      //dotP.z = 1.0 / z;


      return true;
    }
    else{
      return false;
    }
  }

}

export {Renderer}
