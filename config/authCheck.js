import JWT from 'jsonwebtoken';

const authCheck = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: "Access denied.",
            });
        }

        const token = authHeader.split(' ')[1];

        JWT.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    message: err.message || "Authentication error.",
                });
            }

            req.userId = decoded.userId;
            req.name = decoded.name;
            next();
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export default authCheck;
