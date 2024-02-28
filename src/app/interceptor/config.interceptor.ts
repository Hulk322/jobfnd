import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ErrorService } from 'src/Services/shared/error.service';
import {
    HttpInterceptor,
    HttpRequest,
    HttpResponse,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
    constructor(public router:Router, private _ErrorService: ErrorService) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token: string = localStorage.getItem('token');

        if (token) {
            request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + token) });
        }

        // if (!request.headers.has('Content-Type')) {
        //     request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
        // }

        // request = request.clone({ headers: request.headers.set('Accept', 'application/json') });

         return next.handle(request).pipe(catchError(err => {
             console.log('1');
            if (err.status === 4001) {
                console.log('a');
                // auto logout if 401 response returned from api
                this._ErrorService.flashMessage({ 'type': 'error', 'messages': 'Your session has expired. Please, login again.' });
                localStorage.clear();
                this.router.navigateByUrl('/login');
                //location.reload(true);
            }

            //const error = err.error.message || err.statusText;
            return throwError(err);
        }))
    }
}