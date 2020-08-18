import nextConnect from "next-connect";
import middleware from "../../../../middlewares/middleware";
import { getPick } from "../../../../lib/db";

const handler = nextConnect();

handler.use(middleware);

handler.get(async (req, res) => {
  const pick = await getPick(req, req.query.eventId);
  res.send({ pick });
});

export default handler;
