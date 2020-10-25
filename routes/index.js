const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middlewares/auth')
const Story = require('../models/Story')

// @desc    Login/Landing page
// @route   GET /
router.get('/', ensureGuest, (req, res) => {
    res.render('login', {
        layout: 'login',
    })
})

// @desc    Dashboard
// @route   GET /dashboard
router.get('/dashboard', ensureAuth, async (req, res) => {

    try {
        const stories = await Story.find({ user: req.user.id }).lean()
        res.render('dashboard', {
            displayName: req.user.displayName,
            stories
        })
    } catch (err) {
        console.log(err)
        res.render('errors/500')
    }

})

module.exports = router