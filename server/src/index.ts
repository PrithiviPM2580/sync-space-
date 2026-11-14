import path from "node:path";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import httpStatus from "http-status";
import { connectDatabse, disconnectDatabase } from "./config/db.config";
import { Env } from "./config/env.config";
import { logger } from "./utils/logger.util";

const app = express();

app.set("trust proxy", 1);

app.use(
	helmet({
		contentSecurityPolicy: {
			directives: {
				"connect-src": [
					"'self'",
					"https://*.liveblocks.io",
					"wss://*.liveblocks.io",
				],
				"img-src": ["'self'", "data:", "blob:", "https:"],
				"media-src": ["'self'", "blob:", "https:"],
				"style-src": [
					"'self'",
					"'unsafe-inline'",
					"https://fonts.googleapis.com",
				],
				"font-src": ["'self'", "data:", "https://fonts.gstatic.com"],
			},
		},
	}),
);
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));
app.use(cookieParser());

if (Env.CROSS_ORIGIN) {
	app.use(cors({ origin: Env.CROSS_ORIGIN, credentials: true }));
}

app.get("/health", (req, res) => {
	res.status(httpStatus.OK).json({ status: "OK" });
});

if (Env.NODE_ENV === "production") {
	const clientPath = path.resolve(__dirname, "../../client/dist");
	app.use(express.static(clientPath));
	app.get(/^(?!\/api).*/, (_request, response) => {
		response.sendFile(path.join(clientPath, "index.html"));
	});
}

app.use((req, res, next) => {
	logger.warn(
		`404 - Not Found - ${req.originalUrl} - ${req.method} - ${req.ip}`,
	);
});

let server: ReturnType<typeof app.listen> | undefined;

const shutdownSignal: NodeJS.Signals[] = ["SIGINT", "SIGTERM"];
let isShuttingDown = false;

const shutdown = async (signal: NodeJS.Signals) => {
	if (isShuttingDown) return;

	isShuttingDown = true;

	logger.info("Shutting down API", { signal });

	server?.close(async (error) => {
		if (error) logger.error("Shutdown failed", { error: error.message });
		try {
			await disconnectDatabase();
			process.exitCode = error ? 1 : 0;
		} catch (error) {
			logger.error("Database disconnect failed", {
				error: error instanceof Error ? error.message : "Unknown error",
			});
			process.exitCode = 1;
		}
	});
};

const startServer = async () => {
	try {
		await connectDatabse();
	} catch (error) {
		logger.error("Failed to connect to MongoDB", {
			error: error instanceof Error ? error.message : "Unknown error",
		});
		process.exitCode = 1;
	}

	server = app.listen(Env.PORT, () => {
		logger.info("API listening", { port: Env.PORT, env: Env.NODE_ENV });
	});

	shutdownSignal.forEach((signal) => {
		process.once(signal, () => shutdown(signal));
	});
};

startServer();
