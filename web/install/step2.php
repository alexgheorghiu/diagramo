<?php
include('start.php');
include('checkinstall.php');
include('umbilicus.php');
include('../editor/common/utils.php');

define('STEP','step2');

$fullURL = selfURL();
$appUrl = substr($fullURL, 0, strpos($fullURL, '/install'));


$extensions = get_loaded_extensions();

/**Returns a vector or requirements.
 * Each requirement is made out of (name, type, requested value, present value)
 * Type can be: 
 *      version (ex. 4.0) 
 *      string (ex. 'compiled') 
 *      boolean (true or false)
 */
function loadRequirements(){
    global $extensions;
    
    $requirements = array(
        array(
            'name' => 'PHP Version',
            'wanted' => 'mandatory',
            'type' => 'version',
            'requested' => '5.3',
            'current' => phpversion(),
            'help' => 'php_version'
        ),
        array(
            'name' => 'PHP Directive: Register Globals',
            'wanted' => 'mandatory',
            'type' => 'string',
            'requested' => 'off',
            'current' => (ini_get('register_globals') == 1) ? 'on' : 'off',
            'help' => 'directive_register_globals'
        ),
        array(
            'name' => 'PHP Directive: Magic Quotes',
            'wanted' => 'mandatory',
            'type' => 'string',
            'requested' => 'off',
            'current' => (ini_get('magic_quotes_gpc') == 1) ? 'on' : 'off',
            'help' => 'directive_magic_quotes'
        ),
        array(
            'name' => 'PHP Directive: Short Open Tags',
            'wanted' => 'mandatory',
            'type' => 'string',
            'requested' => 'on',
            'current' => (ini_get('short_open_tag') == 1) ? 'on' : 'off',
            'help' => 'directive_short_open_tags'
        ),
        array(
            'name' => 'PHP Directive: Allow Url Fopen',
            'wanted' => 'mandatory',
            'type' => 'string',
            'requested' => 'on',
            'current' => (ini_get('allow_url_fopen') == 1) ? 'on' : 'off',
            'help' => 'directive_allow_url_fopen'
        ),
        
        array(
            'name' => 'PHP Extension: SQLite3',
            'wanted' => 'mandatory',
            'type' => 'string',
            'requested' => 'installed',
            'current' => (is_numeric(array_search('sqlite3', $extensions))) ? 'installed' : 'not installed',
            'help' => 'extension_mysql'
        ),
        array(
            'name' => 'PHP Extension: PCRE',
            'wanted' => 'mandatory',
            'type' => 'string',
            'requested' => 'installed',
            'current' => (is_numeric(array_search('pcre', $extensions))) ? 'installed' : 'not installed',
            'help' => 'extension_pcre'
        ),
        array(
            'name' => 'Internet connection',
            'wanted' => 'mandatory',
            'type' => 'string',
            'requested' => 'present',
            'current' => (get('http://diagramo.com' . '/echo.php?voice=ping') == 'ping') ? 'present' : 'absent',
            'help' => 'internet_connection'
        ),
        array(
            'name' => 'Directory permissions: CHMOD 0777 > <b>/editor/data</b>',
            'wanted' => 'mandatory',
            'type' => 'string',
            'requested' => 'writable',
            'current' => (@is_writable('../editor/data')) ? 'writable' : 'not writable',
            'help' => 'folder_data'
        ),
        array(            
            'name' => 'Directory permissions: CHMOD 0777 > <b>/editor/data/diagrams</b>',
            'wanted' => 'mandatory',
            'type' => 'string',
            'requested' => 'writable',
            'current' => (@is_writable('../editor/data/diagrams')) ? 'writable' : 'not writable',
            'help' => 'folder_diagrams'
        )
    );
    
    return $requirements;
}

/**See if a requirement is valid
 */
function isValid($requirement){
    switch($requirement['type']){
        case 'string':
            return $requirement['current'] === $requirement['requested'];
            break;
        case 'boolean':
            return $requirement['current'] === $requirement['requested'];
            break;
        case 'version':
            return version_compare($requirement['current'], $requirement['requested'], '>=');
            break;
        default :
            return false;
    }
}

$requirements = loadRequirements();
?>

<!DOCTYPE HTML>
<html>
    <head>
        <title>Step 2 - Requirements | Diagramo</title>
        <link href="./assets/style.css" rel="stylesheet" type="text/css" />
        <style type="text/css">
            .sandwitch {
                border-bottom: 1px dotted gray;
                height: 30px;
            }

            .sandwitch2 {
                border-bottom: 1px dotted gray;
                background-color:  #EEEEEE;
                height: 30px;
            }
        </style>
        <script type="text/javascript">
            function showMessage(page){
                myRef = window.open('./help/' + page + '.html','mywin','left=200,top=200,width=500,height=200,toolbar=0,resizable=0');
            }
        </script>
    </head>
    <body>
        
        <div id="content">
            <?php include 'logo.php'?>
            <?php include 'breadcrumb.php'?>
            <div id="main">
                <table style="margin-top: 10px;" width="90%" border="0" cellpadding="2" cellspacing="0" align="center">
                    <tr>
                        <td class="sandwitch"><b>Requirement</b></td>
                        <td class="sandwitch"><b>Status</b></td>
                        <td class="sandwitch"><b>Requested</b></td>
                        <td class="sandwitch"><b>Present</b></td>                        
                        <td class="sandwitch"><b>Help</b></td>
                    </tr>
                
                <?php
                $errors = false;
                for($i=0; $i < count($requirements); $i++){
                    $requirement = $requirements[$i];
                    $valid = isValid($requirement);
                    if(!$valid){
                        if($requirement['wanted'] == 'mandatory'){
                            $errors = true;
                        }
                    }
                    $style = 'sandwitch' . (($i%2) == 0 ? '2' : '');
                ?>
                    <tr>
                        <td class="<?=$style?>"><?php echo $requirement['name']?></td>
                        <td class="<?=$style?>">
                            <?php 
                            if($valid){
                                echo '<img src="./assets/green.png" border="0"/>';
                            }
                            else{
                                if($requirement['wanted'] == 'mandatory'){
                                    echo '<img src="./assets/red.png" border="0"/>';
                                }
                                else{
                                    echo '<img src="./assets/yellow.png" border="0"/>';
                                }
                            }
                            
                            ?>
                        </td>   
                        <td class="<?=$style?>"><?php echo $requirement['requested']?></td>
                        <td class="<?=$style?>"><?php echo $requirement['current']?></td>
                        <td class="<?=$style?>">
                            <a href="javascript:void(0);" onclick="showMessage('<?php echo $requirement['help']?>')">
                                <img src="./assets/help.png" border="0"  alt="help" />
                            </a>
                        </td>
                    </tr>
                <?php } //end for ?>
                </table>
                <div style="margin: 20px 40px;">
                    <img style="vertical-align: middle;" src="./assets/green.png" border="0"/> - all fine <br/>
                    <img style="vertical-align: middle;" src="./assets/red.png" border="0"/> - mandatory, you can not continue install until this is solved <br/>
                    <img style="vertical-align: middle;" src="./assets/yellow.png" border="0"/> - you can continue but some features will be missing <br/>
                </div>
            </div>
            <div id="navigator">
                <?php if($errors){ ?>
                <a href="step2.php"><img src="./assets/retry.png" border="0"/></a>
                <?php }else{ ?>
                <a href="step3.php"><img src="./assets/next.png" border="0"/></a>
                <?php }?>
            </div>
            
            
            <img style="display: none;" src="<?=DIAGRAMO?>/install.php?step=step2&version=<?=VERSION?>&session=<?=session_id()?>&url=<?=urlencode($appUrl)?>"/>
            
        </div>
    </body>
</html>