import express from 'express';
const router = express.Router();

import postsModule from './modules/posts.module'
router.use('/posts', postsModule)

import usersModule from './modules/users.module'
router.use('/users', usersModule)

module.exports = router;