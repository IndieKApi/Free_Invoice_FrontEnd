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
        
        console.log("kapil");
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
    window.location.href = "../../docs/index.html"
}

function ViewAllInvoice(){
    window.location.href = "../AllProduct/AllProduct.html";
}

function AddInvoice()
{
    window.location.href = "../AddProduct/AddProduct.html";
}







document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('https://free-invoice.onrender.com/invoice/yourinvoices', {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'userId': getUserIdFromCookie(),
                'token': getTokenFromCookie()
            }
        });
        const data = await response.json();

        const invoiceList = document.getElementById('invoiceList');

        data.data.forEach(invoice => {
            const invoiceDiv = document.createElement('div');
            invoiceDiv.classList.add('invoice');

            let invoiceItemsHTML = '';

            invoice.invoiceItems.forEach(item => {
                invoiceItemsHTML += `
                    <div class="invoice-item">
                        <p>Name: ${item.name}</p>
                        <p>Quantity: ${item.quantity}</p>
                        <p>Price: $${item.price}</p>
                    </div>
                `;
            });

            invoiceDiv.innerHTML = `
                <p><strong>Company Name:</strong> ${invoice.companyName}</p>
                <p><strong>Company Address:</strong> ${invoice.companyAddress}</p>
                <p><strong>Customer Name:</strong> ${invoice.customerName}</p>
                <p><strong>Customer Address:</strong> ${invoice.customerAddress}</p>
                <div class="invoice-items">
                    <p><strong>Invoice Items:</strong></p>
                    ${invoiceItemsHTML}
                </div>
                <button onclick="downloadInvoice('${invoice._id}')">Download Invoice</button>
            `;

            invoiceList.appendChild(invoiceDiv);
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});

async function downloadInvoice(invoiceId) {
    try {
        const response = await fetch(`https://free-invoice.onrender.com/invoice?invoiceid=${invoiceId}`, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
                'userId': getUserIdFromCookie(),
                'token': getTokenFromCookie()
            }
        });

        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `invoice_${invoiceId}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        } else {
            console.error('Error downloading invoice');
        }
    } catch (error) {
        console.error('Error downloading invoice:', error);
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
