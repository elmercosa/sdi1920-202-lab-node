module.exports = function (app, gestorBD) {

    app.get("/api/cancion", function (req, res) {
        gestorBD.obtenerCanciones({}, function (canciones) {
            if (canciones == null) {
                res.status(500);
                res.json({
                    error: "se ha producido un error"
                })
            } else {
                res.status(200);
                res.send(JSON.stringify(canciones));
            }
        });
    });
    app.get("/api/cancion/:id", function (req, res) {
        var criterio = {"_id": gestorBD.mongo.ObjectID(req.params.id)};

        gestorBD.obtenerCanciones(criterio, function (canciones) {
            if (canciones == null) {
                res.status(500);
                res.json({
                    error: "se ha producido un error"
                })
            } else {
                res.status(200);
                res.send(JSON.stringify(canciones[0]));
            }
        });
    });

    app.delete("/api/cancion/:id", function (req, res) {
        var criterio = {"_id": gestorBD.mongo.ObjectID(req.params.id)};

        gestorBD.obtenerCanciones(criterio, function (canciones) {
            if (canciones == null) {
                res.status(500);
                res.json({
                    error: "se ha producido un error"
                })
            } else {
                if (canciones[0].autor == res.usuario) {
                    gestorBD.eliminarCancion(criterio, function (canciones) {
                        if (canciones == null) {
                            res.status(500);
                            res.json({
                                error: "se ha producido un error"
                            })
                        } else {
                            res.status(200);
                            res.send(JSON.stringify(canciones));
                        }
                    });
                } else {
                    res.status(500);
                    res.json({
                        error: "No es el dueño de la cancion"
                    })
                }

            }
        });
    });

    app.post("/api/cancion", function (req, res) {
        var cancion = {
            nombre: req.body.nombre,
            genero: req.body.genero,
            precio: req.body.precio,
        };
        // ¿Validar nombre, genero, precio?
        let error = "";

        if (req.body.nombre == null || req.body.nombre.trim().length < 5 || req.body.nombre.trim().length > 30)
            error += "El nombre de la cancion tiene que tener entre 5 y 30 caracteres.";
        if (req.body.genero == null || req.body.genero.trim().length < 5 || req.body.genero.trim().length > 30)
            error += "El genero de la cancion tiene que tener entre 5 y 30 caracteres.";
        if (req.body.precio == null || req.body.precio < 0)
            error += "El precio de la cancion tiene que ser mayor que 0.";

        if (error.length != 0) {
            res.status(500);
            res.json({
                error: error
            })
        } else {
            gestorBD.obtenerCanciones(criterio, function (canciones) {
                if (canciones == null) {
                    res.status(500);
                    res.json({
                        error: "se ha producido un error"
                    })
                } else {
                    if (canciones[0].autor == res.usuario) {
                        gestorBD.insertarCancion(cancion, function (id) {
                            if (id == null) {
                                res.status(500);
                                res.json({
                                    error: "se ha producido un error"
                                })
                            } else {
                                res.status(201);
                                res.json({
                                    mensaje: "canción insertarda",
                                    _id: id
                                })
                            }
                        });
                    } else {
                        res.status(500);
                        res.json({
                            error: "No es el dueño de la cancion"
                        })
                    }
                }
            });
        }
    });

    app.put("/api/cancion/:id", function (req, res) {

        let criterio = {"_id": gestorBD.mongo.ObjectID(req.params.id)};

        let cancion = {}; // Solo los atributos a modificar
        if (req.body.nombre != null)
            cancion.nombre = req.body.nombre;
        if (req.body.genero != null)
            cancion.genero = req.body.genero;
        if (req.body.precio != null)
            cancion.precio = req.body.precio;

        let error = "";

        if (req.body.nombre != null && (req.body.nombre.trim().length < 5 || req.body.nombre.trim().length > 30))
            error += "El nombre de la cancion tiene que tener entre 5 y 30 caracteres.";
        if (req.body.genero != null && (req.body.genero.trim().length < 5 || req.body.genero.trim().length > 30))
            error += "El genero de la cancion tiene que tener entre 5 y 30 caracteres.";
        if (req.body.precio != null && req.body.precio < 0)
            error += "El precio de la cancion tiene que ser mayor que 0.";

        if (error.length != 0) {
            res.status(500);
            res.json({
                error: error
            })
        } else {
            gestorBD.modificarCancion(criterio, cancion, function (result) {
                if (result == null) {
                    res.status(500);
                    res.json({
                        error: "se ha producido un error"
                    })
                } else {
                    res.status(200);
                    res.json({
                        mensaje: "canción modificada",
                        _id: req.params.id
                    })
                }
            });
        }
    });

    app.post("/api/autenticar/", function (req, res) {
        let seguro = app.get("crypto").createHmac('sha256', app.get('clave')).update(req.body.password).digest('hex');
        let criterio = {
            email: req.body.email,
            password: seguro
        };

        gestorBD.obtenerUsuarios(criterio, function (usuarios) {
            if (usuarios == null || usuarios.length === 0) {
                res.status(401);
                res.json({autenticado: false});
            } else {
                var token = app.get('jwt').sign({usuario: criterio.email, tiempo: Date.now() / 1000}, "secreto");
                res.status(200);
                res.json({autenticado: true, token: token});
            }
        })

    });

};
