const api_path = "https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/ch.yu";

// ================================
// 取得所有產品列表
let totalGoods,
    $goodsList = document.querySelector("[data-goodsList]");

// 取得所有產品列表：get API
function getTotalGoods() {
    axios.get(`${api_path}/products`).then((res) => {
        totalGoods = res.data.products;
        renderTotalGoods(totalGoods);
    });
}
getTotalGoods();

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
let totalChart,
    $chartList = document.querySelector("[data-chartList]"),
    $totalCost = document.querySelector("[data-totalCost]");

// 取得購物車資料：get API
function getTotalChart() {
    axios.get(`${api_path}/carts`).then((res) => {
        totalChart = res.data;
        console.log("totalChart", totalChart);
        renderTotalChart(totalChart);
    });
}
getTotalChart();

// 將購物車列表渲染到畫面
// todo 商品加入購物車後正確的數量
function renderTotalChart(items) {
    $chartList.innerHTML = "";
    items["carts"].forEach((product) => {
        $chartList.innerHTML += `
        <li class="c-chartList__row">
            <div class="c-chartList__img">
                <img src="${product.product.images}" alt="${product.product.title}">
            </div>
            <div class="c-chartList__item">${product.product.title}</div>
            <div class="c-chartList__item">
                <div class="o-title o-title--md o-title--normal">NT$ <span>${product.product.price}</span></div>
            </div>
            <div class="c-chartList__item">${product.quantity}</div>
            <div class="c-chartList__item">
                <div class="o-title o-title--md o-title--normal">NT$ <span>${product.product.price * product.quantity}</span></div>
            </div>
            <div class="c-chartList__ico">
                <a href="#" data-chartId="${product.id}">
                    <i class="o-icon o-icon--clear"></i>
                </a>
            </div>
        </li> `;
    });
    // 顯示訂單總金額
    $totalCost.textContent = items.finalTotal;
    delSingleProduct();
}

// ================================
// 將商品加入購物車 + post API
function addToChart() {
    document.querySelectorAll("[data-addChart]").forEach((addToChartBtn) => {
        addToChartBtn.addEventListener("click", (e) => {
            e.preventDefault();
            let productId = addToChartBtn.getAttribute("data-addChart");
            // console.log("productId", productId);
            axios
                .post(`${api_path}/carts`, {
                    data: {
                        productId: productId,
                        quantity: 1,
                    },
                })
                .then((res) => {
                    let newTotalChart = res.data;
                    renderTotalChart(newTotalChart);
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
            let chartItemId = delChartItemBtn.getAttribute("data-chartId");
            axios.delete(`${api_path}/carts/${chartItemId}`).then((res) => {
                console.log("刪除成功", res);
                renderTotalChart(res.data);
            });
        });
    });
}

// 刪除購物車內的單筆商品+ delete API
document.querySelector("[data-emptyChart]").addEventListener("click", (e) => {
    e.preventDefault();
    axios.delete(`${api_path}/carts`).then((res) => {
        console.log("刪除全部成功", res);
        renderTotalChart(res.data);
    });
});
