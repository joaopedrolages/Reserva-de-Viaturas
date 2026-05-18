export function formatDateTime(value: string | Date) {
  return new Intl.DateTimeFormat('pt-PT', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function formatDateRange(start: string, end: string) {
  return `${formatDateTime(start)} - ${formatDateTime(end)}`;
}

export function toDatetimeLocalValue(value: string | Date) {
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60_000);

  return localDate.toISOString().slice(0, 16);
}

export function toIsoFromDatetimeLocal(value: string) {
  return new Date(value).toISOString();
}

export function rangesOverlap(
  startA: string | Date,
  endA: string | Date,
  startB: string | Date,
  endB: string | Date,
) {
  const startATime = new Date(startA).getTime();
  const endATime = new Date(endA).getTime();
  const startBTime = new Date(startB).getTime();
  const endBTime = new Date(endB).getTime();

  return startATime < endBTime && endATime > startBTime;
}
