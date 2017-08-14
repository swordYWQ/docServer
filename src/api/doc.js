var dbConnection = require('../db/index')
var log = require('../util/log')
var resDataUtil = require('../util/resDataUtil')
/**
 * 获取文档列表
 * @param {*} req 
 * @param {*} res 
 */
const getDocList = (req, res) => {
  var param = req.query;
  var sql = "select * from docSystem.doc;"
  dbConnection.mysqlDB.execQuery(sql, {}, (rows) => {
    if (rows.length > 0) {
      var result = [];
      for (let i = 0; i < rows.length; i++) {
        if (rows[i].parent_id == 0) {
          result.push({
            id: rows[i].id,
            doc_name: rows[i].doc_name,
            mark_key: rows[i].mark_key,
            children: []
          })
        }
      }
      result.forEach(item => {
        for (let i = 0; i < rows.length; i++) {
          if (rows[i].parent_id == item.id) {
            item.children.push({
              id: rows[i].id,
              doc_name: rows[i].doc_name,
              mark_key: rows[i].mark_key
            })
          }
        }
      })
      res.end(resDataUtil.success(result));
    } else {
      log.warn("登录IP:" + req._remoteAddress + " 文档列表为空!")
      res.end(resDataUtil.error([], '文档列表为空!'));
    }
  })
}

module.exports = {
  getDocList
}