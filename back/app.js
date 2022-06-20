const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv');
const passport  = require('passport');
const passportConfig = require('./config/passport');
const RESPONSE=require('./config/responseState');
const db_controller =require('./dbms/db_controller');
const db = require('./models');
const cors = require('cors')

const {locationXYupdate}=require('./dbms/services/apiInfoUpdateType1')

const dealRouter=require('./express/routes');

dotenv.config();
passportConfig();


db_controller.start()
.then(async (result)=>{
    console.log("데이터 베이스 연동 성공");
    if(false){
        db_controller.update(db)
        .then(res=>{
            if(res.state){
                console.log("데이터베이스 최신화 완료")
            }
            else{
                console.log("데이터베이스 최신화 실패")
            }
        })
        .catch((error)=>{
            console.log("데이터베이스 최신화 실패")
        })
    }
})
.catch((error)=>{
    console.log("데이터 베이스 연동 실패");
})






app=express();
app.set('port',process.env.PORT||7000);

app.use(morgan('dev'));
app.use(cors({
    origin:'http://127.0.0.1:3000',
    credentials:true,
}))
app.get('/favicon.ico',(req,res)=>{
    res.status(404);
});
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(session({
        resave:false,
        saveUninitialized:false,
        secret:process.env.COOKIE_SECRET,
        maxAge:5*60,
        cookie:{
            httpOnly:true,
            maxAge:5*60,
        },
        name:"session-cookie",
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/',dealRouter);


app.use((req,res,next)=>{
        next(RESPONSE.ROUTE_NOT_FIND);
});
app.use((error,req,res,next)=>{
    if(error.code){
        console.error(error)
    } else{
        let err=RESPONSE.ROUTE_ERROR;
        err.message=error;
        console.error(err)
    };
    res.status(500).send("페이지를 찾을 수 없습니다.");
});



app.listen(app.get('port'),()=>{
    console.log(`서버 작동중 - PORT:${app.get('port')}`)
});