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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prisma.product.deleteMany()];
                case 1:
                    _a.sent(); // Clear existing products for demo
                    return [4 /*yield*/, prisma.product.createMany({
                            data: [
                                {
                                    name: 'Wireless Headphones',
                                    description: 'High-quality wireless headphones with noise cancellation.',
                                    imageUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
                                    price: 99.99,
                                    category: 'Electronics',
                                    stock: 50,
                                },
                                {
                                    name: 'Smart Watch',
                                    description: 'Track your fitness and notifications on the go.',
                                    imageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80',
                                    price: 149.99,
                                    category: 'Wearables',
                                    stock: 30,
                                },
                                {
                                    name: 'Bluetooth Speaker',
                                    description: 'Portable speaker with deep bass and long battery life.',
                                    imageUrl: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
                                    price: 59.99,
                                    category: 'Audio',
                                    stock: 40,
                                },
                                {
                                    name: 'VR Headset',
                                    description: 'Immersive virtual reality experience for gaming and more.',
                                    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80',
                                    price: 299.99,
                                    category: 'Electronics',
                                    stock: 20,
                                },
                                {
                                    name: 'Robot Vacuum',
                                    description: 'Automatic vacuum cleaner for effortless cleaning.',
                                    imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80',
                                    price: 199.99,
                                    category: 'Home',
                                    stock: 15,
                                },
                                {
                                    name: 'Fitness Tracker',
                                    description: 'Monitor your health and activity 24/7.',
                                    imageUrl: 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=400&q=80',
                                    price: 79.99,
                                    category: 'Wearables',
                                    stock: 60,
                                },
                                {
                                    name: 'Smart Home Hub',
                                    description: 'Control all your smart devices from one place.',
                                    imageUrl: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=400&q=80',
                                    price: 129.99,
                                    category: 'Home',
                                    stock: 25,
                                },
                                {
                                    name: 'Noise Cancelling Earbuds',
                                    description: 'Compact earbuds with active noise cancellation.',
                                    imageUrl: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=400&q=80',
                                    price: 89.99,
                                    category: 'Audio',
                                    stock: 35,
                                },
                                {
                                    name: 'Smart Light Bulb',
                                    description: 'Energy-efficient LED bulb with app control.',
                                    imageUrl: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
                                    price: 19.99,
                                    category: 'Home',
                                    stock: 100,
                                },
                                {
                                    name: 'Wireless Charger',
                                    description: 'Fast wireless charging pad for all devices.',
                                    imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80',
                                    price: 29.99,
                                    category: 'Electronics',
                                    stock: 80,
                                },
                                {
                                    name: 'Portable Gaming Console',
                                    description: 'Play your favorite games anywhere with this portable console.',
                                    imageUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=400&q=80',
                                    price: 249.99,
                                    category: 'Electronics',
                                    stock: 40,
                                },
                                {
                                    name: 'Smart Glasses',
                                    description: 'Augmented reality smart glasses for hands-free information.',
                                    imageUrl: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
                                    price: 199.99,
                                    category: 'Wearables',
                                    stock: 25,
                                },
                                {
                                    name: 'Wireless Earbuds',
                                    description: 'True wireless earbuds with long battery life and great sound.',
                                    imageUrl: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=400&q=80',
                                    price: 89.99,
                                    category: 'Audio',
                                    stock: 50,
                                },
                            ],
                        })];
                case 2:
                    _a.sent();
                    console.log('Seeded products!');
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error(e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
