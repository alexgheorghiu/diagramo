"use strict";

module("Stack.js", {
    // before every test clear all Figures/Containers/Connectors in app
    setup: function() {
        var i;
        // remove figures
        var figureLength = STACK.figures.length;
        for (i = 0; i < figureLength; i++) {
            STACK.figureRemoveById(this.figures[i].id);
        }

        // remove containers
        var containerLength = STACK.containers.length;
        for (i = 0; i < containerLength; i++) {
            STACK.containerRemoveById(this.containers[i].id);
        }

        // remove connectors
        var connectorLength = CONNECTOR_MANAGER.connectors.length;
        for (i = 0; i < connectorLength; i++) {
            CONNECTOR_MANAGER.connectorRemoveById(CONNECTOR_MANAGER.connectors[i].id, true);
        }
    }
});

test("Stack.getWorkAreaBounds", function () {
    // there is no objects on work area - bounds should match canvas size
    var emptyBounds = STACK.getWorkAreaBounds();
    var canvas = getCanvas();
    ok(
        emptyBounds[0] === 0
        && emptyBounds[1] === 0
        && emptyBounds[2] === canvas.width
        && emptyBounds[3] === canvas.height,
        'no objects on work area'
    );

    // add one rectangle to Stack
    new FigureCreateCommand(figure_Rectangle, 55, 42.5).execute();

    var bounds = STACK.getWorkAreaBounds();
    ok(
        bounds[0] === 20
            && bounds[1] === 20
            && bounds[2] === 90
            && bounds[3] === 65,
        'one rectangle on work area'
    );


    // add one more rectangle to Stack
    new FigureCreateCommand(figure_Rectangle, 95, 92.5).execute();

    bounds = STACK.getWorkAreaBounds();
    ok(
        bounds[0] === 20
            && bounds[1] === 20
            && bounds[2] === 130
            && bounds[3] === 115,
        'two rectangles on work area'
    );


    // add container to Stack
    new ContainerCreateCommand(75, 80).execute();

    var bounds = STACK.getWorkAreaBounds();
    ok(
        bounds[0] === 20
            && bounds[1] === 20
            && bounds[2] === 130
            && bounds[3] === 130,
        'two rectangles and container on work area'
    );


    // add connector to ConnectionManager
    CONNECTOR_MANAGER.connectorCreate(new Point(10, 10),new Point(20, 20), 'jagged');

    var bounds = STACK.getWorkAreaBounds();
    ok(
        bounds[0] === 10
            && bounds[1] === 10
            && bounds[2] === 130
            && bounds[3] === 130,
        'two rectangles, container and connector on work area'
    );
});