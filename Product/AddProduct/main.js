

function checkLoginStatus() {
    
    let isLoggedIn = false; 

    if(getTokenFromCookie() && getUserIdFromCookie())
        {
            isLoggedIn = true;
        }

        else
        {
            isLoggedIn = false;
        }
    
    let loginContainer = document.getElementById("loginContainer");
    let ProductContainer = document.getElementById("view-product");
    if (isLoggedIn) {
        
        loginContainer.innerHTML = `
            <i class="fa-solid fa-user"></i>
            <button class="btn" onclick="logout()">Logout</button>

            
        `;

        ProductContainer.innerHTML = `
            <button onclick="gotoHomePage()">Home</button>

            <button class="btn" onclick="AddInvoice()">Add Invoice</button>
            
            <button class="btn" onclick="ViewAllInvoice()">All Invoice</button>
        `;
    } else {
        
        loginContainer.innerHTML = `
            <i class="fa-solid fa-user"></i>
            <button class="btn" onclick="goToLoginPage()">Login</button>
            <i class="fa-solid fa-user"></i>
            <button class="btn" onclick="goToSignupPage()">Signup</button>
        `;
    }
}

function getUserIdFromCookie() {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        const parts = cookie.trim().split('=');
        if (parts[0] === 'userId') {
            return parts[1];
        }
    }
    return false;
}

function getTokenFromCookie() {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        const parts = cookie.trim().split('=');
        if (parts[0] === 'token') {
            return parts[1];
        }
    }
    return false;
}


function logout() {
    const cookies = document.cookie.split(";");

    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";  
    }

    
    gotoHomePage()
}


function gotoHomePage()
{
    window.location.href = "../../index.html"
}

function ViewAllInvoice(){
    window.location.href = "../AllProduct/AllProduct.html";
}

function AddInvoice()
{
    window.location.href = "../AddProduct/AddProduct.html";
}






const addItemBtn = document.getElementById('addItemBtn');
const invoiceItems = document.getElementById('invoiceItems');

addItemBtn.addEventListener('click', () => {
    const newItem = document.createElement('div');
    newItem.classList.add('form-group', 'invoice-item'); 

    newItem.innerHTML = `
        <label for="productName">Product Name:</label>
        <input type="text" class="product" name="productName" required>
        <label for="quantity">Quantity:</label>
        <input type="number" class="product" name="quantity" required>
        <label for="price">Price:</label>
        <input type="number" class="product" name="price" required>
        <button class="delete-btn" type="button">Delete</button>
    `;

    // Add event listener to the delete button
    const deleteBtn = newItem.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => {
        newItem.remove(); // Remove the invoice item when delete button is clicked
    });

    invoiceItems.appendChild(newItem);
});


//post the data
document.addEventListener('DOMContentLoaded', () => {
    const productForm = document.getElementById('productForm');

    productForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent the default form submission

        const formData = {
            companyName: productForm.elements.companyName.value,
            companyAddress: productForm.elements.companyAddress.value,
            customerName: productForm.elements.customerName.value,
            customerAddress: productForm.elements.customerAddress.value,
            invoiceItems: []
        };

        // Iterate over invoice items and add them to the formData object
        const invoiceItemInputs = document.querySelectorAll('.invoice-item');
        invoiceItemInputs.forEach((itemInput) => {
            formData.invoiceItems.push({
                name: itemInput.querySelector('input[name="productName"]').value,
                quantity: itemInput.querySelector('input[name="quantity"]').value,
                price: itemInput.querySelector('input[name="price"]').value
            });
        });

    try{
        const response = await fetch('https://free-invoice.onrender.com/invoice/postinvoicedata', {

            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                'userId': getUserIdFromCookie(),
                'token': getTokenFromCookie()
            },
            body: JSON.stringify({
                companyName: formData.companyName,
                companyAddress: formData.companyAddress,
                customerName: formData.customerName,
                customerAddress: formData.customerAddress,
                invoiceItems: formData.invoiceItems
            })
        });

        if(response.ok)
        {
            const Data = await response.json();
            const errorElement = document.getElementById("loginError");
            errorElement.textContent = Data.message;
            errorElement.style.display = 'block';

            ViewAllInvoice();
        }
        else
        {
            const Data = await response.json();
            throw new Error(Data.message);
        }

    }
    catch(err)
    {
        const errorElement = document.getElementById("loginError");
        errorElement.textContent = err.message;
        errorElement.style.display = 'block';
    }
    });
});

function getUserIdFromCookie() {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        const parts = cookie.trim().split('=');
        if (parts[0] === 'userId') {
            return parts[1];
        }
    }
    return '';
}

function getTokenFromCookie() {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        const parts = cookie.trim().split('=');
        if (parts[0] === 'token') {
            return parts[1];
        }
    }
    return '';
}

window.onload = checkLoginStatus;
