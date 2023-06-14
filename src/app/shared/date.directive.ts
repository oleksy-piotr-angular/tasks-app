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
  @Input() end: string = '';
  private paragraph: Renderer2;
  constructor(private el: ElementRef, private renderer: Renderer2) {
    this.paragraph = this.renderer.createElement('p');
  }

  @HostListener('mouseenter')
  private mouseEnter(eventDate: Event): void {
    const setData: string = this.end
      ? `<p style="margin-bottom:0">Created: ${this.date}</p>
      <p style="margin-bottom:0">Ended: ${this.end}</p>`
      : `<p style="margin-bottom:0">Created: ${this.date}</p>`;
    this.renderer.setProperty(this.paragraph, 'innerHTML', `${setData}`);
    this.renderer.setAttribute(this.paragraph, 'class', 'date');
    this.renderer.appendChild(this.el.nativeElement, this.paragraph);
  }
  @HostListener('mouseleave')
  private mouseLeave(eventDate: Event): void {
    this.renderer.removeChild(this.el.nativeElement, this.paragraph);
  }
}
