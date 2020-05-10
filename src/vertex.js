class Vertex {
    constructor(position,color, normal, uv) {
       this.position = position || new THREE.Vector4();
       this.uv = uv || new THREE.Vector2();
       this.color = color || new THREE.Vecotr3(0, 0, 0);
       this.normal = normal || new THREE.Vecotr3(0, 1, 0);
       this.screenPos = undefined;
    }
}
export {Vertex}