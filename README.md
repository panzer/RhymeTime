# RhymeTime
A simple webpage that uses RhymeBrain API to highlight rhyming words in submitted text

## Purpose
The purpose of this project was to simply have fun coding something that involved a web API in Javascript. I certainly accomplished that in doing this. Further, I heavily commented the code in hopes that others may be able to learn something from it. Keep in mind that this is far from perfect in terms of efficiency, style, or otherwise.
S
## Getting Started
1. Download or clone the entire repository
2. Open index.html in your favorite modern browser
3. Put some text in the box
4. Click "submit"
5. Wait for output

## Output
So uh... what do all these colors mean?
The script outputs the text that is inputted, but highlights groups of rhyming words.
Rhyming words will be highlighted with the same color.
_Disclaimer_: Some colors may look similar even if words do not rhyme.
#### Sample Output
![sample](/images/sample_output.png?raw=true)

## Future Plans
#### Short Term
Improve the script to ignore capitalization and apostrophes instead of removing them entirely.

#### Long Term
If my schedule permits, I may turn this into a small library based on the RhymeBrain API which extends String.
The library would likely include functions such as:
* `String.prototype.rhymesWith(string)` (returns Boolean)
* `String.prototype.rhymeGroups()` (returns 2D Array)
* etc.

## Acknowledgements
* [RhymeBrain API] (http://rhymebrain.com/api.html)
* [p5.js] (https://p5js.org)

## License
This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
