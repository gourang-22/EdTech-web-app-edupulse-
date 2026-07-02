"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const db_1 = __importDefault(require("./config/db"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const course_routes_1 = __importDefault(require("./routes/course.routes"));
const module_routes_1 = __importDefault(require("./routes/module.routes"));
const lesson_routes_1 = __importDefault(require("./routes/lesson.routes"));
const enrollment_routes_1 = __importDefault(require("./routes/enrollment.routes"));
const order_routes_1 = __importDefault(require("./routes/order.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const upload_routes_1 = __importDefault(require("./routes/upload.routes"));
const error_middleware_1 = require("./middleware/error.middleware");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Connect to MongoDB
(0, db_1.default)();
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: 'Too many requests from this IP, please try again later.',
});
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
}));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use((0, morgan_1.default)('dev'));
app.use('/api', limiter);
// Serve static uploads
app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../public/uploads')));
// Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/courses', course_routes_1.default);
app.use('/api/modules', module_routes_1.default);
app.use('/api/lessons', lesson_routes_1.default);
app.use('/api/enrollments', enrollment_routes_1.default);
app.use('/api/orders', order_routes_1.default);
app.use('/api/admin', admin_routes_1.default);
app.use('/api/upload', upload_routes_1.default);
// Health check
app.get('/api/health', (_req, res) => {
    res.json({ status: 'OK', message: 'EdTech API is running 🚀', timestamp: new Date().toISOString() });
});
// Error handlers
app.use(error_middleware_1.notFound);
app.use(error_middleware_1.errorHandler);
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
exports.default = app;
//# sourceMappingURL=server.js.map