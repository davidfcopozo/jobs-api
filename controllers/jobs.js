const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllJobs = async (req, res) => {
  //Look for all of the jobs created by the user with the given id and sorted by createdAt
  const jobs = await Job.find({ createdBy: req.user.userId }).sort("createdAt");

  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

const getJob = async (req, res) => {
  const {
    //Destructure userId from user
    user: { userId },
    //Destructure jobId from params and name it jobId
    params: { id: jobId },
  } = req;

  //Find one job in the database with the given id (jobId), that was created by the user with the given id (userId)
  const job = await Job.findOne({ _id: jobId, createdBy: userId });

  if (!job) {
    console.log(`No job found with id ${jobId}`);
    throw new NotFoundError(`No job found with id ${jobId}`);
  }

  res.status(StatusCodes.OK).json({ job });
};

const createJob = async (req, res) => {
  //Creating the createdby porperty and adding the userId as its value
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

const updateJob = async (req, res) => {
  const {
    //Destructure company & position from body
    body: { company, position },
    //Destructure userId from user
    user: { userId },
    //Destructure jobId from params and name it jobId
    params: { id: jobId },
  } = req;

  if (company === "" || position === "") {
    console.log(`Company or positin fields cannot be empty`);
    throw new BadRequestError(`Company or positin fields cannot be empty`);
  }
  //findOneAndUpdate({filter values}, update values, {options})
  const job = await Job.findOneAndUpdate(
    { _id: jobId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!job) {
    throw new NotFoundError(`No job found with id ${jobId}`);
  }

  res.status(StatusCodes.OK).json({ job });
};

const deleteJob = async (req, res) => {
  const {
    //Destructure userId from user
    user: { userId },
    //Destructure jobId from params and name it jobId
    params: { id: jobId },
  } = req;
  const job = await Job.findOneAndRemove({ _id: jobId, createdBy: userId });

  if (!job) {
    throw new NotFoundError(`No job found with id ${jobId}`);
  }

  res.status(StatusCodes.OK).send();
};

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
};
