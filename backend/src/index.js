"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
// Load environment variables
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../.env') });
// Routes
const auth_1 = __importDefault(require("./routes/auth"));
const users_1 = __importDefault(require("./routes/users"));
const blogs_1 = __importDefault(require("./routes/blogs"));
const events_1 = __importDefault(require("./routes/events"));
const internships_1 = __importDefault(require("./routes/internships"));
const startups_1 = __importDefault(require("./routes/startups"));
const challenges_1 = __importDefault(require("./routes/challenges"));
const qa_1 = __importDefault(require("./routes/qa"));
const utils_1 = require("./utils");
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Health check
app.get('/health', (_req, res) => {
    res.json({ ok: true, timestamp: new Date().toISOString() });
});
// API Routes
app.use('/api/auth', auth_1.default);
app.use('/api/users', users_1.default);
app.use('/api/blogs', blogs_1.default);
app.use('/api/events', events_1.default);
app.use('/api/internships', internships_1.default);
app.use('/api/startups', startups_1.default);
app.use('/api/challenges', challenges_1.default);
app.use('/api/qa', qa_1.default);
// 404 handler
app.use((_req, res) => {
    res.status(404).json({ message: 'Not Found' });
});
// Start server
const start = async () => {
    const port = Number(process.env.PORT || 4000);
    const env = process.env.NODE_ENV || 'development';
    (0, utils_1.log)('[SERVER]', `Starting in ${env} mode...`);
    (0, utils_1.log)('[SERVER]', `Backend working directory: ${process.cwd()}`);
    (0, utils_1.log)('[SERVER]', `Admin email configured: ${Boolean((process.env.ADMIN_EMAIL || '').trim())}`);
    // Connect to MongoDB - REQUIRED
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
        (0, utils_1.logError)('[DATABASE]', 'MONGODB_URI is not configured - cannot start server');
        process.exit(1);
    }
    try {
        await mongoose_1.default.connect(mongoUri);
        (0, utils_1.log)('[DATABASE]', '✓ MongoDB connected');
        (0, utils_1.log)('[DATABASE]', `Database: ${mongoose_1.default.connection.name}`);
        (0, utils_1.log)('[DATABASE]', `Host: ${mongoose_1.default.connection.host}`);
    }
    catch (err) {
        (0, utils_1.logError)('[DATABASE]', 'Failed to connect to MongoDB');
        (0, utils_1.logError)('[DATABASE]', err);
        process.exit(1);
    }
    // Start listening
    app.listen(port, () => {
        (0, utils_1.log)('[SERVER]', `✓ Backend listening on http://localhost:${port}`);
    });
};
void start();
//# sourceMappingURL=index.js.map