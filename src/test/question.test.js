import app from '../app';

import chai from 'chai';
import request from 'supertest';


const expect = chai.expect;





describe('Slotip - Question API Integration Tests', function() {

	describe('#GET / questions', function() {
		it('should get all questions', function(done) {
			request(app).get('/api/questions')
				.end(function(err, res) {
					expect(res.statusCode).to.equal(200);
					expect(res.body).to.be.an('array');
					// expect(res.body).to.be.empty;
					done();
				});
		});
	});

});