import ClipImg from './clip-img.js'

let state = {
  file: null, // 选中文件
  dataUrl: null,
  times: 1 //放大的背倍数
}


const look = document.querySelector('.look')
const lookImg = look.querySelector('img')
const result = document.querySelector('.clip-result img')

const ctxBox = new ClipImg(state, lookImg, function(url) {
  // url是base64格式
  document.querySelector('.clip-result').classList.add('show')
  result.src = url
  upLoad(url)
})

function upLoad(base64URL) {
  const bytes = atob(base64URL.split(',')[1])
  const arrayBuffer = new ArrayBuffer(bytes.length)
  const uint8Array = new Uint8Array()
  for (let i = 0; i < bytes.length; i++) {
    uint8Array[i] = bytes.charCodeAt[i]
  }
  let blob= new Blob([arrayBuffer], {type: 'image/png'})
  const xhr = new XMLHttpRequest()
  const formData = new FormData()
  formData.append('avatar', blob)
  xhr.open('POST', '/upload',true)
  xhr.send(formData)
}
// 选择图片的回掉
// 主要是为了显示选择的图片
function setSelectImg() {
  look.classList.add('show')

  lookImg.src = state.dataUrl
  lookImg.onload = () => {  // 图片加载成功则canvase绘制图片
    ctxBox.drawImg()
  }
}

// 获取图片信息
function handleChange(event ) {
  const file = event.target.files[0]
  const fileReader = new FileReader()
  fileReader.onload = (event) => {
    state = {
      file,
      dataUrl: event.target.result
    }
    setSelectImg()
    // 重新初始化canvas
    ctxBox.init(state, lookImg)
  }
  fileReader.readAsDataURL(file)
}


document.querySelector('#file').addEventListener('change',handleChange,false)