import status from "http-status";

export const ErrorCodes = {
	ERR_INTERNAL: "ERR_INTERNAL",
	ERR_BAD_REQUEST: "ERR_BAD_REQUEST",
	ERR_UNAUTHORIZED: "ERR_UNAUTHORIZED",
	ERR_FORBIDDEN: "ERR_FORBIDDEN",
	ERR_NOT_FOUND: "ERR_NOT_FOUND",
	ERR_VALIDATION: "ERR_VALIDATION",
	ERR_TOO_MANY_REQUESTS: "ERR_TOO_MANY_REQUESTS",
	ERR_CONFLICT: "ERR_CONFLICT",
} as const;

export type ErrorCodeType = (typeof ErrorCodes)[keyof typeof ErrorCodes];

export class AppError extends Error {
	public readonly statusCode: number;
	public readonly errorCode: ErrorCodeType;

	constructor(
		message: string,
		statusCode: number = status.INTERNAL_SERVER_ERROR,
		errorCode: ErrorCodeType = ErrorCodes.ERR_INTERNAL,
	) {
		super(message);

		this.name = new.target.name;
		this.statusCode = statusCode;
		this.errorCode = errorCode;

		Error.captureStackTrace(this, new.target);
	}

	static internal(message = "Internal server error") {
		return new InternalServerException(message);
	}

	static badRequest(message = "Bad request") {
		return new BadRequestException(message);
	}

	static unauthorized(message = "Unauthorized") {
		return new UnauthorizedException(message);
	}

	static forbidden(message = "Forbidden") {
		return new ForbiddenException(message);
	}

	static notFound(message = "Resource not found") {
		return new NotFoundException(message);
	}

	static conflict(message = "Conflict") {
		return new ConflictException(message);
	}

	static validation(message = "Validation failed") {
		return new ValidationException(message);
	}

	static tooManyRequests(message = "Too many requests") {
		return new TooManyRequestsException(message);
	}
}

export class InternalServerException extends AppError {
	constructor(message = "Internal server error") {
		super(message, status.INTERNAL_SERVER_ERROR, ErrorCodes.ERR_INTERNAL);
	}
}

export class NotFoundException extends AppError {
	constructor(message = "Resource not found") {
		super(message, status.NOT_FOUND, ErrorCodes.ERR_NOT_FOUND);
	}
}

export class BadRequestException extends AppError {
	constructor(message = "Bad request") {
		super(message, status.BAD_REQUEST, ErrorCodes.ERR_BAD_REQUEST);
	}
}

export class UnauthorizedException extends AppError {
	constructor(message = "Unauthorized") {
		super(message, status.UNAUTHORIZED, ErrorCodes.ERR_UNAUTHORIZED);
	}
}

export class ForbiddenException extends AppError {
	constructor(message = "Forbidden") {
		super(message, status.FORBIDDEN, ErrorCodes.ERR_FORBIDDEN);
	}
}

export class ConflictException extends AppError {
	constructor(message = "Conflict") {
		super(message, status.CONFLICT, ErrorCodes.ERR_CONFLICT);
	}
}

export class ValidationException extends AppError {
	constructor(message = "Validation failed") {
		super(message, status.UNPROCESSABLE_ENTITY, ErrorCodes.ERR_VALIDATION);
	}
}

export class TooManyRequestsException extends AppError {
	constructor(message = "Too many requests") {
		super(message, status.TOO_MANY_REQUESTS, ErrorCodes.ERR_TOO_MANY_REQUESTS);
	}
}
