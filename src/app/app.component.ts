import {
  Component,
  VERSION,
  OnInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { 
  Subject,
  debounceTime,
  distinctUntilChanged,
  distinctUntilKeyChanged,
  Observable,
  Observer,
  throttleTime,
  sample,
  sampleTime,
  interval,
  fromEvent,
  map,
} from 'rxjs';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  name = 'Angular ' + VERSION.major;
  change: string = '';
  search = '';
  inputSub = new Subject<string>();
  loginSub = new Subject<boolean>();
  interval = interval(1000);
  _inter: any;
  numberclick: any;
  click$ = fromEvent(document, 'click');
  //-----------login
  islogin = false;
  ngOnInit() {
    ///------------------
    this.inputSub
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((res) => {
        this.change = res;
      });
    //-----------------------------login
    this.loginSub.pipe(throttleTime(2000)).subscribe((res) => {
      this.login().subscribe((res) => {
        this.islogin = res;
        console.log('log');
      });
    });
    //---------------interval
    this.interval.subscribe((res) => {
      this._inter = res;
    });
    //========================
    this.interval.pipe(sample(this.click$)).subscribe((res) => {
      this.numberclick = res;
    });

    //===========================
    this.click$
      .pipe(
        map((e: any) => {
          return { clientX: e.clientX };
        }),
        sampleTime(1000)
      )
      .subscribe((res) => {
        console.log(res);
      });
  }

  login(): Observable<boolean> {
    return Observable.create((observer: Observer<boolean>) => {
      setTimeout(() => {
        observer.next(true);
        observer.complete();
      }, 2000);
    });
  }

  _Login() {
    this.login()
      .pipe(throttleTime(2000))
      .subscribe((res) => {
        this.islogin = res;
        console.log('log');
      });
  }
}

// Navigate without adding to the history

// this.router.navigate([`/somewhere`], { replaceUrl: true });
