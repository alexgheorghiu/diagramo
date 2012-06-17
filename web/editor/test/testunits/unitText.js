// In order to execute, call performUnitTest(testText)
unitText = {
    id: 'unitText',
    name: 'Test text outside canvas',
    tests: [
        {
            name: 'Equal two the same texts',
            func: function() {
                var t1 = new Text("test", 100, 50, "Arial", 10, false);
                var t2 = new Text("test", 100, 50, "Arial", 10, false);
                return t1.equals(t2);
            }
        }, {
            name: 'Clone text',
            func: function() {
                var t1 = new Text("test", 100, 50, "Arial", 10, false);
                var t2 = t1.clone();
                return t1.equals(t2);
            }
        }
    ]
};
