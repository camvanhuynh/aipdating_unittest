describe('authentication service', function() {

  var authentication;
  var httpBackend;

  var unregisteredEmailErr = 'Email is not registered';
  var wrongPwdErr = 'Password is incorrect';

  beforeEach(angular.mock.module('aipdatingApp'));

  beforeEach(inject(function($httpBackend, _authentication_) {
    httpBackend = $httpBackend;
    authentication = _authentication_;

    // Mock the time so that the token is not expired
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date(2017, 10, 10));
  }));

  // Remove time mocking
  afterEach(function() {
    jasmine.clock().uninstall();
    authentication.user = null;
  })

  // Verify that authentication service should log valid user in successfully
  it('should log user in', function() {
      console.log("Case 1: Log valid user in")
      var validUser = {
        email: "UnitTest123@uts.com",
        password: "abc"
      }

    httpBackend.when('POST','/auth/login',validUser)
    .respond(200,{token:'jwt eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1OWYyYjI5Zjg1OWM4NjA3MWE1YTIzMzkiLCJlbWFpbCI6IlVuaXRUZXN0QHV0cy5jb20iLCJuYW1lIjoiVW5pdCBUZXN0Iiwicm9sZSI6Ik1lbWJlciIsImlhdCI6MTUwOTA3ODY3MiwiZXhwIjoxNTA5MTY1MDcyfQ.GXYisQUIJyYk4YbV5_wix5BmcEbtYRd9T3mefNqPuwc',
    user: { _id: '59f2b29f859c86071a5a2339',email: 'UnitTest@uts.com', name: 'Unit Test',role: 'Member' },});

    authentication.login(validUser);
    httpBackend.flush();
    expect(authentication.currentUser().name).toEqual("Unit Test");

  });

  // Verify that authentication service will return error if email is not registered
  it('should NOT log user in', function() {
      console.log("Case 2: Should NOT log in user with unregistered email");

      var invalidUser = {
        email: "UnitTest123@uts.com",
        password: "abc"
      }

    httpBackend.when('POST','/auth/login',invalidUser)
    .respond(401,{error: unregisteredEmailErr, token: '', user: {}});

    authentication.login(invalidUser);
    httpBackend.flush();

    expect(authentication.getError()).toEqual(unregisteredEmailErr);
  });


  // Verify that authentication service will return error if password is not correct
  it('should log user in', function() {
      console.log("Case 3: Should NOT log in user with incorrect password");

      var invalidUser = {
        email: "UnitTest@uts.com",
        password: "abc123"
      }

    httpBackend.when('POST','/auth/login',invalidUser)
    .respond(401,{error: wrongPwdErr, token: '', user: {}});

    authentication.login(invalidUser);
    httpBackend.flush();

    expect(authentication.getError()).toEqual(wrongPwdErr);
  });

})
