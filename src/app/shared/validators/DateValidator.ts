import { ValidatorFn, AbstractControl } from '@angular/forms';

export function validateDate(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
        let today = setDateForComparsion(new Date());
        let calendarDate = setDateForComparsion(control.value);
        return calendarDate > today ? {'date': {value: control.value}} : null;
    };
}

const setDateForComparsion = (dateValue: Date): Date => {
    let date = new Date(dateValue);
    date.setHours(0, 0, 0, 0);
    return date;
};

