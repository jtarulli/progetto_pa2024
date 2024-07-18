import { Request, Response, NextFunction } from 'express';
import { extractEmailFromJwt } from '../utils/jwtUtils';
import { getUserByEmail, decrementUserTokens } from '../db/utenteQueries';

export const decrementTokens = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const email = extractEmailFromJwt(req);
        const user = await getUserByEmail(email);

        if (!user.length) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user[0].dataValues.tokens <= 0) {
            return res.status(403).json({ message: 'Insufficient tokens' });
        }

        await decrementUserTokens(user[0].dataValues.id, user[0].dataValues.tokens - 1);
        next();
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error });
    }
};
