// drivers

var browser = require('webdriverio');
var options = { desiredCapabilities: { browserName: 'firefox' } };
function init(){
browser
    .remote(options)
    .init();
    // .url('http://www.google.com')
    // .title(function(err, res) {
    //     console.log('Title was: ' + res.value);
    //     // outputs: "Title was: Google"
    // })
    // .end();

}

function Browser(){
	if(browser == null){
		browser.init();
	}
	return browser;
}
