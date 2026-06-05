// =============================
// API
// =============================
async function getCategories() {
    try {
        const response = await fetch(`${CONFIG.API_URL}/api/category`);
        
        if (!response.ok) {
            throw new Error(`Ошибка при загрузке категорий: ${response.status}`);
        }

        const categories = await response.json();
        renderCategoryButtons(categories);

    } catch (error) {
        alert("Не вдалося завантажити категорії");
    }
}

async function getDishes(category_id) {
    try {
        
        const container = document.querySelector(".dish-container");
        container.innerHTML = "";

        const response = await fetch(`${CONFIG.API_URL}/api/dish?category_id=${category_id}`);

        if (!response.ok) {
            throw new Error(`Server Error: ${response.status}`);
        }

        const data = await response.json();
        renderDishes(data);

    } catch (error) {
        console.error("Помилка при завантаженні блюд:", error);
        document.querySelector(".loader").style.display = "none";
    }
}

async function getTableInfo(token) {
    try {
        const response = await fetch(`${CONFIG.API_URL}/api/restaurant_table?token=${token}`);
        
        if (!response.ok) {
            throw new Error(`Ошибка стола: ${response.status}`);
        }

        const tableData = await response.json();
        localStorage.setItem("table_number", tableData.number);
    } catch (error) {
        console.error("Не вдалося перевірити токен стола:", error);
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

async function initializeMenuPage() {
    const loaderDisplay = document.querySelector(".loader")
    const menuDisplay = document.querySelector(".menu")

    loaderDisplay.style.display = "flex"
    menuDisplay.style.display = "none"

    await getCategories()
    getDishes(0)

    loaderDisplay.style.display = "none"
    menuDisplay.style.display = "block"
}


// =============================
// UI
// =============================
const renderCategoryButtons = (categories) => {
    const container = document.querySelector(".category-container");
    container.innerHTML = "";

    const allButton = document.createElement("button");
    allButton.className = "category-button active";
    allButton.setAttribute("data-category-id", "0");
    allButton.textContent = "Усі страви";
    container.appendChild(allButton);

    categories.forEach(category => {
        const button = document.createElement("button");
        button.className = "category-button";
        button.setAttribute("data-category-id", category.id);
        button.textContent = category.name;
        container.appendChild(button);
    });

    setupCategoryClicks();
};

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
const urlParams = new URLSearchParams(window.location.search);
const tokenFromUrl = urlParams.get("token");

if (tokenFromUrl) {
    localStorage.setItem("table_token", tokenFromUrl);
    getTableInfo(tokenFromUrl);
} else if (!localStorage.getItem("table_token")) {
    console.warn("table_token not found");
}

function setupCategoryClicks() {
    const categoryButtons = document.querySelectorAll(".category-container button");
    
    categoryButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            document.querySelector(".category-container button.active")?.classList.remove("active");
            event.target.classList.add("active");

            const categoryId = event.target.getAttribute("data-category-id");
            getDishes(categoryId);
        });
    });
}



initializeMenuPage()