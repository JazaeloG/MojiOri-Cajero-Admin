import { Component, HostListener, OnInit } from "@angular/core";
import { VentasService } from "src/app/services/ventas.service";
import { BarcodeFormat } from "@zxing/library";
import { AlertController, ToastController } from "@ionic/angular";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface OrderItem extends Product {
  quantity: number;
}

@Component({
  selector: "app-ventas",
  templateUrl: "./ventas.page.html",
  styleUrls: ["./ventas.page.scss"],
})
export class VentasPage implements OnInit {
  currentDevice: MediaDeviceInfo | null = null;
  scannerEnabled: boolean = true;
  public BarcodeFormat = BarcodeFormat; 
  isVertical = window.innerHeight > window.innerWidth;
  isScanning = false;  
  inputNumber: string = "";
  products: Product[] =[];
  orderItems: OrderItem[] = [];
  totalAmount = 0;
  

  constructor(private ventasService: VentasService, private alertController: AlertController,private toastController: ToastController) { }

  ngOnInit() {
    this.loadProducts();
    this.calculateTotal();
  }

  loadProducts() {
    this.ventasService.obtenerProductos().subscribe(
      (response) => {
        this.products = response.map(product => ({
          id: product.id_Producto,
          name: product.producto_Nombre,
          price: parseFloat(product.producto_Precio),
          image: `https://mojiorizaba.com/${product.imagenes[product.imagenes.length-1]?.imagenProducto_Url}`
        }));
      },
      (error) => {
        console.error("Error al obtener productos:", error);
      }
    );
  }

  @HostListener("window:resize")
  onResize() {
    this.isVertical = window.innerHeight > window.innerWidth;
  }

  scanQR() {
    this.isScanning = !this.isScanning
  }

  onScanSuccess(scanResult: string) {
    this.ventasService.descifrarCodigo(scanResult).subscribe(
      (response: any) => {
        if (response && response.numeroDesencriptado) {
          this.inputNumber = response.numeroDesencriptado; 
          this.isScanning = false;
          this.presentToast("Código QR descifrado correctamente", "success");
        } else {
          this.presentToast("Error al descifrar QR. Intentelo nuevamente", "danger");
        }
      },
      (error) => {
        this.presentToast("Error al descifrar QR. Intentelo nuevamente", "danger");
      }
    );
  }

  addToOrder(product: Product) {
    const existingItem = this.orderItems.find(item => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.orderItems.push({ ...product, quantity: 1 });
    }
    this.calculateTotal();
  }

  increaseQuantity(product: Product) {
    const existingItem = this.orderItems.find(item => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += 1;
      this.calculateTotal();
    }
  }

  decreaseQuantity(product: Product) {
    const existingItem = this.orderItems.find(item => item.id === product.id);
    if (existingItem && existingItem.quantity > 1) {
      existingItem.quantity -= 1;
      this.calculateTotal();
    }
  }

  removeFromOrder(product: Product) {
    this.orderItems = this.orderItems.filter(item => item.id !== product.id);
    this.calculateTotal();
  }

  getProductQuantity(product: Product): number {
    const existingItem = this.orderItems.find(item => item.id === product.id);
    return existingItem ? existingItem.quantity : 0;
  }

  isProductInOrder(product: Product): boolean {
    return this.orderItems.some(item => item.id === product.id);
  }

  calculateTotal() {
    this.totalAmount = this.orderItems.reduce((total, item) => total + item.price * item.quantity, 0);
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

  placeOrder() {
    if (this.inputNumber.length !== 10 || !/^\d{10}$/.test(this.inputNumber)) {
      this.presentToast("Número inválido\nEl número de teléfono debe tener 10 dígitos.", "danger");
      return; 
    }
  
    if (this.orderItems.length === 0) {
      this.presentToast("Carrito vacío\nDebe agregar al menos un producto al carrito para realizar la venta.", "danger");
      return;
    }

    const venta = {
      numero_Telefono: this.inputNumber,
      venta_Monto_Total: this.totalAmount,
      venta_Sub_Total: this.totalAmount,
      detalles_Venta: this.orderItems.map(item => ({
        id_Producto: item.id,
        detalleVenta_Cantidad_Producto: item.quantity
      }))
    };
  
    this.ventasService.realizarVenta(venta).subscribe(
      (response) => {
        this.orderItems = [];
        this.calculateTotal();
        this.showVentaRealizadaAlert();
      },
      (error) => {
        console.error("Error al realizar la venta:", error);
        if (error.status === 500 && error.error.message.includes("número de teléfono proporcionado no existe")) {
          this.showCreateAccountDialog();
        }
      }
    );
  }

  async showVentaRealizadaAlert() {
    const alert = await this.alertController.create({
      header: "Éxito",
      message: "Venta realizada",
      buttons: [],
      cssClass: 'venta-realizada-alert', 
    });
  
    await alert.present();
  
    setTimeout(() => {
      alert.dismiss();
    }, 1000);
  }
  

  async showCreateAccountDialog() {
    const alert = await this.alertController.create({
      header: "Número no encontrado",
      message: "El número de teléfono no existe. ¿Desea crear una cuenta genérica o cancelar la venta?",
      buttons: [
        {
          text: "Cancelar Venta",
          role: "cancel",
          handler: () => {
          }
        },
        {
          text: "Crear Cuenta Genérica",
          handler: () => {
            this.crearCuentaGenerica();
          }
        }
      ]
    });
  
    await alert.present();
  }

  crearCuentaGenerica() {
    const cuentaGenerica = {
      usuario_Usuario: this.generarNicknameAleatorio(),
      usuario_FechaNacimiento: this.obtenerFechaActual(),
      cuenta_Telefono: this.inputNumber,
      cuenta_Contrasena: this.generarContrasena()
    };
  
    this.ventasService.crearCuentaGenerica(cuentaGenerica).subscribe(
      (response) => {
        this.placeOrder();
      },
      (error) => {
        this.presentToast("Error al crear la cuenta genérica", "danger");
      }
    );
  }

  obtenerFechaActual(): string {
    const hoy = new Date();
    const dia = String(hoy.getDate()).padStart(2, "0");
    const mes = String(hoy.getMonth() + 1).padStart(2, "0"); 
    const anio = hoy.getFullYear();
  
    return `${anio}/${mes}/${dia}`;
  }

  generarContrasena(): string {
    const longitud = 8;
    const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let contrasena = "";
    for (let i = 0; i < longitud; i++) {
      const indice = Math.floor(Math.random() * caracteres.length);
      contrasena += caracteres.charAt(indice);
    }
    return contrasena;
  }

  generarNicknameAleatorio(): string {
    const palabras = ["Super", "Estrella", "Fenix", "Guerrero", "Ninja", "Tornado", "Explorador", "Astro", "Cometa", "Rayo"];
    const sufijos = ["Heroe", "Misterio", "Viajero", "Fantasma", "Titan", "Guardia", "Leyenda", "Luchador"];
    const numeroAleatorio = Math.floor(1000 + Math.random() * 9000);
  
    const palabraAleatoria = palabras[Math.floor(Math.random() * palabras.length)];
    const sufijoAleatorio = sufijos[Math.floor(Math.random() * sufijos.length)];
  
    return `${palabraAleatoria}${sufijoAleatorio}${numeroAleatorio}`;
  }
  
}