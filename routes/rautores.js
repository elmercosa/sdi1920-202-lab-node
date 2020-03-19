module.exports = function (app, swig) {

    app.get("/autores", function (req, res) {
        let autores = [
            {"nombre": "Elmer1", "grupo": "Elmer1", "rol": "Batería"},
            {"nombre": "Elmer2", "grupo": "Elmer2", "rol": "Bajista"},
            {"nombre": "Elmer3", "grupo": "Elmer3", "rol": "Cantante"},
        ];

        let respuesta = swig.renderFile('views/autores.html', {autores: autores});

        res.send(respuesta);
    });

    app.get('/autores/agregar', function (req, res) {
        let respuesta = swig.renderFile('views/autores-agregar.html', {});
        res.send(respuesta);
    });

    app.get("/autores/*", function (req, res) {
        res.redirect("/autores");
    });


    app.post('/autor', function (req, res) {
        let errores = "";

        if (typeof (req.body.nombre) == "undefined" || req.body.nombre == null || req.body.nombre.trim().length === 0) {
            errores += "Nombre no enviado en la petición <br>"
        }
        if (typeof (req.body.rol) == "undefined" || req.body.rol == null || req.body.rol.trim().length === 0) {
            errores += "Rol no enviado en la petición <br>"
        }
        if (typeof (req.body.grupo) == "undefined" || req.body.grupo == null || req.body.grupo.trim().length === 0) {
            errores += "Grupo no enviado en la petición <br>"
        }

        if (errores === "") {
            res.send(
                "Autor agregado:" + req.body.nombre + "<br>"
                + "grupo : " + req.body.grupo + "<br>"
                + " rol:" + req.body.rol)
        } else {
            res.send(errores);
        }


    });
};
