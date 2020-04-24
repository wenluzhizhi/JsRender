import {Transform} from './transform'

class App {
  constructor (){
    console.log('this is App constructor!');
    this.canvas = document.getElementById('canvas');
    console.log(this.canvas);
    this.ctx = this.canvas.getContext('2d');

    this.canvasWidth = this.canvas.width;
    this.canvasHeight = this.canvas.height;

    console.log('canvas width height!')
    console.log(this.canvasWidth, this.canvasHeight);

    this.myImageData = this.ctx.getImageData(0, 0, this.canvasWidth, this.canvasHeight);
    this.clearBackground();
    
    
    this.myImageData.data[0] = 255;
    this.myImageData.data[3] =255;
    this.transform = new Transform();
    this.transform.transform(this.myImageData, this.canvasWidth, this.canvasHeight);

     
    this.ctx.putImageData(this.myImageData, 0, 0);
  }

  clearBackground () {
    let count = this.canvasHeight * this.canvasWidth;
  
    for (let i = 0; i < count; i++) {
      this.myImageData.data[i*4+3] = 255;
    }
  }

  run() {

  }

  
}

const app = new App();
app.run();