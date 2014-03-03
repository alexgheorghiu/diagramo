<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title></title>
        <script type="text/javascript" src="../../assets/javascript/jquery-1.11.0.min.js"></script>
        <script type="text/javascript">
            var canvas; 
            var ctx;
            var console;
            function init(){
                //alert('loaded');
                
                console = document.getElementById('console');
                canvas = document.getElementById('c');
                ctx = canvas.getContext('2d');
                
				var img = new Image();
				img.src = './svg.php?file=arcs.svg';
//				img.src = './svg.php?file=duck.jpg';
				//img.src = './duck.jpg';
				img.onload = function (){
					ctx.drawImage(img, 0, 0);
				}
				
                ctx.beginPath();
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, 400, 500);
                ctx.fill();
                
                ctx.moveTo(10,10);
                ctx.lineTo(200, 200);
                ctx.stroke();
                
                canvas.addEventListener('click', point, false);
            }
            
            function saveCanvas(){
                var dataURL = canvas.toDataURL();
                //alert(dataURL);
                console.value = dataURL;
                
                /*see: http://api.jquery.com/jQuery.post/
                 *Possible to make it asynch
                 **/
                $.post("./save.php",
                    {action: 'save', data: dataURL},
                    function(respData){
                        //alert(data);
                        if(respData == 'ok'){
                            //alert("saved");
                            
                            //window.open("./download.png");
                        }
                        else{
                            alert('Unknown: ' + data );
                            return false;
                        }
                    }
                );
                
                return true;
            }
            
            function point(e){
                ctx.beginPath();
                ctx.fillStyle = '#000000';
                ctx.fillRect(e.pageX, e.pageY, 2, 2);
                
            }
            
            window.addEventListener('load', init, false);
            
            
        </script>
    </head>
    <body style="position: relative;">
        <canvas width="400" height="300" id="c" style="position: absolute; top: 0; left:0; height: 300px;"></canvas>
        <div style="position: absolute; top: 300px; left: 0; width: 500px;">
            <a href="./download.php" onclick="return saveCanvas();" target="blank">Save</a>
            <a href="http://scriptoid.com" onclick="return saveCanvas();" target="blank">Savex</a>
            <textarea id="console" cols="50" rows="10"></textarea>
        </div>
    </body>
</html>
