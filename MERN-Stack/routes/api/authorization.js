const express = require('express')
const router = express.Router()
const cors = require('cors')

const User = require('../../models/User')
const Admin = require('../../models/Admin')
const Manager = require('../../models/Manager')
const auth = require('../../middleware/auth')
const Organization = require('../../models/Organization')
router.use(cors())

// @route   GET api/authorization
// @desc    Login User / Returning JWT Token
// @access  Public
router.get('/', auth, async (req, res) => {
    try {
        if (req.user.role === "candidate") {
            const user = await User.findById(req.user.id).select('-password');
            let roleBasedUser = user.toObject()
            roleBasedUser["role"] = "candidate"

            const manager = await Manager.findById(user.manager_id)
            .select('firstname')
            .select('email');

            const organization = await Organization.findById(user.organization_id)
            .select('organizationname')
            .select('email');

            roleBasedUser["contacts"] ={Admin: [{firstname: "Support"}], Managers: [manager], Organizations: [organization]}
            res.json(roleBasedUser)
        }
        else if (req.user.role === "organization") {

            const user = await Organization.findById(req.user.id).select('-password');
            let roleBasedUser = user.toObject();
            roleBasedUser["role"] = "organization";

            const candidates = await User.find({organization_id: user._id})
            .select('firstname')
            .select('email');

            const managers = await Manager.find({organization_id: user._id})
            .select('firstname')
            .select('email');

            roleBasedUser["contacts"] ={Admin: [{firstname: "Support"}], Candidates: candidates, Managers: managers}
            res.json(roleBasedUser);

        }
        else if (req.user.role === "admin") {

            const user = await Admin.findById(req.user.id).select('-password');
            let roleBasedUser = user.toObject();
            roleBasedUser["role"] = "admin";

            const candidates = await User.find()
            .select('firstname')
            .select('email');

            const managers = await Manager.find()
            .select('firstname')
            .select('email');

            const organizations = await Organization.find()
            .select('organizationname')
            .select('email');

            roleBasedUser["contacts"] ={Candidates: candidates, Managers: managers,  Organizations: organizations}
            res.json(roleBasedUser);

        }
        else if (req.user.role === "manager") {
            const user = await Manager.findById(req.user.id).select('-password');
            let roleBasedUser = user.toObject()
            roleBasedUser["role"] = "manager"

            const candidates = await User.find({manager_id: user._id})
            .select('firstname')
            .select('email');

            const organization = await Organization.findById(user.organization_id)
            .select('organizationname')
            .select('email');

            roleBasedUser["contacts"] ={Admin: [{firstname: "Support"}], Candidates: candidates, Organizations: [organization]}
            res.json(roleBasedUser)
        }
        else {
            res.status(401).send('Unauthorized Access')
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }

});
module.exports = router