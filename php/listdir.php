<?php 

//input: full path of the webserver
//output: dir1,file1.json,file2.json;dir2,file3.json....

$dir = $_POST['dir'];

function getDirContents($dir, &$results = ''){
    $files = scandir($dir);
    foreach($files as $key => $value){
        $path = realpath($dir.DIRECTORY_SEPARATOR.$value);
        if(!is_dir($path)) {
            $results .= ','.$value;
        }
        else if($value != "." && $value != "..") {
            $results .= ($results=='' ? $value : ';'.$value);
            getDirContents($path, $results);
        }
    }
    return $results;
}
echo getDirContents($dir);
?>
