import { Inject, Injectable } from "@angular/core";
import { DayScaleGenerator } from "./scale-generator/day-scale-generator";
import { DaysViewModeAdaptor } from "./view-mode-adaptor/days-view-mode-adaptor";
import { TimelineViewMode } from "../models/zoom";
import { IScaleGenerator } from "../models/scale";
import { IViewModeAdaptor } from "../models/view-adapter";


export interface IStrategyManager<ViewMode = TimelineViewMode> {
  getScaleGenerator(viewMode: ViewMode): IScaleGenerator;
  getViewModeAdaptor(viewMode: ViewMode): IViewModeAdaptor;
}

@Injectable()
export class DefaultStrategyManager<ViewMode> implements IStrategyManager<ViewMode> {
  protected _generatorsDictionary: any = {
    [TimelineViewMode.Day]: this._dayGenerator
  }

  protected _calculatorsDictionary: any = {
    [TimelineViewMode.Day]: new DaysViewModeAdaptor()
  }

  constructor(@Inject(DayScaleGenerator) protected _dayGenerator: IScaleGenerator) {}

  getViewModeAdaptor(viewMode: ViewMode): IViewModeAdaptor {
    return this._calculatorsDictionary[viewMode as unknown as TimelineViewMode];
  }

  getScaleGenerator(viewMode: ViewMode): IScaleGenerator {
    return this._generatorsDictionary[viewMode as unknown as TimelineViewMode];
  }
}

@Injectable()
export class StrategyManager<ViewMode = TimelineViewMode> extends DefaultStrategyManager<ViewMode> {
}
