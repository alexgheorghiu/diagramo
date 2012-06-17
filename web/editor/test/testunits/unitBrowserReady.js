// In order to execute, call performUnitTest(testBrowserReady)
unitBrowserReady = {
    id: 'unitBrowserReady',
    name: 'Tests if browser supports necessary features',
    tests: [
        {
            name: 'isBrowserReady()',
            func: function() { return isBrowserReady() == 0 ? false : true; }
        }
    ],
    testGroups: [
        {
            name: "Text's metrix",
            tests: [
                { name: 'get canvas context', func: testGetCanvasContext },
                { name: 'letters metrix', func: testLettersMetrix },
                { name: 'digit metrix', func: testDigitMetrix },
                { name: 'symbol metrix', func: testSymbolMetrix },
                { name: 'word metrix', func: testWordMetrix }
            ]
        }
    ]
};

function testGetCanvasContext() {
   testContext = document.getElementsByTagName('CANVAS')[0].getContext('2d');
   testContext.font = 12 + "px 'Arial'";
   return true;
}

function testLettersMetrix() {
    var r = true;
    var letters = "ABCDEFGHIJKLMNOPQRSTUVXYZαâabcdefghijklnopqrstuvwxyz";
    var l_width = "7899879936879998998797777777767737733637777473759555";
    for(var i = 0; i < letters.length; i++){
        var metrics = testContext.measureText(letters.charAt(i));
        r &= metrics.width == l_width.charAt(i);
    }
    r &= testContext.measureText('m').width == 11;
    r &= testContext.measureText('W').width == 11;
    return r;
}

function testDigitMetrix() {
    var r = true;
    for(var i = 0; i < 10; i++){
        var metrics = testContext.measureText(i);
        r &= metrics.width == 7;
    }
    return r;
}

function testSymbolMetrix() {
    var r = true;
    var symbols = "* '`!#$^&*()[]{};:,.<>?";
    var s_width = "53243775854433443333777";
    for(var i = 0; i < symbols.length; i++){
        var metrics = testContext.measureText(symbols.charAt(i));
        r &= metrics.width == s_width.charAt(i);
    }
    r &= testContext.measureText('@').width == 12;
    r &= testContext.measureText('%').width == 11;
    r &= testContext.measureText('"').width == 4;
    r &= testContext.measureText('\\').width == 3;
    return r;
}

function testWordMetrix() {
    var r = testContext.measureText('Alex').width == 7 + 3 + 7 + 5;
    r &= testContext.measureText('Max').width == 9 + 7 + 5;
    return r;
}