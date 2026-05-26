import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

export default function App() {
  const [data, setData] = useState(null);
  const [filtros, setFiltros] = useState({ ciudad: '', categoria: '', fecha: '', metodopago: '' });

  const fetchDashboardData = async () => {
    const params = new URLSearchParams(filtros).toString();
    const response = await axios.get(`http://localhost:3000/api/dashboard?${params}`);
    setData(response.data);
  };

  useEffect(() => {
    fetchDashboardData();
  }, [filtros]);

  const handleCargaMasiva = async () => {
    alert('Iniciando proceso de carga. Por favor espera...');
    const response = await axios.post('http://localhost:3000/api/cargar-datos');
    alert(response.data.message);
    fetchDashboardData();
  };

  if (!data) return <div className="p-5">Cargando Dashboard...</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f6f9' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2>Dashboard de Rendimiento Analytics - Taller 3</h2>
        <button onClick={handleCargaMasiva} style={{ padding: '10px 20px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Cargar CSV de prueba
        </button>
      </header>

      {/* --- FILTROS DINÁMICOS --- */}
      <section style={{ display: 'flex', gap: '15px', marginBottom: '20px', backgroundColor: '#fff', padding: '15px', borderRadius: '8px' }}>
        <input type="text" placeholder="Ciudad" onChange={(e) => setFiltros({ ...filtros, ciudad: e.target.value })} style={{ padding: '8px' }} />
        <input type="text" placeholder="Categoría" onChange={(e) => setFiltros({ ...filtros, categoria: e.target.value })} style={{ padding: '8px' }} />
        <input type="date" onChange={(e) => setFiltros({ ...filtros, fecha: e.target.value })} style={{ padding: '8px' }} />
        <input type="text" placeholder="Método de Pago" onChange={(e) => setFiltros({ ...filtros, metodopago: e.target.value })} style={{ padding: '8px' }} />
      </section>

      {/* --- SECCIÓN KPIs --- */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '30px' }}>
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h4>Total de Ventas</h4>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#007bff' }}>${parseFloat(data.kpis?.total_ventas || 0).toLocaleString()}</p>
        </div>
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h4>Promedio de Gasto</h4>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>${parseFloat(data.kpis?.promedio_gasto || 0).toFixed(2)}</p>
        </div>
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h4>Top Categoría</h4>
          <p style={{ fontSize: '20px', fontWeight: 'bold' }}>{data.kpis?.categoria_mas_vendida || 'N/A'}</p>
        </div>
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h4>Producto Más Vendido</h4>
          <p style={{ fontSize: '18px', fontWeight: 'bold' }}>{data.kpis?.producto_mas_vendido || 'N/A'}</p>
        </div>
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h4>Ciudad Líder</h4>
          <p style={{ fontSize: '20px', fontWeight: 'bold' }}>{data.kpis?.ciudad_mas_compras || 'N/A'}</p>
        </div>
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h4>Método de Pago Preferido</h4>
          <p style={{ fontSize: '20px', fontWeight: 'bold' }}>{data.kpis?.pago_mas_utilizado || 'N/A'}</p>
        </div>
      </section>

      {/* --- SECCIÓN VISUALIZACIONES OBLIGATORIAS --- */}
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px' }}>
          <h3>Ventas por Categoría</h3>
          <BarChart width={500} height={300} data={data.ventasPorCategoria}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="categoria" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total" fill="#8884d8" />
          </BarChart>
        </div>

        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px' }}>
          <h3>Compras por Ciudad</h3>
          <PieChart width={500} height={300}>
            <Pie data={data.comprasPorCiudad} dataKey="total" nameKey="ciudad" cx="50%" cy="50%" outerRadius={100} label>
              {data.comprasPorCiudad.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>

        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', gridColumn: 'span 2' }}>
          <h3>Tendencia de Ventas por Fecha</h3>
          <LineChart width={1050} height={300} data={data.ventasPorFecha}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="fecha" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="total" stroke="#007bff" />
          </LineChart>
        </div>
      </section>
    </div>
  );
}