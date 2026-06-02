// =============================
// API
// =============================
async function getDishes(category_id) {
    try {
        const response = await fetch(`https://5872e08c-3af7-4c46-b35e-5e0455740393.mock.pstmn.io/api/dish?category_id=${category_id}`)

        if (!response.ok) {
            throw new Error(`Server Error: ${response.status}`);
        }

        data = await response.json();
        renderDishes(data)

        const loaderDisplay = document.querySelector(".loader")
        const menuDisplay = document.querySelector(".menu")

        loaderDisplay.style.display = "none"
        menuDisplay.style.display = "block"

    } catch (error) {
        console.log(error)
    }
}


// =============================
// BUSINESS-LOGIC
// =============================
const addDish = (dishInfo) => {
    let storedDish = JSON.parse(localStorage.getItem(`vi_${dishInfo.id}`))

    const quantity = storedDish? ++storedDish.quantity : 1
    
    storedDish = {
        "id" : dishInfo.id,
        "name" : dishInfo.name,
        "price" : dishInfo.price,
        "quantity" : quantity
    }
    
    localStorage.setItem(`vi_${dishInfo.id}`, JSON.stringify(storedDish))
}


// =============================
// UI
// =============================
const renderDishes = (dishesInfo) => {
    for (const dishInfo of dishesInfo) {
        const container = document.querySelector(".dish-container")

        const dishElement = document.createElement("div")
        container.appendChild(dishElement)

        const dishImg = document.createElement("img")
        dishImg.src = dishInfo.image_path
        dishElement.appendChild(dishImg)

        const dishName = document.createElement("h3")
        dishName.textContent = dishInfo.name
        dishElement.appendChild(dishName)

        const dishDescription = document.createElement("p")
        dishDescription.textContent = dishInfo.description
        dishElement.appendChild(dishDescription)

        const dishPrice = document.createElement("span")
        dishPrice.textContent = `${dishInfo.price}₴`
        dishElement.appendChild(dishPrice)

        const dishAppendBtn = document.createElement("button")
        dishAppendBtn.textContent = "+ Додати"
        dishAppendBtn.onclick = () => addDish(dishInfo)
        dishElement.appendChild(dishAppendBtn)
    }
}


// =============================
// CALLS
// =============================
const categoryButtons = document.querySelectorAll(".category-container button");

categoryButtons.forEach(button => {
    button.addEventListener("click", (event) => {
        document.querySelector(".category-container button.active")?.classList.remove("active");
        
        event.target.classList.add("active");

        const loaderDisplay = document.querySelector(".loader");
        const menuDisplay = document.querySelector(".menu");
        loaderDisplay.style.display = "flex"; // возвращаем лоадер
        
        document.querySelector(".dish-container").innerHTML = "";

        const categoryId = event.target.getAttribute("data-category-id");
        getDishes(categoryId);
    });
});

getDishes(0);