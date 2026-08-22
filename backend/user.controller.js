/**
 * CONTROLADOR DE USUARIOS
 * Responde a: UserService / AppScriptService.obtenerUsuarioLogueado()
 */

function obtenerUsuarioLogueado() {
  const email = Session.getActiveUser().getEmail();
  const usuarios = HOJA_USUARIOS.getDataRange().getValues();
  const usuarioEncontrado = usuarios.find(u => u[0] === email);

  return {
    email: email,
    nombre: usuarioEncontrado ? usuarioEncontrado[1] : "Usuario Externo"
  };
}
