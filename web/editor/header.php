<?
$WEBADDRESS = $delegate->settingsGetByKeyNative('WEBADDRESS');
?>
<div id="header">    
    <div id="dropdown">
        <!--Logo menu-->
        <div class="dropdown_menu">
            <img src="./assets/images/logo-36x36.png"/>
        </div>
        <!-- /File menu-->
        
        
        <!--File menu-->
        <div class="dropdown_menu"><a href="#" onmouseover="dropdownSpace.menuOpen('file')" onmouseout="dropdownSpace.menuCloseTime()">File</a>
            <div class="dropdown_menu_panel" id="file" onmouseover="dropdownSpace.menuCancelCloseTime()" onmouseout="dropdownSpace.menuCloseTime()">
                <a style="text-decoration: none;" href="./common/controller.php?action=newDiagramExe" title="New diagram"><img style="vertical-align:middle; margin-right: 3px;" src="assets/images/icon_new.jpg" border="0" width="20" height="21"/><span class="menuText">New</span></a>
                <a style="text-decoration: none; border-bottom: 1px solid #666;" href="./myDiagrams.php" title="Open diagram"><img style="vertical-align:middle; margin-right: 3px;" src="assets/images/icon_open.jpg" border="0" width="20" height="21"/><span class="menuText">Open...</span></a>
                <?if($page=='editor'){?>
                    <a style="text-decoration: none;" href="javascript:save();"  title="Save diagram (Ctrl-S)"><img style="vertical-align:middle; margin-right: 3px;" src="assets/images/icon_save.jpg" border="0" width="22" height="22"/><span class="menuText">Save</span></a>
                    <a style="text-decoration: none; border-bottom: 1px solid #666;" href="javascript:saveAs();"  title="Save diagram as..."><img style="vertical-align:middle; margin-right: 3px;" src="assets/images/icon_save_as.jpg" border="0" width="22" height="22"/><span class="menuText">Save as...</span></a>
                    <?if(isset($_REQUEST['diagramId']) &&  is_numeric($_REQUEST['diagramId']) ){//option available ony when the diagram was saved?>
                        <a style="text-decoration: none; border-bottom: 1px solid #666;" href="./exportDiagram.php?diagramId=<?=$_REQUEST['diagramId']?>"  title="Export diagram"><img style="vertical-align:middle; margin-right: 3px;" src="assets/images/icon_export.jpg" border="0" width="22" height="22"/><span class="menuText">Export</span></a>
                    <?}?>
                <?}?>
                <?if (is_object($loggedUser)) { ?>    
                <a style="text-decoration: none;" href="./common/controller.php?action=logoutExe"><img style="vertical-align:middle;" src="<?=$WEBADDRESS?>/editor/assets/images/icon_logout.gif" border="0" width="16" height="16"/><span class="menuText">Logout (<?= $loggedUser->email ?>)</span></a>
                <?}?>
            </div>
        </div>
        <!-- /File menu-->

        <!--Settings menu-->
        <div class="dropdown_menu"><a href="#" onmouseover="dropdownSpace.menuOpen('settings')" onmouseout="dropdownSpace.menuCloseTime()">Settings</a>
            <div class="dropdown_menu_panel"  id="settings" onmouseover="dropdownSpace.menuCancelCloseTime()" onmouseout="dropdownSpace.menuCloseTime()">
                <a href="./settings.php">My settings</a>
            </div>
        </div>
        <!--Settings menu-->
        
        <!--Users menu-->
        <div class="dropdown_menu"><a href="#" onmouseover="dropdownSpace.menuOpen('users')" onmouseout="dropdownSpace.menuCloseTime()">Users</a>
            <div class="dropdown_menu_panel"  id="users" onmouseover="dropdownSpace.menuCancelCloseTime()" onmouseout="dropdownSpace.menuCloseTime()">
                <a style="text-decoration: none;" href="./users.php"  title="Invite/Manage collaborators"><img style="vertical-align:middle; margin-right: 3px;" src="assets/images/collaborators.gif" border="0" width="22" height="22"/><span class="menuText">Users</span></a>
            </div>
        </div>
        <!--Help menu-->
        
        <!--Help menu-->
        <div class="dropdown_menu"><a href="#" onmouseover="dropdownSpace.menuOpen('help')" onmouseout="dropdownSpace.menuCloseTime()">Help</a>            
            <div class="dropdown_menu_panel" id="help"    onmouseover="dropdownSpace.menuCancelCloseTime()" onmouseout="dropdownSpace.menuCloseTime()" >
                <a href="https://bitbucket.org/scriptoid/diagramo-script/issues/new" target="new">Report bug</a>
                <a href="./license.php">License</a>
            </div>                        
        </div>
        <!--Help menu-->
        
        
        <!--Direct link-->
        <?if($page=='editor'){?>
            <?if(isset($_REQUEST['diagramId']) &&  is_numeric($_REQUEST['diagramId']) ){ //these options should appear ONLY if we have a saved diagram
                $diagram = $delegate->diagramGetById($_REQUEST['diagramId']);
            ?>                
            <div style="padding-top: 6px;">
                <img style="vertical-align:middle;" src="assets/images/upper_bar_separator.jpg" border="0" width="2" height="16"/>
                <span class="menuText" title="Use this URL to share diagram to others">Direct link : </span> <input style="font-size: 10px;" title="External direct URL to diagram" type="text" class="text" size="100" value="<?=$WEBADDRESS?>/editor/viewDiagram.php?diagramId=<?=$diagram->id?>"/>
            </div>
            <?}?>
        <?}?>
        <!-- //Direct link-->
        
        
        
        <!-- alfa
            <td valign="middle">
                <a style="text-decoration: none;" href="javascript:exportCanvas();"><img style="vertical-align:middle; margin-right: 3px;" src="../assets/images/icon_export.jpg" border="0" width="22" height="22"/><span class="menuText">Debug Export</span></a>
            </td>
            <td width="20" align="center">
                <img style="vertical-align:middle;" src="../assets/images/upper_bar_separator.jpg" border="0" width="2" height="16"/>
            </td>
        -->    

        <script type="text/javascript">
            switch(isBrowserReady()){
                case 0: //not supported at all
                    document.write('<span style="background-color: red;" >');
                    document.write("No support for HTML5. More <a href=\"http://<?=$WEBADDRESS?>/htm5-support.php\">here</a></a>");
                    document.write("</span>");
                    break;
                case 1: //IE - partially supported
                    document.write('<span style="background-color: yellow;" >');
                    document.write("Poor HTML5 support. More <a href=\"http://<?=$WEBADDRESS?>/htm5-support.php\">here</a></a>");
                    document.write("</span>");
                    break;
            }
        </script>   
        
    </div>
</div>