import {Component, Input, OnInit} from '@angular/core';
import {DragulaService} from 'ng2-dragula';
import {FormBuilder} from '@angular/forms';
import {MessageService} from '@app/_services/message.service';
import * as indentString from 'indent-string';
import {MESSAGE_TYPES, UQJ} from '@app/_models';
import {SubmissionService} from '@app/_services/api/problem/submission.service';

class ContainerObject {
    constructor(public value: string) {
    }
}

@Component({
    selector: 'app-parsons-view-snippet',
    templateUrl: './parsons-view-snippet.component.html',
    styleUrls: ['./parsons-view-snippet.component.scss']
})
export class ParsonsViewSnippetComponent implements OnInit {
    @Input() uqj: UQJ;
    code = '';
    PARSONS_LINES = 'PARSONS_LINES';
    parsonLines: any[];
    parsonAnswerLines: any[];

    constructor(private submissionService: SubmissionService,
                private dragulaService: DragulaService,
                private formBuilder: FormBuilder,
                private messageService: MessageService) {
    }

    ngOnInit(): void {
        this.parsonLines = [];
        for (const line of this.uqj.rendered_lines) {
            this.parsonLines.push(new ContainerObject(line));
        }
        this.parsonAnswerLines = [];
        this.dragulaService.createGroup(this.PARSONS_LINES, {});

        this.dragulaService.drop().subscribe((value) => {
            this.determineIndents();
            this.removeLeftContainerIndents();
            this.calculateSourceCode();
        });
    }

    determineIndents(): void {
        const tempParsonLines = this.parsonAnswerLines;
        let count = 0;
        tempParsonLines.forEach(line => {
            const tempLine = line.value.trim();
            line.value = tempLine;
            if (tempLine.charAt(tempLine.length - 1) === '{') {
                line.value = indentString(tempLine, count);
                count++;
            } else if (tempLine.charAt(tempLine.length - 1) === '}') {
                count--;
                line.value = indentString(tempLine, count);
            } else if (count > 0) {
                line.value = indentString(tempLine, count);
            }
        });
    }

    removeLeftContainerIndents(): void {
        const tempParsonLines = this.parsonLines;
        tempParsonLines.forEach(line => {
            line.value = line.value.trim();
        });
    }

    calculateSourceCode(): void {
        this.code = '';
        const tempParsonLines = this.parsonAnswerLines;
        tempParsonLines.forEach(line => {
            this.code += line.value + '\n';
        });
    }

    onSubmit() {
        this.submissionService.postQuestionSubmission({question: this.uqj.question.id, solution: this.code})
            .subscribe(response => {
                this.messageService.add(MESSAGE_TYPES.SUCCESS, 'The Question has been Submitted Successfully.');
                window.scroll(0, 0);
            }, error => {
                this.messageService.add(MESSAGE_TYPES.DANGER, error.responseText);
                console.warn(error.responseText);
                window.scroll(0, 0);
            });
    }
}