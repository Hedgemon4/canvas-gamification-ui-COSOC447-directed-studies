import {Component, Input} from '@angular/core'
import {Course, STATUS, User} from "@app/_models"
import {AuthenticationService} from "@app/_services/api/authentication"
import {CourseService} from "@app/course/_services/course.service"
import {ActivatedRoute} from "@angular/router"

@Component({
    selector: 'app-course-island',
    templateUrl: './course-island.component.html',
    styleUrls: ['./course-island.component.scss']
})
export class CourseIslandComponent {
    @Input() course: Course
    @Input() hasViewPermission: boolean
    @Input() skeleton = false
    user: User
    readonly STATUS = STATUS
    currentDate = new Date()
    endDate: Date

    constructor(
        private authenticationService: AuthenticationService
    ) {
        this.authenticationService.currentUser.subscribe(user => this.user = user)
    }

    ngOnInit(): void {
        this.endDate = new Date(this.course.end_date)
    }


}
