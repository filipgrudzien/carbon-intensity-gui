export class CarbonIntensityDto {

    public constructor(intensityMeasured: number,
                       intensityForecast: number,
                       intensityGrade: string,
                       measuringTime: string) {
        this.intensityMeasured = intensityMeasured;
        this.intensityForecast = intensityForecast;
        this.intensityGrade = intensityGrade;
        this.measuringTime = measuringTime;
    }

    private intensityMeasured: number;
    private intensityForecast: number;
    private intensityGrade: string;
    private measuringTime: string;

    public getIntensityMeasured(): number {
        return this.intensityMeasured;
    }

    public getIntensityForecast(): number {
        return this.intensityForecast;
    }

    public getIntensityGrade(): string {
        return this.intensityGrade;
    }

    public getMeasuringTime(): string {
        return this.measuringTime;
    }

}
