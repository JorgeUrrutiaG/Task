/**
 * CONTROLADOR DE TAREAS (TICKETS)
 * Responde a: TaskService / AppScriptService.guardarTarea(), cerrarTarea(), etc.
 */

function obtenerTareasBackend() {
  const valores = HOJA_REGISTROS.getDataRange().getValues();
  
  const datosFormateados = valores.map(fila => fila.map(celda => {
    if (celda instanceof Date) return Utilities.formatDate(celda, Session.getScriptTimeZone(), "dd/MM/yyyy");
    return celda;
  }));

  return {
    cabeceras: datosFormateados[0],
    filas: datosFormateados.slice(1)
  };
}

function crearTareaBackend(datos) {
  try {
    const ultimaFila = HOJA_REGISTROS.getLastRow();

    let ultimoId = 0;
    if (ultimaFila > 1) {
      ultimoId = parseInt(HOJA_REGISTROS.getRange(ultimaFila, 1).getValue());
    }
    const nuevoId = isNaN(ultimoId) ? 1 : ultimoId + 1;

    const nuevaFila = [
      nuevoId,
      datos.fecha,
      datos.prioridad,
      'Abierta',
      datos.tarea,
      datos.solicitante,
      datos.usuario, 
      '',            
      datos.plataforma
    ];

    HOJA_REGISTROS.appendRow(nuevaFila);
    return nuevoId;

  } catch (e) {
    throw new Error("Error en el servidor al guardar: " + e.toString());
  }
}

function actualizarTareaBackend(datos) {
  const fila = buscarFilaPorId(datos.id);
  if (!fila) throw new Error("No se encontró el ticket con ID: " + datos.id);

  HOJA_REGISTROS.getRange(fila, 2).setValue(datos.fecha);
  HOJA_REGISTROS.getRange(fila, 3).setValue(datos.prioridad);
  HOJA_REGISTROS.getRange(fila, 5).setValue(datos.tarea);
  HOJA_REGISTROS.getRange(fila, 6).setValue(datos.solicitante);
  HOJA_REGISTROS.getRange(fila, 9).setValue(datos.plataforma);
  return true;
}

function cerrarTareaBackend(id) {
  const fila = buscarFilaPorId(id);
  if (!fila) throw new Error("Ticket no encontrado");

  const fechaHoy = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd");
  HOJA_REGISTROS.getRange(fila, 4).setValue("Resuelta"); 
  HOJA_REGISTROS.getRange(fila, 8).setValue(fechaHoy);   
  return true;
}

function eliminarTareaBackend(id) {
  const fila = buscarFilaPorId(id);
  if (fila) {
    HOJA_REGISTROS.deleteRow(fila);
    return true;
  }
  return false;
}

/**
 * Función de utilidad interna (Helper del controlador de tareas)
 */
function buscarFilaPorId(id) {
  const ids = HOJA_REGISTROS.getRange(2, 1, HOJA_REGISTROS.getLastRow() - 1, 1).getValues().flat();
  const index = ids.indexOf(Number(id));
  return index !== -1 ? index + 2 : null; 
}
