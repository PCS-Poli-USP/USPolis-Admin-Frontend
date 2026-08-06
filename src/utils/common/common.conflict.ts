import moment from 'moment';

/**
 * Checks whether two `HH:mm` time ranges overlap.
 *
 * Mirrors the backend's `Occurrence.conflicts_with_time`: ranges are treated
 * as half-open intervals, so touching boundaries (e.g. `14:00-16:00` vs
 * `16:00-18:00`) do NOT count as a conflict - only an actual overlap does.
 *
 * @param startA - Start time of the first range, `HH:mm`.
 * @param endA - End time of the first range, `HH:mm`.
 * @param startB - Start time of the second range, `HH:mm`.
 * @param endB - End time of the second range, `HH:mm`.
 * @returns `true` if the two ranges overlap, `false` otherwise.
 */
export function timeRangesConflict(
  startA: string,
  endA: string,
  startB: string,
  endB: string,
): boolean {
  const startAMoment = moment(startA, 'HH:mm');
  const endAMoment = moment(endA, 'HH:mm');
  const startBMoment = moment(startB, 'HH:mm');
  const endBMoment = moment(endB, 'HH:mm');
  return (
    startAMoment.isBefore(endBMoment) && startBMoment.isBefore(endAMoment)
  );
}

/**
 * Checks whether two dated `HH:mm` time ranges overlap.
 *
 * Mirrors the backend's `Occurrence.conflicts_with_time_and_date`: same
 * overlap rule as {@link timeRangesConflict}, but the ranges can only
 * conflict when they fall on the same date.
 *
 * @param dateA - Date of the first range, `YYYY-MM-DD`.
 * @param startA - Start time of the first range, `HH:mm`.
 * @param endA - End time of the first range, `HH:mm`.
 * @param dateB - Date of the second range, `YYYY-MM-DD`.
 * @param startB - Start time of the second range, `HH:mm`.
 * @param endB - End time of the second range, `HH:mm`.
 * @returns `true` if both ranges share the same date and their times
 * overlap, `false` otherwise.
 */
export function dateTimeRangesConflict(
  dateA: string,
  startA: string,
  endA: string,
  dateB: string,
  startB: string,
  endB: string,
): boolean {
  if (dateA !== dateB) return false;
  return timeRangesConflict(startA, endA, startB, endB);
}
