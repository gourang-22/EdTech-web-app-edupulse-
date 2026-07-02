"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const upload_controller_1 = require("../controllers/upload.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const admin_middleware_1 = require("../middleware/admin.middleware");
const router = (0, express_1.Router)();
router.post('/image', auth_middleware_1.protect, admin_middleware_1.adminOnly, upload_controller_1.upload.single('file'), upload_controller_1.uploadImage);
router.post('/video', auth_middleware_1.protect, admin_middleware_1.adminOnly, upload_controller_1.upload.single('file'), upload_controller_1.uploadVideo);
router.post('/resource', auth_middleware_1.protect, admin_middleware_1.adminOnly, upload_controller_1.upload.single('file'), upload_controller_1.uploadResource);
exports.default = router;
//# sourceMappingURL=upload.routes.js.map