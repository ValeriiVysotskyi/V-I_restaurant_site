// =============================
// API
// =============================
async function logout() {
    renderLoader()

    try {
        const response = await fetch(`${CONFIG.API_URL}/api/logout`, {
            method: 'POST',
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
        console.log(`${CONFIG.API_URL}/api/orders?status_id=3`)
        const response = await fetch(`${CONFIG.API_URL}/api/orders?status_id=3`)
        
        if (!response.ok) {
            throw new Error(`Server Error: ${response.status}`)
        }

        const data = await response.json()
        renderOrders(data)

        removeLoader()

    } catch (error) {
        removeLoader()
        console.log(error)
    }
}

async function getOrderDetails(orderId) {
    try {
        const response = await fetch(`${CONFIG.API_URL}/api/orders?order_id=${orderId}`)

        if (!response.ok) {
            throw new Error(`Server Error: ${response.status}`)
        }

        
        const data = await response.json()

        return data

    } catch (error) {
        console.log(error)
    }   
}

async function getDiscountInfo() {
    try {
        const response = await fetch(`${CONFIG.API_URL}/api/discount_type`)

        if (!response.ok) {
            throw new Error(`Server Error: ${response.status}`)
        }

        const data = await response.json()
        return data

    } catch (error) {
        console.log(error)
    }   
}

async function updateDishQuantityApi(orderId, dishId, quantity) {
    if (quantity === 0) {
        const response = await fetch(`${CONFIG.API_URL}/api/orders/delete`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order_id: orderId, dish_id: dishId })
        })
        if (!response.ok) throw new Error('Помилка при видаленні страви')
    } else {
        const response = await fetch(`${CONFIG.API_URL}/api/orders/${orderId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ order_id: orderId, dish_id: dishId, quantity: quantity })
        })
        if (!response.ok) throw new Error('Помилка при оновленні страви')
    }
        
    return true
}

async function updateOrderStatusApi(orderId, statusId) {
    const response = await fetch(`${CONFIG.API_URL}/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            id: currentOrder.order_id,
            status_id: 1,
            table_number: currentOrder.table_number,
            discount_type_id: 1,
            total_price: 0,
            price_without_discount: currentOrder.price_without_discount,
            payment_method: null
        })
    })
    
    if (!response.ok) {
        throw new Error('Помилка при зміні статусу замовлення')
    }
    
    return true
}

async function closeOrderApi(orderData) {
    const response = await fetch(`${CONFIG.API_URL}/api/orders/${orderData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
    })
    if (!response.ok) throw new Error('Помилка при закритті чеку')
    return true
}


// =============================
// BUSINESS-LOGIC
// =============================
const formatTime = date => date.split(" ")[1].slice(0, 5)

let currentOrder = null
let currentDiscounts = []

function recalculateOrderPrices() {
    if (!currentOrder || !currentOrder.dishes) return

    let newPriceWithoutDiscount = 0
    currentOrder.dishes.forEach(dish => {
        newPriceWithoutDiscount += dish.price_at_purchase * dish.quantity
    })

    currentOrder.price_without_discount = newPriceWithoutDiscount

    document.querySelector(".sub-total-sum").textContent = `${newPriceWithoutDiscount} грн`
    
    const backgroundCardSum = document.querySelector(`.order-card[data-order-id="${currentOrder.order_id}"] .sum-value`)
    if (backgroundCardSum) {
        backgroundCardSum.textContent = `${newPriceWithoutDiscount} ₴`
    }

    renderUpdateDiscount()
}


// =============================
// APP-LOGIC
// =============================
async function handleOpenOrder(orderId) {
    renderLoader()

    try {
        const orderInfo = await getOrderDetails(orderId)
        const discountInfo = await getDiscountInfo()

        currentOrder = orderInfo
        currentDiscounts = discountInfo

        renderOrderDetails(orderInfo, discountInfo)

        removeLoader()
        const modal = document.getElementById('order-modal')
        modal.showModal()

    } catch (error) {
        removeLoader()
    }
}

async function changeQuantity(dishId, delta) {
    if (!currentOrder) return
    
    const dish = currentOrder.dishes.find(d => Number(d.dish_id) === Number(dishId))
    if (!dish) return
    const newQuantity = Number(dish.quantity) + delta

    if (newQuantity <= 0) {
        await deleteDish(dishId)
        return
    }

    renderLoader()
    try {
        await updateDishQuantityApi(currentOrder.order_id, dishId, newQuantity)

        dish.quantity = newQuantity

        const itemContainer = document.querySelector(`.order-item[data-dish-id="${dishId}"]`)
        if (itemContainer) {
            itemContainer.querySelector('.qty-value').textContent = newQuantity
            itemContainer.querySelector('.price-total').textContent = `${dish.price_at_purchase * newQuantity} грн`
            itemContainer.querySelector('.price-calc').textContent = `${dish.price_at_purchase} грн × ${newQuantity}`
        }

        recalculateOrderPrices()
    } catch (error) {
        alert(error.message)
    } finally {
        removeLoader()
    }
}

async function deleteDish(dishId) {
    if (!currentOrder) return

    if (!confirm("Ви впевнені, що хочете видалити цю страву з замовлення?")) return

    renderLoader()
    try {
        await updateDishQuantityApi(currentOrder.order_id, dishId, 0)

        currentOrder.dishes = currentOrder.dishes.filter(d => d.dish_id !== dishId)

        const itemElement = document.querySelector(`.order-item[data-dish-id="${dishId}"]`)
        if (itemElement) {
            itemElement.remove()
        }

        recalculateOrderPrices()
    } catch (error) {
        alert(error.message)
    } finally {
        removeLoader()
    }
}

async function handleCancelOrderSubmit() {
    if (!currentOrder) return

    renderLoader()
    try {
        await updateOrderStatusApi(currentOrder.order_id, 1)
        
        closeCancelModal()
        closeOrderDetails()
        
        window.location.reload()
    } catch (error) {
        alert(error.message)
        removeLoader()
    }
}

async function handleCheckoutSubmit() {
    if (!currentOrder) return

    renderLoader()
    try {
        const paymentSelect = document.getElementById('payment-method')
        const paymentMethodText = paymentSelect.options[paymentSelect.selectedIndex].text.replace(/💳 |💵 /, '')

        const discountSelect = document.getElementById('discount-select')

        const selectedDiscountObj = currentDiscounts.find(d => d.rate == discountSelect.value) || {}
        const discountTypeId = selectedDiscountObj.id || null

        const totalSumText = document.querySelector(".total-sum").textContent
        const totalPrice = parseFloat(totalSumText.split(" ")[0])

        const checkoutData = {
            id: currentOrder.order_id,
            status_id: 2,
            table_number: currentOrder.table_number,
            discount_type_id: discountTypeId,
            total_price: totalPrice,
            price_without_discount: currentOrder.price_without_discount,
            payment_method: paymentMethodText
        }

        await closeOrderApi(checkoutData)

        closeCloseOrderModal()
        closeOrderDetails()
        
        window.location.reload()
    } catch (error) {
        alert(error.message)
        removeLoader()
    }
}


// =============================
// UI
// =============================
const renderOrders = (orders) => {
    const ordersContainer = document.querySelector(".orders-list")
    ordersContainer.innerHTML = ""

    for (const order of orders) {
        const orderCard = document.createElement("div")
        orderCard.className = "order-card"
        orderCard.dataset.orderId = order.id
        orderCard.onclick = () => handleOpenOrder(order.id)
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
        sumValue.textContent = `${order.price_without_discount} ₴`
        cardBottom.appendChild(sumValue)
    }
}

const renderOrderDetails = (order, discounts) => {
    const tableNumber = document.querySelector(".table-number")
    tableNumber.textContent = `Стіл ${order.table_number}`

    const orderNumber = document.querySelector(".order-number")
    orderNumber.textContent = `Замовлення #${order.order_id}`

    const updatedTime = document.querySelector(".update-time")
    updatedTime.textContent = formatTime(order.updated_at)

    const dishContainer = document.querySelector(".order-items-list")
    dishContainer.innerHTML = ""
    for (const dish of order.dishes) {
        const totalDishPrice = dish.price_at_purchase * dish.quantity
        const itemHTML = `
            <div class="order-item" data-dish-id="${dish.dish_id}">
                <img src="${dish.image_path}" class="item-img" alt="${dish.dish_name}">
                <div class="item-main-info">
                    <div class="item-title">${dish.dish_name}</div>
                    <div class="item-quantity-controls">
                        <button type="button" class="qty-btn" onclick="changeQuantity(${dish.dish_id}, -1)">−</button>
                        <span class="qty-value">${dish.quantity}</span>
                        <button type="button" class="qty-btn" onclick="changeQuantity(${dish.dish_id}, 1)">+</button>
                    </div>
                </div>
                <div class="item-price-info">
                    <div class="price-total">${totalDishPrice} грн</div>
                    <div class="price-calc">${dish.price_at_purchase} грн × ${dish.quantity}</div>
                </div>
                <button type="button" class="item-delete-btn" onclick="deleteDish(${dish.dish_id})">
                    <img src="./assets/icons/trash-2.svg">
                </button>
            </div>
        `
        dishContainer.insertAdjacentHTML('beforeend', itemHTML)
    }

    const discountSelect = document.getElementById('discount-select')
    let optionsHTML = ``
    for (const discount of discounts) {
        optionsHTML += `<option value="${discount.rate}">${discount.name} (${discount.rate*100}%)</option>`
    }
    discountSelect.innerHTML = optionsHTML

    document.querySelector(".sub-total-sum").textContent = `${order.price_without_discount} грн`
    document.querySelector(".total-sum").textContent = `${order.price_without_discount} грн`
    
    renderUpdateDiscount()
}

const closeOrderDetails = () => {
    document.querySelector(".order-items-list").innerHTML = ""
    currentOrder = null
    const modal = document.getElementById('order-modal')
    modal.close()
}

const renderUpdateDiscount = () => {
    const discoutRow = document.getElementById('discount-row')
    const selectedDiscount = document.getElementById('discount-select')
    if (!selectedDiscount) return

    const rate = parseFloat(selectedDiscount.value)
    const name = selectedDiscount.options[selectedDiscount.selectedIndex].textContent

    const totalSumElement = document.querySelector(".total-sum")
    const subTotalSumText = document.querySelector(".sub-total-sum").textContent
    const subTotalSum = parseFloat(subTotalSumText.split(" ")[0]) || 0

    discoutRow.style.display = rate !== 0 ? "flex" : "none"

    const discountLabel = document.getElementById("discount-label")
    discountLabel.textContent = name

    const discountValue = document.getElementById("discount-value")
    const calculatedDiscount = (subTotalSum * rate).toFixed(2)
    discountValue.textContent = `-${calculatedDiscount} грн`

    const finalSum = (subTotalSum - calculatedDiscount).toFixed(2)
    totalSumElement.textContent = `${finalSum} грн`

    const checkoutFinalSum = document.getElementById("checkout-final-sum")
    if (checkoutFinalSum) {
        checkoutFinalSum.textContent = `${finalSum} грн`
    }
}

const openCloseOrderModal = () => {
    const closeOrderModal = document.getElementById("checkout-confirm-overlay")
    closeOrderModal.style.display = "flex"
    renderUpdateDiscount()
}

const closeCloseOrderModal = () => {
    const closeOrderModal = document.getElementById("checkout-confirm-overlay")
    closeOrderModal.style.display = "none"
}

const openCancelModal = () => {
    const cancelModal = document.getElementById("cancel-confirm-overlay")
    cancelModal.style.display = 'flex'
}

const closeCancelModal = () => {
    const cancelModal = document.getElementById("cancel-confirm-overlay")
    cancelModal.style.display = 'none'
}

const renderLoader = () => {
    const loader = document.getElementById('loader-overlay')
    if(loader) loader.style.display = 'flex'
}

const removeLoader = () => {
    const loader = document.getElementById('loader-overlay')
    if(loader) loader.style.display = 'none'
}

document.addEventListener("DOMContentLoaded", () => {
    const btnCancelYes = document.getElementById("btn-cancel-yes")
    if (btnCancelYes) {
        btnCancelYes.onclick = handleCancelOrderSubmit
    }

    const btnCheckoutSubmit = document.getElementById("btn-checkout-submit")
    if (btnCheckoutSubmit) {
        btnCheckoutSubmit.onclick = handleCheckoutSubmit
    }
})
 
// =============================
// CALLS
// =============================
getOrders()

setInterval(() => {
    if (!currentOrder) {
        getOrders();
    }
}, 60000);