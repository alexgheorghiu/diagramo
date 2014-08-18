"use strict";

/*
Copyright [2014] [Diagramo]

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

/**
 *This class offers support to add images to Diagramo engine
 *It supports PNG, GIF, PNG and SVG support. 
 *Opera (up to 11.50 at least) does not support SVG nice. @see <a href="http://my.opera.com/community/forums/topic.dml?id=1052572">http://my.opera.com/community/forums/topic.dml?id=1052572</a>
 *
 *@this {ImageFrame}
 *@constructor
 *
 *@param {String} url - the URL to load the image from
 *@param {Number} x - the x coordinates of the center of the image
 *@param {Number} y - the y coordinates of the center of the image
 *@param {Boolean} scale - true if image should be able to scan, false otherwise. 
 *@param {Number} frameWidth - the frame width
 *@param {Number} frameHeight - the frame height
 *
 *@author Alex
 *@see /documets/specs/imageframe_specs.jpg and /documets/specs/imageframe_specs2.jpg
 *
 *TODO: Source editor - a new popup window with 3 options (url, data, upload) and upon closing set image's src
 **/
function ImageFrame(url, x, y, scale, frameWidth, frameHeight){
    
    /**Keeps track if the image was loaded*/
    this.loaded = false;
            
    /**We will keep the initial point (as base line) and another point just above it - similar to a vector.
     *
     *  * (x, y-20)
     *  |
     *  |
     *  |
     *  * - - - * (x+20, y)
     * (x, y)
     *  
     *So when the image is transformed we will only transform the vector and get the new angle (if needed)
     *from it*/
    this.vector = [new Point(x,y),new Point(x,y-20), new Point(x+20, y)];
    
    
    
    /**Keeps track if contraints are present or set (ex: frameWidth or frameHeight )*/
    this.constraints = false;
    
    /**The the frame width*/
    this.frameWidth = frameWidth;    
    if(frameWidth){
        this.constraints = true;
    }
    else{
        //this.frameWidth = ImageFrame.DEFAULT_WIDTH;
        //throw "ImageFrame.js->constructor()->frameWidth not set";
    }

    
    /**The the frame height*/
    this.frameHeight = frameHeight;
    if(frameHeight){        
        this.constraints = true;
    }
    else{
        //this.frameHeight = ImageFrame.DEFAULT_HEIGHT;
        //throw "ImageFrame.js->constructor()->frameHeight not set";
    }
    
    /**Trigger or not the scalling of the image, after transformations*/
    this.scale = scale;
    
    /**Tell if we need to keep ratio of the image. Ignored. Set to true by default*/
    this.keepRatio = true;
    
    /**The URL from where the image will be loaded. 
     * We need to keep it also as a member to be serialized 
     * (as the Image object is not serialized :( by JSON)
     **/    
    this.url = url; 
    
    
    /**The JavaScript Image object. It seems that Serialization for Image, with JSON, in Chrome
     * is a little broken so we need custom serializers
     * see toJSON() method
     * */
    this.image = new Image();    
    
    this.setUrl(url);
   
    /**
     * TODO: remove it
     * Used to display visual debug information. If set on true it will display interesting stuff (for a developer)
     * @deprecated - use Diagramo.debug instead
     * */
    this.debug = false; 
    
    /**The style of the Image. Kinda fake/default value*/
    //TODO: do we really need to keep this?
    this.style = new Style();
    //    
    //    //this.url = '';
    /**The type of the object. Used in deserialization*/
    this.oType = 'ImageFrame';
}

ImageFrame.DEFAULT_WIDTH = 10;
ImageFrame.DEFAULT_HEIGHT = 10;




/**Creates a {ImageFrame} out of JSON parsed object
 *@param {JSONObject} o - the JSON parsed object
 *@return {ImageFrame} a newly constructed ImageFrame
 *@author Alex Gheorghiu <alex@scriptoid.com>
 **/
ImageFrame.load = function(o){
    var newImageFrame = new ImageFrame();
    
    //default: newImageFrame.loaded
    newImageFrame.vector = Point.loadArray(o.vector);
    //not needed: newImage.image 
    newImageFrame.constraints = o.constraints;
    newImageFrame.frameHeight = o.frameHeight;
    newImageFrame.frameWidth = o.frameWidth;    
    newImageFrame.scale = o.scale;
    newImageFrame.keepRatio = o.keepRatio;
    newImageFrame.setUrl(o.url);
    //not needed: newImage.style    
    newImageFrame.debug = o.debug;
    //not needed: newImage.type
    
    //TODO: not good to load it twice (in constructor and now again)
    
    return newImageFrame;
}


/*  Basic methods we need to implement
 *  -paint:void
 *  -tranform(matrix):void
 *  -contains(x, y):boolean
 *  -equals(object):boolean
 *  -toString():String
 *  -clone():object  - this is a deep clone
 *  -getBounds():[number, number, number, number]
 *  -near(distance):boolean - This should be used to test if a click is close to a primitive/figure
 *  -getPoints():Array - returns an array of points, so that a figure can implement contains
 *  -getStyleInfo():Style - returns the different styles that can be used by any shape
 */
ImageFrame.prototype = {
    constructor : ImageFrame,

    /**
     *Called by JSON.stringify() method. We need to use this as Chrome simply cease to execute the JS
     *whenever an Image is found.
     *
     *Note: 
     *Also it seems that @link <a href="http://code.google.com/p/json-sans-eval/">http://code.google.com/p/json-sans-eval/</a>
     *treat this issue fine....but not used much...so mentioned only for informal.
     *
     *Note:
     *"If the stringify method sees an object that contains a toJSON method, 
     *it calls that method, and stringifies the value returned. This allows an 
     *object to determine its own JSON representation."
     *
     *@see <a href="http://www.json.org/js.html">http://www.json.org/js.html</a>
     **/
    toJSON : function() {
        //return JSON.stringify(this, ['loaded', 'oType']);
        //return JSON.stringify(this);
        
        return function (anImageFrame){
            return {
                loaded : anImageFrame.loaded,
                vector : anImageFrame.vector,
                constraints : anImageFrame.constraints,
                frameWidth : anImageFrame.frameWidth,
                frameHeight : anImageFrame.frameHeight,
                scale : anImageFrame.scale,
                keepRatio : anImageFrame.keepRatio,
                url : anImageFrame.url,
                debug : anImageFrame.debug,
                style : anImageFrame.style,
                oType : anImageFrame.oType
            }
        }(this);        
    },
    
    
    /**
     *This will load the image asynchronously
     *@param {String} url - the URL used to load image from
     *
     *Note: It does not work with SVG under Opera 10.x @link <a href="http://my.opera.com/community/forums/topic.dml?id=1052572">http://my.opera.com/community/forums/topic.dml?id=1052572</a>
     **/
    setUrl : function(url){
        Log.info("ImageFrame.setUrl() : " + url);
        if(url){ //trigger only if URL is set
            this.url = url;
            this.loaded = false;
            
            //we need to reacreate the Image again as IE9 will mess up the width and heigh of the image
            this.image = new Image();
            
            //Read this http://www.thefutureoftheweb.com/blog/image-onload-isnt-being-called            
            this.image.onload = function(anImageFrame){
                return function(){
                    anImageFrame.loaded = true;
                    Log.info("ImageFrame.setUrl(): image finally loaded! :)");

                    Log.info('ImageFrame.setUrl(): image width:' + anImageFrame.image.width + ' height:' + anImageFrame.image.height);

                    //in case no frame set use image's dimensions
                    if(anImageFrame.constraints){
                        //nothing, we will keep current width and height
                        Log.info("Constrains present");
                    }
                    else{
                        Log.info("Original image loaded. Image height: " + anImageFrame.image.height + " width: " + anImageFrame.image.width)
                        if(!anImageFrame.constraints){ //if no constraints than load the image naturally
                            anImageFrame.frameHeight = anImageFrame.image.height;
                            anImageFrame.frameWidth = anImageFrame.image.width;
                        }
                    }

                    //force a repain - ouch!
                    Log.info("ImageFrame.setUrl(): force repaint");
                    draw();
                }
            } (this);
            
            //attach an error handler
            this.image.onerror = function(anImageFrame){
                return function (){
                    Log.error("Error with image. URL: " + anImageFrame.url + " loaded: " + anImageFrame.loaded);
                }
            } (this);
            
            //trigger loading
            this.image.src = url;
        }
    },
    
    
    /**We do not have to wait for an image to load to display it's URL
     *We can return the image's URL even if the image is not fully loaded/downloaded
     *@return {String} - the URL of the image or empty string ('') if no image URL present
     **/
    getUrl : function(){
        if(this.image.src){
            return this.image.src;  
        }
        else{
            return '';
        }
    },
    
    
    /**Paint the Image into the canvas context
     *@param {Context} context - the 2D context of the canvas
     **/
    paint : function(context){
        if(this.loaded){
            context.save();

            //get rotation angle
            var angle = Util.getAngle(this.vector[0],this.vector[1]);

            //make the rotation
            context.translate(this.vector[0].x, this.vector[0].y);
            context.rotate(angle);
            context.translate(-this.vector[0].x, -this.vector[0].y);
            Log.group("A paint");
            Log.info("ImageFrame.paint(): frameWidth: " + this.frameWidth + " frameHeight: " + this.frameHeight);
            Log.info("ImageFrame.paint(): image.width: " + this.image.width + " image.height: " + this.image.height);

            //scale image
            var wRatio = this.frameWidth / this.image.width ;
            var vRatio = this.frameHeight / this.image.height;
            
            //use minimum ratio
            var ratio = Math.min(wRatio, vRatio);
            Log.info("ImageFrame.paint(): wRatio: " + wRatio + " vRatio: " + vRatio + " ratio: " + ratio);

            //find new scalled width and height
            var imgScaledWidth = this.image.width * ratio;
            var imgScaleHeight = this.image.height * ratio;
            Log.info("ImageFrame.paint(): imgScaledWidth: " + imgScaledWidth + " imgScaleHeight: " + imgScaleHeight);

            //draw image
            context.drawImage(this.image, 
                this.vector[0].x - imgScaledWidth / 2, 
                this.vector[0].y - imgScaleHeight / 2,
                imgScaledWidth,
                imgScaleHeight);

            Log.groupEnd();
            context.restore();
        }
    },
    
    
    /**Transform image
     *@param {Array} matrix - the 3x3 transformation matrix
     **/
    transform : function(matrix){
        //vector's dimensions before transformation
        var vectorWidth = Math.sqrt( Math.pow(this.vector[0].x - this.vector[1].x, 2) + Math.pow(this.vector[0].y - this.vector[1].y, 2) );
        var vectorHeight = Math.sqrt( Math.pow(this.vector[0].x - this.vector[2].x, 2) + Math.pow(this.vector[0].y - this.vector[2].y, 2) );

        //transform vector
        this.vector[0].transform(matrix);
        this.vector[1].transform(matrix);
        this.vector[2].transform(matrix);

        //if scale is allowed we will do it
        if(this.scale){
            
            //vector's NEW dimensions
            var vectorWidth2 = Math.sqrt( Math.pow(this.vector[0].x - this.vector[1].x, 2) + Math.pow(this.vector[0].y - this.vector[1].y, 2) );
            var vectorHeight2 = Math.sqrt( Math.pow(this.vector[0].x - this.vector[2].x, 2) + Math.pow(this.vector[0].y - this.vector[2].y, 2) );

            //find the grow/shrink ratio
            var vRatio = vectorWidth2 / vectorWidth;
            var hRatio = vectorHeight2 / vectorHeight;

            //update the frameset
            this.frameHeight *= vRatio;
            this.frameWidth *= hRatio;
            
            //now we have constraints
            if(vRatio != 1 || hRatio != 1){
                this.constraints = true;
            }
        }
    },
    
    
    /**
     *Get the angle around the compas between the vector and North direction
     *@return {Number} - the angle in radians
     *@see /documentation/specs/angle_around_compass.jpg
     *@author alex@scriptoid.com
     **/
    getAngle: function(){
        return Util.getAngle(this.vector[0], this.vector[1]);
    },
    
    
    /**Returns the bounds the ImageFrame might have if in normal space (not rotated)
     *We will keep it as a Polygon
     *@return {Polygon} - a 4 points Polygon
     **/
    getNormalBounds:function(){

        var poly = new Polygon();
        
        if(this.frameWidth && this.frameHeight){ //until the image is loaded we do no not have dimensions set
            poly.addPoint(new Point(this.vector[0].x - this.frameWidth/2, this.vector[0].y - this.frameHeight/2));
            poly.addPoint(new Point(this.vector[0].x + this.frameWidth/2, this.vector[0].y - this.frameHeight/2));
            poly.addPoint(new Point(this.vector[0].x + this.frameWidth/2, this.vector[0].y + this.frameHeight/2));
            poly.addPoint(new Point(this.vector[0].x - this.frameWidth/2, this.vector[0].y + this.frameHeight/2));
        }
        else{ //fake/temporary bounds
            poly.addPoint(new Point(this.vector[0].x - ImageFrame.DEFAULT_WIDTH / 2, this.vector[0].y - ImageFrame.DEFAULT_HEIGHT / 2));
            poly.addPoint(new Point(this.vector[0].x + ImageFrame.DEFAULT_WIDTH / 2, this.vector[0].y - ImageFrame.DEFAULT_HEIGHT / 2));
            poly.addPoint(new Point(this.vector[0].x + ImageFrame.DEFAULT_WIDTH / 2, this.vector[0].y + ImageFrame.DEFAULT_HEIGHT / 2));
            poly.addPoint(new Point(this.vector[0].x - ImageFrame.DEFAULT_WIDTH / 2, this.vector[0].y + ImageFrame.DEFAULT_HEIGHT / 2));
        }

        return poly;
    },
    
    
    /**Tests if the Image contains a point defined by x and y
     *@param {Number} x - the x coordinates of the point
     *@param {Number} y - the y coordinates of the point
     *@return {Boolean} true - if contains, false otherwise
     **/
    contains: function(x,y){
        var contains = false;
        
        if(this.loaded){           
            var angle = this.getAngle();
            
            var nBounds = this.getNormalBounds();
            
            nBounds.transform( Matrix.translationMatrix(-this.vector[0].x, -this.vector[0].y) );
            nBounds.transform(Matrix.rotationMatrix(angle));
            nBounds.transform(Matrix.translationMatrix(this.vector[0].x, this.vector[0].y));

            try{
                contains = nBounds.contains(x,y);
            }catch(ex){
                Log.error("ImageFrame->contains(error): " + ex);
            }
        }
        
        return contains;
    },
    
    
    
    /**
     *Returns the bounds - in transformed space - of the Image
     *@return {Array} - returns [minX, minY, maxX, maxY] - bounds, where all points are in the bounds.
     */
    getBounds : function (){
        var angle = Util.getAngle(this.vector[0],this.vector[1]);
        
        var nBounds = this.getNormalBounds(); //as Polygon

        nBounds.transform(Matrix.translationMatrix(-this.vector[0].x, -this.vector[0].y) );
        nBounds.transform(Matrix.rotationMatrix(angle));
        nBounds.transform(Matrix.translationMatrix(this.vector[0].x, this.vector[0].y));

        return nBounds.getBounds();
    },


    /**
     *Fake method as Image does not have the concept of points (yet?!)
     *But we will forward to the bounds {@link Polygon}
     *@return {Array} - an array of {@link Polygon}s
     **/
    getPoints : function (){
        var angle = Util.getAngle(this.vector[0],this.vector[1]);
        
        var nBounds = this.getNormalBounds(); //as Polygon

        nBounds.transform(Matrix.translationMatrix(-this.vector[0].x, -this.vector[0].y) );
        nBounds.transform(Matrix.rotationMatrix(angle));
        nBounds.transform(Matrix.translationMatrix(this.vector[0].x, this.vector[0].y));
        
        return nBounds.getPoints();
    },
    
    /**This function returns a deed clone of current {ImageFrame}
     *@return {ImageFrame} - the cloned ImageFrame
     **/
    clone:function(){
        //make a new object
        var cImg = new ImageFrame();
        
        //copy what we can
        cImg.frameHeight = this.frameHeight;
        cImg.frameWidth = this.frameWidth;
        cImg.keepRatio = this.keepRatio;
        cImg.constraints = this.constraints;
        cImg.vector = Point.cloneArray(this.vector) ;
        
        //reset the URL so that the cImg.image will be loaded with new URL
        cImg.setUrl(this.url);
        
        return cImg;
    },
    
    /**
     *Export the image to SVG
     *@return {String} the SVG representation of the Image
     *
     Example of what image should generate
     @example
     <g transform = "rotate(10, 160, 50)">
            <svg xmlns="http://www.w3.org/2000/svg" width="320" height="100"> <!--I think x = 0 and y = 0 by default @see http://apike.ca/prog_svg_patterns.html-->
                <rect x="10" y="10" height="3" width="3" style="stroke: #006600; fill: #DDDDDD"/>
                <image x="20" y="20" width="300" height="80" xlink:href="http://diagramo.com/assets/images/logo.gif" />
            </svg>
        </g>
    @see http://tutorials.jenkov.com/svg/g-element.html ("SVG: g element")
     **/
    toSVG : function (){
        var svg = ''; 

        if(this.loaded){
            var angle = this.getAngle() * 180 / Math.PI;
            //            var angle = this.getAngle() * 180 / Math.PI;

            svg += "\n" + repeat("\t", INDENTATION) + '<g transform="rotate (' + angle + ', ' + this.vector[0].x  + ', ' + this.vector[0].y + ')">';
            INDENTATION++;
//            svg += "\n" + repeat("\t", INDENTATION) + '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">';


            Log.group("A paint");
            Log.info("ImageFrame.toSVG(): frameWidth: " + this.frameWidth + " frameHeight: " + this.frameHeight);
            Log.info("ImageFrame.toSVG(): image.width: " + this.image.width + " image.height: " + this.image.height);

            //scale image
            var wRatio = this.frameWidth / this.image.width ;
            var vRatio = this.frameHeight / this.image.height;
            var ratio = Math.min(wRatio, vRatio);
            Log.info("ImageFrame.toSVG(): wRatio: " + wRatio + " vRatio: " + vRatio + " ratio: " + ratio);

            var imgScaledWidth = this.image.width * ratio;
            var imgScaleHeight = this.image.height * ratio;
            Log.info("ImageFrame.toSVG(): imgScaledWidth: " + imgScaledWidth + " imgScaleHeight: " + imgScaleHeight);

            //        context.drawImage(this.image, this.vector[0].x - this.frameWidth / 2, 
            //                            this.vector[0].y - this.frameHeight / 2, this.frameWidth, this.frameHeight);

            var imageX = this.vector[0].x - imgScaledWidth / 2;
            var imageY = this.vector[0].y - imgScaleHeight / 2;

//            INDENTATION++;
            svg += "\n" + repeat("\t", INDENTATION) + '<image x="' + imageX + '" y="' + imageY +'" width="' + imgScaledWidth +  '" height="' + imgScaleHeight + '" xlink:href="' + this.getUrl() + '" />';
//            INDENTATION--;
            Log.groupEnd();

//            svg += "\n" + repeat("\t", INDENTATION) +  '</svg>';
            INDENTATION--;
            svg += "\n" + repeat("\t", INDENTATION) +  '</g>';
        }    

        return svg;
    }
    
    
}


/* 
 * "Static" method used for importing images
 * @param {String} url - the URL of the image. Pay attention to come from same base URL as the application
 * @param {Number} x - X coordinates of the figure
 * @param {Number} y - Y coordinates of the figure
 * @author Artyom, Alex
 * */
ImageFrame.figure_InsertedImage = function(url, x, y)
{
    // create new figure
    var f = new Figure("InsertedImage");
    f.style.fillStyle = FigureDefaults.fillStyle;
    f.style.strokeStyle = FigureDefaults.strokeStyle;

    // figure's part with image
    var ifig = new ImageFrame(url, x, y, true);
    f.addPrimitive(ifig);

    // set callback to get image's natural size and use it for new figure
    ifig.image.addEventListener("load", function (){

        // image size
        var imageWidth = ifig.image.width;
        var imageHeight = ifig.image.height;

        //Text
        f.properties.push(new BuilderProperty('Text', 'primitives.1.str', BuilderProperty.TYPE_TEXT));
        f.properties.push(new BuilderProperty('Text Size', 'primitives.1.size', BuilderProperty.TYPE_TEXT_FONT_SIZE));
        f.properties.push(new BuilderProperty('Font', 'primitives.1.font', BuilderProperty.TYPE_TEXT_FONT_FAMILY));
        f.properties.push(new BuilderProperty('Alignment', 'primitives.1.align', BuilderProperty.TYPE_TEXT_FONT_ALIGNMENT));
        f.properties.push(new BuilderProperty('Text Underlined', 'primitives.1.underlined', BuilderProperty.TYPE_TEXT_UNDERLINED));
        f.properties.push(new BuilderProperty('Text Color', 'primitives.1.style.fillStyle', BuilderProperty.TYPE_COLOR));

        f.properties.push(new BuilderProperty('URL', 'url', BuilderProperty.TYPE_URL));

        var t2 = new Text(FigureDefaults.textStr, x, y + imageHeight / 2 + FigureDefaults.textSize * 2, FigureDefaults.textFont, FigureDefaults.textSize);
        t2.style.fillStyle = FigureDefaults.textColor;
        f.addPrimitive(t2);

        ifig.frameHeight = imageHeight + FigureDefaults.textSize;

        //Connection Points
        CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + imageWidth / 2, y), ConnectionPoint.TYPE_FIGURE);
        CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x - imageWidth / 2, y), ConnectionPoint.TYPE_FIGURE);
        CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y - imageHeight / 2), ConnectionPoint.TYPE_FIGURE);
        CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y + imageHeight / 2 + FigureDefaults.textSize * 3), ConnectionPoint.TYPE_FIGURE);

        f.finalise();
        draw();
    }, false);

    f.finalise();
    return f;
};