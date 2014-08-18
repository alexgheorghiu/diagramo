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

function logx($msg) {
    if (false) {
        $filePath = dirname(__FILE__) . '/log.txt';
        #print $filePath;
        $fh = fopen($filePath, 'a');
        if (!$fh) {
            print "Not able to open $filePath file";
            exit();
        }

        fwrite($fh, "\n" . $msg);
        fclose($fh);
    }
}

//logx('test');
?>
