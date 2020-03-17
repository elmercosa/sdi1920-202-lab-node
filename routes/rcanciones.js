module.exports = function(app) {
    app.get("/canciones", function(req, res) {
        let respuesta = "";
        if(req.query.nombre != null){
            respuesta += 'Nombre: ' + req.query.nombre  + '<br>';
        }
        if(typeof (req.query.autor) != "undefined"){
            respuesta += 'Autor: '+ req.query.autor;
        }
        res.send(respuesta);
    });
    app.get('/canciones/:id', function(req, res) {
        let respuesta = 'id: ' + req.params.id;
        res.send(respuesta);
    });
    app.get('/canciones/:genero/:id', function(req, res) {
        let respuesta = 'id: ' + req.params.id + '<br>'
            + 'Género: ' + req.params.genero;
        res.send(respuesta);
    });
};
