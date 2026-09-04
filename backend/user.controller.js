/**
 * CONTROLADOR DE USUARIOS
 * Responde a: UserService / AppScriptService.obtenerUsuarioLogueado()
 *
 * Mapeo de columnas de la hoja "Usuarios".
 * IMPORTANTE: mantener sincronizado con la estructura real de la hoja.
 */
const COL_USUARIO_EMAIL = 1;
const COL_USUARIO_NOMBRE = 2;

function obtenerUsuarioLogueado() {
  const email = Session.getActiveUser().getEmail();
  const hoja = getHojaUsuarios();
  const ultimaFila = hoja.getLastRow();

  let nombre = "Usuario Externo";
  if (ultimaFila >= 2) {
    const usuarios = hoja.getRange(2, 1, ultimaFila - 1, 2).getValues();
    const encontrado = usuarios.find(u => u[0] === email);
    if (encontrado) nombre = encontrado[COL_USUARIO_NOMBRE - 1] || nombre;
  }

  return {
    email: email,
    nombre: nombre
  };
}
