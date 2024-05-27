import { Pipe, PipeTransform } from '@angular/core';

/**
 * This pipe truncate the value parameter and returns it!
 */
@Pipe({
  name: 'truncate',
  standalone: true
})
export class TruncatePipe implements PipeTransform {
  /**
   * This function returns a value, thats sliced.
   * @param {any}     value - value to truncate
   * @param {number}  [limit=20] - Charlimit
   * @param {number}  [startAt=0] - Startingchar
   * @param {string}  [ellipsis='...'] - endingsigns
   */
  transform(value: any, limit: number = 20, startAt: number = 0, ellipsis: string = '...'): any {
    if (value.length > 1) {
      return value.substr(startAt, limit) + ellipsis
    }
    return value
  }
}