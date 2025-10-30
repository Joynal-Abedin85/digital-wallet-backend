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
exports.createaccesstokenwithrefresh = exports.createusertoken = void 0;
const env_1 = require("../config/env");
const jwt_1 = require("./jwt");
const user_model_1 = require("../modules/user/user.model");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const apperror_1 = __importDefault(require("../error/apperror"));
const createusertoken = (user) => {
    if (!user._id || !user.email || !user.role) {
        throw new Error("User data incomplete");
    }
    const userId = user._id.toString();
    const jwtpayload = {
        userId,
        email: user.email,
        role: user.role,
    };
    const accesstoken = (0, jwt_1.generatetoken)(jwtpayload, env_1.envVars.JWT_ACCESS_SECRET, env_1.envVars.JWT_ACCESS_EXPIRES);
    const refreshtoken = (0, jwt_1.generatetoken)(jwtpayload, env_1.envVars.JWT_REFRESH_SECRET, env_1.envVars.JWT_REFRESH_EXPIRED);
    return {
        accesstoken,
        refreshtoken
    };
};
exports.createusertoken = createusertoken;
const createaccesstokenwithrefresh = (refreshtoken) => __awaiter(void 0, void 0, void 0, function* () {
    const verifedrefreshtoken = (0, jwt_1.verifytoken)(refreshtoken, env_1.envVars.JWT_REFRESH_SECRET);
    const isuserexist = yield user_model_1.User.findOne({ email: verifedrefreshtoken.email });
    if (!isuserexist) {
        throw new apperror_1.default(http_status_codes_1.default.BAD_REQUEST, "user does not  exist ");
    }
    if (isuserexist.isDeleted) {
        throw new apperror_1.default(http_status_codes_1.default.BAD_REQUEST, "user is deleted");
    }
    const jwtpayload = {
        userId: isuserexist._id,
        email: isuserexist.email,
        role: isuserexist.role,
    };
    const accesstoken = (0, jwt_1.generatetoken)(jwtpayload, env_1.envVars.JWT_ACCESS_SECRET, env_1.envVars.JWT_ACCESS_EXPIRES);
    return accesstoken;
});
exports.createaccesstokenwithrefresh = createaccesstokenwithrefresh;
