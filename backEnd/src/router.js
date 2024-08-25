import express from 'express';
import path from 'node:path';
import axios from 'axios';
import { saveDate } from './dataBase.js';
export const router = express.Router();
// 路由中间件
router.use((req, res, next) => {
    console.log('Time: ', Date.now());
    next();
});
// define the home page route
router.get('/(\/)|\/index.html/', (req, res) => {
    res.redirect('/static/index.html');
});
router.get('/static/index.html', (req, res) => {
    res.sendFile(path.join(import.meta.dirname, 'assets', 'index.html'));
});


// 调出测试单元试卷
router.post('/ajax/login', async (req, res) => {
    let { userName, password } = req.body;
    let url = "https://rosaton.rosettastoneclassroom.com/en-US";
    let response_getSession = await axios.get(url);
    let sessionID = response_getSession.headers[ "set-cookie" ][ 0 ].split(";").filter(item => item.includes("_session_id"))?.[ 0 ];

    var config_origin = {
        method: 'post',
        url: `https://rosaton.rosettastoneclassroom.com/en-US`,
        "headers": {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
            "cache-control": "no-cache",
            "content-type": "application/x-www-form-urlencoded",
            "pragma": "no-cache",
            "priority": "u=0, i",
            "sec-ch-ua": "\"Not)A;Brand\";v=\"99\", \"Microsoft Edge\";v=\"127\", \"Chromium\";v=\"127\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "same-origin",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1",
            "cookie": `${ sessionID };logs=0&expire=1723965591251&rum=0`,
            "Referer": "https://rosaton.rosettastoneclassroom.com/en-US",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "data": "utf8=%E2%9C%93&authenticity_token=beZFvAmR9BrrgUl5YhmzJSPtq1P214J9OJ1%2B10bgpGY%3D&login_user%5Buser_name%5D=LeeChen0610&login_user%5Bpassword%5D=123",
    };

    let post = await axios(config_origin);
    var config = {
        method: 'get',
        headers: {
            Host: "rosaton.rosettastoneclassroom.com",
            origin: "https://rosaton.rosettastoneclassroom.com",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko Chrome/127.0.0.0 Safari/537.36 Edg/127.0.0.0",
            Cookie: `${ sessionID };logs=0&expire=1723965591251&rum=0`,
            Referer: `https://rosaton.rosettastoneclassroom.com/en-US/portal/login?utf8=%E2%9C%93&authenticity_token=%2F2pJx23l1uDNmZ3hozk%2BiOQw4RZ2g1NbNNGK5waSlJE%3D&login_user%5Buser_name%5D=${ userName }&login_user%5Bpassword%5D=${ password }`
        },
        url: `https://rosaton.rosettastoneclassroom.com/en-US`,
    };
    let response = await axios(config);
    if (response.status == 200 && response.data.includes(userName)) {
        console.log("用户存在");
        // 记录,存在该用户
        req.db.push("/userList[]", userName);
        res.json({ businessStatus: true, message: "login success" });
    } else {
        console.log("用户不存在");
        console.log(response);
        res.json({ businessStatus: false, message: "check your userName or Password" });
    }
});
// 调出测试单元试卷
router.get('/ajax/getUnit', (req, res) => {
    res.json({ htmlUrl: "http://localhost:3000/static/testFile/unit1.html" });
});
// 调出测试单元试卷答案
router.get('/ajax/getUserAnswer', async (req, res) => {
    if (await req.db.exists("/userTestAnswer[0]")) {
        let data = await req.db.getData("/userTestAnswer[0]");
        res.status(200).json(data);
    } else {
        res.status(200).json({});
    }
});
// 用户提交答案
router.post('/ajax/postUnitTestResult', async (req, res) => {
    await req.db.push("/userTestAnswer[]", req.body);
    res.status(200).json({ status: "success" });
});
