import { isDate } from './../../../public/components/moment/moment.d';
import { Account } from './../../model/Account';
import { Router, Request, Response } from 'express';
import * as passport from 'passport'
import * as passportLocal from 'passport-local'
import * as passportFacebook from 'passport-facebook'
import * as passportGoogle from 'passport-google-oauth'
import UserService from '../../service/database/UserService'
import AccountService from '../../service/database/AccountService'
import * as moment from 'moment'

export default class AuthenticationController {

    public static route(router: Router) {
        var LocalStrategy = passportLocal.Strategy
        var FacebookStrategy = passportFacebook.Strategy
        var GoogleStrategy = passportGoogle.OAuth2Strategy
        var userService = new UserService()
        var accountService = new AccountService()

        passport.serializeUser(function (user, done) {
            done(null, user);
        });

        passport.deserializeUser(function (user, done) {
            done(null, user);
        });

        // Google auth

        passport.use(new GoogleStrategy({

            clientID: "1020708476756-46c35idcm2p8qluduub8nt8ud5ovf0o8.apps.googleusercontent.com",
            clientSecret: "97twbx13c7H2POqIhFk19_p_",
            callbackURL: "http://localhost:8012/auth/google/callback",
            //passReqToCallback: true
        },
            async function (token, refreshToken, profile, done) {
                    process.nextTick(async function () {
                        var id = profile.id
                        var user = await userService.findById(id)
                        if(user){
                            if(user.toJSON().Account.Banned)
                                return done(null, false);
                            else
                                return done(null, user)
                        }
                            
                        else{
                            var newUser : any = {}
                            newUser.UserId = id
                            newUser.FamilyName = profile.name.familyName
                            newUser.GivenName = profile.name.givenName
                            newUser.Gender = true
                            newUser.Birthday = moment()
                            var newAccount : any = {}
                            newAccount.Provider = "google"
                            newAccount.Allocated = false
                            newAccount.Banned = false
                            console.log(newUser)
                            var userModel = await userService.addUser(newUser)
                            newAccount.UserId = userModel.toJSON().UserId
                            newAccount.Password = '123456'
                            var accountModel = await accountService.addUser(newAccount)
                            return done(null,userModel)
                        }    
                })
            })
        )

        router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

        router.get('/auth/google/callback',
            passport.authenticate('google', { failureRedirect: '/dang-nhap', failureFlash: true, failureMessage: "Tài khoản đã bị cấm sử dụng" }),
            function (req, res) {
                let redirect = req.flash('redirectUrl')
                let method = req.flash('method')
                if (redirect.length != 0 && method.length != 0 && method[0] == 'get')
                    res.redirect(redirect[0]);
                else res.redirect('/trang-chinh');
            });


        // Facebook Auth
                
        passport.use(new FacebookStrategy({

            // pull in our app id and secret from our auth.js file
            clientID: "1932907536947425",
            clientSecret: "0fd7eb4a03ffd5f905bf1d128c329a87",
            callbackURL: "http://localhost:8012/auth/facebook/callback",
            display: 'popup'
            },

            // facebook will send back the token and profile
            async function (token, refreshToken, profile, done) {
                process.nextTick(async function () {
                    console.log(profile)
                    var id = profile.id
                    var user = await userService.findById(id)
                    if (user) {
                        if (user.toJSON().Account.Banned)
                            return done(null, false);
                        else
                            return done(null, user)
                    }

                    else {
                        var newUser: any = {}
                        newUser.UserId = id
                        newUser.FamilyName = profile.displayName || profile.name.familyName
                        newUser.GivenName = profile.name.givenName || ""
                        newUser.Gender = profile.gender || true
                        newUser.Birthday = moment()
                        var newAccount: any = {}
                        newAccount.Provider = "facebook"
                        newAccount.Allocated = false
                        newAccount.Banned = false
                        console.log(newUser)
                        var userModel = await userService.addUser(newUser)
                        newAccount.UserId = userModel.toJSON().UserId
                        newAccount.Password = '123456'
                        var accountModel = await accountService.addUser(newAccount)
                        return done(null, userModel)
                    }  
                })
            }))

        //router.get('/auth/facebook', passport.authenticate('facebook', { display: 'popup', scope: ['email','public_profile','user_friends'] }));

        router.get('/auth/facebook/callback',
            passport.authenticate('facebook', { failureRedirect: '/dang-nhap', failureFlash: true }),
            function (req, res) {
                let redirect = req.flash('redirectUrl')
                let method = req.flash('method')
                if (redirect.length != 0 && method.length != 0 && method[0] == 'get')
                    res.redirect(redirect[0]);
                else res.redirect('/trang-chinh');
            });


        // Local auth    

        passport.use(new LocalStrategy({
            passReqToCallback: true
        },
            async function (req, username, password, done) {
                var user = await userService.findById(username)
                if (!user)
                    return done(null, false, req.flash("loginMess","Tên đăng nhập không đúng"));
                else {
                    if (user.toJSON().Account.Password == password)
                        return done(null, user);
                    else
                        return done(null, false, req.flash("loginMess", "Sai mật khẩu"));
                }
        }));

        router.post('/dang-nhap',
            passport.authenticate('local', { failureRedirect: '/dang-nhap', failureFlash: true }),
            function (req, res) {
                let redirect = req.flash('redirectUrl')
                let method = req.flash('method')
                if (redirect.length != 0 && method.length != 0 && method[0] == 'get' )
                    res.redirect(redirect[0]);
                else res.redirect('/trang-chinh');
            });

        router.get('/dang-xuat',
            function (req, res) {
                req.logout();
                res.redirect('/trang-chinh');
            }
        );



        router.get("/dang-nhap", function(req: Request, res: Response) {
            if(req.isAuthenticated())
                res.redirect('/trang-chinh')
            else{
                res.render("../module/authentication/login", {
                    message: req.flash("loginMess"),
                    authMess: req.session.messages || []
                });
                req.session.messages = []
            }
                        
        });

        router.get("/admin", async function (req: Request, res: Response) {
            var user = await userService.findById("admin")
            if (!user) {
                var newUser: any = {}
                newUser.UserId = "admin"
                newUser.FamilyName = "Bkan"
                newUser.GivenName = "Team"
                newUser.Gender = true
                newUser.Birthday = moment()
                var newAccount: any = {}
                newAccount.Provider = "allocated"
                newAccount.Allocated = false
                newAccount.Banned = false
                var userModel = await userService.addUser(newUser)
                newAccount.UserId = userModel.toJSON().UserId
                newAccount.Password = '123456'
                var accountModel = await accountService.addUser(newAccount)
                res.json({ message: "Tài khoản khởi tạo thành công id : admin , pass : 123456" })
            }else{
                res.json({message : "Tài khoản đã được khởi tạo"})
            }
            
        });
        
    }

    
}