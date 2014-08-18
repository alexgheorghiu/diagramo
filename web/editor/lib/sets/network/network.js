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

figureSets["network"] = { 
    name : 'Network',
    description : 'A tiny set of network related figures',
    figures:[
        {figureFunction: "Person", image: "1_person.png"},
        {figureFunction: "Switch", image: "2_switch.png"},    
        {figureFunction: "Router", image: "3_router.png"},    
        {figureFunction: "Cloud", image: "4_cloud.png"},    
        {figureFunction: "Server", image: "5_server.png"},
        {figureFunction: "Firewall", image: "6_firewall.png"},
        {figureFunction: "Building", image: "7_building.png"},
        {figureFunction: "Laptop", image: "8_laptop.png"},
        {figureFunction: "Desktop", image: "9_desktop.png"},
        {figureFunction: "Lock", image: "10_lock.png"},
        {figureFunction: "PDA", image: "11_pda.png"},
        {figureFunction: "Phone", image: "12_phone.png"},
        {figureFunction: "Printer", image: "13_printer.png"},
        {figureFunction: "Database", image: "14_database.png"},
        {figureFunction: "UPS", image: "15_ups.png"},
        {figureFunction: "Wireless", image: "16_wireless_router.png"}
    ]
}
function figure_Person(x, y)
{
    var f = new Figure("Person");
    f.style.fillStyle = FigureDefaults.fillStyle;
    f.style.strokeStyle = FigureDefaults.strokeStyle;
    
    //Image
    var url = figureSetsURL + "/svg.php?set=network&figure=1_person";
    
    var ifig = new ImageFrame(url, x, y, true, 48, 48);
    ifig.debug = true;
    f.addPrimitive(ifig);    
    
    //Text
    f.properties.push(new BuilderProperty('Text', 'primitives.1.str', BuilderProperty.TYPE_TEXT));
    f.properties.push(new BuilderProperty('Text Size', 'primitives.1.size', BuilderProperty.TYPE_TEXT_FONT_SIZE));
    f.properties.push(new BuilderProperty('Font', 'primitives.1.font', BuilderProperty.TYPE_TEXT_FONT_FAMILY));
    f.properties.push(new BuilderProperty('Alignment', 'primitives.1.align', BuilderProperty.TYPE_TEXT_FONT_ALIGNMENT));
    f.properties.push(new BuilderProperty('Text Underlined', 'primitives.1.underlined', BuilderProperty.TYPE_TEXT_UNDERLINED));
    f.properties.push(new BuilderProperty('Text Color', 'primitives.1.style.fillStyle', BuilderProperty.TYPE_COLOR));
    
//    f.properties.push(new BuilderProperty(BuilderProperty.SEPARATOR));
    f.properties.push(new BuilderProperty('URL', 'url', BuilderProperty.TYPE_URL));
    
    var t2 = new Text(FigureDefaults.textStr, x, y + 24, FigureDefaults.textFont, FigureDefaults.textSize);
    t2.style.fillStyle = FigureDefaults.textColor;
    f.addPrimitive(t2);
    
    //Connection Points
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + 24, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x - 24, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y - 24), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y + 35), ConnectionPoint.TYPE_FIGURE);
    
    f.finalise();
    return f;
}



function figure_Switch(x, y){
    /*As we do not know the size of the image (util it is loaded and is too late)
     * we need to specify the size of it*/
    var imageWidth = 48.75;
    var imageHeight = 32.375;
   
    
    var f = new Figure("Switch");
    f.style.fillStyle = FigureDefaults.fillStyle;
    f.style.strokeStyle = FigureDefaults.strokeStyle;
    
    //Image
    var url = figureSetsURL + "/svg.php?set=network&figure=2_switch";
    
    var ifig = new ImageFrame(url, x, y, true, imageWidth, imageHeight);
    ifig.debug = true;
    f.addPrimitive(ifig);    
    
    //Text
    f.properties.push(new BuilderProperty('Text', 'primitives.1.str', BuilderProperty.TYPE_TEXT));
    f.properties.push(new BuilderProperty('Text Size', 'primitives.1.size', BuilderProperty.TYPE_TEXT_FONT_SIZE));
    f.properties.push(new BuilderProperty('Font', 'primitives.1.font', BuilderProperty.TYPE_TEXT_FONT_FAMILY));
    f.properties.push(new BuilderProperty('Alignment', 'primitives.1.align', BuilderProperty.TYPE_TEXT_FONT_ALIGNMENT));
    f.properties.push(new BuilderProperty('Text Underlined', 'primitives.1.underlined', BuilderProperty.TYPE_TEXT_UNDERLINED));
    f.properties.push(new BuilderProperty('Text Color', 'primitives.1.style.fillStyle', BuilderProperty.TYPE_COLOR));
    
//    f.properties.push(new BuilderProperty(BuilderProperty.SEPARATOR));
    f.properties.push(new BuilderProperty('URL', 'url', BuilderProperty.TYPE_URL));
    
    var t2 = new Text(FigureDefaults.textStr, x, y + imageHeight/2 + 5, FigureDefaults.textFont, FigureDefaults.textSize);
    t2.style.fillStyle = FigureDefaults.textColor;
    f.addPrimitive(t2);
    
    //Connection Points
    
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + imageWidth/2, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x - imageWidth/2, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y - imageHeight/2), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y + imageHeight/2 + 5 + 14 ), ConnectionPoint.TYPE_FIGURE);
    
    f.finalise();
    return f;
}


function figure_Router(x, y){
    /*As we do not know the size of the image (util it is loaded and is too late)
     * we need to specify the size of it*/
    var imageWidth = 48.75;
    var imageHeight = 32.375;
   
    
    var f = new Figure("Router");
    f.style.fillStyle = FigureDefaults.fillStyle;
    f.style.strokeStyle = FigureDefaults.strokeStyle;
    
    //Image
    var url = figureSetsURL + "/svg.php?set=network&figure=3_router";
    
    var ifig = new ImageFrame(url, x, y, true, imageWidth, imageHeight);
    ifig.debug = true;
    f.addPrimitive(ifig);    
    
    //Text
    f.properties.push(new BuilderProperty('Text', 'primitives.1.str', BuilderProperty.TYPE_TEXT));
    f.properties.push(new BuilderProperty('Text Size', 'primitives.1.size', BuilderProperty.TYPE_TEXT_FONT_SIZE));
    f.properties.push(new BuilderProperty('Font', 'primitives.1.font', BuilderProperty.TYPE_TEXT_FONT_FAMILY));
    f.properties.push(new BuilderProperty('Alignment', 'primitives.1.align', BuilderProperty.TYPE_TEXT_FONT_ALIGNMENT));
    f.properties.push(new BuilderProperty('Text Underlined', 'primitives.1.underlined', BuilderProperty.TYPE_TEXT_UNDERLINED));
    f.properties.push(new BuilderProperty('Text Color', 'primitives.1.style.fillStyle', BuilderProperty.TYPE_COLOR));
    
//    f.properties.push(new BuilderProperty(BuilderProperty.SEPARATOR));
    f.properties.push(new BuilderProperty('URL', 'url', BuilderProperty.TYPE_URL));
    
    var t2 = new Text(FigureDefaults.textStr, x, y + imageHeight/2 + 5, FigureDefaults.textFont, FigureDefaults.textSize);
    t2.style.fillStyle = FigureDefaults.textColor;
    f.addPrimitive(t2);
    
    //Connection Points
    
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + imageWidth/2, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x - imageWidth/2, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y - imageHeight/2), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y + imageHeight/2 + 5 + 14 ), ConnectionPoint.TYPE_FIGURE);
    
    f.finalise();
    return f;
}


function figure_Cloud(x, y){
    /*As we do not know the size of the image (util it is loaded and is too late)
     * we need to specify the size of it*/
    var imageWidth = 100;
    var imageHeight = 100;
   
    
    var f = new Figure("Cloud");
    f.style.fillStyle = FigureDefaults.fillStyle;
    f.style.strokeStyle = FigureDefaults.strokeStyle;
    
    //Image
    var url = figureSetsURL + "/svg.php?set=network&figure=4_cloud";
    
    var ifig = new ImageFrame(url, x, y, true, imageWidth, imageHeight);
    ifig.debug = true;
    f.addPrimitive(ifig);    
    
    //Text
    f.properties.push(new BuilderProperty('Text', 'primitives.1.str', BuilderProperty.TYPE_TEXT));
    f.properties.push(new BuilderProperty('Text Size', 'primitives.1.size', BuilderProperty.TYPE_TEXT_FONT_SIZE));
    f.properties.push(new BuilderProperty('Font', 'primitives.1.font', BuilderProperty.TYPE_TEXT_FONT_FAMILY));
    f.properties.push(new BuilderProperty('Alignment', 'primitives.1.align', BuilderProperty.TYPE_TEXT_FONT_ALIGNMENT));
    f.properties.push(new BuilderProperty('Text Underlined', 'primitives.1.underlined', BuilderProperty.TYPE_TEXT_UNDERLINED));
    f.properties.push(new BuilderProperty('Text Color', 'primitives.1.style.fillStyle', BuilderProperty.TYPE_COLOR));
    
//    f.properties.push(new BuilderProperty(BuilderProperty.SEPARATOR));
    f.properties.push(new BuilderProperty('URL', 'url', BuilderProperty.TYPE_URL));
    
    
    var t2 = new Text(FigureDefaults.textStr, x, y + imageHeight/2 + 5, FigureDefaults.textFont, FigureDefaults.textSize);
    t2.style.fillStyle = FigureDefaults.textColor;
    f.addPrimitive(t2);
    
    //Connection Points
    
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + imageWidth/2, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x - imageWidth/2, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y - imageHeight/2), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y + imageHeight/2 + 5 + 14 ), ConnectionPoint.TYPE_FIGURE);
    
    f.finalise();
    return f;
}

function figure_Server(x, y){
    /*As we do not know the size of the image (util it is loaded and is too late)
     * we need to specify the size of it*/
    var imageWidth = 37.59;
    var imageHeight = 60.125;
   
    
    var f = new Figure("Server");
    f.style.fillStyle = FigureDefaults.fillStyle;
    f.style.strokeStyle = FigureDefaults.strokeStyle;
    
    //Image
    var url = figureSetsURL + "/svg.php?set=network&figure=5_server";
    
    var ifig = new ImageFrame(url, x, y, true, imageWidth, imageHeight);
    ifig.debug = true;
    f.addPrimitive(ifig);    
    
    //Text
    f.properties.push(new BuilderProperty('Text', 'primitives.1.str', BuilderProperty.TYPE_TEXT));
    f.properties.push(new BuilderProperty('Text Size', 'primitives.1.size', BuilderProperty.TYPE_TEXT_FONT_SIZE));
    f.properties.push(new BuilderProperty('Font', 'primitives.1.font', BuilderProperty.TYPE_TEXT_FONT_FAMILY));
    f.properties.push(new BuilderProperty('Alignment', 'primitives.1.align', BuilderProperty.TYPE_TEXT_FONT_ALIGNMENT));
    f.properties.push(new BuilderProperty('Text Underlined', 'primitives.1.underlined', BuilderProperty.TYPE_TEXT_UNDERLINED));
    f.properties.push(new BuilderProperty('Text Color', 'primitives.1.style.fillStyle', BuilderProperty.TYPE_COLOR));
    
//    f.properties.push(new BuilderProperty(BuilderProperty.SEPARATOR));
    f.properties.push(new BuilderProperty('URL', 'url', BuilderProperty.TYPE_URL));
    
    var t2 = new Text(FigureDefaults.textStr, x, y + imageHeight/2 + 5, FigureDefaults.textFont, FigureDefaults.textSize);
    t2.style.fillStyle = FigureDefaults.textColor;
    f.addPrimitive(t2);
    
    //Connection Points
    
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + imageWidth/2, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x - imageWidth/2, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y - imageHeight/2), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y + imageHeight/2 + 5 + 14 ), ConnectionPoint.TYPE_FIGURE);
    
    f.finalise();
    return f;
}


function figure_Firewall(x, y){
    /*As we do not know the size of the image (util it is loaded and is too late)
     * we need to specify the size of it*/
    var imageWidth = 48.897;
    var imageHeight = 55.66;
   
    
    var f = new Figure("Firewall");
    f.style.fillStyle = FigureDefaults.fillStyle;
    f.style.strokeStyle = FigureDefaults.strokeStyle;
    
    //Image
    var url = figureSetsURL + "/svg.php?set=network&figure=6_firewall";
    
    var ifig = new ImageFrame(url, x, y, true, imageWidth, imageHeight);
    ifig.debug = true;
    f.addPrimitive(ifig);    
    
    //Text
    f.properties.push(new BuilderProperty('Text', 'primitives.1.str', BuilderProperty.TYPE_TEXT));
    f.properties.push(new BuilderProperty('Text Size', 'primitives.1.size', BuilderProperty.TYPE_TEXT_FONT_SIZE));
    f.properties.push(new BuilderProperty('Font', 'primitives.1.font', BuilderProperty.TYPE_TEXT_FONT_FAMILY));
    f.properties.push(new BuilderProperty('Alignment', 'primitives.1.align', BuilderProperty.TYPE_TEXT_FONT_ALIGNMENT));
    f.properties.push(new BuilderProperty('Text Underlined', 'primitives.1.underlined', BuilderProperty.TYPE_TEXT_UNDERLINED));
    f.properties.push(new BuilderProperty('Text Color', 'primitives.1.style.fillStyle', BuilderProperty.TYPE_COLOR));
    
//    f.properties.push(new BuilderProperty(BuilderProperty.SEPARATOR));
    f.properties.push(new BuilderProperty('URL', 'url', BuilderProperty.TYPE_URL));
    
    var t2 = new Text(FigureDefaults.textStr, x, y + imageHeight/2 + 5, FigureDefaults.textFont, FigureDefaults.textSize);
    t2.style.fillStyle = FigureDefaults.textColor;
    f.addPrimitive(t2);
    
    //Connection Points
    
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + imageWidth/2, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x - imageWidth/2, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y - imageHeight/2), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y + imageHeight/2 + 5 + 14 ), ConnectionPoint.TYPE_FIGURE);
    
    f.finalise();
    return f;
}


function figure_Building(x, y){
    /*As we do not know the size of the image (util it is loaded and is too late)
     * we need to specify the size of it*/
    var imageWidth = 60;
    var imageHeight = 94.167;
   
    
    var f = new Figure("Building");
    f.style.fillStyle = FigureDefaults.fillStyle;
    f.style.strokeStyle = FigureDefaults.strokeStyle;
    
    //Image
    var url = figureSetsURL + "/svg.php?set=network&figure=7_building";
    
    var ifig = new ImageFrame(url, x, y, true, imageWidth, imageHeight);
    ifig.debug = true;
    f.addPrimitive(ifig);    
    
    //Text
    f.properties.push(new BuilderProperty('Text', 'primitives.1.str', BuilderProperty.TYPE_TEXT));
    f.properties.push(new BuilderProperty('Text Size', 'primitives.1.size', BuilderProperty.TYPE_TEXT_FONT_SIZE));
    f.properties.push(new BuilderProperty('Font', 'primitives.1.font', BuilderProperty.TYPE_TEXT_FONT_FAMILY));
    f.properties.push(new BuilderProperty('Alignment', 'primitives.1.align', BuilderProperty.TYPE_TEXT_FONT_ALIGNMENT));
    f.properties.push(new BuilderProperty('Text Underlined', 'primitives.1.underlined', BuilderProperty.TYPE_TEXT_UNDERLINED));
    f.properties.push(new BuilderProperty('Text Color', 'primitives.1.style.fillStyle', BuilderProperty.TYPE_COLOR));
    
//    f.properties.push(new BuilderProperty(BuilderProperty.SEPARATOR));
    f.properties.push(new BuilderProperty('URL', 'url', BuilderProperty.TYPE_URL));
    
    var t2 = new Text(FigureDefaults.textStr, x, y + imageHeight/2 + 5, FigureDefaults.textFont, FigureDefaults.textSize);
    t2.style.fillStyle = FigureDefaults.textColor;
    f.addPrimitive(t2);
    
    //Connection Points
    
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + imageWidth/2, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x - imageWidth/2, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y - imageHeight/2), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y + imageHeight/2 + 5 + 14 ), ConnectionPoint.TYPE_FIGURE);
    
    f.finalise();
    return f;
}

function figure_Laptop(x, y){
    /*As we do not know the size of the image (util it is loaded and is too late)
     * we need to specify the size of it*/
    var imageWidth = 54;
    var imageHeight = 48.5;
   
    
    var f = new Figure("Laptop");
    f.style.fillStyle = FigureDefaults.fillStyle;
    f.style.strokeStyle = FigureDefaults.strokeStyle;
    
    //Image
    var url = figureSetsURL + "/svg.php?set=network&figure=8_laptop";
    
    var ifig = new ImageFrame(url, x, y, true, imageWidth, imageHeight);
    ifig.debug = true;
    f.addPrimitive(ifig);    
    
    //Text
    f.properties.push(new BuilderProperty('Text', 'primitives.1.str', BuilderProperty.TYPE_TEXT));
    f.properties.push(new BuilderProperty('Text Size', 'primitives.1.size', BuilderProperty.TYPE_TEXT_FONT_SIZE));
    f.properties.push(new BuilderProperty('Font', 'primitives.1.font', BuilderProperty.TYPE_TEXT_FONT_FAMILY));
    f.properties.push(new BuilderProperty('Alignment', 'primitives.1.align', BuilderProperty.TYPE_TEXT_FONT_ALIGNMENT));
    f.properties.push(new BuilderProperty('Text Underlined', 'primitives.1.underlined', BuilderProperty.TYPE_TEXT_UNDERLINED));
    f.properties.push(new BuilderProperty('Text Color', 'primitives.1.style.fillStyle', BuilderProperty.TYPE_COLOR));
    
//    f.properties.push(new BuilderProperty(BuilderProperty.SEPARATOR));
    f.properties.push(new BuilderProperty('URL', 'url', BuilderProperty.TYPE_URL));
    
    var t2 = new Text(FigureDefaults.textStr, x, y + imageHeight/2 + 5, FigureDefaults.textFont, FigureDefaults.textSize);
    t2.style.fillStyle = FigureDefaults.textColor;
    f.addPrimitive(t2);
    
    //Connection Points
    
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + imageWidth/2, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x - imageWidth/2, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y - imageHeight/2), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y + imageHeight/2 + 5 + 14 ), ConnectionPoint.TYPE_FIGURE);
    
    f.finalise();
    return f;
}





function figure_Desktop(x, y){
    /*As we do not know the size of the image (util it is loaded and is too late)
     * we need to specify the size of it*/
    var imageWidth = 48;
    var imageHeight = 48;
   
    
    var f = new Figure("Desktop");
    f.style.fillStyle = FigureDefaults.fillStyle;
    f.style.strokeStyle = FigureDefaults.strokeStyle;
    
    //Image
    var url = figureSetsURL + "/svg.php?set=network&figure=9_desktop";
    
    var ifig = new ImageFrame(url, x, y, true, imageWidth, imageHeight);
    ifig.debug = true;
    f.addPrimitive(ifig);    
    
    //Text
    f.properties.push(new BuilderProperty('Text', 'primitives.1.str', BuilderProperty.TYPE_TEXT));
    f.properties.push(new BuilderProperty('Text Size', 'primitives.1.size', BuilderProperty.TYPE_TEXT_FONT_SIZE));
    f.properties.push(new BuilderProperty('Font', 'primitives.1.font', BuilderProperty.TYPE_TEXT_FONT_FAMILY));
    f.properties.push(new BuilderProperty('Alignment', 'primitives.1.align', BuilderProperty.TYPE_TEXT_FONT_ALIGNMENT));
    f.properties.push(new BuilderProperty('Text Underlined', 'primitives.1.underlined', BuilderProperty.TYPE_TEXT_UNDERLINED));
    f.properties.push(new BuilderProperty('Text Color', 'primitives.1.style.fillStyle', BuilderProperty.TYPE_COLOR));
    
//    f.properties.push(new BuilderProperty(BuilderProperty.SEPARATOR));
    f.properties.push(new BuilderProperty('URL', 'url', BuilderProperty.TYPE_URL));
    
    var t2 = new Text(FigureDefaults.textStr, x, y + imageHeight/2 + 5, FigureDefaults.textFont, FigureDefaults.textSize);
    t2.style.fillStyle = FigureDefaults.textColor;
    f.addPrimitive(t2);
    
    //Connection Points
    
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + imageWidth/2, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x - imageWidth/2, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y - imageHeight/2), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y + imageHeight/2 + 5 + 14 ), ConnectionPoint.TYPE_FIGURE);
    
    f.finalise();
    return f;
}


function figure_Lock(x, y){
    /*As we do not know the size of the image (util it is loaded and is too late)
     * we need to specify the size of it*/
    var imageWidth = 24.5;
    var imageHeight = 31.7;
   
    
    var f = new Figure("Lock");
    f.style.fillStyle = FigureDefaults.fillStyle;
    f.style.strokeStyle = FigureDefaults.strokeStyle;
    
    //Image
    var url = figureSetsURL + "/svg.php?set=network&figure=10_lock";
    
    var ifig = new ImageFrame(url, x, y, true, imageWidth, imageHeight);
    ifig.debug = true;
    f.addPrimitive(ifig);    
    
    //Text
    f.properties.push(new BuilderProperty('Text', 'primitives.1.str', BuilderProperty.TYPE_TEXT));
    f.properties.push(new BuilderProperty('Text Size', 'primitives.1.size', BuilderProperty.TYPE_TEXT_FONT_SIZE));
    f.properties.push(new BuilderProperty('Font', 'primitives.1.font', BuilderProperty.TYPE_TEXT_FONT_FAMILY));
    f.properties.push(new BuilderProperty('Alignment', 'primitives.1.align', BuilderProperty.TYPE_TEXT_FONT_ALIGNMENT));
    f.properties.push(new BuilderProperty('Text Underlined', 'primitives.1.underlined', BuilderProperty.TYPE_TEXT_UNDERLINED));
    f.properties.push(new BuilderProperty('Text Color', 'primitives.1.style.fillStyle', BuilderProperty.TYPE_COLOR));
    
//    f.properties.push(new BuilderProperty(BuilderProperty.SEPARATOR));
    f.properties.push(new BuilderProperty('URL', 'url', BuilderProperty.TYPE_URL));
    
    var t2 = new Text(FigureDefaults.textStr, x, y + imageHeight/2 + 5, FigureDefaults.textFont, FigureDefaults.textSize);
    t2.style.fillStyle = FigureDefaults.textColor;
    f.addPrimitive(t2);
    
    //Connection Points
    
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + imageWidth/2, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x - imageWidth/2, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y - imageHeight/2), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y + imageHeight/2 + 5 + 14 ), ConnectionPoint.TYPE_FIGURE);
    
    f.finalise();
    return f;
}


function figure_PDA(x, y){
    /*As we do not know the size of the image (util it is loaded and is too late)
     * we need to specify the size of it*/
    var imageWidth = 36.66;
    var imageHeight = 58.543;
   
    
    var f = new Figure("PDA");
    f.style.fillStyle = FigureDefaults.fillStyle;
    f.style.strokeStyle = FigureDefaults.strokeStyle;
    
    //Image
    var url = figureSetsURL + "/svg.php?set=network&figure=11_pda";
    
    var ifig = new ImageFrame(url, x, y, true, imageWidth, imageHeight);
    ifig.debug = true;
    f.addPrimitive(ifig);    
    
    //Text
    f.properties.push(new BuilderProperty('Text', 'primitives.1.str', BuilderProperty.TYPE_TEXT));
    f.properties.push(new BuilderProperty('Text Size', 'primitives.1.size', BuilderProperty.TYPE_TEXT_FONT_SIZE));
    f.properties.push(new BuilderProperty('Font', 'primitives.1.font', BuilderProperty.TYPE_TEXT_FONT_FAMILY));
    f.properties.push(new BuilderProperty('Alignment', 'primitives.1.align', BuilderProperty.TYPE_TEXT_FONT_ALIGNMENT));
    f.properties.push(new BuilderProperty('Text Underlined', 'primitives.1.underlined', BuilderProperty.TYPE_TEXT_UNDERLINED));
    f.properties.push(new BuilderProperty('Text Color', 'primitives.1.style.fillStyle', BuilderProperty.TYPE_COLOR));
    
//    f.properties.push(new BuilderProperty(BuilderProperty.SEPARATOR));
    f.properties.push(new BuilderProperty('URL', 'url', BuilderProperty.TYPE_URL));
    
    var t2 = new Text(FigureDefaults.textStr, x, y + imageHeight/2 + 5, FigureDefaults.textFont, FigureDefaults.textSize);
    t2.style.fillStyle = FigureDefaults.textColor;
    f.addPrimitive(t2);
    
    //Connection Points
    
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + imageWidth/2, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x - imageWidth/2, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y - imageHeight/2), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y + imageHeight/2 + 5 + 14 ), ConnectionPoint.TYPE_FIGURE);
    
    f.finalise();
    return f;
}


function figure_Phone(x, y){
    /*As we do not know the size of the image (util it is loaded and is too late)
     * we need to specify the size of it*/
    var imageWidth = 43.033;
    var imageHeight = 37.081;
   
    
    var f = new Figure("Phone");
    f.style.fillStyle = FigureDefaults.fillStyle;
    f.style.strokeStyle = FigureDefaults.strokeStyle;
    
    //Image
    var url = figureSetsURL + "/svg.php?set=network&figure=12_phone";
    
    var ifig = new ImageFrame(url, x, y, true, imageWidth, imageHeight);
    ifig.debug = true;
    f.addPrimitive(ifig);    
    
    //Text
    f.properties.push(new BuilderProperty('Text', 'primitives.1.str', BuilderProperty.TYPE_TEXT));
    f.properties.push(new BuilderProperty('Text Size', 'primitives.1.size', BuilderProperty.TYPE_TEXT_FONT_SIZE));
    f.properties.push(new BuilderProperty('Font', 'primitives.1.font', BuilderProperty.TYPE_TEXT_FONT_FAMILY));
    f.properties.push(new BuilderProperty('Alignment', 'primitives.1.align', BuilderProperty.TYPE_TEXT_FONT_ALIGNMENT));
    f.properties.push(new BuilderProperty('Text Underlined', 'primitives.1.underlined', BuilderProperty.TYPE_TEXT_UNDERLINED));
    f.properties.push(new BuilderProperty('Text Color', 'primitives.1.style.fillStyle', BuilderProperty.TYPE_COLOR));
    
//    f.properties.push(new BuilderProperty(BuilderProperty.SEPARATOR));
    f.properties.push(new BuilderProperty('URL', 'url', BuilderProperty.TYPE_URL));
    
    var t2 = new Text(FigureDefaults.textStr, x, y + imageHeight/2 + 5, FigureDefaults.textFont, FigureDefaults.textSize);
    t2.style.fillStyle = FigureDefaults.textColor;
    f.addPrimitive(t2);
    
    //Connection Points
    
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + imageWidth/2, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x - imageWidth/2, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y - imageHeight/2), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y + imageHeight/2 + 5 + 14 ), ConnectionPoint.TYPE_FIGURE);
    
    f.finalise();
    return f;
}


function figure_Printer(x, y){
    /*As we do not know the size of the image (util it is loaded and is too late)
     * we need to specify the size of it*/
    var imageWidth = 48;
    var imageHeight = 48;
   
    
    var f = new Figure("Printer");
    f.style.fillStyle = FigureDefaults.fillStyle;
    f.style.strokeStyle = FigureDefaults.strokeStyle;
    
    //Image
    var url = figureSetsURL + "/svg.php?set=network&figure=13_printer";
    
    var ifig = new ImageFrame(url, x, y, true, imageWidth, imageHeight);
    ifig.debug = true;
    f.addPrimitive(ifig);    
    
    //Text
    f.properties.push(new BuilderProperty('Text', 'primitives.1.str', BuilderProperty.TYPE_TEXT));
    f.properties.push(new BuilderProperty('Text Size', 'primitives.1.size', BuilderProperty.TYPE_TEXT_FONT_SIZE));
    f.properties.push(new BuilderProperty('Font', 'primitives.1.font', BuilderProperty.TYPE_TEXT_FONT_FAMILY));
    f.properties.push(new BuilderProperty('Alignment', 'primitives.1.align', BuilderProperty.TYPE_TEXT_FONT_ALIGNMENT));
    f.properties.push(new BuilderProperty('Text Underlined', 'primitives.1.underlined', BuilderProperty.TYPE_TEXT_UNDERLINED));
    f.properties.push(new BuilderProperty('Text Color', 'primitives.1.style.fillStyle', BuilderProperty.TYPE_COLOR));
    
//    f.properties.push(new BuilderProperty(BuilderProperty.SEPARATOR));
    f.properties.push(new BuilderProperty('URL', 'url', BuilderProperty.TYPE_URL));
    
    var t2 = new Text(FigureDefaults.textStr, x, y + imageHeight/2 + 5, FigureDefaults.textFont, FigureDefaults.textSize);
    t2.style.fillStyle = FigureDefaults.textColor;
    f.addPrimitive(t2);
    
    //Connection Points
    
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + imageWidth/2, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x - imageWidth/2, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y - imageHeight/2), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y + imageHeight/2 + 5 + 14 ), ConnectionPoint.TYPE_FIGURE);
    
    f.finalise();
    return f;
}


function figure_Database(x, y){
    /*As we do not know the size of the image (util it is loaded and is too late)
     * we need to specify the size of it*/
    var imageWidth = 57.073;
    var imageHeight = 84.51;
   
    
    var f = new Figure("Database");
    f.style.fillStyle = FigureDefaults.fillStyle;
    f.style.strokeStyle = FigureDefaults.strokeStyle;
    
    //Image
    var url = figureSetsURL + "/svg.php?set=network&figure=14_database";
    
    var ifig = new ImageFrame(url, x, y, true, imageWidth, imageHeight);
    ifig.debug = true;
    f.addPrimitive(ifig);    
    
    //Text
    f.properties.push(new BuilderProperty('Text', 'primitives.1.str', BuilderProperty.TYPE_TEXT));
    f.properties.push(new BuilderProperty('Text Size', 'primitives.1.size', BuilderProperty.TYPE_TEXT_FONT_SIZE));
    f.properties.push(new BuilderProperty('Font', 'primitives.1.font', BuilderProperty.TYPE_TEXT_FONT_FAMILY));
    f.properties.push(new BuilderProperty('Alignment', 'primitives.1.align', BuilderProperty.TYPE_TEXT_FONT_ALIGNMENT));
    f.properties.push(new BuilderProperty('Text Underlined', 'primitives.1.underlined', BuilderProperty.TYPE_TEXT_UNDERLINED));
    f.properties.push(new BuilderProperty('Text Color', 'primitives.1.style.fillStyle', BuilderProperty.TYPE_COLOR));
    
//    f.properties.push(new BuilderProperty(BuilderProperty.SEPARATOR));
    f.properties.push(new BuilderProperty('URL', 'url', BuilderProperty.TYPE_URL));
    
    var t2 = new Text(FigureDefaults.textStr, x, y + imageHeight/2 + 5, FigureDefaults.textFont, FigureDefaults.textSize);
    t2.style.fillStyle = FigureDefaults.textColor;
    f.addPrimitive(t2);
    
    //Connection Points
    
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + imageWidth/2, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x - imageWidth/2, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y - imageHeight/2), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y + imageHeight/2 + 5 + 14 ), ConnectionPoint.TYPE_FIGURE);
    
    f.finalise();
    return f;
}



function figure_UPS(x, y){
    /*As we do not know the size of the image (util it is loaded and is too late)
     * we need to specify the size of it*/
    var imageWidth = 60.667;
    var imageHeight = 37.667;
   
    
    var f = new Figure("UPS");
    f.style.fillStyle = FigureDefaults.fillStyle;
    f.style.strokeStyle = FigureDefaults.strokeStyle;
    
    //Image
    var url = figureSetsURL + "/svg.php?set=network&figure=15_ups";
    
    var ifig = new ImageFrame(url, x, y, true, imageWidth, imageHeight);
    ifig.debug = true;
    f.addPrimitive(ifig);    
    
    //Text
    f.properties.push(new BuilderProperty('Text', 'primitives.1.str', BuilderProperty.TYPE_TEXT));
    f.properties.push(new BuilderProperty('Text Size', 'primitives.1.size', BuilderProperty.TYPE_TEXT_FONT_SIZE));
    f.properties.push(new BuilderProperty('Font', 'primitives.1.font', BuilderProperty.TYPE_TEXT_FONT_FAMILY));
    f.properties.push(new BuilderProperty('Alignment', 'primitives.1.align', BuilderProperty.TYPE_TEXT_FONT_ALIGNMENT));
    f.properties.push(new BuilderProperty('Text Underlined', 'primitives.1.underlined', BuilderProperty.TYPE_TEXT_UNDERLINED));
    f.properties.push(new BuilderProperty('Text Color', 'primitives.1.style.fillStyle', BuilderProperty.TYPE_COLOR));
    
//    f.properties.push(new BuilderProperty(BuilderProperty.SEPARATOR));
    f.properties.push(new BuilderProperty('URL', 'url', BuilderProperty.TYPE_URL));
    
    var t2 = new Text(FigureDefaults.textStr, x, y + imageHeight/2 + 5, FigureDefaults.textFont, FigureDefaults.textSize);
    t2.style.fillStyle = FigureDefaults.textColor;
    f.addPrimitive(t2);
    
    //Connection Points
    
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + imageWidth/2, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x - imageWidth/2, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y - imageHeight/2), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y + imageHeight/2 + 5 + 14 ), ConnectionPoint.TYPE_FIGURE);
    
    f.finalise();
    return f;
}


function figure_Wireless(x, y){
    /*As we do not know the size of the image (util it is loaded and is too late)
     * we need to specify the size of it*/
    var imageWidth = 48.75;
    var imageHeight = 53.953;
   
    
    var f = new Figure("Wireless");
    f.style.fillStyle = FigureDefaults.fillStyle;
    f.style.strokeStyle = FigureDefaults.strokeStyle;
    
    //Image
    var url = figureSetsURL + "/svg.php?set=network&figure=16_wireless_router";
    
    var ifig = new ImageFrame(url, x, y, true, imageWidth, imageHeight);
    ifig.debug = true;
    f.addPrimitive(ifig);    
    
    //Text
    f.properties.push(new BuilderProperty('Text', 'primitives.1.str', BuilderProperty.TYPE_TEXT));
    f.properties.push(new BuilderProperty('Text Size', 'primitives.1.size', BuilderProperty.TYPE_TEXT_FONT_SIZE));
    f.properties.push(new BuilderProperty('Font', 'primitives.1.font', BuilderProperty.TYPE_TEXT_FONT_FAMILY));
    f.properties.push(new BuilderProperty('Alignment', 'primitives.1.align', BuilderProperty.TYPE_TEXT_FONT_ALIGNMENT));
    f.properties.push(new BuilderProperty('Text Underlined', 'primitives.1.underlined', BuilderProperty.TYPE_TEXT_UNDERLINED));
    f.properties.push(new BuilderProperty('Text Color', 'primitives.1.style.fillStyle', BuilderProperty.TYPE_COLOR));
    
//    f.properties.push(new BuilderProperty(BuilderProperty.SEPARATOR));
    f.properties.push(new BuilderProperty('URL', 'url', BuilderProperty.TYPE_URL));
    
    var t2 = new Text(FigureDefaults.textStr, x, y + imageHeight/2 + 5, FigureDefaults.textFont, FigureDefaults.textSize);
    t2.style.fillStyle = FigureDefaults.textColor;
    f.addPrimitive(t2);
    
    //Connection Points
    
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x + imageWidth/2, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x - imageWidth/2, y), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y - imageHeight/2), ConnectionPoint.TYPE_FIGURE);
    CONNECTOR_MANAGER.connectionPointCreate(f.id, new Point(x, y + imageHeight/2 + 5 + 14 ), ConnectionPoint.TYPE_FIGURE);
    
    f.finalise();
    return f;
}
