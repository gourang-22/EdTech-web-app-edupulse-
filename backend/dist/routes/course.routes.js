"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const course_controller_1 = require("../controllers/course.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const admin_middleware_1 = require("../middleware/admin.middleware");
const router = (0, express_1.Router)();
router.get('/', course_controller_1.getCourses);
router.get('/admin/all', auth_middleware_1.protect, admin_middleware_1.adminOnly, course_controller_1.getAllCoursesAdmin);
router.get('/:id', course_controller_1.getCourse);
router.post('/', auth_middleware_1.protect, admin_middleware_1.adminOnly, course_controller_1.createCourse);
router.put('/:id', auth_middleware_1.protect, admin_middleware_1.adminOnly, course_controller_1.updateCourse);
router.delete('/:id', auth_middleware_1.protect, admin_middleware_1.adminOnly, course_controller_1.deleteCourse);
exports.default = router;
//# sourceMappingURL=course.routes.js.map