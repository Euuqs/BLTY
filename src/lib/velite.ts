import * as v from "../../.velite";

export const sameStyles = v.sameStyles;
export const schedules = v.schedules;
export const feeds = v.feeds;

export type SameStyle = (typeof sameStyles)[number];
export type Schedule = (typeof schedules)[number];
export type Feed = (typeof feeds)[number];
