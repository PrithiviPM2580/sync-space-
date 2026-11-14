import type { ErrorRequestHandler } from "express";
import status from "http-status";
import { ZodError } from "zod";
import { Env } from "@/config/env.config";
import { AppError, ErrorCodes } from "@/utils/app-error.util";
import { logger } from "@/utils/logger.util";

const formatZodError = (error: ZodError) => {
	return error.issues.map((issue) => {
		return {
			field: issue.path.join("."),
			message: issue.message,
		};
	});
};

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
	const route = `${req.method} ${req.originalUrl}`;

	if (err instanceof ZodError) {
		logger.error(`Validation error on route ${route}: ${err.message}`);

		return res.status(status.BAD_GATEWAY).json({
			success: false,
			errorCode: ErrorCodes.ERR_VALIDATION,
			message: "Validation failed",
			errors: formatZodError(err),
		});
	}

	if (err instanceof AppError) {
		logger.error(`AppError on route ${route}: ${err.message}`);

		return res.status(err.statusCode).json({
			success: false,
			errorCode: err.errorCode,
			message: err.message,
		});
	}

	logger.error("Unhandled error", {
		route,
		error: err instanceof Error ? err.message : "Unknown error",
		stack: err instanceof Error ? err.stack : undefined,
	});

	return res.status(status.INTERNAL_SERVER_ERROR).json({
		success: false,
		errorCode: ErrorCodes.ERR_INTERNAL,
		message:
			Env.NODE_ENV === "production"
				? "Internal server error"
				: err instanceof Error
					? err.message
					: "Internal server error",
	});
};
