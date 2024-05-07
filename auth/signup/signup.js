// scripts.js
document.addEventListener('DOMContentLoaded', function() {
    
    const signupForm = document.getElementById('signupForm');

    signupForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        

        try{
            const respose  = await fetch("https://free-invoice.onrender.com/signup",{
                method: "post",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    { email: email, 
                    password: password }
                )

        });


        if(respose.ok)
            {
                const responseData = await respose.json();

                //make the user to show that login Successfull
                const errorElement = document.getElementById("loginError");
                console.log(responseData);
                
                errorElement.textContent = responseData.message;
                errorElement.style.display = 'block';

                

            }
            else
            {   
                const responseData = await respose.json();
                throw new Error(responseData.message);
            }
    }
    catch(err)
    {   
        
            const errorElement = document.getElementById("loginError");
            errorElement.textContent = err.message;
            errorElement.style.display = 'block';
    }



        console.log('Sign up clicked. Email:', email, 'Password:', password);
        // You can make AJAX requests here to your backend for user registration
    });
});

//Surfing through pages

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

    
    window.location.reload();
}



function goToLoginPage() {
    
    window.location.href = "../login/login.html";
}


function goToSignupPage() {
    
    window.location.href = "./signup.html";
}


function ViewAllInvoice(){
    window.location.href = "../../Product/AllProduct/AllProduct.html";
}

function AddInvoice()
{
    window.location.href = "../../Product/AddProduct/AddProduct.html";
}

function HomePage()
{
    window.location.href  = "../../index.html";
}


window.onload = checkLoginStatus;
