module( "Tests if browser supports necessary features" );

test("isBrowserReady()", function () {
    ok(isBrowserReady() != 0);
});

test("primitive.Point.contains [Depends on Point.constructor]", function () {
    var x = 7;
    var y = 8;
    var point = new Point(x,y);

    ok(point.contains(x,y), "new Point(7,8).contains(7,8)");
});


(function (){

    var testContext;

    module("Text's metrix", {
        setup: function() {
            testContext = document.getElementsByTagName('CANVAS')[0].getContext('2d');
            testContext.font = 12 + "px 'Arial'";
        }
    });



    test("get canvas context", function () {

        ok(true);
    });

    test("letters metrix", function () {
        var r = true;
        var letters = "ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklnopqrstuvwxyz";
        var l_width = "78998799368799989987977777767737733637777473759555";
        for(var i = 0; i < letters.length; i++){
            var metrics = testContext.measureText(letters.charAt(i));
            var letterR = metrics.width == parseInt(l_width.charAt(i));
            ok(letterR, 'Char: ' + letters.charAt(i) + ' expected ' + parseInt(l_width.charAt(i)) + ' type:' + typeof (parseInt(l_width.charAt(i))) + ' got: ' + metrics.width + ' type: ' + typeof (metrics.width) );
            r &= letterR;            
        }
        r &= testContext.measureText('m').width === 11;
        r &= testContext.measureText('W').width === 11;

        //ok(r);
    });

    test("digit metrix", function () {
        var r = true;
        for(var i = 0; i < 10; i++){
            var metrics = testContext.measureText(i);
            r &= metrics.width == 7;
        }

        ok(r);
    });

    test("symbol metrix", function () {
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

        ok(r);
    });

    test("digit metrix", function () {
        var r = true;
        for(var i = 0; i < 10; i++){
            var metrics = testContext.measureText(i);
            r &= metrics.width == 7;
        }

        ok(r);
    });

    test("word metrix", function () {
        var r = testContext.measureText('Alex').width == 7 + 3 + 7 + 5;
        r &= testContext.measureText('Max').width == 9 + 7 + 5;

        ok(r);
    });

})();