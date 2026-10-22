import Contest from "../models/Contest.js";
import Lecture from "../models/Lecture.js";

export async function listContests(_req, res) {
  const contests = await Contest.find().sort({ createdAt: -1 }).lean();
  res.json(contests.map(({ _id, ...contest }) => ({ ...contest, id: _id.toString() })));
}

export async function createContest(req, res) {
  const { title, duration, startTime } = req.body;
  if (![title, duration, startTime].every((value) => typeof value === "string" && value.trim())) {
    return res.status(400).json({ message: "Title, duration, and start time are required." });
  }
  res.status(201).json(await Contest.create(req.body));
}

export async function listLectures(_req, res) {
  res.json(await Lecture.find().sort({ subject: 1, title: 1 }).lean());
}

export async function createLecture(req, res) {
  const { id, title, subject, topic } = req.body;
  if (![id, title, subject, topic].every((value) => typeof value === "string" && value.trim())) {
    return res.status(400).json({ message: "ID, title, subject, and topic are required." });
  }
  res.status(201).json(await Lecture.create(req.body));
}
