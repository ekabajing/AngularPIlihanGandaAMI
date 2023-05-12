import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { PertanyaanService } from '../service/pertanyaan.service';

@Component({
    selector: 'app-pertanyaan',
    templateUrl: './pertanyaan.component.html',
    styleUrls: ['./pertanyaan.component.scss']
})
export class PertanyaanComponent implements OnInit {

    public name: string = "";
    public pertanyaanList: any = [];
    public currentPertanyaan: number = 0;
    public points: number = 0;
    counter = 60;
    correctAnswer: number = 0;
    inCorrectAnswer: number = 0;
    interval$: any;
    progress: string = "0";
    isQuizCompleted: boolean = false;

    constructor(
        private pertanyaanService: PertanyaanService
    ) { }

    ngOnInit(): void {
        this.name = localStorage.getItem("name")!;
        this.getAllPertanyaans();
        this.startCounter();
    }

    getAllPertanyaans() {
        this.pertanyaanService.getPertanyaanJson()
            .subscribe(res => {
                this.pertanyaanList = res.pertanyaans;
            })
    }

    nextPertanyaan() {
        this.currentPertanyaan++;
    }

    previousPertanyaan() {
        this.currentPertanyaan--;
    }

    answer(currentQno: number, option: any) {
        if (currentQno === this.pertanyaanList.length) {
            this.isQuizCompleted = true;
            this.stopCounter();
        }
        if (option.correct) {
            this.points += 10;
            this.correctAnswer++;
            setTimeout(() => {
                this.currentPertanyaan++;
                this.resetCounter();
                this.getProgressPercent();
            }, 1000);
        } else {
            setTimeout(() => {
                this.currentPertanyaan++;
                this.inCorrectAnswer++;
                this.resetCounter();
                this.getProgressPercent();
            }, 1000);
            this.points -= 10;
        }
    }

    startCounter() {
        this.interval$ = interval(1000)
            .subscribe(val => {
                this.counter--;
                if (this.counter === 0) {
                    this.currentPertanyaan++;
                    this.counter = 60;
                    this.points -= 10;
                }
            });
        setTimeout(() => {
            this.interval$.unsubscribe();
        }, 600000);
    }

    stopCounter() {
        this.interval$.unsubscribe();
        this.counter = 0;
    }

    resetCounter() {
        this.stopCounter();
        this.counter = 60;
        this.startCounter();
    }

    resetQuiz() {
        this.resetCounter();
        this.getAllPertanyaans();
        this.points = 0;
        this.counter = 60;
        this.currentPertanyaan = 0;
        this.progress = "0";
    }

    getProgressPercent() {
        this.progress = ((this.currentPertanyaan / this.pertanyaanList.length) * 100).toString();
        return this.progress;
    }

}
