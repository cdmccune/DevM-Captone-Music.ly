require('dotenv').config()
const{CONNECTION_STRING} = process.env
const Sequelize = require("sequelize")

const sequelize = new Sequelize(CONNECTION_STRING, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    }
})

module.exports = {
    login: (req, res) => {
        sequelize.query(`
        SELECT first_name AS firstName, user_id AS userid, password, email
        FROM users
        WHERE email = '${req.body.email}';
        `).then(dbRes => {
                if (dbRes[1].rows.length < 1) {
                    res.status(400).send("Error: Email not found")
                    return
                } else if ((req.body.password == dbRes[1].rows[0].password)) {
                    delete dbRes[1].rows[0].password
                    delete dbRes[1].rows[0].email
                    res.status(200).send(dbRes[1].rows[0])
                    return
                } else {
                    res.status(400).send("Error: Incorrect password")
                }
            })
    },
    createAcc: (req, res) => {
        sequelize.query(`
        SELECT email
        FROM users
        WHERE email = '${req.body.email}';
        `).then(dbRes => {
                if (dbRes[1].rows.length > 1) {
                    res.status(400).send("Error: Email already exists")
                    return
                } else {
                    sequelize.query(`
                    INSERT INTO users (email, password, first_name, last_name)
                    VALUES ('${req.body.email}', '${req.body.password}', '${req.body.first}', '${req.body.last}');

                    SELECT user_id AS userID 
                    FROM users
                    WHERE email = '${req.body.email}';
                    `)
                    .then((dbRes2 => {
                        userID = dbRes2[0][0]
                        res.status(200).send(userID)
                    }))
                  
                    
                }
            })
    }
}