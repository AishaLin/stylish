// 根據TapPay文件
TPDirect.setupSDK(12348, 'app_pa1pQcKoY22IlnSXq5m5WP5jFKzoRG58VEXpT7wU62ud7mMbDOGzCYIlzzLF', 'sandbox');
TPDirect.card.setup({
    fields: {
        number: {
            // css selector
            element: '#card-number',
            placeholder: '**** **** **** ****'
        },
        expirationDate: {
            // DOM object
            element: document.getElementById('card-expiration-date'),
            placeholder: 'MM / YY'
        },
        ccv: {
            element: '#card-ccv',
            placeholder: '後三碼'
        }
    },
    styles: {
        // Style all elements
        'input': {
            'color': 'gray'
        },
        // Styling ccv field
        'input.cvc': {
            // 'font-size': '16px'
        },
        // Styling expiration-date field
        'input.expiration-date': {
            // 'font-size': '16px'
        },
        // Styling card-number field
        'input.card-number': {
            // 'font-size': '16px'
        },
        // style focus state
        ':focus': {
            // 'color': 'black'
        },
        // style valid state
        '.valid': {
            'color': 'green'
        },
        // style invalid state
        '.invalid': {
            'color': 'red'
        },
        // Media queries
        // Note that these apply to the iframe, not the root window.
        '@media screen and (max-width: 400px)': {
            'input': {
                'color': 'orange'
            }
        }
    }
})


TPDirect.card.onUpdate(function (update) {
    // update.canGetPrime === true
    // --> you can call TPDirect.card.getPrime()
    if (update.canGetPrime) {
        // Enable submit Button to get prime.
        // submitButton.removeAttribute('disabled')
    } else {
        // Disable submit Button to get prime.
        // submitButton.setAttribute('disabled', true)
    }

    // cardTypes = ['mastercard', 'visa', 'jcb', 'amex', 'unknown']
    if (update.cardType === 'visa') {
        // Handle card type visa.
    }

    // number 欄位是錯誤的
    if (update.status.number === 2) {
        // setNumberFormGroupToError()
    } else if (update.status.number === 0) {
        // setNumberFormGroupToSuccess()
    } else {
        // setNumberFormGroupToNormal()
    }

    if (update.status.expiry === 2) {
        // setNumberFormGroupToError()
    } else if (update.status.expiry === 0) {
        // setNumberFormGroupToSuccess()
    } else {
        // setNumberFormGroupToNormal()
    }

    if (update.status.cvc === 2) {
        // setNumberFormGroupToError()
    } else if (update.status.cvc === 0) {
        // setNumberFormGroupToSuccess()
    } else {
        // setNumberFormGroupToNormal()
    }
})

// call TPDirect.card.getPrime when user submit form to get tappay prime
// $('form').on('submit', onSubmit)

function onSubmit(event) {
    event.preventDefault()

    // 取得 TapPay Fields 的 status
    const tappayStatus = TPDirect.card.getTappayFieldsStatus()

    // 確認是否可以 getPrime
    if (tappayStatus.canGetPrime === false) {
        alert('信用卡資訊錯誤，請確認資訊是否正確，謝謝！')
        return
    }

    if (check_Information_Completeness()) {
         // Get prime
        TPDirect.card.getPrime((result) => {
            if (result.status !== 0) {
                alert('get prime error ' + result.msg)
                return
            }
            // alert('get prime 成功，prime: ' + result.card.prime)

            const postObj = getPostDetail(result.card.prime)
            console.log(postObj)
            orderCheckOutAPI(postObj) 

            // send prime to your server, to pay with Pay by Prime API .
            // Pay By Prime Docs: https://docs.tappaysdk.com/tutorial/zh/back.html#pay-by-prime-api
        })
    }   
}


const ConfirmPaymentBtn = document.querySelector('.ConfirmPaymentBtn');
const necessary_information = document.querySelectorAll('.necessary_information');
const shippingTime_checked = document.querySelectorAll('.shippingTime_checked');
let shippingTime_checkOk = false;

// 確認資料完整性
function check_Information_Completeness() {
    // 先確認購物車是否有商品再檢查個人資訊
    if (localStorage.getItem('item') === "[]") {
        alert("購物車內沒有東西");
        return false;
    } else {
        for (var i = 0; i < necessary_information.length; i++) {
            if (necessary_information[i].value.replace(/(^s*)|(s*$)/g, "").length === 0 || typeof necessary_information[i].value === "null" ) {
                alert("訂購資料尚未填寫完整，請再確認！");
                return false;
            } 
        }
        // shippingTime_information 有三個選項，逐一檢查偵測到有勾選就 checkOK 跳出迴圈
        for (var i = 0; i < shippingTime_checked.length; i++) {
            if (shippingTime_checked[i].checked === true) {
                shippingTime_checkOk = true;
                break;
            } 
        }
        if (shippingTime_checkOk) {
            alert("訂單資料已填妥，請稍待系統作業，暫勿關閉視窗！")
            return true;
        } else {
            alert("尚未勾選配送時間，請再確認！");
            return false;
        }
    }
}


// 要 Post 給後端確認的陣列資料（收件資訊及商品清單）
function getPostDetail(primeKey) {
    const deliveryCountry = document.querySelector('select.select_Country').value
    const deliveryWay = document.querySelector('select.select_Payment').value
    const totalPrice = parseInt(String(document.querySelector('.totalPrice').innerHTML))
    const freightFee = parseInt(String(document.querySelector('.Freight').innerHTML.match(/\d+/)))
    const consumer = document.querySelector('#consumer_Name').value
    const phone = document.querySelector('#tel').value
    const email = document.querySelector('#email').value
    const address = document.querySelector('#address').value
    // const deliverTime = getShippingTime()
    const orderList = getProductList()
    const totalPriceAndFreight = totalPrice + freightFee
    return {
        prime: primeKey,
        order: {
        shipping: deliveryCountry,
        payment: "credit_card",
        subtotal: totalPrice,
        freight: freightFee,
        total: totalPriceAndFreight,
        recipient: {
            name: consumer,
            phone: phone,
            email: email,
            address: address,
            // time: deliverTime
        },
        list: orderList
        }
    }
}

// 選購的商品清單
function getProductList() {
    const cartData = JSON.parse(localStorage.getItem('item'))
    const orderList = cartData.map(el=>{
      return {
        uniqueId: el.uniqueId,
        productID: el.id,
        name: el.name,
        price:el.price,
        color: {
          name: el.color.name,
          code: el.color.code
        },
        size: el.size,
        qty: el.qty
      }
    })
    return orderList
}

// 取得配送時間
let selectedShippingTime = null;
function getShippingTime() {
    for (var i = 0; i < shippingTime_checked.length; i++) {
        if (shippingTime_checked[i].checked === true) {
            selectedShippingTime = shippingTime_checked[i].value;
            break;
        } 
        return selectedShippingTime
    }
}


// 連接 check out API 傳遞訂單資訊，待後端確認資料完備後導入 thank you page

if(!localStorage.getItem('order')) {
    localStorage.setItem('order',JSON.stringify([]))
}

let orderNumber = null;
function orderCheckOutAPI(obj) {
    const url = `https://api.appworks-school.tw/api/1.0/order/checkout`
    console.log(JSON.stringify(obj))

    fetch(url,{
        method: 'Post',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(obj)
    })
    .then(res=>res.json())
    .then(json=>{
        // 確認 check out result 是否 ok
        let CheckOutResult = json.data
        if(CheckOutResult) {
            // 確認後 localstorage 加入訂單編號資訊，並導入 thank you page
            console.log(json)
            orderNumber = json.data.number
            let orderNum = {
                orderID: orderNumber
            }
            console.log(orderNum)
            let orderConfirmed = JSON.parse(localStorage.getItem('order'))
            console.log(orderConfirmed)
            orderConfirmed.push(orderNum)
            localStorage.setItem('order', JSON.stringify(orderConfirmed))
            window.location.pathname = `thankyou.html`
            console.log(orderNumber)
        } else {
            console.log(json)
            alert('訂單發生錯誤，請聯繫賣家。');
        } 
    })
}

ConfirmPaymentBtn.addEventListener('submit', onSubmit)

