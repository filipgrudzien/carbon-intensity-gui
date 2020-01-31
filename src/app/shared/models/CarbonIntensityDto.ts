export class CarbonIntensityDto {

    public constructor(intensityMeasured: number,
                       intensityForecast: number,
                       intensityIndex: string,
                       measuringTime: string) {
        this.intensityMeasured = intensityMeasured;
        this.intensityForecast = intensityForecast;
        this.intensityIndex = intensityIndex;
        this.measuringTime = measuringTime;
    }

    private intensityMeasured: number;
    private intensityForecast: number;
    private intensityIndex: string;
    private measuringTime: string;

    public getIntensityMeasured(): number {
        return this.intensityMeasured;
    }

    public getIntensityForecast(): number {
        return this.intensityForecast;
    }

    public getIntensityIndex(): string {
        return this.intensityIndex;
    }

    public getMeasuringTime(): string {
        return this.measuringTime;
    }

}
