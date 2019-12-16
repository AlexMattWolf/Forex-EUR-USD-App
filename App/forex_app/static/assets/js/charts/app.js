// Initialize the data
getdata();

var data, globaldata, unfiltered;
var minute = [], actual = [], poschange = [], negchange = []
//Use gogo to turn interval off/on at need. Makes basic changes e.g. HTML easier to process
var gogo = true
// var gogo = false
var max = 0
//Stop e at max - 10 because it allows a 10 tick gap, allowing forecast trend lines to be more effective visually
var e = 0
var xrange = 50
var xmin = xrange - 10

var s = 0;
var lineID = 'plot';
var barID = 'residual';

//Make arrays at specified ranges, offset range2 for bar chart (bars now go between grid columns)
var range = Array(xrange).fill().map((x, z) => z);
var range2 = Array(xrange).fill().map((x, z) => z + .5);

//Select Filter button, define filter inputs
var filterbtn = d3.select("#filter");
filterbtn.on("click", filterer)
var filtered, date_input, hour_input;
var hour_in, date_in;

//Sections make quick scrolling and overview navigation easier
// FILTER FUNTCIONS
// FILTER FUNTCIONS
// FILTER FUNTCIONS
// FILTER FUNTCIONS
// FILTER FUNTCIONS

//When filtered, reset interval, reset speed & speed input box, then filter data by date
function filterer() {

  clear();
  speedreset()
  spedometer();

  date_input = document.getElementById('date').value
  hour_input = document.getElementById('hour').value
  date_in = new Date(date_input);
  hour_in = Number(hour_input);

  // console.log(date_in, hour_in)

  filtered = unfiltered.filter(x => new Date(x['date']) >= date_in)

  try {
    var date_chk = new Date(filtered[0]['date'])
    var hour_chk = filtered[0]['hour']
  }
  catch {
    return;
  }

  //If date does not contain hour then go to select first associated with said date.
  if (String(date_chk) === String(date_in) && hour_chk != hour_in && hour_chk > hour_in) {
    d3.select('#hour').attr('value', hour)
    hour_in = hour_chk
  }

  OntheHour();
}

//'Filter' by hour, actually takes spliced data and find first instance of that hour and returns everything after it. FIlter by hour would only return data 
// with that hour
function OntheHour() {

  function ClockStrikes(y) {
    return y['hour'] == hour_in;
  }

  var ind = filtered.findIndex(ClockStrikes)
  var new_data = filtered.slice(ind);

  globaldata = new_data;
  // console.log(new_data)
  makedata();
}


// Initalize data system. make sure globaldata is accessible globally. Note data is empty because the graph starts with no datapoint.
// to make graph start with datapoints adjust initial iterator variables and slice data accordingly
function getdata() {

  var url = `/data`;

  d3.json(url).then(function(xx) {

    data = []
    // xx.slice(s, e)
    globaldata = xx;
    unfiltered = xx;
    actual = [], minute = []
  
    makedata();
})
}

// Data Intitalizer
// Data Intitalizer
// Data Intitalizer
// Data Intitalizer
// Data Intitalizer
// Data Intitalizer

// When this function is called (filters), rest all the tables, plots, html text, iterators, etc...
function makedata() {

  d3.select(`#${lineID}`).html('')
  d3.select(`#${barID}`).html('')
  d3.select("#outbody").html('')
  d3.select("#pip").style('color','black').text('Please Wait')
  d3.select("#money").style('color','black').text('Please Wait')
  d3.select("#action").style('color','black').style('font-weight','normal').text('Please Wait')
  all_dict = ['Initial', '-', '-', '-', '-', '-', '10000']
  tabelizer()
  

  pts = [], avg = [], y0 = [], y1 = [], x0 = [], x1 = [], color = []
  dinero = 10000
  signif = false
  movemoveit = false
  trend = 0
  wait = Array(10).fill(0)
  avg = []
  e2 = xrange
  actual = [], minute = [], poschange = [], negchange = [], shapes = [], shapeact = []
  max = 0
  pipchange = null, reco = null, profit = [], mvmt = []
  
  e = 0
  s = 0

    data.forEach(zz => {

      actual.push(zz['actual'])
      var change = zz['change']

      if (change < 0) {
        negchange = change 
        poschange = 0
      }
      else {
        poschange = change
        negchange = 0
      }

    });

    clock()
}

// Get inital tick marks for live graph, make sure the minutes are in :00 format
function clock() {
  clockdata = globaldata.slice(s, xrange)

   clockdata.forEach(zz => {

      if (zz['minute'] < 10) {
        minute.push(`:0${zz['minute']}`)
      }
      else {
        minute.push(`:${zz['minute']}`)
      }
      
    });

    drawline()
}

// Data Call Iterators
// Data Call Iterators
// Data Call Iterators
// Data Call Iterators
// Data Call Iterators
// Data Call Iterators

var ydata, yneg, ypos, byorcell;
var shapeact = [], shapechange = [], profit = [], mvmt = [];

//Pass in new ytrace variables for line graph
function yact() {

  ydata = globaldata[e]['actual']
  byorcell = Number(globaldata[e]['buy_sell'])

  shapeact.push(globaldata[e]['actual'])

  if (shapeact.length > xmin) {
    shapeact.shift()
  }

  e += 1;
  s += 1;

  return ydata;
}

//Pass in new bar graph traces variables, seperate them by positive or negative value so customer formating can occur (red or green bars)
function ychange() {

  var delta = globaldata[e]['change']
  
  if (delta < 0) {
    yneg = delta
    ypos = ''
  }
  else {
    ypos = delta
    yneg = ''
  }


  return [ypos, yneg];
}

//Data to be exported to profit.js so date, hours, minutes can be included in reports. Note has to be e-11 due when the model recommended to Buy/Sell.
//Not 10 points after
function outdata() {
  var exp = [];
  var e11 = e - 11

  exp.push(globaldata[e11]['date'])
  exp.push(globaldata[e11]['hour'])
  exp.push(globaldata[e11]['minute'])

  return exp;
}

//New minutes and hours for graph axes to be updated
function newdata() {

  var date, hour

  date = globaldata[e]['date']
  hour = globaldata[e]['hour']

  // console.log(date, hour)

  return [date, hour];
}

var e2 = xrange

//Take the previously created minute array and update it to the new minute value pushed. Shift it by one to remove the old value
function mini() {

  //If e2 errors that means, the data has reached it's conclusion. at which point the models will reset and start again.
  try {
    minim = globaldata[e2]['minute'] 
  }
  catch {
    console.log('Reset')
    clear()
    speedreset()
    getdata()
  }

  if (minim < 10) {
    minute.push(`:0${minim}`)
  }
  else {
    minute.push(`:${minim}`)
  }

  minute.shift()
  e2= e2 + 1
  // console.log(minute)
  return minute;
}

// GRAPHS
// GRAPHS
// GRAPHS
// GRAPHS
// GRAPHS
// GRAPHS

//Draw the line data 'live' graph
var linedata; 
function drawline() {

  var linetrace1 = {
    type: "scatter",
    mode: 'lines',
    y: actual,
    line: {
      color: "blue"
    }
  };

  linedata = [linetrace1];

  var linelay = {
    title: `EUR-USD Forex <br>`,
    yaxis: {
      title: `EURO to USD Rate`,
      orientation: 'h',
      tickfont: {
        size: 'auto',
      },
      range: [0, 0],
      autorange: true,
      dtick: .0001,
      showticklabels: false,
    },
    xaxis: {
      range: [0, xrange],
      title: `Hour: <b>${newdata()[1]}</b>, Day: ${newdata()[0]}`,
      tick0: 0,
      dtick: 1,
      ticktext: minute,
      tickvals: range,
    }
  };

  Plotly.newPlot(lineID, linedata, linelay, {responsive: true});

  drawbar();
}

// BAR
// BAR
// BAR
// BAR
// BAR

//Draw the bar graph
var bardata; 
function drawbar() {

  var bartrace1 = {
    name: 'increase',
    type: "bar",
    y: poschange,
    marker: {
      color: "green"
    }
  };

  var bartrace2 = {
    name: 'decrease',
    type: "bar",
    y: negchange,
    marker: {
      color: "red"
    }
  };

  bardata = [bartrace1, bartrace2];

  var barlay = {
    barmode: 'stack',
    showlegend: false,
    yaxis: {
      showgrid: true,
      showticklabels: false,
      title: `Change`,
      orientation: 'h',
      tickfont: {
        size: 'auto',
      },
      range: [0, 0],
      autorange: true,
      type: "linear",
      dtick: .0001,
    },
    xaxis: {
      showgrid: true,
      showticklabels: false,
      range: [.5, xrange],
      dtick: 1,
      tickvals: range2,
    }
  };

  Plotly.newPlot(barID, bardata, barlay, {responsive: true});

  if (gogo == true) {
    setTimeout(interval(), 3000);
  }
}


// INTERVAL
// INTERVAL
// INTERVAL
// INTERVAL
// INTERVAL
// INTERVAL


// var x = 0
var go;
var movemoveit = false;
// var speed = 60000;
var speed = 1000;
var once = 0
var shapes = []

//Start the interval 'live' system
function interval() {

  //Due to bad initial y-axis labels. remove labels until interval starts
  Plotly.relayout(lineID, {
    yaxis: {
      showticklabels: true,
    }
  })
  Plotly.relayout(barID, {
    yaxis: {
      showgrid: true,
      showticklabels: false,
      title: `Change`,
      orientation: 'h',
      tickfont: {
        size: 'auto',
      },
      range: [0, 0],
      autorange: true,
      type: "linear",
      dtick: .0001,
    },
  })

//Make sure interval can only be started once, prevents errors
if (once == 0) {
  go = setInterval(() => {
    once = 1;

    //Extend traces of line and bar grpah by attaching new data point to ends of graphs
    Plotly.extendTraces(lineID, {
      y: [[yact()]]}, [0]);

    var changling = ychange()
    // console.log(changling[0], changling[1])
    
    Plotly.extendTraces(barID, {
      y: [[changling[0]]]}, [0]);
    
    Plotly.extendTraces(barID, {
      y: [[changling[1]]]}, [1]);

    //Shift the taces by removing first data point when e is greater than the extent
      xrng_adj = xrange - 9
    
    //Call the shape making function before relayout, updates existing shapes and finds new ones
     
    workshop()

    if (movemoveit == false) {
      Plotly.relayout(lineID, {
        shapes: shapes,
      })
    }

      if (e > xrng_adj) {
      
        movemoveit = true

      linedata[0].y.shift();
      bardata[0].y.shift();
      bardata[1].y.shift();

      labels = mini()
      
      //Relayout both graphs, adding shapes to line graph and keeping the range of the x-axis static. Making the apperance of a moving graph
        Plotly.relayout(lineID, {
          shapes: shapes,
          xaxis: {
            range: [0, xrange+1],
            title: `Hour: <b>${newdata()[1]}</b>, Day: ${newdata()[0]}`,
            ticktext: labels,
            tickvals: range,
            tick0: 0,
            dtick: 1,
          }
        })

        Plotly.relayout(barID, {
          xaxis: {
            showticklabels: false,
            showgrid: true,
            range: [.5, xrange],
            tickvals: range2,
          },
        })
      }
    }, speed);
  }
}


//  BUTTONS
//  BUTTONS
//  BUTTONS
//  BUTTONS
//  BUTTONS
//  BUTTONS
//  BUTTONS
//  BUTTONS

//Button to speed up, slow down, pause, start the interval
var speedset = d3.select("#speed")

//outputs new speed to speed input box
function spedometer() {
  speedout = document.getElementById('speed');
  speedout.value = speed/1000;
}

//if custom speed is entered updates, speed on interval
speedset.on("change", function() {
  clear(); 
  speed = speedset.property("value")*1000;
  if (speed == 0) {
    clear()
    speed = 0
    spedometer()
  }
  else {
    interval()
  }
})

//stops interval so new speed can be entered, once = 0 so interval can be started again
function clear() {
  once = 0;
  clearInterval(go)
}

function speedreset() {
  speed = 1000;
}

//Pauses the live graph
var pausebtn = d3.select("#pause");
pausebtn.on("click", function() {
  console.log('Pause')
  clear()
  speed = 0
  spedometer() 
})

var speedout = d3.select("#speed")

//resumes live graph movement at speed of 1 second. Logically if someone paused it they may not want to resume at full speed, rather look at it in detail
//Thus reseting speed makes since
var playbtn = d3.select("#play");
playbtn.on("click", function() {
  clear()
  speedreset()
  spedometer()
  interval()
})

//Speeds up, but maxes out a half a second, faster than that half a second and graph buttons start having hard time keeping up with graph data
var fwdbtn = d3.select("#fwd");
fwdbtn.on("click", function() {
  clear(); 
  speed = (speed * .5);
  
  if (speed == 0) {
    clear()
    speed = 0
  }

  else {
    var cap= Math.max(250, speed)
    speed = cap
    interval()
  }
  spedometer() 
}
)

//opposite of fast button
var slowbtn = d3.select("#slow");
slowbtn.on("click", function() {
  clear(); 
  speed = (speed * 2);
 
  if (speed == 0) {
    clear()
    speed = 0
  }
  else {
    var cap= Math.min(60000, speed)
    speed = cap
    interval()
  }
  spedometer() 
})


// SVG Trace ###
// SVG Trace ###
// SVG Trace ###
// SVG Trace ###
// SVG Trace ###
// SVG Trace ###

var pts = [], avg = [], y0 = [], y1 = [], x0 = [], x1 = [], color = [], signif, trend, wait, reco, output, pipchange
signif = false
wait = Array(10).fill(0)

//initate shape making functionality
function workshop() {

  end = shapeact.length
  start = end - 20
  // pts = shapechange.slice(start, end)
  actpts = shapeact.slice(start, end)

  //if shape has been added recently wait 25 iterations before finding a new one. prevent over crowding and counteractive shape reports
    //if at 10 point after the shape was determined (end of linear forecast) then output live data results to determine if profit or loss occured.
    //exports data to profit.js
  if (wait[0] == 1) {

    var arrayout1 = []
    arrayout2 = outdata()
    pipchange = mvmt[0]
    gold = profit[0]

    if (color[0] == 'green') {
          reco = "Buy"
      }
    else if (color[0] == 'red') {
          reco = "Sell"
      }

    arrayout1 = [pipchange, reco, gold]
    output = arrayout1.concat(arrayout2)

    console.log(output)

    newresult()   
    
    mvmt.shift()
    profit.shift()
  }
  bors()
}

//If average of array of averages is positive or negative and greater than limit, then moving trend is found, significant is true.
//Color shape accordingly, green and red and push x and y variables
function bors() {

  var endval, startval;
  endval = actpts[19]
  startval = actpts[0]

  wait.shift()

  if (byorcell == 1) {
      color.push('green')
      signif = true
    }
  else if (byorcell == -1) {
      color.push('red')
      signif = true
    }
  else {
    signif = false
    wait.push(0)
  }

  if (signif == true) {
    if (movemoveit == false) {
      end = end - 1
      start = start -1
    }

    wait.push(1)
    profit.push(globaldata[e-1]['profit'])
    mvmt.push(globaldata[e-1]['sum'])
    x0.push(start)
    y0.push(startval)
    x1.push(end)
    y1.push(endval)
    // console.log(x1, x0, y1, y0)
  }
  craft()
}

//Make the paper and line shapes
function craft() {
  var adjx0 = [], adjx1 = [], adjy0 = [], adjy1 = []
  shapes = []
  // console.log(x1[0])
  //If paper shape is now off page remove all variables associated with, deleting the shape
  if (x1[0] < 0) {

    x0.shift()
    y0.shift()
    x1.shift()
    y1.shift()
    color.shift()
  }

  //make shapes with every trend that is found, due to wait timer on two can found one page at a time
  for(i = 0; i < x1.length; i++) {

  shapes.push({
    xref: 'x',
    type: 'rect',
    yref: 'paper',
    x0: x0[i],
    y0: 0,
    x1: x1[i],
    y1: 1,
    fillcolor: color[i],
    opacity: 0.1,
    line: {
        width: 0
    }
    })
    shapes.push({
      type: 'line',
      line: {
        color: '#646464',
        dash: 'dashdot',
        width: 2,
      },
      x0: x0[i],
      y0: y1[i],
      x1: x1[i] + 10,
      y1: y0[i],
    })


    //every foor loop iteration subtract one from the x and y variables to make shapes move accorss line graph
    adjx0.push(x0[i] - 1)
      // adjy0.push(y0[i] - 1)
    adjx1.push(x1[i] - 1)
      // adjy1.push(y1[i] - 1)
  }
  if (movemoveit == true) {
    x0 = adjx0
    x1 = adjx1
  }
}
