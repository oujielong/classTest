import express from 'express';
import { router } from './router.js';
import path from 'node:path';
import { JsonDB, Config } from 'node-json-db';
const globalDb = new JsonDB(new Config(`${ path.join(import.meta.dirname, 'db', "TeachClass") }`, true, false, '/'));
const app = express();
app.use('/static', express.static(path.join(import.meta.dirname, 'assets')));
app.use('/assets', express.static(path.join(import.meta.dirname, 'assets')));
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
// 应用级中间件
app.use((req, res, next) => {
    req.db = globalDb; // 
    console.log('Time:', Date.now());
    next();
});
// 错误处理
app.use((err, req, res, next) => {
    res.status(500).send('Something broke!');
});
app.use(router);
app.listen(3000);