<?php

/*
Copyright [2014] [Scriptoid s.r.l]

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