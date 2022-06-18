var login_button = document.getElementById("login");
console.log((3==3 || 6>6));
login_button.onclick = function () {
  var email = document.getElementById("InputEmail");
  var password = document.getElementById("InputPassword");
  var firstname = document.getElementById("InputFirstname");
  var lastname = document.getElementById("InputLastname");
  
  let xhr = new XMLHttpRequest();

  url = "http://localhost:8080/api/v1/client/registration";
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      console.log(this.responseText);
      alert('Регистрация прошла успешно!')
      window.open('http://127.0.0.1:5501/src/')
    } else if (xhr.readyState === 4 && xhr.status != 200){
      alert("Данные указаны неправильно!\nПовторите попытку.")
    }
  };

  var data = JSON.stringify({"firstname": firstname.value, "lastname": lastname.value, "login": email.value, "password": password.value });
  console.log(data)

  xhr.send(data);
};
