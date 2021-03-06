const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/users";
const User = require("../../src/db/models").User;
const sequelize = require("../../src/db/models/index").sequelize;

describe("routes : users", () => {
    beforeEach((done) => {
        
        sequelize.sync({force: true})
        .then(() => {
            done();
        })
        .catch((err) => {
            console.log(err);
            done();
        });
    });

    describe("GET /users/sign_up", () => {

        it("should render a view with a sign up form", (done) => {
            request.get(`${base}/sign_up`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("Sign up");
                done();
            });
        });
    });

    describe("POST /users", () => {

        it("should create a new user with valid values and redirect", (done) => {
            const option = {
                url: base,
                form: {
                    username: "exampleUsername",
                    email: "user@example.com",
                    password: "1234567890"
                }
            }

            request.post(option, (err, res, body) => {

                User.findOne({where: {email: "user@example.com"}})
                .then((user) => {
                    console.log(user.username);
                    expect(user).not.toBeNull();
                    expect(user.email).toBe("user@example.com");
                    expect(user.username).toBe("exampleUsername")
                    expect(user.id).toBe(1);
                    done();
                })
                .catch((err) => {
                    console.log(err);
                    done();
                });
            })
        })

        it("should not create a new user with invalid attributes and redirect", (done) => {
            request.post(
                {
                    url: base,
                    form: {
                        username: "user",
                        email: "no",
                        password: "1234567890"
                    }
                },
                (err, res, body) => {
                    User.findOne({where: {email: "no"}})
                    .then((user) => {
                        expect(user).toBeNull();
                        done();
                    })
                    .catch((err) => {
                        console.log(err);
                        done();
                    });
                }
            );
        });
    });

    describe("GET /users/sign_in", () => {

        it("should render a view with a sign in form", (done => {
            request.get(`${base}/sign_in`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain("Sign in");
                done();
            });
        }));
    })

    /*describe("GET /users/:id", () => {

        beforeEach((done) => {
  
            this.user;
   
            User.create({
                username: "starman1,",
                email: "starman@tesla.com",
                password: "Trekkie4lyfe"
            })
            .then((res) => {
                this.user = res;
                console.log(this.user.username);
                console.log(this.user.email);
            });
        });
    });*/
});