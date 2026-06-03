// =============================
// API
// =============================
async function addSubOrder() {
    try {
        const tableNumber = localStorage.getItem("table_number");
        const tableToken = localStorage.getItem("table_token");

        if (storedDishes.length === 0) {
            alert("Кошик порожній!");
            return;
        }

        const orderPayload = {
            table_number: tableNumber,
            table_token: tableToken,
            items: storedDishes
        };

        const response = await fetch(`${CONFIG.API_URL}/api/order_items`, {
            method: "POST",
            headers: {'Content-Type': "application/json"},
            body: JSON.stringify(orderPayload)
        });
        
        if (!response.ok) {
            throw new Error(`Server Error: ${response.status}`);
        }

        storedDishes = [];
        clearStoredDishes();
        renderSuborderSum(calculateSuborderSum());
        document.querySelector(".suborder-container").innerHTML = "";
        
        alert("Замовлення успішно надіслано на кухню!");
        loadTableDetails();       
    } catch (error) {
        console.error("Помилка відправки підзамовлення:", error);
    }
}

async function loadTableDetails() {
    try {
        const tableNumber = localStorage.getItem("table_number");
        if (!tableNumber) return;

        const response = await fetch(`${CONFIG.API_URL}/api/orders?restaurant_table=${tableNumber}`);
        if (!response.ok) {
            throw new Error(`Server Error: ${response.status}`);
        }

        const orderData = await response.json();
        
        renderTableTotalSum(orderData.price_without_discount)
    } catch (error) {
        console.error("Помилка завантаження суми столу:", error);
    }
}

// =============================
// BUSINESS-LOGIC
// =============================
const clearStoredDishes = () => {
    const storageKeys = Object.keys(localStorage)

    for (const key of storageKeys){
        if (key.startsWith("vi_")){
            localStorage.removeItem(key)
        }
    }
}


const getStoredDishes = () => {
    const storageKeys = Object.keys(localStorage)
    const storedDishes = []

    for (const key of storageKeys){
        if (key.startsWith("vi_")){
            storedDishes.push(JSON.parse(localStorage.getItem(key)))
        }
    }

    return storedDishes
}

const calculateSuborderSum = () => {
    let suborderSum = 0
    for (storedDish of storedDishes){
        suborderSum += storedDish.price * storedDish.quantity
    }
    return suborderSum
}

const deleteDish = (dishId, viewElement) => {
    localStorage.removeItem(`vi_${dishId}`)
    viewElement.remove()
    storedDishes = getStoredDishes()
    renderSuborderSum(calculateSuborderSum(storedDishes))
}

const increaseDish = (dishElement) => {
    ++dishElement.quantity
    localStorage.setItem(`vi_${dishElement.id}`, JSON.stringify(dishElement))

    storedDishes = getStoredDishes()
    renderSuborderSum(calculateSuborderSum(storedDishes))

    renderUpdateElement(dishElement)
}

const decreaseDish = (dishElement, viewElement) => {
    --dishElement.quantity
    if (!dishElement.quantity){
        deleteDish (dishElement.id, viewElement)
    } else {
        localStorage.setItem(`vi_${dishElement.id}`, JSON.stringify(dishElement))

        storedDishes = getStoredDishes()
        renderSuborderSum(calculateSuborderSum(storedDishes))

        renderUpdateElement(dishElement)
    }
}

// =============================
// UI
// =============================
const backLink = document.querySelector(".back-link")
backLink.href = `./menuPage.html?token=${localStorage.getItem("table_token")}`

const renderSuborderSum = (suborderSum) => {
    const suborderSumField = document.querySelector(".suborder-sum")
    suborderSumField.textContent = `${suborderSum}₴`
}

const renderDishElements = (dishElements) => {
    const container = document.querySelector(".suborder-container")
    for (const storedDish of dishElements){
        const dishElement = document.createElement("div")
        dishElement.id = storedDish.id
        container.appendChild(dishElement)

        const dishTitle = document.createElement("h3")
        dishTitle.textContent = storedDish.name
        dishElement.appendChild(dishTitle)

        const dishPriceContainer = document.createElement("div")
        dishElement.appendChild(dishPriceContainer)

        const dishPrice = document.createElement("span")
        dishPrice.textContent = `${storedDish.price}₴ `
        dishPriceContainer.appendChild(dishPrice)

        const decreaseDishBtn = document.createElement("button")
        decreaseDishBtn.onclick = () => decreaseDish(storedDish, dishElement)
        decreaseDishBtn.textContent = "-"
        dishPriceContainer.appendChild(decreaseDishBtn)

        const dishQuantity = document.createElement("span")
        dishQuantity.id = `vi-${storedDish.id}-quantity`
        dishQuantity.textContent = storedDish.quantity
        dishPriceContainer.appendChild(dishQuantity)

        const increaseDishBtn = document.createElement("button")
        increaseDishBtn.textContent = "+"
        increaseDishBtn.onclick = () => increaseDish(storedDish)
        dishPriceContainer.appendChild(increaseDishBtn)

        const dishDeleteBtn = document.createElement("img")
        dishDeleteBtn.src = "./assets/icons/trash-2.svg"
        dishDeleteBtn.onclick = () => deleteDish(storedDish.id, dishElement)
        dishElement.appendChild(dishDeleteBtn)
    }
}

const renderUpdateElement = (dishElement) => {
    const dishQuantity = document.getElementById(`vi-${dishElement.id}-quantity`)
    dishQuantity.textContent = dishElement.quantity
}

const renderTableInfo = () => {
    const tableNumber = localStorage.getItem("table_number");
    const tableNumSpan = document.querySelector(".nav-bar h1 span");
    if (tableNumSpan && tableNumber) {
        tableNumSpan.textContent = tableNumber;
    }
};

const renderTableTotalSum = (totalSum) => {
    const totalSumSpan = document.querySelector(".total-sum");
    if (totalSumSpan) {
        totalSumSpan.textContent = `${totalSum}₴`;
    }
};

// =============================
// CALLS
// =============================
let storedDishes = getStoredDishes()
renderDishElements(storedDishes)

renderSuborderSum(calculateSuborderSum())

renderTableInfo();

loadTableDetails();