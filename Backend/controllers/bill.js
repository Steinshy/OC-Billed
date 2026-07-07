const { Bill } = require("../models/index.js");

const USER_MUST_BE_AUTHENTICATED = "user must be authenticated";
const UNAUTHORIZED_ACTION = "unauthorized action";

const getFileURL = filePath => `http://localhost:5678/${filePath}`;

const isPicture = mimeType =>
  ["image/jpeg", "image/jpg", "image/png", "image/gif"].includes(mimeType);

// Fields a client is allowed to set on a bill.
const pickBillAttributes = ({
  name,
  type,
  email,
  date,
  vat,
  pct,
  commentary,
  status,
  commentAdmin,
  amount,
}) => ({ name, type, email, date, vat, pct, commentary, status, commentAdmin, amount });

// Public representation of a bill (exposes `key` as `id`, never the internal id).
const toBillDTO = bill => ({
  id: bill.key,
  ...pickBillAttributes(bill),
  fileName: bill.fileName,
  fileUrl: getFileURL(bill.filePath),
});

// Admins can access any bill; other users only their own.
const findBillForUser = (user, key) =>
  Bill.findOne({
    where: user.type === "Admin" ? { key } : { key, email: user.email },
  });

const create = async (req, res) => {
  const { user, file } = req;
  if (!user) return res.status(401).send({ message: USER_MUST_BE_AUTHENTICATED });
  try {
    const hasPicture = Boolean(file) && isPicture(file.mimetype);
    const bill = await Bill.create({
      ...pickBillAttributes(req.body),
      fileName: hasPicture ? file.originalname : null,
      filePath: hasPicture ? file.path : null,
    });
    return res.status(201).json(bill);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const get = async (req, res) => {
  const { user } = req;
  if (!user) return res.status(401).send({ message: USER_MUST_BE_AUTHENTICATED });
  try {
    const bill = await findBillForUser(user, req.params.id);
    if (!bill) return res.status(401).send({ message: UNAUTHORIZED_ACTION });
    return res.json(toBillDTO(bill));
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const list = async (req, res) => {
  const { user } = req;
  if (!user) return res.status(401).send({ message: USER_MUST_BE_AUTHENTICATED });
  try {
    const bills =
      user.type === "Admin"
        ? await Bill.findAll()
        : await Bill.findAll({ where: { email: user.email } });
    return res.json(bills.map(toBillDTO));
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const update = async (req, res) => {
  const { user } = req;
  if (!user) return res.status(401).send({ message: USER_MUST_BE_AUTHENTICATED });
  try {
    const bill = await findBillForUser(user, req.params.id);
    if (!bill) return res.status(401).send({ message: UNAUTHORIZED_ACTION });
    const updated = await bill.update(pickBillAttributes(req.body));
    return res.json(updated);
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

const remove = async (req, res) => {
  const { user } = req;
  if (!user) return res.status(401).send({ message: USER_MUST_BE_AUTHENTICATED });
  try {
    const bill = await findBillForUser(user, req.params.id);
    if (!bill) return res.status(401).send({ message: UNAUTHORIZED_ACTION });
    await bill.destroy();
    return res.send("Bill removed");
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

module.exports = {
  list,
  get,
  create,
  update,
  remove,
};
