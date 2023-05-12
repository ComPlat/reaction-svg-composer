import ELNTemperatureInterface from "interfaces/ELNTemperatureInterface.js";
import TemperatureInterface from "interfaces/TemperatureInterface.js";

interface TemperatureConstructorInterface {
  step?: number;
  value: { data: string[]; userText: string; valueUnit: string };
}

export class Temperature implements TemperatureInterface {
  type: "temperature" = "temperature";
  step: number = 1;
  value: { data: string[]; userText: string; valueUnit: string };
  constructor({ step, value }: TemperatureConstructorInterface) {
    this.step = step || 1;
    this.value = value;
  }

  static temperatureFromENLTemperature(enlTemperature: ELNTemperatureInterface): TemperatureInterface {
    if (enlTemperature) {
      return new Temperature({ value: enlTemperature });
    }
    return new Temperature({
      value: {
        data: [""],
        userText: "",
        valueUnit: "",
      },
    });
  }
}

export default Temperature;
