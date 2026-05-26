// =============================
// API
// =============================
async function logout() {
    try {
        const response = await fetch("https://5872e08c-3af7-4c46-b35e-5e0455740393.mock.pstmn.io/api/logout", {
            method: 'POST',
            // credentials: "include"
        })

        if (response.ok) {
            window.location.href = "./loginPage.html"
        }
        else {
            throw new Error(`Server Error: ${response.status}`)
        }

    } catch (error) {
        console.log(error)
    }   
}

async function getOrders() {
    try {
        const response = await fetch("https://5872e08c-3af7-4c46-b35e-5e0455740393.mock.pstmn.io/api/orders?status_id=3")
        
        if (!response.ok) {
            throw new Error(`Server Error: ${response.status}`);
        }

        const data = await response.json()
        renderOrders(data.orders)

    } catch (error) {
        console.log(error)
    }
}

// =============================
// BUSINESS-LOGIC
// =============================
const redirectOrderDetails = orderId => {
    const redirectUrl = `./orderPage.html?mode=waiter&order_id=${orderId}`
    location.href = redirectUrl
}

const formatTime = date => date.split(" ")[1].slice(0, 5);

// =============================
// UI
// =============================
const renderOrders = (orders) => {
    for (const order of orders) {
        const ordersContainer = document.querySelector(".orders-list")

        const orderCard = document.createElement("div")
        orderCard.className = "order-card"
        orderCard.onclick = () => redirectOrderDetails(order.id)
        ordersContainer.appendChild(orderCard)

        const cardTop = document.createElement("div")
        cardTop.className = "card-top"
        orderCard.appendChild(cardTop)

        const orderIdContainer = document.createElement("div")
        orderIdContainer.className = "order-id"
        cardTop.appendChild(orderIdContainer)

        const statusDot = document.createElement("span")
        statusDot.className = "status-dot"
        orderIdContainer.appendChild(statusDot)

        const orderId = document.createElement("span")
        orderId.textContent = `Замовлення #${order.id}`
        orderIdContainer.appendChild(orderId)

        const orderTimeContainer = document.createElement("div")
        orderTimeContainer.className = "order-time"
        cardTop.appendChild(orderTimeContainer)

        const timeIcon = document.createElement("img")
        timeIcon.src = "./assets/icons/clock-4.svg"
        orderTimeContainer.appendChild(timeIcon)

        const orderTime = document.createElement("span")
        orderTime.textContent = formatTime(order.updated_at)
        orderTimeContainer.appendChild(orderTime)

        const cardMiddle = document.createElement("div")
        cardMiddle.className = "card-middle"
        orderCard.appendChild(cardMiddle)

        const tableBadge = document.createElement("div")
        tableBadge.className = "table-badge"
        tableBadge.textContent = `Стіл ${order.table_number}`
        cardMiddle.appendChild(tableBadge)

        const cardBottom = document.createElement("div")
        cardBottom.className = "card-bottom"
        orderCard.appendChild(cardBottom)

        const sumLabel = document.createElement("span")
        sumLabel.className = "sum-label"
        sumLabel.textContent = "Сума:"
        cardBottom.appendChild(sumLabel)

        const sumValue = document.createElement("span")
        sumValue.className = "sum-value"
        sumValue.textContent = `${order.total_price} ₴`
        cardBottom.appendChild(sumValue)
    }
}
 
// =============================
// CALLS
// =============================
getOrders()