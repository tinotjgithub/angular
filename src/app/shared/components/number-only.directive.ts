import { Directive, ElementRef, HostListener } from "@angular/core";

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: "input[numbersOnly]",
})
export class NumberDirective {
  constructor(private el: ElementRef) {}

  @HostListener('keydown', ['$event']) onInput(event: Event) {
    this.el.nativeElement.value = (event.currentTarget as HTMLInputElement).value.replace(/[^0-9]/g, '');
  }
}
