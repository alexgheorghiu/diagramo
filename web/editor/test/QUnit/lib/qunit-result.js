QUnit.done(function( details ) {
    var resultDiv = document.getElementById('qunit-result');
    var resultLabel = document.createElement('a');

    resultLabel.href = "test/QUnit/UnitTests.html";

    if (details.failed) {
        resultLabel.innerHTML = 'Tests failed';
        resultDiv.className += 'qunit-result failed';
    } else {
        resultLabel.innerHTML = 'Tests passed';
        resultDiv.className += 'qunit-result passed';
    }

    resultDiv.appendChild(resultLabel);
});