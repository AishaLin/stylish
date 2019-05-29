showCartInformation()

function showCartInformation() {
    // 將資料庫的陣列取出
    let arrayJason = JSON.parse(localStorage.getItem('item'));
    let cartList = document.querySelector('.cart_product_Information')
    console.log(cartList)
    // 移除頁面原始資料，渲染localStorage資訊至頁面
    cartList.innerHTML = '';
    renderCartList(arrayJason);

    // 監聽事件1：點選件數，觸發計算金額
    const ChangePieces_PerItem = document.querySelectorAll('.Pieces_PerItem') //所有尺寸選項
    ChangePieces_PerItem.forEach(el=>el.addEventListener('change', changePiecesStatus))

    // 監聽事件2：移除項目，從資料庫移除該筆資料並觸發計算金額
    const trashcanImg = document.querySelectorAll('.cartRemoveImg') //所有垃圾桶選項
    trashcanImg.forEach(el=>el.addEventListener('click', removeItem))
};


// 從資料庫渲染資訊至頁面
function renderCartList(arrayJason) {
    let cart_product_Information = document.querySelector('.cart_product_Information')
    
    arrayJason.forEach(el => {

        //個別產品
        let cart_product_Information_PerItem = document.createElement('div')
        cart_product_Information_PerItem.className = 'cart_product_Information_PerItem'
        
        //刪除鍵
        let removeBtn = document.createElement('div')
        removeBtn.className = 'cart-remove'
        let cartRemoveImg = document.createElement('img')
        cartRemoveImg.className = 'cartRemoveImg'
        cartRemoveImg.setAttribute('src', "./img/cart-remove.png")

        //橫線
        let partition = document.createElement('hr')
        partition.setAttribute('align', 'center')
        partition.setAttribute('width', '100%')

        //產品圖及敘述
        let ImgAndDescription = document.createElement('div')
        ImgAndDescription.className = 'ImgAndDescription'

        let cart_product_Img_Frame = document.createElement('a')
        cart_product_Img_Frame.className = 'cart_product_Img_Frame'
        cart_product_Img_Frame.setAttribute('data-id', `${el.id}`) //產品id
        cart_product_Img_Frame.setAttribute('href', `product.html?id=${el.id}`)
        let cart_product_Img = document.createElement('img')
        cart_product_Img.className = 'cart_product_Img'
        cart_product_Img.setAttribute('src', `${el.img}`)
        cart_product_Img_Frame.setAttribute('href', `product.html?id=${el.id}`)

        let cart_product_Description = document.createElement('article')
        cart_product_Description.className = 'cart_product_Description'
        let itemName = document.createElement('h2')
        itemName.textContent = `${el.name}`
        let cart_productID = document.createElement('p')
        cart_productID.className = 'cart_productID'
        cart_productID.textContent = `${el.id}`
        let itemColor = document.createElement('p')
        itemColor.textContent = `顏色｜${el.color.name}`
        let itemSize = document.createElement('p')
        itemSize.textContent = `尺寸｜${el.size}`

        //產品件數及價格
        let cart_PiecesAndPrice_PerItem = document.createElement('div')
        cart_PiecesAndPrice_PerItem.className = 'cart_PiecesAndPrice_PerItem'

        let piecesAndSelector = document.createElement('div')
        piecesAndSelector.className = 'Frame_SubHeader_Mobile'
        let SubHeader1 = document.createElement('p')
        SubHeader1.className = 'SubHeader_Mobile'
        SubHeader1.textContent = '數量'
        let Form_PiecesAndPrice_PerItem = document.createElement('form')
        Form_PiecesAndPrice_PerItem.className = 'Form_PiecesAndPrice_PerItem'
        let Pieces_PerItem = document.createElement('select')
        Pieces_PerItem.setAttribute('name', 'Pieces_PerItem')
        Pieces_PerItem.setAttribute('class', 'Pieces_PerItem')
        // 選單數量不可高於庫存
        let checkStock = parseInt(el.stock) 
        for(var i = 0; i < checkStock; i++) {
            let pieces_PerItem = document.createElement('option')
            pieces_PerItem.setAttribute('value', 'pieces_PerItem')
            pieces_PerItem.className = 'pieces_PerItem'
            let allowpieces = i + 1
            pieces_PerItem.textContent = `${allowpieces}`
            Pieces_PerItem.appendChild(pieces_PerItem)
        }
        // 選欄預設為客戶選擇的數量
        var theSelectedOpt = Pieces_PerItem.getElementsByTagName('option')
        theSelectedOpt[el.qty-1].selected = true


        let ItemPrice = document.createElement('div')
        ItemPrice.className = 'Frame_SubHeader_Mobile'
        let SubHeader2 = document.createElement('p')
        SubHeader2.className = 'SubHeader_Mobile'
        SubHeader2.textContent = '單價'
        let SubHeader2_n = document.createElement('p')
        SubHeader2_n.className = 'price_PerPieces'
        SubHeader2_n.textContent = `NT. ${el.price}`

        let countPrice = document.createElement('div')
        countPrice.className = 'Frame_SubHeader_Mobile'
        let SubHeader3 = document.createElement('p')
        SubHeader3.className = 'SubHeader_Mobile'
        SubHeader3.textContent = '小計'
        let SubHeader3_n = document.createElement('p')
        SubHeader3_n.className = 'price_PerItem'

        // 小計
        let sumPrice_perItem = el.price*el.qty
        SubHeader3_n.textContent = `NT. ${sumPrice_perItem}`

        let space2 = document.createElement('div')
        space2.className = 'space2'

        //包起來
        cart_product_Information.appendChild(cart_product_Information_PerItem)
        cart_product_Information.appendChild(partition)
        removeBtn.appendChild(cartRemoveImg)

        cart_product_Information_PerItem.appendChild(ImgAndDescription)
        cart_product_Information_PerItem.appendChild(cart_PiecesAndPrice_PerItem)
        cart_product_Information_PerItem.appendChild(removeBtn)
        
        ImgAndDescription.appendChild(cart_product_Img_Frame)
        ImgAndDescription.appendChild(cart_product_Description)
        cart_product_Img_Frame.appendChild(cart_product_Img)
        cart_product_Description.appendChild(itemName)
        cart_product_Description.appendChild(cart_productID)
        cart_product_Description.appendChild(itemColor)
        cart_product_Description.appendChild(itemSize)

        cart_PiecesAndPrice_PerItem.appendChild(piecesAndSelector)
        cart_PiecesAndPrice_PerItem.appendChild(ItemPrice)
        cart_PiecesAndPrice_PerItem.appendChild(countPrice)
        cart_PiecesAndPrice_PerItem.appendChild(space2)

        piecesAndSelector.appendChild(SubHeader1)
        piecesAndSelector.appendChild(Form_PiecesAndPrice_PerItem)
        Form_PiecesAndPrice_PerItem.appendChild(Pieces_PerItem)
        
        ItemPrice.appendChild(SubHeader2)
        ItemPrice.appendChild(SubHeader2_n)
        countPrice.appendChild(SubHeader3)
        countPrice.appendChild(SubHeader3_n)

    });

    // 計算最後總金額（含運費）
    getSumPrice()
}


function getSumPrice() {
    let totalPrice = document.querySelector('.totalPrice')
    // 從innerHTML取得為object, 擷取需要的數字，轉換為string後再轉為數字計算
    let Freight = parseInt(String(document.querySelector('.Freight').innerHTML.match(/\d+/)))
    let totalPriceAndFreight = document.querySelector('.totalPriceAndFreight')
    let price_PerItem_All = document.querySelectorAll('.price_PerItem')
    let totalP = 0;
    for(var i = 0; i < price_PerItem_All.length; i++) {
        console.log(price_PerItem_All[i].innerHTML)
        let parPrice = parseInt(String(price_PerItem_All[i].innerHTML.match(/\d+/)))
        console.log(parPrice)
        totalP = totalP + parPrice;
    }
    console.log(totalP)
    console.log(Freight)
    totalPrice.textContent = totalP;
    totalPriceAndFreight.textContent = totalP + Freight;
};


// 件數綁定資料庫（修改資料時同步至資料庫數據，並重新更新相關資訊在頁面）
function changePiecesStatus(event) {
    //將目前頁面中的所有觸發元素選出來
    //轉為陣列
    const ChangePieces_PerItem = document.querySelectorAll('.Pieces_PerItem') //所有尺寸選項
    let piecesArray = Array.from(ChangePieces_PerItem);
    //取得觸發事件在所有觸發元素中的序列（也會相當於localstorage中資料的序列）
    let getIndex = piecesArray.indexOf(event.target);
    //將資料庫中的陣列資料叫出來
    let arrayJason = JSON.parse(localStorage.getItem('item'));

    //當 "Change" 事件發生時，將選取的資料更新
    //觸發的 selector 中，被選中的項目序列
    let selectIndex = ChangePieces_PerItem[getIndex].selectedIndex
    console.log(selectIndex)
    arrayJason[getIndex].qty = ChangePieces_PerItem[getIndex].options[selectIndex].text;
    
    //將新的資料陣列轉成 JSON string 結構
    let stringJson = JSON.stringify(arrayJason);
    //將新的 JSON string 丟到資料庫中
    localStorage.setItem(`item`, stringJson);
    //重新將資料呈現在頁面上
    console.log('pppppppppp')
    showCartInformation()
};


function removeItem() {
    //將目前頁面中的所有觸發元素選出來
    //轉為陣列
    const trashcanImg = document.querySelectorAll('.cartRemoveImg') //所有垃圾桶選項
    let trashcanArray = Array.from(trashcanImg);
    //取得觸發事件在所有觸發元素中的序列（也會相當於localstorage中資料的序列）
    let getIndex = trashcanArray.indexOf(event.target);
    //將資料庫中的陣列資料叫出來
    let arrayJason = JSON.parse(localStorage.getItem('item'));

    //當 click 事件觸發時，將陣列中該物件刪除
    arrayJason.splice(getIndex,1);
    
    //將新的資料陣列轉成 JSON string 結構
    let stringJson = JSON.stringify(arrayJason);
    //將新的 JSON string 丟到資料庫中
    localStorage.setItem(`item`, stringJson);
    //重新將資料呈現在頁面上
    console.log('rrrrrrrrrrr')
    showCartInformation()
    showCounter()
};
