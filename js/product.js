let detailData = []

//取得網址參數值（product ID)
let id = window.location.search.split('=')[1]
let detailUrl = `${urlRoot}/details?id=${id}`


//連結標的產品API
fetch(detailUrl)
    .then(res => {
        return res.json()
    })
    .then(json => {
        detailData = json.data
        renderDetail(detailData)
        let variants = detailData.variants
        localStorageStatus()
        selectAndCheckStock(variants)
    })

//渲染產品細節
function renderDetail(detailData) {
    //主要圖片 main_image
    let product_MainImg = document.querySelector('.product_MainImg')
    let frame_product_MainImg = document.querySelector('.frame_product_MainImg')
    let imgs = document.querySelector('#imgs')
    product_MainImg.setAttribute('src', `${detailData.main_image}`)
    imgs.setAttribute('src', `${detailData.main_image}`)
    let small = document.createElement('div')
    small.setAttribute('id', 'small')
    frame_product_MainImg.appendChild(small)
    //產品名稱、ID、價格 (title、id、price)
    let product_Name = document.querySelector('.product_Name')
    product_Name.textContent = `${detailData.title}`
    let product_ID = document.querySelector('.product_ID')
    product_ID.textContent = `${detailData.id}`
    let product_Price = document.querySelector('.product_Price')
    product_Price.textContent = `TWD. ${detailData.price}`
    //顏色 Color Group
    let opt_ColorGroup = document.querySelector('.opt_ColorGroup')
    detailData.colors.forEach((color, index) => {
        let opt_ColorFrame = document.createElement('div')
        opt_ColorFrame.className = 'opt_ColorFrame'
        opt_ColorFrame.setAttribute('data-index', `${index}`)
        opt_ColorFrame.setAttribute('data-color', `${color.code}`)
        let opt_Color = document.createElement('div')
        opt_Color.className = 'opt_Color'
        opt_Color.setAttribute('data-index', `${index}`)
        opt_Color.setAttribute('data-name', `${color.name}`)
        opt_Color.style.backgroundColor = `#${color.code}`
        opt_ColorFrame.appendChild(opt_Color)
        opt_ColorGroup.appendChild(opt_ColorFrame)
    })
    //尺寸 Size Group
    let opt_SizeGroup = document.querySelector('.opt_SizeGroup')
    detailData.sizes.forEach(size => {
        let opt_Size = document.createElement('div')
        opt_Size.className = 'opt_Size'
        opt_Size.setAttribute('data-size', `${size}`)
        opt_Size.textContent = `${size}`
        opt_SizeGroup.appendChild(opt_Size)
    })
    //備註 note
    let product_note = document.querySelector('.product_note')
    product_note.textContent = `*${detailData.note}`
    //材質 texture
    let product_texture = document.querySelector('.product_texture')
    product_texture.textContent = `${detailData.texture}`
    //相關敘述 description
    const desArray = detailData.description.split(" ")
    const thickness = desArray[0]
    const elasticity = desArray[1]
    let product_thickness = document.querySelector('.product_thickness')
    let product_elasticity = document.querySelector('.product_elasticity')
    product_thickness.textContent = thickness
    product_elasticity.textContent = elasticity

    //產地 place
    let product_materialPlace = document.querySelector('.product_materialPlace')
    product_materialPlace.textContent = `素材產地/${detailData.place}`
    let product_processPlace = document.querySelector('.product_processPlace')
    product_processPlace.textContent = `加工產地/${detailData.place}`

    //細部說明
    let storyAndImgs = document.querySelector('.storyAndImgs')
    //敘述 story
    let product_story = document.createElement('p')
    product_story.textContent = `${detailData.story}`
    //圖片 images
    let product_DetailImgs = document.createElement('div')
    product_DetailImgs.className = 'product_DetailImgs'

    detailData.images.forEach(eachurl => {
        let frame_product_DetailImg = document.createElement('div')
        frame_product_DetailImg.className = 'frame_product_DetailImg'
        let product_DetailImg = document.createElement('img')
        product_DetailImg.className = 'product_DetailImg'
        product_DetailImg.setAttribute('src', `${eachurl}`)
        frame_product_DetailImg.appendChild(product_DetailImg)
        product_DetailImgs.appendChild(frame_product_DetailImg)
    })

    //包起來
    storyAndImgs.appendChild(product_story)
    storyAndImgs.appendChild(product_DetailImgs)
}



///////////////////選擇顏色尺寸數量///////////////////

function selectAndCheckStock(variants) {
    let colorCode;
    let sizeCode;
    let productStock;
    let colorName = null; // 顏色中文名

    const AllColorOptions = document.querySelectorAll('.opt_ColorFrame') //所有顏色選項
    const AllSizeOptions = document.querySelectorAll('.opt_Size') //所有尺寸選項
    const inputNum = document.querySelector('.opt_Pieces') //數量輸入欄
    const plusBtn = document.querySelector('.opt_addition') //加按鈕
    const minusBtn = document.querySelector('.opt_minus') //減按鈕
    var itemPieces = parseInt(inputNum.value)

    //所有按鍵監聽事件
    AllColorOptions.forEach(el => el.addEventListener('click', clickColor))
    AllSizeOptions.forEach(el => el.addEventListener('click', clickSize))
    plusBtn.addEventListener('click', plusHandler)
    minusBtn.addEventListener('click', minusHandler)

    // 點擊顏色
    function clickColor(e) {
        document.getElementsByClassName('opt_Pieces')[0].value = 1; // 件數選擇欄位顯示復歸為1
        itemPieces = 1; // 件數選擇欄位顯示復歸為1
        let targetItem = e.currentTarget
        colorCode = targetItem.dataset.color
        AllSizeOptions.forEach(el => el.addEventListener('click', clickSize))
        showColorFrame(targetItem) // 顯示框框
        checkStock0(targetItem) // 判定尺寸庫存是否為0
    }
    function showColorFrame(targetItem) {
        AllColorOptions.forEach(selectedColor => {
            selectedColor.classList.remove('showFrame');
        })
        targetItem.classList.add('showFrame')
        // 將顏色中文名帶入全域變數colorName中供之後購物車使用
        let selectedName = detailData.colors.find(function (colorN) {
            return colorN.code === targetItem.dataset.color;
        });
        colorName = `${selectedName.name}`
    }
    function checkStock0(targetItem) {
        AllSizeOptions.forEach(e => {
            e.classList.remove('checkSize');
            e.classList.remove('sizeOutOfStock');
        })
        variants.forEach(el => {
            if (targetItem.dataset.color === el.color_code && el.stock === 0) {
                AllSizeOptions.forEach(e => {
                    if (e.dataset.size === el.size) {
                        e.classList.add('sizeOutOfStock');
                        e.removeEventListener('click', clickSize)
                    }
                })
            }
        })
    }

    // 點擊尺寸
    function clickSize(e) {
        document.getElementsByClassName('opt_Pieces')[0].value = 1;
        itemPieces = 1;
        let targetItem = e.currentTarget
        sizeCode = targetItem.dataset.size
        showSizeDark(targetItem) // 變更顏色
        checkProductStock() // 確認產品的庫存
    }
    function showSizeDark(targetItem) {
        AllSizeOptions.forEach(selectedSize => {
            selectedSize.classList.remove('checkSize');
        })
        targetItem.classList.add('checkSize')
    }
    function checkProductStock() {
        variants.forEach(el => {
            if (el.color_code === colorCode && el.size === sizeCode) {
                productStock = el.stock
                console.log(productStock)
            }
        })
    }

    // 點擊+ 變更數量
    function plusHandler() {
        if (itemPieces < productStock) {
            itemPieces = itemPieces + 1;
            document.getElementsByClassName('opt_Pieces')[0].value = itemPieces
        }
    }
    // 點擊- 變更數量
    function minusHandler() {
        if (itemPieces > 0) {
            itemPieces = itemPieces - 1;
            document.getElementsByClassName('opt_Pieces')[0].value = itemPieces
        }
    }



    ///////////////////加入購物車///////////////////

    const submit_Btn = document.querySelector('.purchase_Button');
    // 選取物件的資訊
    function itemDetail(detailData, colorName, colorCode, sizeCode, itemPieces, productStock) {
        return {
            uniqueId: detailData.id + colorCode + sizeCode,
            img: detailData.main_image,
            id: detailData.id,
            name: detailData.title,
            price: detailData.price,
            color: {
                name: colorName,
                code: colorCode,
            },
            size: sizeCode,
            qty: itemPieces,
            stock: productStock
        }
    }

    submit_Btn.addEventListener('submit', addItem);
    // 新增資料：將新增的資料丟入陣列中 －＞再將新陣列更新到資料庫中 －＞然後再把目前資料庫中的資料呈現於頁面

    function addItem(e) {
        //須先加上 event.preventDefault() 避免一直觸發 reload
        e.preventDefault()

        const addedItem = itemDetail(detailData, colorName, colorCode, sizeCode, itemPieces, productStock)
        const checkArray = JSON.parse(localStorage.getItem('item'))
        console.log(checkArray)

        //取得資料 －＞建立一個符合我們需求的物件資料 －＞將新物件加入我們的陣列
        //若localstorage 有資料，先搜尋是否已有相同項目加入購物車 (check id/size/color)
        if (checkArray) {
            let localItem = checkArray.find(function (arr) {
                return arr.uniqueId === addedItem.uniqueId;
            }); //(check id/size/color)
            let localItemId = checkArray.findIndex(function (el) {
                return el === localItem;
            }) //localstorage中該相同項目的索引
            console.log(addedItem.uniqueId)
            console.log(localItem)
            console.log(localItemId)

            //如果已有相同項目要判斷庫存
            if (localItem) {
                //找到重複項目的庫存數
                let originItem = variants.filter(function (el) {
                    return el.size === addedItem.size;
                })
                originItem = originItem.find(function (el) {
                    return el.color_code === addedItem.color.code;
                })
                let itemStock = originItem.stock
                console.log(itemStock)
                console.log(typeof (itemStock))
                console.log(localItem)
                //新項目數量加原始數量大於庫存不加入
                if (addedItem.qty + localItem.qty > itemStock) {
                    console.log('over')
                    return;
                }
                //新項目數量加原始數量小於或等於總庫存 －＞更新資料(將陣列修改成JSON字串再更新到資料庫中)
                else {
                    checkArray[localItemId].qty = addedItem.qty + localItem.qty
                    localStorage.setItem('item', JSON.stringify(checkArray))
                    console.log('only change qty')
                }
            }
            //沒有相同項目加入過則直接推入
            else {
                checkArray.push(addedItem)
                localStorage.setItem('item', JSON.stringify(checkArray))
                console.log('no same item, direct add')
            }
        }
        // localstorage沒有任何資料則直接推入
        else {
            const array = []
            array.push(addedItem)
            localStorage.setItem('item', JSON.stringify(array))
            console.log('local no data, direct add')
        }

        //將輸入欄位復歸
        document.getElementsByClassName('opt_Pieces')[0].value = 1;
        itemPieces = 1;

        //將購物車數量呈現在頁面上
        showCounter()
    }

}


///////////////////放大鏡///////////////////

const productMainImage = document.querySelector('.frame_product_MainImg');
//圖片的 mousemove & touchmove 事件
productMainImage.addEventListener("mousemove", magnifying);
productMainImage.addEventListener("touchmove", magnifying);
function magnifying(e) {
    //抓小方塊座標（小方塊跟著滑鼠跑）
    let rect = document.querySelector(".product_MainImg").getBoundingClientRect();
    let top = e.clientY - rect.top - 50;
    let left = e.clientX - rect.left - 50;
    //大圖座標
    let rectB = document.querySelector("#imgs").getBoundingClientRect();
    //限制小方塊移出圖片範圍
    if (top > rect.bottom - rect.top - 100) { top = rect.bottom - rect.top - 100 };
    if (top < 0) { top = 0 };
    if (left > rect.right - rect.left - 100) { left = rect.right - rect.left - 100 };
    if (left < 0) { left = 0 };
    //小方塊的動態位置
    document.querySelector('#small').style.left = left + "px";
    document.querySelector('#small').style.top = top + "px";
    //放大圖的動態相對位置參數（以中心點推算 top & left）
    let magnifyingTop = (top + 50) / (rect.bottom - rect.top) * 1200
    let magnifyingLeft = (left + 50) / (rect.right - rect.left) * 900
    //RWD
    if (rect.left < 3) {
        //縮小手機版的放大鏡尺寸
        document.querySelector('#big').style.width = "200px";
        document.querySelector('#big').style.height = "200px";
        //放大圖的動態相對位置
        document.querySelector('#imgs').style.top = `${-magnifyingTop + 100}px`;
        document.querySelector('#imgs').style.left = `${-magnifyingLeft + 100}px`;
        //放大鏡位置，隨滑鼠移動上下左右
        if (top < 200) {
            document.querySelector('#magnifyingGlass').style.top = `${top + 210}px`;
        } else {
            document.querySelector('#magnifyingGlass').style.top = `${top - 110}px`;
        }
        document.querySelector('#magnifyingGlass').style.left = `${left - 50}px`;
    } else {
        //放大圖的動態相對位置
        // document.querySelector('#imgs').style.top = `${-magnifyingTop + 175}px`;
        // document.querySelector('#imgs').style.left = `${-magnifyingLeft + 175}px`;
        if (-magnifyingTop + 175 < -850) {
            document.querySelector('#imgs').style.top = -850
        } else if (-magnifyingTop + 175 > 0) {
            document.querySelector('#imgs').style.top = 0
        } else { document.querySelector('#imgs').style.top = `${-magnifyingTop + 175}px` };
        if (-magnifyingLeft + 175 < -550) {
            document.querySelector('#imgs').style.left = -550
        } else if (-magnifyingLeft + 175 > 0) {
            document.querySelector('#imgs').style.left = 0
        } else { document.querySelector('#imgs').style.left = `${-magnifyingLeft + 175}px` };
        //放大鏡位置，只移動上下
        document.querySelector('#magnifyingGlass').style.top = (top + 30) + "px";
        document.querySelector('#magnifyingGlass').style.left = "58%";
    }
}
//圖片的 onmouseenter 事件
productMainImage.onmouseenter = function (e) {
    //顯示小方塊及放大鏡
    document.querySelector("#small").style.display = "initial";
    document.querySelector('#magnifyingGlass').style.display = 'block';
}
//圖片的 onmouseleave 事件
productMainImage.onmouseleave = function (e) {
    //隱藏小方塊及放大鏡
    document.querySelector("#small").style.display = "none";
    document.querySelector('#magnifyingGlass').style.display = 'none';
}