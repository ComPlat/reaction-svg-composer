export default interface ELNDurationInterface {
  dispUnit: "Week(s)" | "Day(s)" | "Hour(s)" | "Minute(s)" | "Second(s)";
  dispValue?: string;
  memValue: string | null;
  memUnit: string;
}
