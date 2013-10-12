<?php

//We are going to need a database connection:
$db = mysql_connect('localhost', 'root', 'newpwd');
mysql_select_db('twitter_alerts', $db);
//Now, two possibilities: if we don't have a start parameter, we print the last ten tweets.
//Otherwise, we print all the tweets with IDs bigger than start, if any
$start = mysql_real_escape_string($_GET['start']);
if (!$start) {
    $query1 = "SELECT COUNT(*) AS positive FROM tweets WHERE sentiment='positive' ORDER BY id DESC LIMIT 0,10";
    $query2 = "SELECT COUNT(*) AS negative FROM tweets WHERE sentiment='negative' ORDER BY id DESC LIMIT 0,10";
    $query3 = "SELECT COUNT(*) AS neutral FROM tweets WHERE sentiment='neutral' ORDER BY id DESC LIMIT 0,10";
} else {
    $query1 = "SELECT COUNT(*) AS positive FROM tweets WHERE id>" . $start . " AND sentiment='positive' ORDER BY id DESC LIMIT 0,10";
    $query2 = "SELECT COUNT(*) AS negative FROM tweets WHERE id>" . $start . " AND sentiment='negative' ORDER BY id DESC LIMIT 0,10";
    $query3 = "SELECT COUNT(*) AS neutral FROM tweets WHERE id>" . $start . " AND sentiment='neutral' ORDER BY id DESC LIMIT 0,10";
}   

$result1 = mysql_query($query1);
$result2 = mysql_query($query2);
$result3 = mysql_query($query3);
$data = array(); //Initializing the results array

while (($row1 = mysql_fetch_assoc($result1)) && ($row2= mysql_fetch_assoc($result2)) && ($row3 = mysql_fetch_assoc($result3))) {
    array_push($data, $row1, $row2, $row3);
}
$json = json_encode($data);
print $json;
//echo $json;
?>
