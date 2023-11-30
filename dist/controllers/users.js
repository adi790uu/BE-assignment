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
exports.authUser = exports.registerUser = void 0;
const UserService_1 = __importDefault(require("../services/UserService"));
const zod_1 = require("zod");
const createUserPayloadSchema = zod_1.z.object({
    name: zod_1.z.string(),
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
});
const loginUserPayloadSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
});
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = createUserPayloadSchema.parse(req.body);
        const data = yield UserService_1.default.createUser(payload);
        if (data) {
            return res.status(201).json({ success: true, data: data });
        }
    }
    catch (error) {
        if (error.message === 'User already exists') {
            return res
                .status(409)
                .json({ success: false, msg: 'User already exists' });
        }
        else if (error instanceof zod_1.ZodError) {
            return res.status(400).json({ success: false, msg: 'Invalid input data' });
        }
        else {
            return res
                .status(500)
                .json({ success: false, msg: 'Internal Server Error' });
        }
    }
});
exports.registerUser = registerUser;
const authUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = loginUserPayloadSchema.parse(req.body);
        const data = yield UserService_1.default.loginUser(payload);
        if (data) {
            return res.json({ success: true, msg: 'User logged in', data: data });
        }
    }
    catch (error) {
        if (error.message === 'user not found') {
            return res.status(404).json({ success: false, msg: 'User not found' });
        }
        else if (error instanceof zod_1.ZodError) {
            return res
                .status(400)
                .json({ success: false, msg: 'Invalid credentials' });
        }
        else {
            return res
                .status(500)
                .json({ success: false, msg: 'Internal Server Error' });
        }
    }
});
exports.authUser = authUser;
// export const getUser = async (req: Request, res: Response) => {
//   const userId = req.user
//   const keyword = req.query.keyword
//   let user
//   if (keyword) {
//     user = await User.findById(keyword)
//       .populate('likes')
//       .populate('favorites')
//       .populate('postsCreated')
//   } else {
//     user = await User.findById(userId)
//       .populate('likes')
//       .populate('favorites')
//       .populate('postsCreated')
//   }
//   if (user) {
//     return res.json({ msg: 'Success', user: user })
//   }
//   res.json({ msg: 'Failed' })
// }