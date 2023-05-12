import ConditionInterface from "interfaces/ConditionInterface.js";
interface ConditionConstructorInterface {
  step?: number;
  value: string;
}
export class Condition implements ConditionInterface {
  type: "condition" = "condition";
  step: number;
  value: string;
  constructor({ step, value }: ConditionConstructorInterface) {
    this.step = step || 1;
    this.value = value;
  }

  static conditionFromELNCondition(ELNCondition: string): ConditionInterface {
    return new Condition({ value: ELNCondition });
  }
}

export default Condition;
