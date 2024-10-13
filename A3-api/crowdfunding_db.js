const express = require('express')
const mysql = require('mysql2')
const cors = require('cors')
const app = express()
// 端口号
const PORT = 3002
// 解析
app.use(express.json())
// 解决跨域问题
app.use(cors())
// 配置数据库信息
const db = mysql.createConnection({
  host: 'localhost', // IP
  user: 'root', // 用户名
  password: '123456', // 密码
  database: 'crowdfunding_db2', // 数据库名称
})
db.connect(err => {
  if (err) {
    return new Error('数据库连接失败')
  }
})

// 获取首页列表
app.get('/fundraisers', (req, res) => {
  db.query(
    `
    SELECT f.*, c.NAME AS CATEGORY_NAME 
    FROM fundraisers f 
    JOIN categories c ON f.CATEGORY_ID = c.CATEGORY_ID
    WHERE f.ACTIVE = 1;
  `,
    (err, results) => {
      if (err) {
        res.status(500).json({ error: '服务端错误' })
      } else {
        res.json(results)
      }
    }
  )
})

// 获取分类
app.get('/categories', (req, res) => {
  db.query('SELECT * FROM categories', (err, results) => {
    if (err) {
      res.status(500).json({ error: '服务端错误' })
    } else {
      res.json(results)
    }
  })
})
app.get('/search', (req, res) => {
  const { ORGANIZER, CAPTION, TARGET_FUNDING, CURRENT_FUNDING, CITY, ACTIVE, CATEGORY_ID } = req.query
  const isEmpty = parameter => {
    return parameter !== null && parameter !== undefined && parameter !== '' && parameter !== 'null' && parameter !== 'undefined'
  }
  let query = `
    SELECT f.*, c.NAME AS CATEGORY_NAME 
    FROM fundraisers f 
    JOIN categories c ON f.CATEGORY_ID = c.CATEGORY_ID
    WHERE 1=1
  `
  // 保存查询参数的数组
  const queryParams = []

  // 根据条件动态添加查询参数
  if (isEmpty(ORGANIZER)) {
    query += ' AND f.ORGANIZER = ?'
    queryParams.push(ORGANIZER)
  }
  if (isEmpty(CAPTION)) {
    query += ' AND f.CAPTION = ?'
    queryParams.push(CAPTION)
  }
  if (isEmpty(TARGET_FUNDING)) {
    query += ' AND f.TARGET_FUNDING = ?'
    queryParams.push(TARGET_FUNDING)
  }
  if (isEmpty(CURRENT_FUNDING)) {
    query += ' AND f.CURRENT_FUNDING = ?'
    queryParams.push(CURRENT_FUNDING)
  }
  if (isEmpty(CITY)) {
    query += ' AND f.CITY = ?'
    queryParams.push(CITY)
  }
  if (isEmpty(ACTIVE)) {
    query += ' AND f.ACTIVE = ?'
    queryParams.push(Number(ACTIVE))
  }
  if (isEmpty(CATEGORY_ID)) {
    query += ' AND f.CATEGORY_ID = ?'
    queryParams.push(Number(CATEGORY_ID))
  }

  // 执行查询
  db.query(query, queryParams, (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message })
    } else {
      res.json(results)
    }
  })
})

// 查询详情
app.get('/fundraiser/:id', (req, res) => {
  const fundraiserId = req.params.id
  //  fundraisers 表中选择所有列
  // c.NAME AS CATEGORY_NAME: 查询categories表 把NAME重命名CATEGORY_NAME
  const query = `
    SELECT f.*, c.NAME AS CATEGORY_NAME 
    FROM fundraisers f 
    JOIN categories c ON f.CATEGORY_ID = c.CATEGORY_ID
    WHERE f.FUNDRAISER_ID = ?
  `
  db.query(query, [fundraiserId], (err, results) => {
    if (err) {
      res.status(500).json({ message: '服务端错误' })
    } else {
      // 返回符合条件的
      res.json(results[0])
    }
  })
})

// 查询 捐赠列表
app.get('/donations', (req, res) => {
  const fundraiserId = req.query.id
  const query = `
    SELECT  
      DONATION_ID, 
      DATE_FORMAT(DATE, '%Y-%m-%d %H:%i:%s') AS dateStr, 
      AMOUNT, 
      GIVER, 
      FUNDRAISER_ID  
    FROM donation WHERE FUNDRAISER_ID = ? ORDER BY DATE DESC;
  `
  db.query(query, [fundraiserId], (err, results) => {
    if (err) {
      res.status(500).json({ message: '服务端错误' })
    } else {
      res.json(results)
    }
  })
})

// 删除筹款活动
app.delete('/fundraisers/:id', (req, res) => {
  if (req.params.id === null || req.params.id === undefined) res.status(401).json({ error: 'ID 为必传项' })
  db.query('DELETE FROM fundraisers WHERE id = ?;', [req.params.id], (err, results) => {
    if (err) res.status(500).json({ error: '服务端错误' })
    res.json({ message: 'successfully delete' })
  })
})

// 新增捐款信息
app.post('/donation', (req, res) => {
  const { AMOUNT, GIVER, FUNDRAISER_ID } = req.body
  const isEmpty = parameter => {
    return parameter !== null && parameter !== undefined && parameter !== '' && parameter !== 'null' && parameter !== 'undefined'
  }
  if (!isEmpty(AMOUNT) || !isEmpty(GIVER) || !isEmpty(FUNDRAISER_ID)) {
    return res.status(400).json({ error: 'parameter error' })
  }

  // 使用事务需要同时更新fundraiser表CURRENT_FUNDING
  db.beginTransaction(err => {
    if (err) res.status(500).json({ error: err.message })
    const query = `
      INSERT INTO donation (DATE, AMOUNT, GIVER, FUNDRAISER_ID)
      VALUES (?, ?, ?, ?)
    `
    db.query(query, [new Date(), AMOUNT, GIVER, Number(FUNDRAISER_ID)], (err, result) => {
      if (err) {
        return db.rollback(() => {
          res.status(500).json({ error: err.message })
        })
      }

      // 更新fundraisers表sql
      const updateQuery = `
        UPDATE fundraisers
        SET CURRENT_FUNDING = CURRENT_FUNDING + ?
        WHERE FUNDRAISER_ID = ?
      `
      db.query(updateQuery, [AMOUNT, Number(FUNDRAISER_ID)], (err, updateResult) => {
        if (err) {
          return db.rollback(() => {
            res.status(500).json({ error: err.message })
          })
        }
        // 提交
        db.commit(err => {
          if (err) {
            return db.rollback(() => {
              res.status(500).json({ error: err.message })
            })
          }
          res.status(200).json({ message: 'succeed' })
        })
      })
    })
  })
})
// 新增筹款活动
app.post('/fundraisers', (req, res) => {
  const { organizer, caption, targetFunding, currentFunding, city, active, intro } = req.body
  const sql = `INSERT INTO fundraisers (ORGANIZER, CAPTION, TARGET_FUNDING, CURRENT_FUNDING, CITY, ACTIVE, INTRO) VALUES (?, ?, ?, ?, ?, ?, ?)`
  db.query(sql, [organizer, caption, targetFunding, currentFunding, city, active, intro], (err, result) => {
    if (err) return res.status(500).json({ error: err, message })
    res.status(201).json({ message: 'New success！' })
  })
})

// 启动项目
app.listen(PORT, () => {
  console.log('启动成功： http://localhost:' + PORT)
})
