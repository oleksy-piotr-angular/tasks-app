import {
  Directive,
  HostListener,
  Input,
  ElementRef,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[appDate]',
})
export class DateDirective {
  @Input() date: string = '';
  private paragraph: Renderer2;
  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.paragraph = this.renderer.createElement('p');
  }

  @HostListener('mouseenter') mouseEnter(eventDate: Event): void {
    this.renderer.setProperty(
      this.paragraph,
      'innerHTML',
      `Date: ${this.date}`
    );
    this.renderer.appendChild(this.el.nativeElement, this.paragraph);
  }
  @HostListener('mouseleave')
  mouseLeave(eventDate: Event): void {
    this.renderer.removeChild(this.el.nativeElement, this.paragraph);
  }
}
