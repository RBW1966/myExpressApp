var express = require('express');
var router = express.Router();
const util = require('util');
const exec = util.promisify(require('child_process').exec);

/* GET users listing. */
router.get('/', function(req, res, next) {
  
  async function ls() {
    const { stdout, stderr } = await exec('dir');
    console.log('stdout:', stdout);
    console.log('stderr:', stderr);
    const a = stdout.split("\r\n");
    let output = '<DOCTYPE!html><html lang="en"><head>';
    output += '<link href="stylesheets/style.css" type="text/css" rel="stylesheet />';
    output += "</head>";
    
    output += "<body><ul>";
    a.forEach((line) => {
      line = line.trim().replace("<DIR>", "|DIR|");
      if(line != "") output += `<li class="output"> ${line}</li>`;
    });
    output += "</ul></body></html>";
    res.send(output);
    console.log(output);
  }

  ls();

});


module.exports = router;
