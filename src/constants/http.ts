/*
 * http status codes
 * Refernce : https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
 */

const HTTP_STATUS_CODES = {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500,
    BAD_GATEWAY: 502,
    TOO_MANY_REQUESTS: 429,
    SERVICE_UNAVAILABLE: 503,
};

export { HTTP_STATUS_CODES };
