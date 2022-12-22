import { Pipe, PipeTransform } from '@angular/core';
import { Status } from './app.model';

@Pipe({
  name: 'statusPipe',
})
export class StatusPipePipe implements PipeTransform {
  stringToDate(dt: string) {
    var parts = dt.split('/');
    var mydate = new Date(
      Number(parts[2]),
      Number(parts[1].replace(/^0+/, '')) - 1,
      Number(parts[0].replace(/^0+/, ''))
    );
    console.log(mydate);
    return mydate;
  }

  transform(items: any[], status: string, fechas: string): any[] {
    if (!status && !fechas) {
      return items;
    } else if (status && !fechas) {
      return items.filter((item) => item.status.valueOf() === status);
    } else if (fechas && !status) {
      if (fechas == 'before') {
        let today15 = new Date();
        today15.setDate(today15.getDate() - 15);
        return items.filter(
          (val: any) =>
            this.stringToDate(val.dateOut) > today15 &&
            this.stringToDate(val.dateOut) < new Date()
        );
      } else {
        let today15 = new Date();
        today15.setDate(today15.getDate() + 15);
        return items.filter(
          (val: any) =>
            this.stringToDate(val.dateOut) < today15 &&
            this.stringToDate(val.dateOut) > new Date()
        );
      }
    } else {
      if (fechas == 'before') {
        let today15 = new Date();
        today15.setDate(today15.getDate() - 15);
        return items.filter(
          (val: any) =>
            this.stringToDate(val.dateOut) > today15 &&
            this.stringToDate(val.dateOut) < new Date() &&
            val.status.valueOf() === status
        );
      } else {
        let today15 = new Date();
        today15.setDate(today15.getDate() + 15);
        return items.filter(
          (val: any) =>
            this.stringToDate(val.dateOut) < today15 &&
            this.stringToDate(val.dateOut) > new Date() &&
            val.status.valueOf() === status
        );
      }
    }
  }
}
