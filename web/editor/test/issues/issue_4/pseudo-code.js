/*
 * A pseudo JS to draw a pattern (dashed, dotted, etc) along a set of point
 * points = [p1, p2,p3]
 * pt = [10,2,2 4,7] /*the pattern 10 dotts, 2 spaces, 2 dots, 7 spaces, etc
 */
function draw(ctx, points, pt) {

    /**Computes distance between 2 points*/
    function d(p1, p2) {
        return Math.sqrt(Math.pow(p[0], 2) + Math.pow(p[1], 2));
    }

    /**Find the location of a point located on segment [p1,p2] at a certain distance from p1*/
    function point_on_segment(p1, p2, distance_from_p1) {
        var d = d(p1, p2);
        var Xm = p1[0] * distance_from_p1 / d;
        var Ym = p1[1] * distance_from_p1 / d;

        return [Xm, Ym];
    }

    current_point = points[0];
    path = 0
    i = 0
    pt_i = 0 //index position in pattern
    pt_left = pt[0] // spaces or dotts left to paint from current index position in pattern

    lineTo(current_point);


    while (i < n) {
        //inside [Pi, Pi+1] segment
        segment_path = 0

        //paint previous/left part of pattern
        if (pt_left > 0) {

            //are we about to cross to another segment?
            if (pt_left > d(Pi, Pi + 1)) { //we exceed current segment

                //paint what is left and move to next segment
                if (pt_i % 2 == 0) { //dots?
                    lineTo(Pi + 1)
                }
                else { //space
                    moveTo(Pi + 1)
                }

                //store what was left unpainted
                current_point = Pi + 1
                pt_left = pt_left - d(Pi, Pi + 1)
                i++;
                continue;
            }
            else { //still inside segment
                newP = translate(current_point, pt_left) //translate on current_point with pt_left from Pi to Pi+1
                if (pt_i % 2 == 0) { //dots?
                    lineTo(Pi + 1)
                }
                else { //space
                    moveTo(Pi + 1)
                }

                current_point = newP
                pt_left = 0
                pt_i = (pt_i + 1) % pt.length;
            }
        }


        /*We should have:
         pt_i >= 0
         pt_left = 0;
         */

        //nothing left from previous segment
        while (segment_path < d(Pi, Pi + 1)) {
            if (segment_path + pt[pt_i] <= d(Pi, Pi + 1)) {
                newP = translate(current_point, pt[pt_i]) //translate on current segment with pt[pt_i] from Pi to Pi+1
                if (pt_i % 2 == 0) {
                    lineTo(newP);
                }
                else {
                    moveTo(newP);
                }
                pt_left = 0
                segment_path += pt[pt_i];
                current_point = newP;
            }
            else {
                if (pt_i % 2 == 0) {
                    lineTo(Pi + 1);
                }
                else {
                    moveTo(Pi + 1);
                }
                pt_left = pt[pt_i] - d(current_point, Pi + 1)
                segment_path += d(current_point, Pi + 1);
                current_point = Pi + 1;
            }

            pt_i = (pt_i + 1) % pt.length;
        }


        i++;
    }
}
	