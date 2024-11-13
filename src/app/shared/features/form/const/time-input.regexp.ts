export const TimeSeparatorRegexp: RegExp = /^\##.\##$/;
export const TimeFormatRegexp = (separator: string) => new RegExp(`^([01]?[0-9]|2[0-3])${separator}([0-5]?[0-9])$`)
export const NumberRegexp = /^-?\d+$/;
