const express = require('express');
const { createBarcode, getBarcodes, getBarcode, deleteBarcode } = require('../controllers/barcode');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Aplicar middleware de protección a todas las rutas
router.use(protect);

router.route('/')
  .post(createBarcode)
  .get(getBarcodes);

router.route('/:id')
  .get(getBarcode)
  .delete(deleteBarcode);

module.exports = router; 