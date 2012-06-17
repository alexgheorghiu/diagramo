<?php

$steps = array(
    'step1' => '1.Welcome', 
    'step2' => '2.Requirements', 
    'step3' => '3.Settings',     
    'step4' => '4.Done'
    );
?>
<div id="breadcrumb">
    <table width="100%" border="0">
        <tr>
           
        <?php
            foreach($steps as $step => $description){   
                if($step == STEP){
                    echo '<td class="stepselected" width="20%" valign="bottom">' . $description . '</td> ';
                }
                else{
                    echo '<td class="step"  width="20%"  valign="bottom">' . $description . '</td> ';
                }
            }
        ?>
        </tr>
    </table>
</div>