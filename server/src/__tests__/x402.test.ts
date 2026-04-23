import { Request, Response, NextFunction } from "express";
import { x402Middleware } from "../middleware/x402";
import { DEFAULT_MICROPAYMENT_USDC, X402_STATUS_CODE } from "../config/constants";
import { describe, it, expect, beforeEach, jest } from '@jest/globals';

// Mock metrics so we don't spam logs during test
jest.mock("../utils/circleMetrics", () => ({
  metrics: {
    recordCircleCall: jest.fn()
  }
}));

// Mock logger
jest.mock("../utils/logger", () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn()
  }
}));

describe("x402Middleware", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockRequest = {
      path: "/api/legal/analyze",
      originalUrl: "/api/legal/analyze",
      headers: {},
      method: "POST"
    };

    mockResponse = {
      setHeader: jest.fn() as any,
      status: jest.fn().mockReturnThis() as any,
      json: jest.fn() as any
    };

    nextFunction = jest.fn();
  });

  it("should return 402 Payment Required if no payment proof is provided on protected route", async () => {
    await x402Middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.setHeader).toHaveBeenCalledWith("X-Payment-Required", "true");
    expect(mockResponse.setHeader).toHaveBeenCalledWith("X-Payment-Price", `$${DEFAULT_MICROPAYMENT_USDC}`);
    expect(mockResponse.status).toHaveBeenCalledWith(X402_STATUS_CODE);
    expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
      x402Version: 1,
      error: "Payment Required"
    }));
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it("should fail-fast and return 402 if payment proof is invalid", async () => {
    // Setting an invalid hash (too short, doesn't start with 0x)
    mockRequest.headers = { "x-payment-proof": "invalid-hash" };

    await x402Middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(X402_STATUS_CODE);
    expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
      error: "Payment Validation Failed"
    }));
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it("should call next() if valid payment proof is provided", async () => {
    // Valid mock hash format according to verifyPaymentOnChain
    mockRequest.headers = { "x-payment-proof": "0x1234567890abcdef" };

    await x402Middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalled();
    expect(mockResponse.status).not.toHaveBeenCalled();
  });

  it("should call next() if route is not protected", async () => {
    mockRequest = { ...mockRequest, path: "/api/health" };
    
    await x402Middleware(mockRequest as Request, mockResponse as Response, nextFunction);

    expect(nextFunction).toHaveBeenCalled();
  });
});
