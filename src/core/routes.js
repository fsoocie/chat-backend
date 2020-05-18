const User = require('../controllers/UserController');
const Dialog = require('../controllers/DialogController');
const Messages = require('../controllers/MessagesController');
const loginValidator = require('../utils/validators/loginValidator');


module.exports = (app, io) => {

    const UserCtrl = new User(io);
    app.get('/user/me', UserCtrl.me);
    app.get('/user/verify', UserCtrl.verify);
    app.get('/user/:id', UserCtrl.index );
    app.post('/user/register', UserCtrl.create);
    app.delete('/user/:id', UserCtrl.delete);
    app.post('/user/login', loginValidator , UserCtrl.login);


    const DialogsCtrl = new Dialog(io);
    app.get('/dialogs', DialogsCtrl.index);
    app.post('/dialogs', DialogsCtrl.create);
    app.delete('/dialogs/:id', DialogsCtrl.delete);

    const MessagesCtrl = new Messages(io);
    app.get('/messages', MessagesCtrl.index);
    app.post('/messages', MessagesCtrl.create);
    app.delete('/messages/:id', MessagesCtrl.delete);

};