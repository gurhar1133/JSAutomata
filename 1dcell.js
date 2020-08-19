var table = $(buttTable);
var gridString = "<tr>";
var numCols = 70;
var numBoxes = numCols * numCols;
var startIndexes = [2066, 2134, 2135, 2136, 2137, 2138, 2203, 2204, 2206, 2208, 2209, 2274, 2276, 2278, 2346];

function drawStartState(starters){
  var numBoxes = numCols * numCols;
  for (i = 0; i < numBoxes; i++){
    if (i % numCols == 0 && i != 0){
      gridString = gridString + "</tr><tr>";
    }
    if( i == numBoxes/2 + numCols/2){
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

function getNeighbors(i){
  if ((i + 1) % numCols == 0){
    return [i - 1, i - (numCols - 1)];
  }
  else if (i % numCols == 0){
    return [i + 1, i + (numCols - 1)];
  }
  else {
    return [i - 1, i + 1];
  }
}

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

function rule90(i){
  var neighbors = getNeighbors(i);
  if (boxes.eq(neighbors[0]).attr('class') == boxes.eq(neighbors[1]).attr('class'))
  {
    boxes.eq((i + numCols) % numBoxes).attr('class', 'tdSmallDead');
  }
  else{
    boxes.eq((i + numCols) % numBoxes).attr('class', 'tdSmallLive');
  }
}

function rule126(i){
  var neighbors = getNeighbors(i);
  if (boxes.eq(neighbors[0]).attr('class') == boxes.eq(neighbors[1]).attr('class') && boxes.eq(neighbors[0]).attr('class') == boxes.eq(i).attr('class'))
  {

  }
  else {
    boxes.eq((i + numCols) % numBoxes).attr('class', 'tdSmallLive');
  }
}

function rule30(i){
  var neighbors = getNeighbors(i);
  var prev = boxes.eq(neighbors[0]).attr('class');
  var curr = boxes.eq(i).attr('class');
  var next = boxes.eq(neighbors[1]).attr('class');

  if (prev == 'tdSmallLive' && curr == 'tdSmallLive' && next == 'tdSmallLive')
  {
    boxes.eq((i + numCols) % numBoxes).attr('class', 'tdSmallDead');
  }
  else if (prev == 'tdSmallLive' && curr == 'tdSmallLive' && next == 'tdSmallDead')
  {
    boxes.eq((i + numCols) % numBoxes).attr('class', 'tdSmallDead');
  }
  else if (prev == 'tdSmallLive' && curr == 'tdSmallDead' && next == 'tdSmallLive')
  {
    boxes.eq((i + numCols) % numBoxes).attr('class', 'tdSmallDead');
  }
  else if (prev == 'tdSmallDead' && curr == 'tdSmallDead' && next == 'tdSmallDead')
  {
    boxes.eq((i + numCols) % numBoxes).attr('class', 'tdSmallDead');
  }
  else {
    boxes.eq((i + numCols) % numBoxes).attr('class', 'tdSmallLive');
  }
}

var currentIndex = numBoxes/2;

function rule90onRow(){
    for (i = 0; i < numCols; i++){
      rule90(currentIndex % numBoxes);
      currentIndex++;
    }
}

function rule30onRow(){
    for (i = 0; i < numCols; i++){
      rule30(currentIndex % numBoxes);
      currentIndex++;
    }
}

function rule182onRow(){
    for (i = 0; i < numCols; i++){
      rule182(currentIndex % numBoxes);
      currentIndex++;
    }
}

function rule126onRow(){
    for (i = 0; i < numCols; i++){
      rule126(currentIndex % numBoxes);
      currentIndex++;
    }
}

var is90 = false;
var is30 = false;
var is126 = false;
var is182 = false;
var dogl = false;
var gl;
var do90;
var do30;
var do126;
var do182;

function halt(){

  clearInterval(do90);
  clearInterval(do126);
  clearInterval(do182);
  clearInterval(do30);
  clearInterval(gl);
  is90 = false;
  is30 = false;
  is126 = false;
  is182 = false;
  isgl = false;

}

function clearTheBoard(){
  if(is90 || is30 || is126 || is182 || isgl){
    halt();
    //document.getElementById("playPause").textContent = "Play ";
  }
  for(i = 0; i < boxes.length; i++){
    if (i == numBoxes/2 + numCols/2){
      boxes.eq(i).attr('class', 'tdSmallLive');
    }
    else{
      boxes.eq(i).attr('class', 'tdSmallDead');
    }

  }
  currentIndex = numBoxes/2;

}

function switchTo90() {
  if (!is90){
    is30 = false;
    is126 = false;
    is182 = false;
    isgl = false;
    clearInterval(do30);
    clearInterval(do126);
    clearInterval(do182);
    clearInterval(gl);
    do90 = setInterval("rule90onRow()", 80);
    is90 = true;
  }

}

function switchTo182(){
  if (!is182){
    is30 = false;
    isgl = false;
    is126 = false;
    is90 = false;
    clearInterval(do30);
    clearInterval(do126);
    clearInterval(do90);
    clearInterval(gl);
    do182 = setInterval("rule182onRow()", 80);
    is182 = true;
  }

}

function switchTo126() {
  if (!is126){
    is30 = false;
    is90 = false;
    is182 = false;
    isgl = false;
    clearInterval(do30);
    clearInterval(do90);
    clearInterval(do182);
    clearInterval(gl);
    do126 = setInterval("rule126onRow()", 80);
    is126 = true;
  }

}

function switchTo30() {
  if (!is30){
    is90 = false;
    is126 = false;
    isgl = false;
    clearInterval(do90);
    clearInterval(do126);
    clearInterval(do182);
    clearInterval(gl);
    do30 = setInterval("rule30onRow()", 80);
    is30 = true;
  }

}

function gameLyfe(){
  halt();
  isgl = true;
  gl = setInterval("nextGeneration()", 150);
}
