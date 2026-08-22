// const BD_ID_TAREAS = '1AsN5_pltxamGqdOgRJFG4wf2NTVArIkzDClNYablg-I'; //BD_Tareas
// const SS = SpreadsheetApp.openById(BD_ID_TAREAS);
// const HOJA_REGISTROS = SS.getSheetByName('Registros');
// const HOJA_USUARIOS = SS.getSheetByName('Usuarios');

// function doGet() {
//   // Verificar si el usuario está autorizado
//   const userEmail = Session.getActiveUser().getEmail();
//   const emailsAutorizados = HOJA_USUARIOS
//     .getRange(2, 1, HOJA_USUARIOS.getLastRow() - 1, 1)
//     .getValues().flat().filter(String);

//   if (emailsAutorizados.includes(userEmail)) {
//     return HtmlService.createTemplateFromFile('index')
//       .evaluate()
//       .setTitle('Sistema Tareas');
//   } else {
//     return HtmlService.createTemplateFromFile('error')
//       .evaluate()
//       .setTitle('Usuario no autorizado');
//   }
// }

// // incluir html
// function include(file) { return HtmlService.createHtmlOutputFromFile(file).getContent(); }

// /**
//  * Obtiene los datos de la hoja Registros incluyendo encabezados
//  */
// function obtenerDatosTickets() {
//   const valores = HOJA_REGISTROS.getDataRange().getValues();
//   // Formatear fechas para que no den problemas en JS
//   const datosFormateados = valores.map(fila => fila.map(celda => {
//     if (celda instanceof Date) return Utilities.formatDate(celda, Session.getScriptTimeZone(), "dd/MM/yyyy");
//     return celda;
//   }));

//   return {
//     cabeceras: datosFormateados[0],
//     filas: datosFormateados.slice(1)
//   };
// }

// /**
//  * Obtiene el nombre del usuario logueado desde la hoja Usuarios
//  */
// function obtenerUsuarioLogueado() {
//   const email = Session.getActiveUser().getEmail();
//   const usuarios = HOJA_USUARIOS.getDataRange().getValues();
//   const usuarioEncontrado = usuarios.find(u => u[0] === email);

//   return {
//     email: email,
//     nombre: usuarioEncontrado ? usuarioEncontrado[1] : "Usuario Externo"
//   };
// }

// /**
//  * Guarda un nuevo registro y devuelve el ID generado
//  */
// function crearNuevoTicket(datos) {
//   try {
//     const ultimaFila = HOJA_REGISTROS.getLastRow();

//     // Obtener el último ID numérico (asumiendo que está en la columna A)
//     let ultimoId = 0;
//     if (ultimaFila > 1) {
//       ultimoId = parseInt(HOJA_REGISTROS.getRange(ultimaFila, 1).getValue());
//     }
//     const nuevoId = isNaN(ultimoId) ? 1 : ultimoId + 1;

//     // Estructura: [Nº Ticket (ID), Fecha Solicitud, Prioridad, Estado, Tarea, Solicitante, Usuario, Fecha Cierre, Plataforma]
//     const nuevaFila = [
//       nuevoId,
//       datos.fecha,
//       datos.prioridad,
//       'Abierta',
//       datos.tarea,
//       datos.solicitante,
//       datos.usuario, // Nombre que viene del frontend
//       '',            // Fecha Cierre inicial
//       datos.plataforma
//     ];

//     HOJA_REGISTROS.appendRow(nuevaFila);
//     return nuevoId;

//   } catch (e) {
//     throw new Error("Error en el servidor al guardar: " + e.toString());
//   }
// }

// /**
//  * Busca el número de fila basado en el ID del ticket
//  */
// function buscarFilaPorId(id) {
//   const ids = HOJA_REGISTROS.getRange(2, 1, HOJA_REGISTROS.getLastRow() - 1, 1).getValues().flat();
//   const index = ids.indexOf(Number(id));
//   return index !== -1 ? index + 2 : null; // +2 porque el array empieza en 0 y la hoja en 1 (+ encabezado)
// }

// /**
//  * Actualiza un ticket existente
//  */
// function actualizarTicket(datos) {
//   const fila = buscarFilaPorId(datos.id);
//   if (!fila) throw new Error("No se encontró el ticket con ID: " + datos.id);

//   // Columnas: [ID(1), Fecha(2), Prioridad(3), Estado(4), Tarea(5), Solicitante(6), Usuario(7), Cierre(8), Plataforma(9)]
//   HOJA_REGISTROS.getRange(fila, 2).setValue(datos.fecha);
//   HOJA_REGISTROS.getRange(fila, 3).setValue(datos.prioridad);
//   HOJA_REGISTROS.getRange(fila, 5).setValue(datos.tarea);
//   HOJA_REGISTROS.getRange(fila, 6).setValue(datos.solicitante);
//   HOJA_REGISTROS.getRange(fila, 9).setValue(datos.plataforma);
//   return true;
// }

// /**
//  * Cierra un ticket (cambia estado y pone fecha actual)
//  */
// function cerrarTicketBackend(id) {
//   const fila = buscarFilaPorId(id);
//   if (!fila) throw new Error("Ticket no encontrado");

//   const fechaHoy = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd");
//   HOJA_REGISTROS.getRange(fila, 4).setValue("Resuelta"); // Columna Estado
//   HOJA_REGISTROS.getRange(fila, 8).setValue(fechaHoy);   // Columna Fecha Cierre
//   return true;
// }

// /**
//  * Elimina un ticket definitivamente
//  */
// function eliminarTicketBackend(id) {
//   const fila = buscarFilaPorId(id);
//   if (fila) {
//     HOJA_REGISTROS.deleteRow(fila);
//     return true;
//   }
//   return false;
// }