export function formatDateTimeInbox(dateTime) {
  var currentdate = new Date();
  var now = `${currentdate.getFullYear()}-${("0" +(currentdate.getMonth() + 1)).slice(-2)}-${("0" + currentdate.getDate()).slice(-2)}`;
  if (new Date(now).toDateString() == new Date(dateTime.split("T")[0]).toDateString()) {
    var date = new Date(dateTime);
    let hours = date.getHours();
    let minutes = date.getMinutes() < 10 ? `${date.getMinutes()}0` : date.getMinutes();
    let ampm = hours >= 12 ? "PM" : "AM";
    return date.getUTCHours() + ":" + minutes + " " + ampm;
  } else { return new Date(dateTime.split("T")[0]).toLocaleDateString(); }
}

export function formatDateTimeDetail(dateTime) {
    var createDate = new Date(dateTime.split("T")[0]);
    var date = new Date(dateTime);
    let hours = date.getHours();
    let minutes = date.getMinutes() < 10 ? `${date.getMinutes()}0` : date.getMinutes();
    let ampm = hours >= 12 ? "PM" : "AM";
    return createDate.toDateString() + " " + date.getUTCHours() + ":" + minutes + " " + ampm;
}
