import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";

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
app.use(cors());

let server: ReturnType<typeof app.listen> | undefined;

const shutdownSignal: NodeJS.Signals[] = ["SIGINT", "SIGTERM"];
let isShuttingDown = false;

const shutdown = async (signal: NodeJS.Signals) => {
	if (isShuttingDown) return;

	isShuttingDown = true;

	server?.close((error) => {
		if (error) console.error("Error closing server:", error);
		try {
			process.exitCode = error ? 1 : 0;
		} catch (error) {
			process.exitCode = 1;
		}
	});
};

const startServer = async () => {
	try {
	} catch (error) {
		process.exitCode = 1;
	}

	server = app.listen(3000, () => {
		console.log("Server is running on port 3000");
	});

	shutdownSignal.forEach((signal) => {
		process.once(signal, () => shutdown(signal));
	});
};

startServer();
