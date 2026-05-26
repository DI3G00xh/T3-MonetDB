import { DatabaseService } from './app.service';
export declare class AppController {
    private readonly dbService;
    constructor(dbService: DatabaseService);
    cargarDatos(): Promise<{
        message: string;
    }>;
    getDashboardData(ciudad?: string, categoria?: string, fecha?: string, metodopago?: string): Promise<{
        kpis: {
            total_ventas: any;
            promedio_gasto: any;
            categoria_mas_vendida: any;
            producto_mas_vendido: any;
            ciudad_mas_compras: any;
            pago_mas_utilizado: any;
        };
        ventasPorCategoria: any;
        comprasPorCiudad: any;
        ventasPorFecha: any;
    }>;
}
