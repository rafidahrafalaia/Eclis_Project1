var CAS            = require('cas-authentication');
var orgCodeDetails = require('./org_code_details.json');

const conn=require("../database/connection")
function Auth(options) {
    this.newPermission= async (req, res, next) => {
      try {  
// app.post("/api/register", (req, res) => {
            const id=uuidv4();
            const name = req.body.name;
            const desc = req.body.desc;
            const system = req.body.system;
            const domain = req.body.domain;
  
            conn.db.query(
                "INSERT INTO permission (id,name,desc,system,domain) VALUES (?,?,?,?,?)",
                [id,name,desc,system,domain],
                (err, result) => {
                console.log(err);
            }
            ); 
        }catch (error) {
                if (error.isJoi === true) error.status = 422
                next(error)
              }
            }
        
        
    this.updatePermission= async (req, res, next) => {
      try {  
    //   app.post("/api/loginUser", (req, res) => {
        const id = req.body.id;
        const name = req.body.name;
        const desc = req.body.desc;
        const system = req.body.system;
        const domain = req.body.domain;
      
  
        conn.db.query(
            "UPDATE permission SET name = ?, description = ?, system_environment = ?, domain_environment = ? WHERE id=?;",
             [name,desc,system,domain,id],
             (err, result) => {
             console.log(err);
         }
         ); 
      }catch (error) {
         if (error.isJoi === true) error.status = 422
         next(error)
       }
     }
}

module.exports = Auth;