class Shader {

    
    

    static vertexShader(M, V, P, pos) {
        const worldPos = pos.applyMatrix4(M);
        let cameraPos = worldPos.applyMatrix4(V);
        const clipPos = cameraPos.applyMatrix4(P);
        return clipPos;
    }


    static prespectiveDivide (v) {
      const ndcPos = new THREE.Vector4(0, 0, 0);
      ndcPos.x = v.clipPos.x / v.clipPos.w;
      ndcPos.y = v.clipPos.y / v.clipPos.w;
      ndcPos.z = v.clipPos.z / v.clipPos.w;
      ndcPos.w = v.clipPos.w;
      v.ndcPos = ndcPos;
    }


    static ndcToScreen (v, width, height) {
      const screenPos = new THREE.Vector2(0, 0);
      screenPos.x = (v.ndcPos.x + 1) / 2.0 * width - 0.5;
      screenPos.y = (v.ndcPos.y + 1) / 2.0 * height - 0.5; 
      v.screenPos = screenPos;
    }

    static fragmentShader (v1, v2, v3) {

    } 
}

export {Shader}