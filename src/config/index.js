import merge from 'lodash/merge';


const env = process.env.NODE_ENV || 'development';

const envConfig = require(`./env/${env}`);



const gConfig = {
	default: {
		role: '5ae4808af7b4ce04dc67d3dd', // CHANGE THIS
    password: 1234677,
    // seed: env != 'prouction' ? require('./seed') : {}
	}
};


// const config = _.merge(envConfig, gConfig);


export default merge(envConfig, gConfig);