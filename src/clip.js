import {Vertex} from './vertex';

const list = [
    new THREE.Vector3(0, 1, -1),
    new THREE.Vector3(-1, 0, -1),
    new THREE.Vector3(0, -1, -1),
    new THREE.Vector3(1, 0, -1),
];


function inside (line, dot) {
  const value = line.x * dot.x + line.y * dot.y + line.z;
  return value < 0;       
}

function allVertexInSide (v1, v2, v3) {
   if (v1.x > 1.0 || v1.x < -1.0)
     return false;
   if (v1.y > 1.0 || v1.y < -1.0)
      return false;

    if (v2.x > 1.0 || v2.x < -1.0)
      return false;
    if (v2.y > 1.0 || v2.y < -1.0)
       return false;
    
    if (v3.x > 1.0 || v3.x < -1.0)
       return false;
     if (v3.y > 1.0 || v3.y < -1.0)
        return false;
    
    return true;
}


function SutherlandHodgeman(v1, v2, v3) {
   let outPutList = [v1, v2, v3];
   if (allVertexInSide(v1, v2, v3)) {
       return outPutList;
   }

   
}


const planeList = [
    new THREE.Vector4(0, 0, 1, 1),
    new THREE.Vector4(1, 0, 0, 1),
    new THREE.Vector4(-1, 0, 0, 1),
];





function getDistanceFromPlane (v4, v) {
   return v4.x * v.x + v4.y * v.y  + v4.z * v.z + v4.w;
}


function copyArray() {}

function SutherlandHodgemanPlane(v1, v2, v3) {
    let outPutList = [v1, v2, v3];
    let initInputList = [];
    let inputIndex = 0;
    for(let i =0; i < planeList.length; i++) {
        initInputList.length = 0;
        initInputList = outPutList.slice(0, outPutList.length)
        outPutList.length = 0;
        for (let j =0; j < initInputList.length; j++) {
            const currDis = getDistanceFromPlane(planeList[i], initInputList[j].ndcPos);
            const nextIndex = (j + initInputList.length + 1) % initInputList.length;
            const lastDis = getDistanceFromPlane(planeList[i], initInputList[nextIndex].ndcPos);
            if (currDis >= 0.0) {
               outPutList.push(initInputList[j]);
               if (lastDis < 0.0) {
                   const ratio = currDis / (currDis - lastDis);
                   const newPoint = lerpPoint(initInputList[j], initInputList[nextIndex], ratio);
                   outPutList.push(newPoint);
               }
            } else {
               if (lastDis >= 0.0) {
                  const ratio = lastDis / (lastDis - currDis);
                  const newPoint = lerpPoint(initInputList[nextIndex], initInputList[j], ratio);
                  outPutList.push(newPoint);
               }
            }
        }
    }
    return outPutList;
 }


 function lerpPoint (v1, v2, ratio) {
    const newPoint = new Vertex();
    if (!newPoint.ndcPos) {
        newPoint.ndcPos = new THREE.Vector4();
    }
    if (!newPoint.clipPos) {
        newPoint.clipPos = new THREE.Vector4();
    }
    newPoint.ndcPos.lerpVectors(v1.ndcPos, v2.ndcPos, ratio);
    newPoint.clipPos.lerpVectors(v1.clipPos, v2.clipPos, ratio);
    newPoint.uv.lerpVectors(v1.uv, v2.uv, ratio);
    newPoint.color.lerpVectors(v1.color, v2.color, ratio);
    newPoint.normal.lerpVectors(v1.normal, v2.normal, ratio);
    return newPoint;
 }





export {SutherlandHodgeman, allVertexInSide, SutherlandHodgemanPlane}