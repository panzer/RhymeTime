var textfield; // Where we put in the text
var output; // Where the output is printed
var submit; // The button to submit
var words; // An array to store all words to analyze
var rhymes = []; // Stores all of the words' rhymes (not really used)
var groups = []; // Stores the words in groups based on their rhyme
var colors = []; // The colors that words will be (coorespond to the groups)
var rhymingWordLists = []; // Stores all the rhymes that come back from RhymeBrain
var bcolor;
var index = 0; // The current word we're looking at

// A function to replace all instances of a string within another string
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

var diacriticsMap = {
  '\u00C0': 'A',  // À => A
  '\u00C1': 'A',   // Á => A
  '\u00C2': 'A',   // Â => A
  '\u00C3': 'A',   // Ã => A
  '\u00C4': 'A',   // Ä => A
  '\u00C5': 'A',   // Å => A
  '\u00C6': 'AE', // Æ => AE
  '\u00C7': 'C',   // Ç => C
  '\u00C8': 'E',   // È => E
  '\u00C9': 'E',   // É => E
  '\u00CA': 'E',   // Ê => E
  '\u00CB': 'E',   // Ë => E
  '\u00CC': 'I',   // Ì => I
  '\u00CD': 'I',   // Í => I
  '\u00CE': 'I',   // Î => I
  '\u00CF': 'I',   // Ï => I
  '\u0132': 'IJ', // Ĳ => IJ
  '\u00D0': 'D',   // Ð => D
  '\u00D1': 'N',   // Ñ => N
  '\u00D2': 'O',   // Ò => O
  '\u00D3': 'O',   // Ó => O
  '\u00D4': 'O',   // Ô => O
  '\u00D5': 'O',   // Õ => O
  '\u00D6': 'O',   // Ö => O
  '\u00D8': 'O',   // Ø => O
  '\u0152': 'OE', // Œ => OE
  '\u00DE': 'TH', // Þ => TH
  '\u00D9': 'U',   // Ù => U
  '\u00DA': 'U',   // Ú => U
  '\u00DB': 'U',   // Û => U
  '\u00DC': 'U',   // Ü => U
  '\u00DD': 'Y',   // Ý => Y
  '\u0178': 'Y',   // Ÿ => Y
  '\u00E0': 'a',   // à => a
  '\u00E1': 'a',   // á => a
  '\u00E2': 'a',   // â => a
  '\u00E3': 'a',   // ã => a
  '\u00E4': 'a',   // ä => a
  '\u00E5': 'a',   // å => a
  '\u00E6': 'ae', // æ => ae
  '\u00E7': 'c',   // ç => c
  '\u00E8': 'e',   // è => e
  '\u00E9': 'e',   // é => e
  '\u00EA': 'e',   // ê => e
  '\u00EB': 'e',   // ë => e
  '\u00EC': 'i',   // ì => i
  '\u00ED': 'i',   // í => i
  '\u00EE': 'i',   // î => i
  '\u00EF': 'i',   // ï => i
  '\u0133': 'ij', // ĳ => ij
  '\u00F0': 'd',   // ð => d
  '\u00F1': 'n',   // ñ => n
  '\u00F2': 'o',   // ò => o
  '\u00F3': 'o',   // ó => o
  '\u00F4': 'o',   // ô => o
  '\u00F5': 'o',   // õ => o
  '\u00F6': 'o',   // ö => o
  '\u00F8': 'o',   // ø => o
  '\u0153': 'oe', // œ => oe
  '\u00DF': 'ss', // ß => ss
  '\u00FE': 'th', // þ => th
  '\u00F9': 'u',   // ù => u
  '\u00FA': 'u',   // ú => u
  '\u00FB': 'u',   // û => u
  '\u00FC': 'u',   // ü => u
  '\u00FD': 'y',   // ý => y
  '\u00FF': 'y',   // ÿ => y
  '\uFB00': 'ff', // ﬀ => ff
  '\uFB01': 'fi',   // ﬁ => fi
  '\uFB02': 'fl', // ﬂ => fl
  '\uFB03': 'ffi',  // ﬃ => ffi
  '\uFB04': 'ffl',  // ﬄ => ffl
  '\uFB05': 'ft', // ﬅ => ft
  '\uFB06': 'st'  // ﬆ => st
}; // Map diacritics to regular characters

// A function to strip diactitics out of a string
function replaceDiacritics(str) {
  var returnStr = '';
  if(str) {
    for (var i = 0; i < str.length; i++) {
      if (diacriticsMap[str[i]]) {
        returnStr += diacriticsMap[str[i]];
      } else {
        returnStr += str[i];
      }
    }
  }
  return returnStr;
}

// Setting up the page
function setup() {
  noCanvas();
  textfield = select("#input");
  output = select('#output');
  submit = select("#submit");
  submit.mousePressed(newText);
}

// Button was pressed, let's get the ball rolling
function newText() {
  var s = textfield.value();
  createSpan("<br/><br/><br/>").parent(output);
  // Reset everything except rhymingWordLists
  index = 0;
  rhymes = [];
  groups = [];
  colors = [];
  bcolor;
  words = replaceDiacritics(s);
  words = words.split(/(\W+)/);
  words = words.join("`").toLowerCase().replaceAll("`'`","").split("`");
  analyzeWords();
}

function showRhymesOnly() {
  for (var w = 0; w < words.length; w++) {
    var word = words[w];
    if (/\r|\n/.exec(word)) span = createSpan("<br/>");
    else span = createSpan(word);
    span.parent(output);
    if (!/\W+/.test(word)) {
      for (var g = 0; g < groups.length; g++) {
        var group = groups[g];
        if ((group.indexOf(word) != -1) && (group.length > 1)) {
          var ci = groups.indexOf(group);
          span.style('background-color', colors[ci]);
        }
      }
    }
  }
}

function showAllGroups() {
  for (var w = 0; w < words.length; w++) {
    var word = words[w];
    if (/\r|\n/.exec(word)) span = createSpan("<br/>");
    else span = createSpan(word);
    span.parent(output);
    if (!/\W+/.test(word)) {
      for (var g = 0; g < groups.length; g++) {
        var group = groups[g];
        if (group.indexOf(word) != -1) {
          var ci = groups.indexOf(group);
          span.style('background-color', colors[ci]);
        }
      }
    }
  }
}

function findGroup(cRhymes, wColor) {
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
    usecolor = bcolor;
    groups.push([words[index]])
    colors.push(wColor);
  }
}

// Goes through each term, waiting for the previous to be finished
function analyzeWords() {
  // We'll do this until we get to the last term
  if (index < words.length) {
    // Only look for rhymes if it's a word, not a space or empty string
    if (!/\W+/.test(words[index]) && !(words[index] === "")) {
      var cRhymes = [];
      var wColor = color(random(100,240), random(100,240), random(100,240));
      // create UI for the results as they roll in
      var span = createSpan(words[index]);
      span.parent(output);

      // First looks through our previous RhymeBrain responses to see if we already have the answer
      for (var k = 0; k < rhymingWordLists.length; k++){
        if(rhymingWordLists[k].includes(words[index])){
          cRhymes = rhymingWordLists[k];
          // Set up color matching
          findGroup(cRhymes, wColor);
          // Add group color
          span.style('background-color', wColor);
          index++;
          analyzeWords();
        }
      };

      if(cRhymes.length == 0){
        // Start an async request with an anonymous callback
        // rhymesFound is an Array of Objects
        // example of Object within rhymesFound returned for the word "moon":
        // Object {flags: "bc", freq: 21, score: 300, syllables: "1", word: "noon"}
        httpGetAsync('https://rhymebrain.com/talk?function=getRhymes&word=' + words[index],function(rhymesFound){
          for (var k = 0; k < rhymesFound.length; k++) {
            // Add the words to the list
            cRhymes.push(rhymesFound[k]["word"]);
          }
          // Add the word itself to the list of rhymes, so it can rhyme with itself
          cRhymes.push(words[index]);
          rhymingWordLists.push(cRhymes);
          // Set up color matching
          findGroup(cRhymes, wColor);
          // Add group color
          span.style('background-color', wColor);
          index++;
          analyzeWords();
        });
      }
    }else{
      // Display and move on if it's a space or punctuation.
      if (/\r|\n/.exec(words[index])) span = createSpan("<br/>");
      else span = createSpan(words[index]);
      span.parent(output);
      index++;
      analyzeWords();
    }
  }else{
    createSpan("<br/><br/>").parent(output);

    // print a paragraph with only the rhymes showing a background color
    showAllGroups();
    // print a paragraph all words and rhymes showing a background color
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
