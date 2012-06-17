<?php
function validateEmail($value){
    if(preg_match("/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/i", $value) == 1){
        return 1;
    }

    return 0;
}

print_r(validateEmail('alex@scriptoid.com'));
print_r(validateEmail('.alex@aaa.co'));
print_r(validateEmail('alex@aaaco'));
?>
