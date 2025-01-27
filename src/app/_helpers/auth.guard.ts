﻿import {Injectable} from '@angular/core'
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router'

import {AuthenticationService} from '@app/_services/api/authentication'
import {User} from '@app/_models'

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
    constructor(private router: Router, private authenticationService: AuthenticationService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const currentUser: User = this.authenticationService.currentUserValue
        if (currentUser) {
            // logged in so return true
            return true
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/accounts/login'], {queryParams: {returnUrl: state.url}}).then()
        return false
    }
}
