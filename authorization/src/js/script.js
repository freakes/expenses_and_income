var login_button = document.getElementById("login");

login_button.onclick = function () {
  var email = document.getElementById("InputEmail");
  var password = document.getElementById("InputPassword");

  let xhr = new XMLHttpRequest();

  url = "http://localhost:8080/api/v1/client/authorization";
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      // console.log(this.responseText);
      var response_data = JSON.parse(this.responseText);
      console.log(response_data);
      alert('Авторизация прошла успешно!');
      window.open('http://127.0.0.1:5500/src/index.html?id=' + response_data.id + '&firstname=' + response_data.firstname + '&lastname=' + response_data.lastname);
    } else if (xhr.readyState === 4 && xhr.status != 200){
      alert("Данные указаны неправильно!\nПовторите попытку.")
    }
  };

  var data = JSON.stringify({ "login": email.value, "password": password.value });
  console.log(data)
  xhr.send(data);
};
