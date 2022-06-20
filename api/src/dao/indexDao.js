const { pool } = require("../../database");

exports.getUserRows = async () => {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    try {
      const selectUserQuery = "SELECT * FROM Users;";

      const [row] = await connection.query(selectUserQuery);
      return row;
    } catch (err) {
      console.error("getUserRows Query error");
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error("getUserRows DB error");
    return false;
  }
};

exports.insertTodo = async (userIdx, contents, type) => {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    try {
      const query =
        "insert into Todos (userIdx, contents, type) values (?, ?, ?);";

      const params = [userIdx, contents, type];

      const [row] = await connection.query(query, params);
      return row;
    } catch (err) {
      console.error(`insertTodo Query error \n ${err}`);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(`insertTodo DB error \n ${err} `);
    return false;
  }
};

exports.selectTodoByType = async (userIdx, type) => {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    try {
      const query =
        "select todoIdx, contents, status from Todos where userIdx = ? and type = ? and not(status='D');";

      const params = [userIdx, type];

      const [row] = await connection.query(query, params);
      return row;
    } catch (err) {
      console.error(`selectTodoByType Query error \n ${err}`);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(`selectTodoByType DB error \n ${err} `);
    return false;
  }
};

exports.selectValidTodo = async (userIdx, todoIdx) => {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    try {
      const query =
        "select * from Todos where userIdx = ? and todoIdx = ? and not(status='D');";

      const params = [userIdx, todoIdx];

      const [row] = await connection.query(query, params);
      return row;
    } catch (err) {
      console.error(`selectValidTodo Query error \n ${err}`);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(`selectValidTodo DB error \n ${err} `);
    return false;
  }
};

exports.updateTodo = async (userIdx, todoIdx, contents, status) => {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    try {
      const query =
        "update Todos set contents = ifnull(?, contents), status = ifnull(?, status) where userIdx = ? and todoIdx = ?;";

      const params = [contents, status, userIdx, todoIdx];

      const [row] = await connection.query(query, params);

      return row;
    } catch (err) {
      console.error(`insertTodo Query error \n ${err}`);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(`insertTodo DB error \n ${err} `);
    return false;
  }
};

exports.removeTodo = async (userIdx, todoIdx) => {
  try {
    const connection = await pool.getConnection(async (conn) => conn);

    try {
      const query =
        "update Todos set status = 'D' where userIdx = ? and todoIdx = ?;";

      const params = [userIdx, todoIdx];

      const [row] = await connection.query(query, params);

      return row;
    } catch (err) {
      console.error(`removeTodo Query error \n ${err}`);
      return false;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(`removeTodo DB error \n ${err} `);
    return false;
  }
};
