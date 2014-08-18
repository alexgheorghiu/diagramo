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

/**Just keeps all the codes we need for the application in one place and with name tag
 *@see Char codes <a href="http://www.cambiaresearch.com/c4/702b8cd1-e5b0-42e6-83ac-25f0306e3e25/Javascript-Char-Codes-Key-Codes.aspx">http://www.cambiaresearch.com/c4/702b8cd1-e5b0-42e6-83ac-25f0306e3e25/Javascript-Char-Codes-Key-Codes.aspx</a>
 *
 *@see Event properties <a href="http://www.quirksmode.org/js/events_properties.html">http://www.quirksmode.org/js/events_properties.html</a>
 **/
var KEY = {
    BACKSPACE : 8,
    TAB : 9,
    ENTER: 13,
    SHIFT : 16,
    CTRL : 17,
    ALT : 18,
    PAUSE : 19,
    CAPS_LOCK: 20,
    ESCAPE : 27,
    PAGE_UP: 33,
    PAGE_DOWN: 34,
    END: 35,
    HOME: 36,
    
    LEFT : 37,
    UP :  38,
    RIGHT : 39,
    DOWN : 40,
    
    /**It seems that "Windows" key under Win7/Firefox has the same code 91*/
    COMMAND_LEFT : 91, //left window key / for mac users
    COMMAND_RIGHT : 92, //right window key
    COMMAND_SELECT : 93, //select key
    
    COMMAND_FIREFOX : 224, //for mac users firefox
        
    PRINT_SCREEN : 44,
    
    INSERT: 45,
    DELETE : 46,
    
    NUMPAD0 : 96,
    NUMPAD1 : 97,
    NUMPAD2 : 98,
    NUMPAD3 : 99,
    NUMPAD4 : 100,
    NUMPAD5 : 101,
    NUMPAD6 : 102,
    NUMPAD7 : 103,
    NUMPAD8 : 104,
    NUMPAD9 : 105,
    
    MULTIPLY : 106,
    ADD : 107,
    SUBTRACT : 109,
    DECIMAL : 110, //decimal point
    DIVIDE : 111,
    
    F1 : 112,
    F2 : 113,
    F3 : 114,
    F4 : 115,
    F5 : 116,
    F6 : 117,
    F7 : 118,
    F8 : 119,
    F9 : 120,
    F10 : 121,
    F11 : 122,
    F12 : 123,
    
    NUM_LOCK : 144,
    SCROLL_LOCK : 145,
    MULTIMEDIA_COMP : 182, //My Computer (multimedia keyboard)
    MULTIMEDIA_CALC : 183, //My Calculator (multimedia keyboard)
    SEMICOLON : 186, //semi-colon
    EQUAL : 187, //equal sign
    COMMA : 188,
    DASH : 189,
    PERIOD : 190,
    FORWARD_SLASH : 191,
    OPEN_BRACKET : 219,
    BACK_SLASH : 220,
    CLOSE_BRACKET : 221,
    QUOTE : 222, //single quote
    
    0	: 48,
    1	: 49,
    2	: 50,
    3	: 51,
    4	: 52,
    5	: 53,
    6	: 54,
    7	: 55,
    8	: 56,
    9	: 57,
    
    A	: 65,
    B	: 66,
    C	: 67,
    D	: 68,
    E	: 69,
    F	: 70,
    G	: 71,
    H	: 72,
    I	: 73,
    J	: 74,
    K	: 75,
    L	: 76,
    M	: 77,
    N	: 78,
    O	: 79,
    P	: 80,
    Q	: 81,
    R	: 82,
    S	: 83,
    T	: 84,
    U	: 85,
    V	: 86,
    W	: 87,
    X	: 88,
    Y	: 89,
    Z	: 90
}
