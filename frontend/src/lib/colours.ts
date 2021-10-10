export const randomNum = () => Math.floor(Math.random() * (235 - 52 + 1) + 52);

export const randomRGB = () => `rgb(${randomNum()}, ${randomNum()}, ${randomNum()})`;