"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseService = void 0;
const common_1 = require("@nestjs/common");
const monetdb_1 = require("monetdb");
let DatabaseService = class DatabaseService {
    conn;
    constructor() {
        this.conn = new monetdb_1.Connection({
            host: 'localhost',
            port: 50000,
            database: 'taller_db',
            username: 'monetdb',
            password: 'admin_pass'
        });
    }
    async onModuleInit() {
        const ready = await this.conn.connect();
        if (ready) {
            console.log('Conectado a MonetDB de manera exitosa.');
        }
        else {
            console.error('Error conectando a MonetDB.');
        }
    }
    async cargarCsvMasivo() {
        const checkData = await this.conn.execute('SELECT COUNT(*) FROM compras;');
        if (checkData?.data?.[0]?.[0] > 0) {
            return { message: 'Los datos ya han sido cargados previamente.' };
        }
        console.log('Iniciando copia masiva de registros en MonetDB...');
        const query = `
      COPY OFFSET 2 INTO compras 
      FROM '/data/compras.csv' 
      USING DELIMITERS ',', E'\\n', '"';
    `;
        await this.conn.execute(query);
        return { message: '5,000,000 de filas importadas con éxito' };
    }
    async obtenerDatosDashboard(filtros) {
        let whereClause = 'WHERE 1=1';
        if (filtros.ciudad)
            whereClause += ` AND ciudad = '${filtros.ciudad}'`;
        if (filtros.categoria)
            whereClause += ` AND categoria = '${filtros.categoria}'`;
        if (filtros.fecha)
            whereClause += ` AND fecha = '${filtros.fecha}'`;
        if (filtros.metodopago)
            whereClause += ` AND metodopago = '${filtros.metodopago}'`;
        const kpisQuery = `SELECT SUM(precio), AVG(precio) FROM compras ${whereClause};`;
        const topCatQuery = `SELECT categoria FROM compras ${whereClause} GROUP BY categoria ORDER BY COUNT(*) DESC LIMIT 1;`;
        const topProdQuery = `SELECT producto FROM compras ${whereClause} GROUP BY producto ORDER BY COUNT(*) DESC LIMIT 1;`;
        const topCiudadQuery = `SELECT ciudad FROM compras ${whereClause} GROUP BY ciudad ORDER BY COUNT(*) DESC LIMIT 1;`;
        const topPagoQuery = `SELECT metodopago FROM compras ${whereClause} GROUP BY metodopago ORDER BY COUNT(*) DESC LIMIT 1;`;
        const catQuery = `SELECT categoria, SUM(precio) FROM compras ${whereClause} GROUP BY categoria;`;
        const ciudadQuery = `SELECT ciudad, COUNT(*) FROM compras ${whereClause} GROUP BY ciudad;`;
        const fechaQuery = `SELECT fecha, SUM(precio) FROM compras ${whereClause} GROUP BY fecha ORDER BY fecha;`;
        const [kpis, topCat, topProd, topCiudad, topPago, catData, ciudadData, fechaData] = await Promise.all([
            this.conn.execute(kpisQuery),
            this.conn.execute(topCatQuery),
            this.conn.execute(topProdQuery),
            this.conn.execute(topCiudadQuery),
            this.conn.execute(topPagoQuery),
            this.conn.execute(catQuery),
            this.conn.execute(ciudadQuery),
            this.conn.execute(fechaQuery)
        ]);
        const mapChartData = (res, key1, key2) => {
            if (!res?.data)
                return [];
            return res.data.map((row) => ({ [key1]: row[0], [key2]: parseFloat(row[1] || 0) }));
        };
        return {
            kpis: {
                total_ventas: kpis?.data?.[0]?.[0] || 0,
                promedio_gasto: kpis?.data?.[0]?.[1] || 0,
                categoria_mas_vendida: topCat?.data?.[0]?.[0] || 'N/A',
                producto_mas_vendido: topProd?.data?.[0]?.[0] || 'N/A',
                ciudad_mas_compras: topCiudad?.data?.[0]?.[0] || 'N/A',
                pago_mas_utilizado: topPago?.data?.[0]?.[0] || 'N/A',
            },
            ventasPorCategoria: mapChartData(catData, 'categoria', 'total'),
            comprasPorCiudad: mapChartData(ciudadData, 'ciudad', 'total'),
            ventasPorFecha: mapChartData(fechaData, 'fecha', 'total')
        };
    }
};
exports.DatabaseService = DatabaseService;
exports.DatabaseService = DatabaseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], DatabaseService);
//# sourceMappingURL=app.service.js.map