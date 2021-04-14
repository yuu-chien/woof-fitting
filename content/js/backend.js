const api_admin_path = "https://hexschoollivejs.herokuapp.com/api/livejs/v1/admin/ch.yu";
const uid = "1bbgXGk3kMgjWsJg2zzJjJ7jJxA3";

// loading
function loading_start() {
    $('body').loading({
        stoppable: true,
        theme: 'dark',
        message: 'WORKING...',
    });
}

function loading_stop() {
    $('body').loading("stop");
}

loading_start();



let totalOrders,
    $ordersList = document.querySelector("[data-ordersList]");

function getAllOrder() {
    axios
        .get(`${api_admin_path}/orders`, {
            headers: {
                Authorization: uid,
            },
        })
        .then((res) => {
            totalOrders = res.data.orders;
            renderChart(totalOrders);
            renderTotalOrders(totalOrders);
        });
}
getAllOrder();

// 將所有訂單列表渲染到畫面
function renderTotalOrders(infos) {
    $ordersList.innerHTML = "";
    infos.forEach((order) => {
        // 把訂單中的商品名稱撈出來後放進陣列裡
        let orderDetails = [];
        for (let i = 0; i < order.products.length; i++) {
            orderDetails.push(order.products[i].title);
        }

        $ordersList.innerHTML += `<tr>
            <td class="c-table__td">${order.user.name}</td>
            <td class="c-table__td">${orderDetails}</td>
            <td class="c-table__td">${order.user.payment}</td>
            <td class="c-table__td">${order.paid}</td>
            <td class="c-table__td">${order.total}</td>
            <td class="c-table__td">
                <a href="" data-delOrder="${order.id}">
                    <i class="o-icon o-icon--clear"></i>
                </a>
            </td>
        </tr>`;
        // 綁上刪除特定訂單事件
        delOrder();
        loading_stop();
    });
}

// 刪除特定訂單
function delOrder() {
    document.querySelectorAll("[data-delOrder]").forEach((delOrderBtn) => {
        delOrderBtn.addEventListener("click", (e) => {
            e.preventDefault();
            let orderId = delOrderBtn.getAttribute("data-delOrder");

            axios
                .delete(`${api_admin_path}/orders/${orderId}`, {
                    headers: {
                        Authorization: uid,
                    },
                })
                .then((res) => {
                    console.log("刪除特定訂單成功");
                    renderTotalOrders(res.data.orders);
                });
        });
    });
}

// 刪除全部訂單
document.querySelector("[data-emptyOrders]").addEventListener("click", (e) => {
    e.preventDefault();
    console.log("123");
    axios
        .delete(`${api_admin_path}/orders`, {
            headers: {
                Authorization: uid,
            },
        })
        .then((res) => {
            console.log("刪除全部訂單成功");
            renderTotalOrders(res.data.orders);
        });
});

// =============
// C3

function renderChart(totalOrders) {

    let categories = {};
    let areaAry;
    totalOrders.forEach((item) => {

        item.products.forEach((i) => {

            if (categories[i.category] == undefined) {
                categories[i.category] = 1;
            } else {
                categories[i.category] += 1;
            }
        })

        areaAry = Object.keys(categories);

    });

    c3.generate({
        bindto: ".c-chart",
        data: {
            json: [categories],
            keys: {
                value: areaAry,
            },
            type: 'donut'
        }
    });

}
