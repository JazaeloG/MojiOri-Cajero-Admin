import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { BarcodeFormat } from '@zxing/library';
import { CanjearCodigoService } from 'src/app/services/canjear-codigo.service';

interface OrderItem {
  id: number;
  nombre: string;
  cantidad: number;
}

@Component({
  selector: 'app-canjear-codigo',
  templateUrl: './canjear-codigo.page.html',
  styleUrls: ['./canjear-codigo.page.scss'],
})
export class CanjearCodigoPage implements OnInit {

  orderItems: OrderItem[] = [];
  totalPoints = 0;
  isScanning = false;
  scannerEnabled = true;
  currentDevice: any;
  ordenId: number| null = null;
  public BarcodeFormat = BarcodeFormat; 

  constructor(
    private canjearService: CanjearCodigoService,
    private toastController: ToastController
  ) { }

  ngOnInit() {
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      color: color, 
      position: 'top', 
      cssClass: 'custom-toast'
    });
    toast.present();
  }

  scanQR() {
    this.isScanning = !this.isScanning;
  }

  onScanSuccess(scanResult: string) {
    this.canjearService.descifrarCodigo(scanResult).subscribe(
      (response: any) => {
        if (response && response.ordenId) {
          this.ordenId = response.ordenId;
          this.isScanning = false;
          if (this.ordenId !== null) {
            this.obtenerOrdenPorId(this.ordenId);
          } else {
            this.presentToast("Orden ID no válido.", "danger");
          }
          this.presentToast("QR procesado correctamente.", "success");
        } else {
          this.presentToast("Codigo Invalido.", "danger");
        }
      },
      (error) => {
        this.presentToast('Error al descifrar el código', 'danger');
        console.error('Error al descifrar el código:', error);
      }
    );
  }

  obtenerOrdenPorId(ordenId: number) {
    this.canjearService.obtenerOrden(ordenId).subscribe(
      (orden: any) => {
        console.log('Orden obtenida:', orden);
        // Verificar si detalles_Orden está definido y es un arreglo
        if (orden.detalles_Orden && Array.isArray(orden.detalles_Orden)) {
          this.totalPoints = orden.orden_Puntos_Canjeados;
          this.mapOrderItems(orden.detalles_Orden);
        } else {
          this.presentToast("No se encontraron detalles en la orden.", "warning");
        }
        this.presentToast("Orden obtenida correctamente.", "success");
      },
      (error) => {
        this.presentToast("Error al obtener la orden.", "danger");
      }
    );
  }
  
  mapOrderItems(detallesOrden: any[]) {
    this.orderItems = detallesOrden.map(detalle => ({
      id: detalle.producto.id_Producto,
      nombre: detalle.producto.producto_Nombre,
      cantidad: detalle.detalleOrden_Cantidad_Producto,
    }));
  }

  canjearOrden() {
    if (this.orderItems.length === 0) {
      this.presentToast('No hay productos en la orden para canjear.', 'warning');
      return;
    }
  
    if (!this.totalPoints || this.totalPoints <= 0) {
      this.presentToast('La orden no tiene puntos válidos para canjear.', 'danger');
      return;
    }
  
    this.canjearService.obtenerOrden(this.ordenId!).subscribe(
      (orden: any) => {
        if (orden.orden_Estado === 'DISPONIBLE' && this.ordenId !== null) { 
          this.despacharOrden(this.ordenId);
        } else {
          this.orderItems = [];
          this.totalPoints = 0;
          this.presentToast('La orden no está disponible para canjear.', 'danger');
        }
      },
      (error) => {
        this.presentToast('Error al verificar el estado de la orden.', 'danger');
        console.error('Error al verificar el estado de la orden:', error);
      }
    );
  }
  
  despacharOrden(ordenId: number) {
    this.canjearService.despacharOrden(ordenId).subscribe(
      (response: any) => {
        this.presentToast('Orden canjeada con éxito.', 'success');
        this.orderItems = [];
        this.totalPoints = 0;
      },
      (error) => {
        this.presentToast('Error al despachar la orden.', 'danger');
        console.error('Error al despachar la orden:', error);
      }
    );
  }
}