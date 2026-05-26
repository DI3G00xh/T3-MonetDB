import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DatabaseService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController], // Registramos tu controlador de rutas
  providers: [DatabaseService], // Registramos tu servicio de MonetDB
})
export class AppModule {}