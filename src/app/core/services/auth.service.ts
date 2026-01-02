import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

export interface User {
    id: number;
    email: string;
    firstname: string;
    lastname: string;
    // Add other fields as needed
}

export interface AuthResponse {
    token: string;
    user: User;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    // Updated API URL to use 127.0.0.1 for better performance on Windows
    private apiUrl = 'http://127.0.0.1/sae301/api/auth';

    private currentUserSubject = new BehaviorSubject<User | null>(null);
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(private http: HttpClient, private router: Router) {
        this.loadUserFromStorage();
    }

    private loadUserFromStorage() {
        const user = localStorage.getItem('currentUser');
        if (user) {
            this.currentUserSubject.next(JSON.parse(user));
        }
    }

    login(email: string, password: string): Observable<AuthResponse> {
        // REAL API CALL (Server is offline)
        // return this.http.post<AuthResponse>(`${this.apiUrl}/login.php`, { email, password })
        //     .pipe(tap(response => this.handleAuth(response)));

        // MOCK LOGIN for demonstration if API is not running
        return new Observable(observer => {
            setTimeout(() => {
                const mockResponse: AuthResponse = {
                    token: 'fake-jwt-token',
                    user: { id: 1, email, firstname: 'John', lastname: 'Doe' }
                };
                this.handleAuth(mockResponse);
                observer.next(mockResponse);
                observer.complete();
            }, 1000);
        });
    }

    register(data: any): Observable<AuthResponse> {
        // REAL API CALL (Server is offline)
        // return this.http.post<AuthResponse>(`${this.apiUrl}/register.php`, data)
        //     .pipe(tap(response => this.handleAuth(response)));

        // MOCK REGISTER
        return new Observable(observer => {
            setTimeout(() => {
                const mockResponse: AuthResponse = {
                    token: 'fake-jwt-token',
                    user: { id: 1, ...data }
                };
                this.handleAuth(mockResponse);
                observer.next(mockResponse);
                observer.complete();
            }, 1000);
        });
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
        this.router.navigate(['/login']);
    }

    private handleAuth(response: AuthResponse) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        this.currentUserSubject.next(response.user);
    }

    get isLoggedIn(): boolean {
        return !!this.currentUserSubject.value;
    }
}
