const express = require('express');
const app = express.Router();
const connection = require('../database');

const { isLoggedIn } = require('../lib/auth');

module.exports = {
    app,
    read(table) {
        app.get('/' + table + '/read', (req, res) => {
            const sql = 'SELECT * FROM ' + table;
            connection.connect()
                .then((client) => {
                    client.query(sql)
                        .then(result => {
                            res.json(result['rows']);
                        })
                        .catch(err => {
                            console.error(err);
                        });
                })
                .catch(err => {
                    console.error(err);
                });
            /*connection.query(sql, (error, results) => {
                if (error) throw error;
                if (results.length > 0) {
                    res.json(results);
                } else {
                    res.send('Not result');*/
        })
    },


    /**
     * Metodo par obtener un registro
     * @param table nombre de la tabla
     */
    readbyid(table) {
        app.get('/' + table + '/read/:id', (req, res) => {
            const { id } = req.params;
            const sql = `SELECT * FROM  ${table}  WHERE id_` + table +  `= ${id}`;
            connection.query(sql, (error, result) => {
                if (error) throw error;

                if (result.length > 0) {
                    res.json(result);
                } else {
                    res.send('Not result');
                }
            });
        });
    },

    /**
     * Metodo para crear el endpoint para registrar
     * @param table nombre de la tabla
     * @param arrayinsert Arreglo con los datos para insertar
     * ejemplo: const arreglo = {'name', 'password'}
     */
    insert(table, arrayinsert) {
        app.post('/' + table + '/insert', (req, res) => {
            const sql = 'INSERT INTO ' + table + ' SET ?';
            let objInsert = {};
            arrayinsert.forEach(function (item, index) {
                objInsert[item] = req.body[item];           //console.log(req.body[item]);
            });
            //console.log(objInsert)
            connection.query(`INSERT INTO ${table} SET ? `, objInsert, (error, result) => {
                if (error){
                    return res.json(error);
                }
                if(result){
                    return res.json(result);
                }
            });
        });
    },

    /**
     * Metodo para crear el endpoint para actualizar
     * @param table nombre de la tabla
     * @param arrayupdate Arreglo con los datos para actualizar
     * ejemplo: const arreglo = {'name', 'password'}
     */
    update(table, arrayupdate) {
        app.put('/' + table + '/update/:id', (req, res) => {
            const { id } = req.params;
            let sqlUpdate = `UPDATE ${table} SET `;
            let cadenaUpdate = "";
            var cont = 0;
            arrayupdate.forEach(function (item, index) {
                //console.log("ITEM" + item);
                if(cont == 0){
                    cadenaUpdate += item + ' = ' + `'` + req.body[item] + `'` + ' ';  
                }else{
                    cadenaUpdate += ' , ' +  item + ' = ' + `'` + req.body[item] + `'` + ' ';
                }
                cont ++;
            });

            sqlUpdate +=  cadenaUpdate + ` WHERE id = ${id} ;`;
            //console.log(sqlUpdate);
            connection.query(sqlUpdate, (error, result) => {
                if (error){
                    return res.json(error);
                }
                if(result){
                    return res.json(result);
                }
            });
        });
    },

    /**
     * Metodo para crear el endpoint para eliminar
     * @param table nombre de la tabla
     */
    delete(table) {
        app.delete('/' + table + '/delete/:id', (req, res) => {
            const { id } = req.params;
            const sql = `DELETE FROM ` + table + ` WHERE id_` + table + ` = ${id}`;

            connection.query(sql, error => {
                if (error) throw error;
                res.end('Delete ' + table + ' successfully');
            });
        });
    },
}
