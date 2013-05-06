(function (){

    var x;
    var y;
    var cmdCreateFig;
    var figureId;

    module( "Commands.Undo tests" , {
        /*
        * Create new Figure on setup before every test run.
        */
        setup: function () {
            x = 10;
            y = 50;

            cmdCreateFig = new FigureCreateCommand(figure_Square, x, y);
            cmdCreateFig.execute();

            // after executing of FigureCreateCommand selectedFigureId
            // store Id value of new created Figure
            figureId = selectedFigureId;
        }
    });

    /**
     * Call FigureCreateCommand::undo (actually, remove Figure)
     * and then try to find Figure
     */
    test("Commands.FigureCreateCommand", function () {
        cmdCreateFig.undo();

        var figure = STACK.figureGetById(figureId);

        ok(figure == null, "After FigureCreateCommand::Undo figure doesn't exist.");
    });


    /**
     * Get current value of figure's Text, set new by ShapeChangePropertyCommand::execute,
     * return previous Text value by ShapeChangePropertyCommand::undo and compare it with old stored value.
     */
    test("Commands.ShapeChangePropertyCommand", function () {
        var figure = STACK.figureGetById(figureId);

        // Name of Text property for Square figure
        var property = "primitives.1.str";

        var previousValue = figure.getText().str;
        var newValue = previousValue + 'New';

        // change text of figure
        var command = new ShapeChangePropertyCommand(figureId, property, newValue);
        command.execute();

        // and turn back previous value by undo
        command.undo();

        ok(previousValue == figure.getText().str, "After ShapeChangePropertyCommand::Undo figure contains previous value of Text.");
    });

})()
