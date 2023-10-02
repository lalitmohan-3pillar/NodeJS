const chai = require('chai');
const chaiHttp = require("chai-http");
const expect = chai.expect;
const Detail = require('../src/models/detail');
const Product = require('../src/models/product');
const ProductService= require('../src/services/productService');
const app  = require("../src/app");
const sinon = require("sinon");
const cart = require('../src/controllers/cartController')
//const faker = require("faker");
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
        const productName='Test'
        chai
          .request(server)
          .get(`/assessment/productDetail?productName=${productName}`)
          .end((err, res) => {
            expect(res.status).to.be.equals(200);
            done();
          });
      }); 

      it("[add to Cart] - add the provided product name to cart", async(done) => {      
        
        const req = {
          query: {
            productName: 'CAR',            
          },
          session: {
            username: 'ok',            
          },
        };

        const res = {
          json: sinon.spy(),
        };   

        const addCart = await cart.addToCart(req,res)
        expect(addCart.status).to.equal(200);
            done();
           });           
      
      it("[add to Cart] - add the provided product name to cart without session", async(done) => {      
        
            const req = {
              query: {
                productName: 'CAR',            
              },             
            };
    
            const res = {
              json: sinon.spy(),
            };   
    
            const addCart = await cart.addToCart(req,res)
            expect(addCart.status).to.equal(401);
                done();
               });          
});
