"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controller_1 = require("../controllers/order.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.post('/create', auth_middleware_1.protect, order_controller_1.createOrder);
router.post('/verify', auth_middleware_1.protect, order_controller_1.verifyPayment);
router.get('/my-orders', auth_middleware_1.protect, order_controller_1.getMyOrders);
exports.default = router;
//# sourceMappingURL=order.routes.js.map