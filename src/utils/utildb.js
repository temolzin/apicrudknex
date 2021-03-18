const express = require('express');
const mysql = require('mysql');
const app = express.Router();
const connection = require('../database');

const { isLoggedIn } = require('../lib/auth')

module.exports = {
    app,
    
    /**
     * Metodo para obtener todos los registros
     * @param table nombre de la tabla
     */
    read(table) {
        app.get('/' + table + '/read', isLoggedIn, async (req, res) => {
            await connection.query(`SELECT * FROM ${table} `, (error, result) => {
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
     * Metodo par obtener un registro
     * @param table nombre de la tabla
     */
    readbyid(table) {
        app.get('/' + table + '/read/:id', isLoggedIn, async (req, res) => {
            const { id } = req.params;
            await connection.query(`SELECT * FROM  ${table}  WHERE id = ${id}`, (error, result) => {
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
     * Metodo para crear el endpoint para registrar
     * @param table nombre de la tabla
     * @param arrayinsert Arreglo con los datos para insertar
     * ejemplo: const arreglo = {'name', 'password'}
     */
    insert(table, arrayinsert) {
        app.post('/' + table + '/insert', isLoggedIn, async (req, res) => {
            const objInsert = {};
            arrayinsert.forEach(function (item, index) {
                objInsert[item] = req.body[item];           //console.log(req.body[item]);
            });
            //console.log(objInsert)
            const result = await connection.query(`INSERT INTO ${table} SET ? ` , objInsert);
            //console.log(result);
            if(result.affectedRows != 0){
                return res.json(result)
            }else{
                return res.json( {message: `fail to Insert ${table}`} );
            }         
        });
    },

    /**
     * Metodo para crear el endpoint para actualizar
     * @param table nombre de la tabla
     * @param arrayupdate Arreglo con los datos para actualizar
     * ejemplo: const arreglo = {'name', 'password'}
     */
    update(table, arrayupdate) {
        app.put('/' + table + '/update/:id', isLoggedIn, async (req, res) => {
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
            const result = await connection.query(sqlUpdate);
            //console.log(result)
            if(result.affectedRows != 0){
                return res.json(result)
            }else{
                return res.json( {message: `fail to update ${table}`} );
            }
        });
    },

    /**
     * Metodo para crear el endpoint para eliminar
     * @param table nombre de la tabla
     */
    delete(table) {
        app.delete('/' + table + '/delete/:id', async (req, res) => {
            const { id } = req.params;
            const result = await connection.query( `DELETE FROM ${table}  WHERE id = ${id}` );
            //console.log(result)
            if(result.affectedRows != 0){
                return res.json(result)
            }else{
                return res.json( {message: `fail to delete ${table}`} );
            }
        });
    },
}
