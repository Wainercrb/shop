var editar = false;
var Usuarios = [];
var Vendedores = [];
var usuarioActual;
var vendedor;
var latitud = 0;
var longitud = 0;
var usuarioActual = {
    nombre: "",
    tipoUsuario: "",
    usuario: ""
};
/*Eventos de clicks en los botones*/
window.addEventListener('load', cargarComponentesUsu, false);
document.querySelector('#btn-ingresar-navbar').addEventListener('click', Ingresar);
document.querySelector('#btnCerrarCesion').addEventListener('click', cerrarSesion);
document.querySelector('#addProduct').addEventListener('click', addProducto);
document.querySelector('#btnIngresarPerfil').addEventListener('click', verPerfiles);
document.querySelector('#btnOlvidoContrasena').addEventListener('click', olvidoContrasena);
document.querySelector('#btnEliminarClienta').addEventListener('click', eliminarCuenta);

/*Obtiene el arreglo del local storange, lo parsea y lo agrega a la lista*/
function cargarUsuarios() {
    var listaUsuarios = localStorage.getItem('AllUsers');
    if (listaUsuarios != null) {
        Usuarios = JSON.parse(listaUsuarios);
    } else {
        Usuarios = [];
    }
    return Usuarios;
}
/*Obtiene el arreglo del local storange, lo parsea y lo agrega a la lista*/
function cargarVendedores() {
    var listaUsuarios = localStorage.getItem('vendedores');
    if (listaUsuarios != null) {
        Usuarios = JSON.parse(listaUsuarios);
    } else {
        Usuarios = [];
    }
    return Usuarios;
}
/*Verifica que no hay un usuario con los mismos datos*/
/*retorna true si no hay coincidencias*/
function verfificarLogin(pusuario) {
    cargarUsuarios();
    if (Usuarios != null || Usuarios != "") {
        for (i = 0; i < Usuarios.length; i++) {
            if (Usuarios[i].usuario == pusuario) {
                return false;
            }
        }
    }
    return true;
}
/*Carga los camponetes cuando el usuario le dio recordar contraseña*/
function cargarComponentesUsu() {
    if (parseInt(sessionStorage.getItem('verProducto2')) >= 0) {
        editar = true;
    }
    cargarSessionStore();
    if (obtenerCookie("USUARIO") == "" || obtenerCookie("USUARIO") == null) {
        document.getElementById('input-checkbox-loginc').checked = false;
    } else {
        document.getElementById('input-checkbox-loginc').click();
        var usu = document.getElementById('txt-usuario');
        var contra = document.getElementById('txt-contrasena');
        usu.value = obtenerCookie("USUARIO");;
        contra.value = obtenerCookie("CONTRASEÑA");
    }
}
/*crea un cooki, clave nombre del cookie, valor del cookie, y expiracíon del mismo*/
function crearCookieuSUARIO(clave, valor, diasexpiracion) {
    var d = new Date();
    d.setTime(d.getTime() + (diasexpiracion * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = clave + "=" + valor + "; " + expires;
}
/*Obtine y retorna el cookie por medio de la clave*/
function obtenerCookie(clave) {
    var name = clave + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}
/*funcion verifica si hay un usuario en sessionStorange y si hay carga sus datos a interfaz*/
function cargarSessionStore() {
    var nombreUsuario = sessionStorage.getItem('loginUsuarios');
    if (nombreUsuario != "" || nombreUsuario != null) {
        preLoad(nombreUsuario);
    }
}
/*Verifica el usuario y carga la foto  correo y nombre del usuario, encaso de 
que no quiera recordar la contraseña elimina el cookie*/
function preLoad(pUsuario) {
    cargarUsuarios();
    for (i = 0; i < Usuarios.length; i++) {
        if ('"' + Usuarios[i].usuario + '"' == pUsuario) {
            document.getElementById("headerEmail").innerHTML = Usuarios[i].email;
            document.getElementById("headerName").innerHTML = Usuarios[i].nombre + " " + Usuarios[i].apellidoPaterno + " " + Usuarios[i].apellidoMaterno;
            bannerImg = document.getElementById('profile-img');
            bannerImg.src = "data:image/png;base64," + Usuarios[i].fotoU;
            capturarLoginUsuario(Usuarios[i].usuario);
            usuarioActual.nombre = Usuarios[i].nombre;
            usuarioActual.tipoUsuario = "comprador";
            usuarioActual.usuario = Usuarios[i].usuario;
             if (editar === true) {
                verProductos();
            }
            return;
        }
    }
    cargarVendedores();
    for (i = 0; i < Usuarios.length; i++) {
        if ('"' + Usuarios[i].usuario + '"' == pUsuario) {
            document.getElementById("headerEmail").innerHTML = Usuarios[i].email;
            document.getElementById("headerName").innerHTML = Usuarios[i].nombre;
            bannerImg = document.getElementById('profile-img');
            bannerImg.src = "data:image/png;base64," + Usuarios[i].fotoU;
            capturarLoginUsuario(Usuarios[i].usuario);
            usuarioActual.nombre = Usuarios[i].nombre;
            usuarioActual.tipoUsuario = "vendedor";
            usuarioActual.usuario = Usuarios[i].usuario;
            if (editar === true) {
                verProductos();
            }
            return;
        }
    }
    alert("No se encontro el usuario");
}
/*funcion carga los datos a los respectivos elementos*/
function verProductos() {
    cargarTodosProductos();
    var x = parseInt(sessionStorage.getItem('verProducto2'));
    document.getElementById('hNombreProducto').innerHTML = "Nombre: "+productos[x].nombre;
    document.getElementById('pDescripcion').innerHTML = "Descripción:" +productos[x].descripcion;
    document.getElementById('sPrecio').innerHTML = "₡ " +productos[x].precio;
    detallesVendedor(productos[x].vendedor);

}
/*funcon carga los productos del localStorange y los agrega a la lista*/
function cargarTodosProductos() {
    var listaUsuarios = localStorage.getItem('Producto');
    if (listaUsuarios != null) {
        productos = JSON.parse(listaUsuarios);
    } else {
        productos = [];
    }
    return productos;
}
/*Verifica el usuario y carga la foto  correo y nombre del usuario, encaso de 
que no quiera recordar la contraseña elimina el cookie*/
function Ingresar() {
    cargarUsuarios();
    var usuario = document.querySelector('#txt-usuario').value;
    var contra = document.querySelector('#txt-contrasena').value;
    var check = document.getElementById('input-checkbox-loginc').checked;
    for (i = 0; i < Usuarios.length; i++) {
        if (Usuarios[i].usuario == usuario && Usuarios[i].contrasenna == contra) {
            if (check == true) {
                crearCookieuSUARIO("USUARIO", usuario, 900);
                crearCookieuSUARIO("CONTRASEÑA", contra, 900);
            } else {
                eliminarCookie("USUARIO");
                eliminarCookie("CONTRASEÑA");
            }
            capturarLoginUsuario(Usuarios[i].usuario);
            window.location = "RegistroUsuario.html";
            return;
        }
    }
    Usuarios = [];
    cargarSessionStore();
    for (i = 0; i < Usuarios.length; i++) {
        if (Usuarios[i].usuario == usuario && Usuarios[i].contrasenna == contra) {
            if (check == true) {
                crearCookieuSUARIO("USUARIO", usuario, 900);
                crearCookieuSUARIO("CONTRASEÑA", contra, 900);
            } else {
                eliminarCookie("USUARIO");
                eliminarCookie("CONTRASEÑA");
            }
            capturarLoginUsuario(Usuarios[i].usuario);
            window.location = "RegistroUsuario.html";
            return;
        }
    }
    alert("No se encontro el usuario");
}
/*funcion determina que usuario es, para poder abrir la pagina de su perfil*/
function verPerfiles() {
    if (usuarioActual.tipoUsuario == "comprador") {
        window.location = "VerPerfil.html";
    } else {

        window.location = "VerPerfilEmpresa.html";
    }
}

function capturarLoginUsuario(pUsuarioActual) {
    sessionStorage.setItem('loginUsuarios', JSON.stringify(pUsuarioActual));
}
/*funcion obtiene la dirección en string a partir de una latitud y longitud*/
function GetAddress() {
    var lat = parseFloat(latitud);
    var lng = parseFloat(longitud);
    var latlng = new google.maps.LatLng(lat, lng);
    var geocoder = geocoder = new google.maps.Geocoder();
    geocoder.geocode({
        'latLng': latlng
    }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[1]) {

                document.getElementById('location').innerHTML = results[1].formatted_address;
                document.getElementById('country').innerHTML = results[3].formatted_address;
            }
        }
    });
}
/*función carga el mapa apartir de la longitud y la latitud*/
function myMap() {
    var mapProp = {
        center: new google.maps.LatLng(latitud, longitud),
        zoom: 16,
    };
    var map = new google.maps.Map(document.getElementById("map"), mapProp);
}

/*funcion busca el vendedor ingresado por parametros para cargar sus datos*/
function detallesVendedor(nUsuario){
   Usuarios = [];
   cargarVendedores();
   for (i = 0; i < Usuarios.length; i++) {
    if (Usuarios[i].usuario === nUsuario) {
        latitud = Usuarios[i].latitud;
        longitud = Usuarios[i].longitud;
        document.getElementById("labelNombre").innerHTML = "vendedor: " + Usuarios[i].nombre;
        document.getElementById("labelCorreo").innerHTML = "Correo: " +Usuarios[i].email;
        myMap();
        GetAddress();
        return;
    }
  }
}
/*funcion elimina el sessionStorange y carga la pagina principal*/
  function cerrarSesion(){
    sessionStorage.clear();
    window.location = "index.html";
    return;
  }
  /*funcion verifica que el usuario sea vendedor y si lo es carga la pagina para que agrege un nuevo producto*/
  function addProducto(){
    if (usuarioActual.tipoUsuario === "vendedor") {
      window.location = "NuevoProducto.html";
    }else{
      alert("No tienes permisos para esta acción");
    }
  }
  /*funcion vefica que este un usurio logeado y si lo esta cagar la pagina para cambiar contraseña*/
  function olvidoContrasena(){
    if(usuarioActual.tipoUsuario =="" || usuarioActual.tipoUsuario == ""){
      window.location = "CambioContrasenna.html";
    }else{
      alert("Actualmente estas registrado");
    }
  }
  /*Funcion guarda un un valor en sessionStorange para cargar la pagina de buscar y cargar ese elemento*/
  function buscar(){
    var CaT = document.getElementById("selectCategoriaBuscar");
    var value = CaT.options[CaT.selectedIndex].value;
    var text = CaT.options[CaT.selectedIndex].text;
    var sCaT = document.getElementById("selectDistancia");
    var value = sCaT.options[sCaT.selectedIndex].value;
    var finaSCategoria = sCaT.options[sCaT.selectedIndex].value;
    if(document.getElementById("btn-search").value == ""){
     sessionStorage.setItem('valorBuscar', "-");
   }else{
    sessionStorage.setItem('valorBuscar', document.getElementById("btn-search").value);
  }
  sessionStorage.setItem('categoria', text);
  sessionStorage.setItem('distancia', finaSCategoria);
  window.location = "BuscarArticulo.html";

}
/*funcion carga la pagina del perfil dependiendo del usuario*/
function verPerfiles(){
    if(usuarioActual.tipoUsuario == "comprador"){
        window.location ="VerPerfil.html";
    }else if(usuarioActual.tipoUsuario == "vendedor"){
        window.location = "VerPerfilEmpresa.html";
    }else{
        alert("No puedes acceder a esta información por que no estas registrado");
    }
}
/*funcion elimina mi perfil del localStorange*/
function eliminarCuenta() {
    var lcStorange = JSON.parse(localStorage.getItem('vendedores'));
    lcStorange.splice(parseInt(sessionStorage.getItem("posicion")), 1);
    localStorage.setItem('vendedores', JSON.stringify(lcStorange));
    window.location = "index.html";
}