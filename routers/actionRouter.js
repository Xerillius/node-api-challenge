const express = require('express');

const actions = require('../data/helpers/actionModel');
const projects = require('../data/helpers/projectModel');

const router = express.Router();

router.get('/', (req, res) => {
    actions.get()
        .then(list => {
            res.status(200).json(list);
        })
        .catch(err => {
            res.status(500).json({
                error: "No actions could be found"
            });
        });
});

router.get('/:id', (req, res) => {
    const { id } = req.params;

    actions.get(id)
        .then(action => {
            res.status(200).json(action);
        })
        .catch(err => {
            res.status(500).json({
                error: `The action with ID: ${id} could not be found`
            });
        });
});

router.post('/', (req, res) => {
    const action = req.body;

    const project_id = req.body.project_id;
    const description = req.body.description;
    const notes = req.body.notes;

    if(project_id) {
        projects.get(project_id)
            .then(project => {
                if(project) {
                    if(description && notes) {
                        if(description.length <= 128) {
                            actions.insert(action)
                                .then(post => {
                                    res.status(201).json(post);
                                })
                                .catch(err => {
                                    res.status(500).json({
                                        error: "Action could not be posted at this time"
                                    });
                                });
                        } else {
                            res.status(400).json({
                                message: "Description must be 128 characters or less."
                            });
                        }
                    } else {
                        res.status(400).json({
                            message: "Please provide a description and notes"
                        });
                    };
                } else {
                    res.status(400).json({
                        message: `Project with ID: ${project_id} does not exist`
                    });
                };
            })
            .catch(err => {
                res.status(500).json(error);
            });
    } else {
        res.status(400).json({
            message: "Please provide a project id"
        });
    };
});

router.put('/:id', (req, res) => {
    const { id } = req.params;

    if(id) {
        if(req.body.description && req.body.notes) {
            actions.update(id, req.body)
                .then(changes => {
                    res.status(200).json(changes);
                })
                .catch(err => {
                    res.status(500).json({
                        error: "The action could not be updated at this time"
                    });
                });
        } else {
            res.status(400).json({
                message: "Please provide a description and notes"
            });
        }
    } else {
        res.status(400).json({
            message: "Please provide a valid action id"
        });
    };
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;

    if(id) {
        actions.get(id)
            .then(action => {
                if(action) {
                    actions.remove(id)
                        .then(deleted => {
                            res.status(200).json(deleted);
                        })
                        .catch(err => {
                            res.status(500).json({
                                error: "The action could not be deleted"
                            });
                        });
                } else {
                    res.status(400).json({
                        message: `The action with ID: ${id} does not exist`
                    });
                };
            })
            .catch(err => {
                res.status(500).json({
                    error: "The request action could not be found"
                });
            });
    } else {
        res.status(400).json({
            message: "Please provide an action ID"
        })
    };
});

module.exports = router;