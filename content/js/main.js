const api_path = "https://livejs-api.hexschool.io/api/livejs/v1/customer/ch.yu";

// loading
function loading_start() {
    $("body").loading({
        stoppable: true,
        theme: "dark",
        message: "LOADING...",
    });
}

function loading_stop() {
    $("body").loading("stop");
}

// ================================
// 取得所有產品列表
let totalGoods;
const $goodsList = document.querySelector("[data-goodsList]");
const $cartTable = document.querySelector("[data-cart-table]");
const $cartHint = document.querySelector("[data-cart-hint]");

// 取得所有產品列表：get API
function getTotalGoods() {
    axios
        .get(`${api_path}/products`)
        .then((res) => {
            totalGoods = res.data.products;
            renderTotalGoods(totalGoods);
        })
        .catch((err) => {
            console.log(err);
        });
}

// 將產品列表渲染到畫面
function renderTotalGoods(infos) {
    $goodsList.innerHTML = "";
    infos.forEach((product) => {
        $goodsList.innerHTML += `
        <li class="l-viewList__item">
            <div class="c-card">
                <div class="c-card__img">
                    <img src="${product.images}" alt="${product.title}">
                </div>
                <div class="c-card__btn">
                    <a href="#" class="o-btn" data-addChart="${product.id}">
                        <span>加入購物車</span>
                    </a>
                </div>
                <div class="c-card__tit">
                    <div class="o-title o-title--md">${product.title}</div>
                </div>
                <div class="c-card__bottom">
                    <del class="o-title o-title--md o-title--normal">NT$ <span>${product.origin_price}</span></del>
                    <div class="o-title o-title--normal">NT$ <span>${product.price}</span></div>
                </div>
                <div class="c-card__tag">
                    <div class="o-tag">New</div>
                </div>
            </div>
        </li>`;
    });
    // 在「加入購物車」按鈕綁上新增商品到購物車事件
    addToChart();
    loading_stop();
}

// ================================
// 商品篩選
document.querySelectorAll("[data-filter]").forEach((item) => {
    item.addEventListener("click", (e) => {
        e.preventDefault();
        let conditions = item.getAttribute("data-filter");
        let filterGoods = [];
        totalGoods.filter((product) => {
            if (!conditions) {
                renderTotalGoods(totalGoods);
            } else if (conditions === product.category) {
                filterGoods.push(product);
                renderTotalGoods(filterGoods);
            }
        });
    });
});

// ================================
// 取得購物車資料
let totalChart;
const $cartList = document.querySelector("[data-cartList]");
const $totalCost = document.querySelector("[data-totalCost]");

// 取得購物車資料：get API
function getTotalChart() {
    axios
        .get(`${api_path}/carts`)
        .then((res) => {
            totalChart = res.data;
            renderTotalChart(totalChart);
        })
        .catch((err) => {
            console.log(err);
        });
}

// 將購物車列表渲染到畫面
// todo 商品加入購物車後正確的數量
function renderTotalChart(items) {
    // 若購物車內無商品則顯示提示，有商品則顯示列表
    if (items.carts.length === 0) {
        $cartTable.classList.add("u-hidden");
        $cartHint.classList.remove("u-hidden");
    } else {
        $cartTable.classList.remove("u-hidden");
        $cartHint.classList.add("u-hidden");
    }
    $cartList.innerHTML = "";
    items["carts"].forEach((product) => {
        $cartList.innerHTML += `
        <tr>
            <td class="c-table__td c-table__td--h">
                <div class="o-cartImg">
                    <img src="${product.product.images}" alt="${product.product.title}" />
                </div>
                <div>${product.product.title}</div>
            </td>
            <td class="c-table__td">${product.product.price}</td>
            <td class="c-table__td u-tac">${product.quantity}</td>
            <td class="c-table__td">${product.product.price * product.quantity}</td>
            <td class="c-table__td">
                <a href="#" data-chartId="${product.id}">
                    <i class="o-icon o-icon--clear"></i>
                </a>
            </td>
        </tr>
         `;
    });
    // 顯示訂單總金額
    $totalCost.textContent = items.finalTotal;
    delSingleProduct();
    loading_stop();
}

// ================================
// 將商品加入購物車 + post API
function addToChart() {
    $cartTable.classList.remove("u-hidden");
    $cartHint.classList.add("u-hidden");
    document.querySelectorAll("[data-addChart]").forEach((addToChartBtn) => {
        addToChartBtn.addEventListener("click", (e) => {
            e.preventDefault();
            loading_start();
            let productId = addToChartBtn.getAttribute("data-addChart");
            axios
                .post(`${api_path}/carts`, {
                    data: {
                        productId: productId,
                        quantity: 1,
                    },
                })
                .then((res) => {
                    let newTotalChart = res.data;
                    alertify.success("Add Success !", 3);
                    renderTotalChart(newTotalChart);
                })
                .catch((err) => {
                    alertify.error("Add Fail. Please try again later.");
                    //console.log(err);
                });
        });
    });
}

// ================================
// 刪除購物車內的單筆商品 + delete API
function delSingleProduct() {
    document.querySelectorAll("[data-chartId]").forEach((delChartItemBtn) => {
        delChartItemBtn.addEventListener("click", (e) => {
            e.preventDefault();
            loading_start();
            let chartItemId = delChartItemBtn.getAttribute("data-chartId");
            axios
                .delete(`${api_path}/carts/${chartItemId}`)
                .then((res) => {
                    // console.log("刪除成功", res);
                    renderTotalChart(res.data);
                })
                .catch((err) => {
                    console.log(err);
                });
        });
    });
}

// 刪除購物車內的全部商品+ delete API
document.querySelector("[data-emptyChart]").addEventListener("click", (e) => {
    e.preventDefault();
    loading_start();
    axios
        .delete(`${api_path}/carts`)
        .then((res) => {
            // console.log("刪除全部成功", res);
            $cartTable.classList.add("u-hidden");
            $cartHint.classList.remove("u-hidden");
            renderTotalChart(res.data);
        })
        .catch((err) => {
            console.log(err);
        });
});

// 送出訂單
const $sentOrderHint = document.querySelector("[data-sentOrder-hint]");
// 驗證電話與電子郵件正則表達式
let phoneRule = /[0-9]{8}/;
let emailRule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;

document.querySelector("[data-sentOrder]").addEventListener("click", (e) => {
    e.preventDefault();
    loading_start();

    let $orderName = document.querySelector("#order-name"),
        $orderPhone = document.querySelector("#order-phone"),
        $orderEmail = document.querySelector("#order-email"),
        $orderAddress = document.querySelector("#order-address"),
        $orderPayment = document.querySelector("#order-payment");

    let orderInfo = {
        data: {
            user: {
                name: "",
                tel: "",
                email: "",
                address: "",
                payment: "",
            },
        },
    };

    function checkingInput() {
        if (emailRule.test($orderEmail.value) && phoneRule.test($orderPhone.value)) {
            $sentOrderHint.classList.remove("is-show");
            orderInfo.data.user.name = $orderName.value;
            orderInfo.data.user.tel = $orderPhone.value;
            orderInfo.data.user.email = $orderEmail.value;
            orderInfo.data.user.address = $orderAddress.value;
            orderInfo.data.user.payment = $orderPayment.value;

            axios
                .post(`${api_path}/orders`, orderInfo)
                .then((res) => {
                    //console.log("送出訂單", res);
                    orderInfo = {
                        data: {
                            user: {
                                name: "",
                                tel: "",
                                email: "",
                                address: "",
                                payment: "",
                            },
                        },
                    };
                    $cartList.innerHTML = "";
                    $totalCost.textContent = 0;
                    $cartTable.classList.add("u-hidden");
                    $cartHint.classList.remove("u-hidden");
                    $orderName.value = "";
                    $orderPhone.value = "";
                    $orderEmail.value = "";
                    $orderAddress.value = "";
                    $orderPayment.value = "";
                    $sentOrderHint.classList.remove("is-show");
                    loading_stop();
                    alertify.success("Order Success !", 3);
                })
                .catch((err) => {
                    $sentOrderHint.classList.add("is-show");
                    loading_stop();
                });
        } else {
            loading_stop();
            $sentOrderHint.classList.add("is-show");
        }
    }

    checkingInput();
});

// 初始化
function init() {
    loading_start(); // 啟動 loading 動畫
    getTotalGoods(); // 取得所有產品列表
    getTotalChart(); // 取得購物車列表
}
init();
