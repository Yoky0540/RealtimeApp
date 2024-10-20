const express = require("express");
const Router = express.Router();
const { v4: uuidv4 } = require("uuid");
const { seq, QueryTypes } = require("../../config/db");

Router.post("/confirm_order", async (req, res) => {
  const updateOrder = `UPDATE tb_order SET order_status = 1 WHERE id = :id`;
  const t = await seq.transaction();
  try {
    const { id } = req.body;

    // Execute the update query
    await seq.query(updateOrder, {
      replacements: { id },
      transaction: t,
      type: QueryTypes.UPDATE,
    });

    // Fetch the updated data using the id from the request
    const [fetchData] = await seq.query(
      `SELECT * FROM tb_order WHERE id = :id`,
      {
        replacements: { id },
        transaction: t,
        type: QueryTypes.SELECT,
      }
    );

    await t.commit();
    req.app.io.emit("confirm_order", fetchData);
    res.json(fetchData);
  } catch (err) {
    await t.rollback();
    res.send(err.toString());
  }
});

Router.get("/order_list", async (req, res) => {
  try {
    const orderAll = "SELECT * FROM tb_order ORDER BY id ASC ";
    const data = await seq.query(orderAll, { type: QueryTypes.SELECT });
    res.json(data);
  } catch (err) {
    res.send(err.toString());
  }
});

Router.post("/add_order", async (req, res) => {
  const t = await seq.transaction();
  try {
    const { product, unit_price, amount } = req.body;

    const [insertResult] = await seq.query(
      `
          INSERT INTO tb_order (order_id, product, amount , unit_price , total)
          VALUES (:order_idx, :productx, :amountx , :unit_pricex ,:totalx);
        `,
      {
        replacements: {
          order_idx: uuidv4(),
          productx: product,
          amountx: amount,
          unit_pricex: unit_price,
          totalx: amount * unit_price,
        },
        transaction: t,
        type: QueryTypes.INSERT,
      }
    );

    const [fetchData] = await seq.query(
      `
          SELECT * FROM tb_order WHERE id = :insertId;
        `,
      {
        replacements: {
          insertId: insertResult,
        },
        transaction: t,
        type: QueryTypes.SELECT,
      }
    );
    await t.commit();
    req.app.io.emit("order", fetchData);
    res.json(fetchData);
  } catch (err) {
    await t.rollback();
    res.send(err.toString());
  }
});

module.exports = Router;
