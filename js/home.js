//直接顯示首頁（all)
function homePage() {
  mainContent.innerHTML = ''
  let url = `${urlRoot}/${typeName}`
  loader()
  fetchApi(url, typeName)
}
homePage()

//Banner 區域的動畫
//全域物件
const imgWrap = document.getElementById('imgWrap')
const heroImg = document.querySelector('.hero-image')
const mainTextWrap = document.querySelector('.main-text')
const subTextWrap = document.querySelector('.sub-text')
const url = 'https://api.appworks-school.tw/api/1.0/marketing/campaigns'
let TopData = []

fetch(url)
.then(res => {
return res.json()
})
.then(json => {
TopData = json.data
heroImg.classList.add('fade') //第一張圖加入漸變顯示
renderImg(0) //顯示第一張圖與資料
renderDot(TopData) //渲染點個數
showCurrentDot(0) //當前點加入樣式
changeindex() //切換index重新渲染
})
.catch(err=>'error')

//render banner 畫面(資料不動）
function renderImg(id) {
  imgWrap.setAttribute('data-index',id)
  mainTextWrap.innerHTML = ''
  subTextWrap.innerHTML = ''
  //banner 圖片
  heroImg.style.backgroundImage = 
  `linear-gradient(90deg,white,transparent 60%), 
  url('https://api.appworks-school.tw${TopData[id].picture}')` 
  //banner 處理文字陣列
  const textArray = TopData[id].story.split(/[\n,]/g)
  const mainTextArray = textArray.slice(0,3)
  const subTextArray = textArray.slice(3)
  //大字
  mainTextArray.forEach(el => {
    const mainText = document.createElement('p')
    mainText.textContent = el
    mainTextWrap.appendChild(mainText)
  })
  //小字
  const subText = document.createElement('span')
  subText.textContent = subTextArray
  subTextWrap.appendChild(subText)
}

//render Banner 點點(once）
function renderDot(data) {
  data.forEach((el,index) => {
    const dotWrap = document.getElementById('dotWrap')
    const dot = document.createElement('div')
    dot.className='dot'
    dot.setAttribute('data-index',`${index}`)
    dotWrap.appendChild(dot)
  })
}

//顯示Banner 當前點點
function showCurrentDot(id) {
  const dotGroup = document.querySelectorAll('.dot')
  dotGroup.forEach(el=>{
    el.classList.remove('active')
    //typeof不同用兩等號
    if(el.dataset.index==id) {
      el.classList.add('active')
    }
  })
}
//點點點擊
function changeindex() {
  const dotGroup = document.querySelectorAll('.dot')
  dotGroup.forEach(el=> el.addEventListener('click',function(){
    const id = el.dataset.index
    showCurrentDot(id)
    renderImg(id)
    clearInterval(interval)
  }))
}

//設定輪播(一開始執行)
let interval= window.setInterval(autoChange, 10000)
//自動變換
function autoChange() {
let id = imgWrap.dataset.index
id = (id+1+data.length) % 3
renderImg(id)
showCurrentDot(id)
heroImg.classList.remove('fade')
heroImg.classList.add('fade')
}
//滑進停止
imgWrap.addEventListener('mouseover',function(){
interval = clearInterval(interval)
})
//滑出開始
imgWrap.addEventListener('mouseout',function(){
interval= window.setInterval(autoChange, 10000)
}) 

//點擊商品圖片or名稱連結至產品頁面
// let products = document.querySelectorAll('.productItem')
// products.forEach(el=> {
//   el.addEventListener('click', getDetail)
// })
// function getDetail(el) {
//   init()
//   let typeName = el.target.dataset.linkname //自定義data-*屬性的標的物件
//   let url = `${urlRoot}/${typeName}`
//   loader()
//   fetchApi(url, typeName)  
// }




