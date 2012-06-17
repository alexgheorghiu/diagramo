/**This is a module to tests code on Diagramo
 *The structure of tests is:
 *  Unit->[TestGroup->]Test
 *
 *  Unit = {
 *      id: String,                 // id should be the same as name of unit test variable, e.g. unitMiscellaneous
 *      name: String,               // description of the unit
 *      tests: Array<Test>,         // array of tests (described below)
 *      testGroups: Array<Section>  // OPTIONAL: array of test groups (described below)
 *  }
 *  TestGroup = {                   // 
 *      name: String,               // description of the group of tests
 *      tests: Array<Test>          // array of tests (described above)
 *  }
 *  Test = {
 *      name: String,               // description of the test
 *      func: Function              // test function should return true or false
 *  },
 *  func is test function reutrns true or false
 *
 **/

/**
 * If you want just to add one or more tests, then go to testMiscellaneous.js,
 * and add your test function(s), similar to existing tests there.
 **/


/**
  * Based on bool, creates <span> with appropriate value OK or FAIL.
  * For true value, it uses CSS class "message", for false value class "error".
  * Currently these classes are represented in /assets/css/style.css
  *
  * @param {Bool} result - the value to be converted in colored <span>
  * @return {String} - colored <span> (green or red) with text OK or FAIL
  * @author Maxim Georgievskiy <max.kharkov.ua@gmail.com>
  *
  **/
function resultToString(result) {
    if (result) {
        msg = '<span class="message">OK</span>';
    } else {
        msg = '<span class="error">FAIL</span>';
    }
    return msg;
}

/**
  * Executes atomary test. Used in centralized test units.
  * Each test has a 'func' function that will be executed
  *
  * @param {Object} test - the object {String name, Function func}, where
  *     name is atomary test description,
  *     func is function to be executed. Function func executes without
  *         parameters and should return bool value (true or false). If func
  *         failed (throws exception), then it's value assemed false.
  * @return {Object} - the object {Bool success, String msg}, where
  *     success is result of the function (if function failed then false),
  *     msg is concatenation of test description and formatted result
  *         (using resultToString).
  * @author Maxim Georgievskiy <max.kharkov.ua@gmail.com>
  *
  **/
function performTest(test) {
    try {
        var r = test.func();
    } catch (e) {
        r = false;
    }
    return {
        success: r, 
        msg: test.name + ': ' + resultToString(r)
    };
}

/**
  * Executes group of tests. Used in centralized test units.
  * Usually, section stored in separate variable.
  *
  * @param {Object} group - the object {String name, Array<Object> tests}, where
  *     name is test group description,
  *     tests is array of anatomary tests, each of them could be passed
  *         as parameter to the performTest.
  * @return {Object} - the object {Bool success, String msg}, where
  *     success is true when all tests passed successfully, otherwise false,
  *     msg is concatenation of the section description and list of the all
  *         simple test messages.
  * @author Maxim Georgievskiy <max.kharkov.ua@gmail.com>
  *
  **/
function performTestGroup(group) {
    var result = {
        success: true, 
        msg: '<ul>'
    };
    for (var i in group.tests) {
        var r = performTest(group.tests[i]);
        result.success &= r.success;
        result.msg += '<li>' + r.msg + '</li>';
    }
    result.msg = '<h2>' + group.name + ': ' + resultToString(result.success) + '</h2>' + result.msg  + '</ul>';
    
    return result;
}

function runTest(test){
    if(typeof test.tests == undefined){ //single test
        try {
            var r = test.func();
        } catch (e) {
            r = false;
        }
        return {
            success: r, 
            msg: test.name + ': ' + resultToString(r)
        };
    }
    else{ //contains subtests
        var m = '<ul>';
        var s = true;
        for (var i in test.tests) {
            var r = runTest(test.tests[i]);
            s &= r.success;
            m += '<li>' + r.msg + '</li>';
        }
        m = '<h2>' + test.name + ': ' + resultToString(result.success) + '</h2>' + result.msg  + '</ul>';

        return {success : succ,
                messages:  msg
        };
    }
}

/**
  * Executes unit test (a set of sections of tests). Used in centralized test
  * units. Normally, each unit test is stored in separate file.
  *
  * @param {Object} unit - the object {String id, String name, Array<Test> tests, Array<TestGroup> testGroups}, where
  *     id is variable name (used for url generating in performGroupTest),
  *     name is test unit description,
  *     tests is array of tests, each of them could be passed as parameter
  *         to the performTes.
  *     testGroup is array of groups of tests, each group could be passed as parameter
  *         to the performTestGroup.
  * @return {Object} - the object {Bool success, String msg}, where
  *     success is true when all sections passed successfully, otherwise false,
  *     msg is concatenation of the unit description and list of the all section
  *         messages.
  * @author Maxim Georgievskiy <max.kharkov.ua@gmail.com>
  *
  **/
function performUnitTest(unit) {
    var result = {
        success: true, 
        msg: '<hr />'
    };
    if (unit.tests) {
        result.msg += '<ul>';
        for (var i in unit.tests) {
            var r = performTest(unit.tests[i]);
            result.success &= r.success;
            result.msg += '<li>' + r.msg + '</li>';
        }
        result.msg += '</ul>';
    }

    //    if(typeof(unit.testGroups) == undefined){
    //        alert('Undefined');
    //    }
    
    if (unit.testGroups) {
        for (var i in unit.testGroups) {
            var r = performTestGroup(unit.testGroups[i]);
            result.success &= r.success;
            result.msg += r.msg + '<br />';
        }
    }
    
    result.msg = '<h1>Unit ' + unit.id + ': ' + resultToString(result.success) + '<br /><small>' + unit.name +
    '</small></h1>' + result.msg;
    return result;
}
