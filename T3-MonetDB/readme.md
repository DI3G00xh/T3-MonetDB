# Despliegue Taller 3


# Dashboard Analítico de Rendimiento - Taller 3

Este proyecto es una aplicación web full-stack diseñada para la ingesta, procesamiento masivo y análisis estadístico en tiempo real de **5,000,000 de registros de compras**. Aprovecha el motor relacional orientado a columnas de **MonetDB** para ofrecer respuestas analíticas inmediatas (OLAP) ante consultas dinámicas complejas.

---

## Arquitectura Tecnológica
* **Frontend:** React (Vite) + Recharts para visualizaciones dinámicas reactivas.
* **Backend:** NestJS (TypeScript) como API REST analítica y modular.
* **Base de Datos:** MonetDB (Desplegado en un contenedor Docker).
* **Infraestructura:** Docker Compose para el aislamiento y portabilidad del entorno.

---

## Arquitectura Estructural del Proyecto

A continuación se detalla la jerarquía y el flujo de comunicación de los componentes basándose en la disposición del directorio raíz de trabajo:

```text
T3-MonetDB/
├── docker-compose.yml      <-- Orquestación del contenedor analítico
├── data/                   <-- Carpeta local compartida 
│   └── compras.csv         <-- Dataset (5,000,000 de registros)
├── backend/                <-- API REST NestJS 
└── frontend/               <-- Dashboard interactivo SPA en React + Vite
```

## Requisitos Previos
Tener instalado:
* [Node.js](https://nodejs.org/) (Versión 18 o superior)
* [Docker Desktop](https://www.docker.com/products/docker-desktop/)

---

## Pasos para Montar el Proyecto

### 1. Preparar el Dataset 
1. Crear una carpeta llamada \`data\` en la raíz de este proyecto.
2. Guardar el archivo del dataset entregado dentro de esa carpeta con el nombre exacto de \`compras.csv\`.
> *Nota: La ruta relativa final obligatoria debe ser \`./data/compras.csv\`.*

### 2. Levantar la Base de Datos con Docker
Desde la terminal en la raíz del proyecto, ejecutar el siguiente comando para descargar e iniciar el contenedor de MonetDB en segundo plano:
```bash
docker-compose up -d
```

### 3. Crear el Esquema de Tabla Columnar
Entra a la terminal (cd T3-MonetDB) y ejecutar:
```bash
docker exec -it taller3_database mclient -u monetdb -d taller_db
```
*Cuando solicite el usuario, ingresa: \`monetdb\`.*
*Cuando solicite la contraseña, ingresa: \`admin_pass\`.*

Una vez dentro del cliente SQL, pegar el siguiente script para estructurar la tabla analítica:
```sql
CREATE TABLE compras (
    usuarioid INT,
    edad INT,
    ciudad VARCHAR(100),
    producto VARCHAR(255),
    categoria VARCHAR(100),
    precio DECIMAL(10,2),
    fecha DATE,
    hora TIME,
    metodopago VARCHAR(50)
);
```
*Para salir de la consola de MonetDB, escribir \`\\q\` y presionar Enter.*

### 4. Levantar el Backend (NestJS)
1. Abrir una nueva terminal y navegar a la carpeta del servidor:
   ```bash
   cd backend
   ```
2. Instalar las dependencias del proyecto:
   ```bash
   npm install
   ```
3. Iniciar el servidor de desarrollo:
   ```bash
   npm run start:dev
   ```
> El backend estará disponible en: \`http://localhost:3000\`

### 5. Levantar el Frontend (React)
1. Abrir una nueva terminal y navegar a la carpeta de la interfaz:
   ```bash
   cd frontend
   ```
2. Instalar las dependencias del proyecto:
   ```bash
   npm install
   ```
3. Iniciar la aplicación web:
   ```bash
   npm run dev
   ```
> El dashboard interactivo se abrirá en: \`http://localhost:5173\`

---

## Instrucciones de Uso de la Aplicación

1. **Puesta en Marcha (Ingesta):** Al ingresar al Dashboard web por primera vez, verás que los contadores están en cero. Haz clic en el botón verde **"Cargar CSV (5 Millones de Filas)"**. El backend ejecutará la instrucción masiva y poblará la base de datos en pocos segundos utilizando el flujo nativo de MonetDB.
2. **Uso de KPIs Principales:** El sistema calculará automáticamente las métricas obligatorias:
   * Total de ventas históricas y promedio de gasto por usuario.
   * Categoría y producto más vendidos del mercado.
   * Ciudad líder en compras y método de pago preferido.
3. **Filtros Dinámicos e Interactividad:** Utiliza la barra superior de filtros para segmentar manualmente los datos por **Ciudad, Categoría, Fecha o Método de pago**. El dashboard reaccionará de forma reactiva actualizando todas las gráficas analíticas en milisegundos gracias al escaneo selectivo de vectores columnares.
```
