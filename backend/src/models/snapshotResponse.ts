export interface SnapShotReponse {
    dailyBar:     Bar[];
    latestQuote:  LatestQuote;
    latestTrade:  LatestTrade;
    minuteBar:    Bar;
    prevDailyBar: Bar;
}

export interface Bar {
    c:  number;
    h:  number;
    l:  number;
    n:  number;
    o:  number;
    t:  Date;
    v:  number;
    vw: number;
}

export interface LatestQuote {
    ap: number;
    as: number;
    ax: Ax;
    bp: number;
    bs: number;
    bx: Ax;
    c:  LatestQuoteC[];
    t:  Date;
    z:  Z;
}

export enum Ax {
    Empty = " ",
    V = "V",
}

export enum LatestQuoteC {
    R = "R",
}

export enum Z {
    A = "A",
    B = "B",
    C = "C",
}

export interface LatestTrade {
    c: LatestTradeC[];
    i: number;
    p: number;
    s: number;
    t: Date;
    x: Ax;
    z: Z;
}

export enum LatestTradeC {
    C = "@",
    Empty = " ",
    F = "F",
    T = "T",
}
