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

  // Datos para ticket promedio
  public totalVentas: number | null = null;
  public totalMontoVentas: number | null = null;
  public ticketPromedio: number | null = null;
  public mensajeError: string | null = null;
  public startOfMonth: string;
  public startOfYear: string;
  public today: string;

  public selectedSegment: string = 'todas';
  public fechaInicio: string;
  public fechaFin: string;
  public fechaInicioPrevio: string = '';
  public fechaFinPrevio: string = '';

  diaAnterior: string = '';
  mesAnterior!: string;
  añoAnterior!: string;

  selectedMonth: number;
  selectedYear: number;
  months = [
    { name: 'Enero', value: 0 },
    { name: 'Febrero', value: 1 },
    { name: 'Marzo', value: 2 },
    { name: 'Abril', value: 3 },
    { name: 'Mayo', value: 4 },
    { name: 'Junio', value: 5 },
    { name: 'Julio', value: 6 },
    { name: 'Agosto', value: 7 },
    { name: 'Septiembre', value: 8 },
    { name: 'Octubre', value: 9 },
    { name: 'Noviembre', value: 10 },
    { name: 'Diciembre', value: 11 }
  ];

  availableYears: number[] = [];

  constructor(private ventasService: EstadisticasService) {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    this.today = now.toISOString().split('T')[0];

    this.startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    this.startOfYear = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0];

    this.fechaInicio = this.today;
    this.fechaFin = this.today;

    this.selectedMonth = now.getMonth();
    this.selectedYear = now.getFullYear();

    for (let i = this.selectedYear - 10; i <= this.selectedYear; i++) {
      this.availableYears.push(i);
    }
  }

  private formatDate(date: Date): string {
    return date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
  }

  getPreviousDate(dateString: string): string {
    const date = new Date(dateString);
    date.setDate(date.getDate() - 1);
    return this.formatDate(date);
  }

  getPreviousMonth(dateString: string): string {
    const date = new Date(dateString);
    date.setMonth(date.getMonth() - 1);
    return this.formatDate(date);
  }

  getPreviousYear(dateString: string): string {
    const date = new Date(dateString);
    date.setFullYear(date.getFullYear() - 1);
    return this.formatDate(date);
  }

  onSegmentChanged(event: any) {
    this.selectedSegment = event.detail.value;
    
    switch (this.selectedSegment) {
      case 'dia':
        this.fechaInicio = this.today;
        this.fechaFin = this.today;
        this.fechaInicioPrevio = this.getPreviousDate(this.today);
        this.fechaFinPrevio = this.fechaInicioPrevio;
        break;
      case 'mes':
        this.onMonthChange({ detail: { value: this.selectedMonth } });
        break;
      case 'año':
        this.onYearChange({ detail: { value: this.selectedYear } });
        break;
    }
    
    this.actualizarGraficas();
  }

  onMonthChange(event: any) {
    this.selectedMonth = event.detail.value;
    const year = this.selectedYear;
    
    this.fechaInicio = new Date(year, this.selectedMonth, 1).toISOString().split('T')[0];
    this.fechaFin = new Date(year, this.selectedMonth + 1, 0).toISOString().split('T')[0];
    
    const prevMonth = new Date(year, this.selectedMonth - 1, 1);
    this.fechaInicioPrevio = this.formatDate(prevMonth);
    this.fechaFinPrevio = new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 0).toISOString().split('T')[0];
    
    this.actualizarGraficas();
  }

  onYearChange(event: any) {
    this.selectedYear = event.detail.value;
    
    this.fechaInicio = new Date(this.selectedYear, 0, 1).toISOString().split('T')[0];
    this.fechaFin = new Date(this.selectedYear, 11, 31).toISOString().split('T')[0];
    
    const prevYear = new Date(this.selectedYear - 1, 0, 1);
    this.fechaInicioPrevio = this.formatDate(prevYear);
    this.fechaFinPrevio = new Date(prevYear.getFullYear(), 11, 31).toISOString().split('T')[0];
    
    this.actualizarGraficas();
  }


  ngOnInit(): void {
    this.actualizarGraficas();
  }


  actualizarGraficas() {
    console.log("Actualizando gráficas con fechas:", this.fechaInicio, this.fechaFin, this.fechaInicioPrevio, this.fechaFinPrevio);

    this.actualizarTicketPromedio();
    this.actualizarProductosMasVendidos();
    this.actualizarComparacionVentas();
  }
  actualizarTicketPromedio() {
    this.ventasService.getTicketPromedio(this.fechaInicio, this.fechaFin).subscribe({
      next: (data: any) => {
        if (data) {
          this.totalVentas = data.totalVentas;
          this.totalMontoVentas = data.totalMontoVentas;
          this.ticketPromedio = data.ticketPromedio;
          this.mensajeError = null;
        } else {
          console.error('No se recibieron los datos completos para ticket promedio');
          this.mensajeError = 'No hay datos disponibles para el periodo seleccionado';
        }
      },
      error: (err) => {
        console.error('Error al obtener los datos de ticket promedio:', err);
        this.mensajeError = 'No hay datos disponibles para el periodo seleccionado';

      },
    });
  }
    actualizarProductosMasVendidos() {
      this.cargarProductosMasVendidos(this.fechaInicio, this.fechaFin);
    }

  // Método para cargar los productos más vendidos
  cargarProductosMasVendidos(fechaInicio: string, fechaFin: string) {
    const limite = 5; // Máximo número de productos a mostrar
    this.ventasService.getProductosMasVendidos(fechaInicio, fechaFin, limite).subscribe({
      next: (data: any[]) => {
        const labels = data.map(item => item.nombre_Producto);
        const valores = data.map(item => item.cantidad_Vendida);
        this.crearGraficaProductosMasVendidos(labels, valores);
        this.mensajeError = null;
      },
      error: (err) => {
        this.mensajeError = 'No hay datos disponibles para el periodo seleccionado';
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
    this.cargarComparacionVentas(this.fechaInicio, this.fechaFin, this.fechaInicioPrevio, this.fechaFinPrevio);
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