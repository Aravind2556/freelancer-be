const express = require('express')
const Jobs = require('../model/Jobs')
const Register = require('../model/Register')
const Categories = require('../model/Categories');
const isAdmin = require('../middleware/IsAdmin')
const session = require('express-session');
const { json } = require('body-parser');
const { findOne, deleteMany } = require('../model/Tickets');

const JobsRounter = express.Router();


JobsRounter.get('/testJobs', (req, res) => {
    try {
        return res.json({ success: true, message: "Api Testing successfully" })
    }
    catch (err) {
        console.log("Trouble Error to Testing Admin", err)
        return res.json({ success: false, message: "Trouble Error to testing admin so contac to admin" })
    }

})


// only craete job provider
JobsRounter.post('/Create_jobs', isAdmin, async (req, res) => {
    try {

        let Alljob = await Jobs.find({});
        let jobId;
        if (Alljob.length !== 0) {
            let lastJob = Alljob.slice(-1);
            jobId = lastJob[0].Id + 1;
        } else {
            jobId = 1;
        }

        const { Title, Description, Price, selectedJob } = req.body;
        const profileId = req.session.profile?.Id;
        if (!profileId) {
            return res.json({ success: false, message: "Please log in to create a job" });
        }
        if (Title && Description && Price && selectedJob) {

            const datacheck = await Categories.findOne({ Jobname: selectedJob });
            if (datacheck) {

                const newsave = new Jobs({
                    Id: jobId,
                    Title: Title,
                    Description: Description,
                    Price: Price,
                    CategoryId: datacheck.Id,
                    CreaterId: profileId,

                });

                const savedata = await newsave.save();
                if (savedata) {
                    return res.json({ success: true, message: "Job posted successfully" });
                }
                else {
                    return res.json({ success: false, message: "Failed to post job" });
                }
            } else {
                return res.json({ success: false, message: "Invalid job category" });
            }
        } else {
            return res.json({ success: false, message: "Missing required job details" });
        }
    } catch (err) {
        console.log("An error occurred while creating the job", err);
        return res.json({ success: false, message: "An error occurred while creating the job" });
    }
});

// all are accessing getting job
JobsRounter.get('/fetch-Jobs', isAdmin, async (req, res) => {
    try {
        const userSession = req.session.profile;
        if (!userSession) {
            return res.json({ success: false, message: "Please log in to access jobs" })
        }
        const userRole = userSession.Role;
        const userId = userSession.Id;

        let jobsDetails;

        if (userRole === "Company") {
            jobsDetails = await Jobs.find({ CreaterId: userId });
        }
        else {
            jobsDetails = await Jobs.find({});
        }if (jobsDetails) {
            return res.json({ success: true, message: "Jobs retrieved successfully", allJobs: jobsDetails });
        }
        else {
            return res.json({ success: false, message: "No jobs available" });
        }
    } catch (err) {
        console.error("An error occurred, please contact admin", err);
        return res.json({ success: false, message: "An error occurred, please contact admin" });
    }
});


// freelancer upadte whislist to jobproder jobs
JobsRounter.put('/update-data', isAdmin, async (req, res) => {
    try {
        const { providerid } = req.body
        const usersession = req.session.profile
        const userrole = usersession?.Role;
        const userid = usersession?.Id;
        let addbook;
        let isUsre = userrole === "Freelancer"
        if (!isUsre) {
            return res.json({ success: false, message: "you dont access only accessing to Freelance" })
        }
        const data = await Register.findOne({ Id: userid })
        console.log("Register data:", data)

        if (data) {

            const job = await Jobs.findOne({ Id: providerid })
            console.log("Job data:", job)

            if (job) {

                addbook = await Jobs.updateOne(
                    { Id: providerid },
                    { $addToSet: { Interests: userid } }
                );

                console.log("Update result:", addbook)


                if (addbook) {
                    return res.json({ success: true, message: "Bookmark update successful", mybooking: addbook });
                } else {
                    return res.json({ success: false, message: "Job already bookmarked or no change" });
                }
            } else {
                return res.json({ success: false, message: "Job not found" });
            }
        } else {
            return res.json({ success: false, message: "User not valid" });
        }
    } catch (err) {
        console.error("Error bookmarking job:", err);
        res.status(500).send({ message: "An error occurred while bookmarking the job." });
    }
});

//Company and admin delete this job
JobsRounter.delete('/delete', isAdmin, async (req, res) => {
    try {

        const { data } = req.body

        const isdelete = await Jobs.findOne({ Id: data })
        console.log("isdata", isdelete)
        if (isdelete) {
            const okdelete = await Jobs.deleteOne({ Id: isdelete.Id })
            if (okdelete) {
                return res.json({ success: true, message: "Job deleted successfully" })
            }
            else {
                return res.json({ success: false, message: "Failed to delete job" })
            }
        }
        else {
            return res.json({ success: false, message: "Invalid job ID" })
        }
    }
    catch (err) {
        console.log("Job deletion failed due to a server error", err)
        return res.json({ success: false, message: "Job deletion failed due to a server error" })
    }
})


JobsRounter.post('/fetch-job-deatils', isAdmin, async (req, res) => {
    try {
        const { selectedJob } = req.body
        console.log("selectedJob", selectedJob)
        if (selectedJob) {
            const jobsdata = await Jobs.findOne({ Id: selectedJob })
            if (jobsdata) {
                return res.json({ success: true, message: "Job details retrieved successfully", data: jobsdata })
            }
            else {
                return res.json({ success: false, message: "Job details not found, please try again" })
            }
        }
        else {
            return res.json({ success: false, message: "Job ID is missing in the request" })
        }
    }
    catch (err) {
        console.log("An error occurred, please contact admin", err)
        return res.json({ success: false, message: "An error occurred, please contact admin" })
    }
})

// completed
JobsRounter.get('/fetch-intreast', isAdmin, async (req, res) => {

    try {

        const fetchintest = await Jobs.find({})
        if (fetchintest) {
            return res.json({ success: true, message: "Interest data retrieved successfully", data: fetchintest })
        }
        else {
            return res.json({ success: false, message: "No interest data available" })
        }

    }
    catch (err) {

        console.log("An error occurred, please contact admin", err)
        return res.json({ success: false, message: "An error occurred, please contact admin" })

    }

})

// completed
JobsRounter.post('/fetch-intest', isAdmin, async (req, res) => {
    try {

        const { intrestdata } = req.body
        if (intrestdata) {
            const isintrest = await Register.findOne({ Id: intrestdata })
            if (isintrest) {
                return res.json({ success: true, message: "Interest data retrieved successfully", data: isintrest })
            }
            else {
                return res.json({ success: false, message: "Interest data not found" })
            }
        }
        else {
            return res.json({ success: false, message: "Invalid request data" })
        }
    }
    catch {
        console.log("An error occurred, please contact admin", err)
        return res.json({ success: false, message: "An error occurred, please contact admin" })
    }
})

// completed
JobsRounter.post('/fetch-update', isAdmin, async (req, res) => {
    try {

        const { data } = req.body
        console.log("requsting data for update id", data)
        if (data) {
            const dataid = await Jobs.findOne({ Id: data })
            if (dataid) {
                return res.json({ success: true, message: "Job data retrieved successfully", data: dataid })
            }
            else {
                return res.json({ success: false, message: "Job data not found" })
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


// completed
JobsRounter.put('/update-job', isAdmin, async (req, res) => {
    try {
        const { upadatedata } = req.body;
        if (upadatedata && upadatedata.Id) {
            const updateFields = {
                Description: upadatedata.Description,
                Price: upadatedata.Price,
                status: "Open",
                Interests: []
            };
            const updated = await Jobs.updateOne(
                { Id: upadatedata.Id },
                { $set: updateFields }
            );

            if (updated.modifiedCount > 0) {
                return res.json({ success: true, message: "Job details updated successfully. All freelancer interests have been removed." });
            } else {
                return res.json({ success: false, message: "No updates were made to the job details." });
            }
        } else {
            return res.json({ success: false, message: "Invalid job data provided. Please check the details and try again." });
        }
    } catch (err) {
        console.error("Error updating job:", err);
        return res.json({ success: false, message: "Unexpected error occurred while updating the job. Please try again later." });
    }
});

// completed
JobsRounter.post('/Passing-data', async (req, res) => {
    try {
        const { userid, jobid } = req.body;
        if (!userid || !jobid) {
            return res.json({ success: false, message: "User ID and Job ID are required. Please provide valid details." });
        }
        const jobData = await Jobs.findOne(
            { CreaterId: userid, Id: jobid },
        );
        if (jobData) {
            return res.json({ success: true, message: "Job details retrieved successfully.", data: jobData });
        } else {
            return res.json({ success: false, message: "No matching job found. Please check the User ID and Job ID." });
        }

    } catch (err) {
        console.error("Error fetching job data:", err);
        return res.json({ success: false, message: "An error occurred while fetching the job data" });
    }
});


// completed
JobsRounter.post('/assigning-to-freelancer', async (req, res) => {
    try {
        const { free, job } = req.body;
        if (!free || !job) {
            return res.json({ success: false, message: "Freelancer ID or Job ID is missing. Please provide valid details." });
        }

        const jobToAssign = await Jobs.findOne({ Id: job });
        const freelancer = await Register.findOne({ Id: free });

        if (!jobToAssign || !freelancer) {
            return res.json({ success: false, message: "Invalid Job or Freelancer ID. Please check the details and try again." });
        }

        // ✅ Assign freelancer, change status, and remove ALL Interests (array of numbers)
        const updateResult = await Jobs.updateOne(
            { Id: job },
            {
                $set: { AssignedTo: free, Status: "In-progress", Interests: [] } // ✅ Remove all interests (array of numbers)
            }
        );

        if (updateResult.modifiedCount > 0) {
            return res.json({ success: true, message: "Job has been successfully assigned, and all interests have been removed." });
        } else {
            return res.json({ success: false, message: "Assignment failed. The job status was not updated." });
        }
    } catch (err) {
        console.error("Error assigning job:", err.message);
        return res.json({ success: false, message: "An error occurred while assigning the job." });
    }
});


// completed to rating 
JobsRounter.post('/Rating-data', async (req, res) => {
    try {
        const { id, ratingValue, assinid } = req.body;
        const usersession = req.session.profile;
        let userid = usersession.Id;
        if (id && ratingValue) {
            const Raitngs = await Register.findOne({ Id: userid });
            if (Raitngs) {
                const newRating = await Register.updateOne(
                    { Id: assinid },
                    { $set: { Ratings: Number(ratingValue), CompletedJobs: id } }
                );
                if (newRating) {
                    const upadate = await Jobs.updateOne(
                        { Id: id },
                        { $set: { Status: "completed" } }
                    );
                    if (upadate) {
                        return res.json({ success: true, message: "Job successfully marked as completed." });
                    } else {
                        return res.json({ success: false, message: "Job status update pending. Please try again later." });
                    }
                } else {
                    return res.json({ success: false, message: "Failed to update rating. Please try again." });
                }
            } else {
                return res.json({ success: false, message: "User data not found. Please check your session." });
            }
        } else {
            return res.json({ success: false, message: "Invalid request. Job ID and rating value are required." });
        }
    } catch (err) {
        console.error("Error assigning job:", err.message);
        return res.json({ success: false, message: "An unexpected error occurred. Please try again later." });
    }
});


































module.exports = JobsRounter