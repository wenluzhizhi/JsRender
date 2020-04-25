class Renderer {
  constructor (canvs) {
    this.canvas = canvs;
    this.ctx = this.canvas.getContext('2d');
    this.canvasWidth = this.canvas.width;
    this.canvasHeight = this.canvas.height;
    this.myImageData = this.ctx.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
    this.clearBackground();
    this.screenTrigles = [];
  }

  clearBackground () {
    let count = this.canvasHeight * this.canvasWidth;
    for (let i = 0; i < count; i++) {
      this.myImageData.data[i*4+3] = 255;
    }
  }

  transformObjectToScreen (scene, camera) {
    console.log("---------------");
    console.log(camera);
    const list = scene.meshList;
    this.screenTrigles = [];
    for (let mesh of list) {
      const vertList = mesh.vertList;
      for( let v of vertList) {
        const worldPos = v.clone().applyMatrix4(mesh.modelMatrix);
        console.log(worldPos);
        const cameraPos = worldPos.applyMatrix4(camera.viewMatrix);
        console.log(cameraPos);
        const projectionPos = cameraPos.applyMatrix4(camera.projectionMatrix);
        projectionPos.x = projectionPos.x / projectionPos.w;
        projectionPos.y = projectionPos.y / projectionPos.w;
        projectionPos.z = projectionPos.z / projectionPos.w;
        projectionPos.w = 1.0;
        const screenPos = new THREE.Vector3();
        screenPos.x = parseInt((projectionPos.x + 1) / 2 * this.canvasWidth);
        screenPos.y = parseInt((projectionPos.y + 1) / 2 * this.canvasHeight);
        screenPos.z = parseInt((projectionPos.z + 1) / 2);
        console.log(screenPos.x, screenPos.y);
        this.screenTrigles.push(new THREE.Vector2(screenPos.x, screenPos.y));
      }
    }
   
  }

  render(scene, camera) {
    this.transformObjectToScreen(scene, camera);
    console.log('-----------------start traverse trigles-------------');
    const tringlesCount = this.screenTrigles.length / 3;
    console.log(tringlesCount);
    for (let i= 0; i < tringlesCount; i++) {
      const dotA = this.screenTrigles[i * 3];
      const dotB = this.screenTrigles[i * 3 + 1];
      const dotC = this.screenTrigles[i * 3 + 2];
      console.log(dotA, dotB, dotC);
      this.drawCanvas (dotA, dotB, dotC);
    }
    this.ctx.putImageData(this.myImageData, 0, 0);
  }

  drawCanvas (dotA, dotB, dotC) {
    for (let i = 0; i < this.canvasWidth; i++){
      for (let j = 0; j < this.canvasHeight; j++){
          const checkPos = new THREE.Vector2(i, j);
          if (this.checkoutOnePointInTriangle (dotA, dotB, dotC, checkPos)) {
            this.drawPoint(i, j);
          }
      }
    }
  }

  drawPoint(x, y) {
    const flipY = this.canvasHeight - y - 1;
    const redIndex = flipY * (this.canvasWidth * 4) + x * 4;
    const greedIndex = redIndex + 1;
    const blueIndex = greedIndex + 1;
    const alphaIndex = blueIndex + 1;
    this.myImageData.data[alphaIndex] = 255;
    this.myImageData.data[redIndex] = 255;
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

    if(m >= 0.0 && n >=0.0 && m+n <= 1.0) {
      return true;
    }
    else{
      return false;
    }
  }

}

export {Renderer}
