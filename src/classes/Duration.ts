import DurationInterface from "interfaces/DurationInterface.js";
import ELNDurationInterface from "interfaces/ELNDurationInterface.js";

enum MAP_DURATION_TO_PAPER_NOTATION {
  "Week(s)" = "w",
  "Day(s)" = "d",
  "Hour(s)" = "h",
  "Minute(s)" = "min",
  "Second(s)" = "s",
}

interface DurationConstructorInterface {
  step?: number;
  value: string;
}
export class Duration implements DurationInterface {
  type: "duration" = "duration";
  step: number;
  value: string;
  constructor({ step, value }: DurationConstructorInterface) {
    this.step = step || 1;
    this.value = value;
  }
  static durationFromELNDuration(elnDuration: ELNDurationInterface): DurationInterface {
    if (elnDuration && elnDuration.dispValue) {
      const value = `${elnDuration.dispValue} ${MAP_DURATION_TO_PAPER_NOTATION[elnDuration.dispUnit]}`;
      return new Duration({ value });
    }
    return new Duration({ value: "" });
  }
}

export default Duration;
