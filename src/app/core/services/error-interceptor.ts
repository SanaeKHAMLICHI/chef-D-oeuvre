import {inject, Injectable} from "@angular/core";
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
import {AuthStore} from "../../features/components/auth/store/auth.store";
import {Router} from "@angular/router";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  authStore= inject(AuthStore);
  router =inject(Router);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(error => {
        // Gérer les erreurs 401 (non autorisé)
        if (error.status === 401) {
          this.authStore.logout()
          this.router.navigateByUrl('/')
        }
        return throwError(() => error);
      })
    );
  }
}
