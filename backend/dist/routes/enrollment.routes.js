"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const enrollment_controller_1 = require("../controllers/enrollment.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.get('/my-courses', auth_middleware_1.protect, enrollment_controller_1.getMyCourses);
router.get('/check/:courseId', auth_middleware_1.protect, enrollment_controller_1.checkEnrollment);
router.get('/:enrollmentId', auth_middleware_1.protect, enrollment_controller_1.getEnrollment);
router.put('/:enrollmentId/complete-lesson', auth_middleware_1.protect, enrollment_controller_1.completeLesson);
exports.default = router;
//# sourceMappingURL=enrollment.routes.js.map