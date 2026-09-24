import "./App.css";
import useLocalStorage from "./hooks/useLocalStorage";

function App() {
  const [startedAtMonth, setStartedAtMonth] = useLocalStorage(
    "startedAtMonth",
    "",
  );
  const [hoursOfStudyFirstMonth, setHoursOfStudyFirstMonth] = useLocalStorage(
    "hoursOfStudyFirstMonth",
    "",
  );
  const [hoursIncremented, setHoursIncremented] = useLocalStorage(
    "hoursIncremented",
    "",
  );
  const [timesToGym, setTimesToGym] = useLocalStorage("timesToGym", "");
  const [penalization, setPenalization] = useLocalStorage("penalization", "");

  const [studiedHours, setStudiedHours] = useLocalStorage("studiedHours", "");
  const [studiedMinutes, setStudiedMinutes] = useLocalStorage(
    "studiedMinutes",
    "",
  );
  const [gymSessions, setGymSessions] = useLocalStorage("gymSessions", "");

  const calculateHoursAndSessionsTotal = () => {
    if (!startedAtMonth) {
      return [];
    }
    const [startYear, startMonth] = startedAtMonth.split("-");
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;
    const monthsPassed =
      (currentYear - Number(startYear)) * 12 +
      (currentMonth - Number(startMonth));

    const firstOfTheMonth = new Date(today);
    firstOfTheMonth.setDate(1);
    const firstDayOfTheMonth = firstOfTheMonth.getDay();
    const firstMondayOfTheMonth = new Date(today);
    firstMondayOfTheMonth.setDate(
      1 + (firstDayOfTheMonth <= 1 ? 0 : 7) - firstDayOfTheMonth + 1,
    );
    let weeksInMonth = 0;
    while (firstMondayOfTheMonth.getMonth() === firstOfTheMonth.getMonth()) {
      firstMondayOfTheMonth.setDate(firstMondayOfTheMonth.getDate() + 7);
      weeksInMonth++;
    }

    const c =
      Number(hoursOfStudyFirstMonth) + Number(hoursIncremented) * monthsPassed;
    const p = Number(penalization);
    const w = weeksInMonth;
    const t = Number(timesToGym);
    const x = Number(gymSessions);
    const h = Number(studiedHours) + Number(studiedMinutes) / 60;

    return [(c * (p * w * t - x)) / (w * t), w * t * (p - h / c)];
  };

  const [totalHours, totalSessions] = calculateHoursAndSessionsTotal();

  const roundedTotalHours = Math.floor(totalHours);
  const roundedTotalMinutes = Math.ceil(
    Math.round(Number((totalHours - roundedTotalHours) * 60)),
  );
  const rawRemainingHours = Math.max(
    0,
    Number(
      (totalHours - Number(studiedHours) - Number(studiedMinutes) / 60).toFixed(
        10,
      ),
    ),
  );
  const remainingHours = Math.floor(rawRemainingHours);
  const remainingMinutes = Math.round(
    Math.round(Number((rawRemainingHours - remainingHours) * 60)),
  );

  const roundedTotalSessions = Math.max(
    0,
    Math.ceil(Number((totalSessions ?? 0).toFixed(10))),
  );
  const remainingSessions = Math.max(
    0,
    roundedTotalSessions - Number(gymSessions),
  );

  return (
    <>
      <h1>
        Study/Gym Ratio Calculator<sub>v0.0.3</sub>
      </h1>
      <section>
        <h2>Parameters</h2>
        <div>
          <label>Started at Month:</label>
          <input
            onChange={(e) => setStartedAtMonth(e.target.value)}
            type="month"
            value={startedAtMonth}
          />
        </div>
        <div>
          <label>How many hours you aim to study in the first month:</label>
          <input
            onChange={(e) => setHoursOfStudyFirstMonth(e.target.value)}
            type="number"
            value={hoursOfStudyFirstMonth}
          />
        </div>
        <div>
          <label>Hours of study incremented each month:</label>
          <input
            onChange={(e) => setHoursIncremented(e.target.value)}
            type="number"
            value={hoursIncremented}
          />
        </div>
        <div>
          <label>How many times you aim to go to the gym in a week:</label>
          <input
            onChange={(e) => setTimesToGym(e.target.value)}
            type="number"
            value={timesToGym}
          />
        </div>
        <div>
          <label>Penalization multiplier for missed workouts:</label>
          <input
            onChange={(e) => setPenalization(e.target.value)}
            type="number"
            value={penalization}
          />
        </div>
      </section>
      <section>
        <h2>Variables</h2>
        <div>
          <label>I've studied</label>
          <input
            onChange={(e) => setStudiedHours(e.target.value)}
            type="number"
            value={studiedHours}
          />
          <label>hours and</label>
          <input
            onChange={(e) => setStudiedMinutes(e.target.value)}
            type="number"
            value={studiedMinutes}
          />
          <label>minutes so far this month.</label>
        </div>
        <div>
          <label>I've gone</label>
          <input
            onChange={(e) => setGymSessions(e.target.value)}
            type="number"
            value={gymSessions}
          />
          <label>times to the gym so far this month.</label>
        </div>
      </section>
      <section>
        <h2>Calculations</h2>
        <p>
          You must study <b>{remainingHours}</b> hours and{" "}
          <b>{remainingMinutes}</b> minutes to reach a total of{" "}
          <b>{roundedTotalHours}</b> hours and <b>{roundedTotalMinutes}</b>{" "}
          minutes
        </p>
        <p>
          <b>or</b>
        </p>
        <p>
          You must go to the gym <b>{remainingSessions}</b> times to reach a
          total of <b>{roundedTotalSessions}</b> sessions.
        </p>
      </section>
    </>
  );
}

export default App;
