// =============================
// API
// =============================
async function fetchOrders() {
    try {
        const response = await fetch(`${CONFIG.API_URL}/api/orders?admin=true`);
        if (!response.ok) throw new Error(`Server Error: ${response.status}`);
        const data = await response.json();
        return Array.isArray(data) ? data : [data];
    } catch (error) {
        console.error("Помилка завантаження замовлень:", error);
        return []; 
    }
}

async function fetchDishes() {
    try {
        const response = await fetch(`${CONFIG.API_URL}/api/dish?category_id=0`);
        if (!response.ok) throw new Error(`Server Error: ${response.status}`);
        const data = await response.json();
        return Array.isArray(data) ? data : [data];
    } catch (error) {
        console.error("Помилка завантаження страв:", error);
        return [];
    }
}

async function fetchCategories() {
    try {
        const response = await fetch(`${CONFIG.API_URL}/api/category`);
        if (!response.ok) throw new Error(`Server Error: ${response.status}`);
        const data = await response.json();
        return Array.isArray(data) ? data : [data];
    } catch (error) {
        console.error("Помилка завантаження категорій:", error);
        return [];
    }
}

async function saveDishToApi(dishData) {
    const method = dishData.id ? 'PUT' : 'POST';
    
    if (!dishData.id) {
        delete dishData.id;
    }

    try {
        const response = await fetch(`${CONFIG.API_URL}/api/dish`, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dishData)
        });

        if (!response.ok) throw new Error(`Server Error: ${response.status}`);
        
        console.log(`Страва успішно ${method === 'PUT' ? 'оновлена' : 'створена'}`);
        return true;
    } catch (error) {
        console.error(`Помилка збереження страви (${method}):`, error);
        return false;
    }
}

async function deleteDishFromApi(id) {
    try {
        const response = await fetch(`${CONFIG.API_URL}/api/dish/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) throw new Error(`Server Error: ${response.status}`);
        
        return true;
    } catch (error) {
        console.error("Помилка видалення страви:", error);
        return false;
    }
}

async function uploadDishImage(file, oldImagePath = '') {
    const formData = new FormData();
    formData.append('image', file);
    
    if (oldImagePath) {
        formData.append('old_image_path', oldImagePath);
    }

    const response = await fetch('/api/dish/upload', { 
        method: 'POST',
        body: formData 
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
}

document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('dishImageInput');
    const hiddenPathInput = document.getElementById('hiddenImagePath');

    if (fileInput) {
        fileInput.addEventListener('change', async (event) => {
            const file = event.target.files[0];
            if (!file) return;

            if (file.size > 5 * 1024 * 1024) {
                alert('Файл занадто великий. Максимум 5 МБ.');
                fileInput.value = ''; 
                return;
            }

            const oldImagePath = hiddenPathInput.value;
            
            const textElement = event.target.parentElement.querySelector('p');

            if (textElement) textElement.textContent = 'Завантаження...';

            try {
                const result = await uploadDishImage(file, oldImagePath);
                
                if (result.success) {
                    hiddenPathInput.value = result.path;
                    console.log('Зображення завантажено. Шлях:', result.path);
                    
                    if (textElement) textElement.textContent = `Завантажено: ${file.name}`;
                } else {
                    alert('Помилка завантаження: ' + result.error);
                    fileInput.value = '';
                    if (textElement) textElement.textContent = 'Натисніть для завантаження або перетягніть файл';
                }
            } catch (error) {
                console.error('Upload error:', error);
                alert('Сталася помилка при відправці файлу на сервер.');
                fileInput.value = '';
                if (textElement) textElement.textContent = 'Натисніть для завантаження або перетягніть файл';
            }
        });
    }
});


async function logout() {
    renderLoader()

    try {
        const response = await fetch(`${CONFIG.API_URL}/api/logout`, {
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

async function checkAuth() {
    renderLoader()

    const response = await fetch("", {
        method: 'POST',
        credentials: "include"
    })

    if (!response.ok) {
        location.href = "./loginPage.js"
    }

    getOrders()
}

// =============================
// BUSINESS-LOGIC
// =============================
let allOrders = []; 
let currentSort = { column: null, direction: 'asc' }; 

let allDishes = []; 
let globalCategories = [];

const ORDER_STATUSES = [
    { id: 1, name: 'Скасований' },
    { id: 2, name: 'Сплачений' },
    { id: 3, name: 'В роботі' }
];

const filterOrdersData = (orders, statusTerm, dateFrom, dateTo) => {
    return orders.filter(order => {
        const orderStatus = order.status_name || '';
        const matchesStatus = statusTerm === 'Усі статуси' || orderStatus === statusTerm;

        let matchesDate = true;
        const orderDateObj = new Date(order.updated_at || '');

        if (!isNaN(orderDateObj.getTime())) {
            if (dateFrom) {
                const from = new Date(dateFrom);
                from.setHours(0, 0, 0, 0); 
                if (orderDateObj < from) matchesDate = false;
            }
            if (dateTo && matchesDate) {
                const to = new Date(dateTo);
                to.setHours(23, 59, 59, 999); 
                if (orderDateObj > to) matchesDate = false;
            }
        }
        return matchesStatus && matchesDate;
    });
};

const sortOrdersData = (orders, column, direction) => {
    if (!column) return orders;
    return [...orders].sort((a, b) => {
        let valA, valB;
        if (column === 'id') { valA = a.order_id; valB = b.order_id; }
        else if (column === 'table') { valA = a.table_number; valB = b.table_number; }
        else if (column === 'price') { valA = a.total_price; valB = b.total_price; }
        else if (column === 'items') { 
            valA = a.dishes ? a.dishes.reduce((sum, d) => sum + d.quantity, 0) : 0; 
            valB = b.dishes ? b.dishes.reduce((sum, d) => sum + d.quantity, 0) : 0; 
        }
        else if (column === 'datetime') { valA = a.updated_at; valB = b.updated_at; }
        else if (column === 'status') { valA = a.status_name; valB = b.status_name; }

        if (column === 'price' || column === 'table' || column === 'items' || column === 'id') {
            valA = Number(valA) || 0; valB = Number(valB) || 0;
        } else {
            valA = String(valA || '').toLowerCase(); valB = String(valB || '').toLowerCase();
        }

        if (valA < valB) return direction === 'asc' ? -1 : 1;
        if (valA > valB) return direction === 'asc' ? 1 : -1;
        return 0;
    });
};

const calculateTotals = (orders) => {
    const totalSum = orders.reduce((sum, order) => sum + Number(order.total_price || 0), 0);
    return { count: orders.length, sum: totalSum };
};

// =============================
// UI
// =============================
let isOrdersLoaded = false;
let isDishesLoaded = false;

const renderLoader = () => {
    const loader = document.getElementById('loader-overlay')
    if(loader) loader.style.display = 'flex'
}

const removeLoader = () => {
    const loader = document.getElementById('loader-overlay')
    if(loader) loader.style.display = 'none'
}


function switchTab(tabName) {
    document.getElementById('dishesSection').style.display = 'none';
    document.getElementById('ordersSection').style.display = 'none';

    document.getElementById('nav-dishes').classList.remove('active');
    document.getElementById('nav-orders').classList.remove('active');

    const addDishBtn = document.getElementById('nav-add-dish');

    if (tabName === 'dishes') {
        document.getElementById('dishesSection').style.display = 'block';
        document.getElementById('nav-dishes').classList.add('active');
        addDishBtn.classList.remove('disabled');
        
        if (!isDishesLoaded) {
            initDishesPage();
            isDishesLoaded = true;
        }
    } 
    else if (tabName === 'orders') {
        document.getElementById('ordersSection').style.display = 'block';
        document.getElementById('nav-orders').classList.add('active');
        addDishBtn.classList.add('disabled');
        
        if (!isOrdersLoaded) {
            initAdminPage();
            isOrdersLoaded = true;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    switchTab('dishes'); 
});

const getStatusClass = (statusName) => {
    switch (statusName) {
        case 'Сплачений': return 'status-done';
        case 'В роботі': return 'status-process';
        case 'Скасований': return 'status-cancel';
        default: return '';
    }
};

const formatDateTime = (dbDateString) => {
    if (!dbDateString) return '-';
    if (/[а-яА-ЯіІїЇєЄ]/.test(dbDateString)) return dbDateString; 
    const dateObj = new Date(dbDateString);
    if (isNaN(dateObj.getTime())) return dbDateString;
    return dateObj.toLocaleString('uk-UA', { 
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
};

const renderStatusesFilter = () => {
    const select = document.getElementById('statusFilter');
    if (!select) return;
    select.innerHTML = '<option value="Усі статуси">Усі статуси</option>';
    ORDER_STATUSES.forEach(status => {
        const option = document.createElement('option');
        option.value = status.name;
        option.textContent = status.name;
        select.appendChild(option);
    });
};

const updateSortArrows = (activeColumn, direction) => {
    document.querySelectorAll('th[data-sort]').forEach(th => {
        const arrow = th.querySelector('.sort-arrow');
        if (!arrow) return;
        if (th.dataset.sort === activeColumn) {
            arrow.textContent = direction === 'asc' ? '↑' : '↓';
            arrow.style.opacity = '1';
        } else {
            arrow.textContent = '↓';
            arrow.style.opacity = '0.3';
        }
    });
};

const renderTotals = (count, sum) => {
    const ordersCountSpan = document.getElementById('ordersCount');
    const totalSumSpan = document.getElementById('totalSum');
    if (ordersCountSpan) ordersCountSpan.textContent = count;
    if (totalSumSpan) totalSumSpan.textContent = sum.toLocaleString('uk-UA');
};

const renderOrders = (orders) => {
    const tableBody = document.getElementById('ordersTableBody');
    if (!tableBody) return;
    tableBody.innerHTML = '';

    if (orders.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #7A7A7A; padding: 20px;">Замовлень не знайдено</td></tr>`;
        renderTotals(0, 0);
        return;
    }

    for (const order of orders) {
        const row = document.createElement('tr');
        const orderIdFormatted = order.order_id ? `#${order.order_id.toString().padStart(3, '0')}` : '#000';
        const tableNum = order.table_number || '-';
        const itemsCount = order.dishes ? order.dishes.reduce((sum, dish) => sum + dish.quantity, 0) : 0;
        const price = order.total_price || 0;
        const statusName = order.status_name || 'В роботі';
        const datetime = order.updated_at ? formatDateTime(order.updated_at) : '-';

        row.innerHTML = `
            <td class="receipt-id">${orderIdFormatted}</td>
            <td>
                <div class="table-cell-group">
                    <div class="table-badge">${tableNum}</div>
                    Стіл ${tableNum}
                </div>
            </td>
            <td>${itemsCount}</td>
            <td class="price">${price} ₴</td>
            <td><span class="status-badge ${getStatusClass(statusName)}">${statusName}</span></td>
            <td>${datetime}</td>
        `;
        tableBody.appendChild(row);
    }
    const totals = calculateTotals(orders);
    renderTotals(totals.count, totals.sum);
};

function renderDishesGrid(dishes) {
    const grid = document.getElementById('dishesGrid');
    if (!grid) return;
    grid.innerHTML = '';

    dishes.forEach(dish => {
        const isAvailable = dish.is_available === 1;
        const overlayHtml = !isAvailable ? `<div class="dish-overlay"><span class="badge-stop">Немає в наявності</span></div>` : '';
        const imageSrc = dish.image_path || 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';

        const card = document.createElement('div');
        card.className = 'dish-card';

        card.innerHTML = `
            <div class="dish-image-wrapper">
                <img src="${imageSrc}" alt="${dish.name}">
                ${overlayHtml}
            </div>
            <div class="dish-info">
                <div class="dish-name">${dish.name}</div>
                <div class="dish-desc">${dish.description || ''}</div>
                <button class="btn-edit-card" onclick="openDishModal(${dish.id})">Редагувати</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function populateCategorySelect() {
    const select = document.getElementById('dishCategory');
    if (!select) return;
    select.innerHTML = '<option value="" disabled selected>Оберіть категорію...</option>';
    globalCategories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = cat.name;
        select.appendChild(option);
    });
}

function openDishModal(dishId = null) {
    const modal = document.getElementById('dishModal');
    const title = modal.querySelector('h3');
    const btnDelete = document.getElementById('btnDeleteDish');

    if (dishId) {

        const dish = allDishes.find(d => Number(d.id) === Number(dishId));
        if (!dish) return;

        title.textContent = 'Редагувати страву';
        btnDelete.style.display = 'block';

        document.getElementById('hiddenDishId').value = dish.id;
        document.getElementById('dishName').value = dish.name || '';
        document.getElementById('dishCategory').value = dish.category_id || '';
        document.getElementById('dishDescription').value = dish.description || '';
        document.getElementById('dishWeight').value = dish.weight || '';
        document.getElementById('dishPrice').value = dish.price || '';
        document.getElementById('dishIsAvailable').checked = Number(dish.is_available) === 1;
        document.getElementById('hiddenImagePath').value = dish.image_path || '';
    } else {

        title.textContent = 'Додати страву';
        btnDelete.style.display = 'none';

        document.getElementById('hiddenDishId').value = '';
        document.getElementById('dishName').value = '';
        document.getElementById('dishCategory').value = '';
        document.getElementById('dishDescription').value = '';
        document.getElementById('dishWeight').value = '';
        document.getElementById('dishPrice').value = '';
        document.getElementById('dishIsAvailable').checked = true;
        document.getElementById('hiddenImagePath').value = '';
        document.getElementById('dishImageInput').value = '';
        document.querySelector('.upload-zone p').textContent = 'Натисніть для завантаження або перетягніть файл';
    }
    
    modal.style.display = 'flex';
}

function closeDishModal() {
    document.getElementById('dishModal').style.display = 'none';
}

window.openAddDishModal = () => openDishModal(null);

// =============================
// CALLS
// =============================

async function initDishesPage() {
    try {
        const [categories, dishes] = await Promise.all([
            fetchCategories(),
            fetchDishes()
        ]);
        globalCategories = categories;
        allDishes = dishes;
        
        populateCategorySelect();
        renderDishesGrid(allDishes);
    } catch (error) {
        console.error("Помилка ініціалізації меню:", error);
    }
}

document.getElementById('btnSaveDish')?.addEventListener('click', async () => {
    const dishData = {
        id: document.getElementById('hiddenDishId').value,
        name: document.getElementById('dishName').value,
        category_id: document.getElementById('dishCategory').value,
        description: document.getElementById('dishDescription').value,
        weight: document.getElementById('dishWeight').value,
        price: document.getElementById('dishPrice').value,
        is_available: document.getElementById('dishIsAvailable').checked ? 1 : 0,
        image_path: document.getElementById('hiddenImagePath').value
    };

    if (!dishData.name || !dishData.category_id || !dishData.price) {
        alert("Помилка: Заповніть всі обов'язкові поля (Назва, Категорія, Ціна)!");
        return;
    }
    const success = await saveDishToApi(dishData);
    if (success) {
        closeDishModal();
        initDishesPage(); 
    } else {
        alert("Помилка збереження!");
    }
});

document.getElementById('btnDeleteDish')?.addEventListener('click', async () => {
    const id = document.getElementById('hiddenDishId').value;
    if (!id) return;

    if (confirm('Ви впевнені, що хочете видалити цю страву?')) {
        const success = await deleteDishFromApi(id);
        if (success) {
            closeDishModal();
            initDishesPage(); 
        } else {
            alert("Помилка видалення!");
        }
    }
});

const applyFiltersAndSort = () => {
    const statusFilter = document.getElementById('statusFilter');
    const dateFrom = document.getElementById('dateFrom');
    const dateTo = document.getElementById('dateTo');
    if (!statusFilter) return;

    const statusTerm = statusFilter.value;
    const fromVal = dateFrom ? dateFrom.value : '';
    const toVal = dateTo ? dateTo.value : '';

    let processedOrders = filterOrdersData(allOrders, statusTerm, fromVal, toVal);
    processedOrders = sortOrdersData(processedOrders, currentSort.column, currentSort.direction);
    renderOrders(processedOrders);
};

const handleSortClick = (event) => {
    const th = event.currentTarget;
    const column = th.dataset.sort;

    if (currentSort.column === column) {
        currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
        currentSort.column = column;
        currentSort.direction = 'asc';
    }
    updateSortArrows(currentSort.column, currentSort.direction);
    applyFiltersAndSort();
};

document.getElementById('statusFilter')?.addEventListener('change', applyFiltersAndSort);
document.getElementById('dateFrom')?.addEventListener('change', applyFiltersAndSort);
document.getElementById('dateTo')?.addEventListener('change', applyFiltersAndSort);
document.querySelectorAll('th[data-sort]').forEach(th => th.addEventListener('click', handleSortClick));

const initAdminPage = async () => {
    renderStatusesFilter(); 
    allOrders = await fetchOrders();
    applyFiltersAndSort(); 
};