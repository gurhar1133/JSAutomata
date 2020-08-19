
var table = $(buttTable);
var gridString = "<tr>";
var numCols = 70;
var numBoxes = numCols * numCols;
var startIndexes = [1716, 1784, 1786, 1788, 1853, 1854, 1856, 1858, 1859, 1924, 1925, 1926, 1927, 1928, 1996, 2066, 2134, 2135, 2136, 2137, 2138, 2203, 2204, 2206, 2208, 2209, 2274, 2276, 2278, 2346];

function drawStartState(starters){
  var numBoxes = numCols * numCols;
  for (i = 0; i < numBoxes; i++){
    if (i % numCols == 0 && i != 0){
      gridString = gridString + "</tr><tr>";
    }
    if(starters.includes(i)){
      gridString += "<td class='tdSmallLive'> </td>";
    }
    else{
      gridString += "<td class='tdSmallDead'> </td>";
    }
  }
  gridString += "</tr>";
  //console.log(gridString);
  table.html(gridString);
}

drawStartState(startIndexes);

var boxes = $("td");

function getAdjIndices(index){
  return [index - 1, index + 1, index - numCols, index - numCols + 1, index - numCols - 1, index + numCols, index + numCols + 1, index + numCols - 1];
}

function nextGeneration(){
  var liveOnes = [];
  var deadOnes = [];
  var final = [];
  for (i = 0; i < boxes.length; i++){
    var neighbors = getAdjIndices(i);
    var liveCount = 0;
    var isAlive = boxes.eq(i).attr('class') == 'tdSmallLive';
    for (j = 0; j < neighbors.length; j++){
      var neighbor = boxes.eq(neighbors[j]);
      if (neighbor.attr('class') == 'tdSmallLive'){
        liveCount = liveCount + 1;
        //console.log("live near")
      }
    }
    if (liveCount < 2 || liveCount > 3){
      // KILL
      //console.log("Kill");
      deadOnes.push(i);
    }
    else {
      if (!isAlive)
      {
        if (liveCount == 3){
          liveOnes.push(i);
        }
      }
      else {
        liveOnes.push(i);
      }
    }
  }
  for (lIndex of liveOnes){
    if (!deadOnes.includes(lIndex))
    {
      final.push(lIndex);
    }
  }
  // Draw the next generation
  for (i = 0; i < boxes.length; i++)
  {
    if (final.includes(i)){
      boxes.eq(i).attr('class', 'tdSmallLive');
    }
    else{
      boxes.eq(i).attr('class', 'tdSmallDead');
    }
  }
}

// drawing functions


$(".tdSmallDead").click(function() {
  $(this).attr('class', 'tdSmallLive');
});
/*
$(".tdSmallDead").mousedown(function() {
  $(".tdSmallDead").mousemove(function() {
      $(this).attr('class', 'tdSmallLive')
    });
});


$(".tdSmallDead").mouseup(function() {
  $(".tdSmallDead").mousemove(function() {
      $(this).attr('class', 'tdSmallDead')
    });
});

*/


// buttons
var go;
var on = false;
function play(){
  if (!on){
    go = setInterval("nextGeneration()", 150);
    document.getElementById("playPause").textContent = "Pause";
    on = true;
  }
  else{
    clearInterval(go);
    document.getElementById("playPause").textContent = "Play ";
    on = false;
  }
}

function clearTheBoard(){
  if(on){
    clearInterval(go);
    document.getElementById("playPause").textContent = "Play ";
    on = false;
  }
  for(i = 0; i < boxes.length; i++){
    boxes.eq(i).attr('class', 'tdSmallDead');
  }
}

function startState1(){
  if (on){
    clearInterval(go);
    document.getElementById("playPause").textContent = "Play ";
    on = false;
  }
  for(i = 0; i < boxes.length; i++){
    if (startIndexes.includes(i)){
      boxes.eq(i).attr('class', 'tdSmallLive');
    }
    else {
      boxes.eq(i).attr('class', 'tdSmallDead');
    }
  }
}
