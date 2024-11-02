import { useCallback, useEffect, useState } from "react";

import { dummyData } from "@/hooks/dummydata";
// const slotsByDayKey = (date: Date) => format(date, "yyyy-MM-dd");
export function useGoogleTimeslots() {
  const [availableGoogleSlots, setAvailableGoogleSlots] = useState<Date[]>([]);
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<
    "idle" | "pending" | "success" | "error"
  >("idle");
  const reset = useCallback(() => {
    setStatus("idle");
    setError(null);
  }, []);

  useEffect(() => {
    try {
      setStatus("pending");
      //@ts-expect-error google.script.run is not typed
      google.script.run
        .withSuccessHandler(function ({
          timeslots,
          durationMinutes,
        }: {
          timeslots: string[];
          durationMinutes: number;
        }) {
          setAvailableGoogleSlots(
            timeslots.map((timeslot) => new Date(timeslot))
          );
          setDurationMinutes(durationMinutes);
          setStatus("success");
        })
        .withFailureHandler(function (err: Error) {
          setError(err);
        })
        .fetchAvailability();
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        setStatus("success");
        setAvailableGoogleSlots(dummyData.map((d) => new Date(d)));
      } else {
        console.error(error);
        setStatus("error");
        setError(error as Error);
      }
    }
  }, []);

  return [availableGoogleSlots, durationMinutes, status, error, reset] as const;
}
