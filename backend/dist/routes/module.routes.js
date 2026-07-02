"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const module_controller_1 = require("../controllers/module.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const admin_middleware_1 = require("../middleware/admin.middleware");
const router = (0, express_1.Router)();
router.get('/course/:courseId', auth_middleware_1.protect, module_controller_1.getModulesByCourse);
router.post('/', auth_middleware_1.protect, admin_middleware_1.adminOnly, module_controller_1.createModule);
router.put('/:id', auth_middleware_1.protect, admin_middleware_1.adminOnly, module_controller_1.updateModule);
router.delete('/:id', auth_middleware_1.protect, admin_middleware_1.adminOnly, module_controller_1.deleteModule);
exports.default = router;
//# sourceMappingURL=module.routes.js.map