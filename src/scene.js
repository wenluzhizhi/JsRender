class Scene {
  constructor() {
    this.meshList = [];
  }

  add (mesh) {
   this.meshList.push(mesh);
  }
}

export {Scene};