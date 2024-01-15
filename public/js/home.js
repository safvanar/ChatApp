//sign up logic
const signupElements = {
    name: signup_form.querySelector('input[name="Name"]'),
    email: signup_form.querySelector('input[name="Email"]'),
    phoneNo: signup_form.querySelector('input[name="PhoneNumber"]'),
    password1: signup_form.querySelector('input[name="Password1"]'),
    password2: signup_form.querySelector('input[name="Password2"]'),
    signup_btn: signup_form.querySelector('input[type="submit"]'),
    alert1: signup_form.querySelector('#alert1'),
    alert2: signup_form.querySelector('#alert2'),
    alert3: signup_form.querySelector('#alert3'),
}

signupElements.signup_btn.addEventListener('click', on_Signup);

async function on_Signup(e) {
    try {
        if (signup_form.checkValidity()) {
            e.preventDefault();
            if (signupElements.password1.value === signupElements.password2.value) {
                const data = {
                    name: signupElements.name.value,
                    email: signupElements.email.value,
                    phone: signupElements.phoneNo.value,
                    password: signupElements.password1.value
                }
                console.log(data)
               const response = await axios.post("/user/signup", data);
               console.log(response)
               if(response.data.success){
                    signup_form.reset();
                    alertFunction(signupElements.alert3);
                    setTimeout(() => {
                        window.location.href = "/";
                    }, 3000)
               }else{
                 throw new Error('User registration could not be completed!')
               }
            } else {
                alertFunction(signupElements.alert2);
            }
        }

    } catch (error) {
        if (error.response && error.response.status === 409) {
            e.preventDefault();
            alertFunction(signupElements.alert1);
        } else {
            alert("Something went wrong - signup agin")
            console.error("An error occurred:", error);
        }
    }
}

const signinElements =  {
    username: signin_form.querySelector('input[name = "Email"]'),
    password: signin_form.querySelector('input[name = "Password"]'),
    signin_btn: signin_form.querySelector('input[type = "submit"]'),
    alert1: signin_form.querySelector('#alert1'),
    alert2: signin_form.querySelector('#alert2'),
    alert3: signin_form.querySelector('#alert3')
}

signinElements.signin_btn.addEventListener('click', on_Signin)

async function on_Signin(e){
    try{
        if(signin_form.checkValidity()){
            e.preventDefault()
            const data = {
                username: signinElements.username.value,
                password: signinElements.password.value
            }
            const response = await axios.post('/user/signin', data)
            if(response.status === 200){
                signin_form.reset();
                alertFunction(signinElements.alert3);
                setTimeout(() => {
                    window.location.href = '/user/home';
                }, 3000)
            }
        }
    }catch(err){
        if(err.response && err.response.status === 401){
            alertFunction(signinElements.alert2)
        }else if(err.response && err.response.status === 404){
            alertFunction(signinElements.alert1)
        }else{
            alert("Something went wrong - Sign in again");
            console.log(error);
        }
    }
}

const alertFunction = function(div){
    div.classList.remove('d-none');
    div.classList.add('d-block');
    setTimeout(() => {
        div.classList.remove('d-block');
        div.classList.add('d-none');
    }, 3000);
}