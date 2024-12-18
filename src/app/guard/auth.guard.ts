import { Injectable } from '@angular/core';
import { CanActivate, Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: any): boolean {
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('userRole');
    const requiredRole = route.data?.requiredRole; // Extraer el rol requerido de la ruta

    if (!token || (requiredRole && role !== requiredRole)) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}