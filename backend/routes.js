const express = require('express');
const router = express.Router();
const controller = require('./controller');
const auth = require('./authMiddleware');

router.post('/', auth, controller.createtask);
router.get('/', auth, controller.showtasks);
router.patch('/:id/toggle', auth, controller.toggletask);
router.put('/:id', auth, controller.updatetask);
router.delete('/:id', auth, controller.deletetask);

module.exports = router;
