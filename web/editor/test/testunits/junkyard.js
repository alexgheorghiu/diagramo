/**
 *@param {String} name - the name of the test
 *@param {Function} test - the function that will return either true or false
 **/
function Test(name, test) {
    this.name = name;
    this.tests = [];
    if(test){
        this.test = test;
    }
}

Test.prototype = {
    /**
     *Adds a test to tests
     *@param {Test} t - a {Test} 
     **/
    addTest : function(t){
        this.tests.push(t)
    },
	
        
    /**
     *Run current test
     *@return {Object} - that contain both the boolean value and a human representation of the value
     **/    
    runTest : function(){
        if(this.tests.length == 0){ //single test
            r = false;
            try {
                var r = this.test();
            } catch (e) {
            //r = false;
            }
			
            var m = this.name + ': ' + this.resultToString(r);
            //var m = this.name;
			
            return {
                result: r, 
                message: m
            };
        }
        else{ //contains subtests
            var m = '<h2>' + this.name + ': ';
            var s = true;
			
            //test sub-tests
            var subtestsMessage = '<ul>' + "\n";
            for (var i in this.tests) {
                var subtest = this.tests[i];
                var r = subtest.runTest();
                s &= r['result'];
                subtestsMessage += '<li>' + r['message'] + '</li>' + "\n";
            }
            subtestsMessage += '</ul>' + "\n";
			
            //final message
            m +=  this.resultToString(s) + '</h2>'  + "\n" + subtestsMessage  + "\n";

            return {
                result : s,
                message:  m
            };
        }	
    },
	
	
    /**
    *Convert a result ({Boolean}) value to a visual representation 
    *@param {Boolean} b - true or false
    */
    resultToString: function(b) {
        if (b) {
            msg = '<span class="message">OK</span>';
        } else {
            msg = '<span class="error">FAIL</span>';
        }
		
        return msg;
    }
}
