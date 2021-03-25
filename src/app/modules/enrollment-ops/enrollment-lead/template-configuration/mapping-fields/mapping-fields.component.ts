import { Component, OnInit, OnChanges, Input, Output, forwardRef, AfterViewInit, ViewChild, HostListener } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NotifierService } from 'src/app/services/notifier.service';

@Component({
  selector: 'app-mapping-fields',
  templateUrl: './mapping-fields.component.html',
  styleUrls: [],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MappingFieldsComponent),
      multi: true
    }
  ]
})
export class MappingFieldsComponent implements OnInit, OnChanges, ControlValueAccessor, AfterViewInit {
  @Input()
  public fileFields: any[];
  @Input()
  public mapFields: any[];
  @Input()
  public mandatoryHeaders: any[];
  private outCordinates = [];
  public mappedEntities: any = {};
  private timeOut: any;
  propagateChange = (_: any) => {};
  @ViewChild('container', {static: false})
  public containerDiv: any;
  public width: number;
  public addOpen: boolean;
  constructor(private notifierService: NotifierService) { }

  writeValue(value: any) {
    if (value !== undefined) {
      this.mappedEntities = value || {};
      this.setUpPoints();
    }
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched() {}

  ngOnInit() {
    this.processChange();
  }

  ngOnChanges() {
    this.processChange();
  }

  ngAfterViewInit() {
    this.width = this.containerDiv ? this.containerDiv.nativeElement.scrollWidth : 900;
    this.setUpPoints();
  }

  private setUpPoints() {
    // tslint:disable-next-line: no-unused-expression
    this.timeOut ? clearTimeout(this.timeOut) : null;
    this.timeOut = setTimeout(() => {
      this.mapOutPoints();
    }, 500);
  }

  public processChange() {
    this.fileFields.forEach((e, index) => {
      this.mappedEntities[e] = null;
    });
    this.mapOutPoints();
  }

  private mapOutPoints() {
    this.outCordinates = [];
    const svgElement = document.getElementById("fullsvg");
    if (this.mapFields.length > 0 && svgElement) {
      const svgElementBound = svgElement.getBoundingClientRect();
      this.mapFields.forEach((e, index) => {
        const element = document.getElementById(`out-${index + 1}`);
        if (element) {
          const elBound = element.getBoundingClientRect();
          this.outCordinates.push({
            x: (elBound.left + elBound.width / 2) - svgElementBound.left,
            y: elBound.top + elBound.height / 2 - svgElementBound.top,
            end: index + 1,
            value: e
          });
        }
      });
      this.createPathOnEdit();
    }
  }

  private createPathOnEdit() {
    const svgElement = document.getElementById("fullsvg");
    const svgElementBound = svgElement.getBoundingClientRect();
    if (Object.values(this.mappedEntities).filter(e => e).length > 0) {
      Object.keys(this.mappedEntities).forEach((inKey) => {
        const inIndex = this.fileFields.indexOf(inKey);
        const element = document.getElementById(`in-${inIndex + 1}`);
        const value = this.mappedEntities[inKey];
        if (element && value) {
          const elBound = element.getBoundingClientRect();
          const posnA = {
            x: (elBound.left + elBound.width / 2) - svgElementBound.left,
            y: elBound.top + elBound.height / 2 - svgElementBound.top
          };
          const filtered = this.outCordinates.filter(v => v.value === value);
          const posnB = filtered[0];
          const newPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          newPath.setAttribute('id', `connector-${inIndex + 1}`);
          newPath.setAttribute('style', 'stroke: dodgerblue; stroke-width: 3; fill:none');
          const dStr = `M${posnA.x} ${posnA.y} C ${posnA.x + 100} ${posnA.y} ${posnB.x - 100} ${posnB.y} ${posnB.x} ${posnB.y}`;
          newPath.setAttribute("d", dStr);
          svgElement.append(newPath);
        }
      });
      this.checkButtons();
    }
  }

  mouseDown(start, event) {
    if (this.mapFields.length > 0 && this.mapFields.length !== this.outCordinates.length) {
      this.mapOutPoints();
    }
    const id = `connector-${start}`;
    const svgElement = document.getElementById("fullsvg");
    const svgElementBound = svgElement.getBoundingClientRect();
    const existingPath = document.getElementById(id);
    if (existingPath) {
      svgElement.removeChild(existingPath);
    }
    const startElement = event.target;
    const startBound = startElement.getBoundingClientRect();
    if (!startElement.checked) {
      startElement.click();
    }
    this.updateMappedEntities(start, null, true);
    const newPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const posnA = {
      x: (startBound.left + startBound.width / 2) - svgElementBound.left,
      y: (startBound.top + startBound.height / 2) - svgElementBound.top
    };
    newPath.setAttribute('id', id);
    newPath.setAttribute('style', 'stroke: dodgerblue; stroke-width: 3; fill:none');
    const listener = (e) => {
      // tslint:disable-next-line: max-line-length
      const posnB = {
        x: e.pageX - svgElementBound.left,
        y: e.pageY - svgElementBound.top - window.scrollY
      }
      const dStr = `M${posnA.x} ${posnA.y} C ${posnA.x + 100} ${posnA.y} ${posnB.x - 100} ${posnB.y} ${posnB.x} ${posnB.y}`;
      newPath.setAttribute("d", dStr);
      svgElement.append(newPath);
    };
    document.addEventListener('mousemove', listener);
    document.onmouseup = (e) => {
      const filtered = this.outCordinates.filter(point => {
        const xDiff = point.x - (e.pageX - svgElementBound.left);
        const yDiff = point.y - (e.pageY - svgElementBound.top - window.scrollY);
        return (-10 < xDiff && xDiff < 10) && (-10 < yDiff && yDiff < 10);
      });
      const isNearOutPoint = filtered.length > 0;
      const checkedOut = Object.values(this.mappedEntities).filter(v => v);
      const notAddedOut = isNearOutPoint && checkedOut.length > 0 ?
      (checkedOut.length > 0 && (checkedOut.indexOf(filtered[0].value) === -1)) : true;
      if (isNearOutPoint && notAddedOut) {
        this.updateMappedEntities(start, filtered[0].value);
        const dStr = `M${posnA.x} ${posnA.y} C ${posnA.x + 100} ${posnA.y} ${
          filtered[0].x - 100
        } ${filtered[0].y} ${filtered[0].x} ${filtered[0].y}`;
        newPath.setAttribute("d", dStr);
        svgElement.append(newPath);
      } else {
        if (newPath.parentElement) {
          svgElement.removeChild(newPath);
        }
        const timeOut = setTimeout(() => {
          startElement.checked = false;
          clearTimeout(timeOut);
        }, 50);
        this.checkButtons();
      }
      document.removeEventListener('mousemove', listener);
      document.onmouseup = null;
    };
  }

  checkButtons() {
    Object.keys(this.mappedEntities).filter(v => this.fileFields.indexOf(v) > -1).forEach(key => {
      const inIndex = this.fileFields.indexOf(key);
      const inEl: any = document.getElementById(`in-${inIndex + 1}`);
      if (this.mappedEntities[key]) {
        const outIndex = this.mapFields.indexOf(this.mappedEntities[key]);
        const outEl: any = document.getElementById(`out-${outIndex + 1}`);
        inEl.checked = true;
        outEl.checked = true;
      } else {
        inEl.checked = false;
      }
    });
    const checkedOut = Object.values(this.mappedEntities).filter(v => v);
    this.outCordinates.forEach((e: any) => {
      const outEl: any = document.getElementById(`out-${e.end}`);
      if (checkedOut.indexOf(e.value) === -1) {
        outEl.checked = false;
      }
    });
  }

  removeLink(key, noUpdate?: boolean) {
    const id = `connector-${key}`;
    const svgElement = document.getElementById("fullsvg");
    const existingPath = document.getElementById(id);
    if (existingPath) {
      svgElement.removeChild(existingPath);
    }
    if (!noUpdate) {
      this.updateMappedEntities(key, null);
    }
  }

  updateMappedEntities(index, value, doNotUpdateView?) {
    const key = this.fileFields[index - 1];
    this.mappedEntities[key] = value;
    if (!doNotUpdateView) {
      this.checkButtons();
      this.propagateChange(this.mappedEntities);
    }
  }

  addRowBelow(index: number) {
    this.addOpen = true;
    this.fileFields.forEach((e, i) => {
      this.removeLink(i + 1, true);
    });
    this.fileFields.splice(index + 1, 0, '$inputNew');
    this.setUpPoints();
  }

  saveNewRow(index: number, name: string) {
    if (!name) {
      this.notifierService.throwNotification({
        type: 'warning',
        message: 'Please Enter a Field Name.'
      })
    } else {
      this.addOpen = false;
      this.fileFields.forEach((e, i) => {
        this.removeLink(i + 1, true);
      });
      this.fileFields[index] = name;
      this.setUpPoints();
    }
  }

  cancelAddRow(index: number) {
    this.addOpen = false;
    this.fileFields.forEach((e, i) => {
      this.removeLink(i + 1, true);
    });
    this.fileFields.splice(index, 1);
    this.setUpPoints();
  }

}
