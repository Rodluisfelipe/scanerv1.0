const mongoose = require('mongoose');

const BarcodeSchema = new mongoose.Schema({
  trackingNumber: {
    type: String,
    required: [true, 'Por favor proporcione un número de guía'],
    trim: true
  },
  agency: {
    type: String,
    required: [true, 'La agencia es requerida'],
    enum: ['MercadoLibre', 'Deprisa']
  },
  serialNumber: {
    type: String,
    required: [true, 'Por favor proporcione un número de serie'],
    trim: true
  },
  scannedAt: {
    type: Date,
    default: Date.now
  }
});

// Índice compuesto para evitar duplicados (misma guía + serial)
BarcodeSchema.index({ trackingNumber: 1, serialNumber: 1 }, { unique: true });

module.exports = mongoose.model('Barcode', BarcodeSchema); 