const express = require('express');

const projects = require('../data/helpers/projectModel');
const actions = require('../data/helpers/actionModel');

const router = express.Router();

router.get('/', (req, res) => {
    projects.get()
        .then(list => {
            res.status(200).json(list);
        })
        .catch(err => {
            res.status(500).json({
                error: "No projects could be found"
            });
        });
});

router.get('/:id', (req, res) => {
    const { id } = req.params;

    projects.get(id)
        .then(project => {
            res.status(200).json(project);
        })
        .catch(err => {
            res.status(500).json({
                error: `The project with ID: ${id} cannot be found`
            });
        });
});

router.get('/:id/action-list', (req, res) => {
    const { id } = req.params;

    projects.getProjectActions(id)
        .then(list => {
            res.status(200).json(list);
        })
        .catch(err => {
            res.status(500).json({
                error: "Request could not be completed at this time"
            });
        });
});

router.post('/', (req, res) => {
    const name = req.body.name;
    const description = req.body.description;

    if(name && description) {
        projects.insert(req.body)
            .then(post => {
                res.status(201).json(post);
            })
            .catch(err => {
                res.status(500).json({
                    error: "There was an error making the post"
                });
            });
    } else {
        res.status(400).json({
            message: "Please provide a Name -and- Description"
        });
    };
});

router.put('/:id', (req, res) => {
    const { id } = req.params;

    if(id) {
        if(req.body.name && req.body.description) {
            projects.update(id, req.body)
                .then(changes => {
                    res.status(200).json(changes);
                })
                .catch(err => {
                    res.status(500).json({
                        error: "The project could not be updated at this time"
                    });
                });
        } else {
            res.status(400).json({
                message: "Please provide a Name -and- Description"
            });
        };
    } else {
        res.status(400).json({
            message: "Please provide a valid project id"
        });
    };
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;

    if(id) {
        projects.get(id)
            .then(project => {
                if(project) {
                    projects.remove(id)
                        .then(deleted => {
                            let projectActions = []
                            actions.get()
                                .then(list => {
                                    projectActions = list;
                                })
                                .catch(err);
                            projectActions.forEach(action => {
                                if(action.id == id) {
                                    actions.remove(action.id)
                                        .then(deletedAction)
                                        .catch(err);
                                }
                            })
                            res.status(200).json(deleted);
                        })
                        .catch(err => {
                            res.status(500).json({
                                error: "The project could not be deleted"
                            })
                        })
                } else {
                    res.status(400).json({
                        message: `The project with ID: ${id} does not exist`
                    });
                };
            })
    } else {
        res.status(400).json({
            message: "Please provide a project ID"
        });
    };
});

module.exports = router;