const chai = require('chai');
const chaiHttp = require("chai-http");
const assert = chai.assert;
const should = chai.should();
const expect = chai.expect;
const Detail = require('../src/models/detail');
const Product = require('../src/models/product');
const app  = require("../src/app");
const server = app;

chai.use(chaiHttp);
/// #########   Expect Check  ############
describe('Expect Check',function(){    
    it("Get Status 200 for home address", (done) => {
        chai
          .request(server)
          .get(`/assessment`)
          .end((err, res) => {
            expect(res.status).to.be.equals(200);            
            done();
          });
      }); 
 
      it("Get Status 200 for productDetail page", (done) => {
        let productName='Test'
        chai
          .request(server)
          .get(`/assessment/productDetail?productName=${productName}`)
          .end((err, res) => {
            expect(res.status).to.be.equals(200);
            done();
          });
      }); 
});
