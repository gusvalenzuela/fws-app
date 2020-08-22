import nextConnect from "next-connect";
import middleware from "../../../../middlewares/middleware";
const handler = nextConnect();

handler.use(middleware);

// handler.get(async ({ user, db }, res) => {
//     if (!user) res.send(null);
//     // const options = {
//     //   // Include only the `_id`, `name`, and `emailverified` fields in each returned document
//     //   projection: {
//     //     _id: 1,
//     //     email: 0,
//     //     password: 0,
//     //     name: 1,
//     //     emailVerified: 1,
//     //     bio: 0,
//     //     profilePicture: 0,
//     //   },
//     // };
//     const picks = await db.collection("picks").find({}).toArray();
//     res.status(200).json({ picks: picks });
//   });

// handler.get(async (req, res) => res.json({ user: extractUser(req) }));
