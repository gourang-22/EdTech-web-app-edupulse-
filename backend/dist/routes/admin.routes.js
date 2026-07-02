"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_controller_1 = require("../controllers/admin.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const admin_middleware_1 = require("../middleware/admin.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.protect, admin_middleware_1.adminOnly);
router.get('/stats', admin_controller_1.getStats);
router.get('/students', admin_controller_1.getStudents);
router.get('/orders', admin_controller_1.getAllOrders);
exports.default = router;
//# sourceMappingURL=admin.routes.js.map