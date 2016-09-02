module.exports = {
	redisPort: process.env.REDIS_PORT || 6379,
	redisHost: process.env.REDIS_HOST || 'localhost',
	messageTimeout: 2000,
	defaultDelay: process.env.defaultDelay || 50
};
