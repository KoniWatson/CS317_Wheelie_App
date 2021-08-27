<?php

function connectOrDie() {
    $username="cs317grouph"; $password="Ei2teeRoh0Vo"; $database="cs317grouph"; $servername="devweb2019.cis.strath.ac.uk";

    $mysqli = new mysqli($servername, $username, $password, $database);
    if ($mysqli->connect_errno){
        die("Connect failed: %s".$mysqli->connect_error);
    }
    return $mysqli;
}

function addNewPost($mysqli, $post, $postID){
    if ($mysqli->query("INSERT INTO `chat` (`userID`, `message`) VALUES ". "('$postID', '$post')")){
        return $postID;
    }else{
        die("Query failed: %s".$mysqli->error);
    }

}

$mysqli = connectOrDie();
$post = $mysqli->real_escape_string(urldecode($_POST["msg"]));
$postID = $mysqli->real_escape_string(urldecode($_POST["uid"]));
$id = addNewPost($mysqli, $post, $postID);
echo "$id";

