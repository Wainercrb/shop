<?php
$id     = $_SESSION["ID"];
$foto   = $_SESSION["PICTURE"];
$email  = $_SESSION["EMAIL"];
$nombre = $_SESSION["NAME"]." ".$_SESSION["SURNAMEONE"]." ".$_SESSION["SURNAMETWO"];
$tipoU = $_SESSION["TYPEUSER"];
$edad = $_SESSION["AGE"];
$usuario = $_SESSION["USER"];
$pass = $_SESSION["PASSWORD"];
$latitud = $_SESSION["LATITUD"];
$longitud = $_SESSION["LONGITUD"];
$_SESSION["EDIT"] = "TRUE";
?>