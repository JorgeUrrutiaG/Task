/**
 * CONTROLADOR DE TAREAS (TICKETS)
 * Responde a: TaskService / AppScriptService.guardarTarea(), cerrarTarea(), etc.
 *
 * Mapeo de columnas (evita números mágicos y hace el código auto-documentado).
 * IMPORTANTE: mantener sincronizado con la estructura de la hoja "Registros".
 */
const COL_ID = 1;
const COL_FECHA = 2;
const COL_PRIORIDAD = 3;
const COL_ESTADO = 4;
const COL_TAREA = 5;
const COL_SOLICITANTE = 6;
const COL_USUARIO = 7;
const COL_FECHA_CIERRE = 8;
const COL_PLATAFORMA = 9;

const ESTADO_ABIERTA = 'Abierta';
const ESTADO_RESUELTA = 'Resuelta';

/**
 * Normaliza el contenido de una fila (fechas legibles, buffers, etc.).
 */
function _normalizarCelda(celda) {
  if (celda instanceof Date) {
    return Utilities.formatDate(celda, Session.getScriptTimeZone(), "dd/MM/yyyy");
  }
  if (celda instanceof Object && typeof celda.getDataAsString === 'function') {
    return celda.getDataAsString();
  }
  return celda;
}

function obtenerTareasBackend() {
  const hoja = getHojaRegistros();
  const valores = hoja.getDataRange().getValues();

  const cabeceras = valores[0].map(_normalizarCelda);
  const filas = valores.slice(1).map(fila => fila.map(_normalizarCelda));

  return {
    cabeceras: cabeceras,
    filas: filas
  };
}

/**
 * Calcula el siguiente ID disponible de forma robusta:
 * busca el máximo ID existente en lugar de asumir el de la última fila.
 */
function _calcularNuevoId() {
  const hoja = getHojaRegistros();
  const ultimaFila = hoja.getLastRow();
  if (ultimaFila < 2) return 1;

  const ids = hoja.getRange(2, COL_ID, ultimaFila - 1, 1).getValues().flat()
    .map(Number)
    .filter(n => !isNaN(n));

  return ids.length === 0 ? 1 : Math.max(...ids) + 1;
}

function crearTareaBackend(datos) {
  try {
    const nuevoId = _calcularNuevoId();

    const nuevaFila = [
      nuevoId,
      datos.fecha,
      datos.prioridad,
      ESTADO_ABIERTA,
      datos.tarea,
      datos.solicitante,
      datos.usuario,
      '', // Fecha Cierre inicial
      datos.plataforma
    ];

    getHojaRegistros().appendRow(nuevaFila);
    return nuevoId;
  } catch (e) {
    throw new Error("Error en el servidor al guardar: " + e.toString());
  }
}

function actualizarTareaBackend(datos) {
  const hoja = getHojaRegistros();
  const fila = buscarFilaPorId(datos.id);
  if (!fila) throw new Error("No se encontró el ticket con ID: " + datos.id);

  hoja.getRange(fila, COL_FECHA).setValue(datos.fecha);
  hoja.getRange(fila, COL_PRIORIDAD).setValue(datos.prioridad);
  hoja.getRange(fila, COL_TAREA).setValue(datos.tarea);
  hoja.getRange(fila, COL_SOLICITANTE).setValue(datos.solicitante);
  hoja.getRange(fila, COL_PLATAFORMA).setValue(datos.plataforma);
  return true;
}

function cerrarTareaBackend(id) {
  const hoja = getHojaRegistros();
  const fila = buscarFilaPorId(id);
  if (!fila) throw new Error("Ticket no encontrado");

  const fechaHoy = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd");
  hoja.getRange(fila, COL_ESTADO).setValue(ESTADO_RESUELTA);
  hoja.getRange(fila, COL_FECHA_CIERRE).setValue(fechaHoy);
  return true;
}

function eliminarTareaBackend(id) {
  const hoja = getHojaRegistros();
  const fila = buscarFilaPorId(id);
  if (fila) {
    hoja.deleteRow(fila);
    return true;
  }
  return false;
}

/**
 * Función de utilidad interna (Helper del controlador de tareas)
 */
function buscarFilaPorId(id) {
  const hoja = getHojaRegistros();
  const ultimaFila = hoja.getLastRow();
  if (ultimaFila < 2) return null;

  const ids = hoja.getRange(2, COL_ID, ultimaFila - 1, 1).getValues().flat();
  const index = ids.indexOf(Number(id));
  return index !== -1 ? index + 2 : null;
}
