import nc from "next-connect";

const handler = nc({ attachParams: true });

handler.use("/:name", (req, res) => {
  const { name } = req.params;

  res.status(200).json({ message: `hello ${name}` });
});

handler.use("/", (_, res) => {
  res.status(200).json({ message: "Does it work?" });
});

export default handler;
