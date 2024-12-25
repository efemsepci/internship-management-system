import axios from "axios";

const HOLIDAYS_API_URL = "http://localhost:8080/api/holidays";

class HolidaysService {
  getHolidays() {
    return axios.get(HOLIDAYS_API_URL);
  }
  createHolidays(holiday) {
    return axios.post(HOLIDAYS_API_URL, holiday);
  }
  deleteHoliday(id) {
    return axios.delete(HOLIDAYS_API_URL + "/" + id);
  }
}

export default new HolidaysService();
