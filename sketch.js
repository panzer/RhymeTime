var textfield; // Where we put in the text
var output; // Where the output is printed
var submit; // The button to submit
var words; // An array to store all words to analyze
var rhymes = []; // Stores all of the words' rhymes (not really used)
var groups = []; // Stores the words in groups based on their rhyme
var colors = []; // The colors that words will be (coorespond to the groups)
var index = 0; // The current word we're looking at

// A function to replace all instances of a string within another string
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

// Setting up the page
function setup() {
  console.log(this);
  noCanvas();
  textfield = select("#input");
  output = select('#output');
  submit = select("#submit");
  submit.mousePressed(newText);
}

// Button was pressed, let's get the ball rolling
function newText() {
  var s = textfield.value();
  createSpan("<br /><br />").parent(output);
  // Reset everything
  index = 0;
  rhymes = [];
  groups = [];
  colors = [];
  words = s.split(/(\W+)/);
  words = words.join("`").toLowerCase().replaceAll("`'`","").split("`");
  groups.push([words[0]]);
  colors.push(color(random(100,255), random(100,255), random(100,255)));
  analyzeWords();
}

function showRhymesOnly() {
  for (var w = 0; w < words.length; w++) {
    var word = words[w];
    span = createSpan(word);
    span.parent(output);
    if (!/\W+/.test(word)) {
      for (var g = 0; g < groups.length; g++) {
        var group = groups[g];
        console.log(group);
        if ((group.indexOf(word) != -1) && (group.length > 1)) {
          var ci = groups.indexOf(group);
          span.style('background-color', colors[ci]);
        }
      }
    }
  }
}

// Goes through each term, waiting for the previous to be finished
function analyzeWords() {
  // We'll do this until we get to the last term
  if (index < words.length) {
    // Only look for rhymes if it's a word, not a space
    if (!/\W+/.test(words[index])) {
      // Start an async request with an anonymous callback
      httpGetAsync('http://rhymebrain.com/talk?function=getRhymes&word=' + words[index],function(data){
        span = createSpan(words[index]);
        span.parent(output);
        var cRhymes = [];

        // Take all rhymes with an accuracy score over 200
        for (var k = 0; k < data.length; k++) {
          if (data[k]["score"] > 200) cRhymes.push(data[k]["word"]);
        }
        // Add the word itself to the list of rhymes, so it can rhyme with itself
        cRhymes.push(words[index]);
        rhymes.push(cRhymes);

        // If no rhymes found, it's a random color
        var wColor = color(random(100,255), random(100,255), random(100,255));
        var foundGroup = false;

        // Going backwards, loop through all groups
        for (var j = groups.length-1; j >= 0; j--) {
          var group = groups[j];
          if (cRhymes.indexOf(group[0]) != -1) {
            // It rhymed, put it in that group and use that color
            foundGroup = true;
            groups[j].push(words[index]);
            wColor = colors[j];
          }
        }
        if (!foundGroup) {
          // We didn't find any rhymes, make it its own group and own color
          groups.push([words[index]])
          colors.push(wColor);
        }
        // Make background color
        span.style('background-color', wColor);
        // Go to next word and do it again
        index++;
        analyzeWords();
      });
    }else{
      // The term is not actually a word, it's a space or punctuation.
      span = createSpan(words[index]);
      span.parent(output);
      index++;
      analyzeWords();
    }
  }else{
    createSpan("<br /><br />").parent(output);
    showRhymesOnly();
  }
}

function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(JSON.parse(xmlHttp.responseText));
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.send(null);
}
