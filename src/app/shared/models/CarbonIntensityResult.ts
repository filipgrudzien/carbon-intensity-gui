import { CarbonIntensityResultType } from './CarbonIntensityResultType';

export class CarbonIntensityResult {

    public constructor(
        resultType: CarbonIntensityResultType,
        date: string,
        intensity: number,
        intensityIndex: string) {
        this.resultType = resultType;
        this.date = date;
        this.intensity = intensity;
        this.intensityIndex = intensityIndex;
    }

    protected resultType: CarbonIntensityResultType;
    protected date: string;
    protected intensity: number;
    protected intensityIndex: string;

    public getResultType(): CarbonIntensityResultType {
        return this.resultType;
    }

    public getDate(): string {
        return this.date;
    }

    public getIntensity(): number {
        return this.intensity;
    }

    public getIntensityIndex(): string {
        return this.intensityIndex;
    }

    /* public getResultTypeValue() {
        return CarbonIntensityResultType[this.resultType.toString()];
    } */
}
