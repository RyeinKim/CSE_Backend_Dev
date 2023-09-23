const Post = require('../models/posts');
const mysql = require('mysql');
const { devlog, errorlog} = require("../config/config");
const db = require("../config/database");
const userUtils = require("../utils/userUtils");

/**
 * 회원가입
 * 게시글쓰기
 * 유저 ID로 유저이름 가져오기
 * 모든 게시글 불러오기
 * 게시글 ID로 게시글 불러오기
 * 게시글 ID로 게시글 삭제하기
 * 유저 ID로 게시글 목록 불러오기
 */

// 회원가입
exports.registerUser = async (req, res) => {
    const { email, username, password, phoneNumber } = req.body;

    if (!email || !username || !password || !phoneNumber) {
        return res.status(400).json({ error: 'Email, Username, Password, PhoneNumber are required.' });
    }

    const reqData = {
        email: mysql.escape(email),
        username: mysql.escape(username),
        password: mysql.escape(password),
        phoneNumber: mysql.escape(phoneNumber)
    }

    try {
        const user_id = await Post.registerUser(reqData);
        return res.status(201).json({ message: `Register Success. Your id is ${user_id}` });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred' });
    }
}

// 게시글 쓰기
exports.writePost = async (req, res) => {
    const tableName = req.params.tableName;
    const { title, content } = req.body;
    const { user_id } = req.session; // 로그인한 사용자의 user_id
    devlog(`[Cont] Post / writePost - user_id = ${user_id}`);

    if (!title) {
        return res.status(400).json({ error: 'Title is required.' });
    }

    if (!content) {
        return res.status(400).json({ error: 'Content is required.' });
    }

    if (!user_id) {
        return res.status(401).json({ error: 'Authentication required.' });
    }

    try {
        // user_id를 사용하여 사용자 정보 조회
        const user = await userUtils.getUserByUserId(user_id);

        if (!user) {
            return res.status(401).json({ error: 'User not found.' });
        }

        const reqData = {
            title: title,
            content: content,
            author: user.username,
            author_id: user_id,
            tableName: tableName,
        };

        // 게시글 작성
        const post_id = await Post.writePost(reqData);

        return res.status(201).json({ message: `Upload post Success. Post ID is ${post_id}` });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred' });
    }
}

// 모든 게시글 불러오기
exports.getPostsAll = async (req, res) => {
    const tableName = req.params.tableName;
    const offset = parseInt(req.query.offset);
    const limit = parseInt(req.query.limit);

    if (offset === undefined || offset === null || isNaN(offset) || offset < 0) {
        return res.status(400).json({ code: 'invalid_offset' });
    }

    if (!limit || isNaN(limit) || limit < 1) {
        return res.status(400).json({ code: 'invalid_limit' });
    }

    try {
        const totalPostsResults = await new Promise((resolve, reject) => {
            let totalPostsQuery;
            switch (tableName) {
                case 'free':
                    totalPostsQuery = `SELECT COUNT(*) AS totalPosts FROM posts.FreeBoard;`;
                    break;
                case 'notice':
                    totalPostsQuery = `SELECT COUNT(*) AS totalPosts FROM posts.NoticeBoard;`;
                    break;
                case 'posts':
                    totalPostsQuery = `SELECT COUNT(*) AS totalPosts FROM posts.posts;`;
                    break;
            }
            db.connection.query(totalPostsQuery, (error, results) => {
                if (error) reject(error);
                resolve(results);
            });
        });

        const totalPosts = totalPostsResults[0].totalPosts;
        devlog(`[Cont] posts / getPostByUserId totalPosts = ${totalPosts}`);

        const reqData = {
            offset: offset,
            limit: limit,
            tableName: tableName,
        };

        const posts = await Post.getPostsAll(reqData);

        devlog(`getPostsAll Controllers`);
        devlog(`resData = ${posts}`);

        return res.status(200).json({ totalPosts: totalPosts, message: posts });

    } catch (error) {
        console.log(error);
        return res.status(500).json({message: '내부 서버 오류'});
    }
}
/*exports.getPostsAll = async (req, res) => {
    const offset = parseInt(req.query.offset);
    const limit = parseInt(req.query.limit);

    if (offset === undefined || offset === null || isNaN(offset) || offset < 0) {
        return res.status(400).json({ code: 'invalid_offset' });
    }

    if (!limit || isNaN(limit) || limit < 1) {
        return res.status(400).json({ code: 'invalid_limit' });
    }

    try {
        const totalPostsResults = await new Promise((resolve, reject) => {
            const totalPostsQuery = `SELECT COUNT(*) AS totalPosts FROM posts;`;
            db.connection.query(totalPostsQuery, (error, results) => {
                if (error) reject(error);
                resolve(results);
            });
        });

        const totalPosts = totalPostsResults[0].totalPosts;
        devlog(`[Cont] posts / getPostByUserId totalPosts = ${totalPosts}`);

        const reqData = {
            offset: offset,
            limit: limit,
        };

        const posts = await Post.getPostsAll(reqData);

        devlog(`getPostsAll Controllers`);
        devlog(`resData = ${posts}`);

        return res.status(200).json({ totalPosts: totalPosts, message: posts });

    } catch (error) {
        console.log(error);
        return res.status(500).json({message: '내부 서버 오류'});
    }
}*/

// 게시글 ID로 게시글 불러오기
exports.getPostByPostId = async (req, res) => {
    const { tableName, post_id } = req.params;

    const reqData = {
        tableName: tableName,
        post_id: post_id,
    }

    try {
        const post = await Post.getPostByPostId(reqData);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        return res.status(200).json(post);
    } catch (error) {
        errorlog(error);
        return res.status(500).json({ error: '내부 서버 오류' });
    }
}

// 게시글 ID로 게시글 삭제하기
exports.deletePostById = async (req, res) => {
    const { tableName, post_id } = req.params;

    const reqData = {
        tableName: tableName,
        post_id: post_id,
    }

    try {
        const post = await Post.deletePostById(reqData);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        return res.status(204).end();
    } catch (error) {
        return res.status(500).json({ error: '내부 서버 오류' });
    }
}

// 삭제된 게시글 불러오기
exports.getDeletedPosts = async (req, res) => {
    const tableName = req.params.tableName;
    const offset = parseInt(req.query.offset);
    const limit = parseInt(req.query.limit);

    if (offset === undefined || offset === null || isNaN(offset) || offset < 0) {
        return res.status(400).json({ code: 'invalid_offset' });
    }
    if (!limit || isNaN(limit) || limit < 1) {
        return res.status(400).json({ code: 'invalid_limit' });
    }

    try {
        const totalDelPostsResults = await new Promise((resolve, reject) => {
            let totalDelPostsQuery;
            switch(tableName) {
                case 'free':
                    totalDelPostsQuery = `SELECT COUNT(*) AS totalPosts FROM del_posts.del_free;`;
                    break;
                case 'notice':
                    totalDelPostsQuery = `SELECT COUNT(*) AS totalPosts FROM del_posts.del_notice;`;
                    break;
                case 'posts':
                    totalDelPostsQuery = `SELECT COUNT(*) AS totalPosts FROM del_posts.delete_posts;`;
                    break;
            }

            db.connection.query(totalDelPostsQuery, (error, results) => {
                if (error) reject(error);
                resolve(results);
            });
        });

        const totalPosts = totalDelPostsResults[0].totalPosts;

        const reqData = {
            offset: offset,
            limit: limit,
            tableName: tableName,
        };

        const posts = await Post.getDeletedPosts(reqData);
        devlog(`getDeletedPosts Controllers`);
        devlog(`resData = ${posts}`);
        return res.status(200).json({ totalPosts: totalPosts, message: posts });

    } catch (error) {
        console.log(error);
        return res.status(500).json({message: '내부 서버 오류'});
    }
}

// 유저 ID로 게시글 목록 불러오기
exports.getPostByUserId = async (req, res) => {
    const offset = parseInt(req.query.offset);
    const limit = parseInt(req.query.limit);
    const { tableName, user_id } = req.params;

    if (offset === undefined || offset === null || isNaN(offset) || offset < 0) {
        return res.status(400).json({ code: 'invalid_offset' });
    }

    if (!limit || isNaN(limit) || limit < 1) {
        return res.status(400).json({ code: 'invalid_limit' });
    }

    const reqData = {
        user_id: user_id,
        tableName: tableName,
        offset: offset,
        limit: limit,
    };

    try {
        const totalPostsResults = await new Promise((resolve, reject) => {
            let totalPostsQuery;
            switch(tableName) {
                case 'free':
                    totalPostsQuery = `SELECT COUNT(*) AS totalPosts FROM posts.FreeBoard WHERE author_id = ?;`;
                    break;
                case 'notice':
                    totalPostsQuery = `SELECT COUNT(*) AS totalPosts FROM posts.NoticeBoard WHERE author_id = ?;`;
                    break;
                case 'posts':
                    totalPostsQuery = `SELECT COUNT(*) AS totalPosts FROM posts.posts WHERE author_id = ?;`;
                    break;
            }

            db.connection.query(totalPostsQuery, user_id, (error, results) => {
                if (error) reject(error);
                resolve(results);
            });
        });
        const totalPosts = totalPostsResults[0].totalPosts;

        const posts = await Post.getPostByUserId(reqData);
        devlog(`[Cont] Posts / getPostByUserId posts = ${posts}`);
        if (!posts) {
            return res.status(404).json({ message: 'Post not found' });
        }
        return res.status(200).json({ totalPosts: totalPosts, message: posts});
    } catch (error) {
        return res.status(500).json({ error: '내부 서버 오류' });
    }
}

/*
 Callback 함수 사용한 소스
exports.registerUser = (req, res) => {
    const {email, username, password, phoneNumber } = req.body;

    if (!email || !username || !password || !phoneNumber) {
        return res.status(400).json({ error: 'Email, Username, Password, PhoneNumber are required.' });
    }

    if (email === null || username === null || password === null || phoneNumber === null) {
        return res.status(400).json({ error: 'Email, Username, Password, PhoneNumber are required.' });
    }

    const reqData = {
        email: mysql.escape(email),
        username: mysql.escape(username),
        password: mysql.escape(password),
        phoneNumber: mysql.escape(phoneNumber)
    }

    Post.registerUser(reqData, (error, user_id) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'An error occurred' });
        }

        const resData = {
            user_id: user_id
        };

        return res.status(201).json({ message: `Register Success. Your id is ${resData.user_id}` });
    });
}

// 게시글쓰기
exports.writePost = (req, res) => {
    const { title, content } = req.body;
    const { user_id } = req.session; // 로그인한 사용자의 user_id

    if (!title || title === null) {
        return res.status(400).json({ error: 'Title is required.' });
    }

    if (!content || content === null) {
        return res.status(400).json({ error: 'Content is required.' });
    }

    if (!user_id) {
        return res.status(401).json({ error: 'Authentication required.' });
    }

    // user_id를 사용하여 사용자 정보 조회
    Post.getUserById(user_id, (error, user) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'An error occurred' });
        }

        if (!user) {
            return res.status(401).json({ error: 'User not found.' });
        }

        const reqData = {
            title: mysql.escape(title),
            content: mysql.escape(content),
            author: mysql.escape(user.username), // 사용자 정보에서 username 사용
            author_id: mysql.escape(user_id),
        }

        Post.writePost(reqData, (error, post_id) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: 'An error occurred' });
            }

            return res.status(201).json({ message: `Upload post Success. Post ID is ${post_id}` });
        });
    });
}

// 유저 ID로 유저이름 가져오기
exports.getUserById = (req, res) => {
    const user_id = req.params.user_id;

    Post.getUserById(user_id, (error, user) => {
        if (error) {
            return res.status(500).json({ error: 'An error occurred' });
        }

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json(user);
    });
}

// 모든 게시글 불러오기
exports.getPostsAll = (req, res) => {
    const { offset, limit } = req.query;

    if (!offset || isNaN(offset) || offset < 0) {
        return res.status(400).json({ code: 'invalid_offset' });
    }
    if (!limit || isNaN(limit) || limit < 1) {
        return res.status(400).json({ code: 'invalid_limit' });
    }
    // 총 게시글 수 조회 쿼리
    const totalPostsQuery = `SELECT COUNT(*) AS totalPosts FROM posts;`;

    db.connection.query(totalPostsQuery, (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).json({message: '내부 서버 오류'});
        }

        const totalPosts = results[0].totalPosts;

        const reqData = {
            offset: offset,
            limit: limit,
        };

        Post.getPostsAll(reqData, (error, posts) => {
            if (error) {
                console.log(error);
                return res.status(500).json({message: '내부 서버 오류'});
            } else {
                devlog(`getPostsAll Controllers`);
                devlog(`resData = ${posts}`);
                return res.status(200).json({ totalPosts: totalPosts, message: posts});
            }
        })
    })
}

exports.getPostById = (req, res) => {
    const post_id = req.params.post_id;

    Post.getPostById(post_id, (error, post) => {
        if (error) {
            return res.status(500).json({ error: '내부 서버 오류' });
        }

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        return res.status(200).json(post);
    })
}

// 게시글 ID로 게시글 삭제하기
exports.deletePostById = (req, res) => {
    const post_id = req.params.post_id;

    Post.deletePostById(post_id, (error, post) => {
        if (error) {
            return res.status(500).json({ error: '내부 서버 오류' });
        }

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        return res.status(204).end();
    });
}

// 삭제된 게시글 불러오기
exports.getDeletedPosts = (req, res) => {
    const { offset, limit } = req.query;

    if (!offset || isNaN(offset) || offset < 0) {
        return res.status(400).json({ code: 'invalid_offset' });
    }
    if (!limit || isNaN(limit) || limit < 1) {
        return res.status(400).json({ code: 'invalid_limit' });
    }

    // 총 게시글 수 조회 쿼리
    const totalPostsQuery = `SELECT COUNT(*) AS totalPosts FROM delete_posts;`;

    db.connection.query(totalPostsQuery, (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).json({message: '내부 서버 오류'});
        }

        const totalPosts = results[0].totalPosts;

        const reqData = {
            offset: offset,
            limit: limit,
        };

        Post.getDeletedPosts(reqData, (error, posts) => {
            if (error) {
                console.log(error);
                return res.status(500).json({message: '내부 서버 오류'});
            } else {
                devlog(`getDeletedPosts Controllers`);
                devlog(`resData = ${posts}`);
                return res.status(200).json({ totalPosts: totalPosts, message: posts});
            }
        })
    })
}
*/
