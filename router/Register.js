const express = require('express')
const Register = require('../model/Register')
const Resetotp = require('../model/ResetOtp')
const OTPSending = require('../model/SendOtp')
const nodemailer = require('nodemailer');
const isAdmin = require('../middleware/IsAdmin');


const router = express.Router();


// API Testing 
router.get('/test', (req, res) => {
    try {
        return res.json({ success: true, message: "Api Testing successfully" })
    }
    catch (err) {
        console.log("Error occurred to API Testing:", err)
        return res.json({ success: false, message: "An error occurred during API testing.please try again" })
    }
})

// completed
router.post('/Create-OTP', async (req, res) => { // otp sending 
    try {
        let product = await OTPSending.find({})
        let id
        if (product.length !== 0) {
            let lastproduct = product.slice(-1)
            let last = lastproduct[0]
            id = last.Id + 1
        } else {
            id = 1
        }
        const { Email } = req.body

        const emailvalid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(Email)

        if (!emailvalid) {
            return res.send({ success: false, message: "Invalid email format. Please enter a valid email." })
        }

        console.log("email", Email)
        if (Email) {
            const user = await Register.findOne({ Email: Email })
            if (!user) {
                const otp = Math.random().toString(36).slice(-8)
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS
                    },
                })
                const message = {
                    from: "aravindaravind2556@gmail.com",
                    to: Email,
                    subject: "🔐 Verify Your Account - OTP Inside",
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
                            <h2 style="color: #2c3e50; text-align: center;">Welcome to Our Platform!</h2>
                            <p style="font-size: 16px; color: #333;">Dear User,</p>
                            <p style="font-size: 16px; color: #555;">
                                Thank you for signing up! To complete your registration, please use the **One-Time Password (OTP)** below:
                            </p>
                            <div style="text-align: center; margin: 20px 0;">
                                <span style="font-size: 22px; font-weight: bold; color: #e74c3c; padding: 10px 20px; border: 2px dashed #e74c3c; display: inline-block;">
                                    ${otp}
                                </span>
                            </div>
                            <p style="font-size: 16px; color: #555;">
                                This OTP is valid for **10 minutes**. Please do not share it with anyone for security reasons.
                            </p>
                            <p style="font-size: 16px; color: #555;">
                                If you did not request this, please ignore this email or contact support.
                            </p>
                            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                            <p style="text-align: center; font-size: 14px; color: #777;">
                                Regards,<br>
                                <strong>Your Support Team</strong>
                            </p>
                        </div>
                    `
                };
                transporter.sendMail(message, (err, info) => {
                    if (err) {
                        return res.json({ success: false, message: "OTP sending failed. Please check your email and try again." })
                    }
                    else {
                        const otpDoc = new OTPSending({
                            Id: id,
                            Email: Email,
                            Otp: otp,
                            createdAt: new Date()
                        })

                        const savedata = otpDoc.save()
                        if (savedata) {
                            return res.json({ success: true, message: "OTP has been successfully sent to your email.", Otp: savedata.Otp });
                        }
                        else {
                            return res.json({ success: false, message: "OTP generation failed. Please try again later." });
                        }
                    }

                })
            }

            else {
                return res.json({ success: false, message: "This email is already registered. Please proceed to login." })

            }
        }
        else {
            return res.json({ success: false, message: "Email is required. Please enter a valid email address." })

        }

    }
    catch (err) {
        console.log("Error occurred during OTP generation:", err)
        return res.json({ success: false, message: "Something went wrong while generating OTP. Please try again later." })
    }
})

// completed
router.post('/Create-Account', async (req, res) => {
    try {
        let product = await Register.find({})
        let id
        if (product.length !== 0) {
            let lastproduct = product.slice(-1)
            let last = lastproduct[0]
            id = last.Id + 1
        } else {
            id = 1
        }

        const { email, otp, name, phone, password, role, cpassword, qualification, skills, experience, linkedin, company } = req.body;
        console.log("Received Data:", email, otp, name, phone, password, role, qualification, skills, experience, linkedin, company);


        const fnameValid = /^[A-Z][a-zA-Z-' ]{0,49}$/.test(name)
        const phonenovalid = /^\d{10}$/.test(phone)
        const emailvalid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
        const passwordvalid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/.test(password)

        if (!fnameValid) {
            return res.send({ success: false, message: "Invalid first name please first letter should be upper case" })
        }
        if (!phonenovalid) {
            return res.send({ success: false, message: "should be 10 digite only" })
        }
        if (!emailvalid) {
            return res.send({ success: false, message: "Email should be correct formate" })
        }
        if (!passwordvalid) {
            return res.send({ success: false, message: "Invalid password please firts letter upper case and one lower case and differnt key and number then should be 8 letters" })
        }
        if (password !== cpassword) {
            return res.send({ success: false, message: "inalid password please should be both password match" })
        }

        if (email || otp || name || phone || password || role || qualification || skills || experience || linkedin || company) {
            const verifyemailtootp = await OTPSending.findOne({ Email: email, Otp: otp });
            if (verifyemailtootp) {
                console.log("User Details:", name, phone, password, role, qualification, skills, experience, linkedin, company);

                const saveverfiy = new Register({
                    Id: id,
                    Email: verifyemailtootp.Email,
                    Name: name,
                    Contact: phone,
                    Role: role,
                    Password: password,
                    Qualification: qualification,
                    Skills: skills,
                    Experience: experience,
                    Linkedin: linkedin,
                    Company: company
                })

                req.session.profile = {
                    Id: saveverfiy.Id,
                    Name: saveverfiy.Name,
                    Email: saveverfiy.Email,
                    Role: saveverfiy.Role,
                };
                try {
                    const oksave = await saveverfiy.save();
                    const predel = await OTPSending.deleteOne({ Email: oksave.Email });
                    if (predel) {
                        return res.json({ success: true, message: "Account created successfully! Welcome to our platform.", Role: saveverfiy.Role });
                    } else {
                        return res.json({ success: false, message: "Account created, but failed to remove temporary OTP data. Please contact support." });
                    }
                } catch (err) {
                    if (err.code === 11000 && err.keyPattern.Id) {

                        return res.json({ success: false, message: "Duplicate ID detected. Please try again." });
                    }
                    if (err.code === 11000 && err.keyPattern.Email) {
                        console.log("Duplicate Key Error for Email:", err.keyValue.Email);
                        return res.json({ success: false, message: "Duplicate email detected. Please try again." });
                    }
                    console.log("Error saving user:", err);
                    return res.json({ success: false, message: "Failed to save user data. Please try again later." });
                }
            } else {
                return res.json({ success: false, message: "Invalid email or OTP. Please check and try again." });
            }
        } else {
            return res.json({ success: false, message: "All fields (email, OTP, name, phone, password, role) are required." });
        }
    } catch (err) {
        console.log({ message: "Error occurred during OTP verification", err });
        return res.json({ success: false, message: "An error occurred during OTP verification. Please try again later." });
    }
});

// COMPLETED
router.post('/Login-User', async (req, res) => {
    try {
        const { email, password, userrole } = req.body
        const emailvalid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
        const passwordvalid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/.test(password)

        if (!emailvalid) {
            return res.json({ success: false, message: "Invalid email format. Please enter a valid email address." })
        }
        if (!passwordvalid) {
            return res.json({ success: false, message: "Invalid password please firts letter upper case and one lower case and differnt key and number then should be 8 letters" })
        }

        const isfindLogin = await Register.findOne({ Email: email })
        if (isfindLogin) {
            if (isfindLogin.Password === password) {
                if (isfindLogin.Role === userrole || isfindLogin.Role === "Admin") {
                    req.session.profile = isfindLogin
                    req.session.save(err => {
                        if (err) {

                        }
                        return res.json({ success: true, Role: isfindLogin.Role })
                    })
                }
                else {
                    return res.json({ success: false, message: "Access denied. Please log in with the correct user role." })
                }

            }
            else {
                return res.json({ success: false, message: "Incorrect password. Please try again." })
            }
        }
        else {
            return res.json({ success: false, message: "User not found. Please check your email and try again." })
        }
    }
    catch (err) {
        console.log("Error occurred during login:", err)
        return res.json({ success: false, message: "An unexpected error occurred. Please try again later or contact support." })
    }
})


// COMPLETED
router.get('/username', async (req, res) => {
    try {
        const isRegister = req.session.profile
        if (isRegister) {
            const isfindRegister = await Register.findOne({ Email: req.session.profile.Email })
            if (isRegister) {
                return res.json({ success: true, Name: isfindRegister.Name })
            }
            else {
                return res.json({ success: false, message: "User not found. Please log in again.", Name: "profile" })

            }
        }
        else {
            return res.json({ success: false, message: "Session expired or not found. Please log in.", Name: "profile" })
        }
    }
    catch (err) {
        console.log("Error retrieving user profile:", err)
        return res.json({ success: false, message: "An unexpected error occurred. Please contact support." })
    }
})

// COMPLETED
router.get('/checkauth', async (req, res) => {
    try {
        const isValidSession = req.session.profile
        if (isValidSession) {
            const fetchUser = await Register.findOne({ Email: req.session.profile.Email })
            if (fetchUser) {
                return res.json({ success: true, user: fetchUser })
            }
            else {
                return res.json({ success: false, message: "User not found. Please log in again." })
            }
        }
        else {
            return res.json({ success: false, message: "Session expired or not found. Please log in." })
        }
    }
    catch (err) {
        console.log("Error in checking authentication:", err);
        return res.json({ success: false, message: "An unexpected error occurred. Please contact support." });
    }
})

router.get('/logout', async (req, res) => {

    try {
        console.log("logout called:", req.session.profile)
        if (req.session.profile) {
            req.session.destroy(err => {
                if (err) {
                    return res.json({ success: false, message: "Failed to Logout!" })
                }
                return res.json({ success: true, message: "Logged out successfully!" })
            })
        }
        else {
            return res.json({ success: false, message: "Please login and try again!" })
        }
    }
    catch (err) {
        console.error("Error in logout:", err);
        return res.json({ success: false, message: "Internal server error, contact admin" });
    }
})


router.post('/reset', async (req, res) => {  // This is otp for user reset format
    try {
        let product = await Resetotp.find({})
        let id
        if (product.length !== 0) {
            let lastproduct = product.slice(-1)
            let last = lastproduct[0]
            id = last.Id + 1
        } else {
            id = 1
        }
        const { email } = req.body
        console.log("reset", email)
        if (email) {
            const user = await Register.findOne({ Email: email })
            if (user) {
                const otp = Math.random().toString(36).slice(-8)
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: process.env.EMAIL_USER,
                        pass: process.env.EMAIL_PASS
                    },
                })

                const message = {
                    from: "aravindaravind2556@gmail.com",
                    to: user.Email,
                    subject: "🔐 Verify Your Account - OTP Inside",
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
                            <h2 style="color: #2c3e50; text-align: center;">Welcome to Our Platform!</h2>
                            <p style="font-size: 16px; color: #333;">Dear User,</p>
                            <p style="font-size: 16px; color: #555;">
                                Thank you for forgot passowrd! To complete your reset password, please use the **One-Time Password (OTP)** below:
                            </p>
                            <div style="text-align: center; margin: 20px 0;">
                                <span style="font-size: 22px; font-weight: bold; color: #e74c3c; padding: 10px 20px; border: 2px dashed #e74c3c; display: inline-block;">
                                    ${otp}
                                </span>
                            </div>
                            <p style="font-size: 16px; color: #555;">
                                This OTP is valid for **10 minutes**. Please do not share it with anyone for security reasons.
                            </p>
                            <p style="font-size: 16px; color: #555;">
                                If you did not request this, please ignore this email or contact support.
                            </p>
                            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                            <p style="text-align: center; font-size: 14px; color: #777;">
                                Regards,<br>
                                <strong>Your Support Team</strong>
                            </p>
                        </div>
                    `
                };

                transporter.sendMail(message, (err, info) => {
                    if (err) {
                        return res.json({ success: false, message: "Failed to send OTP. Please try again later." })
                    }
                    else {
                        const otpDoc = new Resetotp({ Id: id, Email: email, Otp: otp, createdAt: new Date() })

                        const savedata = otpDoc.save()
                        if (savedata) {
                            return res.json({ success: true, message: "OTP sent successfully to your email address." });
                        }
                        else {
                            return res.json({ success: false, message: "Failed to save OTP. Please try again later." });
                        }
                    }
                })
            }
            else {
                return res.json({ success: false, message: "No user found with the provided email address." })
            }
        }
        else {
            console.log({ success: false, message: "Please provide a valid email address." })
        }
    }
    catch (err) {
        console.log("Error occurred during password reset request:", err)
        return res.json({ success: false, message: "An unexpected error occurred. Please try again later." })
    }
})


router.post('/forgetpassword', async (req, res) => { // This is otp for user forgot password
    try {
        const { otp, email, password } = req.body
        console.log("pas", otp, email, password)
        if (otp && email && password) {
            const veriyotp = await Resetotp.findOne({ Otp: otp, Email: email })
            if (veriyotp) {
                const vrei = await Register.findOne({ Email: veriyotp.Email })
                if (vrei) {

                    const upda = await Register.updateOne({ Email: vrei.Email }, { $set: { Password: password } })
                    if (upda) {
                        await Resetotp.deleteOne({ otp, email });
                        return res.json({ success: true, message: "Password updated successfully." })
                    }
                    else {
                        return res.json({ success: false, message: "Failed to update password. Please try again." })
                    }
                }
                else {
                    return res.json({ success: false, message: "No user found with the provided email address." })
                }
            }
            else {
                return res.json({ success: false, message: "Invalid OTP or email. Please check and try again." })
            }
        }
        else {
            return res.json({ success: false, message: "All fields (OTP, email, and password) are required." })
        }
    }
    catch (err) {
        console.log("Error occurred in forget password route:", err)
        return res.json({ message: "An error occurred while processing your request. Please try again later." })
    }
})

module.exports = router