class CelsiusTemp {
  private temperatureCelsius: number;

  constructor(temperatureCelsius: number) {
    this.temperatureCelsius = temperatureCelsius;
  }

  getTemperatureCelsius(): number {
    return this.temperatureCelsius;
  }
}


interface TemperatureTarget {
  getTemperatureFahrenheit(): number;
}


class CelsiusToFahrenheitAdapter implements TemperatureTarget {
  private celsiusTemp: CelsiusTemp;

  constructor(celsiusTemp: CelsiusTemp) {
    this.celsiusTemp = celsiusTemp;
  }

  getTemperatureFahrenheit(): number {
    return (this.celsiusTemp.getTemperatureCelsius() * 9) / 5 + 32;  
  }
}


function displayTemperatureInFahrenheit(temperatureTarget: TemperatureTarget): void {
  console.log(`Temperature in Fahrenheit: ${temperatureTarget.getTemperatureFahrenheit()}`);
}
const celsiusTemperature = new CelsiusTemp(25);
const adapter = new CelsiusToFahrenheitAdapter(celsiusTemperature);

displayTemperatureInFahrenheit(adapter); 
