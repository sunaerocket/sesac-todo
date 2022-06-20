const { pool } = require("../../database");

exports.insertUser = async (email, password, nickname) => {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    try {
      const query =
        "insert into Users (email, password, nickname) values(?, ?, ?);";
      const params = [email, password, nickname];

      const [row] = await connection.query(query, params);

      return row;
    } catch (err) {
      console.error("insertUser Query error");
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error("insertUser DB error");
    return false;
  }
};

exports.selectUserByEmail = async (email) => {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    try {
      const query = "select * from Users where email = ?;";
      const params = [email];

      const [row] = await connection.query(query, params);

      return row;
    } catch (err) {
      console.error("selectUserByEmail Query error");
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error("selectUserByEmail DB error");
    return false;
  }
};

exports.selectUser = async (email, password) => {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    try {
      const query = "select * from Users where email = ? abd password = ?;";
      const params = [email, password];

      const [row] = await connection.query(query, params);

      return row;
    } catch (err) {
      console.error("selectUser Query error");
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error("selectUser DB error");
    return false;
  }
};

exports.selectNicknameByUserIdx = async (userIdx) => {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    try {
      const query = "select * from Users where userIdx = ?;";
      const params = [userIdx];

      const [row] = await connection.query(query, params);

      return row;
    } catch (err) {
      console.error("selectUser Query error");
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error("selectUser DB error");
    return false;
  }
};
