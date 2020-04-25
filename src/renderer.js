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
      mesh.screenTrigles = [];
      const vertList = mesh.vertList;
      for( let v of vertList) {
        const worldPos = v.clone().applyMatrix4(mesh.modelMatrix);
        const cameraPos = worldPos.applyMatrix4(camera.viewMatrix);
        const projectionPos = cameraPos.applyMatrix4(camera.projectionMatrix);
        projectionPos.x = projectionPos.x / projectionPos.w;
        projectionPos.y = projectionPos.y / projectionPos.w;
        projectionPos.z = projectionPos.z / projectionPos.w;
        projectionPos.w = 1.0;
        //console.log(projectionPos);
        if(Math.abs(projectionPos.x) >1 || Math.abs(projectionPos.y) > 1 || Math.abs(projectionPos.z) >1) {
          continue;
        }
        const screenPos = new THREE.Vector3();
        screenPos.x = parseInt((projectionPos.x + 1) / 2 * this.canvasWidth);
        screenPos.y = parseInt((projectionPos.y + 1) / 2 * this.canvasHeight);
        screenPos.z = projectionPos.z;
        mesh.screenTrigles.push(screenPos);
      }
    }
   
  }

  render(scene, camera) {
    this.clearBackground(); 
    this.transformObjectToScreen(scene, camera);
    const list = scene.meshList;
    this.zBuffer.length = 0; 
    for (let mesh of list){
      const tringlesCount = mesh.screenTrigles.length / 3;
      for (let i= 0; i < tringlesCount; i++) {
        const dotA = mesh.screenTrigles[i * 3];
        const dotB = mesh.screenTrigles[i * 3 + 1];
        const dotC = mesh.screenTrigles[i * 3 + 2];

        const dotAColor = mesh.vertexColor[i * 3];
        const dotBColor = mesh.vertexColor[i * 3 + 1];
        const dotCColor = mesh.vertexColor[i * 3 + 2];
        //console.log('---------ddfdf------------');
        //console.log(dotA, dotB, dotC);
        this.drawCanvas (dotA, dotB, dotC, dotAColor, dotBColor, dotCColor);
      }
    }
    this.ctx.putImageData(this.myImageData, 0, 0);
  }

  drawCanvas (dotA, dotB, dotC, dotAColor, dotBColor, dotCColor) {
    for (let i = 0; i < this.canvasWidth; i++){
      for (let j = 0; j < this.canvasHeight; j++){
          const checkPos = new THREE.Vector3(i, j, 0);
          let baryPos = new THREE.Vector3(0.0, 0.0, 0.0);
          if (this.checkoutOnePointInTriangle (dotA, dotB, dotC, checkPos, baryPos)) {
            this.drawPoint(i, j, checkPos.z, dotAColor, dotBColor, dotCColor, baryPos);
          }
      }
    }
  }

  drawPoint(x, y, depth, dotAColor, dotBColor, dotCColor, baryPos) {
    //console.log(baryPos);
    
    const flipY = this.canvasHeight - y - 1;

    const zBufferIndex = flipY * this.canvasWidth + x;

   
    if(this.zBuffer[zBufferIndex] != undefined && this.zBuffer[zBufferIndex] < depth) {
      //console.log('ztest fail', zBufferIndex, depth);
      return;
    }
    else{
     // console.log(zBufferIndex, depth);
      this.zBuffer[zBufferIndex] = depth;

    }
    

    const redIndex = flipY * (this.canvasWidth * 4) + x * 4;
    const greedIndex = redIndex + 1;
    const blueIndex = greedIndex + 1;
    const alphaIndex = blueIndex + 1;




    this.myImageData.data[alphaIndex] = 255;
    


    this.myImageData.data[redIndex] =
      dotAColor.x * baryPos.x + dotBColor.x * baryPos.y + dotCColor.x * baryPos.z;
    this.myImageData.data[greedIndex] =
      dotAColor.y * baryPos.x + dotBColor.y * baryPos.y + dotCColor.y * baryPos.z;
    this.myImageData.data[blueIndex] =
      dotAColor.z * baryPos.x + dotBColor.z * baryPos.y + dotCColor.z * baryPos.z;
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
      dotP.z = dotA.z * (1.0 - m - n) + dotB.z * m + dotC.z * n;
      //console.log(dotP.z);
      return true;
    }
    else{
      return false;
    }
  }

}

export {Renderer}
