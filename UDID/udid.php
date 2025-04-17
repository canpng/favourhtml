<?php
header('Content-Type: text/html; charset=utf-8');

$device_info = array();

if (isset($_POST['UDID'])) {
    $device_info['udid'] = $_POST['UDID'];
}
if (isset($_POST['IMEI'])) {
    $device_info['imei'] = $_POST['IMEI'];
}
if (isset($_POST['VERSION'])) {
    $device_info['version'] = $_POST['VERSION'];
}
if (isset($_POST['PRODUCT'])) {
    $device_info['model'] = $_POST['PRODUCT'];
}
if (isset($_POST['SERIAL'])) {
    $device_info['serial'] = $_POST['SERIAL'];
}

// Encode the device info as JSON and redirect back to the index page with the info as a query parameter
if (!empty($device_info)) {
    $info_json = urlencode(json_encode($device_info));
    header('Location: index.html?device_info=' . $info_json);
    exit;
} else {
    header('Location: index.html');
    exit;
}
?> 