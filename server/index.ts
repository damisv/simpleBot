import app from './src';
import config from './src/config';
import logger from './src/util/logger';

import DBClient from './src/database/dbClient';

app.listen(config.port, async () => {
    try {
        await DBClient.connect(); // Connecting DB
        logger.log(`server started at port ${config.port}`);
    } catch (error) { logger.error(error); }
});