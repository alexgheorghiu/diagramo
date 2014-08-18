<?php

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

/* * This snippet goes to diagrams folder and get the proper SVG files
 * You need to use this as files in diagrams folder are protected
 */
require_once dirname(__FILE__) . '/common/delegate.php';

if (!isset($_SESSION)) {
    session_start();
}

$dir = dirname(__FILE__);
$diagramsFolder = $dir . '/diagrams/';

if (isset($_REQUEST['hash'])) {
    $delegate = new Delegate();
    $diagram = $delegate->diagramGetByHash($_REQUEST['hash']);
    
    if ( is_object($diagram) && $diagram->public) {
        header("Cache-Control: no-cache, must-revalidate"); // HTTP/1.1
        header("Expires: Sat, 26 Jul 1997 05:00:00 GMT"); // Date in the past
        header('Content-type: image/svg+xml');

        print file_get_contents($diagramsFolder . $diagram->id . '.svg');
    }
}
?>
