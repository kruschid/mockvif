import { mockvif } from "./mockvif";

const PORT: number = process.env["MOCKVIF_PORT"] ? parseInt(process.env["MOCKVIF_PORT"]!, 10) : 3333;

mockvif(PORT).subscribe();
