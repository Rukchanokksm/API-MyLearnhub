"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassWord = exports.hashPassWord = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
function hashPassWord(password) {
    const salt = bcryptjs_1.default.genSaltSync(12);
    return bcryptjs_1.default.hashSync(password, salt);
}
exports.hashPassWord = hashPassWord;
function comparePassWord(password, hashed) {
    return bcryptjs_1.default.compareSync(password, hashed);
}
exports.comparePassWord = comparePassWord;
//# sourceMappingURL=bcrytp.js.map