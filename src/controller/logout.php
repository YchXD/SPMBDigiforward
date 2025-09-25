<?php
session_start();

// Remove all session variables
$_SESSION = [];

// Destroy the session
session_destroy();

// Redirect to login page (adjust path if needed)
header("Location: ../page/welcome.php");
exit;
