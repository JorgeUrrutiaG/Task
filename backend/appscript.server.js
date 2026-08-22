// Configuración de Base de Datos e Inicialización Global
const BD_ID_TAREAS = '1AsN5_pltxamGqdOgRJFG4wf2NTVArIkzDClNYablg-I'; 
const SS = SpreadsheetApp.openById(BD_ID_TAREAS);
const HOJA_REGISTROS = SS.getSheetByName('Registros');
const HOJA_USUARIOS = SS.getSheetByName('Usuarios');

/**
 * Orquestador principal de la carga de la página
 */
function doGet() {
  const userEmail = Session.getActiveUser().getEmail();
  
  // Seguridad: Obtener emails autorizados
  const emailsAutorizados = HOJA_USUARIOS
    .getRange(2, 1, HOJA_USUARIOS.getLastRow() - 1, 1)
    .getValues().flat().filter(String);

  if (emailsAutorizados.includes(userEmail)) {
    return HtmlService.createTemplateFromFile('frontend/index') // Ruta ajustada a tu carpeta frontend
      .evaluate()
      .setTitle('Sistema Tareas');
  } else {
    return HtmlService.createTemplateFromFile('frontend/error') // Asume que error está en tus vistas
      .evaluate()
      .setTitle('Usuario no autorizado');
  }
}

/**
 * Helper para inyectar componentes HTML/JS en las plantillas
 */
function include(file) { 
  return HtmlService.createHtmlOutputFromFile(file).getContent(); 
}
