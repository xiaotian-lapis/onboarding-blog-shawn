/**
 * Simulates a database call with a random delay and a 10% chance of an error
 * @param data data should return
 */
export const simulateDatabaseIO = <T>(data: T): Promise<T> => {

    const isGodMode = true; // if true, always success
    const isEvilMode = false; // if true, always error, and evil mode has higher priority than god mode

    const delay = Math.floor(Math.random() * 3000); // Random delay up to 3 seconds
    const shouldThrowError = Math.random() < 0.1;  // 10% chance of an error

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (isEvilMode || (!isGodMode && shouldThrowError)) {
                reject(new Error("Internal Server Error!"));
            } else {
                resolve(data);
            }
        }, delay);
    });
};
