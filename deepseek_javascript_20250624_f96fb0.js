function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Sistema de Ubicaciones')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getDatosIniciales() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Obtener referencias de ITEMS CTAS
  const itemsSheet = ss.getSheetByName("ITEMS CTAS");
  const referencias = itemsSheet.getRange("A:A").getValues().flat().filter(item => item !== "");
  
  // Obtener personal de la hoja Personal
  const personalSheet = ss.getSheetByName("Personal");
  const personal = personalSheet.getRange("A:A").getValues().flat().filter(item => item !== "");
  
  return {
    referencias: referencias,
    personal: personal
  };
}

function buscarReferencia(referencia) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("UBICACIONES");
    const data = sheet.getDataRange().getValues();
    
    // Buscar coincidencias en la columna REFERENCIA (índice 12)
    const resultados = data.filter(row => row[12] && row[12].toString().toLowerCase().includes(referencia.toLowerCase()));
    
    if (resultados.length > 0) {
      return resultados.map(row => ({
        referencia: row[12] || '',
        carril: row[7] || '',
        ubicacion: row[8] || '',
        op: row[9] || '',
        efectuadoPor: row[10] || '',
        cantidad: row[6] || '',
        observaciones: row[11] || ''
      }));
    }
    return [];
  } catch (e) {
    console.error("Error en buscarReferencia: " + e.message);
    throw e;
  }
}

function registrarUbicacion(datos) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("UBICACIONES");
    
    const nuevaFila = [
      new Date(), // Marca temporal
      '', // Lista 001 a 004LC
      '', // Lista 004LH a 016
      '', // Lista 017 a 160
      '', // Lista 1600 a PHN
      '', // Lista R024 hasta Z
      datos.cantidad || '',
      datos.carril || '',
      datos.ubicacion || '',
      datos.op || '',
      datos.efectuadoPor || '',
      datos.observaciones || '',
      datos.referencia || ''
    ];
    
    sheet.appendRow(nuevaFila);
    return { success: true, message: "Registro guardado correctamente" };
  } catch (e) {
    console.error("Error en registrarUbicacion: " + e.message);
    throw e;
  }
}