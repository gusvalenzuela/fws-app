import nextConnect from "next-connect";
import isEmail from "validator/lib/isEmail";
import normalizeEmail from "validator/lib/normalizeEmail";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import middleware from "../../middlewares/middleware";
import { extractUser } from "../../lib/api-helpers";

const handler = nextConnect();

handler.use(middleware);

handler.post(async (req, res) => {
  const { name, password } = req.body;
  const email = normalizeEmail(req.body.email);
  if (!isEmail(email)) {
    res.status(400).send("The email you entered is invalid.");
    return;
  }
  if (!password || !name) {
    res.status(400).send("Missing field(s)");
    return;
  }
  if ((await req.db.collection("users").countDocuments({ email })) > 0) {
    res.status(403).send("The email has already been used.");
    return;
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await req.db
    .collection("users")
    .insertOne({
      _id: nanoid(12),
      email,
      password: hashedPassword,
      name,
      emailVerified: false,
      bio: "",
      profilePicture: null,
    })
    .then(({ ops }) => ops[0]);
  req.logIn(user, (err) => {
    if (err) throw err;
    res.status(201).json({
      user: extractUser(req),
    });
  });
});

handler.get(async ({ user, db }, res) => {
  if (!user) res.send(null);
  const options = {
    // Include only the `_id`, `name`, and `emailverified` fields in each returned document
    // (one of, not both), {'a':1, 'b': 1} or {'a': 0, 'b': 0}
    projection: {
      _id: 1,
      name: 1,
      emailVerified: 1,
    },
  };
  const users = await db.collection("users").find({}, options).toArray();
  const picks = await db.collection("picks").find({}).toArray();

  // mapping each picks Array to its respective player
  const allData = users.map((user) => {
    // filtering out picks that match the user iD
    let userPicks = picks.filter((pick) => {
      if (pick.userId !== user._id) {
        return null;
      }
      return pick;
    });

    // add userPicks array to the user obj
    user.picks = userPicks;

    return user;
  });

  res.status(200).json({ users: allData });
});

export default handler;
