const Barcode = require('../models/Barcode');

// @desc    Crear nuevo registro de código de barras
// @route   POST /api/barcodes
// @access  Private
exports.createBarcode = async (req, res, next) => {
  try {
    const { trackingNumber, serialNumber } = req.body;

    // Validar entrada
    if (!trackingNumber || !serialNumber) {
      return res.status(400).json({
        success: false,
        error: 'Por favor proporcione el número de guía y número de serie'
      });
    }

    // Determinar la agencia basada en el número de dígitos
    let agency;
    const cleanTrackingNumber = trackingNumber.replace(/\D/g, '');

    if (cleanTrackingNumber.length === 11) {
      agency = 'MercadoLibre';
    } else if (cleanTrackingNumber.length === 12) {
      agency = 'Deprisa';
    } else {
      return res.status(400).json({
        success: false,
        error: 'Número de guía inválido. Debe tener 11 dígitos (MercadoLibre) o 12 dígitos (Deprisa)'
      });
    }

    // Verificar si ya existe la combinación
    const existingBarcode = await Barcode.findOne({
      trackingNumber: cleanTrackingNumber,
      serialNumber
    });

    if (existingBarcode) {
      return res.status(400).json({
        success: false,
        error: 'Esta combinación de guía y serial ya ha sido registrada'
      });
    }

    // Crear el registro
    const barcode = await Barcode.create({
      trackingNumber: cleanTrackingNumber,
      agency,
      serialNumber
    });

    res.status(201).json({
      success: true,
      data: barcode
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Esta combinación de guía y serial ya ha sido registrada'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Error en el servidor'
    });
  }
};

// @desc    Obtener todos los registros de códigos de barras con filtros opcionales
// @route   GET /api/barcodes
// @access  Private
exports.getBarcodes = async (req, res, next) => {
  try {
    const { agency, serialNumber, startDate, endDate, date } = req.query;
    
    // Construir el objeto de consulta
    let query = {};
    
    // Filtrar por agencia
    if (agency) {
      query.agency = agency;
    }
    
    // Filtrar por número de serie
    if (serialNumber) {
      query.serialNumber = serialNumber;
    }
    
    // Filtrar por fecha
    if (date) {
      // Fecha exacta
      const searchDate = new Date(date);
      const nextDay = new Date(searchDate);
      nextDay.setDate(nextDay.getDate() + 1);
      
      query.scannedAt = {
        $gte: searchDate,
        $lt: nextDay
      };
    } else if (startDate || endDate) {
      // Rango de fechas
      query.scannedAt = {};
      
      if (startDate) {
        query.scannedAt.$gte = new Date(startDate);
      }
      
      if (endDate) {
        const endDateObj = new Date(endDate);
        endDateObj.setDate(endDateObj.getDate() + 1);
        query.scannedAt.$lt = endDateObj;
      }
    }
    
    const barcodes = await Barcode.find(query).sort({ scannedAt: -1 });
    
    res.status(200).json({
      success: true,
      count: barcodes.length,
      data: barcodes
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Error en el servidor'
    });
  }
};

// @desc    Obtener un registro de código de barras por ID
// @route   GET /api/barcodes/:id
// @access  Private
exports.getBarcode = async (req, res, next) => {
  try {
    const barcode = await Barcode.findById(req.params.id);
    
    if (!barcode) {
      return res.status(404).json({
        success: false,
        error: 'Registro no encontrado'
      });
    }
    
    res.status(200).json({
      success: true,
      data: barcode
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Error en el servidor'
    });
  }
};

// @desc    Eliminar un registro de código de barras
// @route   DELETE /api/barcodes/:id
// @access  Private
exports.deleteBarcode = async (req, res, next) => {
  try {
    const barcode = await Barcode.findById(req.params.id);
    
    if (!barcode) {
      return res.status(404).json({
        success: false,
        error: 'Registro no encontrado'
      });
    }
    
    await barcode.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'Error en el servidor'
    });
  }
}; 