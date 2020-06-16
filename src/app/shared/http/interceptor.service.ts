import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {HttpProgressState} from './http-progress-state';
import {delay, finalize, retryWhen, take, tap} from 'rxjs/operators';
import {HttpStateService} from './http-state.service';

@Injectable({
    providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

    private exceptions: string[] = [

    ];

    constructor(
        private httpStateService: HttpStateService) {

    }

    /**
     * Intercepts all requests
     * - in case of an error (network errors included) it repeats a request 3 times
     * - all other error can be handled an error specific case
     * and redirects into specific error pages if necessary
     *
     * There is an exception list for specific URL patterns that we don't want the application to act
     * automatically
     *
     * The interceptor also reports back to the httpStateService when a certain requests started and ended
     */
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        if (!this.exceptions.every((term: string) => request.url.indexOf(term) === -1)) {
            return next.handle(request).pipe(tap((response: any) => {},
                (error) => {}));
        }

        this.httpStateService.state.next({
            url: request.url,
            state: HttpProgressState.start
        });

        return next.handle(request).pipe(retryWhen(
            error => {
                return error.pipe(take(3), delay(1500),
                    tap((response: any) => {
                        // ...logic based on response type
                        // i.e redirect on 403
                        // or feed the error on a toaster etc
                    })
                );
            }
        ), finalize(() => {
            this.httpStateService.state.next({
                url: request.url,
                state: HttpProgressState.end
            });
        }));
    }
}