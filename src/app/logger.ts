const isDev = import.meta.env.MODE !== "production";

type LogFn = (...args: unknown[]) => void;

const noop: LogFn = () => {};

export const log: LogFn = isDev ? console.log.bind(console) : noop;
export const warn: LogFn = isDev ? console.warn.bind(console) : noop;
export const error: LogFn = isDev ? console.error.bind(console) : noop;

export default { log, warn, error };
