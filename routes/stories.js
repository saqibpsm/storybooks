const express = require('express')
const { route } = require('.')
const router = express.Router()
const { ensureAuth } = require('../middlewares/auth')
const Story = require('../models/Story')

// @desc    Show add page
// @route   GET /stories/add
router.get('/add', ensureAuth, (req, res) => {
    res.render('stories/add')
})

// @desc    process add form
// @route   POST /stories
router.post('/', ensureAuth, async (req, res) => {
    try {
        req.body.user = req.user.id
        await Story.create(req.body)
        res.redirect('/dashboard')
    } catch (err) {
        console.log(err)
        res.render('errors/500')
    }
})

// @desc    show all stories
// @route   GET /stories
router.get('/', ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({ status: 'public' })
            .populate('user')
            .sort({ createdAt: 'desc' })
            .lean()

        res.render('stories/index', {
            stories
        })
    } catch (err) {
        console.log(err)
        res.render('errors/500')
    }
})

// @desc    show edit page for story
// @route   GET /stories/edit/:id
router.get('/edit/:id', ensureAuth, async (req, res) => {

    try {
        const story = await Story.findOne({ _id: req.params.id }).lean()
        if (!story) {
            res.render('errors/404')
        }
        if (story.user != req.user.id) {
            res.redirect('/stories')
        } else {
            res.render('stories/edit', {
                story
            })
        }
    } catch (err) {
        console.log(err)
        return res.render('errors/500')
    }
})

// @desc    Update Story
// @route   PUT /stories/:id
router.put('/:id', ensureAuth, async (req, res) => {

    try {
        let story = await Story.findById({ _id: req.params.id }).lean()

        if (!story) {
            res.render('errors/404')
        }

        if (story.user != req.user.id) {
            res.redirect('/stories')
        } else {
            story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
                new: true,
                runValidators: true
            })
            res.redirect('/dashboard')
        }
    } catch (err) {
        console.log(err)
        return res.render('errors/500')
    }


})

// @desc    Delete Story
// @route   DELETE /stories/:id
router.delete('/:id', ensureAuth, async (req, res) => {

    try {
        await Story.remove({ _id: req.params.id })
        res.redirect('/dashboard')
    } catch (err) {
        console.log(err)
        return res.render('errors/500')
    }

})

module.exports = router