import { BaseScaleGenerator } from './base-scale-generator';
import { Injectable, InjectionToken } from "@angular/core";
import { DayScaleFormatter } from "../formatters/day-scale-formatter";
import { DateHelpers } from '../date-helpers';
import { IScaleColumn, IScaleGenerator, IScaleGeneratorConfig, IScaleGroup } from '../../models/scale';
import { DateInput } from '../../models/date-input';

export const DAY_SCALE_GENERATOR_CONFIG = new InjectionToken<IScaleGeneratorConfig>('Day scale config');


const DefaultConfig: IScaleGeneratorConfig = {
  formatter: new DayScaleFormatter(),
}

@Injectable()
export class DefaultDayScaleGenerator extends BaseScaleGenerator implements IScaleGenerator {
  protected _getConfig(): IScaleGeneratorConfig {
    return {...DefaultConfig, ...this._injector.get(DAY_SCALE_GENERATOR_CONFIG, {})};
  }

  protected _generateColumn(date: DateInput): IScaleColumn {
    date = new Date(date);

    return {
      id: DateHelpers.generateDateId(date),
      date: date,
      index: date.getDate(),
    };
  }

  protected _validateStartDate(startDate: DateInput): Date {
    const countOfEmptyMonthsBefore = 1;
    startDate = new Date(startDate);
    startDate.setDate(1);
    startDate = DateHelpers.dayBeginningTime(startDate);
    startDate.setMonth(startDate.getMonth() - countOfEmptyMonthsBefore);

    return startDate;
  }

  protected _validateEndDate(endDate: DateInput): Date {
    const countOfEmptyMonthsAfter = 1;
    endDate = new Date(endDate);
    return new Date(DateHelpers.lastDayOfMonth(endDate).setMonth(endDate.getMonth() + countOfEmptyMonthsAfter));
  }

  protected _generateGroups(date: Date): IScaleGroup[] {
    date = new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
    return [{date, id: DateHelpers.generateDateId(date), coverageInPercents: 100}];
  }

  protected _getColumnIndex(date: Date): number {
    return date.getDate();
  }

  protected _getNextColumnDate(date: Date): Date {
    return new Date(date.setDate(date.getDate() + 1));
  }
}

@Injectable()
export class DayScaleGenerator extends DefaultDayScaleGenerator {
}
