import { Router } from 'express';

import jwt from 'jsonwebtoken';
import passport from 'passport';
import _ from 'lodash';
import User from '../../api/user/user.model';
import Company from '../../api/company/company.model';
import Role from '../../api/role/role.model';

import config from '../../config';
import { response, log } from '../../utils'

// import User from '../user/user.model';




const router = Router();





// router.post('/', function(req, res, next) {

// 	// console.log('req.body', req)

// 	passport.authenticate('local', {session: false}, (err, user, info) => {
// 		// console.log(err, user, info);
// 		if(err) { return res.status(401).json(err); }
// 		if(!user) { return res.status(404).json({message: 'Account not found'}) }


// 		// console.log('User local auth: ', user);

// 		let userPayload = _.pick(user, ['_id', 'email', 'username', 'picture', 'role']);

// 		const token = jwt.sign(userPayload, config.token.secret, {expiresIn: config.token.expired});

// 		res.json({token, user: userPayload});

// 		// req.login(user, {session: false}, (err) => {
// 		// 	if(err) { return res.status(500).json(err); }

// 		// 	const token = jwt.sign(user, config.secret);

// 		// 	return res.json({user, token});
// 		// });
// 	})(req, res, next);
// })


// router.post('/register', function(req, res, next) {
//   console.log('req.body', req.body)
//   // User.create()
// });

// export default router;

// export function login (req, res) {

// 	console.log('req.body', req.body)

// 	passport.authenticate('local', {session: false}, (err, user, info) => {
// 		console.log(err, user, info);
// 		if(err) { return res.status(401).json(err); }
// 		if(!user) { return res.status(404).json({message: 'Account not found'}) }


// 		// console.log('User local auth: ', user);

// 		const userPayload = _.pick(user, ['_id', 'email', 'fullname', 'picture', 'role']);
// 		const token = jwt.sign(userPayload, config.token.secret, {expiresIn: config.token.expired});

// 		res.json({token, user: userPayload});

// 		// req.login(user, {session: false}, (err) => {
// 		// 	if(err) { return res.status(500).json(err); }

// 		// 	const token = jwt.sign(user, config.secret);

// 		// 	return res.json({user, token});
// 		// });
// 	})(req, res);
// }


export function login (req, res) {
  User.authenticate(req.body.email.trim(), req.body.password, (err, user) => {
    if(err) {return res.send(err)}
    if(!user) {return res.status(404).send({message: 'Invalid email or password'})}

    const userPayload = _.pick(user, ['_id', 'email', 'fullname', 'picture', 'role', 'company']);
		const token = jwt.sign(userPayload, config.token.secret, {expiresIn: config.token.expired});

		return res.status(200).json({token, user: userPayload});
  })
}

// export function register(req, res) {
//   const body = req.body;

//   console.log('AUTH/REGISTER: Company created ', body)


//   Role.findOne({slug: 'user'})
//     .then((role) => {

//       Company.create({ name: body.company })
//         .then((company) => {

//           console.log('REGISTER: Company created ', company)

//           body.company = company._id
//           body.role = role._id

//           return User.create(body)
//             .then((user) => {

//               let newUser = JSON.parse(JSON.stringify(user))

//               newUser.company = {
//                 _id: company._id,
//                 id: company._id,
//                 name: company.name
//               }

//               newUser.role = {
//                 _id: role._id,
//                 id: role.id,
//                 name: role.name,
//                 slug: role.slug,
//                 permissions: role.permissions
//               }

//               const userPayload = _.pick(newUser, ['_id', 'email', 'fullname', 'picture', 'role', 'company']);
//               const token = jwt.sign(userPayload, config.token.secret, { expiresIn: config.token.expired });

//               return { token, user: userPayload };
//             })
//             .catch((err) => {
//               return Company.deleteOne({ _id: company.id }).exec((err, success) => {
//                 if (err) return res.send(500)
//                 return res.status(409).send({ message: 'Email already exists' })
//               })
//             })
//         })
//         .then(response.success(res))
//         .catch((err) => {
//           console.log('AUTH/REGISTER company ', err)
//           if (err.name == 'MongoError' && err.code == 11000) {
//             err.message = 'Data already exists'
//             return res.status(409).send(err)
//           }

//           return response.error(res)
//         });
//     })
//     .catch(response.error(res))

// }


export function register(req, res) {
  const body = req.body;

  // console.log('AUTH/REGISTER: Company created ', body)
  log.beauty('REGISTER PAYLOAD', body)

  Company.create({name: req.body.company})
    .then(newCompany => {
      // log.beauty('COMPANY', newCompany)
      
      body.company = newCompany
      return User.create(body)
        .then(user => {
          // log.beauty('USER', user)
          
          // this.login(req, res)
          return User.authenticate(req.body.email.trim(), req.body.password, (err, user) => {
            if(err) {return res.status(500).send(err)}
            if(!user) {return res.status(404).send({message: 'Invalid email or password'})}
        
            const userPayload = _.pick(user, ['_id', 'email', 'fullname', 'picture', 'role', 'company']);
            const token = jwt.sign(userPayload, config.token.secret, {expiresIn: config.token.expired});
        
            return res.status(200).json({token, user: userPayload});
          })
        })
        .catch(error => {
          return Company.deleteOne({ _id: company.id }).exec((err, success) => {
            if (err) return res.send(500)
            return res.status(409).send({ message: 'Email already exists' })
          })
        })
    })
    .catch(response.error)
}
