"use strict";
var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var pool = require("../../config/db2");

const output = {

    qna: (req, res, next) => {
        // board/ 로 접속할 경우 전체 목록 표시로 리다이렉팅
        res.redirect("/qna/list/1");
    },
    list: (req,res,next) => {
        pool.getConnection(function (err, connection){
            var sqlForSelectList = "SELECT bno, grpno, title, content, creator_id, passwd, hit FROM qna";
            connection.query(sqlForSelectList, function(err,rows){
                if(err) console.error("err : "+err);
                console.log("rows : " + JSON.stringify(rows));
    
                res.render('fq/qna', {title: '게시판 전체 글 조회', rows: rows});
                connection.release();
            });
        });
    },

    write: (req, res, next) => {
        res.render('fq/write',{title: "게시판 글 쓰기"});
    },

    read: (req,res,next) => {
        var bno = req.params.bno;
        pool.getConnection(function(err,connection){
            var sql = "SELECT bno, title, content, creator_id, hit FROM qna where bno = ?";
            var plushit = "update qna set hit = hit + 1 where bno = ?";
            connection.query(sql,[bno],function(err,row){
                if(err) console.error(err);
                console.log("1개 글 조회 결과 확인 : ",row);
                res.render('fq/read',{title: "글 조회", row:row[0]});
                connection.query(plushit, [bno],function(err,row){
                    if(err) console.error(err);
            });
            connection.release();
        });
    });
    },
    // update: (req,res,next) => {
    //     var idx = req.query.idx;
    
    //     pool.getConnection(function(err,connection){
    
    
    //         if(err) console.error("커넥션 객체 얻어오기 에러 : ",err);
    //         var sql = "select idx, creator_id, title, content, hit from board where idx = ?";
    //         connection.query(sql,[idx],function(err,rows){
    //             if(err) console.error(err);
    //             console.log("update에서 1개 글 조회 결과 확인 : ",rows);
    //             res.render('board/update',{title: "글 수정", row:rows[0]});
    //             connection.release();
    //         });
    //     });
    // },
    // delete: (req,res,next) => {
    //     var idx = req.query.idx;
    
    //     pool.getConnection(function(err,connection){
    
    
    //         if(err) console.error("커넥션 객체 얻어오기 에러 : ",err);
    //         var sql = "select idx, creator_id, title, content, hit from board where idx = ?";
    //         connection.query(sql,[idx],function(err,rows){
    //             if(err) console.error(err);
    //             console.log("delete에서 1개 글 조회 결과 확인 : ",rows);
    //             res.render('board/delete',{title: "글 삭제를 위해 패스워드를 입력하세요.", row:rows[0]});
    //             connection.release();
    //         });
    //     });
    // },
};

const process = {
    write: (req,res,next) => {

        var title = req.body.title;
        var content = req.body.content;
        var creator_id = req.body.creator_id;
        var passwd = req.body.passwd;
        var datas = [title, content, creator_id, passwd];
    
        pool.getConnection(function(err,connection){
    
            //Use the connection
            var sqlForInsertBoard = "insert into qna(title, content, creator_id, passwd) values(?,?,?,?)";
            connection.query(sqlForInsertBoard, datas, function(err,rows){
                if(err) console.error("err : "+err);
                console.log("rows : "+JSON.stringify(rows));
    
                res.redirect('/qna/list/1');
                connection.release();
            });
        });
    },
    // update: (req,res,next) => {
    //     var idx = req.body.idx;
    //     var creator_id = req.body.creator_id;
    //     var title = req.body.title;
    //     var content = req.body.content;
    //     var passwd = req.body.passwd;
    //     var datas = [creator_id,title,content,passwd];
    
    
    //     pool.getConnection(function(err,connection){
    
    //         var sql = "update board set creator_id=?, title=?, content=? where idx=? and passwd=?";
            
    //         connection.query(sql,[creator_id,title,content,idx,passwd],function(err,result){
                
    //             console.log(result);
    //             if(err) console.error("글 수정 중 에러 발생 err : ",err);
    
    //             if(result.affectedRows == 0){
    //                 res.send("<script>alert('패스워드가 일치하지 않거나, 잘못된 요청으로 인해 값이 변경되지 않았습니다.');history.back();</script>");
    //             }
    //             else{
    //                 res.redirect('/board/read/'+idx);
    //             }
    //             connection.release();
    //         });
    //     });
    // },
    // delete: (req,res,next) => {
    //     var idx = req.body.idx;
    //     var passwd = req.body.passwd;
    
    //     pool.getConnection(function(err,connection){
    
    //         var sql = "delete from board where idx=? and passwd=?";
            
    //         connection.query(sql,[idx,passwd],function(err,result){
                
    //             console.log(result);
    //             if(err) console.error("글 삭제 중 에러 발생 err : ",err);
               
    //             res.redirect('/board/');
               
    //             connection.release();
    //         });
    //     });
    // },
};


module.exports = {
   output,
   process,
};
