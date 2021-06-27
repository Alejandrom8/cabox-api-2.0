const controller = require('../core/controllers/User');

exports.login = function (req, res) {
    const {email, password} = req.body

    controller
        .AuthController
        .login(email, password)
        .then((result) => {
            res.status(200).json({ success: true, data: result})
        })
        .catch((error) => {
            res.status(401).json({ success: false, error })
        });
};

exports.signUp = function (req, res) {
    const data = req.body;
    controller
        .AuthController
        .signUp(data)
        .then(({ token, refreshToken }) => {
            res.status(200).json({ success: true, data: { token, refreshToken } });
        })
        .catch((error) => {
            res.status(500).json({ success: false, error })
        });
}

exports.refresh = function (req, res) {
    const { refreshToken } = req.params;

    controller
        .AuthController
        .refresh(refreshToken)
        .then((result) => {
            res.status(200).json({ success: true, data: result });
        })
        .catch((error) => {
            res.status(401).json({ success: false, error });
        });
}