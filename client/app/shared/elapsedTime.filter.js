// Accepts a value of seconds, returns sting of hours minutes seconds
export function ElapsedTime() {
  return function(time) {
    if (!angular.isNumber(time) || time < 0) {
      return "00:00:00";
    }

    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    if (hours > 0) {
      return padding(hours) + " hours " + padding(minutes) + " min " + padding(seconds) + " sec";
    } else if (minutes > 0) {
      return padding(minutes) + " min " + padding(seconds) + " sec";
    } else {
      return padding(seconds) + " sec";
    }
  };

  function padding(t) {
    return t < 10 ? "0" + t : t;
  }
}
