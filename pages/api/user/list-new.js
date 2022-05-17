export default function handler(req, res) {
  if (req.headers.authorization !== "Bearer xxxxxxxxx") {
    res.status(401).send("Unauthorized");
    return;
  }
  res.status(200).json([
    { id: 1, name: "lmx", age: 18 },
    { id: 2, name: "foo", age: 17 },
    { id: 3, name: "bar", age: 16 },
  ]);
}
