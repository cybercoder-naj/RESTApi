const express = require('express');
const Ninja = require("../models/ninja");
const router = express.Router();

// CREATE new ninja
router.post('/ninjas', (req, res, next) => {
    Ninja.create(req.body)
        .then(ninja => {
            res.send(ninja);
        }).catch(next);
});

// READ a list from ninjas
router.get('/ninjas', (req, res, next) => {
    Ninja.aggregate().near({
        near: {
            type: 'Point',
            coordinates: [
            parseFloat(req.query.lng),
            parseFloat(req.query.lat)
            ]
        },
        maxDistance: 100000,
        spherical: true,
        distanceField: "dist.calculated"
    }).then(ninjas => {
        if (!ninjas)
            res.status(402).send({error: "No ninjas found"});

        if (ninjas.length === 0)
            res.status(402).send({error: "{lng, lat} are too big or too small"});

        res.send(ninjas);
    })
});

// UPDATE a ninja
router.put('/ninjas/:id', (req, res, next) => {
    Ninja.findByIdAndUpdate({_id: req.params.id}, req.body)
        .then(() =>
            Ninja.findOne({_id: req.params.id})
                .then(ninja => res.send(ninja))
        );
});

// DELETE a ninja
router.delete('/ninjas/:id', (req, res, next) => {
    Ninja.findByIdAndRemove({_id: req.params.id})
        .then(ninja => res.send(ninja));
});

module.exports = router;