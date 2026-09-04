// Configuración de Base de Datos
const BD_ID_TAREAS = '1AsN5_pltxamGqdOgRJFG4wf2NTVArIkzDClNYablg-I';

// Acceso diferido (lazy): evita abrir la hoja en cada carga de script,
// mejorando la latencia de arranque.
let _ss = null;
let _hojaRegistros = null;
let _hojaUsuarios = null;

function getSS() {
  if (_ss === null) _ss = SpreadsheetApp.openById(BD_ID_TAREAS);
  return _ss;
}

function getHojaRegistros() {
  if (_hojaRegistros === null) _hojaRegistros = getSS().getSheetByName('Registros');
  return _hojaRegistros;
}

function getHojaUsuarios() {
  if (_hojaUsuarios === null) _hojaUsuarios = getSS().getSheetByName('Usuarios');
  return _hojaUsuarios;
}

function esUsuarioAutorizado(email) {
  const hoja = getHojaUsuarios();
  const ultimaFila = hoja.getLastRow();
  if (ultimaFila < 2) return false;
  return hoja
    .getRange(2, 1, ultimaFila - 1, 1)
    .getValues().flat().filter(String)
    .includes(email);
}

/**
 * Orquestador principal de la carga de la página
 */
function doGet() {
  const userEmail = Session.getActiveUser().getEmail();

  if (esUsuarioAutorizado(userEmail)) {
    return HtmlService.createTemplateFromFile('frontend/index')
      .evaluate()
      .setTitle('Sistema Tareas');
  }
  return HtmlService.createTemplateFromFile('frontend/error')
    .evaluate()
    .setTitle('Usuario no autorizado');
}

/**
 * Helper para inyectar componentes HTML/JS en las plantillas
 */
function include(file) {
  return HtmlService.createHtmlOutputFromFile(file).getContent();
}
