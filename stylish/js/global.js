//連接api相關物件
let urlRoot = 'https://api.appworks-school.tw/api/1.0/products'
let typeName = 'all'
let mainContent = document.querySelector('main')
let pagingUrl = null
let pagingNew = null
let stopLoading = false
let data = []

showCounter()
localStorageStatus()

//依產品類別渲染資訊
let productType = document.querySelectorAll('.productType')
productType.forEach(el=> {
  el.addEventListener('click', getTypeData)
})
function getTypeData(el) {
  init()
  let typeName = el.target.dataset.linkname //自定義data-*屬性的標的物件
  let url = `${urlRoot}/${typeName}`
  loader()
  fetchApi(url, typeName)  
}

//連接api
function fetchApi(url, typeName) {
  fetch(url)
  .then(function(res) {
    return res.json()
  })
  .then(function(json) {
    data = json.data
    pagingNew = json.paging
    data.length === 0 ? showNone(data) : render(data)
    mainContent.removeChild(document.querySelector('.loader-wrap'))
    if(pagingNew > 0) {
      stopLoading = false
      pagingUrl = `${urlRoot}/${typeName}?paging=${pagingNew}`
      window.addEventListener('scroll',loadNew)
    } else {
      pagingUrl = null
    }
  })
} 

//scroll分頁加載
function loadNew(){
    const windowHeight = document.documentElement.clientHeight //視窗高度 //const windowHeight = window.innerHeight
    const bottomArea = document.querySelector('footer').getBoundingClientRect()
    const footTotop = bottomArea.top //footer至頂端高度
    if(stopLoading) {
      return
    } else if(footTotop < windowHeight) {
      loader()
      fetchApi(pagingUrl, typeName)
      stopLoading = true //跳出
    }
}

//初始化
function init() {
  window.scrollTo(0,0)
  mainContent.innerHTML = ''
}

// 無符合結果
function showNone() {
  const noData = document.createElement('div')
  noData.className = 'no-data'
  noData.textContent = '查無符合結果'
  mainContent.appendChild(noData)
}

//顯示加載中圖示
function loader(){
    const loaderWrap = document.createElement('div')
    loaderWrap.className = 'loader-wrap'
    const loader = document.createElement('img')
    loader.className = 'loader-img'
    loader.setAttribute("src",`../img/loading.gif`) 
    loaderWrap.appendChild(loader) 
    mainContent.appendChild(loaderWrap)
}

//主頁標的產品渲染細項
function render(data) {
  data.forEach(el => {
    //個別產品
    let productItem = document.createElement('a')
    productItem.className = 'productItem'
    productItem.setAttribute('data-id', `${el.id}`) //產品id
    productItem.setAttribute('href', `/pages/product.html?id=${el.id}`) //產品id
    //產品圖區
    let frame_pic = document.createElement('div')
    frame_pic.className = 'frame_pic'
    frame_pic.setAttribute('data-id', `${el.id}`) //產品id
    //產品資訊欄
    let frame_information = document.createElement('div')
    frame_information.className = 'frame_information'
    frame_information.setAttribute('data-id', `${el.id}`) //產品id
    //產品圖片
    let productImg = document.createElement('img')
    productImg.className = 'productImg'
    productImg.setAttribute('src', `${el.main_image}`)
    //色塊組及色塊
    let colorGroup = document.createElement('div')
    colorGroup.className = 'colorGroup'
    el.colors.forEach(color=> {
      let colorblock = document.createElement('div')
      colorblock.className = 'colorblock'
      colorblock.style.backgroundColor = `#${color.code}`
      colorGroup.appendChild(colorblock)
    })
    //產品名稱
    let productName = document.createElement('p')
    productName.textContent = el.title
    //價目
    let productPrice = document.createElement('p')
    productPrice.textContent = `TWD. ${el.price}`
    //包起來
    mainContent.appendChild(productItem)
    productItem.appendChild(frame_pic)
    productItem.appendChild(frame_information)
    frame_pic.appendChild(productImg)
    frame_information.appendChild(colorGroup)
    frame_information.appendChild(productName)
    frame_information.appendChild(productPrice)
  });
}

//Search相關物件
const searchBtn = document.querySelectorAll('.searchBtn') //搜尋動作鈕
const searchInput = document.querySelectorAll('.searchInput') //輸入值
const openSearchBar = document.querySelector('.openSearchBar') //展開搜索框按鈕
const mobileSearchBar = document.querySelector('.mobileSearchBar') //手機搜索框
const closeBtn = document.querySelector('.close-btn') //關閉搜索框

//開啟Mobile搜索列
openSearchBar.addEventListener('click',showMobileSearchBar)
function showMobileSearchBar() {
  mobileSearchBar.style.display = 'flex'
  openSearchBar.classList.add('removeit')
}
//關閉Mobile搜索列
closeBtn.addEventListener('click',closeMobileSearchBar)
function closeMobileSearchBar() {
  openSearchBar.classList.remove('removeit')
  mobileSearchBar.style.display = 'none'
}

//按滑鼠搜索
//簡潔的寫法，但部分瀏覽器不支援
//searchBtn.forEach(el=>el.addEventListener('click',search))
//比上一方法支援較廣，但也不建議使用
//[].forEach.call(searchBtn, function(el) {el.addEventListener('click',search)})
var searchBtnjson = [];
for (var i = 0; i <searchBtn.length; i++ ){
  searchBtnjson.push(searchBtn[i]);
  searchBtnjson[i].addEventListener('click',search);
}
//按鍵盤搜索
document.addEventListener('keypress',function(evt){
  if(evt.keyCode === 13 || evt.which === 13){
    evt.preventDefault()
    search()
  } 
})

//啟動搜尋
function search(e) {
  let keyWord = null
  searchInput.forEach(el => {
    if(el.value) {keyWord = el.value.trim()}
  }) //input帶入網址keyword
  if(!keyWord) return //input沒有值則不作動

  init()
  let searchUrl = `${urlRoot}/search?keyword=${keyWord}`
  loader()
  fetchApi(searchUrl, typeName)
  searchInput.forEach(el => {
    el.value = ''
  })
  mobileSearchBar.style.display = 'none'
  openSearchBar.classList.remove('removeit')
}


function showCounter() {
  //將資料庫的陣列取出
  const arrayJason = JSON.parse(localStorage.getItem('item'));
  const cartCounterArea = document.querySelectorAll('.countValue')
  //假如資料庫內的陣列有內容存在，執行以下的程式碼
  if (arrayJason) {
    //先清空容器內的元素
    cartCounterArea.forEach(el=>{
        el.innerHTML = '';
        el.innerHTML = arrayJason.length;
    })
  } else {
    cartCounterArea.forEach(el=>{
      el.innerHTML = '';
      el.innerHTML = 0;
    })
  }
  console.log(arrayJason)
}

function localStorageStatus() {
  //當localStorage沒有資料陣列，指定一個空陣列放入資料庫
  if (localStorage.getItem('item') === null) {
      var storageArray = [];
      localStorage.setItem('item', JSON.stringify(storageArray));
  //當localStorage已存在資料陣列，指定一個內容與陣列資料庫相同的陣列
  } else {
      var storageArray = JSON.parse(localStorage.getItem('item'));
  }
}
