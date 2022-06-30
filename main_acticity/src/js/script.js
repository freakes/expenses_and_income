var main_block_elems = document.getElementById("main_block_elems");
var add_income_btn = document.getElementById("add_income");
var add_outcome_btn = document.getElementById("add_outcome");
var expense_arr = new Array();
var income_arr = new Array();

const user_id = catch_get("id");
const fname = catch_get("firstname");
const lname = catch_get("lastname");
const week_month = catch_get("week_month");

var date_again = document.getElementById("period");
if (week_month == "week") {
  date_again.getElementsByTagName("option")[1].selected = false;
  date_again.getElementsByTagName("option")[0].selected = true;
} else {
  date_again.getElementsByTagName("option")[1].selected = true;
  date_again.getElementsByTagName("option")[0].selected = false;
}
let url = window.location.href;

function go_to_date() {
  if (date_again.value == "month") {
    window.location.replace(
      window.location.href.slice(0, window.location.href.length - 4) + "mont"
    );
    current = 1;
  } else {
    window.location.replace(
      window.location.href.slice(0, window.location.href.length - 4) + "week"
    );
    current = 0;
  }
}

show_name();
send_request(true);

function set_category() {
  let old_outcome = document.getElementsByClassName("main_elem_outcome");
  let old_income = document.getElementsByClassName("main_elem_income");
  let new_category = document.getElementById("sort_select");
  Array.from(old_outcome).forEach((item) => {
    item.remove();
  });
  Array.from(old_income).forEach((item) => {
    item.remove();
  });

  if (new_category.value != "Все") {
    let xhr = new XMLHttpRequest();
    url = "http://localhost:8080/api/v1/client/pay/filter" + user_id + "?direction=" + new_category.value;

    xhr.open("GET", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        data = this.responseText;
        console.log(data.length, 312456754321);
        if (data.length != 2) {
          new_data = data.split("},");
          new_data[new_data.length - 1] = new_data[new_data.length - 1].slice(
            0,
            -1
          );
          new_data[0] = new_data[0].slice(1);
  
          for (let i = 0; i < new_data.length - 1; ++i) {
            new_data[i] = new_data[i] + "}";
          }
        
        var elems_counter = 0;
          new_data.forEach((item) => {
            var new_elem = document.createElement("div");
            var elem_direction = document.createElement("div");
            var elem_sum = document.createElement("div");
            var elem_date_of_create = document.createElement("div");
            var close_btn = document.createElement("button");
            var data_now = JSON.parse(item);
            if (data_now.status === "income") {
              new_elem.className = "main_elem_income";
            } else {
              new_elem.className = "main_elem_outcome";
            }

            elem_direction.className = "direction col-md-3";
            elem_sum.className = "sum col-md-1 offset-md-1";
            elem_date_of_create.className = "date-of-create col-md-2";
            close_btn.setAttribute("type", "button");
            close_btn.className = "btn-close col-md-1";
            close_btn.setAttribute("aria-label", "Close");
            close_btn.setAttribute("title", data_now.id);
            main_block_elems.appendChild(new_elem);
            new_elem.appendChild(elem_direction);
            new_elem.appendChild(elem_sum);
            new_elem.appendChild(elem_date_of_create);
            new_elem.appendChild(close_btn);
            var direction_now =
              document.getElementsByClassName("direction")[elems_counter];
            var sum_now = document.getElementsByClassName("sum")[elems_counter];
            var date_now =
              document.getElementsByClassName("date-of-create")[elems_counter];
            direction_now.textContent = data_now.direction;
            sum_now.textContent = data_now.sum + "₽";
            date_now.textContent = data_now.date_of_create;
            elems_counter += 1;
          });
        }
      }
    };

    var data = "";
    xhr.send(data);
  } else {
    location.reload();
  }
}

function show_name() {
  var name_placeholder = document.getElementById("username");
  name_placeholder.textContent = fname + " " + lname;
}

function send_request(render_or_not) {
  let xhr = new XMLHttpRequest();

  url = "http://localhost:8080/api/v1/client/pay/getinfo" + user_id + "/";
  console.log(url);

  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      data = this.responseText;
      console.log(data.length);
      var client_id = user_id;
      if (data.length != 2) {
        new_data = data.split("},");
        new_data[new_data.length - 1] = new_data[new_data.length - 1].slice(
          0,
          -1
        );
        new_data[0] = new_data[0].slice(1);

        for (let i = 0; i < new_data.length - 1; ++i) {
          new_data[i] = new_data[i] + "}";
        }

        let current_day = new Date().getDate();
        let current_month = new Date().getMonth() + 1;

        let week_month = document.getElementById("period");

        if (week_month.value == "week") {
          new_data.forEach((item) => {
            var data_el = JSON.parse(item);
            if (data_el.status === "expense") {
              if (
                Number(
                  data_el.date_of_create.split("-")[2].replace(/^0+/, "")
                ) >=
                current_day - 7
              ) {
                expense_arr.push(data_el);
              }
            } else {
              if (
                Number(
                  data_el.date_of_create.split("-")[2].replace(/^0+/, "")
                ) >=
                current_day - 7
              ) {
                income_arr.push(data_el);
              }
            }
          });
        } else {
          new_data.forEach((item) => {
            var data_el = JSON.parse(item);
            if (data_el.status === "expense") {
              if (
                Number(
                  data_el.date_of_create.split("-")[1].replace(/^0+/, "")
                ) >=
                current_month - 1
              ) {
                expense_arr.push(data_el);
              }
            } else {
              if (
                Number(
                  data_el.date_of_create.split("-")[1].replace(/^0+/, "")
                ) >=
                current_month - 1
              ) {
                income_arr.push(data_el);
              }
            }
          });
        }
        console.log(expense_arr, income_arr);
        if (render_or_not) {
          var elems_counter = 0;
          new_data.forEach((item) => {
            var new_elem = document.createElement("div");
            var elem_direction = document.createElement("div");
            var elem_sum = document.createElement("div");
            var elem_date_of_create = document.createElement("div");
            var close_btn = document.createElement("button");
            var data_now = JSON.parse(item);
            if (data_now.status === "income") {
              new_elem.className = "main_elem_income";
            } else {
              new_elem.className = "main_elem_outcome";
            }

            elem_direction.className = "direction col-md-3";
            elem_sum.className = "sum col-md-1 offset-md-1";
            elem_date_of_create.className = "date-of-create col-md-2";
            close_btn.setAttribute("type", "button");
            close_btn.className = "btn-close col-md-1";
            close_btn.setAttribute("aria-label", "Close");
            close_btn.setAttribute("title", data_now.id);
            main_block_elems.appendChild(new_elem);
            new_elem.appendChild(elem_direction);
            new_elem.appendChild(elem_sum);
            new_elem.appendChild(elem_date_of_create);
            new_elem.appendChild(close_btn);
            var direction_now =
              document.getElementsByClassName("direction")[elems_counter];
            var sum_now = document.getElementsByClassName("sum")[elems_counter];
            var date_now =
              document.getElementsByClassName("date-of-create")[elems_counter];
            direction_now.textContent = data_now.direction;
            sum_now.textContent = data_now.sum + "₽";
            date_now.textContent = data_now.date_of_create;
            elems_counter += 1;
          });
        }

        // set_category();
        var directions_arr_inc = [];
        var directions_arr_out = [];

        for (let i = 0; i < income_arr.length; ++i) {
          directions_arr_inc.push(income_arr[i].direction);
        }

        for (let i = 0; i < expense_arr.length; ++i) {
          directions_arr_out.push(expense_arr[i].direction);
        }

        console.log(directions_arr_inc);
        console.log(directions_arr_out);

        let sum_arr_out = [];
        let sum_arr_inc = [];

        for (let i = 0; i < income_arr.length; ++i) {
          sum_arr_inc.push(income_arr[i].sum);
        }

        for (let i = 0; i < expense_arr.length; ++i) {
          sum_arr_out.push(expense_arr[i].sum);
        }

        console.log(sum_arr_inc);
        console.log(sum_arr_out);

        let percents_outcome = [];
        let percents_income = [];

        for (let i = 0; i < sum_arr_inc.length; ++i) {
          var sum_inc = sum_arr_inc
            .map((ii) => (x += ii), (x = 0))
            .reverse()[0];
          percents_income.push((sum_arr_inc[i] * 100) / sum_inc);
        }

        for (let i = 0; i < sum_arr_out.length; ++i) {
          var sum_out = sum_arr_out
            .map((ii) => (x += ii), (x = 0))
            .reverse()[0];
          percents_outcome.push((sum_arr_out[i] * 100) / sum_out);
        }

        var total_placeholder =
          document.getElementsByClassName("spent_total")[0];
        console.log(sum_inc, sum_out, 43567896543);
        if (
          sum_inc != NaN &&
          sum_inc != undefined &&
          sum_out != NaN &&
          sum_out != undefined
        ) {
          total_placeholder.textContent = sum_inc - sum_out + "₽";
        } else if (
          (sum_inc === NaN || sum_inc === undefined) &&
          sum_out != NaN &&
          sum_out != null
        ) {
          total_placeholder.textContent = "-" + sum_out + "₽";
        } else if (
          (sum_out === NaN || sum_out === undefined) &&
          sum_inc != NaN &&
          sum_inc != null
        ) {
          total_placeholder.textContent = sum_inc + "₽";
        } else {
          total_placeholder.textContent = "0₽";
        }

        console.log(percents_income);
        console.log(percents_outcome);

        showPie(
          directions_arr_inc,
          directions_arr_out,
          percents_income,
          percents_outcome
        );

        var delete_state = document.getElementsByClassName("btn-close");
        console.log(delete_state);
        for (let item of delete_state) {
          item.onclick = function () {
            let xhr = new XMLHttpRequest();
            url =
              "http://localhost:8080/api/v1/client/pay/" +
              item.getAttribute("title") +
              "/";

            xhr.open("DELETE", url, true);

            xhr.setRequestHeader("Content-Type", "application/json");

            xhr.onreadystatechange = function () {
              if (xhr.readyState === 4 && xhr.status === 200) {
                location.reload();
              }
            };
            if (client_id !== null) {
              var data = "";
              // console.log(data);
              xhr.send(data);
            }
          };
        }
      }
      add_income_btn.onclick = function () {
        var amount = document.getElementById("amount");
        var get_from = document.getElementById("get-from");

        let xhr = new XMLHttpRequest();
        url = "http://localhost:8080/api/v1/client/pay/addingPayment";

        xhr.open("POST", url, true);

        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4 && xhr.status === 200) {
            alert("Доход добавлен!)");
            location.reload();
          }
        };
        if (client_id != null) {
          var data = JSON.stringify({
            sum: amount.value,
            status: "income",
            direction: get_from.value,
            client_id: client_id,
          });
          console.log(data);
          xhr.send(data);
        } else {
          console.log(client_id);
        }
      };

      add_outcome_btn.onclick = function () {
        var amount = document.getElementById("-amount");
        var get_from = document.getElementById("expense");

        let xhr = new XMLHttpRequest();
        url = "http://localhost:8080/api/v1/client/pay/addingPayment";

        xhr.open("POST", url, true);

        xhr.setRequestHeader("Content-Type", "application/json");

        xhr.onreadystatechange = function () {
          if (xhr.readyState === 4 && xhr.status === 200) {
            alert("Расход добавлен!)");
            location.reload();
          }
        };
        if (client_id != null) {
          var data = JSON.stringify({
            sum: amount.value,
            status: "expense",
            direction: get_from.value,
            client_id: client_id,
          });
          console.log(data);
          xhr.send(data);
        }
      };
    } else if (xhr.readyState === 4 && xhr.status != 200) {
      alert("Ошибка сервера.\nПовторите попытку позднее.");
    }
  };

  var data = "";
  xhr.send(data);
}

function showPieAgain() {
  let xhrr = new XMLHttpRequest();

  url = "http://localhost:8080/api/v1/client/pay/getinfo" + user_id + "/";
  xhrr.open("POST", url, true);
  xhrr.setRequestHeader("Content-Type", "application/json");

  xhrr.onreadystatechange = function () {
    if (xhrr.readyState === 4 && xhrr.status === 200) {
      showPie(di, dout, pi, pout);
    }
  };
  var data = "";

  xhrr.send(data);
}

function catch_get(parameterName) {
  var result = null,
    tmp = [];
  var items = location.search.substr(1).split("&");
  for (var index = 0; index < items.length; index++) {
    tmp = items[index].split("=");
    if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
  }
  return result;
}

// console.log();
// console.log(Object.keys(expense_arr).length);

for (let i = 0; i < income_arr.length; ++i) {
  console.log(JSON.parse(arr[i]).direction);
  directions_arr_inc.push(JSON.parse(arr[i]).direction);
}

// console.log(directions_arr_inc);
let di;
let dout;
let pi;
let pout;

function showPie(directions_in, directions_out, percents_in, percents_out) {
  let directions_in_cls = directions_in;
  let directions_out_cls = directions_out;
  di = directions_in_cls;
  dout = directions_out_cls;
  pi = percents_in;
  pout = percents_out;
  let ctx = document.getElementById("myChart").getContext("2d");
  let ctx2 = document.getElementById("myChart2").getContext("2d");
  var myChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: directions_out_cls,
      datasets: [
        {
          data: percents_out,
          backgroundColor: [
            "#e91e63",
            "#00e676",
            "#ff5722",
            "#1e88e5",
            "#8964ff",
          ],
          borderWidth: 0.5,
          borderColor: "#ddd",
        },
      ],
    },
    options: {
      title: {
        display: true,
        text: "",
        position: "top",
        fontSize: 16,
        fontColor: "#111",
        padding: 20,
      },
      legend: {
        display: true,
        position: "bottom",
        labels: {
          boxWidth: 20,
          fontColor: "#111",
          padding: 15,
        },
      },
      tooltips: {
        enabled: false,
      },
      plugins: {
        datalabels: {
          color: "#111",
          textAlign: "center",
          font: {
            lineHeight: 1.6,
          },
          formatter: function (value, ctx) {
            return ctx.chart.data.labels[ctx.dataIndex] + "\n" + value + "%";
          },
        },
      },
    },
  });
  var myChart1 = new Chart(ctx2, {
    type: "pie",
    data: {
      labels: directions_in_cls,
      datasets: [
        {
          data: percents_in,
          backgroundColor: [
            "#e91e63",
            "#00e676",
            "#ff5722",
            "#1e88e5",
            "#8964ff",
          ],
          borderWidth: 0.5,
          borderColor: "#ddd",
        },
      ],
    },
    options: {
      title: {
        display: true,
        text: "",
        position: "top",
        fontSize: 16,
        fontColor: "#111",
        padding: 20,
      },
      legend: {
        display: true,
        position: "bottom",
        labels: {
          boxWidth: 20,
          fontColor: "#111",
          padding: 15,
        },
      },
      tooltips: {
        enabled: false,
      },
      plugins: {
        datalabels: {
          color: "#111",
          textAlign: "center",
          font: {
            lineHeight: 1.6,
          },
          formatter: function (value, ctx) {
            return ctx2.chart.data.labels[ctx2.dataIndex] + "\n" + value + "%";
          },
        },
      },
    },
  });
}
