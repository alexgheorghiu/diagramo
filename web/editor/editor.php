<?
require_once dirname(__FILE__) . '/common/delegate.php';

if (!isset($_SESSION)) {
    session_start();
}

require_once dirname(__FILE__) . '/common/rememberme.php';


$delegate = new Delegate();

$loggedUser = $delegate->userGetById($_SESSION['userId']);

#print_r($_SESSION['userId']);

//start diagram guardian
if(isset($_REQUEST['diagramId']) && is_numeric($_REQUEST['diagramId'])){
    if(!is_object($loggedUser)){
        print "Not allocated to this diagram";
        exit();
    }        
}
//end diagram guardian

$page = 'editor';
?>


<!DOCTYPE html>
<html>
    <!--Copyright 2010 Scriptoid s.r.l-->
    <head>
        <title>HTML5 diagram editor</title>
        <meta http-equiv="X-UA-Compatible" content="IE=9" />
        <script type="text/javascript" src="./assets/javascript/dropdownmenu.js?<?=time()?>"></script>    
        
        <link rel="stylesheet" media="screen" type="text/css" href="./assets/css/style.css" />
        <link rel="stylesheet" media="screen" type="text/css" href="./assets/css/minimap.css" />
        <? require_once("./lib/sets/figures.php");?>
        <script type="text/javascript" src="./lib/canvasprops.js?<?=time()?>"></script>
        <script type="text/javascript" src="./lib/style.js?<?=time()?>"></script>
        <script type="text/javascript" src="./lib/primitives.js?<?=time()?>"></script>
        <script type="text/javascript" src="./lib/ImageFrame.js?<?=time()?>"></script>
        <script type="text/javascript" src="./lib/matrix.js?<?=time()?>"></script>
        <script type="text/javascript" src="./lib/util.js?<?=time()?>"></script>
        <script type="text/javascript" src="./lib/key.js?<?=time()?>"></script>
        <script type="text/javascript" src="./lib/groups.js?<?=time()?>"></script>
        <script type="text/javascript" src="./lib/stack.js?<?=time()?>"></script>
        <script type="text/javascript" src="./lib/connections.js?<?=time()?>"></script>
        <script type="text/javascript" src="./lib/connectionManagers.js?<?=time()?>"></script>
        <script type="text/javascript" src="./lib/handles.js?<?=time()?>"></script>
        
        
        <script type="text/javascript" src="./lib/builder.js?<?=time()?>"></script>        
        <script type="text/javascript" src="./lib/text.js?<?=time()?>"></script>
        <script type="text/javascript" src="./lib/log.js?<?=time()?>"></script>
        <script type="text/javascript" src="./lib/text.js?<?=time()?>"></script>
        <script type="text/javascript" src="./lib/browserReady.js?<?=time()?>"></script>
        <script type="text/javascript" src="./lib/main.js?<?=time()?>"></script>
        <script type="text/javascript" src="./lib/minimap.js?<?=time()?>"></script>

        <script type="text/javascript" src="./lib/commands/History.js?<?=time()?>"></script>
        
        <script type="text/javascript" src="./lib/commands/FigureCreateCommand.js?<?=time()?>"></script>
        <script type="text/javascript" src="./lib/commands/FigureCloneCommand.js?<?=time()?>"></script>
        <script type="text/javascript" src="./lib/commands/FigureTranslateCommand.js?<?=time()?>"></script>
        <script type="text/javascript" src="./lib/commands/FigureRotateCommand.js?<?=time()?>"></script>
        <script type="text/javascript" src="./lib/commands/FigureScaleCommand.js?<?=time()?>"></script>
        <script type="text/javascript" src="./lib/commands/FigureZOrderCommand.js?<?=time()?>"></script>
        <script type="text/javascript" src="./lib/commands/FigureDeleteCommand.js?<?=time()?>"></script>
        
        <script type="text/javascript" src="./lib/commands/GroupRotateCommand.js?<?=time()?>"></script>
        <script type="text/javascript" src="./lib/commands/GroupScaleCommand.js?<?=time()?>"></script>
        <script type="text/javascript" src="./lib/commands/GroupCreateCommand.js?<?=time()?>"></script>
        <script type="text/javascript" src="./lib/commands/GroupCloneCommand.js?<?=time()?>"></script>
        <script type="text/javascript" src="./lib/commands/GroupDestroyCommand.js?<?=time()?>"></script>
        <script type="text/javascript" src="./lib/commands/GroupDeleteCommand.js?<?=time()?>"></script>
        <script type="text/javascript" src="./lib/commands/GroupTranslateCommand.js?<?=time()?>"></script>
        
        <script type="text/javascript" src="./lib/commands/ConnectorCreateCommand.js?<?=time()?>"></script>
        <script type="text/javascript" src="./lib/commands/ConnectorDeleteCommand.js?<?=time()?>"></script>                        
        
        <script type="text/javascript" src="./lib/commands/ConnectorAlterCommand.js?<?=time()?>"></script>
        
        <script type="text/javascript" src="./lib/commands/ShapeChangePropertyCommand.js?<?=time()?>"></script>
        
        <script type="text/javascript" src="./lib/commands/CanvasResizeCommand.js?<?=time()?>"></script>
        
        
        <script type="text/javascript" src="./assets/javascript/json2.js"></script>
        <script type="text/javascript" src="./assets/javascript/jquery-1.4.2.min.js"></script>
        <script type="text/javascript" src="./assets/javascript/ajaxfileupload.js"></script>
        <script type="text/javascript" src="./assets/javascript/jquery.simplemodal-1.3.5.min.js"></script>

        
        <script type="text/javascript" src="./assets/javascript/colorPicker_new.js"></script>
        <link rel="stylesheet" media="screen" type="text/css" href="./assets/css/colorPicker_new.css" />

        
        <!--[if IE]>
        <script src="./assets/javascript/excanvas.js"></script>
        <![endif]-->



        
        <script type="text/javascript">
            

             /** Save current diagram
             *See:
             *http://www.itnewb.com/v/Introduction-to-JSON-and-PHP/page3
             *http://www.onegeek.com.au/articles/programming/javascript-serialization.php
             **/
            function save(){
                //alert("save triggered!");
                Log.info('Save pressed');

                var canvas = getCanvas();
                var dataURL = canvas.toDataURL();
//                Log.info(dataURL);
//                return false;
                
                var diagram = { c: canvasProps, s:STACK, m:CONNECTOR_MANAGER };
                //Log.info('stringify ...');
                var serializedDiagram = JSON.stringify(diagram);
                //Log.info('JSON stringify : ' + serializedDiagram);
                
                var svgDiagram = toSVG();

//                alert(serializedDiagram);
//                alert(svgDiagram);
                //Log.info('SVG : ' + svgDiagram);

                //see: http://api.jquery.com/jQuery.post/
                $.post("./common/controller.php",
                    {action: 'save', diagram: serializedDiagram, png:dataURL, svg: svgDiagram, diagramId: '<?=isset($_REQUEST['diagramId']) ? $_REQUEST['diagramId'] : ''?>'},
                    function(data){
                        if(data == 'firstSave'){
                            Log.info('firstSave!');
                            window.location = './saveDiagram.php';                            
                        }
                        else if(data == 'saved'){
                            //Log.info('saved!');
                            alert('saved!');
                        }
                        else{
                            alert('Unknown: ' + data );
                        }
                    }
                );


            }

            /**Loads a saved diagram
             *@param {Number} diagramId - the id of the diagram you want to load
             **/
            function load(diagramId){
                //alert("load diagram [" + diagramId + ']');

                $.post("./common/controller.php", {action: 'load', diagramId: diagramId},
                    function(data){
//                        alert(data);
                        var obj  = eval('(' + data + ')');
                        STACK = Stack.load(obj['s']);
                        canvasProps = CanvasProps.load(obj['c']);
                        canvasProps.sync();
                        setUpEditPanel(canvasProps);

                        CONNECTOR_MANAGER = ConnectorManager.load(obj['m']);
                        draw();

                        //alert("loaded");
                    }
                );

            }


            /**Saves a diagram. Actually send the serialized version of diagram
             *for saving
             **/
            function saveAs(){
                var canvas = getCanvas();
                var dataURL = canvas.toDataURL();
                
//                var $diagram = {c:canvas.save(), s:STACK, m:CONNECTOR_MANAGER};
                var $diagram = {c:canvasProps, s:STACK, m:CONNECTOR_MANAGER};
                $serializedDiagram = JSON.stringify($diagram);
                var svgDiagram = toSVG();

                //alert($serializedDiagram);

                //see: http://api.jquery.com/jQuery.post/
                $.post("./common/controller.php", {action: 'saveAs', diagram: $serializedDiagram, png:dataURL, svg: svgDiagram},
                    function(data){
                        if(data == 'noaccount'){
                            Log.info('You must have an account to use that feature');
                            //window.location = '../register.php';
                        }
                        else if(data == 'step1Ok'){
                            Log.info('Save as...');
                            window.location = './saveDiagram.php';
                        }
                    }
                );
            }


            /**Exports current canvas as SVG*/
            function exportCanvas(){
                //export canvas as SVG
		var v = '<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg" version="1.1">\
			<rect x="0" y="0" height="200" width="300" style="stroke:#000000; fill: #FFFFFF"/>\
				<path d="M100,100 C200,200 100,50 300,100" style="stroke:#FFAAFF;fill:none;stroke-width:3;"  />\
				<rect x="50" y="50" height="50" width="50"\
				  style="stroke:#ff0000; fill: #ccccdf" />\
			</svg>';



                //get svg
                var canvas = getCanvas();

                var v2 = '<svg width="' + canvas.width +'" height="' + canvas.height + '" xmlns="http://www.w3.org/2000/svg" version="1.1">';
                v2 += STACK.toSVG();
                v2 += CONNECTOR_MANAGER.toSVG();
                v2 += '</svg>';
                alert(v2);

                //save SVG into session
                //see: http://api.jquery.com/jQuery.post/
                $.post("../common/controller.php", {action: 'saveSvg', svg: escape(v2)},
                    function(data){
                        if(data == 'svg_ok'){
                            //alert('SVG was save into session');
                        }
                        else if(data == 'svg_failed'){
                            Log.info('SVG was NOT save into session');
                        }
                    }
                );

                //open a new window that will display the SVG
                window.open('./svg.php', 'SVG', 'left=20,top=20,width=500,height=500,toolbar=1,resizable=0');
            }

            /**Minimap section*/
            var minimap; //stores a refence to minimap object (see minimap.js)
            
            $(document).mouseup(
                function(){
                    minimap.selected = false;
                }
            );
            
            window.onresize = function(){
                minimap.initMinimap()
            };
            
            
            /**Initialize the page*/
            function init(){
                var canvas = getCanvas();
                
                minimap = new Minimap(canvas, document.getElementById("minimap"), 115);
                minimap.updateMinimap();


                //Canvas properties (width and height)
                if(canvasProps == null){//only create a new one if we have not already loaded one
                       canvasProps = new CanvasProps(CanvasProps.DEFAULT_WIDTH, CanvasProps.DEFAULT_HEIGHT);
                }
                //lets make sure that our canvas is set to the correct values
                canvasProps.setWidth(canvasProps.getWidth());
                canvasProps.setHeight(canvasProps.getHeight());


                //Grid
                grid = document.getElementById("grid");
                if(document.getElementById("gridCheckbox").checked){
                    showGrid();
                }
                else{
                    //TODO: redundant?
                    document.getElementById("gridCheckbox").checked = false;
                }

                if(document.getElementById("snapCheckbox").checked){
                    snapToGrid();
                }
                else{
                    //TODO: redundant?
                    document.getElementById("snapCheckbox").checked = false;
                }


                //Browser support and warnings
                if(isBrowserReady() == 0){ //no support at all
                    modal();
                }
                
                //Edit panel
                setUpEditPanel(canvasProps);

                //Load current diagram
                <? if( isset($_REQUEST['diagramId']) && is_numeric($_REQUEST['diagramId']) ){?>
                load(<?=$_REQUEST['diagramId']?>);
                <? }?>
                    
                //add event handlers for document
                document.onkeypress = onKeyPress;                
                document.onkeydown = onKeyDown;
                document.onkeyup = onKeyUp;
                
                // close layer when click-out
                
            }
        </script>

        <!--[if IE]>
        <script type="text/javascript">
            var IE=true;
        </script>
        <![endif]-->



    </head>
    <body onload="init();" id="body">
        
        <? require_once dirname(__FILE__) . '/header.php'; ?>

        <div id="actions">
            
            

            <a style="text-decoration: none;" href="#" onclick="return save();" title="Save diagram (Ctrl-S)"><img src="assets/images/icon_save.jpg" border="0" width="16" height="16"/></a>
            
            <img class="separator" src="assets/images/toolbar_separator.gif" border="0" width="1" height="16"/>
            
            <a style="text-decoration: none;" href="./myDiagrams.php" title="Open diagram"><img src="assets/images/icon_open.jpg" border="0" width="16" height="16"/></a>
            
            <img class="separator" src="assets/images/toolbar_separator.gif" border="0" width="1" height="16"/>
            
            <a href="javascript:action('connector-straight');"  title="Straight connector"><img src="assets/images/icon_connector_straight.gif" border="0"/></a>

            <img class="separator" src="assets/images/toolbar_separator.gif" border="0" width="1" height="16"/>
            
            <a href="javascript:action('connector-jagged');" title="Jagged connector"><img src="assets/images/icon_connector_jagged.gif" border="0"/></a>
            
            <img class="separator" src="assets/images/toolbar_separator.gif" border="0" width="1" height="16"/>
            
            <a href="javascript:action('connector-organic');" title="Organic connector (Experimental)"><img src="assets/images/icon_connector_organic.gif" border="0" alt="Organic"/></a>
            
            <img class="separator" src="assets/images/toolbar_separator.gif" border="0" width="1" height="16"/>            
                        
            <input type="checkbox" onclick="showGrid();" id="gridCheckbox"  title="Show grid" /> <span class="toolbarText">Show grid</span>
            
            <img class="separator" src="assets/images/toolbar_separator.gif" border="0" width="1" height="16"/>
            
            <input type="checkbox" onclick="snapToGrid();" id="snapCheckbox" title="Snap elements to grid" /> <span class="toolbarText">Snap to grid</span>
            
            <img class="separator" src="assets/images/toolbar_separator.gif" border="0" width="1" height="16"/>

            <a href="javascript:action('front');" title="Move to front"><img src="assets/images/icon_front.gif" border="0"/></a>
            
            <img class="separator" src="assets/images/toolbar_separator.gif" border="0" width="1" height="16"/>
            
            <a href="javascript:action('back');" title="Move to back"><img src="assets/images/icon_back.gif" border="0"/></a>
            
            <img class="separator" src="assets/images/toolbar_separator.gif" border="0" width="1" height="16"/>
            
            <a href="javascript:action('moveforward');" title="Move (one level) to front"><img src="assets/images/icon_forward.gif" border="0"/></a>
            
            <img class="separator" src="assets/images/toolbar_separator.gif" border="0" width="1" height="16"/>
            
            <a href="javascript:action('moveback');" title="Move (one level) back"><img src="assets/images/icon_backward.gif" border="0"/></a>

            
            
            <img class="separator" src="assets/images/toolbar_separator.gif" border="0" width="1" height="16"/>
            <a href="javascript:action('group');" title="Group (Ctrl-G)"><img src="assets/images/group.gif" border="0"/></a>
            
            <img class="separator" src="assets/images/toolbar_separator.gif" border="0" width="1" height="16"/>
            <a href="javascript:action('ungroup');" title="Ungroup (Ctrl-U)"><img src="assets/images/ungroup.gif" border="0"/></a>

            <img class="separator" src="assets/images/toolbar_separator.gif" border="0" width="1" height="16"/>
            
            <a href="javascript:createFigure(figure_Text);"  title="Add text"><img  src="assets/images/text.gif" border="0" height ="16"/></a>
            <img class="separator" src="assets/images/toolbar_separator.gif" border="0" width="1" height="16"/>
            
<!--            <a href="javascript:createFigure(figure_SimpleImage);"  title="Add image"><img  style="vertical-align:middle;" src="/editor/assets/images/image.gif" border="0" height ="16" alt="Image"/></a>
            
            <img class="separator" src="assets/images/toolbar_separator.gif" border="0" width="1" height="16"/>-->

            <a href="javascript:action('undo');" title="Undo (Ctrl-Z)"><img src="assets/images/arrow_undo.png" border="0"/></a>
            <!-- TODO: From Janis: we have to create a nice icon for duplicate, currently this is the only command without an icon -->
            <!--
            <a href="javascript:action('duplicate');">Copy (Ctrl-D)</a>
            -->
            
            <!-- <a href="javascript:action('redo');" title="Redo (Ctrl-Y)"><img src="assets/images/arrow_redo.png" border="0"/></a> -->
            <!--
            <input type="text" id="output" />                
            <img style="vertical-align:middle;" src="../assets/images/toolbar_separator.gif" border="0" width="1" height="16"/>
            <a href="javascript:action('duplicate');">Copy</a>
            <img style="vertical-align:middle;" src="../assets/images/toolbar_separator.gif" border="0" width="1" height="16"/>
            <a href="javascript:action('group');">Group</a>
            <img style="vertical-align:middle;" src="../assets/images/toolbar_separator.gif" border="0" width="1" height="16"/>
            <a href="javascript:action('ungroup');">Ungroup</a>
            -->
        </div>
        
        
        <div id="editor">
            <div id="figures">
                <select style="width: 120px;" onchange="setFigureSet(this.options[this.selectedIndex].value)">
                    <script>
                        for(var setName in figureSets){
                            var set = figureSets[setName];
                            document.write('<option value="' + setName + '">' + set['name'] + '</option>');
                        }
                    </script>

                </select>
                <script>
                    var first = true;
                    for(var setName in figureSets){
                        document.write('<div id="' + setName + '" ' + (!first ? 'style="display: none"' : '')+'>');
                        document.write('<table border="0" cellpadding="0" cellspacing="0" width="120">');
                        var counter = 0;
                        var set = figureSets[setName];
                        for(var figure in set['figures']){
                            figure = set['figures'][figure];
                            if(counter % 3 == 0){
                                document.write('<tr>');
                            }
                            document.write('<td align="center"><a href="javascript:createFigure(figure_'+figure.figureFunction+');"><img src="lib/sets/'+setName+'/'+figure.image+'" border="0" alt="'+ figure.figureFunction + '" /></a></td>');
                            counter ++;
                            if(counter % 3 == 0){
                                document.write('</tr>');
                            }
                        }
                        if(counter % 3 != 0){
                            document.write('</tr>');
                        }
                        document.write('</table></div>');
                        first = false;
                    }
                </script>
                
                <div style="display:none;" id="more">
                    More sets of figures <a href="http://diagramo.com/figures.php" target="_new">here</a>
                </div>
            </div>
            
            <!--THE canvas-->
            <div style="width: 100%">
                <div  id="container">
                    <canvas id="a" width="800" height="600" 
                            onmousemove="onMouseMove(event)"
                            onmousedown="onMouseDown(event)"
                            onmouseup="onMouseUp(event)"
                            
                            ontouchstart="touchStart(event);"
                            ontouchmove="touchMove(event);"
                            ontouchend="touchEnd(event);"
                            ontouchcancel="touchCancel(event);"
                    >
                        
                    </canvas>
                    <script type="text/javascript">
                        //$("#a").ontouchstart(onTouchStart);
                        //$("#a").mousemove(onMouseMove);
                        //$("#a").mousedown(onMouseDown);
                        //$("#a").mouseup(onMouseUp);
                        //$("#a").click(onClick);
                    </script>
                </div>
            </div>
            
            <!--Right panel-->
            <div id="right">
                <center>
                    <div id="minimap">
                    </div>
                </center>
                <div style="overflow: scroll;" id="edit">
                </div>
            </div>
            
        </div>




        <script type="text/javascript">

            function loadFill(check){
                if(check.checked == true){
                    if($('#colorpickerHolder3').css('display')=='none'){
                        $('#colorSelector3').click();
                    }
                }
                else{
                    if($('#colorpickerHolder3').css('display')=='block'){
                        $('#colorSelector3').click();
                    }
                }
            }
            
            

        </script>
        <br/>
         <? //require_once dirname(__FILE__) . '/common/analytics.php';?>
    </body>
</html>