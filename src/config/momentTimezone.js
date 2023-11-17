import moment_timezone from "moment-timezone";

export default function useMomentTimezonePlugin(app) {
  app.config.globalProperties.$moment = moment_timezone;
}
