const express = require('express')
const Categories = require('../model/Categories')
const Register = require('../model/Register')
const isAdmin = require('../middleware/IsAdmin')
const session = require('express-session');



const AdminRounter = express.Router();

AdminRounter.get('/testadmin', (req, res) => {
    try {
        return res.json({ success: true, message: "Api Testing successfully" })
    }
    catch (err) {
        console.log("Trouble Error to Testing Admin", err)
        return res.json({ success: false, message: "Trouble Error to testing admin so contac to admin" })
    }

})


// completed

AdminRounter.get('/getcata', isAdmin, async (req, res) => {
    try {
        const getcata = await Categories.find({})
        if (getcata) {
            return res.json({ success: true, message: "Categories retrieved successfully", catagories: getcata })
        }
        else {
            return res.json({ success: false, message: "Failed to retrieve categories" })
        }

    }
    catch (err) {
        console.log("An error occurred, please contact admin", err)
        return res.json({ success: false, message: "An error occurred, please contact admin" })
    }
})

//completed
AdminRounter.post('/Users-data', isAdmin, async (req, res) => {
    try {
        const { selectedUser } = req.body
        if (selectedUser) {
            if (selectedUser.all) {
                const users = await Register.find({})
                if (users) {
                    return res.json({ success: true, message: "All users retrieved successfully", data: users })
                }
                else {
                    return res.json({ success: false, message: "Failed to retrieve user data" })
                }
            }
            else if (selectedUser.freelacer) {
                const freeusre = await Register.find({ Role: selectedUser.freelacer })
                if (freeusre) {
                    return res.json({ success: true, message: "Freelancers retrieved successfully", data: freeusre })
                }
                else {
                    return res.json({ success: false, message: "No freelancer data found" })
                }
            }
            else if (selectedUser.jobprovider) {
                const prousre = await Register.find({ Role: selectedUser.jobprovider })
                if (prousre) {
                    return res.json({ success: true, message: "Company users retrieved successfully", data: prousre })
                }
                else {
                    return res.json({ success: false, message: "No job provider data found" })
                }

            }
            else if (selectedUser.admin) {
                const Adusre = await Register.find({ Role: selectedUser.admin })
                if (Adusre) {
                    return res.json({ success: true, message: "Admins users retrieved successfully", data: Adusre })
                }
                else {
                    return res.json({ success: false, message: "No admin data found" })
                }

            }
            else {
                res.json({ success: false, message: "User role not found" })
            }
        }
        else {

            return res.json({ success: false, message: "Invalid request data" })

        }

    }
    catch (err) {
        console.log("An error occurred, please contact admin", err)
        return res.json({ success: false, message: "An error occurred, please contact admin" })

    }
})

//completed
AdminRounter.post('/aloneusers', isAdmin, async (req, res) => {
    try {
        const { data } = req.body
        if (data) {
            const aloneid = await Register.findOne({ Id: data })
            if (aloneid) {
                return res.json({ success: true, message: "User data retrieved successfully", data: aloneid })
            }
            else {
                return res.json({ success: false, message: "User data not found" })
            }
        }
        else {
            return res.json({ success: false, message: "Invalid request data" })
        }

    }
    catch (err) {
        console.log("An error occurred, please contact admin", err)
        return res.json({ success: false, message: "An error occurred, please contact admin" })

    }
})


//complete
AdminRounter.post('/Updata-id', isAdmin, async (req, res) => {
    try {
        const { data } = req.body
        if (data) {
            const dataid = await Register.findOne({ Id: data })
            if (dataid) {
                return res.json({ success: true, data: dataid })
            }
            else {
                return res.json({ success: false, message: "Data not found" })
            }
        }
        else {
            return res.json({ success: false, message: "Failed to fetch data" })
        }
    }
    catch (err) {
        console.log("An error occurred while fetching data", err)
        return res.json({ success: false, message: "An error occurred while fetching data" })
    }
})

// complete
AdminRounter.put('/Update-user-in-admin', isAdmin, async (req, res) => {
    try {
        const { data } = req.body
        if (data && data.Id) {
            // Find the document by Id
            const existingJob = await Register.findOne({ Id: data.Id });

            if (existingJob) {
                // Update specific fields
                const updated = await Register.updateOne(
                    { Id: data.Id }, // Filter by Id
                    {
                        $set: {
                            Name: data.Name,
                            Contact: data.Contact,
                            Email: data.Email,
                            Password: data.Password
                        }
                    }
                );

                if (updated) {
                    return res.json({ success: true, message: "User data updated successfully" });
                } else {
                    return res.json({ success: false, message: "No updates were made" });
                }
            } else {
                return res.json({ success: false, message: "User not found" });
            }
        } else {
            return res.json({ success: false, message: "Invalid user data provided" });
        }

    }
    catch (err) {
        console.log("An error occurred, please contact admin", err)
        return res.json({ success: false, message: "An error occurred, please contact admin" })

    }

})

// deleteuserdatainadmin

AdminRounter.delete('/deleteuserdatainadmin', isAdmin, async (req, res) => {
    try {

        const { data } = req.body

        const isdelete = await Register.findOne({ Id: data })
        console.log("isdata", isdelete)
        if (isdelete) {
            const okdelete = await Register.deleteOne({ Id: isdelete.Id })
            if (okdelete) {
                return res.json({ success: true, message: "User data deleted successfully" })
            }
            else {
                return res.json({ success: false, message: "Failed to delete user data" })
            }
        }
        else {
            return res.json({ success: false, message: "Invalid user ID" })
        }
    }
    catch (err) {
        console.log("User data deletion failed due to a server error", err)
        return res.json({ success: false, message: "User data deletion failed due to a server error" })
    }
})


// The Api end point is Create categories ffor job provider  // complete
AdminRounter.post('/categories', isAdmin, async (req, res) => {
    try {
        let product = await Categories.find({});
        let id;
        if (product.length !== 0) {
            let lastproduct = product.slice(-1);
            let last = lastproduct[0];
            id = last.Id + 1;
        } else {
            id = 1;
        }
        const { jobname, jobdescription } = req.body;
        if (jobname && jobdescription) {
            const isfield = await Categories.findOne({ Jobname: jobname });
            if (isfield) {
                return res.json({ success: false, message: "Category already exists." });
            } else {
                const newcatgories = new Categories({
                    Id: id,
                    Jobname: jobname,
                    Jobdescription: jobdescription
                });

                const savecatgories = await newcatgories.save();

                if (savecatgories) {
                    return res.json({ success: true, message: "Category saved successfully." });
                } else {
                    return res.json({ success: false, message: "Failed to save category." });
                }
            }
        } else {

            return res.json({ success: false, message: "Invalid input. Job name and description are required." });
        }
    } catch (err) {
        console.log("Error coming to categories", err);
        return res.json({ success: false, message: "An error occurred while saving the category." });
    }
});


// The Api end point is fetch all categories   // complete
AdminRounter.get('/fetch-categories', isAdmin, async (req, res) => {
    try {
        const fetchCategoriesID = await Categories.find({});
        if (fetchCategoriesID) {
            return res.json({ success: true, data: fetchCategoriesID });
        } else {
            return res.json({ success: false, message: "No categories found. Please try again later." });
        }
    } catch (err) {
        console.log("error fetch to categories", err);
        return res.json({ success: false, message: "Failed to fetch categories due to a server error." });
    }
});


// The Api end point is to delete Categoriesid  //complete
AdminRounter.post('/categories-delete', async (req, res) => {
    try {
        const { id } = req.body;
        if (id) {
            const isCategoriesid = await Categories.findOne({ Id: id });
            if (isCategoriesid) {
                const okdelete = await Categories.deleteOne({ Id: isCategoriesid.Id });
                if (okdelete.deletedCount > 0) {
                    return res.json({ success: true, message: "Category successfully removed" });
                } else {
                    return res.json({ success: false, message: "Unable to remove category" });
                }
            } else {
                return res.json({ success: false, message: "Category ID not found" });
            }
        } else {
            return res.json({ success: false, message: "Please provide a category ID" });
        }
    } catch (err) {
        console.log("An error occurred while removing the category", err);
        return res.json({ success: false, message: "An error occurred while removing the category" });
    }
});



module.exports = AdminRounter