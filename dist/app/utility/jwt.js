"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifytoken = exports.generatetoken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generatetoken = (payload, secret, expiresIn) => {
    const token = jsonwebtoken_1.default.sign(payload, secret, {
        expiresIn
    });
    return token;
};
exports.generatetoken = generatetoken;
const verifytoken = (token, secret) => {
    const verifiedtoken = jsonwebtoken_1.default.verify(token, secret);
    return verifiedtoken;
};
exports.verifytoken = verifytoken;
