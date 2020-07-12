<?php
var_dump('save_data.php...');

var_dump(getcwd());

var_dump('save_data.php...2');

$file = $_POST['file'];
var_dump($file);

$data = $_POST['data'];
var_dump($data);

if (file_exists($file)) {
    echo "The file $file exists";
    chmod($file,0777);
} else {
    echo "The file $file does not exist";
}

//set mode of file to writable.
$f = fopen($file, "w+") or die("fopen failed");
$fwrite = fwrite($f, $data);
if ($fwrite === false) {
    var_dump('fwrite failed...');
}
else{
    var_dump('fwrite succeed...');
}
fclose($f);
?>