import { Controller, Get, Post, Query } from '@nestjs/common';
import { DatabaseService } from './app.service';

@Controller('api')
export class AppController {
  constructor(private readonly dbService: DatabaseService) {}

  @Post('cargar-datos')
  async cargarDatos() {
    return await this.dbService.cargarCsvMasivo();
  }

  @Get('dashboard')
  async getDashboardData(
    @Query('ciudad') ciudad?: string,
    @Query('categoria') categoria?: string,
    @Query('fecha') fecha?: string,
    @Query('metodopago') metodopago?: string,
  ) {
    return await this.dbService.obtenerDatosDashboard({ ciudad, categoria, fecha, metodopago });
  }
}