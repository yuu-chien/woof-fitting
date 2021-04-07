
const api_path = "https://hexschoollivejs.herokuapp.com/api/livejs/v1/customer/ch.yu";


// 取得所有產品列表

let totalGoods,
    $goodsList = document.querySelector('[data-goodsList]');

// 取得所有產品列表：接 API
function getTotalGoods() {
    axios.get(`${api_path}/products`)
        .then((res) => {
            totalGoods = res.data.products;
            renderTotalGoods(totalGoods);
        });
}
getTotalGoods();

// 將產品列表渲染到畫面
function renderTotalGoods(infos) {
    $goodsList.innerHTML = '';
    infos.forEach((product) => {
        $goodsList.innerHTML += `
        <li class="l-viewList__item">
            <div class="c-card">
                <div class="c-card__img">
                    <img src="${product.images}" alt="${product.title}">
                </div>
                <div class="c-card__btn">
                    <a href="#" class="o-btn">
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
}

// 商品篩選
document.querySelectorAll(('[data-filter]')).forEach((item) => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        let conditions = item.getAttribute('data-filter');
        let filterGoods = [];
        totalGoods.filter((product) => {
            if (!conditions) {
                renderTotalGoods(totalGoods);
            } else if (conditions === product.category) {
                filterGoods.push(product);
                renderTotalGoods(filterGoods);
            }
        })
    });
});


// 取得購物車資料
let totalChart,
    $chartList = document.querySelector('[data-chartList]');

function getTotalChart() {
    axios.get(`${api_path}/carts`)
        .then((res) => {
            totalChart = res.data;
            renderTotalChart(totalChart)
        });
}

function renderTotalChart(items) {

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
                <div class="o-title o-title--md o-title--normal">NT$ <span>${items.finalTotal}</span></div>
            </div>
            <div class="c-chartList__ico">
                <a href="#">
                    <i class="o-icon o-icon--clear"></i>
                </a>
            </div>
        </li> `;
    })
}

getTotalChart();