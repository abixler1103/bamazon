var mysql = require("mysql");
var inquirer = require("inquirer");

// https://github.com/lukeb-uk/node-promise-mysql
/*

var mysql = require('promise-mysql'); // users the mysql promise library

mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Froggy34',
    database: 'bamazon_db'
}).then(function(conn){
    var result = conn.query('SELECT * FROM products');
    conn.end();
    return result;
}).then(function(products){
    // Logs out a list of products
    console.log(products);
});

*/

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Froggy34",
  database: "bamazon_db"
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  start();
});

function start() {
  connection.query("SELECT * FROM products", function (err, res) {
    for (var i = 0; i < res.length; i++) {
      console.log(res[i].id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
    }
    console.log("-----------------------------------");
    prompt();
  });
}

function prompt() {
  connection.query("SELECT * FROM products", function (err, results) {
    if (err) throw err;
    inquirer.prompt([{
        name: "item_want",
        type: "input",
        message: "Which ID # (first column) would you like to buy?"
      },
      {
        name: "quantity",
        type: "input",
        message: "How many units of this item would you like?"
      }
    ]).then(function (answer) {
      var chosenItem;
      for (var i = 0; i < results.length; i++) {
        if (results[i].id === answer.item_want) {
          chosenItem = results[i];
        }
      }
      if (chosenItem.stock_quantity > parseInt(answer.quantity)) {
        "UPDATE products SET ? WHERE ?",
        [{
            stock_quantity: answer.quantity
          },
          {
            id: chosenItem.id
          }
        ],
        function (error) {
          if (error) throw err;
          console.log("You got it!");
        }
      }
      else {
        console.log("Not enough in stock")

      }
    });
  });
}