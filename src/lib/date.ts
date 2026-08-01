export function formatDate(isoString: string): string {
  const match = isoString.match(/^(\d{4}-\d{2}-\d{2})T/);
  return match ? match[1] : isoString.slice(0, 10);
}

export function formatMonthDay(isoString: string): string {
  const match = isoString.match(/^\d{4}-(\d{2}-\d{2})T/);
  return match ? match[1] : isoString.slice(5, 10);
}

export function formatMonth(isoString: string): string {
  const match = isoString.match(/^(\d{4}-\d{2})-/);
  return match ? match[1] : isoString.slice(0, 7);
}

export function formatDay(isoString: string): string {
  const match = isoString.match(/^\d{4}-\d{2}-(\d{2})T/);
  return match ? match[1] : isoString.slice(8, 10);
}

export function formatWeekday(isoString: string, locale: string = "zh-CN"): string {
  const dateStr = formatDate(isoString);
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString(locale, { weekday: "short" });
}

export function formatDateTime(isoString: string, time?: string): string {
  const datePart = formatDate(isoString);
  if (time) {
    return `${datePart} ${time}`;
  }
  const timeMatch = isoString.match(/T(\d{2}:\d{2})/);
  if (timeMatch && timeMatch[1] !== "00:00") {
    return `${datePart} ${timeMatch[1]}`;
  }
  return datePart;
}

export function formatScheduleDateTime(isoString: string, time?: string): string {
  const datePart = formatDate(isoString);
  if (time) {
    return `${datePart} ${time}`;
  }
  return datePart;
}
