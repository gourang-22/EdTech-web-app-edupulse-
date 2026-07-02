"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const lesson_controller_1 = require("../controllers/lesson.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const admin_middleware_1 = require("../middleware/admin.middleware");
const router = (0, express_1.Router)();
router.get('/module/:moduleId', auth_middleware_1.protect, lesson_controller_1.getLessonsByModule);
router.get('/:id', auth_middleware_1.protect, lesson_controller_1.getLesson);
router.post('/', auth_middleware_1.protect, admin_middleware_1.adminOnly, lesson_controller_1.createLesson);
router.put('/:id', auth_middleware_1.protect, admin_middleware_1.adminOnly, lesson_controller_1.updateLesson);
router.delete('/:id', auth_middleware_1.protect, admin_middleware_1.adminOnly, lesson_controller_1.deleteLesson);
exports.default = router;
//# sourceMappingURL=lesson.routes.js.map