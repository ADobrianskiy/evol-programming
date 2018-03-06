export function deba1(x) {
    return Math.pow(6, Math.sin(5 * Math.PI * x));
}

export function deba2(x) {
    return Math.exp(-2 * Math.log(2) * Math.pow(2, (x - 0.1) / 0.8)) * deba1(x);

}

export function deba3(x) {
    return Math.pow(6, Math.sin(5 * Math.PI * (Math.pow(0.75, x) - 0.05)));
}

export function deba4(x) {
    return Math.exp(-2 * Math.log(2) * Math.pow(2, (x - 0.08) / 0.854)) * deba3(x);
}
