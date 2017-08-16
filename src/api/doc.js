var dbConnection = require('../db/index')
var log = require('../utils/log')
var resDataUtil = require('../utils/resDataUtil')
var util = require('../utils/util')

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
      log.warn("IP:" + req._remoteAddress + " 文档列表为空!")
      res.end(resDataUtil.error([], '文档列表为空!'));
    }
  })
}
/**
 * 新增文档
 * @param {*} req 
 * @param {*} res 
 */
const addDoc = (req, res) => {
  var param = req.query;
  if (req.session.user) {
    if (!util.checkParams('doc_name', param) || !util.checkParams('parent_id', param) || !util.checkParams('desc', param)) {
      res.end(resDataUtil.error([], '参数错误'));
    }
    var sql = "insert into docSystem.doc (user_id,doc_name,type,parent_id,mark_key,`desc`) values(?,?,?,?,?,?);"
    var sqlData = [req.session.user.id, param.doc_name, 0, param.parent_id, '', param.desc]
    dbConnection.mysqlDB.execQuery(sql, sqlData, (rows) => {
      if (rows.affectedRows > 0) {
        res.end(resDataUtil.success('操作成功'));
      } else {
        log.warn("IP:" + req._remoteAddress + " 操作失败!")
        res.end(resDataUtil.error([], '操作失败!'));
      }
    })
  }
  else {
    res.end(resDataUtil.error([], '用户未登录!'));
  }
}

const editDoc = (req, res) => {
  var param = req.query;
  console.log(req.session)
  if (req.session.user) {
    if (!util.checkParams('id', param) || !util.checkParams('mark_key', param)) {
      res.end(resDataUtil.error([], '参数错误'));
    }
    var sql = "update docSystem.doc set mark_key = ? where id = ?;"
    var sqlData = [param.mark_key, param.id]
    dbConnection.mysqlDB.execQuery(sql, sqlData, (rows) => {
      if (rows.affectedRows > 0) {
        res.end(resDataUtil.success('操作成功'));
      } else {
        log.warn("IP:" + req._remoteAddress + " 操作失败!")
        res.end(resDataUtil.error([], '操作失败!'));
      }
    })
  }
  else {
    res.end(resDataUtil.error([], '用户未登录!'));
  }
}
const delDoc = (req, res) => {
  var param = req.query;
  if (req.session.user) {
    if (!util.checkParams('id', param)) {
      res.end(resDataUtil.error([], '参数错误'));
    }
    var sql = "delete docSystem.doc where id = ?;"
    var sqlData = [param.id]
    dbConnection.mysqlDB.execQuery(sql, sqlData, (rows) => {
      if (rows.affectedRows > 0) {
        res.end(resDataUtil.success('操作成功'));
      } else {
        log.warn("IP:" + req._remoteAddress + " 操作失败!")
        res.end(resDataUtil.error([], '操作失败!'));
      }
    })
  }
  else {
    res.end(resDataUtil.error([], '用户未登录!'));
  }
}

module.exports = {
  getDocList,
  addDoc,
  editDoc,
  delDoc
}