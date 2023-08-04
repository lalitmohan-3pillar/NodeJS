const chai = require('chai');
const chaiHttp = require("chai-http");
const assert = chai.assert;
const should = chai.should();
const expect = chai.expect;
const Detail = require('../src/models/detail');
const Product = require('../src/models/product');
const { app } = require("../src/app");
const server = app;

chai.use(chaiHttp);
/// #########   Assert Check  ############
describe('Assert Check',function(){

    let username= 'code improve';
    it("Get 404 if product id not present", (done) => {
        const productName = 'Test';
        console.log(server)
        chai
          .request(server)
          .get(`/assessment/productDetail?productName=${productName}`)
          .end((err, res) => {
            res.should.have.status(404);
            done();
          });
      });

    it('String match',async function(){
        assert.typeOf(username,'string');
        //await Detail.findone()
    });

    it('Value match',function(){
        assert.equal(username,'code improve');
    });

    it('Lenght match',function(){
        assert.lengthOf(username,12);
    });

});

/// #########   Should Check  ############
describe('Should Check',function(){

    let username= 'code improve';
    let mylist= {
        item:[{
            id:1,name:'demo'
        }],
        title:'user list'
    };

    it('String match',function(){
        username.should.be.a('string');
    });

    it('Value match',function(){
        username.should.be.equal('code improve');
    });

    it('Lenght match',function(){
        mylist.should.have.property('item').with.lengthOf(1);
    });
});

/// #########   Expect Check  ############
describe('Expect Check',function(){

    let username= 'code improve';
    let mylist= {
        item:[{
            id:1,name:'demo'
        }],
        title:'user list',
        address:{
            country:'India',
            phoneNo:['45345435','567567567']
        }
    };

    it('String match',function(){
        expect(username).to.be.a('string');
    });

    it('Value match',function(){
        expect(username).to.equal('code improve');
    });

    it('Lenght match',function(){
        expect(username).to.lengthOf(12);
    });

    it('Object Lenght match',function(){
        expect(mylist).to.have.property('item').with.lengthOf(1);
    });

    it('APi Object match',function(){
        expect(mylist).to.have.all.keys('item','title','address');
    });

    it('phone no ',function(){
        expect(mylist).to.have.nested.property('address.phoneNo[0]');
    });

    it('Country Name',function(){
        expect(mylist).to.have.nested.include({'address.country':'India'});
    });

});
