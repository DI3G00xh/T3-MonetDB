import { OnModuleInit } from '@nestjs/common';
export declare class DatabaseService implements OnModuleInit {
    private conn;
    constructor();
    onModuleInit(): Promise<void>;
    cargarCsvMasivo(): Promise<{
        message: string;
    }>;
    obtenerDatosDashboard(filtros: any): Promise<{
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
