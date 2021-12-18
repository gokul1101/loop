const TestType = require("../models/testTypes");
const Question = require("../models/questions");
const {
  createMCQ,
  getMCQ,
  updateMCQ,
  getAllMcqWithQuizID,
  deleteMCQ,
} = require("../services/mcqService");
const {
  createChallenge,
  getChallenge,
  updateChallenge,
  getAllChallengesWithContestId,
} = require("../services/challengeService");
const createQuestion = async (req, res) => {
  let questionDetails = req.body;
  let functions = [createMCQ, createChallenge],
    index;
  if (questionDetails.type_id === "mcq") index = 0;
  else if (questionDetails.type_id === "problem") index = 1;
  try {
    questionDetails.type_id = (
      await TestType.findOne({ name: questionDetails.type_id })
    )._id;
    let { code, message, mcq } = await functions[index](questionDetails);
    if (mcq) return res.status(code).json({ message, mcq });
    res.status(code).send(message);
  } catch (err) {
    //! Error in creating question
    if (!err.code) {
      err.code = 500;
      err.message = `Internal server error`;
    }
    return res.status(err.code).json({ message: err.message });
  }
};
const getQuestion = async (req, res) => {
  let { type, id } = req.query;
  let functions = [getMCQ, getChallenge],
    index;
  if (type === "mcq") index = 0;
  else if (type === "problem") index = 1;
  try {
    let response = await functions[index](id, req.user.role);
    res.status(response.code).send(response);
  } catch (err) {
    //! Error in getting question
    if (!err.code) {
      err.code = 500;
      err.message = `Internal server Error`;
    }
    return res.status(err.code).send(err.message);
  }
};
const updateQuestion = async (req, res) => {
  let questionDetails = req.body;
  let { type } = req.query;
  let functions = [updateMCQ, updateChallenge],
    index;
  if (type === "mcq") index = 0;
  else if (type === "problem") index = 1;
  try {
    let response = await functions[index](questionDetails);
    res.status(response.code).send(response);
  } catch (err) {
    //! Error in updating question
    console.log(err);
    if (!err.code) {
      err.code = 500;
      err.message = `Internal server Error on updating mcqs`;
    }
    return res.status(err.code).send(err.message);
  }
};

const deleteQuestion = async (req, res) => {
  let questionDetails = req.body;
  let { type } = req.query;
  let functions = [deleteMCQ],
    index;
  if (type === "mcq") index = 0;
  else if (type === "problem") index = 1;
  try {
    let response = await functions[index](questionDetails);
    res.status(response.code).send(response);
  } catch (err) {
    //! Error in updating question
    console.log(err);
    if (!err.code) {
      err.code = 500;
      err.message = `Internal server Error on deleting mcqs`;
    }
    return res.status(err.code).send(err.message);
  }
};

const getAllMCQS = async (req, res) => {
  let { id, page = 1, limit } = req.query;
  let flag = req.user.role_id === "admin";
  limit = flag ? 10 : 1;
  try {
    const response = await getAllMcqWithQuizID(id, page, limit, flag);
    res.status(response.code).send(response);
  } catch (err) {
    //! Error in getting mcqs with quiz id
    if (!err.code) {
      err.code = 500;
      err.message = `Internal server Error on fetching mcqs`;
    }
    return res.status(err.code).send(err.message);
  }
};
const getAllChallenges = async (req, res) => {
  const { id } = req.query;
  try {
    const response = await getAllChallengesWithContestId(id);
    res.status(response.code).send(response);
  } catch (err) {
    //! Error in getting mcqs with quiz id
    if (!err.code) {
      err.code = 500;
      err.message = `Internal server Error on fetching mcqs`;
    }
    return res.status(err.code).send(err.message);
  }
};

module.exports = {
  createQuestion,
  getQuestion,
  updateQuestion,
  deleteQuestion,
  getAllMCQS,
  getAllChallenges,
};
