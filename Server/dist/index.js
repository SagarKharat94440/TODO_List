"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
require("dotenv/config");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const connection_1 = __importDefault(require("./database/connection"));
const taskRouter_1 = __importDefault(require("./router/taskRouter"));
const node_cron_1 = __importDefault(require("node-cron"));
const taskModel_1 = require("./models/taskModel");
const app = (0, express_1.default)();
// middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// routes
app.get("/", (req, res) => {
    res.json({ message: "welcome 😊, Server is up and running" });
});
app.use(taskRouter_1.default);
// Run every day at midnight (00:00) to update tasks
node_cron_1.default.schedule("0 0 * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Running task status update...");
    const today = new Date().toISOString().split("T")[0];
    try {
        const result = yield taskModel_1.Task.updateMany({ dueDate: { $lt: today }, status: { $ne: "done" } }, { $set: { status: "timeOut" } });
        console.log(`${result.modifiedCount} tasks updated to 'timeOut'`);
    }
    catch (error) {
        console.error("Error updating tasks:", error);
    }
}));
// start server
const PORT = process.env.PORT || 8080;
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // connect to database
        yield (0, connection_1.default)();
        app.listen(Number(PORT), () => console.log("server started"));
    }
    catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
});
startServer();
