function dateTime(arrivalTime, departureTime) {
  let time1 = new Date(arrivalTime);
  let time2 = new Date(departureTime);

  return time1.getTime() > time2.getTime();
}

module.exports = dateTime;
