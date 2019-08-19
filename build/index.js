"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mockvif_1 = require("./mockvif");
var PORT = process.env["MOCKVIF_PORT"] ? parseInt(process.env["MOCKVIF_PORT"], 10) : 3333;
mockvif_1.mockvif(PORT).subscribe();
