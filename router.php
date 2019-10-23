<?php
$url = strtok($_SERVER['REQUEST_URI'], '?');
session_start();
// routing aplikacji
if (preg_match('/^\/api\/.+$/', $url)) {
    include("app/api.php");
} elseif (preg_match('/^\/admin?.+$/', $url)) {
    if (file_exists(ltrim($url, '/')) && is_file(ltrim($url, '/'))) {
        return FALSE;
    } elseif (!isset($_SESSION['userId']) || empty($_SESSION['userId'])) {
        include("admin/login.html");
    } else {
        include("admin/index.html");
    }
} else {
    if (file_exists(ltrim($url, '/'))) {
        return FALSE;
    } else {
        include("index.html");
    }
}
