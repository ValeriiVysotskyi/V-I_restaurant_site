document.getElementById("login-form").addEventListener("submit", async function(event) {
    event.preventDefault()
    const formContainer = event.target

    const errorMessage = document.getElementById("errorMessage")
    errorMessage.style.display = "none"

    const submitBtn = document.querySelector(".submit-btn")
    submitBtn.textContent = "Триває вхід..."
    submitBtn.disabled = true

    const formData = new FormData(formContainer)
    const data = Object.fromEntries(formData.entries(formData))

    try {
        const response = await fetch("https://5872e08c-3af7-4c46-b35e-5e0455740393.mock.pstmn.io/api/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(data)
        })

        const result = await response.json();

        if (response.ok && result.success) {
            window.location.href = result.redirect
        }
        else {
            errorMessage.textContent = "Помилка авторизації"
            errorMessage.style.display = "block"
            submitBtn.textContent = "Увійти"
            submitBtn.disabled = false
        }

    } catch (error) {
        errorMessage.textContent = "Помилка з'єднання із сервером. Спробуйте пізніше"
        errorMessage.style.display = "block"
        console.log(error)
    }
})