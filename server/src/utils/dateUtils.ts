import { DateTime } from "luxon";
export const isoToLocalTime = (isoDate: string) => {
  const utcTime = DateTime.fromISO(isoDate);
  return utcTime.setZone("Asia/Dhaka").toFormat("yyyy-MM-dd HH:mm:ss");
};

export const getCurrentLocalISOTime = (): string => {
  const today = new Date();
  const localTime = isoToLocalTime(today.toISOString());
  return new Date(localTime).toISOString();
};

export const getLocalISOTime = (time: string) => {
  const localTime = isoToLocalTime(time);
  return new Date(localTime).toISOString();
};
