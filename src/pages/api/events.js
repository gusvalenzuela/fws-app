// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import Schedule from "../../local_schedule_events.json";

export default (req, res) => {
  res.statusCode = 200;
  res.json(Schedule);
};
