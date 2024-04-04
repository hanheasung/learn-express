const express =require('express');

const morgan = require('morgan');

const cookieParser = require('cookie-parser');

const session = require('express-session');

const dotenv = require('dotenv');
const path= require('path');

dotenv.config();
const app = express();

app.set('port',process.env.PORT || 3000);

app.use(morgan('dev'));

app.use ('/',express.static(path.join(__dirname,'public')));

app.use (express.json());

app.use(express.urlencoded({ extended: false}));

app.use(cookieParser(process.env.COOKIS_SECRET));

app.use(session({
    resave: false,
    saveUninitialized:false,
    secret:process.env.COOKIE_SECRET,
    cookie:{
        httpOnly:true,
        secure:false,
    },
    name: 'session-cookie',
}))

app.use((req,res,next) => {
    console.log('모든 다 실행됩니다');
    next();
} )

app.get('/', (req, res, next) => {
    console.log('GET/요청만 실행됨');
    next();
}, (req, res) => { // 수정된 부분
    throw new Error('에러는 에러처리 미들웨어로 감');
});

app.use((err,req,res,next) =>{
    console.error(err);
    res.status(500).send(err.message);
});

app.listen(app.get('port'),() =>{
    console.log(app.get('port'),'번 포트에서 대기중');
}

);
