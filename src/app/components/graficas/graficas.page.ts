import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Chart, ChartType } from 'chart.js/auto';
import { EstadisticasService } from 'src/app/services/estadisticas.service';

@Component({
  selector: 'app-graficas',
  templateUrl: './graficas.page.html',
  styleUrls: ['./graficas.page.scss'],
})
export class GraficasPage implements OnInit {

  public chart: Chart | undefined;  // Gráfica de productos más vendidos
  public chart2: Chart | undefined; // Gráfica de comparación de ventas
  public mesSeleccionado: string = '2024-12'; // Mes inicial seleccionado (formato 'YYYY-MM')

  public ticketInicio: string = '2024-12-01';
  public ticketFin: string = '2024-12-31';

  public productosInicio: string = '2024-12-01';
  public productosFin: string = '2024-12-31';

  public comparacionInicio1: string = '2024-12-01';
  public comparacionFin1: string = '2024-12-31';
  public comparacionInicio2: string = '2024-11-01';
  public comparacionFin2: string = '2024-11-30';

  // Datos para ticket promedio
  public totalVentas: number | null = null;
  public totalMontoVentas: number | null = null;
  public ticketPromedio: number | null = null;
  constructor(private ventasService: EstadisticasService) {}

  ngOnInit(): void {
    this.actualizarGraficas();
  }


  // Método para actualizar las gráficas según las fechas seleccionadas
  actualizarGraficas() {
    this.actualizarTicketPromedio();
    this.actualizarProductosMasVendidos();
    this.actualizarComparacionVentas();
  }
  actualizarTicketPromedio() {
    this.ventasService.getTicketPromedio(this.ticketInicio, this.ticketFin).subscribe({
      next: (data: any) => {
        if (data) {
          this.totalVentas = data.totalVentas;
          this.totalMontoVentas = data.totalMontoVentas;
          this.ticketPromedio = data.ticketPromedio;
        } else {
          console.error('No se recibieron los datos completos para ticket promedio');
        }
      },
      error: (err) => {
        console.error('Error al obtener los datos de ticket promedio:', err);
      },
    });
  }
    // Actualiza los datos de Productos Más Vendidos
    actualizarProductosMasVendidos() {
      this.cargarProductosMasVendidos(this.productosInicio, this.productosFin);
    }

  // Método para cargar los productos más vendidos
  cargarProductosMasVendidos(fechaInicio: string, fechaFin: string) {
    const limite = 5; // Máximo número de productos a mostrar
    this.ventasService.getProductosMasVendidos(fechaInicio, fechaFin, limite).subscribe({
      next: (data: any[]) => {
        const labels = data.map(item => item.nombre_Producto);
        const valores = data.map(item => item.cantidad_Vendida);
        this.crearGraficaProductosMasVendidos(labels, valores);
      },
      error: (err) => {
        console.error('Error al obtener los datos de productos más vendidos:', err);
      },
    });
  }
  // Crear la gráfica de productos más vendidos
  crearGraficaProductosMasVendidos(labels: string[], valores: number[]) {
    const data = {
      labels: labels,
      datasets: [
        {
          label: 'Productos Más Vendidos',
          data: valores,
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(255, 205, 86, 0.5)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(255, 205, 86, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };

    // Si ya existe una gráfica, destruirla antes de crear una nueva
    if (this.chart) {
      this.chart.destroy();
    }

    // Crear la gráfica
    this.chart = new Chart('chart', {
      type: 'bar' as ChartType, // Tipo de gráfica
      data: data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
        },
      },
    });
  }

  actualizarComparacionVentas() {
    this.cargarComparacionVentas(this.comparacionInicio1, this.comparacionFin1, this.comparacionInicio2, this.comparacionFin2);
  }
  // Método para cargar la comparación de ventas entre dos periodos
  cargarComparacionVentas(fechaInicioPeriodo1: string, fechaFinPeriodo1: string, fechaInicioPeriodo2: string, fechaFinPeriodo2: string) {
    const params = {
      fechaInicioPeriodo1,
      fechaFinPeriodo1,
      fechaInicioPeriodo2,
      fechaFinPeriodo2,
      tipoAgrupacion: 'semanal',
    };

    this.ventasService.getComparacionVentas(params).subscribe({
      next: (data: any) => {
        const periodo1 = data.periodo1 || [0];
        const periodo2 = data.periodo2 || [0];
        const labels = ['Periodo 1', 'Periodo 2'];
        this.crearGraficaComparacion(labels, [periodo1, periodo2]);
      },
      error: (err) => {
        console.error('Error al obtener la comparación de ventas:', err);
      },
    });
  }

  // Crear la gráfica de comparación de ventas
  crearGraficaComparacion(labels: string[], ventas: number[]) {
    const data = {
      labels: labels,
      datasets: [
        {
          label: 'Comparación de Ventas', // Etiqueta para la comparación de ventas
          data: ventas,
          backgroundColor: ['rgba(75, 192, 192, 0.5)', 'rgba(255, 99, 132, 0.5)'], // Color para las barras del primer periodo
          borderColor: ['rgba(75, 192, 192, 1)','rgba(255, 99, 132, 1)'],
          borderWidth: 1,
        },
      ],
    };

    // Si ya existe una gráfica, destruirla antes de crear una nueva
    if (this.chart2) {
      this.chart2.destroy();
    }

    // Crear la gráfica
    this.chart2 = new Chart('chart2', {
      type: 'bar' as ChartType,
      data: data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
        },
      },
    });
  }


}
