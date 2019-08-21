const express = require('express');

// database access using knex
const db = require('../data/db-config.js');

const router = express.Router();

router.get('/', (req, res) => {
    // SELECT * FROM Posts
    db('posts')
        .then(posts => {
            res.json(posts);
        })
        .catch(error => {
            res.status(500).json({ message: "Error getting posts"});
        })
});

router.get('/:id', (req, res) => {
    // SELECT * FROM Posts WHERE id = req.params.id
    const { id } = req.params;

    db('posts').where({ id })
        .then(posts => {
            const post = posts[0];
            res.json(post);
        })
        .catch(error => {
            res.status(500).json({ message: "Error getting post by ID"});
        })
});

router.post('/', (req, res) => {
    // INSERT INTO Posts (req.body keys) VALUES (req.body values)
    const postData = req.body;

    db('posts').insert(postData)
        .then(post => {
            res.status(201).json(post);
        })
        .catch(error => {
            res.status(500).json({ message: "Failed to insert post" });
        })
});

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const changes = req.body;

    db('posts').where({ id }).update(changes)
        .then(count => {
            if(count) {
                res.status(201).json({ message: "Post was updated"});
            } else {
                res.status(404).json({ message: "Invalid post ID" });
            }
        })
        .catch(error => {
            res.status(500).json({ message: "Failed to update post" });
        })
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;

    db('posts').where({ id }).del()
        .then(deleted => {
            if(deleted) {
                res.status(201).json({ message: "Post was deleted"});
            } else {
                res.status(404).json({ message: "Invalid post ID" });
            }
        })
        .catch(error => {
            res.status(500).json({ message: "Failed to delete post" });
        })
});

module.exports = router;