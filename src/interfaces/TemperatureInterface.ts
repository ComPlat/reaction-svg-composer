interface TemperatureInterface {
  type: "temperature";
  step: number;
  value: {
    data: string[];
    userText: string;
    valueUnit: string;
  };
}

export default TemperatureInterface;
