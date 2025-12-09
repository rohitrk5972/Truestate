// backend/src/controllers/customerController.js
import Customer from "../models/Customer.js";

export const getCustomers = async (req, res) => {
  try {
    const {
      search,
      region,
      gender,
      category,
      tags,
      payment,
      startDate,
      endDate,
      sort,
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};

    // Search (name or phone)
    if (search) {
      const s = String(search).trim();
      query.$or = [
        { customerName: { $regex: s, $options: "i" } },
        { phoneNumber: { $regex: s, $options: "i" } },
      ];
    }

    const parseCsv = (val) => (val ? String(val).split(",").map((v) => v.trim()).filter(Boolean) : null);

    const regions = parseCsv(region);
    if (regions && regions.length) query.customerRegion = { $in: regions };

    const genders = parseCsv(gender);
    if (genders && genders.length) query.gender = { $in: genders };

    const categories = parseCsv(category);
    if (categories && categories.length) query.category = { $in: categories };

    const tagsArr = parseCsv(tags);
    if (tagsArr && tagsArr.length) query.tags = { $in: tagsArr };

    const payments = parseCsv(payment);
    if (payments && payments.length) query.paymentMethod = { $in: payments };

    // Date range
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    // Sorting
    let sortObj = { createdAt: -1 };
    if (sort === "name_asc") sortObj = { customerName: 1 };
    else if (sort === "date_desc") sortObj = { date: -1 };
    else if (sort === "quantity_desc") sortObj = { quantity: -1 };

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const lim = Math.max(1, parseInt(limit, 10) || 10);
    const skip = (pageNum - 1) * lim;

    const [data, total] = await Promise.all([
      Customer.find(query).sort(sortObj).skip(skip).limit(lim).lean(),
      Customer.countDocuments(query),
    ]);

    res.json({ data, total });
  } catch (err) {
    console.error("getCustomers error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
