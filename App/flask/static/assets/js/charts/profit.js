var pip = d3.select("#pip")
var moolah = d3.select("#money")
var buysell = d3.select("#action")
var date_html = d3.select("#day")
var time_html = d3.select("#time")

var all_dict = [];

var dinero = 10000

var format, rounded, dough, reco2, bucks, bos, input_data

//Use imported data to make a quick text report show postive or negative movement
function newresult() {
  input_data = output
  var p = input_data[0]
  var ract = input_data[1]
  var pro = input_data[2]
  var input = input_data.slice(3, input_data.length)
  // console.log(p)

  //Calculate monetary value of pipchange
  // dough = Math.round((dinero * p) * 100)/100
  dough = Math.round((pro * dinero) * 100)/100
  rounded = (Math.round(p * 100000)/100000).toFixed(5)

  var up, down
  var sym;

  //Format the output accordingly. Make sure right symbols for buying and selling, (buy is postive correlation, sell is negative correlation)
  //e.g. if user sells and eur-usd rate goes down then user made money.
  up = "glyphicon glyphicon-triangle-top"
  down = "glyphicon glyphicon-triangle-bottom"

  
  if (ract == "Buy") {
    dinero = Math.round((dinero + dough) * 100)/100
    rolls = dough.toFixed(2)
      if (p >= 0) {
        format = [up, up, 'green']
        sym = ['+', '+']
      }
      else if (p < 0) {
        format = [down, down, 'red']
        sym = ['-', '-']
      }
    }
  else {
    dinero = Math.round((dinero + dough) * 100)/100
    rolls = dough.toFixed(2)
      if (p <= 0) {
        format = [down, up, 'green']
        sym = ['-', '+']
      }
      else if (p > 0) {
        format = [up, down, 'red']
        sym = ['+', '-']
      }
  }


  //Format time outputs
  var bigben;
  if (input[2] < 10) {
    bigben = `${input[1]}:0${input[2]}`
  }
  else {
    bigben = `${input[1]}:${input[2]}`
  }

  //Use of tofixed(x) makes sure the right number of decimals are shown
  coins = dinero.toFixed(2)
  // console.log(ract, rounded, dough)
  
  // output variables to html text
  date_html.text(`Date: ${input[0]}`)
  time_html.text(`Time: ${bigben}`)
  buysell.style('font-weight', 'bold').text(`${ract}`)
  pip.style('color', format[2]).text(`${sym[0]} ${Math.abs(rounded)}  `).append('i').style('color', format[2]).attr('class',format[0])
  moolah.style('color', format[2]).text(`${sym[1]}$ ${Math.abs(dough).toFixed(2)}  `).append('i').style('color', format[2]).attr('class',format[1])

  //create array for table
  all_dict = input.concat([ract, rounded, rolls, coins])
  
  tabelizer()
}

var history
var tbody = d3.select("#outbody");

//enter all new entries into table for historical data
function tabelizer() {

  var row = tbody.append("tr");
  all_dict.forEach((entry) => { 
  var cell = row.append("td");
    cell.text(entry);
    });

  all_dict = []
}

