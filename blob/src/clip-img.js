const mouseDefault = {
  start: false, 
  x:0,
  y:0,
  lastMoveX: 0,
  lastMoveY: 0,
  moveX: 0,
  moveY: 0
}
export default class ClipImg{
  constructor(state, img, fn){
    this.state = state
    this.fn = fn
    this.img = img
    this.times = 1 // 放大的倍数
    this.startX = 0 //绘图开始的X坐标
    this.startY = 0 // 绘图开始的Y坐标
    this.mouse = mouseDefault // 鼠标开始及移动的坐标
    this.canvasBox = document.querySelector('.main')
    this.canvas = document.getElementById('selectImg')

    this.bindEvent()

  }
  bindEvent() {
    const clip = document.querySelector('.clip')
    document.querySelector('.bigger').addEventListener('click', this.handleBigger.bind(this), false)
    document.querySelector('.smaller').addEventListener('click', this.handleSmaller.bind(this), false)
    document.querySelector('.sure').addEventListener('click', this.handleSure.bind(this), false)
    clip.addEventListener('mousedown', this.mouseDown.bind(this), false)
    clip.addEventListener('mousemove', this.mouseMove.bind(this), false)
    clip.addEventListener('mouseup', this.mouseUp.bind(this), false)

  }
  init(state, img){
    this.state = state
    this.times = 1
    this.mouse = mouseDefault
    img && (this.img = img)
  }
  show(){
    this.canvasBox.classList.add('show')
  }
  // 将图片绘制到canvas中
  drawImg(){
    const ctx = this.canvas.getContext('2d')
    ctx.clearRect(0,0, this.canvas.clientWidth, this.canvas.height)
    let imgWidth = this.img.width
    let imgHeight = this.img.height
    // 保证图片不超出canvas
    if (imgWidth > imgHeight) {
        const scale = this.canvas.width / imgWidth
        imgWidth = this.canvas.width * this.times
        imgHeight =  imgHeight * scale * this.times
    } else {
      const scale = this.canvas.height / imgHeight
      imgHeight = this.canvas.height * this.times
      imgWidth =  imgWidth * scale * this.times
    }
    const startX = (this.canvas.width - imgWidth) / 2 + this.mouse.moveX + this.mouse.lastMoveX
    const startY = (this.canvas.height - imgHeight) / 2 + this.mouse.moveY + this.mouse.lastMoveY
    ctx.drawImage(this.img, startX, startY, imgWidth, imgHeight)

    this.show()
  }

  mouseDown(event) {
    this.mouse.start = true
    this.mouse.x = event.clientX
    this.mouse.y = event.clientY
  }
  mouseMove(event) {
    if (!this.mouse.start) return false;
    this.mouse.moveX = event.clientX - this.mouse.x
    this.mouse.moveY = event.clientY - this.mouse.y
    this.drawImg()

  }
  mouseUp(event) {
    this.mouse.start = false
    this.mouse.lastMoveX = event.clientX - this.mouse.x + this.mouse.lastMoveX
    this.mouse.lastMoveY = event.clientY - this.mouse.y + this.mouse.lastMoveY
    this.mouse.moveX = 0
    this.mouse.moveY = 0
  }

  // 放大
  handleBigger() {
    this.times += 0.1
    this.drawImg()
  }
  // 缩小
  handleSmaller() {
    this.times -= 0.1
    this.drawImg()
  }
  // 剪切
  handleSure() {
    const ctx = this.canvas.getContext('2d')
    const imgData = ctx.getImageData(150,150,100,100)
    const avatarCanvas = document.createElement('canvas')
    avatarCanvas.width = 100
    avatarCanvas.height = 100
    const avatarCtx = avatarCanvas.getContext('2d')
    avatarCtx.putImageData(imgData, 0, 0)
    const dataurl = avatarCanvas.toDataURL()
    this.fn(dataurl)
  }
}